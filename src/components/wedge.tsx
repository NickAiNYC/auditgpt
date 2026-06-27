'use client';

// ============================================================
// The AuditGPT Wedge
// ============================================================
// Single visual artifact: Claim Intelligence
// This is the brand spine. It appears on the homepage, snapshot intake,
// sample report, pricing, and the public report footer.
//
// One source of truth so the four pillars never drift.
// ============================================================

import React from 'react';

export const WEDGE_PILLARS = [
  {
    key: 'claim',
    label: 'Claim',
    sub: 'What you say',
  },
  {
    key: 'evidence',
    label: 'Evidence',
    sub: 'What buyers can verify',
  },
  {
    key: 'readability',
    label: 'AI / Search readability',
    sub: 'What AI and search can understand',
  },
  {
    key: 'leakage',
    label: 'Claim drift',
    sub: 'What demand you lose',
  },
] as const;

export const WEDGE_INLINE_TEXT =
  'Claim Intelligence';

export const WEDGE_HEADLINE =
  'The gap nobody else audits.';

export const WEDGE_SUBHEAD =
  'AuditGPT diagnoses the gap between what your site says, what buyers can verify, what AI and search can understand, and where demand quietly leaks.';

// Compact single-line variant — for top of forms, sample report header, etc.
export function WedgeStrip({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-foreground/80 ${className}`}
      aria-label="The AuditGPT wedge"
    >
      {WEDGE_PILLARS.map((p, i) => (
        <React.Fragment key={p.key}>
          <span className="px-2 py-0.5 border border-border rounded-sm bg-white">
            {p.label}
          </span>
          {i < WEDGE_PILLARS.length - 1 && (
            <span aria-hidden="true" className="text-muted-foreground">↔</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Card variant with explanatory subtext — for landing hero + sample report.
export function WedgeCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-white border border-border rounded-sm p-5 sm:p-6 ${className}`}
      aria-label="The AuditGPT wedge"
    >
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
        The wedge nobody else audits
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-stretch">
        {WEDGE_PILLARS.map((p, i) => (
          <React.Fragment key={p.key}>
            <div className="relative border border-foreground/15 rounded-sm p-3 bg-neutral-50">
              <div className="font-serif text-base leading-tight">{p.label}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-snug">{p.sub}</div>
              {i < WEDGE_PILLARS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 items-center justify-center bg-white border border-foreground/15 rounded-full text-xs font-mono"
                >
                  ↔
                </span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 leading-relaxed font-mono uppercase tracking-widest text-center">
        Not SEO. Not reputation management. Not CRO. Claim Intelligence.
      </p>
    </div>
  );
}

// Inline text variant — for body copy, share text, email footers.
export function WedgeInline() {
  return <span className="font-mono">{WEDGE_INLINE_TEXT}</span>;
}
