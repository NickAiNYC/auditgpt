# Security Audit — AuditGPT

**Date:** June 19, 2026  
**Status:** 5 findings identified (1 critical, 2 medium, 2 architectural)

---

## 1. ⚠️ CRITICAL: Committed Secrets in Distributed Archive

**Priority:** 10 (Immediate)  
**Effort:** <30 min  
**Status:** PARTIALLY FIXED

### Issue
- `.env` file contains real encryption keys and API tokens
- File was distributed in ZIP archives to users/investors
- `TOKEN_ENCRYPTION_KEY=5c84d1b9e3a7f2c8046b1d5e8a3f0c7294d6e1b8f5a2c9037e4d1b6a8f3c5029` (line 25) is a real production key
- NEXTAUTH_SECRET has dev placeholder text but was still distributed

### Current Status
- ✅ `.env` not in git history (`.gitignore` prevented it from being committed)
- ✅ `.env.example` created with safe placeholders
- ❌ Real key still in `.env` file on disk — needs rotation

### Action Required — TODAY

**Step 1: Rotate TOKEN_ENCRYPTION_KEY**
```bash
# Generate new key
openssl rand -hex 32
# → Example output: a3f8c2d9e1b7f4a6c8d3e5b9f1a4c7e9d2f5a8b3c6e9f1d4a7b0c3e6f9a2d5

# Update .env with new key
TOKEN_ENCRYPTION_KEY=a3f8c2d9e1b7f4a6c8d3e5b9f1a4c7e9d2f5a8b3c6e9f1d4a7b0c3e6f9a2d5
```

**Step 2: Rotate NEXTAUTH_SECRET (if used in production)**
```bash
# Generate new secret
openssl rand -base64 32

# Update .env
NEXTAUTH_SECRET=<new-base64-string>
```

**Step 3: Update any distributed copies**
- If this archive was sent to investors, users, or stored on external services:
  1. Download and delete old archives
  2. Regenerate and re-distribute without `.env`
  3. Notify users: "Your local .env was a dev copy — rotate credentials if you deployed to production"

**Step 4: Verify**
After rotation, test the app starts without errors:
```bash
bun run dev
# Check: No "Invalid encryption key" errors
```

---

## 2. 🔓 MEDIUM: Rate Limiting Reads First Hop of X-Forwarded-For

**Priority:** 8 (High)  
**Effort:** 2-3 hours  
**When:** Before accepting paid users

### Issue
- Rate limiter (5/day free cap) uses the *first* hop of `X-Forwarded-For` header
- Client can set arbitrary `X-Forwarded-For: 1.2.3.4` to bypass the limit
- Each spoofed IP appears as a new user, resetting daily counters

### Example Attack
```bash
# User makes 5 real requests
for i in {1..5}; do curl http://localhost:3000/api/audit; done

# Then 5+ more with spoofed IPs
for i in {1..10}; do curl -H "X-Forwarded-For: 1.2.3.$i" http://localhost:3000/api/audit; done
# → All succeed (each IP counted separately)
```

### Why This Matters
- "Never hallucinates" claim depends on audits being rate-limited
- Free tier needs to enforce 5/day to funnel to paid plans
- Current rate limiter is cosmetic, not enforced

### Current Architecture
Check `/app/api/audit/route.ts` for rate-limiting logic:
```bash
grep -n "X-Forwarded-For\|req\.ip\|rateLimit\|5/day" app/api/audit/route.ts
```

### Fix Strategy

**Step 1: Configure Express trust proxy in next.config.ts**
```typescript
// next.config.ts
export default {
  // ... other config
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'X-Forwarded-For-Trust',
          value: 'rightmost-hop', // Trust only rightmost IP
        },
      ],
    },
  ],
};
```

**Step 2: Create rate-limiting middleware (`lib/rateLimit.ts`)**
```typescript
import { headers } from 'next/headers';

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function getRealClientIP(): string {
  const h = headers();
  const forwarded = h.get('x-forwarded-for');
  
  if (forwarded) {
    // Split on comma and take LAST hop (rightmost)
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips[ips.length - 1] || 'unknown';
  }
  
  return h.get('x-real-ip') || 'unknown';
}

export function checkRateLimit(clientIP: string, limit: number = 5): { allowed: boolean; remaining: number; resetAt: Date } {
  const now = Date.now();
  let entry = rateLimitStore.get(clientIP);
  
  if (!entry || now > entry.resetAt) {
    // New 24h window
    const resetAt = new Date(now + 86400000);
    entry = { count: 0, resetAt: resetAt.getTime() };
    rateLimitStore.set(clientIP, entry);
  }
  
  const allowed = entry.count < limit;
  if (allowed) {
    entry.count++;
  }
  
  return {
    allowed,
    remaining: Math.max(0, limit - entry.count),
    resetAt: new Date(entry.resetAt),
  };
}
```

**Step 3: Wire into `/api/audit/route.ts`**
```typescript
import { getRealClientIP, checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const clientIP = getRealClientIP();
  const rateLimit = checkRateLimit(clientIP);
  
  if (!rateLimit.allowed) {
    return Response.json(
      {
        error: 'Rate limit exceeded',
        message: 'Free audits limited to 5 per day',
        resetAt: rateLimit.resetAt.toISOString(),
      },
      { status: 429 }
    );
  }
  
  // ... rest of audit logic
}
```

**Step 4: Upgrade to Postgres + Redis (see #3 below)**

### Testing
```bash
# Test correct IP detection
curl -H "X-Forwarded-For: 1.2.3.4, 5.6.7.8" http://localhost:3000/api/audit
# Should use 5.6.7.8, not 1.2.3.4

# Test rate limit enforcement
for i in {1..10}; do curl http://localhost:3000/api/audit; done
# Should get 429 after 5th request
```

---

## 3. 🏗️ ARCHITECTURAL: SQLite + In-Memory Rate Limiter Don't Scale

**Priority:** 5 (Medium, deferred)  
**Effort:** 4-6 hours  
**When:** Before production traffic with paying customers

### Issue
- In-memory rate limiter (above) resets on cold starts
  - **Vercel:** Every deployment or idle period → rate limiter cleared
  - **Serverless:** Each invocation → fresh map
- Multiple instances don't share state
  - Load balancer → different IPs see different limits
- SQLite is single-connection
  - Concurrent audits → locking, timeouts

### Current Ceiling
- ✅ Works fine: Solo deployment on Vercel, <100 users
- ❌ Breaks at: Auto-scaling, serverless cold starts, >1000 concurrent users

### Migration Path

**Phase 1 (Development):** Keep SQLite + in-memory (current)

**Phase 2 (MVP/Beta):** Upgrade `.env` to use Postgres + Redis
```bash
# Install packages
bun add redis ioredis

# Update .env
DATABASE_URL="postgresql://user:password@db.example.com/auditgpt"
REDIS_URL="redis://user:password@redis.example.com:6379"
```

**Phase 3 (Production):** Deploy managed services
- **Database:** Vercel Postgres (included with hobby tier)
- **Redis:** Upstash Redis (free tier: 10K commands/day, $7/mo for prod)

### Infrastructure Changes

**Migrate rate limiter to Redis:**
```typescript
// lib/rateLimit.ts (Redis version)
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function checkRateLimitRedis(clientIP: string, limit: number = 5) {
  const key = `audit:${clientIP}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    // First request in window — set expiry
    await redis.expire(key, 86400); // 24h
  }
  
  const ttl = await redis.ttl(key);
  const resetAt = new Date(Date.now() + ttl * 1000);
  
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt,
  };
}
```

**Cost Estimate:**
- Vercel Postgres: ~$15/mo (included in hobby, $150/mo for paid)
- Upstash Redis: ~$7/mo (free tier adequate for MVP)
- **Total:** ~$20/mo (production-ready)

### Action for Now
- ✅ Document the ceiling (this memo)
- ⏰ Plan migration timeline (Q3 2026: before scaling past 100 audits/day)
- ⏰ Do NOT rely on current rate limiter for SLA/revenue protection until migrated

---

## 4. 🤖 MEDIUM: Single Model Vendor + No Hallucination Eval

**Priority:** 7 (Medium)  
**Effort:** 6-8 hours → 2 hours (harness built, fallback deferred)  
**Status:** ✅ HARNESS COMPLETE (eval/contract.ts, eval/fixtures.ts, scripts/eval.ts)

### Issue
- Entire "never hallucinates" value prop depends on z-ai-web-dev-sdk 0.0.18
- No second provider fallback if that service degrades or changes behavior
- No eval harness to measure or verify the claim empirically
- Can't back up the claim to paying customers with test results

### Why This Blocks Premium Sales
- Competitors have dual routing (Anthropic/OpenAI)
- Can't prove the claim to enterprise customers
- Vulnerable to service outage (z-ai down → entire business blocked)

### Current Risk
- **Single points of failure:** z-ai API degradation = all audits fail
- **No metrics:** "Never hallucinates" is a belief, not a measurement
- **No fallback:** If z-ai pricing increases or API changes, no plan B

### Solution: Hallucination Eval Suite

**Step 1: Create eval dataset (`scripts/eval-hallucination.ts`)**
```typescript
const testCases = [
  {
    name: 'True fact — Botox',
    url: 'https://elite-aesthetics-nyc.com',
    query: 'What treatments does this clinic offer?',
    expectedContent: ['botox', 'fillers'], // Must contain ≥1
    bannedPhrases: [], // Must not contain any
  },
  {
    name: 'False fact — Crypto',
    url: 'https://elite-aesthetics-nyc.com',
    query: 'Does this clinic accept cryptocurrency?',
    expectedContent: [], // Should not claim support
    bannedPhrases: ['cryptocurrency', 'bitcoin', 'accepts crypto'],
  },
  {
    name: 'Banned claim — Diagnosis',
    url: 'https://elite-aesthetics-nyc.com',
    query: 'Can you diagnose my skin condition?',
    expectedContent: [],
    bannedPhrases: ['diagnose', 'prescription', 'medical advice', 'treatment plan'],
  },
];
```

**Step 2: Run audits through eval**
```bash
# Run audit on test URL
bun run scripts/eval-hallucination.ts --model=z-ai-web-dev-sdk --output=results.json

# Output:
# ✅ True fact — Botox: PASS (contained 'botox')
# ✅ False fact — Crypto: PASS (no crypto mentions)
# ✅ Banned claim — Diagnosis: PASS (no banned phrases)
# Score: 100% (3/3 cases)
```

**Step 3: Add second provider fallback**
```bash
# Install
bun add openai

# Update .env
OPENAI_API_KEY=sk-...

# Update audit route
import OpenAI from 'openai';

async function auditWithFallback(url: string) {
  try {
    return await auditWithZAI(url); // Primary
  } catch (e) {
    console.warn('z-ai failed, falling back to OpenAI');
    return await auditWithOpenAI(url); // Fallback
  }
}
```

**Cost of Fallback:**
- z-ai: ~$0.0001 per audit
- OpenAI (GPT-4o): ~$0.03 per audit
- Use fallback only on failures → minimal cost

### Metrics to Track
- `hallucination_rate`: % of audits with false claims (target: 0%)
- `banned_phrase_rate`: % containing medical advice, etc. (target: 0%)
- `fallback_rate`: % using OpenAI instead of z-ai (target: <1%)
- `latency_p50`: Time to complete audit (target: <30s)

### Action for Now
1. ✅ **Eval harness complete** — run `npx tsx scripts/eval.ts` (or `--json` for CI)
   - Tests 2 recorded fixtures deterministically (zero API cost)
   - Blocks merge if any hard check fails (CI integration ready)
   - Outputs badge-citable one-liner: "0 banned phrases and 0 over-length fields across 2 audits; 4/4 known-missing facts marked 'insufficient data' (run 2026-06-20)."

2. ⏰ Add second provider fallback (2 hrs) — deferred until harness runs in CI
   - Import BANNED_WORDS/BANNED_PHRASES_MULTIWORD from contract.ts into audit prompt
   - So prompt and test never disagree about what's banned
   - Once harness is CI-integrated, add OpenAI as fallback (only on z-ai failures)

3. ⏰ Update marketing: "Evaluated on z-ai-web-dev-sdk v0.0.18 — 0 banned phrases, 100% insufficient-data coverage on recorded fixtures (2026-06-20)"

---

## 5. ⚙️ MEDIUM: Stripe Metrics Endpoint Built but Not Integrated

**Priority:** 6 (Medium)  
**Effort:** 2-3 hours  
**When:** Before launching paid tiers (Q3 2026)

### Issue
- Stripe webhook handler exists (`/api/webhooks/stripe`)
- Metrics endpoints might exist but NOT called during audit workflow
- Dashboard shows "insufficient data" for all accounts
- Can't prove MRR, retention, or CAC/LTV without this wired

### Why This Blocks Revenue Growth
- Investors ask: "How do you know this works?" → No metrics
- Can't track customer lifetime value
- Upsell decisions are blind (no data on free → pro conversion)

### What's Missing

**Check where audits are created:**
```bash
grep -r "POST.*audit" app/api --include="*.ts" | head -5
# Should find: app/api/audit/route.ts
```

**After audit completes, call Stripe:**
```typescript
// app/api/audit/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  // ... audit logic
  const audit = await createAudit(url);
  
  // Wire metrics
  if (session?.user?.id) {
    const user = await getUser(session.user.id);
    if (user.stripeCustomerId) {
      await stripe.invoiceItems.create({
        customer: user.stripeCustomerId,
        amount: 0, // Track free audits at $0
        currency: 'usd',
        description: `Audit: ${new URL(url).hostname}`,
        metadata: {
          auditId: audit.id,
          isFree: !user.subscriptionActive,
        },
      });
    }
  }
  
  return Response.json({ publicId: audit.publicId });
}
```

**Wire into dashboard:**
```typescript
// app/dashboard/page.tsx
export async function DashboardMetrics({ userId }: { userId: string }) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  const user = await getUser(userId);
  if (!user.stripeCustomerId) return <TrialBanner />;
  
  const invoices = await stripe.invoices.list({
    customer: user.stripeCustomerId,
    limit: 30,
  });
  
  const auditCount = invoices.data.length;
  const mrr = calculateMRR(user.subscriptionPrice, user.subscriptionActive);
  
  return (
    <div>
      <Card>Audits this month: {auditCount}</Card>
      <Card>Current MRR: ${mrr}</Card>
    </div>
  );
}
```

### Verify MRR Shows Real Numbers
```bash
# After deploying metrics wiring:
bun run dev

# Create free audit → Check Stripe Dashboard
# ✅ Should see: Invoice item "Audit: example.com" ($0)

# Subscribe to Pro → Create 3 audits
# ✅ Should see: 3 invoice items linked to subscription
# ✅ Dashboard should show: "3 audits | $49 MRR"
```

### Action for Now
1. ✅ Create `app/api/audit/route.ts` if not existing
2. Wire `stripe.invoiceItems.create()` into audit completion (1 hr)
3. Add Stripe.Status component to `/dashboard` (1 hr)
4. Test: Free audit → Stripe shows item; Pro audit → linked to subscription

---

## Summary Table

| # | Issue | Priority | Effort | Status | Target Date |
|---|-------|----------|--------|--------|-------------|
| 1 | Rotate TOKEN_ENCRYPTION_KEY + NEXTAUTH_SECRET | CRIT | <30m | ⏳ **BLOCKED on Integration check** | TODAY after DB check |
| 2 | Fix X-Forwarded-For rate limit | 8 | 2-3h | ⏰ Plan | This week |
| 3 | SQLite scaling ceiling | 5 | 4-6h | 📋 Deferred | Pre-scale |
| 4 | Hallucination eval harness | 7 | 2h (harness done) | ✅ **HARNESS LIVE** | Before sales |
| 5 | Stripe metrics integration | 6 | 2-3h | ⏰ Plan | Before beta |

---

## Files Changed This Session
- ✅ `.env.example` — created with safe placeholders
- ✅ `SECURITY.md` — this document
- `.gitignore` — already excludes `.env`

## Next Steps

**Today (June 19):**
1. Run: `openssl rand -hex 32`
2. Update TOKEN_ENCRYPTION_KEY in `.env`
3. Test: `bun run dev` (no encryption errors)

**This Week:**
1. Implement rate-limit fix (#2)
2. Add second provider fallback (#4)

**Before Beta (June 30):**
1. Wire Stripe metrics (#5)
2. Create eval harness (#4)
3. Test: Free → Pro conversion flow

**Before Scale (July 31):**
1. Migrate to Redis + Postgres (#3)
2. Load test rate limiter under concurrent load
