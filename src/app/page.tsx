'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Logo } from '@/components/logo';
import { VerificationBadge, canVerifyAudit } from '@/components/verification-badge';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Wrench,
  Users,
  ListChecks,
  RefreshCw,
  ExternalLink,
  Lightbulb,
  FileText,
  Calendar,
  MessageSquare,
  Send,
  Loader2,
  Lock,
  Bot,
  Plus,
  Zap,
} from 'lucide-react';

// ============= TYPES (match the new AuditGPT spec) =============
interface Benchmark {
  metric: string;
  this_business: string;
  industry_avg: string;
}

interface SlopMarkers {
  detected: boolean;
  probability: number;
  signals: string[];
  rebuild_recommended: boolean;
}

interface CompetitorAnalysis {
  summary: string;
  vs_makerpad: string;
  vs_cofounder: string;
  vs_polsia: string;
  vs_nanocorp: string;
  differentiation_angles: string[];
}

interface AuditResult {
  verdict: string; // "A+", "A", "B", "C", "D", "F"
  score?: number; // 0-100 integer — primary source of truth
  verdict_header: string; // "Company Name - Category-Based Judgment (Score/100)"
  grade_stamp: string;
  company_info: string;
  company_name?: string; // clean company name, no hyphens/score
  report_card: string[];
  red_flags: string[];
  assumptions_to_test: string[];
  website_fixes: string[];
  services_to_hire: string[];
  action_plan: string[];
  industry_benchmarks_table: Benchmark[];
  slop_markers?: SlopMarkers;
  competitor_analysis?: CompetitorAnalysis;
  audited_by?: string;
  publicId?: string | null; // 10-char slug for the public shareable URL
}

type Step = 'landing' | 'q1' | 'q2' | 'loading' | 'result' | 'error';

// ============= HELPERS =============
function gradeColorClass(g: string): string {
  if (g.startsWith('A')) return 'grade-a';
  if (g.startsWith('B')) return 'grade-b';
  if (g.startsWith('C')) return 'grade-c';
  if (g.startsWith('D')) return 'grade-d';
  return 'grade-f';
}
function gradeBgClass(g: string): string {
  if (g.startsWith('A')) return 'grade-bg-a';
  if (g.startsWith('B')) return 'grade-bg-b';
  if (g.startsWith('C')) return 'grade-bg-c';
  if (g.startsWith('D')) return 'grade-bg-d';
  return 'grade-bg-f';
}

// Extract score: prefer the dedicated `score` integer field. Fall back to
// parsing the verdict_header for back-compat with older audits.
function extractScore(audit: { score?: number; verdict_header?: string }): string | null {
  if (typeof audit.score === 'number' && !isNaN(audit.score)) {
    return String(audit.score);
  }
  const m = audit.verdict_header?.match(/\((\d{1,3})\/100\)/);
  return m ? m[1] : null;
}

// Extract company name: prefer the dedicated `company_name` field. Fall back
// to splitting verdict_header on " — " (em-dash, not hyphen) so hyphenated
// company names like "Coca-Cola" don't break.
function extractCompanyName(audit: { company_name?: string; verdict_header?: string }): string {
  if (audit.company_name && audit.company_name !== 'insufficient data') {
    return audit.company_name;
  }
  const header = audit.verdict_header || '';
  // Split on em-dash first (the prompt uses " - " with regular hyphens, but
  // some LLMs return em-dashes). Try em-dash, then " - " (space-hyphen-space).
  const emIdx = header.indexOf(' — ');
  if (emIdx > 0) return header.slice(0, emIdx).trim();
  const hyphIdx = header.indexOf(' - ');
  if (hyphIdx > 0) return header.slice(0, hyphIdx).trim();
  return header;
}

// Extract the judgment line from verdict_header (everything after the dash separator).
function extractJudgment(header: string): string {
  const emIdx = header.indexOf(' — ');
  if (emIdx > 0) return header.slice(emIdx + 3).trim();
  const hyphIdx = header.indexOf(' - ');
  if (hyphIdx > 0) return header.slice(hyphIdx + 3).trim();
  return '';
}

// ============= LANDING =============
function Landing({
  onPick,
}: {
  onPick: (path: 'new' | 'grow') => void;
}) {
  return (
    <div className="fade-up min-h-[80vh] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Logo variant="full" height={48} priority />
        </div>
        <h1 className="font-serif display text-5xl sm:text-6xl text-center mb-16">
          Let&apos;s get started.
        </h1>

        <div className="space-y-4">
          <button onClick={() => onPick('new')} className="btn-cta">
            CREATE A NEW COMPANY
          </button>
          <p className="text-center font-serif italic text-muted-foreground text-sm -mt-2 mb-8">
            Start from scratch
          </p>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button onClick={() => onPick('grow')} className="btn-cta">
            GROW MY COMPANY
          </button>
          <p className="text-center font-serif italic text-muted-foreground text-sm -mt-2">
            Already have a business
          </p>
        </div>

        <div className="mt-12 text-center space-y-2">
          <div>
            <a
              href="/compare"
              className="text-xs font-mono uppercase tracking-widest text-foreground hover:opacity-70 underline underline-offset-4"
            >
              Compare us to Polsia, NanoCorp & others →
            </a>
          </div>
          <div>
            <a
              href="/slop"
              className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Or: run the AI-slop detector on any URL
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= QUESTION STEP WRAPPER =============
function QuestionStep({
  stepNumber,
  total,
  onBack,
  children,
}: {
  stepNumber: number;
  total: number;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fade-up min-h-[80vh] flex flex-col">
      <div className="px-6 pt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Step {stepNumber} of {total}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ============= Q1 =============
function Q1({
  path,
  value,
  onChange,
  onSubmit,
  onBack,
}: {
  path: 'new' | 'grow';
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const isGrow = path === 'grow';
  const valid = isGrow ? value.trim().length >= 3 : value.trim().length >= 20;

  return (
    <QuestionStep stepNumber={1} total={2} onBack={onBack}>
      <h2 className="font-serif display text-3xl sm:text-4xl mb-8">
        {isGrow ? "What's your company's website?" : 'What are you building?'}
      </h2>

      {isGrow ? (
        <Input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && valid && onSubmit()}
          placeholder="yourcompany.com"
          className="input-polsia !text-base !rounded-sm !border-black"
          style={{ height: 'auto' }}
        />
      ) : (
        <Textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your business idea in 1-2 sentences. e.g. 'A subscription service that delivers fresh coffee beans to offices weekly.'"
          className="input-polsia !text-base !rounded-sm !border-black min-h-[120px] resize-none"
        />
      )}

      <div className="mt-6">
        <button onClick={onSubmit} disabled={!valid} className="btn-polsia">
          CONTINUE <ArrowRight className="h-4 w-4 ml-2 inline" />
        </button>
      </div>
    </QuestionStep>
  );
}

// ============= Q2 =============
const INDUSTRIES = [
  'SaaS / Software',
  'E-commerce / Retail',
  'Marketplace',
  'Services / Consulting / Agency',
  'Healthcare / Med Spa',
  'Finance / Fintech',
  'Education',
  'Media / Content / Creator Economy',
  'Real Estate',
  'Food & Beverage',
  'Indie Games / Playtesting',
  'Other / Not sure',
];

function Q2({
  value,
  onChange,
  notes,
  onNotesChange,
  onSubmit,
  onBack,
}: {
  value: string;
  onChange: (v: string) => void;
  notes: string;
  onNotesChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <QuestionStep stepNumber={2} total={2} onBack={onBack}>
      <h2 className="font-serif display text-3xl sm:text-4xl mb-8">
        What industry are you in?
      </h2>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="input-polsia !text-base !rounded-sm !border-black !h-12" autoFocus>
          <SelectValue placeholder="Select an industry" />
        </SelectTrigger>
        <SelectContent>
          {INDUSTRIES.map((ind) => (
            <SelectItem key={ind} value={ind}>
              {ind}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-6">
        <label className="block text-sm text-muted-foreground mb-2">
          Anything specific you want the audit to focus on?{' '}
          <span className="text-muted-foreground/60">(optional)</span>
        </label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="e.g. 'Pricing feels too low' or 'Considering a pivot to B2B'"
          className="input-polsia !text-base !rounded-sm !border-black min-h-[80px] resize-none"
        />
      </div>

      <div className="mt-6">
        <button onClick={onSubmit} disabled={!value} className="btn-polsia">
          START AUDIT <Sparkles className="h-4 w-4 ml-2 inline" />
        </button>
      </div>
    </QuestionStep>
  );
}

// ============= LOADING =============
const SCRAPE_STEPS = [
  'Scraping website...',
  'Extracting copy and pricing...',
  'Comparing against industry benchmarks...',
  'Auditing conversion path...',
  'Checking competitor positioning...',
  'Grading findings...',
  'Compiling report...',
];

function Loading({ website }: { website: string }) {
  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, SCRAPE_STEPS.length - 1));
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fade-up min-h-[80vh] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 border border-black rounded-sm mb-8">
          <RefreshCw className="h-5 w-5 animate-spin" />
        </div>
        <p className="font-serif text-2xl mb-2">Auditing {website}</p>
        <p className="text-sm text-muted-foreground mb-8">{SCRAPE_STEPS[stepIdx]}</p>
        <div className="w-full flex gap-1">
          {SCRAPE_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-all ${
                i <= stepIdx ? 'bg-black' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============= VERDICT HEADER =============
function VerdictHeader({ result }: { result: AuditResult }) {
  const g = result.grade_stamp || result.verdict;
  const score = extractScore(result);
  const companyName = extractCompanyName(result);
  const judgment = extractJudgment(result.verdict_header);

  return (
    <div className="card-polsia p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <div className="flex-shrink-0">
          <div
            className={`font-serif font-bold text-7xl sm:text-8xl leading-none ${gradeColorClass(g)} ${gradeBgClass(g)} px-4 py-2 inline-block`}
            style={{ borderRadius: '0.25rem' }}
          >
            {g}
          </div>
          {score && (
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 text-center">
              {score}/100
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              DUE-DILIGENCE REPORT
            </div>
            {result.audited_by && (
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
                Audited by {result.audited_by}
              </div>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl mb-1 leading-tight">{companyName}</h1>
          {judgment && (
            <p className="font-serif text-lg text-muted-foreground italic mb-3">{judgment}</p>
          )}
          {result.company_info && (
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">{result.company_info}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============= GENERIC SECTION CARD =============
function SectionCard({
  icon: Icon,
  title,
  count,
  items,
  numbered = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: number;
  items: string[];
  numbered?: boolean;
}) {
  return (
    <div className="card-polsia p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4" />
        <h3 className="font-serif text-lg">{title}</h3>
        {count !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground">{count}</span>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No findings.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="border-b border-border last:border-0 pb-3 last:pb-0 flex gap-3">
              {numbered && (
                <div className="flex-shrink-0 h-5 w-5 rounded-sm bg-black text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </div>
              )}
              <p className="text-sm text-foreground/85 leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============= BENCHMARKS TABLE =============
function BenchmarksCard({ benchmarks }: { benchmarks: Benchmark[] }) {
  if (!benchmarks.length) return null;
  return (
    <div className="card-polsia p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4" />
        <h3 className="font-serif text-lg">Industry benchmarks</h3>
      </div>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left font-normal px-5 py-2">Metric</th>
              <th className="text-left font-normal px-3 py-2">This business</th>
              <th className="text-left font-normal px-5 py-2">Industry average</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((b, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="px-5 py-2.5 font-medium">{b.metric}</td>
                <td className="px-3 py-2.5 text-foreground/80">
                  {b.this_business || 'insufficient data'}
                </td>
                <td className="px-5 py-2.5 text-muted-foreground">{b.industry_avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============= LANDING PAGE + STRATEGY + AGENT TYPES =============
interface LandingPageSection {
  title: string;
  body: string;
}
interface LandingPageResult {
  headline: string;
  subheadline: string;
  sections: LandingPageSection[];
  cta_text: string;
  social_proof_line: string;
}
interface StrategyWeek {
  week: number;
  action: string;
  metric: string;
  expected_outcome: string;
}
interface StrategyResult {
  overall_objective: string;
  weeks: StrategyWeek[];
}
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type TabKey = 'audit' | 'competitors' | 'landing' | 'rebuild' | 'strategy' | 'agent' | 'agents';

// ============= AUDIT TAB =============
function AuditTab({ audit, onRebuild }: { audit: AuditResult; onRebuild: () => void }) {
  const slop = audit.slop_markers;
  const showSlopBanner = slop?.detected && slop?.rebuild_recommended;
  return (
    <div className="fade-up">
      {/* Slop detection banner */}
      {showSlopBanner && (
        <div className="mb-6 card-polsia p-5 border-l-4 border-l-black bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-sm bg-black text-white text-sm font-bold flex items-center justify-center font-mono">
              {slop?.probability ?? 0}%
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                AI-SLOP DETECTION
              </div>
              <h3 className="font-serif text-xl mb-1">This site shows AI-generated slop markers</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {slop?.signals?.length || 0} signal(s) detected. Probability this site was AI-generated: {slop?.probability ?? 0}%.
              </p>
              {slop?.signals && slop.signals.length > 0 && (
                <ul className="text-xs text-foreground/80 space-y-1 mb-4 ml-4 list-disc">
                  {slop.signals.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
              <button
                onClick={onRebuild}
                className="btn-polsia"
                style={{ width: 'auto', padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Wrench className="h-4 w-4" /> REBUILD THIS SITE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verdict header */}
      <div className="mb-6">
        <VerdictHeader result={audit} />
      </div>

      {/* Row 1: Report card (facts) + Red flags + Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <SectionCard
          icon={ListChecks}
          title="Report card"
          count={audit.report_card.length}
          items={audit.report_card}
        />
        <SectionCard
          icon={AlertTriangle}
          title="Red flags"
          count={audit.red_flags.length}
          items={audit.red_flags}
        />
        <SectionCard
          icon={Lightbulb}
          title="Assumptions to test"
          count={audit.assumptions_to_test.length}
          items={audit.assumptions_to_test}
        />
      </div>

      {/* Row 2: Website fixes + Services + Action plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <SectionCard
          icon={Wrench}
          title="Website fixes"
          count={audit.website_fixes.length}
          items={audit.website_fixes}
        />
        <SectionCard
          icon={Users}
          title="Services to hire"
          count={audit.services_to_hire.length}
          items={audit.services_to_hire}
        />
        <SectionCard
          icon={ListChecks}
          title="Action plan"
          count={audit.action_plan.length}
          items={audit.action_plan}
          numbered
        />
      </div>

      {/* Benchmarks table full-width */}
      <BenchmarksCard benchmarks={audit.industry_benchmarks_table} />

      {/* Footer note */}
      <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground text-center no-print">
        Audit generated from scraped website content + founder input. Every sentence should contain a verifiable fact. Cross-reference critical findings with your own data before acting.
      </div>
    </div>
  );
}

// ============= COMPETITORS TAB =============
function CompetitorsTab({ audit }: { audit: AuditResult }) {
  const c = audit.competitor_analysis;
  if (!c) {
    return (
      <div className="card-polsia p-6 fade-up text-center">
        <p className="text-sm text-muted-foreground">
          No competitor analysis available for this audit.
        </p>
      </div>
    );
  }

  const competitors: { key: string; label: string; body: string }[] = [
    { key: 'vs_makerpad', label: 'vs MakerPad', body: c.vs_makerpad },
    { key: 'vs_cofounder', label: 'vs Cofounder.co', body: c.vs_cofounder },
    { key: 'vs_polsia', label: 'vs Polsia', body: c.vs_polsia },
    { key: 'vs_nanocorp', label: 'vs NanoCorp', body: c.vs_nanocorp },
  ];

  return (
    <div className="fade-up space-y-4">
      {/* Summary banner */}
      <div className="card-polsia p-6 border-l-4 border-l-black">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Competitor landscape
        </div>
        <p className="font-serif text-xl leading-snug">{c.summary}</p>
      </div>

      {/* Side-by-side comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {competitors.map((comp) => (
          <div key={comp.key} className="card-polsia p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-sm bg-muted border border-border flex items-center justify-center font-mono text-xs font-bold">
                {comp.label.split(' ')[1]?.[0] || '?'}
              </div>
              <h3 className="font-serif text-lg">{comp.label}</h3>
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed">{comp.body}</p>
          </div>
        ))}
      </div>

      {/* Differentiation angles */}
      <div className="card-polsia p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4" />
          <h3 className="font-serif text-lg">AuditGPT differentiation angles</h3>
        </div>
        <ul className="space-y-3">
          {c.differentiation_angles.map((angle, i) => (
            <li
              key={i}
              className="flex gap-3 border-b border-border last:border-0 pb-3 last:pb-0"
            >
              <div className="flex-shrink-0 h-5 w-5 rounded-sm bg-black text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">{angle}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============= LOADING CARD (for tabs that fetch) =============
function TabLoadingCard({ label }: { label: string }) {
  return (
    <div className="card-polsia p-12 fade-up flex flex-col items-center justify-center text-center">
      <Loader2 className="h-6 w-6 animate-spin mb-3" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// ============= LANDING PAGE TAB =============
function LandingPageTab({
  audit,
  focusNotes,
}: {
  audit: AuditResult;
  focusNotes: string;
}) {
  const [data, setData] = useState<LandingPageResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const generate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/landing-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audit, focusNotes }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Generation failed.');
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to generate landing page.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    generate();
    return () => {
      cancelled = true;
    };
  }, [audit, focusNotes]);

  if (loading) return <TabLoadingCard label="Generating landing page from audit data..." />;
  if (error) {
    return (
      <div className="card-polsia p-6 fade-up">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <p className="font-mono text-xs uppercase tracking-wider">Generation failed</p>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button
          onClick={() => {
            setData(null);
            setLoading(true);
            // re-trigger effect by toggling state - simpler: reload via key prop in parent
            window.location.reload();
          }}
          variant="outline"
          size="sm"
          className="rounded-sm font-mono uppercase text-xs"
        >
          Retry
        </Button>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="fade-up space-y-4">
      {/* Landing page preview */}
      <div className="card-polsia p-8 sm:p-12">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Landing page preview
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl mb-4 leading-tight">{data.headline}</h1>
        <p className="text-lg text-foreground/80 mb-8 leading-relaxed">{data.subheadline}</p>

        {data.sections.map((s, i) => (
          <div key={i} className="mb-6 pb-6 border-b border-border last:border-0">
            <h3 className="font-serif text-xl mb-2">{s.title}</h3>
            <p className="text-sm text-foreground/85 leading-relaxed">{s.body}</p>
          </div>
        ))}

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <button className="btn-cta" style={{ width: 'auto', padding: '0.875rem 2rem' }}>
            {data.cta_text}
          </button>
          {data.social_proof_line && data.social_proof_line !== 'insufficient data' && (
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              {data.social_proof_line}
            </span>
          )}
        </div>
      </div>

      {/* Raw JSON for developers */}
      <div className="card-polsia p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4" />
          <h3 className="font-serif text-lg">Raw JSON</h3>
        </div>
        <pre className="text-xs font-mono bg-muted/40 p-4 rounded-sm overflow-x-auto max-h-96">
{JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ============= REBUILD TAB =============
interface RebuildResult {
  headline: string;
  subheadline: string;
  sections: { title: string; body: string }[];
  cta_text: string;
  social_proof_line: string;
  rebuild_notes: string[];
}

function RebuildTab({
  audit,
  focusNotes,
  autoTrigger,
}: {
  audit: AuditResult;
  focusNotes: string;
  autoTrigger: boolean;
}) {
  const [data, setData] = useState<RebuildResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const triggeredRef = useRef(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch('/api/rebuild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit, focusNotes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Rebuild failed.');
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Failed to rebuild landing page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoTrigger && !triggeredRef.current) {
      triggeredRef.current = true;
      generate();
    }
  }, [autoTrigger]);

  if (loading) return <TabLoadingCard label="Rebuilding landing page from scratch — removing slop..." />;
  if (error) {
    return (
      <div className="card-polsia p-6 fade-up">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <p className="font-mono text-xs uppercase tracking-wider">Rebuild failed</p>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={generate} variant="outline" size="sm" className="rounded-sm font-mono uppercase text-xs">
          Retry rebuild
        </Button>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="card-polsia p-8 fade-up text-center">
        <Wrench className="h-8 w-8 mx-auto mb-4" />
        <h3 className="font-serif text-xl mb-2">Rebuild this site from scratch</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Takes the original slop and rebuilds a fact-backed landing page using only verifiable data. No replicated phrasing.
        </p>
        <button onClick={generate} className="btn-polsia" style={{ width: 'auto', padding: '0.875rem 2rem', display: 'inline-flex' }}>
          <Wrench className="h-4 w-4 mr-2" /> REBUILD NOW
        </button>
      </div>
    );
  }

  return (
    <div className="fade-up space-y-4">
      {/* Rebuilt landing page preview */}
      <div className="card-polsia p-8 sm:p-12">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Rebuilt landing page · anti-slop
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl mb-4 leading-tight">{data.headline}</h1>
        <p className="text-lg text-foreground/80 mb-8 leading-relaxed">{data.subheadline}</p>

        {data.sections.map((s, i) => (
          <div key={i} className="mb-6 pb-6 border-b border-border last:border-0">
            <h3 className="font-serif text-xl mb-2">{s.title}</h3>
            <p className="text-sm text-foreground/85 leading-relaxed">{s.body}</p>
          </div>
        ))}

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <button className="btn-cta" style={{ width: 'auto', padding: '0.875rem 2rem' }}>
            {data.cta_text}
          </button>
          {data.social_proof_line && data.social_proof_line !== 'insufficient data' && (
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              {data.social_proof_line}
            </span>
          )}
        </div>
      </div>

      {/* Rebuild notes */}
      <div className="card-polsia p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <h3 className="font-serif text-lg">What was removed vs the original slop</h3>
        </div>
        <ul className="space-y-2">
          {data.rebuild_notes.map((note, i) => (
            <li key={i} className="text-sm text-foreground/85 leading-relaxed border-b border-border last:border-0 pb-2 last:pb-0 flex gap-2">
              <span className="text-muted-foreground font-mono">{i + 1}.</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Raw JSON */}
      <div className="card-polsia p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4" />
          <h3 className="font-serif text-lg">Raw JSON</h3>
        </div>
        <pre className="text-xs font-mono bg-muted/40 p-4 rounded-sm overflow-x-auto max-h-96">
{JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ============= STRATEGY TAB =============
function StrategyTab({
  audit,
  focusNotes,
}: {
  audit: AuditResult;
  focusNotes: string;
}) {
  const [data, setData] = useState<StrategyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const generate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audit, focusNotes }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Generation failed.');
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to generate strategy.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    generate();
    return () => {
      cancelled = true;
    };
  }, [audit, focusNotes]);

  if (loading) return <TabLoadingCard label="Generating 12-week strategy from audit findings..." />;
  if (error) {
    return (
      <div className="card-polsia p-6 fade-up">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <p className="font-mono text-xs uppercase tracking-wider">Generation failed</p>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="fade-up space-y-4">
      {/* Objective banner */}
      <div className="card-polsia p-6 border-l-4 border-l-black">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Overall objective
        </div>
        <p className="font-serif text-xl leading-snug">{data.overall_objective}</p>
      </div>

      {/* Weeks */}
      <div className="card-polsia p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4" />
          <h3 className="font-serif text-lg">12-week sprint</h3>
        </div>
        <div className="space-y-3">
          {data.weeks.map((w) => (
            <div
              key={w.week}
              className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 border-b border-border last:border-0 pb-3 last:pb-0"
            >
              <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
                <div className="flex-shrink-0 h-8 w-8 rounded-sm bg-black text-white text-sm font-bold flex items-center justify-center font-mono">
                  {w.week}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground sm:mt-1">
                  Week {w.week}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium mb-1">{w.action}</p>
                <p className="text-xs text-muted-foreground mb-1">
                  <span className="text-foreground/60">Metric:</span> {w.metric}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-foreground/60">Outcome:</span> {w.expected_outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============= AGENT TAB =============
function AgentTab({
  audit,
  focusNotes,
}: {
  audit: AuditResult;
  focusNotes: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Audit loaded. I have the full report, red flags, assumptions, and benchmarks in context. Ask me to draft ad copy, write a blog brief, suggest an A/B test, refine the landing page, or tear down a competitor. Insufficient-data responses are valid - I will not invent facts.',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setSending(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit, messages: newMessages, focusNotes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Agent request failed.');
      setMessages((m) => [...m, { role: 'assistant', content: json.reply }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: `Error: ${e.message || 'Request failed.'}` },
      ]);
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    'Draft 3 Facebook ad variants',
    'Write a blog brief targeting my ICP',
    'Suggest an A/B test for the landing page headline',
    'Tear down competitor: [paste URL]',
  ];

  return (
    <div className="fade-up flex flex-col" style={{ minHeight: '70vh' }}>
      <div className="card-polsia flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <h3 className="font-serif text-lg">Execution agent</h3>
          <span className="ml-auto text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Audit context loaded
          </span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[55vh]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-sm text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-black text-white'
                    : 'bg-muted text-foreground border border-border'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-muted border border-border px-4 py-2.5 rounded-sm text-sm flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="text-muted-foreground">Analyzing audit context...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-5 py-3 border-t border-border flex flex-wrap gap-2">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => setInput(p)}
                className="text-xs px-3 py-1.5 border border-border rounded-sm hover:bg-muted transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-5 py-3 border-t border-border flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask the agent to execute on the audit..."
            className="input-polsia !text-base !rounded-sm !border-black flex-1"
            style={{ height: 'auto', padding: '0.75rem 1rem' }}
            disabled={sending}
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="btn-polsia"
            style={{ width: 'auto', padding: '0.75rem 1.25rem' }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= AGENTS TAB (custom autonomous agents) =============
interface AdVariant {
  headline: string;
  body: string;
  cta: string;
  source_fact: string;
}
interface AdCopyRunResult {
  channel: string;
  theme: string;
  variants: AdVariant[];
  runId?: string | null;
  generatedAt?: string;
}

function AgentsTab({ audit, isAgentPlan }: { audit: AuditResult; isAgentPlan: boolean }) {
  const [channel, setChannel] = useState('facebook');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AdCopyRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAdCopy = async () => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/agents/ad-copy/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit, channel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Run failed');
      setResult(data);
      toast.success('Ad copy generated — 3 variants ready');
    } catch (e: any) {
      setError(e.message || 'Failed to generate ad copy');
      toast.error(e.message || 'Failed to generate ad copy');
    } finally {
      setRunning(false);
    }
  };

  if (!isAgentPlan) {
    return (
      <PaywallCard
        title="Custom Agents"
        description="Autonomous agents that run on your audit data. The Ad Copy Agent generates 3 fact-backed ad variants per week, each citing a real metric from your audit. Agent plan ($99/mo) required."
        ctaLabel="Upgrade to Agent"
      />
    );
  }

  return (
    <div className="fade-up space-y-4">
      {/* Agent header */}
      <div className="card-polsia p-6 border-l-4 border-l-black">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-sm bg-black text-white flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl">Ad Copy Agent</h2>
            <p className="text-xs text-muted-foreground">
              Generates 3 fact-backed ad variants using your audit data as the sole fact source.
            </p>
          </div>
        </div>
      </div>

      {/* Channel selector + run button */}
      <div className="card-polsia p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Channel
            </label>
            <div className="flex gap-2">
              {['facebook', 'google', 'linkedin'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannel(ch)}
                  className={`text-xs font-mono uppercase tracking-wider px-3 py-2 rounded-sm border transition-colors ${
                    channel === ch
                      ? 'bg-black text-white border-black'
                      : 'border-border hover:border-black'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={runAdCopy}
            disabled={running}
            className="btn-polsia"
            style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin inline" /> GENERATING...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2 inline" /> GENERATE 3 VARIANTS
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Each variant is anchored to a specific fact from your audit. No hallucinated metrics, no banned phrases.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="card-polsia p-4 border-l-4 border-l-red-500 bg-red-50">
          <p className="text-sm text-red-900">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg">
              {result.variants.length} ad variants · {result.channel} · theme: {result.theme}
            </h3>
            {result.generatedAt && (
              <span className="text-xs text-muted-foreground">
                {new Date(result.generatedAt).toLocaleString()}
              </span>
            )}
          </div>
          {result.variants.map((v, i) => (
            <div key={i} className="card-polsia p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Variant {i + 1}
                </span>
              </div>
              <h4 className="font-serif text-lg mb-2 leading-tight">{v.headline}</h4>
              <p className="text-sm text-foreground/85 mb-3 leading-relaxed">{v.body}</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono uppercase tracking-wider bg-black text-white px-2 py-1 rounded-sm">
                  {v.cta}
                </span>
              </div>
              <div className="text-xs text-muted-foreground border-t border-border pt-2">
                <span className="font-mono uppercase text-[10px] tracking-widest">Source fact: </span>
                {v.source_fact}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============= PAYWALL CARD =============
function PaywallCard({
  title,
  description,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaLabel: string;
}) {
  return (
    <div className="card-polsia p-8 sm:p-12 fade-up text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 border border-black rounded-sm mb-4">
        <Lock className="h-5 w-5" />
      </div>
      <h2 className="font-serif text-2xl sm:text-3xl mb-3">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      <a
        href="/pricing"
        className="btn-cta"
        style={{ width: 'auto', padding: '0.875rem 2rem', display: 'inline-flex' }}
      >
        {ctaLabel} <ArrowRight className="h-4 w-4 ml-2" />
      </a>
      <p className="text-xs text-muted-foreground mt-4">
        Free audit stays free. Cancel anytime.
      </p>
    </div>
  );
}

// ============= DASHBOARD (tabbed wrapper) =============
function Dashboard({
  audit,
  focusNotes,
  onReset,
}: {
  audit: AuditResult;
  focusNotes: string;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<TabKey>('audit');
  const [subscription, setSubscription] = useState<{ subscribed: boolean; plan: string | null } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const slopDetected = !!audit.slop_markers?.detected && !!audit.slop_markers?.rebuild_recommended;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Fetch subscription status (non-blocking; default to unsubscribed on error)
    fetch('/api/subscription')
      .then((r) => r.json())
      .then((data) => setSubscription({ subscribed: !!data.subscribed, plan: data.plan || null }))
      .catch(() => setSubscription({ subscribed: false, plan: null }));
  }, []);

  const isPaid = !!subscription?.subscribed;
  const isAgentPlan = subscription?.plan === 'agent';

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'audit', label: 'Audit', icon: ListChecks },
    { key: 'competitors', label: 'Competitors', icon: Users },
    ...(slopDetected
      ? [{ key: 'rebuild' as TabKey, label: 'Rebuild', icon: Wrench }]
      : []),
    { key: 'landing', label: 'Landing page', icon: FileText },
    { key: 'strategy', label: '12-week strategy', icon: Calendar },
    { key: 'agent', label: 'Execution agent', icon: MessageSquare },
    { key: 'agents', label: 'Custom agents', icon: Bot },
  ];

  return (
    <div ref={topRef} className="fade-up min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 no-print">
          <div className="flex items-center gap-2">
            <Logo variant="full" height={28} />
          </div>
          <div className="flex gap-2 items-center">
            {audit.publicId && (
              <VerificationBadge
                publicId={audit.publicId}
                verified={false}
                canVerifyClient={canVerifyAudit(audit)}
              />
            )}
            {audit.publicId && (
              <Button
                onClick={() => {
                  const url = `${window.location.origin}/audit/${audit.publicId}`;
                  navigator.clipboard
                    .writeText(url)
                    .then(() => toast.success('Share URL copied to clipboard'))
                    .catch(() => toast.error('Failed to copy URL'));
                }}
                variant="outline"
                size="sm"
                className="rounded-sm font-mono uppercase text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Share
              </Button>
            )}
            <Button
              onClick={() => window.print()}
              variant="outline"
              size="sm"
              className="rounded-sm font-mono uppercase text-xs"
            >
              Export
            </Button>
            {subscription?.subscribed ? (
              <>
                {subscription?.plan === 'agent' && (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-sm">
                    Agent
                  </span>
                )}
                {subscription?.plan === 'pro' && (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-sm">
                    Pro
                  </span>
                )}
                <a
                  href="/api/create-portal-session"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const res = await fetch('/api/create-portal-session', { method: 'POST' });
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                    } catch {
                      // ignore — Stripe not configured
                    }
                  }}
                  className="text-xs font-mono uppercase text-muted-foreground hover:text-foreground"
                >
                  Manage
                </a>
              </>
            ) : (
              <a
                href="/pricing"
                className="text-xs font-mono uppercase text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-sm hover:border-black"
              >
                Upgrade
              </a>
            )}
            <Button
              onClick={onReset}
              size="sm"
              className="rounded-sm font-mono uppercase text-xs bg-black hover:bg-black/80"
            >
              <RefreshCw className="h-3 w-3 mr-1" /> New audit
            </Button>
          </div>
        </div>

        {/* Tab nav */}
        <div className="border-b border-border mb-6 no-print">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    active
                      ? 'border-black text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active tab content */}
        {tab === 'audit' && (
          <AuditTab audit={audit} onRebuild={() => setTab('rebuild')} />
        )}
        {tab === 'competitors' &&
          (isPaid ? (
            <CompetitorsTab audit={audit} />
          ) : (
            <PaywallCard
              title="Competitor analysis"
              description="See how AuditGPT beats MakerPad, Cofounder.co, Polsia, and NanoCorp for your specific business. Pro plan required."
              ctaLabel="Upgrade to Pro"
            />
          ))}
        {tab === 'rebuild' &&
          (isPaid ? (
            <RebuildTab audit={audit} focusNotes={focusNotes} autoTrigger={slopDetected} />
          ) : (
            <PaywallCard
              title="Rebuild from slop"
              description="Take the AI-slop detected on this site and rebuild a fact-backed landing page from scratch. No replicated phrasing. Pro plan required."
              ctaLabel="Upgrade to Pro"
            />
          ))}
        {tab === 'landing' &&
          (isPaid ? (
            <LandingPageTab audit={audit} focusNotes={focusNotes} />
          ) : (
            <PaywallCard
              title="Landing page generator"
              description="Generate a fact-backed landing page using only verified data from the audit. No fluff, no hallucinations. Pro plan required."
              ctaLabel="Upgrade to Pro"
            />
          ))}
        {tab === 'strategy' &&
          (isPaid ? (
            <StrategyTab audit={audit} focusNotes={focusNotes} />
          ) : (
            <PaywallCard
              title="12-week strategy"
              description="A 12-week tactical plan where every action cites a specific audit gap and an industry benchmark. Pro plan required."
              ctaLabel="Upgrade to Pro"
            />
          ))}
        {tab === 'agent' &&
          (isAgentPlan ? (
            <AgentTab audit={audit} focusNotes={focusNotes} />
          ) : (
            <PaywallCard
              title="Execution agent"
              description="Chat with an agent that has the full audit JSON as context. Draft ad copy, write blog briefs, suggest A/B tests, tear down competitors. Agent plan ($99/mo) required."
              ctaLabel={isPaid ? 'Upgrade to Agent' : 'Upgrade to Agent'}
            />
          ))}
        {tab === 'agents' && <AgentsTab audit={audit} isAgentPlan={isAgentPlan} />}
      </div>
    </div>
  );
}

// ============= TOP NAV =============
function TopNav({ onReset }: { onReset: () => void }) {
  return (
    <header className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <Logo variant="full" height={28} />
        </button>
        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-black" />
          <span className="ml-1">Fact-backed. No fluff.</span>
        </div>
      </div>
    </header>
  );
}

// ============= FOOTER =============
function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>AuditGPT · The Truth Engine for AI Businesses.</span>
        <span className="font-mono uppercase tracking-wider">The truth engine for AI businesses.</span>
      </div>
    </footer>
  );
}

// ============= MAIN PAGE =============
export default function Home() {
  const [step, setStep] = useState<Step>('landing');
  const [path, setPath] = useState<'new' | 'grow'>('grow');
  const [q1, setQ1] = useState('');
  const [industry, setIndustry] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle the /slop flow: when arriving via ?flow=slop, pre-fill Q1 and jump to Q2
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('flow') === 'slop') {
      const savedUrl = sessionStorage.getItem('slop-audit-url');
      const savedPath = sessionStorage.getItem('slop-audit-path');
      if (savedUrl) {
        setQ1(savedUrl);
        setPath(savedPath === 'new' ? 'new' : 'grow');
        setStep('q2');
        // Clean up so refresh doesn't re-trigger
        sessionStorage.removeItem('slop-audit-url');
        sessionStorage.removeItem('slop-audit-path');
        // Clean the URL
        url.searchParams.delete('flow');
        window.history.replaceState({}, '', url.pathname);
      }
    }
  }, []);

  const runAudit = async () => {
    setStep('loading');
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          website: q1,
          answer: notes ? `${industry} — ${notes}` : industry,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Audit failed.');
      }
      setResult(data as AuditResult);
      setStep('result');
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Something went wrong.');
      setStep('error');
      toast.error(e.message || 'Audit failed.');
    }
  };

  const reset = () => {
    setStep('landing');
    setPath('grow');
    setQ1('');
    setIndustry('');
    setNotes('');
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBackToLanding = () => {
    setStep('landing');
    setQ1('');
    setIndustry('');
    setNotes('');
  };

  const showNav = step === 'result' || step === 'error';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showNav && <TopNav onReset={reset} />}

      {step === 'landing' && (
        <>
          <Landing
            onPick={(p) => {
              setPath(p);
              setStep('q1');
            }}
          />
          <Footer />
        </>
      )}

      {step === 'q1' && (
        <Q1
          path={path}
          value={q1}
          onChange={setQ1}
          onSubmit={() => setStep('q2')}
          onBack={goBackToLanding}
        />
      )}

      {step === 'q2' && (
        <Q2
          value={industry}
          onChange={setIndustry}
          notes={notes}
          onNotesChange={setNotes}
          onSubmit={runAudit}
          onBack={() => setStep('q1')}
        />
      )}

      {step === 'loading' && <Loading website={path === 'grow' ? q1 : 'your business'} />}

      {step === 'error' && (
        <div className="fade-up min-h-[80vh] flex items-center justify-center px-6 py-16">
          <div className="max-w-md text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 border border-black rounded-sm mb-6">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-2xl mb-2">Audit failed</h2>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={runAudit}
                className="btn-polsia"
                style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
              >
                Retry
              </button>
              <button
                onClick={reset}
                className="btn-polsia"
                style={{
                  width: 'auto',
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: 'black',
                  border: '1px solid black',
                }}
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <Dashboard audit={result} focusNotes={notes} onReset={reset} />
      )}

      {showNav && <Footer />}
    </div>
  );
}
