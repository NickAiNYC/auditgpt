import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { ANTI_SLOP_PREAMBLE, sanitizeInput, auditToContext, extractJson, AuditResult } from '@/lib/audit-context';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are the AuditGPT Rebuild Engine. The website described in the AUDIT DATA below is AI-generated slop. Your job: rebuild a one-page landing page from scratch that is fact-backed, anti-slop, and honest. Never replicate any phrasing from the original slop.

${ANTI_SLOP_PREAMBLE}

## TASK
Rebuild the landing page. The current copy is AI-generated slop - it may contain fabricated statistics, empty claims, or no real business substance.

Constraints:
- Use ONLY the founder's actual inputs (focus_notes), the scraped domain name, and industry benchmarks.
- NEVER replicate any phrasing from the original slop. Start every sentence from scratch.
- If no real data exists for a field, write "insufficient data" as the placeholder.
- This page must be ready to launch immediately - real copy a human could ship today.
- For "new" path (no website yet, nothing to rebuild), behave like the normal landing page generator but use only the founder's pitch as the fact source.
- Every headline must anchor to a specific fact: a real scraped metric, a named customer, a verifiable industry benchmark, or an honest "insufficient data" admission. No fluff.
- Every section body must contain 2 sentences, each with a fact.
- Banned CTA text: "Learn More" (case-insensitive). Use specific action text.

Return JSON with this EXACT structure:
{
  "headline": "1 sentence. Must include a specific number, named customer, or unique mechanism. If none available, write: 'No verifiable metric available - [domain] needs to publish real numbers.'",
  "subheadline": "1 sentence. Target audience + primary outcome.",
  "sections": [
    {
      "title": "Section title (e.g., 'The Problem', 'How It Works', 'Pricing', 'Contact')",
      "body": "2 fact-packed sentences max. If no fact, write 'insufficient data'."
    }
  ],
  "cta_text": "Specific action text. Never 'Learn More'. For slop rebuilds, prefer 'See Pricing', 'Book a Demo', 'Start Free Trial', 'Get the Audit', or 'Talk to Us'.",
  "social_proof_line": "A statistic from the audit, e.g., 'Used by 50% of Fortune 100'. If no statistic exists, output 'insufficient data'.",
  "rebuild_notes": [
    "Brief note about what was changed vs the original slop, e.g., 'Removed fabricated \"trusted by 10,000+ businesses\" claim - no case studies found in scrape.' 3-5 notes, each a single sentence."
  ]
}

Rules:
- sections: array of 3-5 objects.
- rebuild_notes: required, 3-5 items explaining what was removed or corrected.

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

    const userPrompt = `Rebuild the landing page now. The original is AI slop. Start from scratch using only verified facts.

AUDIT DATA:
${auditToContext(audit)}

${focusNotes ? `FOUNDER NOTES (use these as primary fact source if available):\n${focusNotes}` : ''}

Output JSON only. Include rebuild_notes explaining what was removed vs the original slop.`;

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
      console.error('Rebuild JSON parse failed. Raw (first 500):', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'Rebuild generation failed. Try again.', rawPreview: raw.slice(0, 300) },
        { status: 502 }
      );
    }

    // Server-side schema validation
    if (!parsed.headline || typeof parsed.headline !== 'string') {
      return NextResponse.json({ error: 'Invalid headline.' }, { status: 502 });
    }
    if (!parsed.subheadline || typeof parsed.subheadline !== 'string') {
      return NextResponse.json({ error: 'Invalid subheadline.' }, { status: 502 });
    }
    if (!Array.isArray(parsed.sections) || parsed.sections.length < 3 || parsed.sections.length > 5) {
      return NextResponse.json({ error: 'Sections must be an array of 3-5 objects.' }, { status: 502 });
    }
    if (!parsed.cta_text || typeof parsed.cta_text !== 'string') {
      return NextResponse.json({ error: 'Invalid CTA text.' }, { status: 502 });
    }
    if (parsed.cta_text.toLowerCase().trim() === 'learn more') {
      parsed.cta_text = 'See Pricing';
    }
    if (!parsed.social_proof_line || typeof parsed.social_proof_line !== 'string') {
      parsed.social_proof_line = 'insufficient data';
    }
    if (!Array.isArray(parsed.rebuild_notes) || parsed.rebuild_notes.length < 3) {
      parsed.rebuild_notes = ['Rebuild notes unavailable - insufficient data on what was changed.'];
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Rebuild API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Rebuild failed.' },
      { status: 500 }
    );
  }
}
