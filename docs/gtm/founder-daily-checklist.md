# AuditGPT — Founder Daily Operating Checklist

The whole point of the first 30 days: prove someone *pays* for the wedge. Not engages with it. Pays for it. Three paying customers is the only meaningful signal.

Print this. Stick it on the wall. Run it Mon–Fri for 30 days.

---

## Morning (45 min)

- [ ] Open `docs/gtm/auditgpt-30-prospect-tracker.csv`
- [ ] Pick 3 prospects from the next available rows (lowest `prospect_id` not yet contacted)
- [ ] For each, open the site and spend ~10 min on:
  - One claim/trust gap (verbatim quote from the page)
  - One AI/search readability gap (a buyer question the page does not answer)
  - One demand/conversion gap (CTA, contact, booking, follow-up)
- [ ] Fill the three `*_observed` columns in the tracker
- [ ] Send 3 DMs using the templates in `docs/gtm/outbound-messages.md` (match batch → template)
- [ ] Set `dm_sent = TRUE` and `dm_sent_at = <now>` in the tracker

---

## Midday (30 min)

- [ ] Open every inbox (X, LinkedIn, email)
- [ ] Reply to every response from the last 24 hours
- [ ] For every "yes / send it / sure":
  - Run a snapshot via `/snapshot` with the prospect's URL
  - Set `snapshot_requested = TRUE`, drop `snapshot_url`, `snapshot_delivered_at`
  - Send the snapshot URL using template §7 from `outbound-messages.md`
- [ ] For every "what is this?": send template §8
- [ ] For every "how much?": send template §9
- [ ] For every "we already have SEO tools": send template §10
- [ ] For every objection: log `objection` in the tracker

---

## Afternoon (45 min)

- [ ] Log every snapshot delivered in the tracker
- [ ] For prospects who engaged with the snapshot:
  - Make the paid offer (Starter $99 or Full $299) based on which gap dominates
  - Set `paid_offer_made = TRUE`, `paid_tier` = `starter` | `full` | `agency`
- [ ] Pick the single strongest audit from today
  - Create a Contento project folder named `Contento — [company] — [date]`
  - Capture top 3 claim findings + 1 demand leakage finding
  - Draft 1 safer rewrite + 1 FAQ block
- [ ] Tag any conversion-worthy finding for the case-study pipeline

---

## Evening (15 min)

- [ ] Update tracker with current week's numbers (DMs sent / replies / snapshots / paid)
- [ ] Write one public build note (X or LinkedIn): what you learned today, what surprised you, what you'd change tomorrow. Observational. No hype.

---

## Friday weekly review (60 min)

- [ ] Compute the week's funnel:
  - prospects reviewed
  - DMs sent
  - replies
  - snapshots delivered
  - paid Starter
  - paid Full
  - agency conversations
- [ ] Identify the single best-performing message variant (highest reply rate)
- [ ] Identify the single strongest objection
- [ ] Identify which finding type triggered the most engagement (claim / visibility / demand leakage / reputation)
- [ ] **Decision:**
  - **Continue current wedge** if ≥3/10 reply rate AND ≥1 paid this week
  - **Tune product** if snapshots are being delivered but recipients say findings feel generic, OR if recommended-next-step routing felt wrong 2+ times this week
  - **Pivot wedge** (founder → agency, or agency → founder) if 0 paid after 14 days AND the other wedge produced at least 1 reply this week
  - **Pause and self-audit** if 0 paid AND 0 replies — likely a DM problem, not a product problem

---

## Dataset discipline rule (do not break)

AI/SaaS founders are the **first cash wedge**. Med spa is the **dataset-value wedge**. During the first 90 days, reserve roughly **1 of every 3 audits** for med spa / aesthetics / wellness businesses or agencies so AuditGPT starts building repetitive vertical claim-pattern data.

Concretely: every third snapshot you generate in a day should be on a med spa / wellness site. If your inbound replies all skew AI/SaaS that day, deliver an unprompted med spa snapshot yourself (without DMing it) just to keep the dataset balanced. Log every audit's `vertical` column in the tracker so you can see the balance at end-of-week.

This is dataset discipline, not a GTM pivot. Do not pitch direct med spas first. Do not redirect outbound. Just keep the audit volume balanced so the moat compounds.

---

## Hard rules (do not break)

- Do not send more than 5 DMs in a day. Quality beats volume in the first 30 days.
- Do not skip the snapshot pre-review step. If you can't articulate one specific claim, visibility, and demand gap before sending the DM, don't send it.
- Do not run paid ads.
- Do not redesign the homepage.
- Do not add product features.
- Do not pitch enterprise. Do not pitch pharma. Do not pitch regulated healthcare networks.
- Do not promise legal, clinical, compliance, ranking, revenue, or AI-visibility outcomes.
- Do not skip the daily public build note. The viral loop runs on consistency, not virality.

---

## Targets (recap)

| Metric | 30-day target | Stretch |
|---|---|---|
| Prospects reviewed | 30 | 50 |
| DMs sent | 30 | 50 |
| Replies | 8 | 15 |
| Snapshots delivered | 10 | 15 |
| Paid Starter ($99) | 3 | 5 |
| Paid Full ($299) | 1 | 2 |
| Agency conversations | 1 | 3 |
| Paid Agency ($799) | 0 | 1 |
