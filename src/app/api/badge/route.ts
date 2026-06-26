import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // We can eventually use URL parameters to customize the badge text/color based on risk score.
  // Example usage: /api/badge?score=98
  
  const searchParams = request.nextUrl.searchParams;
  const score = searchParams.get('score') || 'LOW RISK';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="40" viewBox="0 0 220 40">
  <defs>
    <linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2c3e50" />
      <stop offset="100%" stop-color="#34495e" />
    </linearGradient>
    <linearGradient id="b" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#27ae60" />
      <stop offset="100%" stop-color="#2ecc71" />
    </linearGradient>
  </defs>
  
  <rect width="130" height="40" fill="url(#a)" rx="4" />
  <rect x="125" width="95" height="40" fill="url(#b)" rx="4" />
  <rect x="125" width="10" height="40" fill="url(#b)" />

  <g fill="#fff" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600">
    <text x="65" y="25">AuditGPT Verified</text>
    <text x="172.5" y="25">${score}</text>
  </g>
</svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
