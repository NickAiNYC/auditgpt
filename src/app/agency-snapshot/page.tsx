'use client';

import React from 'react';
import { Logo } from '@/components/logo';
import { ArrowRight, Shield, AlertTriangle, FileText, DollarSign, Scale, Ban } from 'lucide-react';

const claimsData = [
  {
    claim: '"Results visible in as little as 2 weeks"',
    riskLevel: 'High' as const,
    riskColor: 'text-red-800 bg-red-50',
    impact: 'FTC investigation trigger — absolute timeline claims require clinical evidence',
    action: 'Add proof source or remove timeline',
  },
  {
    claim: '"Our providers are board-certified in aesthetic medicine"',
    riskLevel: 'High' as const,
    riskColor: 'text-red-800 bg-red-50',
    impact: 'Blocks LegitScript certification — no official board certification exists for "aesthetic medicine"',
    action: 'Rewrite to specify actual board certifications',
  },
  {
    claim: '"FDA-approved for all skin types"',
    riskLevel: 'High' as const,
    riskColor: 'text-red-800 bg-red-50',
    impact: 'AI citation penalty — FDA approval is device-specific, not indication-specific',
    action: 'Rewrite with exact FDA clearance language',
  },
  {
    claim: '"The #1 med spa in [City]"',
    riskLevel: 'Medium' as const,
    riskColor: 'text-amber-800 bg-amber-50',
    impact: 'AI citation penalty — unverifiable superlative without disclosed ranking criteria',
    action: 'Add proof source or remove',
  },
  {
    claim: '"Painless, no downtime — guaranteed"',
    riskLevel: 'Medium' as const,
    riskColor: 'text-amber-800 bg-amber-50',
    impact: 'FTC investigation trigger — absolute guarantee language creates liability',
    action: 'Add proof source or qualify with clinical evidence',
  },
  {
    claim: '"Permanent results with just one treatment"',
    riskLevel: 'High' as const,
    riskColor: 'text-red-800 bg-red-50',
    impact: 'FDA Misbranding risk — permanence claims for cosmetic procedures require substantiation',
    action: 'Rewrite to reflect realistic duration',
  },
  {
    claim: '"Trusted by thousands of patients"',
    riskLevel: 'Medium' as const,
    riskColor: 'text-amber-800 bg-amber-50',
    impact: 'Blocks LegitScript certification — aggregate claims need verifiable source',
    action: 'Add proof source or remove',
  },
  {
    claim: '"Cutting-edge technology you won\'t find anywhere else"',
    riskLevel: 'Low' as const,
    riskColor: 'text-stone-600 bg-stone-50',
    impact: 'AI citation penalty — vague uniqueness claim, low enforcement priority',
    action: 'Rewrite to specify actual differentiator',
  },
];

export default function AgencySnapshotPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] text-stone-900 font-sans selection:bg-stone-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="hover:opacity-70 transition-opacity">
            <Logo variant="full" height={24} />
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/pricing"
              className="bg-stone-900 text-stone-50 font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-sm hover:bg-stone-800 transition-colors shadow-sm whitespace-nowrap"
            >
              Get Full Report
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Executive Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500 mb-3">
                CONFIDENTIAL — Prepared for{' '}
                <span className="text-stone-900 font-bold">Serenity Aesthetics + Wellness</span>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                Report Date: June 28, 2026 &nbsp;//&nbsp; Prepared by: Radiance Media Group
              </div>
            </div>
            <div className="inline-flex items-center gap-2 border border-stone-200 bg-white rounded-sm px-4 py-2.5 shrink-0">
              <Shield className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-stone-600">
                Claim Intelligence Receipt · Reviewed by AuditGPT
              </span>
            </div>
          </div>
          <div className="border-t border-stone-200 pt-6">
            <p className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Engagement: Pre-Launch Website Claim Audit &nbsp;//&nbsp; Client Since: May 2026
            </p>
          </div>
        </div>

        {/* Revenue Leakage Frame — Hero */}
        <section className="mb-16">
          <div className="bg-white border border-stone-200 rounded-sm p-8 sm:p-10 shadow-sm">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-red-600 font-bold">
                  Revenue Leakage Audit
                </span>
              </div>
              <h1
                className="font-serif font-light text-4xl sm:text-5xl leading-tight text-stone-900 mb-6"
                style={{ fontFamily: '"Instrument Serif", serif' }}
              >
                Your website is leaking revenue through unverifiable claims.
              </h1>
              <p className="text-stone-600 text-base sm:text-lg max-w-3xl leading-relaxed">
                Below is a structured inventory of the claims on your website that create regulatory
                liability and AI exclusion risk. Each unsupported or overstated claim represents a
                potential compliance action, ad account suspension, or revenue barrier that is
                entirely preventable.
              </p>
            </div>

            {/* Three Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-stone-200 bg-stone-50/50 rounded-sm p-5 text-center">
                <div className="font-mono text-3xl font-bold text-stone-900">15</div>
                <div className="font-mono text-xs uppercase tracking-wider text-stone-500 mt-1">
                  Claims Extracted
                </div>
              </div>
              <div className="border border-stone-200 bg-stone-50/50 rounded-sm p-5 text-center">
                <div className="font-mono text-3xl font-bold text-amber-700">9</div>
                <div className="font-mono text-xs uppercase tracking-wider text-stone-500 mt-1">
                  Gaps Found
                </div>
              </div>
              <div className="border border-stone-200 bg-stone-50/50 rounded-sm p-5 text-center">
                <div className="font-mono text-3xl font-bold text-red-700">6</div>
                <div className="font-mono text-xs uppercase tracking-wider text-stone-500 mt-1">
                  Require Immediate Action
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Claim Risk Table */}
        <section className="mb-16">
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
            <div className="border-b border-stone-200 px-6 py-5">
              <h2 className="font-serif text-2xl text-stone-900" style={{ fontFamily: '"Instrument Serif", serif' }}>
                Claim Risk Inventory
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Each claim below was extracted from your live website and assessed for regulatory
                risk, AI citation liability, and business impact.
              </p>
            </div>

            {/* Table Header — hidden on small screens */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-stone-50 border-b border-stone-200 font-mono text-[10px] uppercase tracking-wider text-stone-500">
              <div className="col-span-5">Claim</div>
              <div className="col-span-2">Risk Level</div>
              <div className="col-span-3">Business Impact</div>
              <div className="col-span-2">Recommended Action</div>
            </div>

            {/* Table Rows */}
            {claimsData.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-6 py-5 ${
                  idx < claimsData.length - 1 ? 'border-b border-stone-100' : ''
                } hover:bg-stone-50/50 transition-colors`}
              >
                {/* Claim Text */}
                <div className="sm:col-span-5">
                  <div className="sm:hidden font-mono text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                    Claim
                  </div>
                  <span className="text-sm text-stone-900 font-medium leading-relaxed">
                    {item.claim}
                  </span>
                </div>

                {/* Risk Level */}
                <div className="sm:col-span-2">
                  <div className="sm:hidden font-mono text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                    Risk Level
                  </div>
                  <span
                    className={`inline-block font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-sm font-bold ${item.riskColor}`}
                  >
                    {item.riskLevel}
                  </span>
                </div>

                {/* Business Impact */}
                <div className="sm:col-span-3">
                  <div className="sm:hidden font-mono text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                    Business Impact
                  </div>
                  <span className="text-sm text-stone-600 leading-relaxed">{item.impact}</span>
                </div>

                {/* Recommended Action */}
                <div className="sm:col-span-2">
                  <div className="sm:hidden font-mono text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                    Recommended Action
                  </div>
                  <span className="text-sm font-mono text-stone-700">{item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Impact Summary */}
        <section className="mb-16">
          <div className="bg-white border border-stone-200 rounded-sm p-8 sm:p-10 shadow-sm">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                Revenue at Risk
              </span>
            </div>
            <h2
              className="font-serif text-3xl sm:text-4xl text-stone-900 mb-8"
              style={{ fontFamily: '"Instrument Serif", serif' }}
            >
              Estimated Risk Exposure
            </h2>

            <div className="space-y-5">
              {/* Item 1 */}
              <div className="flex items-start gap-4 border-b border-stone-100 pb-5">
                <div className="w-10 h-10 rounded-sm bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                  <Ban className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold text-stone-900 mb-1">
                    Ad Account Freeze Risk
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    <span className="font-mono text-amber-700 font-bold">$5,000–$7,500/week</span> in
                    lost paid media if Google or Meta flags overstated claims and suspends your ad
                    account. Recovery typically takes 2–4 weeks.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4 border-b border-stone-100 pb-5">
                <div className="w-10 h-10 rounded-sm bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold text-stone-900 mb-1">
                    LegitScript Denial
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Blocks all Google and Meta advertising indefinitely. Without LegitScript
                    certification, your practice cannot run any paid search or social campaigns — a
                    complete marketing blackout.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-4 border-b border-stone-100 pb-5">
                <div className="w-10 h-10 rounded-sm bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold text-stone-900 mb-1">
                    Regulatory Fine Exposure
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Up to{' '}
                    <span className="font-mono text-red-700 font-bold">$50,000</span> per state
                    medical board violation for unsubstantiated clinical claims. Multiple states may
                    pursue concurrent investigations.
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-start gap-4 pt-2">
                <div className="w-10 h-10 rounded-sm bg-stone-900 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-mono text-base font-bold text-stone-900 mb-1">
                    Total Estimated Revenue at Risk
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    <span className="font-mono text-2xl font-bold text-stone-900">
                      $120,000 — $250,000
                    </span>
                    <br />
                    <span className="text-xs text-stone-400">
                      Combined annual exposure across ad spend disruption, regulatory fines, and
                      lost patient acquisition.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps — CTA */}
        <section className="mb-16">
          <div className="bg-stone-900 text-stone-50 rounded-sm p-8 sm:p-12 text-center shadow-md">
            <h2
              className="font-serif text-3xl sm:text-4xl text-stone-50 mb-4"
              style={{ fontFamily: '"Instrument Serif", serif' }}
            >
              Don't leave revenue on the table.
            </h2>
            <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              This snapshot identified the most urgent gaps. A full Claim Intelligence Report
              includes detailed remediation guidance, safer rewrite options for every flagged claim,
              AI answer reality simulations, and a compliance-ready action plan.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white text-stone-900 font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-stone-100 transition-colors shadow-sm"
            >
              Full Claim Intelligence Report — $299 <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-stone-500 text-xs mt-4 font-mono uppercase tracking-wider">
              One-time purchase. Includes 14-day revision window.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200 pt-8 pb-12 text-center">
          <p className="text-xs text-stone-500 leading-relaxed max-w-2xl mx-auto">
            This report was generated by AuditGPT for Radiance Media Group. Scrutexity.com · Claim
            intelligence for medical aesthetics.
          </p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mt-4">
            Powered by AuditGPT
          </p>
          <p className="text-[10px] text-stone-400 mt-3 max-w-xl mx-auto leading-relaxed">
            AuditGPT reviews public website claims against visible evidence. This report is a
            diagnostic review only — it does not constitute legal, medical, regulatory, or clinical
            advice, and does not guarantee compliance, ad account approval, AI answer changes, or
            revenue outcomes.
          </p>
        </footer>
      </main>
    </div>
  );
}
