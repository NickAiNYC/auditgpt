'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import type { Mesh } from 'three';
import { useRef } from 'react';
import { Logo } from '@/components/logo';

function ScannerMesh() {
  const mesh = useRef<Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = -0.86 + Math.sin(state.clock.elapsedTime * 0.42) * 0.035;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.08;
  });

  return (
    <mesh ref={mesh} rotation={[-0.86, 0, 0.2]}>
      <planeGeometry args={[4.8, 4.8, 36, 36]} />
      <meshStandardMaterial color="#E8D6C4" wireframe transparent opacity={0.32} />
    </mesh>
  );
}

function ScannerVisualization({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0.42 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none mx-auto mb-8 h-36 w-full max-w-md overflow-hidden border border-stone-200 bg-[#FAF9F6]"
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0.45, 4.6], fov: 42 }}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[2, 2, 3]} intensity={1.3} />
        <ScannerMesh />
      </Canvas>
    </motion.div>
  );
}

export default function SnapshotPage() {
  const router = useRouter();
  const [website, setWebsite] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URL(window.location.href).searchParams;
    return params.get('url') || '';
  });
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
    <div className="relative min-h-screen max-w-full overflow-x-clip bg-[#FAF9F6] flex flex-col font-sans">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-40 h-[420px] w-[520px] -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-700 ${
          loading ? 'opacity-80' : 'opacity-35'
        }`}
        style={{
          background:
            'radial-gradient(circle at 35% 40%, rgba(226,114,91,0.22), transparent 46%), radial-gradient(circle at 66% 62%, rgba(232,214,196,0.72), transparent 54%)',
        }}
      />
      
      {/* Header */}
      <header className="relative z-20 border-b border-stone-200/50 bg-white/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <a href="/proof" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden sm:inline-block">
              Proof Center
            </a>
            <a href="/security" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden md:inline-block">
              Trust & Security
            </a>
            <a href="/deployment" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 hidden lg:inline-block">
              Deployment
            </a>
            <a href="/pricing" className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900">
              Pricing →
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Main Snapshot Interface */}
        <main className="relative z-10 w-full max-w-2xl p-8 sm:p-12 bg-white border border-stone-200 text-center transition-all duration-500 shadow-[0_30px_90px_rgba(44,35,28,0.08)]">
          
          {/* Editorial Heading */}
          <div className="mb-4 text-xs font-mono uppercase tracking-widest text-stone-500">Read-Only Visibility Baseline</div>
          <h1 className="text-4xl sm:text-5xl text-stone-900 mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>
            {loading ? 'Executing diagnostic claim run...' : 'Get 1 unsupported claim, 1 proof gap, 1 safer rewrite.'}
          </h1>
          
          <div className="text-stone-500 mb-10 font-light text-sm sm:text-base max-w-lg mx-auto">
            {loading 
              ? 'Mapping public claims against visible evidence, source-linked enforcement patterns, and AI answer reality risk signals.'
              : step === 1 
                ? (
                  <>
                    Paste a public website URL. AuditGPT establishes a first-pass Claim Ledger and returns a focused diagnostic finding.<br/><br/>
                    <span className="text-xs text-stone-400">Public pages only. No login, no write access, no patient data. Diagnostic review only — not legal, medical, clinical, or regulatory advice.</span>
                  </>
                )
                : 'Where should we send your snapshot link?'}
          </div>

          <ScannerVisualization active={loading} />

          <div className="mb-8 grid grid-cols-1 gap-3 border-y border-stone-200 py-5 text-left sm:grid-cols-3">
            {['Unsupported claim', 'Visible proof gap', 'Safer rewrite'].map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs leading-5 text-stone-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-stone-900" />
                {item}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="max-w-xl mx-auto">
            {step === 1 ? (
              <div className="relative flex items-center w-full bg-white shadow-sm border border-stone-200 focus-within:border-[#E2725B] focus-within:ring-4 focus-within:ring-[#E2725B]/10 transition-all duration-300">
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
                  className="absolute right-2 top-2 bottom-2 bg-stone-900 text-white px-6 font-medium text-sm hover:bg-[#E2725B] transition-colors"
                >
                  Analyze
                </button>
              </div>
            ) : (
              <div className="relative flex items-center w-full bg-white shadow-sm border border-stone-200 focus-within:border-[#E2725B] focus-within:ring-4 focus-within:ring-[#E2725B]/10 transition-all duration-300">
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
                  className="absolute right-2 top-2 bottom-2 bg-stone-900 text-white px-6 font-medium text-sm hover:bg-[#E2725B] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> RUNNING</>
                  ) : (
                    'Authorize Audit'
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
          <div className="mt-12 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 border-t border-stone-200/50 pt-8">
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E2725B]/50" /> Public page only
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300" /> No login required
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E2725B]/50" /> No patient/system data
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300" /> Diagnostic review only
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
