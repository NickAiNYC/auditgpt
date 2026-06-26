# AuditGPT — The Truth Engine for AI Businesses

> Did an AI build your business? AuditGPT scrapes, verifies, and grades your site — then rebuilds it without hallucinations. No fluff. Just facts.

AuditGPT is a brutal, fact-backed business audit engine that exposes AI-generated slop and rebuilds real assets. Built as a direct competitor to Polsia (2.7 Trustpilot rating), with an unbreakable commitment to never hallucinating.

## Quick start

```bash
# 1. Install dependencies
bun install

# 2. Set up the database (SQLite, no external services needed)
bun run db:push

# 3. Configure env vars (see .env)
#    - NEXTAUTH_SECRET (required)
#    - STRIPE_SECRET_KEY (required for paid tiers)
#    - EMAIL_SERVER_* (required for magic-link auth)

# 4. Start the dev server
bun run dev
```

Open http://localhost:3000.

## What's inside

### Pages
- `/` — Landing page ("Let's get started") with 2-question wizard
- `/slop` — Dedicated AI-slop detector ("Did an AI build your business?")
- `/polsia` — Polsia takedown page citing 2.7 Trustpilot rating
- `/pricing` — Pro ($49/mo) + Agent ($99/mo) tiers
- `/login` — Magic-link email auth
- `/audit/[publicId]` — Public, shareable audit URL (free, no login)
- `/verified/[publicId]` — Public verification page with embed code for the badge

### API routes (all server-side, key/prompt never exposed)
- `POST /api/audit` — Scrape website + LLM audit + persist + return publicId
- `POST /api/landing-page` — Generate fact-backed landing page from audit JSON
- `POST /api/strategy` — Generate 12-week marketing strategy
- `POST /api/rebuild` — Anti-slop rebuild of a site's landing page
- `POST /api/agent` — Chat with execution agent (audit JSON as system context)
- `POST /api/checkout` — Stripe Checkout session
- `POST /api/webhooks/stripe` — Stripe webhook (checkout, invoice, subscription deleted)
- `POST /api/create-portal-session` — Stripe customer portal
- `GET /api/subscription` — Current user's subscription status
- `GET /api/badge/[publicId]` — Embeddable SVG "Verified by AuditGPT" badge
- `GET/POST /api/verify` — Run verification check + mark verified
- `GET/POST /api/auth/[...nextauth]` — NextAuth magic-link auth

### Audit JSON schema (returned by /api/audit)
```json
{
  "verdict": "A+",
  "verdict_header": "Stripe - Benchmark-Defining Infrastructure (98/100)",
  "grade_stamp": "A+",
  "company_info": "Founded in 2010, headquartered in San Francisco...",
  "report_card": ["Fact 1: ...", "Fact 2: ..."],
  "red_flags": ["Red flag 1: ...", "Red flag 2: ..."],
  "assumptions_to_test": ["Assumption 1: ..."],
  "website_fixes": ["Fix 1: ..."],
  "services_to_hire": ["Service 1: ..."],
  "action_plan": ["Step 1: ..."],
  "industry_benchmarks_table": [
    { "metric": "CAC", "this_business": "insufficient data", "industry_avg": "$200-400 (SaaS)" }
  ],
  "slop_markers": {
    "detected": false,
    "probability": 0,
    "signals": [],
    "rebuild_recommended": false
  },
  "competitor_analysis": {
    "summary": "...",
    "vs_makerpad": "...",
    "vs_cofounder": "...",
    "vs_polsia": "...",
    "vs_nanocorp": "...",
    "differentiation_angles": ["..."]
  },
  "audited_by": "auditgpt.ai",
  "publicId": "abc1234567"
}
```

### Verification criteria — "Verified by AuditGPT" badge
A site is verified if ALL of the following are true:
1. Grade is B or higher (no C, D, F)
2. Score is 70+ out of 100
3. No critical red flags
4. No AI-slop markers detected

Verified audits display the green shield badge in the dashboard, on the public audit page, and can be embedded externally via:
```html
<a href="https://auditgpt.ai/verified/{publicId}" target="_blank">
  <img src="https://auditgpt.ai/api/badge/{publicId}" alt="Verified by AuditGPT" width="220" height="56" />
</a>
```

## Tech stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: Prisma ORM + SQLite (file-based, no external DB needed)
- **Auth**: NextAuth.js v4 with magic-link email provider
- **Payments**: Stripe (checkout + webhooks + customer portal)
- **AI**: z-ai-web-dev-sdk (GLM model) — server-side only
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Fonts**: Playfair Display (serif headings) + Geist (sans body)

## Anti-slop engine

Every LLM call enforces:
- **Banned phrases**: "great", "exciting", "however", "let's be honest", "the reality is", "delusion", "founder probably believes", any metaphor/simile
- **Fact anchor rule**: every sentence must contain a number, name, comparison, or benchmark — otherwise "insufficient data"
- **2-sentence max** per field
- **Hardcoded industry benchmarks** (SaaS CAC $200-400, marketplace 90% failure rate, etc.)
- **Anti-hallucination checklist** in every prompt

## Hardcoded industry benchmarks

```
SaaS: CAC $200-400, churn <5%/mo, ARPU $50-150, LTV/CAC >3
Marketplace: 90% fail, liquidity 1,000 tx/mo, take rate 5-25%
Ecommerce: conversion 1-3%, AOV $50-100, cart abandonment ~70%
Indie Games: median revenue <$5k, top 1% >$1M, PlaytestCloud competitor
Service/Agency: 80%+ referrals, $75-150/hr, scope clarity drives success
Cross-industry: 20% fail Y1, 50% fail Y5 (US BLS)
```

## Environment variables

Copy `.env` and fill in:

```bash
DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Email (Resend or any SMTP) — leave empty for dev
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=AuditGPT <login@auditgpt.ai>

# Stripe — leave empty to disable paid tiers
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_STRIPE_AGENT_PRICE_ID=

NEXT_PUBLIC_URL=http://localhost:3000
```

## Stripe setup

1. Create two products in Stripe Dashboard:
   - "AuditGPT Pro" — $49/month recurring
   - "AuditGPT Agent" — $99/month recurring
2. Copy the `price_...` IDs into the env vars above
3. Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`
4. Configure customer portal in Stripe Dashboard (for the "Manage" link)

## Project structure

```
src/
├── app/
│   ├── api/                    # All API routes (server-side only)
│   │   ├── audit/              # Main audit endpoint (scraper + LLM)
│   │   ├── landing-page/       # Landing page generator
│   │   ├── strategy/           # 12-week strategy generator
│   │   ├── rebuild/            # Anti-slop rebuild
│   │   ├── agent/              # Chat agent
│   │   ├── checkout/           # Stripe checkout
│   │   ├── webhooks/stripe/    # Stripe webhook handler
│   │   ├── create-portal-session/
│   │   ├── subscription/       # GET subscription status
│   │   ├── badge/[publicId]/   # Embeddable SVG badge
│   │   ├── verify/             # Run verification check
│   │   └── auth/[...nextauth]/ # NextAuth
│   ├── audit/[publicId]/       # Public audit page
│   ├── verified/[publicId]/    # Public verification page
│   ├── slop/                   # Slop detector landing
│   ├── polsia/                 # Polsia takedown page
│   ├── pricing/                # Pricing tiers
│   ├── login/                  # Magic-link login
│   ├── layout.tsx
│   ├── page.tsx                # Main page (wizard + dashboard)
│   └── globals.css             # Theme + utility classes
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── logo.tsx                # AuditGPT logo (shield + wordmark)
│   ├── providers.tsx           # NextAuth SessionProvider wrapper
│   ├── public-audit-view.tsx   # Shared audit display (dashboard + public)
│   └── verification-badge.tsx  # Verify button + badge display
├── lib/
│   ├── audit-context.ts        # Shared types + anti-slop preamble
│   ├── audit-persistence.ts    # Prisma persistence + verification logic
│   ├── auth.ts                 # NextAuth options
│   ├── db.ts                   # Prisma client singleton
│   └── subscription.ts         # Subscription helpers
└── prisma/
    └── schema.prisma           # User, Account, Session, Subscription, Audit
```

## Pricing tiers

| Tier | Price | Includes |
|------|-------|----------|
| Free | $0 | One-pager audit (public shareable URL) |
| Pro | $49/mo | Full audit + rebuild + landing page + 12-week strategy + competitor analysis + competitor teardowns |
| Agent | $99/mo | Everything in Pro + execution agent (chat with audit context) |

The Audit tab is always free. Competitors, Rebuild, Landing page, Strategy tabs require Pro. Execution agent tab requires Agent.

## License

Proprietary — AuditGPT © 2026
