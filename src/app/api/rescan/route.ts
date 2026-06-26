import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { getActiveSubscription, getCurrentUserId } from '@/lib/subscription';
import { consumeAuditUsage } from '@/lib/audit-usage';
import { runAuditPipeline } from '@/lib/audit-pipeline';
import { diffClaims, summarizeTrend } from '@/lib/diff-claims';

export const runtime = 'nodejs';
export const maxDuration = 60;

// POST /api/rescan
// Body: { publicId: string, previousAuditId?: string }
export async function POST(request: NextRequest) {
  try {
    // ── Auth & Authorization ──────────────────────────────────────
    const userId = await getCurrentUserId();
    const subscription = await getActiveSubscription();
    const isPaid = !!subscription;

    // ── Paywall ────────────────────────────────────────────────────
    // Rescans are available for active Agency accounts. During the
    // founder-led launch period, Starter and Full paid audits may also
    // receive one manual rescan within 90 days — that path is granted
    // by the founder via direct API call, not by the user-facing flow.
    const isAgency = subscription?.plan === 'agency';
    if (!isAgency) {
      return NextResponse.json(
        {
          error:
            'Rescans are available for active Agency accounts or founder-approved paid audits during the launch period.',
          code: 'AGENCY_TIER_REQUIRED',
          upgradeUrl: '/pricing',
        },
        { status: 402 },
      );
    }

    // ── Rate Limiting ─────────────────────────────────────────────
    const usageDecision = await consumeAuditUsage({ request, userId, isPaid });
    if (!usageDecision.allowed) {
      const status = usageDecision.code === 'BUDGET_EXHAUSTED' ? 503 : 429;
      return NextResponse.json(
        {
          error: usageDecision.code === 'EMAIL_REQUIRED'
            ? 'Sign in with a verified email to run additional free audits.'
            : usageDecision.code === 'BUDGET_EXHAUSTED'
              ? 'Free audit capacity has been reached for today.'
              : 'Audit rate limit exceeded.',
          code: usageDecision.code,
          upgradeUrl: '/pricing?ref=rate_limit',
        },
        {
          status,
          headers: usageDecision.retryAfter ? { 'Retry-After': String(usageDecision.retryAfter) } : undefined,
        }
      );
    }

    // ── Input ─────────────────────────────────────────────────────
    const body = await request.json().catch(() => ({}));
    const { publicId, previousAuditId } = body;
    if (!publicId) {
      return NextResponse.json({ error: 'publicId is required' }, { status: 400 });
    }

    // ── Load Previous Audit ───────────────────────────────────────
    const previousAudit = await db.audit.findUnique({
      where: { publicId },
      select: {
        id: true,
        userId: true,
        websiteUrl: true,
        industry: true,
        companyName: true,
        focusNotes: true,
        score: true,
        claims: {
          select: {
            id: true,
            claimHash: true,
            claimText: true,
            status: true,
            severity: true,
            expiresAt: true,
          }
        }
      }
    });

    if (!previousAudit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    // ── Lineage validation: audit must belong to this user ──────────────────
    if (previousAudit.userId !== userId) {
      return NextResponse.json({ error: 'Audit does not belong to this user' }, { status: 403 });
    }
    // If previousAuditId is explicitly provided, validate it matches
    if (previousAuditId && previousAuditId !== previousAudit.id) {
      return NextResponse.json({ error: 'previousAuditId mismatch' }, { status: 400 });
    }
    if (!previousAudit.websiteUrl) {
      return NextResponse.json({ error: 'Audit does not have a website URL to rescan' }, { status: 400 });
    }

    // ── Concurrency lock using RescanLock ──────────────────────────
    // Clear any expired locks (older than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    try {
      await db.rescanLock.deleteMany({
        where: {
          auditId: previousAudit.id,
          createdAt: { lt: fiveMinutesAgo }
        }
      });
    } catch (err) {
      console.error('Failed to clean up expired rescan locks:', err);
    }

    try {
      await db.rescanLock.create({
        data: { auditId: previousAudit.id }
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return NextResponse.json(
          { error: 'Rescan already in progress for this audit.', code: 'CONCURRENT_RESCAN' },
          { status: 409 }
        );
      }
      throw err; // connection or schema error -> bubbles up to catch block to return 500
    }

    try {
      // ── Scrape the site first (before calling the LLM / pipeline to avoid token spend on failure) ──
      const { scrapeSite } = await import('@/lib/audit-pipeline');
      const scraped = await scrapeSite(previousAudit.websiteUrl);

      // Failed Scrapes: Immediately abort rescans and return a 502 Bad Gateway if fetchError exists
      if (scraped.fetchError) {
        return NextResponse.json(
          { error: `Scrape failed: ${scraped.fetchError}`, code: 'FETCH_ERROR' },
          { status: 502 }
        );
      }

      // ── Re-run the Audit Pipeline with preScraped data ─────────────────────────────────
      const { parsed } = await runAuditPipeline({
        auditType: 'starter',
        websiteUrl: previousAudit.websiteUrl,
        companyName: previousAudit.companyName || undefined,
        industry: previousAudit.industry || undefined,
        focusNotes: previousAudit.focusNotes || undefined,
        preScraped: scraped,
      });

      // ── Persist New Audit with Lineage ────────────────────────────
      const { persistAudit } = await import('@/lib/audit-persistence');
      const companyName =
        previousAudit.companyName || null;

      const newPublicId = await persistAudit({
        auditType: 'starter',
        path: 'rescan',
        companyName,
        websiteUrl: scraped.url || previousAudit.websiteUrl,
        industry: previousAudit.industry,
        focusNotes: previousAudit.focusNotes,
        auditJson: parsed,
        userId,
      });

      // Fetch the new claims to calculate the diff
      const newAudit = await db.audit.findUnique({
        where: { publicId: newPublicId },
        select: {
          id: true,
          score: true,
          claims: {
            select: {
              id: true,
              claimHash: true,
              claimText: true,
              status: true,
              severity: true,
              expiresAt: true,
            }
          }
        }
      });

      if (!newAudit) {
        return NextResponse.json({ error: 'Persisted rescan audit not found' }, { status: 500 });
      }

      // ── Diff Claims ───────────────────────────────────────────────
      const diff = diffClaims(previousAudit.claims, newAudit.claims);
      const trend = summarizeTrend(previousAudit.score || 0, newAudit.score || 0, diff);

      // ── Response ──────────────────────────────────────────────────
      return NextResponse.json({
        publicId: newPublicId,
        score: newAudit.score,
        previousScore: previousAudit.score,
        trend,
        diff: {
          added: diff.added.length,
          removed: diff.removed.length,
          reclassified: diff.reclassified.length,
          expired: diff.expired.length,
          unchanged: diff.unchanged.length,
          addedClaims: diff.added.slice(0, 5),
          removedClaims: diff.removed.slice(0, 5),
        },
      });
    } finally {
      try {
        await db.rescanLock.delete({
          where: { auditId: previousAudit.id }
        });
      } catch (err) {
        console.error('Failed to release rescan lock:', err);
      }
    }
  } catch (err: any) {
    console.error('Rescan API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Rescan failed.' },
      { status: 500 }
    );
  }
}
