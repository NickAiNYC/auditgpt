import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { getActiveSubscription } from '@/lib/subscription';
import { db } from '@/lib/db';
import { ANTI_SLOP_PREAMBLE, sanitizeInput, extractJson, AuditResult } from '@/lib/audit-context';

export const runtime = 'nodejs';
export const maxDuration = 60;

const AD_COPY_SYSTEM_PROMPT = `You are the AuditGPT Ad Copy Agent, a scheduled autonomous worker for a specific business.
Your job: produce 3 new ad variants for a given channel using ONLY the verified facts from the business's latest audit data.
You never hallucinate. You never use banned phrases.

${ANTI_SLOP_PREAMBLE}

## TASK
Generate 3 ad variants for the specified channel. Each variant must be fact-backed.

Constraints:
- Each ad variant must contain a headline, body (max 2 sentences), and CTA.
- Every claim must be traceable to the audit's scraped data, hardcoded benchmarks, or real-world signals.
- If a fact is not in the audit, use "insufficient data" in its place; do not invent.
- Banned CTA text: "Learn More" (case-insensitive). Use specific action text.
- Vary the angle each week based on the provided theme.
- Output MUST be valid JSON exactly matching the schema below.

Return JSON:
{
  "channel": "facebook|google|linkedin",
  "theme": "the weekly theme",
  "variants": [
    {
      "headline": "1 sentence. Must include a specific number or named customer from the audit.",
      "body": "Max 2 sentences, each with a fact.",
      "cta": "Specific action text. Never 'Learn More'.",
      "source_fact": "The exact audit line or benchmark used to anchor this ad."
    }
  ]
}

Output ONLY the JSON object. No markdown fences. No preamble.`;

// Weekly theme rotation — cycles through 4 angles
const WEEKLY_THEMES = [
  'social proof (cite customer names, counts, or case studies)',
  'pain point (cite a specific gap or red flag from the audit)',
  'unique metric (cite a specific number that differentiates the business)',
  'integration or speed (cite a specific technical or operational advantage)',
];

function getWeekNumber(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = (d.getTime() - start.getTime()) / 86400000;
  return Math.ceil((diff + start.getDay() + 1) / 7);
}

interface RunAdCopyBody {
  agentConfigId?: string;
  // Direct mode: pass audit + channel directly (no pre-existing config)
  audit?: AuditResult;
  channel?: string;
  theme?: string;
}

export async function POST(req: NextRequest) {
  try {
    // ── PAYWALL: Agent plan required ────────────────────────────────
    const subscription = await getActiveSubscription();
    if (!subscription) {
      return NextResponse.json(
        { error: 'Agent subscription required.', code: 'SUBSCRIPTION_REQUIRED', upgradeUrl: '/pricing' },
        { status: 402 }
      );
    }
    if (subscription.plan !== 'agent') {
      return NextResponse.json(
        { error: 'Agent plan ($99/mo) required for custom agents.', code: 'AGENT_PLAN_REQUIRED', upgradeUrl: '/pricing' },
        { status: 403 }
      );
    }

    const body = (await req.json()) as RunAdCopyBody;

    let audit: AuditResult | null = null;
    let channel = body.channel || 'facebook';
    let agentConfigId: string | null = null;

    // Get the user ID from the session — never fall back to subscription.id
    // (that would write AgentRun rows against the wrong entity).
    const { getCurrentUserId } = await import('@/lib/subscription');
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Mode 1: Run from an existing agent config
    if (body.agentConfigId) {
      const config = await db.agentConfig.findUnique({
        where: { id: body.agentConfigId },
        include: { audit: true },
      });
      if (!config || config.userId !== userId) {
        return NextResponse.json({ error: 'Agent config not found' }, { status: 404 });
      }
      audit = JSON.parse(config.audit.auditJson) as AuditResult;
      const configData = JSON.parse(config.config);
      channel = configData.channels?.[0] || 'facebook';
      agentConfigId = config.id;
    } else if (body.audit) {
      // Mode 2: Direct mode — audit passed in from the dashboard
      audit = body.audit;
    } else {
      return NextResponse.json(
        { error: 'Either agentConfigId or audit must be provided' },
        { status: 400 }
      );
    }

    // Determine theme (rotates weekly, or use provided theme)
    const weekNum = getWeekNumber(new Date());
    const theme = body.theme || WEEKLY_THEMES[weekNum % WEEKLY_THEMES.length];

    // Build a condensed audit summary for the prompt
    const auditSummary = {
      verdict: audit.verdict,
      score: audit.score,
      grade_stamp: audit.grade_stamp,
      company_name: audit.company_name,
      company_info: audit.company_info,
      report_card: audit.report_card,
      red_flags: audit.red_flags,
      industry_benchmarks_table: audit.industry_benchmarks_table,
      competitor_analysis: audit.competitor_analysis,
    };

    const userPrompt = `Generate 3 ad variants now.

BUSINESS AUDIT SUMMARY:
${JSON.stringify(auditSummary, null, 2)}

CHANNEL: ${channel}
WEEKLY THEME: ${theme}

Output JSON only. 3 variants, each with a source_fact citing the audit line used.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: AD_COPY_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    });

    const raw = extractJson(completion.choices[0]?.message?.content || '');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: 'Ad copy generation failed. Try again.' },
        { status: 502 }
      );
    }

    // Validate
    if (!parsed.variants || !Array.isArray(parsed.variants) || parsed.variants.length < 1) {
      return NextResponse.json({ error: 'Invalid ad copy output' }, { status: 502 });
    }
    // Enforce CTA ban
    parsed.variants = parsed.variants.map((v: any) => ({
      headline: String(v.headline || 'insufficient data').slice(0, 200),
      body: String(v.body || 'insufficient data').slice(0, 400),
      cta: String(v.cta || 'Get Started').toLowerCase().trim() === 'learn more'
        ? 'See Pricing'
        : String(v.cta || 'Get Started').slice(0, 100),
      source_fact: String(v.source_fact || 'insufficient data').slice(0, 400),
    }));

    // Save the run to DB (if we have a config)
    let runId: string | null = null;
    if (agentConfigId) {
      const run = await db.agentRun.create({
        data: {
          agentConfigId,
          userId,
          output: JSON.stringify(parsed),
          triggered: 'manual',
        },
      });
      runId = run.id;
    }

    return NextResponse.json({
      ...parsed,
      runId,
      agentConfigId,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Ad copy agent error:', err);
    return NextResponse.json(
      { error: err?.message || 'Agent run failed' },
      { status: 500 }
    );
  }
}
