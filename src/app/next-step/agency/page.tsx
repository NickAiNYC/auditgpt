import { NextStepPage } from '@/components/next-step-page';

export const metadata = {
  title: 'Agency Partner Plan — Recommended Scrutexity Next Step',
};

export default function AgencyNextStep() {
  return (
    <NextStepPage
      productName="Agency Partner Plan"
      productHeadline="Run AuditGPT for your clients under your brand."
      productExplainer="The Agency Partner Plan gives marketing agencies 25 AuditGPT audits per month, white-label reports, client-ready snapshots, and public + private report links. Most agencies bundle the snapshot into discovery and offer the Claim Intelligence Report as a one-time deliverable on top of retainer."
      whatTheFindingMeans="You indicated you are an agency or AuditGPT picked up agency signals on your site. The Agency Partner Plan (Founding Beta $499/month for the first 5 partners, then $799/month) is the simplest path to running AuditGPT inside an agency engagement."
    />
  );
}
