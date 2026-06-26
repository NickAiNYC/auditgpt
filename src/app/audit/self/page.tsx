import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'AuditGPT — Self Review',
};

// The previous self-audit page rendered a frozen JSON snapshot of the old
// Polsia-killer schema. The schema has been retired (Scrutexity v2). This
// page now points visitors at the live sample report and the snapshot flow,
// keeping the URL alive for any inbound links.
export default function SelfReviewPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border px-6 py-4 bg-background">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <Logo variant="full" height={28} />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <div className="border-2 border-foreground rounded-sm p-8 text-center space-y-6">
          <ShieldCheck className="h-10 w-10 mx-auto" />
          <h1 className="font-serif text-3xl">AuditGPT Self Review</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            The self-review surface is being rebuilt against the new Scrutexity Visibility &amp; Trust schema.
            In the meantime, see the live sample report or run a free 3-point snapshot.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/sample-report"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-5 py-3 rounded-sm text-sm font-mono uppercase tracking-wider"
            >
              View sample report <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/snapshot"
              className="inline-flex items-center justify-center gap-2 border border-foreground px-5 py-3 rounded-sm text-sm font-mono uppercase tracking-wider"
            >
              Run free snapshot <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
