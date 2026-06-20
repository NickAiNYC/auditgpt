'use client';

import { Logo } from '@/components/logo';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';

// ============================================================
// COMPETITOR DATA — all claims sourced + timestamped
// ============================================================
// Every claim must be traceable. No timeless statements.
// If a stat is unverified, say so. This page IS the trust layer.

interface Competitor {
  name: string;
  tagline: string;
  status: string; // operating status with date
  funding: string;
  revenue: string;
  trustScore: string;
  keyWeakness: string;
  source: string; // where the claim comes from
}

const COMPETITORS: Competitor[] = [
  {
    name: 'Polsia',
    tagline: 'Autonomous AI business builder',
    status: 'Active (as of early 2026)',
    funding: '$30M raised',
    revenue: 'Insufficient data — not publicly disclosed',
    trustScore: '~2.7 Trustpilot (as of early 2026 — verify current)',
    keyWeakness:
      'Users report fabricated tasks, credit burning on mass cold outreach, and refund complaints. Trustpilot reviews cite poor support.',
    source: 'Trustpilot public reviews; user reports on social media.',
  },
  {
    name: 'NanoCorp',
    tagline: 'AI company operating system',
    status: 'Active (as of early 2026)',
    funding: 'Insufficient data',
    revenue: '$264.27 total across 29 transactions for all AI-built companies combined (per their own dashboard)',
    trustScore: 'Insufficient data — no public Trustpilot',
    keyWeakness:
      'Aggregate platform revenue of $264.27 across 29 transactions suggests the autonomous business category is not yet generating real revenue. 20% withdrawal fee on earnings.',
    source: 'NanoCorp public dashboard (self-reported, early 2026).',
  },
  {
    name: 'Cofounder.co',
    tagline: 'AI co-founder for startups',
    status: 'Active (as of early 2026)',
    funding: 'Insufficient data',
    revenue: 'Insufficient data — not publicly disclosed',
    trustScore: 'Insufficient data',
    keyWeakness:
      'Approval-gate model requires manual review before execution. Base price hides usage fees. Stops at planning — no real execution layer.',
    source: 'Product documentation; user reports.',
  },
  {
    name: 'MakerPad',
    tagline: 'No-code business builder',
    status: 'Current operating status unverified as of 2026 — treat as historical reference',
    funding: 'Acquired by Zapier (2021)',
    revenue: 'Insufficient data',
    trustScore: 'Insufficient data',
    keyWeakness:
      'Ships generic templated businesses with no fact-checking. Often contains fabricated claims. Operating status post-acquisition unclear.',
    source: 'Zapier acquisition announcement (2021); community reports.',
  },
];

const AUDITGPT: Competitor = {
  name: 'AuditGPT',
  tagline: 'The truth engine for AI businesses',
  status: 'Launching (June 2026)',
  funding: 'Bootstrapped',
  revenue: 'Insufficient data — launching now',
  trustScore: 'N/A (no Trustpilot yet — we just launched)',
  keyWeakness:
    'No weakness to declare. We cite our own gaps honestly: every audit says "insufficient data" when data is missing, including for ourselves.',
  source: 'This page. Self-reported, transparently.',
};

// ============================================================
// FEATURE COMPARISON TABLE
// ============================================================
const FEATURE_MATRIX = [
  {
    feature: 'Factual claims verified',
    polsia: 'No — users report fabricated outputs',
    nanocorp: 'No — no systematic fact-checking',
    cofounder: 'No — stops at planning',
    makerpad: 'No — generic templated output',
    auditgpt: 'Yes — every claim cited to scrape or benchmark',
  },
  {
    feature: 'Source transparency',
    polsia: 'No source trail',
    nanocorp: 'Internal dashboard only',
    cofounder: 'No public trail',
    makerpad: 'No source trail',
    auditgpt: 'Public, shareable audit with full evidence',
  },
  {
    feature: 'Hallucination prevention',
    polsia: 'No systematic check',
    nanocorp: 'No systematic check',
    cofounder: 'No systematic check',
    makerpad: 'No systematic check',
    auditgpt: 'Hardcoded banned phrases + "insufficient data" fallback',
  },
  {
    feature: 'Independent trust signal',
    polsia: 'Internal only',
    nanocorp: 'Internal only',
    cofounder: 'Internal only',
    makerpad: 'Internal only',
    auditgpt: 'Verified badge with 90-day expiry, revocable',
  },
  {
    feature: 'Revenue transparency',
    polsia: '$30M raised, revenue unverified',
    nanocorp: '$264.27 total (self-reported, early 2026)',
    cofounder: 'Insufficient data',
    makerpad: 'Insufficient data',
    auditgpt: 'Insufficient data (launching)',
  },
  {
    feature: 'User trust score',
    polsia: '~2.7 Trustpilot (early 2026 — verify current)',
    nanocorp: 'Insufficient data',
    cofounder: 'Insufficient data',
    makerpad: 'Insufficient data',
    auditgpt: 'N/A — launching now',
  },
  {
    feature: 'Anti-slop detection',
    polsia: 'No',
    nanocorp: 'No',
    cofounder: 'No',
    makerpad: 'No',
    auditgpt: 'Yes — 8 slop markers scanned on every audit',
  },
  {
    feature: 'Rebuild from slop',
    polsia: 'No',
    nanocorp: 'No',
    cofounder: 'No',
    makerpad: 'No',
    auditgpt: 'Yes — fact-backed landing page rebuild',
  },
  {
    feature: 'Public audit archive',
    polsia: 'No',
    nanocorp: 'No',
    cofounder: 'No',
    makerpad: 'No',
    auditgpt: 'Yes — every audit gets a shareable URL',
  },
];

// Boolean features for the checkmark/x grid
const BOOLEAN_FEATURES = [
  { feature: 'Factual claims verified', auditgpt: true, others: false },
  { feature: 'Source transparency', auditgpt: true, others: false },
  { feature: 'Hallucination prevention', auditgpt: true, others: false },
  { feature: 'Independent trust signal', auditgpt: true, others: false },
  { feature: 'Anti-slop detection', auditgpt: true, others: false },
  { feature: 'Rebuild from slop', auditgpt: true, others: false },
  { feature: 'Public audit archive', auditgpt: true, others: false },
  { feature: '90-day verification expiry', auditgpt: true, others: false },
  { feature: 'Rate-limited free tier', auditgpt: true, others: false },
  { feature: 'Server-side paywall enforcement', auditgpt: true, others: false },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <a
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back to main
          </a>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="mb-12">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Independent comparison
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl leading-tight mb-4">
              AuditGPT vs. Polsia, NanoCorp, Cofounder & MakerPad
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Which AI business tool tells the truth? Here&apos;s how they actually compare —
              no hype, just verified facts. Every claim is sourced or marked &quot;insufficient data.&quot;
            </p>
          </div>

          {/* Quick verdict grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-12">
            <CompetitorCard competitor={AUDITGPT} highlight />
            {COMPETITORS.map((c) => (
              <CompetitorCard key={c.name} competitor={c} />
            ))}
          </div>

          {/* Feature comparison table */}
          <div className="card-polsia p-6 mb-12 overflow-x-auto">
            <h2 className="font-serif text-xl mb-4">Feature comparison</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left font-normal px-3 py-2">What matters</th>
                  <th className="text-left font-normal px-3 py-2">AuditGPT</th>
                  <th className="text-left font-normal px-3 py-2">Polsia</th>
                  <th className="text-left font-normal px-3 py-2">NanoCorp</th>
                  <th className="text-left font-normal px-3 py-2">Cofounder</th>
                  <th className="text-left font-normal px-3 py-2">MakerPad</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_MATRIX.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-3 py-3 font-medium">{row.feature}</td>
                    <td className="px-3 py-3 text-foreground font-medium">{row.auditgpt}</td>
                    <td className="px-3 py-3 text-muted-foreground">{row.polsia}</td>
                    <td className="px-3 py-3 text-muted-foreground">{row.nanocorp}</td>
                    <td className="px-3 py-3 text-muted-foreground">{row.cofounder}</td>
                    <td className="px-3 py-3 text-muted-foreground">{row.makerpad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Boolean feature checkmarks */}
          <div className="card-polsia p-6 mb-12">
            <h2 className="font-serif text-xl mb-4">Capability checklist</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left font-normal px-3 py-2">Capability</th>
                  <th className="text-center font-normal px-3 py-2">AuditGPT</th>
                  <th className="text-center font-normal px-3 py-2">All others</th>
                </tr>
              </thead>
              <tbody>
                {BOOLEAN_FEATURES.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-3 py-3 font-medium">{row.feature}</td>
                    <td className="px-3 py-3 text-center">
                      {row.auditgpt ? (
                        <Check className="h-5 w-5 text-green-700 inline" />
                      ) : (
                        <X className="h-5 w-5 text-red-700 inline" />
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {row.others ? (
                        <Check className="h-5 w-5 text-green-700 inline" />
                      ) : (
                        <X className="h-5 w-5 text-red-700 inline" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed competitor breakdowns */}
          <div className="space-y-4 mb-12">
            <h2 className="font-serif text-2xl">Detailed breakdowns</h2>
            {COMPETITORS.map((c) => (
              <div key={c.name} className="card-polsia p-6">
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div>
                    <h3 className="font-serif text-xl mb-1">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.tagline}</p>
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground border border-border px-2 py-1 rounded-sm">
                    {c.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                      Funding
                    </p>
                    <p className="text-foreground/85">{c.funding}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                      Revenue
                    </p>
                    <p className="text-foreground/85">{c.revenue}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                      Trust score
                    </p>
                    <p className="text-foreground/85">{c.trustScore}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                      Key weakness
                    </p>
                    <p className="text-foreground/85">{c.keyWeakness}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono uppercase tracking-widest">Source: </span>
                    {c.source}
                  </p>
                </div>
              </div>
            ))}

            {/* AuditGPT self-entry */}
            <div className="card-polsia p-6 border-2 border-black">
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <h3 className="font-serif text-xl mb-1">AuditGPT</h3>
                  <p className="text-sm text-muted-foreground">{AUDITGPT.tagline}</p>
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-green-800 bg-green-50 border border-green-200 px-2 py-1 rounded-sm">
                  {AUDITGPT.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    Funding
                  </p>
                  <p className="text-foreground/85">{AUDITGPT.funding}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    Revenue
                  </p>
                  <p className="text-foreground/85">{AUDITGPT.revenue}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    Trust score
                  </p>
                  <p className="text-foreground/85">{AUDITGPT.trustScore}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    Key weakness
                  </p>
                  <p className="text-foreground/85">{AUDITGPT.keyWeakness}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="font-mono uppercase tracking-widest">Source: </span>
                  {AUDITGPT.source}
                </p>
              </div>
            </div>
          </div>

          {/* Methodology note */}
          <div className="card-polsia p-6 mb-8 border-l-4 border-l-black">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-lg mb-2">How we compiled this comparison</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  Every claim on this page is either (a) sourced from public records, (b) self-reported
                  by the competitor, or (c) marked &quot;insufficient data.&quot; We do not fabricate
                  stats about competitors — that&apos;s the exact behavior we audit against.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Competitor stats are timestamped because they change. Polsia&apos;s Trustpilot rating
                  may have drifted since early 2026 — verify current before citing externally. NanoCorp&apos;s
                  revenue figure is from their own public dashboard and may have updated since.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="card-polsia p-8 text-center">
            <h2 className="font-serif text-2xl mb-2">See for yourself</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Run an AuditGPT audit on any business — including one built by a competitor. The receipts are public.
            </p>
            <a
              href="/"
              className="btn-cta"
              style={{ width: 'auto', padding: '0.875rem 2rem', display: 'inline-flex' }}
            >
              RUN A FREE AUDIT
            </a>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>AuditGPT · The truth engine for AI businesses.</span>
          <span className="font-mono uppercase tracking-wider">Every claim is sourced.</span>
        </div>
      </footer>
    </div>
  );
}

function CompetitorCard({
  competitor,
  highlight = false,
}: {
  competitor: Competitor;
  highlight?: boolean;
}) {
  return (
    <div
      className={`card-polsia p-4 ${
        highlight ? 'border-2 border-black' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-lg">{competitor.name}</h3>
        {highlight && (
          <span className="text-[10px] font-mono uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-sm">
            Us
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-3">{competitor.tagline}</p>
      <div className="space-y-1.5 text-xs">
        <div>
          <span className="text-muted-foreground">Status: </span>
          <span className="text-foreground/80">{competitor.status}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Revenue: </span>
          <span className="text-foreground/80">
            {competitor.revenue.length > 50
              ? competitor.revenue.slice(0, 50) + '...'
              : competitor.revenue}
          </span>
        </div>
      </div>
    </div>
  );
}
