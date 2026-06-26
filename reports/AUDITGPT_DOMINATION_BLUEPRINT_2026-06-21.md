# AuditGPT — The No-Fluff Domination Blueprint

**Date:** June 21, 2026 · Based on a full sweep of the `auditgpt` folder + live competitive research (June 2026).
**One line:** You don't need to beat anyone on features. The whole market audits the wrong object. You win by being the only one that delivers *judgment* — but first you have to ship the engine your own docs already claim you shipped.

---

## Part 1 — The Brutal Internal Truth (from the file sweep)

Your June-20 docs (`REFOCUS-REPORT`, `LAUNCH-READINESS`, `OPERATIONAL-LAUNCH`) all say AuditGPT was refocused from the old "Polsia-killer / truth engine" into the clean Scrutexity claim-audit product. **The code does not match the docs.** This is the #1 finding and it blocks everything.

### What's actually still live in the running engine (non-legacy code):

| File | What it still contains | Why it's a problem |
|---|---|---|
| `src/lib/audit-schema.ts` (the schema the live pipeline imports) | `ftc_exposure`, `cited_enforcement_example`, `slop_markers`, hardcoded `vs_polsia / vs_makerpad / vs_cofounder / vs_nanocorp` | Violates your safe doctrine. An audit *renders FTC-threat language and competitor attacks* to the customer. |
| `src/lib/audit-pipeline.ts` (the active prompt) | "SLOP DETECTION (8 signals)", hardcoded disses ("Polsia: Fabricates tasks... $30M raised", "NanoCorp: $264.27 total revenue") | The LLM is *instructed* to behave like the retired takedown product. |
| `src/components/public-audit-view.tsx` (what the buyer sees) | Renders `claim.ftc_exposure` in a red box; "Slop Detected (X% probability)" section; `vs_polsia` competitor list | If you sell an audit today, the customer sees banned framing. |
| Pricing/login/snapshot/verified pages | `card-polsia` / `btn-polsia` CSS classes throughout | Cosmetic (class names), but signals the refactor was documentation-deep, not code-deep. |

**The contradiction in plain terms:** the `REFOCUS-REPORT` describes an `AuditResult` schema with `claimFindings` and a disclaimer. The file that's actually imported and run (`audit-schema.ts`) is the old `ClaimAudit` schema with FTC/slop/Polsia fields. Two different schemas. The docs describe the one you *meant* to ship; the code runs the one you're *trying to retire*.

### Verdict
You have ~70% reusable infrastructure (SSRF-safe fetcher, Prisma, Stripe wired to $99/$299/$799, NextAuth, eval harness, badge system) and a **prompt + schema + report view that still belong to the dead product.** "Built / ready to test" is true of the plumbing and false of the brain. **Step zero of domination is making the live engine safe and on-doctrine — because right now your own product would fail its own claim audit.**

---

## Part 2 — The Competition (live research, June 2026)

The good news is structural: **everyone audits a different object than you.**

| Competitor class | Examples | What they audit | Price | Why they're NOT you |
|---|---|---|---|---|
| **Shopify claim verification** | **Verity Score** | E-commerce *product* claims vs. schema.org proof | Launches **Q3 2026** (not live yet); beta 50% off | Shopify-only, product claims, not founders/services. Narrow + not shipped. |
| **GEO / AI-visibility** | Otterly ($25–29/mo), Rankscale ($20/mo), Profound ($99–499/mo), Presenc | Whether AI engines *mention* you | $20–$2,000/mo | They track citations. They don't audit whether your *claims* are *true* or your *positioning* is sharp. Different object. |
| **White-label SEO audit** | SEOptimer, Insites, WhiteLabelIQ, GreenLotus | Technical SEO (speed, schema, meta, backlinks) | $30–$700/mo | "200+ issues" tools. The exact opposite of judgment. |
| **GRC / compliance** | Drata, Vanta, Sprinto | SOC2/ISO *controls* | $100M+ funded | Audit internal controls, not public marketing claims. |
| **AI-agent guardrails** | Galileo, Straiker, Atlan | Runtime AI-agent behavior | Enterprise | Infra for AI-native enterprises, not SMB claim audits. |

### The white space, stated precisely
**Nobody sells a brutal, human, operator-grade audit of a service business's claims + positioning + trust + growth — with a real plan, not an issue list.** The market is saturated with *issue-counters* (SEO/GEO tools that spit 200 findings) and narrow *claim-checkers* (Verity, Shopify-only, unlaunched). The thing you described — "ruthless audit, the owner's real context, visual artifacts, a structured growth plan, no AI fluff" — has **no direct competitor.** One research source said it for you: *"A good audit tool identifies 200+ issues. A good strategist tells you which 10 matter."* You are the strategist-in-a-box. That's the lane.

### Where you genuinely cannot win
- **Don't compete on AI-visibility tracking** — Otterly/Profound own it at $25/mo; it's a feature you reference, not a business.
- **Don't compete on technical SEO** — commoditized to $30/mo.
- **Don't compete on Shopify product claims** — that's Verity's lane when they launch; let them have e-commerce.

---

## Part 3 — How To Dominate (the actual strategy)

Domination here is **niche ownership**, not market share. The play:

**1. Own the object nobody else audits: the claim-positioning-trust-growth gap for service businesses.** Not visibility. Not SEO. Not Shopify. The honest growth verdict.

**2. Make judgment the product, not findings.** Every competitor's weakness is volume-without-priority. Your CONTRACT.md (banned filler, 2-sentence cap, "insufficient data," every sentence carries a fact) is *already engineered to be the anti-issue-list.* That enforced honesty is your one real, demonstrable edge. Point it at the right product.

**3. Lead with the human, semi-automated premium audit ($499 Founder's Audit)**, with the $99 claim review as the proof-of-quality teaser. The market is full of $25/mo self-serve tools; almost nobody offers an operator-grade *judgment* deliverable in that price band. You're not cheaper — you're the one with a brain attached.

**4. Use agencies as the distribution multiplier — but as a service line item, not a SaaS platform.** White-label SEO audits are a crowded $30–700/mo tool market. White-label *"ruthless founder's growth audit you hand your client as a premium pre-launch deliverable"* is not a tool — it's a subcontracted service. Sell agencies the judgment, not software.

**5. Build the Claim Graph quietly as the long-term moat.** Every audit enriches a dataset of who-claims-what across businesses. Competitors can copy a prompt; they can't copy the accumulated graph. Instrument from audit #1; it's a moat only after volume — don't market it yet.

### The "dominate" sequence
1. **Fix the engine** (Part 1) — non-negotiable, this week.
2. **Sell the $499 Founder's Audit by hand** to the two ICPs your own GTM doc already scored highest.
3. **Win the niche** by being the only judgment-grade audit, proven by real reports.
4. **Multiply through agencies** as a service.
5. **Compound the Claim Graph** for defensibility.

---

## Part 4 — ICP (reconciling your own data)

Your own `AUDITGPT-GTM-30-DAY-PLAN.md` scored this rigorously and I agree with it:

1. **Seed–Series B AI/SaaS founders (77/100)** — findable in minutes, founder-buyers, claim-dense sites, low compliance risk, most likely to share. **Lead here.**
2. **B2B SaaS agencies (73) / med-spa marketing agencies (74)** — highest leverage (one agency = many audits), $799 tier monetizes faster. **Channel #2.**
3. **Do NOT lead with single-location med-spas (56)** — your own doc flags the compliance overhead; "one mistake is a regulatory story." The med-spa *sample* is a sales asset for the agency channel and a vertical proof, not your day-1 cold target.

Note the tension with your recent instinct to build the med-spa sample: that's correct *as an asset*, but your own scoring says **sell to AI/SaaS founders and med-spa-serving agencies first**, not to clinics directly. Keep them aligned.

---

## Part 5 — The 7-Day Domination Sprint

1. **Strip the engine** — delete/neutralize `ftc_exposure`, `cited_enforcement_example`, `slop_markers`, and the hardcoded competitor disses from `audit-schema.ts`, `audit-pipeline.ts`, and `public-audit-view.tsx`. Run the eval. (Day 1–2)
2. **One live end-to-end run per ICP** to verify the cleaned output is safe and on-doctrine. (Day 2)
3. **Create the 3 Stripe Price IDs** ($99/$299/$799) and wire env vars — your `OPERATIONAL-LAUNCH` doc says this is ~15 min and undone. (Day 1)
4. **Self-charge $99** to confirm checkout end-to-end. (Day 1)
5. **Pick the best polished sample report** (med-spa one is done; do one AI/SaaS one too). (Day 2–3)
6. **Build a 10-name AI/SaaS founder list** (Raycast, Scale + 8). (Day 1)
7. **Run real snapshots on 5; send 3 personalized DMs** quoting one real claim each. (Day 3)
8. **Send 7 more over days 4–6.** (Day 4–6)
9. **Make the $499 Founder's Audit offer** to anyone who engages; $99 as the entry. (Day 4–7)
10. **Daily one-line tracker:** sent / replied / offered / paid. (Daily)

**Success = engine is safe AND one paid customer (or 3 "send me the full audit").**

---

## Part 6 — The Honest Bottom Line

You are not behind on product. You're behind on two things: (1) your live code lags your own documentation by one un-shipped refactor, and (2) you have sent zero tracked messages. The competition is real but aimed elsewhere — visibility, SEO, Shopify — leaving the judgment-grade service-business audit wide open. The CONTRACT-enforced honesty is a genuine edge *if* it ships on the right schema. Fix the engine, sell the $499 audit by hand to AI/SaaS founders and the agencies that serve claim-heavy clients, and let the Claim Graph compound. That's the whole game. Everything else is destination-thinking.

---

*Sources: live web research, June 2026 — Verity Score (verityscore.io), GEO/AI-visibility pricing (therankmasters, presenc.ai, geoptie), white-label audit market (mapranking, insites, seoptimer). Internal: full sweep of /auditgpt docs and src.*
