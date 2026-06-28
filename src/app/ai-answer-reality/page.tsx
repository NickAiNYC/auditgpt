import { ArrowRight, ArrowLeft, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export const metadata = {
  title: 'AI Answer Reality — AuditGPT',
  description: 'Stop tracking rankings. Start tracking whether AI tells the truth about you.',
};

export default function AiAnswerRealityPage() {
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
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                The Primary Wedge
              </span>
            </div>
            <h1 className="font-serif font-light text-5xl sm:text-7xl leading-tight mb-6 text-stone-900">
              Stop tracking rankings. <br />
              <span className="text-stone-500 italic">Start tracking whether AI tells the truth about you.</span>
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              AuditGPT checks how public claims, proof gaps, and brand descriptions may be interpreted by AI answer engines — so you can catch unsupported, overstated, or distorted claims before buyers do.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/snapshot" className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors flex items-center">
                Run Free Snapshot <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link href="/sample-medspa-report" className="px-8 py-4 text-base font-mono uppercase tracking-widest text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-sm transition-colors flex items-center justify-center shadow-sm">
                View Med Spa Sample
              </Link>
            </div>
          </div>

          {/* What AI tells buyers about you vs what you claim */}
          <section className="mb-20">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-6 text-center">Claim Perception Gap</div>
            <div className="bg-white border border-stone-200 rounded-md overflow-hidden shadow-sm">
              <div className="grid grid-cols-2 divide-x divide-stone-200">
                <div className="p-6 sm:p-8">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-5 text-center">What you claim on your site</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-stone-500 mb-1">Claim 1</div>
                      <p className="text-sm text-stone-700 font-medium">&ldquo;Industry-leading AI platform&rdquo;</p>
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-stone-500 mb-1">Claim 2</div>
                      <p className="text-sm text-stone-700 font-medium">&ldquo;Trusted by thousands&rdquo;</p>
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-stone-500 mb-1">Claim 3</div>
                      <p className="text-sm text-stone-700 font-medium">&ldquo;100% compliance guaranteed&rdquo;</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 bg-stone-50">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-amber-600 mb-5 text-center">What AI tells buyers</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-amber-500 mb-1">AI Verdict</div>
                      <p className="text-sm text-stone-600"><span className="text-red-500">✗</span> &ldquo;No independent benchmarks found — treating as marketing claim.&rdquo;</p>
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-amber-500 mb-1">AI Verdict</div>
                      <p className="text-sm text-stone-600"><span className="text-red-500">✗</span> &ldquo;No logos or case studies linked on page — evidence gap.&rdquo;</p>
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-amber-500 mb-1">AI Verdict</div>
                      <p className="text-sm text-stone-600"><span className="text-amber-500">⚠</span> &ldquo;Absolute guarantee without linked SOC2/HIPAA docs — overstatement risk.&rdquo;</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-stone-900 px-6 py-3 text-center">
                <p className="text-xs font-mono uppercase tracking-widest text-stone-400">This gap costs you credibility. AuditGPT closes it.</p>
              </div>
            </div>
          </section>

          {/* What AI may get wrong */}
          <section className="mb-20">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-4 text-center">What AI Engines Get Wrong</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200 p-6 rounded-md shadow-sm">
                <AlertCircle className="h-6 w-6 text-amber-500 mb-4" />
                <h3 className="font-serif text-xl mb-2 text-stone-900">Overstated Claims</h3>
                <p className="text-sm text-stone-600 leading-relaxed">AI systems cross-reference claims against external reality. If you say "number one," AI will check. If there's no proof, it will ignore you or label the claim as unverified.</p>
              </div>
              <div className="bg-white border border-stone-200 p-6 rounded-md shadow-sm">
                <ShieldCheck className="h-6 w-6 text-amber-500 mb-4" />
                <h3 className="font-serif text-xl mb-2 text-stone-900">Proof Gaps</h3>
                <p className="text-sm text-stone-600 leading-relaxed">When evidence is buried on a PDF three clicks deep, LLMs won't find it. They summarize what's immediately adjacent to the claim.</p>
              </div>
              <div className="bg-white border border-stone-200 p-6 rounded-md shadow-sm">
                <AlertTriangle className="h-6 w-6 text-amber-500 mb-4" />
                <h3 className="font-serif text-xl mb-2 text-stone-900">Competitor Displacement</h3>
                <p className="text-sm text-stone-600 leading-relaxed">If a competitor has weaker marketing but stronger visible evidence, AI answer engines will cite them over you in buyer research queries.</p>
              </div>
            </div>
          </section>

          {/* Sample AI Distortion Table */}
          <section className="mb-20">
            <h2 className="font-serif text-3xl mb-6 text-stone-900 border-b border-stone-200 pb-4">Sample AI Distortion Ledger</h2>
            <div className="bg-white border border-stone-200 rounded-md overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200 font-mono text-xs uppercase tracking-wider text-stone-500">
                    <tr>
                      <th className="p-4 w-[30%]">Your Claim</th>
                      <th className="p-4 w-[35%]">How AI Interprets It</th>
                      <th className="p-4 w-[35%]">The Answer Reality Fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 text-stone-600 align-top">"The most advanced laser treatment in the city."</td>
                      <td className="p-4 text-stone-600 align-top"><span className="text-red-500 block mb-1">Distortion Risk</span>Viewed as marketing puffery. No clinical backing found on page.</td>
                      <td className="p-4 text-stone-900 font-medium align-top">"The only clinic in [City] offering the FDA-cleared [Device] for acne scars."</td>
                    </tr>
                    <tr className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 text-stone-600 align-top">"Trusted by thousands of enterprise clients."</td>
                      <td className="p-4 text-stone-600 align-top"><span className="text-red-500 block mb-1">Evidence Gap</span>No specific customer logos or case studies linked directly. Ignored by AI.</td>
                      <td className="p-4 text-stone-900 font-medium align-top">"Trusted by 2,000+ teams, including [Logo 1] and [Logo 2]." (with adjacent links)</td>
                    </tr>
                    <tr className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 text-stone-600 align-top">"We guarantee 100% compliance."</td>
                      <td className="p-4 text-stone-600 align-top"><span className="text-amber-500 block mb-1">Overstatement</span>LLMs often flag absolute guarantees without explicit SOC2/HIPAA documentation links.</td>
                      <td className="p-4 text-stone-900 font-medium align-top">"Built to HIPAA and SOC2 standards, audited annually." (link to trust center)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Quantified Outcomes */}
          <section className="mb-20 bg-stone-900 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-700">
              <div className="p-8 sm:p-10 text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-4">Remediation Speed</div>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-serif italic">
                  &ldquo;After remediation, AI engines stopped recommending competitors for our top intent query within 14 days.&rdquo;
                </p>
              </div>
              <div className="p-8 sm:p-10 text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-4">Claim Health Score</div>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-serif italic">
                  &ldquo;Claim Health Score moved from 52 to 84 after 11 rewrites and 9 new proof blocks.&rdquo;
                </p>
              </div>
              <div className="p-8 sm:p-10 text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-4">Surfaced per Scan</div>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-serif italic">
                  &ldquo;Average 10&ndash;20 unsupported claims surfaced per page scanned.&rdquo;
                </p>
              </div>
            </div>
          </section>

          {/* Industry Examples */}
          <section className="mb-20 bg-stone-900 text-stone-100 p-8 sm:p-12 rounded-xl">
            <h2 className="font-serif text-3xl mb-8">Claim Drift is everywhere.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-400 mb-3">Med Spa / Wellness</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Treatments are heavily scrutinized. If your provider bios lack linked credentials or your before/after galleries don't explicitly state the devices used, AI engines (and informed patients) will discount your authority in favor of clinics that prove their work.
                </p>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-blue-400 mb-3">SaaS / AI Startups</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  "Powered by AI" is no longer a differentiator. If you cannot prove specific performance metrics, latency benchmarks, or data privacy guardrails, AI research agents comparing software vendors will drop you from the shortlist.
                </p>
              </div>
            </div>
          </section>

          {/* Mini-Case: The $2M deal */}
          <section className="mb-20">
            <div className="border-l-4 border-amber-500 bg-amber-50 p-6 sm:p-8 rounded-r-md">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-600 mb-3">The $2M Deal That Died</div>
              <blockquote className="font-serif text-lg sm:text-xl leading-relaxed text-stone-800 mb-4">
                Startup X lost a $2M deal. An AI research agent told the buyer their claims were unverifiable. 
                The deal died in diligence. AuditGPT exists to prevent this scenario.
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs">CX</div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-stone-500">Real Prospect Conversation</div>
                  <div className="text-[10px] font-mono text-stone-400">From AuditGPT discovery interviews, Q1 2025</div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="text-center py-12 border-t border-stone-200">
            <h2 className="font-serif text-3xl mb-4 text-stone-900">Stop guessing what AI thinks of you.</h2>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">Get a fast public-page claim snapshot to see exactly where your evidence gaps are.</p>
            <Link href="/snapshot" className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center justify-center">
              Run Free Snapshot <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          {/* 7-Day CTA Variant */}
          <div className="text-center py-12 border-t border-stone-200 mt-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600">Fast Track</span>
            </div>
            <h2 className="font-serif text-3xl mb-4 text-stone-900">Ship an AI-safe homepage in the next 7 days.</h2>
            <div className="max-w-lg mx-auto mb-8">
              <div className="grid grid-cols-3 gap-4 text-left">
                <div className="bg-stone-50 border border-stone-200 rounded-md p-4">
                  <div className="font-mono text-xs text-stone-400 mb-1">Step 1</div>
                  <div className="font-mono text-sm font-bold text-stone-900">Submit URL</div>
                  <div className="text-[11px] text-stone-500 mt-1">Paste your homepage link</div>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-md p-4">
                  <div className="font-mono text-xs text-stone-400 mb-1">Step 2</div>
                  <div className="font-mono text-sm font-bold text-stone-900">Review findings</div>
                  <div className="text-[11px] text-stone-500 mt-1">See every unsupported claim</div>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-md p-4">
                  <div className="font-mono text-xs text-stone-400 mb-1">Step 3</div>
                  <div className="font-mono text-sm font-bold text-stone-900">Apply rewrites</div>
                  <div className="text-[11px] text-stone-500 mt-1">Go live in the same week</div>
                </div>
              </div>
            </div>
            <Link href="/snapshot" className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center justify-center">
              Start Your 7-Day Sprint <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
