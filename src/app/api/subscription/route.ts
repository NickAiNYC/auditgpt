import { NextResponse } from 'next/server';
import { getActiveSubscription } from '@/lib/subscription';

export const runtime = 'nodejs';

// Returns the current user's subscription status (or null if no active sub).
export async function GET() {
  const sub = await getActiveSubscription();
  if (!sub) {
    return NextResponse.json({ subscribed: false, plan: null });
  }
  return NextResponse.json({
    subscribed: true,
    plan: sub.plan,
    status: sub.status,
    currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
  });
}
