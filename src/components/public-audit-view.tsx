'use client';

import {
  ShieldCheck, AlertTriangle, ListChecks, ArrowRight,
  TrendingUp, BookOpen, AlertOctagon, Wrench
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { WedgeStrip } from '@/components/wedge';
import type { AuditResult, Claim } from '@/lib/audit-schema';

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
function getRiskColor(risk: string) {
  switch (risk) {
    case 'critical': return 'bg-red-50 text-red-900 border-red-200';
    case 'high': return 'bg-orange-50 text-orange-900 border-orange-200';
    case 'medium': return 'bg-yellow-50 text-yellow-900 border-yellow-200';
    case 'low': return 'bg-green-50 text-green-900 border-green-200';
    default: return 'bg-gray-50 text-gray-900 border-gray-200';
  }
}

// ──────────────────────────────────────────────────────────────
// Components
// ──────────────────────────────────────────────────────────────

function VerdictHeader({ audit }: { audit: AuditResult }) {
  return (
    <div className="bg-black text-white p-6 sm:p-8 rounded-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 font-mono">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Proof-Backed Claim Cleanup</span>
        </div>
        <div className="font-serif text-3xl font-bold">{audit.grade_stamp}</div>
      </div>
      <h1 className="font-serif text-2xl sm:text-3xl mb-2">{audit.verdict_header}</h1>
      <p className="text-sm text-white/80 max-w-2xl font-mono">{audit.company_info}</p>
    </div>
  );
}

function SectionList({ title, icon: Icon, items, colorClass }: { title: string, icon: any, items: string[], colorClass?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`border border-border p-5 rounded-sm bg-white`}>
      <div className={`flex items-center gap-2 mb-3 ${colorClass || 'text-foreground'}`}>
        <Icon className="h-4 w-4" />
        <h3 className="font-serif text-lg">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-foreground/80 leading-relaxed font-mono">• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function ClaimFindingCard({ claim, index }: { claim: Claim, index: number }) {
  const isTranscript = claim.source_type === 'agent_transcript';
  const label = isTranscript ? 'Exchange' : 'Claim';

  let formattedText = <p className="font-serif text-lg leading-snug">&ldquo;{claim.original_text}&rdquo;</p>;
  if (isTranscript && claim.original_text.includes('User:') && claim.original_text.includes('Agent:')) {
    const parts = claim.original_text.split('\n');
    formattedText = (
      <div className="space-y-2 mt-2 bg-neutral-50 p-3 border border-border rounded-sm font-mono text-sm">
        {parts.map((p, i) => (
          <div key={i} className={p.startsWith('Agent:') ? 'text-blue-900' : 'text-neutral-700'}>
            <strong>{p.split(':')[0]}:</strong> {p.substring(p.indexOf(':') + 1).trim()}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border border-border rounded-sm p-5 bg-white">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {label} #{index + 1}
            </span>
            <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${getRiskColor(claim.priority)}`}>
              {claim.priority} priority
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-neutral-100 text-neutral-800">
              {claim.claim_type.replace(/_/g, ' ')}
            </span>
          </div>
          {formattedText}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Visible Evidence</div>
          <p className="text-sm font-mono text-foreground/80">{claim.visible_evidence || 'None visible'}</p>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-1">Support Gap / Evidence Needed</div>
          <p className="text-sm font-mono text-foreground/80 text-amber-900 bg-amber-50 p-2 rounded-sm border border-amber-100">{claim.support_gap}{claim.evidence_needed ? ` — ${claim.evidence_needed}` : ''}</p>
        </div>
      </div>

      {(claim.trust_gap || claim.positioning_risk) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {claim.trust_gap && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Trust Gap</div>
              <p className="text-sm font-mono text-foreground/80">{claim.trust_gap}</p>
            </div>
          )}
          {claim.positioning_risk && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Positioning Risk</div>
              <p className="text-sm font-mono text-foreground/80">{claim.positioning_risk}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 border-t border-border pt-4">
        {claim.safer_framing ? (
          <div className="bg-green-50 border border-green-200 rounded-sm p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-green-700 font-bold">
                Safer Framing (Next step: {claim.recommended_next_step.replace(/_/g, ' ')})
              </div>
              <button className="text-[10px] font-mono uppercase text-green-700 hover:underline">
                Regenerate
              </button>
            </div>
            <p className="text-sm text-green-900 font-mono leading-relaxed">
              &ldquo;{claim.safer_framing}&rdquo;
            </p>
          </div>
        ) : (
          <button className="w-full mt-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-mono uppercase tracking-wider py-2 rounded-sm transition-colors flex items-center justify-center gap-2">
            <Wrench className="h-3 w-3" /> Generate Safer Framing
          </button>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Top-level View
// ──────────────────────────────────────────────────────────────

export function PublicAuditView({
  audit,
  createdAt,
  showCta = true,
  publicId,
}: {
  audit: AuditResult;
  createdAt?: Date;
  showCta?: boolean;
  publicId?: string;
}) {
  return (
    <div className="fade-up space-y-6">
      <VerdictHeader audit={audit} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionList title="Report Card" icon={ListChecks} items={audit.report_card} />
        <SectionList title="Support Gaps" icon={AlertOctagon} items={audit.support_gaps} colorClass="text-amber-700" />
      </div>

      {audit.claim_audit?.claims?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2 mt-8">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-serif text-2xl">
              {audit.claim_audit.claims.some(c => c.source_type === 'agent_transcript') 
                ? 'Agent Guardrail Review' 
                : 'Claim Support Review'}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            Total {audit.claim_audit.claims.some(c => c.source_type === 'agent_transcript') ? 'Exchanges' : 'Claims'}: {audit.claim_audit.summary.total_claims} | High/Critical Priority: {audit.claim_audit.summary.high_priority_count + audit.claim_audit.summary.critical_priority_count}
          </p>
          <div className="space-y-4">
            {audit.claim_audit.claims.map((claim, i) => (
              <ClaimFindingCard key={claim.id || i} claim={claim} index={i} />
            ))}
          </div>
        </div>
      )}

      {audit.industry_benchmarks_table?.length > 0 && (
        <div className="border border-border bg-white p-5 rounded-sm overflow-x-auto">
          <h3 className="font-serif text-lg mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Industry Benchmarks</h3>
          <table className="w-full text-left text-sm font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-[10px]">
                <th className="py-2">Metric</th>
                <th className="py-2">This Business</th>
                <th className="py-2">Industry Average</th>
              </tr>
            </thead>
            <tbody>
              {audit.industry_benchmarks_table.map((row, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-3 font-bold">{row.metric}</td>
                  <td className="py-3 text-red-600">{row.this_business}</td>
                  <td className="py-3 text-green-700">{row.industry_avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <SectionList title="Action Plan" icon={ListChecks} items={audit.action_plan} />
        <SectionList title="Assumptions to Test" icon={BookOpen} items={audit.assumptions_to_test} />
      </div>

      <SectionList title="Recommended Next Steps" icon={TrendingUp} items={audit.recommended_next_steps} />

      {audit.disclaimer && (
        <p className="text-[11px] text-muted-foreground font-mono leading-relaxed border-t border-border pt-4">
          {audit.disclaimer}
        </p>
      )}

      {showCta && (
        <div className="border border-border bg-white p-6 text-center rounded-sm mt-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Logo variant="full" height={32} />
          </div>
          <div className="flex justify-center mb-3">
            <WedgeStrip />
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto font-mono">
            Find the claims your website cannot yet prove — before a prospect, investor, or client does.
          </p>
          <a href="/snapshot" className="btn-cta" style={{ width: 'auto', padding: '0.875rem 2rem', display: 'inline-flex' }}>
            RUN YOUR OWN AUDIT <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}
