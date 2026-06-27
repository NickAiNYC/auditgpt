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

// Illustrative sample. "Northwind AI" is a fictional company; all figures are illustrative
// and not measured from a real audit. Used to demonstrate the AuditGPT report format.
export const auraMockData: ReportData = {
  clinicName: "Northwind AI",
  industry: "AI Workflow Automation (SaaS)",
  overallGovernanceScore: 58,
  generatedAt: new Date().toISOString().split('T')[0],

  executiveSummary: {
    criticalRisks: 3,
    demandLeakageEst: "High",
    aiVisibilityScore: 34,
    keyTakeaway: "Northwind AI communicates a clear product direction, but its strongest performance and customer-proof claims aren't backed by visible evidence. Buyers doing diligence — and the AI answer engines they rely on — can't verify them. Two high-priority claims need a defined benchmark and named customer proof before they carry weight."
  },

  claimInventory: [
    {
      id: "C-001",
      originalClaim: "10× faster than manual workflows.",
      status: "Overstated",
      riskLevel: "High",
      riskNote: "A quantified speed multiple with no stated baseline reads as marketing, not measured performance.",
      saferFraming: "Cut [task] from [X] minutes to [Y] in our defined benchmark.",
      evidenceGap: "No benchmark, baseline, or methodology shown anywhere on the page."
    },
    {
      id: "C-002",
      originalClaim: "Trusted by leading enterprises.",
      status: "Unsupported",
      riskLevel: "High",
      riskNote: "A customer-proof claim with no named customer is interchangeable with every competitor and hard to verify.",
      saferFraming: "Used by [Customer A] and [Customer B] — see their results.",
      evidenceGap: "No customer names, logos, or case studies on the page."
    },
    {
      id: "C-003",
      originalClaim: "Agents that auto-improve while you sleep.",
      status: "Overstated",
      riskLevel: "High",
      riskNote: "A strong autonomy claim with no visible trace or example invites scrutiny from technical buyers.",
      saferFraming: "Agents flag regressions and propose fixes your team reviews and approves.",
      evidenceGap: "No example run, trace, or before/after showing the autonomy in action."
    },
    {
      id: "C-004",
      originalClaim: "Enterprise-ready security.",
      status: "Weakly Supported",
      riskLevel: "Moderate",
      riskNote: "Security posture is asserted without a page describing the actual controls, leaving buyer questions open.",
      saferFraming: "Our security practices: SSO, encryption in transit and at rest, audit logs — full details on our security page.",
      evidenceGap: "The phrase is visible, but no security page, controls, or certifications are linked."
    },
    {
      id: "C-005",
      originalClaim: "Set up in minutes.",
      status: "Weakly Supported",
      riskLevel: "Low",
      riskNote: "An onboarding-speed claim with no quickstart or demo is plausible but unproven to a careful buyer.",
      saferFraming: "Connect your stack and run your first workflow in under an hour — see the quickstart.",
      evidenceGap: "No quickstart guide, demo, or onboarding walkthrough linked beside the claim."
    },
    {
      id: "C-006",
      originalClaim: "99.9% uptime, backed by a public status page.",
      status: "Supported",
      riskLevel: "Low",
      riskNote: "Specific, checkable, and backed — this is what a well-supported claim looks like.",
      saferFraming: "Already well-framed. Keep the public status page linked directly beside the number.",
      evidenceGap: "None material — a public status page with historical uptime substantiates the figure."
    }
  ],

  aiVisibility: [
    {
      engine: 'ChatGPT',
      simulatedDescription: "Northwind AI is a workflow-automation platform. Its site claims '10× faster' and 'trusted by leading enterprises,' but no benchmark or named customers are visible, so an answer engine can't confirm or repeat these specifics.",
      citationLikelihood: 30,
      strengths: ["Clear product category", "Indexed feature pages"],
      weaknesses: ["Performance claim has no baseline", "Customer proof is generic"],
      entityGaps: ["Benchmark methodology", "Named customers"]
    },
    {
      engine: 'Perplexity',
      simulatedDescription: "Northwind AI offers AI agents for workflow automation. Independent sources don't substantiate the '10× faster' or 'auto-improve while you sleep' autonomy claims, so they're unlikely to be cited as fact.",
      citationLikelihood: 22,
      strengths: ["Presence in software directories"],
      weaknesses: ["Autonomy claim lacks a visible example", "No third-party validation found"],
      entityGaps: ["Case studies", "Autonomy evidence / example run"]
    },
    {
      engine: 'Gemini',
      simulatedDescription: "Northwind AI provides automation tooling. Security is described as 'enterprise-ready,' but no security page or controls are linked, so specifics can't be confirmed for a procurement review.",
      citationLikelihood: 38,
      strengths: ["Active docs and blog"],
      weaknesses: ["'Enterprise-ready' asserted, not shown", "Thin structured data for key claims"],
      entityGaps: ["Security page / controls", "Status / uptime page"]
    }
  ],

  proofDensity: {
    clinicalCitations: 1,   // benchmarks / sources linked
    providerBios: 0,        // named case studies
    beforeAfterVerified: 2  // verifiable customer proof points
  },

  demandLeakage: {
    summary: "High-intent buyers — and the AI engines they use to shortlist vendors — can't verify Northwind's strongest claims, so they discount them during evaluation. The cost shows up as stalled trials and diligence friction, not a tidy dollar figure.",
    issues: [
      { area: "Product / pricing page", impact: "'10× faster' with no benchmark — technical evaluators discount the number and ask for proof the page never surfaces." },
      { area: "Customer proof", impact: "'Trusted by leading enterprises' with no named logos or case studies reads as filler during diligence." },
      { area: "Security page", impact: "'Enterprise-ready security' with no linked controls stalls procurement and security review." }
    ]
  }
};

// Illustrative sample for Med Spa
export const medspaMockData: ReportData = {
  clinicName: "Lumina Aesthetics",
  industry: "Medical Spa / Wellness",
  overallGovernanceScore: 45,
  generatedAt: new Date().toISOString().split('T')[0],

  executiveSummary: {
    criticalRisks: 4,
    demandLeakageEst: "Critical",
    aiVisibilityScore: 28,
    keyTakeaway: "Lumina Aesthetics makes bold treatment promises without visible clinical backing or provider credentials. Patients doing research — and AI answering their queries — will heavily discount these claims. Four high-priority claims risk regulatory scrutiny and competitor displacement."
  },

  claimInventory: [
    {
      id: "C-001",
      originalClaim: "The most advanced laser treatment in the city.",
      status: "Overstated",
      riskLevel: "High",
      riskNote: "Viewed as marketing puffery. No clinical backing or device names found on page.",
      saferFraming: "The only clinic in [City] offering the FDA-cleared [Device] for acne scars.",
      evidenceGap: "No device names, FDA clearance links, or clinical studies cited."
    },
    {
      id: "C-002",
      originalClaim: "Results that last forever.",
      status: "Unsupported",
      riskLevel: "Critical",
      riskNote: "Absolute guarantees on aesthetic treatments are unsupported and flagged by medical boards.",
      saferFraming: "Long-lasting results with proper maintenance — see our before and after gallery.",
      evidenceGap: "No realistic timeline, maintenance schedule, or verifiable long-term case studies provided."
    },
    {
      id: "C-003",
      originalClaim: "Voted #1 Medical Spa by our clients.",
      status: "Overstated",
      riskLevel: "High",
      riskNote: "Unverified awards or rankings are treated as puffery without a link to the source publication or survey.",
      saferFraming: "Rated 4.9 stars by over 500 patients on Google.",
      evidenceGap: "No link to the award, publication, or public review platform."
    },
    {
      id: "C-004",
      originalClaim: "All treatments performed by top experts.",
      status: "Unsupported",
      riskLevel: "Critical",
      riskNote: "Provider credentials are missing. 'Top experts' is subjective and carries no weight without bios.",
      saferFraming: "Treatments administered by Board-Certified Dermatologist Dr. [Name] and licensed RNs.",
      evidenceGap: "No provider bios, medical director information, or specific licenses listed on the page."
    },
    {
      id: "C-005",
      originalClaim: "Painless hair removal.",
      status: "Weakly Supported",
      riskLevel: "Moderate",
      riskNote: "Subjective sensation claims are risky. Needs framing around the specific cooling technology used.",
      saferFraming: "Comfortable treatments using [Device Name]'s advanced cooling technology.",
      evidenceGap: "No explanation of how the treatment mitigates pain (e.g., cooling technology)."
    }
  ],

  aiVisibility: [
    {
      engine: 'ChatGPT',
      simulatedDescription: "Lumina Aesthetics is a med spa. Its site claims 'most advanced laser treatment', but lacks specific device names or clinical citations, so an answer engine can't confirm or repeat these specifics against local competitors.",
      citationLikelihood: 25,
      strengths: ["Clear service categories"],
      weaknesses: ["Missing provider credentials", "No device or FDA clearance mentions"],
      entityGaps: ["Specific laser devices", "Medical director name", "Clinical evidence"]
    },
    {
      engine: 'Perplexity',
      simulatedDescription: "Lumina Aesthetics offers aesthetic treatments. Independent medical sources don't substantiate their 'results that last forever' claim, making it unlikely to be cited in medical or treatment-specific queries.",
      citationLikelihood: 15,
      strengths: ["Location data is indexed"],
      weaknesses: ["Unverified absolute claims", "Lack of before/after verification"],
      entityGaps: ["Treatment longevity data", "Verified patient reviews"]
    },
    {
      engine: 'Gemini',
      simulatedDescription: "Lumina Aesthetics provides cosmetic services. They claim 'top experts', but provider bios and board certifications are not linked, so specifics can't be confirmed for patients researching safe providers.",
      citationLikelihood: 32,
      strengths: ["Service menu is readable"],
      weaknesses: ["Provider expertise asserted, not shown"],
      entityGaps: ["Provider bios", "Board certifications", "State licenses"]
    }
  ],

  proofDensity: {
    clinicalCitations: 0,   // clinical studies / FDA clearance linked
    providerBios: 0,        // verifiable provider credentials
    beforeAfterVerified: 1  // verifiable before/after galleries
  },

  demandLeakage: {
    summary: "Patients researching high-trust aesthetic treatments look for provider credentials, specific device names, and verifiable before/afters. Lumina's broad claims lack this proof, causing high-intent buyers to bounce to competitors with transparent medical backgrounds.",
    issues: [
      { area: "Provider bios", impact: "'Top experts' without named bios causes patients to distrust the clinic's safety and medical oversight." },
      { area: "Treatment pages", impact: "'Most advanced laser' with no device name prevents patients from confirming the treatment's efficacy via independent research." },
      { area: "Review surface", impact: "'Voted #1' with no link to a verifiable platform makes the claim seem fabricated, hurting overall brand trust." }
    ]
  }
};
