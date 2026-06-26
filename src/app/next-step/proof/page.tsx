import { NextStepPage } from '@/components/next-step-page';

export const metadata = {
  title: 'Proof & Reputation — Recommended Scrutexity Next Step',
};

export default function ProofNextStep() {
  return (
    <NextStepPage
      productName="Proof & Reputation"
      productHeadline="Build the public proof your claims rely on."
      productExplainer="Proof & Reputation produces the public trust artifacts your buyers look for: case studies, testimonials, proof pages, provider authority pages, and the AuditGPT Report Review embed. Every artifact ties back to a tracked claim record."
      whatTheFindingMeans="AuditGPT flagged missing reviews, testimonials, case studies, or proof pages. Proof & Reputation is the operating layer that produces those artifacts and keeps them tied to the claims they support."
    />
  );
}
