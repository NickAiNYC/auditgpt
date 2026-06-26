import { AI_ENGINES, MANTRA, TONE_GUIDELINES } from './positioning';
import type {
  AIEngineName,
  AIVisibilityEngineSimulation,
  ClaimFinding,
  CompetitorPreview,
  PageInput,
} from './snapshot-report-model';

export interface AIClaimReadabilityInput {
  page: PageInput;
  claims: ClaimFinding[];
  competitorUrls?: string[];
}

export interface StructuredSimulationPrompt {
  system: string;
  user: string;
}

export interface AIClaimReadabilityResult {
  simulations: AIVisibilityEngineSimulation[];
  entityUnderstandingGaps: string[];
  competitorPreviews: CompetitorPreview[];
  prompt: StructuredSimulationPrompt;
}

// Business rationale: this prompt treats AI engines as claim readers and citation
// filters, not as ranking systems. That keeps AuditGPT anchored in Claim
// Intelligence while still addressing the 2026 AI visibility buying trigger.
export function buildAIClaimReadabilityPrompt(
  input: AIClaimReadabilityInput,
): StructuredSimulationPrompt {
  const claimLines = input.claims
    .map((claim) => `- [${claim.label}] ${claim.text}`)
    .join('\n');

  return {
    system: [
      'You are AuditGPT by Scrutexity, a Claim Intelligence analyst.',
      `Positioning: ${MANTRA}`,
      `Tone: ${TONE_GUIDELINES.voice}`,
      'Do not provide generic SEO, reputation management, or CRO recommendations.',
      'Evaluate how AI answer engines may understand, cite, qualify, or ignore buyer-facing claims.',
      'Return structured JSON only.',
    ].join('\n'),
    user: [
      `URL: ${input.page.url}`,
      `Title: ${input.page.metadata?.title ?? 'Unknown'}`,
      `Description: ${input.page.metadata?.description ?? 'Unknown'}`,
      `Organization: ${input.page.metadata?.organizationName ?? 'Unknown'}`,
      'Claims:',
      claimLines || '- No explicit claims detected.',
      'For ChatGPT, Perplexity, Gemini, and Google AIO, provide simulatedDescription, citationLikelihood, strengths, weaknesses, and entityGaps.',
      'Every weakness must tie back to buyer trust, investor diligence, or AI-system citation confidence.',
    ].join('\n'),
  };
}

// Deterministic fallback simulation for fast snapshots, tests, and monitoring.
// A production LLM adapter can replace or augment this function while preserving
// the same structured output contract.
export function simulateAIClaimReadability(
  input: AIClaimReadabilityInput,
): AIClaimReadabilityResult {
  const prompt = buildAIClaimReadabilityPrompt(input);
  const simulations = AI_ENGINES.map((engine) =>
    simulateEngine(engine, input.page, input.claims),
  );

  return {
    simulations,
    entityUnderstandingGaps: buildEntityGaps(input.page, input.claims),
    competitorPreviews: buildCompetitorPreviews(input.competitorUrls),
    prompt,
  };
}

function simulateEngine(
  engine: AIEngineName,
  page: PageInput,
  claims: ClaimFinding[],
): AIVisibilityEngineSimulation {
  const unsupportedCount = claims.filter(
    (claim) => claim.label === 'Unsupported' || claim.label === 'Overstated',
  ).length;
  const hasStructuredIdentity = Boolean(
    page.metadata?.organizationName || page.metadata?.productName,
  );

  const citationLikelihood =
    unsupportedCount === 0 && hasStructuredIdentity
      ? 'High'
      : unsupportedCount <= 2
        ? 'Medium'
        : 'Low';

  return {
    engine,
    simulatedDescription: buildSimulatedDescription(engine, page, claims),
    citationLikelihood,
    strengths: [
      hasStructuredIdentity
        ? 'The page gives AI systems a clearer organization or product entity to describe.'
        : 'The page contains enough visible content to infer a basic business category.',
      claims.length > 0
        ? 'Buyer-facing claims are explicit enough to audit and refine.'
        : 'The page avoids obvious unsupported superlatives, though it may also understate proof.',
    ],
    weaknesses: [
      unsupportedCount > 0
        ? 'Several claims may be omitted or qualified because proof is not visible enough for confident citation.'
        : 'Claims still need source-level evidence to improve citation confidence.',
      'AI systems may compress nuanced offers into a generic category if proof, audience, and outcomes are not stated plainly.',
    ],
    entityGaps: buildEntityGaps(page, claims).slice(0, 3),
  };
}

function buildSimulatedDescription(
  engine: AIEngineName,
  page: PageInput,
  claims: ClaimFinding[],
): string {
  const entity =
    page.metadata?.organizationName ||
    page.metadata?.productName ||
    page.metadata?.title ||
    'This business';
  const strongestClaim = claims.find((claim) => claim.label !== 'Unsupported');

  if (strongestClaim) {
    return `${engine} may describe ${entity} using cautious language around "${strongestClaim.text}" while looking for clearer proof before citing the claim directly.`;
  }

  return `${engine} may describe ${entity} at a category level, but citation confidence will likely depend on clearer evidence, entity details, and buyer-verifiable proof.`;
}

function buildEntityGaps(page: PageInput, claims: ClaimFinding[]): string[] {
  const gaps: string[] = [];

  if (!page.metadata?.organizationName) {
    gaps.push('The organization entity is not explicit enough for consistent AI-system identification.');
  }

  if (!page.metadata?.productName) {
    gaps.push('The product or service name may be collapsed into a generic category.');
  }

  if (!page.metadata?.schemaTypes?.length) {
    gaps.push('Structured data is not visible in the input, which can reduce entity clarity and citation confidence.');
  }

  if (claims.some((claim) => claim.evidenceMissing.length > 0)) {
    gaps.push('Claims and proof are not tightly paired, making it harder for AI systems to cite the strongest statements.');
  }

  return gaps.length
    ? gaps
    : ['The core entity is reasonably clear, but stronger claim-to-proof pairing would improve AI readability.'];
}

function buildCompetitorPreviews(competitorUrls?: string[]): CompetitorPreview[] {
  return (competitorUrls ?? []).slice(0, 3).map((url) => ({
    url,
    claimStrengthSummary:
      'Preview only: full competitor claim scoring is available in the paid report.',
    proofDensitySummary:
      'Preview only: proof density will compare visible evidence, trust signals, and claim specificity.',
    trustSignalSummary:
      'Preview only: trust signal comparison will evaluate testimonials, source attribution, credentials, and proof placement.',
    aiVisibilitySummary:
      'Preview only: AI visibility comparison will estimate which page is easier for answer engines to understand and cite.',
    availability: 'Preview',
  }));
}
