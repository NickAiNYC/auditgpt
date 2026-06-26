import { createHash } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { db } from './db';

const FREE_HOURLY_LIMIT = 2;
const FREE_DAILY_LIMIT = 5;
const PAID_DAILY_LIMIT = 100;
const GLOBAL_DAILY_BUDGET_CENTS = 5_000;
const ESTIMATED_AUDIT_COST_CENTS = 3;

export interface UsageDecision {
  allowed: boolean;
  code?: 'RATE_LIMITED' | 'EMAIL_REQUIRED' | 'BUDGET_EXHAUSTED';
  retryAfter?: number;
  requiresLogin?: boolean;
}

function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    'unknown';
}

function identityKey(value: string): string {
  const secret = process.env.RATE_LIMIT_SALT;
  if (!secret) throw new Error('RATE_LIMIT_SALT is required');
  return createHash('sha256').update(`${secret}:${value}`).digest('hex');
}

function windowBounds(kind: 'hour' | 'day', now = new Date()): { start: Date; end: Date } {
  const start = new Date(now);
  if (kind === 'hour') {
    start.setUTCMinutes(0, 0, 0);
    return { start, end: new Date(start.getTime() + 60 * 60 * 1000) };
  }
  start.setUTCHours(0, 0, 0, 0);
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
}

async function consumeBucket(params: {
  key: string;
  kind: string;
  limit: number;
  costCents?: number;
}): Promise<{ allowed: boolean; count: number; costCents: number; retryAfter: number }> {
  const cadence = params.kind.includes('hour') ? 'hour' : 'day';
  const { start, end } = windowBounds(cadence);
  const id = `${params.kind}:${params.key}:${start.toISOString()}`;

  return db.$transaction(async (tx) => {
    const existing = await tx.auditUsageBucket.findUnique({ where: { id } });
    const nextCount = (existing?.count || 0) + 1;
    const nextCost = (existing?.estimatedCostCents || 0) + (params.costCents || 0);
    const allowed = params.costCents
      ? nextCost <= params.limit
      : nextCount <= params.limit;

    if (allowed) {
      await tx.auditUsageBucket.upsert({
        where: { id },
        update: { count: { increment: 1 }, estimatedCostCents: { increment: params.costCents || 0 } },
        create: { id, key: params.key, kind: params.kind, count: 1, estimatedCostCents: params.costCents || 0, windowStart: start, windowEnd: end },
      });
    }

    return {
      allowed,
      count: existing?.count || 0,
      costCents: existing?.estimatedCostCents || 0,
      retryAfter: Math.max(1, Math.ceil((end.getTime() - Date.now()) / 1000)),
    };
  });
}

export async function consumeAuditUsage(params: {
  request: NextRequest;
  userId: string | null;
  isPaid: boolean;
}): Promise<UsageDecision> {
  const ipKey = identityKey(clientIp(params.request));

  if (params.isPaid) {
    const paidKey = params.userId ? identityKey(`user:${params.userId}`) : ipKey;
    const paid = await consumeBucket({ key: paidKey, kind: 'paid-day', limit: PAID_DAILY_LIMIT });
    return paid.allowed ? { allowed: true } : { allowed: false, code: 'RATE_LIMITED', retryAfter: paid.retryAfter };
  }

  const hourly = await consumeBucket({ key: ipKey, kind: 'free-hour', limit: FREE_HOURLY_LIMIT });
  if (!hourly.allowed) return { allowed: false, code: 'RATE_LIMITED', retryAfter: hourly.retryAfter };

  const daily = await consumeBucket({ key: ipKey, kind: 'free-day', limit: FREE_DAILY_LIMIT });
  if (!daily.allowed) return { allowed: false, code: 'RATE_LIMITED', retryAfter: daily.retryAfter };

  if (!params.userId && daily.count >= 2) {
    return { allowed: false, code: 'EMAIL_REQUIRED', requiresLogin: true };
  }

  const budget = await consumeBucket({ key: 'global', kind: 'free-budget-day', limit: GLOBAL_DAILY_BUDGET_CENTS, costCents: ESTIMATED_AUDIT_COST_CENTS });
  if (!budget.allowed) return { allowed: false, code: 'BUDGET_EXHAUSTED', retryAfter: budget.retryAfter };

  return { allowed: true };
}
