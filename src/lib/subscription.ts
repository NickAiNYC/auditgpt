import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { db } from './db';

export interface ActiveSubscription {
  id: string;
  plan: 'agency' | 'starter' | 'full' | 'pro' | 'agent';
  status: string;
  currentPeriodEnd: Date;
  stripeCustomerId: string;
}

// Returns the user's active subscription, or null if not subscribed / not logged in.
export async function getActiveSubscription(): Promise<ActiveSubscription | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const subscription = await db.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ['active', 'trialing'] },
    },
    orderBy: { currentPeriodEnd: 'desc' },
  });

  if (!subscription) return null;
  return {
    id: subscription.id,
    plan: subscription.plan as ActiveSubscription['plan'],
    status: subscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd,
    stripeCustomerId: subscription.stripeCustomerId,
  };
}

// Returns the active subscription for a specific userId (session-free).
// Use this from cron jobs, webhooks, and other non-request contexts.
export async function getActiveSubscriptionForUser(userId: string): Promise<ActiveSubscription | null> {
  const subscription = await db.subscription.findFirst({
    where: {
      userId,
      status: { in: ['active', 'trialing'] },
    },
    orderBy: { currentPeriodEnd: 'desc' },
  });

  if (!subscription) return null;
  return {
    id: subscription.id,
    plan: subscription.plan as ActiveSubscription['plan'],
    status: subscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd,
    stripeCustomerId: subscription.stripeCustomerId,
  };
}

export async function hasActiveSubscription(): Promise<boolean> {
  const sub = await getActiveSubscription();
  return !!sub;
}

// Returns the logged-in user's id, or null.
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}
