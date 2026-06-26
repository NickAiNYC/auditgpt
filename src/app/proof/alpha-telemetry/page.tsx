'use client';

import React from 'react';
import { Logo } from '@/components/logo';

export default function AlphaTelemetryPage() {
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
            <a href="/deployment" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden sm:inline-block">
              Deployment
            </a>
            <a href="/security" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900">
              Security →
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 md:py-32 w-full print:m-0 print:p-8">
        
        {/* Status Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-8 border-b border-stone-200 mb-16 print:mb-8">
          <div className="font-mono text-[10px] text-stone-500 uppercase tracking-widest flex items-center gap-3">
            <div className="relative flex h-2 w-2 print:hidden">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-500"></span>
            </div>
            Document Type: Redacted Telemetry <span className="opacity-50">|</span> Client: [CL-942]
          </div>
          <button 
            onClick={() => window.print()}
            className="font-mono text-[10px] uppercase tracking-widest border border-stone-300 px-4 py-2 hover:bg-white hover:border-stone-400 transition-all shadow-sm rounded-sm text-stone-600 print:hidden"
          >
            [↓] Export Artifact
          </button>
        </header>

        {/* Hero Section */}
        <section className="mb-16 print:break-inside-avoid">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-stone-900 font-serif" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Alpha Telemetry Record
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            Declassified proof artifact generated during a 14-day Radar Pilot. This document illustrates the transition from baseline yield mapping to actionable governance and measurable leakage reduction. Identifying PHI and proprietary pricing data has been redacted.
          </p>
        </section>

        {/* Redacted Data Blocks */}
        <div className="space-y-8">
          
          {/* Block 1: The Environment */}
          <section className="bg-stone-900 text-stone-100 p-8 rounded-sm font-mono text-sm print:bg-white print:text-black print:border print:border-stone-400 print:break-inside-avoid">
            <h2 className="text-stone-400 uppercase tracking-widest text-xs mb-6 pb-2 border-b border-stone-700 print:text-stone-600 print:border-stone-300">
              01. System Environment & Baseline
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <span className="text-stone-500 print:text-stone-600 block mb-1">Target:</span>
                <span className="bg-stone-800 px-2 py-1 rounded-sm print:bg-stone-100">[REDACTED_CLINIC_A] (High-Volume Medspa, NY)</span>
              </div>
              <div>
                <span className="text-stone-500 print:text-stone-600 block mb-1">Duration:</span>
                <span className="bg-stone-800 px-2 py-1 rounded-sm print:bg-stone-100">14 Days</span>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <span className="text-stone-500 print:text-stone-600 block mb-1">Methodology:</span>
                <span className="bg-stone-800 px-2 py-1 rounded-sm print:bg-stone-100">Read-only parallel connection to existing booking software.</span>
              </div>
            </div>
          </section>

          {/* Block 2: Identified Leakage */}
          <section className="bg-white border border-stone-200 p-8 rounded-sm font-mono text-sm print:break-inside-avoid shadow-sm print:shadow-none">
            <h2 className="text-stone-500 uppercase tracking-widest text-xs mb-6 pb-2 border-b border-stone-200">
              02. Telemetry: Identified Leakage
            </h2>
            <p className="text-stone-700 font-sans mb-6">
              During the initial 14-day observation window, the telemetry scanner established a parallel connection and monitored the conversion gap between high-intent interactions on target claim surfaces and the execution of booking objects within the PMS.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <span className="text-stone-500">Missed High-Value Opportunities:</span>
                <span className="font-bold text-stone-900">412 Events</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <span className="text-stone-500">Unsubstantiated Clinical Claims:</span>
                <span className="font-bold text-stone-900">14 Surfaces</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-stone-500">Calculated Demand Leakage:</span>
                <span className="font-bold text-red-700">~ $8,400 / wk</span>
              </div>
              <div className="text-xs text-stone-400 font-sans italic mt-1">
                * "Missed high-value" defined as users spending &gt; 60s on unsupported clinical claims before abandoning the session without completing the integration form.
              </div>
            </div>
          </section>

          {/* Block 3: Actionable Governance */}
          <section className="bg-stone-50 border border-stone-200 p-8 rounded-sm font-mono text-sm print:bg-white print:break-inside-avoid">
            <h2 className="text-stone-500 uppercase tracking-widest text-xs mb-6 pb-2 border-b border-stone-200">
              03. Actionable Governance Applied
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-emerald-600 mt-0.5">[+]</div>
                <div>
                  <div className="font-bold text-stone-900 mb-1">Mitigation Path 01: Evidence Binding</div>
                  <div className="text-stone-600 text-xs">Linked missing clinical study PDFs directly to the "Painless Recovery" claim on the primary landing page.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-emerald-600 mt-0.5">[+]</div>
                <div>
                  <div className="font-bold text-stone-900 mb-1">Mitigation Path 02: Provider Validation</div>
                  <div className="text-stone-600 text-xs">Updated bio credentials for Dr. ██████ to align with the specific treatment promises made in the Q3 ad campaign.</div>
                </div>
              </div>
            </div>
          </section>

          {/* Block 4: Yield Proof */}
          <section className="bg-white border-2 border-stone-900 p-8 rounded-sm font-mono text-sm print:break-inside-avoid relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-stone-100 -rotate-45 transform translate-x-8 -translate-y-8 border-b border-stone-200"></div>
            <h2 className="text-stone-900 font-bold uppercase tracking-widest text-xs mb-6 pb-2 border-b border-stone-200">
              04. Yield Proof (T+14)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-stone-600 font-sans text-sm leading-relaxed">
                  Following the application of actionable governance, the telemetry scanner recorded a distinct stabilization in the booking funnel. The abandonment rate on the primary claim surface dropped.
                </p>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-4 text-center rounded-sm">
                <div className="text-stone-500 uppercase text-[10px] tracking-widest mb-2">Verified Yield Recovery</div>
                <div className="text-3xl font-bold text-emerald-700">+ $5,150</div>
                <div className="text-[10px] text-stone-400 mt-1 uppercase">Captured in 7 days post-governance</div>
              </div>
            </div>
          </section>

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
