import { db } from '../src/lib/db';
import {
  runStaleMarkSweep,
  STALE_WARNING_AFTER_DAYS,
  STALE_EXPIRED_AFTER_DAYS,
} from '../src/lib/expiry-reaper';
import type { StaleMarkEmailInput } from '../src/lib/email';

const PREFIX = 'stale-mark-test';
const DAY_MS = 24 * 60 * 60 * 1000;

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

async function createAudit(params: { id: string; userId: string; ageDays: number }) {
  return db.audit.create({
    data: {
      id: params.id,
      publicId: `${params.id}-public`,
      path: 'audit',
      companyName: params.id,
      websiteUrl: `https://${params.id}.example.com`,
      auditJson: JSON.stringify({ verdict: 'B' }),
      userId: params.userId,
      createdAt: new Date(Date.now() - params.ageDays * DAY_MS),
    },
  });
}

async function main(): Promise<void> {
  await cleanup();

  const fresh = await db.user.create({ data: { email: `${PREFIX}-fresh@example.com` } });
  const warned = await db.user.create({ data: { email: `${PREFIX}-warned@example.com` } });
  const expired = await db.user.create({ data: { email: `${PREFIX}-expired@example.com` } });
  const guardian = await db.user.create({ data: { email: `${PREFIX}-guardian@example.com` } });
  const multi = await db.user.create({ data: { email: `${PREFIX}-multi@example.com` } });

  await createAudit({ id: `${PREFIX}-fresh-a`, userId: fresh.id, ageDays: 10 });
  await createAudit({ id: `${PREFIX}-warned-a`, userId: warned.id, ageDays: STALE_WARNING_AFTER_DAYS + 1 });
  await createAudit({ id: `${PREFIX}-expired-a`, userId: expired.id, ageDays: STALE_EXPIRED_AFTER_DAYS + 1 });
  await createAudit({ id: `${PREFIX}-guardian-a`, userId: guardian.id, ageDays: STALE_WARNING_AFTER_DAYS + 1 });
  await createAudit({ id: `${PREFIX}-multi-old`, userId: multi.id, ageDays: STALE_WARNING_AFTER_DAYS + 5 });
  await createAudit({ id: `${PREFIX}-multi-new`, userId: multi.id, ageDays: STALE_WARNING_AFTER_DAYS + 1 });

  await db.subscription.create({
    data: {
      userId: guardian.id,
      stripeCustomerId: `${PREFIX}-cus`,
      stripePriceId: 'price_test',
      stripeSubscriptionId: `${PREFIX}-sub`,
      status: 'active',
      plan: 'pro',
      currentPeriodEnd: new Date(Date.now() + 30 * DAY_MS),
    },
  });

  const sent: StaleMarkEmailInput[] = [];
  const mockSend = async (input: StaleMarkEmailInput) => {
    if (input.to.includes('bounce')) throw new Error('simulated bounce');
    sent.push(input);
  };

  // ── Sweep 1 ─────────────────────────────────────────────
  const first = await runStaleMarkSweep({ sendNotification: mockSend });

  const warningEmails = sent.filter((s) => s.stage === 'stale_warning');
  const expiredEmails = sent.filter((s) => s.stage === 'stale_expired');

  assert(!sent.some((s) => s.to.includes('fresh')), 'fresh audit (10d) must not be emailed');
  assert(warningEmails.some((s) => s.to.includes('warned')), '31d audit gets a stale warning');
  assert(expiredEmails.some((s) => s.to.includes('expired')), '46d audit gets an expired notice');
  assert(!sent.some((s) => s.to.includes('guardian')), 'Guardian subscriber must be skipped');
  assert(first.skippedGuardian === 1, `skippedGuardian counted (got ${first.skippedGuardian})`);

  const multiWarnings = warningEmails.filter((s) => s.to.includes('multi'));
  assert(multiWarnings.length === 1, `multi-audit user gets exactly one email (got ${multiWarnings.length})`);
  assert(
    multiWarnings[0].publicId === `${PREFIX}-multi-new-public`,
    'multi-audit user is notified about the newest audit'
  );

  const expiredAudit = await db.audit.findUnique({ where: { id: `${PREFIX}-expired-a` } });
  assert(expiredAudit?.staleClaims === true, '46d audit is marked staleClaims');
  assert(expiredAudit?.staleAt, '46d audit has staleAt set');

  const warnedAudit = await db.audit.findUnique({ where: { id: `${PREFIX}-warned-a` } });
  assert(warnedAudit?.staleClaims === false, '31d audit is NOT yet marked stale');

  // ── Sweep 2 — idempotency ───────────────────────────────
  sent.length = 0;
  const second = await runStaleMarkSweep({ sendNotification: mockSend });
  assert(sent.length === 0, `second sweep sends nothing (got ${sent.length})`);
  assert(second.markedStale === 0, 'second sweep marks nothing new');

  // Notification rows recorded once per (audit, stage)
  const rows = await db.expiryNotification.findMany({
    where: { audit: { companyName: { startsWith: PREFIX } } },
  });
  const keys = rows.map((r) => `${r.auditId}:${r.stage}`);
  assert(new Set(keys).size === keys.length, 'no duplicate (audit, stage) notifications');

  await cleanup();
  console.log('PASS: stale-mark sweep — warning at 30d, expired at 45d, Guardian skip, per-user dedupe, idempotent re-run');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
