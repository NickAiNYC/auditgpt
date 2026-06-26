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
            <a href="/deployment" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden sm:inline-block">
              Deployment
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
            Status: Secure <span className="opacity-50">|</span> Last Updated: June 2026
          </div>
          <button 
            onClick={() => window.print()}
            className="font-mono text-[10px] uppercase tracking-widest border border-stone-300 px-4 py-2 hover:bg-white hover:border-stone-400 transition-all shadow-sm rounded-sm text-stone-600 print:hidden"
          >
            [↓] Download Security Brief
          </button>
        </header>

        {/* Hero Section */}
        <section className="mb-24 print:break-inside-avoid print:mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-stone-900 font-serif" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Trust & Security Center
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            Enterprise Infrastructure for Clinical Demand Governance. Scrutexity is engineered on a foundational principle of risk elimination. Because we operate within the medical aesthetics and clinical governance sectors, our architecture assumes a zero-trust environment. We do not ask for faith; we provide transparent, auditable infrastructure designed to protect patient privacy and clinic operations natively.
          </p>
        </section>

        {/* 01: SOC2 */}
        <section className="mb-24 relative print:break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            01
          </div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">
            Continuous Compliance & SOC2 Posture
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Standard SaaS platforms rely on static, point-in-time security audits. Scrutexity utilizes a continuous observability model to ensure compliance is actively enforced and verifiable every second of the day.
          </p>
          <ul className="space-y-6">
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Automated Evidence Collection</strong>
                <span className="text-stone-600 text-sm leading-relaxed">Our infrastructure is integrated directly with Vanta to provide real-time, continuous monitoring of our security posture against SOC2 framework requirements.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Access Control & Least Privilege</strong>
                <span className="text-stone-600 text-sm leading-relaxed">System access is governed by strict Role-Based Access Control (RBAC). No Scrutexity engineer has default access to live clinic telemetry or audit logs.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Verifiable Integrity</strong>
                <span className="text-stone-600 text-sm leading-relaxed">We maintain an active, requestable security portal where enterprise procurement teams can verify our real-time compliance status, subprocessor agreements, and penetration testing summaries before initiating a Radar Pilot.</span>
              </div>
            </li>
          </ul>
        </section>

        {/* 02: Sovereign Infrastructure */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            02
          </div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">
            Sovereign Revenue Infrastructure
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            To prevent any risk of data cross-contamination or operational disruption, we deploy a Sovereign Revenue Infrastructure model. Your telemetry data remains isolated, and your Practice Management System remains untouched.
          </p>
          <ul className="space-y-6">
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Edge-Redaction & Ingress Sanitization</strong>
                <span className="text-stone-600 text-sm leading-relaxed">All inbound data routes through our Twilio ingress layer, where automated heuristics identify and redact potential Patient Health Information (PHI) before it reaches the core intelligence engine. We process the clinical claim, never the patient identity.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Read-Only Telemetry</strong>
                <span className="text-stone-600 text-sm leading-relaxed">Our analytics engine hydrates live KPIs via isolated SQLite databases synchronized with our React frontend. This architecture guarantees a zero-downtime integration. We sit in parallel to your core booking systems, acting strictly as a read-only monitoring layer.</span>
              </div>
            </li>
            <li className="flex gap-4 print:break-inside-avoid">
              <div className="mt-1.5 w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0 print:border print:border-black" />
              <div>
                <strong className="block text-stone-900 font-medium mb-1">Transient Processing</strong>
                <span className="text-stone-600 text-sm leading-relaxed">Intelligence tasks are executed without data retention. We utilize zero-training API agreements with our LLM providers, ensuring your proprietary operational data is never used to train external models.</span>
              </div>
            </li>
          </ul>
        </section>

        {/* 03: Subprocessor Matrix */}
        <section className="mb-24 relative break-inside-avoid print:mb-12">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            03
          </div>
          <h2 className="text-2xl font-medium mb-6 text-stone-900 border-b border-stone-200 pb-4">
            Subprocessor Matrix
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Scrutexity minimizes third-party data exposure. We maintain strict, zero-retention API agreements with our intelligence providers and enforce edge-redaction before data reaches core processing.
          </p>
          
          <div className="overflow-x-auto bg-white border border-stone-200 rounded-lg shadow-sm print:shadow-none">
            <table className="w-full text-left border-collapse min-w-[600px] print:break-inside-avoid">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 print:bg-white">
                  <th className="font-mono text-xs uppercase tracking-wider text-stone-500 py-4 px-6 font-medium">Entity</th>
                  <th className="font-mono text-xs uppercase tracking-wider text-stone-500 py-4 px-6 font-medium">Operational Function</th>
                  <th className="font-mono text-xs uppercase tracking-wider text-stone-500 py-4 px-6 font-medium">Data Scope & Processing</th>
                  <th className="font-mono text-xs uppercase tracking-wider text-stone-500 py-4 px-6 font-medium">Security Posture</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors print:break-inside-avoid">
                  <td className="py-4 px-6 font-medium text-stone-900">Twilio</td>
                  <td className="py-4 px-6 text-stone-600">Telemetry Ingress & Redaction</td>
                  <td className="py-4 px-6 text-stone-600">Transient routing; edge-sanitization of potential PHI.</td>
                  <td className="py-4 px-6 font-mono text-xs text-stone-500">SOC2, HIPAA Eligible</td>
                </tr>
                <tr className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors print:break-inside-avoid">
                  <td className="py-4 px-6 font-medium text-stone-900">Anthropic</td>
                  <td className="py-4 px-6 text-stone-600">Primary Intelligence Engine</td>
                  <td className="py-4 px-6 text-stone-600">Sanitized marketing data. Strict zero-retention.</td>
                  <td className="py-4 px-6 font-mono text-xs text-stone-500">SOC2, Zero-training</td>
                </tr>
                <tr className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors print:break-inside-avoid">
                  <td className="py-4 px-6 font-medium text-stone-900">Google Cloud / Vercel</td>
                  <td className="py-4 px-6 text-stone-600">Edge Compute & Hosting</td>
                  <td className="py-4 px-6 text-stone-600">Encrypted application state and routing.</td>
                  <td className="py-4 px-6 font-mono text-xs text-stone-500">SOC2 Type II</td>
                </tr>
                <tr className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors print:break-inside-avoid">
                  <td className="py-4 px-6 font-medium text-stone-900">Vanta</td>
                  <td className="py-4 px-6 text-stone-600">Continuous Compliance</td>
                  <td className="py-4 px-6 text-stone-600">Internal system metadata only. No client data access.</td>
                  <td className="py-4 px-6 font-mono text-xs text-stone-500">SOC2 Type II</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-stone-100 border-l-2 border-stone-400 text-sm text-stone-700 print:break-inside-avoid">
            <strong>Data Residency Note:</strong> All sovereign infrastructure and telemetry databases (SQLite) are hosted exclusively in US-based regions with <code className="bg-stone-200 px-1 py-0.5 rounded text-xs font-mono print:border print:border-stone-300">AES-256</code> encryption at rest. Intelligence APIs are strictly contracted under non-training, zero-retention clauses.
          </div>
        </section>

        {/* 04: IT & Procurement FAQ */}
        <section className="relative break-inside-avoid">
          <div className="absolute -left-8 md:-left-16 top-1 font-mono text-sm text-stone-300 select-none print:hidden">
            04
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
          
          {/* Security Contact SLA */}
          <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4 print:break-inside-avoid">
            <div>
              <p className="text-stone-900 font-medium">Security & IT Inquiries</p>
              <p className="text-sm text-stone-500">Initial technical response SLA: 24 hours.</p>
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
