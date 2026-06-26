'use client';

import React from 'react';
import { Logo } from '@/components/logo';

export default function ProofCenterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] text-stone-900 font-sans selection:bg-stone-200">

      {/* Global Header */}
      <header className="border-b border-stone-200/50 bg-white/40 backdrop-blur-md print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <div className="flex items-center gap-4">
            <a href="/deployment" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden sm:inline-block">
              How it works
            </a>
            <a href="/security" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900">
              Trust &amp; Security
            </a>
            <a href="/pricing" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900">
              Pricing
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-20 md:py-32 w-full print:m-0 print:p-8">

        {/* Status Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-8 border-b border-stone-200 mb-16 print:mb-8">
          <div className="font-mono text-[10px] text-stone-500 uppercase tracking-widest flex items-center gap-3">
            Proof Center <span className="opacity-50">|</span> Access: Public
          </div>
          <button
            onClick={() => window.print()}
            className="font-mono text-[10px] uppercase tracking-widest border border-stone-300 px-4 py-2 hover:bg-white hover:border-stone-400 transition-all shadow-sm rounded-sm text-stone-600 print:hidden"
          >
            [↓] Print Index
          </button>
        </header>

        {/* Hero Section */}
        <section className="mb-20 print:break-inside-avoid">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-stone-900" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Proof Center
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            What AuditGPT produces, and how we describe our own posture &mdash; for buyers, IT, and anyone evaluating the tool. We link only to things that are real.
          </p>
        </section>

        {/* Index Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* Column 1 */}
          <div className="space-y-12">

            <section className="print:break-inside-avoid">
              <h2 className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-stone-300"></span> 01. See the output
              </h2>
              <div className="space-y-4">
                <a href="/sample-report" className="block group bg-white border border-stone-200 p-6 rounded-sm hover:border-stone-400 transition-colors shadow-sm print:shadow-none">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-stone-900 group-hover:underline decoration-stone-300 underline-offset-4">Sample Claim Report</h3>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Sample</span>
                  </div>
                  <p className="text-sm text-stone-600">Exactly what a finished AuditGPT report looks like, claim by claim &mdash; on an illustrative example company.</p>
                </a>
              </div>
            </section>

            <section className="print:break-inside-avoid">
              <h2 className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-stone-300"></span> 02. How it runs
              </h2>
              <div className="space-y-4">
                <a href="/deployment" className="block group bg-white border border-stone-200 p-6 rounded-sm hover:border-stone-400 transition-colors shadow-sm print:shadow-none">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-stone-900 group-hover:underline decoration-stone-300 underline-offset-4">How AuditGPT works</h3>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Public</span>
                  </div>
                  <p className="text-sm text-stone-600">What AuditGPT runs on, and what it never touches. No integration, no access, no PHI.</p>
                </a>
                <a href="/security" className="block group bg-white border border-stone-200 p-6 rounded-sm hover:border-stone-400 transition-colors shadow-sm print:shadow-none">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-stone-900 group-hover:underline decoration-stone-300 underline-offset-4">Trust &amp; Security</h3>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Public</span>
                  </div>
                  <p className="text-sm text-stone-600">What we access, what we store, and what we don&rsquo;t claim &mdash; in plain English.</p>
                </a>
              </div>
            </section>

          </div>

          {/* Column 2 */}
          <div className="space-y-12">

            <section className="print:break-inside-avoid">
              <h2 className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-stone-300"></span> 03. Case studies
              </h2>
              <div className="bg-stone-50 border border-stone-200 p-8 rounded-sm shadow-sm print:shadow-none">
                <p className="text-sm text-stone-600 leading-relaxed">
                  We publish redacted audits as we complete them, with client permission. We don&rsquo;t post invented examples, and we don&rsquo;t gate fabricated &ldquo;SOC2 reports&rdquo; or &ldquo;penetration test results&rdquo; behind an NDA &mdash; we don&rsquo;t have those, and we won&rsquo;t imply we do. When real case studies exist, they&rsquo;ll appear here.
                </p>
              </div>
            </section>

            <section className="print:break-inside-avoid">
              <h2 className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-stone-300"></span> 04. Run one
              </h2>
              <div className="bg-stone-50 border border-stone-200 p-8 rounded-sm shadow-sm print:shadow-none">
                <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                  The fastest proof is your own page. Point AuditGPT at one buyer-facing URL and see which claims hold up.
                </p>
                <a href="/snapshot" className="inline-block font-mono text-[10px] uppercase tracking-widest border border-stone-300 px-4 py-2 hover:bg-white transition-all rounded-sm text-stone-600 bg-white">
                  Get a Free Snapshot →
                </a>
              </div>
            </section>

          </div>

        </div>

      </main>

      <footer className="border-t border-stone-200 mt-auto bg-white print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-stone-500 font-mono">
          System 01 // AuditGPT <br />
          <a href="https://scrutexity.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 underline hover:text-stone-800 transition-colors">
            Parent company: Scrutexity →
          </a>
        </div>
      </footer>
    </div>
  );
}
