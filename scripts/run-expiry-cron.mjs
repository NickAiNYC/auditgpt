import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

if (existsSync(resolve(process.cwd(), '.env'))) {
  for (const key of ['NEXT_PUBLIC_URL', 'CRON_SECRET']) {
    if (process.env[key]) continue;
    const match = readFileSync(resolve(process.cwd(), '.env'), 'utf8').match(new RegExp(`^${key}\\s*=\\s*(.+)$`, 'm'));
    if (match) process.env[key] = match[1].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
}

const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const secret = process.env.CRON_SECRET;
if (!secret) throw new Error('CRON_SECRET is required');

const response = await fetch(`${baseUrl}/api/cron/expire-claims`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${secret}` },
});
const body = await response.text();
console.log(body);
if (!response.ok && response.status !== 207) process.exit(1);
