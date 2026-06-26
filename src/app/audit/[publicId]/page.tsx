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

export default async function PublicAuditPage({ params }: PageProps) {
  const { publicId } = await params;
  const audit = await getPublicAudit(publicId);
  if (!audit) notFound();

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
            <span className="ml-1">Public report · Read-only</span>
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
              mode="free"
              publicId={audit.publicId}
            />
          ) : (
            <PublicAuditView
              audit={audit.auditJson}
              createdAt={audit.createdAt}
              showCta={true}
              publicId={audit.publicId}
            />
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
