import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/subscription';
import { db } from '@/lib/db';
import { decryptToken } from '@/lib/token-crypto';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const url = new URL(req.url);
    const provider = url.searchParams.get('provider');
    if (!provider) {
      return NextResponse.json({ error: 'provider required' }, { status: 400 });
    }

    if (provider === 'stripe') {
      const existing = await db.integration.findUnique({
        where: { userId_provider: { userId, provider: 'stripe' } },
      });
      if (existing?.accessToken) {
        try {
          const token = decryptToken(existing.accessToken);
          const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
          const clientId = process.env.STRIPE_CLIENT_ID;
          if (token && stripeSecretKey && clientId) {
            const stripe = new Stripe(stripeSecretKey, {
              apiVersion: '2025-01-27' as Stripe.LatestApiVersion,
            });
            await stripe.oauth.deauthorize({
              client_id: clientId,
              stripe_user_id: existing.externalId || undefined,
            });
          }
        } catch (deauthErr) {
          // Log but don't block local disconnect — a Stripe-side failure
          // (network blip, already-revoked token) shouldn't trap the user
          // in a "connected" state they can't exit.
          console.error('Stripe deauthorize failed (continuing with local disconnect):', deauthErr);
        }
      }
    }

    await db.integration.updateMany({
      where: { userId, provider },
      data: { status: 'disconnected', accessToken: null, refreshToken: null },
    });

    return NextResponse.json({ success: true, provider });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 });
  }
}
