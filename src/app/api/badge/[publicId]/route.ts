import { NextRequest, NextResponse } from 'next/server';
import { getPublicAudit, checkFullVerification } from '@/lib/audit-persistence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Returns an embeddable SVG badge for a verified audit.
// Usage: <img src="https://auditgpt.ai/api/badge/{publicId}" />
// Returns "Not verified" SVG if:
//   - audit doesn't exist
//   - audit never passed verification criteria
//   - audit was verified but 90-day TTL has expired (re-audit required)

function buildExpiredSvg(companyName: string): string {
  const safeName = (companyName || 'This site').slice(0, 40).replace(/[<>&"']/g, '');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="220" height="56" viewBox="0 0 220 56" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Verification expired — AuditGPT">
  <rect width="220" height="56" rx="6" fill="#fafafa" stroke="#a3a3a3" stroke-width="1" stroke-dasharray="4,3"/>
  <g transform="translate(12, 12)" opacity="0.5">
    <path d="M16 0 L30 5 L30 18 C30 26 24 31 16 33 C8 31 2 26 2 18 L2 5 Z" fill="#737373"/>
    <path d="M11 17 L15 21 L22 13" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <text x="56" y="22" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700" fill="#737373" letter-spacing="0.5">VERIFICATION EXPIRED</text>
  <text x="56" y="38" font-family="-apple-system, system-ui, sans-serif" font-size="10" fill="#a3a3a3">${safeName} · re-audit required</text>
  <text x="56" y="50" font-family="-apple-system, system-ui, sans-serif" font-size="8" fill="#a3a3a3">auditgpt.ai</text>
</svg>`;
}

function buildBadgeSvg(companyName: string, grade: string): string {
  const safeName = (companyName || 'This site').slice(0, 40).replace(/[<>&"']/g, '');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="220" height="56" viewBox="0 0 220 56" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Verified by AuditGPT">
  <rect width="220" height="56" rx="6" fill="#ffffff" stroke="#0a0a0a" stroke-width="1"/>
  <!-- Shield icon (simplified) -->
  <g transform="translate(12, 12)">
    <path d="M16 0 L30 5 L30 18 C30 26 24 31 16 33 C8 31 2 26 2 18 L2 5 Z" fill="#0a0a0a"/>
    <path d="M11 17 L15 21 L22 13" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <!-- Text -->
  <text x="56" y="22" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700" fill="#0a0a0a" letter-spacing="0.5">VERIFIED BY AUDITGPT</text>
  <text x="56" y="38" font-family="-apple-system, system-ui, sans-serif" font-size="10" fill="#525252">${safeName} · Grade ${grade}</text>
  <text x="56" y="50" font-family="-apple-system, system-ui, sans-serif" font-size="8" fill="#737373">auditgpt.ai</text>
</svg>`;
}

function buildNotVerifiedSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="40" viewBox="0 0 180 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Not verified by AuditGPT">
  <rect width="180" height="40" rx="6" fill="#f5f5f5" stroke="#d4d4d4" stroke-width="1"/>
  <text x="90" y="24" font-family="-apple-system, system-ui, sans-serif" font-size="10" font-weight="600" fill="#737373" text-anchor="middle">NOT VERIFIED · auditgpt.ai</text>
</svg>`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  const audit = await getPublicAudit(publicId);

  // ── REFERRER TRACKING ────────────────────────────────────────────
  // Log where the badge is embedded from. This lets us see which sites
  // are displaying the badge (viral loop analytics). Non-blocking.
  try {
    const referer = req.headers.get('referer') || req.headers.get('referrer') || 'unknown';
    // In production, write this to your analytics DB or PostHog/Mixpanel.
    // For now, console.log so it shows in server logs.
    if (referer !== 'unknown' && !referer.includes('localhost')) {
      console.log(`[BADGE_IMPRESSION] publicId=${publicId} referer=${referer}`);
    }
  } catch {
    // Non-fatal — never block the badge on tracking failure.
  }

  if (!audit) {
    return new NextResponse(buildNotVerifiedSvg(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // Use full verification check (criteria + 90-day expiry)
  const verification = checkFullVerification(audit);

  // Extract company name for the badge
  const name =
    audit.companyName ||
    (audit.auditJson.company_name && audit.auditJson.company_name !== 'insufficient data'
      ? audit.auditJson.company_name
      : null) ||
    audit.auditJson.verdict_header?.split(' — ')[0]?.trim() ||
    audit.auditJson.verdict_header?.split(' - ')[0]?.trim() ||
    'This site';

  // If verification has expired, show the expired badge (not the green one)
  if (verification.expired) {
    return new NextResponse(buildExpiredSvg(name), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // If not verified (never passed criteria, or criteria no longer pass), show not-verified
  if (!verification.verified) {
    return new NextResponse(buildNotVerifiedSvg(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // Verified and within 90-day window — show the green badge
  const grade = audit.auditJson.grade_stamp || audit.auditJson.verdict || 'B';
  return new NextResponse(buildBadgeSvg(name, grade), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
