# Walkthrough - Rescan & Lineage Security Resolution

## Build 3: Independent Claim Expiration Reaper

`/api/cron/expire-claims` runs daily at 09:00 UTC and authenticates with a
constant-time `CRON_SECRET` comparison. It derives expiration from
`AuditClaim.expiresAt`, marks the containing audit stale, revokes its badge,
creates one notification-attempt record, and creates one pending rescan job for
active Pro or Agent subscriptions. It never changes claim `status`,
`expiresAt`, or `supersededAt`.

`ExpiryNotification.auditId` and `ExpiryRescanJob.auditId` are unique, making
repeat cron runs idempotent. The cron queues work rather than invoking the LLM,
so normal rescan rate limits and cost controls remain the execution boundary.

Run `npm run test:expiry` to verify expired, future, already-notified, free, and
Pro scenarios. Use `npm run cron:expire` for a manual authenticated invocation.

We have resolved all migration findings, ensuring cascading delete safety, complete column preservation, and automated testing coverage against genuine pre-lineage databases and the full migration chain.

## Changes Made

### 1. Two-Path Upgrade Strategy
* **Pre-Deploy Check Script (`scripts/pre-migrate-check.mjs`)**:
  `npm run db:deploy` always runs this gate before `prisma migrate deploy`. Do not invoke `prisma migrate deploy` directly.
  - **Path A (Pre-lineage)**: Runs `npx prisma migrate deploy` normally using the static `migration.sql`.
  - **Path B (Db push)**: Checks that constraints and column types are clean, then resolves the migration name in Prisma's schema table (`_prisma_migrations`) using `prisma migrate resolve --applied` to avoid running the destructive table swap on a database where columns already exist.

### 2. Table Rebuild with Foreign Key Deferrals
* **Lineage Migration (`prisma/migrations/20260620130000_add_audit_lineage/migration.sql`)**:
  Uses a safe static SQLite table rebuild. Rebuilds the `Audit` table with foreign key constraints, preserves the pre-lineage database data, drops/renames the temporary table inside a transaction with `PRAGMA foreign_keys=OFF` and `PRAGMA defer_foreign_keys=ON` to protect references.
* **Removed Dead Code**: Deleted the dead `migration.ts` file from the migration directory to prevent Prisma migrate engine crashes during production deploys.

### 3. Hardened Testing Suite
* **Genuine Migration Test (`scripts/test-migration-genuine.ts`)**:
  Simulates a pre-lineage SQLite schema using `better-sqlite3`, seeds it, runs the static `migration.sql` file (exercising the exact production path), checks `PRAGMA foreign_key_check` (asserting exactly 0 violations), and verifies ORM compatibility.
* **Full Chain Migration Test (`scripts/test-full-migration-chain.ts`)**:
  Deploys all migrations from scratch onto an empty database using `npx prisma migrate deploy` in timestamp order, and validates that every model is ORM-compatible.
* **Command Binding (`package.json`)**:
  Configured `"test:migration:genuine"`, `"test:migration:chain"`, and `"test:migration:all"`.

## Verification Results

### Pre-Migrate Check
* Run `npx tsx scripts/pre-migrate-check.ts` successfully under Path B:
```
Column detection:
  score: true
  verdict: true
  previousAuditId: true
  monitoredSiteId: true

→ Path B: Database has new columns (db push detected).
  Verifying column types and constraints...
  Foreign key check: clean
  Column types: verified
  Marking migration as applied...
  Migration is already recorded as applied in the database. Proceeding.

✓ Path B complete. Safe to proceed with prisma migrate deploy.
```

### Genuine & Chain Migration Tests
* Ran `npm run test:migration:all` successfully:
```
=== GENUINE MIGRATION TEST (Production SQL) ===

Phase 1: Creating pre-lineage database...
✓ Pre-lineage schema created

Phase 2: Seeding test data...
✓ Pre: no score column
✓ Pre: no verdict column
✓ Pre: no previousAuditId column

Phase 3: Executing migration.sql (production path)...
✓ Production SQL executed

Phase 4: Validating post-migration state...
✓ FK violations: 0 (got 0)
...
=== PRODUCTION MIGRATION TEST PASSED ===
```

### Production Build
* Ran `npm run build` successfully.
