import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicAudit, computeReportReview } from '@/lib/audit-persistence';
import { PublicAuditView } from '@/components/public-audit-view';
import { EnhancedSnapshotReport } from '@/components/enhanced-snapshot-report';
import { FirstPassReport } from '@/components/first-pass-report';
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

  // Free scans get the first-pass document; paid reports keep the full views.
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <header className="border-b border-[#EAEAEA] bg-white">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:px-8">
            <Link href="/" className="flex items-center gap-2" aria-label="AuditGPT home">
              <Logo variant="full" height={26} />
            </Link>
            <Link
              href="/"
              className="text-xs font-medium text-neutral-500 transition-colors hover:text-black sm:text-sm"
            >
              Run another scan
            </Link>
          </div>
        </header>

        <main className="flex-1 px-5 py-12 sm:px-8 sm:py-16">
          <FirstPassReport
            audit={audit.auditJson}
            websiteUrl={audit.websiteUrl || audit.companyName || 'Scanned page'}
            publicId={audit.publicId}
            createdAt={audit.createdAt}
          />
        </main>

        <footer className="mt-auto border-t border-[#EAEAEA] bg-white px-5 py-8 sm:px-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-2 text-sm leading-6 text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
            <span>AuditGPT is a Scrutexity product.</span>
            <a
              href="/claim-review-methodology"
              className="font-medium text-neutral-700 transition-colors hover:text-black"
            >
              How we review claims →
            </a>
          </div>
        </footer>
      </div>
    );
  }

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
            <span className="ml-1">Full report · Paid</span>
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
              mode="full"
              publicId={audit.publicId}
              agencyBranding={agencyBranding}
            />
          ) : (
            <PublicAuditView
              audit={audit.auditJson}
              createdAt={audit.createdAt}
              showCta={false}
              publicId={audit.publicId}
            />
          )}

          {devBypass && (
            <p className="text-xs text-stone-400 mt-6 font-mono text-center">
              Dev bypass active (?unlocked=1) — full report visible
            </p>
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
