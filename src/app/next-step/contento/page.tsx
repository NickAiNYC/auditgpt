import { NextStepPage } from '@/components/next-step-page';

export const metadata = {
  title: 'Contento — Recommended Scrutexity Next Step',
};

export default function ContentoNextStep() {
  return (
    <NextStepPage
      productName="Contento"
      productHeadline="Governed content for the claims your site cannot yet prove."
      productExplainer="Contento turns AuditGPT findings into safer claim rewrites, supporting proof pages, FAQ blocks, and approved-claim libraries. Every asset is tied to a tracked claim record, so what your site says, what you can prove, and what your team can publish stay in sync."
      whatTheFindingMeans="AuditGPT flagged unsupported claims, missing proof, or copy that needs safer framing. Contento is the operating layer that produces the rewrites, the supporting content, and the proof structure to back the claims you want to make."
    />
  );
}
