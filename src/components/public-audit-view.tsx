'use client';

// Reusable read-only audit display. Used by:
// 1. The authenticated dashboard (Audit tab)
// 2. The public shareable page /audit/[publicId]
//
// This file is shared to keep both views visually identical.

import {
  TrendingUp,
  AlertTriangle,
  Wrench,
  Users,
  ListChecks,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import { Logo } from '@/components/logo';

export interface Benchmark {
  metric: string;
  this_business: string;
  industry_avg: string;
}

export interface SlopMarkers {
  detected: boolean;
  probability: number;
  signals: string[];
  rebuild_recommended: boolean;
}

export interface CompetitorAnalysis {
  summary: string;
  vs_makerpad: string;
  vs_cofounder: string;
  vs_polsia: string;
  vs_nanocorp: string;
  differentiation_angles: string[];
}

export interface PublicAuditData {
  verdict: string;
  score?: number;
  verdict_header: string;
  grade_stamp: string;
  company_info: string;
  company_name?: string;
  report_card: string[];
  red_flags: string[];
  assumptions_to_test: string[];
  website_fixes: string[];
  services_to_hire: string[];
  action_plan: string[];
  industry_benchmarks_table: Benchmark[];
  slop_markers?: SlopMarkers;
  competitor_analysis?: CompetitorAnalysis;
  audited_by?: string;
}

function gradeColorClass(g: string): string {
  if (g.startsWith('A')) return 'grade-a';
  if (g.startsWith('B')) return 'grade-b';
  if (g.startsWith('C')) return 'grade-c';
  if (g.startsWith('D')) return 'grade-d';
  return 'grade-f';
}
function gradeBgClass(g: string): string {
  if (g.startsWith('A')) return 'grade-bg-a';
  if (g.startsWith('B')) return 'grade-bg-b';
  if (g.startsWith('C')) return 'grade-bg-c';
  if (g.startsWith('D')) return 'grade-bg-d';
  return 'grade-bg-f';
}

function extractScore(audit: { score?: number; verdict_header?: string }): string | null {
  if (typeof audit.score === 'number' && !isNaN(audit.score)) {
    return String(audit.score);
  }
  const m = audit.verdict_header?.match(/\((\d{1,3})\/100\)/);
  return m ? m[1] : null;
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
function extractJudgment(header: string): string {
  const emIdx = header.indexOf(' — ');
  if (emIdx > 0) return header.slice(emIdx + 3).trim();
  const hyphIdx = header.indexOf(' - ');
  if (hyphIdx > 0) return header.slice(hyphIdx + 3).trim();
  return '';
}

function VerdictHeader({ audit }: { audit: PublicAuditData }) {
  const g = audit.grade_stamp || audit.verdict;
  const score = extractScore(audit);
  const companyName = extractCompanyName(audit);
  const judgment = extractJudgment(audit.verdict_header);

  return (
    <div className="card-polsia p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <div className="flex-shrink-0">
          <div
            className={`font-serif font-bold text-7xl sm:text-8xl leading-none ${gradeColorClass(g)} ${gradeBgClass(g)} px-4 py-2 inline-block`}
            style={{ borderRadius: '0.25rem' }}
          >
            {g}
          </div>
          {score && (
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 text-center">
              {score}/100
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              DUE-DILIGENCE REPORT
            </div>
            {audit.audited_by && (
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
                Audited by {audit.audited_by}
              </div>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl mb-1 leading-tight">{companyName}</h1>
          {judgment && (
            <p className="font-serif text-lg text-muted-foreground italic mb-3">{judgment}</p>
          )}
          {audit.company_info && (
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">{audit.company_info}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  count,
  items,
  numbered = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: number;
  items: string[];
  numbered?: boolean;
}) {
  return (
    <div className="card-polsia p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4" />
        <h3 className="font-serif text-lg">{title}</h3>
        {count !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground">{count}</span>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No findings.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="border-b border-border last:border-0 pb-3 last:pb-0 flex gap-3">
              {numbered && (
                <div className="flex-shrink-0 h-5 w-5 rounded-sm bg-black text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </div>
              )}
              <p className="text-sm text-foreground/85 leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BenchmarksCard({ benchmarks }: { benchmarks: Benchmark[] }) {
  if (!benchmarks.length) return null;
  return (
    <div className="card-polsia p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4" />
        <h3 className="font-serif text-lg">Industry benchmarks</h3>
      </div>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left font-normal px-5 py-2">Metric</th>
              <th className="text-left font-normal px-3 py-2">This business</th>
              <th className="text-left font-normal px-5 py-2">Industry average</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((b, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="px-5 py-2.5 font-medium">{b.metric}</td>
                <td className="px-3 py-2.5 text-foreground/80">
                  {b.this_business || 'insufficient data'}
                </td>
                <td className="px-5 py-2.5 text-muted-foreground">{b.industry_avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PublicAuditView({
  audit,
  createdAt,
  showCta = true,
  onReset,
  verified = false,
  publicId,
}: {
  audit: PublicAuditData;
  createdAt?: Date;
  showCta?: boolean;
  onReset?: () => void;
  verified?: boolean;
  publicId?: string;
}) {
  const slop = audit.slop_markers;
  const showSlopBanner = slop?.detected && slop?.rebuild_recommended;
  return (
    <div className="fade-up">
      {/* Verification banner (only if verified) */}
      {verified && publicId && (
        <div className="mb-4 card-polsia p-3 flex items-center justify-between gap-3 border-l-4 border-l-green-600">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-green-800">
                Verified by AuditGPT
              </div>
              <div className="text-xs text-muted-foreground">
                This site passed all verification criteria.
              </div>
            </div>
          </div>
          <a
            href={`/verified/${publicId}`}
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Details →
          </a>
        </div>
      )}

      {/* Slop detection banner */}
      {showSlopBanner && (
        <div className="mb-6 card-polsia p-5 border-l-4 border-l-black bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-sm bg-black text-white text-sm font-bold flex items-center justify-center font-mono">
              {slop?.probability ?? 0}%
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                AI-SLOP DETECTION
              </div>
              <h3 className="font-serif text-xl mb-1">AI-generated slop markers detected</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {slop?.signals?.length || 0} signal(s) found. Probability this site was AI-generated: {slop?.probability ?? 0}%.
              </p>
              {slop?.signals && slop.signals.length > 0 && (
                <ul className="text-xs text-foreground/80 space-y-1 ml-4 list-disc">
                  {slop.signals.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verdict header */}
      <div className="mb-6">
        <VerdictHeader audit={audit} />
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <SectionCard
          icon={ListChecks}
          title="Report card"
          count={audit.report_card.length}
          items={audit.report_card}
        />
        <SectionCard
          icon={AlertTriangle}
          title="Red flags"
          count={audit.red_flags.length}
          items={audit.red_flags}
        />
        <SectionCard
          icon={Lightbulb}
          title="Assumptions to test"
          count={audit.assumptions_to_test.length}
          items={audit.assumptions_to_test}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <SectionCard
          icon={Wrench}
          title="Website fixes"
          count={audit.website_fixes.length}
          items={audit.website_fixes}
        />
        <SectionCard
          icon={Users}
          title="Services to hire"
          count={audit.services_to_hire.length}
          items={audit.services_to_hire}
        />
        <SectionCard
          icon={ListChecks}
          title="Action plan"
          count={audit.action_plan.length}
          items={audit.action_plan}
          numbered
        />
      </div>

      {/* Benchmarks */}
      <BenchmarksCard benchmarks={audit.industry_benchmarks_table} />

      {/* Footer note + optional CTA */}
      {showCta && (
        <div className="mt-8 card-polsia p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
          <Logo variant="full" height={32} />
        </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Paste your website. Get a fact-backed audit in 30 seconds. No fluff, no hallucinations.
          </p>
          <a
            href="/"
            className="btn-cta"
            style={{ width: 'auto', padding: '0.875rem 2rem', display: 'inline-flex' }}
          >
            <RefreshCw className="h-4 w-4" /> AUDIT MY BUSINESS
          </a>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground text-center">
        {createdAt && (
          <span>
            Audit generated {createdAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}.{' '}
          </span>
        )}
        Every sentence should contain a verifiable fact. Cross-reference critical findings with your own data before acting.
      </div>
    </div>
  );
}
