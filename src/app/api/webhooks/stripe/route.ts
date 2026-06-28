import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY env var is not set');
  return new Stripe(key, {
    apiVersion: '2025-01-27.acacia' as any,
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
        const metadata = session.metadata || {};
        const userId = metadata.userId;
        const plan = metadata.plan;
        const product = metadata.product;

        // ── Claim Intelligence Report (one-time paid audit unlock) ──
        if (product === 'claim_intelligence_report' && metadata.publicId) {
          const publicId = metadata.publicId;
          // Idempotent: check if already marked paid
          const existing = await db.audit.findUnique({ where: { publicId } });
          if (existing && !existing.paidAt) {
            await db.audit.update({
              where: { publicId },
              data: {
                paidAt: new Date(),
                stripeSessionId: session.id,
                auditType: 'full',
              },
            });
            console.log(`[WEBHOOK] Unlocked audit ${publicId} via session ${session.id}`);
          } else if (existing?.paidAt) {
            console.log(`[WEBHOOK] Idempotent skip: audit ${publicId} already paid`);
          }
          break;
        }

        // ── Legacy: one-time payment linked to user integration ──
        if (userId && plan) {
          if (session.mode === 'payment') {
            await db.integration.upsert({
              where: { userId_provider: { userId, provider: 'one_time_audit' } },
              create: {
                userId,
                provider: 'one_time_audit',
                status: 'paid',
                metadata: JSON.stringify({
                  plan,
                  product,
                  stripeSessionId: session.id,
                  paidAt: new Date().toISOString(),
                }),
              },
              update: {
                status: 'paid',
                metadata: JSON.stringify({
                  plan,
                  product,
                  stripeSessionId: session.id,
                  paidAt: new Date().toISOString(),
                }),
              },
            });

            // Also try to match by websiteUrl if available
            if (metadata.websiteUrl) {
              const { persistAudit } = await import('@/lib/audit-persistence');
              const { fallbackAuditResult } = await import('@/lib/audit-pipeline');
              const audit = await db.audit.findFirst({
                where: { websiteUrl: metadata.websiteUrl, paidAt: null },
                orderBy: { createdAt: 'desc' },
              });
              if (audit) {
                await db.audit.update({
                  where: { id: audit.id },
                  data: { paidAt: new Date(), stripeSessionId: session.id },
                });
              } else {
                // Create a pending audit record for manual fulfillment
                await persistAudit({
                  auditType: 'full',
                  path: 'paid_intake',
                  companyName: metadata.companyName || null,
                  websiteUrl: metadata.websiteUrl,
                  industry: metadata.industry || null,
                  focusNotes: 'Paid audit checkout completed; audit intake pending.',
                  auditJson: fallbackAuditResult({
                    companyName: metadata.companyName || 'Paid audit',
                    websiteUrl: metadata.websiteUrl,
                    reason: 'Stripe checkout completed before audit intake was submitted.',
                  }),
                  userId,
                });
              }
            }
          } else if (session.subscription) {
            // ── Subscription (monitoring / agency) ──
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
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
              },
            });
          }
        }
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if ((invoice as any).subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            (invoice as any).subscription as string
          );
          const existing = await db.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
          });
          if (existing) {
            await db.subscription.update({
              where: { id: existing.id },
              data: {
                status: subscription.status,
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
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
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
