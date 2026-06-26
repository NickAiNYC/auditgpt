import { z } from 'zod';

// ============================================================
// AuditGPT — Claim Intelligence Schema (Scrutexity doctrine)
// ============================================================
// This schema speaks Claim Intelligence: support gaps, evidence
// needed, trust gaps, positioning risk, safer framing. It does NOT
// speak FTC / legal-threat / enforcement / slop / Polsia language.
// Findings are reported as support/visibility/trust gaps, never as
// legal, regulatory, clinical, or compliance verdicts.

export const ClaimSchema = z.object({
  id: z.string(),
  original_text: z.string(),
  normalized_claim: z.string(),
  source_url: z.string(),
  source_type: z.enum([
    'homepage', 'about', 'pricing', 'product', 'security',
    'case_study', 'founder_post', 'press', 'review_surface', 'other',
    'agent_transcript'
  ]),
  claim_type: z.enum([
    'ai_capability', 'performance', 'security',
    'revenue', 'customer_proof', 'market_leadership',
    'guarantee', 'integration', 'support', 'other',
    'agent_response', 'unsupported_claim', 'forbidden_promise',
    'missing_escalation', 'data_collection_risk', 'policy_drift'
  ]),
  // Claim Intelligence status (no legal/compliance verdicts)
  claim_status: z.enum([
    'verified', 'weakly_supported', 'unsupported', 'overstated',
    'insufficient_public_evidence', 'expired', 'changed', 'revoked'
  ]),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  visible_evidence: z.string(),     // what proof IS visible on the page
  support_gap: z.string(),          // what's missing between claim and proof
  evidence_needed: z.string(),      // what would close the gap
  business_impact: z.string(),      // why this matters commercially (trust/conversion)
  trust_gap: z.string(),            // how this weakens patient/buyer trust
  positioning_risk: z.string(),     // how this blurs differentiation
  safer_framing: z.string(),        // a safer, provable rewrite
  proof_needed: z.array(z.string()),
  recommended_next_step: z.enum([
    'keep', 'soften', 'add_proof', 'rewrite', 'remove',
    'split_claim', 'requires_review', 'monitor'
  ]),
});

export const ClaimAuditSummarySchema = z.object({
  total_claims: z.number(),
  verified_count: z.number(),
  weakly_supported_count: z.number(),
  unsupported_count: z.number(),
  overstated_count: z.number(),
  insufficient_public_evidence_count: z.number(),
  high_priority_count: z.number(),
  critical_priority_count: z.number(),
  claim_support_score: z.number(),
  executive_summary: z.string(),
});

export const ClaimAuditSchema = z.object({
  summary: ClaimAuditSummarySchema,
  claims: z.array(ClaimSchema),
});

export const BadgeEligibilitySchema = z.object({
  eligible: z.boolean(),
  badge_level: z.enum(['green', 'amber', 'red', 'ineligible']),
  badge_label: z.string(),
  public_verification_url: z.string(),
});

export const IndustryBenchmarkSchema = z.object({
  metric: z.string(),
  this_business: z.string(),
  industry_avg: z.string(),
});

export const AuditResultSchema = z.object({
  audited_by: z.literal("auditgpt.ai"),
  verdict: z.string(),
  verdict_header: z.string(),
  grade_stamp: z.string(),
  company_info: z.string(),
  report_card: z.array(z.string()),       // factual observations
  support_gaps: z.array(z.string()),      // (was red_flags) claim/trust gaps
  assumptions_to_test: z.array(z.string()),
  website_fixes: z.array(z.string()),
  recommended_next_steps: z.array(z.string()), // (was services_to_hire)
  action_plan: z.array(z.string()),
  industry_benchmarks_table: z.array(IndustryBenchmarkSchema),
  claim_audit: ClaimAuditSchema,
  badge_eligibility: BadgeEligibilitySchema,
  disclaimer: z.string(),                 // safe-scope disclaimer
});

export type AuditResult = z.infer<typeof AuditResultSchema>;
export type Claim = z.infer<typeof ClaimSchema>;

export interface ValidationOutcome {
  ok: boolean;
  data?: AuditResult;
  errors?: string[];
}

export function validateAuditResult(input: unknown): ValidationOutcome {
  const parsed = AuditResultSchema.safeParse(input);
  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }
  const errors = parsed.error.issues.map(
    (issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`,
  );
  return { ok: false, errors };
}
