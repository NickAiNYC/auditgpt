'use client';

import React from 'react';
import { Logo } from '@/components/logo';

export default function SecurityPage() {
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
            Trust &amp; Security <span className="opacity-50">|</span> Last Updated: June 2026
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
            Trust &amp; Security
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            AuditGPT reviews the public, buyer-facing pages you point it at. It does not connect to your internal systems, your booking software, or any patient data. Here is exactly what we access, what we store, and what we don&rsquo;t &mdash; in plain English.
          </p>
        </section>

        {/* 01: What AuditGPT accesses */}
        <section className="mb-24 relative print:break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">01</div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">What AuditGPT accesses</h2>
          <ul className="space-y-6">
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Public web content only</strong>
                <span className="text-stone-600 text-sm leading-relaxed">You give us a URL; we read the public page a visitor would see. We do not request logins, API tokens, or access to any internal system.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">No patient data, no PMS</strong>
                <span className="text-stone-600 text-sm leading-relaxed">AuditGPT reviews marketing and claim copy &mdash; not patient records, EMRs, or booking systems. We never ask for PHI.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Read-only</strong>
                <span className="text-stone-600 text-sm leading-relaxed">We read public pages. AuditGPT cannot change anything on your site or in your systems.</span>
              </div>
            </li>
          </ul>
        </section>

        {/* 02: How we handle data */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">02</div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">How we handle data</h2>
          <ul className="space-y-6">
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Zero-retention model inference</strong>
                <span className="text-stone-600 text-sm leading-relaxed">Page content is processed by our LLM provider (Anthropic) under non-training, zero-retention API terms. Your content is not used to train external models.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">What we store</strong>
                <span className="text-stone-600 text-sm leading-relaxed">The URL you submit and the resulting report. Exportable, and deletable on request.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Encryption</strong>
                <span className="text-stone-600 text-sm leading-relaxed">TLS 1.3 in transit; encrypted at rest (AES-256) on our hosting.</span>
              </div>
            </li>
          </ul>
        </section>

        {/* 03: Subprocessors */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">03</div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">Subprocessors</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">We keep third parties to the minimum needed to run an audit.</p>
          <div className="overflow-x-auto bg-white border border-stone-200 rounded-lg shadow-sm print:shadow-none">
            <table className="w-full text-left border-collapse min-w-[600px] print:break-inside-avoid">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 print:bg-white">
                  <th className="font-mono text-xs uppercase tracking-wider text-stone-500 py-4 px-6 font-medium">Entity</th>
                  <th className="font-mono text-xs uppercase tracking-wider text-stone-500 py-4 px-6 font-medium">Function</th>
                  <th className="font-mono text-xs uppercase tracking-wider text-stone-500 py-4 px-6 font-medium">Data Scope</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-stone-100 last:border-0 print:break-inside-avoid">
                  <td className="py-4 px-6 font-medium text-stone-900">Anthropic</td>
                  <td className="py-4 px-6 text-stone-600">LLM inference (claim analysis)</td>
                  <td className="py-4 px-6 text-stone-600">Public page content. Non-training, zero-retention API terms.</td>
                </tr>
                <tr className="border-b border-stone-100 last:border-0 print:break-inside-avoid">
                  <td className="py-4 px-6 font-medium text-stone-900">Vercel</td>
                  <td className="py-4 px-6 text-stone-600">Application hosting</td>
                  <td className="py-4 px-6 text-stone-600">Encrypted application state and routing.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 04: What we don't claim */}
        <section className="relative break-inside-avoid">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">04</div>
          <h2 className="text-2xl font-medium mb-8 text-stone-900 border-b border-stone-200 pb-4">What we don&rsquo;t claim</h2>
          <dl className="space-y-10">
            <div className="print:break-inside-avoid">
              <dt className="text-lg font-medium text-stone-900 mb-2">Do you hold SOC2 or HIPAA certification?</dt>
              <dd className="text-stone-600 leading-relaxed">Not yet, and we don&rsquo;t claim to. AuditGPT is a founder-led tool that reviews public web pages; access to our systems is limited to the founder and a designated operator. We say so plainly rather than imply controls we haven&rsquo;t completed.</dd>
            </div>
            <div className="print:break-inside-avoid">
              <dt className="text-lg font-medium text-stone-900 mb-2">Do you touch our PMS, booking system, or patient data?</dt>
              <dd className="text-stone-600 leading-relaxed"><strong>No.</strong> AuditGPT reads public marketing pages only. There is no integration with Boulevard, Mangomint, an EMR, or any patient-facing system.</dd>
            </div>
            <div className="print:break-inside-avoid">
              <dt className="text-lg font-medium text-stone-900 mb-2">Do you sell or share our data?</dt>
              <dd className="text-stone-600 leading-relaxed">No. We don&rsquo;t sell or share your data, and we don&rsquo;t use third-party ad pixels to track you.</dd>
            </div>
          </dl>

          {/* Security Contact */}
          <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4 print:break-inside-avoid">
            <div>
              <p className="text-stone-900 font-medium">Security &amp; IT inquiries</p>
              <p className="text-sm text-stone-500">We&rsquo;ll answer questions about access, storage, and deletion before you commit to anything.</p>
            </div>
            <a href="mailto:security@scrutexity.com" className="font-mono text-xs uppercase tracking-widest bg-stone-900 text-white px-6 py-3 rounded-sm hover:bg-stone-800 transition-colors inline-block text-center print:border print:border-black print:text-black print:bg-white">
              security@scrutexity.com
            </a>
          </div>
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
