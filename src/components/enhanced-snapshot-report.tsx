'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  Fingerprint,
  Gauge,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import type {
  AIVisibilityEngineSimulation,
  ClaimFinding,
  EnhancedSnapshotReport,
} from '@/lib/audit/snapshot-report-model';

export interface AgencyBranding {
  logoUrl?: string | null;
  primaryColor?: string | null;
  poweredByEnabled?: boolean | null;
  companyName?: string | null;
}

interface EnhancedSnapshotReportProps {
  report: EnhancedSnapshotReport;
  mode?: 'free' | 'full';
  publicId?: string;
  agencyBranding?: AgencyBranding | null;
}

const labelStyles: Record<ClaimFinding['label'], string> = {
  Supported: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  'Weakly Supported': 'border-amber-200 bg-amber-50 text-amber-900',
  Overstated: 'border-orange-200 bg-orange-50 text-orange-900',
  Unsupported: 'border-red-200 bg-red-50 text-red-900',
};

const citationStyles: Record<AIVisibilityEngineSimulation['citationLikelihood'], string> = {
  High: 'text-emerald-900 bg-emerald-50 border-emerald-200',
  Medium: 'text-amber-900 bg-amber-50 border-amber-200',
  Low: 'text-red-900 bg-red-50 border-red-200',
};

export function EnhancedSnapshotReport({
  report,
  mode = 'free',
  publicId,
  agencyBranding,
}: EnhancedSnapshotReportProps) {
  const isFree = mode === 'free';
  const claims = isFree ? report.claimInventory.slice(0, 3) : report.claimInventory;
  const simulations = isFree
    ? report.aiVisibilitySimulation.slice(0, 2)
    : report.aiVisibilitySimulation;
  const saferFraming = isFree
    ? report.saferFramingRecommendations.slice(0, 2)
    : report.saferFramingRecommendations;

  return (
    <article className="mx-auto max-w-[1120px] overflow-hidden border border-stone-200 bg-[#f7f3e8] text-stone-900 shadow-sm print:border-black print:shadow-none">
      <header 
        className="border-b border-stone-300 bg-[#252923] px-6 py-7 text-[#f2eddf] sm:px-10"
        style={agencyBranding?.primaryColor ? { backgroundColor: agencyBranding.primaryColor } : undefined}
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            {agencyBranding?.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={agencyBranding.logoUrl} alt={agencyBranding.companyName || "Agency Logo"} className="h-[30px] w-auto object-contain" />
            ) : (
              <Logo variant="full" height={30} />
            )}
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[.24em] text-[#b7bcae]">
              AI Visibility + Claim Snapshot
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-[1.02] sm:text-6xl">
              Claim Intelligence Report
            </h1>
          </div>
          <div className="border border-[#555a50] px-4 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-[#c8cbbf]">
            {isFree ? 'Free snapshot' : 'Full report'}
          </div>
        </div>
        <p className="mt-6 max-w-4xl text-sm leading-relaxed text-[#c8cbbf]">
          {report.positioningStatement}
        </p>
      </header>

      <section className="grid border-b border-stone-300 lg:grid-cols-[.72fr_1.28fr]">
        <div className="bg-[#e7eadf] p-8 sm:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[.22em] text-stone-600">
            Executive summary
          </p>
          <div className="mt-7 flex items-end gap-3">
            <span className="font-serif text-7xl">{report.overallRiskScore}</span>
            <span className="pb-2 font-mono text-xs uppercase tracking-widest text-stone-600">
              / 100
              <br />
              risk score
            </span>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-stone-700">
            Higher means more claim, proof, AI readability, or demand leakage risk.
          </p>
        </div>
        <div className="p-8 sm:p-10">
          <p className="font-serif text-2xl leading-relaxed sm:text-3xl">
            {report.executiveSummary.summary}
          </p>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {report.executiveSummary.keyFindings.slice(0, 3).map((finding) => (
              <div key={finding} className="border-t border-stone-300 pt-3 text-sm leading-relaxed">
                {finding}
              </div>
            ))}
          </div>
          <div className="mt-7 border border-stone-300 bg-white/50 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-stone-500">
              Primary recommendation
            </p>
            <p className="mt-2 text-sm leading-relaxed">{report.executiveSummary.primaryRecommendation}</p>
          </div>
        </div>
      </section>

      <SectionShell
        index="01"
        title="Claim Inventory"
        subtitle="Claims are labeled by support strength, proof visibility, and risk to buyers or AI systems."
        icon={Target}
      >
        <div className="grid gap-4">
          {claims.map((claim, index) => (
            <ClaimRow key={claim.id} claim={claim} index={index} />
          ))}
        </div>
        {isFree && report.claimInventory.length > claims.length && (
          <UpgradeCallout
            title={`${report.claimInventory.length - claims.length} more claims are reserved for the full report.`}
            body="The paid report expands the full claim inventory, proof mapping, safer rewrites, and competitor comparison."
          />
        )}
      </SectionShell>

      <SectionShell
        index="02"
        title="AI Visibility Simulation"
        subtitle="A claim-readability view of how answer engines may describe, qualify, cite, or ignore the page."
        icon={Bot}
        dark
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {simulations.map((simulation) => (
            <details
              key={simulation.engine}
              className="group border border-[#555a50] bg-[#2f342d] p-5 open:bg-[#343a32]"
              open={!isFree}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-2xl">{simulation.engine}</p>
                  <Badge className={`mt-2 border ${citationStyles[simulation.citationLikelihood]}`}>
                    {simulation.citationLikelihood} citation likelihood
                  </Badge>
                </div>
                <ChevronDown className="h-4 w-4 text-[#c8cbbf] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-5 text-sm leading-relaxed text-[#d8dacd]">
                {simulation.simulatedDescription}
              </p>
              <SignalList title="Strengths" items={simulation.strengths} />
              <SignalList title="Weaknesses" items={simulation.weaknesses} />
            </details>
          ))}
        </div>
        {isFree && (
          <UpgradeCallout
            title="Unlock full AI simulation & competitor comparison — upgrade to paid"
            body="Upgrade for ChatGPT, Perplexity, Gemini, Google AIO, competitor URLs, and citation confidence notes."
            dark
          />
        )}
      </SectionShell>

      <section className="grid border-b border-stone-300 lg:grid-cols-2">
        <CompactPanel
          index="03"
          title="Entity Gaps"
          icon={Fingerprint}
          items={report.entityUnderstandingGaps}
        />
        <CompactPanel
          index="04"
          title="Proof Density"
          icon={FileCheck2}
          lead={report.proofDensity.summary}
          items={report.proofDensity.missingSignals.slice(0, isFree ? 4 : undefined)}
        />
      </section>

      <SectionShell
        index="05"
        title="Demand Leakage"
        subtitle="The buyer should know what to trust, what proof supports it, and what to do next."
        icon={Gauge}
      >
        <p className="max-w-3xl text-base leading-relaxed">{report.demandLeakage.summary}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <MiniList title="CTA issues" items={report.demandLeakage.ctaIssues} />
          <MiniList title="Buyer friction" items={report.demandLeakage.buyerFriction} />
          <MiniList title="Recommended next steps" items={report.demandLeakage.recommendedNextSteps} />
        </div>
      </SectionShell>

      <SectionShell
        index="06"
        title="Safer Framing"
        subtitle="Specific rewrites that reduce risk without flattening the offer."
        icon={MessageSquareText}
        dark
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {saferFraming.map((item) => (
            <div key={item.original} className="border border-[#555a50] p-5">
              <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#aeb3a6]">
                Original
              </p>
              <p className="mt-2 text-sm text-[#c8cbbf] line-through">{item.original}</p>
              <p className="mt-5 font-mono text-[9px] uppercase tracking-[.18em] text-[#aeb3a6]">
                Safer framing
              </p>
              <p className="mt-2 font-serif text-xl leading-snug">{item.recommended}</p>
              <p className="mt-4 text-xs leading-relaxed text-[#aeb3a6]">{item.rationale}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        index="07"
        title="Scrutexity Next Steps"
        subtitle="Governed paths into the ecosystem. Each next step exists to reduce risk for buyers, investors, and AI systems."
        icon={Layers3}
      >
        <div className="grid gap-4 lg:grid-cols-4">
          {report.scrutexityNextSteps.map((step) => (
            <div key={step.service} className="border border-stone-300 bg-white/50 p-5">
              <p className="font-serif text-xl">{step.service}</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">{step.whyItFits}</p>
              <p className="mt-4 border-t border-stone-200 pt-3 font-mono text-[10px] uppercase tracking-[.14em] text-stone-500">
                {step.nextAction}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <Button 
            asChild 
            className="bg-stone-900 text-white hover:bg-stone-800"
            style={agencyBranding?.primaryColor ? { backgroundColor: agencyBranding.primaryColor } : undefined}
          >
            <Link href="/monitoring">
              Start Monthly Monitoring ($799/mo) <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/next-step/ai-visibility">
              Unlock full AI simulation & competitor comparison <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          {publicId && (
            <Button asChild variant="ghost">
              <Link href={`/audit/${publicId}`}>Copy report link</Link>
            </Button>
          )}
        </div>
        </div>
      </SectionShell>

      {(agencyBranding?.poweredByEnabled !== false) && (
        <footer className="border-t border-stone-300 bg-[#f7f3e8] px-6 py-4 text-center font-mono text-[10px] uppercase tracking-[.24em] text-stone-500 sm:px-10">
          Powered by Scrutexity
        </footer>
      )}
    </article>
  );
}

function ClaimRow({ claim, index }: { claim: ClaimFinding; index: number }) {
  return (
    <div className="border border-stone-300 bg-white/50">
      <div className="grid gap-px bg-stone-300 md:grid-cols-[80px_1fr_auto]">
        <div className="bg-[#f7f3e8] p-4 font-mono text-xs text-stone-500">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="bg-[#f7f3e8] p-4">
          <p className="font-mono text-[9px] uppercase tracking-[.18em] text-stone-500">Claim</p>
          <p className="mt-2 font-serif text-xl leading-snug">{claim.text}</p>
        </div>
        <div className="bg-[#f7f3e8] p-4 md:text-right">
          <Badge className={`border ${labelStyles[claim.label]}`}>{claim.label}</Badge>
          {typeof claim.confidenceScore === 'number' && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[.14em] text-stone-500">
              Priority {claim.confidenceScore}/100
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-px bg-stone-300 md:grid-cols-3">
        <InfoCell title="Proof found" value={claim.evidenceFound.join(' ') || 'Evidence not visible enough.'} />
        <InfoCell title="Proof missing" value={claim.evidenceMissing.slice(0, 2).join(' ')} />
        <InfoCell title="AI / buyer risk" value={claim.riskToInvestorOrAiSystem || claim.riskToBuyer} />
      </div>
    </div>
  );
}

function SectionShell({
  index,
  title,
  subtitle,
  icon: Icon,
  dark = false,
  children,
}: {
  index: string;
  title: string;
  subtitle: string;
  icon: typeof ShieldCheck;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`border-b px-6 py-10 sm:px-10 sm:py-12 ${
        dark
          ? 'border-[#555a50] bg-[#252923] text-[#f2eddf]'
          : 'border-stone-300 bg-[#f7f3e8] text-stone-900'
      }`}
    >
      <div className="mb-8 flex items-start gap-3">
        <Icon className={`mt-1 h-5 w-5 ${dark ? 'text-[#aeb3a6]' : 'text-stone-600'}`} />
        <div>
          <p
            className={`font-mono text-[9px] uppercase tracking-[.22em] ${
              dark ? 'text-[#aeb3a6]' : 'text-stone-500'
            }`}
          >
            {index} / AuditGPT
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{title}</h2>
          <p className={`mt-3 max-w-3xl text-sm leading-relaxed ${dark ? 'text-[#b7bcae]' : 'text-stone-600'}`}>
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function CompactPanel({
  index,
  title,
  icon: Icon,
  lead,
  items,
}: {
  index: string;
  title: string;
  icon: typeof ShieldCheck;
  lead?: string;
  items: string[];
}) {
  return (
    <div className="p-8 sm:p-10 lg:border-r lg:border-stone-300 last:border-r-0">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-stone-600" />
        <p className="font-mono text-[9px] uppercase tracking-[.22em] text-stone-500">
          {index} / AuditGPT
        </p>
      </div>
      <h2 className="mt-3 font-serif text-3xl">{title}</h2>
      {lead && <p className="mt-4 text-sm leading-relaxed text-stone-700">{lead}</p>}
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 border-t border-stone-300 pt-3 text-sm leading-relaxed">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-stone-300 bg-white/50 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-stone-500">{title}</p>
      <ul className="mt-4 space-y-3">
        {(items.length ? items : ['No issue surfaced in the current snapshot.']).map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-stone-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SignalList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5 border-t border-[#555a50] pt-4">
      <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#aeb3a6]">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-[#d8dacd]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoCell({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#f7f3e8] p-4">
      <p className="font-mono text-[9px] uppercase tracking-[.18em] text-stone-500">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-stone-700">{value || 'Insufficient data.'}</p>
    </div>
  );
}

function UpgradeCallout({
  title,
  body,
  dark = false,
}: {
  title: string;
  body: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`mt-6 border p-5 ${
        dark
          ? 'border-[#555a50] bg-[#30352e] text-[#f2eddf]'
          : 'border-stone-300 bg-white/60 text-stone-900'
      }`}
    >
      <p className="font-serif text-xl">{title}</p>
      <p className={`mt-2 text-sm leading-relaxed ${dark ? 'text-[#c8cbbf]' : 'text-stone-600'}`}>{body}</p>
    </div>
  );
}
