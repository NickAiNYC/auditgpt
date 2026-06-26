import { ClaimIntelligenceReport } from '@/components/claim-intelligence-report';
import { aiSaasClaimSupportFixture } from '@/lib/claim-report-fixtures';

export default function SampleReportPage() {
  return <ClaimIntelligenceReport report={aiSaasClaimSupportFixture} />;
}
