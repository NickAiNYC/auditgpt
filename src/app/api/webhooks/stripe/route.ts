import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY env var is not set');
  return new Stripe(key, {
    apiVersion: '2025-01-27' as Stripe.LatestApiVersion,
  });
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET env var is not set' },
      { status: 500 }
    );
  }

  const body = await req.text();
  const sig = (await headers()).get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        if (userId && plan && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const priceId = subscription.items.data[0]?.price?.id || '';
          await db.subscription.create({
            data: {
              userId,
              stripeCustomerId: session.customer as string,
              stripePriceId: priceId,
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              plan,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          const existing = await db.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
          });
          if (existing) {
            await db.subscription.update({
              where: { id: existing.id },
              data: {
                status: subscription.status,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
            });
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const existing = await db.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (existing) {
          await db.subscription.update({
            where: { id: existing.id },
            data: {
              status: 'canceled',
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }
      default:
        // Unhandled event types are fine - we don't need to handle every one.
        break;
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
