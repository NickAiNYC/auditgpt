import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { domain: string } }
) {
  try {
    const domain = params.domain;

    // Fetch the latest lifecycle events for the domain
    const lifecycleEvents = await db.$queryRawUnsafe<any[]>(
      `SELECT
         c.claimHash,
         c.eventType,
         c.observedAt,
         c.pageSnapshotHash,
         c.aiSurface,
         cs.normalizedClaimText,
         cs.supportState,
         cs.discrepancyType,
         cs.severity,
         o.resolvedUrl
       FROM ClaimLifecycleEvent c
       LEFT JOIN ClaimState cs ON c.priorStateHash = cs.stateHash OR (c.eventType = 'FIRST_OBSERVED' AND cs.observationId = c.observationId)
       LEFT JOIN Observation o ON c.observationId = o.id
       WHERE c.domain = ?
         AND c.aiSurface NOT IN ('guardian-simulation', 'SIMULATED_NO_PROVIDER_CALL')
       ORDER BY c.observedAt DESC
       LIMIT 100`,
      domain
    );

    // Organize into a bundle
    const caseFile = {
      domain,
      generatedAt: new Date().toISOString(),
      metadata: {
        totalEvents: lifecycleEvents.length,
        firstObserved: lifecycleEvents.length > 0 ? lifecycleEvents[lifecycleEvents.length - 1].observedAt : null,
        lastObserved: lifecycleEvents.length > 0 ? lifecycleEvents[0].observedAt : null,
      },
      evidenceArchive: lifecycleEvents.map((evt) => ({
        claimHash: evt.claimHash,
        claimText: evt.normalizedClaimText,
        eventType: evt.eventType,
        observedAt: evt.observedAt,
        snapshotHash: evt.pageSnapshotHash,
        sourceUrl: evt.resolvedUrl,
        analysis: {
          supportState: evt.supportState,
          discrepancyType: evt.discrepancyType,
          severity: evt.severity,
        },
        aiSurface: evt.aiSurface,
      })),
    };

    return NextResponse.json(caseFile);
  } catch (error) {
    console.error(`[CaseFile API] Error generating CaseFile for ${params.domain}:`, error);
    return NextResponse.json(
      { error: 'Failed to generate CaseFile' },
      { status: 500 }
    );
  }
}
