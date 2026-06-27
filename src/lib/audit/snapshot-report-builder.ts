import { simulateAIClaimReadability } from './ai-claim-readability';
import { extractClaims } from './claim-extractor';
import { MANTRA } from './positioning';
import { runTechnicalTrustChecks } from './technical-trust-checks';
import type {
  ClaimFinding,
  DemandLeakageSummary,
  EnhancedSnapshotReport,
  PageInput,
  ProofDensitySummary,
  SaferFramingRecommendation,
  ScrutexityNextStep,
  SnapshotReportOptions,
} from './snapshot-report-model';

// Report builder for the first shippable vertical slice. Keeping orchestration
// here makes future monitoring easier: scheduled jobs can rebuild the same
// report shape and diff claims, proof density, risk, and AI readability over time.
export function buildEnhancedSnapshotReport(
  page: PageInput,
  options: SnapshotReportOptions = { mode: 'free' },
): EnhancedSnapshotReport {
  const claims = extractClaims(page, { maxClaims: options.mode === 'free' ? 6 : 16 });
  const readability = simulateAIClaimReadability({
    page,
    claims,
    competitorUrls: options.competitorUrls,
  });
  const technicalTrustChecks = runTechnicalTrustChecks(page);
  const overallRiskScore = calculateOverallRiskScore(claims);
  const proofDensity = buildProofDensitySummary(claims);
  const demandLeakage = buildDemandLeakageSummary(page);
  const saferFramingRecommendations = buildSaferFramingRecommendations(claims);
  const scrutexityNextSteps = buildScrutexityNextSteps({
    claims,
    proofDensity,
    hasCompetitors: Boolean(options.competitorUrls?.length),
  });
  const summary = buildToplineSummary(overallRiskScore, claims, proofDensity);
  const keyFindings = buildKeyFindings(claims, proofDensity, demandLeakage);

  return {
    url: page.url,
    generatedAt: new Date().toISOString(),
    positioningStatement: MANTRA,
    overallRiskScore,
    summary,
    executiveSummary: {
      overallRiskScore,
      summary,
      keyFindings,
      primaryRecommendation: buildPrimaryRecommendation(overallRiskScore, claims),
    },
    claimInventory: claims,
    aiVisibilitySimulation: readability.simulations,
    entityUnderstandingGaps: readability.entityUnderstandingGaps,
    proofDensity,
    demandLeakage,
    saferFramingRecommendations,
    scrutexityNextSteps,
    technicalTrustChecks,
    competitors: readability.competitorPreviews,
  };
}

function calculateOverallRiskScore(claims: ClaimFinding[]): number {
  if (claims.length === 0) {
    return 24;
  }

  const weights: Record<ClaimFinding['label'], number> = {
    Supported: 12,
    'Weakly Supported': 42,
    Overstated: 76,
    Unsupported: 88,
  };
  const weightedRisk =
    claims.reduce((total, claim) => total + weights[claim.label], 0) / claims.length;

  return Math.max(0, Math.min(100, Math.round(weightedRisk)));
}

function buildToplineSummary(
  riskScore: number,
  claims: ClaimFinding[],
  proofDensity: ProofDensitySummary,
): string {
  const riskyClaims = claims.filter(
    (claim) => claim.label === 'Unsupported' || claim.label === 'Overstated',
  ).length;

  if (claims.length === 0) {
    return 'The page does not surface many explicit buyer-facing claims, which lowers claim risk but may also limit AI readability and buyer confidence. Add precise, evidence-backed claims with visible proof and a clear next step.';
  }

  return `This snapshot found ${claims.length} auditable claim${
    claims.length === 1 ? '' : 's'
  }, including ${riskyClaims} high-risk claim${
    riskyClaims === 1 ? '' : 's'
  }. Overall risk is ${riskScore}/100 because ${proofDensity.summary.toLowerCase()}`;
}

function buildKeyFindings(
  claims: ClaimFinding[],
  proofDensity: ProofDensitySummary,
  demandLeakage: DemandLeakageSummary,
): string[] {
  return [
    claims.length
      ? `${claims.length} buyer-facing claims need claim-to-proof review.`
      : 'The page needs clearer buyer-facing claims before it can be strongly cited or defended.',
    proofDensity.missingSignals.length
      ? `Missing trust signals include ${proofDensity.missingSignals.slice(0, 3).join(', ')}.`
      : 'Visible proof signals are present, but source quality and proximity should still be checked.',
    demandLeakage.summary,
  ];
}

function buildPrimaryRecommendation(riskScore: number, claims: ClaimFinding[]): string {
  if (riskScore >= 70) {
    return 'Prioritize rewriting unsupported or overstated claims before scaling paid traffic, fundraising outreach, or AI visibility work.';
  }

  if (claims.length === 0) {
    return 'Add a small set of specific, evidence-backed claims so buyers and AI systems can understand the offer with confidence.';
  }

  return 'Pair the strongest claims with visible evidence and tighten the next step so the page is easier to trust, cite, and act on.';
}

function buildProofDensitySummary(claims: ClaimFinding[]): ProofDensitySummary {
  const found = new Set(claims.flatMap((claim) => claim.evidenceFound));
  const missing = new Set(claims.flatMap((claim) => claim.evidenceMissing));

  return {
    summary: missing.size
      ? 'the page makes claims that are not yet paired with enough visible, buyer-verifiable proof.'
      : 'the visible claims have some supporting proof, though source quality should still be validated.',
    presentSignals: Array.from(found),
    missingSignals: Array.from(missing),
  };
}

function buildDemandLeakageSummary(page: PageInput): DemandLeakageSummary {
  const hasCta = /\b(book|schedule|get started|start|contact|request|demo|audit|call|buy|apply)\b/i.test(
    page.content,
  );
  const hasBuyerQualifier = /\b(for|built for|designed for|ideal for|teams|founders|agencies|clinics|businesses)\b/i.test(
    page.content,
  );

  return {
    summary: hasCta
      ? 'The page includes a visible next step, but the CTA should stay close to the proof behind the highest-value claims.'
      : 'The page may leak demand because the next step is not explicit in the supplied content.',
    ctaIssues: hasCta
      ? ['Confirm the CTA appears near the highest-stakes claims and proof.']
      : ["Add a clear, low-friction next step tied to the page's strongest supported claim."],
    buyerFriction: hasBuyerQualifier
      ? ['Make sure the intended buyer is named near the proof, not only in broad positioning copy.']
      : ['The intended buyer or use case is not explicit enough for quick trust formation.'],
    recommendedNextSteps: [
      'Place the primary CTA after the strongest supported claim.',
      'Use CTA language that promises the next action, not an unsupported outcome.',
    ],
  };
}

function buildSaferFramingRecommendations(
  claims: ClaimFinding[],
): SaferFramingRecommendation[] {
  return claims
    .filter((claim) => claim.label !== 'Supported')
    .map((claim) => ({
      original: claim.text,
      recommended: claim.saferFraming,
      rationale:
        'Safer framing reduces buyer risk and gives AI systems a more defensible statement to summarize or cite.',
    }));
}

function buildScrutexityNextSteps(input: {
  claims: ClaimFinding[];
  proofDensity: ProofDensitySummary;
  hasCompetitors: boolean;
}): ScrutexityNextStep[] {
  const highRisk = input.claims.some(
    (claim) => claim.label === 'Unsupported' || claim.label === 'Overstated',
  );

  return [
    {
      service: 'Governed Claim Rewrites',
      whyItFits: highRisk
        ? 'Safer claim rewrites will transform risky statements into precise, evidence-aware page copy.'
        : 'Governed claim rewrites will strengthen clear claims with sharper proof placement and buyer context.',
      nextAction: 'Review flagged claims and generate proof-backed alternatives.',
    },
    {
      service: 'AI Answer Reality',
      whyItFits: highRisk
        ? 'A deeper AI Answer Reality report can compare your claim readability against selected competitors.'
        : 'A deeper AI Answer Reality report can show where AI systems understand, cite, or flatten the business.',
      nextAction: 'Run a targeted prompt check on ChatGPT and Perplexity.',
    },
    {
      service: 'Verification & Trust Assets',
      whyItFits: input.proofDensity.missingSignals.length
        ? 'Verification and trust assets will bridge the gap between your claims and your missing proof signals.'
        : 'Existing proof can be organized into stronger, more reusable trust assets.',
      nextAction: 'Compile and link primary evidence to the core value propositions.',
    },
    {
      service: 'Revenue Leakage Insights',
      whyItFits: 'Revenue Leakage Insights are relevant if AI systems, reviews, or search summaries are already misrepresenting the business.',
      nextAction: 'Escalate only when there is visible misdescription, reputational damage, or recurring entity confusion.',
    },
  ];
}
