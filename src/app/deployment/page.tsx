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
              Trust & Security
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
            <div className="relative flex h-2 w-2 print:hidden">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            System: Active <span className="opacity-50">|</span> Last Updated: June 2026
          </div>
          <button 
            onClick={() => window.print()}
            className="font-mono text-[10px] uppercase tracking-widest border border-stone-300 px-4 py-2 hover:bg-white hover:border-stone-400 transition-all shadow-sm rounded-sm text-stone-600 print:hidden"
          >
            [↓] Download Deployment Specs
          </button>
        </header>

        {/* Hero Section */}
        <section className="mb-24 print:break-inside-avoid print:mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-stone-900 font-serif" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Deployment Architecture
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            Strict boundaries and zero-risk integration. Scrutexity is designed to run in parallel to your clinic's existing infrastructure. We map demand leakage and enforce claim governance without ever bottlenecking your core operations or altering your Practice Management System.
          </p>
        </section>

        {/* 01: Integration Boundaries */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            01
          </div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">
            Integration Boundaries
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="print:break-inside-avoid">
              <h3 className="text-stone-900 font-medium mb-2">Zero-Downtime, Read-Only Link</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                We utilize read-only API connections to measure data flow. Because we do not write to your database, a failure on our end simply pauses your analytics; it can never halt your booking flow or take down your website.
              </p>
            </div>
            <div className="print:break-inside-avoid">
              <h3 className="text-stone-900 font-medium mb-2">PMS Safety Guarantee</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Whether you use Boulevard, Mangomint, or a custom stack, Scrutexity sits in parallel to your Practice Management System. We act as a passive monitoring layer, preserving your existing source of truth.
              </p>
            </div>
          </div>

          {/* Visual Architecture Diagram (CSS-based) */}
          <div className="bg-white border border-stone-200 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs uppercase tracking-wider text-center shadow-sm print:shadow-none print:border-black print:break-inside-avoid">
            <div className="w-full md:w-1/3 border border-stone-200 bg-stone-50 p-6 rounded-md text-stone-500 print:border-stone-400">
              Live Clinic App<br/>
              <span className="text-[10px] opacity-70 lowercase">boulevard / mangomint</span>
            </div>
            
            {/* Connection Flow */}
            <div className="flex md:flex-col items-center gap-2 text-stone-400">
              <span className="text-[10px] tracking-widest">Read-Only</span>
              <div className="w-8 h-[1px] md:w-[1px] md:h-8 bg-stone-300 print:bg-stone-500"></div>
              <span className="text-[10px] tracking-widest">Async</span>
            </div>
            
            <div className="w-full md:w-1/3 border-2 border-stone-800 bg-stone-900 text-stone-100 p-6 rounded-md shadow-lg relative print:bg-white print:text-black print:border-stone-400 print:shadow-none">
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white print:border-black"></div>
              Scrutexity Engine<br/>
              <span className="text-[10px] text-stone-400 lowercase print:text-stone-600">telemetry ingress</span>
            </div>
          </div>
        </section>

        {/* 02: Radar Pilot Rollout */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            02
          </div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">
            Radar Pilot Implementation Path
          </h2>
          <p className="text-stone-600 mb-12 leading-relaxed max-w-2xl">
            Enterprise procurement requires evidence before full deployment. The Radar Pilot is a strict, three-phase rollout designed to establish your baseline yield model and prove demand leakage before you commit to governance enforcement.
          </p>

          {/* Stepper Timeline */}
          <div className="relative border-l border-stone-200 ml-3 md:ml-4 space-y-12 pb-4">
            
            {/* Step 1 */}
            <div className="relative pl-8 md:pl-12 print:break-inside-avoid">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-stone-900 rounded-full outline outline-4 outline-[#faf9f8] print:border print:border-black print:bg-black"></div>
              <span className="font-mono text-xs text-stone-500 tracking-widest uppercase mb-1 block">Phase 1</span>
              <h3 className="text-lg font-medium text-stone-900 mb-2">Infrastructure Assessment</h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
                We map your external claims and current booking routing without touching live data. This establishes the structural perimeter of your positioning risk and identifies where traffic is most likely leaking.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative pl-8 md:pl-12 print:break-inside-avoid">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-stone-400 rounded-full outline outline-4 outline-[#faf9f8] print:border print:border-black print:bg-stone-400"></div>
              <span className="font-mono text-xs text-stone-500 tracking-widest uppercase mb-1 block">Phase 2</span>
              <h3 className="text-lg font-medium text-stone-900 mb-2">Baseline Telemetry Activation</h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
                We activate the read-only SQLite/React backend to hydrate live KPIs. Over 14 days, the system measures your actual traffic against executed bookings to calculate hard demand leakage and lost yield.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-8 md:pl-12 print:break-inside-avoid">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-white border-2 border-stone-300 rounded-full outline outline-4 outline-[#faf9f8] print:border-stone-500"></div>
              <span className="font-mono text-xs text-stone-500 tracking-widest uppercase mb-1 block">Phase 3</span>
              <h3 className="text-lg font-medium text-stone-900 mb-2">Governance Enforcement</h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
                Only after the yield model is proven do we roll out the full AI Visibility Scanner to your clinical and marketing teams, providing them with continuous, always-on claim auditing.
              </p>
            </div>
            
          </div>
        </section>

        {/* 03: IT & Procurement FAQ */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            03
          </div>
          <h2 className="text-2xl font-medium mb-8 text-stone-900 border-b border-stone-200 pb-4">
            IT & Procurement Directives
          </h2>
          
          <dl className="space-y-10">
            <div className="print:break-inside-avoid">
              <dt className="text-lg font-medium text-stone-900 mb-2">What permissions do you require from our Practice Management System?</dt>
              <dd className="text-stone-600 leading-relaxed">
                <strong>Strictly read-only.</strong> When integrating with systems like Boulevard or Mangomint, the Radar Pilot requires only read-access API tokens to measure demand leakage and audit baseline yield. We do not request, require, or accept write permissions. We cannot alter your booking calendar, modify patient records, or change pricing configurations.
              </dd>
            </div>

            <div className="print:break-inside-avoid">
              <dt className="text-lg font-medium text-stone-900 mb-2">How does the system handle Patient Health Information (PHI)?</dt>
              <dd className="text-stone-600 leading-relaxed">
                <strong>Through strict edge-redaction.</strong> Scrutexity operates as a clinical demand governance tool, not an EMR. Any inbound telemetry passing through our Twilio ingress point is automatically sanitized of identifiable PHI before it reaches the core intelligence engine. We evaluate the claim and the demand, not the patient identity.
              </dd>
            </div>

            <div className="print:break-inside-avoid">
              <dt className="text-lg font-medium text-stone-900 mb-2">What happens to our clinic operations if Scrutexity goes down?</dt>
              <dd className="text-stone-600 leading-relaxed">
                <strong>Nothing.</strong> Our infrastructure is deployed in parallel to your core systems, not inline. Because our telemetry and AI Visibility Scanners execute asynchronously, a disruption on our end has zero performance impact on your live booking site or clinic operations. We operate with a strict zero-downtime integration philosophy.
              </dd>
            </div>

            <div className="print:break-inside-avoid">
              <dt className="text-lg font-medium text-stone-900 mb-2">How difficult is it to terminate the Radar Pilot or revoke access?</dt>
              <dd className="text-stone-600 leading-relaxed">
                <strong>Instant and unilateral.</strong> Because we rely on read-only API tokens generated by your PMS, your IT team retains total control. Revoking the token on your end instantly severs our access. Upon termination, all transient telemetry data is hard-purged from our active databases in accordance with our 30-day TTL (Time to Live) retention policy.
              </dd>
            </div>
          </dl>
          
          <div className="mt-12 p-6 bg-stone-100 border-l-2 border-stone-400 print:break-inside-avoid">
            <h3 className="font-medium text-stone-900 mb-2">Formal Procurement Scope</h3>
            <p className="text-sm text-stone-600 mb-4">
              All boundaries, data handling policies, and unilateral revocation rights are legally codified in our standard Pilot Agreement.
            </p>
            <a href="/pilot-agreement" className="font-mono text-xs uppercase tracking-widest text-stone-900 bg-white border border-stone-300 px-4 py-2 hover:bg-stone-50 transition-colors inline-block shadow-sm">
              Review Pilot Agreement →
            </a>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16 pt-12 border-t border-stone-200 flex flex-col items-center text-center print:hidden">
          <h2 className="text-2xl font-medium text-stone-900 mb-4">Ready to establish your baseline?</h2>
          <p className="text-stone-600 mb-8 max-w-xl">
            Deploy the Radar Pilot today. No upfront financial commitments. No invasive integrations. Just raw telemetry and proven demand leakage.
          </p>
          <a href="/pricing" className="bg-stone-900 text-white font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-stone-800 transition-colors shadow-sm inline-block">
            Initialize Radar Pilot
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
