'use client';

import {
  ShieldCheck, AlertTriangle, ListChecks, ArrowRight,
  TrendingUp, BookOpen, AlertOctagon, Wrench, Info,
  CheckSquare, Square
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
    case 'high': return 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]'; 
    case 'medium': return 'bg-[#ffedd5] text-[#9a3412] border-[#fdba74]';
    case 'low': return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    default: return 'bg-slate-50 text-slate-900 border-slate-200';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'unsupported': return 'bg-red-50 text-red-900 border-red-200';
    case 'overstated': return 'bg-amber-50 text-amber-900 border-amber-200';
    case 'weakly_supported': return 'bg-blue-50 text-blue-900 border-blue-200';
    case 'verified': return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    default: return 'bg-slate-50 text-slate-900 border-slate-200';
  }
}

// ──────────────────────────────────────────────────────────────
// Components
// ──────────────────────────────────────────────────────────────

function MissionBriefing({ audit, createdAt }: { audit: AuditResult, createdAt?: Date }) {
  let target = audit.company_info;
  let url = 'N/A';
  const urlMatch = audit.company_info.match(/\((https?:\/\/[^\)]+)\)/);
  if (urlMatch) {
    url = urlMatch[1];
    target = target.replace(urlMatch[0], '').trim();
  }
  const dateStr = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Just now';

  return (
    <header className="mb-12 print:mb-8 font-sans">
      {/* Title Area */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Claim Intelligence Report</h1>
          <div className="mt-2 text-xs font-mono uppercase tracking-widest text-slate-500">
            AuditGPT / Scrutexity V2
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-sm print:border-black print:text-black print:bg-white">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)] print:hidden"></span>
          Analysis Complete
        </div>
      </div>

      {/* Parameter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 border-y border-slate-200 py-6 px-6 sm:px-8 print:border-y-2 print:border-black print:bg-white">
        <div className="flex flex-col gap-1">
          <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-black">Target</dt>
          <dd className="font-mono text-sm font-medium text-slate-900">{target.split('—')[0].trim()}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-black">URL</dt>
          <dd className="font-mono text-sm font-medium text-blue-600 truncate print:text-black">
            {url !== 'N/A' ? <a href={url} target="_blank" rel="noreferrer" className="hover:underline">{url}</a> : url}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-black">Reviewed Surface</dt>
          <dd className="font-mono text-sm font-medium text-slate-900">{audit.claim_audit?.claims?.some(c => c.source_type === 'agent_transcript') ? 'Agent Transcript' : 'Website public surfaces'}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-black">Audit Date</dt>
          <dd className="font-mono text-sm font-medium text-slate-900">{dateStr}</dd>
        </div>
      </div>

      {/* Scope Limitations Callout */}
      {audit.disclaimer && (
        <div className="mt-6 flex gap-4 bg-amber-50/50 border border-amber-200 border-l-4 border-l-amber-500 rounded-r-md p-4 sm:p-5 print:border print:border-black print:bg-white">
          <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5 print:text-black" />
          <div>
            <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1 print:text-black">System Limitations</h4>
            <p className="text-sm text-amber-900/80 leading-relaxed print:text-black">
              {audit.disclaimer}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

function VerdictHero({ audit }: { audit: AuditResult }) {
  const scoreRaw = audit.grade_stamp.split('/')[0] || '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 bg-slate-50 border border-slate-200 rounded-xl p-8 mb-12 print:border-2 print:border-black print:bg-white font-sans">
      {/* Gauge */}
      <div className="flex flex-col items-center justify-center bg-amber-50/50 border-[3px] border-amber-200 rounded-full w-36 h-36 mx-auto md:mx-0 flex-shrink-0 print:border-4 print:border-black print:bg-white">
        <div className="font-sans text-5xl font-bold text-amber-900 tracking-tighter print:text-black">{scoreRaw}</div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-amber-700 mt-1 print:text-black">Score</div>
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center text-center md:text-left">
        <h2 className="font-sans text-2xl sm:text-3xl font-semibold mb-3 text-slate-900">{audit.verdict_header}</h2>
        <p className="text-base text-slate-600 leading-relaxed print:text-black">
          {audit.verdict || audit.claim_audit.summary.executive_summary || "Audit processing completed. Review findings below."}
        </p>
      </div>
    </div>
  );
}

function SectionList({ title, icon: Icon, items, colorClass }: { title: string, icon: any, items: string[], colorClass?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`border border-slate-200 p-6 rounded-lg bg-white print:border-black font-sans`}>
      <div className={`flex items-center gap-2 mb-4 ${colorClass || 'text-slate-900'}`}>
        <Icon className="h-5 w-5 print:text-black" />
        <h3 className="font-sans text-lg font-semibold">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-600 leading-relaxed print:text-black flex gap-2">
            <span className="text-slate-300 mt-0.5 print:text-black">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClaimFindingCard({ claim, index }: { claim: Claim, index: number }) {
  const isTranscript = claim.source_type === 'agent_transcript';
  const label = isTranscript ? 'Exchange' : 'Claim';

  let formattedText = <p className="font-sans text-xl font-medium leading-snug text-slate-900">&ldquo;{claim.original_text}&rdquo;</p>;
  if (isTranscript && claim.original_text.includes('User:') && claim.original_text.includes('Agent:')) {
    const parts = claim.original_text.split('\n');
    formattedText = (
      <div className="space-y-2 mt-2 bg-slate-50 p-4 border border-slate-200 rounded-md font-mono text-sm print:border-black">
        {parts.map((p, i) => (
          <div key={i} className={p.startsWith('Agent:') ? 'text-blue-900 font-medium' : 'text-slate-600'}>
            <strong>{p.split(':')[0]}:</strong> {p.substring(p.indexOf(':') + 1).trim()}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative border border-slate-200 rounded-lg p-6 sm:p-8 mb-8 shadow-sm hover:shadow-md transition-shadow bg-white print:break-inside-avoid print:border-black print:shadow-none font-sans">
      
      {/* Absolute Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded-[4px] border ${getStatusBadge(claim.claim_status)} print:border-black print:text-black`}>
          {claim.claim_status.replace(/_/g, ' ')}
        </span>
        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded-[4px] border ${getRiskColor(claim.priority)} print:border-black print:text-black`}>
          {claim.priority} PRIORITY
        </span>
      </div>

      <div className="mb-6 md:max-w-[70%] max-w-[60%]">
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">
          {label} {String(index + 1).padStart(2, '0')}
        </div>
        {formattedText}
      </div>

      {/* 3-Column Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-6 border-t border-slate-100 print:border-black">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 border-t-2 border-amber-200 pt-2 print:border-black print:text-black">Support Gap</div>
          <p className="text-sm text-slate-700 leading-relaxed print:text-black">{claim.support_gap}</p>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 border-t-2 border-red-200 pt-2 print:border-black print:text-black">Trust Gap</div>
          <p className="text-sm text-slate-700 leading-relaxed print:text-black">{claim.trust_gap || 'None visible.'}</p>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 border-t-2 border-blue-200 pt-2 print:border-black print:text-black">Positioning Risk</div>
          <p className="text-sm text-slate-700 leading-relaxed print:text-black">{claim.positioning_risk || 'No direct risk identified.'}</p>
        </div>
      </div>

      {/* Safer Framing Matrix & Evidence Checklist */}
      {(claim.safer_framing || (claim.proof_needed && claim.proof_needed.length > 0)) && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 print:border-black print:bg-white">
          
          {/* Matrix */}
          {claim.safer_framing && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 print:text-black">Original Claim</div>
                <div className="bg-white border border-slate-200 p-4 rounded-md text-sm text-slate-500 line-through decoration-slate-300 print:border-black print:text-black">
                  {claim.original_text}
                </div>
              </div>
              <ArrowRight className="hidden md:block h-5 w-5 text-slate-300 mx-2 print:hidden" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2 print:text-black">Safer Framing</div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-md text-sm text-emerald-900 font-medium print:border-black print:text-black">
                  {claim.safer_framing}
                </div>
              </div>
            </div>
          )}

          {/* Checklist */}
          {claim.proof_needed && claim.proof_needed.length > 0 && (
            <div className={`pt-5 ${claim.safer_framing ? 'border-t border-slate-200 print:border-black' : ''}`}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 print:text-black">Evidence Required</div>
              <ul className="space-y-3">
                {claim.proof_needed.map((proof, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Square className="h-5 w-5 text-slate-300 flex-shrink-0 print:text-black" />
                    <span className="text-sm text-slate-600 pt-0.5 leading-relaxed print:text-black">
                      {proof}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
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
    <div className="fade-up max-w-[1100px] mx-auto bg-white p-4 sm:p-8 font-sans text-slate-900">
      
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">
        
        {/* Sticky Sidebar Outline */}
        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-8">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Contents</div>
            <nav className="space-y-3 font-mono text-xs">
              <a href="#briefing" className="block text-slate-500 hover:text-black transition-colors">01 / Briefing</a>
              <a href="#executive" className="block text-slate-500 hover:text-black transition-colors">02 / Executive Summary</a>
              {audit.claim_audit?.claims?.length > 0 && (
                <a href="#findings" className="block text-slate-500 hover:text-black transition-colors">03 / Claim Findings</a>
              )}
              {audit.industry_benchmarks_table?.length > 0 && (
                <a href="#benchmarks" className="block text-slate-500 hover:text-black transition-colors">04 / Benchmarks</a>
              )}
              <a href="#action-plan" className="block text-slate-500 hover:text-black transition-colors">05 / Action Plan</a>
            </nav>
            
            <div className="mt-12 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              SHA-256 <br/> {publicId || 'LOCAL-DEV'}
            </div>
          </div>
        </aside>

        {/* Main Content Column */}
        <div className="min-w-0">
          <div id="briefing">
            <MissionBriefing audit={audit} createdAt={createdAt} />
          </div>
          
          <div id="executive">
            <VerdictHero audit={audit} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <SectionList title="Report Card" icon={ListChecks} items={audit.report_card} />
              <SectionList title="Support Gaps" icon={AlertOctagon} items={audit.support_gaps} colorClass="text-amber-700" />
            </div>
          </div>

          {audit.claim_audit?.claims?.length > 0 && (
            <div id="findings" className="space-y-6 mb-16">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-8 print:border-black">
                <AlertTriangle className="h-6 w-6 text-slate-900 print:text-black" />
                <h2 className="font-sans text-2xl font-bold">
                  {audit.claim_audit.claims.some(c => c.source_type === 'agent_transcript') 
                    ? 'Agent Guardrail Review' 
                    : 'Claim Findings'}
                </h2>
              </div>
              <p className="text-sm text-slate-500 font-mono mb-6 print:text-black">
                Total {audit.claim_audit.claims.some(c => c.source_type === 'agent_transcript') ? 'Exchanges' : 'Claims'}: {audit.claim_audit.summary.total_claims} | High/Critical Risk: {audit.claim_audit.summary.high_priority_count + audit.claim_audit.summary.critical_priority_count}
              </p>
              <div className="space-y-6">
                {audit.claim_audit.claims.map((claim, i) => (
                  <ClaimFindingCard key={claim.id || i} claim={claim} index={i} />
                ))}
              </div>
            </div>
          )}

          {audit.industry_benchmarks_table?.length > 0 && (
            <div id="benchmarks" className="border border-slate-200 bg-white p-8 rounded-lg overflow-x-auto mb-16 print:border-black">
              <h3 className="font-sans text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="h-5 w-5"/> Industry Benchmarks</h3>
              <table className="w-full text-left text-sm font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] print:border-black print:text-black">
                    <th className="py-3 px-2">Metric</th>
                    <th className="py-3 px-2">This Business</th>
                    <th className="py-3 px-2">Industry Average</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.industry_benchmarks_table.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 print:border-black">
                      <td className="py-4 px-2 font-bold text-slate-900 print:text-black">{row.metric}</td>
                      <td className="py-4 px-2 text-red-600 print:text-black">{row.this_business}</td>
                      <td className="py-4 px-2 text-emerald-700 print:text-black">{row.industry_avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div id="action-plan" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <SectionList title="Action Plan" icon={ListChecks} items={audit.action_plan} />
            <SectionList title="Assumptions to Test" icon={BookOpen} items={audit.assumptions_to_test} />
          </div>

          <div className="mt-6">
            <SectionList title="Recommended Next Steps" icon={TrendingUp} items={audit.recommended_next_steps} />
          </div>

          {showCta && (
            <div className="border border-slate-200 bg-slate-50 p-8 text-center rounded-lg mt-16 print:hidden">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Logo variant="full" height={36} />
              </div>
              <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto font-mono">
                Find the claims your website cannot yet prove — before a prospect, investor, or client does.
              </p>
              <a href="/auditgpt" className="btn-cta text-sm" style={{ width: 'auto', padding: '1rem 2.5rem', display: 'inline-flex' }}>
                RUN YOUR OWN AUDIT <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
