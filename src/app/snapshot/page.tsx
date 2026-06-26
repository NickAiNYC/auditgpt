'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function SnapshotPage() {
  const router = useRouter();
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [source] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URL(window.location.href).searchParams;
    return params.get('source') || params.get('utm_source') || '';
  });

  const validUrl = website.trim().length >= 3;
  const validEmail = /.+@.+\..+/.test(email);

  const handleNext = () => {
    if (!validUrl) {
      toast.error("Please enter a valid Website URL.");
      return;
    }
    setStep(2);
  };

  const run = async () => {
    if (!validUrl || !validEmail || loading) {
      if (!validEmail) toast.error("Please enter a valid Email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditType: 'snapshot',
          websiteUrl: website.trim(),
          email,
          focusNotes: source ? `Source: ${source}` : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Snapshot failed.');
      if (data.publicId) {
        router.push(`/audit/${data.publicId}`);
      } else {
        toast.error('Snapshot ran but no shareable link was generated.');
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err.message || 'Snapshot failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#faf9f8] overflow-hidden flex flex-col font-sans">
      
      {/* Header */}
      <header className="relative z-20 border-b border-stone-200/50 bg-white/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <div className="flex items-center gap-4">
            <a href="/proof" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden sm:inline-block">
              Proof Center
            </a>
            <a href="/security" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden sm:inline-block">
              Trust & Security
            </a>
            <a href="/deployment" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden sm:inline-block">
              Deployment
            </a>
            <a href="/pricing" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900">
              Pricing →
            </a>
          </div>
        </div>
      </header>

      {/* Atmospheric Cloud Glows - NO neon, soft diffuse light */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-stone-300/30 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-orange-900/10 rounded-full blur-[100px] mix-blend-multiply pointer-events-none" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Main Snapshot Interface */}
        <main className="relative z-10 w-full max-w-2xl p-8 sm:p-12 backdrop-blur-xl bg-white/60 border border-stone-200/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-center transition-all duration-500">
          
          {/* Editorial Heading */}
          <h1 className="text-4xl sm:text-5xl text-stone-900 mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>
            {loading ? 'Scanning Infrastructure...' : 'Initialize Snapshot'}
          </h1>
          
          <p className="text-stone-500 mb-10 font-light text-sm sm:text-base">
            {loading 
              ? 'Analyzing claims, cross-referencing evidence, and evaluating AI visibility risk.'
              : step === 1 
                ? 'Enter the target URL to generate a point-in-time compliance and risk assessment.'
                : 'Where should we send your completed risk assessment?'}
          </p>

          {/* Input Area */}
          <div className="max-w-xl mx-auto">
            {step === 1 ? (
              <div className="relative flex items-center w-full bg-white rounded-xl shadow-sm border border-stone-200 focus-within:border-stone-400 focus-within:ring-4 focus-within:ring-stone-100 transition-all duration-300">
                <input 
                  type="url" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  placeholder="https://example.com" 
                  className="w-full bg-transparent py-4 pl-4 pr-32 text-stone-900 outline-none placeholder:text-stone-400"
                  autoFocus
                />
                <button 
                  onClick={handleNext}
                  className="absolute right-2 top-2 bottom-2 bg-stone-900 text-white px-6 rounded-lg font-medium text-sm hover:bg-stone-800 transition-colors"
                >
                  Analyze
                </button>
              </div>
            ) : (
              <div className="relative flex items-center w-full bg-white rounded-xl shadow-sm border border-stone-200 focus-within:border-stone-400 focus-within:ring-4 focus-within:ring-stone-100 transition-all duration-300">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && run()}
                  placeholder="you@company.com" 
                  disabled={loading}
                  className="w-full bg-transparent py-4 pl-4 pr-40 text-stone-900 outline-none placeholder:text-stone-400 disabled:opacity-50"
                  autoFocus
                />
                <button 
                  onClick={run}
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 bg-stone-900 text-white px-6 rounded-lg font-medium text-sm hover:bg-stone-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> RUNNING...</>
                  ) : (
                    'Run Snapshot'
                  )}
                </button>
              </div>
            )}

            {/* Back button for step 2 */}
            {step === 2 && !loading && (
              <button 
                onClick={() => setStep(1)}
                className="mt-4 text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors"
              >
                ← Back to URL
              </button>
            )}
          </div>

          {/* Trust Signals */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 border-t border-stone-200/50 pt-8">
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" /> Read-Only Analysis
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300" /> Zero-Downtime Execution
            </span>
          </div>

        </main>

        <p className="relative z-10 text-[10px] font-mono uppercase tracking-widest text-stone-400 mt-8 text-center max-w-xl">
          AuditGPT outputs are based on public website review. They are not legal, clinical, regulatory, or compliance guarantees.
          <br />
          <a href="https://scrutexity.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 underline hover:text-stone-600 transition-colors">
            Parent company: Scrutexity →
          </a>
        </p>
      </div>
    </div>
  );
}
