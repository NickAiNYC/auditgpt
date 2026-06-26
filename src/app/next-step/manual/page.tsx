import { NextStepPage } from '@/components/next-step-page';

export const metadata = {
  title: 'Manual Review — Recommended Scrutexity Next Step',
};

export default function ManualNextStep() {
  return (
    <NextStepPage
      productName="Manual Review"
      productHeadline="Some sites need a human read before a confident next step."
      productExplainer="When AuditGPT cannot route to Contento, AI Visibility, Recovery, or Proof with high confidence — usually because the page data is too thin or the gaps are ambiguous — the right next step is a 15-minute manual review. We look at the page with you and pick a direction together."
      whatTheFindingMeans="AuditGPT's automated confidence was low for this site. That usually means the page is sparse, the business category is unusual, or the gaps are evenly distributed across pillars. A short human review is the fastest path forward."
    />
  );
}
