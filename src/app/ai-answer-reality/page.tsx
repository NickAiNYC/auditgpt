import { ArrowRight, Search } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Answer Reality Scan — Scrutexity",
  description: "See what AI says about your business before buyers do. Detect unsupported claims and competitor displacement.",
};

export default function AIAnswerRealityIntakePage() {
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-accent/30 flex flex-col">
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-6 w-6 items-center justify-center rounded-sm bg-white">
              <span className="font-serif text-black text-sm font-bold leading-none select-none">
                S
              </span>
            </div>
            <span className="font-serif tracking-wide text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">
              Scrutexity
            </span>
          </a>
          <nav className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <a href="/ai-answer-reality/sample" className="hover:text-foreground">
              Sample Report
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-2xl w-full mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-accent font-mono font-medium">
                AI Answer Reality Scan
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-6">
              See what AI says about your business before buyers do.
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Enter your domain to see if AI engines are displacing you with competitors, distorting your services, or exposing unsupported claims.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-2 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="domain.com or business name" 
                className="w-full h-14 bg-transparent border-none focus:ring-0 pl-12 text-lg outline-none placeholder:text-muted-foreground/50"
              />
            </div>
            <a href="/ai-answer-reality/sample" className="btn-cta h-14 px-8 flex items-center justify-center whitespace-nowrap">
              Run Scan <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-6 font-mono tracking-wider uppercase">
            Includes: AI Distortion Check • Competitor Displacement • Priority Fixes
          </p>
        </div>
      </main>
    </div>
  );
}
