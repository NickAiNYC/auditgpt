import { NextStepPage } from '@/components/next-step-page';

export const metadata = {
  title: 'Agency Receipt Beta — Recommended Scrutexity Next Step',
};

export default function AgencyNextStep() {
  return (
    <NextStepPage
      productName="Agency Receipt Beta"
      productHeadline="Attach a Claim Intelligence Receipt to every high-claim launch."
      productExplainer="The Agency Receipt Beta gives marketing agencies 10 white-label Claim Intelligence Receipts per month, reviewed-badge summaries, client-ready snapshots, and launch packet approval language. Most agencies bundle the snapshot into discovery and sell the receipt as a one-time launch artifact on top of retainer."
      whatTheFindingMeans="You indicated you are an agency or AuditGPT picked up agency signals on your site. The Agency Receipt Beta (Founding Beta $499/month for the first 5 partners, then $799/month) is the simplest path to turning AuditGPT into a billable client artifact."
    />
  );
}
