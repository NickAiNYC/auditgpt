# Scrutexity Execution Doctrine

> **The strategy is locked. The only thing that matters is execution.**
> **June 20, 2026**

---

## The Wedge

Website Claim Audit for AI/SaaS companies and agencies.

The product artifact is: **A Claim Audit Report people want to pay to unlock, share, or rescan.**

That is the only thing that matters for the next 30 days.

---

## The Immediate Build Order

### 1. Build the sample report before anything else

The sample report is the sales asset, product demo, investor artifact, and website proof.

**It should show:**
- Company audited, domain, audit date, pages scanned
- Claims found: verified, weakly supported, unsupported, overstated, critical risk
- 5-7 actual Claim Records, each with: claim text, status, risk level, why it matters, evidence found, recommended fix, suggested replacement copy

### 2. Build the homepage around the artifact

Hero: *"Every business makes claims. Scrutexity shows which ones are provable."*
Subhead: *"Run a website claim audit to find unsupported, overstated, and risky claims before prospects, investors, or clients do."*

Sections: problem → what Scrutexity finds → how it works → sample report preview → agency offer → pricing → CTA.

**No cinematic WebGL. No 3D. No "trust OS." No 45 pages.**

### 3. Create the Claim Record schema now

Minimum MVP: Site, Page, AuditRun, ClaimRecord, EvidenceRecord, Recommendation, Badge, MonitorEvent.

---

## The Offer Stack (3 Offers)

| Offer | Price | Includes |
|-------|-------|----------|
| Free Claim Audit Preview | $0 | Top 3 risky claims, basic score, one fix suggestion. Lead capture. |
| Full Claim Audit Report | $99 one-time or $99/mo | Full inventory, private report, risk score, fix plan, rewrites, public report page, monthly rescan if subscription. **Proves whether founders pay.** |
| Agency Claim Audit System | $799/mo | 25 audits/month, white-label reports, client-ready PDFs, fix recommendations, badge option. **Proves whether the channel works.** |

**Do not make Enterprise the focus yet. Agencies are the wedge.**

---

## The Launch Sequence

| Days | Action |
|------|--------|
| 1-3 | Build homepage, sample report, free audit form, agency page. No login. |
| 4-7 | Build internal audit pipeline — semi-manual but standardized output. |
| 8-14 | Run 10 manual audits. Do not sell yet. Refine: claim types, risk scoring, report language, fix recommendations. Goal: one audit under 45-60 minutes. |
| 15-21 | Outbound: 10 founders, 10 agencies, 5 fractional CMOs, 5 VC platform people. Personalized with one specific risky claim. |
| 22-30 | Publish *The State of AI Startup Claims: 2026 Report* — the category seed. |

---

## What to Build (First Sprint)

**Public:**
- `/` — Homepage
- `/audit` — Audit intake
- `/sample-report` — Static sample report
- `/agency` — Agency offer
- `/pricing` — Simple pricing
- `/report/[slug]` — Public report page

**Internal:**
- `/admin/audits` — List audit submissions
- `/admin/audits/[id]` — Enter/edit claims
- `/admin/reports/[id]` — Generate report

---

## What Not to Touch for 30 Days

| Don't Build | Why |
|-------------|-----|
| Contento dashboard | Premature |
| Unified auth | Not needed yet |
| SSO | Premature |
| Public API | Premature |
| CI/CD integration | Premature |
| Complex badge network | Premature |
| Team permissions | Premature |
| Full crawler | Manual is faster to iterate |
| Full monitoring | Premature |
| Fancy animations | Wasted effort |
| Enterprise pages | Premature |
| Medspa under Scrutexity | Separate brand |
| "Trust OS" manifesto | Too abstract |

---

## The Founder-Time Trap Fix

Hard time budget per manual audit:

| Stage | Minutes |
|-------|---------|
| Page selection | 10 |
| Claim extraction | 15 |
| Classification / evidence check | 15 |
| Recommendations | 15 |
| Report polish | 10 |
| **Total** | **65 max** |

If an audit cannot be completed in roughly one hour manually, the workflow is too broad. Do not audit everything. Audit the highest-trust pages only.

---

## The Manual Audit SOP

**Stage 1: Page capture** — Scan: homepage, pricing, product page, about, security/trust, case studies, comparison page, top landing page. Do not crawl the whole site.

**Stage 2: Claim extraction** — Pull concrete assertions into a table. Ignore vague fluff. Keep: "Reduce costs by 40%," "HIPAA-compliant," "Enterprise-ready," "Trusted by 10,000 teams."

**Stage 3: Claim classification** — Type: performance, security, compliance, integration, customer proof, market leadership, comparison, guarantee, AI capability, implementation, pricing, outcome.

**Stage 4: Evidence check** — Per claim: is there proof on-page? Elsewhere on site? Is evidence proportional to claim strength? Is it current? Is the claim exaggerated relative to evidence?

**Stage 5: Risk scoring** — Claim strength × evidence gap × buyer sensitivity × page prominence.

**Stage 6: Fix generation** — Every risky claim gets: keep, soften, add proof, rewrite, remove, split, create supporting content, or monitor.

---

## The Outbound Lines

**To founders:**
> *"I found a few unsupported or overstated claims on your site. Want the preview?"*

**To agencies:**
> *"Before your AI/SaaS clients launch, Scrutexity audits their site for unsupported, overstated, and risky claims — then gives you a client-ready fix plan."*

**To VC platform:**
> *"Scrutexity helps portfolio companies strengthen buyer and investor credibility by finding claims their websites cannot yet prove."*

---

## The Brutal Scoreboard

At the end of 30 days:

| Question | Pass/Fail |
|----------|:---------:|
| Did 5 people want the full report? | |
| Did 1-3 people pay? | |
| Did 3+ agencies ask for white-label? | |
| Did anyone ask for a rescan? | |
| Did anyone ask for the badge? | |
| Did anyone say "Can you fix these claims for me?" | |

If yes, continue. If no, it's not yet SaaS. It may still be consulting, but not a platform.

---

## The One Question

> **Does seeing unsupported claims create enough urgency that someone pays to fix, monitor, or badge them?**

Until that answer is yes, Scrutexity is not a platform. It is a sharp audit artifact searching for a market.

---

## What You're Selling

**To founders:**
> Your website may be making claims stronger than your proof. Scrutexity finds the unsupported ones and shows you how to fix them.

**To agencies:**
> Before your AI/SaaS clients launch, Scrutexity audits their site for unsupported, overstated, and risky claims — then gives you a client-ready fix plan.

**To investors/VC platform:**
> Scrutexity helps portfolio companies strengthen buyer and investor credibility by finding claims their websites cannot yet prove.

**For the category:**
> Claim Intelligence is the discipline of tracking what a business says, what evidence supports it, and how those claims change over time.
