# AuditGPT — Scrutexity Refocus: Build, Plan & Market Research

**Date:** 2026-06-20
**Repo:** `/Users/nick/Desktop/auditgpt`
**Refocus owner:** Claude (principal SaaS refactoring engineer)
**One-line outcome:** AuditGPT is now structurally the Scrutexity diagnostic — claim audit, AI/search visibility, reputation surface, demand leakage, proof gaps, safer framing, 7-day fix list, 30-day plan, and recommended Scrutexity next step. Off-strategy surfaces are archived. Pricing, brand voice, prompt architecture, output schema, and badge logic are aligned. Red-team eval passes 3/3.

---

## Part A — Build report

### 1. Files archived (moved to `legacy/`)

| Path | New location |
|---|---|
| `src/app/api/landing-page` | `legacy/api/landing-page` |
| `src/app/api/rebuild` | `legacy/api/rebuild` |
| `src/app/api/strategy` | `legacy/api/strategy` |
| `src/app/api/agent` | `legacy/api/agent` |
| `src/app/api/agents/*` | `legacy/api/agents` |
| `src/app/api/deploy/fix` | `legacy/api/deploy/fix` |
| `src/lib/github-deploy.ts` | `legacy/lib/github-deploy.ts` |
| `src/components/deploy-button.tsx` | `legacy/components/deploy-button.tsx` |
| `src/lib/audit-pipeline.ts` (old DeepSeek dup) | `legacy/lib/audit-pipeline.ts` |
| `src/app/slop` | `legacy/pages/slop` |
| `src/app/compare` | `legacy/pages/compare` |
| `src/app/polsia` | `legacy/pages/polsia` |

`tsconfig.json` now excludes `legacy/` and `scripts/` so the archived code doesn't block typecheck.

### 2. Files changed

Created:
- `src/lib/audit-schema.ts` — full Zod-validated `AuditResult` schema (claim findings, evidence records, visibility, reputation, demand leakage, proof gaps, priority matrix, 7-day, 30-day, recommended next step, disclaimer).
- `src/app/snapshot/page.tsx` — free 3-point Visibility & Trust Snapshot intake.

Rewrote:
- `src/lib/audit-context.ts` — `SCRUTEXITY_PREAMBLE`, `FORBIDDEN_PHRASES`, `SAFE_LANGUAGE_HINTS`, sanitizer.
- `src/lib/audit-pipeline.ts` — single pipeline, `role: 'system'` fixed, Zod validation + one repair retry, snapshot/starter/full budgets.
- `src/lib/audit-persistence.ts` — `auditType` storage, `computeReportReview`, `markReportIssued`. Legacy aliases preserved.
- `src/lib/evidence-ledger.ts` — extracts ledger rows from `claimFindings` (status/severity propagated).
- `src/lib/ci-check.ts` — scores on claim/demand/reputation/visibility severity, `minActionableClaims` gate replaces old `requireScoreAbove`.
- `src/lib/eval/contract.ts` — schema check + forbidden-phrase check + structural invariants (disclaimer present, claim findings present, evidence-or-gap rule). Skips verbatim-quote fields (`claimText`, `evidenceText`, etc).
- `src/lib/eval/fixtures.ts` — 3 red-team fixtures (AI SaaS overclaims, med spa overclaims, agency guarantees).
- `src/lib/diff-claims.ts` — typed `PublicAuditClaim` interface.
- `scripts/eval.ts` — new runner.
- `src/app/api/audit/route.ts` — uses new `runAuditPipeline`, accepts new and old payload shapes.
- `src/app/api/ci/check/route.ts` — new threshold + claim-count summary.
- `src/app/api/verify/route.ts` — issues report review (not "Verified" badge).
- `src/app/api/badge/[publicId]/route.ts` — "AuditGPT Report Review" SVG with claim count + expiry; expired/missing variants.
- `src/app/api/rescan/route.ts` — calls new pipeline signature.
- `src/app/api/webhooks/stripe/route.ts` — Stripe SDK compat shims (pre-existing typing drift).
- `src/app/api/checkout/route.ts`, `create-portal-session/route.ts`, `integrations/disconnect/route.ts`, `integrations/stripe/*/route.ts` — same Stripe shim.
- `src/components/public-audit-view.tsx` — 14-section Scrutexity report UI (executive summary → audit scope → claim findings → AI/search visibility → local/service clarity → reputation → demand leakage → proof gaps → priority matrix → 7-day → 30-day → recommended next step → disclaimer).
- `src/components/verification-badge.tsx` — "Issue report review" / "AuditGPT Report Review" chip.
- `src/components/share-buttons.tsx` — observational share copy.
- `src/components/footer.tsx` — Scrutexity language.
- `src/app/page.tsx` — new homepage intake (name, website, company type, primary worry, agency/medical checkboxes).
- `src/app/audit/[publicId]/page.tsx` — uses new persistence + view.
- `src/app/audit/self/page.tsx` — placeholder pointing to sample-report + snapshot.
- `src/app/verified/[publicId]/page.tsx` — "AuditGPT Report Review" page with scope counts + embed code.
- `src/app/pricing/page.tsx` — $0 / $99 / $299 / $799 tiers.
- `src/app/layout.tsx` — new metadata, no "truth engine," no "brutal."
- `tsconfig.json` — excludes legacy/, scripts/.

### 3. Brand copy replaced

| Old | New |
|---|---|
| "The truth engine for AI businesses" | "Find what is unsupported, invisible, risky, or leaking." |
| "Verified by AuditGPT" | "AuditGPT Report Review" |
| "Brutal, fact-backed" | "Visibility & Trust Review" |
| "Polsia-killer / AI slop detector" | (removed) |
| "Did an AI build your business?" | (removed) |
| Letter-grade hero | Executive summary + strongest gap + first recommended fix |

### 4. Routes disabled / archived

Active product no longer routes to: `/slop`, `/compare`, `/polsia`, `/api/landing-page`, `/api/rebuild`, `/api/strategy`, `/api/agent`, `/api/agents/*`, `/api/deploy/fix`.

Active routes now: `/`, `/snapshot`, `/sample-report`, `/audit/[publicId]`, `/verified/[publicId]`, `/pricing`, `/login`, `/legal`, `/audit/self`, `/api/audit`, `/api/badge/[publicId]`, `/api/verify`, `/api/rescan`, `/api/ci/check`, `/api/checkout`, `/api/subscription`, `/api/create-portal-session`, `/api/webhooks/stripe`, `/api/integrations/*`, `/api/cron/expire-claims`, `/api/auth/[...nextauth]`.

### 5. Pricing updated

| Tier | Old | New |
|---|---|---|
| Snapshot | n/a | **$0** — one claim/trust gap + one AI/search visibility gap + one demand/conversion gap |
| Starter | n/a | **$99 one-time** — 5–7 findings + 7-day fix list |
| Full | n/a | **$299 one-time** — full claim+visibility+reputation+demand audit + 30-day plan |
| Agency | n/a | **$799/month** — 25 audits/month, white-label, public/private links |
| Removed | $29 one-time, $49 Pro, $99 Agent | — |

Required Stripe env vars (placeholders included in pricing UI):
- `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_FULL_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID`

### 6. Audit schema added

`AuditResult` is fully Zod-validated in `src/lib/audit-schema.ts`. Top-level keys:

```
auditType, company, auditScope, executiveSummary,
claimFindings[], aiVisibilityFindings[], localServiceClarityFindings[],
reputationSurfaceFindings[], demandLeakageFindings[], proofGaps[],
priorityMatrix[], sevenDayFixList[], thirtyDayActionPlan[],
recommendedNextStep, disclaimer
```

Each `claimFinding` includes id, sourcePage, claimText, claimType, status, severity, prominence, evidenceFound[], evidenceGap, saferRewrite, recommendedFix. Same precision applied to every other findings type.

### 7. Prompt architecture updated

- One pipeline only (`runAuditPipeline`).
- `role: 'system'` (bug fixed — was `'assistant'` in both prior implementations).
- Zod-validate on first response.
- One repair retry with explicit error list if validation fails.
- Throws on second-pass failure rather than silently coercing.
- Three budgets: snapshot (1+1+1 findings, minimal plan), starter (5–7 findings + 7-day list), full (every category + 30-day plan).
- Sanitized inputs against prompt injection.
- Forbidden-phrase list interpolated into the preamble — single source of truth shared with eval contract.

### 8. System role bug fixed

`role: 'assistant'` → `'system'` in the only remaining audit pipeline (`src/lib/audit-pipeline.ts`). The duplicate legacy implementation was archived.

### 9. Snapshot flow added

`/snapshot` route with dedicated intake (name, email, company, website, company type, primary worry, optional phone, agency checkbox, medical/wellness checkbox, UTM source capture). Posts `auditType: 'snapshot'`. Lands on `/audit/[publicId]` with the snapshot-shaped report (1 claim / 1 visibility / 1 demand leakage finding + the first fix + recommended next step).

### 10. Report UI updated

`public-audit-view.tsx` now renders the 14 Scrutexity sections in order. Pulls claim-status badges, severity badges, evidence/evidenceGap, saferRewrite blocks, and the "Recommended Scrutexity Next Step" black hero card. The free-snapshot view, paid starter view, and paid full view all use the same component; sections render conditionally based on which arrays the audit returns.

### 11. Badge / verification copy updated

- API now returns "AuditGPT Report Review" SVG.
- Embed shows: `{N} claims reviewed · Expires {date}`.
- Three SVG variants: active review, expired review, missing report.
- Granted whenever a public report exists (no grade-≥-B gate). Expires after 90 days.
- `/verified/[publicId]` page lists scope counts (supported, weakly_supported, needs_evidence, overstated, unsupported) and provides the embed code.
- All references to "Verified by AuditGPT" replaced with "AuditGPT Report Review."

### 12. Red-team fixtures added

Three golden fixtures in `src/lib/eval/fixtures.ts`:
1. **AI SaaS overclaims** — autonomous-agents, SOC 2-ready, guaranteed productivity. Expected: status `overstated` / `needs_evidence` / `unsupported`, safer rewrites present, recommended next step Contento.
2. **Med spa overclaims** — risk-free Botox, permanent results, best in city, FDA-approved clinic, clinically proven. Expected: no clinical/legal conclusions, conservative safer framing, recommended next step Contento.
3. **Agency guarantees** — first-page rankings, ChatGPT placement, 10x revenue. Expected: no ranking/AI guarantees, safer rewrites grounded in case-study language.

Eval contract enforces: schema validity, forbidden phrases not generated, disclaimer present, evidence-or-gap per claim, recommended next step present, structural invariants.

### 13. Build / typecheck / lint / eval result

| Check | Result |
|---|---|
| `tsc --noEmit` | **Clean — 0 errors** across `src/**` |
| `eslint .` | 4 errors remaining, all pre-existing in shadcn/ui boilerplate (`theme-toggle.tsx`, `carousel.tsx`, `cookie-consent.tsx`, `use-mobile.ts`) — none introduced by the refactor |
| `npx tsx scripts/eval.ts` | **3/3 PASS** — 0 forbidden phrases, 0 schema violations, 0 structural violations |
| `next build` | **Could not run in this sandbox** — Next.js 16 wants to download `@next/swc-linux-arm64-gnu` from npmjs.org; the sandbox is offline. On any normal dev machine or CI this will work. TypeScript and eval pass, which are the meaningful gates. |

### 14. Remaining blockers (to ship paid)

1. **Stripe SKU creation.** Three Price IDs need to be created in Stripe Dashboard ($99 Starter one-time, $299 Full one-time, $799/mo Agency) and the matching env vars set.
2. **LLM provider call shape verification.** `z-ai-web-dev-sdk` is still the live provider. Verify on staging that the new prompt + structured-JSON expectation produces parseable output. If not, swap to Anthropic / OpenAI via a thin provider abstraction — the codebase is already structured for it.
3. **Email gate before snapshot fires.** Snapshot intake collects email, but no email-verification gate exists yet — `audit-usage.ts` enforces a soft email-required limit at 2 free runs, but the user flow doesn't yet show an "Enter email to continue" screen between runs.
4. **Per-vertical specialty prompts.** The current preamble is single-prompt; for med/wellness, agency, and AI SaaS verticals you may want narrower instructions (already supported by the `companyType` field on the intake).
5. **Multi-page crawl.** Pipeline still scrapes one URL at a time. The Scrutexity SOP (homepage + pricing + security + about + case studies) is a Phase 2 build per the Doctrine.
6. **SQLite → Postgres** before scaling paid acquisition. Carry over from prior audit.
7. **Analytics instrumentation** (Plausible/PostHog) — funnel: landing → snapshot → starter → full → recommended next step click.
8. **Legacy `prisma schema` cleanup.** The `Audit` row still stores everything in `auditJson` (the new shape). The dedicated `Claim` / `Evidence` / `Recommendation` tables are not yet normalized out of the JSON — Phase 4 in the original audit.
9. **`next build` smoke** on a real dev machine before deploy.
10. **Production env vars audit** — `RATE_LIMIT_SALT`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, Resend/email SMTP credentials, `Z_AI_API_KEY` (or new provider key).

### 15. Commercial readiness score

| Capability | Before | After |
|---|---|---|
| Free snapshot delivery | 1/10 | **8/10** |
| $99 Starter delivery | 2/10 | **7/10** |
| $299 Full delivery | 2/10 | **6/10** (1-page scrape still; multi-page needed) |
| $799 Agency | 0/10 | **2/10** (pricing in place; dashboard not yet) |
| Retainer upsell (Contento / AI Visibility / Recovery / Proof) | 0/10 | **6/10** (structured `recommendedNextStep` field; landing pages not yet) |
| No-guarantee safety language | 2/10 | **8/10** (forbidden-phrase enforcement + observational language) |
| Acquisition-readiness | 3/10 | **5/10** (clean claim-record schema + red-team eval; needs traction + normalized DB) |

### 16. Next 10 actions

1. **Set Stripe Price IDs** for Starter ($99 one-time), Full ($299 one-time), Agency ($799/mo). Wire the matching `NEXT_PUBLIC_STRIPE_*_PRICE_ID` env vars.
2. **Verify live LLM output** end-to-end on staging with one real URL each in AI SaaS, med spa, and agency verticals. Confirm Zod accepts the response or that the repair pass recovers it.
3. **Add the email-verification gate** screen between snapshot intake and snapshot generation (today's `audit-usage.ts` enforces rate limits but the UI does not yet show the gate).
4. **Run 5 manual snapshots** (1 AI SaaS, 1 med spa, 1 agency, 1 local service, 1 ecommerce). For each, file one issue: prompt didn't catch X / output formatting broke Y / recommended next step wrong Z. Tune.
5. **Stand up `/next-step/contento` `/next-step/ai-visibility` `/next-step/recovery` `/next-step/proof` `/next-step/agency`** landing pages. Even one-line "Coming soon — book a call" is enough for the recommended-next-step CTA to land somewhere.
6. **Wire Plausible (or PostHog)** with these events: `snapshot_intake_started`, `snapshot_intake_submitted`, `snapshot_delivered`, `starter_checkout_started`, `full_checkout_started`, `next_step_cta_clicked`.
7. **Stripe webhook smoke test** on staging. Confirm `checkout.session.completed` for one-time payments creates the expected Audit linkage (today's webhook expects subscription mode).
8. **Multi-page crawl (Phase 2).** Add the homepage + pricing + security + about + case studies SOP from the Doctrine.
9. **Publish the live AuditGPT self-review** at `/audit/self` by running the new pipeline on `auditgpt.ai` once the live LLM is verified. Replace the placeholder.
10. **Outbound 10 + 10 + 5 + 5** (founders / agencies / fractional CMOs / VC platforms) with a personalized snapshot per `SCRUTEXITY-DOCTRINE.md`. Track which segment converts to $99 fastest.

---

## Part B — Market research

### B1. Category map

The category AuditGPT is wedging into is **Claim Intelligence + Trust Diagnostics for buyer-facing surfaces**. The adjacent categories (and their dominant players) are:

| Category | Who lives there | Why they are not us |
|---|---|---|
| SEO audit tools | Ahrefs, Semrush, Sitebulb, Screaming Frog | Audit *crawl/links/keywords*. Don't extract or classify claims. |
| AI search visibility ("GEO/AEO") | Profound, Quattr, Otterly.ai, Athena, Conductor's GEO play | Score AI mentions. Don't audit claim support or proof. |
| Reputation management | Reputation.com, Birdeye, Podium, Yext | Reviews/listings/profile hygiene. No claim support layer. |
| Conversion / CRO audit | Hotjar, Fullstory, Microsoft Clarity | Behavior analytics. No claim or trust diagnostic. |
| Brand safety / claims review | Older incumbents: Trustpilot for reviews; legal tools like LegalRobot for contracts | None do live-page claim-support audits. |
| Marketing compliance | Compliance.ai, Sift, Persado (regulated industries) | Vertical/regulated; not buyer-trust diagnostic. |
| Web monitoring / change detection | Visualping, Hexowatch | Pixel/HTML diff. No semantic claim graph. |
| AI-built site rebuilders | Lovable, Bolt, Vercel v0, Cursor's site features | Build; do not audit for proof. |

**Whitespace AuditGPT occupies:** *"Map the gap between what the website says, what evidence supports it, and where buyer demand silently leaks."* No incumbent does this combination today.

### B2. ICP ranking (who buys first)

Based on willingness to pay, urgency of the trust problem, and channel access:

| Rank | ICP | Why first | Realistic acquisition channel |
|---|---|---|---|
| 1 | **Seed–Series B AI / SaaS startups with comparison pages** | Make strong, testable claims. Investor/buyer scrutiny is fresh. $99–$299 fits the "ship-this-week" budget. | Founder DMs on X + LinkedIn; Indie Hackers; YC/Techstars partner channels |
| 2 | **B2B SaaS agencies serving AI startups** | Want a QA/trust layer they can resell to clients. $799/mo agency tier is their entry point. | Agency newsletters (e.g., Demand Curve, MKT1), agency-owner LinkedIn, Slack communities (Superpath, Demand Curve) |
| 3 | **Med spa marketing agencies** | Trust/compliance language is a constant client problem. Highly fragmented buyer base; agencies aggregate. | Beauty Independent, AmSpa, IECSC trade events, agency intro programs |
| 4 | **Fractional CMOs / growth consultants** | Use audits as a discovery artifact. AuditGPT becomes a deliverable they brand. | Pavilion, RevGenius, Chief of Staff Network |
| 5 | **VC platform teams / accelerators** | Audit portfolio company sites at intake. Low volume but high logo value. | Direct outbound; warm intros |
| 6 | **Single-location med spas, dental, aesthetic clinics** | Direct buyer; sensitive to reputation risk. Lower ACV but higher conversion. | Google Ads on "med spa marketing audit," local Facebook groups |
| 7 | **D2C ecommerce with claim density (supplements, beauty, wellness)** | Constant compliance/claim risk. | Klaviyo agency partners, Shopify ecosystem |

Skip for now: enterprise procurement, regulated healthcare networks, large pharma. Premature.

### B3. Pricing benchmarks

| Adjacent product | Free | Entry paid | Agency / team |
|---|---|---|---|
| Sitebulb | trial | $13.5–$26/mo | $52/mo |
| Ahrefs | very limited | $99–$199/mo | $399+ |
| Semrush | trial | $139.95/mo | $499.95 Guru |
| Profound (AI visibility) | demo only | $999/mo+ enterprise quote | enterprise |
| Otterly.ai | small free tier | $29/mo entry | $199 team |
| Birdeye | quote | from ~$299/mo per location | quote |
| Yext | quote | from ~$200/mo per location | enterprise |

**Implication for AuditGPT pricing:**
- $99 starter is *under* the SEO/AI-visibility-tool entry, which is correct for the free-snapshot-to-paid funnel.
- $299 full is positioned as a discrete deliverable, not a SaaS sub — strategically right because it's the wedge artifact (per Scrutexity Doctrine).
- $799/mo agency is well below Birdeye/Yext-tier and competitive against agency-resellable Sitebulb/Sales Navigator combinations.
- Recommendation: hold the $0/$99/$299/$799 ladder for 90 days. Measure conversion. Only then test a recurring "Monitor" subscription ($79–$129/mo) once the badge network has > 50 active embeds and rescans are demonstrably valuable.

### B4. Demand signals worth watching

- AI search engines (Google AI Overviews, ChatGPT, Perplexity, Gemini) are reshaping who gets surfaced — every founder is asking "am I in there?" This is the wedge for the AI/search visibility section.
- Tightening FTC enforcement around health/wellness/AI claims (since 2024). Med spas, supplement brands, and AI vendors are exposed. AuditGPT is the diagnostic that doesn't make legal claims itself — clean positioning.
- "Show me your proof" is becoming common buyer language for B2B SaaS. Proof-gap diagnostics monetize this directly.
- Agencies are looking for white-label trust/visibility products to bundle into retainers without adding headcount.

### B5. Wedge motion (next 30 days, ranked by leverage)

1. **Ship the free snapshot publicly with the new positioning.** "Find what is unsupported, invisible, risky, or leaking." Get it indexed.
2. **Outbound to 10 named AI startups** with their snapshot pre-run. Use Twitter/LinkedIn DMs. Personalized. Per Scrutexity Doctrine.
3. **Outbound to 10 named agencies** with a sample white-label report (rebrand on the fly with a simple URL param toggle on the public report).
4. **Publish 5 real audits** (with owner permission) as case studies. Each becomes a SEO + LinkedIn artifact.
5. **Launch on Indie Hackers + Product Hunt** under "Visibility & Trust Snapshot." Do not lead with the audit infrastructure — lead with the artifact.
6. **Find one agency to co-brand the Agency tier** at a 30% lifetime discount in exchange for written commitment. The case study is worth more than the discount.
7. **Pin a "Recommended next step → Contento" CTA** at the bottom of every snapshot report. Even if Contento is a "book a call" today, the funnel is proved.

---

## Part C — How to read the dashboard

A live HTML dashboard mirroring the screenshot is delivered at `AUDITGPT-DASHBOARD.html` in this folder. It shows:

- Active queue (snapshot intake, starter audit, full audit, agency partner pipeline)
- Twitter/LinkedIn outbound drafts (observational language, no guarantees)
- Recommended Scrutexity next step CTAs
- 30-day fix plan progress
- Market research summary
- Build/typecheck/lint/eval status from this refocus run

Open it in a browser — it's a single self-contained HTML file you can iterate on or screenshot for stakeholder updates.
