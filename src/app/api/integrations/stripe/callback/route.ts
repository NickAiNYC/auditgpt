import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Stripe from 'stripe';
import { encryptTokenPair } from '@/lib/token-crypto';
import { consumeOAuthState } from '@/lib/oauth-state';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  if (error) {
    return NextResponse.redirect(`${appUrl}/?integration_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/?integration_error=missing_code_or_state`);
  }

  const stateResult = await consumeOAuthState(state, 'stripe');
  if (!stateResult.valid || !stateResult.userId) {
    return NextResponse.redirect(`${appUrl}/?integration_error=invalid_or_expired_state`);
  }
  const userId = stateResult.userId;

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.redirect(`${appUrl}/?integration_error=stripe_not_configured`);
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-01-27' as Stripe.LatestApiVersion,
    });

    const tokenResponse = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    const accessToken = tokenResponse.access_token;
    const refreshToken = tokenResponse.refresh_token;
    const stripeUserId = tokenResponse.stripe_user_id;

    if (!accessToken || !stripeUserId) {
      return NextResponse.redirect(`${appUrl}/?integration_error=token_exchange_failed`);
    }

    const encrypted = encryptTokenPair({ accessToken, refreshToken });

    await db.integration.upsert({
      where: { userId_provider: { userId, provider: 'stripe' } },
      create: {
        userId,
        provider: 'stripe',
        status: 'connected',
        accessToken: encrypted.accessToken,
        refreshToken: encrypted.refreshToken,
        externalId: stripeUserId,
        metadata: JSON.stringify({ scope: tokenResponse.scope || 'read_only' }),
      },
      update: {
        status: 'connected',
        accessToken: encrypted.accessToken,
        refreshToken: encrypted.refreshToken,
        externalId: stripeUserId,
        metadata: JSON.stringify({ scope: tokenResponse.scope || 'read_only' }),
      },
    });

    return NextResponse.redirect(`${appUrl}/?integration_success=stripe`);
  } catch (err: any) {
    console.error('Stripe callback error:', err);
    return NextResponse.redirect(`${appUrl}/?integration_error=${encodeURIComponent(err?.message || 'unknown')}`);
  }
}
