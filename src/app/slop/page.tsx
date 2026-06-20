'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, ArrowRight, Search } from 'lucide-react';
import { Logo } from '@/components/logo';

const SLOP_SIGNALS = [
  { signal: 'Generic AI copy', desc: '"powerful platform that empowers businesses" — no real facts' },
  { signal: 'Missing core pages', desc: 'No contact, no pricing, no team — real businesses have these' },
  { signal: 'Hollow testimonials', desc: '"Happy Customer" with no company name, no headshot, no case study' },
  { signal: 'Empty meta descriptions', desc: 'Real businesses invest in SEO. Slop doesn\'t.' },
  { signal: 'Lorem ipsum / placeholder', desc: 'Visible "coming soon" or "TODO" text in production' },
  { signal: 'Fabricated metrics', desc: '"Trusted by 10,000+ businesses" with zero case studies' },
  { signal: 'No integration evidence', desc: 'Claims to integrate with Stripe but no link to it' },
  { signal: 'AI subdomain patterns', desc: '*.polsia.app, Lovable preview URLs, generic Vercel slugs' },
];

export default function SlopPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const valid = url.trim().length >= 3;

  const startAudit = async () => {
    if (!valid) return;
    setLoading(true);
    // We use sessionStorage to pass the URL into the main flow as if Q1 was filled
    sessionStorage.setItem('slop-audit-url', url.trim());
    sessionStorage.setItem('slop-audit-path', 'grow');
    router.push('/?flow=slop');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <a href="/" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground">
            ← Back to main
          </a>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-black" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Slop detector · free
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl leading-tight mb-6">
              Did Polsia build your business?
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Paste a URL. We&apos;ll scrape it, detect AI-generated slop markers, and tell you
              the probability it was built by an AI tool. Then we&apos;ll rebuild it — fact-backed, no slop.
            </p>

            {/* URL input */}
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && valid && startAudit()}
                  placeholder="polsia.app/your-business"
                  autoFocus
                  className="input-polsia !text-base !rounded-sm !border-black"
                  style={{ height: 'auto' }}
                />
                <button
                  onClick={startAudit}
                  disabled={!valid || loading}
                  className="btn-polsia"
                  style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
                >
                  <Search className="h-4 w-4 mr-2 inline" /> AUDIT
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Or{' '}
                <a href="/" className="underline hover:text-foreground">
                  audit your own idea instead
                </a>
              </p>
            </div>
          </div>

          {/* Slop signals list */}
          <div className="card-polsia p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4" />
              <h2 className="font-serif text-xl">What we detect</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SLOP_SIGNALS.map((s, i) => (
                <div key={i} className="border border-border p-3 rounded-sm">
                  <p className="text-sm font-medium mb-1">{s.signal}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="card-polsia p-5">
              <div className="font-mono text-3xl font-black text-muted-foreground/20 mb-2">01</div>
              <h3 className="font-serif text-lg mb-2">Scrape</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We pull the homepage, headings, paragraphs, and links.
              </p>
            </div>
            <div className="card-polsia p-5">
              <div className="font-mono text-3xl font-black text-muted-foreground/20 mb-2">02</div>
              <h3 className="font-serif text-lg mb-2">Detect</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We scan for 8 AI-slop markers and assign a probability score.
              </p>
            </div>
            <div className="card-polsia p-5">
              <div className="font-mono text-3xl font-black text-muted-foreground/20 mb-2">03</div>
              <h3 className="font-serif text-lg mb-2">Rebuild</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We generate a fact-backed landing page with no replicated slop.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="card-polsia p-8 text-center">
            <h2 className="font-serif text-2xl mb-2">Ready to expose the slop?</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              No signup. No credit card. Paste a URL and get the truth in 30 seconds.
            </p>
            <a href="/" className="btn-cta" style={{ width: 'auto', padding: '0.875rem 2rem', display: 'inline-flex' }}>
              AUDIT ANY URL <ArrowRight className="h-4 w-4 ml-2" />
            </a>
            <p className="text-xs text-muted-foreground mt-6">
              Used Polsia or another AI builder?{' '}
              <a href="/compare" className="underline hover:text-foreground">
                See how they stack up
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>AuditGPT · The truth and rebuild engine.</span>
          <span className="font-mono uppercase tracking-wider">The truth engine for AI businesses.</span>
        </div>
      </footer>
    </div>
  );
}
