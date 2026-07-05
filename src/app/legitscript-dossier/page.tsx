'use client';

import { ArrowRight, ArrowLeft, FileText, ShieldCheck, Download, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    number: 1,
    icon: FileText,
    title: 'Scan',
    description: 'AuditGPT crawls your website and maps every claim to supporting evidence — practitioner licenses, certifications, regulatory disclosures, and published outcomes.',
  },
  {
    number: 2,
    icon: ShieldCheck,
    title: 'Package',
    description: 'We compile a LegitScript-ready dossier: verified claims ledger, practitioner license roster, clean remediation log, and a SHA-256 integrity seal.',
  },
  {
    number: 3,
    icon: Download,
    title: 'Submit',
    description: 'Export a single PDF dossier with all attachments pre-organized. One click, one file — ready for LegitScript certification submission.',
  },
];

const DOSSIER_SECTIONS = [
  {
    icon: FileText,
    title: 'Verified Claims Ledger',
    description: 'Every marketing claim mapped to its supporting evidence with source URLs, publication dates, and audit timestamps.',
  },
  {
    icon: ShieldCheck,
    title: 'Practitioner License Roster',
    description: 'All cited practitioner licenses verified against state registries, with expiration dates and scope-of-practice annotations.',
  },
  {
    icon: Clock,
    title: 'Clean Remediation Log',
    description: 'Timeline of every unsupported claim identified and corrected, with before/after language and proof-of-remediation screenshots.',
  },
  {
    icon: CheckCircle,
    title: 'SHA-256 Integrity Seal',
    description: 'Cryptographic hash of the complete dossier. Verifiable by LegitScript reviewers to detect tampering between submission and review.',
  },
];

const BENEFITS = [
  {
    icon: Clock,
    title: 'Shave 2–3 weeks off approval timeline',
    description: 'LegitScript reviewers receive a pre-organized, evidence-backed dossier instead of a stack of loose attachments. Faster first-pass review, fewer follow-up questions.',
  },
  {
    icon: FileText,
    title: 'AuditGPT maps claim‑to‑proof in 5 minutes',
    description: 'What takes a compliance team days — crawling every page, cross-referencing licenses, logging remediation — our engine completes in the time it takes to make coffee.',
  },
  {
    icon: ShieldCheck,
    title: 'One export, not 17 attachments',
    description: 'License copies, claim evidence, remediation logs, business registration docs. One PDF with a table of contents and cryptographic seal. LegitScript sees everything in order.',
  },
];

export default function LegitscriptDossierPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] font-sans">
      <header className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          {/* ── HERO ─────────────────────────────────────────────── */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
              <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                One-Click LegitScript Dossier
              </span>
            </div>
            <h1 className="font-serif font-light text-5xl sm:text-6xl leading-tight mb-6 text-stone-900">
              From site scan to LegitScript-ready dossier — in one click.
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              LegitScript requires proof of regulatory compliance, transparent business practices, and
              provider licensing. Manual compilation takes weeks of cross-referencing, screenshotting, and
              organizing. AuditGPT packages everything into a single, submission-ready PDF dossier — with
              cryptographic integrity verification — in minutes.
            </p>
            <div className="flex justify-center">
              <Link
                href="/pricing"
                className="bg-stone-900 text-white px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
              >
                Try the $299 Claim Intelligence Report <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ── 3-STEP PROCESS ───────────────────────────────────── */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-4 text-stone-900">
                Scan → Package → Submit
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto text-lg">
                Three steps from website URL to LegitScript submission artifact.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: step.number * 0.1 }}
                  className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-4 font-mono text-sm font-bold">
                    {step.number}
                  </div>
                  <step.icon className="h-6 w-6 text-stone-400 mx-auto mb-3" />
                  <h3 className="font-serif text-2xl mb-3 text-stone-900">{step.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── DOSSIER PREVIEW ──────────────────────────────────── */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  What&apos;s Inside
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-4 text-stone-900">
                Dossier Preview
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto text-lg">
                Every export includes four pre-audited sections, organized and sealed for LegitScript review.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DOSSIER_SECTIONS.map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                  className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm"
                >
                  <section.icon className="h-6 w-6 text-stone-400 mb-4" />
                  <h3 className="font-serif text-2xl mb-2 text-stone-900">{section.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{section.description}</p>
                  <div className="mt-4 text-[10px] font-mono uppercase tracking-widest text-stone-400">
                    Included in every dossier
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── BENEFITS ─────────────────────────────────────────── */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />
                <span className="text-xs uppercase tracking-widest text-stone-500 font-mono font-bold">
                  Why AuditGPT
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-4 text-stone-900">
                Faster. Organized. Verifiable.
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto text-lg">
                Stop burning weeks on manual dossier assembly. Let automation do the organizing while your
                team focuses on compliance strategy.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BENEFITS.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                  className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm"
                >
                  <benefit.icon className="h-8 w-8 text-stone-400 mb-4" />
                  <h3 className="font-serif text-xl mb-3 text-stone-900">{benefit.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── CTA ──────────────────────────────────────────────── */}
          <section className="mb-20">
            <div className="bg-stone-900 text-white p-10 sm:p-12 rounded-sm text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                <span className="text-xs uppercase tracking-widest text-stone-300 font-mono font-bold">
                  Try Before You Commit
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-4">
                $299 Claim Intelligence Report
              </h2>
              <p className="text-stone-300 max-w-xl mx-auto mb-8 text-lg leading-relaxed">
                Run a full claim audit on your clinic&apos;s website. See which claims have supporting
                evidence, which need remediation, and what a LegitScript dossier would include — before
                you invest in the full package.
              </p>
              <Link
                href="/pricing"
                className="bg-white text-stone-900 px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-100 transition-colors inline-flex items-center gap-2"
              >
                Get the $299 Report <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* ── DISCLAIMER ────────────────────────────────────────── */}
          <div className="border-t border-stone-200 pt-8">
            <p className="text-xs text-stone-400 max-w-3xl mx-auto text-center leading-relaxed">
              <strong className="text-stone-500">Boundary Disclaimer:</strong> AuditGPT does not provide
              legal, clinical, regulatory, or certification advice. LegitScript certification eligibility is
              determined solely by LegitScript at its discretion. The dossier generated is an organizational
              artifact — it packages your existing evidence into a structured format but does not guarantee
              certification approval, reduced review time, or compliance with any specific regulatory standard.
              Always consult qualified legal and compliance professionals for certification submissions.
              AuditGPT does not certify, warrant, or guarantee the completeness, accuracy, or sufficiency of
              any evidence included in the dossier.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-stone-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
          <span className="font-mono">AuditGPT by Scrutexity · Claim Intelligence for businesses where trust matters.</span>
          <div className="flex items-center gap-4">
            <a href="/promises" className="underline hover:text-white transition-colors">
              Promises &amp; Anti-Promises
            </a>
            <a href="/legal" className="underline hover:text-white transition-colors">
              Terms &amp; Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
