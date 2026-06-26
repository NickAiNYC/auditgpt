# AuditGPT — Day 1 Founder-Led GTM Playbook

**Mission:** Get the first 3 paying AuditGPT customers and one agency conversation in 30 days.
**Day 1 goal:** Stripe wired + 5 live audits verified + 10 DMs drafted + first 3 sent.
**Timebox:** 2.5 hours.
**Operating rule:** Send the DMs. The goal is not to perfect AuditGPT. The goal is to learn whether someone pays for the wedge.

---

## Block 1 (15 min) — Stripe Price ID setup

Open Stripe Dashboard → Products → Add product. Create three products:

### Product 1: Starter Audit
- **Name:** AuditGPT Starter Audit
- **Description:** Single-page Visibility & Trust audit. 5–7 findings + 7-day fix list.
- **Pricing model:** Standard pricing
- **Price:** $99.00 USD
- **Billing period:** **One-time**
- Click "Save product"
- On the product page, copy the `price_...` ID (starts with `price_`)

### Product 2: Full Visibility & Trust Audit
- **Name:** AuditGPT Five-Surface Visibility & Trust Audit
- **Description:** Up to 5 buyer-facing surfaces reviewed. Claim, evidence, AI/search readability, reputation, demand leakage. 30-day plan.
- **Pricing model:** Standard pricing
- **Price:** $299.00 USD
- **Billing period:** **One-time**
- Click "Save product"
- Copy the `price_...` ID

### Product 3: Agency Audit System
- **Name:** AuditGPT Agency Audit System
- **Description:** 25 audits per month with white-label delivery for client discovery and trust reviews.
- **Pricing model:** Standard pricing
- **Price:** $799.00 USD
- **Billing period:** **Monthly** (recurring)
- Click "Save product"
- Copy the `price_...` ID

### Paste them in `.env` (or your hosting platform's env config)
```
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_FULL_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_xxx
```

### Webhook
Stripe Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://auditgpt.ai/api/webhooks/stripe`
- Events to listen for: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`
- Copy the signing secret → set `STRIPE_WEBHOOK_SECRET=whsec_xxx`

### Verify
- Redeploy
- Visit `/pricing` while signed out
- The amber config-warning banner should be **gone**
- Click "Run a Starter Audit" → should redirect to `/login?callbackUrl=/pricing`
- Sign in → click again → should redirect to Stripe Checkout in $99 one-time mode
- Cancel the test
- Repeat for Full ($299 one-time) and Agency ($799/month subscription)
- If any button silently does nothing — the env var is wrong. Fix and redeploy.

**Block 1 done when:** All three buttons reach Stripe Checkout in the correct mode and the config banner is gone.

---

## Block 2 (45 min) — 5 live audit verification

Open `/snapshot` in a browser. For each of the 5 sites below, run a snapshot (not starter) and record results in the table at the bottom of this file.

### URL list
1. **Self:** `https://auditgpt.ai` (use whatever your current production URL is)
2. **AI SaaS:** Pick one prospect from Batch 1 sourcing (any real AI/SaaS launch from Product Hunt last 30 days)
3. **Agency:** Pick one marketing/growth agency from LinkedIn search "growth marketing agency"
4. **Med spa / wellness:** Pick one med spa from Google Maps in your city
5. **Local service:** Pick one plumbing or HVAC business in your city

### For each audit, score 1–10 on:
- Claim extraction quality
- Evidence gap quality
- AI/search readability quality
- Demand leakage quality
- Safer framing quality
- Recommended next-step quality
- Safety / no-guarantee compliance
- Paid value

### And record:
- Public report URL (the `/audit/[publicId]` link)
- Audit type run (snapshot)
- **"Would I pay $99 for this?"** — yes/no
- Strongest finding
- Weakest finding
- Fix needed before outbound (prompt tune? scrape tune? routing tune? nothing?)

### Success condition
**3 of 5 must answer "yes" to the $99 question.**

### Failure modes and triage

If fewer than 3 say "yes," diagnose:

| Symptom | Probable cause | Fix |
|---|---|---|
| Reports feel generic across all 5 | Prompt drift | Tighten anti-generic rules in `SCRUTEXITY_PREAMBLE`; tune for the failing vertical |
| Reports cite wrong evidence | Scrape quality (single page misses real proof) | For $299, add manual review of 4 extra URLs; for $99, accept and disclose |
| Recommended next step keeps routing to Contento | Routing logic too narrow | Tighten the routing rules in the system prompt |
| LLM throws or returns invalid JSON | Provider/model issue | Switch `LLM_PROVIDER=openai` (or `anthropic`) + set API key; redeploy |
| One vertical fails consistently | Vertical mismatch | Note it; consider adding a vertical-specific preamble in Week 2 |
| Report is unsafe (guaranteed language slipped) | Forbidden phrase eval gap | Add the phrase to `FORBIDDEN_PHRASES` in `audit-context.ts`; re-run eval |

**Block 2 done when:** 3 of 5 reports score "would pay $99 = yes" — or you've identified the single fix to make first.

**Do not pass Block 2 if fewer than 3 say yes.** Pause. Fix. Retry. The goal is not to launch quickly — it is to launch when the artifact is real.

---

## Block 3 (45 min) — Source first 10 AI/SaaS founder prospects

Open `docs/gtm/batch1-ai-saas-founders-prep.md` (already created — 10 empty prospect slots).

### Sourcing rules
- **Maximum 10 minutes of research per prospect.** No more.
- **Source from any of:**
  - Product Hunt (last 90 days, AI / B2B / SaaS filter)
  - YC W26 / S26 batch pages
  - BetaList AI launches
  - Build-in-public X founders
  - LinkedIn founder posts
  - AI Tools Directory / There's An AI For That

### Qualifies if
- Launched in last 18 months or raised publicly in last 12 months
- Public website with at least 3 of: hero claim, pricing, comparison, security/trust page
- Hero uses ≥1 of: "AI," "agent," "autonomous," "enterprise-grade," "SOC 2," "guaranteed," "productivity," "replace," "10x"
- Founder reachable on X or LinkedIn (>500 followers)
- Likely <500 employees, founder-led buying
- Not regulated healthcare/finance/insurance
- Not pure enterprise procurement

### For each, capture
```
Company:
Website:
Founder/contact:
Contact URL (their X or LinkedIn):
Why they qualify (1 sentence):
Claim gap (verbatim quote + why it lacks proof):
Evidence/proof gap (what proof would buyers expect):
AI/search readability gap (a buyer question the page doesn't answer):
Demand leakage gap (specific CTA / form / booking friction):
DM angle (one sentence framing):
Personalized DM (final, ready to send):
```

### Do not invent prospects. Real websites only.

**Block 3 done when:** 10 rows are filled in `batch1-ai-saas-founders-prep.md`.

---

## Block 4 (30 min) — Draft first 10 DMs

For each of the 10 prospects, drop their `Personalized DM` field into this template:

```
Hey [first name], I run AuditGPT — it maps the gap between what a SaaS site
claims, what buyers can verify, what AI/search can understand, and where
demand leaks.

I noticed [the one specific observed gap].

Want me to send you the 3-point snapshot? Free, no signup.
```

### DM rules
- Under 90 words
- Observational
- Specific to one observed gap (claim, visibility, or demand — pick the sharpest)
- No scare tactics
- No legal/compliance accusations
- No guaranteed outcomes
- No fake familiarity ("Hey {{firstName}}, hope you're well!")
- CTA must be permission-based: "Want me to send you the 3-point snapshot?"

### Test each DM against the forbidden-phrase list

Open `docs/gtm/outbound-messages.md` → "Forbidden language (reference — never use these)." If any DM contains one of those phrases, rewrite it.

**Block 4 done when:** 10 DMs are drafted, each personalized, each under 90 words, each pointed at one specific gap.

---

## Block 5 (15 min) — Update tracker + send first 3

### Tracker update
Open `docs/gtm/auditgpt-30-prospect-tracker.csv`. For rows 1–10:

- Fill in `company_name`, `website_url`, `vertical=ai_saas`, `founder_or_contact`, `contact_url`, `channel` (twitter/linkedin), `claim_gap_observed`, `visibility_gap_observed`, `demand_gap_observed`
- Leave `dm_sent = FALSE` until you actually send each one
- Leave `recommended_next_step` blank until the snapshot runs

### Send first 3
- Pick the 3 prospects who felt sharpest during Block 3 research (your highest-confidence DMs)
- Send their DMs now (X or LinkedIn)
- For each one sent, set `dm_sent = TRUE` and `dm_sent_at = <now>` in the tracker

### Hold the other 7 for tomorrow
- Days 2–4: send 3 more each day
- This stages your responses so you can handle replies without overwhelming yourself

**Block 5 done when:** First 3 DMs are sent and the tracker reflects them.

---

## After Block 5: send / reply workflow

When a reply comes in:

### Reply: "sure / send it / yes / go for it"
1. Open `/snapshot`
2. Fill in their name, email (theirs), company, website, type, primary worry
3. Run the snapshot
4. Inspect the report yourself first (~3 min — is it usable? would *you* send it?)
5. If good: reply with the link
6. Log `snapshot_url`, `snapshot_delivered_at`, set `snapshot_requested = TRUE`

**Reply script:**
> Here you go: [snapshot URL]. Three things stood out — one claim/proof gap, one AI/search readability gap, and one demand-leakage gap. If those feel real, the $99 Starter Audit goes deeper with 5–7 findings and a 7-day fix list.

### Reply: "what is this?"

> Short version: AuditGPT is not SEO, not an AI visibility tracker, not reputation management, and not CRO. It maps the gap between claim, evidence, AI/search readability, and demand leakage. Sample: auditgpt.ai/sample-report.

### Reply: "how much?"

> Free snapshot is $0. Starter is $99 (one URL). Full is $299 (up to five surfaces). Agency is $799/month. auditgpt.ai/pricing.

### Reply: "we already use SEO tools"

> Totally — this does not replace SEO tools. SEO tools look at crawl, keywords, and links. AuditGPT looks at whether the page's claims are supported, readable to buyers and AI/search, and connected to a clear demand path. Different layer entirely.

### Reply: agency asks "can I use this for clients"

> Best signal yet. The Agency tier is $799/month — 25 audits, white-label reports, public + private report links. Want to walk through a co-branded sample on one of your clients?

---

## End-of-Day 1 report

Fill this in tonight (15 min):

### Day 1 AuditGPT GTM Report

**Stripe**
- Starter Price ID configured: [ ]
- Full Price ID configured: [ ]
- Agency Price ID configured: [ ]
- Pricing page status: [config banner gone / still showing]

**Live audit verification**
- Audits run: ___ of 5
- Reports worth $99: ___ of 5
- Strongest report: [URL + 1 sentence]
- Weakest report: [URL + 1 sentence]
- Blockers found: [none / prompt / scrape / routing / provider / vertical]

**Prospecting**
- Prospects sourced: ___ of 10
- DMs drafted: ___ of 10
- DMs sent: ___ of 3 (today's target)
- Replies received today: ___

**Pipeline**
- Snapshots requested: ___
- Snapshots delivered: ___
- Paid offers made: ___
- Paid conversions: ___

**Learning**
- Strongest message angle: [which gap type produced the best response?]
- Most common objection: [if any]
- One thing to fix: [smallest, fastest fix that would help most]
- Tomorrow's next action: [one sentence]

---

## Hard stop rules (re-stated)

**Stop and fix product if:**
- Stripe checkout breaks
- Live LLM output fails Zod schema
- Fewer than 3 of 5 reports feel worth $99
- 2+ recipients say snapshot feels generic
- Recommended next step is wrong 2+ times
- A report contains unsafe guarantee language

**Otherwise: send the DMs.** No more product work. The goal is not to perfect AuditGPT. The goal is to learn whether someone pays for the wedge.

---

## Block-by-block timebox recap

| Block | Duration | Cumulative | What |
|---|---|---|---|
| 1 | 15 min | 0:15 | Stripe Price IDs configured + verified |
| 2 | 45 min | 1:00 | 5 live audits scored; 3 must score "worth $99 = yes" |
| 3 | 45 min | 1:45 | 10 AI/SaaS founder prospects sourced |
| 4 | 30 min | 2:15 | 10 personalized DMs drafted |
| 5 | 15 min | 2:30 | Tracker updated; first 3 DMs sent |

**Total: 2.5 hours. Do not exceed.**

If a block takes longer, *cut scope, not quality*. Fewer prospects sourced is better than rushed research. Fewer DMs sent today is better than weak ones. The 30-day target absorbs 2-day delays. It does not absorb low-quality outreach.

---

## What you have, all in one place

| File | Purpose |
|---|---|
| `AUDITGPT-HARDENING-PASS.md` | What changed this pass + why |
| `AUDITGPT-DAY-1-PLAYBOOK.md` | This file — Day 1 execution |
| `AUDITGPT-OPERATIONAL-LAUNCH.md` | Operational launch setup (Stripe + LLM verification procedures + remaining blockers) |
| `AUDITGPT-LAUNCH-READINESS.md` | Pre-hardening readiness pass + scores |
| `AUDITGPT-GTM-30-DAY-PLAN.md` | Full 30-day plan + ICP scoring + Contento dogfood loop |
| `AUDITGPT-REFOCUS-REPORT.md` | Build report from the refocus |
| `AUDITGPT-FULL-AUDIT-2026-06-20.md` | Original audit of the prior product |
| `AUDITGPT-DASHBOARD.html` | Operating dashboard (open in browser) |
| `docs/gtm/auditgpt-30-prospect-tracker.csv` | 30 empty rows ready to fill |
| `docs/gtm/outbound-messages.md` | 10 message templates + 1 bonus |
| `docs/gtm/founder-daily-checklist.md` | Daily routine + med-spa dataset rule + hard rules |
| `docs/gtm/batch1-ai-saas-founders-prep.md` | 10 empty prospect prep slots |

You have everything. Send the DMs.
