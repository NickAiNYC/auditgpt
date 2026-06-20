import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicAudit, checkFullVerification } from '@/lib/audit-persistence';
import { PublicAuditView, PublicAuditData } from '@/components/public-audit-view';
import { Logo } from '@/components/logo';
import { ShareButtons } from '@/components/share-buttons';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ publicId: string }>;
}

function extractCompanyName(header: string): string {
  const idx = header.indexOf(' - ');
  if (idx > 0) return header.slice(0, idx).trim();
  return header;
}

function extractScore(header: string): string {
  const m = header.match(/\((\d{1,3})\/100\)/);
  return m ? m[1] : '';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params;
  const audit = await getPublicAudit(publicId);
  if (!audit) {
    return {
      title: 'Audit not found — AuditGPT',
    };
  }
  const name = extractCompanyName(audit.auditJson.verdict_header);
  const score = extractScore(audit.auditJson.verdict_header);
  const grade = audit.auditJson.grade_stamp;
  const title = `${name} — ${grade} grade (${score}/100) | AuditGPT Audit`;
  const description = audit.auditJson.verdict_header;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'AuditGPT',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PublicAuditPage({ params }: PageProps) {
  const { publicId } = await params;
  const audit = await getPublicAudit(publicId);
  if (!audit) {
    notFound();
  }

  const auditData = audit.auditJson as PublicAuditData;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-black" />
            <span className="ml-1">Public audit · Read-only</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Shared audit
            </div>
            <ShareButtons
              publicId={audit.publicId}
              companyName={audit.companyName || 'This business'}
              grade={audit.auditJson.grade_stamp || audit.auditJson.verdict || '?'}
              score={
                typeof audit.auditJson.score === 'number'
                  ? audit.auditJson.score
                  : audit.auditJson.verdict_header?.match(/\((\d{1,3})\/100\)/)?.[1] || null
              }
            />
          </div>
          <PublicAuditView
            audit={auditData}
            createdAt={audit.createdAt}
            showCta={true}
            verified={checkFullVerification(audit).verified}
            publicId={audit.publicId}
          />
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>AuditGPT · The Truth Engine for AI Businesses.</span>
          <span className="font-mono uppercase tracking-wider">The truth engine for AI businesses.</span>
        </div>
      </footer>
    </div>
  );
}
