import { NextRequest, NextResponse } from 'next/server';
import {
  getPublicAudit,
  evaluateVerification,
  markAuditVerified,
  checkFullVerification,
} from '@/lib/audit-persistence';

export const runtime = 'nodejs';

// POST /api/verify?publicId=xxx
// Evaluates an audit against verification criteria and marks it verified if it passes.
// If the audit was previously verified but has expired (90-day TTL), this re-verifies
// it (refreshing verifiedAt) IF the criteria still pass.
// Returns the verification result + (if verified) embed code for the badge.
export async function POST(req: NextRequest) {
  // Rate limit — verification triggers a DB write, so cap it.
  const { rateLimitOrReject, cleanupExpiredBuckets } = await import('@/lib/rate-limit');
  cleanupExpiredBuckets();
  const rateLimitResponse = rateLimitOrReject(req, false);
  if (rateLimitResponse) return rateLimitResponse;

  const url = new URL(req.url);
  const publicId = url.searchParams.get('publicId');
  if (!publicId) {
    return NextResponse.json({ error: 'publicId required' }, { status: 400 });
  }

  const audit = await getPublicAudit(publicId);
  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  const result = evaluateVerification(audit.auditJson);

  // Mark verified if criteria pass (whether or not it was previously verified).
  // This refreshes verifiedAt, resetting the 90-day window.
  if (result.verified && !audit.verified) {
    await markAuditVerified(publicId);
  } else if (result.verified && audit.verified) {
    // Already verified — check if we should refresh the timestamp.
    // We refresh if the previous verification has expired (re-audit scenario).
    const { checkVerificationExpiry } = await import('@/lib/audit-persistence');
    const { expired } = checkVerificationExpiry(audit.verifiedAt);
    if (expired) {
      await markAuditVerified(publicId);
    }
  }

  // Re-fetch to get the updated verifiedAt
  const updatedAudit = await getPublicAudit(publicId);
  const fullCheck = updatedAudit ? checkFullVerification(updatedAudit) : null;

  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const badgeUrl = `${appUrl}/api/badge/${publicId}`;
  const verifyUrl = `${appUrl}/verified/${publicId}`;

  return NextResponse.json({
    ...result,
    verified: fullCheck?.verified ?? result.verified,
    expired: fullCheck?.expired ?? false,
    expiresAt: fullCheck?.expiresAt ?? null,
    alreadyVerified: audit.verified,
    publicId,
    companyName: audit.companyName,
    badgeUrl,
    verifyUrl,
    embedCode: (fullCheck?.verified ?? result.verified)
      ? `<a href="${verifyUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="Verified by AuditGPT" width="220" height="56" /></a>`
      : null,
  });
}

// GET /api/verify?publicId=xxx
// Returns verification status (including expiry check) without mutating the DB.
export async function GET(req: NextRequest) {
  // Rate limit — GET is read-only but still hits the DB; cap it.
  const { rateLimitOrReject, cleanupExpiredBuckets } = await import('@/lib/rate-limit');
  cleanupExpiredBuckets();
  const rateLimitResponse = rateLimitOrReject(req, false);
  if (rateLimitResponse) return rateLimitResponse;

  const url = new URL(req.url);
  const publicId = url.searchParams.get('publicId');
  if (!publicId) {
    return NextResponse.json({ error: 'publicId required' }, { status: 400 });
  }

  const audit = await getPublicAudit(publicId);
  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  const result = checkFullVerification(audit);
  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  return NextResponse.json({
    verified: result.verified,
    expired: result.expired,
    expiresAt: result.expiresAt,
    passesCriteria: evaluateVerification(audit.auditJson).verified,
    criteria: result.criteria,
    reason: result.reason,
    publicId,
    companyName: audit.companyName,
    badgeUrl: `${appUrl}/api/badge/${publicId}`,
    verifyUrl: `${appUrl}/verified/${publicId}`,
    verifiedAt: audit.verifiedAt,
  });
}
