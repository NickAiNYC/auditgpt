import type { AuditResult, Claim } from '@/lib/audit-schema';
import { MANTRA } from './positioning';
import type {
  AIVisibilityEngineSimulation,
  ClaimFinding,
  DemandLeakageSummary,
  EnhancedSnapshotReport,
  PageMetadata,
  ProofDensitySummary,
  SaferFramingRecommendation,
  ScrutexityNextStep,
  TechnicalTrustCheck,
} from './snapshot-report-model';

export interface SnapshotReportAdapterInput {
  audit: AuditResult;
  url: string;
  metadata?: PageMetadata;
  generatedAt?: Date;
  competitorUrls?: string[];
}

export function enhancedSnapshotFromAuditResult({
  audit,
  url,
  metadata,
  generatedAt,
  competitorUrls,
}: SnapshotReportAdapterInput): EnhancedSnapshotReport {
  const claimInventory = audit.claim_audit.claims.map(mapClaim);
  const overallRiskScore = riskFromSupportScore(audit.claim_audit.summary.claim_support_score);
  const proofDensity = buildProofDensity(audit.claim_audit.claims);
  const demandLeakage = buildDemandLeakage(audit);
  const aiVisibilitySimulation = (audit as any).aiVisibilitySimulation || buildAiSimulation({
    audit,
    claimInventory,
    metadata,
  });
  const entityUnderstandingGaps = (audit as any).entityUnderstandingGaps || buildEntityGaps(audit, metadata);
  const saferFramingRecommendations = claimInventory
    .filter((claim) => claim.label !== 'Supported')
    .map(
      (claim): SaferFramingRecommendation => ({
        original: claim.text,
        recommended: claim.saferFraming,
        rationale:
          'This rewrite lowers claim risk while giving buyers, investors, and AI systems a more defensible statement to evaluate.',
      }),
    );

  return {
    url,
    generatedAt: (generatedAt ?? new Date()).toISOString(),
    positioningStatement: MANTRA,
    overallRiskScore,
    summary:
      audit.claim_audit.summary.executive_summary ||
      'This snapshot reviews public claims, proof visibility, AI readability, and buyer next-step clarity.',
    executiveSummary: {
      overallRiskScore,
      summary:
        audit.claim_audit.summary.executive_summary ||
        'This page needs clearer claim-to-proof alignment before the strongest statements are easy to trust or cite.',
      keyFindings: [
        `${audit.claim_audit.summary.total_claims} buyer-facing claims reviewed.`,
        `${audit.claim_audit.summary.weakly_supported_count + audit.claim_audit.summary.unsupported_count + audit.claim_audit.summary.overstated_count} claims need stronger support, softer framing, or clearer proof proximity.`,
        demandLeakage.summary,
      ],
      primaryRecommendation: buildPrimaryRecommendation(overallRiskScore),
    },
    claimInventory,
    aiVisibilitySimulation,
    entityUnderstandingGaps,
    proofDensity,
    demandLeakage,
    saferFramingRecommendations,
    scrutexityNextSteps: buildScrutexityNextSteps(overallRiskScore),
    technicalTrustChecks: buildTechnicalTrustChecks(audit, metadata),
    competitors: (competitorUrls ?? []).slice(0, 3).map((competitorUrl) => ({
      url: competitorUrl,
      claimStrengthSummary:
        'Preview only: full competitor scoring compares claim support, proof proximity, and safer framing opportunities.',
      proofDensitySummary:
        'Preview only: paid comparison checks whether competitor claims are easier to verify from visible proof.',
      trustSignalSummary:
        'Preview only: paid comparison maps testimonials, credentials, source attribution, and third-party proof.',
      aiVisibilitySummary:
        'Preview only: paid comparison estimates which page is easier for answer engines to understand and cite.',
      availability: 'Preview',
    })),
  };
}

function mapClaim(claim: Claim): ClaimFinding {
  return {
    id: claim.id,
    text: claim.original_text,
    label: mapClaimStatus(claim.claim_status),
    evidenceFound:
      claim.visible_evidence && !claim.visible_evidence.toLowerCase().startsWith('no ')
        ? [claim.visible_evidence]
        : [],
    evidenceMissing: [
      claim.support_gap,
      claim.evidence_needed,
      ...claim.proof_needed,
    ].filter(Boolean),
    riskToBuyer: claim.trust_gap || claim.business_impact,
    riskToInvestorOrAiSystem:
      claim.positioning_risk ||
      'AI systems may avoid citing this claim if the supporting evidence is unclear or distant from the statement.',
    saferFraming: claim.safer_framing,
    confidenceScore: priorityToConfidence(claim.priority),
    locations: [claim.original_text],
  };
}

function mapClaimStatus(status: Claim['claim_status']): ClaimFinding['label'] {
  switch (status) {
    case 'verified':
      return 'Supported';
    case 'weakly_supported':
    case 'insufficient_public_evidence':
      return 'Weakly Supported';
    case 'overstated':
      return 'Overstated';
    default:
      return 'Unsupported';
  }
}

function priorityToConfidence(priority: Claim['priority']): number {
  switch (priority) {
    case 'critical':
      return 92;
    case 'high':
      return 82;
    case 'medium':
      return 58;
    default:
      return 34;
  }
}

function riskFromSupportScore(score: number): number {
  return Math.max(0, Math.min(100, 100 - Math.round(score || 0)));
}

function buildProofDensity(claims: Claim[]): ProofDensitySummary {
  const presentSignals = claims
    .map((claim) => claim.visible_evidence)
    .filter((item) => item && !item.toLowerCase().startsWith('no '));
  const missingSignals = [
    ...new Set(
      claims.flatMap((claim) => [
        claim.support_gap,
        claim.evidence_needed,
        ...claim.proof_needed,
      ]),
    ),
  ].filter(Boolean);

  return {
    summary: missingSignals.length
      ? 'The page has proof gaps that weaken buyer trust and AI citation confidence.'
      : 'The page shows visible proof signals, but source quality and placement should still be reviewed.',
    presentSignals,
    missingSignals,
  };
}

function buildDemandLeakage(audit: AuditResult): DemandLeakageSummary {
  const nextSteps = audit.recommended_next_steps.length
    ? audit.recommended_next_steps
    : audit.action_plan;

  return {
    summary:
      nextSteps.length > 0
        ? 'The page has an action path, but the next step should sit closer to the strongest supported claim.'
        : 'The page may leak demand because the buyer next step is not clear from the report output.',
    ctaIssues: audit.website_fixes.slice(0, 3),
    buyerFriction: audit.assumptions_to_test.slice(0, 3),
    recommendedNextSteps: nextSteps.slice(0, 3),
  };
}

function buildAiSimulation({
  audit,
  claimInventory,
  metadata,
}: {
  audit: AuditResult;
  claimInventory: ClaimFinding[];
  metadata?: PageMetadata;
}): AIVisibilityEngineSimulation[] {
  const riskyCount = claimInventory.filter(
    (claim) => claim.label === 'Unsupported' || claim.label === 'Overstated',
  ).length;
  const entityName = metadata?.organizationName || metadata?.productName || 'the business';
  const citationLikelihood = riskyCount > 2 ? 'Low' : riskyCount > 0 ? 'Medium' : 'High';

  return ['ChatGPT', 'Perplexity', 'Gemini', 'Google AIO'].map((engine) => ({
    engine: engine as AIVisibilityEngineSimulation['engine'],
    simulatedDescription: `${engine} may describe ${entityName} using the broad verdict "${audit.verdict_header}" but will likely qualify or omit claims that lack nearby proof.`,
    citationLikelihood,
    strengths: [
      'The audit identifies explicit buyer-facing claims that can be rewritten, supported, or monitored.',
      'The report separates claim support from general visibility advice, preserving Claim Intelligence positioning.',
    ],
    weaknesses: [
      riskyCount
        ? `${riskyCount} claim${riskyCount === 1 ? '' : 's'} may be difficult for AI systems to cite confidently.`
        : 'Citation confidence still depends on proof quality, source attribution, and page-level entity clarity.',
      'If entity details, proof, and CTAs are separated, AI systems may flatten the offer into a generic category.',
    ],
    entityGaps: buildEntityGaps(audit, metadata).slice(0, 3),
  }));
}

function buildEntityGaps(audit: AuditResult, metadata?: PageMetadata): string[] {
  const gaps: string[] = [];

  if (!metadata?.organizationName) {
    gaps.push('The organization name should be stated consistently near the offer and proof.');
  }
  if (!metadata?.productName) {
    gaps.push('The product or service name may need clearer repetition so AI systems do not collapse it into a generic category.');
  }
  if (audit.support_gaps.length > 0) {
    gaps.push('Support gaps make it harder for answer engines to pair claims with source-level proof.');
  }

  return gaps.length
    ? gaps
    : ['Core entity understanding appears reasonable; stronger claim-to-proof pairing would improve citation confidence.'];
}

function buildTechnicalTrustChecks(
  audit: AuditResult,
  metadata?: PageMetadata,
): TechnicalTrustCheck[] {
  return [
    {
      id: 'entity-clarity',
      label: 'Entity Clarity',
      status: metadata?.organizationName ? 'Pass' : 'Concern',
      finding: metadata?.organizationName
        ? `Organization identified as ${metadata.organizationName}.`
        : 'The organization entity is not explicit in the stored report metadata.',
      claimIntelligenceImpact:
        'Entity clarity helps buyers and AI systems connect claims to the correct business.',
      recommendedFix:
        'Name the organization, offer, and audience near the strongest proof-backed claim.',
    },
    {
      id: 'proof-proximity',
      label: 'Proof Proximity',
      status: audit.support_gaps.length ? 'Concern' : 'Pass',
      finding: audit.support_gaps[0] || 'No major support gap was surfaced in the report card.',
      claimIntelligenceImpact:
        'Proof must sit close enough to the claim for buyers, investors, and AI systems to evaluate it without inference.',
      recommendedFix:
        'Move proof, citations, testimonials, credentials, or examples directly beside the claims they support.',
    },
    {
      id: 'cta-clarity',
      label: 'Next-Step Clarity',
      status: audit.recommended_next_steps.length ? 'Pass' : 'Concern',
      finding: audit.recommended_next_steps[0] || 'No clear recommended next step was present.',
      claimIntelligenceImpact:
        'Clear next steps reduce demand leakage after a buyer has inspected the claim and proof.',
      recommendedFix:
        'Place one low-friction CTA after the strongest supported claim.',
    },
  ];
}

function buildPrimaryRecommendation(overallRiskScore: number): string {
  if (overallRiskScore >= 70) {
    return 'Rewrite high-risk claims and add visible proof before scaling AI visibility or paid acquisition.';
  }

  if (overallRiskScore >= 40) {
    return 'Strengthen proof placement and safer framing so the page is easier for buyers and AI systems to trust.';
  }

  return 'Use the strongest supported claims as reusable proof assets across Governed Claim Rewrites, AI Answer Reality, and Verification workflows.';
}

function buildScrutexityNextSteps(overallRiskScore: number): ScrutexityNextStep[] {
  return [
    {
      service: 'Governed Claim Rewrites',
      whyItFits:
        overallRiskScore >= 40
          ? 'The page needs safer claim language and tighter proof placement.'
          : 'Clear claims can still benefit from sharper framing and better buyer context.',
      nextAction: 'Rewrite the highest-risk sections into proof-aware website copy.',
    },
    {
      service: 'AI Answer Reality',
      whyItFits:
        'A deeper simulation can check if AI search engines correctly understand the entity and its proof points.',
      nextAction: 'Run a targeted prompt check on ChatGPT and Perplexity.',
    },
    {
      service: 'Revenue Leakage Insights',
      whyItFits:
        'Use Revenue Leakage Insights only if AI systems or public summaries are already misdescribing the business.',
      nextAction: 'Map and review any active demand recovery paths.',
    },
    {
      service: 'Verification & Trust Assets',
      whyItFits:
        'The strongest claims need durable proof assets such as testimonials, reviews, credentials, and source-backed examples.',
      nextAction: 'Map proof assets to each important buyer-facing claim.',
    },
  ];
}
