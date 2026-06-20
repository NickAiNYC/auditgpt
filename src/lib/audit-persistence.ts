import { db } from './db';
import { AuditResult } from './audit-context';

// Generate a 10-char URL-safe public ID.
// Uses crypto.randomUUID() — no extra dep needed.
export function generatePublicId(): string {
  const uuid = crypto.randomUUID().replace(/-/g, '');
  // Take 10 chars from the middle for short, unguessable slugs
  return uuid.slice(0, 10);
}

export interface PersistedAudit {
  id: string;
  publicId: string;
  path: 'new' | 'grow';
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
  path: 'new' | 'grow';
  companyName?: string | null;
  websiteUrl?: string | null;
  industry?: string | null;
  focusNotes?: string | null;
  auditJson: AuditResult;
  userId?: string | null;
}): Promise<string> {
  const publicId = generatePublicId();
  await db.audit.create({
    data: {
      path: params.path,
      companyName: params.companyName || null,
      websiteUrl: params.websiteUrl || null,
      industry: params.industry || null,
      focusNotes: params.focusNotes || null,
      auditJson: JSON.stringify(params.auditJson),
      publicId,
      userId: params.userId || null,
    },
  });
  return publicId;
}

// Fetch a public audit by its publicId. Returns null if not found.
export async function getPublicAudit(publicId: string): Promise<PersistedAudit | null> {
  const row = await db.audit.findUnique({
    where: { publicId },
  });
  if (!row) return null;
  let auditJson: AuditResult;
  try {
    auditJson = JSON.parse(row.auditJson) as AuditResult;
  } catch {
    return null;
  }
  return {
    id: row.id,
    publicId: row.publicId,
    path: row.path as 'new' | 'grow',
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
// VERIFICATION LOGIC — "Verified by AuditGPT" badge
// ============================================================
// A site is verified if it meets ALL criteria:
//   1. Grade >= B (no F or D)
//   2. No critical red flags
//   3. No AI-slop markers detected
//   4. Score >= 70
// When verified, the audit row's `verified` is set to true + verifiedAt timestamp.
//
// VERIFICATION EXPIRY (90 days):
//   Verification is not permanent. After 90 days, the badge expires and the
//   site must be re-audited to maintain verified status. This turns AuditGPT
//   from a one-time grader into infrastructure that sites depend on continuously.
//   Without expiry, a site could pass once and degrade into slop 6 months later
//   while still displaying the badge — undermining the entire trust signal.

export const VERIFICATION_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

export interface VerificationResult {
  verified: boolean;
  expired: boolean; // true if was verified but 90-day window has passed
  expiresAt: Date | null; // when the current verification expires (if verified)
  criteria: {
    gradePasses: boolean;
    noCriticalRedFlags: boolean;
    noSlopMarkers: boolean;
    scorePasses: boolean;
  };
  reason: string;
}

export function evaluateVerification(audit: AuditResult): VerificationResult {
  const grade = (audit.grade_stamp || audit.verdict || 'F').toUpperCase();
  const gradePasses = ['A+', 'A', 'A-', 'B+', 'B', 'B-'].includes(grade);

  // Primary source: dedicated `score` integer field (added to kill the regex).
  // Fallback: parse from verdict_header only if score is missing (back-compat).
  let score: number;
  if (typeof audit.score === 'number' && !isNaN(audit.score)) {
    score = audit.score;
  } else {
    const scoreMatch = audit.verdict_header?.match(/\((\d{1,3})\/100\)/);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  }
  const scorePasses = score >= 70;

  // Check red flags for "critical" severity — but our red_flags are strings,
  // not objects. We treat any red_flag containing the word "critical" (case-insensitive)
  // as a critical flag.
  const noCriticalRedFlags = !audit.red_flags?.some((f) =>
    /critical/i.test(f)
  );

  const noSlopMarkers = !audit.slop_markers?.detected;

  const passesCriteria = gradePasses && scorePasses && noCriticalRedFlags && noSlopMarkers;
  const failed: string[] = [];
  if (!gradePasses) failed.push(`grade ${grade} is below B`);
  if (!scorePasses) failed.push(`score ${score} is below 70`);
  if (!noCriticalRedFlags) failed.push('has critical red flags');
  if (!noSlopMarkers) failed.push('has AI-slop markers detected');

  return {
    verified: passesCriteria, // criteria-only check; expiry is checked separately
    expired: false,
    expiresAt: null,
    criteria: { gradePasses, noCriticalRedFlags, noSlopMarkers, scorePasses },
    reason: passesCriteria
      ? 'Passed all verification criteria'
      : `Failed: ${failed.join(', ')}`,
  };
}

// Check whether a previously-granted verification has expired (90-day TTL).
// Returns { expired, expiresAt } — does NOT re-evaluate criteria.
export function checkVerificationExpiry(
  verifiedAt: Date | null
): { expired: boolean; expiresAt: Date | null } {
  if (!verifiedAt) return { expired: false, expiresAt: null };
  const expiresAt = new Date(verifiedAt.getTime() + VERIFICATION_TTL_MS);
  const expired = Date.now() > expiresAt.getTime();
  return { expired, expiresAt };
}

// Full verification check: combines criteria evaluation + expiry check.
// This is the function the badge endpoint and verify API should use.
export function checkFullVerification(audit: PersistedAudit): VerificationResult {
  const criteriaResult = evaluateVerification(audit.auditJson);
  const { expired, expiresAt } = checkVerificationExpiry(audit.verifiedAt);

  if (!audit.verified) {
    // Never verified — return criteria result as-is
    return { ...criteriaResult, expired: false, expiresAt: null };
  }

  if (expired) {
    // Was verified but 90-day window has passed
    return {
      verified: false,
      expired: true,
      expiresAt,
      criteria: criteriaResult.criteria,
      reason: `Verification expired on ${expiresAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}. Re-audit required to maintain verified status.`,
    };
  }

  // Currently verified and within the 90-day window
  return {
    verified: true,
    expired: false,
    expiresAt,
    criteria: criteriaResult.criteria,
    reason: `Verified. Expires ${expiresAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}.`,
  };
}

// Mark an audit as verified in the DB (idempotent).
export async function markAuditVerified(publicId: string): Promise<boolean> {
  try {
    await db.audit.update({
      where: { publicId },
      data: { verified: true, verifiedAt: new Date() },
    });
    return true;
  } catch (err) {
    console.error('Failed to mark audit verified:', err);
    return false;
  }
}
