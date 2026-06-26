import { Prisma } from '@prisma/client';
import { db } from './db';
import { sendClaimExpiryEmail, type ExpiryEmailInput } from './email';
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
        { expiryNotification: null },
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
          const notification = await db.expiryNotification.create({ data: { auditId: audit.id } });
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
