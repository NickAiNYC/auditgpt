'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { WedgeStrip } from '@/components/wedge';

// Stripe Price IDs — must be statically referenced so Next.js can
// inline NEXT_PUBLIC_* values at build time. Dynamic process.env[key]
// lookups do NOT work in client bundles.
const STRIPE_PRICE_IDS = {
  starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
  guardrail: process.env.NEXT_PUBLIC_STRIPE_GUARDRAIL_PRICE_ID || '',
  full: process.env.NEXT_PUBLIC_STRIPE_FULL_PRICE_ID || '',
  agency: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || '',
} as const;

interface OneTimePlan {
  id: 'snapshot' | 'starter' | 'guardrail' | 'full';
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  href?: string;
  priceId?: string;
}

interface RecurringPlan {
  id: 'agency';
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  priceId: string;
}

const ONE_TIME_PLANS: OneTimePlan[] = [
  {
    id: 'snapshot',
    name: 'Free Claim Snapshot',
    price: '$0',
    cadence: '',
    description: 'Best for checking one page before a launch, campaign, or rewrite.',
    features: [
      'One claim/proof gap',
      'One evidence issue',
      'One safer rewrite or fix',
      'One recommended next step',
    ],
    cta: 'Run Free Snapshot',
    href: '/snapshot',
  },
  {
    id: 'starter',
    name: 'Single-Page Starter Audit',
    price: '$99',
    cadence: 'one-time',
    description: 'Best for one homepage, landing page, or sales page.',
    features: [
      '5–7 findings from one primary URL',
      'Claim and proof review',
      'Evidence gap labels',
      'Safer framing recommendations',
      'AI/search readability notes where relevant',
      'Demand leakage notes where relevant',
      '7-day fix list',
      'AuditGPT Report Review link',
    ],
    cta: 'Run Starter Audit',
    highlight: true,
    priceId: STRIPE_PRICE_IDS.starter,
  },
  {
    id: 'guardrail',
    name: 'Agent Guardrail Audit',
    price: '$199',
    cadence: 'one-time',
    description: 'Test your chatbot or AI agent transcript for unsupported claims, unsafe promises, and missing escalations.',
    features: [
      'Transcript parsing',
      'Forbidden promise detection',
      'Support gap analysis',
      'Missing escalation flagging',
      'Policy drift check',
      'Safer rewrite engine',
    ],
    cta: 'Run a Guardrail Audit',
    priceId: STRIPE_PRICE_IDS.guardrail,
  },
  {
    id: 'full',
    name: 'Five-Surface Visibility & Trust Audit',
    price: '$299',
    cadence: 'one-time',
    description: 'Best before a launch, fundraise, category bet, or major campaign.',
    features: [
      'Review of up to five buyer-facing surfaces',
      'Claim and evidence review',
      'AI/search readability review',
      'Reputation and proof surface review',
      'Demand leakage review',
      'Safer framing recommendations',
      '30-day action plan',
      'During founder-led launch, this audit is manually reviewed across up to five URLs.',
    ],
    cta: 'Run Full Audit',
    priceId: STRIPE_PRICE_IDS.full,
  },
];

const RECURRING_PLAN: RecurringPlan = {
  id: 'agency',
  name: 'Agency Audit System',
  price: '$799',
  cadence: '/month',
  description: 'Best for agencies that want client-ready claim intelligence and trust review reports.',
  features: [
    '25 audits per month',
    'White-label-ready reports',
    'Public and private report links',
    'Client discovery support',
    'Claim, proof, visibility, and demand-gap review structure',
  ],
  cta: 'Start Agency Review',
  priceId: STRIPE_PRICE_IDS.agency,
};

export default function PricingPage() {
  const { status } = useSession();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (planId: string, mode: 'payment' | 'subscription', priceId?: string) => {
    setError(null);

    if (planId === 'snapshot') {
      router.push('/snapshot');
      return;
    }

    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=/pricing`);
      return;
    }

    if (!priceId || !priceId.startsWith('price_')) {
      setError(
        'Stripe Price ID not configured. Set NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID, NEXT_PUBLIC_STRIPE_FULL_PRICE_ID, or NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID and redeploy.',
      );
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
          <a
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back to main
          </a>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-black" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Pricing
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">
              Start free. Pay only when the gap is clear.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-5">
              The free snapshot is yours forever. Starter and Full are one-time. Agencies get a monthly system.
            </p>
            <WedgeStrip className="justify-center" />
          </div>

          {(!STRIPE_PRICE_IDS.starter || !STRIPE_PRICE_IDS.guardrail || !STRIPE_PRICE_IDS.full || !STRIPE_PRICE_IDS.agency) && (
            <div className="card-polsia p-4 mb-8 border-l-4 border-l-amber-500 bg-amber-50">
              <p className="text-sm text-amber-900">
                <strong>Stripe SKUs not fully configured.</strong> Missing:{' '}
                {[
                  !STRIPE_PRICE_IDS.starter && 'NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID',
                  !STRIPE_PRICE_IDS.guardrail && 'NEXT_PUBLIC_STRIPE_GUARDRAIL_PRICE_ID',
                  !STRIPE_PRICE_IDS.full && 'NEXT_PUBLIC_STRIPE_FULL_PRICE_ID',
                  !STRIPE_PRICE_IDS.agency && 'NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID',
                ]
                  .filter(Boolean)
                  .join(', ')}
                . Create the matching products in Stripe Dashboard and set these env vars before going live.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {ONE_TIME_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card-polsia p-7 relative ${
                  plan.highlight ? 'border-2 border-black' : ''
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-sm">
                    Most popular
                  </div>
                )}
                <h2 className="font-serif text-xl mb-1">{plan.name}</h2>
                <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="font-serif text-4xl">{plan.price}</span>
                  {plan.cadence && (
                    <span className="text-sm text-muted-foreground">{plan.cadence}</span>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                      <span className="text-foreground/85">{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.id === 'snapshot' ? (
                  <a href="/snapshot" className="btn-polsia">
                    {plan.cta}
                  </a>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.id, 'payment', plan.priceId)}
                    disabled={checkingOut === plan.id}
                    className="btn-polsia"
                  >
                    {checkingOut === plan.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin inline" /> REDIRECTING...
                      </>
                    ) : (
                      <>{plan.cta}</>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Agency */}
          <div className="card-polsia p-8 mb-10 border border-border flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-2xl mb-1">{RECURRING_PLAN.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{RECURRING_PLAN.description}</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/70">
                {RECURRING_PLAN.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <span className="font-serif text-4xl">
                {RECURRING_PLAN.price}
                <span className="text-sm text-muted-foreground">{RECURRING_PLAN.cadence}</span>
              </span>
              <button
                onClick={() => handleCheckout('agency', 'subscription', RECURRING_PLAN.priceId)}
                disabled={checkingOut === 'agency'}
                className="btn-polsia"
                style={{ width: 'auto', padding: '0.6rem 1.25rem', fontSize: '0.75rem' }}
              >
                {checkingOut === 'agency' ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin inline" /> PROCESSING...
                  </>
                ) : (
                  <>{RECURRING_PLAN.cta}</>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="card-polsia p-4 mb-8 border-l-4 border-l-red-500 bg-red-50">
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-center text-xs text-muted-foreground max-w-2xl mx-auto">
            Disclaimer: AuditGPT does not provide legal, clinical, regulatory, ranking, revenue, or compliance advice. It identifies visible gaps in claims, evidence, AI/search readability, and demand paths based on the surfaces reviewed.
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
          AuditGPT by Scrutexity · Find what is unsupported, invisible, risky, or leaking.
        </div>
      </footer>
    </div>
  );
}
