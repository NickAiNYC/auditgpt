import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/subscription';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/integrations/list — list the user's connected integrations
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const integrations = await db.integration.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        status: true,
        externalId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ integrations });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 });
  }
}
