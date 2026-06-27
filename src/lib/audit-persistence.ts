import { db } from './db';
import type { AuditResult } from './audit-schema';

// Generate a 10-char URL-safe public ID.
export function generatePublicId(): string {
  const uuid = crypto.randomUUID().replace(/-/g, '');
  return uuid.slice(0, 10);
}

export interface PersistedAudit {
  id: string;
  publicId: string;
  auditType: 'snapshot' | 'starter' | 'full' | null;
  path: string;
  inputType: string;
  transcript: string | null;
  companyName: string | null;
  websiteUrl: string | null;
  industry: string | null;
  focusNotes: string | null;
  auditJson: AuditResult;
  verified: boolean;
  verifiedAt: Date | null;
  createdAt: Date;
}

// Persist an audit + return the publicId. Safe to call from server routes only.
export async function persistAudit(params: {
  auditType: 'snapshot' | 'starter' | 'full';
  path: string;
  companyName?: string | null;
  websiteUrl?: string | null;
  industry?: string | null;
  focusNotes?: string | null;
  inputType?: string | null;
  transcript?: string | null;
  auditJson: AuditResult;
  userId?: string | null;
  agencyId?: string;
  clientId?: string;
}): Promise<string> {
  const publicId = generatePublicId();
  await db.audit.create({
    data: {
      path: params.path,
      companyName: params.companyName || null,
      websiteUrl: params.websiteUrl || null,
      industry: params.industry || null,
      focusNotes: params.focusNotes || null,
      inputType: params.inputType || 'website',
      transcript: params.transcript || null,
      // Stash the audit type in the front of the JSON so we can read it back
      // without altering the Prisma schema in this phase.
      auditJson: JSON.stringify({ __auditType: params.auditType, ...params.auditJson }),
      publicId,
      userId: params.userId || null,
      agencyId: params.agencyId || null,
      clientId: params.clientId || null,
    },
  });
  return publicId;
}

// Fetch a public audit by its publicId. Returns null if not found.
export async function getPublicAudit(publicId: string): Promise<PersistedAudit | null> {
  const row = await db.audit.findUnique({ where: { publicId } });
  if (!row) return null;
  let auditJson: AuditResult;
  let auditType: PersistedAudit['auditType'] = null;
  try {
    const parsed = JSON.parse(row.auditJson) as { __auditType?: string } & AuditResult;
    auditType = (parsed.__auditType as PersistedAudit['auditType']) || null;
    // Strip the marker key before returning
    if (parsed.__auditType) delete (parsed as { __auditType?: string }).__auditType;
    auditJson = parsed as AuditResult;
  } catch {
    return null;
  }
  return {
    id: row.id,
    publicId: row.publicId,
    auditType,
    path: row.path,
    inputType: row.inputType,
    transcript: row.transcript,
    companyName: row.companyName,
    websiteUrl: row.websiteUrl,
    industry: row.industry,
    focusNotes: row.focusNotes,
    auditJson,
    verified: row.verified,
    verifiedAt: row.verifiedAt,
    createdAt: row.createdAt,
  };
}

// ============================================================
// REPORT REVIEW BADGE — scoped to what was actually checked.
// ============================================================
// We no longer issue a "Verified by AuditGPT" trust badge.
// The badge is now a *report review* artifact: it states the
// scope of the audit (claim count, supported, needs_evidence,
// overstated) and an expiry date. It does NOT certify truth.

export const REVIEW_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

export interface ReportReviewStatus {
  available: boolean; // a public-safe report exists
  expired: boolean;
  expiresAt: Date | null;
  scope: {
    claimsReviewed: number;
    verified: number;
    weaklySupported: number;
    overstated: number;
    unsupported: number;
    insufficientEvidence: number;
  };
  reason: string;
}

export function computeReportReview(audit: PersistedAudit): ReportReviewStatus {
  const issuedAt = audit.verifiedAt || audit.createdAt;
  const expiresAt = new Date(issuedAt.getTime() + REVIEW_TTL_MS);
  const expired = Date.now() > expiresAt.getTime();

  const claims = audit.auditJson.claim_audit?.claims || [];
  const count = (status: string) =>
    claims.filter((c) => (c as { claim_status?: string }).claim_status === status).length;

  return {
    available: true,
    expired,
    expiresAt,
    scope: {
      claimsReviewed: claims.length,
      verified: count('verified'),
      weaklySupported: count('weakly_supported'),
      overstated: count('overstated'),
      unsupported: count('unsupported'),
      insufficientEvidence: count('insufficient_public_evidence'),
    },
    reason: expired
      ? `Report review expired on ${expiresAt.toLocaleDateString('en-US')}. Re-audit to refresh.`
      : `Report review issued ${issuedAt.toLocaleDateString('en-US')}. Expires ${expiresAt.toLocaleDateString('en-US')}.`,
  };
}

// Mark an audit as "issued" (badge is granted simply because a public-safe
// report exists). Idempotent.
export async function markReportIssued(publicId: string): Promise<boolean> {
  try {
    await db.audit.update({
      where: { publicId },
      data: { verified: true, verifiedAt: new Date() },
    });
    return true;
  } catch (err) {
    console.error('Failed to mark report issued:', err);
    return false;
  }
}

// ──────────────────────────────────────────────────────────────
// Legacy aliases kept so older code keeps compiling during the
// transition. New code should call computeReportReview /
// markReportIssued directly.
// ──────────────────────────────────────────────────────────────

export const VERIFICATION_TTL_MS = REVIEW_TTL_MS;

export function checkFullVerification(audit: PersistedAudit) {
  const r = computeReportReview(audit);
  return {
    verified: r.available && !r.expired,
    expired: r.expired,
    expiresAt: r.expiresAt,
    criteria: {
      gradePasses: true,
      noCriticalSupportGaps: true,
      scorePasses: true,
    },
    reason: r.reason,
  };
}

export async function markAuditVerified(publicId: string) {
  return markReportIssued(publicId);
}
