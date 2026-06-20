import crypto from 'crypto';

// ============================================================
// Encrypt-before-write / decrypt-on-read for Integration token fields.
//
// Why this exists: Integration.accessToken / refreshToken hold live
// third-party credentials (Stripe OAuth tokens today, possibly Google
// Analytics or others later). Storing these as plaintext columns means
// a leaked or copied SQLite file hands over live access to every
// connected account. This wrapper makes that data unreadable without
// the server's encryption key, separately from the DB itself.
//
// Algorithm: AES-256-GCM (authenticated encryption — tampering with
// ciphertext is detected, not just attempted decryption).
// Each value gets a fresh random IV. Output format is a single string
// so it drops into the existing `String?` Prisma columns with no
// schema change required:
//
//   v1:<iv_base64>:<authTag_base64>:<ciphertext_base64>
//
// The "v1:" prefix exists so a future algorithm/key change can be
// detected and migrated instead of silently mis-decrypting.
// ============================================================

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // recommended for GCM
const FORMAT_PREFIX = 'v1';

function getKey(): Buffer {
  const secret = process.env.TOKEN_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error(
      'TOKEN_ENCRYPTION_KEY is not set. Generate one with: openssl rand -hex 32'
    );
  }
  if (!/^[0-9a-fA-F]{64}$/.test(secret)) {
    throw new Error(
      'TOKEN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes). Generate one with: openssl rand -hex 32'
    );
  }
  return Buffer.from(secret, 'hex');
}

export function encryptToken(plaintext: string | null | undefined): string | null {
  if (plaintext == null || plaintext === '') return null;

  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    FORMAT_PREFIX,
    iv.toString('base64'),
    authTag.toString('base64'),
    ciphertext.toString('base64'),
  ].join(':');
}

export function decryptToken(stored: string | null | undefined): string | null {
  if (stored == null || stored === '') return null;

  const parts = stored.split(':');
  if (parts.length !== 4 || parts[0] !== FORMAT_PREFIX) {
    throw new Error('Stored token is not in the expected encrypted format.');
  }
  const [, ivB64, authTagB64, ciphertextB64] = parts;

  const key = getKey();
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const ciphertext = Buffer.from(ciphertextB64, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plaintext.toString('utf8');
}

export function encryptTokenPair(params: {
  accessToken?: string | null;
  refreshToken?: string | null;
}): { accessToken: string | null; refreshToken: string | null } {
  return {
    accessToken: encryptToken(params.accessToken),
    refreshToken: encryptToken(params.refreshToken),
  };
}
