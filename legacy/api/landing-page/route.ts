import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { ANTI_SLOP_PREAMBLE, sanitizeInput, auditToContext, extractJson, AuditResult } from '@/lib/audit-context';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are the AuditGPT Launch Copywriter. You write landing pages using ONLY facts from the provided audit data. You never hallucinate a number, statistic, or customer quote. You never use banned phrases. Output must be valid JSON conforming to the exact schema below.

${ANTI_SLOP_PREAMBLE}

## TASK
Generate a 1-page landing page for the business described in the AUDIT DATA below.

Constraints:
- Every sentence must contain a fact (number, name, benchmark, or comparison from the audit/scrape).
- If no fact is available for a field, write "insufficient data" for that string.
- Max 2 sentences per section body.
- No banned phrases (especially "Learn More" as CTA).
- For "new" path businesses (no website), use only the founder's own words from the audit. Label guesses as "insufficient data". Generate a minimal landing page focused on the problem and a waitlist CTA.

Return JSON with this EXACT structure:
{
  "headline": "1 sentence. Must include a specific number or unique mechanism from the business.",
  "subheadline": "1 sentence. Target audience + primary outcome.",
  "sections": [
    {
      "title": "Section title (e.g., 'Why Now', 'How It Works')",
      "body": "2 fact-packed sentences max."
    }
  ],
  "cta_text": "Specific action text (e.g., 'Start Free Trial', 'Book a Demo'). Never use 'Learn More'.",
  "social_proof_line": "A statistic from the audit data, e.g., 'Used by 50% of Fortune 100'. If no statistic exists, output 'insufficient data'."
}

Rules:
- sections: array of 2-4 objects; each title and body required.
- cta_text: must not be "Learn More" (case-insensitive).
- social_proof_line: if the audit contains a concrete number (e.g., "$1.9T", "150K+"), it must appear; otherwise literal "insufficient data".

Output ONLY the JSON object. No markdown fences. No preamble.`;

export async function POST(req: NextRequest) {
  try {
    // ── SERVER-SIDE PAYWALL ──────────────────────────────────────────
    // Pro plan ($49/mo) or higher required. Without this check, anyone
    // with curl bypasses the React UI paywall and gets the paid product free.
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

    const userPrompt = `Generate the landing page now.

AUDIT DATA:
${auditToContext(audit)}

${focusNotes ? `FOCUS NOTES:\n${focusNotes}` : ''}

Output JSON only.`;

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
      console.error('Landing page JSON parse failed. Raw (first 500):', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'Landing page generation failed. Try again.', rawPreview: raw.slice(0, 300) },
        { status: 502 }
      );
    }

    // Server-side schema validation per spec
    if (!parsed.headline || typeof parsed.headline !== 'string') {
      return NextResponse.json({ error: 'Invalid headline in generated output.' }, { status: 502 });
    }
    if (!parsed.subheadline || typeof parsed.subheadline !== 'string') {
      return NextResponse.json({ error: 'Invalid subheadline in generated output.' }, { status: 502 });
    }
    if (!Array.isArray(parsed.sections) || parsed.sections.length < 2 || parsed.sections.length > 4) {
      return NextResponse.json({ error: 'Sections must be an array of 2-4 objects.' }, { status: 502 });
    }
    if (!parsed.cta_text || typeof parsed.cta_text !== 'string') {
      return NextResponse.json({ error: 'Invalid CTA text.' }, { status: 502 });
    }
    if (parsed.cta_text.toLowerCase().trim() === 'learn more') {
      parsed.cta_text = 'Start Free Trial'; // enforce ban
    }
    if (!parsed.social_proof_line || typeof parsed.social_proof_line !== 'string') {
      parsed.social_proof_line = 'insufficient data';
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Landing page API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Landing page generation failed.' },
      { status: 500 }
    );
  }
}
