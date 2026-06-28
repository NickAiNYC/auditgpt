'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/logo';

// Doctrine-aligned Stripe Price IDs. Each env var must point to a Stripe Price
// whose amount matches the public price — verify in the Stripe Dashboard.
//   Claim Intelligence Report ...... $299 one-time
//   Claim Drift Monitoring ......... $299/month
//   Agency Founding Beta ........... $499/month (first 5 partners — ACTIVE checkout)
//   Agency Partner Plan ............ $799/month (swap agency tier to this after the cohort fills)
const STRIPE_PRICE_IDS = {
  claimIntelligenceReport: process.env.NEXT_PUBLIC_STRIPE_CLAIM_INTELLIGENCE_REPORT_299 || '',
  claimDriftMonitoring: process.env.NEXT_PUBLIC_STRIPE_CLAIM_DRIFT_MONITORING_299_MONTHLY || '',
  agencyFoundingBeta: process.env.NEXT_PUBLIC_STRIPE_AGENCY_FOUNDING_BETA_499_MONTHLY || '',
  agencyPartner: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PARTNER_799_MONTHLY || '',
} as const;

interface Tier {
  id: string;
  name: string;
  label: string;
  price: string;
  cadence: string;
  description: string;
  forWhom: string;
  outcome: string;
  scanDepth: string;
  priceId: string | null;
  cta: string;
  highlight: boolean;
  mode: 'payment' | 'subscription' | 'free';
}

const TIERS: Tier[] = [
  {
    id: 'free',
    name: 'Snapshot',
    label: 'Free',
    price: '$0',
    cadence: '',
    description: 'A quick sanity check for founders — see if your page has claim risks before shipping.',
    forWhom: 'Founder sanity-check',
    outcome: 'Know if this page is safe to ship.',
    scanDepth: '1 page scan',
    priceId: null,
    cta: 'Run Snapshot',
    highlight: false,
    mode: 'free',
  },
  {
    id: 'evidence',
    name: 'Claim Intelligence Report',
    label: '$299 one-time',
    price: '$299',
    cadence: 'One-time',
    description: 'Full audit, evidence mapping, and safer rewrites so you can ship your flagship page with confidence.',
    forWhom: 'Launching a new funnel',
    outcome: 'Ship a buyer-safe flagship page in 7 days.',
    scanDepth: '5–7 claims, score, rewrites',
    priceId: STRIPE_PRICE_IDS.claimIntelligenceReport,
    cta: 'Get the $299 Report',
    highlight: false,
    mode: 'payment',
  },
  {
    id: 'monitor',
    name: 'Claim Drift Monitoring',
    label: '$299/month',
    price: '$299',
    cadence: '/month',
    description: 'Continuous monitoring across surfaces — de-risk your claims before investors or regulators ask.',
    forWhom: 'Fundraising / M&A readiness',
    outcome: 'De-risk your claims before diligence.',
    scanDepth: '5 surfaces, 30-day plan',
    priceId: STRIPE_PRICE_IDS.claimDriftMonitoring,
    cta: 'Start Claim Drift Monitoring',
    highlight: true,
    mode: 'subscription',
  },
  {
    id: 'agency',
    name: 'Agency Founding Beta',
    label: 'First 5 partners · $799/mo after',
    price: '$499',
    cadence: '/month',
    description: 'White-label claim audits for your client roster. Founding Beta: $499/mo for the first 5 partners, then the Agency Partner Plan is $799/mo.',
    forWhom: 'Agencies & consultancies',
    outcome: 'Turn claim audits into billable retainers.',
    scanDepth: 'Multi-client, white-label',
    priceId: STRIPE_PRICE_IDS.agencyFoundingBeta,
    cta: 'Join the Founding Beta',
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

interface ComparisonRow {
  plan: string;
  forWhom: string;
  scanDepth: string;
  outcome: string;
}

const COMPARISON: ComparisonRow[] = [
  { plan: 'Snapshot', forWhom: 'Founder sanity-check', scanDepth: '1-page spot check', outcome: 'Know if this page is safe to ship.' },
  { plan: 'Claim Intelligence Report', forWhom: 'Launching a new funnel', scanDepth: '5–7 claims, score, rewrites', outcome: 'Ship a buyer-safe flagship page in 7 days.' },
  { plan: 'Claim Drift Monitoring', forWhom: 'Fundraising / M&A readiness', scanDepth: '5 surfaces, 30-day plan', outcome: 'De-risk your claims before diligence.' },
  { plan: 'Agency Partner Plan', forWhom: 'Agencies & consultancies', scanDepth: 'Multi-client, white-label', outcome: 'Turn claim audits into billable retainers.' },
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
          <div className="text-center mb-12">
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

          {/* Stat Banner */}
          <div className="bg-slate-900 text-white px-6 py-4 mb-12 max-w-3xl mx-auto text-center">
            <p className="font-mono text-sm uppercase tracking-wider">
              <span className="font-bold text-lg">10–20</span> unsupported claims surfaced per page on average
            </p>
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

                <div className="mb-6">
                  <h2 className="font-mono text-sm uppercase tracking-widest font-bold mb-1">
                    {tier.name}
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {tier.label}
                  </span>
                </div>

                <div className="mb-2">
                  <div className="font-serif text-5xl tracking-tight text-slate-900 mb-1">
                    {tier.price}
                    {tier.cadence && (
                      <span className="text-sm font-mono text-slate-500 align-super ml-1">
                        {tier.cadence}
                      </span>
                    )}
                  </div>
                </div>

                {/* Outcome-driven line */}
                <p className="text-xs font-mono text-slate-700 mb-6 leading-relaxed">
                  <span className="text-slate-400">Outcome: </span>
                  {tier.outcome}
                </p>

                {/* For whom */}
                <p className="text-[11px] font-mono text-slate-400 mb-6">
                  For whom: {tier.forWhom}
                </p>

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

                {/* Capabilities inside the card */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                  {CAPABILITIES.map((cap, i) => {
                    const value = cap[tier.id as keyof FeatureRow];
                    const isExcluded = value === '—';
                    const isActive = value === '[ Active ]';

                    return (
                      <div key={i} className="flex items-center justify-between pb-2 border-b border-slate-50 last:border-0">
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

          {/* Done-for-you hand-off to Scrutexity */}
          <div className="max-w-4xl mx-auto mb-16 border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Want the fixes done for you?</div>
                <h3 className="font-serif text-2xl text-slate-900 mb-1">Med Spa Claim Cleanup Sprint — $1,997</h3>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">After your $299 report, Scrutexity rewrites the flagged claims and builds the proof assets for you. Delivered by Scrutexity, not self-serve.</p>
              </div>
              <a href="https://scrutexity.com" target="_blank" rel="noopener" className="shrink-0 bg-slate-900 text-white px-6 py-3 text-xs font-mono uppercase tracking-widest hover:bg-slate-800 transition-colors text-center">
                Get the Sprint via Scrutexity
              </a>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-center">
              Compare plans — find the right fit
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-left">
                    <th className="py-3 pr-4 font-bold text-slate-800 uppercase tracking-wider">Plan</th>
                    <th className="py-3 px-4 font-bold text-slate-800 uppercase tracking-wider">For whom</th>
                    <th className="py-3 px-4 font-bold text-slate-800 uppercase tracking-wider">Depth of scan</th>
                    <th className="py-3 pl-4 font-bold text-slate-800 uppercase tracking-wider">Key outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="py-4 pr-4 font-semibold text-slate-900">{row.plan}</td>
                      <td className="py-4 px-4 text-slate-600">{row.forWhom}</td>
                      <td className="py-4 px-4 text-slate-600">{row.scanDepth}</td>
                      <td className="py-4 pl-4 text-slate-800">{row.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Launch Cohort Note */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="inline-block border border-slate-300 px-6 py-5">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-2">
                Limited availability
              </p>
              <p className="font-serif text-lg text-slate-900 leading-relaxed">
                Join the Launch Cohort — limited to 10 high-risk, high-growth brands. Includes founder-led onboarding.
              </p>
            </div>
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
