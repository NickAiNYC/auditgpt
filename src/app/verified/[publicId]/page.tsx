import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicAudit, evaluateVerification, checkFullVerification } from '@/lib/audit-persistence';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { CheckCircle2, XCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ publicId: string }>;
}

function extractCompanyName(audit: { company_name?: string; verdict_header?: string }): string {
  if (audit.company_name && audit.company_name !== 'insufficient data') {
    return audit.company_name;
  }
  const header = audit.verdict_header || '';
  const emIdx = header.indexOf(' — ');
  if (emIdx > 0) return header.slice(0, emIdx).trim();
  const hyphIdx = header.indexOf(' - ');
  if (hyphIdx > 0) return header.slice(0, hyphIdx).trim();
  return header;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params;
  const audit = await getPublicAudit(publicId);
  if (!audit) {
    return { title: 'Audit not found — AuditGPT' };
  }
  const name = extractCompanyName(audit.auditJson);
  const status = audit.verified ? 'Verified' : 'Not verified';
  return {
    title: `${name} — ${status} by AuditGPT`,
    description: `Verification status for ${name}'s AuditGPT audit. ${status}.`,
    openGraph: {
      title: `${name} — ${status} by AuditGPT`,
      description: `AuditGPT verification for ${name}.`,
      type: 'website',
      siteName: 'AuditGPT',
    },
  };
}

export default async function VerifiedPage({ params }: PageProps) {
  const { publicId } = await params;
  const audit = await getPublicAudit(publicId);
  if (!audit) notFound();

  // Use full verification check (criteria + 90-day expiry)
  const verification = checkFullVerification(audit);
  const criteriaResult = evaluateVerification(audit.auditJson);
  const companyName =
    audit.companyName ||
    extractCompanyName(audit.auditJson) ||
    'This site';
  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const badgeUrl = `${appUrl}/api/badge/${publicId}`;
  const embedCode = `<a href="${appUrl}/verified/${publicId}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="Verified by AuditGPT" width="220" height="56" /></a>`;

  // Three states: verified (within 90 days), expired (was verified, now past 90 days), not verified
  const isVerified = verification.verified;
  const isExpired = verification.expired;
  const result = criteriaResult; // for criteria display

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
            ← Back to main
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Status header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              {isVerified ? (
                <div className="h-16 w-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-green-700" />
                </div>
              ) : isExpired ? (
                <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-amber-600" />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-neutral-500" />
                </div>
              )}
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              AuditGPT verification
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl mb-3 leading-tight">
              {isVerified ? (
                <>{companyName} is verified</>
              ) : isExpired ? (
                <>{companyName}&apos;s verification has expired</>
              ) : (
                <>{companyName} is not verified</>
              )}
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isVerified
                ? `Passed all verification criteria on ${audit.verifiedAt?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. Valid for 90 days — expires ${verification.expiresAt?.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}.`
                : isExpired
                ? `Verification expired on ${verification.expiresAt?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. Re-run the audit to re-verify. The badge now shows "Verification expired" on any site embedding it.`
                : 'This audit did not pass verification criteria. Fix the gaps below and re-run the audit.'}
            </p>
          </div>

          {/* Badge preview + embed code (only if verified and not expired) */}
          {isVerified && (
            <div className="card-polsia p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <h2 className="font-serif text-lg">Your badge</h2>
              </div>
              <div className="bg-neutral-50 border border-border p-6 rounded-sm mb-4 flex items-center justify-center">
                <img
                  src={badgeUrl}
                  alt="Verified by AuditGPT"
                  width={220}
                  height={56}
                />
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Embed this badge on your site (expires {verification.expiresAt?.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}):
              </p>
              <pre className="text-xs font-mono bg-neutral-900 text-neutral-100 p-4 rounded-sm overflow-x-auto">
{embedCode}
              </pre>
              <p className="text-xs text-muted-foreground mt-3">
                After 90 days, the badge automatically shows &quot;Verification expired&quot; until you re-audit.
              </p>
            </div>
          )}

          {/* Expired badge preview (if expired) */}
          {isExpired && (
            <div className="card-polsia p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-4 w-4" />
                <h2 className="font-serif text-lg">Expired badge (what embeds now show)</h2>
              </div>
              <div className="bg-neutral-50 border border-border p-6 rounded-sm mb-4 flex items-center justify-center">
                <img
                  src={badgeUrl}
                  alt="Verification expired — AuditGPT"
                  width={220}
                  height={56}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Any site embedding this badge now shows &quot;Verification expired&quot;.
                Re-run the audit to restore the green verified badge.
              </p>
            </div>
          )}

          {/* Verification criteria */}
          <div className="card-polsia p-6 mb-6">
            <h2 className="font-serif text-lg mb-4">Verification criteria</h2>
            <ul className="space-y-3">
              <CriterionRow
                label="Grade is B or higher"
                passed={result.criteria.gradePasses}
                detail={`Current grade: ${audit.auditJson.grade_stamp || audit.auditJson.verdict}`}
              />
              <CriterionRow
                label="Score is 70 or higher"
                passed={result.criteria.scorePasses}
                detail={`Current score: ${
                  typeof audit.auditJson.score === 'number'
                    ? audit.auditJson.score
                    : audit.auditJson.verdict_header?.match(/\((\d{1,3})\/100\)/)?.[1] || 'unknown'
                }/100`}
              />
              <CriterionRow
                label="No critical red flags"
                passed={result.criteria.noCriticalRedFlags}
                detail={
                  result.criteria.noCriticalRedFlags
                    ? 'No critical red flags in audit'
                    : 'Critical red flags found — see audit'
                }
              />
              <CriterionRow
                label="No AI-slop markers detected"
                passed={result.criteria.noSlopMarkers}
                detail={
                  result.criteria.noSlopMarkers
                    ? 'No slop markers'
                    : `${audit.auditJson.slop_markers?.signals?.length || 0} slop signals detected`
                }
              />
            </ul>
          </div>

          {/* Original audit link */}
          <div className="card-polsia p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              View the full audit report for {companyName}.
            </p>
            <Link
              href={`/audit/${publicId}`}
              className="btn-cta"
              style={{ width: 'auto', padding: '0.75rem 1.5rem', display: 'inline-flex' }}
            >
              View full audit <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
          AuditGPT · The truth engine for AI businesses.
        </div>
      </footer>
    </div>
  );
}

function CriterionRow({
  label,
  passed,
  detail,
}: {
  label: string;
  passed: boolean;
  detail: string;
}) {
  return (
    <li className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
      <div className="flex-shrink-0 mt-0.5">
        {passed ? (
          <CheckCircle2 className="h-5 w-5 text-green-700" />
        ) : (
          <XCircle className="h-5 w-5 text-red-700" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </li>
  );
}
