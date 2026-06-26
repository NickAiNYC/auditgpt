import { NextStepPage } from '@/components/next-step-page';

export const metadata = {
  title: 'Agency White Label — Recommended Scrutexity Next Step',
};

export default function AgencyNextStep() {
  return (
    <NextStepPage
      productName="Agency White Label"
      productHeadline="Run AuditGPT for your clients under your brand."
      productExplainer="The Agency Audit System gives marketing agencies 25 AuditGPT audits per month, white-label reports, client-ready snapshots, and public + private report links. Most agencies bundle the snapshot into discovery and offer the Full Audit as a one-time deliverable on top of retainer."
      whatTheFindingMeans="You indicated you are an agency or AuditGPT picked up agency signals on your site. The Agency White Label tier ($799/month) is the simplest path to running AuditGPT inside an agency engagement."
    />
  );
}
