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
              Deployment
            </a>
            <a href="/security" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900">
              Security →
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-20 md:py-32 w-full print:m-0 print:p-8">
        
        {/* Status Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-8 border-b border-stone-200 mb-16 print:mb-8">
          <div className="font-mono text-[10px] text-stone-500 uppercase tracking-widest flex items-center gap-3">
            <div className="relative flex h-2 w-2 print:hidden">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            System Index: Trust Artifacts <span className="opacity-50">|</span> Access: Public
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
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-stone-900 font-serif" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Enterprise Proof Center
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            A centralized index of Scrutexity's infrastructural documentation, governance protocols, and declassified telemetry records. This hub is maintained for the explicit use of enterprise IT, legal, and procurement teams evaluating the Scrutexity engine.
          </p>
        </section>

        {/* Index Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Column 1 */}
          <div className="space-y-12">
            
            <section className="print:break-inside-avoid">
              <h2 className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-stone-300"></span> 01. Trust & Infrastructure
              </h2>
              <div className="space-y-4">
                <a href="/security" className="block group bg-white border border-stone-200 p-6 rounded-sm hover:border-stone-400 transition-colors shadow-sm print:shadow-none">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-stone-900 group-hover:underline decoration-stone-300 underline-offset-4">Security & Subprocessor Matrix</h3>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Public</span>
                  </div>
                  <p className="text-sm text-stone-600">SOC2 compliance posture, edge-redaction of PHI, and data retention guarantees.</p>
                </a>
              </div>
            </section>

            <section className="print:break-inside-avoid">
              <h2 className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-stone-300"></span> 02. Integration & Procurement
              </h2>
              <div className="space-y-4">
                <a href="/deployment" className="block group bg-white border border-stone-200 p-6 rounded-sm hover:border-stone-400 transition-colors shadow-sm print:shadow-none">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-stone-900 group-hover:underline decoration-stone-300 underline-offset-4">Deployment Architecture</h3>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Public</span>
                  </div>
                  <p className="text-sm text-stone-600">Visual mapping of the read-only, asynchronous PMS integration and pilot timeline.</p>
                </a>
              </div>
            </section>

          </div>

          {/* Column 2 */}
          <div className="space-y-12">

            <section className="print:break-inside-avoid">
              <h2 className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-stone-300"></span> 03. Telemetry & Case Studies
              </h2>
              <div className="space-y-4">
                <div className="bg-stone-100 border border-stone-200 border-dashed p-6 rounded-sm flex items-center justify-center print:hidden h-32">
                  <span className="font-mono text-xs text-stone-400 uppercase tracking-widest">Records pending declassification...</span>
                </div>
              </div>
            </section>

            <section className="print:break-inside-avoid">
              <h2 className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-stone-300"></span> 04. Gated Artifacts
              </h2>
              <div className="bg-stone-50 border border-stone-200 p-8 rounded-sm shadow-sm print:shadow-none">
                <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                  Certain documents (Full SOC2 Type II Reports, Penetration Test Results, and unredacted yielding models) require a signed Non-Disclosure Agreement (NDA) prior to distribution.
                </p>
                <a href="mailto:security@scrutexity.com?subject=NDA%20Document%20Request" className="inline-block font-mono text-[10px] uppercase tracking-widest border border-stone-300 px-4 py-2 hover:bg-white transition-all rounded-sm text-stone-600 bg-white">
                  Request Gated Artifacts →
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
