import { NextStepPage } from '@/components/next-step-page';

export const metadata = {
  title: 'AI Visibility — Recommended Scrutexity Next Step',
};

export default function AIVisibilityNextStep() {
  return (
    <NextStepPage
      productName="AI Visibility"
      productHeadline="Make the page answer the buyer questions AI and search now ask."
      productExplainer="AI Visibility works on entity clarity, service-page coverage, FAQ structure, and local clarity — the things that determine whether AI assistants and search engines can confidently surface your business for a buyer question."
      whatTheFindingMeans="AuditGPT flagged answer-readiness gaps: the page does not clearly answer a category, service, or location question a buyer (or an AI) would ask. AI Visibility builds the entity, FAQ, and service-page structure that closes those gaps."
    />
  );
}
