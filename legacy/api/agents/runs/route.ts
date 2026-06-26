import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/subscription';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/agents/runs?configId=xxx — list runs for a specific agent config
export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const url = new URL(req.url);
    const configId = url.searchParams.get('configId');

    const where: any = { userId };
    if (configId) where.agentConfigId = configId;

    const runs = await db.agentRun.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { agentConfig: { select: { type: true, audit: { select: { companyName: true } } } } },
    });

    return NextResponse.json({ runs });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 });
  }
}
