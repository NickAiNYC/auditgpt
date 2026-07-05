import { ArrowLeft, ArrowRight, CheckCircle2, FileSearch, PlugZap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export const metadata = {
  title: 'Who Owns AI Claim Accuracy? — AuditGPT',
  description:
    'Sitecore buying Scrunch validates AI visibility inside the content stack. AuditGPT extends the stack from visibility to claim accuracy, receipts, and pre-publish review.',
};

const MOVES = [
  {
    icon: FileSearch,
    title: 'Build the claim graph',
    body: 'Every audit should become structured data: claim text, treatment category, risk label, evidence type, missing proof, safer rewrite, AI distortion, source URL, review date, and cleanup status.',
  },
  {
    icon: PlugZap,
    title: 'Own the pre-publish gate',
    body: 'The product should move from pull to push: Chrome extension, CMS plugin, and one-button receipt generation before a high-claim page goes live.',
  },
  {
    icon: ShieldCheck,
    title: 'Verticalize healthcare first',
    body: 'GLP-1, injectables, body contouring, IV therapy, exosomes, and RF microneedling create the sharpest claim-risk taxonomy and the clearest acquisition story.',
  },
  {
    icon: CheckCircle2,
    title: 'Sell diligence',
    body: 'PE rollups, franchisors, and acquirers need pre-acquisition claim risk memos. That is higher ACV than a clinic audit and feeds the same dataset.',
  },
];

export default function AiClaimAccuracyContentStackPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] font-sans">
      <header className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <Link href="/" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                AI Content Stack Thesis
              </span>
            </div>
            <h1 className="font-serif font-light text-5xl sm:text-7xl leading-tight mb-6 text-stone-900">
              Sitecore bought AI visibility. Who owns AI claim accuracy?
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              AI visibility is moving into the CMS and DXP stack. The next layer is claim accuracy: whether the public claims that AI systems read, summarize, and repeat are actually supported.
            </p>
          </section>

          <section className="mb-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
            <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 shadow-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-4">Market signal</div>
              <h2 className="font-serif text-3xl text-stone-900 mb-4">Scrunch validated AI visibility as content-stack infrastructure.</h2>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Sitecore announced on June 3, 2026 that it acquired Scrunch to help brands influence discovery and buying decisions in the AI-search era. Adweek reported the deal was valued around $225M, citing Bloomberg; Sitecore did not publicly confirm the price.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.sitecore.com/company/newsroom/press-releases/2026/06/sitecore-acquires-scrunch-to-help-brands-influence-discovery--and-buying-decisions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono uppercase tracking-widest text-stone-700 underline underline-offset-4 hover:text-stone-900"
                >
                  Sitecore announcement
                </a>
                <a
                  href="https://www.adweek.com/media/sitecore-snaps-up-geo-startup-scrunch-for-225m/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono uppercase tracking-widest text-stone-700 underline underline-offset-4 hover:text-stone-900"
                >
                  Adweek reported price
                </a>
              </div>
            </div>
            <div className="bg-stone-900 text-white rounded-sm p-6 sm:p-8 shadow-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-4">AuditGPT position</div>
              <blockquote className="font-serif text-3xl leading-tight text-white mb-6">
                AuditGPT is the claim intelligence layer for the AI content stack.
              </blockquote>
              <p className="text-sm text-stone-400 leading-relaxed">
                Visibility tools answer: &ldquo;Does AI mention us?&rdquo; AuditGPT answers: &ldquo;Are the claims AI reads and repeats supported enough for buyers, agencies, diligence teams, and regulators to trust?&rdquo;
              </p>
            </div>
          </section>

          <section className="mb-16">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-6 text-center">Four acquisition-oriented moves</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {MOVES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
                  <Icon className="h-6 w-6 text-stone-400 mb-4" />
                  <h2 className="font-serif text-2xl text-stone-900 mb-3">{title}</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16 bg-white border border-stone-200 rounded-sm p-6 sm:p-8 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-4">Dataset monetization</div>
            <h2 className="font-serif text-3xl text-stone-900 mb-4">The dataset should become a product, not just a byproduct.</h2>
            <p className="text-lg text-stone-700 leading-relaxed mb-5">
              After enough audits, AuditGPT can sell comparison intelligence back to operators: how a clinic&apos;s GLP-1, injector, device, or wellness claims compare to local competitors and category norms.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ['Metro comparison', 'How your claim risk compares to nearby competitors.'],
                ['Treatment benchmark', 'Which claim types in your category are most often unsupported.'],
                ['Diligence memo', 'Claim-risk summary for buyers, PE rollups, franchisors, and acquirers.'],
              ].map(([title, body]) => (
                <div key={title} className="bg-stone-50 border border-stone-200 p-4 rounded-sm">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-stone-600 mb-2">{title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center border-t border-stone-200 pt-12">
            <h2 className="font-serif text-3xl text-stone-900 mb-4">Run the claim-accuracy layer on one page.</h2>
            <p className="text-stone-500 mb-8 max-w-xl mx-auto">
              Start with a public page snapshot, then upgrade when you need a dated Claim Intelligence Receipt and reviewed-badge summary.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/snapshot" className="inline-flex items-center bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors">
                Run Free Snapshot <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link href="/state-of-medspa-ai-answer-reality" className="inline-flex items-center px-8 py-4 text-sm font-mono uppercase tracking-widest text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-sm transition-colors">
                View Healthcare Wedge
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
