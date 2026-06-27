import { NextStepPage } from '@/components/next-step-page';

export const metadata = {
  title: 'AI Answer Reality — Recommended Scrutexity Next Step',
};

export default function AIVisibilityNextStep() {
  return (
    <NextStepPage
      productName="AI Answer Reality"
      productHeadline="Make the page answer the buyer questions AI and search now ask."
      productExplainer="AI Answer Reality works on entity clarity, service-page coverage, FAQ structure, and local clarity — the things that determine whether AI assistants and search engines can confidently surface your business for a buyer question."
      whatTheFindingMeans="AuditGPT flagged answer-readiness gaps: the page does not clearly answer a category, service, or location question a buyer (or an AI) would ask. AI Answer Reality builds the entity, FAQ, and service-page structure that closes those gaps."
    />
  );
}
