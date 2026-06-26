import { NextStepPage } from '@/components/next-step-page';

export const metadata = {
  title: 'Recovery — Recommended Scrutexity Next Step',
};

export default function RecoveryNextStep() {
  return (
    <NextStepPage
      productName="Recovery"
      productHeadline="Stop the demand silently leaking out of your site."
      productExplainer="Recovery focuses on the four most common leakage surfaces: missed calls, abandoned contact forms, unclear booking paths, and dormant or unfollowed-up leads. It builds the simple recovery paths that convert visitors you already paid to acquire."
      whatTheFindingMeans="AuditGPT flagged a demand-leakage gap — a CTA, contact form, booking path, or follow-up sequence that is losing buyer intent. Recovery is the operating layer that builds the missing path and turns it into a measurable conversion point."
    />
  );
}
