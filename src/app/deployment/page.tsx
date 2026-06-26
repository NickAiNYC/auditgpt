'use client';

import React from 'react';
import { Logo } from '@/components/logo';

export default function DeploymentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] text-stone-900 font-sans selection:bg-stone-200">

      {/* Global Header */}
      <header className="border-b border-stone-200/50 bg-white/40 backdrop-blur-md print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <div className="flex items-center gap-4">
            <a href="/proof" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden sm:inline-block">
              Proof Center
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

      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 md:py-32 w-full print:m-0 print:p-8">

        {/* Status Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-8 border-b border-stone-200 mb-16 print:mb-8">
          <div className="font-mono text-[10px] text-stone-500 uppercase tracking-widest flex items-center gap-3">
            How It Works <span className="opacity-50">|</span> Last Updated: June 2026
          </div>
          <button
            onClick={() => window.print()}
            className="font-mono text-[10px] uppercase tracking-widest border border-stone-300 px-4 py-2 hover:bg-white hover:border-stone-400 transition-all shadow-sm rounded-sm text-stone-600 print:hidden"
          >
            [↓] Print this page
          </button>
        </header>

        {/* Hero Section */}
        <section className="mb-24 print:break-inside-avoid print:mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-stone-900" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Nothing to install. Nothing to connect.
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            AuditGPT runs entirely on the public pages you point it at. There is no integration with your website, your booking system, or your data &mdash; so there is nothing to deploy and no access to grant.
          </p>
        </section>

        {/* 01: How an audit runs */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">01</div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">How an audit runs</h2>
          <div className="relative border-l border-stone-200 ml-3 md:ml-4 space-y-12 pb-4">
            <div className="relative pl-8 md:pl-12 print:break-inside-avoid">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-stone-900 rounded-full outline outline-4 outline-[#faf9f8] print:border print:border-black print:bg-black"></div>
              <span className="font-mono text-xs text-stone-500 tracking-widest uppercase mb-1 block">Step 1</span>
              <h3 className="text-lg font-medium text-stone-900 mb-2">You submit a URL</h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">Give us a single buyer-facing page where you make your biggest claims. No login, no token, no access to anything private.</p>
            </div>
            <div className="relative pl-8 md:pl-12 print:break-inside-avoid">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-stone-400 rounded-full outline outline-4 outline-[#faf9f8] print:border print:border-black print:bg-stone-400"></div>
              <span className="font-mono text-xs text-stone-500 tracking-widest uppercase mb-1 block">Step 2</span>
              <h3 className="text-lg font-medium text-stone-900 mb-2">We read the public page</h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">AuditGPT extracts the claims a visitor can see and checks each one against the proof that&rsquo;s visible on the page.</p>
            </div>
            <div className="relative pl-8 md:pl-12 print:break-inside-avoid">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-white border-2 border-stone-300 rounded-full outline outline-4 outline-[#faf9f8] print:border-stone-500"></div>
              <span className="font-mono text-xs text-stone-500 tracking-widest uppercase mb-1 block">Step 3</span>
              <h3 className="text-lg font-medium text-stone-900 mb-2">You get a report</h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">A one-page snapshot showing which claims are supported, which need evidence, and a safer rewrite for each.</p>
            </div>
          </div>
        </section>

        {/* 02: What it does not require */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">02</div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">What it does not require</h2>
          <ul className="space-y-6">
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">No integration with your systems</strong>
                <span className="text-stone-600 text-sm leading-relaxed">No connection to Boulevard, Mangomint, an EMR, a CRM, or your booking system. AuditGPT never touches them.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">No access, no credentials, no PHI</strong>
                <span className="text-stone-600 text-sm leading-relaxed">No API tokens, no logins, no patient data. We only read what a public visitor can already see.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">No risk to your operations</strong>
                <span className="text-stone-600 text-sm leading-relaxed">Because AuditGPT never connects to your live systems, it cannot slow, change, or interrupt anything you run.</span>
              </div>
            </li>
          </ul>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16 pt-12 border-t border-stone-200 flex flex-col items-center text-center print:hidden">
          <h2 className="text-2xl font-medium text-stone-900 mb-4">Run a free snapshot</h2>
          <p className="text-stone-600 mb-8 max-w-xl">
            Point AuditGPT at one public page and see which claims hold up. No account, no integration.
          </p>
          <a href="/snapshot" className="bg-stone-900 text-white font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-stone-800 transition-colors shadow-sm inline-block">
            Get a Free Snapshot
          </a>
        </section>

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
