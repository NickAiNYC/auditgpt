import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-xs font-mono uppercase tracking-widest">
          <Link
            href="/ai-answer-reality/sample"
            className="text-foreground hover:opacity-70 underline underline-offset-4"
          >
            See a sample report →
          </Link>
          <span className="hidden sm:inline text-muted-foreground">|</span>
          <Link
            href="/proof"
            className="text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Proof Center
          </Link>
          <span className="hidden sm:inline text-muted-foreground">|</span>
          <Link
            href="/self-audit"
            className="text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Self-Audit Ledger
          </Link>
          <span className="hidden sm:inline text-muted-foreground">|</span>
          <Link
            href="/security"
            className="text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Security
          </Link>
          <span className="hidden sm:inline text-muted-foreground">|</span>
          <Link
            href="/snapshot"
            className="text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Free Claim Snapshot
          </Link>
          <span className="hidden sm:inline text-muted-foreground">|</span>
          <Link
            href="/promises"
            className="text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Promises &amp; Anti-Promises
          </Link>
        </div>
        <div className="mt-10 md:mt-0 flex flex-col items-center md:items-end text-xs text-muted-foreground">
          <p>AuditGPT · Claim Intelligence Platform</p>
          <a href="https://scrutexity.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 underline hover:opacity-80 transition-opacity">
            Parent company: Scrutexity →
          </a>
        </div>
      </div>
    </footer>
  );
}
