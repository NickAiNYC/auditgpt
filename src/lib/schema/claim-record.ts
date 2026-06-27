export type ClaimStatus =
  | "verified"
  | "weakly_supported"
  | "unsupported"
  | "overstated"
  | "expired"
  | "ai_distorted"
  | "needs_review";

export type ClaimRiskLevel = "low" | "medium" | "high" | "critical";

export type ClaimCategory =
  | "medical"
  | "outcome"
  | "safety"
  | "pricing"
  | "authority"
  | "reputation"
  | "ai_visibility"
  | "comparison"
  | "general";

export interface ClaimRecord {
  id: string;
  companyId: string;
  sourceUrl: string;
  sourceType:
    | "website"
    | "google_business_profile"
    | "ad"
    | "email"
    | "sms"
    | "review_response"
    | "ai_answer"
    | "sales_script";

  claimText: string;
  normalizedClaim: string;
  category: ClaimCategory;
  status: ClaimStatus;
  riskLevel: ClaimRiskLevel;

  evidenceFound?: string[];
  evidenceNeeded?: string[];
  saferRewrite?: string;

  aiEngine?: "chatgpt" | "gemini" | "perplexity" | "google_ai_overview" | "other";
  aiQuery?: string;
  aiResponseExcerpt?: string;
  aiDistortionType?:
    | "amplification"
    | "omission"
    | "hallucination"
    | "wrong_source"
    | "competitor_displacement"
    | "regulatory_language_drift";

  firstSeenAt: string;
  lastSeenAt: string;
  lastReviewedAt?: string;
  reviewer?: string;

  isPublic: boolean;
}
