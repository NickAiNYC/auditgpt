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

    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { error: 'GITHUB_CLIENT_ID not configured.' },
        { status: 500 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const redirectUri = `${appUrl}/api/integrations/github/callback`;

    cleanupExpiredOAuthStates();
    const state = await issueOAuthState(userId, 'github');

    const scope = 'repo'; // full repo access for creating branches + PRs
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`;

    return NextResponse.redirect(githubAuthUrl);
  } catch (err: any) {
    console.error('GitHub connect error:', err);
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 });
  }
}
