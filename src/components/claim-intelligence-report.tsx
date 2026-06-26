import { ArrowUpRight, Check, FileCheck2, Fingerprint } from 'lucide-react';
import { Logo } from '@/components/logo';
import { evidenceState, formatClaimStatus, formatPriority, REPORT_DISCLAIMER, type ClaimReport } from '@/lib/claim-report';

const priorityStyles = { high: 'border-[#9e563c] text-[#713722] bg-[#f5e8df]', critical: 'border-[#9e563c] text-[#713722] bg-[#f5e8df]', medium: 'border-[#b99555] text-[#69501d] bg-[#f5edda]', low: 'border-[#71816f] text-[#40503e] bg-[#e9eee7]' } as const;

export function ClaimIntelligenceReport({ report }: { report: ClaimReport }) {
  const { audit, metadata } = report;
  const evidenceItems = [...new Set(audit.claim_audit.claims.flatMap((claim) => claim.proof_needed))];
  return (
    <main className="min-h-screen bg-[#171916] px-4 py-8 text-[#24251f] sm:px-8 sm:py-14 print:bg-white print:p-0">
      <article className="mx-auto max-w-[1120px] overflow-hidden rounded-[2px] bg-[#f2eddf] shadow-[0_28px_90px_rgba(0,0,0,.35)] print:shadow-none">
        <header className="border-b border-[#c8c0ad] px-6 py-7 sm:px-12 sm:py-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div><Logo variant="full" height={31} /><p className="mt-7 font-mono text-[10px] uppercase tracking-[.28em] text-[#69675f]">Claim intelligence / {metadata.reportType}</p><h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.02] sm:text-6xl">AuditGPT Claim Intelligence Report</h1></div>
            <div className="border border-[#b6ad98] px-4 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-[#545249]">Sample / {report.fixtureLabel ?? 'internal visual prototype — not live model output'}</div>
          </div>
          <dl className="mt-10 grid gap-px border border-[#c8c0ad] bg-[#c8c0ad] sm:grid-cols-2 lg:grid-cols-4">
            {[['Target', metadata.targetName], ['URL', metadata.targetUrl], ['Reviewed surface', metadata.reviewedSurface], ['Audit date', metadata.auditDate]].map(([label, value]) => <div key={label} className="bg-[#f2eddf] p-4"><dt className="font-mono text-[9px] uppercase tracking-[.22em] text-[#777268]">{label}</dt><dd className="mt-2 text-sm leading-snug">{value}</dd></div>)}
          </dl>
          <p className="mt-5 max-w-4xl text-xs leading-relaxed text-[#69675f]">{REPORT_DISCLAIMER}</p>
        </header>

        <section className="grid border-b border-[#c8c0ad] lg:grid-cols-[.7fr_1.3fr]">
          <div className="bg-[#252923] p-8 text-[#f2eddf] sm:p-12"><p className="font-mono text-[10px] uppercase tracking-[.26em] text-[#b7bcae]">Executive verdict</p><div className="mt-8 flex items-end gap-3"><span className="font-serif text-7xl">{audit.claim_audit.summary.claim_support_score}</span><span className="pb-2 font-mono text-xs text-[#b7bcae]">/ 100<br/>claim support</span></div></div>
          <div className="p-8 sm:p-12"><p className="font-serif text-2xl leading-relaxed sm:text-3xl">{report.executiveVerdict}</p><div className="mt-8 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[.16em] text-[#66645c]"><span>{audit.claim_audit.summary.total_claims} claims reviewed</span><span>•</span><span>{audit.claim_audit.summary.high_priority_count} high priority</span></div></div>
        </section>

        <section className="px-6 py-10 sm:px-12 sm:py-14"><SectionHeading index="01" title="Claim Findings" subtitle="Each finding connects the public claim to its visible support, trust gap, and next proof needed." />
          <div className="mt-8 space-y-5">{audit.claim_audit.claims.map((claim, index) => <article key={claim.id} className="border border-[#bbb29e] bg-[#f7f3e8]"><div className="grid border-b border-[#d2cab9] lg:grid-cols-[90px_1fr_auto]"><div className="border-b border-[#d2cab9] p-5 font-mono text-xs text-[#777268] lg:border-b-0 lg:border-r">{String(index + 1).padStart(2, '0')}</div><div className="p-5"><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#777268]">Claim</p><h3 className="mt-2 font-serif text-2xl">“{claim.original_text}”</h3></div><div className="flex flex-wrap items-center gap-2 p-5 lg:justify-end"><span className="border border-[#aaa18f] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em]">{formatClaimStatus(claim.claim_status)}</span><span className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em] ${priorityStyles[claim.priority]}`}>{formatPriority(claim.priority)}</span></div></div>
            <div className="grid gap-px bg-[#d2cab9] md:grid-cols-2 lg:grid-cols-3">{[['Support gap', claim.support_gap], ['Trust gap', claim.trust_gap], ['Positioning risk', claim.positioning_risk]].map(([label, value]) => <InfoCell key={label} label={label} value={value} />)}</div>
            <div className="grid border-t border-[#d2cab9] md:grid-cols-2"><div className="p-5 md:border-r md:border-[#d2cab9]"><p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-[#66645c]"><Check className="h-3 w-3" />{evidenceState(claim.visible_evidence)}</p><p className="mt-3 text-sm leading-relaxed">{claim.visible_evidence}</p></div><div className="p-5"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#66645c]">Next proof needed</p><p className="mt-3 text-sm leading-relaxed">{claim.evidence_needed}</p></div></div>
            <div className="border-t border-[#d2cab9] bg-[#e7eadf] p-5"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#53604c]">Safer framing suggestion</p><p className="mt-3 font-serif text-xl">“{claim.safer_framing}”</p></div>
          </article>)}</div>
        </section>

        <section className="border-y border-[#c8c0ad] bg-[#252923] px-6 py-10 text-[#f2eddf] sm:px-12 sm:py-14"><SectionHeading index="02" title="Safer Framing Draft" subtitle="Draft — Pending Human Approval" dark />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">{audit.claim_audit.claims.map((claim) => <div key={claim.id} className="border border-[#555a50] p-5"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#aeb3a6]">Original</p><p className="mt-2 text-sm text-[#c8cbbf] line-through">{claim.original_text}</p><p className="mt-6 font-mono text-[9px] uppercase tracking-[.18em] text-[#aeb3a6]">Draft framing</p><p className="mt-2 font-serif text-xl">{claim.safer_framing}</p><p className="mt-5 text-xs leading-relaxed text-[#aeb3a6]">Proof slot: {claim.proof_needed.join(' · ')}</p></div>)}</div>
        </section>

        <section className="grid border-b border-[#c8c0ad] lg:grid-cols-2"><div className="p-8 sm:p-12 lg:border-r lg:border-[#c8c0ad]"><SectionHeading index="03" title="Evidence Checklist" subtitle="Add only evidence that can be sourced and reviewed." /><ul className="mt-8 grid gap-3 sm:grid-cols-2">{evidenceItems.map((item) => <li key={item} className="flex items-start gap-3 border-t border-[#c8c0ad] py-3 text-sm"><FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5e6d58]" />{item}</li>)}</ul></div>
          <div className="p-8 sm:p-12"><SectionHeading index="04" title="Next Step" subtitle="Free Claim Snapshot complete" /><div className="mt-7 space-y-3">{[['$99', 'Claim Support Review', 'Upgrade path'], ['$299', 'Evidence Pack', 'Optional next step'], ['$499–$1,500', 'Founder’s Audit', 'Optional full review'], ['$799/mo', 'Monitoring', 'Later option']].map(([price, name, label]) => <div key={name} className="flex items-center justify-between gap-4 border-t border-[#c8c0ad] py-4"><div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#777268]">{label}</p><p className="mt-1 font-serif text-xl">{name}</p></div><div className="flex items-center gap-2 font-mono text-sm"><span>{price}</span><ArrowUpRight className="h-4 w-4" /></div></div>)}</div></div>
        </section>

        <footer className="flex flex-wrap items-end justify-between gap-6 px-6 py-7 sm:px-12"><div className="flex items-start gap-3"><Fingerprint className="mt-0.5 h-5 w-5"/><div><p className="font-mono text-[9px] uppercase tracking-[.18em]">Audit metadata</p>{metadata.sealedHash ? <><p className="mt-2 break-all font-mono text-[10px] text-[#66645c]">SHA-256 {metadata.sealedHash}</p><p className="mt-1 font-mono text-[10px] text-[#66645c]">{metadata.sealedAt} · Website state sealed for audit integrity</p></> : <p className="mt-2 font-mono text-[10px] text-[#66645c]">No sealed metadata available for this fixture.</p>}</div></div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#777268]">Internal visual prototype</p></footer>
      </article>
    </main>
  );
}

function SectionHeading({ index, title, subtitle, dark = false }: { index: string; title: string; subtitle: string; dark?: boolean }) { return <div><p className={`font-mono text-[9px] uppercase tracking-[.22em] ${dark ? 'text-[#aeb3a6]' : 'text-[#777268]'}`}>{index} / AuditGPT</p><h2 className="mt-2 font-serif text-3xl sm:text-4xl">{title}</h2><p className={`mt-3 max-w-2xl text-sm leading-relaxed ${dark ? 'text-[#b7bcae]' : 'text-[#69675f]'}`}>{subtitle}</p></div>; }
function InfoCell({ label, value }: { label: string; value: string }) { return <div className="bg-[#f7f3e8] p-5"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#777268]">{label}</p><p className="mt-3 text-sm leading-relaxed">{value}</p></div>; }
