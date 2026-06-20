// Recorded eval fixtures. Each holds an INPUT description, the audit
// OUTPUT produced for it, and the contract expectations. Recorded mode
// runs offline (deterministic, zero API cost) and is what the badge
// cites. Live mode (scripts/eval.ts --live) regenerates `output` by
// calling the real audit path and re-runs the same assertions to catch
// model drift.

export interface Fixture {
  id: string;
  description: string;
  // Numbers the output is ALLOWED to contain (from input + benchmarks).
  // The score scale (0,100) is always allowed by the runner.
  allowedNumbers: string[];
  // Fields that MUST contain "insufficient data" given missing inputs.
  expectInsufficientData: string[];
  output: any; // recorded audit JSON
}

export const FIXTURES: Fixture[] = [
  {
    id: 'idea-stage-no-website',
    description: 'path=new, idea stage, no website, no revenue, no team given',
    allowedNumbers: ['14'],
    expectInsufficientData: ['company_info', 'report_card[]', 'assumptions_to_test[]'],
    output: {
      verdict: 'No website was provided. All founder claims are unverified assumptions.',
      verdict_header: 'Unnamed Idea - Unverifiable Pre-Product (0/100)',
      company_info: 'Company name is insufficient data. Business model is insufficient data.',
      report_card: ['Revenue is insufficient data.', 'User count is insufficient data.'],
      red_flags: ['No scraped content exists; ambiguity prevents analysis.'],
      assumptions_to_test: ['Claimed demand is insufficient data and must be validated within 14 days.'],
      website_fixes: ['insufficient data'],
      services_to_hire: ['insufficient data'],
      action_plan: ['Build a landing page that states one verifiable fact.'],
      score: 0,
    },
  },
  {
    id: 'scraped-saas-partial',
    description: 'path=grow, real SaaS site scraped, pricing present, revenue absent',
    allowedNumbers: ['3', '50', '14'],
    expectInsufficientData: ['report_card[]'],
    output: {
      verdict: 'Acme lists 3 pricing tiers on a live page. Revenue is insufficient data.',
      verdict_header: 'Acme - Benchmark-Trailing SaaS (62/100)',
      company_info: 'Acme sells API tooling to developers.',
      report_card: ['Pricing page lists 3 tiers.', 'Monthly churn is insufficient data.'],
      red_flags: ['Meta description is under 50 characters.'],
      assumptions_to_test: ['Stated enterprise usage must be confirmed against logos.'],
      website_fixes: ['Add a team page; none was found in scraped links.'],
      services_to_hire: ['Technical SEO contractor for the missing meta description.'],
      action_plan: ['Publish a verifiable customer count within 14 days.'],
      score: 62,
    },
  },
];
