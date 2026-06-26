import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { encryptToken } from '@/lib/token-crypto';
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

  const stateResult = await consumeOAuthState(state, 'github');
  if (!stateResult.valid || !stateResult.userId) {
    return NextResponse.redirect(`${appUrl}/?integration_error=invalid_or_expired_state`);
  }
  const userId = stateResult.userId;

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${appUrl}/?integration_error=github_not_configured`);
    }

    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.redirect(`${appUrl}/?integration_error=token_exchange_failed`);
    }

    // Fetch GitHub user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser = await userRes.json();
    const githubUserId = String(githubUser.id);
    const githubUsername = githubUser.login;

    // Fetch the user's repos to suggest one
    const reposRes = await fetch('https://api.github.com/user/repos?per_page=5&sort=pushed', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const repos = await reposRes.json();
    const primaryRepo = repos[0]?.full_name || null;

    // Store encrypted token in existing Integration model
    const encrypted = encryptToken(accessToken);

    await db.integration.upsert({
      where: { userId_provider: { userId, provider: 'github' } },
      create: {
        userId,
        provider: 'github',
        status: 'connected',
        accessToken: encrypted,
        externalId: githubUserId,
        metadata: JSON.stringify({
          githubUsername,
          repositoryFullName: primaryRepo,
          defaultBranch: 'main',
        }),
      },
      update: {
        status: 'connected',
        accessToken: encrypted,
        externalId: githubUserId,
        metadata: JSON.stringify({
          githubUsername,
          repositoryFullName: primaryRepo,
          defaultBranch: 'main',
        }),
      },
    });

    return NextResponse.redirect(`${appUrl}/?integration_success=github`);
  } catch (err: any) {
    console.error('GitHub callback error:', err);
    return NextResponse.redirect(`${appUrl}/?integration_error=${encodeURIComponent(err?.message || 'unknown')}`);
  }
}
