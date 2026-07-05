import { ArrowRight, ArrowLeft, ShieldCheck, FileText, Bot, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export const metadata = {
  title: 'Agency Claim Intelligence Receipts — AuditGPT',
  description: 'White-label Claim Intelligence Receipts, review record summaries, and client approval language for high-claim launches.',
};

export default function AgencyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] font-sans">
      <header className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                For Agencies
              </span>
            </div>
            <h1 className="font-serif font-light text-5xl sm:text-6xl leading-tight mb-6 text-stone-900">
              The claim-review receipt your agency attaches to high-claim launches.
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Give clients a dated Claim Intelligence Receipt that shows what was reviewed, what proof was missing, what safer language was recommended, and what the client approved before launch. Founding Beta: $499/mo for the first 5 partners, then $799/mo.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/pricing" className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors flex items-center">
                Join the Receipt Beta — $499/mo <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link href="/auditgpt" className="px-8 py-4 text-base font-mono uppercase tracking-widest text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-sm transition-colors flex items-center justify-center shadow-sm">
                Run one client sample
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <FileText className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-2xl mb-2 text-stone-900">White-Label Receipt</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Export client-ready Claim Intelligence Receipts with your agency's branding. Present claim gaps, AI answer reality risks, safer rewrites, and launch approval status as your own deliverable.
                </p>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">Custom Branding Included</div>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <Bot className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-2xl mb-2 text-stone-900">10 Receipts / Month</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Generate Claim Intelligence Receipts for high-claim pages, launches, and client approvals. Use them as sales wedges, launch packet attachments, or quarterly retained-client reviews.
                </p>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">Launch Packet Artifact</div>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <ShieldCheck className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-2xl mb-2 text-stone-900">Review Record Summary</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Give clients a conservative "Reviewed by AuditGPT" badge page showing the audit date, claim categories checked, cleanup status, and next review date. It does not certify truth, ranking, or compliance.
                </p>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">Reviewed, Not Approved</div>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm bg-stone-50">
                <Shield className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-2xl mb-2 text-stone-900">Built for Trust Sectors</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Perfect for agencies serving healthcare, med spas, legal, finance, and AI/SaaS — industries where an unsupported claim can lead to regulatory action or lost deals.
                </p>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">Claim-Sensitive</div>
              </div>
              <div id="creator-white-label" className="bg-white border border-stone-900 p-8 rounded-sm shadow-sm md:col-span-2">
                <Users className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-2xl mb-2 text-stone-900">Personal Brand White-Label</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Run Sponsor-Ready Claim Audits for creators, founders, experts, and influencer talent using the same report format: Claim Health Score, AI Answer Reality Receipt, safer rewrites, and proof-gap mapping. Built for talent managers, creator agencies, and personal brand consultants.
                </p>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">No reputation repair or guaranteed AI outcome promises</div>
              </div>
            </div>
          </section>

          {/* For AI/SaaS Founders */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  For AI / SaaS Founders
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-4 text-stone-900">
                Document public claim risk before you launch.
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto text-lg">
                Your homepage may make promises your evidence does not visibly support. We find the gap before prospects, platforms, or AI research agents repeat it.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <Shield className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-xl mb-3 text-stone-900">Stop SDR Blowback</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Stop your SDRs from sending decks that promise what your product cannot visibly support. Every claim on your site is checked against the evidence available to buyers.
                </p>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <FileText className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-xl mb-3 text-stone-900">Investor-Ready Diligence</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Give investors a pre-vetted claim inventory before diligence. Show them exactly what your product does, with evidence for every capability you market.
                </p>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <Bot className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-xl mb-3 text-stone-900">Ship Safer Copy Faster</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Ship safer copy faster by pre-validating claims against your evidence base. Know what you can say before your marketing team writes a single word.
                </p>
              </div>
            </div>
          </section>

          {/* For Agencies */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  For Agencies
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-4 text-stone-900">
                Differentiate your agency with proprietary intelligence.
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto text-lg">
                Give clients a concrete receipt before risky pages go live — and turn that artifact into recurring revenue.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <ShieldCheck className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-xl mb-3 text-stone-900">Justify Your Retainers</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Give clients a dated receipt, review record, and cleanup queue to justify retainers. Show what was reviewed, what changed, and what still needs proof.
                </p>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <ArrowRight className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-xl mb-3 text-stone-900">Win Competitive Pitches</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Win competitive pitches with a proprietary audit. Walk into meetings with a pre-built analysis of the prospect's current claim landscape.
                </p>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <FileText className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-xl mb-3 text-stone-900">Recurring Billable Work</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Turn claim receipts into recurring billable work. Add Claim Intelligence as a launch-review and quarterly-rescan service line.
                </p>
              </div>
            </div>
          </section>

          {/* Talent Agency Outreach */}
          <section className="mb-20">
            <div className="bg-white border border-stone-200 p-8 sm:p-10 rounded-sm shadow-sm">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  Creator agency wedge
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-4 text-stone-900">
                Run a Sponsor-Ready audit on one of your talent.
              </h2>
              <p className="text-stone-600 max-w-2xl text-sm leading-relaxed mb-6">
                Give talent managers a concrete way to protect brand-deal language before sponsors, platforms, or AI research agents flag risky income, result, credential, or authority claims.
              </p>
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-sm mb-6">
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">Outreach copy</div>
                <p className="text-sm text-stone-700 leading-relaxed font-serif italic">
                  “Want us to run a Sponsor-Ready audit on one of your talent? We’ll show the claims a brand, platform, or AI answer engine may question, then give you safer sponsor language and a proof-gap map you can use before the next deal.”
                </p>
              </div>
              <Link href="/personal-brand-audit" className="inline-flex items-center justify-center bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors">
                View Personal Brand Audit <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </section>

          {/* Launch Cohort Callout */}
          <section className="mb-20">
            <div className="bg-stone-900 text-white p-10 sm:p-12 rounded-sm text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                <span className="text-xs uppercase tracking-widest text-stone-300 font-mono font-bold">
                  Limited Availability
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-4">The First 10 Program</h2>
              <p className="text-stone-300 max-w-xl mx-auto mb-8 text-lg leading-relaxed">
                Limited to 10 high-risk, high-growth brands. Includes founder-led onboarding, priority receipts, and review record summaries. <strong>Join the cohort →</strong>
              </p>
              <Link
                href="/pricing"
                className="bg-white text-stone-900 px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-100 transition-colors inline-flex items-center justify-center"
              >
                Apply for the First 10 <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </section>

          {/* Founder CTA */}
          <section className="py-12 border-t border-stone-200">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl sm:text-4xl mb-4 text-stone-900">Ship a claim-reviewed homepage in 7 days</h2>
              <p className="text-stone-500 mb-10 max-w-lg mx-auto">
                From URL submission to reviewed, better-supported copy in one week. No endless revisions — just a clearer record of what your page claims and what still needs support.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-4 font-mono text-sm font-bold">1</div>
                <h3 className="font-serif text-lg mb-2 text-stone-900">Submit URL</h3>
                <p className="text-sm text-stone-500">Point us at your homepage and top landing pages. That's it — we do the rest.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-4 font-mono text-sm font-bold">2</div>
                <h3 className="font-serif text-lg mb-2 text-stone-900">Get Findings</h3>
                <p className="text-sm text-stone-500">Receive a full claim audit: reviewed claims, unsupported claims, and risk-rated gaps.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-4 font-mono text-sm font-bold">3</div>
                <h3 className="font-serif text-lg mb-2 text-stone-900">Apply Rewrites</h3>
                <p className="text-sm text-stone-500">Use our evidence-backed rewrite suggestions to ship copy you can stand behind.</p>
              </div>
            </div>
            <div className="text-center">
              <Link
                href="/auditgpt"
                className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center justify-center"
              >
                Audit Your Homepage <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
