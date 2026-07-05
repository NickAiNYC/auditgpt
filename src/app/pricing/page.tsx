'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, ShieldCheck, Activity, FileText, AlertTriangle, PenTool } from 'lucide-react';
import { Logo } from '@/components/logo';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

// Doctrine-aligned Stripe Price IDs. Each env var must point to a Stripe Price
// whose amount matches the public price — verify in the Stripe Dashboard.
//   Claim Intelligence Report ...... $497 one-time
//   Guardian ....................... $1,497/month (handled by direct sales until Stripe Price is active)
//   Agency Receipt Beta ............ $499/month (first 5 partners — ACTIVE checkout)
//   Agency Partner Plan ............ $799/month (swap agency tier to this after the cohort fills)
const STRIPE_PRICE_IDS = {
  claimIntelligenceReport: process.env.NEXT_PUBLIC_STRIPE_CLAIM_INTELLIGENCE_REPORT_299 || '',
  guardian: process.env.NEXT_PUBLIC_STRIPE_GUARDIAN_1497_MONTHLY || '',
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
  ctaHref?: string;
  highlight: boolean;
  mode: 'payment' | 'subscription' | 'free';
}

const TIERS: Tier[] = [
  {
    id: 'free',
    name: 'Free Visibility Snapshot',
    label: 'Free',
    price: '$0',
    cadence: '',
    description: 'A first-pass read-only scan that returns one unsupported claim, one proof gap, and one safer rewrite.',
    forWhom: 'Initial baseline',
    outcome: 'Know what this page is claiming before you ship.',
    scanDepth: '1 public page',
    priceId: null,
    cta: 'Run Snapshot',
    highlight: false,
    mode: 'free',
  },
  {
    id: 'evidence',
    name: 'Claim Exposure Audit',
    label: '$497 one-time',
    price: '$497',
    cadence: 'One-time',
    description: 'Diagnostic claim mapping, evidence proximity notes, governed replacements, and a dated Owner Brief.',
    forWhom: 'High-claim launch',
    outcome: 'Leave with a dated review record and replacement queue.',
    scanDepth: '5-7 claims, Owner Brief, governance path',
    priceId: STRIPE_PRICE_IDS.claimIntelligenceReport,
    cta: 'Authorize Audit',
    highlight: true,
    mode: 'payment',
  },
  {
    id: 'guardian',
    name: 'Guardian',
    label: '$1,497/month',
    price: '$1,497',
    cadence: '/month',
    description: 'Ongoing read-only monitoring across public surfaces for claim drift, proof gaps, and AI answer distortion. Includes AI Distortion Watch as an add-on.',
    forWhom: 'Founder-led claim governance',
    outcome: 'Maintain a current claim ledger as public pages and AI answers change.',
    scanDepth: '5 public surfaces, monthly baseline, AI Distortion Watch',
    priceId: null,
    cta: 'Request Guardian',
    ctaHref: 'mailto:hello@auditgpt.ai?subject=Guardian%20Claim%20Intelligence%20Pilot',
    highlight: false,
    mode: 'free',
  },
  {
    id: 'agency',
    name: 'Agency Receipt Beta',
    label: 'First 5 partners · $799/mo after',
    price: '$499',
    cadence: '/month',
    description: 'White-label Owner Briefs for high-claim launches. Founding Beta: $499/mo for the first 5 partners, then the agency rate is $799/mo.',
    forWhom: 'Agencies & consultancies',
    outcome: 'Attach a client-ready review artifact to high-claim launches.',
    scanDepth: '10 Owner Briefs/mo, white-label',
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
  guardian: string;
  agency: string;
}

const CAPABILITIES: FeatureRow[] = [
  { name: 'Read-Only Scan', free: '[ Active ]', evidence: '[ Active ]', guardian: '[ Active ]', agency: '[ Active ]' },
  { name: 'Diagnostic Claim Mapping', free: '—', evidence: '[ Active ]', guardian: '[ Active ]', agency: '[ Active ]' },
  { name: 'Owner Brief', free: '—', evidence: '[ Active ]', guardian: '[ Active ]', agency: '[ Active ]' },
  { name: 'Review Record Summary', free: '—', evidence: '[ Active ]', guardian: '[ Active ]', agency: '[ Active ]' },
  { name: 'Governed Replacements', free: '—', evidence: '[ Active ]', guardian: '[ Active ]', agency: '[ Active ]' },
  { name: 'Continuous Baseline', free: '—', evidence: '—', guardian: '[ Active ]', agency: '[ Active ]' },
  { name: 'AI Distortion Watch', free: '—', evidence: '—', guardian: '[ Included ]', agency: '[ Active ]' },
  { name: 'White-Label Exports', free: '—', evidence: '—', guardian: '—', agency: '[ Active ]' },
];

interface ComparisonRow {
  plan: string;
  forWhom: string;
  scanDepth: string;
  outcome: string;
}

const COMPARISON: ComparisonRow[] = [
  { plan: 'Free Visibility Snapshot', forWhom: 'Initial baseline', scanDepth: '1 public page', outcome: 'Surface one exposure signal.' },
  { plan: 'Claim Exposure Audit', forWhom: 'High-claim launch', scanDepth: '5-7 claims, Owner Brief', outcome: 'Leave with a dated review record and governance path.' },
  { plan: 'Guardian', forWhom: 'Founder-led claim governance', scanDepth: '5 surfaces, monthly baseline, AI Distortion Watch', outcome: 'Maintain a current claim ledger.' },
  { plan: 'Agency Receipt Beta', forWhom: 'Agencies & consultancies', scanDepth: '10 Owner Briefs/mo, white-label', outcome: 'Attach a client-ready artifact to high-claim launches.' },
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
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <header className="border-b border-[#E7DFD3] bg-white/80 backdrop-blur">
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
            <a href="/auditgpt" className="text-accent hover:text-foreground font-bold">Run Claim Snapshot</a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-none bg-[#E2725B]" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Diagnostic Run
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">
              Secure your visibility baseline.
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600">
              Execute a diagnostic claim run on your highest-traffic public marketing asset. The $497 Claim Exposure Audit includes an Owner Brief, source-linked pattern notes, and governed replacement language. Reviewed does not mean approved, compliant, certified, or independently confirmed.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500">
              AI-visibility tools tell you if you were mentioned. We prove what
              was claimed, against what you claimed, on a date certain.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 border border-[#E7DFD3] bg-white">
            {['Read-only integration', 'Source-linked pattern matching', 'Owner Brief deliverable'].map((item) => (
              <div key={item} className="border-b border-slate-200 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                <FileText className="mb-6 h-5 w-5 text-[#E2725B]" />
                <p className="text-sm font-medium text-slate-900">{item}</p>
              </div>
            ))}
          </div>

          {/* Stat Banner */}
          <div className="bg-[#1A1A1A] text-white px-6 py-4 mb-12 max-w-3xl mx-auto text-center">
            <p className="font-mono text-sm uppercase tracking-wider">
              Establish your ledger. Align public claims. Document support before surfaces change.
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
                  {tier.id === 'evidence' && (
                    <div className="mb-4 inline-flex border border-[#E2725B]/30 bg-[#F8E9E2] px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#A24E39]">
                      Recommended baseline
                    </div>
                  )}
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

                {tier.id === 'evidence' && (
                  <div className="mb-6 h-24 relative overflow-hidden flex items-center justify-center">
                    {/* Preview Cards Stack */}
                    {[
                      { icon: Activity, title: 'Baseline', color: 'text-[#E2725B]', bg: 'bg-[#F8E9E2]' },
                      { icon: AlertTriangle, title: 'Pattern Match', color: 'text-[#A24E39]', bg: 'bg-[#F8E9E2]' },
                      { icon: PenTool, title: 'Owner Brief', color: 'text-[#0B3D2E]', bg: 'bg-[#E8EFE9]' }
                    ].map((card, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15, x: i * 8 - 8, rotate: (i - 1) * 3 }}
                        whileInView={{ opacity: 1, y: 0, x: i * 12 - 12, rotate: (i - 1) * 4 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: EASE }}
                        className={`absolute w-32 h-16 border border-slate-200 rounded-sm shadow-sm bg-white p-2 flex flex-col justify-between hover:z-10 hover:shadow-md transition-shadow z-[${i}]`}
                      >
                         <div className={`w-5 h-5 rounded-sm ${card.bg} flex items-center justify-center`}>
                           <card.icon className={`w-3 h-3 ${card.color}`} />
                         </div>
                         <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">
                           {card.title}
                         </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {tier.ctaHref ? (
                  <a
                    href={tier.ctaHref}
                    className="block w-full bg-slate-900 py-3 text-center text-xs font-mono uppercase tracking-widest text-white transition-colors hover:bg-[#E2725B]"
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      if (tier.mode === 'free') {
                        router.push('/auditgpt');
                        return;
                      }
                      handleCheckout(tier.id, tier.mode, tier.priceId ?? undefined);
                    }}
                    disabled={checkingOut === tier.id}
                    className={`w-full py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                      tier.highlight
                        ? 'bg-[#E2725B] text-white hover:bg-[#1A1A1A]'
                        : 'bg-slate-900 text-white hover:bg-[#E2725B]'
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
                )}

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
                          ? 'text-[#0B3D2E]'
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

          <div className="max-w-4xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">Deliverable preview</div>
              <h2 className="font-serif text-3xl text-slate-900 leading-tight">What the $497 Claim Exposure Audit gives you</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                A clear document your owner, agency client, operator, or internal reviewer can act on without a dashboard walkthrough.
              </p>
            </div>
            <div className="divide-y divide-slate-200">
              {[
                ['Diagnostic claim table', '5-7 claims labeled supported, weak, overstated, or unsupported.'],
                ['Evidence proximity notes', 'Where proof is visible, missing, buried, or too vague.'],
                ['Governed replacement queue', 'Draft language that keeps the business intent without unsupported certainty.'],
                ['Owner Brief', 'Dated summary of reviewed URL, scope, findings, and 30-day activation path.'],
              ].map(([title, body]) => (
                <div key={title} className="grid gap-2 p-5 sm:grid-cols-[160px_1fr]">
                  <div className="text-sm font-semibold text-slate-900">{title}</div>
                  <div className="text-sm leading-relaxed text-slate-600">{body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Done-for-you hand-off to Scrutexity */}
          <div className="max-w-4xl mx-auto mb-16 border border-[#E7DFD3] bg-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Want the fixes done for you?</div>
                <h3 className="font-serif text-2xl text-slate-900 mb-1">Governed Asset Activation — via Scrutexity</h3>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">After your Owner Brief, Scrutexity can help operationalize replacement language and proof artifacts. Delivered by Scrutexity, not self-serve.</p>
              </div>
              <a href="https://scrutexity.com" target="_blank" rel="noopener" className="shrink-0 bg-slate-900 text-white px-6 py-3 text-xs font-mono uppercase tracking-widest hover:bg-slate-800 transition-colors text-center">
                Discuss Activation
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
                Pilot access is reviewed for fit. No scarcity tactics, no compliance certification, no revenue promise.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Trust & Security Footer */}
      <section className="bg-white border-t border-[#E7DFD3] mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-slate-900 mb-3">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-serif text-xl">How we handle your data</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                AuditGPT reads only public web pages. We don&rsquo;t connect to your systems, write to your properties, or process patient data.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 bg-green-500" />
                <span className="text-xs font-mono text-slate-700">Public-page analysis only</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 bg-green-500" />
                <span className="text-xs font-mono text-slate-700">Read-only intelligence layer</span>
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
