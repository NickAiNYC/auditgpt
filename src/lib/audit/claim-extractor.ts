import type { ClaimFinding, PageInput } from './snapshot-report-model';

const CLAIM_CUE_PATTERN =
  /\b(best|leading|trusted|proven|guaranteed|guarantee|fastest|only|#1|number one|award-winning|industry-leading|revolutionary|unmatched|results|increase|reduce|save|certified|clinically|AI-powered)\b/i;

const PROOF_CUE_PATTERN =
  /\b(case study|testimonial|review|rating|certified|certification|study|data|source|customer|client|evidence|results showed|according to|published|verified)\b/i;

export interface ExtractClaimsOptions {
  maxClaims?: number;
}

// Business rationale: v1 favors a transparent heuristic extractor so the free
// snapshot is fast and easy to debug. LLM extraction can be added behind this
// contract without changing the report model or UI sections.
export function extractClaims(
  page: PageInput,
  options: ExtractClaimsOptions = {},
): ClaimFinding[] {
  const maxClaims = options.maxClaims ?? 12;
  const sentences = page.content
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return sentences
    .filter((sentence) => CLAIM_CUE_PATTERN.test(sentence))
    .slice(0, maxClaims)
    .map((sentence, index) => {
      const hasNearbyProof = PROOF_CUE_PATTERN.test(sentence);
      const label = hasNearbyProof ? 'Weakly Supported' : 'Unsupported';

      return {
        id: `claim-${index + 1}`,
        text: sentence,
        label,
        evidenceFound: hasNearbyProof ? ['The claim contains an adjacent proof cue.'] : [],
        evidenceMissing: hasNearbyProof
          ? ['Specific source details, quantified context, or linked proof.']
          : ['Visible proof, source attribution, quantified context, or buyer-verifiable evidence.'],
        riskToBuyer:
          'A buyer may not have enough context to understand whether this claim applies to their situation.',
        riskToInvestorOrAiSystem:
          'AI systems may summarize the claim without confidence or omit it because supporting evidence is unclear.',
        saferFraming: buildSaferFraming(sentence, hasNearbyProof),
        confidenceScore: hasNearbyProof ? 58 : 78,
        locations: [sentence],
      } satisfies ClaimFinding;
    });
}

function buildSaferFraming(claim: string, hasNearbyProof: boolean): string {
  if (hasNearbyProof) {
    return `Clarify the proof behind this claim and add source context: "${claim}"`;
  }

  return `Soften or qualify the claim until evidence is added: "${claim.replace(
    /\b(best|leading|fastest|only|#1|number one|guaranteed|unmatched|revolutionary)\b/gi,
    'well-supported',
  )}"`;
}
