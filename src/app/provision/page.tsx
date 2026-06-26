'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/logo';

export default function ProvisionPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call
    try {
      const res = await fetch('/api/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'mock-token' })
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('idle');
        alert('Failed to establish ingress.');
      }
    } catch (e) {
      setStatus('idle');
      alert('Connection error.');
    }
  };

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
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-20 md:py-32 w-full">
        
        {/* Status Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-8 border-b border-stone-200 mb-16">
          <div className="font-mono text-[10px] text-stone-500 uppercase tracking-widest flex items-center gap-3">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            System: Awaiting Token <span className="opacity-50">|</span> Portal Active
          </div>
        </header>

        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-4xl font-medium tracking-tight mb-6 text-stone-900 font-serif" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Infrastructure Provisioning
          </h1>
          <p className="text-stone-600 font-light leading-relaxed">
            Submit your read-only Practice Management System API token to initialize the Radar Pilot telemetry layer.
          </p>
        </section>

        {/* Integration Boundaries Box */}
        <section className="mb-12 bg-white border border-stone-200 p-6 rounded-sm shadow-sm">
          <h2 className="font-mono text-xs text-stone-900 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">
            Integration Boundaries
          </h2>
          <ul className="space-y-4 text-sm text-stone-600">
            <li className="flex gap-3">
              <div className="mt-1 w-1 h-1 bg-stone-400 rounded-full shrink-0" />
              <span><strong>Strictly Read-Only:</strong> We do not require or accept write permissions. We cannot alter your calendar or routing.</span>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 w-1 h-1 bg-stone-400 rounded-full shrink-0" />
              <span><strong>PHI Redaction:</strong> All inbound data is edge-redacted before core processing.</span>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 w-1 h-1 bg-stone-400 rounded-full shrink-0" />
              <span><strong>Unilateral Revocation:</strong> Revoking the API token on your end instantly severs our access and triggers a hard-purge of transient telemetry.</span>
            </li>
          </ul>
        </section>

        {status === 'success' ? (
          <div className="bg-stone-900 text-emerald-400 p-8 rounded-sm font-mono text-sm leading-relaxed border border-stone-800 shadow-xl">
            <p className="mb-2">[SYSTEM: Token Accepted]</p>
            <p className="mb-2">Ingress established.</p>
            <p className="mb-2 text-stone-500">Decrypting telemetry feed...</p>
            <p>Awaiting Phase 2 Initialization.</p>
            <p className="mt-8 text-xs text-stone-500">You may now close this window. Your clinic owner has been notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block font-mono text-xs text-stone-500 uppercase tracking-widest mb-2">Clinic Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white border border-stone-200 p-3 text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors rounded-sm"
                  placeholder="e.g. U Med Spa"
                  disabled={status === 'submitting'}
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-stone-500 uppercase tracking-widest mb-2">Authorized IT Contact</label>
                <input 
                  required
                  type="email" 
                  className="w-full bg-white border border-stone-200 p-3 text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors rounded-sm"
                  placeholder="it@clinic.com"
                  disabled={status === 'submitting'}
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-stone-500 uppercase tracking-widest mb-2">Target PMS</label>
                <select 
                  required
                  className="w-full bg-white border border-stone-200 p-3 text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors rounded-sm"
                  disabled={status === 'submitting'}
                >
                  <option value="boulevard">Boulevard</option>
                  <option value="mangomint">Mangomint</option>
                  <option value="other">Other / Custom</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-stone-500 uppercase tracking-widest mb-2">Read-Only Telemetry Token</label>
                <input 
                  required
                  type="password" 
                  className="w-full bg-white border border-stone-200 p-3 text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors rounded-sm font-mono"
                  placeholder="Paste API Key here..."
                  disabled={status === 'submitting'}
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-stone-900 text-white font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Encrypting & Submitting...
                  </>
                ) : (
                  'Initialize Connection'
                )}
              </button>
            </div>
            
            <p className="text-center text-xs text-stone-400 mt-6">
              This portal establishes an AES-256 encrypted transient exchange.
            </p>
          </form>
        )}

      </main>

      <footer className="border-t border-stone-200 mt-auto bg-white print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-stone-500 font-mono">
          System 01 // AuditGPT <br />
          <a href="/security" className="inline-block mt-2 underline hover:text-stone-800 transition-colors">
            Review Trust & Security Center →
          </a>
        </div>
      </footer>
    </div>
  );
}
