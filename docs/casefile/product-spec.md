# Scrutexity CaseFile — Product Specification v1.0

**Product name:** Scrutexity CaseFile
**One sentence:** A dated, hash-verifiable evidence bundle showing what a business publicly
claimed, when each claim appeared, changed, or disappeared, and what AI answer systems said
about that business — independently verifiable against the public CRT digest.

---

## 1. The CaseFile bundle schema (`casefile.json`)

The JSON bundle is the **verifiable artifact**. The HTML/PDF rendering is a convenience view
of it; the JSON's canonical hash is what the Declaration attests to.

```jsonc
{
  "casefile_version": "1.0",
  "casefile_id": "string — cf_<uuid>",
  "generated_at": "ISO-8601 — bundle generation time",
  "bundle_sha256": "hex — SHA-256 of the canonicalized bundle minus this field",

  "subject": {
    "domain": "string — the monitored domain",
    "requested_urls": ["string — sourceUrl values observed"],
    "resolved_urls": ["string — post-redirect URLs that served captured bytes"]
  },

  "requested_window": { "from": "ISO-8601|null", "to": "ISO-8601|null" },

  "coverage": {
    "first_observed": "ISO-8601 — earliest Observation.observedAt for the domain",
    "last_observed": "ISO-8601",
    "observation_count": "int",
    "page_claim_count": "int — distinct guardian:page-html:* claim hashes",
    "ai_observation_count": "int — observations with an AI surface",
    "gaps": [
      { "from": "ISO-8601", "to": "ISO-8601", "reason": "string — e.g. 'no scheduled capture', 'fetch_error'" }
    ]
  },

  // ── Track 1: what the business itself published ─────────────
  "page_claims": [
    {
      "claim_hash": "hex — sha256(normalized claim text)",
      "source_locator": "guardian:page-html:<claim_hash>",
      "current_text": "string|null — null if claim is currently REMOVED",
      "first_observed": "ISO-8601",
      "last_state": "ACTIVE | REMOVED",
      "events": [
        {
          "event_type": "FIRST_OBSERVED | MODIFIED | REMOVED",
          "observed_at": "ISO-8601",
          "observation_id": "string",
          "prior_observation_id": "string|null",
          "page_snapshot_hash": "hex — hash of the raw page bytes at this event",
          "prior_state_hash": "hex|null",
          "chain_position": "int — per-claim, monotonic from 1",
          "latency_from_prior_event_ms": "int|null — e.g. removal latency",
          "event_digest": "hex — linked digest; recomputable per Methodology §3"
        }
      ]
    }
  ],

  // ── Track 2: what AI systems said about the business ────────
  "ai_observations": [
    {
      "observation_id": "string",
      "surface": "string — e.g. 'perplexity'",
      "model_provider": "string",
      "model_version_id": "string|null",
      "model_version_source": "API_RESPONSE_MODEL_FIELD | NOT_EXPOSED_BY_PROVIDER | SIMULATED_NO_PROVIDER_CALL",
      "prompt": { "id": "string", "version": "int", "prompt_hash": "hex" },
      "answer_digest": "hex — sha256(full answer payload)",
      "answer_excerpt": "string — bounded excerpt; full payload retained by custodian",
      "discrepancy_type": "unsupported_addition | contradiction | exaggeration | missing_qualifier | null",
      "severity": "low | medium | high | critical | null",
      "matched_page_claim_hash": "hex|null — page claim the answer relates to, if matched",
      "observed_at": "ISO-8601"
    }
  ],

  // ── Raw capture inventory ────────────────────────────────────
  "snapshots": [
    {
      "page_snapshot_hash": "hex",
      "resolved_url": "string|null",
      "captured_at": "ISO-8601",
      "byte_length": "int",
      "content_type": "string|null",
      "capture_method": "fetch | fetch_error",
      "http_status": "int|null",
      "storage_status": "STORED | ALREADY_STORED | STORAGE_FAILED"
    }
  ],

  // ── Independent verification ─────────────────────────────────
  "integrity": {
    "crt_log_id": "string — e.g. 'scrutexity-log-1'",
    "chain_head_digest": "hex — public head at generation time",
    "chain_head_url": "URL — public digest endpoint",
    "included_event_digests": ["hex — every event_digest in this bundle"],
    "verification_instructions_ref": "Evidence Methodology Declaration §5",
    "methodology_version": "string — e.g. '0.9.2'"
  },

  "scope_statement": "This CaseFile records observations of publicly accessible statements at the dates shown. It does not attest to the truth, legality, or regulatory status of any statement, and reports the absence of visible evidence as a proof gap, not a finding of falsity."
}
```

**Field authority note:** every field above maps 1:1 to live columns in `Observation`,
`ClaimState`, `ClaimLifecycleEvent`, `PromptDefinition`, and the snapshot store. Nothing in
the bundle is computed at generation time except `coverage` aggregates and `bundle_sha256`.

## 2. Delivery format

| Artifact | Purpose |
|---|---|
| `casefile.json` | **The record.** Canonical, hashed, machine-verifiable. |
| `casefile.html` (print-to-PDF ready) | The committee/court reading view: claim timelines, AI-answer excerpts, snapshot inventory, verification appendix. |
| `manifest.json` | `casefile_id`, `bundle_sha256`, generation time, methodology version, CRT head at issuance. Small enough to email inline. |
| Expedited tier adds | Signed Evidence Methodology Declaration (PDF) with the specific bundle hash inserted. |

The adjuster receives a ZIP of the three files. The Declaration is the fourth file on the
$5,000 tier only.

## 3. Coverage-check API

```
POST /api/casefile/coverage-check
Authorization: Bearer <api_key>          # per-customer key, server-issued
Content-Type: application/json

{ "domain": "clinicexample.com" }

→ 200
{
  "domain": "clinicexample.com",
  "covered": true,
  "first_observed": "2026-07-05T02:11:00Z",
  "last_observed": "2026-07-26T02:10:00Z",
  "observation_count": 21,
  "page_claim_count": 14,
  "ai_observation_count": 6,
  "lifecycle_event_count": 31,
  "gaps": [],
  "estimate": { "standard_usd": 1500, "expedited_usd": 5000 }
}

→ 200 (not covered)
{ "domain": "...", "covered": false, "first_observed": null,
  "prospective_monitoring_available": true }
```

- **SLA:** p95 < 2 seconds (indexed count queries only; no bundle generation).
- **Auth:** bearer API key issued at signup; keys are metered per §5 of the Agreement.
  Free for desk subscribers; $50–150/lookup otherwise (invoiced monthly).
- **Honesty rule:** `covered:false` is a first-class answer. Never imply retroactive coverage.

## 4. CaseFile retrieval API

```
GET /api/casefile/{domain}?from=2026-01-01&to=2026-07-01&page=1&per_page=200
Authorization: Bearer <api_key>
```

- Returns the bundle schema in §1, with `page_claims[].events` and `snapshots` paginated
  (`per_page` max 500; `X-Total-Events` header; `next_page` link).
- The `integrity` section is included on **every page** and covers only the digests present
  on that page, plus the bundle-level head reference — so any single page is independently
  checkable without fetching the whole file.
- Generation is asynchronous over ~5k events: `202 { "status": "generating", "poll_url": ... }`.
- Access requires a countersigned Agreement (§ Agreement 2); the API is not self-serve.

## 5. Assumptions (stated per output constraints)

1. **Dual-track extraction is live** — verified in code (`src/lib/audit/write-multi-claim.ts`,
   per-claim `guardian:page-html:*` locators with set-diff REMOVED). ✔
2. **Real Perplexity captures exist in `distortion_logs`** — the code path is real (monorepo
   `lib/ai-distortion.ts`, sonar-pro), but **capture volume is unverified from the dev
   machine**. Validate by running the coverage-check query against production before quoting
   any adjuster a covered domain. No CaseFile ships containing simulated AI observations;
   `model_version_source=SIMULATED_NO_PROVIDER_CALL` rows are excluded by the generator.
3. **Counsel sign-off on the Methodology is pending (v0.9.2)** — the $5,000 Declaration tier
   must not be sold until that returns. Standard $1,500 files may ship on the JSON +
   verification instructions alone.
