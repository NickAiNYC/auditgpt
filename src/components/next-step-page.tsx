// ============================================================
// NextStepPage — shared layout for /next-step/* pages.
// Every page is a small, credible landing that gives the
// AuditGPT report a place to land. No fake testimonials.
// No guarantees. One CTA: "Book a 15-minute review."
// ============================================================

import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Logo } from '@/components/logo';
import { WedgeStrip } from '@/components/wedge';

interface NextStepPageProps {
  productName: string;
  productHeadline: string;
  productExplainer: string;
  whatTheFindingMeans: string;
  bookingUrl?: string;
}

export function NextStepPage({
  productName,
  productHeadline,
  productExplainer,
  whatTheFindingMeans,
  bookingUrl,
}: NextStepPageProps) {
  // Default to mailto until a calendar link is set
  const cta =
    bookingUrl ||
    `mailto:hello@auditgpt.ai?subject=15-min%20review%20-%20${encodeURIComponent(productName)}`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
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
                Recommended next step
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-3">
              {productName}
            </h1>
            <p className="text-lg text-foreground/80 max-w-xl mx-auto mb-5">
              {productHeadline}
            </p>
            <div className="flex justify-center">
              <WedgeStrip />
            </div>
          </div>

          {/* What this product is */}
          <div className="bg-white border border-border rounded-sm p-6 sm:p-8 mb-6">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              What it is
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed">{productExplainer}</p>
          </div>

          {/* What the AuditGPT finding means */}
          <div className="bg-white border border-border rounded-sm p-6 sm:p-8 mb-6">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Why AuditGPT recommended this for you
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed">{whatTheFindingMeans}</p>
          </div>

          {/* CTA */}
          <div className="bg-black text-white rounded-sm p-6 sm:p-8 text-center">
            <Calendar className="h-6 w-6 mx-auto mb-3" />
            <h2 className="font-serif text-2xl mb-2">Book a 15-minute review</h2>
            <p className="text-sm text-white/80 mb-5 max-w-md mx-auto">
              Bring your AuditGPT report. We&apos;ll walk through the findings together and outline what {productName} would actually deliver. No pitch deck.
            </p>
            <a
              href={cta}
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-sm text-sm font-mono uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              Book the 15-minute review
            </a>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed max-w-xl mx-auto">
            AuditGPT outputs are based on public website review and provided context. They are not legal, clinical, regulatory, compliance, ranking, revenue, or AI visibility guarantees.
          </p>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
          AuditGPT by Scrutexity · Claim ↔ Evidence ↔ AI/search readability ↔ Demand leakage
        </div>
      </footer>
    </div>
  );
}
