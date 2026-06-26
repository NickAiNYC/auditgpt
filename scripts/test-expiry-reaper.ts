import { db } from '../src/lib/db';
import { runExpiryReaper } from '../src/lib/expiry-reaper';
import type { ExpiryEmailInput } from '../src/lib/email';

const PREFIX = 'expiry-reaper-test';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

async function cleanup(): Promise<void> {
  const users = await db.user.findMany({ where: { email: { startsWith: PREFIX } }, select: { id: true } });
  const userIds = users.map((user) => user.id);
  if (userIds.length) {
    await db.audit.deleteMany({ where: { userId: { in: userIds } } });
    await db.subscription.deleteMany({ where: { userId: { in: userIds } } });
    await db.user.deleteMany({ where: { id: { in: userIds } } });
  }
}

async function createAudit(params: {
  id: string;
  userId: string;
  expiresAt: Date;
  staleClaims?: boolean;
}) {
  return db.audit.create({
    data: {
      id: params.id,
      publicId: `${params.id}-public`,
      path: 'grow',
      companyName: params.id,
      websiteUrl: `https://${params.id}.example.com`,
      auditJson: JSON.stringify({ verdict: 'B', score: 80 }),
      verdict: 'B',
      score: 80,
      verified: true,
      staleClaims: params.staleClaims ?? false,
      userId: params.userId,
      claims: {
        create: {
          claimHash: `${params.id}-hash`,
          claimText: `${params.id} assertion`,
          claimType: 'site_observation',
          status: 'observed',
          severity: 'info',
          sourceKind: 'website',
          section: 'report_card',
          position: 0,
          ruleVersion: 'audit-ledger-v1',
          crawledAt: new Date('2026-01-01T00:00:00.000Z'),
          expiresAt: params.expiresAt,
        },
      },
    },
  });
}

async function main(): Promise<void> {
  await cleanup();
  const now = new Date('2026-06-20T12:00:00.000Z');
  const expiredAt = new Date('2026-06-19T12:00:00.000Z');
  const futureAt = new Date('2026-09-20T12:00:00.000Z');

  try {
    const pro = await db.user.create({ data: { id: `${PREFIX}-pro`, email: `${PREFIX}-pro@example.com` } });
    const free = await db.user.create({ data: { id: `${PREFIX}-free`, email: `${PREFIX}-free@example.com` } });
    await db.subscription.create({
      data: {
        userId: pro.id,
        stripeCustomerId: `${PREFIX}-customer`,
        stripePriceId: `${PREFIX}-price`,
        stripeSubscriptionId: `${PREFIX}-subscription`,
        status: 'active',
        plan: 'pro',
        currentPeriodEnd: new Date('2027-01-01T00:00:00.000Z'),
      },
    });

    const proExpired = await createAudit({ id: `${PREFIX}-pro-expired`, userId: pro.id, expiresAt: expiredAt });
    const freeExpired = await createAudit({ id: `${PREFIX}-free-expired`, userId: free.id, expiresAt: expiredAt });
    const future = await createAudit({ id: `${PREFIX}-future`, userId: pro.id, expiresAt: futureAt });
    const notified = await createAudit({ id: `${PREFIX}-notified`, userId: free.id, expiresAt: expiredAt, staleClaims: true });
    await db.expiryNotification.create({ data: { auditId: notified.id, sentAt: new Date('2026-06-19T13:00:00.000Z') } });

    const sent: string[] = [];
    const sendNotification = async ({ publicId }: ExpiryEmailInput) => { sent.push(publicId); };
    const first = await runExpiryReaper({ now, sendNotification });
    assert(first.markedStale === 2, `expected 2 newly stale audits, got ${first.markedStale}`);
    assert(first.notificationsSent === 2, `expected 2 notifications, got ${first.notificationsSent}`);
    assert(first.rescansQueued === 1, `expected 1 Pro rescan, got ${first.rescansQueued}`);
    assert(sent.length === 2, `expected 2 email calls, got ${sent.length}`);

    const [proAfter, freeAfter, futureAfter, notifiedAfter] = await Promise.all([
      db.audit.findUniqueOrThrow({ where: { id: proExpired.id }, include: { claims: true } }),
      db.audit.findUniqueOrThrow({ where: { id: freeExpired.id }, include: { claims: true } }),
      db.audit.findUniqueOrThrow({ where: { id: future.id }, include: { claims: true } }),
      db.audit.findUniqueOrThrow({ where: { id: notified.id } }),
    ]);
    assert(proAfter.staleClaims && freeAfter.staleClaims, 'expired audits must be stale');
    assert(!futureAfter.staleClaims, 'future audit must remain active');
    assert(notifiedAfter.staleClaims, 'already-notified audit must remain stale');
    assert(proAfter.claims[0].status === 'observed', 'expiration must not mutate claim status');
    assert(proAfter.claims[0].supersededAt === null, 'expiration must not supersede the claim');

    const jobs = await db.expiryRescanJob.findMany({ where: { auditId: { in: [proExpired.id, freeExpired.id, future.id, notified.id] } } });
    assert(jobs.length === 1 && jobs[0].auditId === proExpired.id, 'only the expired Pro audit should queue a rescan');

    const second = await runExpiryReaper({ now, sendNotification });
    assert(second.markedStale === 0, 'second run must not remark audits stale');
    assert(second.notificationsSent === 0, 'second run must not send duplicate notifications');
    assert(second.rescansQueued === 0, 'second run must not queue duplicate rescans');
    assert(sent.length === 2, 'notification sender must be called exactly once per newly expired audit');

    console.log('Expiry reaper assertions passed.');
  } finally {
    await cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
