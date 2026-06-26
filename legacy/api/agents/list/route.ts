import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/subscription';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/agents/list — list the current user's agent configs + recent runs
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const configs = await db.agentConfig.findMany({
      where: { userId },
      include: {
        audit: { select: { companyName: true, publicId: true } },
        runs: {
          orderBy: { createdAt: 'desc' },
          take: 3, // last 3 runs per config
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ configs });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 });
  }
}
