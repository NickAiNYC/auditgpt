import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserId } from '@/lib/subscription';
import { runMonitorScan } from '@/lib/audit/claim-monitor';

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return NextResponse.json({ error: 'subscriptionId is required' }, { status: 400 });
    }

    // Verify ownership
    const subscription = await db.monitorSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || subscription.userId !== userId) {
      return NextResponse.json({ error: 'Subscription not found or unauthorized' }, { status: 404 });
    }

    const deltaReportId = await runMonitorScan(subscriptionId);

    const deltaReport = await db.monitorDeltaReport.findUnique({
      where: { id: deltaReportId }
    });

    return NextResponse.json({ success: true, deltaReport });
  } catch (error) {
    console.error('Failed to run manual monitor scan:', error);
    return NextResponse.json({ error: 'Failed to run scan' }, { status: 500 });
  }
}
