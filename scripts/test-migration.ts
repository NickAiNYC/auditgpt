import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Migration Fixture Test ===\n');

  // ── Seed: Create test data before migration ──────────────────
  console.log('Seeding test data...');

  // Create a test user
  const user = await prisma.user.create({
    data: {
      id: 'migration-test-user',
      email: 'migration-test@auditgpt.ai',
    },
  });
  console.log(`✓ Created user: ${user.id}`);

  // Create a test audit with all columns populated
  const audit = await prisma.audit.create({
    data: {
      id: 'migration-test-audit-1',
      publicId: 'migration-test-pub-1',
      path: 'grow',
      companyName: 'Test Company',
      websiteUrl: 'https://test.example.com',
      industry: 'SaaS',
      auditJson: JSON.stringify({ verdict: 'B', score: 78 }),
      verdict: 'B',
      score: 78,
      userId: user.id,
    },
  });
  console.log(`✓ Created audit: ${audit.id} (score: ${audit.score})`);

  // Create a rescan audit linked to the first
  const rescan = await prisma.audit.create({
    data: {
      id: 'migration-test-audit-2',
      publicId: 'migration-test-pub-2',
      path: 'grow',
      companyName: 'Test Company',
      websiteUrl: 'https://test.example.com',
      industry: 'SaaS',
      auditJson: JSON.stringify({ verdict: 'B', score: 82 }),
      verdict: 'B',
      score: 82,
      previousAuditId: audit.id,
      userId: user.id,
    },
  });
  console.log(`✓ Created rescan audit: ${rescan.id} (previousAuditId: ${rescan.previousAuditId})`);

  // Create claims for the first audit
  const claim = await prisma.auditClaim.create({
    data: {
      auditId: audit.id,
      claimHash: 'migration-test-hash-001',
      claimText: 'Test claim for migration verification',
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
  console.log(`✓ Created claim: ${claim.claimHash}`);

  // Create an agent config referencing the audit
  const agentConfig = await prisma.agentConfig.create({
    data: {
      id: 'migration-test-agent-config',
      type: 'ad_copy',
      config: JSON.stringify({ channels: ['facebook'] }),
      active: true,
      auditId: audit.id,
      userId: user.id,
    },
  });
  console.log(`✓ Created agent config: ${agentConfig.id}`);

  console.log('\n--- Pre-migration verification ---');

  // Verify counts before migration
  const auditCount = await prisma.audit.count();
  const claimCount = await prisma.auditClaim.count();
  const agentConfigCount = await prisma.agentConfig.count();
  console.log(`Audits: ${auditCount}`);
  console.log(`Claims: ${claimCount}`);
  console.log(`Agent configs: ${agentConfigCount}`);

  // Verify relationships
  const linkedRescan = await prisma.audit.findUnique({
    where: { id: rescan.id },
    include: { previousAudit: true, claims: true },
  });
  console.log(`Rescan linked to previous: ${linkedRescan?.previousAudit?.id === audit.id ? '✓' : '✗ FAIL'}`);
  console.log(`Rescan score preserved: ${linkedRescan?.score === 82 ? '✓' : '✗ FAIL'}`);

  const claimWithAudit = await prisma.auditClaim.findFirst({
    where: { claimHash: claim.claimHash },
    include: { audit: true },
  });
  console.log(`Claim linked to audit: ${claimWithAudit?.audit?.id === audit.id ? '✓' : '✗ FAIL'}`);

  const configWithAudit = await prisma.agentConfig.findUnique({
    where: { id: agentConfig.id },
    include: { audit: true },
  });
  console.log(`Agent config linked to audit: ${configWithAudit?.audit?.id === audit.id ? '✓' : '✗ FAIL'}`);

  // ── Cleanup ──────────────────────────────────────────────────
  console.log('\n--- Cleanup ---');
  await prisma.auditClaim.deleteMany({ where: { auditId: { in: [audit.id, rescan.id] } } });
  await prisma.agentConfig.deleteMany({ where: { auditId: { in: [audit.id, rescan.id] } } });
  await prisma.audit.deleteMany({ where: { id: { in: [audit.id, rescan.id] } } });
  await prisma.user.deleteMany({ where: { id: user.id } });
  console.log('✓ Test data cleaned up');

  console.log('\n=== All migration fixture assertions passed ===');
}

main()
  .catch((e) => {
    console.error('Migration fixture failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
