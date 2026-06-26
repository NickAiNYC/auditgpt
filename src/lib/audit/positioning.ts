export const MANTRA =
  'Not SEO. Not reputation management. Not CRO. Claim Intelligence.' as const;

export const CLAIM_SUPPORT_LABELS = [
  'Supported',
  'Weakly Supported',
  'Overstated',
  'Unsupported',
] as const;

export const AI_ENGINES = [
  'ChatGPT',
  'Perplexity',
  'Gemini',
  'Google AIO',
] as const;

export const TONE_GUIDELINES = {
  voice: 'Professional, calm, authoritative, precise, and actionable.',
  avoid: [
    'Generic SEO positioning',
    'Reputation-management framing',
    'CRO-only language',
    'Hype, guarantees, or inflated certainty',
  ],
  require: [
    'Use claim-support labels consistently.',
    'Tie recommendations to buyer, investor, and AI-system trust.',
    'Suggest safer framing for unsupported or overstated claims.',
    'Route next steps into the Scrutexity ecosystem.',
  ],
} as const;

export const TECHNICAL_TRUST_CHECK_LIMIT = 5;
