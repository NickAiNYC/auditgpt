import { ArrowLeft, ArrowRight, BarChart3, Database, FileText, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export const metadata = {
  title: 'State of Med-Spa AI Answer Reality — AuditGPT',
  description:
    'AuditGPT tracks how med-spa, GLP-1, aesthetics, and wellness claims appear to AI answer engines and where public proof gaps distort buyer trust.',
};

const FINDINGS = [
  ['GLP-1 pages', 'Outcome, speed, provider-supervision, compounded-medication, and eligibility language often outpaces visible support.'],
  ['Body contouring pages', 'Device language, permanence claims, and before/after galleries frequently lack enough context for AI systems to cite confidently.'],
  ['Injectables pages', 'Provider credentials and safety framing are often present somewhere on the site but not adjacent to the claim being made.'],
  ['IV therapy pages', 'Wellness, immunity, hydration, and recovery language needs tighter substantiation and clearer non-diagnostic framing.'],
  ['Exosome / regenerative pages', 'The highest-risk pages often mix emerging treatment language, authority claims, and implied outcomes without enough visible support.'],
  ['RF microneedling pages', 'Downtime, pain, skin-tightening, and result-window claims commonly need narrower wording and clearer device-specific support.'],
];

const DATA_MODEL = [
  'Claim category',
  'Risk label',
  'Evidence type',
  'Missing proof',
  'Safer rewrite',
  'AI answer distortion',
  'Vertical and treatment type',
  'Review date and cleanup status',
];

export default function StateOfMedspaAiAnswerRealityPage() {
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
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                Category Creation Report
              </span>
            </div>
            <h1 className="font-serif font-light text-5xl sm:text-7xl leading-tight mb-6 text-stone-900">
              Nobody owns AI Answer Reality for healthcare.
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              Broad AI visibility tools show whether a brand appears in AI answers. AuditGPT reviews whether public med-spa and wellness claims are supported enough for buyers, AI systems, agencies, and diligence teams to trust.
            </p>
          </section>

          <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['Visibility is not accuracy', 'A clinic can appear in AI answers and still be described inaccurately, weakly, or with missing safety context.'],
              ['Proof must be adjacent', 'AI answer engines rely on visible, structured, nearby support. Buried credentials and vague proof blocks get discounted.'],
              ['Receipts create workflow', 'The Claim Intelligence Receipt gives agencies and operators a concrete artifact before a high-claim page goes live.'],
            ].map(([title, body]) => (
              <div key={title} className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
                <h2 className="font-serif text-2xl text-stone-900 mb-3">{title}</h2>
                <p className="text-sm text-stone-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </section>

          <section className="mb-16 bg-stone-900 text-white rounded-sm p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <ShieldAlert className="h-6 w-6 text-amber-400" />
              <h2 className="font-serif text-3xl">The first audit themes we track.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FINDINGS.map(([title, body]) => (
                <div key={title} className="border-t border-stone-700 pt-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-stone-300 mb-2">{title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6">
            <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
              <BarChart3 className="h-6 w-6 text-stone-400 mb-4" />
              <h2 className="font-serif text-3xl text-stone-900 mb-4">This starts as teardowns, not fake benchmarks.</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Early reports should be framed as market teardowns: &ldquo;We reviewed 10 GLP-1 clinic pages. Here is what broke.&rdquo; The annual benchmark comes later, once the dataset has enough volume to deserve statistical language.
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
              <Database className="h-6 w-6 text-stone-400 mb-4" />
              <h2 className="font-serif text-3xl text-stone-900 mb-4">The compounding loop.</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DATA_MODEL.map((item) => (
                  <div key={item} className="bg-stone-50 border border-stone-200 p-3 rounded-sm text-[11px] font-mono uppercase tracking-wider text-stone-600">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-16 bg-white border border-stone-200 rounded-sm p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 text-stone-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-serif text-3xl text-stone-900 mb-4">The 2027 target.</h2>
                <p className="text-lg text-stone-700 leading-relaxed mb-4">
                  By the end of 2027, AuditGPT should be able to answer: &ldquo;What claims are most common on GLP-1 clinic pages, which ones are least supported, and how do AI answers distort them?&rdquo; from observed audit data, not desk research.
                </p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  That dataset becomes the moat: claim patterns, risk categories, rewrite effectiveness, proof gaps, and AI answer distortion frequency by treatment category.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center border-t border-stone-200 pt-12">
            <h2 className="font-serif text-3xl text-stone-900 mb-4">Contribute one page to the index.</h2>
            <p className="text-stone-500 mb-8 max-w-xl mx-auto">
              Start with a free snapshot or upgrade to a Claim Intelligence Report when you need a receipt, badge summary, and cleanup path.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/snapshot" className="inline-flex items-center bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors">
                Run Free Snapshot <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link href="/ai-claim-accuracy-content-stack" className="inline-flex items-center px-8 py-4 text-sm font-mono uppercase tracking-widest text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-sm transition-colors">
                Read Content Stack Thesis
              </Link>
              <Link href="/claim-review-methodology" className="inline-flex items-center px-8 py-4 text-sm font-mono uppercase tracking-widest text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-sm transition-colors">
                View Methodology
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
