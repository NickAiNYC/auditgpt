import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { runMonitorScan } from '@/lib/audit/claim-monitor';

export async function GET(req: Request) {
  // Verify Vercel Cron Secret
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[Cron] Starting daily claim monitoring scan');
    const activeSubscriptions = await db.monitorSubscription.findMany({
      where: {
        status: 'active',
        // In a real system, we would filter by frequency and lastRun
        // For v1, we run daily cron that processes all active ones
      }
    });

    console.log(`[Cron] Found ${activeSubscriptions.length} active subscriptions`);

    const results: Array<{
      subscriptionId: string;
      success: boolean;
      deltaReportId?: string;
      error?: string;
    }> = [];
    for (const sub of activeSubscriptions) {
      try {
        const deltaReportId = await runMonitorScan(sub.id);
        results.push({ subscriptionId: sub.id, success: true, deltaReportId });
      } catch (err) {
        console.error(`[Cron] Failed to scan subscription ${sub.id}:`, err);
        results.push({ subscriptionId: sub.id, success: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    return NextResponse.json({ success: true, processed: activeSubscriptions.length, results });
  } catch (error) {
    console.error('[Cron] Monitoring sweep failed:', error);
    return NextResponse.json({ error: 'Cron sweep failed' }, { status: 500 });
  }
}
