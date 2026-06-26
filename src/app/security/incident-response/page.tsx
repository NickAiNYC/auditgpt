'use client';

import React from 'react';
import { Logo } from '@/components/logo';

export default function IncidentResponsePage() {
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
              ← Security
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
            Protocol: Active <span className="opacity-50">|</span> Last Updated: June 2026
          </div>
          <button 
            onClick={() => window.print()}
            className="font-mono text-[10px] uppercase tracking-widest border border-stone-300 px-4 py-2 hover:bg-white hover:border-stone-400 transition-all shadow-sm rounded-sm text-stone-600 print:hidden"
          >
            [↓] Download Protocol PDF
          </button>
        </header>

        {/* Hero Section */}
        <section className="mb-24 print:break-inside-avoid print:mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-stone-900 font-serif" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Incident Handling Protocol
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            Operational reliability and containment procedures. Scrutexity maintains a zero-trust telemetry infrastructure designed to contain and mitigate security events strictly at the edge. This document outlines our formal severity matrices, escalation pathways, and disclosure timelines.
          </p>
        </section>

        {/* 01: Severity Tiers & Timelines */}
        <section className="mb-24 relative print:break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            01
          </div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">
            Severity Tiers & Disclosure Timelines
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Incidents are triaged based on potential impact to data integrity, clinical operations, or infrastructure availability. Disclosure timelines are strictly enforced SLAs, not targets.
          </p>
          
          <div className="space-y-6">
            <div className="p-6 bg-white border border-stone-200 rounded-lg print:border-black">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-red-100 text-red-800 font-mono text-[10px] uppercase tracking-widest rounded-sm border border-red-200 print:border-black print:bg-white print:text-black">SEV-1 Critical</span>
                </div>
                <span className="font-mono text-sm text-stone-900">Disclosure SLA: 2 Hours</span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-2">
                <strong>Criteria:</strong> Core intelligence engine failure, edge-redaction bypass, or suspected breach of telemetry ingress resulting in potential data exposure.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                <strong>Action:</strong> Immediate notification to affected IT/Security contacts via prioritized channel. Automatic invocation of Containment Protocol.
              </p>
            </div>

            <div className="p-6 bg-white border border-stone-200 rounded-lg print:border-black">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 font-mono text-[10px] uppercase tracking-widest rounded-sm border border-amber-200 print:border-black print:bg-white print:text-black">SEV-2 High</span>
                </div>
                <span className="font-mono text-sm text-stone-900">Disclosure SLA: 12 Hours</span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-2">
                <strong>Criteria:</strong> Subsystem degradation, telemetry sync delay exceeding 6 hours, or isolated API failures impacting audit execution.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                <strong>Action:</strong> Notification to affected stakeholders with preliminary impact radius. Partial containment if telemetry streams are affected.
              </p>
            </div>

            <div className="p-6 bg-white border border-stone-200 rounded-lg print:border-black">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-stone-100 text-stone-800 font-mono text-[10px] uppercase tracking-widest rounded-sm border border-stone-200 print:border-black print:bg-white print:text-black">SEV-3 Low</span>
                </div>
                <span className="font-mono text-sm text-stone-900">Disclosure SLA: 48 Hours</span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-2">
                <strong>Criteria:</strong> UI rendering anomalies, non-critical latency in report generation, or isolated front-end errors.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                <strong>Action:</strong> Logged internally and bundled into standard weekly status summaries. No direct interruption required.
              </p>
            </div>
          </div>
        </section>

        {/* 02: Escalation Path */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            02
          </div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">
            Escalation Contacts
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Enterprise pilot partners are provided direct escalation pathways bypassing standard support queues.
          </p>
          <ul className="space-y-6">
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Primary Infrastructure Response</strong>
                <span className="text-stone-600 text-sm leading-relaxed block mb-2">For immediate routing to the on-call engineering rotation:</span>
                <a href="mailto:incident@scrutexity.com" className="font-mono text-xs uppercase tracking-widest bg-stone-100 text-stone-800 px-3 py-1 rounded-sm border border-stone-200 hover:bg-stone-200 transition-colors print:border-black print:bg-white">incident@scrutexity.com</a>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Legal & Compliance Escalation</strong>
                <span className="text-stone-600 text-sm leading-relaxed block mb-2">For contract inquiries, BAA review status, or compliance-related notifications:</span>
                <a href="mailto:compliance@scrutexity.com" className="font-mono text-xs uppercase tracking-widest bg-stone-100 text-stone-800 px-3 py-1 rounded-sm border border-stone-200 hover:bg-stone-200 transition-colors print:border-black print:bg-white">compliance@scrutexity.com</a>
              </div>
            </li>
          </ul>
        </section>

        {/* 03: Containment Protocol */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            03
          </div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">
            Containment Protocol
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            In the event of a SEV-1 or elevated SEV-2 anomaly, automated containment procedures are triggered instantly to prevent cascading impact.
          </p>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 font-mono text-sm text-stone-700 print:bg-white print:border-black space-y-4">
            <p><strong>[1] CONNECTION SEVERANCE:</strong> Immediate logical severance of all read-only Practice Management System API tokens tied to the affected deployment. This ensures zero operational impact to the clinic.</p>
            <p><strong>[2] DATA PURGE:</strong> Hard-purge of active transit memory and localized SQLite caches. Because Scrutexity retains no permanent operational records, the blast radius is naturally bounded.</p>
            <p><strong>[3] INGRESS LOCKDOWN:</strong> Twilio-layer webhooks are rejected with 403 Forbidden until the edge-redaction pipeline is re-verified and manually unsealed.</p>
          </div>
        </section>

        {/* 04: Post-Incident Reporting */}
        <section className="relative break-inside-avoid">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            04
          </div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">
            Post-Incident Summary Expectations
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            We prioritize transparency and actionable intelligence over PR spin. Following any SEV-1 or SEV-2 incident, partners will receive:
          </p>
          
          <ul className="space-y-6">
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Preliminary Root Cause Analysis (48-Hour SLA)</strong>
                <span className="text-stone-600 text-sm leading-relaxed block">An initial brief outlining the exact vector of the anomaly, the scope of the impact (specifically confirming zero impact to primary clinic booking systems), and the containment steps taken.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Sealed Post-Mortem (5-Day SLA)</strong>
                <span className="text-stone-600 text-sm leading-relaxed block">A comprehensive, SHA-256 sealed post-mortem detailing the timeline, the systemic root cause, and the specific architectural changes deployed to prevent recurrence.</span>
              </div>
            </li>
          </ul>
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
