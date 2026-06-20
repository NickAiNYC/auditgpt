import crypto from 'crypto';
import { db } from './db';

// ============================================================
// Signed, single-use, short-lived state tokens for OAuth flows.
//
// Replaces the old pattern of `state = "${userId}:${Date.now()}"`, which
// was unsigned and predictable: anyone could construct a valid-looking
// state for an arbitrary userId and drive the callback themselves,
// binding a victim's external account to an attacker's session (or the
// reverse), since the callback trusted whatever userId it found in the
// string.
// ============================================================

const TOKEN_BYTES = 32;
const TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function issueOAuthState(userId: string, provider: string): Promise<string> {
  const token = crypto.randomBytes(TOKEN_BYTES).toString('base64url');
  await db.oAuthState.create({
    data: {
      token,
      userId,
      provider,
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });
  return token;
}

export interface ConsumeResult {
  valid: boolean;
  userId: string | null;
  reason?: 'not_found' | 'expired' | 'provider_mismatch';
}

export async function consumeOAuthState(
  token: string | null,
  expectedProvider: string
): Promise<ConsumeResult> {
  if (!token) return { valid: false, userId: null, reason: 'not_found' };

  const row = await db.oAuthState.findUnique({ where: { token } });

  if (row) {
    await db.oAuthState.delete({ where: { token } }).catch(() => {});
  }

  if (!row) return { valid: false, userId: null, reason: 'not_found' };
  if (row.provider !== expectedProvider) {
    return { valid: false, userId: null, reason: 'provider_mismatch' };
  }
  if (row.expiresAt.getTime() < Date.now()) {
    return { valid: false, userId: null, reason: 'expired' };
  }

  return { valid: true, userId: row.userId };
}

export async function cleanupExpiredOAuthStates(): Promise<void> {
  await db.oAuthState.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  }).catch(() => {});
}
