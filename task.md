# Tasks: Resolve Rescan & Lineage Security Findings

## Build 3: Independent Claim Expiration

- [x] Add derived claim-expiration reaper without mutating ledger claims
- [x] Mark parent audits stale and revoke verification
- [x] Add unique notification-attempt and Pro rescan-job records
- [x] Secure `/api/cron/expire-claims` with `CRON_SECRET`
- [x] Schedule daily execution in `vercel.json`
- [x] Add idempotency fixture and `test:expiry` command
- [x] Extend the safe migration gate for expiry schema columns and tables

- [x] Delete old lineage migration folder `20260620060849_add_audit_lineage`
- [x] Update `schema.prisma` to include `score`, `verdict`, and `RescanLock`
- [x] Create committed incremental migration `20260620130000_add_audit_lineage` using table-swapping rebuild and foreign keys
- [x] Apply migration dev reset/sync to SQLite DB
- [x] Update `persistAudit` to write `score`/`verdict` and throw on validation failure
- [x] Update `/api/rescan/route.ts` to abort on `scraped.fetchError` before calling the LLM
- [x] Update `/api/rescan/route.ts` to delete expired locks (> 5 minutes) and distinguish P2002 errors from database failures
- [x] Write `task.md` and `walkthrough.md` to the workspace root
- [x] Update `test-ledger.ts` to assert lineage errors, lock reclaims, and unique constraint checks
- [x] Create automated genuine migration test script `scripts/test-migration-genuine.ts` using `better-sqlite3` to simulate migrating a pre-lineage database and check foreign key constraints programmatically via `PRAGMA foreign_key_check`
- [x] Add a fail-closed pre-deploy gate for pre-lineage and fully pushed databases
- [x] Add canonical `npm run db:deploy` command that runs the gate before Prisma deployment
- [x] Create automated migration chain test script `scripts/test-full-migration-chain.ts` testing `prisma migrate deploy` from empty database
- [x] Add `"test:migration:chain"`, `"test:migration:genuine"`, and `"test:migration:all"` commands to `package.json`
- [x] Verify test execution via `npm run test:migration:all`
- [x] Verify test execution via `npx tsx scripts/test-ledger.ts`
- [x] Verify workspace build via `npm run build`
