'use client';

import React from 'react';
import { Logo } from '@/components/logo';

export default function PilotAgreementPage() {
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
            Document Type: Legal Scope <span className="opacity-50">|</span> Ref: v1.4
          </div>
          <button 
            onClick={() => window.print()}
            className="font-mono text-[10px] uppercase tracking-widest border border-stone-300 px-4 py-2 hover:bg-white hover:border-stone-400 transition-all shadow-sm rounded-sm text-stone-600 print:hidden"
          >
            [↓] Download Agreement
          </button>
        </header>

        {/* Hero Section */}
        <section className="mb-16 print:break-inside-avoid">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-stone-900 font-serif" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Mutual Radar Pilot Agreement
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            This document outlines the strict operational boundaries, data retention policies, and mutual success criteria for deploying the Scrutexity Radar Pilot within enterprise and clinical environments. It serves as the governing scope document prior to token generation.
          </p>
        </section>

        {/* Agreement Text */}
        <div className="bg-white border border-stone-200 p-8 md:p-12 shadow-sm rounded-sm text-sm text-stone-700 leading-relaxed space-y-8 print:shadow-none print:border-none print:p-0">
          
          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-stone-900 font-bold mb-4 border-b border-stone-200 pb-2">1. Integration Scope & Boundaries</h2>
            <p className="mb-4">
              <strong>1.1 Read-Only Requirement.</strong> Scrutexity requires strictly read-only API tokens to connect to the Client's Practice Management System (PMS). The Client retains full administrative control. Scrutexity explicitly waives any right or capability to write, modify, delete, or alter any scheduling, pricing, or patient data within the core system.
            </p>
            <p>
              <strong>1.2 Zero-Downtime Guarantee.</strong> The Radar Pilot architecture operates as a parallel telemetry layer. It executes asynchronously and out-of-band. The Client acknowledges that Scrutexity cannot act as an operational bottleneck; a failure of the Scrutexity system will have zero impact on the uptime of the Client's live booking flow.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-stone-900 font-bold mb-4 border-b border-stone-200 pb-2">2. Data Handling & Edge-Redaction</h2>
            <p className="mb-4">
              <strong>2.1 Ingress Sanitization.</strong> All telemetry routed to Scrutexity passes through a Twilio-secured ingress point where automated heuristics proactively identify and redact potential Patient Health Information (PHI). The core intelligence engine evaluates clinical demand metadata exclusively.
            </p>
            <p>
              <strong>2.2 Intelligence Provider Restrictions.</strong> Scrutexity mandates zero-training, zero-retention clauses with all LLM intelligence providers (e.g., Anthropic). Client telemetry is processed transiently and is never utilized to train external foundational models.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-stone-900 font-bold mb-4 border-b border-stone-200 pb-2">3. Retention and Hard Purge Policy</h2>
            <p className="mb-4">
              <strong>3.1 30-Day TTL (Time to Live).</strong> System audit logs and transient telemetry utilized for yield calculation are retained for a maximum of thirty (30) days strictly for the purpose of generating the Baseline Intelligence Report.
            </p>
            <p>
              <strong>3.2 Hard Purge.</strong> Upon expiration of the 30-day TTL, or immediately upon pilot termination by the Client, all associated telemetry data is permanently and irrecoverably purged from Scrutexity's active databases.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-stone-900 font-bold mb-4 border-b border-stone-200 pb-2">4. Unilateral Revocation & Termination</h2>
            <p className="mb-4">
              <strong>4.1 Client Revocation Rights.</strong> The Client retains the absolute right to unilaterally terminate the Radar Pilot at any time without prior notice by revoking the issued read-only API token within their PMS. 
            </p>
            <p>
              <strong>4.2 Post-Revocation Actions.</strong> Revocation of the token instantly severs Scrutexity's access. Following revocation, Scrutexity will cease all telemetry collection and initiate the data purge protocol (Section 3.2). No exit interviews or offboarding engineering tickets are required.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-stone-900 font-bold mb-4 border-b border-stone-200 pb-2">5. Success Criteria & Phase Transition</h2>
            <p>
              <strong>5.1 Transition to Governance.</strong> The primary deliverable of the Radar Pilot is the Demand Leakage Audit & Yield Proof. The Client is under no obligation to transition from the Radar Pilot to a full Governance Enforcement subscription. Transition requires explicit, secondary mutual authorization based on the hard yield calculations provided during the pilot phase.
            </p>
          </section>

          <section className="mt-12 pt-8 border-t-2 border-stone-900 print:mt-16 print:pt-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-stone-900 font-bold mb-8">6. Execution & Authorization</h2>
            <p className="text-stone-600 text-sm mb-12">
              By generating and provisioning the read-only API token, the Client's IT Lead acknowledges and authorizes the Integration Scope and Boundaries as defined in Section 1. If physical signature is required by procurement, please execute below.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
              <div>
                <div className="border-b border-stone-400 h-8 mb-2"></div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Client / IT Authorization</div>
                <div className="flex gap-4 mt-6">
                  <div className="flex-1 border-b border-stone-300 h-6"></div>
                  <div className="w-24 border-b border-stone-300 h-6"></div>
                </div>
                <div className="flex gap-4 mt-1">
                  <div className="flex-1 font-mono text-[10px] text-stone-400">Print Name & Title</div>
                  <div className="w-24 font-mono text-[10px] text-stone-400">Date</div>
                </div>
              </div>
              
              <div>
                <div className="border-b border-stone-400 h-8 mb-2 flex items-end pb-1">
                  <span className="font-serif italic text-lg text-stone-800">Scrutexity Systems</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Provider Authorization</div>
                <div className="flex gap-4 mt-6">
                  <div className="flex-1 border-b border-stone-300 h-6 flex items-end pb-1">
                    <span className="font-mono text-xs text-stone-700">Systems Architect</span>
                  </div>
                  <div className="w-24 border-b border-stone-300 h-6 flex items-end pb-1">
                    <span className="font-mono text-xs text-stone-700">Pre-Auth</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-1">
                  <div className="flex-1 font-mono text-[10px] text-stone-400">Print Name & Title</div>
                  <div className="w-24 font-mono text-[10px] text-stone-400">Date</div>
                </div>
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
