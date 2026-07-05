import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { CheckCircle2, ScrollText, ArrowRight, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Payment received — AuditGPT',
  description: 'Your AuditGPT purchase is confirmed. Here are your next steps.',
};

// Plan ids come from the /pricing checkout (tier.id): 'evidence' | 'monitor' | 'agency'.
// Keep this in sync with TIERS in src/app/pricing/page.tsx.
const PLAN_CONTENT = {
  evidence: {
    label: 'Claim Intelligence Report',
    priceHint: '$497 one-time',
    confirm: 'Your Claim Intelligence Report is being prepared.',
    includes: [
      'Claim Health Score',
      'Dated Claim Intelligence Receipt',
      'Reviewed by AuditGPT badge + static summary',
      'AI Answer Reality Receipt',
      'Top risky claims — labeled supported / weak / unsupported / overstated',
      'Safer rewrites',
      'Proof-gap map',
      '7-day fix plan',
    ],
    nextTitle: 'Tell us which page to review',
    nextBody:
      'Submit the homepage, landing page, or sales page you want reviewed. Your founder-led report follows by email — typically within 3 business days.',
    ctaLabel: 'Submit your page',
    ctaHref: '/auditgpt',
  },
  monitor: {
    label: 'Claim Drift Monitoring',
    priceHint: '$299 / month',
    confirm: 'Your Claim Drift Monitoring subscription is active.',
    includes: [
      'Monthly rescans across your buyer-facing surfaces',
      'Updated AI Answer Reality Receipt each cycle',
      'Claim drift alerts when wording or evidence shifts',
      'Refreshed proof-gap map',
    ],
    nextTitle: 'Tell us what to monitor',
    nextBody:
      'Submit the surfaces you want tracked. We rescan on a monthly cycle and brief you on what changed.',
    ctaLabel: 'Add your surfaces',
    ctaHref: '/auditgpt',
  },
  agency: {
    label: 'Agency Receipt Beta',
    priceHint: '$499 / month',
    confirm: 'Welcome to the Agency Receipt Beta.',
    includes: [
      '10 white-label Claim Intelligence Receipts per month',
      'Reviewed-badge summaries for client sites',
      'Launch packet approval language',
      'Founder-led onboarding',
      'Priority audits',
    ],
    nextTitle: 'Book your onboarding',
    nextBody:
      'A founder-led onboarding call gets your first client audits running under your brand.',
    ctaLabel: 'Start onboarding',
    ctaHref: '/agency',
  },
} as const;

type PlanKey = keyof typeof PLAN_CONTENT;

const GENERIC = {
  label: 'AuditGPT',
  priceHint: '',
  confirm: 'Your purchase is confirmed.',
  includes: [] as string[],
  nextTitle: 'Submit your first page',
  nextBody: 'Run a review on the page you want checked and we’ll take it from there.',
  ctaLabel: 'Get started',
  ctaHref: '/auditgpt',
};

function firstParam(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

// Best-effort server-side confirmation that the Stripe session was actually paid.
// Adds the verified amount + receipt email when Stripe is configured; degrades
// gracefully (returns null) when it isn't, so the page still renders the
// plan-based confirmation.
async function verifySession(
  sessionId: string,
): Promise<{ amountLabel: string | null; email: string | null } | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !sessionId) return null;
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(key, { apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid' && session.status !== 'complete') return null;
    const amountLabel =
      typeof session.amount_total === 'number'
        ? (session.amount_total / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: (session.currency || 'usd').toUpperCase(),
          })
        : null;
    return { amountLabel, email: session.customer_details?.email ?? null };
  } catch {
    return null;
  }
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const planKey = firstParam(sp.plan) as PlanKey;
  const sessionId = firstParam(sp.session_id);
  const content = PLAN_CONTENT[planKey] ?? GENERIC;

  const verified = await verifySession(sessionId);
  const receiptEmail = verified?.email ?? null;
  const amountLabel = verified?.amountLabel ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Confirmation header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-foreground" />
              </div>
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Payment received{content.priceHint ? ` · ${content.priceHint}` : ''}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl mb-3 leading-tight">{content.confirm}</h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {amountLabel
                ? `We’ve confirmed your ${amountLabel} payment for the ${content.label}.`
                : `Thank you for your ${content.label} purchase.`}{' '}
              {receiptEmail ? (
                <>A Stripe receipt is on its way to {receiptEmail}.</>
              ) : (
                <>A Stripe receipt is on its way to your email.</>
              )}
            </p>
          </div>

          {/* What you bought */}
          {content.includes.length > 0 && (
            <div className="card-polsia p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <ScrollText className="h-4 w-4" />
                <h2 className="font-serif text-lg">What’s included</h2>
              </div>
              <ul className="space-y-3 text-sm">
                {content.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next step */}
          <div className="card-polsia p-6 mb-6">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Next step
            </div>
            <h2 className="font-serif text-xl mb-2">{content.nextTitle}</h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{content.nextBody}</p>
            <Link
              href={content.ctaHref}
              className="btn-cta"
              style={{ width: 'auto', padding: '0.75rem 1.5rem', display: 'inline-flex' }}
            >
              {content.ctaLabel} <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          {/* Support */}
          <div className="card-polsia p-6 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              Questions about your order? Email{' '}
              <a href="mailto:hello@auditgpt.ai" className="text-foreground underline underline-offset-2">
                hello@auditgpt.ai
              </a>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/70 text-center mt-8 max-w-lg mx-auto leading-relaxed">
            AuditGPT reviews public website claims against visible evidence and suggests safer
            rewrites. It does not provide legal, medical, regulatory, or clinical advice, and does
            not guarantee compliance, rankings, AI answer changes, or revenue outcomes.
          </p>
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
