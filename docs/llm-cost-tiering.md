# Tiered Extraction Architecture — 90%+ LLM Cost Reduction

**Status:** proposal · **Owner:** founder · **Scope:** `src/lib/audit-pipeline.ts`, `src/lib/llm-provider.ts`, Supabase
**Goal:** cut per-scan LLM cost from ~$0.15 to ≤$0.012 without degrading claim accuracy or legal-safe behavior.

---

## 1. Where the money actually goes (measured from code)

The current pipeline (`runAuditPipeline`) is a **single monolithic call**:

```
scrape (8,000 chars) ──► buildPrompt (headings + paragraphs + links + full instructions)
                     ──► callLLM  → full AuditResult JSON (~3–4k output tokens)
                     ──► up to 2 repair calls on JSON/schema failure (full prompt again)
plus: generateSimulation (second full call in /api/audit)
```

Three findings before any architecture work:

1. **The default OpenAI model is `gpt-4o`** (`llm-provider.ts:77`), not GPT-4o-mini.
   At ~4k in / ~4k out, that's $0.01 + $0.04 = **~$0.05/call**, ×2–4 calls/scan ≈ the observed $0.15.
   Setting `OPENAI_MODEL=gpt-4o-mini` alone is a **94% cut** ($0.15/$0.60 per M) — before anything below.
2. **Repair calls resend the whole prompt.** A schema failure doubles or triples cost. Smaller,
   per-task prompts (below) nearly eliminate schema failures because each output is trivial.
3. **The monolithic prompt asks one model to extract, classify, benchmark, and write prose at once.**
   That forces the *most expensive* capability tier for the *cheapest* subtasks.

Pinecone note: this repo contains no Pinecone calls; vector search lives in the monorepo backend.
Recommendation stands regardless: at current scale (≪1M vectors), **Supabase pgvector replaces it at
$0 marginal cost** since Supabase is already paid for.

---

## 2. Target architecture: four tiers, cheapest first

```
                     ┌─────────────────────────────────────────────┐
 page text ────────► │ TIER 0 · Deterministic candidate extraction │  $0.000
                     │ regex/heuristics, verbatim spans only       │
                     └───────────────┬─────────────────────────────┘
                        0 candidates │ n candidates
                    "no claims found"▼
                     ┌─────────────────────────────────────────────┐
                     │ TIER 1 · Embedding similarity (pgvector)    │  ~$0.0001
                     │ nearest labeled exemplars per candidate     │
                     └───────────────┬─────────────────────────────┘
              high-sim, unambiguous  │ ambiguous (sim in gray zone)
                    label directly   ▼
                     ┌─────────────────────────────────────────────┐
                     │ TIER 2 · Small LLM batch classification     │  ~$0.001
                     │ Groq Llama-3.1-8B / GPT-4o-mini / Flash     │
                     └───────────────┬─────────────────────────────┘
                  confidence ≥ 0.8   │ confidence < 0.8 OR schema fail
                       accept        ▼
                     ┌─────────────────────────────────────────────┐
                     │ TIER 3 · Escalation (GPT-4o / Sonnet)       │  ~$0.01 on
                     │ hard 10–20% of candidates only              │  10–20% of scans
                     └─────────────────────────────────────────────┘
```

### Tier 0 — deterministic candidate extraction (new: `src/lib/claim-candidates.ts`)

Sentence-split the scraped text; keep sentences matching claim signals:

- superlatives/absolutes: `best|only|#1|most trusted|guaranteed|proven|permanent|painless`
- quantified outcomes: `\d+\s?(%|lbs|pounds|days|weeks|patients|x)`
- authority invocations: `FDA|clinical|medical[- ]grade|board[- ]certified|patented|award`
- comparatives: `better than|unlike other|faster than`

**This is the anti-fabrication guarantee.** Every candidate is a *verbatim substring of the page* —
downstream tiers can only classify text that provably exists. Today's monolithic prompt asks the LLM
to both find and quote claims, which is where hallucinated `original_text` risk lives. Tier 0
structurally removes it: before persisting, assert `page.rawText.includes(claim.original_text)`.

**"No claims found":** zero candidates → return the honest empty result (`claims: []`,
`executive_summary: "No claim-bearing statements were detected on the scanned page."`) with
**zero LLM spend**. Do not synthesize findings to fill the report. This also kills the current
worst-case: paying $0.15 to scan a page with nothing on it.

### Tier 1 — embedding pattern matching (pgvector on Supabase)

- Build a **pattern library** from data you already own: every classified claim in every historical
  `auditJson` (claim text + human-accepted `claim_status`). Seed: a few hundred rows; grows with
  every scan.
- Embed with `text-embedding-3-small` ($0.02/M tokens — a 20-word claim costs ~$0.0000005).
- For each Tier-0 candidate, kNN against the library:
  - top-3 neighbors agree AND cosine ≥ 0.88 → adopt their label directly, no LLM.
  - else → Tier 2.
- Supabase: `create extension vector; create table claim_patterns (embedding vector(1536), text, status, priority, source_audit_id)` + an IVFFlat index. No new vendor; Pinecone spend for this
  workload → $0.

Expected hit rate at maturity: 40–70% of candidates in a vertical as formulaic as med-spa copy
("lose X lbs in Y days" recurs endlessly).

### Tier 2 — small-model classification (batch, structured, tiny)

One call per scan classifying *all* remaining candidates (not one call per claim). Prompt is
~600 tokens of instructions + candidates; output is a JSON array of
`{id, claim_status, priority, support_gap, confidence}` — a few hundred tokens.

| Model | Route | $/M in / out | Est. per scan | Notes |
|---|---|---|---|---|
| Llama-3.1-8B-Instant | Groq | 0.05 / 0.08 | **$0.0001** | fastest; fine for enum classification |
| Llama-3.3-70B | Groq | 0.59 / 0.79 | $0.001 | strong default if 8B evals weak |
| GPT-4o-mini | OpenAI | 0.15 / 0.60 | $0.0005 | zero new vendors; JSON mode |
| Gemini Flash | Google | ~0.10 / 0.40 | $0.0004 | already integrated in `llm-provider.ts` |

Groq/Together are OpenAI-compatible — adding them to `llm-provider.ts` is a ~20-line function each
(same pattern as `callOpenAI`, different base URL). Ollama is the same shape for local dev but not
usable from Vercel functions; treat it as a dev/eval tool only.

**Legal-safe enforcement at this tier:** the output schema is a closed enum. If the model returns
low confidence or an unparseable label, the claim is recorded as `insufficient_public_evidence` —
never upgraded to `unsupported` by guesswork. Under-claiming is safe; over-claiming is not.

### Tier 3 — escalation

Candidates with Tier-2 `confidence < 0.8`, plus any scan where Tier 2 fails schema twice, go to
`gpt-4o` (or `claude-sonnet` — already wired). Also: **safer rewrites** (`safer_framing`) are
generative, not classificatory — route only the claims that will actually be *shown* (free tier
shows 1) to a quality model. Writing 7 rewrites for a report that displays 1 is pure waste.

Prose sections (`executive_summary`, `verdict`) are one small Tier-2 call over the already-built
findings table — the expensive model never sees raw page text unless Tier 3 triggered.

---

## 3. Fine-tuning: when, not whether

| Option | Training cost | Inference | Break-even |
|---|---|---|---|
| FT GPT-4o-mini | ~$3/M tokens (≈ $5–15 for 1–2k examples) | $0.30/$1.20 per M | replaces Tier 3 escalations |
| FT Llama-8B (Together/LoRA) | ~$10–30 one-time | ~$0.10–0.20 per M | replaces Tier 2 + most of Tier 3 |

- **Data is already accruing**: every `auditJson` is a labeled example; every Tier-3 escalation
  result is a *hard* labeled example (the exact distillation set you want).
- **Trigger: ≥500 curated claim labels** with human spot-checks. Before that, the cascade alone
  hits the cost target; a fine-tune on noisy labels bakes the noise in.
- Expected effect: Tier-3 escalation rate drops from ~15% to ~3–5%, and Tier 2 accuracy on the
  domain-specific `claim_status` boundary (weakly_supported vs overstated) approaches GPT-4o parity.
  This is a classification task over a closed vocabulary — exactly where small fine-tunes match
  frontier models.

---

## 4. Cost model

Assumptions: avg 12 Tier-0 candidates/scan; Tier-1 resolves 50%; Tier-2 (Groq 70B) handles rest;
Tier-3 (gpt-4o) on 15% of scans; 1 rewrite + summary on small model; simulation call moved to
Tier-2 model. Current baseline $0.15/scan.

| Volume/mo | Current | Tiered | Tiered + FT | Savings (tiered) |
|---|---|---|---|---|
| 100 scans | $15 | **$1.10** | $0.60 | 93% |
| 1,000 | $150 | **$11** | $6 | 93% |
| 10,000 | $1,500 | **$110** | $55 | 93% |

Per-scan breakdown (tiered): embeddings $0.0001 + Tier-2 $0.001 + prose/rewrite $0.001 +
Tier-3 amortized $0.0015 + simulation $0.001 ≈ **$0.005–0.011**.
Pinecone: $0 (pgvector) vs current minimum commitment — pure subtraction.
Vercel/Supabase impact: negligible (pgvector queries are milliseconds; function time *drops*
because Groq latency ≪ GPT-4o latency — free scans get faster, which helps conversion).

---

## 5. Migration plan

**Phase 0 — today, zero code:** set `OPENAI_MODEL=gpt-4o-mini` (or `LLM_PROVIDER=gemini`,
`GEMINI_MODEL=gemini-1.5-flash-002` — both already wired). 90%+ cost cut immediately while the
real work proceeds. Watch the eval (below) for regression.

**Phase 1 — cascade skeleton (2–3 days):**
- `src/lib/claim-candidates.ts` (Tier 0, pure functions, unit-testable).
- Add `callGroq` to `llm-provider.ts` (OpenAI-compatible fetch; env `GROQ_API_KEY`, `GROQ_MODEL`).
- Split `buildPrompt` into `classifyCandidatesPrompt` + `writeSummaryPrompt` + existing repair path.
- Feature flag: `PIPELINE_MODE=monolith|tiered` — old path stays as instant rollback.
- Enforce the verbatim-substring assertion before `persistAudit`.

**Phase 2 — pgvector memory (2 days):**
- Supabase migration: `claim_patterns` table + vector index.
- Backfill embeddings from historical `auditJson` claims.
- Insert every newly classified claim (with tier provenance) — the moat compounds per scan.

**Phase 3 — eval + canary (ongoing):**
- Extend the existing harness (`scripts/eval.ts`, `npm run eval`) with the golden set below.
- Route 10% of production scans through `tiered`, log per-tier decisions + escalation rate.
- Promote to 100% when parity criteria hold for 2 consecutive weeks.

**Phase 4 — fine-tune (after ≥500 curated labels):** distill Tier-3 outputs into FT-4o-mini;
re-run the eval gate; swap Tier 2/3 models via env.

**Fallback strategy:** every tier failure degrades to the next tier *up*, and total failure
degrades to `PIPELINE_MODE=monolith`. A Groq outage costs money (falls to OpenAI), never a scan.

---

## 6. Validation experiments (accuracy parity gates)

Golden set: 50 real scanned pages (stratified: 20 med-spa/GLP-1, 10 SaaS, 10 agency clients,
10 low-claim pages including 3 genuinely claim-free). Human-adjudicated labels.

| # | Experiment | Metric | Pass gate |
|---|---|---|---|
| E1 | Tier-0 recall | % of adjudicated claims captured as candidates | ≥ 95% (misses are silent — gate hardest) |
| E2 | Tier-1 label agreement vs human | precision on auto-labeled candidates | ≥ 92%, else raise cosine threshold |
| E3 | Tier-2 model bake-off (8B vs 70B vs 4o-mini vs Flash) | status agreement w/ GPT-4o baseline | ≥ 90% overall, ≥ 95% on `unsupported` |
| E4 | Fabrication audit | % of output claims failing verbatim-substring check | **0%, hard fail** |
| E5 | No-claims honesty | 3 claim-free pages return empty findings | 3/3, no invented findings |
| E6 | End-to-end cost + latency | $/scan, p95 seconds | ≤ $0.015, p95 ≤ 25s |
| E7 | Escalation-rate drift (production canary) | % scans hitting Tier 3, weekly | alert if > 25% (means Tier 2 degraded) |

Direction-of-error rule for all gates: disagreements where the cheap tier says
`insufficient_public_evidence` and the baseline says `unsupported` are acceptable (under-claiming);
the reverse direction counts double against the gate.
