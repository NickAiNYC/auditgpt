import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory IP-based rate limiter.
// Production note: this resets on every serverless cold start. For true
// distributed rate limiting, swap the Map for Upstash Redis or similar.
// But for a single-instance deployment this is sufficient and zero-dep.

interface RateBucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, RateBucket>();

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const FREE_AUDIT_LIMIT = 5; // 5 free audits per IP per day

// Extract client IP from request, respecting common proxy headers.
function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();
  return 'unknown';
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number; // epoch ms
}

// Check + consume one unit from the bucket. Returns the result.
// If the user has an active subscription, they bypass the free limit
// (the caller should check subscription before calling this, or pass
// `bypass: true`).
export function checkRateLimit(
  req: NextRequest,
  bypass = false
): RateLimitResult {
  if (bypass) {
    return { allowed: true, remaining: Infinity, limit: Infinity, resetAt: 0 };
  }

  const ip = getClientIp(req);
  const now = Date.now();

  let bucket = buckets.get(ip);
  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    bucket = { count: 0, windowStart: now };
    buckets.set(ip, bucket);
  }

  const remaining = Math.max(0, FREE_AUDIT_LIMIT - bucket.count);

  if (bucket.count >= FREE_AUDIT_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      limit: FREE_AUDIT_LIMIT,
      resetAt: bucket.windowStart + WINDOW_MS,
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: remaining - 1,
    limit: FREE_AUDIT_LIMIT,
    resetAt: bucket.windowStart + WINDOW_MS,
  };
}

// Express-style helper: returns a 429 NextResponse if rate-limited,
// or null if allowed. Includes Retry-After header + JSON body.
export function rateLimitOrReject(
  req: NextRequest,
  bypass = false
): NextResponse | null {
  const result = checkRateLimit(req, bypass);
  if (!result.allowed) {
    const retryAfterSec = Math.ceil((result.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: 'Rate limit exceeded. Free tier allows 5 audits per day per IP.',
        code: 'RATE_LIMITED',
        limit: result.limit,
        resetAt: new Date(result.resetAt).toISOString(),
        upgradeUrl: '/pricing',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.floor(result.resetAt / 1000)),
        },
      }
    );
  }
  return null;
}

// Periodic cleanup of expired buckets (call on each audit to keep memory bounded).
// Keeps the map from growing unboundedly under attack.
export function cleanupExpiredBuckets(): void {
  const now = Date.now();
  for (const [ip, bucket] of buckets.entries()) {
    if (now - bucket.windowStart > WINDOW_MS * 2) {
      buckets.delete(ip);
    }
  }
}
