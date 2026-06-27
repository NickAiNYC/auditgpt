import type { AI_ENGINES, CLAIM_SUPPORT_LABELS, MANTRA } from './positioning';

export type ClaimSupportLabel = (typeof CLAIM_SUPPORT_LABELS)[number];
export type AIEngineName = (typeof AI_ENGINES)[number];
export type PositioningStatement = typeof MANTRA;

export type CitationLikelihood = 'High' | 'Medium' | 'Low';
export type CompetitorAvailability = 'Preview' | 'Paid';
export type TechnicalTrustStatus = 'Pass' | 'Concern' | 'Not Detected';

export interface PageMetadata {
  title?: string;
  description?: string;
  h1?: string;
  organizationName?: string;
  productName?: string;
  schemaTypes?: string[];
  canonicalUrl?: string;
}

export interface PageInput {
  url: string;
  content: string;
  metadata?: PageMetadata;
  extractedAt?: string;
}

export interface ClaimFinding {
  id: string;
  text: string;
  label: ClaimSupportLabel;
  evidenceFound: string[];
  evidenceMissing: string[];
  riskToBuyer: string;
  riskToInvestorOrAiSystem: string;
  saferFraming: string;
  confidenceScore?: number;
  locations?: string[];
}

export interface AIVisibilityEngineSimulation {
  engine: AIEngineName;
  simulatedDescription: string;
  citationLikelihood: CitationLikelihood;
  strengths: string[];
  weaknesses: string[];
  entityGaps: string[];
}

export interface CompetitorPreview {
  url: string;
  claimStrengthSummary: string;
  proofDensitySummary: string;
  trustSignalSummary: string;
  aiVisibilitySummary: string;
  availability: CompetitorAvailability;
}

export interface TechnicalTrustCheck {
  id: string;
  label: string;
  status: TechnicalTrustStatus;
  finding: string;
  claimIntelligenceImpact: string;
  recommendedFix: string;
}

export interface ProofDensitySummary {
  summary: string;
  presentSignals: string[];
  missingSignals: string[];
}

export interface DemandLeakageSummary {
  summary: string;
  ctaIssues: string[];
  buyerFriction: string[];
  recommendedNextSteps: string[];
}

export interface SaferFramingRecommendation {
  original: string;
  recommended: string;
  rationale: string;
}

export interface ScrutexityNextStep {
  service: 'Governed Claim Rewrites' | 'AI Answer Reality' | 'Revenue Leakage Insights' | 'Verification & Trust Assets';
  whyItFits: string;
  nextAction: string;
}

export interface ExecutiveSummary {
  overallRiskScore: number;
  summary: string;
  keyFindings: string[];
  primaryRecommendation: string;
}

export interface EnhancedSnapshotReport {
  url: string;
  generatedAt: string;
  positioningStatement: PositioningStatement;
  overallRiskScore: number;
  summary: string;
  executiveSummary: ExecutiveSummary;
  claimInventory: ClaimFinding[];
  aiVisibilitySimulation: AIVisibilityEngineSimulation[];
  entityUnderstandingGaps: string[];
  proofDensity: ProofDensitySummary;
  demandLeakage: DemandLeakageSummary;
  saferFramingRecommendations: SaferFramingRecommendation[];
  scrutexityNextSteps: ScrutexityNextStep[];
  technicalTrustChecks: TechnicalTrustCheck[];
  competitors?: CompetitorPreview[];
}

export interface SnapshotReportOptions {
  mode: 'free' | 'full';
  competitorUrls?: string[];
}
