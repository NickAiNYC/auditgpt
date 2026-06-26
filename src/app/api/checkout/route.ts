import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import Stripe from 'stripe';

export const runtime = 'nodejs';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Stripe checkout is not configured. Set STRIPE_SECRET_KEY before accepting paid audits.');
  }
  return new Stripe(key, {
    apiVersion: '2025-01-27.acacia' as any,
  });
}

interface CheckoutBody {
  priceId: string;
  plan: string;      // 'pro' | 'agent' | 'one-time'
  mode?: string;     // 'subscription' | 'payment' — defaults to subscription
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as CheckoutBody;
    if (!body.priceId || !body.plan) {
      return NextResponse.json({ error: 'priceId and plan are required' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe checkout is not configured in this environment.' },
        { status: 503 },
      );
    }

    const stripe = getStripe();
    const user = session.user;
    const isSubscription = body.mode !== 'payment';

    // Look up or create the Stripe customer
    let customerId: string | undefined;
    const existingSub = await db.subscription.findFirst({
      where: { userId: user.id },
      select: { stripeCustomerId: true },
    });
    customerId = existingSub?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
    }

    const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      line_items: [{ price: body.priceId, quantity: 1 }],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}&checkout=success&plan=${encodeURIComponent(body.plan)}`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
      metadata: { userId: user.id, plan: body.plan },
    };

    // For subscriptions, attach subscription_data metadata
    if (isSubscription) {
      checkoutParams.subscription_data = {
        metadata: { userId: user.id, plan: body.plan },
      };
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err?.message || 'Checkout failed' },
      { status: 500 },
    );
  }
}
