import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { unlinkSync } from 'fs';

const TEST_DB_PATH = join(process.cwd(), 'full-chain-test.db');

// Helper: assertion that exits on failure
function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`\n✗ FAIL: ${message}`);
    try { unlinkSync(TEST_DB_PATH); } catch {}
    try { unlinkSync(TEST_DB_PATH + '-wal'); } catch {}
    try { unlinkSync(TEST_DB_PATH + '-shm'); } catch {}
    process.exit(1);
  }
  console.log(`✓ ${message}`);
}

async function main() {
  console.log('=== FULL MIGRATION CHAIN TEST ===\n');

  // Remove old test database
  try { unlinkSync(TEST_DB_PATH); } catch {}
  try { unlinkSync(TEST_DB_PATH + '-wal'); } catch {}
  try { unlinkSync(TEST_DB_PATH + '-shm'); } catch {}

  process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;

  console.log('Running prisma migrate deploy on empty database...');
  
  try {
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: `file:${TEST_DB_PATH}` },
      stdio: 'pipe',
      timeout: 30000,
    });
    console.log('✓ All migrations applied successfully');
  } catch (error: any) {
    console.error('✗ Migration deploy failed:', error.stderr?.toString() || error.message);
    process.exit(1);
  }

  // Verify final schema matches Prisma schema
  console.log('\nValidating final schema...');
  
  const prisma = new PrismaClient();
  
  try {
    // Try creating records in every model to verify schema compatibility
    const user = await prisma.user.create({
      data: { id: 'chain-test-user', email: 'chain-test@auditgpt.ai' },
    });
    assert(user !== null, 'User model works');

    const site = await prisma.monitoredSite.create({
      data: { id: 'chain-test-site', url: 'https://chain-test.example.com' },
    });
    assert(site !== null, 'MonitoredSite model works');

    const audit = await prisma.audit.create({
      data: {
        id: 'chain-test-audit',
        publicId: 'chain-test-pub',
        path: 'grow',
        companyName: 'Chain Test Co',
        websiteUrl: 'https://chain-test.example.com',
        industry: 'SaaS',
        auditJson: JSON.stringify({ verdict: 'B', score: 78 }),
        verdict: 'B',
        score: 78,
        userId: user.id,
        monitoredSiteId: site.id,
      },
    });
    assert(audit !== null, 'Audit model works (with score, verdict, lineage columns)');

    const claim = await prisma.auditClaim.create({
      data: {
        auditId: audit.id,
        claimHash: 'chain-test-hash',
        claimText: 'Chain test claim',
        claimType: 'factual',
        status: 'observed',
        severity: 'medium',
        sourceKind: 'website',
        section: 'hero',
        position: 1,
        ruleVersion: '1.0.0',
        crawledAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });
    assert(claim !== null, 'AuditClaim model works');

    const rescan = await prisma.audit.create({
      data: {
        id: 'chain-test-rescan',
        publicId: 'chain-test-pub-2',
        path: 'grow',
        websiteUrl: 'https://chain-test.example.com',
        auditJson: JSON.stringify({ verdict: 'B', score: 82 }),
        verdict: 'B',
        score: 82,
        previousAuditId: audit.id,
        userId: user.id,
      },
    });
    assert(rescan !== null, 'Rescan with lineage works');

    // Clean up
    await prisma.auditClaim.deleteMany({ where: { auditId: { in: [audit.id, rescan.id] } } });
    await prisma.audit.deleteMany({ where: { id: { in: [audit.id, rescan.id] } } });
    await prisma.monitoredSite.delete({ where: { id: site.id } });
    await prisma.user.delete({ where: { id: user.id } });

    console.log('\n✓ Full migration chain verified');
  } catch (error: any) {
    console.error('✗ Schema validation failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  // Cleanup
  try { unlinkSync(TEST_DB_PATH); } catch {}
  try { unlinkSync(TEST_DB_PATH + '-wal'); } catch {}
  try { unlinkSync(TEST_DB_PATH + '-shm'); } catch {}

  console.log('\n=== FULL MIGRATION CHAIN TEST PASSED ===');
}

main().catch((e) => {
  console.error('Full migration chain test failed:', e);
  process.exit(1);
});
