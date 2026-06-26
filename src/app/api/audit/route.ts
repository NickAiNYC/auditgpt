import { NextRequest, NextResponse } from 'next/server';
import { runAuditPipeline } from '@/lib/audit-pipeline';
import { sanitizeInput } from '@/lib/audit-context';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface AuditInput {
  auditType?: string;
  websiteUrl?: string;
  companyName?: string;
  industry?: string;
  companyType?: string;
  focusNotes?: string;
  email?: string;
  path?: 'new' | 'grow';
  website?: string;
  answer?: string;
  inputType?: string;
  transcript?: string;
}

function normalizeInput(body: AuditInput): {
  auditType: string;
  websiteUrl: string;
  companyName?: string;
  industry?: string;
  companyType?: string;
  focusNotes?: string;
  inputType?: string;
  transcript?: string;
} {
  if (body.auditType && body.websiteUrl) {
    return {
      auditType: body.auditType,
      websiteUrl: body.websiteUrl,
      companyName: body.companyName,
      industry: body.industry,
      companyType: body.companyType,
      focusNotes: body.focusNotes,
      inputType: body.inputType,
      transcript: body.transcript,
    };
  }

  const websiteUrl = body.websiteUrl || body.website || '';
  let industry: string | undefined;
  let focusNotes: string | undefined;
  if (body.answer) {
    const parts = body.answer.split(' — ');
    industry = parts[0] || undefined;
    focusNotes = parts.slice(1).join(' — ') || undefined;
  }
  return {
    auditType: 'starter',
    websiteUrl,
    industry,
    focusNotes,
    inputType: body.inputType,
    transcript: body.transcript,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { rateLimitOrReject, cleanupExpiredBuckets } = await import('@/lib/rate-limit');
    const { getActiveSubscription } = await import('@/lib/subscription');
    cleanupExpiredBuckets();
    const subscription = await getActiveSubscription();
    // const rateLimitResponse = rateLimitOrReject(req, !!subscription);
    // if (rateLimitResponse) return rateLimitResponse;

    const body = (await req.json()) as AuditInput;
    const input = normalizeInput(body);

    if (input.inputType === 'agent_transcript') {
      if (!input.transcript || input.transcript.trim().length < 10) {
        return NextResponse.json({ error: 'A transcript is required for Agent Guardrail audits.' }, { status: 400 });
      }
    } else {
      if (!input.websiteUrl || input.websiteUrl.trim().length < 3) {
        return NextResponse.json({ error: 'A website URL is required.' }, { status: 400 });
      }
    }

    const { parsed, scraped } = await runAuditPipeline({
      auditType: input.auditType,
      websiteUrl: input.websiteUrl,
      companyName: sanitizeInput(input.companyName || '', 200),
      industry: sanitizeInput(input.industry || '', 200),
      companyType: sanitizeInput(input.companyType || '', 200),
      focusNotes: sanitizeInput(input.focusNotes || '', 1500),
      inputType: input.inputType,
      transcript: sanitizeInput(input.transcript || '', 100000),
    });

    const isFullMode = req.nextUrl.searchParams.get('mode') === 'full';
    try {
      const { generateSimulation } = await import('@/lib/audit/ai-claim-readability');
      const claimFindings = parsed.claim_audit.claims.map(c => ({
        id: c.id,
        text: c.original_text,
        label: (c.claim_status === 'verified' ? 'Supported' :
                c.claim_status === 'weakly_supported' || c.claim_status === 'insufficient_public_evidence' ? 'Weakly Supported' :
                c.claim_status === 'overstated' ? 'Overstated' : 'Unsupported') as any,
        evidenceFound: [],
        evidenceMissing: [c.support_gap].filter(Boolean),
        riskToBuyer: '',
        riskToInvestorOrAiSystem: '',
        saferFraming: c.safer_framing
      }));
      
      const pageInput = {
        url: scraped.url || input.websiteUrl || '',
        content: scraped.rawText || '',
        metadata: {
          title: scraped.title,
          description: scraped.description,
          organizationName: input.companyName
        }
      };

      const simulationResult = await generateSimulation({
        page: pageInput,
        claims: claimFindings,
      }, { mode: isFullMode ? 'full' : 'free' });

      (parsed as any).aiVisibilitySimulation = simulationResult.simulations;
      (parsed as any).entityUnderstandingGaps = simulationResult.entityUnderstandingGaps;
    } catch (simErr) {
      console.error('Simulation step failed in API route:', simErr);
    }

    let publicId: string | null = null;
    try {
      const { persistAudit } = await import('@/lib/audit-persistence');
      const { getCurrentUserId } = await import('@/lib/subscription');
      const userId = await getCurrentUserId();
      const auditType =
        input.auditType === 'snapshot' || input.auditType === 'full'
          ? input.auditType
          : 'starter';
      publicId = await persistAudit({
        auditType,
        path: input.auditType === 'snapshot' ? 'snapshot' : 'audit',
        companyName: input.companyName || null,
        websiteUrl: input.websiteUrl || scraped.url || null,
        industry: input.industry || null,
        focusNotes: input.focusNotes || null,
        inputType: input.inputType || null,
        transcript: input.transcript || null,
        auditJson: parsed,
        userId,
      });
    } catch (persistErr) {
      console.error('Audit persistence failed (non-fatal):', persistErr);
    }

    return NextResponse.json({ ...parsed, publicId });
  } catch (err: unknown) {
    const e = err as { message?: string };
    console.error('Audit API error:', e?.message || err);
    return NextResponse.json({ error: e?.message || 'Audit failed.' }, { status: 500 });
  }
}
