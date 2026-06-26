import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicAudit, computeReportReview } from '@/lib/audit-persistence';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { CheckCircle2, XCircle, ScrollText, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ publicId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params;
  const audit = await getPublicAudit(publicId);
  if (!audit) return { title: 'Report review not found — AuditGPT' };
  const name = audit.companyName || 'This business';
  return {
    title: `${name} — AuditGPT Report Review`,
    description: `AuditGPT Visibility & Trust Review for ${name}.`,
    openGraph: {
      title: `${name} — AuditGPT Report Review`,
      description: `AuditGPT Visibility & Trust Review for ${name}.`,
      type: 'website',
      siteName: 'AuditGPT',
    },
  };
}

export default async function VerifiedPage({ params }: PageProps) {
  const { publicId } = await params;
  const audit = await getPublicAudit(publicId);
  if (!audit) notFound();

  const review = computeReportReview(audit);
  const supportedCount = review.scope.verified;
  const needsEvidenceCount =
    review.scope.weaklySupported +
    review.scope.unsupported +
    review.scope.overstated +
    review.scope.insufficientEvidence;
  const companyName = audit.companyName || 'This business';
  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const badgeUrl = `${appUrl}/api/badge/${publicId}`;
  const embedCode = `<a href="${appUrl}/verified/${publicId}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="AuditGPT Report Review" width="260" height="64" /></a>`;

  const isActive = review.available && !review.expired;
  const isExpired = review.expired;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              {isActive ? (
                <div className="h-16 w-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                  <ScrollText className="h-8 w-8 text-foreground" />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <ScrollText className="h-8 w-8 text-amber-600" />
                </div>
              )}
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              AuditGPT Report Review
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl mb-3 leading-tight">
              {companyName}
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isExpired
                ? `Report review expired on ${review.expiresAt?.toLocaleDateString('en-US')}. Re-audit to refresh the public report.`
                : `Report review issued. Expires ${review.expiresAt?.toLocaleDateString('en-US')}.`}
            </p>
          </div>

          {/* What was checked */}
          <div className="card-polsia p-6 mb-6">
            <h2 className="font-serif text-lg mb-4">What was checked</h2>
            <ul className="space-y-3 text-sm">
              <Row label="Claims reviewed" value={String(review.scope.claimsReviewed)} />
              <Row label="Supported" value={String(supportedCount)} />
              <Row label="Weakly supported" value={String(review.scope.weaklySupported)} />
              <Row label="Needs evidence" value={String(needsEvidenceCount)} />
              <Row label="Overstated" value={String(review.scope.overstated)} />
              <Row label="Unsupported" value={String(review.scope.unsupported)} />
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              This review states what AuditGPT examined on the date of the audit. It does not certify truth, ranking, AI visibility,
              legal compliance, clinical safety, or revenue outcomes.
            </p>
          </div>

          {/* Badge embed */}
          {isActive && (
            <div className="card-polsia p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <h2 className="font-serif text-lg">Your badge</h2>
              </div>
              <div className="bg-neutral-50 border border-border p-6 rounded-sm mb-4 flex items-center justify-center">
                <img
                  src={badgeUrl}
                  alt="AuditGPT Report Review"
                  width={260}
                  height={64}
                />
              </div>
              <p className="text-xs text-muted-foreground mb-2">Embed code:</p>
              <pre className="text-xs font-mono bg-neutral-900 text-neutral-100 p-4 rounded-sm overflow-x-auto">
                {embedCode}
              </pre>
              <p className="text-xs text-muted-foreground mt-3">
                After 90 days the badge automatically shows &quot;Report review expired&quot; until you re-audit.
              </p>
            </div>
          )}

          {isExpired && (
            <div className="card-polsia p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-4 w-4" />
                <h2 className="font-serif text-lg">Expired badge</h2>
              </div>
              <div className="bg-neutral-50 border border-border p-6 rounded-sm mb-4 flex items-center justify-center">
                <img
                  src={badgeUrl}
                  alt="Report review expired"
                  width={260}
                  height={64}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Re-run the audit to restore the active report review.
              </p>
            </div>
          )}

          <div className="card-polsia p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              View the full audit report for {companyName}.
            </p>
            <Link
              href={`/audit/${publicId}`}
              className="btn-cta"
              style={{ width: 'auto', padding: '0.75rem 1.5rem', display: 'inline-flex' }}
            >
              View full report <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
          AuditGPT by Scrutexity · Find what is unsupported, invisible, risky, or leaking.
        </div>
      </footer>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
      <span className="text-foreground/70">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </li>
  );
}
