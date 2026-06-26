import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getActiveSubscription } from '@/lib/subscription';

export const runtime = 'nodejs';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY env var is not set');
  return new Stripe(key, {
    apiVersion: '2025-01-27.acacia' as any,
  });
}

export async function POST() {
  try {
    const subscription = await getActiveSubscription();
    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${appUrl}/`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error('Portal session error:', err);
    return NextResponse.json(
      { error: err?.message || 'Portal session failed' },
      { status: 500 }
    );
  }
}
