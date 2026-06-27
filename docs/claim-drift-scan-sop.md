# Claim Drift Scan SOP (Manual Fulfillment)

Every submitted lead must follow this exact 9-step procedure to ensure the diagnostic deliverable is repeatable, credible, and drives urgency.

## Objective
Convert a submitted domain from the `/admin/leads` dashboard into a standardized Claim Drift Baseline report within 24 hours of submission.

---

## 1. Open Submitted Domain
- Pull the URL from the leads dashboard.
- Load the homepage in an incognito window to avoid personalization bias.

## 2. Review High-Intent Pages
- Scan the **Homepage** and identify 3–5 high-intent pages (e.g., Services, Pricing, "About Us", Case Studies/Before & Afters).
- Look specifically for absolute language ("Best in...", "Guaranteed", "First to...", "Only clinic that...").

## 3. Extract 10–25 Claims
- Manually extract the specific assertions the brand is making. 
- Copy the exact text of the claim.

## 4. Classify Each Claim
For each extracted claim, assign one of the following statuses based on immediately visible evidence on the page:
- **Verified:** The claim is immediately backed up by a citation, credential, data point, or disclaimer on the same page.
- **Weakly Supported:** Evidence exists but is buried, hard to find, or relies on an unlinked third-party logo.
- **Unsupported:** The claim is made as a fact with no visible evidence on the page.
- **Overstated:** The claim uses absolute language ("guaranteed", "permanent", "always") that violates typical compliance or reality.
- **Needs Review:** Ambiguous claims that require subject matter expertise or legal review to verify.

## 5. Run 5 AI Answer Reality Prompts
Open ChatGPT, Claude, and Perplexity. Run 5 intent-based prompts:
1. `Best [business type] near [location]` (High Intent Search)
2. `Is [Brand Name] good for [specific service]?` (Trust Verification)
3. `Does [Brand Name] offer [specific service]?` (Capabilities Check)
4. `What are the risks of using [Brand Name]?` (Risk/Safety Search)
5. `[Brand Name] vs [Competitor Name]` (Displacement Check)

## 6. Identify Key Signals
Review the AI outputs and the claim classifications to isolate:
- **Top 3 Unsupported Claims:** The most dangerous assertions on their site.
- **AI Distortions:** Where AI invented or misunderstood their services.
- **Competitor Displacement:** Where an AI engine recommended a competitor over them.
- **Proof Gaps:** Where they make a good claim but lack the necessary trust badge/credential.
- **Safer Rewrites:** How to fix the top 3 unsupported claims safely.

## 7. Produce the Baseline Report
- Open `docs/claim-drift-baseline-template.md`.
- Fill in the blanks with the data from Steps 4 and 6.
- Calculate the initial **Claim Health Score** (Percentage of Verified vs Total Claims).

## 8. Send Follow-Up Email
- Copy the text from `docs/follow-up-email.md`.
- Attach or link to the completed Baseline Report (can be sent as a PDF or Notion link for MVP).
- Send to the provided lead email.

## 9. Log Outcome
- Go back to `/admin/leads`.
- Update the status from `new` to `sent` in the `data/leads.jsonl` file (for now, this requires manually editing the JSONL file or updating the API to support status changes).
