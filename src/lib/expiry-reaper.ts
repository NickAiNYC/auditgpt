import { Prisma } from '@prisma/client';
import { db } from './db';
import {
  sendClaimExpiryEmail,
  sendStaleMarkEmail,
  type ExpiryEmailInput,
  type StaleMarkEmailInput,
  type StaleMarkStage,
} from './email';
import { getActiveSubscriptionForUser } from './subscription';

export interface ExpiryReaperResult {
  scanned: number;
  markedStale: number;
  notificationsAttempted: number;
  notificationsSent: number;
  rescansQueued: number;
  errors: Array<{ auditId: string; message: string }>;
}

export async function runExpiryReaper(options: {
  now?: Date;
  batchSize?: number;
  sendNotification?: (input: ExpiryEmailInput) => Promise<void>;
} = {}): Promise<ExpiryReaperResult> {
  const now = options.now ?? new Date();
  const sendNotification = options.sendNotification ?? sendClaimExpiryEmail;
  const audits = await db.audit.findMany({
    where: {
      claims: { some: { expiresAt: { lte: now }, supersededAt: null } },
      OR: [
        { staleClaims: false },
        { expiryNotifications: { none: { stage: 'claim_expiry' } } },
        { expiryRescanJob: null },
      ],
    },
    select: {
      id: true,
      publicId: true,
      companyName: true,
      websiteUrl: true,
      userId: true,
      user: { select: { email: true } },
      _count: { select: { claims: { where: { expiresAt: { lte: now }, supersededAt: null } } } },
    },
    take: Math.min(options.batchSize ?? 100, 500),
    orderBy: { createdAt: 'asc' },
  });

  const result: ExpiryReaperResult = {
    scanned: audits.length,
    markedStale: 0,
    notificationsAttempted: 0,
    notificationsSent: 0,
    rescansQueued: 0,
    errors: [],
  };

  for (const audit of audits) {
    try {
      const staleUpdate = await db.audit.updateMany({
        where: { id: audit.id, staleClaims: false },
        data: { staleClaims: true, staleAt: now, verified: false },
      });
      result.markedStale += staleUpdate.count;

      if (audit.userId && audit.websiteUrl) {
        const subscription = await getActiveSubscriptionForUser(audit.userId);
        if (subscription && ['pro', 'agent'].includes(subscription.plan)) {
          try {
            await db.expiryRescanJob.create({
              data: { auditId: audit.id, userId: audit.userId },
            });
            result.rescansQueued += 1;
          } catch (error) {
            if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
          }
        }
      }

      if (audit.user?.email) {
        let notificationId: string | null = null;
        try {
          const notification = await db.expiryNotification.create({
            data: { auditId: audit.id, stage: 'claim_expiry' },
          });
          notificationId = notification.id;
        } catch (error) {
          if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
        }

        if (notificationId) {
          result.notificationsAttempted += 1;
          try {
            await sendNotification({
              to: audit.user.email,
              companyName: audit.companyName || 'Your website',
              publicId: audit.publicId,
              expiredClaimCount: audit._count.claims,
            });
            await db.expiryNotification.update({
              where: { id: notificationId },
              data: { sentAt: new Date() },
            });
            result.notificationsSent += 1;
          } catch (error) {
            await db.expiryNotification.update({
              where: { id: notificationId },
              data: { error: error instanceof Error ? error.message.slice(0, 500) : 'Unknown email error' },
            });
            result.errors.push({ auditId: audit.id, message: 'Expiry email delivery failed' });
          }
        }
      }
    } catch (error) {
      result.errors.push({
        auditId: audit.id,
        message: error instanceof Error ? error.message : 'Unknown reaper error',
      });
    }
  }

  return result;
}

// ──────────────────────────────────────────────────────────────
// Stale-mark sweep — audit-level review aging, independent of
// per-claim expiry. Day 30: warning. Day 45: marked stale.
// One email per (audit, stage), enforced by the unique constraint.
// ──────────────────────────────────────────────────────────────

export const STALE_WARNING_AFTER_DAYS = 30;
export const STALE_EXPIRED_AFTER_DAYS = 45;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface StaleMarkSweepResult {
  warningsAttempted: number;
  warningsSent: number;
  expiredAttempted: number;
  expiredSent: number;
  markedStale: number;
  skippedGuardian: number;
  errors: Array<{ auditId: string; message: string }>;
}

interface SweepAudit {
  id: string;
  publicId: string;
  companyName: string | null;
  websiteUrl: string | null;
  createdAt: Date;
  userId: string | null;
  user: { email: string } | null;
}

export async function runStaleMarkSweep(options: {
  now?: Date;
  batchSize?: number;
  sendNotification?: (input: StaleMarkEmailInput) => Promise<void>;
} = {}): Promise<StaleMarkSweepResult> {
  const now = options.now ?? new Date();
  const send = options.sendNotification ?? sendStaleMarkEmail;
  const batchSize = Math.min(options.batchSize ?? 100, 500);
  const warningCutoff = new Date(now.getTime() - STALE_WARNING_AFTER_DAYS * DAY_MS);
  const expiredCutoff = new Date(now.getTime() - STALE_EXPIRED_AFTER_DAYS * DAY_MS);

  const result: StaleMarkSweepResult = {
    warningsAttempted: 0,
    warningsSent: 0,
    expiredAttempted: 0,
    expiredSent: 0,
    markedStale: 0,
    skippedGuardian: 0,
    errors: [],
  };

  // Guardian/monitoring customers keep a continuously fresh record —
  // never send them churn-prevention aging emails.
  const guardianCache = new Map<string, boolean>();
  const isGuardian = async (userId: string | null): Promise<boolean> => {
    if (!userId) return false;
    if (!guardianCache.has(userId)) {
      const subscription = await getActiveSubscriptionForUser(userId);
      guardianCache.set(userId, !!subscription);
    }
    return guardianCache.get(userId)!;
  };

  const processStage = async (audits: SweepAudit[], stage: StaleMarkStage) => {
    // One email per user per stage per sweep — audits are ordered newest
    // first, so a user with several aging audits hears about the latest one.
    const notifiedUsers = new Set<string>();

    for (const audit of audits) {
      try {
        if (stage === 'stale_expired') {
          const marked = await db.audit.updateMany({
            where: { id: audit.id, staleClaims: false },
            data: { staleClaims: true, staleAt: now, verified: false },
          });
          result.markedStale += marked.count;
        }

        if (!audit.user?.email) continue;
        if (await isGuardian(audit.userId)) {
          result.skippedGuardian += 1;
          continue;
        }

        const alreadyNotified = notifiedUsers.has(audit.user.email);
        let notificationId: string | null = null;
        try {
          const notification = await db.expiryNotification.create({
            data: {
              auditId: audit.id,
              stage,
              ...(alreadyNotified
                ? { error: 'skipped: newer audit for this user was notified' }
                : {}),
            },
          });
          if (alreadyNotified) continue;
          notificationId = notification.id;
        } catch (error) {
          if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
          continue; // already handled in a previous sweep
        }

        const attempted = stage === 'stale_warning' ? 'warningsAttempted' : 'expiredAttempted';
        const sent = stage === 'stale_warning' ? 'warningsSent' : 'expiredSent';
        result[attempted] += 1;
        try {
          await send({
            to: audit.user.email,
            companyName: audit.companyName || audit.websiteUrl || 'Your website',
            publicId: audit.publicId,
            websiteUrl: audit.websiteUrl,
            stage,
            issuedAt: audit.createdAt,
            staleAt: new Date(audit.createdAt.getTime() + STALE_EXPIRED_AFTER_DAYS * DAY_MS),
          });
          await db.expiryNotification.update({
            where: { id: notificationId },
            data: { sentAt: new Date() },
          });
          result[sent] += 1;
          notifiedUsers.add(audit.user.email);
        } catch (error) {
          await db.expiryNotification.update({
            where: { id: notificationId },
            data: { error: error instanceof Error ? error.message.slice(0, 500) : 'Unknown email error' },
          });
          result.errors.push({ auditId: audit.id, message: `${stage} email delivery failed` });
        }
      } catch (error) {
        result.errors.push({
          auditId: audit.id,
          message: error instanceof Error ? error.message : 'Unknown sweep error',
        });
      }
    }
  };

  const baseSelect = {
    id: true,
    publicId: true,
    companyName: true,
    websiteUrl: true,
    createdAt: true,
    userId: true,
    user: { select: { email: true } },
  } as const;

  const warningAudits = await db.audit.findMany({
    where: {
      createdAt: { lte: warningCutoff, gt: expiredCutoff },
      userId: { not: null },
      expiryNotifications: { none: { stage: 'stale_warning' } },
    },
    select: baseSelect,
    take: batchSize,
    orderBy: { createdAt: 'desc' },
  });
  await processStage(warningAudits, 'stale_warning');

  const expiredAudits = await db.audit.findMany({
    where: {
      createdAt: { lte: expiredCutoff },
      expiryNotifications: { none: { stage: 'stale_expired' } },
    },
    select: baseSelect,
    take: batchSize,
    orderBy: { createdAt: 'desc' },
  });
  await processStage(expiredAudits, 'stale_expired');

  return result;
}
