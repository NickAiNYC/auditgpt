'use client';

// ============================================================
// AuditGPT — Homepage (Scrutexity v2)
// ============================================================
// Find what is unsupported, invisible, risky, or leaking.
// One intake form → /api/audit (starter type) → public report.
// The free snapshot has its own route at /snapshot.
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, ArrowDown, Sparkles, ShieldCheck, Loader2, Building2, Cpu, Search, CheckCircle2, AlertTriangle, ArrowUpRight, FileText, TrendingUp, Clock, Ban, Lock, Eye } from 'lucide-react';
import { motion, useAnimate } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const PATH_CARDS = [
  { path: '01', label: "I'm a med spa or wellness business", icon: Sparkles, href: '#intake' },
  { path: '02', label: "I'm an agency auditing a client", icon: Building2, href: '#intake' },
  { path: '03', label: "I'm a SaaS / AI startup", icon: Cpu, href: '#intake' },
  { path: '04', label: "I'm evaluating a company / deal", icon: Search, href: '#intake' },
] as const;

const HOW_IT_WORKS = [
  { step: '01', title: 'Submit Your URL', icon: FileText, desc: 'Enter your homepage or any buyer-facing page. AuditGPT pulls the visible content instantly.' },
  { step: '02', title: 'Claim Intelligence Runs', icon: Cpu, desc: 'Every claim is labeled: supported, weakly supported, overstated, or unsupported — with evidence gaps mapped.' },
  { step: '03', title: 'Get Your Report', icon: ShieldCheck, desc: 'Receive a prioritized findings report with safer rewrites, a claim health score, and next steps.' },
] as const;

const WHO_USES = [
  { tag: 'AI / SaaS', desc: 'Monitors buyer-facing surfaces for claim drift and AI answer distortion at scale.' },
  { tag: 'Med spa & aesthetics', desc: 'Flags unsupported treatment and results claims before buyers or regulators do.' },
  { tag: 'Performance agencies', desc: 'White-label claim audits used as a sales wedge and quarterly client review.' },
  { tag: 'Growth-stage fintech', desc: 'Clears unsupported claims from revenue pages ahead of diligence.' },
] as const;

const PLANS = [
  {
    name: 'Free Claim Snapshot',
    for: 'Founder sanity-check',
    depth: '1 page, 3–4 findings',
    outcome: 'Know if this page is safe to ship.',
    price: '$0',
    cta: 'Run Free Snapshot',
    highlight: false,
  },
  {
    name: 'Claim Intelligence Report',
    for: 'Launching a new funnel',
    depth: '5–7 claims, score, rewrites',
    outcome: 'Ship a buyer-safe flagship page in 7 days.',
    price: '$299',
    cta: 'Get the $299 Report',
    highlight: true,
  },
  {
    name: 'Claim Drift Monitoring',
    for: 'Fundraising / M&A readiness',
    depth: '5 surfaces, 30-day plan',
    outcome: 'De-risk your claims before diligence.',
    price: '$299/mo',
    cta: 'Start Claim Drift Monitoring',
    highlight: false,
  },
  {
    name: 'Agency Founding Beta',
    for: 'Agencies & consultancies',
    depth: 'Multi-client, white-label',
    outcome: 'Founding Beta: $499/mo for the first 5 partners, then $799/mo. Turn claim audits into billable retainers.',
    price: '$499/mo',
    cta: 'Join the Founding Beta',
    highlight: false,
  },
] as const;

const METHODOLOGY_STEPS = [
  { step: '1', title: 'Extract', desc: 'Our scanner pulls every factual claim from the visible surface of the page.' },
  { step: '2', title: 'Classify', desc: 'Each claim is labeled against an evidence rubric: Supported / Weakly Supported / Overstated / Unsupported.' },
  { step: '3', title: 'Map', desc: 'We cross-reference claims against adjacent visible evidence — links, data, quotes, certifications.' },
  { step: '4', title: 'Recalibrate', desc: 'Methodology is re-tested monthly against live ChatGPT, Perplexity, Gemini, and Copilot outputs.' },
] as const;

function AnimatedScanReceipt() {
  const lines = [
    { label: 'Claim scanned', value: '34 total' },
    { label: 'Evidence gaps', value: '18 found' },
    { label: 'Overstated', value: '9 flagged' },
    { label: 'High risk', value: '7 claims' },
    { label: 'Safer rewrites', value: '12 ready' },
    { label: 'Health score', value: '52 / 100' },
  ];
  return (
    <div className="relative bg-stone-900 rounded-sm border border-stone-700 p-6 font-mono text-sm shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-0.5">AuditGPT</div>
          <div className="text-white font-serif text-lg">Claim Audit Receipt</div>
        </div>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
        </span>
      </div>
      <div className="h-px bg-stone-700 mb-5" />
      <div className="space-y-3 mb-5">
        {lines.map((line, i) => (
          <motion.div
            key={line.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.4 + i * 0.18 }}
            className="flex items-center justify-between"
          >
            <span className="text-stone-500 text-[11px] uppercase tracking-wider">{line.label}</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.7 + i * 0.18 }}
              className="text-white text-[11px] font-semibold"
            >
              {line.value}
            </motion.span>
          </motion.div>
        ))}
      </div>
      <div className="h-px bg-stone-700 mb-4" />
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[9px] uppercase tracking-widest text-stone-600">Claim Health Score</div>
          <div className="text-3xl font-serif text-white mt-0.5">52<span className="text-lg text-stone-500">/100</span></div>
        </div>
        <div className="text-right">
          <div className="text-[9px] uppercase tracking-widest text-stone-600 mb-1">Priority</div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-sm bg-red-900/50 text-red-400 border border-red-800">High Risk</span>
        </div>
      </div>
      <div className="mt-4 h-1.5 bg-stone-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-400"
          initial={{ width: '0%' }}
          animate={{ width: '52%' }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.8 }}
        />
      </div>
      <div className="mt-4 text-[9px] uppercase tracking-widest text-stone-600 text-center">Issued by AuditGPT · Scrutexity Infrastructure</div>
    </div>
  );
}

const COMPANY_TYPES = [
  'AI / SaaS',
  'Agency / consulting',
  'Creator / personal brand',
  'Med spa / wellness',
  'Healthcare provider',
  'Local service business',
  'Ecommerce',
  'Marketplace',
  'Other',
];

const PRIMARY_WORRIES = [
  'Buyers don\'t trust our claims',
  'We\'re invisible in AI/search results',
  'We\'re losing inbound demand',
  'Sponsors may flag our claims',
  'Our reputation surface is weak',
  'Not sure — show me what\'s leaking',
];



export default function Home() {
  const router = useRouter();
  const [inputType, setInputType] = useState<'website' | 'agent_transcript'>('website');
  const [website, setWebsite] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('url') || '';
  });
  const [transcript, setTranscript] = useState('');
  const [name, setName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [worry, setWorry] = useState('');
  const [isAgency, setIsAgency] = useState(false);
  const [isMedical, setIsMedical] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = inputType === 'website' ? website.trim().length >= 3 : transcript.trim().length >= 10;

  const run = async () => {
    if (!valid || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditType: 'starter',
          inputType,
          websiteUrl: inputType === 'website' ? website.trim() : undefined,
          transcript: inputType === 'agent_transcript' ? transcript.trim() : undefined,
          companyName: name.trim() || undefined,
          industry: companyType || undefined,
          companyType: isAgency
            ? 'agency'
            : isMedical
              ? 'medical_or_wellness'
              : companyType || undefined,
          focusNotes: worry || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Audit failed.');
      if (data.publicId) {
        router.push(`/audit/${data.publicId}`);
      } else {
        toast.error('Audit ran but no shareable link was generated.');
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err.message || 'Audit failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <header className="border-b border-stone-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <nav className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-stone-500">
            <a href="/" className="hover:text-stone-900 transition-colors hidden sm:inline-block">Platform</a>
            <a href="/ai-answer-reality" className="hover:text-stone-900 transition-colors hidden sm:inline-block">AI Answer Reality</a>
            <a href="/ai-answer-reality/sample" className="hover:text-stone-900 transition-colors">Sample Report</a>
            <a href="/pricing" className="hover:text-stone-900 transition-colors">Pricing</a>
            <a href="/proof" className="hover:text-stone-900 transition-colors hidden sm:inline-block">Proof</a>
            <a href="/agency" className="hover:text-stone-900 transition-colors">Partners</a>
            <a href="/snapshot" className="bg-stone-900 text-white px-3 py-1.5 rounded-sm hover:bg-stone-700 transition-colors font-semibold">Run Claim Snapshot</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 pt-16 sm:pt-24 pb-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="inline-flex items-center gap-2 mb-6">
                  <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-stone-400 opacity-40 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-stone-900" /></span>
                  <span className="text-xs font-mono uppercase tracking-widest text-stone-500">AuditGPT by Scrutexity</span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }} className="font-serif font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6 text-stone-900">
                  AI made publishing cheap.<br /><span className="italic text-stone-500">Scrutexity makes growth governable.</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.2 }} className="text-base text-stone-600 max-w-lg mb-8 leading-relaxed">
                  AuditGPT scans public buyer-facing pages to find unsupported claims, evidence gaps, and AI Answer Reality risks before buyers repeat or distrust them.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }} className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-3 mb-6">
                  <a href="/snapshot" className="btn-cta text-sm px-6 py-3.5 flex-shrink-0 w-auto">Run a Client Claim Snapshot <ArrowRight className="h-4 w-4 ml-2 inline" /></a>
                  <a href="/ai-answer-reality/sample" className="px-6 py-3.5 text-sm font-mono uppercase tracking-widest text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-sm transition-colors flex items-center justify-center">View Sample Audit</a>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="inline-flex items-center gap-2 p-3 border border-stone-200 rounded-sm bg-stone-50">
                  <Building2 className="h-3.5 w-3.5 text-stone-400 flex-shrink-0" />
                  <p className="text-xs text-stone-500 font-mono uppercase tracking-widest">Agency?</p>
                  <a href="/agency" className="text-xs font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-600 transition-colors">White-label our engine →</a>
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
                <AnimatedScanReceipt />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── PATH CARDS ─────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-12 border-t border-stone-100 bg-stone-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 text-center mb-6">Choose Your Path</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PATH_CARDS.map(({ path, label, icon: Icon, href }, i) => (
                <motion.a key={path} href={href}
                  onClick={
                    path === '01'
                      ? () => { setIsMedical(true); setIsAgency(false); setCompanyType('Med spa / wellness'); }
                      : path === '02'
                        ? () => { setIsMedical(false); setIsAgency(true); setCompanyType('Agency / consulting'); }
                        : path === '03'
                          ? () => { setIsMedical(false); setIsAgency(false); setCompanyType('AI / SaaS'); }
                          : undefined
                  }
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -2, borderColor: '#1c1917' }} viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.07 }}
                  className="group block p-5 border border-stone-200 bg-white hover:shadow-md rounded-sm transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Path {path}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-stone-300 group-hover:text-stone-700 transition-colors" />
                  </div>
                  <Icon className="h-5 w-5 text-stone-400 group-hover:text-stone-700 transition-colors mb-3" strokeWidth={1.5} />
                  <div className="font-serif text-base text-stone-900 leading-snug">{label}</div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO USES AUDITGPT TODAY ────────────────────────── */}
        <section className="px-4 sm:px-6 py-14 bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 text-center mb-3">Built For Teams Like These</div>
            <p className="text-center text-xs text-stone-400 max-w-2xl mx-auto">Modeled use cases. Not published client results.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {WHO_USES.map(({ tag, desc }, i) => (
                <motion.div key={tag}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                  className="border border-stone-200 bg-stone-50 p-5 rounded-sm"
                >
                  <div className="inline-block text-[10px] font-mono uppercase tracking-wider bg-stone-900 text-white px-2.5 py-1 rounded-sm mb-3">{tag}</div>
                  <p className="text-sm text-stone-600 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLAN COMPARISON TABLE ──────────────────────────── */}
        <section className="px-4 sm:px-6 py-16 bg-stone-50 border-t border-stone-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 text-center mb-3">Find Your Plan</div>
            <div className="overflow-x-auto mt-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-300 font-mono text-[11px] uppercase tracking-widest text-stone-500">
                    <th className="p-4 pl-0 w-[20%]">Plan</th>
                    <th className="p-4 w-[22%]">For whom</th>
                    <th className="p-4 w-[22%]">Depth of scan</th>
                    <th className="p-4 w-[26%]">Key outcome</th>
                    <th className="p-4 w-[10%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {PLANS.map((plan, i) => (
                    <motion.tr key={plan.name}
                      initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                      className={`group hover:bg-stone-100/50 transition-colors ${plan.highlight ? 'bg-stone-100' : ''}`}
                    >
                      <td className="p-4 pl-0">
                        <div className={`font-serif text-lg ${plan.highlight ? 'text-stone-900' : 'text-stone-800'}`}>{plan.name}</div>
                        <div className="text-xs font-mono text-stone-400 mt-0.5">{plan.price}</div>
                      </td>
                      <td className="p-4 text-sm text-stone-600">{plan.for}</td>
                      <td className="p-4 text-sm text-stone-600">{plan.depth}</td>
                      <td className="p-4 text-sm text-stone-800 font-medium italic">{plan.outcome}</td>
                      <td className="p-4 pr-0">
                        <a href={plan.price === '$0' ? '/snapshot' : '/pricing'}
                          className={`text-[10px] font-mono uppercase tracking-wider px-3 py-2 rounded-sm transition-colors whitespace-nowrap inline-block ${
                            plan.highlight
                              ? 'bg-stone-900 text-white hover:bg-stone-700'
                              : 'border border-stone-300 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {plan.cta}
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-sm font-mono text-[11px] uppercase tracking-widest">
                <AlertTriangle className="h-3.5 w-3.5" /> Average 10–20 unsupported claims surfaced per page
              </div>
              <div className="mt-4">
                <a href="/personal-brand-audit" className="text-xs font-semibold text-stone-600 underline underline-offset-4 hover:text-stone-900 transition-colors">
                  Also available: Run a Personal Brand Snapshot →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE MOCKUP CARDS ───────────────────────────── */}
        <section className="px-4 sm:px-6 py-16 bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 text-center mb-10">What You Get in Every Report</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0 }} className="border border-stone-200 bg-white rounded-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="rounded-sm bg-stone-900 p-4 flex flex-col items-center justify-center gap-1">
                  <div className="text-4xl font-serif text-white">82</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">/100</div>
                  <div className="w-full bg-stone-700 rounded-full h-1.5 mt-2">
                    <motion.div className="h-full rounded-full bg-white" initial={{ width: '0%' }} whileInView={{ width: '82%' }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }} />
                  </div>
                </div>
                <div className="text-sm font-serif text-stone-900">Claim Health Score</div>
                <div className="text-xs text-stone-500 leading-relaxed">A 0–100 score showing how well your claims are backed by visible evidence.</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.08 }} className="border border-stone-200 bg-white rounded-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="rounded-sm bg-stone-50 border border-stone-100 p-3 space-y-2">
                  {[{ text: '"#1 rated in the region"', tag: 'Unsupported', color: 'bg-red-100 text-red-700' }, { text: '"Instant results guaranteed"', tag: 'Overstated', color: 'bg-amber-100 text-amber-700' }, { text: '"Backed by research"', tag: 'Needs proof', color: 'bg-blue-100 text-blue-700' }].map((row, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE, delay: 0.2 + i * 0.1 }} className="flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3 text-stone-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-stone-700 truncate font-mono">{row.text}</div>
                        <span className={`inline-block text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm mt-0.5 ${row.color}`}>{row.tag}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm font-serif text-stone-900">Unsupported Claim Table</div>
                <div className="text-xs text-stone-500 leading-relaxed">Every risky claim labeled by type, with evidence gaps and fix recommendations.</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.16 }} className="border border-stone-200 bg-white rounded-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="rounded-sm bg-stone-50 border border-stone-100 p-3 space-y-2.5">
                  {[{ engine: 'ChatGPT', status: 'Partial', color: 'text-amber-600' }, { engine: 'Perplexity', status: 'Incorrect', color: 'text-red-600' }, { engine: 'Gemini', status: 'Accurate', color: 'text-green-600' }].map(({ engine, status, color }, i) => (
                    <motion.div key={engine} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-stone-500">{engine}</span>
                      <span className={`text-[11px] font-mono font-semibold ${color}`}>{status}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm font-serif text-stone-900">AI Answer Reality Snapshot</div>
                <div className="text-xs text-stone-500 leading-relaxed">See how ChatGPT, Perplexity, and Gemini describe your business — accurately or not.</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.24 }} className="border border-stone-200 bg-white rounded-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="rounded-sm bg-stone-50 border border-stone-100 p-3 space-y-2">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">Before</div>
                  <div className="text-[11px] text-stone-500 font-mono line-through">&ldquo;We get results faster than anyone.&rdquo;</div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mt-2 mb-1.5">Safer Rewrite</div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-[11px] text-stone-800 font-mono">&ldquo;Our clients report [X]% faster results within [Y] days.&rdquo;</div>
                  </div>
                </div>
                <div className="text-sm font-serif text-stone-900">Safer Rewrite Recommendations</div>
                <div className="text-xs text-stone-500 leading-relaxed">Claim-safe rewrites that keep your marketing intent without the risk.</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── AI ANSWER REALITY: FEAR + ROI ──────────────────── */}
        <section className="px-4 sm:px-6 py-16 border-t border-stone-100 bg-stone-900 text-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-4">What Buyers See vs. What You Claim</div>
                <div className="space-y-4">
                  <div className="bg-stone-800/60 border border-stone-700 p-4 rounded-sm">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-stone-500 mb-2">Your Site Says</div>
                    <div className="text-sm text-stone-300 font-mono">&ldquo;The most advanced laser treatment in the city.&rdquo;</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowDown className="h-5 w-5 text-stone-500" />
                  </div>
                  <div className="bg-red-900/20 border border-red-800/50 p-4 rounded-sm">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-red-400 mb-2">ChatGPT Tells Buyers</div>
                    <div className="text-sm text-red-300 font-mono">&ldquo;Several clinics in [City] offer advanced laser treatments. No single provider is consistently cited as the most advanced.&rdquo;</div>
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-sm text-stone-400 leading-relaxed">
                  <p>AI answer engines cross-reference your claims against public evidence. If there's no proof adjacent to your claim, they ignore it — or worse, recommend a competitor who links to data.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-stone-800/40 border border-stone-700 p-6 rounded-sm">
                  <div className="flex items-start gap-3">
                    <Ban className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-stone-300 leading-relaxed font-serif italic">&ldquo;A Series B startup lost a $2M deal when an AI research agent told the buyer their claims were unverifiable. The deal died in diligence. AuditGPT exists to prevent this scenario.&rdquo;</p>
                      <p className="text-[10px] font-mono text-stone-500 mt-2">Anonymized — deal intelligence from founder network</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-stone-800/40 border border-stone-700 p-5 rounded-sm text-center">
                    <div className="text-2xl font-serif text-white mb-1">52 → 84</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Claim Health Score</div>
                    <p className="text-xs text-stone-500 mt-2">After 11 rewrites and 9 new proof blocks</p>
                  </div>
                  <div className="bg-stone-800/40 border border-stone-700 p-5 rounded-sm text-center">
                    <div className="text-2xl font-serif text-white mb-1">14 days</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">AI Correction Time</div>
                    <p className="text-xs text-stone-500 mt-2">AI engines stopped recommending competitors on core queries</p>
                  </div>
                </div>
                <a href="/ai-answer-reality" className="block w-full text-center border border-stone-600 text-stone-300 py-3 rounded-sm text-xs font-mono uppercase tracking-widest hover:bg-stone-800 hover:text-white transition-colors">
                  See Full AI Answer Reality Report →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE SAMPLE ─────────────────────────────── */}
        <section className="px-4 sm:px-6 py-16 border-t border-stone-100 bg-stone-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-widest text-center text-stone-400 mb-6">Explore a live Claim Intelligence Report</div>
            <div className="bg-white border border-stone-200 shadow-xl rounded-sm overflow-hidden h-[600px] w-full relative">
              <div className="bg-stone-900 border-b border-stone-700 p-3 flex items-center gap-3 absolute top-0 w-full z-10">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-amber-400" /><div className="w-3 h-3 rounded-full bg-green-400" /></div>
                <div className="text-xs font-mono text-stone-400">scrutexity-interactive-sample.pdf</div>
              </div>
              <iframe src="/ai-answer-reality/sample" className="w-full h-full pt-[44px] border-none" title="Interactive Sample Report" />
            </div>
          </div>
        </section>

        {/* ── FOUNDER QUOTE ──────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-10 bg-white border-t border-stone-100">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-4">
            <div className="h-10 w-10 rounded-full bg-stone-200 overflow-hidden flex-shrink-0">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f3f4f6" alt="Founder avatar" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <div>
              <p className="text-sm font-serif italic text-stone-700">&ldquo;We built AuditGPT after watching too many startups lose deals because AI wrote claims their product couldn&apos;t actually prove.&rdquo;</p>
              <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mt-1">Founder, Scrutexity</p>
            </div>
          </div>
        </section>

        {/* ── INTAKE FORM ────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-16 border-t border-stone-100 bg-stone-50">
          <div className="max-w-3xl mx-auto">
            <div id="intake" className="bg-white border border-stone-200 shadow-md rounded-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 mb-4">
                <Sparkles className="h-3.5 w-3.5" /><span>Claim Intelligence Report ($299)</span><span className="text-stone-300 mx-2">·</span>
                <a href="/snapshot" className="underline underline-offset-4 hover:text-stone-900 transition-colors">Or: Free claim snapshot ($0) →</a>
              </div>
              <div className="flex gap-6 mb-5 border-b border-stone-100 pb-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer font-medium"><input type="radio" checked={inputType === 'website'} onChange={() => setInputType('website')} className="accent-black w-4 h-4" />Website Audit</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer font-medium"><input type="radio" checked={inputType === 'agent_transcript'} onChange={() => setInputType('agent_transcript')} className="accent-black w-4 h-4" />Agent Guardrail Audit</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {inputType === 'website' ? (
                  <div><label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-1">Website URL *</label><Input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yourcompany.com" className="!text-base !rounded-sm !border-black" /></div>
                ) : (
                  <div className="col-span-1 sm:col-span-2 mb-2"><label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-1">Agent Transcript *</label><Textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Paste chatbot or support agent transcript here..." className="!text-base !rounded-sm !border-black min-h-[120px]" /></div>
                )}
                <div><label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-1">Company name</label><Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Inc." className="!text-base !rounded-sm !border-black" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div><label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-1">Company type</label>
                  <Select value={companyType} onValueChange={setCompanyType}><SelectTrigger className="!rounded-sm !border-black !h-10"><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent>{COMPANY_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent></Select>
                </div>
                <div><label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-1">Primary worry</label>
                  <Select value={worry} onValueChange={setWorry}><SelectTrigger className="!rounded-sm !border-black !h-10"><SelectValue placeholder="What concerns you most?" /></SelectTrigger><SelectContent>{PRIMARY_WORRIES.map((w) => (<SelectItem key={w} value={w}>{w}</SelectItem>))}</SelectContent></Select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-stone-700">
                <label className="flex items-center gap-2"><Checkbox checked={isAgency} onCheckedChange={(c) => setIsAgency(c === true)} />I&apos;m an agency auditing a client</label>
                <label className="flex items-center gap-2"><Checkbox checked={isMedical} onCheckedChange={(c) => setIsMedical(c === true)} />Medical / wellness business</label>
              </div>
              <button onClick={() => { if (!valid) { toast.error(inputType === 'website' ? "Please enter a valid Website URL." : "Please enter a valid transcript (min 10 chars)."); return; } run(); }} disabled={loading} className="btn-cta w-full py-4 text-base">
                {loading ? (<><Loader2 className="h-5 w-5 mr-2 animate-spin inline" /> RUNNING AUDIT...</>) : (<>GET MY 1-PAGE SNAPSHOT <ArrowRight className="h-5 w-5 ml-2 inline" /></>)}
              </button>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-20 bg-stone-900 text-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 text-center mb-12">How it Works</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
              <div className="hidden md:block absolute top-10 h-px bg-stone-700 z-0" style={{ left: '16.7%', right: '16.7%' }} />
              {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
                <motion.div key={step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.15 }} className="relative flex flex-col items-center text-center px-6 pb-12 md:pb-0">
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.15 + 0.1 }} className="relative z-10 w-20 h-20 rounded-full border-2 border-stone-600 bg-stone-800 flex flex-col items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-stone-300" strokeWidth={1.5} /><span className="text-[9px] font-mono text-stone-500 mt-1">{step}</span>
                  </motion.div>
                  {i < 2 && (<div className="md:hidden flex justify-center mb-6"><div className="flex flex-col items-center gap-1"><div className="w-px h-6 bg-stone-700" /><div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-stone-600" /></div></div>)}
                  <h3 className="font-serif text-xl mb-3 text-white">{title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed max-w-xs">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTENT SECTIONS ───────────────────────────────── */}
        <div className="divide-y divide-stone-100">

          {/* Methodology & Standards */}
          <section className="px-4 sm:px-6 py-16 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">Methodology &amp; Standards</div>
              <h2 className="font-serif text-3xl mb-8 text-stone-900">How we label your claims</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{ tag: 'Supported', color: 'border-green-200 bg-green-50/40', pill: 'bg-green-50 text-green-900 border-green-200', desc: 'The claim is specific, measurable, and has visible proof directly adjacent to it.' }, { tag: 'Weakly Supported', color: 'border-blue-200 bg-blue-50/40', pill: 'bg-blue-50 text-blue-900 border-blue-200', desc: "There is some proof, but it's vague, buried on another page, or requires the buyer to connect the dots." }, { tag: 'Overstated', color: 'border-amber-200 bg-amber-50/40', pill: 'bg-amber-50 text-amber-900 border-amber-200', desc: 'The business likely does this, but the language stretches beyond what the evidence proves.' }, { tag: 'Unsupported', color: 'border-red-200 bg-red-50/40', pill: 'bg-red-50 text-red-900 border-red-200', desc: 'A naked claim. No data, no customer quotes, no screenshots, no links. Highly likely to be ignored by AI search.' }].map(({ tag, color, pill, desc }, i) => (
                  <motion.div key={tag} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }} className={`border p-5 rounded-sm ${color}`}>
                    <span className={`inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border mb-3 ${pill}`}>{tag}</span>
                    <p className="text-sm text-stone-700 leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 bg-stone-50 border border-stone-200 p-6 rounded-sm">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  {METHODOLOGY_STEPS.map(({ step, title, desc }) => (
                    <div key={step}>
                      <div className="text-[10px] font-mono text-stone-400 mb-1">Step {step}</div>
                      <div className="text-sm font-serif text-stone-900 mb-1">{title}</div>
                      <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-stone-200 text-xs text-stone-400 font-mono">
                  <Eye className="h-3 w-3 inline mr-1" /> Methodology is re-tested monthly against live ChatGPT, Perplexity, Gemini, and Copilot outputs to minimize false positives.
                </div>
              </div>
            </div>
          </section>

          {/* Why AuditGPT Exists */}
          <section className="px-4 sm:px-6 py-16 bg-stone-50">
            <div className="max-w-3xl mx-auto">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">Why AuditGPT Exists</div>
              <p className="text-lg text-stone-800 leading-relaxed mb-4">AI made it easy to publish confident websites, landing pages, comparison pages, sales copy, and product claims in minutes.</p>
              <p className="text-lg text-stone-800 leading-relaxed mb-4">But faster publishing created a new problem: your business may now be saying more than it can clearly prove.</p>
              <p className="text-base text-stone-600 leading-relaxed">AuditGPT reviews buyer-facing pages and identifies which claims are supported, which need evidence, which are overstated, and which should be rewritten before buyers, investors, partners, or AI search systems repeat them.</p>
            </div>
          </section>

          {/* What the Free Snapshot Checks */}
          <section className="px-4 sm:px-6 py-16 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">What the Free Snapshot Checks</div>
              <h2 className="font-serif text-2xl mb-6 text-stone-900">The free snapshot focuses on one thing: <strong>Can this page prove what it claims?</strong></h2>
              <ul className="space-y-3 mb-4">{['One claim that needs stronger proof', 'One missing or weak evidence signal', 'One safer rewrite or recommended fix', 'One next step inside the Scrutexity system'].map((item) => (<li key={item} className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-stone-400 mt-0.5 flex-shrink-0" /><span className="text-stone-700 text-sm">{item}</span></li>))}</ul>
              <p className="text-sm text-stone-400 font-mono">This is not a legal review, compliance certification, SEO audit, or ranking report. It is a claim intelligence snapshot.</p>
            </div>
          </section>

          {/* What Paid Audits Add */}
          <section className="px-4 sm:px-6 py-16 bg-stone-50">
            <div className="max-w-5xl mx-auto">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">What Paid Audits Add</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-white border border-stone-200 rounded-sm p-6">
                  <h3 className="font-serif text-xl mb-3 text-stone-900">Claim Intelligence Report — $299</h3>
                  <p className="text-sm text-stone-600 mb-4">A deeper review of one homepage, landing page, or sales page. Outcome: <span className="font-medium italic">Ship a buyer-safe page in 7 days.</span></p>
                  <ul className="space-y-2">{['5–7 claim and proof findings', 'Supported / overstated / unsupported labels', 'Evidence gaps', 'Safer framing recommendations', 'AI/search readability notes', 'Claim drift notes', '7-day fix list', 'AuditGPT Claim Review link'].map((item) => (<li key={item} className="flex items-start gap-2 text-sm text-stone-700"><CheckCircle2 className="h-3.5 w-3.5 text-stone-400 mt-0.5 flex-shrink-0" />{item}</li>))}</ul>
                </div>
                <div className="bg-white border border-stone-200 rounded-sm p-6">
                  <h3 className="font-serif text-xl mb-3 text-stone-900">Claim Drift Monitoring — $299/mo</h3>
                  <p className="text-sm text-stone-600 mb-4">A founder-led review across up to five buyer-facing surfaces. Outcome: <span className="font-medium italic">De-risk your claims before diligence.</span></p>
                  <ul className="space-y-2">{['Homepage or landing page', 'Pricing or plans page', 'About, proof, case study, or comparison page', 'Claim and evidence review', 'AI/search readability review', 'Reputation and proof surface review', 'Claim drift tracking', '30-day action plan'].map((item) => (<li key={item} className="flex items-start gap-2 text-sm text-stone-700"><CheckCircle2 className="h-3.5 w-3.5 text-stone-400 mt-0.5 flex-shrink-0" />{item}</li>))}</ul>
                  <p className="text-xs italic text-stone-400 mt-4">*During the founder-led launch period, five-surface audits are manually reviewed across up to five URLs.*</p>
                </div>
              </div>
            </div>
          </section>

          {/* Who It Is For */}
          <section className="px-4 sm:px-6 py-16 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">Who It Is For</div>
              <h2 className="font-serif text-2xl mb-6 text-stone-900">AuditGPT is built for businesses where claims matter.</h2>
              <ul className="space-y-3">{['AI and SaaS startups preparing for launch, fundraising, or category positioning', 'Agencies that need client-ready trust and claim reviews', 'Founder-led companies using AI tools to publish faster than they can verify', 'Med spas and wellness brands with high-trust buyer journeys', 'Local service businesses where weak proof and unclear follow-up lose demand'].map((item) => (<li key={item} className="flex items-start gap-3"><ArrowRight className="h-4 w-4 text-stone-400 mt-0.5 flex-shrink-0" /><span className="text-stone-700 text-sm">{item}</span></li>))}</ul>
              <div className="mt-8 bg-stone-50 border border-stone-200 p-5 rounded-sm">
                <h3 className="font-mono text-xs uppercase tracking-widest text-stone-500 mb-3">Micro Case: Series B AI SaaS</h3>
                <p className="text-sm text-stone-700 leading-relaxed mb-3"><span className="font-medium">Before:</span> Claim Health Score 52. AI engines recommended a direct competitor on 3 core queries. <span className="font-medium">What changed:</span> 11 rewrites, 9 new proof blocks, and 3 evidence citations added to the homepage. <span className="font-medium">After:</span> Claim Health Score 84. AI engines stopped recommending the competitor within 14 days.</p>
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Anonymized early user result</div>
              </div>
            </div>
          </section>

          {/* Scrutexity Next Step */}
          <section className="px-4 sm:px-6 py-16 bg-stone-900 text-white">
            <div className="max-w-3xl mx-auto">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">Scrutexity Next Step</div>
              <p className="text-lg text-stone-200 mb-6">AuditGPT does not stop at diagnosis. Depending on what the report finds, Scrutexity can help with:</p>
              <ul className="space-y-3">{['Governed claim rewrites', 'AI Answer Reality monitoring', 'Verification and trust assets', 'Revenue leakage insights', 'Agency white-label reporting', 'Manual review'].map((item) => (<li key={item} className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-stone-500 mt-0.5 flex-shrink-0" /><span className="text-stone-300 text-sm">{item}</span></li>))}</ul>
            </div>
          </section>

          {/* ── GOVERNED GROWTH / COMPLIANCE PANEL ──────────── */}
          <section className="px-4 sm:px-6 py-16 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-3">Governed Growth, Not Legal Advice</div>
              <h2 className="font-serif text-3xl mb-8 text-stone-900">How claim intelligence sits alongside compliance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-stone-200 p-6 rounded-sm">
                  <Lock className="h-6 w-6 text-stone-400 mb-4" />
                  <h3 className="font-serif text-lg mb-2 text-stone-900">Prevent Misrepresentation</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">AuditGPT catches claims that overstate capability, inflate results, or make unverifiable guarantees — before buyers or regulators do.</p>
                </div>
                <div className="border border-stone-200 p-6 rounded-sm">
                  <TrendingUp className="h-6 w-6 text-stone-400 mb-4" />
                  <h3 className="font-serif text-lg mb-2 text-stone-900">Reduce Diligence Friction</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">For startups raising rounds or preparing for exit: a pre-vetted claim inventory accelerates legal and technical due diligence by surfacing evidence gaps early.</p>
                </div>
                <div className="border border-stone-200 p-6 rounded-sm">
                  <ShieldCheck className="h-6 w-6 text-stone-400 mb-4" />
                  <h3 className="font-serif text-lg mb-2 text-stone-900">AI Guardrail Integration</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">AuditGPT findings can plug into existing LLM guardrail stacks, RAG content pipelines, and content review workflows — helping teams that ship with AI verify before they publish.</p>
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-6 rounded-sm">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-stone-500 leading-relaxed">
                    <p className="mb-2"><strong className="text-stone-700">For investors &amp; acquirers:</strong> We scan your target&rsquo;s public footprint and AI Answer Reality before you sign a term sheet. Surface unsupported claims, evidence gaps, and AI distortion patterns that could become liabilities post-acquisition.</p>
                    <p><strong className="text-stone-700">Audited X+ sites</strong> for claim drift and AI answer distortion across med spa, SaaS, fintech, and agency verticals since 2025. We eat our own dog food — see our <a href="/self-audit" className="underline text-stone-700 hover:text-stone-900">quarterly self-audit →</a></p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* ── FOUNDER CTA: SHIP IN 7 DAYS ──────────────────── */}
        <section className="px-4 sm:px-6 py-16 bg-stone-900 text-white border-t border-stone-700">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-4">Ship an AI-safe Homepage in 7 Days</div>
            <h2 className="font-serif text-3xl sm:text-4xl mb-6 text-white">A decisive move for high-growth brands</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="bg-stone-800 border border-stone-700 p-5 rounded-sm">
                <div className="text-2xl font-serif text-white mb-1">1</div>
                <div className="text-xs text-stone-400 mt-1">Submit URL</div>
                <p className="text-[11px] text-stone-500 mt-1">Give us a single buyer-facing page.</p>
              </div>
              <div className="bg-stone-800 border border-stone-700 p-5 rounded-sm">
                <div className="text-2xl font-serif text-white mb-1">2</div>
                <div className="text-xs text-stone-400 mt-1">Review Findings</div>
                <p className="text-[11px] text-stone-500 mt-1">Get your claim inventory with evidence gaps mapped.</p>
              </div>
              <div className="bg-stone-800 border border-stone-700 p-5 rounded-sm">
                <div className="text-2xl font-serif text-white mb-1">3</div>
                <div className="text-xs text-stone-400 mt-1">Apply Rewrites</div>
                <p className="text-[11px] text-stone-500 mt-1">Ship safer copy with our recommendations.</p>
              </div>
            </div>
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <a href="/snapshot" className="bg-white text-stone-900 px-8 py-4 rounded-sm text-sm font-medium hover:bg-stone-200 transition-colors flex items-center">Run Free Snapshot <ArrowRight className="h-4 w-4 ml-2" /></a>
              <a href="/pricing" className="text-stone-400 underline underline-offset-4 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest">Or: Join the Launch Cohort →</a>
            </div>
            <p className="text-[10px] font-mono text-stone-500 mt-6">Limited to 10 high-risk, high-growth brands. Includes founder-led onboarding.</p>
          </div>
        </section>

        {/* ── SELF-AUDIT BANNER ──────────────────────────────── */}
        <div className="px-4 sm:px-6 py-8 bg-white border-t border-stone-200">
          <div className="max-w-5xl mx-auto bg-stone-50 border border-stone-200 rounded-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1">We audit ourselves quarterly</div>
              <div className="font-serif text-xl text-stone-900">View AuditGPT&apos;s own Visibility &amp; Trust Review</div>
              <p className="text-xs text-stone-500 mt-1">See how we remediated our own claims. We eat our own dog food in public.</p>
            </div>
            <a href="/self-audit" className="text-xs font-mono uppercase tracking-wider border border-stone-900 px-5 py-2.5 rounded-sm hover:bg-stone-900 hover:text-white transition-colors flex-shrink-0">View Self-Audit →</a>
          </div>
        </div>
        <p className="text-xs text-stone-400 py-8 text-center max-w-3xl mx-auto px-4">Disclaimer: AuditGPT does not provide legal, clinical, regulatory, ranking, revenue, or compliance advice. It identifies visible gaps in claims, evidence, AI/search readability, and demand paths based on the surfaces reviewed.</p>
      </main>

      <footer className="border-t border-stone-200 bg-stone-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
          <span className="font-mono">AuditGPT by Scrutexity · Claim Intelligence for businesses where trust matters.</span>
          <div className="flex items-center gap-4">
            <a href="/promises" className="underline hover:text-white transition-colors">Promises &amp; Anti-Promises</a>
            <a href="/legal" className="underline hover:text-white transition-colors">Terms &amp; Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
