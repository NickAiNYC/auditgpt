import { TECHNICAL_TRUST_CHECK_LIMIT } from './positioning';
import type { PageInput, TechnicalTrustCheck } from './snapshot-report-model';

// These are intentionally credibility checks, not a technical SEO audit. Each
// finding must explain how the issue affects claim trust, buyer confidence, or
// AI-system understanding.
export function runTechnicalTrustChecks(page: PageInput): TechnicalTrustCheck[] {
  const checks: TechnicalTrustCheck[] = [
    checkEntitySchema(page),
    checkTitleAndDescription(page),
    checkCrawlableContent(page),
    checkMobileReadability(page),
    checkProofDiscoverability(page),
  ];

  return checks.slice(0, TECHNICAL_TRUST_CHECK_LIMIT);
}

function checkEntitySchema(page: PageInput): TechnicalTrustCheck {
  const hasSchema = Boolean(page.metadata?.schemaTypes?.length);

  return {
    id: 'entity-schema',
    label: 'Entity Schema',
    status: hasSchema ? 'Pass' : 'Concern',
    finding: hasSchema
      ? `Detected structured data: ${page.metadata?.schemaTypes?.join(', ')}.`
      : 'No structured entity schema was visible in the supplied page input.',
    claimIntelligenceImpact:
      'Clear entity schema helps AI systems connect claims to the correct organization, product, or service.',
    recommendedFix:
      'Add Organization, Product, Service, FAQ, or Review schema only where it accurately reflects visible page content.',
  };
}

function checkTitleAndDescription(page: PageInput): TechnicalTrustCheck {
  const hasTitle = Boolean(page.metadata?.title);
  const hasDescription = Boolean(page.metadata?.description);

  return {
    id: 'title-description',
    label: 'Page Identity',
    status: hasTitle && hasDescription ? 'Pass' : 'Concern',
    finding:
      hasTitle && hasDescription
        ? 'The page has basic title and description metadata.'
        : 'The page metadata does not fully state what the business offers.',
    claimIntelligenceImpact:
      'Metadata is not treated as SEO decoration here; it helps buyers and AI systems understand the claim context quickly.',
    recommendedFix:
      'Use plain metadata that names the offer, audience, and evidence-backed value without inflated claims.',
  };
}

function checkCrawlableContent(page: PageInput): TechnicalTrustCheck {
  const wordCount = page.content.trim().split(/\s+/).filter(Boolean).length;

  return {
    id: 'crawlable-content',
    label: 'Crawlable Claim Context',
    status: wordCount >= 150 ? 'Pass' : 'Concern',
    finding: `The supplied page content contains approximately ${wordCount} words.`,
    claimIntelligenceImpact:
      'If core claims are hidden, too thin, or script-dependent, AI systems may miss the proof needed to cite them.',
    recommendedFix:
      'Keep important claims, proof, and next steps available as readable page text.',
  };
}

function checkMobileReadability(page: PageInput): TechnicalTrustCheck {
  const hasLongSentences = page.content
    .split(/[.!?]/)
    .some((sentence) => sentence.trim().split(/\s+/).length > 35);

  return {
    id: 'mobile-readability',
    label: 'Mobile Claim Readability',
    status: hasLongSentences ? 'Concern' : 'Pass',
    finding: hasLongSentences
      ? 'Some claim language appears long enough to be difficult to scan on mobile.'
      : 'Claim language appears reasonably scannable from the supplied content.',
    claimIntelligenceImpact:
      'Mobile readability affects buyer trust because proof and qualifications must be easy to inspect before action.',
    recommendedFix:
      'Break high-stakes claims into shorter statements with adjacent proof, source, or qualification.',
  };
}

function checkProofDiscoverability(page: PageInput): TechnicalTrustCheck {
  const hasProofCue = /\b(case study|testimonial|review|certified|study|data|source|verified|customer)\b/i.test(
    page.content,
  );

  return {
    id: 'proof-discoverability',
    label: 'Proof Discoverability',
    status: hasProofCue ? 'Pass' : 'Concern',
    finding: hasProofCue
      ? 'The page includes at least one visible proof cue.'
      : 'The supplied content does not include obvious proof cues.',
    claimIntelligenceImpact:
      'Proof needs to be near the claim so buyers, investors, and AI systems can evaluate it without inference.',
    recommendedFix:
      'Place source-backed proof, testimonials, credentials, or concrete examples next to the claims they support.',
  };
}
