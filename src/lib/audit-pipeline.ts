// ============================================================
// AuditGPT — Audit Pipeline (Proof-Backed Claim Cleanup Engine)
// ============================================================
import { callLLM as routerCallLLM } from '@/lib/llm-provider';
import { fetchPublicHtml, normalizePublicHttpUrl } from '@/lib/safe-fetch';
import { sanitizeInput, extractJson } from '@/lib/audit-context';
import { AuditResultSchema, type AuditResult } from '@/lib/audit-schema';

// ──────────────────────────────────────────────────────────────
// Scraping
// ──────────────────────────────────────────────────────────────

export interface ScrapedSite {
  url: string;
  title: string;
  description: string;
  headings: string[];
  paragraphs: string[];
  links: { text: string; href: string }[];
  rawText: string;
  fetchError?: string;
}

export function normalizeUrl(input: string): string {
  if (!input.trim()) return '';
  try {
    return normalizePublicHttpUrl(input).toString();
  } catch {
    return '';
  }
}

export function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMatches(html: string, regex: RegExp, limit = 50): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(regex.source, regex.flags);
  while ((m = re.exec(html)) !== null && out.length < limit) {
    const text = stripTags(m[1] || m[0]);
    if (text.length > 1 && text.length < 400) out.push(text);
  }
  return out;
}

export async function scrapeSite(rawUrl: string): Promise<ScrapedSite> {
  const url = normalizeUrl(rawUrl);
  const empty: ScrapedSite = { url, title: '', description: '', headings: [], paragraphs: [], links: [], rawText: '' };
  if (!url) return { ...empty, fetchError: 'No URL provided' };

  try {
    const fetched = await fetchPublicHtml(url);
    const html = fetched.html;
    empty.url = fetched.url;

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : '';

    let description = '';
    const descMatch = html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["'](?:description|og:description)["']/i);
    if (descMatch) description = stripTags(descMatch[1]);

    const headings = [
      ...extractMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi, 5),
      ...extractMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 25),
      ...extractMatches(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi, 25),
    ];
    const paragraphs = extractMatches(html, /<p[^>]*>([\s\S]*?)<\/p>/gi, 40).filter((p) => p.length > 40);

    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    const links: { text: string; href: string }[] = [];
    let lm: RegExpExecArray | null;
    const lre = new RegExp(linkRegex.source, 'gi');
    while ((lm = lre.exec(html)) !== null && links.length < 40) {
      const href = lm[1];
      const text = stripTags(lm[2]).slice(0, 80);
      if (text && href && !href.startsWith('javascript:') && !href.startsWith('#')) links.push({ text, href });
    }
    const rawText = stripTags(html).slice(0, 8000);
    return { url: fetched.url, title, description, headings, paragraphs, links, rawText };
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string };
    return { ...empty, fetchError: e?.name === 'AbortError' ? 'Timeout' : e?.message || 'Fetch failed' };
  }
}

// ──────────────────────────────────────────────────────────────
// Prompts
// ──────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are AuditGPT, an evidence-grounded Claim Intelligence engine. You live at auditgpt.ai. Your mission: deliver a ruthless, hallucination-free, proof-backed audit of a business's public claims, positioning, and trust signals. You identify public claims that need stronger proof, clearer support, or safer framing, and you hand back a real, prioritized plan.

## CORE PERSONALITY
- Deadpan, evidence-based, terse. Ruthless about the business, never about the person.
- Every word must carry a verifiable fact or it dies.
- Never use filler. Never cheerlead. Never invent.

## SAFETY BOUNDARY (UNBREAKABLE)
- This is a business, marketing, positioning, and trust audit ONLY.
- NEVER frame a finding as legal, regulatory, FTC, enforcement, liability, lawsuit, fine, illegal, violation, clinical, medical, or compliance exposure.
- NEVER say a claim is "false," "fraud," "scam," "illegal," or "non-compliant."
- Report missing proof as a SUPPORT GAP or VISIBILITY GAP — what a buyer cannot verify from public content — not as a verdict that any claim is untrue.
- Banned words in output: FTC, enforcement, liability, lawsuit, fined, illegal, violation, "legal exposure", "compliance verified", "compliant rewrite", "Slop Detected", and any named-competitor attack. (Exception: a literal "not legal advice" disclaimer.)

## UNBREAKABLE RULES

### 1. FACT ANCHOR
Every factual claim must be traceable to the scraped_content, focus_notes, or hardcoded industry benchmarks.
If a fact cannot be anchored, write exactly "insufficient data". You never invent a number, date, statistic, or competitor fact.

### 2. BANNED FILLER
FORBIDDEN: "great", "exciting", "however", "let's be honest", "the reality is", "delusion", "founder probably believes", any metaphor/simile. Also banned: "robust", "cutting-edge", "innovative", "revolutionary" unless verbatim in scraped content.

### 3. SENTENCE CAP
Maximum 2 sentences per field. If you need more, you're padding.

### 4. HARDCODED INDUSTRY BENCHMARKS
Use these when relevant. Never invent a benchmark.
- SaaS: CAC $200-400, churn <5%/mo, ARPU $50-150, LTV/CAC >3
- Ecommerce: conversion 1-3%, AOV $50-100, cart abandonment ~70%
- Cross-industry: 20% of new businesses fail in Y1, 50% by Y5 (US BLS data)

### 5. THE FOUR-QUESTION CLAIM FRAMEWORK
For every business claim you find:
1. What exactly is being claimed?
2. What public evidence supports it (visible_evidence)?
3. What support gap remains (support_gap) and what evidence would close it (evidence_needed)?
4. What is the safer, provable framing (safer_framing)?
Use disciplined language: "Unsupported based on public evidence", "Potentially overstated".

### 6. BUSINESS-IMPACT FRAMING
For every high-priority claim, state the business_impact (trust/conversion), the trust_gap, and any positioning_risk. Frame every finding as an opportunity for stronger proof, clearer positioning, or safer framing — never as risk of penalty.

### 7. SAFER FRAMING
For every unsupported/overstated claim, produce safer_framing: exact replacement text that closes the support gap — concrete, shorter than the original, and fully provable.

### 8. BADGE LOGIC
- Green: no critical/high-priority claims; <=3 medium.
- Amber: 1-3 high-priority claims.
- Red: any critical-priority claim.

## OUTPUT FORMAT
Output raw JSON exactly matching this structure (no code fences):
{
  "audited_by": "auditgpt.ai",
  "verdict": "A+ / A / B / C / D / F",
  "verdict_header": "Company Name – Category-Based Judgment (Score/100)",
  "grade_stamp": "Same as verdict",
  "company_info": "Founded in X (or insufficient data)...",
  "report_card": ["Fact 1", "Fact 2"],
  "support_gaps": ["Support gap 1"],
  "assumptions_to_test": ["Assumption 1"],
  "website_fixes": ["Fix 1"],
  "recommended_next_steps": ["Next step 1"],
  "action_plan": ["Step 1"],
  "industry_benchmarks_table": [{"metric": "", "this_business": "", "industry_avg": ""}],
  "claim_audit": {
    "summary": { "total_claims": 0, "verified_count": 0, "weakly_supported_count": 0, "unsupported_count": 0, "overstated_count": 0, "insufficient_public_evidence_count": 0, "high_priority_count": 0, "critical_priority_count": 0, "claim_support_score": 0, "executive_summary": "" },
    "claims": [{ "id": "claim-001", "original_text": "", "normalized_claim": "", "source_url": "", "source_type": "homepage", "claim_type": "performance", "claim_status": "unsupported", "priority": "high", "visible_evidence": "", "support_gap": "", "evidence_needed": "", "business_impact": "", "trust_gap": "", "positioning_risk": "", "safer_framing": "", "proof_needed": [], "recommended_next_step": "add_proof" }]
  },
  "badge_eligibility": { "eligible": true, "badge_level": "green", "badge_label": "", "public_verification_url": "" },
  "disclaimer": "Business and marketing audit only. Not legal, medical, regulatory, or compliance advice. Missing evidence is reported as a visibility gap, not a finding of falsity."
}
`;

const AGENT_SYSTEM_PROMPT = `You are AuditGPT, the most accurate, fact-backed business audit engine ever built. You live at auditgpt.ai. Your mission: evaluate AI agent transcripts for unsupported claims, unsafe promises, missing escalations, and policy drift.

## CORE PERSONALITY
- Deadpan, evidence-based, terse. You are the truth. No encouragement, no meanness.
- Every word must carry a verifiable fact or it dies.

## UNBREAKABLE RULES

### 1. TRANSCRIPT ANALYSIS
Parse the provided agent transcript into individual agent-user exchanges.
For each exchange, identify what the user asked, what the agent responded, and if the response contains any unsupported claim, unsafe promise, missing escalation, or policy drift.

### 2. CLASSIFICATION
Classify findings strictly into one of the following claim_types: 
- "unsupported_claim": agent stated a fact or capability without evidence.
- "forbidden_promise": agent made a guarantee, medical claim, legal conclusion, or revenue claim.
- "missing_escalation": agent should have escalated to a human or asked for consent but did not.
- "data_collection_risk": agent asked for personal info without proper notice.
- "policy_drift": agent contradicted the business's stated policy or brand voice.
If none apply, mark it "agent_response" with status "verified".

### 3. REQUIRED FIELDS
- "source_type" MUST be "agent_transcript".
- "claim_type" MUST be one of the classifications above.
- "support_gap" describes what proof or escalation the response was missing. Never frame it as legal/regulatory/FTC/liability risk.

### 4. SAFER FRAMING
For every flagged exchange, produce safer_framing: exact replacement text for the agent's response that closes the gap, is concrete, and fully provable.

### 5. SAFETY BOUNDARY
Same as the website audit: no FTC / enforcement / liability / lawsuit / illegal / compliance language. Report gaps as support/trust gaps, not penalties.

### 6. OUTPUT FORMAT
Output raw JSON exactly matching this structure (no code fences):
{
  "audited_by": "auditgpt.ai",
  "verdict": "A+ / A / B / C / D / F",
  "verdict_header": "Agent Guardrail Audit Report",
  "grade_stamp": "Same as verdict",
  "company_info": "Agent Guardrail analysis based on transcript...",
  "report_card": ["Fact 1", "Fact 2"],
  "support_gaps": ["Support gap 1"],
  "assumptions_to_test": ["Assumption 1"],
  "website_fixes": ["Fix 1"],
  "recommended_next_steps": ["Next step 1"],
  "action_plan": ["Step 1"],
  "industry_benchmarks_table": [],
  "claim_audit": {
    "summary": { "total_claims": 0, "verified_count": 0, "weakly_supported_count": 0, "unsupported_count": 0, "overstated_count": 0, "insufficient_public_evidence_count": 0, "high_priority_count": 0, "critical_priority_count": 0, "claim_support_score": 0, "executive_summary": "" },
    "claims": [{ "id": "claim-001", "original_text": "User: X\\nAgent: Y", "normalized_claim": "", "source_url": "", "source_type": "agent_transcript", "claim_type": "forbidden_promise", "claim_status": "unsupported", "priority": "high", "visible_evidence": "", "support_gap": "Missing escalation", "evidence_needed": "", "business_impact": "", "trust_gap": "", "positioning_risk": "", "safer_framing": "", "proof_needed": [], "recommended_next_step": "requires_review" }]
  },
  "badge_eligibility": { "eligible": true, "badge_level": "green", "badge_label": "", "public_verification_url": "" },
  "disclaimer": "Agent transcript audit only. Not legal, medical, regulatory, or compliance advice. Gaps are reported as support and trust gaps, not penalties."
}
`;

function buildPrompt(opts: {
  auditType: string;
  inputType?: string;
  transcript?: string;
  company: { name?: string; websiteUrl: string; industry?: string };
  focusNotes?: string;
  scraped: ScrapedSite;
}): { system: string; user: string } {
  let scrapedBlock = '';
  if (opts.inputType === 'agent_transcript' && opts.transcript) {
    scrapedBlock = JSON.stringify({ transcript: opts.transcript });
  } else {
    scrapedBlock = opts.scraped.fetchError
      ? `{ "title": "(scrape failed: ${opts.scraped.fetchError})", "metaDescription": "", "headings": [], "paragraphs": [], "links": [] }`
      : `{
  "title": ${JSON.stringify(opts.scraped.title || '')},
  "metaDescription": ${JSON.stringify(opts.scraped.description || '')},
  "headings": ${JSON.stringify(opts.scraped.headings.slice(0, 30))},
  "paragraphs": ${JSON.stringify(opts.scraped.paragraphs.slice(0, 20))},
  "links": ${JSON.stringify(opts.scraped.links.slice(0, 25).map((l) => ({ text: l.text, href: l.href })))}
}`;
  }

  const user = `Run the audit now. Input:

{
  "path": ${JSON.stringify(opts.auditType)},
  "company_name": ${JSON.stringify(opts.company.name || '')},
  "website_url": ${JSON.stringify(opts.company.websiteUrl)},
  "industry": ${JSON.stringify(opts.company.industry || '')},
  "focus_notes": ${JSON.stringify(opts.focusNotes || '')},
  "scraped_content": ${scrapedBlock}
}

Return ONLY the JSON object.`;

  const system = opts.inputType === 'agent_transcript' ? AGENT_SYSTEM_PROMPT : SYSTEM_PROMPT;
  return { system, user };
}

function repairPrompt(prev: string, errors: string[]): string {
  return `Your previous output did not match the required schema. Fix it and return ONLY valid JSON matching the schema.
VALIDATION ERRORS:
${errors.slice(0, 20).map((e, i) => `${i + 1}. ${e}`).join('\n')}
PREVIOUS OUTPUT (truncated):
${prev.slice(0, 4000)}
Output ONLY the corrected JSON object.`;
}

// ──────────────────────────────────────────────────────────────
// LLM call
// ──────────────────────────────────────────────────────────────

async function callLLM(system: string, user: string): Promise<string> {
  const result = await routerCallLLM({ system, user, temperature: 0.1 });
  return result.text;
}

// ──────────────────────────────────────────────────────────────
// Public entry point
// ──────────────────────────────────────────────────────────────

export interface RunAuditParams {
  auditType: string;
  websiteUrl: string;
  companyName?: string;
  industry?: string;
  companyType?: string;
  focusNotes?: string;
  inputType?: string;
  transcript?: string;
  preScraped?: ScrapedSite;
}

export interface RunAuditResult {
  parsed: AuditResult;
  scraped: ScrapedSite;
}

export function fallbackAuditResult(input: {
  companyName?: string;
  websiteUrl?: string;
  reason?: string;
}): AuditResult {
  const companyName = sanitizeInput(input.companyName || 'Submitted website', 120) || 'Submitted website';
  const websiteUrl = sanitizeInput(input.websiteUrl || '', 300);
  const reason = sanitizeInput(input.reason || 'The live audit provider is not configured or returned an error.', 300);

  return {
    audited_by: 'auditgpt.ai',
    verdict: 'Pending',
    verdict_header: `${companyName} - Claim Review Pending`,
    grade_stamp: 'Pending',
    company_info: 'Insufficient data until a live claim review completes.',
    report_card: [
      reason,
      websiteUrl ? `Submitted URL: ${websiteUrl}` : 'No public URL available.',
    ],
    support_gaps: ['Live claim review has not completed yet.'],
    assumptions_to_test: ['Visible claims, evidence, support gaps, and safer framing need live review.'],
    website_fixes: ['Run the claim review after LLM provider credentials are configured.'],
    recommended_next_steps: ['Configure an LLM provider or use the sample report while testing locally.'],
    action_plan: ['Set the required provider API key, rerun the audit, and review the generated claim findings.'],
    industry_benchmarks_table: [],
    claim_audit: {
      summary: {
        total_claims: 1,
        verified_count: 0,
        weakly_supported_count: 0,
        unsupported_count: 0,
        overstated_count: 0,
        insufficient_public_evidence_count: 1,
        high_priority_count: 0,
        critical_priority_count: 0,
        claim_support_score: 0,
        executive_summary: 'Live claim review is pending. No buyer-facing claim should be treated as reviewed yet.',
      },
      claims: [
        {
          id: 'claim-001',
          original_text: 'Live claim review pending',
          normalized_claim: 'AuditGPT could not complete live claim extraction in this environment.',
          source_url: websiteUrl,
          source_type: 'homepage',
          claim_type: 'other',
          claim_status: 'insufficient_public_evidence',
          priority: 'medium',
          visible_evidence: 'Insufficient data.',
          support_gap: reason,
          evidence_needed: 'A configured LLM provider and a reachable public website.',
          business_impact: 'The user can still see a safe placeholder instead of a crashed audit flow.',
          trust_gap: 'No claim has been verified or reviewed yet.',
          positioning_risk: 'Publishing this placeholder as a finished audit would be misleading.',
          safer_framing: 'Claim review pending configuration.',
          proof_needed: ['Configured LLM provider', 'Reachable website URL'],
          recommended_next_step: 'requires_review',
        },
      ],
    },
    badge_eligibility: {
      eligible: false,
      badge_level: 'ineligible',
      badge_label: 'Review Pending',
      public_verification_url: '',
    },
    disclaimer: 'Business and marketing audit only. Not legal, medical, regulatory, or compliance advice. Missing evidence is reported as a visibility gap, not a finding of falsity.',
  };
}

export async function runAuditPipeline(params: RunAuditParams): Promise<RunAuditResult> {
  let scraped: ScrapedSite;
  if (params.inputType === 'agent_transcript') {
    scraped = { url: params.websiteUrl || 'transcript', title: 'Agent Transcript', description: '', headings: [], paragraphs: [], links: [], rawText: params.transcript || '' };
  } else {
    scraped = params.preScraped
      ? params.preScraped
      : params.websiteUrl
        ? await scrapeSite(params.websiteUrl)
        : { url: '', title: '', description: '', headings: [], paragraphs: [], links: [], rawText: '', fetchError: 'No URL provided' };
  }

  const company = {
    name: sanitizeInput(params.companyName || scraped.title || '', 200) || undefined,
    websiteUrl: scraped.url || params.websiteUrl,
    industry: sanitizeInput(params.industry || '', 200) || undefined,
  };

  const { system, user } = buildPrompt({
    auditType: params.auditType,
    inputType: params.inputType,
    transcript: params.transcript,
    company,
    focusNotes: sanitizeInput(params.focusNotes || '', 1500),
    scraped,
  });

  try {
    const raw1 = await callLLM(system, user);
    const json1 = extractJson(raw1);
    let parsed: unknown;
    try {
      parsed = JSON.parse(json1);
    } catch {
      const repair = await callLLM(system, repairPrompt(raw1, ['Output was not valid JSON. Return ONLY a JSON object.']));
      parsed = JSON.parse(extractJson(repair));
    }

    let validation = AuditResultSchema.safeParse(parsed);
    if (!validation.success) {
      const errors = validation.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`);
      const repair = await callLLM(system, repairPrompt(JSON.stringify(parsed, null, 2), errors));
      parsed = JSON.parse(extractJson(repair));
      validation = AuditResultSchema.safeParse(parsed);
    }

    if (!validation.success) {
      const errors = validation.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`);
      throw new Error(`Audit output failed schema validation after repair: ${errors.slice(0, 5).join('; ')}`);
    }

    return { parsed: validation.data, scraped };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Live audit provider returned an unknown error.';
    console.error('Audit pipeline degraded to fallback:', message);
    return {
      parsed: fallbackAuditResult({
        companyName: company.name,
        websiteUrl: company.websiteUrl,
        reason: message,
      }),
      scraped,
    };
  }
}
