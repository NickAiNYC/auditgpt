'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Check,
  Loader2,
  Crown,
  Zap,
} from 'lucide-react';
import { Logo } from '@/components/logo';

interface Plan {
  id: 'pro' | 'agent';
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  priceId: string;
}

const PLANS: Plan[] = [
  {
    id: 'pro',
    name: 'Pro',
    price: '$49',
    cadence: '/month',
    description: 'Full audit suite + rebuild kit + execution agent.',
    features: [
      'Full fact-backed audit (any URL)',
      'Landing page rebuild from slop',
      '12-week strategy generator',
      'Execution agent (chat with audit context)',
      'Competitor teardowns',
      'Save audits to your account',
      'Shareable public audit URLs',
    ],
    cta: 'Subscribe to Pro',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
  },
  {
    id: 'agent',
    name: 'Agent',
    price: '$99',
    cadence: '/month',
    description: 'Everything in Pro + autonomous custom agents that run weekly.',
    features: [
      'Everything in Pro',
      'Up to 3 custom autonomous agents',
      'Weekly ad copy agent (3 variants/week)',
      'Weekly SEO blog brief agent',
      'Agent run history + dashboard',
      'Priority email support',
      'Early access to new agent types',
    ],
    cta: 'Subscribe to Agent',
    highlight: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENT_PRICE_ID || 'price_agent_placeholder',
  },
];

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stripeConfigured] = useState<boolean>(() => !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    // If user has a session and tries to subscribe, we still let them — the API checks auth.
  }, [status, router]);

  const handleSubscribe = async (plan: Plan) => {
    setError(null);
    if (status !== 'authenticated') {
      router.push('/login?callbackUrl=/pricing');
      return;
    }
    setCheckingOut(plan.id);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId, plan: plan.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      setError(e.message || 'Checkout failed. Make sure STRIPE_SECRET_KEY is set.');
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
          <a href="/" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to main
          </a>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-black" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Pricing
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">
              Pay only when you&apos;re ready to rebuild.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The free audit is yours forever. The rebuild, strategy, and agent are gated.
              Cancel anytime.
            </p>
          </div>

          {!stripeConfigured && (
            <div className="card-polsia p-4 mb-8 border-l-4 border-l-amber-500 bg-amber-50">
              <p className="text-sm text-amber-900">
                <strong>Stripe not configured.</strong> Set <code className="font-mono text-xs">STRIPE_SECRET_KEY</code>,{' '}
                <code className="font-mono text-xs">STRIPE_WEBHOOK_SECRET</code>, and{' '}
                <code className="font-mono text-xs">NEXT_PUBLIC_STRIPE_PRO_PRICE_ID</code> /
                <code className="font-mono text-xs">NEXT_PUBLIC_STRIPE_AGENT_PRICE_ID</code> env vars to enable live checkout.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {PLANS.map((plan) => {
              const Icon = plan.id === 'agent' ? Crown : Zap;
              return (
                <div
                  key={plan.id}
                  className={`card-polsia p-8 relative ${
                    plan.highlight ? 'border-2 border-black' : ''
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-sm">
                      Most popular
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-sm bg-black text-white flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl">{plan.name}</h2>
                      <p className="text-xs text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-serif text-5xl">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.cadence}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                        <span className="text-foreground/85">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan)}
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
                </div>
              );
            })}
          </div>

          {error && (
            <div className="card-polsia p-4 mb-8 border-l-4 border-l-red-500 bg-red-50">
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}

          {/* Free tier reminder */}
          <div className="card-polsia p-6 text-center">
            <h3 className="font-serif text-lg mb-2">Free forever</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The one-pager audit is always free. Run unlimited audits on any URL, share them publicly, and embed them anywhere.
            </p>
            <a href="/" className="btn-cta" style={{ width: 'auto', padding: '0.75rem 1.5rem', display: 'inline-flex' }}>
              RUN A FREE AUDIT
            </a>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h3 className="font-serif text-2xl text-center mb-8">Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="card-polsia p-5">
                <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes. Cancel from the Stripe customer portal. Your subscription stays active until the period end date.
                </p>
              </div>
              <div className="card-polsia p-5">
                <h4 className="font-medium mb-2">What happens to my audits if I cancel?</h4>
                <p className="text-sm text-muted-foreground">
                  They stay in your account. The public URLs keep working. You lose access to the rebuild, strategy, and agent tabs.
                </p>
              </div>
              <div className="card-polsia p-5">
                <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                <p className="text-sm text-muted-foreground">
                  If you forgot to cancel and got charged, email us within 7 days for a full refund. No questions.
                </p>
              </div>
              <div className="card-polsia p-5">
                <h4 className="font-medium mb-2">Is the free audit really free?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes. Unlimited. No signup. The free audit is the top-of-funnel — we want it shared everywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
          AuditGPT · The truth engine for AI businesses.
        </div>
      </footer>
    </div>
  );
}
