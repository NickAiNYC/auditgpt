# AuditGPT — Launch Readiness Report

**Date:** 2026-06-20
**Reviewer:** Claude (principal QA lead + Scrutexity doctrine reviewer)
**One-line verdict:** AuditGPT is launch-ready for the first 30-prospect outbound sprint as a **founder-led semi-manual delivery**. It is *not* ready for unattended autonomous paid launch until (a) live LLM output is verified once per ICP and (b) Stripe Price IDs are created. Both are operational steps, not engineering blockers.

---

## 1. Executive Summary

**Is AuditGPT a launch candidate?** Yes, with two operational gates.

**Score: 7/10** for launch readiness (was 2/10 before refocus, 5/10 after refocus).

**What blocks paid launch:**

1. **Live LLM output verification per ICP.** The sandbox I'm working in cannot reach external LLM providers. The prompt, schema, and Zod validation are correct on every code path I can test (5/5 fixtures pass). One end-to-end live run per ICP — AI SaaS, agency, med spa, local service, AuditGPT self-review — is required before unattended paid customers receive output. This is a 30-minute task, not an engineering one.
2. **Stripe Price IDs not yet created.** Pricing UI is correct ($0 / $99 / $299 / $799). Environment variables are documented. Three products need to be created in Stripe Dashboard and the env vars wired. ~15 minutes.

Neither of these are launch-blocking for the **first 30-prospect sprint** because that sprint is *founder-led semi-manual*: the founder runs each snapshot personally, reviews the output, and sends the link. The two gates above only matter when unattended buyers click "Pay $99" and expect a quality artifact without founder review.

---

## 2. Wedge Consistency Review

**Files inspected:** `src/components/wedge.tsx`, `src/app/page.tsx`, `src/app/snapshot/page.tsx`, `src/app/sample-report/page.tsx`, `src/app/pricing/page.tsx`, `src/components/public-audit-view.tsx`, `src/components/share-buttons.tsx`, `src/components/footer.tsx`, `src/app/layout.tsx`, `src/lib/audit-context.ts`.

| Surface | Wedge present? | Drift risk |
|---|---|---|
| `wedge.tsx` (source of truth) | Yes — `WedgeStrip`, `WedgeCard`, `WEDGE_INLINE_TEXT`, `WEDGE_PILLARS` | None — single source of truth |
| Homepage `/` | Yes — `WedgeStrip` under hero + `WedgeCard` above intake + ICP block + contrast strip | None |
| `/snapshot` | Yes — `WedgeStrip` under headline | None |
| `/sample-report` | Yes — `WedgeStrip` in report header | None |
| `/pricing` | Yes — `WedgeStrip` under headline | None |
| Public report view | Yes — `WedgeStrip` on bottom CTA | None |
| Share buttons text | Yes — pillars in share copy | None |
| Footer | Yes — pillars replace previous tagline | None |
| Layout metadata | Yes — site description leads with the pillars | None |
| System prompt | Yes — "Map THE WEDGE" + numbered 4-pillar block + anti-generic rules | None |

**Pillar consistency:** "Claim ↔ Evidence ↔ AI/search readability ↔ Demand leakage" used verbatim across every surface. Sub-text on each pillar is identical wherever it appears (defined once in `WEDGE_PILLARS`).

**Contrast strip:** "Not SEO. Not AI-visibility tracker. Not reputation management. Not CRO." appears verbatim on the homepage and inside `WedgeCard`.

**Manifesto risk:** Low. The wedge appears as a strip (not a long explainer) on every surface except the homepage, where the explainer is one paragraph long. The system prompt is the longest treatment, which is appropriate.

**Copy that sells outcome (not taxonomy):** Confirmed. The homepage headline is "Find what is unsupported, invisible, risky, or leaking." That's outcome. The wedge sits below it as the *how*.

---

## 3. Real Audit Results — Pressure Test

### Important caveat
The sandbox I'm executing in has no LLM provider connectivity. I ran the full pressure test against the recorded eval fixtures (which are structurally identical to live output) and against the synthetic fixtures used by the contract. **I did not fake live audit output.** Live LLM end-to-end runs must be executed by you on staging — once per ICP — before unattended paid launch.

What I *did* verify on every code path:

| Path | Result |
|---|---|
| Scrape → prompt → Zod validation → render | Code path clean; tsc 0 errors |
| Repair retry on schema failure | Code path clean; logic verified |
| Snapshot budget (1 claim + 1 visibility + 1 demand leakage) | Prompt enforces; schema permits |
| Starter budget (5–7 findings + 7-day list) | Prompt enforces; schema permits |
| Full budget (every section + 30-day plan) | Prompt enforces; schema permits |

### Wedge-mapped fixtures (5/5 pass the contract)

| Fixture | Dominant pillar | Recommended next step | Routing correct? | Wedge mapping clarity | Buyer usefulness | Safety | Paid value |
|---|---|---|---|---|---|---|---|
| AI SaaS overclaims | Claim ↔ Evidence | Contento | ✅ Yes | 9/10 | 8/10 | 10/10 | 8/10 |
| Med spa overclaims | Claim ↔ Evidence | Contento | ✅ Yes | 9/10 | 9/10 | 10/10 | 9/10 |
| Agency guarantees | Claim ↔ Evidence | Contento | ✅ Yes | 9/10 | 8/10 | 10/10 | 8/10 |
| Real-world SaaS demand leakage | Demand leakage | Recovery | ✅ Yes | 9/10 | 9/10 | 10/10 | 9/10 |
| Real-world local AI readability | AI/search readability | AI Visibility | ✅ Yes | 9/10 | 9/10 | 10/10 | 8/10 |

The two new real-world fixtures explicitly test the *non-claim* pillars: demand leakage (Recovery routing) and AI/search readability (AI Visibility routing). They prove the audit can route correctly when the dominant gap is *not* a claim problem. This is critical for avoiding "everything routes to Contento" drift.

### Would each report sell?

| Fixture | Worth $0 snapshot? | Worth $99 Starter? | Worth $299 Full? |
|---|---|---|---|
| AI SaaS overclaims | Yes (3-point version) | Yes (full version with 7-day list) | Marginal (needs multi-page crawl) |
| Med spa overclaims | Yes | Yes | Yes — claim density is high |
| Agency guarantees | Yes | Yes | Marginal |
| Real-world SaaS demand leakage | Yes | Yes (if 5–7 findings) | Marginal (needs more pages) |
| Real-world local AI readability | Yes | Yes | Yes — local clarity + reputation + demand gaps stack |

**What would make $299 reports feel more valuable:** Multi-page crawl. The single-URL scrape is enough for $99 but feels thin at $299. This is *not* a launch blocker — Full Audit buyers in the first 30 days are an exception case, and Nick (founder) can manually add 2–3 more pages to the audit input before delivery. Multi-page is the Phase 2 build.

---

## 4. Generic-Audit Drift Detection

**Now actively enforced by the eval contract.** I added a `GENERIC_DRIFT_PATTERNS` regex list to `src/lib/eval/contract.ts` that fails the eval if any recommendation matches:

- "Improve your SEO/content/metadata/keywords."
- "Add more keywords / a blog."
- "Optimize your metadata / SEO / titles."
- "Get more reviews."
- "Improve your CTA."
- "Add a call-to-action."

The system prompt now explicitly forbids these patterns and requires every recommendation to answer the question: *"What claim, evidence, AI/search readability, or demand-leakage gap did I observe?"*

I added an `ANTI-GENERIC RULES` section to `SCRUTEXITY_PREAMBLE` listing exactly which generic phrases are not allowed standalone and what conditions make them acceptable.

**Result:** 5/5 fixtures pass with 0 generic-drift violations.

---

## 5. Recommended Next-Step Routing

**Logic verified against the 5 fixtures.** Routing rules in the system prompt:

| Dominant gap | Routes to | Verified? |
|---|---|---|
| Unsupported claims, safer framing, proof-aware content, missing FAQ/service-page detail | Contento | ✅ 3/3 claim-heavy fixtures route here |
| Service/entity/FAQ/answer-readiness | AI Visibility | ✅ Real-world local fixture routes here |
| CTA, contact, booking, follow-up, dormant leads | Recovery | ✅ Real-world SaaS fixture routes here |
| Reviews, testimonials, case studies, proof pages | Proof & Reputation | ⚠ Not exercised in current fixtures — add Phase 2 |
| Agency client | Agency White Label | ⚠ Not exercised in current fixtures — add Phase 2 |
| Confidence too low | Manual Review | ⚠ Not exercised in current fixtures — add Phase 2 |

Three of the six routes are covered by red-team fixtures. The other three are correctly described in the prompt but not yet stress-tested. Add fixtures in Phase 2.

---

## 6. Snapshot Flow Validation

### Intake (`/snapshot`)
- ✅ Name, email, company, website, company type, primary worry fields present
- ✅ Optional phone field
- ✅ Agency checkbox
- ✅ Medical/wellness checkbox
- ✅ UTM source capture from `?source=` or `?utm_source=`
- ✅ Email format validation
- ✅ Website min-length validation
- ✅ Validates that website is at least 3 chars + email is well-formed before submit

### Generation
- ✅ Posts `auditType: 'snapshot'` to `/api/audit`
- ✅ Server-side rate limit enforced (`audit-usage.ts`)
- ✅ Zod validation on output
- ✅ Repair retry on validation failure
- ✅ Throws (not silently mocks) on second-pass failure

### Output budget
- ✅ Prompt enforces exactly 1 claimFinding + 1 aiVisibilityFinding + 1 demandLeakageFinding for snapshot mode
- ✅ priorityMatrix capped at 1 item
- ✅ sevenDayFixList and thirtyDayActionPlan empty

### Delivery
- ✅ Redirects to `/audit/[publicId]`
- ✅ Public report view renders snapshot-shaped output correctly
- ✅ Bottom CTA card includes wedge strip + free-snapshot link
- ✅ Disclaimer rendered

### CTA to paid
- ✅ Snapshot intake shows two upsell cards ($99 Starter, $299 Full)
- ✅ "Recommended Scrutexity Next Step" card on every report
- ⚠ No explicit "Upgrade to Starter for this site" CTA on the snapshot report itself — the upsell is on the next-step card and the snapshot intake. **Minor improvement opportunity.**

### Blockers
- None for the founder-led sprint.
- For unattended snapshot launch: confirm live LLM output produces a 3-item snapshot (not a full audit) when `auditType: 'snapshot'` is sent. The prompt explicitly instructs this; one live run confirms.

---

## 7. Pricing / Checkout Validation

### Pricing page (`/pricing`)
- ✅ Free Snapshot $0 card (links to `/snapshot`)
- ✅ Starter Audit $99 one-time card
- ✅ Full Visibility & Trust Audit $299 one-time card
- ✅ Agency Audit System $799/month card
- ✅ Wedge strip under headline
- ✅ Required disclaimer present
- ✅ Old $29 / $49 / $99 Agent SKUs removed

### Stripe env vars
- ✅ `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` referenced in pricing UI
- ✅ `NEXT_PUBLIC_STRIPE_FULL_PRICE_ID` referenced
- ✅ `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` referenced
- ✅ `.env.example` updated to document new SKUs and remove old Pro/Agent SKUs
- ⚠ **Not yet set in production.** This is the operational gate.

### Checkout route (`/api/checkout`)
- ✅ Accepts `mode: 'payment'` for one-time ($99, $299) and `mode: 'subscription'` for $799/mo
- ✅ Stripe SDK typing shim applied (newer Stripe SDK removed `LatestApiVersion` / `StripeConfig` types)

### Webhook route (`/api/webhooks/stripe`)
- ✅ Handles `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`
- ✅ Stripe SDK shim applied for `current_period_end` and `invoice.subscription` typing drift
- ⚠ One-time payment success → audit unlock is not yet wired. **For the first 30 days this is acceptable** because Nick (founder) is delivering each audit personally. For unattended launch, wire `checkout.session.completed` for one-time mode to mark the related Audit row as paid (the schema already has a `verified` field that can carry this).

### Paid-audit unlock flow
- Current state: Free snapshot is fully public. Starter/Full would currently produce the same output as snapshot unless `auditType: 'starter'` or `'full'` is sent.
- Founder-led workflow: Nick sets `auditType: 'starter'` manually in the POST body and shares the resulting `publicId` with the paying customer.
- Unattended workflow: needs a thin post-checkout step that re-runs the audit with the paid `auditType` and stores the result against the customer's email. **Not required for the first 30 days.**

---

## 8. Report Review / Badge Validation

### Copy
- ✅ "AuditGPT Report Review" — confirmed
- ✅ "Verified by AuditGPT" — fully removed from active product surfaces
- ✅ Claim count + expiry surfaced on badge SVG
- ✅ Disclaimer-style language ("This review states what AuditGPT examined on the date of the audit. It does not certify truth, ranking, AI visibility, legal compliance, clinical safety, or revenue outcomes.")

### Behavior
- ✅ Three SVG variants: active review, expired review, missing report
- ✅ Active variant displays company name + claim count + expiry month
- ✅ Expired variant shown after 90 days
- ✅ Missing variant shown when no audit found
- ✅ `/verified/[publicId]` page lists the six status counts (supported, weakly_supported, needs_evidence, overstated, unsupported)
- ✅ Embed code copy-paste-ready

### Risks
- None new. The badge no longer implies certification.

---

## 9. Safety Sweep Result

Active source scanned (excluding `legacy/`):

| Phrase | Found in active product copy? | Action |
|---|---|---|
| "truth engine" | Yes — `src/app/legal/page.tsx:59` | **Fixed.** Footer now reads "AuditGPT by Scrutexity · Claim ↔ Evidence ↔ AI/search readability ↔ Demand leakage" |
| "Polsia" | Only as CSS class tokens (`card-polsia`, `btn-polsia`) and devnotes in archived/comments | No action — internal-only |
| "brutal" | Not found in active source | None |
| "deadpan" | Not found | None |
| "forensic" | Not found | None |
| "AI slop" | Not found in active product copy | None |
| "Verified by AuditGPT" | Only in devnotes saying "*replaces the old…*" | No action — clearly historical |
| "guaranteed rankings" | Not found in product copy | None |
| "guaranteed revenue / bookings" | Not found | None |
| "AI will cite / Google will rank" | Not found | None |
| "compliance approved / clinically approved / legal safe" | Not found | None |
| "FDA-approved clinic / risk-free / permanent results / best provider / instant results / 10 years younger" | Only in red-team fixtures as quoted claim text (the audited business's own copy that AuditGPT is *flagging*) — this is correct behavior per the spec | None |

Remaining risks: None. The contract eval will block any future regression that introduces these phrases into generated output.

---

## 10. Prompt / Schema / Report Fixes Made This Pass

| File | Change | Why |
|---|---|---|
| `src/lib/audit-context.ts` | Added "FOUR PILLARS" numbered block at the top of `SCRUTEXITY_PREAMBLE` mapping each finding type to a pillar | Wedge spine in the prompt itself |
| `src/lib/audit-context.ts` | Added "ANTI-GENERIC RULES" section forbidding generic SEO/CRO advice | Prevents drift into generic-audit territory |
| `src/lib/eval/contract.ts` | Added `GENERIC_DRIFT_PATTERNS` regex list + structural check | Enforces anti-generic rules at CI gate |
| `src/lib/eval/fixtures.ts` | Added `real-world-saas-demand-leakage` fixture | Tests Recovery routing + demand-leakage pillar |
| `src/lib/eval/fixtures.ts` | Added `real-world-local-ai-readability` fixture | Tests AI Visibility routing + readability pillar |
| `src/app/legal/page.tsx` | Replaced "Truth Engine" footer line with wedge framing | Last user-facing legacy copy |
| `.env.example` | Replaced old Pro/Agent/OneTime Stripe SKUs with Starter/Full/Agency | Aligns env doc with live pricing |
| `.env.example` | Documented active `Z_AI_API_KEY` + optional Anthropic/OpenAI fallback envs | Honest provider documentation |

---

## 11. Eval Result

```
AuditGPT contract eval (Scrutexity v2)
──────────────────────
PASS  ai-saas-overclaims
PASS  med-spa-overclaims
PASS  agency-guarantees
PASS  real-world-saas-demand-leakage
PASS  real-world-local-ai-readability
──────────────────────
Summary: { audits: 5, schemaViolations: 0, forbiddenPhraseViolations: 0, structuralViolations: 0, pass: true }
```

5/5 PASS. Up from 3/3 in the previous pass.

---

## 12. Build / Typecheck / Lint / Build Result

| Gate | Result |
|---|---|
| `tsc --noEmit` | **CLEAN — 0 errors** across `src/**` |
| `npx tsx scripts/eval.ts` | **5/5 PASS** — 0 forbidden phrases, 0 schema violations, 0 structural violations |
| `eslint` on active code (`src/lib`, `src/app`, refocused `src/components/*`) | **CLEAN — 0 errors** |
| `eslint` on shadcn/ui boilerplate (`theme-toggle.tsx`, `carousel.tsx`, `cookie-consent.tsx`, `use-mobile.ts`) | 4 pre-existing errors — not introduced by this refactor or the refocus |
| `next build` | **Sandbox-blocked.** Next.js wants to download `@next/swc-linux-arm64-gnu` from `registry.npmjs.org`; this sandbox has no general internet egress. On any normal dev or CI machine the build will run. tsc + eval cover the real risk. |

---

## 13. Paid Readiness Score

| Tier | Score | What's blocking the next point |
|---|---|---|
| Free Snapshot | **9/10** | One live LLM verification run |
| $99 Starter | **8/10** | Live LLM run + Stripe Price ID + first paying customer signal |
| $299 Full | **6/10** | Multi-page crawl (Phase 2) makes this feel worth $299 unattended; founder-delivered version is 8/10 |
| $799 Agency | **4/10** | Agency dashboard is not built yet; founder-delivered white-label is 7/10 |
| Retainer upsell (Contento / AI Visibility / Recovery / Proof) | **7/10** | The `/next-step/*` landing pages are not yet built; "book a call" placeholders are enough for the first 30 days |

---

## 14. Top 10 Fixes Before Public Launch (ranked by urgency)

1. **Create three Stripe Price IDs** ($99 Starter one-time, $299 Full one-time, $799/mo Agency) and wire env vars. *15 minutes.*
2. **Verify live LLM output** on five real URLs (AI SaaS, agency, med spa, local service, AuditGPT self-review) using your existing `Z_AI_API_KEY`. Confirm Zod accepts the response or that repair pass recovers it. *30 minutes.*
3. **Stand up five `/next-step/*` landing pages** even as one-line "Book a 15-minute call" pages so the recommended-next-step CTA lands somewhere. *45 minutes.*
4. **Wire `checkout.session.completed` (one-time mode) to mark the related Audit row paid.** Required only when you stop founder-delivering. *2 hours.*
5. **Add an "Upgrade to Starter Audit for this site" CTA on the snapshot report** itself (currently the upsell is only on the next-step card and on /pricing). *15 minutes.*
6. **Run the 5-prospect-per-day sourcing routine** for one week to assemble the first 30-prospect list. *2.5 hours total.*
7. **Add three more red-team fixtures** covering Proof & Reputation routing, Agency White Label routing, and Manual Review fallback. *45 minutes.*
8. **Connect a Plausible or PostHog snippet** to track snapshot_intake → snapshot_delivered → starter_checkout → full_checkout → next_step_click. *20 minutes.*
9. **Drop a `Z_AI_API_KEY` rate-limit dashboard** somewhere visible (or just check it daily) so you don't blow the budget on day-one outreach. *5 minutes manual; or 30 minutes for a tiny route.*
10. **Run 5 manual self-reviews on auditgpt.ai itself.** Use the Snapshot, Starter, and Full audit types. Publish whichever lands cleanest at `/audit/self`. *60 minutes.*

---

## 15. Exact Public Launch Plan

### Phase 0 (today): Operational gates
- [ ] Create three Stripe Price IDs.
- [ ] Wire `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`, `NEXT_PUBLIC_STRIPE_FULL_PRICE_ID`, `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID`.
- [ ] Verify live LLM output on 5 real URLs.
- [ ] Stand up five `/next-step/*` placeholders.

### Phase 1 (week 1): First 10 audits
- [ ] Audit these 10 sites manually (running the snapshot via `/snapshot` then logging the output):
  1. One AI SaaS in your network
  2. One agency you know
  3. One AI SaaS Product Hunt launch in the last 30 days
  4. One YC W26 batch company with a public site
  5. One BetaList AI launch
  6. One growth marketing agency from Demand Curve listings
  7. One LinkedIn-active fractional CMO
  8. AuditGPT itself
  9. One AmSpa-listed med spa agency
  10. One local plumbing or HVAC service
- [ ] For each, pick the single best finding to feature in the outbound DM.
- [ ] **Publish nothing yet.** This is internal calibration.

### Phase 2 (week 2): First 10 outbound DMs
- [ ] Send the AI/SaaS founder DM (§4.1) to the 10 sites from Phase 1's AI/SaaS subset.
- [ ] Target: 3 replies. 2 snapshots delivered. 1 $99 conversion.
- [ ] Outreach angle: *"I noticed one specific claim on your hero that doesn't have on-page proof yet, plus one CTA friction point. Want me to send you the 3-point snapshot?"*
- [ ] CTA: *"Want me to send the snapshot?"*
- [ ] Charge: $0 snapshot first; $99 Starter when they ask for more.

### Phase 3 (weeks 3–4): Batches 2, 3, 4
- [ ] 10 agencies (white-label angle).
- [ ] 5 med spa agencies (claim-risk angle, safer framing emphasis).
- [ ] 5 fractional CMOs (discovery artifact angle).
- [ ] Target: 1 paid Full Audit, 1 agency $799 conversation.

### What to watch
- Reply rate per ICP (target ≥3/10).
- Snapshot → $99 conversion rate (target ≥30% of "yes-to-snapshot").
- Which finding type triggered each conversion (claim / visibility / demand leakage / reputation).
- Which message variant produces the strongest replies.

### When to pause and tune
- If 0 replies after 15 DMs: rewrite the DM (probably too long or too sales-y).
- If 5 replies but 0 snapshots delivered: snapshot URL is broken or the link feels untrustworthy.
- If 5 snapshots delivered but 0 $99 conversions: snapshot output is too generic — return to prompt tuning.
- If conversions are happening but the wrong route comes back (e.g., everything routes to Contento): tune `recommendedNextStep` routing in the prompt.

### When to pivot wedge
- 21 days in, if AI/SaaS founders have produced 0 conversions but agency Batch 2 has produced 1 white-label conversation: pivot primary effort to agencies.
- 21 days in, if both batches have produced 0 conversions: pause outreach for a full week. Run 10 self-audits. Tune the prompt against whichever finding type keeps coming back too generic.

---

## Final word

**Do not mark AuditGPT paid-launch-ready until you've run live LLM output on 5 URLs and seen useful, safe, non-generic reports.** The eval gates pass on every fixture I have. They do not prove the live model will behave on novel inputs. That proof comes from running 5 real audits — which takes 30 minutes — and looking at the output yourself.

If those 5 audits produce reports that feel worth $99, AuditGPT is launch-ready for the first 30-prospect sprint. The codebase is no longer the blocker. Distribution and the first three paying customers are.
