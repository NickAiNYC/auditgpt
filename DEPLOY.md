# AuditGPT — Deployment Checklist

> This is the exact sequence to go from zero to live revenue. Follow in order. Do not skip steps.

## Phase 1: Activate Revenue (Weekend)

### 1. Email (Resend) — for magic-link auth

1. Create a Resend account at [resend.com](https://resend.com)
2. Verify your domain (`auditgpt.ai`) in Resend dashboard
3. Create an API key
4. Add to `.env`:

```bash
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=re_xxxxxxxxxxxx
EMAIL_FROM=AuditGPT <login@auditgpt.ai>
```

5. **Test:** Visit `/login`, enter your email, check inbox, click the magic link. You should be authenticated.

### 2. NextAuth secret

Already set in `.env` as a dev placeholder. **Replace with a real random string for production:**

```bash
# Generate a new secret:
openssl rand -base64 32

# Put it in .env:
NEXTAUTH_SECRET=<your-generated-secret>
NEXTAUTH_URL=https://auditgpt.ai
```

### 3. Stripe products

1. Log into [Stripe Dashboard](https://dashboard.stripe.com)
2. Create product **"AuditGPT Pro"** — $49.00/month recurring
3. Create product **"AuditGPT Agent"** — $99.00/month recurring
4. Copy the `price_...` IDs from each product's pricing section
5. Add to `.env`:

```bash
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx       # or sk_test_ for test mode
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx      # get this in step 5 below
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_AGENT_PRICE_ID=price_xxxxxxxxxxxx
```

### 4. Stripe webhook endpoint

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://auditgpt.ai/api/webhooks/stripe`
3. Events to send:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.deleted`
4. Copy the Signing secret (`whsec_...`) → put in `STRIPE_WEBHOOK_SECRET` in `.env`

### 5. Test purchase

1. Start the app: `bun run dev`
2. Visit `/login`, authenticate with your email
3. Visit `/pricing`, click "Subscribe to Pro"
4. Use Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC
5. After success, check your database:

```bash
bun -e "import {PrismaClient} from '@prisma/client'; const p = new PrismaClient(); p.subscription.findMany().then(r => {console.log(JSON.stringify(r, null, 2)); p.\$disconnect();})"
```

6. You should see a Subscription row with `status: "active"`, `plan: "pro"`
7. Visit the dashboard — the "Upgrade" link should now show "Pro" badge + "Manage" link

### 6. Stripe Customer Portal

1. Stripe Dashboard → Settings → Billing → Customer Portal
2. Enable it
3. Configure which plans customers can switch between
4. The "Manage" link in the AuditGPT dashboard will now work

### 7. Stripe Connect (for real metrics integration — Phase 4)

1. Stripe Dashboard → Connect → Settings
2. Enable OAuth
3. Copy your **Client ID** (`ca_...`)
4. Add to `.env`:

```bash
STRIPE_CLIENT_ID=ca_xxxxxxxxxxxx
```

5. Set the redirect URI to: `https://auditgpt.ai/api/integrations/stripe/callback`

### 8. Deploy to auditgpt.ai

1. Push code to your hosting provider (Vercel, Railway, Fly.io, etc.)
2. Set all env vars in the hosting dashboard
3. Set `NEXT_PUBLIC_URL=https://auditgpt.ai`
4. Run `bun run db:push` on the production database
5. Verify:
   - `https://auditgpt.ai` loads the landing page
   - `https://auditgpt.ai/login` sends magic links
   - `https://auditgpt.ai/pricing` redirects to Stripe Checkout
   - `https://auditgpt.ai/api/badge/test-public-id` returns an SVG

---

## Phase 2: Ship the First Agent (Monday-Tuesday)

The Ad Copy Agent is already built. To activate it:

1. Complete Phase 1 (paywall must be live)
2. Subscribe to the Agent tier ($99/mo)
3. Run an audit on any business
4. Click the "Custom agents" tab in the dashboard
5. Click "GENERATE 3 VARIANTS"
6. Verify 3 ad variants appear, each with a `source_fact` citing the audit

The agent is now a real product. Consider raising the price to $129/mo.

---

## Phase 3: Asymmetric Launch (Wednesday)

1. Scrape 5-10 hyped AI startup landing pages through AuditGPT
2. Generate their public `/audit/[publicId]` URLs
3. Quote-tweet their launch announcements with the verdict + one brutal finding
4. Use the pre-filled share copy (X button on the public audit page)
5. Pin: "AuditGPT is live. Hardcoded benchmarks. Zero hallucinations. Run your audit before your investors do."
6. Post the self-audit thread using the 6 days of fixes as receipts

---

## Phase 4: Data Moat (Week 2)

The Stripe OAuth integration is already built. To activate:

1. Complete Phase 1 step 7 (Stripe Connect)
2. Visit `/api/integrations/stripe/connect` while authenticated
3. Authorize read-only access to your Stripe account
4. Visit `/api/integrations/stripe/metrics` — returns real MRR, ARPU, churn, LTV
5. These metrics replace "insufficient data" in the audit's benchmarks table

Next: Add Google Analytics OAuth for real conversion rates.

---

## Success Metrics (30 days)

- [ ] At least 1 paying customer on Pro or Agent tier
- [ ] At least 10 public audits shared on X
- [ ] At least 1 competitor response or mention
- [ ] Stripe integration live and returning real metrics in at least 1 audit
- [ ] Self-audit thread published and performing

## Constraints

- Do not build new features before revenue is live
- Do not launch publicly before the paywall is tested with a real payment
- Do not cite competitor stats without timestamps
- Every public audit must be fact-anchored or marked "insufficient data"
