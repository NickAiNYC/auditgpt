import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Scrutexity Self-Audit Ledger",
  description: "Radically transparent claim intelligence ledger. We govern our own claims first.",
};

export default function SelfAuditPage() {
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-accent/30 pb-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-40" />

      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-6 w-6 items-center justify-center rounded-sm bg-white">
              <span className="font-serif text-black text-sm font-bold leading-none select-none">S</span>
            </div>
            <span className="font-serif tracking-wide text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">
              Scrutexity
            </span>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-16 relative z-10">
        
        {/* Header Section */}
        <section className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-emerald-500 font-mono font-bold">
              Transparent Ledger Active
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl leading-tight">
            We govern ourselves first.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Before we audit your claims, we audit our own. This is the live remediation ledger showing how we fixed our own marketing drift to score a perfect 100/100.
          </p>
        </section>

        {/* Top Banner: The Transparency Metric */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Initial Baseline (June 26)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-serif text-red-500 line-through decoration-red-500/30">25</span>
              <span className="text-sm text-muted-foreground font-mono">/ 100</span>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-accent/20 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-4">Remediated Score (Live)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-serif text-foreground">100</span>
              <span className="text-sm text-muted-foreground font-mono">/ 100</span>
            </div>
          </div>
        </section>

        {/* Scope Box */}
        <section className="bg-white/[0.02] border border-white/5 rounded-md p-4 text-xs font-mono text-muted-foreground/80 flex flex-col sm:flex-row justify-between gap-4">
          <p><strong className="text-muted-foreground">Audit Scope:</strong> 4 foundational claims reviewed. This does not represent a full-site or full-digital-footprint audit.</p>
          <p><strong className="text-muted-foreground">Next Review Date:</strong> September 30, 2026</p>
        </section>

        {/* The Remediation Ledger */}
        <section className="space-y-6">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground border-b border-white/10 pb-4">
            The Remediation Ledger
          </h2>
          <div className="rounded-md border border-white/10 bg-white/[0.01] overflow-hidden">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground w-[30%]">Initial Public Claim</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground w-[30%]">Risk / Diagnosis</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground w-[30%]">The Remediated Fix</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                
                {/* Claim 1 */}
                <TableRow className="border-white/10 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="font-medium text-sm text-muted-foreground line-through decoration-red-500/50 align-top">
                    "We detect issues across your entire digital footprint."
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground align-top">
                    <span className="text-amber-500 block mb-1">Overstated Scope</span>
                    We must prove we can automatically scan an "entire" footprint. Currently, the MVP only scans single URLs.
                  </TableCell>
                  <TableCell className="text-sm text-foreground align-top font-medium">
                    "Scan your website, monitor unsupported claims, and see how AI engines describe your business."
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase tracking-widest text-[10px]">VERIFIED</Badge>
                  </TableCell>
                </TableRow>

                {/* Claim 2 */}
                <TableRow className="border-white/10 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="font-medium text-sm text-muted-foreground line-through decoration-red-500/50 align-top">
                    "The diagnostic front door for governed claim remediation."
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground align-top">
                    <span className="text-red-500 block mb-1">Legacy Positioning</span>
                    This is legacy branding. We are killing the old product categories to focus entirely on Claim Intelligence.
                  </TableCell>
                  <TableCell className="text-sm text-foreground align-top font-medium">
                    "The diagnostic engine that maps the gap between what you claim and what you can prove."
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase tracking-widest text-[10px]">VERIFIED</Badge>
                  </TableCell>
                </TableRow>

                {/* Claim 3 */}
                <TableRow className="border-white/10 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="font-medium text-sm text-muted-foreground line-through decoration-red-500/50 align-top">
                    "Start your claim snapshot."
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground align-top">
                    <span className="text-red-500 block mb-1">Unverified Performance</span>
                    We lack performance logs proving the extraction loop finishes reliably within a minute.
                  </TableCell>
                  <TableCell className="text-sm text-foreground align-top font-medium">
                    "Your audit will begin generating immediately."
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase tracking-widest text-[10px]">VERIFIED</Badge>
                  </TableCell>
                </TableRow>

                {/* Claim 4 */}
                <TableRow className="border-white/10 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="font-medium text-sm text-muted-foreground line-through decoration-red-500/50 align-top">
                    "Generate a point-in-time compliance and risk assessment."
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground align-top">
                    <span className="text-red-500 block mb-1">Compliance Overclaim</span>
                    We are not a compliance tool and do not certify compliance. The language is legally risky.
                  </TableCell>
                  <TableCell className="text-sm text-foreground align-top font-medium">
                    "Generate a point-in-time claim and proof snapshot."
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase tracking-widest text-[10px]">VERIFIED</Badge>
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </div>
        </section>

        {/* The Frictionless Pivot */}
        <section className="pt-8">
          <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-xl p-8 sm:p-12 text-center relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
            </div>
            <h2 className="font-serif text-3xl mb-4 text-foreground relative z-10">See how this works at scale.</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto relative z-10">
              This v1 audit reviewed our core homepage assertions. To see a full-scale AI Answer Reality audit mapping competitor displacement and hallucinations, explore the sample scan.
            </p>
            <div className="flex justify-center relative z-10">
              <a href="/ai-answer-reality/sample" className="btn-cta text-base px-8 py-4 flex items-center">
                Explore Sample Scan <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono">
              Disclaimer: This audit reviewed core homepage assertions. It does not yet map our entire digital footprint.
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
