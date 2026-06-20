import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { ANTI_SLOP_PREAMBLE, sanitizeInput, auditToContext, extractJson, AuditResult } from '@/lib/audit-context';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are the AuditGPT Strategy Engine. You convert audit findings into a 12-week tactical plan. Every task cites a specific gap from the audit and a hardcoded industry benchmark when relevant. No fluff, no metaphors.

${ANTI_SLOP_PREAMBLE}

## TASK
Using the AUDIT DATA below, build a 12-week marketing strategy.

Constraints:
- Each week must contain exactly 1 concrete action, 1 measurable metric, and 1 expected outcome.
- Each action must be derived from a specific audit finding (red flag, website fix, or assumption to test).
- Cite the relevant industry benchmark wherever a metric is missing (e.g., "SaaS benchmark CAC $200-400").
- If the audit lacks data for a metric, write "insufficient data" but still include the benchmark.
- No vague tasks. Write actual copy examples or exact numbers when possible (e.g., "Cold email 50 ICP prospects using template: 'Saw you ship X — quick question about Y'").
- For "new" path businesses with no data, generate 12 weeks of early-stage validation tasks (customer discovery calls, landing page launch, competitor analysis). Use "insufficient data" heavily. The objective line should read something like "Validate problem/solution fit by reaching 20 customer interviews before building any feature."

Return JSON with this EXACT structure:
{
  "overall_objective": "e.g., 'Achieve first 100 paying customers at <\$200 CAC (SaaS benchmark).' Must include a number or benchmark from the relevant industry.",
  "weeks": [
    {
      "week": 1,
      "action": "Concrete task, e.g., 'Install PostHog, set conversion event as Signup, capture baseline.'",
      "metric": "e.g., 'Baseline conversion rate (current: insufficient data). Industry avg 1-3% (ecommerce)'",
      "expected_outcome": "e.g., 'Data pipeline ready; a number exists for next week's comparison.'"
    }
  ]
}

Rules:
- weeks: array of EXACTLY 12 objects (week numbers 1 through 12).
- Each object must have all 3 keys: action, metric, expected_outcome — all non-empty strings.
- Every metric must mention either an actual figure from the audit OR "insufficient data" + the hardcoded benchmark.
- No banned phrases anywhere.
- Sequence tasks logically: install analytics first → fix biggest red flags → validate assumptions → scale channels.

Output ONLY the JSON object. No markdown fences. No preamble.`;

export async function POST(req: NextRequest) {
  try {
    // ── SERVER-SIDE PAYWALL ──────────────────────────────────────────
    const { getActiveSubscription } = await import('@/lib/subscription');
    const subscription = await getActiveSubscription();
    if (!subscription) {
      return NextResponse.json(
        {
          error: 'Pro subscription required.',
          code: 'SUBSCRIPTION_REQUIRED',
          upgradeUrl: '/pricing',
        },
        { status: 402 }
      );
    }

    const body = await req.json();
    const audit: AuditResult = body.audit;
    const focusNotes: string = sanitizeInput(body.focusNotes || '', 500);

    if (!audit || !audit.verdict) {
      return NextResponse.json(
        { error: 'Valid audit JSON is required.' },
        { status: 400 }
      );
    }

    const userPrompt = `Generate the 12-week strategy now.

AUDIT DATA:
${auditToContext(audit)}

${focusNotes ? `FOCUS NOTES:\n${focusNotes}` : ''}

Output JSON only. Exactly 12 weeks.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    });

    const raw = extractJson(completion.choices[0]?.message?.content || '');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('Strategy JSON parse failed. Raw (first 500):', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'Strategy generation failed. Try again.', rawPreview: raw.slice(0, 300) },
        { status: 502 }
      );
    }

    // Server-side schema validation
    if (!parsed.overall_objective || typeof parsed.overall_objective !== 'string') {
      return NextResponse.json({ error: 'Invalid overall_objective.' }, { status: 502 });
    }
    if (!Array.isArray(parsed.weeks) || parsed.weeks.length !== 12) {
      return NextResponse.json({ error: 'Weeks must be an array of exactly 12 objects.' }, { status: 502 });
    }
    for (let i = 0; i < 12; i++) {
      const w = parsed.weeks[i];
      if (!w || typeof w !== 'object') {
        return NextResponse.json({ error: `Week ${i + 1} missing.` }, { status: 502 });
      }
      if (typeof w.action !== 'string' || !w.action) {
        return NextResponse.json({ error: `Week ${i + 1} action missing.` }, { status: 502 });
      }
      if (typeof w.metric !== 'string' || !w.metric) {
        return NextResponse.json({ error: `Week ${i + 1} metric missing.` }, { status: 502 });
      }
      if (typeof w.expected_outcome !== 'string' || !w.expected_outcome) {
        return NextResponse.json({ error: `Week ${i + 1} expected_outcome missing.` }, { status: 502 });
      }
      // Ensure week number is correct
      w.week = i + 1;
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Strategy API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Strategy generation failed.' },
      { status: 500 }
    );
  }
}
