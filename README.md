# AuditGPT — Claim Intelligence for AI-Era Businesses

**Find the claims your website cannot prove.**

AI builds the site. AuditGPT checks what it cannot prove.

AuditGPT is Scrutexity's public diagnostic front door. It maps website claims to visible evidence, identifies missing proof, evaluates AI/search readability and demand-risk gaps, and recommends prioritized fixes. It is not a generic SEO audit, legal review, compliance certification, absolute-truth engine, AI-slop detector, or med-spa-only tool.

## Offer ladder

- Free Claim Snapshot
- $99 Single-Page Starter Audit
- $299 Five-Surface Visibility & Trust Audit
- $799 Agency Audit System

Primary users include AI/SaaS founders, agencies, AI-built businesses, and trust-sensitive operators.

## Product relationship

- Scrutexity is the parent company and platform.
- AuditGPT diagnoses claim and evidence gaps.
- Contento turns approved findings into governed assets.
- Recovery applies the system to missed-consult workflows in selected verticals.

## Safety boundary

AuditGPT does not provide legal or clinical advice, certify compliance, guarantee rankings or AI citations, promise revenue or bookings, verify absolute truth, or replace human review. Absence of public evidence is reported as a proof gap—not fraud, illegality, or falsity.

## Development

```bash
bun install
bun run db:push
bun run dev
```

Verification:

```bash
npx tsc --noEmit
bun run eval
bun run build
```

The active implementation uses Next.js App Router, TypeScript, Prisma, NextAuth, Stripe, and server-side model calls. Historical product doctrine is preserved in the Scrutexity stale-doctrine archive and must not control current behavior.
