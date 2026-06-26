import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/subscription';
import { db } from '@/lib/db';
import Stripe from 'stripe';
import { decryptToken } from '@/lib/token-crypto';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const integration = await db.integration.findUnique({
      where: { userId_provider: { userId, provider: 'stripe' } },
    });

    if (!integration || integration.status !== 'connected' || !integration.accessToken) {
      return NextResponse.json({
        connected: false,
        message: 'Stripe not connected. Visit /api/integrations/stripe/connect to authorize.',
      });
    }

    let accessToken: string;
    try {
      const decrypted = decryptToken(integration.accessToken);
      if (!decrypted) throw new Error('empty after decrypt');
      accessToken = decrypted;
    } catch (decryptErr) {
      console.error('Stripe token decrypt failed:', decryptErr);
      return NextResponse.json(
        {
          connected: false,
          error: 'Stored Stripe credentials could not be read. Please reconnect.',
          code: 'TOKEN_DECRYPT_FAILED',
        },
        { status: 409 }
      );
    }

    const stripe = new Stripe(accessToken, {
      apiVersion: '2025-01-27.acacia' as any,
    });

    const subscriptions = await stripe.subscriptions.list({ status: 'active', limit: 100 });
    const activeCount = subscriptions.data.length;

    let mrrCents = 0;
    for (const sub of subscriptions.data) {
      const item = sub.items.data[0];
      if (item && item.price) {
        const amount = item.price.unit_amount || 0;
        const interval = item.price.recurring?.interval || 'month';
        if (interval === 'year') mrrCents += amount / 12;
        else if (interval === 'month') mrrCents += amount;
        else if (interval === 'week') mrrCents += amount * 4.33;
      }
    }
    const mrr = Math.round(mrrCents / 100);
    const arpu = activeCount > 0 ? Math.round(mrr / activeCount) : 0;

    const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
    const canceledRecently = await stripe.subscriptions.list({
      status: 'canceled',
      created: { gte: thirtyDaysAgo },
      limit: 100,
    });
    const canceledCount = canceledRecently.data.length;
    const totalAtStart = activeCount + canceledCount;
    const monthlyChurnRate = totalAtStart > 0 ? (canceledCount / totalAtStart) * 100 : 0;
    const ltv = monthlyChurnRate > 0 ? Math.round(arpu / (monthlyChurnRate / 100)) : 0;

    const customers = await stripe.customers.list({ limit: 1 });
    const totalCustomers = customers.has_more ? '100+' : customers.data.length;

    const charges = await stripe.charges.list({ limit: 100, created: { gte: thirtyDaysAgo } });
    const revenueLast30d = charges.data.filter((c) => c.paid).reduce((sum, c) => sum + (c.amount || 0), 0);
    const revenue30dDollars = Math.round(revenueLast30d / 100);

    return NextResponse.json({
      connected: true,
      metrics: {
        mrr: `$${mrr}`,
        arpu: `$${arpu}`,
        monthlyChurnRate: `${monthlyChurnRate.toFixed(1)}%`,
        ltv: ltv > 0 ? `$${ltv}` : 'insufficient data',
        activeSubscribers: activeCount,
        totalCustomers,
        revenueLast30d: `$${revenue30dDollars}`,
        ltvCacRatio: 'insufficient data (requires CAC data from ad platforms)',
      },
      pulledAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Stripe metrics error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to pull Stripe metrics' }, { status: 500 });
  }
}
