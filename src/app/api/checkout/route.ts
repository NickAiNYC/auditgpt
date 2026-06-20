import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import Stripe from 'stripe';

export const runtime = 'nodejs';

// Lazily instantiate Stripe so the route doesn't crash on boot if the env var is missing.
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY env var is not set');
  }
  return new Stripe(key, {
    apiVersion: '2025-01-27' as Stripe.LatestApiVersion,
  });
}

interface CheckoutBody {
  priceId: string;
  plan: 'pro' | 'agent';
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

    const stripe = getStripe();
    const user = session.user;

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
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: body.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}&upgraded=1`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
      metadata: { userId: user.id, plan: body.plan },
      subscription_data: { metadata: { userId: user.id, plan: body.plan } },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err?.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
