# CaseFile — 30-Day Launch Plan

Owner on every line: founder. Build items reuse live tables only
(`Observation`, `ClaimState`, `ClaimLifecycleEvent`, `PromptDefinition`, snapshot store,
`distortion_logs`). Nothing new is invented for launch.

## Week 1 — Build (Days 1–7)

- **D1–2:** CaseFile bundle generator: one module that takes `(domain, from, to)` and emits
  `casefile.json` per Spec §1 from the lifecycle tables, excluding any observation with
  `model_version_source = SIMULATED_NO_PROVIDER_CALL`. Canonicalize + hash → `manifest.json`.
- **D3:** `casefile.html` renderer (server-rendered, print-CSS; the claim-timeline view).
- **D4:** `POST /api/casefile/coverage-check` — count queries + API-key auth. Log every
  lookup: it is the demand signal that steers capture priority.
- **D5:** **Production Supabase capture gate** (still open from the storage review): create
  private `claim-snapshots` bucket, run one real capture, verify `STORED` →
  `ALREADY_STORED`, hash round-trip, no bytes in logs. No CaseFile ships before this passes.
- **D6–7:** Enroll 25 seed domains into the 7-day re-observation cadence: 10 from live
  GLP-1 litigation dockets, 10 from recent public enforcement-letter recipients, 5 warm
  prospects' portfolios. Every future casefile needs history; start the clock on the domains
  most likely to be asked about.
- **Gate:** generator produces a verifiable bundle from real data; prod storage gate passed.

## Week 2 — Sample files (Days 8–14)

- Generate 3 sample CaseFiles from real domains: (1) a public enforcement-letter recipient,
  (2) a domain with a recorded AI-answer discrepancy, (3) a domain with a recorded
  claim-removal event. Redact nothing — these are public statements — but watermark
  "SAMPLE — NOT FOR RELIANCE."
- Verify each sample end-to-end using the public verification procedure (play the skeptical
  adjuster; every digest must recompute).
- Submit the Declaration draft + Methodology to counsel (starts the clock on the $5,000 tier).
- Build the target list: 15 named humans (5 carrier examiners/SIU, 5 TPA claims managers,
  3 litigation attorneys from live dockets, 2 PE diligence leads).
- **Gate:** 3 verifiable samples exist; counsel clock running.

## Week 3 — Outreach (Days 15–21)

- Send Emails 1–5 (personalized, one real fact per email) to all 15 targets across the week.
- Every reply gets a free coverage check within 24 hours — the SLA *is* the product demo.
- Track in the pipeline sheet: sends, replies, coverage checks run, `covered:true` rate,
  files quoted, files paid.
- **Gate:** 15 sent, ≥3 coverage-check conversations.

## Week 4 — Close (Days 22–30)

- Follow-ups 6–10, each with a genuinely new hook (no news = no send).
- First paid file: deliver personally, watch them open it, capture every question the
  bundle failed to answer — that list is the v1.1 spec.
- Quote the desk subscription only after an org's second file request. One org at 2+ files
  = the volume conversation is earned; before that it's premature.
- **Gate:** 1–3 paid files. One paid file at founding price is a pass — the test is
  willingness-to-pay, not revenue.

## Kill criteria

- **25 coverage-check conversations, 0 paid files by Day 60** → park the claims market for
  6 months; CaseFile pivots to PE diligence as primary buyer (same bundle, same APIs,
  different email list). The archive keeps recording either way.
- **15 sends, 0 replies by Day 25** → the list is wrong before the product is: rebuild
  around live-docket attorneys (they have a matter *today*) before concluding anything.
- **`covered:true` rate < 20% on requested domains** → capture footprint is the bottleneck,
  not sales; shift a week from outreach to enrolling the domain classes buyers actually ask
  about, then resume.
