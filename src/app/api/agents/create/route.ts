import { NextRequest, NextResponse } from 'next/server';
import { getActiveSubscription, getCurrentUserId } from '@/lib/subscription';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// POST /api/agents/create — create a new agent config
export async function POST(req: NextRequest) {
  try {
    const subscription = await getActiveSubscription();
    if (!subscription || subscription.plan !== 'agent') {
      return NextResponse.json(
        { error: 'Agent plan required', code: 'AGENT_PLAN_REQUIRED' },
        { status: 403 }
      );
    }

    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const { type, auditId, config } = body;

    if (!type || !auditId) {
      return NextResponse.json({ error: 'type and auditId are required' }, { status: 400 });
    }

    // Verify the audit belongs to the user (or is public)
    const audit = await db.audit.findUnique({ where: { id: auditId } });
    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }
    if (audit.userId && audit.userId !== userId) {
      return NextResponse.json({ error: 'Not your audit' }, { status: 403 });
    }

    // Limit: Agent tier gets max 3 active agent configs
    const existingCount = await db.agentConfig.count({
      where: { userId, active: true },
    });
    if (existingCount >= 3) {
      return NextResponse.json(
        { error: 'Agent tier allows max 3 active agents. Deactivate one first.' },
        { status: 400 }
      );
    }

    const agentConfig = await db.agentConfig.create({
      data: {
        userId,
        type,
        auditId,
        config: JSON.stringify(config || {}),
        active: true,
      },
    });

    return NextResponse.json(agentConfig);
  } catch (err: any) {
    console.error('Create agent error:', err);
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 });
  }
}
