import { ArrowLeft, ArrowRight, BookOpen, FileCheck2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export const metadata = {
  title: 'Claim Review Methodology — AuditGPT',
  description:
    'AuditGPT reviews public health, wellness, med-spa, and AI-era marketing claims against visible support, implied meaning, AI answer distortion, and safer rewrite options.',
};

const METHOD_STEPS = [
  {
    title: 'Identify express and implied claims',
    body: 'We separate literal statements from the impression a reasonable buyer, patient, prospect, or AI answer engine may take away from the page.',
  },
  {
    title: 'Map visible substantiation',
    body: 'Each claim is checked against adjacent proof: studies, device references, provider credentials, citations, before/after context, testimonials, disclosures, and linked evidence.',
  },
  {
    title: 'Classify support strength',
    body: 'Claims are labeled supported, weakly supported, overstated, or unsupported. The label is a business review signal, not a legal conclusion.',
  },
  {
    title: 'Test AI Answer Reality',
    body: 'We examine how answer engines may summarize, qualify, ignore, or distort claims when public evidence is missing or buried.',
  },
  {
    title: 'Recommend safer framing',
    body: 'The report gives replacement language that preserves the marketing point while narrowing the claim to what the public support can actually carry.',
  },
  {
    title: 'Issue a dated receipt',
    body: 'Paid reports produce a Claim Intelligence Receipt and reviewed-badge summary showing what was reviewed, what was found, and what remains pending.',
  },
];

const REVIEW_AREAS = [
  ['Treatment outcome claims', 'Results, speed, permanence, safety, discomfort, downtime, recovery, and predictability.'],
  ['Device and FDA language', 'Whether FDA-cleared, FDA-approved, clinical, medical-grade, or patented language is used precisely.'],
  ['Testimonials and before/after content', 'Whether consumer stories imply typical results without the context needed to avoid overstatement.'],
  ['Credentials and provider authority', 'Whether titles, licenses, training, and supervision claims are visible and current enough to support trust.'],
  ['AI answer distortion', 'Whether AI systems are likely to repeat, soften, contradict, or ignore the brand claim.'],
  ['Cleanup path', 'What can be fixed with copy edits, what needs proof, and what should be escalated for professional review.'],
];

export default function ClaimReviewMethodologyPage() {
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
                Claim Review Methodology
              </span>
            </div>
            <h1 className="font-serif font-light text-5xl sm:text-7xl leading-tight mb-6 text-stone-900">
              The review layer for public health and wellness claims.
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              AuditGPT turns a public page into a structured claim record: what is being said, what support is visible, what an AI answer may repeat, and what should be rewritten or escalated.
            </p>
          </section>

          <section className="mb-16 bg-white border border-stone-200 rounded-sm p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <BookOpen className="h-6 w-6 text-stone-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-serif text-2xl text-stone-900 mb-3">Built around public substantiation discipline.</h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  AuditGPT is not a law firm, regulator, clinical reviewer, or compliance certification. Our methodology is designed to help teams operationalize claim-support discipline around public-facing pages. It is informed by public business guidance such as the FTC&apos;s Health Products Compliance Guidance, which emphasizes truthful, non-misleading claims and appropriate substantiation for health-related advertising.
                </p>
                <a
                  href="https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-xs font-mono uppercase tracking-widest text-stone-700 underline underline-offset-4 hover:text-stone-900"
                >
                  FTC Health Products Compliance Guidance <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-6 text-center">How the review works</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {METHOD_STEPS.map((step, index) => (
                <div key={step.title} className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-4">0{index + 1}</div>
                  <h3 className="font-serif text-xl text-stone-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16 bg-stone-900 text-white rounded-sm p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="h-6 w-6 text-stone-400" />
              <h2 className="font-serif text-3xl">What we review in health, wellness, and med-spa pages.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REVIEW_AREAS.map(([title, body]) => (
                <div key={title} className="border-t border-stone-700 pt-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-stone-300 mb-2">{title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
              <FileCheck2 className="h-6 w-6 text-stone-400 mb-4" />
              <h2 className="font-serif text-2xl text-stone-900 mb-3">The output is a receipt.</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                A Claim Intelligence Receipt records the review date, claim categories, support status, safer rewrite options, cleanup status, and next review date. It says reviewed, not approved.
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-stone-400 mb-4" />
              <h2 className="font-serif text-2xl text-stone-900 mb-3">The boundary is explicit.</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                AuditGPT does not certify compliance, make medical judgments, provide legal advice, guarantee ad approvals, or determine whether a claim is lawful. It creates a structured review artifact so teams can fix and escalate intelligently.
              </p>
            </div>
          </section>

          <section className="text-center border-t border-stone-200 pt-12">
            <h2 className="font-serif text-3xl text-stone-900 mb-4">Review one public page first.</h2>
            <p className="text-stone-500 mb-8 max-w-xl mx-auto">
              Start with a snapshot, then upgrade to a paid Claim Intelligence Report when you need a dated receipt and reviewed-badge summary.
            </p>
            <Link href="/snapshot" className="inline-flex items-center bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors">
              Run Free Snapshot <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
