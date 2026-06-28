import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, CheckCircle2, FileText, ShieldAlert, Sparkles } from 'lucide-react';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
  title: 'Personal Brand Claim Audit | AuditGPT',
  description:
    'AuditGPT scans creator, founder, and expert public profiles for unsupported claims, outdated credentials, sponsorship risks, and AI answer distortion.',
  alternates: {
    canonical: '/personal-brand-audit',
  },
};

const OFFERS = [
  {
    name: 'Personal Brand Snapshot',
    price: '$99',
    detail: 'A focused public-surface scan for a creator, founder, expert, or personal brand.',
    includes: ['Claim Health Score', 'Top public claim risks', 'AI Answer Reality Receipt'],
  },
  {
    name: 'Sponsor-Ready Claim Audit',
    price: '$399',
    detail: 'The flagship report for sponsorship, advisory, media, and partner diligence review.',
    includes: ['Sponsor-Readiness Score', 'Income/result/credential claim review', 'Safer sponsorship language'],
    featured: true,
  },
  {
    name: 'Creator Cleanup Sprint',
    price: '$1,999',
    detail: 'A short sprint to turn flagged claims into safer language and proof-ready assets.',
    includes: ['Rewrite queue', 'Proof-gap map', 'Contento-ready claim library'],
  },
  {
    name: 'Ongoing Governance',
    price: '$299/mo',
    detail: 'Monthly monitoring for claim drift across launches, sponsor pages, bios, and pinned content.',
    includes: ['Monthly rescan', 'Updated AI Answer Reality Receipt', 'Proof asset refresh list'],
  },
] as const;

const ARTIFACTS = [
  'Claim Health Score',
  'AI Answer Reality Receipt',
  'Safer rewrites',
  'Proof gaps',
  'Sponsor-Readiness Score',
  'Path to Proof assets, AI Visibility, and Contento activation',
] as const;

const SAMPLE_FINDINGS = [
  {
    claim: '"Helped creators 10x sponsorship revenue in 90 days."',
    risk: 'Result claim without visible cohort definition, proof source, or qualifying context.',
    rewrite:
      'Helped selected creators improve sponsor packaging, pricing clarity, and proof presentation during 90-day advisory sprints.',
  },
  {
    claim: '"Featured by every major wellness brand."',
    risk: 'Credential claim is too broad and could be challenged by sponsors, platforms, or AI summaries.',
    rewrite:
      'Featured in campaigns and collaborations with multiple wellness brands; source list available on request.',
  },
  {
    claim: '"The top expert in creator monetization."',
    risk: 'Superlative authority claim with no ranking source or third-party proof.',
    rewrite:
      'Creator monetization advisor focused on sponsorship readiness, offer clarity, and claim-safe positioning.',
  },
] as const;

export default function PersonalBrandAuditPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] font-sans text-stone-900">
      <header className="border-b border-stone-200 bg-white/60 backdrop-blur-md sticky top-0 z-40">
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

      <main className="flex-1">
        <section className="px-4 sm:px-6 py-16 sm:py-24 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-end">
            <div>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  Personal Brand / Creator Audit
                </span>
              </div>
              <h1 className="font-serif font-light text-5xl sm:text-6xl leading-tight mb-6 text-stone-900">
                Sponsor-Ready Claim Intelligence for creators, founders, experts, and personal brands.
              </h1>
              <p className="text-lg text-stone-600 max-w-2xl mb-8 leading-relaxed">
                AuditGPT scans public surfaces — bio, website, social links, pinned content, and sponsor-facing pages — to show what sponsors, platforms, and AI systems may believe about your claims.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/snapshot?source=personal-brand-audit" className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center justify-center">
                  Run Personal Brand Snapshot <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <a href="#creator-sample-report" className="px-8 py-4 text-sm font-mono uppercase tracking-widest text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-sm transition-colors inline-flex items-center justify-center">
                  View Creator Sample
                </a>
              </div>
            </div>

            <div className="bg-stone-900 text-white border border-stone-800 rounded-sm p-6 sm:p-8 shadow-2xl">
              <div className="flex items-start gap-3 pb-5 border-b border-stone-700">
                <BadgeCheck className="h-6 w-6 text-stone-300 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1">Flagship offer</div>
                  <h2 className="font-serif text-3xl">Sponsor-Ready Claim Audit</h2>
                </div>
              </div>
              <div className="grid gap-3 mt-6">
                {[
                  ['Sponsor-Readiness Score', 'How ready your claim surface is for brand review.'],
                  ['Risky claims', 'Income, result, credential, authority, and audience claims that need support.'],
                  ['AI Answer Reality Receipt', 'How AI answers and public summaries may describe you.'],
                  ['Proof-gap map', 'What a sponsor would reasonably ask you to document.'],
                ].map(([title, body]) => (
                  <div key={title} className="bg-stone-800/60 border border-stone-700 p-4 rounded-sm">
                    <h3 className="font-serif text-lg text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-400">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-16 border-t border-stone-100 bg-stone-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">Creator + Agency Versions</div>
            <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-10 text-stone-900 max-w-2xl">
              One report engine, two distribution paths.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <Sparkles className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-3xl mb-3">Creator version</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Built for creators, founders, experts, coaches, operators, and public-facing personal brands preparing for sponsorship, advisory, media, or launch scrutiny.
                </p>
              </div>
              <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
                <Building2 className="h-6 w-6 text-stone-400 mb-4" />
                <h3 className="font-serif text-3xl mb-3">Agency version</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  White-label the same audit for creator agencies, talent managers, personal brand consultants, and firms managing founder-led clients or influencer talent.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-16 border-t border-stone-100 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">Offers</div>
            <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-10 text-stone-900 max-w-3xl">
              Start with the audit. Scale only when the claim surface keeps changing.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {OFFERS.map((offer) => (
                <div key={offer.name} className={`relative p-6 border rounded-sm ${offer.featured ? 'bg-stone-50 border-stone-900 shadow-md' : 'bg-white border-stone-200'}`}>
                  {offer.featured && (
                    <div className="absolute -top-3 left-5 bg-stone-900 text-white px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest">
                      Flagship
                    </div>
                  )}
                  <h3 className="font-serif text-2xl leading-tight mb-4">{offer.name}</h3>
                  <div className="font-serif text-4xl mb-4">{offer.price}</div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-5">{offer.detail}</p>
                  <ul className="space-y-2">
                    {offer.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed">
                        <CheckCircle2 className="h-3.5 w-3.5 text-stone-900 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-16 border-t border-stone-100 bg-stone-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">Same AuditGPT Artifacts</div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-5 text-stone-900">
                No separate Creator OS. No reputation repair promises.
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                This is the same claim intelligence system pointed at a personal brand surface. The output connects to Proof assets, AI Visibility, and Contento when there is implementation work worth activating.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ARTIFACTS.map((artifact) => (
                <div key={artifact} className="bg-white border border-stone-200 p-4 rounded-sm">
                  <FileText className="h-4 w-4 text-stone-400 mb-3" />
                  <p className="text-sm font-medium text-stone-900">{artifact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="creator-sample-report" className="px-4 sm:px-6 py-16 border-t border-stone-100 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mb-10">
              <div className="text-[10px] font-mono uppercase tracking-widest text-red-500 mb-3">Fictional creator sample report</div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-5 text-stone-900">
                Creator Sample Report: Maya Stone, Sponsorship Advisor
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                This example is fictional and for format demonstration only. It does not describe a real creator, client, sponsor review, platform decision, or legal conclusion.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-sm shadow-xl overflow-hidden">
              <div className="bg-stone-900 text-white p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1">AuditGPT Creator Report</div>
                  <div className="font-serif text-2xl">Sponsor-Ready Claim Audit</div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500">Status</div>
                  <div className="text-sm text-stone-300">Needs proof tightening</div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    ['Claim Health Score', '74/100'],
                    ['Sponsor-Readiness Score', '68/100'],
                    ['AI Answer Reality', 'Mixed clarity'],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-stone-50 border border-stone-200 p-5 rounded-sm">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">{label}</div>
                      <div className="font-serif text-4xl text-stone-900">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {SAMPLE_FINDINGS.map((finding) => (
                    <div key={finding.claim} className="bg-stone-50 border border-stone-200 p-5 rounded-sm">
                      <div className="flex items-start gap-3">
                        <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-serif text-xl text-stone-900 mb-3">{finding.claim}</h3>
                          <p className="text-sm text-stone-600 leading-relaxed">
                            <span className="font-semibold text-stone-900">Proof gap:</span> {finding.risk}
                          </p>
                          <p className="text-sm text-stone-600 leading-relaxed mt-2">
                            <span className="font-semibold text-stone-900">Safer rewrite:</span> {finding.rewrite}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-stone-900 text-white p-6 rounded-sm">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-3">AI Answer Reality Receipt</div>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    AI summaries consistently identify Maya as a sponsorship advisor, but overstate authority by implying broad industry ranking and omit the proof assets sponsors would expect. Recommended activation: publish a proof page, tighten bio claims, and route revised sponsorship copy through Contento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-16 border-t border-stone-100 bg-stone-50">
          <div className="max-w-4xl mx-auto bg-white border border-stone-200 p-8 sm:p-10 rounded-sm shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">Boundaries</div>
            <h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-5 text-stone-900">
              What this does and does not do.
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-8">
              AuditGPT provides strategy and claim intelligence. Reports do not constitute legal, clinical, regulatory, tax, accounting, platform, or sponsor approval advice. We do not promise reputation repair, suppression, guaranteed positive AI answers, guaranteed sponsor acceptance, guaranteed ranking, or guaranteed revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/snapshot?source=personal-brand-audit-bottom" className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center justify-center">
                Run Personal Brand Snapshot <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link href="/agency#creator-white-label" className="px-8 py-4 text-sm font-mono uppercase tracking-widest text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-sm transition-colors inline-flex items-center justify-center">
                Agency white-label access
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
