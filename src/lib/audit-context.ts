// Shared types + helpers across audit, landing-page, strategy, and agent routes.
// Kept server-side only.

export interface Benchmark {
  metric: string;
  this_business: string;
  industry_avg: string;
}

export interface SlopMarkers {
  detected: boolean;
  probability: number; // 0-100
  signals: string[];
  rebuild_recommended: boolean;
}

export interface CompetitorAnalysis {
  summary: string;
  vs_makerpad: string;
  vs_cofounder: string;
  vs_polsia: string;
  vs_nanocorp: string;
  differentiation_angles: string[];
}

export interface AuditResult {
  verdict: string;
  score?: number; // 0-100 integer — primary source of truth (kills the regex parse)
  verdict_header: string;
  grade_stamp: string;
  company_info: string;
  company_name?: string; // clean company name, no hyphens/score/parenthetical
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
  publicId?: string | null;
}

// Shared banned-phrases block + anti-slop rules. Used by every prompt.
export const ANTI_SLOP_PREAMBLE = `## CORE PERSONALITY
- You are a senior analyst at an elite due-diligence firm.
- Tone: deadpan, forensic, precise. Zero cheerleading. Zero meanness for its own sake.
- You respect founders by telling them the unvarnished truth. No metaphors. No sarcasm.

## ABSOLUTE CONSTRAINTS
1. BANNED PHRASES. Forbidden: "great", "exciting", "however", "let's be honest", "the reality is", "delusion", "founder probably believes", any metaphor or simile, "Learn More" (as a CTA). If a sentence feels "inspiring," rewrite it.
2. NO HALLUCINATION. Never invent a number, date, statistic, competitor fact, or financial figure. If something is not in the audit data, scraped content, or hardcoded industry benchmarks, write exactly: "insufficient data".
3. MAXIMUM SENTENCE LENGTH PER FIELD: 2 sentences. No exceptions.
4. EVERY SENTENCE MUST CONTAIN A FACT. A fact is: a number, a proper name, a direct comparison, or a cited benchmark. If a sentence doesn't contain one of these, delete it.
5. IF THE INPUT IS VAGUE, treat it as a red flag and note that ambiguity prevents analysis.

## HARDCODED INDUSTRY BENCHMARKS (use these; never invent)
- SaaS: CAC $200-400, acceptable churn <5% monthly, median ARPU $50-150, LTV/CAC >3
- Marketplace: 90% of marketplaces fail, liquidity threshold typically 1,000 transactions/month, take rate 5-25%, critical mass in supply side required
- Ecommerce: conversion rate 1-3%, average order value $50-100, cart abandonment ~70%, shipping cost main friction
- Creator Economy: median monthly revenue $0-$100, top 1% earn >$10k/month, platform dependency risk
- Indie Games / Playtesting: median indie game revenue <$5k, top 1% >$1M; community-building costs often exceed $10k before launch; PlaytestCloud is an established competitor
- Service Business / Agency: referrals 80%+ of pipeline, average hourly rate $75-150 in US, project success rate tied to scope clarity
- Cross-industry (if industry missing): 20% of new businesses fail in year 1, 50% by year 5 (US BLS data).

## ANTI-SLOP WORKFLOW
1. Before writing any sentence, ask: "What is the fact?" If no fact exists from the audit, scrape, input, or hardcoded benchmarks, write "insufficient data".
2. Run a final scan for any banned phrase. If found, delete the sentence.
3. If a section has no factual content, output an empty array or "insufficient data" - never filler.
4. For "new" path businesses with no website, the audit data is the only fact source. Treat all founder claims as assumptions.`;

// Sanitize user-supplied input to prevent prompt injection.
export function sanitizeInput(input: string, maxLength = 2000): string {
  if (!input) return '';
  let s = input.slice(0, maxLength);
  // Strip common prompt-injection markers
  s = s.replace(/<\|im_start\|>/gi, '');
  s = s.replace(/<\|im_end\|>/gi, '');
  s = s.replace(/\[system\]/gi, '[blocked]');
  s = s.replace(/\[assistant\]/gi, '[blocked]');
  s = s.replace(/```/g, '');
  // Strip control chars
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  return s.trim();
}

// Sanitize an audit JSON object for safe injection into a prompt.
export function auditToContext(audit: AuditResult): string {
  const safe = { ...audit };
  // Defensive: ensure all string fields are strings
  const str = JSON.stringify(safe, null, 2);
  // Cap size to avoid prompt overload
  return str.slice(0, 20000);
}

// Extract JSON from a possibly-fenced LLM response.
export function extractJson(raw: string): string {
  let out = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  const firstBrace = out.indexOf('{');
  const lastBrace = out.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    out = out.slice(firstBrace, lastBrace + 1);
  }
  return out;
}
