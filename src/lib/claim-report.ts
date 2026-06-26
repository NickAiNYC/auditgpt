import type { AuditResult, Claim } from '@/lib/audit-schema';

export const REPORT_DISCLAIMER =
  'AuditGPT is not legal advice, compliance certification, clinical review, or regulatory determination. It identifies public claims that may need stronger proof, clearer support, or safer framing.';

export type ClaimReportType = 'Claim Support Review' | "Founder’s Audit";

export interface ClaimReportMetadata {
  targetName: string;
  targetUrl: string;
  reviewedSurface: string;
  auditDate: string;
  reportType: ClaimReportType;
  sealedHash?: string;
  sealedAt?: string;
}

export interface ClaimReport {
  fixtureLabel?: string;
  metadata: ClaimReportMetadata;
  executiveVerdict: string;
  audit: AuditResult;
}

export function formatClaimStatus(status: Claim['claim_status']): string {
  return status.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatPriority(priority: Claim['priority']): string {
  const calmPriority = priority === 'critical' ? 'high' : priority;
  return `${calmPriority[0].toUpperCase()}${calmPriority.slice(1)} priority`;
}

export function evidenceState(visibleEvidence: string): 'Evidence visible' | 'Evidence not found' {
  const normalized = visibleEvidence.trim().toLowerCase();
  return !normalized || normalized === 'none on page.' || normalized.startsWith('no ')
    ? 'Evidence not found'
    : 'Evidence visible';
}
