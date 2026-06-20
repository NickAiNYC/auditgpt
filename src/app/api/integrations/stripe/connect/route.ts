import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/subscription';
import { db } from '@/lib/db';
import { issueOAuthState, cleanupExpiredOAuthStates } from '@/lib/oauth-state';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const clientId = process.env.STRIPE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { error: 'STRIPE_CLIENT_ID not configured. Set it in your Stripe Dashboard → Connect settings.' },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const redirectUri = `${appUrl}/api/integrations/stripe/callback`;
    const scope = 'read_only';

    cleanupExpiredOAuthStates();
    const state = await issueOAuthState(userId, 'stripe');

    const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`;

    return NextResponse.redirect(stripeAuthUrl);
  } catch (err: any) {
    console.error('Stripe connect error:', err);
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 });
  }
}
