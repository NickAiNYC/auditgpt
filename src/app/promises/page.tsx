import Link from 'next/link';
import { Logo } from '@/components/logo';
import { WedgeStrip } from '@/components/wedge';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Promises & Anti-Promises — AuditGPT',
  description:
    'The plain-language list of what AuditGPT will do, what AuditGPT will not do, and what we would refund for.',
};

const WILL_DO = [
  'Identify visible claims on buyer-facing pages.',
  'Classify whether claims appear supported, weakly supported, overstated, unsupported, or needing evidence.',
  'Identify evidence and proof gaps.',
  'Identify AI/search readability gaps (whether the page clearly answers the buyer questions AI and search now ask).',
  'Identify claim drift risks (overstated claims, missing proof).',
  'Recommend safer framing for claims that lack evidence.',
  'Recommend a Scrutexity next step (Governed claim rewrites, AI Answer Reality monitoring, Verification and trust assets, Revenue leakage insights, Agency white-label reporting, or Manual review).',
];

const WILL_NOT_DO = [
  'Will not provide legal advice.',
  'Will not provide clinical, medical, or wellness advice.',
  'Will not certify legal, clinical, regulatory, or compliance status.',
  'Will not guarantee Google or any search engine ranking.',
  'Will not guarantee AI citations (ChatGPT, Gemini, Perplexity, Copilot, etc.).',
  'Will not guarantee revenue, leads, bookings, conversion lift, or pipeline.',
  'Will not verify absolute truth — we observe, we do not certify.',
  'Will not replace a human review on consequential decisions.',
];

const WILL_REFUND = [
  'If a paid audit invents evidence (fabricated quotes, customers, reviews, metrics, or sources).',
  'If a paid audit claims to certify legal, clinical, or regulatory compliance.',
  'If a paid audit guarantees rankings, citations, revenue, bookings, or any other outcome.',
  'If a paid audit fabricates third-party data we have not cited from the page itself.',
];

function Block({ title, items, subtitle }: { title: string; items: string[]; subtitle?: string }) {
  return (
    <section className="bg-white border border-border rounded-sm p-6 sm:p-8 mb-6">
      <h2 className="font-serif text-2xl mb-2">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>}
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-sm text-foreground/85 leading-relaxed border-b border-border last:border-0 pb-2 last:pb-0"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PromisesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-black" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Promises &amp; Anti-Promises
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-3">
              The plain version.
            </h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto mb-5">
              What AuditGPT will do, what it will not do, and what we would refund for. Pinned here so the
              scope of the product is always one click away.
            </p>
            <div className="flex justify-center">
              <WedgeStrip />
            </div>
          </div>

          <Block title="What AuditGPT will do" items={WILL_DO} />
          <Block title="What AuditGPT will not do" items={WILL_NOT_DO} />
          <Block
            title="What we would refund for"
            subtitle="If any of these happen on a paid audit, email hello@auditgpt.ai and we refund. No questions."
            items={WILL_REFUND}
          />

          <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
            AuditGPT outputs are based on public website review and provided context. They are not legal,
            clinical, regulatory, compliance, ranking, or revenue guarantees.
          </p>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
          AuditGPT by Scrutexity · Claim Intelligence for businesses where trust matters.
        </div>
      </footer>
    </div>
  );
}
