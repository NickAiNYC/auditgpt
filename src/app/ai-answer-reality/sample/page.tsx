import { Metadata } from "next";
import { ScoreCard } from "@/components/ai-answer-reality/score-card";
import { AIQueryResultTable } from "@/components/ai-answer-reality/ai-query-result-table";
import { DistortionTable } from "@/components/ai-answer-reality/distortion-table";
import { ClaimRiskTable } from "@/components/ai-answer-reality/claim-risk-table";
import { PriorityFixList } from "@/components/ai-answer-reality/priority-fix-list";
import { ReportCTA } from "@/components/ai-answer-reality/report-cta";
import { StickyScanCTA } from "@/components/sticky-scan-cta";
import { StickyConversionSidebar } from "@/components/ai-answer-reality/sticky-conversion-sidebar";

export const metadata: Metadata = {
  title: "Sample AI Answer Reality Scan",
  description: "A sample AI Answer Reality scan for a multi-location med spa.",
};

export default function SampleAIAnswerRealityScan() {
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-accent/30 pb-20 relative">
      <StickyConversionSidebar />
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-6 w-6 items-center justify-center rounded-sm bg-white">
                <span className="font-serif text-black text-sm font-bold leading-none select-none">S</span>
              </div>
            </a>
            <div className="h-4 w-px bg-white/20" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Sample Scan</span>
          </div>
          <a href="/ai-answer-reality" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground">
            New Scan
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16 lg:pr-[400px]">
        
        {/* Header Section */}
        <section className="space-y-4">
          <script dangerouslySetInnerHTML={{ __html: `console.log('[ANALYTICS] EVENT: sample_scan_viewed');` }} />
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs uppercase tracking-widest text-accent font-mono font-medium">
              Confidential Scan Results
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-2">
            <h1 className="font-serif text-4xl sm:text-5xl">Apex Aesthetics NYC</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Sample workspace · Mock data for demonstration
            </span>
          </div>
          <p className="text-muted-foreground text-lg">Scanned 12 pages and 4 AI Engines • Last updated today</p>
          <p className="text-sm text-muted-foreground/60 italic">This sample uses a fictional multi-location med spa to demonstrate how Scrutexity detects claim drift, AI answer distortion, and proof gaps.</p>
        </section>

        {/* Section 1: Executive Summary */}
        <section id="score-card" className="space-y-6">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground border-b border-white/10 pb-4">
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
        </section>

        {/* Section 2: What AI Says */}
        <section id="ai-drift-map" className="space-y-6">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground border-b border-white/10 pb-4">
            Section 2: What AI Says
          </h2>
          <AIQueryResultTable results={[
            { query: "best med spa near me", aiResult: "Competitor 'Lumina Med Spa' is shown first.", risk: "High" },
            { query: "is Apex Aesthetics good for Botox?", aiResult: "Mentions reviews but misses physician credentials.", risk: "Medium" },
            { query: "does Apex offer HydraFacial?", aiResult: "Correctly confirms service but provides no citation.", risk: "Low" },
            { query: "is Apex Aesthetics safe?", aiResult: "Pulls from a weak directory source instead of your main site.", risk: "Medium" },
          ]} />
        </section>

        {/* Section 3: AI Claim Distortions */}
        <section className="space-y-6">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground border-b border-white/10 pb-4">
            Section 3: AI Claim Distortions
          </h2>
          <DistortionTable distortions={[
            { aiSaid: "Offers FDA-approved laser hair removal", reality: "Device is FDA-cleared, not FDA-approved.", fix: "Replace with 'FDA-cleared device' wording on site to train AI." },
            { aiSaid: "Delivers permanent results", reality: "Results vary by patient.", fix: "Add safer framing to the treatment page." },
            { aiSaid: "All board-certified injectors", reality: "Not proven clearly on the website.", fix: "Add credential proof or rewrite staff bios." },
          ]} />
        </section>

        {/* Section 4: Website Claim Risks */}
        <section id="evidence-gaps" className="space-y-6">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground border-b border-white/10 pb-4">
            Section 4: Website Claim Risks
          </h2>
          <ClaimRiskTable risks={[
            { claim: "Guaranteed results", status: "overstated", rewrite: "Results vary by patient." },
            { claim: "Best med spa in NYC", status: "unsupported", rewrite: "Trusted by patients across NYC." },
            { claim: "FDA-approved treatment", status: "needs_review", rewrite: "Uses FDA-cleared technology where applicable." },
          ]} />
        </section>

        {/* Section 5: Next 5 Fixes */}
        <section id="fix-list" className="space-y-6">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground border-b border-white/10 pb-4">
            Section 5: The Fix
          </h2>
          <PriorityFixList fixes={[
            "Replace 'guaranteed results' across treatment pages.",
            "Add credential proof to provider profiles.",
            "Add device-specific proof block to laser page.",
            "Rewrite GBP service descriptions.",
            "Publish FAQ correcting common AI misunderstandings."
          ]} />
        </section>

        {/* Report CTA */}
        <section className="pt-8">
          <ReportCTA />
        </section>

        {/* Sticky CTA */}
        <StickyScanCTA />
      </main>
    </div>
  );
}

