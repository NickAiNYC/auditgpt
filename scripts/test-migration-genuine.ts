import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const TEST_DB_PATH = join(process.cwd(), 'migration-test.db');
const MIGRATION_SQL = readFileSync(
  join(process.cwd(), 'prisma/migrations/20260620130000_add_audit_lineage/migration.sql'),
  'utf-8'
);

// Helper: hard assertion that exits on failure
function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`\n✗ FAIL: ${message}`);
    // Clean up before exit
    try { unlinkSync(TEST_DB_PATH); } catch {}
    try { unlinkSync(TEST_DB_PATH + '-wal'); } catch {}
    try { unlinkSync(TEST_DB_PATH + '-shm'); } catch {}
    process.exit(1);
  }
  console.log(`✓ ${message}`);
}

async function main() {
  console.log('=== GENUINE MIGRATION TEST (Production SQL) ===\n');

  // ── Phase 1: Create pre-lineage database ──────────────────────
  console.log('Phase 1: Creating pre-lineage database...');
  
  try { unlinkSync(TEST_DB_PATH); } catch {}

  const rawDb = new Database(TEST_DB_PATH);
  rawDb.pragma('journal_mode = WAL');
  rawDb.pragma('foreign_keys = ON');
  
  rawDb.exec(`
    CREATE TABLE User (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      emailVerified DATETIME,
      name TEXT,
      image TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL
    );

    CREATE TABLE Audit (
      id TEXT PRIMARY KEY,
      publicId TEXT NOT NULL UNIQUE,
      path TEXT NOT NULL DEFAULT 'grow',
      companyName TEXT,
      websiteUrl TEXT,
      industry TEXT,
      focusNotes TEXT,
      auditJson TEXT NOT NULL,
      userId TEXT,
      verified BOOLEAN NOT NULL DEFAULT 0,
      verifiedAt DATETIME,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );

    CREATE TABLE AuditClaim (
      id TEXT PRIMARY KEY,
      auditId TEXT NOT NULL REFERENCES Audit(id) ON DELETE CASCADE,
      claimHash TEXT NOT NULL,
      claimText TEXT NOT NULL,
      claimType TEXT NOT NULL,
      status TEXT NOT NULL,
      severity TEXT NOT NULL,
      sourceKind TEXT NOT NULL,
      sourceUrl TEXT,
      sourceText TEXT,
      section TEXT NOT NULL,
      position INTEGER NOT NULL,
      ruleVersion TEXT NOT NULL,
      crawledAt DATETIME NOT NULL,
      expiresAt DATETIME,
      supersededAt DATETIME,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE AgentConfig (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      config TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT 1,
      auditId TEXT NOT NULL REFERENCES Audit(id) ON DELETE CASCADE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL
    );
  `);

  console.log('✓ Pre-lineage schema created');

  // ── Phase 2: Seed test data ──────────────────────────────────
  console.log('\nPhase 2: Seeding test data...');

  rawDb.exec(`
    INSERT INTO User (id, email, name, updatedAt) VALUES ('user-1', 'test@auditgpt.ai', 'Test User', datetime('now'));
    INSERT INTO Audit (id, publicId, path, companyName, websiteUrl, industry, auditJson, userId)
    VALUES ('audit-1', 'pub-1', 'grow', 'Test Co', 'https://test.example.com', 'SaaS', '{"verdict":"B","score":78}', 'user-1');
    INSERT INTO AuditClaim (id, auditId, claimHash, claimText, claimType, status, severity, sourceKind, section, position, ruleVersion, crawledAt)
    VALUES ('claim-1', 'audit-1', 'hash-001', 'Test claim', 'factual', 'observed', 'medium', 'website', 'hero', 1, '1.0.0', datetime('now'));
    INSERT INTO AgentConfig (id, type, config, active, auditId, userId, updatedAt)
    VALUES ('agent-1', 'ad_copy', '{"channels":["facebook"]}', 1, 'audit-1', 'user-1', datetime('now'));
  `);

  // Verify pre-migration: no new columns
  const preCols = rawDb.pragma('table_info(Audit)') as Array<{ name: string }>;
  const preNames = new Set(preCols.map(c => c.name));
  assert(!preNames.has('score'), 'Pre: no score column');
  assert(!preNames.has('verdict'), 'Pre: no verdict column');
  assert(!preNames.has('previousAuditId'), 'Pre: no previousAuditId column');

  // ── Phase 3: Execute the PRODUCTION migration.sql ────────────
  console.log('\nPhase 3: Executing migration.sql (production path)...');
  
  try {
    rawDb.exec(MIGRATION_SQL);
    console.log('✓ Production SQL executed');
  } catch (error: any) {
    console.error('✗ Migration failed:', error.message);
    rawDb.close();
    process.exit(1);
  }

  // ── Phase 4: Post-migration validation ───────────────────────
  console.log('\nPhase 4: Validating post-migration state...');

  // Reopen the database (migration closed it)
  const postDb = new Database(TEST_DB_PATH);
  postDb.pragma('foreign_keys = ON');

  // 4a: Foreign key check
  const violations = postDb.pragma('foreign_key_check') as unknown[];
  assert(violations.length === 0, `FK violations: 0 (got ${violations.length})`);

  // 4b: New columns must exist
  const postCols = postDb.pragma('table_info(Audit)') as Array<{ name: string }>;
  const postNames = new Set(postCols.map(c => c.name));
  assert(postNames.has('score'), 'Post: score column exists');
  assert(postNames.has('verdict'), 'Post: verdict column exists');
  assert(postNames.has('previousAuditId'), 'Post: previousAuditId column exists');
  assert(postNames.has('monitoredSiteId'), 'Post: monitoredSiteId column exists');

  const count = (postDb.prepare('SELECT COUNT(*) as cnt FROM Audit').get() as any).cnt;
  assert(count === 1, `Audit count: 1 (got ${count})`);

  const claim = postDb.prepare('SELECT * FROM AuditClaim WHERE id = ?').get('claim-1') as any;
  assert(claim !== undefined, 'Claim preserved');
  assert(claim.auditId === 'audit-1', 'Claim still linked');

  const agent = postDb.prepare('SELECT * FROM AgentConfig WHERE id = ?').get('agent-1') as any;
  assert(agent !== undefined, 'Agent config preserved');

  postDb.close();

  // ── Phase 5: Prisma ORM compatibility ─────────────────────────
  console.log('\nPhase 5: Verifying Prisma ORM compatibility...');

  process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;
  const prisma = new PrismaClient();

  try {
    const audits = await prisma.audit.findMany({ include: { claims: true } });
    assert(audits.length === 1, `Prisma finds 1 audit (got ${audits.length})`);
  } finally {
    await prisma.$disconnect();
  }

  // Cleanup
  unlinkSync(TEST_DB_PATH);
  try { unlinkSync(TEST_DB_PATH + '-wal'); } catch {}
  try { unlinkSync(TEST_DB_PATH + '-shm'); } catch {}

  console.log('\n=== PRODUCTION MIGRATION TEST PASSED ===');
}

main().catch((e) => {
  console.error('Test failed:', e);
  try { unlinkSync(TEST_DB_PATH); } catch {}
  process.exit(1);
});
