import { NextResponse } from 'next/server';

const PREDEFINED_GAPS = [
  {
    marketingClaim: '"Painless" treatments — zero discomfort guaranteed.',
    consentFormStandard:
      '"You may experience mild discomfort, tingling, or warmth during and after treatment."',
    gapDescription:
      'The website promises zero pain, while the consent form acknowledges discomfort as expected. A plaintiff\'s attorney will argue the patient was misled about the treatment experience.',
    severity: 'high' as const,
  },
  {
    marketingClaim: '"Instant results — see a difference after just one session."',
    consentFormStandard:
      '"Results vary by individual. Multiple sessions may be required to achieve desired outcomes. Full results typically appear after 4-6 weeks."',
    gapDescription:
      'Marketing promises instant one-session results, but the consent form describes a multi-week, multi-session timeline. This creates an expectation gap that could fuel a misrepresentation claim.',
    severity: 'high' as const,
  },
  {
    marketingClaim: '"FDA-cleared for all skin types and tones."',
    consentFormStandard:
      '"This device is cleared for Fitzpatrick skin types I-IV. Patients with skin types V-VI may be at increased risk of hyperpigmentation or burns."',
    gapDescription:
      'The claim suggests universal FDA clearance, but the consent form explicitly excludes darker skin tones from the cleared indication. This is both a liability gap and a potential regulatory issue.',
    severity: 'high' as const,
  },
  {
    marketingClaim: '"No downtime — resume normal activities immediately."',
    consentFormStandard:
      '"Temporary redness, swelling, and sensitivity are common for 24-72 hours post-treatment. Avoid direct sun exposure, strenuous exercise, and topical actives for 48 hours."',
    gapDescription:
      'Zero-downtime marketing directly contradicts the consent form\'s detailed post-care restrictions. Patients who resume normal activities immediately may experience complications they weren\'t warned about.',
    severity: 'high' as const,
  },
  {
    marketingClaim: '"Permanent hair removal — guaranteed results."',
    consentFormStandard:
      '"Hair reduction, not permanent removal, is the expected outcome. Maintenance sessions may be needed. Individual results vary and are not guaranteed."',
    gapDescription:
      'Using "permanent" and "guaranteed" in marketing creates a legally significant expectation, while the consent form uses "reduction" and explicitly disclaims guarantees. This is one of the most common FTC and state AG action triggers.',
    severity: 'high' as const,
  },
];

function normalizeUrl(raw: string): string {
  let normalized = raw.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  // Strip trailing slash
  if (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized.toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { websiteUrl, honeypot } = body;

    // Honeypot check for bot protection
    if (honeypot) {
      return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });
    }

    if (!websiteUrl) {
      return NextResponse.json(
        { error: 'Missing required field: websiteUrl.' },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(websiteUrl);

    // Simulate analysis — pick 3-5 gaps based on URL hash for consistency
    const hash = normalizedUrl.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gapCount = 3 + (hash % 3); // 3, 4, or 5 gaps
    const startIndex = hash % PREDEFINED_GAPS.length;
    const gaps = [];
    for (let i = 0; i < gapCount; i++) {
      gaps.push(PREDEFINED_GAPS[(startIndex + i) % PREDEFINED_GAPS.length]);
    }

    return NextResponse.json({
      success: true,
      websiteUrl: normalizedUrl,
      totalGaps: gaps.length,
      highSeverityCount: gaps.filter((g) => g.severity === 'high').length,
      gaps,
      disclaimer:
        'This analysis is simulated for demonstration purposes. Actual results may vary. AuditGPT does not provide legal advice. Consult with qualified legal counsel for compliance guidance.',
    });
  } catch (error) {
    console.error('Consent Gap Checker API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
