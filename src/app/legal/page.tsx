'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/logo';
import { TermsOfService } from '@/lib/legal/tos';
import { PrivacyPolicy } from '@/lib/legal/privacy';

export default function LegalPage() {
  const [tab, setTab] = useState<'tos' | 'privacy'>('tos');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <a
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back to main
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex gap-6 mb-8 border-b border-border">
            <button
              onClick={() => setTab('tos')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === 'tos'
                  ? 'border-black text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setTab('privacy')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === 'privacy'
                  ? 'border-black text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Privacy Policy
            </button>
          </div>

          {tab === 'tos' ? <TermsOfService /> : <PrivacyPolicy />}
        </div>
      </main>

      <footer className="border-t border-border bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>AuditGPT by Scrutexity · Claim Intelligence for businesses where trust matters.</span>
          <a href="/" className="underline hover:text-foreground">auditgpt.ai</a>
        </div>
      </footer>
    </div>
  );
}
