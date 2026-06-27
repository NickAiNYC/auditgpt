# Scrutexity — Masterclass Gameplan

> **The definitive product strategy for the Claim Intelligence category.**
> **June 20, 2026**

---

## 1. The Real Category

**Category:** Claim Intelligence

**First market-facing subcategory:** Website Claim Audit

Because buyers understand that immediately. "Claim Intelligence" is the category you are building. "Website Claim Audit" is the wedge people buy first.

### Category ladder

| Level | Name | What it means |
|-------|------|---------------|
| 1 | Website Claim Audit | Find unsupported claims on your homepage, pricing, security, case studies |
| 2 | Claim Library | Turn every important business assertion into a tracked record |
| 3 | Claim Monitoring | Detect when claims change, expire, or drift from evidence |
| 4 | Claim Intelligence Platform | One living claim graph across marketing, sales, legal, compliance |

**Do not lead with Level 4 before the market understands Level 1.**

---

## 2. The Positioning

**Core line:**
> Scrutexity finds the claims your business makes and shows which ones are provable.

**Expanded:**
> Scrutexity audits your website, detects unsupported claims, creates a claim library, and monitors claim drift over time.

**Category sentence:**
> Claim Intelligence for companies whose marketing needs to be provable.

### What to avoid saying
- "Reputation intelligence platform" — too broad
- "Trust OS" — too early
- "AI content platform" — wrong category
- "Audits, content, monitoring" — sounds like features
- "For the AI internet" — good for investors, too abstract for buyers

---

## 3. The First ICP

**Do not sell to "every business."**

### Primary targets

| Segment | Why |
|---------|-----|
| Seed to Series B AI startups | They make huge claims, need investor credibility |
| B2B SaaS with comparison pages | "Best," "fastest," "most secure," "enterprise-ready" |
| Agencies building AI/SaaS sites | Best distribution channel — use as QA/trust layer |
| VC platform teams / accelerators | Audit portfolio company websites |

**First buyer persona:** Founder, Head of Growth, agency owner, fractional CMO, or VC platform operator.

Not compliance. Not legal. Not enterprise procurement.

---

## 4. The Painful Problem

**Fears that drive purchase:**

- Prospect skepticism: *"Your site sounds like every other AI startup."*
- Investor credibility: *"Big claims, no proof."*
- Buyer trust gaps: *"You say HIPAA-ready but nothing backs it up."*
- Sales friction: Claims on the site create objections in calls.
- Legal exposure: Overstated claims compound as the company grows.
- Content slop: AI-generated marketing creates more assertions than the business can support.

**The buyer-facing problem:**
> Your site may be making claims faster than your business can prove them.

---

## 5. The Core Object: Claim Record

This is the product spine. Every other feature is a view on the Claim Record.

### Fields

**Claim basics:**
- `claim_id` — Unique ID
- `claim_text` — Exact sentence found
- `normalized_claim` — Cleaned version of what the claim actually asserts
- `source_url` — Where the claim was found
- `page_type` — Homepage, pricing, comparison, security, case study, blog, etc.
- `claim_location` — Hero, CTA, feature block, footer, FAQ, testimonial, etc.

**Claim classification:**
- `claim_type` — Performance, security, compliance, integration, pricing, customer result, market leadership, comparison, guarantee, AI capability, support promise, implementation promise
- `claim_strength` — Low, medium, high, extreme
- `buyer_sensitivity` — Low, medium, high (security, compliance, money, health, legal = high)

**Evidence layer:**
- `evidence_status` — Verified, weakly supported, unsupported, expired, changed, revoked, **overstated**
- `evidence_type` — On-page proof, customer quote, case study, certification, benchmark, documentation, integration proof, third-party source, internal upload, no evidence
- `evidence_url`, `evidence_summary`, `evidence_expiration`

**Risk layer:**
- `risk_level` — Low, medium, high, critical
- `risk_reason` — Why this claim is risky
- `recommended_action` — Keep, soften, add proof, rewrite, remove, split, monitor, escalate

**Content layer:**
- `content_gap` — What supporting content is missing
- `content_brief_type` — Proof block, FAQ, landing page section, case study, comparison page, technical explainer, security note, customer story

**Monitoring layer:**
- `claim_hash`, `evidence_hash`, `last_seen_at`, `last_verified_at`
- `change_status` — Unchanged, modified, removed, newly added

---

## 6. The Claim State System

| State | Meaning |
|-------|---------|
| Verified | Claim has evidence proportional to its strength |
| Weakly Supported | Some evidence exists, but not enough |
| Unsupported | No meaningful evidence found |
| **Overstated** | **Evidence exists, but the claim exaggerates it** |
| Expired | Evidence is stale or time-sensitive |
| Changed | Claim text changed since last scan |
| Removed | Claim disappeared from the site |
| Revoked | Previously verified, now contradicted or no longer valid |

**Overstated is the critical addition.** A lot of marketing claims are not fully unsupported — they are inflated. Example: evidence says "one customer reduced admin time by 22%," website says "reduce admin work by 80%." That's overstated, not unsupported.

---

## 7. The Product Modules

**Do not ship three equal apps.** Ship one wedge.

### Scrutexity Core

**A. Audit (the front door)**
- Scans a site and produces: Claim Inventory, Evidence Map, Risk Score, Fix Plan
- This is AuditGPT by Scrutexity (de-emphasize "GPT" over time)

**B. Claim Library (the moat)**
- Stores every Claim Record over time
- Where customers return
- More important than Claim Rewrites

**C. Fixes (the Claim Rewrites layer)**
- Not "AI content" — sell as "evidence-backed claim fixes"
- Outputs: safer hero copy, proof blocks, FAQ answers, case study outlines, security page sections, comparison page corrections, claim-safe LinkedIn posts
- Claim Rewrites is a claim repair engine, not a content engine

**D. Monitor (subscription hook)**
- New unsupported claims, changed claims, expired evidence, removed proof, risk score changes, badge status changes

---

## 8. The User Journey

**Step 1:** User enters website → CTA: "Run a Claim Audit"

**Step 2:** Scrutexity scans 5-10 key pages (homepage, pricing, about, security, case studies, comparison, product, blog)

**Step 3:** Report shows claim risk — total claims, verified, weak, unsupported, overstated, critical

**Step 4:** Show top 5 risky claims with specific fix recommendations

**Step 5:** Offer paid unlock — free shows summary + 3 claims, paid gives full inventory + fix plan + badge + rescan + library + content briefs

**Conversion point:** "Unlock the full Claim Library and fix plan" — not "Subscribe to Pro"

---

## 9. The Badge Strategy

**Badge is distribution, not decoration.**

### Badge copy
- ❌ "Verified by Scrutexity" (too strong, implies full verification)
- ✅ "Claim Audit Completed"
- ✅ "Monitored by Scrutexity"
- ✅ "Claim Library Active"

### Badge tiers

| Level | Label | What it means |
|-------|-------|---------------|
| 1 | Audited by Scrutexity | Site was scanned |
| 2 | Monitored by Scrutexity | Claims checked monthly/weekly |
| 3 | Verified Claim Library | Specific claims have evidence attached |

### Public report (for prospects)
Shows: company name, audit date, badge status, claims reviewed, verified claims, evidence-backed proof points, monitoring status. **No public shaming.**

### Private report (for customer)
Shows: unsupported claims, risky claims, overstated claims, fix plan, content briefs, monitoring alerts. **Creates urgency.**

Founders will not embed a badge that publicly exposes weak claims. The public report creates trust. The private report creates urgency.

---

## 10. Pricing

| Tier | Price | Includes |
|------|-------|----------|
| Free | $0 | One domain audit, top 3 risky claims, 3 fixes, limited report. Purpose: lead capture |
| Pro | $99/mo | 1 domain, full Claim Library, monthly rescan, private + public report, basic badge, 5 claim fixes/mo |
| Growth | $299/mo | 5 domains, weekly rescans, badge history, team access, 20 fixes, change alerts, PDF exports |
| Agency | $799/mo | 25 client domains, white-label reports, client workspaces, custom badge, embeddable reports, bulk audits, CSV/API |
| Enterprise | Custom | SSO, API, CI/CD checks, legal/compliance workflows, private evidence vault, custom retention, SLA |

Do not call $799 "Enterprise." Call it Agency. Enterprise is custom.

---

## 11. The Agency Offer

**This is your fastest money.**

> White-Label Claim Audits for AI/SaaS Agencies

**Why agencies buy:** Look smarter, new billable deliverable, reduce client embarrassment, sell strategy not just design, trust layer for AI-generated copy.

**Agency pitch:**
> Your clients are using AI to generate faster websites. Scrutexity helps you make sure those websites do not launch with unsupported claims.

---

## 12. The First Vertical Wedge

**AI startup homepage claim audits.**

Why AI startups: they make insane claims. "Autonomous agents," "enterprise-grade," "10x faster," "human-level," "HIPAA-ready," "replaces your team" — these are perfect for Scrutexity.

**Launch asset:** *The State of AI Startup Claims* — audit 50-100 AI startup homepages, publish aggregate findings.

---

## 13. The Website Structure

7 pages, not 45:

1. **Homepage** — Hero: "Every business makes claims. Scrutexity shows which ones are provable." + CTA + problem + how it works + sample output + pricing + agency + CTA
2. **/audit** — Dedicated claim audit landing page
3. **/sample-report** — Demo report (more important than the homepage)
4. **/badge** — Badge states explained
5. **/agency** — White-label audits pitch
6. **/pricing** — Simple pricing
7. **/state-of-ai-claims** — Report page

---

## 14. The Sample Report

**The artifact sells the product.** More important than the homepage.

**Structure:**
- Company, domain, audit date, pages scanned, claims found, risk score
- Summary: X total, Y verified, Z weakly supported, W unsupported, V overstated
- Top claim risks table (claim, status, risk, fix)
- Recommended fixes (numbered)
- Content opportunities (case study needed, FAQ needed, proof block needed)

---

## 15. The Scoring System

**Claim Risk Score** (0-100, higher = more risk)

**Formula:**
> Claim Strength × Evidence Gap × Buyer Sensitivity × Page Prominence

**Factors:**
- **Strength** — How bold is the claim?
- **Evidence** — How much support exists?
- **Sensitivity** — Would buyers/legal/investors care?
- **Prominence** — Where does it appear (hero vs footer)?
- **Recency** — Is proof stale?
- **Specificity** — Does it include numbers, guarantees, compliance, or superiority?

---

## 16. What Counts as a Claim

Any business assertion that can influence trust, purchase intent, risk perception, or credibility.

**Types:** Performance, capability, security, compliance, integration, market leadership, customer results, comparison, outcome promises, guarantees.

**Do not classify fluffy brand language as high risk.** "Work smarter" is low value. "Automate 90% of support tickets" is a real claim.

---

## 17. Technical Architecture (v1 Minimum)

- **Next.js** — Public site, audit form, reports
- **Postgres** — Claim Records, sites, audits, evidence, badges
- **Queue worker** — Crawling and analysis
- **LLM extraction pipeline** — Extract claims, classify, score, fix recommendations
- **Crawler** — Start with sitemap + key links
- **Hashing** — Hash claim text and evidence snapshot
- **Stripe** — Only after people want full reports
- **No full dashboard in v1** — Reports first

### Minimum schema

```
users, sites, pages, audit_runs, claim_records,
evidence_records, recommendations, badges, monitor_events
```

---

## 18. What Not to Build (Yet)

- Full content calendar
- Complex dashboard
- SSO
- CI/CD integrations
- Public API
- Unlimited domains
- Team permissions
- Complex badge network
- Browser extension
- Legal review workflow
- Marketplace

The only thing that matters: can you produce a report people want to pay to unlock or keep updated?

---

## 19. The Moat

Not AI. Not prompts. Not the crawler.

**The moat compounds from:**
- Historical claim graph
- Public badge distribution
- Repeated rescans
- Customer evidence records
- Dataset of how businesses make unsupported claims

Prompts are copyable. A persistent claim history is harder to copy. A badge network is harder to copy.

---

## 20. The 30-Day Execution Plan

| Days | Action |
|------|--------|
| 1-2 | Kill ambiguity: Scrutexity = Claim Intelligence. Medspa = separate brand. |
| 3-5 | Build homepage + sample report + audit page + pricing + agency page |
| 6-8 | Define Claim Record schema + database tables |
| 9-12 | Build audit ingestion: crawl → extract claims → classify → score → recommendations |
| 13-15 | Build report generation: private report, public report, PDF, share URL |
| 16-18 | Build badge v1: static badge with dynamic status, links to public report |
| 19-21 | Manual Claim Rewrites: proof block rewrites, safer claims, FAQ, case study outlines |
| 22-25 | Audit 30 AI startups (pick a niche) |
| 26-28 | Publish "State of AI Startup Claims" report — the launch asset |
| 29-30 | Sell: outbound to founders, agencies, VCs, fractional CMOs |

---

## 21. The Outbound Messages

**To founder:**
> Subject: Found 6 unsupported claims on your homepage
>
> I ran a claim audit on your site and found several claims that may need stronger proof — mostly around automation, security, and customer outcomes. I can send the preview if useful.

**To agency:**
> Subject: Claim audits for AI sites before launch
>
> Scrutexity gives agencies a white-label claim audit before client launch. Trust/QA layer you can include in strategy and launch packages.

**To VC platform:**
> Subject: Claim audits for portfolio company websites
>
> I'm preparing a short report on AI startup claim quality and can include a few portfolio companies as examples privately.

---

## 22. The Kill Criteria

After 30 days, pivot or kill if:

- ❌ Fewer than 5 people ask for the full report from 50 audits
- ❌ Fewer than 3 agencies want a demo from 30 outreach
- ❌ Nobody embeds a badge
- ❌ People like the audit but don't care about monitoring
- ❌ Users only want one-time free feedback (product is consulting, not SaaS)

**Continue if:**
- ✅ 5+ people pay or seriously attempt to pay
- ✅ 3+ agencies ask for white-label
- ✅ 10+ users request re-audits or monitoring
- ✅ Founders ask "Can you fix these claims for me?"
- ✅ People share the report internally
- ✅ People ask for the badge

---

## 23. The Final Structure

```
Company:  Scrutexity
Category: Claim Intelligence
Wedge:    Website Claim Audit
Core Object: Claim Record
Primary Artifact: Claim Audit Report
Distribution: Audited / Monitored Badge
Subscription Hook: Claim Monitoring
Expansion: Agency white-label, API, CI/CD, enterprise trust workflows
Data Moat: Living claim graph
First ICP: AI/SaaS startups + agencies that build for them
30-Day Goal: Prove people want full reports, fixes, badges, and rescans
```

## The One Brutal Question

> **What are you claiming, and can you prove it?**
