import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicAudit, computeReportReview } from '@/lib/audit-persistence';
import { PublicAuditView } from '@/components/public-audit-view';
import { EnhancedSnapshotReport } from '@/components/enhanced-snapshot-report';
import { enhancedSnapshotFromAuditResult } from '@/lib/audit/snapshot-report-adapter';
import { Logo } from '@/components/logo';
import { ShareButtons } from '@/components/share-buttons';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ publicId: string }>;
  searchParams?: Promise<{ unlocked?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params;
  const audit = await getPublicAudit(publicId);
  if (!audit) {
    return { title: 'Audit not found — AuditGPT' };
  }
  const name = audit.companyName || 'This business';
  const title = `${name} — AuditGPT Visibility & Trust Review`;
  const description = audit.auditJson.claim_audit?.summary?.executive_summary?.slice(0, 200) || '';
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', siteName: 'AuditGPT' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function PublicAuditPage({ params, searchParams }: PageProps) {
  const { publicId } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const audit = await getPublicAudit(publicId);
  if (!audit) notFound();

  // ── Entitlement check ─────────────────────────────────────
  // Paid: audit.paidAt is set by Stripe webhook
  // Dev bypass: ?unlocked=1 (only works outside production)
  const isProduction = process.env.NODE_ENV === 'production';
  const devBypass = sp?.unlocked === '1' && !isProduction;
  const isUnlocked = !!audit.paidAt || devBypass;

  let agencyBranding = undefined;
  if (audit.agencyId) {
    const { db } = await import('@/lib/db');
    const agency = await db.agency.findUnique({ where: { id: audit.agencyId } });
    if (agency) {
      agencyBranding = {
        logoUrl: agency.logoUrl,
        primaryColor: agency.primaryColor,
        poweredByEnabled: agency.poweredByEnabled,
        companyName: agency.companyName,
      };
    }
  }

  const review = computeReportReview(audit);
  const isSnapshot = audit.auditType === 'snapshot' || audit.path === 'snapshot';
  const enhancedSnapshot = isSnapshot
    ? enhancedSnapshotFromAuditResult({
        audit: audit.auditJson,
        url: audit.websiteUrl || audit.auditJson.claim_audit.claims[0]?.source_url || '',
        metadata: {
          title: audit.companyName || audit.auditJson.verdict_header,
          organizationName: audit.companyName || undefined,
          canonicalUrl: audit.websiteUrl || undefined,
        },
        generatedAt: audit.createdAt,
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-black" />
            <span className="ml-1">
              {isUnlocked ? 'Full report · Paid' : 'Public report · Free preview'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              AuditGPT Visibility &amp; Trust Review
              {review.expiresAt
                ? ` · Expires ${review.expiresAt.toLocaleDateString('en-US')}`
                : ''}
              {!isUnlocked && (
                <span className="ml-2 text-amber-600 font-semibold">
                  · Free preview (3 of {review.scope.claimsReviewed} findings shown)
                </span>
              )}
            </div>
            <ShareButtons
              publicId={audit.publicId}
              companyName={audit.companyName || 'This business'}
              claimsReviewed={review.scope.claimsReviewed}
            />
          </div>
          {enhancedSnapshot ? (
            <EnhancedSnapshotReport
              report={enhancedSnapshot}
              mode={isUnlocked ? 'full' : 'free'}
              publicId={audit.publicId}
              agencyBranding={agencyBranding}
            />
          ) : (
            <PublicAuditView
              audit={audit.auditJson}
              createdAt={audit.createdAt}
              showCta={!isUnlocked}
              publicId={audit.publicId}
            />
          )}

          {!isUnlocked && (
            <div className="mt-12 border border-stone-200 bg-stone-50 rounded-sm p-8 text-center">
              <h2 className="font-serif text-2xl mb-2 text-stone-900">See the full report</h2>
              <p className="text-sm text-stone-600 mb-6 max-w-md mx-auto">
                Upgrade to see all {review.scope.claimsReviewed} findings, the full AI Answer Reality
                Receipt, safer rewrites, and the 7-day fix plan.
              </p>
              <a
                href={`/pricing?publicId=${publicId}`}
                className="inline-block bg-stone-900 text-white px-8 py-3 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                Unlock Full Report — $299
              </a>
              {devBypass && (
                <p className="text-xs text-stone-400 mt-3 font-mono">
                  Dev bypass active (?unlocked=1) — full report visible
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>AuditGPT by Scrutexity</span>
          <span className="font-mono uppercase tracking-wider">
            Find what is unsupported, invisible, risky, or leaking.
          </span>
        </div>
      </footer>
    </div>
  );
}
