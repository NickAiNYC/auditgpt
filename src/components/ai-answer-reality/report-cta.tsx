import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function ReportCTA() {
  return (
    <Card className="bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 backdrop-blur-md overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <CardContent className="p-8 sm:p-12 text-center relative z-10">
        <h2 className="font-serif text-3xl sm:text-4xl mb-4">Fix these claims before your buyers see them.</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          AI Answer Engines and buyers are already judging your unverified claims. We can monitor your digital footprint, rewrite risky claims, and govern your growth.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/pricing" className="btn-cta text-base px-8 py-4 w-full sm:w-auto">
            View Monitoring Plans <ArrowRight className="h-4 w-4 ml-2 inline" />
          </a>
          <a href="mailto:sales@scrutexity.com" className="px-8 py-4 text-base font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto">
            Contact Sales
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
