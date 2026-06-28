import { NextRequest, NextResponse } from 'next/server';
import { getPublicAudit, computeReportReview } from '@/lib/audit-persistence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Embeddable SVG Claim Review badge.
// Usage: <img src="https://auditgpt.ai/api/badge/{publicId}" />
//
// The badge states WHAT WAS CHECKED, never "Verified". It does not certify
// truth, compliance, rankings, AI answer changes, or revenue outcomes.
// Three states: active review, expired review, no review.

function esc(s: string): string {
  return s.slice(0, 50).replace(/[<>&"']/g, '');
}

function buildActiveSvg(name: string, claimsReviewed: number, expiresAt: Date): string {
  const safe = esc(name || 'This business');
  const exp = expiresAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="260" height="64" viewBox="0 0 260 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AuditGPT Claim Review">
  <rect width="260" height="64" rx="6" fill="#ffffff" stroke="#0a0a0a" stroke-width="1"/>
  <g transform="translate(12, 14)">
    <rect x="0" y="0" width="36" height="36" rx="4" fill="#0a0a0a"/>
    <text x="18" y="24" font-family="-apple-system, system-ui, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">A</text>
  </g>
  <text x="58" y="22" font-family="-apple-system, system-ui, sans-serif" font-size="10" font-weight="700" fill="#0a0a0a" letter-spacing="0.5">AUDITGPT CLAIM REVIEW</text>
  <text x="58" y="36" font-family="-apple-system, system-ui, sans-serif" font-size="10" fill="#525252">${safe}</text>
  <text x="58" y="50" font-family="-apple-system, system-ui, sans-serif" font-size="9" fill="#737373">${claimsReviewed} claims reviewed · Expires ${exp}</text>
</svg>`;
}

function buildExpiredSvg(name: string): string {
  const safe = esc(name || 'This business');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="260" height="64" viewBox="0 0 260 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AuditGPT Claim Review — expired">
  <rect width="260" height="64" rx="6" fill="#fafafa" stroke="#a3a3a3" stroke-width="1" stroke-dasharray="4,3"/>
  <g transform="translate(12, 14)" opacity="0.6">
    <rect x="0" y="0" width="36" height="36" rx="4" fill="#737373"/>
    <text x="18" y="24" font-family="-apple-system, system-ui, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">A</text>
  </g>
  <text x="58" y="22" font-family="-apple-system, system-ui, sans-serif" font-size="10" font-weight="700" fill="#737373" letter-spacing="0.5">CLAIM REVIEW EXPIRED</text>
  <text x="58" y="36" font-family="-apple-system, system-ui, sans-serif" font-size="10" fill="#a3a3a3">${safe} · re-audit to refresh</text>
  <text x="58" y="50" font-family="-apple-system, system-ui, sans-serif" font-size="9" fill="#a3a3a3">auditgpt.ai</text>
</svg>`;
}

function buildMissingSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="220" height="40" viewBox="0 0 220 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="No claim review on file">
  <rect width="220" height="40" rx="6" fill="#f5f5f5" stroke="#d4d4d4" stroke-width="1"/>
  <text x="110" y="24" font-family="-apple-system, system-ui, sans-serif" font-size="10" font-weight="600" fill="#737373" text-anchor="middle">NO CLAIM REVIEW · auditgpt.ai</text>
</svg>`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> },
) {
  const { publicId } = await params;
  const audit = await getPublicAudit(publicId);

  // Referrer tracking
  try {
    const referer = req.headers.get('referer') || req.headers.get('referrer') || 'unknown';
    if (referer !== 'unknown' && !referer.includes('localhost')) {
      console.log(`[BADGE_IMPRESSION] publicId=${publicId} referer=${referer}`);
    }
  } catch {}

  if (!audit) {
    return new NextResponse(buildMissingSvg(), {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
    });
  }

  const review = computeReportReview(audit);
  const name = audit.companyName || 'This business';

  if (review.expired) {
    return new NextResponse(buildExpiredSvg(name), {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
    });
  }

  const expiresAt = review.expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  return new NextResponse(buildActiveSvg(name, review.scope.claimsReviewed, expiresAt), {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
  });
}
