'use client';

import React from 'react';
import { Logo } from '@/components/logo';

export default function ProvisionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] text-stone-900 font-sans selection:bg-stone-200">

      {/* Global Header */}
      <header className="border-b border-stone-200/50 bg-white/40 backdrop-blur-md print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <div className="flex items-center gap-4">
            <a href="/security" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900">Trust &amp; Security</a>
            <a href="/pricing" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900">Pricing</a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-32 w-full text-center">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-6 text-stone-900" style={{ fontFamily: '"Instrument Serif", serif' }}>
          Nothing to provision
        </h1>
        <p className="text-lg text-stone-600 font-light leading-relaxed mb-10">
          AuditGPT runs on public web pages. There are no API tokens to submit, no booking system to connect, and no patient data involved. To run an audit, you just give us a URL.
        </p>
        <a href="/snapshot" className="bg-stone-900 text-white font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-stone-800 transition-colors inline-block">
          Get a Free Snapshot
        </a>
      </main>

      <footer className="border-t border-stone-200 mt-auto bg-white print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-stone-500 font-mono">
          System 01 // AuditGPT <br />
          <a href="https://scrutexity.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 underline hover:text-stone-800 transition-colors">Parent company: Scrutexity →</a>
        </div>
      </footer>
    </div>
  );
}
