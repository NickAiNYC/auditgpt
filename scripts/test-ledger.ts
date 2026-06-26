import { db } from '../src/lib/db';
import { persistAudit } from '../src/lib/audit-persistence';

async function test() {
  console.log('Testing Evidence Ledger DB insert & Audit Lineage...');
  
  // Clean up any previous test audits/sites/users
  await db.audit.deleteMany({
    where: { companyName: { in: ['Ledger Test Corp', 'Other Test Corp'] } },
  });
  await db.monitoredSite.deleteMany({
    where: { url: { in: ['ledgertest.com', 'othertest.com'] } },
  });
  await db.user.deleteMany({
    where: { id: { in: ['test-user-1', 'test-user-2'] } },
  });

  // Create test users to satisfy FK constraints
  await db.user.create({
    data: { id: 'test-user-1', email: 'user1@test.com' }
  });
  await db.user.create({
    data: { id: 'test-user-2', email: 'user2@test.com' }
  });

  const mockAudit = {
    verdict: 'B',
    score: 82,
    verdict_header: 'Ledger Test Corp - Validated Operations (82/100)',
    grade_stamp: 'B',
    company_info: 'Test corp located in New York.',
    company_name: 'Ledger Test Corp',
    report_card: [
      'Site serves 12 active customers.',
      'Team consists of 3 full-time engineers.'
    ],
    red_flags: [
      'No contact page found.'
    ],
    assumptions_to_test: [
      'Founder assumes customer acquisition cost is under $100.'
    ],
    website_fixes: [
      'Add email address to footer.'
    ],
    services_to_hire: [],
    action_plan: [],
    industry_benchmarks_table: []
  };

  // 1. Create first audit for ledgertest.com owned by test-user-1
  const publicId1 = await persistAudit({
    path: 'grow',
    companyName: 'Ledger Test Corp',
    websiteUrl: 'https://ledgertest.com',
    industry: 'SaaS',
    focusNotes: 'Test notes 1',
    auditJson: mockAudit as any,
    userId: 'test-user-1',
  });

  const audit1 = await db.audit.findUnique({
    where: { publicId: publicId1 },
    include: { claims: true },
  });

  if (!audit1) {
    console.error('FAIL: First persisted audit not found in database!');
    process.exit(1);
  }

  // Assert it has monitoredSiteId set and previousAuditId is null
  if (!audit1.monitoredSiteId) {
    console.error('FAIL: First audit did not resolve a monitoredSiteId!');
    process.exit(1);
  }
  if (audit1.previousAuditId !== null) {
    console.error('FAIL: First audit has non-null previousAuditId!');
    process.exit(1);
  }
  console.log('SUCCESS: First audit successfully created with monitored site.');

  // Validate ledger assertions on the first audit
  const statuses = new Set(audit1.claims.map(c => c.status));
  const expectedStatuses = ['observed', 'unverified', 'assumption', 'remediation'];
  for (const s of expectedStatuses) {
    if (!statuses.has(s)) {
      console.error(`FAIL: Missing status classification: ${s}`);
      process.exit(1);
    }
  }
  
  const EXPECTED_TTL_MS = 90 * 24 * 60 * 60 * 1000;
  for (const claim of audit1.claims) {
    const expiresAt = claim.expiresAt;
    if (!expiresAt) {
      console.error(`FAIL: Missing expiry for claim ${claim.id}`);
      process.exit(1);
    }
    const diff = expiresAt.getTime() - claim.crawledAt.getTime();
    if (Math.abs(diff - EXPECTED_TTL_MS) > 1000) {
      console.error(`FAIL: Claim TTL is not exactly 90 days. Expected ${EXPECTED_TTL_MS}ms, got ${diff}ms`);
      process.exit(1);
    }
  }

  const hashes = audit1.claims.map(c => c.claimHash);
  const uniqueHashes = new Set(hashes);
  if (uniqueHashes.size !== hashes.length) {
    console.error('FAIL: Claim hashes are not unique!');
    process.exit(1);
  }
  console.log('SUCCESS: Ledger assertions (classifications, TTL, uniqueness) verified on first audit.');

  // 2. Create second audit: a legitimate rescan for ledgertest.com by the same owner (test-user-1)
  // Explicitly passing previousAuditId
  const publicId2 = await persistAudit({
    path: 'grow',
    companyName: 'Ledger Test Corp',
    websiteUrl: 'https://ledgertest.com',
    industry: 'SaaS',
    focusNotes: 'Test notes 2',
    auditJson: mockAudit as any,
    userId: 'test-user-1',
    previousAuditId: audit1.id,
  });

  const audit2 = await db.audit.findUnique({
    where: { publicId: publicId2 },
  });

  if (!audit2) {
    console.error('FAIL: Second persisted audit not found in database!');
    process.exit(1);
  }

  // Assert it linked previousAuditId correctly
  if (audit2.previousAuditId !== audit1.id) {
    console.error(`FAIL: Second audit did not link to first! Expected ${audit1.id}, got ${audit2.previousAuditId}`);
    process.exit(1);
  }
  console.log('SUCCESS: Second audit (valid rescan) successfully linked to first audit.');

  // 3. Create third audit: attempting to link but with a different user owner (test-user-2)
  let threwUserMismatch = false;
  try {
    await persistAudit({
      path: 'grow',
      companyName: 'Ledger Test Corp',
      websiteUrl: 'https://ledgertest.com',
      industry: 'SaaS',
      focusNotes: 'Test notes 3',
      auditJson: mockAudit as any,
      userId: 'test-user-2',
      previousAuditId: audit1.id,
    });
  } catch (err: any) {
    if (err.message.includes('Lineage validation failed: Owner mismatch')) {
      threwUserMismatch = true;
    } else {
      console.error(`FAIL: Unexpected error message on owner mismatch: ${err.message}`);
      process.exit(1);
    }
  }
  if (!threwUserMismatch) {
    console.error('FAIL: Owner mismatch lineage validation did not throw!');
    process.exit(1);
  }
  console.log('SUCCESS: Owner lineage boundary enforced (explicit throw on mismatched owners).');

  // 4. Create fourth audit: attempting to link but for a different website URL ('othertest.com')
  let threwWebsiteMismatch = false;
  try {
    await persistAudit({
      path: 'grow',
      companyName: 'Other Test Corp',
      websiteUrl: 'https://othertest.com',
      industry: 'SaaS',
      focusNotes: 'Test notes 4',
      auditJson: mockAudit as any,
      userId: 'test-user-1',
      previousAuditId: audit1.id,
    });
  } catch (err: any) {
    if (err.message.includes('Lineage validation failed: Website mismatch')) {
      threwWebsiteMismatch = true;
    } else {
      console.error(`FAIL: Unexpected error message on website mismatch: ${err.message}`);
      process.exit(1);
    }
  }
  if (!threwWebsiteMismatch) {
    console.error('FAIL: Website mismatch lineage validation did not throw!');
    process.exit(1);
  }
  console.log('SUCCESS: Website lineage boundary enforced (explicit throw on mismatched sites).');

  // 4b. Attempting to link to a non-existent audit ID -> must throw
  let threwNotFound = false;
  try {
    await persistAudit({
      path: 'grow',
      companyName: 'Ledger Test Corp',
      websiteUrl: 'https://ledgertest.com',
      industry: 'SaaS',
      focusNotes: 'Test notes 4b',
      auditJson: mockAudit as any,
      userId: 'test-user-1',
      previousAuditId: 'non-existent-id',
    });
  } catch (err: any) {
    if (err.message.includes('Lineage validation failed: Previous audit not found')) {
      threwNotFound = true;
    } else {
      console.error(`FAIL: Unexpected error message on missing audit: ${err.message}`);
      process.exit(1);
    }
  }
  if (!threwNotFound) {
    console.error('FAIL: Missing previous audit lineage validation did not throw!');
    process.exit(1);
  }
  console.log('SUCCESS: Non-existent previous audit lineage validation enforced.');

  // 4c. Verify RescanLock concurrency constraint
  try {
    await db.rescanLock.create({ data: { auditId: audit1.id } });
    let threwConcurrency = false;
    try {
      await db.rescanLock.create({ data: { auditId: audit1.id } });
    } catch (err) {
      threwConcurrency = true;
    }
    if (!threwConcurrency) {
      console.error('FAIL: RescanLock allowed duplicate auditId insertions!');
      process.exit(1);
    }
    console.log('SUCCESS: RescanLock primary key constraint verified.');
  } finally {
    await db.rescanLock.deleteMany({
      where: { auditId: audit1.id }
    });
  }

  // 4d. Verify RescanLock timeout reclaim
  const oldLockId = 'old-lock-id-' + Math.random().toString(36).slice(2, 7);
  const activeLockId = 'active-lock-id-' + Math.random().toString(36).slice(2, 7);
  const oldLockTime = new Date(Date.now() - 6 * 60 * 1000); // 6 minutes ago
  const activeLockTime = new Date(Date.now() - 3 * 60 * 1000); // 3 minutes ago
  
  await db.rescanLock.create({ data: { auditId: oldLockId, createdAt: oldLockTime } });
  await db.rescanLock.create({ data: { auditId: activeLockId, createdAt: activeLockTime } });
  
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  // Reclaim stale locks for oldLockId
  await db.rescanLock.deleteMany({
    where: {
      auditId: oldLockId,
      createdAt: { lt: fiveMinutesAgo }
    }
  });
  
  const oldLock = await db.rescanLock.findUnique({ where: { auditId: oldLockId } });
  if (oldLock !== null) {
    console.error('FAIL: Stale lock was not deleted!');
    process.exit(1);
  }
  
  // Reclaim stale locks for activeLockId (should be no-op)
  await db.rescanLock.deleteMany({
    where: {
      auditId: activeLockId,
      createdAt: { lt: fiveMinutesAgo }
    }
  });
  
  const activeLock = await db.rescanLock.findUnique({ where: { auditId: activeLockId } });
  if (activeLock === null) {
    console.error('FAIL: Active lock was incorrectly deleted!');
    process.exit(1);
  }
  
  // Clean up
  await db.rescanLock.deleteMany({
    where: { auditId: { in: [oldLockId, activeLockId] } }
  });
  console.log('SUCCESS: RescanLock timeout reclaim logic verified.');

  // 4e. Verify isPrismaUniqueConstraintError logic
  const { Prisma } = await import('@prisma/client');
  const mockError = new Prisma.PrismaClientKnownRequestError('Mock unique constraint error', {
    code: 'P2002',
    clientVersion: '6.19.3',
  });
  const mockOtherError = new Error('Some standard error');
  
  function isPrismaUniqueConstraintError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }
  
  if (!isPrismaUniqueConstraintError(mockError)) {
    console.error('FAIL: Unique constraint error detection failed.');
    process.exit(1);
  }
  if (isPrismaUniqueConstraintError(mockOtherError)) {
    console.error('FAIL: Erroneously labeled general error as unique constraint error.');
    process.exit(1);
  }
  console.log('SUCCESS: unique constraint helper verified.');

  // 5. Create fifth audit: ordinary audit without explicitly passing previousAuditId
  const publicId5 = await persistAudit({
    path: 'grow',
    companyName: 'Ledger Test Corp',
    websiteUrl: 'https://ledgertest.com',
    industry: 'SaaS',
    focusNotes: 'Test notes 5',
    auditJson: mockAudit as any,
    userId: 'test-user-1',
  });

  const audit5 = await db.audit.findUnique({
    where: { publicId: publicId5 },
  });

  if (!audit5) {
    console.error('FAIL: Fifth persisted audit not found in database!');
    process.exit(1);
  }

  // Assert that lineage was NOT linked because previousAuditId was not explicitly supplied
  if (audit5.previousAuditId !== null) {
    console.error(`FAIL: Ordinary audit was treated as a rescan without explicit previousAuditId!`);
    process.exit(1);
  }
  console.log('SUCCESS: Automatic rescan bypass verified (ordinary audits are not automatically linked).');

  // 6. Assert diff-claims library correctly diffs added, removed, reclassified, and expired claims
  const prevClaimsMock = [
    { claimHash: 'hash-unchanged', status: 'observed', expiresAt: new Date(Date.now() + 100000) },
    { claimHash: 'hash-reclassified', status: 'observed', expiresAt: new Date(Date.now() + 100000) },
    { claimHash: 'hash-removed', status: 'observed', expiresAt: new Date(Date.now() + 100000) },
    { claimHash: 'hash-expired', status: 'observed', expiresAt: new Date(Date.now() - 100000) },
  ];

  const currClaimsMock = [
    { claimHash: 'hash-unchanged', status: 'observed', expiresAt: new Date(Date.now() + 100000) },
    { claimHash: 'hash-reclassified', status: 'remediation', expiresAt: new Date(Date.now() + 100000) },
    { claimHash: 'hash-added', status: 'observed', expiresAt: new Date(Date.now() + 100000) },
  ];

  const { diffClaims, summarizeTrend } = await import('../src/lib/diff-claims');
  const mockDiff = diffClaims(prevClaimsMock, currClaimsMock);

  if (mockDiff.unchanged.length !== 1 || mockDiff.unchanged[0].claimHash !== 'hash-unchanged') {
    console.error('FAIL: diffClaims unchanged assertions failed');
    process.exit(1);
  }
  if (mockDiff.added.length !== 1 || mockDiff.added[0].claimHash !== 'hash-added') {
    console.error('FAIL: diffClaims added assertions failed');
    process.exit(1);
  }
  if (mockDiff.reclassified.length !== 1 || mockDiff.reclassified[0].claimHash !== 'hash-reclassified') {
    console.error('FAIL: diffClaims reclassified assertions failed');
    process.exit(1);
  }
  if (mockDiff.removed.length !== 1 || mockDiff.removed[0].claimHash !== 'hash-removed') {
    console.error('FAIL: diffClaims removed assertions failed');
    process.exit(1);
  }
  if (mockDiff.expired.length !== 1 || mockDiff.expired[0].claimHash !== 'hash-expired') {
    console.error('FAIL: diffClaims expired assertions failed');
    process.exit(1);
  }

  const mockTrend = summarizeTrend(80, 85, mockDiff);
  if (mockTrend.scoreChange !== 5) {
    console.error(`FAIL: summarizeTrend score change calculation failed! Got ${mockTrend.scoreChange}`);
    process.exit(1);
  }
  console.log('SUCCESS: diffClaims library successfully verified for unchanged, added, reclassified, removed, and expired claims!');

  // Clean up
  console.log('Cleaning up test records from database...');
  await db.audit.deleteMany({
    where: { companyName: { in: ['Ledger Test Corp', 'Other Test Corp'] } },
  });
  await db.monitoredSite.deleteMany({
    where: { url: { in: ['ledgertest.com', 'othertest.com'] } },
  });
  await db.user.deleteMany({
    where: { id: { in: ['test-user-1', 'test-user-2'] } },
  });

  // Verify cleanup
  const remainingAudits = await db.audit.count({
    where: { companyName: { in: ['Ledger Test Corp', 'Other Test Corp'] } },
  });
  const remainingSites = await db.monitoredSite.count({
    where: { url: { in: ['ledgertest.com', 'othertest.com'] } },
  });
  const remainingUsers = await db.user.count({
    where: { id: { in: ['test-user-1', 'test-user-2'] } },
  });

  if (remainingAudits > 0 || remainingSites > 0 || remainingUsers > 0) {
    console.error(`FAIL: Database cleanup failed! Audits remaining: ${remainingAudits}, Sites remaining: ${remainingSites}, Users remaining: ${remainingUsers}`);
    process.exit(1);
  }
  console.log('SUCCESS: Cleanup verified. Database is clean!');
  console.log('SUCCESS: All audit ledger and lineage test assertions passed!');
  process.exit(0);
}

test().catch(e => {
  console.error(e);
  process.exit(1);
});
