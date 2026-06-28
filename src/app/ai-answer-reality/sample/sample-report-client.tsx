"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ScoreCard } from "@/components/ai-answer-reality/score-card";
import { AIQueryResultTable } from "@/components/ai-answer-reality/ai-query-result-table";
import { Logo } from "@/components/logo";
import { DistortionTable } from "@/components/ai-answer-reality/distortion-table";
import { ClaimRiskTable } from "@/components/ai-answer-reality/claim-risk-table";
import { PriorityFixList } from "@/components/ai-answer-reality/priority-fix-list";
import { ReportCTA } from "@/components/ai-answer-reality/report-cta";
import { StickyScanCTA } from "@/components/sticky-scan-cta";
import { StickyConversionSidebar } from "@/components/ai-answer-reality/sticky-conversion-sidebar";

// Three.js Canvas can't run on the server — load client-only
const TelemetryVisualization = dynamic(
  () => import("@/components/ai-answer-reality/telemetry-visualization").then((m) => m.TelemetryVisualization),
  { ssr: false }
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function SampleReportClient() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: "AI Answer Reality Scan — Apex Aesthetics NYC",
    description:
      "Sample AI Answer Reality scan for a multi-location med spa demonstrating claim drift detection, AI answer distortion analysis, and proof gap identification across ChatGPT, Perplexity, and Gemini.",
    about: {
      "@type": "MedicalBusiness",
      name: "Apex Aesthetics NYC",
      description: "Fictional multi-location med spa used for sample demonstration",
    },
    author: {
      "@type": "Organization",
      name: "Scrutexity",
      url: "https://scrutexity.com",
    },
    datePublished: "2025-01-01",
    publisher: {
      "@type": "Organization",
      name: "AuditGPT by Scrutexity",
      url: "https://auditgpt.ai",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://auditgpt.ai/ai-answer-reality/sample",
    },
    significantLink: "https://auditgpt.ai/ai-answer-reality",
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C302E] selection:bg-[#D97757]/20 pb-20 relative overflow-hidden font-sans">
      <StickyConversionSidebar />

      {/* Dynamic 3D Cloud Glow */}
      <div className="absolute top-[-5%] right-[-10%] w-[800px] h-[800px] pointer-events-none z-0 opacity-80">
        <TelemetryVisualization />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-[#2C302E]/5 bg-[#FDFBF7]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 group">
              <Logo variant="full" height={22} className="[&_span]:text-[#2C302E]" />
            </a>
            <div className="h-4 w-px bg-[#2C302E]/10" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#2C302E]/40">Sample Scan</span>
          </div>
          <a href="/ai-answer-reality" className="text-xs font-mono uppercase tracking-wider text-[#2C302E]/50 hover:text-[#2C302E] transition-colors">
            New Scan
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-20 lg:pr-[400px] relative z-10">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-20">

          {/* ── Hero Section ────────────────────────────── */}
          <motion.section variants={itemVariants} className="space-y-6 relative z-10">
            <script dangerouslySetInnerHTML={{ __html: `console.log('[ANALYTICS] EVENT: sample_scan_viewed');` }} />
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#D97757]" />
              <span className="text-xs uppercase tracking-widest text-[#D97757] font-mono font-medium">
                Confidential Scan Results
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-2">
              <h1 className="font-serif font-light text-4xl sm:text-5xl text-[#2C302E]">Apex Aesthetics NYC</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D97757]/10 text-[#D97757] border border-[#D97757]/20">
                Fictional demonstration · Not a real client audit
              </span>
            </div>
            <p className="text-[#2C302E]/60 text-lg">Scanned 12 pages and 4 AI Engines • Last updated today</p>
            <p className="text-sm text-[#2C302E]/40 italic">This sample uses a fictional multi-location med spa to demonstrate how Scrutexity detects claim drift, AI answer distortion, and proof gaps.</p>
          </motion.section>

          {/* ── Section 1: Executive Summary ────────────── */}
          <motion.section variants={itemVariants} id="score-card" className="space-y-6">
            <h2 className="font-mono text-sm uppercase tracking-widest text-[#2C302E]/40 border-b border-[#2C302E]/10 pb-4">
              Section 1: Executive Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ScoreCard
                title="AI Answer Reality Score"
                score={62}
                alertStatus="warning"
                description="AI answers occasionally displace you or omit key proof points."
              />
              <ScoreCard
                title="Claim Health Score"
                score={71}
                alertStatus="warning"
                description="29% of claims on your site lack visible proof or safer framing."
              />
              <ScoreCard
                title="Competitor Displacement"
                score={3}
                maxScore={5}
                alertStatus="critical"
                description="High risk. Competitors are frequently recommended over you for high-intent queries."
              />
            </div>
          </motion.section>

          {/* ── Section 2: What AI Says ─────────────────── */}
          <motion.section variants={itemVariants} id="ai-drift-map" className="space-y-6">
            <h2 className="font-mono text-sm uppercase tracking-widest text-[#2C302E]/40 border-b border-[#2C302E]/10 pb-4">
              Section 2: What AI Says
            </h2>
            <AIQueryResultTable results={[
              { query: "best med spa near me", aiResult: "Competitor 'Lumina Med Spa' is shown first.", risk: "High" },
              { query: "is Apex Aesthetics good for Botox?", aiResult: "Mentions reviews but misses physician credentials.", risk: "Medium" },
              { query: "does Apex offer HydraFacial?", aiResult: "Correctly confirms service but provides no citation.", risk: "Low" },
              { query: "is Apex Aesthetics safe?", aiResult: "Pulls from a weak directory source instead of your main site.", risk: "Medium" },
            ]} />
          </motion.section>

          {/* ── Section 3: AI Claim Distortions ─────────── */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="font-mono text-sm uppercase tracking-widest text-[#2C302E]/40 border-b border-[#2C302E]/10 pb-4">
              Section 3: AI Claim Distortions
            </h2>
            <DistortionTable distortions={[
              { aiSaid: "Offers FDA-approved laser hair removal", reality: "Device is FDA-cleared, not FDA-approved.", fix: "Replace with 'FDA-cleared device' wording on site to train AI." },
              { aiSaid: "Delivers permanent results", reality: "Results vary by patient.", fix: "Add safer framing to the treatment page." },
              { aiSaid: "All board-certified injectors", reality: "Not proven clearly on the website.", fix: "Add credential proof or rewrite staff bios." },
            ]} />
          </motion.section>

          {/* ── Section 4: Website Claim Risks ──────────── */}
          <motion.section variants={itemVariants} id="evidence-gaps" className="space-y-6">
            <h2 className="font-mono text-sm uppercase tracking-widest text-[#2C302E]/40 border-b border-[#2C302E]/10 pb-4">
              Section 4: Website Claim Risks
            </h2>
            <ClaimRiskTable risks={[
              { claim: "Guaranteed results", status: "overstated", rewrite: "Results vary by patient." },
              { claim: "Best med spa in NYC", status: "unsupported", rewrite: "Trusted by patients across NYC." },
              { claim: "FDA-approved treatment", status: "needs_review", rewrite: "Uses FDA-cleared technology where applicable." },
            ]} />
          </motion.section>

          {/* ── Section 5: The Fix ───────────────────────── */}
          <motion.section variants={itemVariants} id="fix-list" className="space-y-6">
            <h2 className="font-mono text-sm uppercase tracking-widest text-[#2C302E]/40 border-b border-[#2C302E]/10 pb-4">
              Section 5: The Fix
            </h2>
            <PriorityFixList fixes={[
              "Replace 'guaranteed results' across treatment pages.",
              "Add credential proof to provider profiles.",
              "Add device-specific proof block to laser page.",
              "Rewrite GBP service descriptions.",
              "Publish FAQ correcting common AI misunderstandings.",
            ]} />
          </motion.section>

          {/* ── Report CTA ───────────────────────────────── */}
          <motion.section variants={itemVariants} className="pt-8">
            <ReportCTA />
          </motion.section>

        </motion.div>

        <StickyScanCTA />
      </main>
    </div>
  );
}
