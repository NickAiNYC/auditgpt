export type RiskLevel = 'Critical' | 'High' | 'Moderate' | 'Low';
export type ClaimStatus = 'Supported' | 'Weakly Supported' | 'Overstated' | 'Unsupported';

export interface ReportData {
  clinicName: string;
  industry: string;
  overallGovernanceScore: number; // 0-100
  generatedAt: string;
  
  executiveSummary: {
    criticalRisks: number;
    demandLeakageEst: string;
    aiVisibilityScore: number;
    keyTakeaway: string; 
  };

  claimInventory: Array<{
    id: string;
    originalClaim: string;
    status: ClaimStatus;
    riskNote: string;
    saferFraming: string;
    evidenceGap: string;
    riskLevel: RiskLevel;
  }>;

  aiVisibility: Array<{
    engine: 'ChatGPT' | 'Perplexity' | 'Gemini' | 'Google AIO';
    simulatedDescription: string;
    citationLikelihood: number; // 0-100
    strengths: string[];
    weaknesses: string[];
    entityGaps: string[];
  }>;

  proofDensity: {
    clinicalCitations: number;
    providerBios: number;
    beforeAfterVerified: number;
  };
  
  demandLeakage: {
    summary: string;
    issues: Array<{ area: string; impact: string; }>;
  };
}

export const auraMockData: ReportData = {
  clinicName: "Aura MedSpa & Wellness",
  industry: "Medical Aesthetics",
  overallGovernanceScore: 42,
  generatedAt: new Date().toISOString().split('T')[0],
  
  executiveSummary: {
    criticalRisks: 3,
    demandLeakageEst: "$12k - $18k / month",
    aiVisibilityScore: 28,
    keyTakeaway: "Aura MedSpa is losing high-intent traffic because aggressive clinical claims lack visible substantiation, leading to poor AI citation indexing and high consultation abandonment."
  },

  claimInventory: [
    {
      id: "C-001",
      originalClaim: "FDA-approved permanent fat loss without surgery or downtime.",
      status: "Unsupported",
      riskLevel: "Critical",
      riskNote: "Combines an FDA clearance (not approval) with a guarantee of 'permanent' results without clinical caveats. High regulatory risk.",
      saferFraming: "FDA-cleared non-surgical body contouring designed for long-lasting fat reduction.",
      evidenceGap: "Missing links to clinical studies for the specific device; 'permanent' guarantee lacks scientific consensus without dietary maintenance caveats."
    },
    {
      id: "C-002",
      originalClaim: "The most experienced laser technicians in the tri-state area.",
      status: "Overstated",
      riskLevel: "High",
      riskNote: "Superlative claim ('most experienced') is mathematically unprovable and triggers skepticism from educated buyers.",
      saferFraming: "Our laser technicians bring over 15 years of combined clinical experience.",
      evidenceGap: "No provider bios detailing actual years of experience, certifications, or total procedures performed."
    },
    {
      id: "C-003",
      originalClaim: "Reverse 10 years of aging in a single 30-minute session.",
      status: "Unsupported",
      riskLevel: "Critical",
      riskNote: "Specific, quantitative guarantee of a biological outcome ('10 years') from a single session. Unverifiable and highly non-compliant.",
      saferFraming: "Noticeable reduction in fine lines and improved skin laxity in 30 minutes.",
      evidenceGap: "Missing verified before/after galleries demonstrating this specific protocol's efficacy."
    },
    {
      id: "C-004",
      originalClaim: "Medical-grade skincare lines proven to cure adult acne.",
      status: "Weakly Supported",
      riskLevel: "Moderate",
      riskNote: "Use of the word 'cure' for acne is a medical claim that violates FTC and FDA advertising guidelines for cosmetics.",
      saferFraming: "Clinical-grade skincare routines designed to effectively manage and treat adult acne breakouts.",
      evidenceGap: "Needs linking to specific ingredient efficacy studies and clear disclaimer that results vary."
    }
  ],

  aiVisibility: [
    {
      engine: 'ChatGPT',
      simulatedDescription: "Aura MedSpa is a medical aesthetics clinic offering laser treatments and injectables. While their marketing highlights permanent fat loss and anti-aging, there is limited clinical data available on their site to verify these specific claims.",
      citationLikelihood: 12,
      strengths: ["Indexed service menu", "Clear location data"],
      weaknesses: ["Missing structural schema", "Lack of provider authority signals"],
      entityGaps: ["Medical Director identity", "Specific device brand names"]
    },
    {
      engine: 'Perplexity',
      simulatedDescription: "Aura MedSpa provides non-surgical cosmetic treatments. However, reviews and independent sources do not substantiate their claims of 'reversing 10 years of aging' in 30 minutes.",
      citationLikelihood: 25,
      strengths: ["Presence in local directories"],
      weaknesses: ["High dissonance between marketing copy and verified reviews"],
      entityGaps: ["Clinical evidence citations", "Verified before/afters"]
    },
    {
      engine: 'Google AIO',
      simulatedDescription: "Located in the local metro area, Aura MedSpa offers various wellness treatments. For advanced laser procedures, patients should verify the specific FDA clearances as the clinic's claims of 'FDA-approved permanent fat loss' are broadly stated.",
      citationLikelihood: 40,
      strengths: ["Google Business Profile is active"],
      weaknesses: ["AI is hallucinating caveats due to lack of on-site evidence"],
      entityGaps: ["FAQ structured data", "Safety and contraindication disclosures"]
    }
  ],

  proofDensity: {
    clinicalCitations: 0,
    providerBios: 1,
    beforeAfterVerified: 4
  },
  
  demandLeakage: {
    summary: "High-intent traffic is abandoning the booking funnel at the service page level due to a lack of clinical trust signals backing up aggressive marketing promises.",
    issues: [
      { area: "Service Pages", impact: "High bounce rate on 'Body Contouring' due to missing clinical studies for the 'permanent' claim." },
      { area: "Provider Bios", impact: "Lack of medical director visibility reduces trust for high-ticket injectable procedures." },
      { area: "Consultation Form", impact: "35% drop-off; prospects expect to see safety disclosures before submitting personal health data." }
    ]
  }
};
