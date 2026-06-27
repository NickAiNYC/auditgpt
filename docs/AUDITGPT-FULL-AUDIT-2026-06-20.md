# AuditGPT — Complete Product, Technical, Strategic & Launch-Readiness Audit

**Audit date:** 2026-06-20
**Repo audited:** `/Users/nick/Desktop/auditgpt` (the `/Users/nick/Claude/Projects/AuditGPT` folder is empty — code lives on Desktop)
**Commit basis:** working tree as of 2026-06-20 ~08:46 local
**Auditor frame:** principal SaaS architect + product auditor + prompt safety + B2B conversion + acquisition reviewer
**Verdict in one line:** A real, shippable product exists — but it is the *wrong* product for the Scrutexity strategy. The brand inside the codebase is "Polsia-killer / truth engine for AI businesses," not "diagnostic front door for governed marketing and demand Retention."

---

## 1. Executive Summary

AuditGPT is real, technically solid, and partially production-ready. It is **not** aligned with the Scrutexity AuditGPT spec in the project instructions. The repository implements a *prior* product thesis ("Polsia-killer / AI-slop detector / due-diligence audit + landing-page rebuilder + execution agent") and has substantial engineering investment behind it (35 API routes, Prisma schema, evidence ledger, paywall enforcement, NextAuth, Stripe, SSRF-safe fetcher, contract eval harness, CI integration, badge/verification system, 5 DB migrations).

There is one bright spot of strategic alignment: `/sample-report` is built to the new Scrutexity Claim Audit spec — claim text, status (Verified / Weakly Supported / Unsupported / Overstated), risk level, evidence found, recommended fix, safer replacement copy. This is the *only* surface that matches the Scrutexity doctrine. Everything else — `/`, `/slop`, `/compare`, `/polsia`, pricing, the audit JSON schema, the prompt, the LLM output contract, the data model, the public report view — is the old product.

The headline gap: the JSON the LLM returns (`verdict`, `grade_stamp`, `report_card`, `red_flags`, `assumptions_to_test`, `website_fixes`, `services_to_hire`, `action_plan`, `industry_benchmarks_table`, `slop_markers`, `competitor_analysis`) **has no concept of a claim**. There is no field for `claimText`, `status` (verified/weakly supported/unsupported/overstated), `severity`, `evidenceFound`, `recommendedFix`, `saferReplacement`. The `AuditClaim` table exists in Prisma, but it stores derivative observations from the existing report sections, not the claim records the sample report shows.

Pricing is also misaligned: live pricing is **$29 one-time / $49 Pro / $99 Agent**, not the **$0 / $99 / $299 / $799/month** ladder the Scrutexity AuditGPT business plan requires. There is no $99 starter, no $299 full report, no $799/mo agency tier, no free 3-point snapshot workflow.

The product also contains explicit guarantee-style language and brand markers the locked positioning forbids: "brutal," "deadpan / forensic," "the truth engine," "AI-slop / rebuild this site," "Polsia-killer," banned-phrase lists like "delusion" and "founder probably believes." This is fine for a takedown product targeting Polsia. It is wrong for "Governed marketing and demand Retention for businesses where trust matters."

**Bottom line:** roughly 70% of the engineering is reusable; ~100% of the prompt, schema, report shape, pricing, and brand voice need to be replaced. AuditGPT is **not** ready to support paid AuditGPT audits as defined in the project spec. It *is* ready to support the older "Polsia-killer" thesis — but that thesis has been retired.

---

## 2. What AuditGPT Currently Is

A Next.js 16 + TypeScript app (React 19, App Router, Tailwind 4, shadcn/ui) with:

- A 2-question wizard ("Create new company" vs "Grow my company") that calls `/api/audit`.
- A scraper (`safe-fetch.ts` — SSRF-protected, byte-bounded, redirect-bounded) that grabs `<title>`, meta description, h1/h2/h3, paragraphs, links from one URL.
- A single LLM call (DeepSeek via direct fetch in `audit-pipeline.ts`, or Z-AI SDK in `/api/audit/route.ts` — the two implementations diverge; see §13) that returns a fixed JSON schema (verdict A+/F, score 0–100, report_card, red_flags, assumptions_to_test, website_fixes, services_to_hire, action_plan, benchmarks, slop_markers, competitor_analysis vs. MakerPad/Cofounder/Polsia/NanoCorp).
- A tabbed dashboard: Audit | Competitors | Rebuild (when slop detected) | Landing page | 12-week strategy | Execution agent | Custom agents.
- Persistence to SQLite via Prisma with a 10-char `publicId` for public sharing at `/audit/[publicId]`.
- A "Verified by AuditGPT" badge (`/api/badge/[publicId]` SVG, `/verified/[publicId]` page) with 90-day expiry, granted if grade ≥ B, score ≥ 70, no critical red flags, no slop markers.
- An evidence ledger (`AuditClaim` table) hashing each report-section item with a 90-day TTL for drift/rescan logic.
- Rate limiting (free: 5/day per IP with hourly sub-limit, soft email gate at 2; paid: 100/day) with a global $50/day cost-budget brake.
- Stripe checkout for one-time $29 / Pro $49/mo / Agent $99/mo, webhook handler, customer portal.
- NextAuth (Google + GitHub + magic-link email).
- Several auxiliary AI endpoints: `/api/landing-page`, `/api/strategy`, `/api/rebuild`, `/api/agent`, `/api/agents/ad-copy/run`.
- A "Repair Deployment" feature (`/api/deploy/fix`) that opens a GitHub PR with fix files (requires GitHub OAuth integration; encrypted access tokens via `token-crypto.ts`).
- A CI eval harness (`scripts/eval.ts`, `src/lib/eval/contract.ts`) that pattern-checks output for banned phrases, the 2-sentence cap, and `insufficient data` coverage against recorded fixtures — wired into GitHub Actions.
- Marketing pages: `/`, `/slop`, `/compare`, `/polsia` (redirects to `/compare`), `/pricing`, `/login`, `/legal`, `/sample-report`.

The framing across these surfaces is **due-diligence + anti-AI-slop**, not claim/visibility/reputation/demand-leakage diagnostic.

---

## 3. Product Inventory

### Intake features

| Feature | State | Notes |
|---|---|---|
| Path picker (`new` / `grow`) | Complete | Drives whether scrape runs |
| Q1 (website URL or pitch) | Complete | Min 3 chars URL / 20 chars pitch |
| Q2 industry select + free-text focus | Complete | 12 industry options; med spa is one of them |
| Slop-flow handoff (`sessionStorage` from `/slop?` to `/?flow=slop`) | Complete | Pre-fills Q1, jumps to Q2 |
| Lead capture / email gate before audit | **Partial** | `audit-usage.ts` enforces `EMAIL_REQUIRED` after 2 free runs, but the UI has no email gate screen — users hit a 429 instead |
| Agency / medical / wellness intake checkboxes | **Missing** | Spec calls for these; not present |
| Goal / budget fields | **Missing** | |
| Intent/source UTM tracking | **Missing** | No analytics instrumentation per SELF-AUDIT.md |
| Success state | Complete | Tabbed dashboard |

### Audit features

| Feature | State | Notes |
|---|---|---|
| Single-page scrape | Complete | Only the URL the user enters; no multi-page crawl |
| Claim extraction | **Stub / not aligned** | Returns generic "report_card facts" and "red_flags" — not structured claims with status + evidence + fix |
| Claim classification (verified / weak / unsupported / overstated / critical) | **Missing in product, present in `/sample-report` static data only** |
| Evidence gap detection | **Partial** | Implicit in red_flags; no dedicated evidence field per claim |
| AI/search visibility checks | **Missing** | No AEO/GEO logic; no entity-clarity checks; no FAQ presence check |
| Local visibility / GBP checks | **Missing** | No Google Business Profile, no review platform, no NAP consistency |
| Reputation surface review | **Missing** | No review platform scan, no testimonial structure checks |
| Claim drift / missed-call / contact-form review | **Missing** | No CTA inventory, no missed-call Retention logic |
| Medical/wellness guardrails (CPOM, HIPAA, BAA-ready language) | **Missing** | No specialty prompts; same LLM call regardless of industry |
| AI-slop detector | Complete (but off-strategy) | Polsia subdomains, "powerful platform that empowers", missing core pages — solves wrong problem for the locked positioning |

### Report features

| Feature | State | Notes |
|---|---|---|
| Verdict / scorecard (A+/F + 0–100) | Complete | Misaligned: a single letter grade for the whole site is not what the Scrutexity spec asks for |
| Findings list | Complete | But not claim-structured |
| Risk states per item | **Missing in live audits, present in `/sample-report` static fixture only** |
| Priority matrix / 30-day plan | **Partial** | `action_plan` exists but is generic 3–7 steps, not the prioritized 7-day / 30-day matrix the Scrutexity spec requires |
| Public report URL (`/audit/[publicId]`) | Complete | Free, no login, shareable |
| Private report | **Missing** | All audits are public — no private/unlocked distinction |
| Sample report | **Complete and ON-strategy** | `/sample-report` is the one Scrutexity-aligned artifact |
| Export / PDF | **Stub** | "Export" button calls `window.print()` only |
| Proof artifacts | **Missing** | No proof checklist, no claim-record exports |
| Badge / verification | Complete | But verifies on grade ≥ B + score ≥ 70 + no slop, not on Scrutexity criteria |
| Recommendations | **Partial** | `services_to_hire` is generic ("hire SEO consultant"), not "next step = Claim Rewrites / AI Answer Reality / Retention / Proof" |
| 7-day fix list | **Missing** | |
| 30-day action plan | **Partial** | `action_plan` field; not weighted, no proof gap separation |
| Recommended Scrutexity next step | **Missing** | The crucial integration point — no field exists |
| Safer-framing replacement copy | **Missing in live audits, present in `/sample-report` only** |
| Disclaimer block (no legal/clinical/ranking/AI guarantees) | **Missing — and contradicted** by current copy ("the truth engine," "verified", "brutal") |

### AI / Prompt features

| Feature | State | Notes |
|---|---|---|
| Anti-slop preamble (banned words, 2-sentence cap, fact rule) | Complete | Single source of truth in `eval/contract.ts` |
| Prompt injection sanitization | Complete | `sanitizeInput()` strips `<|im_start|>`, `[system]`, code fences, control chars |
| Structured output (JSON) | Complete | But the prompt does not use the model's structured-output mode — relies on text parsing with regex extraction |
| Provider abstraction | **Broken** | `/api/audit/route.ts` uses Z-AI SDK; `lib/audit-pipeline.ts` uses DeepSeek direct fetch. Two paths, two providers, neither wired together. The "live" audit route uses ZAI; the library function is unused by the main flow. |
| Fallback / retry on parse failure | **Missing** | One try, then 502 |
| Model configuration | **Hardcoded** | `deepseek-v4-flash` (a model name that does not exist as of cutoff — likely a typo or a placeholder) in the lib; ZAI default in the route |
| Logging / observability | **Minimal** | `console.error` only; no structured logs, no LLM trace storage |
| Red-team test fixtures | **Thin** | `eval/fixtures.ts` exists but per CONTRACT.md only 2 cases — confirmed in the file's own warning |
| Evidence-required behavior | Complete | "insufficient data" enforced via insufficient-data coverage check |
| No-guarantee language | **Violated** | Brand copy says "fact-backed," "truth engine," "brutal," "verified" — exactly the language the Scrutexity spec forbids |
| Medical/wellness overclaiming guard | **Missing** | No CPOM / HIPAA / BAA / clinical-advice guard in the prompt |
| AEO/GEO overclaim guard | **Missing** | Sample report claims things like "SOC 2 Type II certified" patterns but the live prompt does not differentiate compliance claims |

### Integration features

| Feature | State | Notes |
|---|---|---|
| Stripe checkout + webhook + portal | Complete | But on wrong prices ($29 / $49 / $99) |
| NextAuth (Google + GitHub + magic link) | Complete | Magic link requires SMTP env vars |
| Email (Resend) | Wired | Not used for snapshot delivery; just NextAuth |
| GitHub OAuth + deploy-fix PR flow | Complete (and surprising) | Encrypted token storage, creates branch + PR with fix files. **Off-strategy** — pushes AuditGPT toward "code repair tool" not "trust diagnostic" |
| CRM / lead capture | **Missing** | |
| Analytics tracking | **Missing** | SELF-AUDIT.md flags this |
| Claim Rewrites handoff | **Missing** | No data path |
| Retention handoff | **Missing** | |
| AI Answer Reality handoff | **Missing** | |
| Proof / Verify handoff | **Partial** | The badge system is a primitive version, but it badges grade ≥ B audits, not Scrutexity Proof artifacts |
| Agency dashboard / white-label | **Missing** | |

---

## 4. Valuable Assets Already Built (Preserve)

These are *real* engineering wins that the new product can keep:

1. **`safe-fetch.ts`** — SSRF-hardened public-only HTTP fetcher with private-IP blocking, redirect limits, byte caps, content-type enforcement. This is genuinely good and rarely done right; reuse as-is.
2. **`audit-usage.ts`** — DB-backed rate limiter with hourly/daily/global-budget buckets, salted hashed IP keys, email-required escalation. Switches to the right buckets for paid vs free. Solid.
3. **`evidence-ledger.ts`** + `AuditClaim` Prisma model — the hashing/TTL/section/position skeleton is the *right* shape for the future ClaimRecord system. The values it stores today are wrong, but the table is reusable.
4. **`eval/contract.ts`** + `scripts/eval.ts` + CI workflow — machine-checkable output contract with single source of truth shared between prompt and test. The contract's *content* needs to change but the *pattern* is excellent.
5. **`audit-persistence.ts`** + public/private `publicId` split + verification lifecycle (90-day TTL, expiry reaper cron, `ExpiryRescanJob`) — all reusable for Scrutexity claim audits.
6. **`token-crypto.ts` + `oauth-state.ts`** — encrypted credential storage and OAuth state for integrations. Reusable for any future connector.
7. **Prisma schema** — User / Account / Session / Subscription / Audit / MonitoredSite / RescanLock / ExpiryNotification / ExpiryRescanJob / AuditUsageBucket / Integration / OAuthState. These are correctly modeled.
8. **`/sample-report` page** — the ONE Scrutexity-aligned surface; treat as the spec for the new live report shape.
9. **Public audit page (`/audit/[publicId]`)** + share buttons + verified page + embeddable SVG badge — the public-report system. Re-skin and re-aim, don't rebuild.
10. **Migration discipline** — `pre-migrate-check.mjs`, `test-migration.ts`, `test-migration-genuine.ts`, `test-full-migration-chain.ts`. Strong for a solo project. Keep.
11. **NextAuth wiring + multi-provider** — reusable.
12. **Stripe wiring** (webhook, portal, checkout) — reusable; just point at new SKUs.

---

## 5. Broken / Stale / Misaligned

### Broken or risky

- **Two divergent audit pipelines.** `src/lib/audit-pipeline.ts` posts to DeepSeek directly using model `deepseek-v4-flash` (not a real model name as far as I can verify). `src/app/api/audit/route.ts` uses the Z-AI SDK. The library function appears unused by the API route — duplicate logic, duplicate prompts, divergent providers. Pick one or break.
- **`role: 'assistant'` for system prompt.** In both `/api/audit/route.ts` and `audit-pipeline.ts`, the system prompt is sent with role `'assistant'`, not `'system'`. Most chat completion APIs accept both but treat them very differently — `assistant` is a *prior turn*, not the system instruction. This likely degrades adherence to the prompt and is almost certainly a bug.
- **`postcss.config 2.mjs`** — a duplicate config file with a space in the name. Likely a macOS Finder copy artifact. Delete.
- **SQLite + in-memory rate limiter ceiling.** Acknowledged in SELF-AUDIT.md; same rate-limit module is now DB-backed (`audit-usage.ts`), but the SQLite dependency caps concurrency under any real load.
- **`/api/agent` requires `subscription.plan === 'agent'`** but the upsell copy on `/pricing` calls it "Agent" → `$99/mo`. None of this matches the Scrutexity ladder. The whole "execution agent / custom agents" tab tree is off-strategy.
- **`/api/deploy/fix` opens a GitHub PR against the user's repo to "fix slop"** — this is a *different product* (code-repair tool) than the AuditGPT spec. Off-strategy.

### Stale / not aligned with the new Scrutexity strategy

- The main homepage `/` (the 2-question wizard) — wrong intake, wrong output shape, wrong CTA, wrong brand voice.
- The Polsia-killer prompt in both `audit-pipeline.ts` and `/api/audit/route.ts` — wrong output schema, wrong tone, includes banned phrases that are themselves unsafe ("delusion," "founder probably believes").
- `/slop` page — anti-AI-slop messaging is not in the locked positioning.
- `/compare` page — competitor takedown framing (Polsia 2.7 Trustpilot, NanoCorp $264.27 revenue) is risky public commentary on real companies. Even with "as of [date]" caveats, it's a litigation magnet relative to a "trust diagnostic" brand.
- `/polsia` redirect — vestigial.
- Pricing page ($29 / $49 / $99) — wrong tiers.
- "Verified by AuditGPT" badge granted for grade ≥ B — the badge claim ("Verified by AuditGPT") implies a stronger thing than the contract can actually guarantee. CONTRACT.md is intellectually honest about this, but the public-facing badge copy is not.
- AgentTab / AgentsTab / RebuildTab / LandingPageTab / StrategyTab in `page.tsx` — all are "execution mode" features that compete with Claim Rewrites / AI Answer Reality / Retention as separate Scrutexity products. AuditGPT is supposed to *feed* those products, not duplicate them.
- `/api/landing-page`, `/api/rebuild`, `/api/strategy` — same: these are Claim Rewrites-class features built into AuditGPT.
- `/api/agents/ad-copy/run` — ad copy generation does not belong in the audit product per the locked spec.

### Duplicate

- Scraping logic exists in *both* `src/lib/audit-pipeline.ts` and `src/app/api/audit/route.ts` (separate `scrapeSite()` implementations with slightly different headers). One is unused.
- Two `postcss.config` files.
- `extractScore` / `extractCompanyName` / `extractJudgment` helpers are duplicated between `src/app/page.tsx` and `src/components/public-audit-view.tsx`.

---

## 6. What Should Be Preserved (Tighter List)

`safe-fetch.ts`, `audit-usage.ts`, `evidence-ledger.ts` (schema only — replace claim types), `audit-persistence.ts` (rename to `report-persistence.ts`), `eval/contract.ts` framework (rewrite the rules), `token-crypto.ts`, `oauth-state.ts`, Prisma schema (keep User/Account/Session/Subscription/MonitoredSite/AuditUsageBucket/Integration/RescanLock/Expiry models; replace Audit and AuditClaim with new claim-record models), Stripe wiring, NextAuth wiring, public report skeleton (`/audit/[publicId]`, `/verified/[publicId]`, `/api/badge/[publicId]`), `/sample-report` (now the spec), CI migration testing.

---

## 7. What Should Be Killed or Archived

- The Polsia-killer / AI-slop framing across `/`, `/slop`, `/compare`, `/polsia`.
- The brand voice ("brutal," "deadpan / forensic," "the truth engine," "delusion," "founder probably believes").
- `/api/landing-page` (Claim Rewrites territory).
- `/api/rebuild` (Claim Rewrites territory).
- `/api/strategy` (advisory work, not diagnostic).
- `/api/agent` (Retention / Claim Rewrites territory).
- `/api/agents/ad-copy/run` + `/api/agents/*` (out of scope entirely).
- `/api/deploy/fix` + `github-deploy.ts` + `DeployFixPR` model (separate code-repair product, not AuditGPT).
- `RebuildTab`, `LandingPageTab`, `StrategyTab`, `AgentTab`, `AgentsTab` in `src/app/page.tsx`.
- Verification badge auto-grant logic (replace with claim-coverage / proof-coverage criteria, not letter grades).
- "Polsia-killer" prompt in both audit implementations.
- `polsia/page.tsx` (redirect can stay if you want backlinks).
- `compare/page.tsx` — too risky as currently written.

Archive (don't delete) in a `legacy/` directory in case you ever revive the Polsia-killer angle as a separate brand.

---

## 8. Strategic Fit Scorecard (1–10)

Scoring against the locked Scrutexity AuditGPT spec, not the codebase's own goals.

| # | Area | Score | Notes |
|---|---|---|---|
| 1 | Claim extraction | **2/10** | Live audit returns generic "report_card facts" / "red_flags," not structured claim text + status + evidence + fix. Only `/sample-report` shows the right shape (and it's static fixture data). Fix first: rewrite prompt + JSON schema. |
| 2 | Claim classification | **1/10** | No verified / weak / unsupported / overstated / expired states in live output. Sample report has it; code doesn't. |
| 3 | Evidence / proof gap detection | **2/10** | `red_flags` sometimes notes "no testimonials found," but no per-claim evidence field, no proof gap checklist. |
| 4 | Safer framing recommendations | **1/10** | Present only in `/sample-report` static data; not generated by any live route. |
| 5 | AI / search visibility review | **2/10** | Slop signals overlap a bit (empty meta, missing core pages) but no AEO/GEO, no entity, no FAQ, no buyer-question testing. |
| 6 | Local / service clarity review | **1/10** | No GBP, no NAP, no local intent. Not implemented. |
| 7 | Reputation surface review | **1/10** | No review platform scan, no testimonial structure check, no provider authority check. |
| 8 | Missed-Claim drift review | **0/10** | Not implemented in any form. |
| 9 | Medical / wellness guardrails | **0/10** | Same prompt regardless of industry; no CPOM, HIPAA, BAA, or clinical-advice guard. |
| 10 | Agency white-label usefulness | **0/10** | No agency tier in pricing, no white-label settings, no client queue. |
| 11 | Public / private report usefulness | **4/10** | Public `/audit/[publicId]` works; "private unlocked" tier missing. |
| 12 | Sample report quality | **8/10** | `/sample-report` is the one well-aligned asset. Wins points for actually showing the new product. Loses points because it's frozen fixture data and unreachable from `/`. |
| 13 | 7-day fix list | **0/10** | Not implemented. |
| 14 | 30-day action plan | **3/10** | `action_plan` field exists but is generic 3–7 steps, not the prioritized matrix the spec asks for. |
| 15 | Claim Rewrites handoff readiness | **1/10** | No "next step" field, no claim → safer copy → content brief pipeline. |
| 16 | AI Answer Reality handoff readiness | **1/10** | No visibility-gap → answer-readiness path. |
| 17 | Retention handoff readiness | **0/10** | No demand-leakage taxonomy at all. |
| 18 | Proof / Verify handoff readiness | **3/10** | Badge + verified page exist as primitives but verify the wrong criteria. |
| 19 | No-guarantee safety language | **2/10** | Brand language ("truth engine," "verified") and prompt language ("brutal," "fact-backed") imply guarantees the product cannot make. CONTRACT.md is honest; product UI is not. |
| 20 | Commercial readiness for $99/$299 | **2/10** | $99 starter and $299 full do not exist as SKUs. Sample report could justify $99 if intake + delivery existed. Cannot charge $299 today; nothing to deliver. |
| 21 | Acquisition-readiness | **3/10** | Real engineering, but the data model holds the wrong type of data. The moat (claim dataset) is empty because the product collects observations, not claims. |

**Composite:** ~2.0/10 — useful infrastructure, wrong product on top of it.

---

## 9. Prompt / AI Architecture Audit

### What exists

Two near-identical system prompts in `src/lib/audit-pipeline.ts` and `src/app/api/audit/route.ts`. A shared `ANTI_SLOP_PREAMBLE` in `src/lib/audit-context.ts` with banned-phrase list, 2-sentence cap, hardcoded industry benchmarks. Smaller prompts in `/api/landing-page`, `/api/rebuild`, `/api/strategy`, `/api/agent`, `/api/agents/ad-copy/run` that all import the preamble.

### What's strong

- Single source of truth for banned phrases (eval contract = prompt preamble). Pattern is right.
- Forced "insufficient data" rather than fabrication.
- 2-sentence-per-field cap (forces compression).
- Prompt injection sanitization on user inputs.
- Structured JSON output expectation.

### What's wrong (in priority order)

1. **The output schema is wrong for AuditGPT-by-Scrutexity.** It scores letter grades and lists generic facts. It does not produce claim records. Rewriting this is the single highest-impact change.
2. **System prompt is sent with `role: 'assistant'`** in both implementations. Should be `role: 'system'`. Likely a real adherence bug.
3. **Hallucination risk on the slop / competitor blocks.** The competitor_analysis prompt instructs the model to make specific stat claims about Polsia ("Trustpilot ~2.7"), NanoCorp ("$264.27 total revenue"), MakerPad ("acquired by Zapier 2021"). These are sourced *outside* the scrape and outside the audit data — exactly the kind of "model memory cite" the anti-hallucination block elsewhere forbids. The prompt papers over this with "as of [date]" caveats. Risky.
4. **The slop detector is itself a claim-making layer.** It outputs `probability` (a number) and `signals` (a list). The probability has no audit trail — the model invents it. CONTRACT.md notes that "untraced numbers" are advisory; this is one of the worst offenders.
5. **No evidence-required structure per claim.** The prompt says "say insufficient data" but does not enforce per-claim evidence — only per-section.
6. **No safety scaffolding for medical / wellness / legal / compliance categories.** Same prompt for every industry. CPOM violations, accidental clinical advice, HIPAA claims, BAA-ready language — none are guarded.
7. **No ranking / revenue / "AI will cite you" guards.** The model is told to be "deadpan" but is not blocked from absolute claims like "Google ignores you because…" — the new spec explicitly forbids these.
8. **No JSON-mode / structured output mode.** Relies on text parsing + `firstBrace/lastBrace` extraction. One bad token = 502.
9. **No retry, no schema validation (Zod is in deps but unused for LLM output validation), no model fallback.**
10. **`deepseek-v4-flash`** is almost certainly a wrong model name (DeepSeek's lineup is `deepseek-chat`, `deepseek-coder`, `deepseek-reasoner`, `deepseek-v3`; no public `deepseek-v4-flash` as of cutoff). Either dead code or a hidden 404.

### Prompts to keep / rewrite / add

- Keep the *structure* of ANTI_SLOP_PREAMBLE (single source of truth pattern).
- Rewrite the audit prompt around claim records (see §10 spec).
- Add: claim-extraction prompt (per page section), claim-classification prompt, evidence-check prompt, safer-rewrite prompt, recommended-Scrutexity-next-step prompt.
- Add: medical/wellness specialty preamble; legal/compliance preamble; AI/SaaS specialty preamble (with the SOC 2, "fully autonomous," "guaranteed" guards from the sample report).
- Delete: rebuild prompt, landing-page prompt, strategy prompt, ad-copy prompt, execution-agent prompt.
- Add red-team fixtures: AI SaaS overclaims, med spa overclaims, agency overclaims (as in §16).

---

## 10. Report Quality Audit

The live JSON output renders into a dashboard with sections: report_card / red_flags / assumptions_to_test / website_fixes / services_to_hire / action_plan / industry_benchmarks_table / slop / competitor_analysis.

Mapped against the Scrutexity-spec report sections:

| Required section | Status |
|---|---|
| 1. Executive Summary | **Stub** (verdict_header + company_info — too thin) |
| 2. Audit Scope | **Missing** (no pages-scanned, no date, no coverage statement on the live audit; present only in `/sample-report` fixture) |
| 3. Claim / Trust Findings | **Wrong shape** (report_card + red_flags are generic) |
| 4. AI / Search Visibility Findings | **Missing** |
| 5. Local / Service Clarity Findings | **Missing** |
| 6. Reputation Surface Findings | **Missing** |
| 7. Claim drift Findings | **Missing** |
| 8. Proof Gaps | **Missing** |
| 9. Safer Framing Recommendations | **Missing in live, present in `/sample-report`** |
| 10. Priority Matrix | **Missing** |
| 11. 7-Day Fix List | **Missing** |
| 12. 30-Day Action Plan | **Partial** (`action_plan` is generic, not prioritized by fix-now / add-proof / rewrite / monitor) |
| 13. Recommended Scrutexity Next Step | **Missing** |
| 14. Disclaimer | **Missing — and brand language pushes the other way** |

**Can the live report support a paid audit?**

- $99 starter: **No.** A buyer would receive a verdict letter, a few facts, a few red flags, and three to seven generic "action plan" items. Not a paid diagnostic. The `/sample-report` would justify $99 *if it could be generated for any URL*, but it cannot — it's a static fixture.
- $299 full: **No.** Five whole findings categories (AI Answer Reality, local clarity, reputation, Claim drift, proof gaps) and the recommended-next-step field do not exist.

The report does not feel like a generic SEO score (it has more opinion), but it also does not feel like a Scrutexity claim audit. It feels like an indie due-diligence opinion column. That is a real product — just not the *intended* product.

---

## 11. Snapshot Workflow Audit (Free 3-Point Visibility & Trust Snapshot)

| Required step | Status |
|---|---|
| Snapshot intake | **Missing** (homepage runs a full audit, not a snapshot) |
| Snapshot generation (3 findings: claim/trust gap, AI/search visibility gap, demand/conversion gap) | **Missing** |
| Snapshot manual override | **Missing** |
| Snapshot delivery (public link, email, embed) | **Partial** — public link infra works, but content shape is wrong |
| Snapshot-to-paid-audit upsell | **Missing** |
| Source / intent tracking | **Missing** |

**Snapshot readiness: 1/10.** Nothing in the current flow is a "snapshot." The free tier today is a *full* audit with the wrong shape. The free / starter / full distinction is enforced only at the "Pro tab paywall" level, not the diagnostic level.

---

## 12. Safety / Guardrail Audit

### Unsafe / risky phrases found

| Phrase | File(s) | Risk | Fix |
|---|---|---|---|
| "The truth engine for AI businesses" | `README.md`, `layout.tsx` title, footer, `globals.css`, `share-buttons.tsx`, `/login`, `/legal`, multiple pages | **Implies guaranteed truth** — Scrutexity spec forbids guarantees | Replace with "Find what is unsupported, invisible, risky, or leaking" |
| "Brutal," "deadpan," "forensic" | `audit-pipeline.ts`, `/api/audit/route.ts` prompts; `compare/page.tsx`; README; CONTRACT | Brand voice contradicts "Governed marketing for businesses where trust matters" | Replace with the observational language from the locked spec |
| "Verified by AuditGPT" | badge route, `verified/[publicId]/page.tsx`, public audit view | **Implies third-party verification** | Replace with "Claim audit scope: <X claims reviewed, Y supported, Z evidence-gapped>" — name what was actually checked |
| "Polsia-killer" | `audit-pipeline.ts`, `/api/audit/route.ts` headers/UA strings | Brand attack | Remove |
| "We get you into ChatGPT" / "We guarantee first-page rankings" | Not in current copy but **tested for** in §16 red-team — confirmed absent |
| "Fact-backed" | landing copy across multiple pages | **Implies all output is verified factual** | Replace with "Evidence-anchored where evidence exists; flagged where it doesn't" |
| "Delusion" / "founder probably believes" | `audit-pipeline.ts` banned-phrase list itself names them | These are *banned* phrases but appearing in any user-facing context (even the prompt) is on-brand for the old product, off-brand for the new one | Remove from banned-phrase exemplars |
| "BAA compliant" / "HIPAA certified" | Not asserted, but `/sample-report` flags these as claims to audit — that's correct behavior |
| "Stripe processed $1.9T payment volume in 2023 (from scraped data)" example in the prompt | `audit-pipeline.ts`, `/api/audit/route.ts` | **Encourages the model to fabricate scrape evidence** with citations that look authoritative | Remove this example; use generic placeholder |
| Competitor stat claims in prompt (Polsia 2.7 Trustpilot, NanoCorp $264.27, MakerPad acquired 2021) | `/api/audit/route.ts` prompt + `compare/page.tsx` | **Public statements about real companies, model-memory-sourced**; litigation risk | Remove from prompt; remove `/compare` page or restrict to private demos |
| "Audited by auditgpt.ai" stamp in every output | Both audit routes | Implies audit standard | Replace with "AuditGPT Snapshot / AuditGPT Starter / AuditGPT Full — generated <date>" |
| "Risk-free," "permanent," "best provider," "FDA-approved" | Searched: **not present** in source. Good. |
| "Clinically proven" / "instant results" / "guaranteed bookings" | **Not present.** Good. |

### Safe language to adopt (from the locked spec)

"I could not find…", "This may make it harder…", "Competitors who surface often have…", "This creates a visibility / trust gap…", "No guaranteed rankings, no guaranteed AI answers, no compliance approval, no legal advice, no clinical advice."

### Risk summary

**Highest:** "Verified by AuditGPT" badge + auto-grant logic. The badge says the site is verified; the contract (CONTRACT.md) admits only that 2 recorded fixtures pass three deterministic string checks. This is the single biggest legal exposure in the codebase.

**High:** `/compare` page making specific stat claims about real companies.

**Medium:** "truth engine" tagline and "fact-backed" brand promise across landing surfaces.

**Lower:** prompt examples that include fabricated specific numbers as templates.

---

## 13. Technical Architecture Audit

### Stack

- Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind 4 + shadcn/ui — fine.
- Prisma 6 + SQLite (`file:./db/custom.db`) — SQLite is a launch-only choice; rebuild for paid scale.
- NextAuth 4 with Prisma adapter (DB sessions, magic-link + Google + GitHub).
- Stripe 22.
- LLM: Z-AI SDK in the live `/api/audit` route; DeepSeek direct fetch in the (unused) library.
- Bun + Node hybrid (`bun .next/standalone/server.js`).

### Critical blockers (fix before paid use)

1. **Two divergent audit pipelines, only one of which is wired up.** Consolidate to a single `runAuditPipeline()` and pick one provider with a typed config.
2. **`role: 'assistant'` for system prompt.** Almost certainly a bug; fix to `'system'`.
3. **`deepseek-v4-flash` model name** — verify this model exists or replace.
4. **SQLite + single-instance assumptions** — must move to Postgres before scaling paid acquisition or running concurrent workers.
5. **No LLM output schema validation.** Zod is in deps; use it to parse the model output, with a typed schema and one retry on failure.
6. **No queueing / async job system for slow audits.** A full claim audit is going to be a multi-minute job (multi-page crawl + multiple LLM calls); currently every audit is one in-line POST with `maxDuration = 60`.
7. **Z-AI SDK is `z-ai-web-dev-sdk@0.0.18`** — a v0.0.x pinning a single unknown vendor is fragile. Build a provider abstraction so swapping in Anthropic / OpenAI / DeepSeek is a config change.
8. **`postcss.config 2.mjs`** — delete.

### Medium

- Standalone build copies `.next/static` and `public` manually in the build script — fragile.
- No structured logging.
- No analytics instrumentation (acknowledged in SELF-AUDIT.md).
- No tests beyond migration + contract eval fixtures + a few ad-hoc scripts; no React component or API integration tests.
- Rate limit salt (`RATE_LIMIT_SALT`) is required at runtime — make sure prod env has it.
- Cron endpoints (`/api/cron/expire-claims`, `scripts/run-expiry-cron.mjs`) — confirm auth on these in production.
- Caddyfile committed — fine for self-host, but pin where prod actually runs.
- `bun.lock` + `package-lock.json` both committed — pick one.

### Low

- ESLint config present, runs in CI.
- Dependencies are current and mostly Radix/shadcn — clean.
- Several large unused deps (`@dnd-kit/*`, `@mdxeditor/editor`, `react-syntax-highlighter`, `embla-carousel-react`, `react-day-picker`, `recharts`, `vaul`, `cmdk`, `input-otp`, `@reactuses/core`). Consider pruning for cold-start time and surface area.

### Files requiring immediate attention

- `src/lib/audit-pipeline.ts` — delete or merge into `/api/audit/route.ts`.
- `src/app/api/audit/route.ts` — rewrite prompt + output schema; fix role.
- `src/app/page.tsx` — replace homepage flow.
- `prisma/schema.prisma` — add `Claim`, `Evidence`, `Recommendation` models (see §14).
- `src/components/verification-badge.tsx` and `src/app/api/badge/[publicId]/route.ts` — rewrite badge criteria + copy.
- `src/app/compare/page.tsx` — archive.
- `src/app/api/landing-page|rebuild|strategy|agent|agents/*` — archive.
- `src/app/api/deploy/fix/route.ts` + `src/lib/github-deploy.ts` — archive (separate product).

---

## 14. Data Model Audit

### What exists (Prisma)

User, Account, Session, VerificationToken, Subscription, MonitoredSite, AuditClaim (hash + section/position metadata), RescanLock, ExpiryNotification, ExpiryRescanJob, AuditUsageBucket, DeployFixPR, Audit (path / verdict / score / auditJson blob / publicId / verified flags / lineage / staleClaims), AgentConfig, AgentRun, Integration, OAuthState.

### Missing for the Scrutexity AuditGPT product

Required, ranked by MVP urgency:

| Entity | Required? | Notes |
|---|---|---|
| `AuditRun` (Site, Page, capturedAt, scope, status) | **MVP** | The Audit row exists, but does not represent multi-page scope or page coverage |
| `Page` (auditRunId, url, type homepage/pricing/etc., capturedHtmlHash) | **MVP** | Per-page tracking is the basis for Scrutexity claim audits |
| `ClaimRecord` (auditRunId, pageId, claimText, claimType performance/security/compliance/integration/customer-proof/market-leadership/comparison/guarantee/AI-capability/implementation/pricing/outcome, status verified/weakly-supported/unsupported/overstated/expired/changed/revoked, severity, prominence, position) | **MVP** | The current `AuditClaim` row stores derived observations — needs to become a real claim. |
| `EvidenceRecord` (claimId, evidenceText, evidenceUrl, sourceKind on-page/elsewhere-on-site/third-party, sufficiency) | **MVP** | One-to-many off ClaimRecord |
| `Recommendation` (claimId, action keep/soften/add-proof/rewrite/remove/split/create-content/monitor, suggestedReplacement, priorityTier) | **MVP** | The "fix" + safer-replacement-copy from `/sample-report` |
| `VisibilityFinding` (auditRunId, dimension AEO/GEO/local/entity/FAQ, buyerQuestion, observed, gap) | Phase 2 | Tied to AI/Search Visibility section |
| `ReputationFinding` (auditRunId, surface reviews/testimonials/case-studies/proof-pages, observed, gap) | Phase 2 | |
| `DemandLeakageFinding` (auditRunId, surface missed-call/contact-form/booking-CTA/no-show/dormant-lead/review-request, observed, gap) | Phase 2 | |
| `ProofGap` (auditRunId, claimId?, required, type case-study/credential/data/audit/partner-logo) | Phase 2 | |
| `SaferRewrite` (claimId, originalText, safeText, framingNote) | **MVP** | Can be folded into Recommendation |
| `PriorityAction` (auditRunId, action, tier fix-now/add-proof/rewrite/create-content/improve-visibility/recover-demand/monitor) | **MVP** | Drives the 30-day plan |
| `RecommendedNextStep` (auditRunId, scrutexityProduct Claim Rewrites/AIVisibility/Retention/Proof/AgencyWhiteLabel, rationale) | **MVP** | The crucial Scrutexity-handoff field |
| `PublicReport` / `PrivateReport` (auditRunId, kind, unlockedAt, unlockedBy) | Phase 1 | Separate the public free preview from the paid private report |
| `VerificationBadge` (auditRunId, criteria snapshot, issuedAt, expiresAt) | Phase 1 | Already partially exists |
| `AuditEvent` (auditRunId, event, payload) | Phase 1 | Funnel analytics |
| `SourceIntent` (auditRunId, source, utm, agencyId?) | Phase 1 | Track outbound provenance |
| `AgencyClient` (agencyId, clientId, label, whitelabelSettings) | Phase 2 | For the $799/mo agency tier |
| `IndustryPatternRecord` (claimType, industry, frequency, severityDistribution) | Phase 3 | The dataset moat |

**Recommendation:** do not over-build. MVP just needs `AuditRun`, `Page`, `ClaimRecord`, `EvidenceRecord`, `Recommendation`, `PriorityAction`, `RecommendedNextStep`. The current `Audit.auditJson` JSON blob can keep the rest until volume justifies normalizing.

---

## 15. UX / UI Audit

### Best screens

- `/sample-report` — well-designed, on-strategy, clear sections, risk badges, safer-replacement boxes. This is the spec.
- `/login` (magic-link UX) — clean.
- Verified badge / `/verified/[publicId]` page (visual treatment) — premium feel.

### Weakest screens

- `/` — 2-question wizard is too thin for a "trust diagnostic" intake. Asks industry but does not capture: agency? med/wellness? service category? geography? main service URL vs. homepage? Brand voice ("Let's get started" + "GROW MY COMPANY") feels indie hacker, not Scrutexity.
- Dashboard tabs — 6 tabs (Audit / Competitors / Rebuild / Landing / Strategy / Agent / Agents) crowd the report. Most are off-strategy. The "Audit" tab itself shows a grade A+/F, which is the wrong primary metric.
- `/compare` — risky public talk track.
- `/slop` — wrong category, wrong copy.
- `/pricing` — wrong tiers, wrong tier names, "Brutal Audit Pass" doesn't match Scrutexity tone.

### Missing screens

- Free 3-point snapshot delivery page.
- $99 Starter report view.
- $299 Full report view.
- Agency white-label dashboard.
- Private vs public unlocked report toggle.
- Snapshot intake page (different from full intake).
- Medical / wellness vertical landing.
- AI SaaS vertical landing.
- Agency partner landing.

### Quick UI copy fixes (before any paid use)

- Replace "AuditGPT · The truth engine for AI businesses" with "AuditGPT — find what is unsupported, invisible, risky, or leaking."
- Replace "Verified by AuditGPT" with something scoped to what was checked.
- Replace "Brutal" everywhere.
- Replace "Run a Free Audit" with "Run a Free 3-Point Visibility & Trust Snapshot."
- Remove "fact-backed" hero claims.

### Demo blockers

- Wizard sends to wrong report.
- Sample report unreachable from `/` (only via footer of `/sample-report`).
- Pricing doesn't match what you'll quote.

### Conversion blockers

- No mid-funnel email gate before the full free audit fires.
- No clear "what you get free vs. what you pay for" on the homepage.
- No social proof on the homepage (acknowledged).

---

## 16. Scrutexity Integration Audit

| Handoff | State | Required addition |
|---|---|---|
| → Claim Rewrites | **Missing** | Need: `ClaimRecord` exports as content brief (approved claims, unsupported claims, safer rewrites, FAQ candidates, service-page recommendations). Schema-wise: a `RecommendedNextStep` row with `kind = Claim Rewrites` per qualifying gap. |
| → AI Answer Reality | **Missing** | Need: visibility findings exported as answer-ready content opportunities, entity-clarity fixes, FAQ section recommendations, local/service clarity fixes. |
| → Retention | **Missing** | Need: demand-leakage findings exported as missed-inquiry risks, CTA / follow-up gaps, dormant-lead opportunities, no-show / consult-Retention recommendations. |
| → Verification & Trust Assets | **Partial** | The badge + verified page are primitives. Need: public proof pages, trust blocks, case-study opportunities, badge / verification records that cite *what was checked*, not "Verified." |
| → Agency White-Label | **Missing** | Need agency tier, agency `Integration`, client queue, brand-mark substitution. |

Right now AuditGPT does not feed any of the four downstream Scrutexity products. The Scrutexity integration score is **1/10** (Proof primitives exist; nothing else does).

---

## 17. Commercial Readiness Audit

### Free 3-Point Snapshot
**State:** Not implemented as a distinct artifact. The current free tier is a full (wrong-shape) audit.
**Gap:** snapshot intake + snapshot generator + delivery page + upsell CTA + source tracking.
**Path to live:** 3–5 days of work if the new prompt + schema are already in place.

### $99 Starter Audit
**State:** Cannot deliver.
**Gap:** entire claim audit pipeline (claims, evidence, fix, safer rewrite) + 7-day fix list + Scrutexity next-step recommendation.
**Path to live:** 7–14 days assuming the new prompt + schema land first.

### $299 Full Visibility & Trust Audit
**State:** Cannot deliver.
**Gap:** all five finding categories (claim, AI/search visibility, local/service clarity, reputation surface, Claim drift) + proof gaps + 30-day prioritized plan + safer framing + Scrutexity next step.
**Path to live:** 4–6 weeks of disciplined work. Possible to launch a manually-augmented version in 14 days if you accept a semi-manual SOP.

### $799/mo Agency Audit System
**State:** Cannot deliver.
**Gap:** agency tier + white-label settings + client queue + 25 audits/month metering + PDF export + private/public links + report archive.
**Path to live:** 30–60 days *after* the $99 / $299 SKUs are live.

### Retainer upsell into Claim Rewrites / AI Answer Reality / Retention / Proof
**State:** No structural handoff exists. The "services_to_hire" field is generic and not Scrutexity-anchored.
**Path to live:** simplest possible version is a `RecommendedNextStep` field added to the audit output JSON and rendered as a single decision card at the bottom of every report. ~1–2 days once the JSON shape is right.

---

## 18. Acquisition-Readiness Assessment

**Score: 3/10.**

What would attract an acquirer:

- Solid Next.js codebase, real Prisma data model, real auth, real Stripe, real CI, real migrations.
- Working public report + badge + share infrastructure.
- A genuinely interesting evidence-ledger pattern with TTL + reaper.
- SSRF-hardened crawler + cost-budgeted rate limiter (rare in early SaaS).

What kills the deal today:

- The proprietary data is *generic observations*, not the claim/evidence dataset the spec promises. There is no industry pattern data, no claim frequency distribution, no severity benchmarks — nothing an acquirer can underwrite as a moat.
- The brand voice ("Polsia-killer," "the truth engine," "brutal") is not acquirable by a reputation / SEO / governance / healthcare / agency platform.
- The "Verified by AuditGPT" claim is overstated relative to what the contract proves. Any acquirer's legal team will flag this.
- No customers, no revenue, no embedded badges, no agency channel.
- `/compare` page is a public attack on a real funded company — diligence flag.
- The 6 misaligned tabs (Rebuild / Landing / Strategy / Agent / Agents / DeployFix) signal an undifferentiated product team chasing features — not a focused diagnostic wedge.

**Path to acquisition-readiness 7/10 in 90 days:** rewrite the audit core to be claim-record-based, accumulate 500–2,000 real audits across two verticals, expose anonymized aggregate findings as `IndustryPatternRecord`, kill the off-strategy features, and replace the brand voice. That dataset alone, with traction, becomes the acquirable asset.

---

## 19. Red-Team Test Plan

Run these scenarios; AuditGPT must (a) identify the risky claims, (b) avoid making legal/clinical/compliance/ranking conclusions, (c) propose safer framing, (d) mark missing evidence, (e) recommend the right Scrutexity next step.

### AI / SaaS test

Input page contains: "Fully autonomous AI agents." / "Enterprise-grade security." / "SOC 2-ready." / "Guaranteed productivity gains." / "Replaces your entire ops team."

Expected output behavior:
- Each is extracted as a `ClaimRecord` with claimType `AI-capability` / `security` / `compliance` / `guarantee` / `outcome`.
- Status: "Fully autonomous AI agents" → `overstated`; "SOC 2-ready" → `weakly-supported`; "Guaranteed productivity gains" → `unsupported`; "Replaces your entire ops team" → `overstated`.
- Recommendation: soften ("AI agents that escalate complex cases"); add proof (link SOC 2 report + issuing body + date); remove guarantee; soften "replaces ops team".
- Recommended Scrutexity next step: Claim Rewrites (rewrites + proof blocks).

### Med spa test

Input: "Risk-free Botox." / "Permanent results." / "Best med spa in Miami." / "FDA-approved clinic." / "Clinically proven to make you look 10 years younger."

Expected:
- Status: "Risk-free Botox" → `unsupported`; "Permanent results" → `overstated`; "Best med spa in Miami" → `unsupported`; "FDA-approved clinic" → `unsupported` (clinics are not FDA-approved; products are); "Clinically proven to make you look 10 years younger" → `unsupported`.
- Safer framing: "Botox by board-certified providers — risks and Retention explained on consultation page"; "Long-lasting results with maintenance"; remove "best"; "We use FDA-approved products"; "Patients commonly report a refreshed appearance — see before/after gallery."
- **No legal / clinical conclusions.** Output must say "we noted these statements" not "these violate FDA rules."
- Recommended next step: Claim Rewrites + AI Answer Reality (local).

### Agency test

Input: "We guarantee first-page rankings." / "We get you into ChatGPT." / "AI-powered growth system." / "10x revenue in 90 days." / "Fully compliant marketing."

Expected:
- All five → `unsupported` or `overstated`.
- "We guarantee first-page rankings" → `unsupported`, mark as ranking guarantee, mandatory rewrite.
- "We get you into ChatGPT" → `overstated`, mark as AI-visibility guarantee, mandatory rewrite.
- "10x revenue in 90 days" → `unsupported`, mark as outcome guarantee.
- "Fully compliant marketing" → `weakly-supported`, requires scope.
- Safer framing for each.
- Recommended next step: Claim Rewrites + Proof.

**Build these as `eval/fixtures.ts` cases.** Each fixture should assert the claim extraction, the status, the evidence-required flag, the safer framing presence, and the recommended next step. This becomes the regression harness.

---

## 20. 30-Day Fix Plan

Order matters.

**Days 1–3 — strategic alignment.**
- Archive `/api/landing-page`, `/api/rebuild`, `/api/strategy`, `/api/agent`, `/api/agents/*`, `/api/deploy/fix` to a `legacy/` directory.
- Archive `RebuildTab` / `LandingPageTab` / `StrategyTab` / `AgentTab` / `AgentsTab` in `src/app/page.tsx`.
- Remove `/slop`, `/compare`, `/polsia` (keep redirect).
- Rewrite homepage hero + CTA + footer copy to match the locked positioning.
- Drop the "Verified by AuditGPT" auto-grant. Park badge UI until criteria are redefined.

**Days 4–7 — output schema.**
- Define the new `AuditResult` shape: `executiveSummary`, `auditScope`, `claimFindings[]`, `aiVisibilityFindings[]`, `localFindings[]`, `reputationFindings[]`, `demandLeakageFindings[]`, `proofGaps[]`, `saferFraming[]`, `priorityMatrix`, `sevenDayFixes[]`, `thirtyDayPlan[]`, `recommendedNextStep`, `disclaimer`. Each finding is `{id, claimText?, observed, severity, status?, evidence?, recommendation, saferRewrite?, sourcePage}`.
- Add Zod schema; validate every LLM response; one retry on failure.
- Rewrite the main prompt around this schema.
- Fix `role: 'assistant'` → `'system'`.
- Consolidate to one provider; pick Anthropic Claude or DeepSeek + verify the actual model name.

**Days 8–14 — minimal $99 starter delivery.**
- Implement claim extraction prompt + claim classification prompt + evidence prompt + safer rewrite prompt + recommended-next-step prompt (sequential chain or one structured call).
- Render new report shape into the dashboard (Audit tab only).
- Render the same shape on the public report page.
- Add a real intake: company name, website URL, industry (with AI/SaaS, Med spa / wellness, Agency, Service business as first-class), specialty notes, agency? checkbox.
- Add Stripe SKUs: $99 starter (one-time), $299 full (one-time), $799 agency (monthly). Keep $0 snapshot.
- Add the free 3-point Snapshot route: same backend, return only top-3 picks.
- Add email-required gate UI before the snapshot generates.

**Days 15–21 — safety + red team.**
- Add safety preamble per vertical: medical/wellness, agency, AI SaaS.
- Add absolute-claim guards: no ranking guarantees, no AI-visibility guarantees, no legal/clinical/compliance conclusions, no revenue guarantees.
- Build red-team fixtures for AI SaaS, med spa, agency; wire to CI.
- Rewrite legal page with the no-guarantee disclaimer and the audit-scope statement.

**Days 22–30 — distribution + retainer upsell.**
- Build the Recommended Scrutexity Next Step decision card. Implement the routing logic (proof/content gaps → Claim Rewrites; visibility gaps → AI Answer Reality; Claim drift → Retention; missing public artifacts → Proof; agency client → White Label).
- Build a simple agency landing at `/agency` and a single-tenant white-label flag on the audit.
- Instrument funnel: landing → snapshot started → snapshot delivered → starter checkout → full checkout. Plausible or PostHog.
- Outbound: 10 founders, 10 agencies, 5 fractional CMOs, 5 VC platform people with personalized snapshots. (Aligned with `SCRUTEXITY-DOCTRINE.md`.)

---

## 21. 90-Day Roadmap

**Days 31–60 — multi-page crawl + proof artifacts.**
- Multi-page crawl: homepage, pricing, product, security, about, case studies, comparison, top landing page (per SOP in `SCRUTEXITY-DOCTRINE.md`).
- Normalize `ClaimRecord`, `EvidenceRecord`, `Recommendation`, `RecommendedNextStep` out of the audit JSON blob into typed Prisma tables.
- Public proof page (one per audit) + private full report (auth-gated).
- PDF export of the full report.
- Migrate from SQLite to Postgres (Neon / Supabase). Keep Prisma.
- Move LLM calls into a job queue (BullMQ + Redis or simple DB-backed worker) so audits can run > 60 seconds.

**Days 61–90 — agency white-label + monitor + benchmark publication.**
- Agency tier: client queue, white-label branding, 25-audit metering, monthly billing.
- Monthly rescan + badge expiry + drift detection (reuse existing infra; change what it watches).
- Publish *The State of AI Startup Claims: 2026* using the first 100–500 audits. Use this as the category-seed asset (per doctrine).
- Begin selectively exposing `IndustryPatternRecord` aggregates.
- Start acquisition-readiness conversations only if MRR > $5K and ≥ 3 paying agencies.

---

## 22. Top 10 Actions to Take First

1. **Archive the off-strategy features** (Rebuild / Landing / Strategy / Agent / Agents / DeployFix routes and tabs). Remove the temptation to defend them.
2. **Replace the brand voice everywhere.** "Truth engine" → "Find what is unsupported, invisible, risky, or leaking." "Verified by AuditGPT" → audit-scope statement. "Brutal" → remove.
3. **Rewrite the audit JSON schema** around `ClaimRecord` / `Evidence` / `Recommendation` / `SaferRewrite` / `RecommendedNextStep`. The new schema is the spine of every other change.
4. **Fix `role: 'assistant'` → `'system'`** in both audit implementations.
5. **Pick one LLM provider** + one verified model + Zod-validate the structured output. Delete `audit-pipeline.ts` or merge it into the route.
6. **Add Stripe SKUs** for $0 snapshot / $99 starter / $299 full / $799/mo agency. Remove the $49 Pro / $99 Agent / $29 one-time SKUs.
7. **Build the free 3-point Visibility & Trust Snapshot flow** — separate intake + separate output template + email-required gate + upsell to starter.
8. **Drop or restrict `/compare`** to a private demo URL. Public stat claims about Polsia/NanoCorp are a litigation vector.
9. **Rewrite the badge logic** to certify *what was checked* (count of claims reviewed, status breakdown, evidence-gap count, audit date) rather than to award "Verified." Remove the automatic grant.
10. **Build red-team fixtures** for AI SaaS, med spa, and agency. Wire to CI. Block merges on regressions.

---

## 23. Files / Folders Requiring Immediate Attention

| Path | Action | Priority |
|---|---|---|
| `src/app/page.tsx` | Replace homepage flow; archive off-strategy tabs | P0 |
| `src/app/api/audit/route.ts` | Rewrite prompt + schema; fix role; pick provider | P0 |
| `src/lib/audit-pipeline.ts` | Delete or merge | P0 |
| `src/lib/audit-context.ts` | Replace `AuditResult` type + preamble | P0 |
| `src/lib/eval/contract.ts` | Replace contract rules to match new schema | P0 |
| `src/lib/eval/fixtures.ts` | Add red-team fixtures (AI SaaS, med spa, agency) | P0 |
| `prisma/schema.prisma` | Add Claim/Evidence/Recommendation/RecommendedNextStep models | P0 |
| `src/app/pricing/page.tsx` | New tiers ($0 / $99 / $299 / $799) | P0 |
| `src/components/public-audit-view.tsx` | Re-render around new schema | P0 |
| `src/app/sample-report/page.tsx` | **Keep as the visual spec for the new live report** | P0 (reference) |
| `src/app/compare/page.tsx` | Archive or private | P1 |
| `src/app/slop/page.tsx` | Archive | P1 |
| `src/app/polsia/page.tsx` | Keep redirect to `/` instead of `/compare` | P1 |
| `src/app/api/landing-page/route.ts` | Archive | P1 |
| `src/app/api/rebuild/route.ts` | Archive | P1 |
| `src/app/api/strategy/route.ts` | Archive | P1 |
| `src/app/api/agent/route.ts` | Archive | P1 |
| `src/app/api/agents/**` | Archive | P1 |
| `src/app/api/deploy/fix/route.ts` + `src/lib/github-deploy.ts` + `DeployFixPR` model | Archive (separate product) | P1 |
| `src/components/verification-badge.tsx` + `src/app/api/badge/[publicId]/route.ts` + `src/app/verified/[publicId]/page.tsx` | Rewrite criteria + copy | P1 |
| `README.md` | Rewrite to match Scrutexity AuditGPT spec | P1 |
| `postcss.config 2.mjs` | Delete | P2 |
| `bun.lock` vs `package-lock.json` | Pick one | P2 |
| Unused deps (`@dnd-kit/*`, `@mdxeditor/editor`, `recharts`, `vaul`, `cmdk`, `react-syntax-highlighter`) | Prune | P2 |
| SQLite → Postgres migration | Schedule for days 31–60 | P2 |

---

## Closing note

You have built a real product. The problem is not engineering — it is identity. The repo wants to be a forensic anti-AI-slop bouncer; the locked Scrutexity strategy wants AuditGPT to be a quiet, governed diagnostic that hands buyers off to Claim Rewrites, AI Answer Reality, Retention, and Proof. The fastest path forward is the opposite of "build more." It is to delete (or archive) the off-strategy half of the codebase, rewrite the audit core around claim records, replace the brand voice, and ship the free snapshot + $99 starter in the next 14 days. The infrastructure you already have makes that possible. The product on top of it is the wrong product.

Treat `/sample-report` as the spec. Make the live `/api/audit` produce reports that look like that — for any URL — and AuditGPT is commercially useful.
