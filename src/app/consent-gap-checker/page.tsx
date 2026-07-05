'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, FileText, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

interface Gap {
  marketingClaim: string;
  consentFormStandard: string;
  gapDescription: string;
  severity: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  websiteUrl: string;
  totalGaps: number;
  highSeverityCount: number;
  gaps: Gap[];
  disclaimer: string;
}

const SAMPLE_RESULTS: AnalysisResult = {
  websiteUrl: 'https://example-medspa.com',
  totalGaps: 4,
  highSeverityCount: 4,
  gaps: [
    {
      marketingClaim: '"Painless" treatments — zero discomfort guaranteed.',
      consentFormStandard:
        '"You may experience mild discomfort, tingling, or warmth during and after treatment."',
      gapDescription:
        'The website promises zero pain, while the consent form acknowledges discomfort as expected. A plaintiff\'s attorney will argue the patient was misled about the treatment experience.',
      severity: 'high',
    },
    {
      marketingClaim: '"Instant results — see a difference after just one session."',
      consentFormStandard:
        '"Results vary by individual. Multiple sessions may be required to achieve desired outcomes. Full results typically appear after 4-6 weeks."',
      gapDescription:
        'Marketing promises instant one-session results, but the consent form describes a multi-week, multi-session timeline. This creates an expectation gap that could fuel a misrepresentation claim.',
      severity: 'high',
    },
    {
      marketingClaim: '"No downtime — resume normal activities immediately."',
      consentFormStandard:
        '"Temporary redness, swelling, and sensitivity are common for 24-72 hours post-treatment. Avoid direct sun exposure, strenuous exercise, and topical actives for 48 hours."',
      gapDescription:
        'Zero-downtime marketing directly contradicts the consent form\'s detailed post-care restrictions. Patients who resume normal activities immediately may experience complications they weren\'t warned about.',
      severity: 'high',
    },
    {
      marketingClaim: '"FDA-cleared for all skin types and tones."',
      consentFormStandard:
        '"This device is cleared for Fitzpatrick skin types I-IV. Patients with skin types V-VI may be at increased risk of hyperpigmentation or burns."',
      gapDescription:
        'The claim suggests universal FDA clearance, but the consent form explicitly excludes darker skin tones from the cleared indication. This is both a liability gap and a potential regulatory issue.',
      severity: 'high',
    },
  ],
  disclaimer:
    'This analysis is simulated for demonstration purposes. Actual results may vary. AuditGPT does not provide legal advice. Consult with qualified legal counsel for compliance guidance.',
};

const RISK_IMPLICATIONS = [
  {
    icon: AlertTriangle,
    title: 'Plaintiff\'s Attorney Goldmine',
    description:
      'Every claim-to-consent contradiction is a potential cause of action. Attorneys can argue the patient was induced by marketing promises that the practice itself knew were inconsistent with the standard of care documented in their own consent forms.',
  },
  {
    icon: ShieldCheck,
    title: 'Regulatory Exposure',
    description:
      'The FTC and state attorneys general actively target med-spa marketing. When a consent form says something different from a website, regulators have documentary evidence that the practice knew its claims were overblown — a key element in false advertising and consumer protection actions.',
  },
  {
    icon: FileText,
    title: 'Insurance & Credentialing Risk',
    description:
      'Liability carriers and malpractice insurers increasingly review website content alongside consent forms during claims investigation. A documented gap between marketing language and clinical disclosure can be used to deny coverage or rescind policies.',
  },
];

const SEVERITY_COLORS: Record<string, string> = {
  high: 'text-[#B7896B]',
  medium: 'text-amber-600',
  low: 'text-stone-500',
};

export default function ConsentGapCheckerPage() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    setIsAnalyzing(true);
    setHasAnalyzed(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1600));

    setResult(SAMPLE_RESULTS);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] font-sans">
      <header className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <Logo variant="full" height={28} />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
            >
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
                Consent vs Claim Gap Checker
              </span>
            </div>
            <h1 className="font-serif font-light text-5xl sm:text-6xl leading-tight mb-6 text-stone-900 max-w-3xl mx-auto">
              Your website says &ldquo;painless.&rdquo; Your consent form says
              &ldquo;discomfort possible.&rdquo; Which one will the plaintiff&rsquo;s
              attorney read first?
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Med-spa marketing claims and consent forms often tell two different
              stories. AuditGPT cross-references your public website against
              standard digital consent templates to surface liability gaps before
              they surface in court.
            </p>

            {/* URL Input */}
            <form onSubmit={handleAnalyze} className="max-w-lg mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://your-medspa.com"
                    className="w-full px-4 py-3.5 border border-stone-200 rounded-sm bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-colors font-mono"
                    disabled={isAnalyzing}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAnalyzing || !websiteUrl.trim()}
                  className="bg-stone-900 text-white px-6 py-3.5 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 flex-shrink-0"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      Analyze Gap <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-stone-400 font-mono mt-3 text-left">
                Demo mode — results are simulated from a predefined dataset
              </p>
            </form>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {hasAnalyzed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {result && (
                  <>
                    {/* Summary Bar */}
                    <div className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm mb-8">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <div className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-1">
                            Analysis for
                          </div>
                          <div className="text-sm font-mono text-stone-900">
                            {result.websiteUrl}
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-serif font-light text-stone-900">
                              {result.totalGaps}
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                              Total Gaps
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-serif font-light text-[#B7896B]">
                              {result.highSeverityCount}
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-[#B7896B]">
                              High Severity
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Split-View Gap Cards */}
                    <section className="mb-16">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                        <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                          Gap Analysis Results
                        </span>
                      </div>

                      <div className="space-y-6">
                        {result.gaps.map((gap, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden"
                          >
                            {/* Severity Badge */}
                            <div className="bg-stone-50 border-b border-stone-200 px-5 py-2.5 flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                                Gap #{index + 1}
                              </span>
                              <span
                                className={`text-[10px] font-mono uppercase tracking-widest font-bold ${SEVERITY_COLORS[gap.severity]}`}
                              >
                                {gap.severity === 'high'
                                  ? 'Liability Gap Exists'
                                  : gap.severity === 'medium'
                                    ? 'Moderate Risk'
                                    : 'Low Risk'}
                              </span>
                            </div>

                            {/* Split Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                              {/* Left: Marketing Claim */}
                              <div className="p-5">
                                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-1.5">
                                  <AlertTriangle className="h-3 w-3" />
                                  Marketing Claim
                                </div>
                                <p className="text-sm text-stone-900 font-serif italic leading-relaxed">
                                  &ldquo;{gap.marketingClaim}&rdquo;
                                </p>
                              </div>

                              {/* Right: Consent Form Reality */}
                              <div className="p-5">
                                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-1.5">
                                  <FileText className="h-3 w-3" />
                                  Consent Form Reality
                                </div>
                                <p className="text-sm text-stone-700 leading-relaxed">
                                  {gap.consentFormStandard}
                                </p>
                              </div>
                            </div>

                            {/* Gap Description */}
                            <div className="px-5 py-4 bg-stone-50 border-t border-stone-200">
                              <p className="text-xs text-stone-600 leading-relaxed">
                                {gap.gapDescription}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* What This Means */}
                    <section className="mb-16">
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                          <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                          <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                            What This Means
                          </span>
                        </div>
                        <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-4 text-stone-900 font-light">
                          Three risks you can&rsquo;t ignore
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {RISK_IMPLICATIONS.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                            className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm"
                          >
                            <item.icon className="h-6 w-6 text-stone-400 mb-4" />
                            <h3 className="font-serif text-xl mb-2 text-stone-900">
                              {item.title}
                            </h3>
                            <p className="text-sm text-stone-600 leading-relaxed">
                              {item.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* Predefined Gap Demo Note */}
                    <div className="bg-stone-50 border border-stone-200 p-5 rounded-sm mb-16">
                      <p className="text-xs text-stone-500 leading-relaxed font-mono">
                        <strong className="text-stone-700">Demo Note:</strong> This
                        analysis uses a predefined dataset of common med-spa claim-to-consent
                        gaps. A full Claim Intelligence scan would analyze your actual
                        website copy against your specific consent forms for a
                        site-specific report.
                      </p>
                    </div>
                  </>
                )}

                {/* Loading / Initial Animation */}
                {isAnalyzing && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 text-stone-400 animate-spin mb-4" />
                    <p className="text-sm text-stone-500 font-mono">
                      Scanning marketing claims against consent standards...
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Section */}
          <section className="mb-16">
            <div className="bg-white border border-stone-200 p-10 sm:p-12 rounded-sm shadow-sm text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  Full Audit
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-4 text-stone-900">
                Run a full Claim Intelligence Report
              </h2>
              <p className="text-stone-600 max-w-xl mx-auto mb-8 text-lg leading-relaxed">
                Get a complete claim-to-consent audit of your entire website,
                with risk-rated gap analysis, safer language recommendations, and
                a shareable compliance artifact for your legal team.
              </p>
              <Link
                href="/pricing"
                className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center justify-center gap-2"
              >
                Run a full Claim Intelligence Report — $299{' '}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Footer Disclaimer */}
          <footer className="border-t border-stone-200 pt-8 pb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-stone-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-stone-400 leading-relaxed">
                <strong className="text-stone-500">Boundary Disclaimer:</strong>{' '}
                This tool is for educational and informational purposes only. It
                does not constitute legal advice, create an attorney-client
                relationship, or guarantee compliance with any federal, state, or
                local law or regulation. Med-spa operators should consult with
                qualified legal counsel regarding their specific marketing
                practices, consent form language, and regulatory obligations. The
                gap analysis shown here is simulated and may not reflect your
                actual liability exposure.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
