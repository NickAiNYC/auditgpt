import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentUserId } from '@/lib/subscription';
import { Button } from '@/components/ui/button';
import { Target, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MonitoringDashboard() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect('/login');
  }

  const subscriptions = await db.monitorSubscription.findMany({
    where: { userId },
    include: {
      deltas: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col font-sans">
      <header className="border-b border-stone-200/50 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo variant="full" height={28} />
          </Link>
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-stone-500">
            Monitoring Dashboard
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-stone-900">Claim Monitoring</h1>
            <p className="mt-2 text-stone-500">Ongoing drift detection and AI visibility tracking.</p>
          </div>
          <Button asChild className="bg-stone-900 text-white hover:bg-stone-800">
            <Link href="/snapshot">Add Site</Link>
          </Button>
        </div>

        {subscriptions.length === 0 ? (
          <div className="border border-stone-200 rounded-xl bg-white p-12 text-center shadow-sm">
            <Target className="h-10 w-10 text-stone-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-stone-900">No active monitors</h2>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              You are not monitoring any domains for claim drift. Run a snapshot and upgrade to ongoing monitoring to secure your claims.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/snapshot">Run initial snapshot</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((sub) => {
              const latestDelta = sub.deltas[0];
              const isStable = latestDelta && latestDelta.riskScoreDelta <= 0 && latestDelta.newClaimsCount === 0;

              return (
                <div key={sub.id} className="border border-stone-200 rounded-xl bg-white p-6 sm:p-8 shadow-sm">
                  <div className="flex items-start justify-between flex-wrap gap-4 border-b border-stone-100 pb-6 mb-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-serif">{sub.url}</h2>
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] uppercase tracking-wider font-mono rounded">
                          {sub.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-stone-500 font-mono">
                        Frequency: {sub.frequency} • Last run: {sub.lastRun ? sub.lastRun.toLocaleDateString() : 'Pending'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Run Manual Scan
                    </Button>
                  </div>

                  {latestDelta ? (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {isStable ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <ShieldAlert className="h-5 w-5 text-amber-600" />
                        )}
                        <h3 className="font-medium text-stone-900">
                          {isStable ? 'Claims stable since last scan.' : 'Drift detected. Review delta report.'}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#faf9f8] p-4 rounded-lg">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500">Risk Delta</p>
                          <p className="text-2xl font-serif mt-1">{latestDelta.riskScoreDelta > 0 ? '+' : ''}{latestDelta.riskScoreDelta}</p>
                        </div>
                        <div className="bg-[#faf9f8] p-4 rounded-lg">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500">New Claims</p>
                          <p className="text-2xl font-serif mt-1">{latestDelta.newClaimsCount}</p>
                        </div>
                        <div className="bg-[#faf9f8] p-4 rounded-lg">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500">Changed</p>
                          <p className="text-2xl font-serif mt-1">{latestDelta.changedClaimsCount}</p>
                        </div>
                        <div className="bg-[#faf9f8] p-4 rounded-lg">
                          <Button variant="ghost" className="w-full h-full" asChild>
                            <Link href={`/audit/${latestDelta.currentAuditId}`}>View Report →</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-stone-500 text-sm">
                      <Activity className="h-4 w-4 animate-pulse" />
                      Waiting for first scan to complete...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
