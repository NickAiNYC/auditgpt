import { NextRequest, NextResponse } from 'next/server';
import {
  getPublicAudit,
  computeReportReview,
  markReportIssued,
} from '@/lib/audit-persistence';

export const runtime = 'nodejs';

// POST /api/verify?publicId=xxx
// Issues an AuditGPT Report Review for an audit. The review is *scope-based*:
// it states what AuditGPT checked. It does NOT certify truth, ranking,
// AI visibility, or compliance. Always succeeds for an existing audit.
export async function POST(req: NextRequest) {
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

  await markReportIssued(publicId);

  const updatedAudit = await getPublicAudit(publicId);
  const review = updatedAudit ? computeReportReview(updatedAudit) : null;

  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const badgeUrl = `${appUrl}/api/badge/${publicId}`;
  const verifyUrl = `${appUrl}/verified/${publicId}`;

  return NextResponse.json({
    verified: !!review?.available && !review.expired,
    available: !!review?.available,
    expired: review?.expired ?? false,
    expiresAt: review?.expiresAt ?? null,
    scope: review?.scope ?? null,
    publicId,
    companyName: audit.companyName,
    badgeUrl,
    verifyUrl,
    embedCode: `<a href="${verifyUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="AuditGPT Report Review" width="260" height="64" /></a>`,
  });
}

// GET /api/verify?publicId=xxx
// Returns the current report-review state (read-only).
export async function GET(req: NextRequest) {
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

  const review = computeReportReview(audit);
  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  return NextResponse.json({
    verified: review.available && !review.expired,
    available: review.available,
    expired: review.expired,
    expiresAt: review.expiresAt,
    scope: review.scope,
    reason: review.reason,
    publicId,
    companyName: audit.companyName,
    badgeUrl: `${appUrl}/api/badge/${publicId}`,
    verifyUrl: `${appUrl}/verified/${publicId}`,
    verifiedAt: audit.verifiedAt,
  });
}
