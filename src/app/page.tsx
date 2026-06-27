'use client';

// ============================================================
// AuditGPT — Homepage (Scrutexity v2)
// ============================================================
// Find what is unsupported, invisible, risky, or leaking.
// One intake form → /api/audit (starter type) → public report.
// The free snapshot has its own route at /snapshot.
// ============================================================

import { useState, useEffect } from 'react';
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
import { ArrowRight, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';

const COMPANY_TYPES = [
  'AI / SaaS',
  'Agency / consulting',
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
  'Our reputation surface is weak',
  'Not sure — show me what\'s leaking',
];

export default function Home() {
  const router = useRouter();
  const [inputType, setInputType] = useState<'website' | 'agent_transcript'>('website');
  const [website, setWebsite] = useState('');
  const [transcript, setTranscript] = useState('');
  const [name, setName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [worry, setWorry] = useState('');
  const [isAgency, setIsAgency] = useState(false);
  const [isMedical, setIsMedical] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get('url');
      if (urlParam) {
        setWebsite(urlParam);
        setInputType('website');
      }
    }
  }, []);

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
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </a>
          <nav className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <a href="/" className="hover:text-foreground hidden sm:inline-block">Platform</a>
            <a href="/ai-answer-reality" className="hover:text-foreground hidden sm:inline-block">AI Answer Reality</a>
            <a href="/ai-answer-reality/sample" className="hover:text-foreground">Sample Report</a>
            <a href="/pricing" className="hover:text-foreground">Pricing</a>
            <a href="/proof" className="hover:text-foreground hidden sm:inline-block">Proof</a>
            <a href="/agency" className="hover:text-foreground">Partners</a>
            <a href="/snapshot" className="text-accent hover:text-foreground font-bold">Run Claim Snapshot</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-black" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                AuditGPT by Scrutexity
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl leading-tight mb-4">
              AI made publishing cheap.<br/>Scrutexity makes growth governable.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2 font-medium">
              The claim intelligence platform for high-risk, high-growth brands.
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-8">
              AuditGPT scans public buyer-facing pages to find unsupported claims, evidence gaps, and AI Answer Reality risks before buyers repeat or distrust them.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm mb-6">
              <a href="/ai-answer-reality" className="btn-cta text-base px-8 py-4">
                Run an AI Answer Reality Scan <ArrowRight className="h-4 w-4 ml-2 inline" />
              </a>
              <a href="/ai-answer-reality/sample" className="px-8 py-4 text-base font-mono uppercase tracking-widest text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-sm transition-colors flex items-center justify-center shadow-sm">
                View Sample Claim Audit
              </a>
            </div>
            <p className="text-sm font-medium">
              Your snapshot begins generating immediately.
            </p>
            <div className="mt-4 p-4 bg-stone-50 border border-stone-200 inline-block rounded-lg shadow-sm">
              <p className="text-xs text-stone-600 font-mono uppercase tracking-widest mb-1">Are you an agency?</p>
              <a href="/agency" className="text-sm font-medium text-stone-900 underline hover:text-stone-700">White-label our engine for your clients →</a>
            </div>
          </div>

          {/* Choose Your Path */}
          <div className="mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <a href="#intake" onClick={() => { setIsMedical(true); setIsAgency(false); setCompanyType('Med spa / wellness'); }} className="block p-6 border border-border bg-white hover:bg-stone-50 transition-colors rounded-sm">
              <div className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">Path 1</div>
              <div className="font-medium">I'm a med spa / wellness brand</div>
            </a>
            <a href="/agency" className="block p-6 border border-border bg-white hover:bg-stone-50 transition-colors rounded-sm">
              <div className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">Path 2</div>
              <div className="font-medium">I'm an agency</div>
            </a>
            <a href="#intake" onClick={() => { setIsMedical(false); setIsAgency(false); setCompanyType('AI / SaaS'); }} className="block p-6 border border-border bg-white hover:bg-stone-50 transition-colors rounded-sm">
              <div className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">Path 3</div>
              <div className="font-medium">I'm a SaaS / AI startup</div>
            </a>
            <a href="#intake" onClick={() => { setIsMedical(false); setIsAgency(false); setCompanyType('Other'); }} className="block p-6 border border-border bg-white hover:bg-stone-50 transition-colors rounded-sm">
              <div className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-2">Path 4</div>
              <div className="font-medium">I'm evaluating a company / deal</div>
            </a>
          </div>

          {/* What You Get Visual Cards */}
          <div className="mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-border bg-white rounded-sm p-6 flex flex-col gap-4">
              <div className="h-24 bg-stone-100 flex items-center justify-center rounded-sm text-3xl font-serif text-stone-400">82/100</div>
              <div className="text-sm font-medium text-center">Claim Health Score</div>
            </div>
            <div className="border border-border bg-white rounded-sm p-6 flex flex-col gap-4">
              <div className="h-24 bg-stone-100 flex flex-col items-center justify-center rounded-sm gap-2">
                <div className="h-2 w-3/4 bg-red-200 rounded-full"></div>
                <div className="h-2 w-1/2 bg-amber-200 rounded-full"></div>
              </div>
              <div className="text-sm font-medium text-center">Unsupported Claim Table</div>
            </div>
            <div className="border border-border bg-white rounded-sm p-6 flex flex-col gap-4">
              <div className="h-24 bg-stone-100 flex items-center justify-center rounded-sm">
                <ShieldCheck className="h-8 w-8 text-stone-400" />
              </div>
              <div className="text-sm font-medium text-center">AI Answer Reality Snapshot</div>
            </div>
            <div className="border border-border bg-white rounded-sm p-6 flex flex-col gap-4">
              <div className="h-24 bg-stone-100 flex flex-col items-center justify-center rounded-sm gap-2 px-4">
                <div className="h-2 w-full bg-stone-200 rounded-full"></div>
                <div className="h-2 w-3/4 bg-green-200 rounded-full"></div>
              </div>
              <div className="text-sm font-medium text-center">Safer Rewrite Recommendations</div>
            </div>
          </div>

          {/* Interactive Sample Report Embed */}
          <div className="mb-20 max-w-5xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-widest text-center text-muted-foreground mb-4">
              Explore a live Claim Intelligence Report
            </div>
            <div className="bg-white border border-border shadow-xl rounded-md overflow-hidden h-[600px] w-full relative">
              <div className="bg-neutral-50 border-b border-border p-3 flex items-center gap-3 absolute top-0 w-full z-10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-mono text-muted-foreground">scrutexity-interactive-sample.pdf</div>
              </div>
              <iframe 
                src="/ai-answer-reality/sample" 
                className="w-full h-full pt-[44px] border-none"
                title="Interactive Sample Report"
              />
            </div>
          </div>

          {/* Founder Testimonial */}
          <div className="mb-8 flex items-center justify-center gap-4 text-center">
            <div className="h-10 w-10 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f3f4f6" alt="Founder avatar" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <div className="text-left">
              <p className="text-sm font-serif italic text-foreground/90">&ldquo;We built AuditGPT after watching too many startups lose deals because AI wrote claims their product couldn't actually prove.&rdquo;</p>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">Founder, Scrutexity</p>
            </div>
          </div>

          {/* Intake Form */}
          <div id="intake" className="bg-white border border-border shadow-md rounded-sm p-6 sm:p-8 mb-16">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Single-Page Starter Audit ($99)</span>
              <span className="text-muted-foreground/40 mx-2">·</span>
              <a href="/snapshot" className="underline underline-offset-4">
                Or: Free claim snapshot ($0) →
              </a>
            </div>

            <div className="flex gap-6 mb-5 border-b border-border pb-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                <input 
                  type="radio" 
                  checked={inputType === 'website'} 
                  onChange={() => setInputType('website')} 
                  className="accent-black w-4 h-4" 
                />
                Website Audit
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                <input 
                  type="radio" 
                  checked={inputType === 'agent_transcript'} 
                  onChange={() => setInputType('agent_transcript')} 
                  className="accent-black w-4 h-4" 
                />
                Agent Guardrail Audit
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {inputType === 'website' ? (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    Website URL *
                  </label>
                  <Input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="yourcompany.com"
                    className="!text-base !rounded-sm !border-black"
                  />
                </div>
              ) : (
                <div className="col-span-1 sm:col-span-2 mb-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    Agent Transcript *
                  </label>
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Paste chatbot or support agent transcript here..."
                    className="!text-base !rounded-sm !border-black min-h-[120px]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Company name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Inc."
                  className="!text-base !rounded-sm !border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Company type
                </label>
                <Select value={companyType} onValueChange={setCompanyType}>
                  <SelectTrigger className="!rounded-sm !border-black !h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Primary worry
                </label>
                <Select value={worry} onValueChange={setWorry}>
                  <SelectTrigger className="!rounded-sm !border-black !h-10">
                    <SelectValue placeholder="What concerns you most?" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIMARY_WORRIES.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-foreground/80">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={isAgency}
                  onCheckedChange={(c) => setIsAgency(c === true)}
                />
                I'm an agency auditing a client
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={isMedical}
                  onCheckedChange={(c) => setIsMedical(c === true)}
                />
                Medical / wellness business
              </label>
            </div>

            <button
              onClick={() => {
                if (!valid) {
                  toast.error(inputType === 'website' ? "Please enter a valid Website URL." : "Please enter a valid transcript (min 10 chars).");
                  return;
                }
                run();
              }}
              disabled={loading}
              className="btn-cta w-full py-4 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin inline" /> RUNNING AUDIT...
                </>
              ) : (
                <>
                  GET MY 1-PAGE SNAPSHOT <ArrowRight className="h-5 w-5 ml-2 inline" />
                </>
              )}
            </button>
          </div>

          {/* Content Sections */}

          <div className="space-y-20">
            
            {/* How it Works */}
            <section className="bg-neutral-50 border border-border p-8 rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-center text-muted-foreground mb-6">How it Works</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif text-xl mx-auto mb-4">1</div>
                  <h3 className="font-serif text-lg mb-2">Paste your URL</h3>
                  <p className="text-sm text-muted-foreground">Give us a single buyer-facing page where you make your biggest claims.</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif text-xl mx-auto mb-4">2</div>
                  <h3 className="font-serif text-lg mb-2">AI Extraction</h3>
                  <p className="text-sm text-muted-foreground">Our specialized claim-detection system extracts every factual promise on the page.</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif text-xl mx-auto mb-4">3</div>
                  <h3 className="font-serif text-lg mb-2">Get the Report</h3>
                  <p className="text-sm text-muted-foreground">Your snapshot begins generating immediately, showing which claims are fully supported and which are dangerously naked.</p>
                </div>
              </div>
            </section>

            {/* Methodology Box */}
            <section>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">The AuditGPT Methodology</div>
              <h2 className="font-serif text-2xl mb-6">How we label your claims</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-green-200 bg-green-50/30 p-4 rounded-sm">
                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-green-50 text-green-900 border border-green-200 mb-2">Supported</span>
                  <p className="text-sm text-foreground/80 leading-relaxed">The claim is specific, measurable, and has visible proof (a link, case study, or data) directly adjacent to it.</p>
                </div>
                <div className="border border-blue-200 bg-blue-50/30 p-4 rounded-sm">
                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-blue-50 text-blue-900 border border-blue-200 mb-2">Weakly Supported</span>
                  <p className="text-sm text-foreground/80 leading-relaxed">There is some proof, but it's vague, buried on another page, or requires the buyer to connect the dots.</p>
                </div>
                <div className="border border-amber-200 bg-amber-50/30 p-4 rounded-sm">
                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-50 text-amber-900 border border-amber-200 mb-2">Overstated</span>
                  <p className="text-sm text-foreground/80 leading-relaxed">The business likely does this, but the language used ("#1 globally", "instant") stretches beyond what the evidence proves.</p>
                </div>
                <div className="border border-red-200 bg-red-50/30 p-4 rounded-sm">
                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-red-50 text-red-900 border border-red-200 mb-2">Unsupported</span>
                  <p className="text-sm text-foreground/80 leading-relaxed">A naked claim. No data, no customer quotes, no screenshots, and no links. Highly likely to be ignored by buyers and AI search.</p>
                </div>
              </div>
            </section>

            <section>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Why AuditGPT Exists</div>
              <p className="text-lg text-foreground/90 leading-relaxed mb-4">
                AI made it easy to publish confident websites, landing pages, comparison pages, sales copy, and product claims in minutes.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed mb-4">
                But faster publishing created a new problem: your business may now be saying more than it can clearly prove.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                AuditGPT reviews buyer-facing pages and identifies which claims are supported, which need evidence, which are overstated, and which should be rewritten before buyers, investors, partners, or AI search systems repeat them.
              </p>
            </section>

            <section>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">What the Free Snapshot Checks</div>
              <h2 className="font-serif text-2xl mb-4">The free snapshot focuses on one thing: <strong>Can this page prove what it claims?</strong></h2>
              <ul className="list-disc pl-5 space-y-2 text-foreground/80 mb-4">
                <li>One claim that needs stronger proof</li>
                <li>One missing or weak evidence signal</li>
                <li>One safer rewrite or recommended fix</li>
                <li>One next step inside the Scrutexity system</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                This is not a legal review, compliance certification, SEO audit, or ranking report. It is a claim intelligence snapshot.
              </p>
            </section>

            <section>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">What Paid Audits Add</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-xl mb-3">Single-Page Starter Audit</h3>
                  <p className="text-sm text-foreground/80 mb-3">A deeper review of one homepage, landing page, or sales page.</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
                    <li>5–7 claim and proof findings</li>
                    <li>Supported / weakly supported / needs evidence / overstated / unsupported labels</li>
                    <li>Evidence gaps</li>
                    <li>Safer framing recommendations</li>
                    <li>AI/search readability notes where relevant</li>
                    <li>Demand leakage notes where relevant</li>
                    <li>7-day fix list</li>
                    <li>AuditGPT Report Review link</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-3">Five-Surface Visibility & Trust Audit</h3>
                  <p className="text-sm text-foreground/80 mb-3">A founder-led review across up to five buyer-facing surfaces.</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
                    <li>Homepage or landing page</li>
                    <li>Pricing or plans page</li>
                    <li>About, proof, case study, or comparison page</li>
                    <li>Security, trust, FAQ, or service page when available</li>
                    <li>Claim and evidence review</li>
                    <li>AI/search readability review</li>
                    <li>Reputation and proof surface review</li>
                    <li>Demand leakage review</li>
                    <li>30-day action plan</li>
                  </ul>
                  <p className="text-xs italic text-muted-foreground">
                    *During the founder-led launch period, five-surface audits are manually reviewed across up to five URLs.*
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Who It Is For</div>
              <h2 className="font-serif text-2xl mb-4">AuditGPT is built for businesses where claims matter.</h2>
              <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                <li>AI and SaaS startups preparing for launch, fundraising, or category positioning</li>
                <li>Agencies that need client-ready trust and claim reviews</li>
                <li>Founder-led companies using AI tools to publish faster than they can verify</li>
                <li>Med spas and wellness brands with high-trust buyer journeys</li>
                <li>Local service businesses where weak proof and unclear follow-up lose demand</li>
              </ul>
            </section>

            <section>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">What AuditGPT Looks For</div>
              <p className="text-foreground/90 mb-4">AuditGPT starts with claims. Then it checks the surrounding trust system:</p>
              <ul className="list-disc pl-5 space-y-2 text-foreground/80 mb-4">
                <li>Is the claim specific?</li>
                <li>Is there proof nearby?</li>
                <li>Is the evidence visible to buyers?</li>
                <li>Would an AI/search system understand what the business does?</li>
                <li>Does the page give the buyer a clear next step?</li>
                <li>Are there proof, reputation, or demand gaps that should be fixed?</li>
              </ul>
              <p className="text-foreground/90">The claim is the starting point. The surrounding gaps explain why it matters.</p>
            </section>

            <section>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Scrutexity Next Step</div>
              <p className="text-foreground/90 mb-4">AuditGPT does not stop at diagnosis. Depending on what the report finds, Scrutexity can help with:</p>
              <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                <li>Governed claim rewrites</li>
                <li>AI Answer Reality monitoring</li>
                <li>Verification and trust assets</li>
                <li>Revenue leakage insights</li>
                <li>Agency white-label reporting</li>
                <li>Manual review</li>
              </ul>
            </section>
          </div>

          {/* Self-audit slot */}
          <div className="mt-16 bg-neutral-50 border border-border rounded-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                We audit ourselves quarterly
              </div>
              <div className="font-serif text-xl">View AuditGPT&apos;s own Visibility &amp; Trust Review</div>
              <p className="text-xs text-muted-foreground mt-1">
                See how we remediated our own claims to achieve a perfect baseline. We eat our own dog food in public.
              </p>
            </div>
            <a
              href="/self-audit"
              className="text-xs font-mono uppercase tracking-wider border border-foreground px-4 py-2 rounded-sm hover:bg-foreground hover:text-background transition-colors"
            >
              View Self-Audit →
            </a>
          </div>

          <p className="text-xs text-muted-foreground mt-16 text-center max-w-3xl mx-auto">
            Disclaimer: AuditGPT does not provide legal, clinical, regulatory, ranking, revenue, or compliance advice. It identifies visible gaps in claims, evidence, AI/search readability, and demand paths based on the surfaces reviewed.
          </p>

        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>AuditGPT by Scrutexity · Claim Intelligence for businesses where trust matters.</span>
          <div className="flex items-center gap-4">
            <a href="/promises" className="underline hover:text-foreground">
              Promises &amp; Anti-Promises
            </a>
            <a href="/legal" className="underline hover:text-foreground">
              Terms &amp; Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
