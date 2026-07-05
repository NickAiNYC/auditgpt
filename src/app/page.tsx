'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import { Instrument_Serif } from 'next/font/google';
import { Logo } from '@/components/logo';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});

const NAV_ITEMS = [
  ['Sample Report', '/sample-medspa-report'],
  ['Pricing', '/pricing'],
  ['Methodology', '/claim-review-methodology'],
] as const;

const PROMISE_ITEMS = [
  'one unsupported or weak claim',
  'one visible proof gap',
  'one safer rewrite',
] as const;

const REVIEW_STEPS = [
  ['01', 'Extract claim'],
  ['02', 'Map visible support'],
  ['03', 'Classify support strength'],
  ['04', 'Test AI distortion'],
  ['05', 'Suggest safer wording'],
  ['06', 'Issue receipt on paid review'],
] as const;

const REVIEW_SCOPE = [
  ['What it reviews', 'Treatment outcomes, device and FDA language, testimonials, credentials, before/after proof, and AI answer distortion.'],
  ['What you get', 'A first-pass claim finding: one unsupported or weak claim, one visible proof gap, and one safer rewrite.'],
  ['What it is not', 'Not legal advice, clinical review, approval, certification, or a promise that a page is ready for launch.'],
] as const;

// Film-grain overlay — keeps the big soft gradients from banding and adds tactility.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function Home() {
  const router = useRouter();
  const [website, setWebsite] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('url') || '';
  });
  const [isScanning, setIsScanning] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleScan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isScanning) return;
    if (website.trim().length < 3) {
      toast.error('Please enter a website URL.');
      return;
    }
    setIsScanning(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditType: 'starter',
          inputType: 'website',
          websiteUrl: website.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed.');
      if (data.publicId) {
        router.push(`/audit/${data.publicId}`);
      } else {
        toast.error('Scan ran but no result link was generated.');
        setIsScanning(false);
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err.message || 'Scan failed.');
      setIsScanning(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#FAF9F6] font-sans">
      {/* Atmospheric cloud glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[-10%] top-[-10%] h-[50vw] w-[50vw] rounded-full bg-[#E8DCCB] mix-blend-multiply blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] h-[60vw] w-[60vw] rounded-full bg-[#C86A53] mix-blend-multiply blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute right-[15%] top-[5%] h-[35vw] w-[35vw] rounded-full bg-[#D8C7E8] mix-blend-multiply blur-[130px]"
        />
      </div>

      {/* Film grain */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
        aria-hidden
      />

      {/* Nav */}
      <header className="relative z-10">
        <div className="mx-auto flex min-h-16 max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-4">
          <a href="/" className="flex items-center gap-2" aria-label="AuditGPT home">
            <Logo variant="full" height={26} priority />
          </a>
          <nav className="flex items-center gap-5 sm:gap-8">
            {NAV_ITEMS.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="group relative whitespace-nowrap text-xs font-medium text-[#1C1C1C]/60 transition-colors hover:text-[#1C1C1C] sm:text-sm"
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C86A53] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero scanner */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
        <div className="flex w-full max-w-3xl flex-col items-center">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#1C1C1C]/[0.08] bg-white/50 px-4 py-1.5 text-xs font-medium tracking-wide text-[#1C1C1C]/70 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C86A53] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C86A53]" />
            </span>
            AuditGPT by Scrutexity
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`${instrumentSerif.className} mb-6 text-5xl leading-[1.05] tracking-tight text-[#1C1C1C] md:text-7xl`}
          >
            Public claim scanner for <br />
            <em className="text-[#C86A53]">med-spa and wellness pages.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 max-w-xl text-lg font-light leading-relaxed text-[#1C1C1C]/70 md:text-xl"
          >
            Know what your page is claiming before patients, platforms, or AI
            answer engines repeat it. AuditGPT reviews one public page for
            unsupported claims, visible proof gaps, and safer wording.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleScan}
            className="group relative w-full max-w-2xl"
          >
            {/* Ambient glow behind input (activates on focus) */}
            <div
              className={`absolute -inset-1.5 rounded-[1.75rem] bg-gradient-to-r from-[#E8DCCB] via-[#C86A53]/25 to-[#D8C7E8]/40 blur-xl transition-opacity duration-500 ${
                isFocused ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Glassmorphic input container */}
            <div
              className={`relative flex w-full flex-col items-stretch gap-2 rounded-[1.5rem] border bg-white/70 p-2 shadow-[0_1px_2px_rgba(28,28,28,0.04),0_12px_40px_-12px_rgba(28,28,28,0.12)] backdrop-blur-xl transition-all duration-300 sm:flex-row sm:items-center ${
                isFocused ? 'border-[#C86A53]/30' : 'border-[#1C1C1C]/[0.08]'
              }`}
            >
              <input
                type="text"
                inputMode="url"
                autoComplete="url"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="yourwebsite.com"
                aria-label="Website URL"
                disabled={isScanning}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-grow rounded-xl border-none bg-transparent px-4 py-3.5 text-lg text-[#1C1C1C] outline-none placeholder:text-[#1C1C1C]/35 disabled:opacity-60 sm:px-5 sm:py-4"
              />

              {/* Modern layered button */}
              <motion.button
                type="submit"
                disabled={isScanning}
                whileHover={isScanning ? undefined : { scale: 1.02 }}
                whileTap={isScanning ? undefined : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#D1755C] to-[#B85A44] px-7 py-3.5 font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(184,90,68,0.4),0_10px_28px_-8px_rgba(200,106,83,0.55)] transition-shadow duration-300 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(184,90,68,0.4),0_14px_36px_-8px_rgba(200,106,83,0.7)] disabled:opacity-95 sm:py-3.5"
              >
                <span
                  className={`relative z-10 flex items-center justify-center gap-2 whitespace-nowrap transition-opacity duration-300 ${
                    isScanning ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  Run Free Claim Snapshot
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </span>

                {isScanning && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                )}
                {isScanning && (
                  <span className="absolute inset-0 z-10 flex items-center justify-center font-medium">
                    Scanning…
                  </span>
                )}
              </motion.button>
            </div>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-sm leading-6 text-[#1C1C1C]/50"
          >
            Public pages only. No login. No write access. First-pass review only.
          </motion.p>

          {/* Compact promise — glass chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-14 w-full max-w-2xl"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1C1C1C]/45">
              Your free scan returns a first-pass claim finding
            </div>
            <ul className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              {PROMISE_ITEMS.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-baseline gap-2 rounded-full border border-[#1C1C1C]/[0.07] bg-white/40 px-4 py-2 text-sm text-[#1C1C1C]/85 backdrop-blur-sm"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full bg-[#C86A53]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/pricing"
              className="mt-5 inline-flex text-sm font-medium text-[#C86A53] transition-colors hover:text-[#1C1C1C]"
            >
              Want the full claim inventory? Upgrade to the $497 Claim Intelligence Report.
            </a>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 w-full max-w-4xl text-left"
          >
            <div className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#1C1C1C]/45">
              How the review works
            </div>
            <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[#1C1C1C]/[0.08] bg-[#1C1C1C]/[0.08] sm:grid-cols-2 lg:grid-cols-3">
              {REVIEW_STEPS.map(([step, label]) => (
                <div key={step} className="bg-white/50 p-5 backdrop-blur-sm">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#C86A53]">{step}</div>
                  <div className="mt-2 text-sm font-medium text-[#1C1C1C]/85">{label}</div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-4 text-left md:grid-cols-3"
          >
            {REVIEW_SCOPE.map(([title, body]) => (
              <div key={title} className="border border-[#1C1C1C]/[0.08] bg-white/40 p-5 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-[#1C1C1C]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#1C1C1C]/60">{body}</p>
              </div>
            ))}
          </motion.section>

          {/* Legal footer copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-14 max-w-2xl text-[13px] leading-relaxed text-[#1C1C1C]/45"
          >
            AuditGPT reviews public pages only and compares marketing language
            against source-linked enforcement patterns and AI-generated claim
            distortions. It does not provide legal, clinical, regulatory, or
            medical advice. Reviewed does not mean approved, endorsed, or
            error-free.
          </motion.p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1C1C1C]/[0.08] px-6 py-8">
        <div className="mx-auto mb-4 max-w-5xl text-sm italic leading-6 text-[#1C1C1C]/50">
          Optimization vendors grade their own work. Bureaus keep the record.
        </div>
        <div className="mx-auto flex max-w-5xl flex-col gap-2 text-sm leading-6 text-[#1C1C1C]/60 sm:flex-row sm:items-center sm:justify-between">
          <span>AuditGPT is a Scrutexity product.</span>
          <a
            href="/claim-review-methodology"
            className="font-medium text-[#1C1C1C]/80 transition-colors hover:text-[#C86A53]"
          >
            How we review claims →
          </a>
        </div>
      </footer>
    </div>
  );
}
