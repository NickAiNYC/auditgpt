'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/logo';

const STRIPE_PRICE_IDS = {
  evidence: process.env.NEXT_PUBLIC_STRIPE_EVIDENCE_PRICE_ID || '',
  monitor: process.env.NEXT_PUBLIC_STRIPE_MONITOR_PRICE_ID || '',
  agency: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || '',
} as const;

interface Tier {
  id: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  priceId: string | null;
  cta: string;
  highlight: boolean;
  mode: 'payment' | 'subscription' | 'free';
}

const TIERS: Tier[] = [
  {
    id: 'free',
    name: 'Free Claim Snapshot',
    price: '$0',
    cadence: '',
    description: 'Find top claim risks on your public surfaces.',
    priceId: null,
    cta: 'Run Snapshot',
    highlight: false,
    mode: 'free',
  },
  {
    id: 'evidence',
    name: 'Claim Evidence Pack',
    price: '$299',
    cadence: 'One-time',
    description: 'Review, evidence mapping, and safer rewrites.',
    priceId: STRIPE_PRICE_IDS.evidence,
    cta: 'Get Evidence Pack',
    highlight: false,
    mode: 'payment',
  },
  {
    id: 'monitor',
    name: 'Scrutexity Monitor',
    price: '$299',
    cadence: '/month',
    description: 'Monthly claim + AI Answer Reality monitoring.',
    priceId: STRIPE_PRICE_IDS.monitor,
    cta: 'Start Monitoring',
    highlight: true,
    mode: 'subscription',
  },
  {
    id: 'agency',
    name: 'Agency Trust Partner',
    price: '$999',
    cadence: '/month',
    description: 'White-label scans for up to 10 clients.',
    priceId: STRIPE_PRICE_IDS.agency,
    cta: 'Partner Program',
    highlight: false,
    mode: 'subscription',
  },
];

interface FeatureRow {
  name: string;
  free: string;
  evidence: string;
  monitor: string;
  agency: string;
}

const CAPABILITIES: FeatureRow[] = [
  { name: 'Initial Scan', free: '[ Active ]', evidence: '[ Active ]', monitor: '[ Active ]', agency: '[ Active ]' },
  { name: 'Evidence Mapping', free: '—', evidence: '[ Active ]', monitor: '[ Active ]', agency: '[ Active ]' },
  { name: 'Safer Rewrites', free: '—', evidence: '[ Active ]', monitor: '[ Active ]', agency: '[ Active ]' },
  { name: 'Continuous Monitoring', free: '—', evidence: '—', monitor: '[ Active ]', agency: '[ Active ]' },
  { name: 'AI Answer Reality', free: '—', evidence: '—', monitor: '[ Active ]', agency: '[ Active ]' },
  { name: 'White-Label Exports', free: '—', evidence: '—', monitor: '—', agency: '[ Active ]' },
];

export default function PricingPage() {
  const { status } = useSession();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (planId: string, mode: 'payment' | 'subscription', priceId?: string) => {
    setError(null);
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=/pricing`);
      return;
    }

    if (!priceId || !priceId.startsWith('price_')) {
      setError('System Error: Stripe Price ID not configured in environment constraints.');
      return;
    }

    setCheckingOut(planId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, plan: planId, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      // eslint-disable-next-line react-hooks/immutability
      if (data.url) window.location.href = data.url;
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err.message || 'Checkout failed.');
      setCheckingOut(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <a href="/" className="hover:text-foreground hidden sm:inline-block">Platform</a>
            <a href="/ai-answer-reality" className="hover:text-foreground hidden sm:inline-block">AI Answer Reality</a>
            <a href="/ai-answer-reality/sample" className="hover:text-foreground hidden sm:inline-block">Sample Report</a>
            <a href="/pricing" className="hover:text-foreground">Pricing</a>
            <a href="/proof" className="hover:text-foreground hidden sm:inline-block">Proof</a>
            <a href="/agency" className="hover:text-foreground">Partners</a>
            <a href="/snapshot" className="text-accent hover:text-foreground font-bold">Run Claim Snapshot</a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-none bg-black animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Pricing
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">
              Simple claim intelligence audits for teams that need proof before they publish.
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 mb-8 text-xs font-mono text-red-900">
              {error}
            </div>
          )}

          {/* Technical Grid Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative p-8 border ${
                  tier.highlight
                    ? 'bg-[#f8fafc] border-[#cbd5e1] shadow-[0_4px_24px_rgba(0,0,0,0.04)]'
                    : 'bg-white border-border'
                }`}
              >
                {/* Top Accent Line */}
                <div
                  className={`absolute top-[-1px] left-0 right-0 h-[3px] ${
                    tier.highlight ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                />

                <div className="mb-8">
                  <h2 className="font-mono text-sm uppercase tracking-widest font-bold mb-2">
                    {tier.name}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="font-serif text-5xl tracking-tight text-slate-900 mb-1">
                    {tier.price}
                    {tier.cadence && (
                      <span className="text-sm font-mono text-slate-500 align-super ml-1">
                        {tier.cadence}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleCheckout(tier.id, tier.mode, tier.priceId)}
                  disabled={checkingOut === tier.id}
                  className={`w-full py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                    tier.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {checkingOut === tier.id ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin inline" /> CONNECTING...
                    </>
                  ) : (
                    tier.cta
                  )}
                </button>

                {/* Capabilities inside the card (stacking cleanly for mobile/desktop) */}
                <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
                  {CAPABILITIES.map((cap, i) => {
                    const value = cap[tier.id as keyof FeatureRow];
                    const isExcluded = value === '—';
                    const isActive = value === '[ Active ]';

                    return (
                      <div key={i} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0">
                        <div className="text-xs text-slate-500">{cap.name}</div>
                        <div
                          className={`text-xs font-mono ${
                            isExcluded
                              ? 'text-slate-400'
                              : isActive
                              ? 'text-green-700'
                              : 'text-slate-800'
                          }`}
                        >
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Trust & Security Footer */}
      <section className="bg-slate-50 border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-slate-900 mb-3">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-serif text-xl">How we handle your data</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                AuditGPT reads only public web pages. We don&rsquo;t connect to your systems and we don&rsquo;t process patient data.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 bg-green-500" />
                <span className="text-xs font-mono text-slate-700">Public-page analysis only</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 bg-green-500" />
                <span className="text-xs font-mono text-slate-700">Read-only — no system access</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 bg-green-500" />
                <span className="text-xs font-mono text-slate-700">Zero-retention model processing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 bg-green-500" />
                <span className="text-xs font-mono text-slate-700">Report deletable on request</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground font-mono">
          System 01 // AuditGPT <br />
          <a href="https://scrutexity.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 underline hover:opacity-80 transition-opacity">
            Parent company: Scrutexity →
          </a>
        </div>
      </footer>
    </div>
  );
}

