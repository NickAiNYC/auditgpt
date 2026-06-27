'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/logo';

const STRIPE_PRICE_IDS = {
  monitor: process.env.NEXT_PUBLIC_STRIPE_MONITOR_PRICE_ID || '',
  agency: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || '',
} as const;

interface Tier {
  id: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  priceId: string;
  cta: string;
  highlight: boolean;
  mode: 'payment' | 'subscription';
}

const TIERS: Tier[] = [
  {
    id: 'monitor',
    name: 'Scrutexity Monitor',
    price: '$299',
    cadence: '/month',
    description: 'Monthly public claim scan, AI Answer Reality snapshot, and unsupported claim alerts.',
    priceId: STRIPE_PRICE_IDS.monitor,
    cta: 'Start Monitoring',
    highlight: false,
    mode: 'subscription',
  },
  {
    id: 'agency',
    name: 'Agency Trust Partner',
    price: '$999',
    cadence: '/month',
    description: 'Up to 10 client domains, white-label baselines, and monthly scans.',
    priceId: STRIPE_PRICE_IDS.agency,
    cta: 'Partner Program',
    highlight: true,
    mode: 'subscription',
  },
];

interface FeatureRow {
  name: string;
  monitor: string;
  agency: string;
}

const CAPABILITIES: FeatureRow[] = [
  { name: 'Monthly Claim Scan', monitor: '[ Active ]', agency: '[ Active ]' },
  { name: 'Target Scope', monitor: '1 domain', agency: 'Up to 10 domains' },
  { name: 'AI Answer Reality Snapshot', monitor: '[ Active ]', agency: '[ Active ]' },
  { name: 'Safer Rewrite Engine', monitor: '[ Active ]', agency: '[ Active ]' },
  { name: 'Public Verification Page', monitor: '[ Active ]', agency: '[ Active ]' },
  { name: 'White-Label Baseline Export', monitor: '—', agency: '[ Active ]' },
  { name: 'Governed Growth Certificate', monitor: '—', agency: 'Quarterly' },
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
          <div className="flex items-center gap-4">
            <a href="/proof" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hidden sm:inline-block">
              Proof Center
            </a>
            <a href="/security" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hidden sm:inline-block">
              Trust & Security
            </a>
            <a href="/deployment" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hidden sm:inline-block">
              Deployment
            </a>
            <a href="/snapshot" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground">
              Initialize Free Snapshot
            </a>
            <a href="/" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> System Root
            </a>
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
                Infrastructure Authorization
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">
              Audit Infrastructure Deployment
            </h1>
            <p className="text-sm font-mono text-muted-foreground max-w-2xl mx-auto mb-5 leading-relaxed">
              Predictable claim governance and risk mitigation. Transparent tiering based on audit volume and continuous monitoring requirements.
            </p>
          </div>

          {(!STRIPE_PRICE_IDS.monitor || !STRIPE_PRICE_IDS.agency) && process.env.NODE_ENV === 'production' && (
            <div className="bg-white border border-white/10 p-4 mb-8 text-xs font-mono text-center">
              <a href="/snapshot" className="text-accent hover:underline">Request a manual audit &rarr;</a>
            </div>
          )}

          {(!STRIPE_PRICE_IDS.monitor || !STRIPE_PRICE_IDS.agency) && process.env.NODE_ENV !== 'production' && (
            <div className="bg-amber-50 border border-amber-200 p-4 mb-8 text-xs font-mono text-amber-900">
              <strong>WARNING: System nodes degraded.</strong> Missing environment variables for STRIPE_PRICE_IDS.
            </div>
          )}

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

