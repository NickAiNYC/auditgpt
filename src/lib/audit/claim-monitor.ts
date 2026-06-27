import { db } from '../db';
import { runAuditPipeline } from '../audit-pipeline';
import { persistAudit } from '../audit-persistence';
import type { AuditResult, Claim } from '../audit-schema';
import { generateSimulation } from './ai-claim-readability';

const monitoringDb = db as typeof db & {
  monitorSubscription: any;
  monitorDeltaReport: any;
};

export interface MonitorDeltaResult {
  newClaimsCount: number;
  changedClaimsCount: number;
  resolvedClaimsCount: number;
  riskScoreDelta: number;
  newEvidenceGaps: number;
  aiVisibilityDelta: string; // Brief summary of visibility shift
  newClaims: Array<{ claim: string; status: string; priority: string }>;
  changedClaims: Array<{ claim: string; from: string; to: string }>;
  resolvedClaims: Array<{ claim: string; previousStatus: string }>;
}

/**
 * Runs a fresh audit pipeline against the subscribed URL, computes drift against
 * the previous audit, and saves a MonitorDeltaReport. This is the core engine
 * for the $799/mo monitoring offering.
 */
export async function runMonitorScan(subscriptionId: string): Promise<string> {
  // 1. Fetch Subscription
  const subscription = await monitoringDb.monitorSubscription.findUnique({
    where: { id: subscriptionId },
    include: {
      user: true,
      deltas: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!subscription) {
    throw new Error('MonitorSubscription not found');
  }

  // 2. Fetch Previous Audit (if any)
  let previousAuditJson: AuditResult | null = null;
  let previousAuditId: string | null = null;
  
  if (subscription.deltas.length > 0) {
    previousAuditId = subscription.deltas[0].currentAuditId;
  } else {
    // If no deltas yet, try to find the most recent manual audit for this URL
    const latestAudit = await db.audit.findFirst({
      where: { websiteUrl: subscription.url, userId: subscription.userId },
      orderBy: { createdAt: 'desc' }
    });
    if (latestAudit) {
      previousAuditId = latestAudit.publicId;
    }
  }

  if (previousAuditId) {
    const prevRecord = await db.audit.findUnique({ where: { publicId: previousAuditId } });
    if (prevRecord) {
      try {
        const parsed = JSON.parse(prevRecord.auditJson) as { __auditType?: string } & AuditResult;
        if (parsed.__auditType) delete (parsed as { __auditType?: string }).__auditType;
        previousAuditJson = parsed as AuditResult;
      } catch (e) {
        console.warn('Failed to parse previous audit JSON for delta calculation');
      }
    }
  }

  // 3. Run New Audit Pipeline
  console.log(`[Claim Monitoring] Running scan for ${subscription.url}...`);
  const { parsed: newAuditJson, scraped } = await runAuditPipeline({
    auditType: 'full',
    websiteUrl: subscription.url,
    inputType: 'website',
  });

  // Calculate AI Visibility Delta (deep mode always on for $799 monitoring users)
  try {
    const claimFindings = newAuditJson.claim_audit.claims.map((c: Claim) => ({
      id: c.id,
      text: c.original_text,
      label: (c.claim_status === 'verified' ? 'Supported' :
              c.claim_status === 'weakly_supported' || c.claim_status === 'insufficient_public_evidence' ? 'Weakly Supported' :
              c.claim_status === 'overstated' ? 'Overstated' : 'Unsupported') as any,
      evidenceFound: [],
      evidenceMissing: [c.support_gap].filter(Boolean),
      riskToBuyer: '',
      riskToInvestorOrAiSystem: '',
      saferFraming: c.safer_framing
    }));
    const pageInput = {
      url: scraped.url || subscription.url,
      content: scraped.rawText,
      metadata: { title: scraped.title, description: scraped.description }
    };
    const simulationResult = await generateSimulation({ page: pageInput, claims: claimFindings }, { mode: 'full' });
    (newAuditJson as any).aiVisibilitySimulation = simulationResult.simulations;
    (newAuditJson as any).entityUnderstandingGaps = simulationResult.entityUnderstandingGaps;
  } catch (simErr) {
    console.warn('[Claim Monitoring] Failed to run AI Visibility simulation during scan', simErr);
  }

  // 4. Calculate Delta
  const delta = calculateDelta(previousAuditJson, newAuditJson);

  // 5. Persist New Audit
  const currentAuditId = await persistAudit({
    auditType: 'full',
    path: 'monitoring',
    websiteUrl: subscription.url,
    auditJson: newAuditJson,
    userId: subscription.userId,
  });

  // 6. Save Delta Report
  const deltaReport = await monitoringDb.monitorDeltaReport.create({
    data: {
      subscriptionId: subscription.id,
      previousAuditId: previousAuditId || currentAuditId,
      currentAuditId,
      riskScoreDelta: delta.riskScoreDelta,
      newClaimsCount: delta.newClaimsCount,
      changedClaimsCount: delta.changedClaimsCount,
      deltaJson: JSON.stringify(delta),
    }
  });

  // 7. Update Subscription state
  await monitoringDb.monitorSubscription.update({
    where: { id: subscription.id },
    data: { lastRun: new Date() }
  });

  // Basic alert stub (could email here)
  if (subscription.notificationsEnabled && (delta.newClaimsCount > 0 || delta.riskScoreDelta !== 0)) {
    console.log(`[Alert Stub] Monitoring found drift! Risk delta: ${delta.riskScoreDelta}, New claims: ${delta.newClaimsCount}. URL: ${subscription.url}`);
    await monitoringDb.monitorSubscription.update({
      where: { id: subscription.id },
      data: { lastNotified: new Date() }
    });
  }

  return deltaReport.id;
}

function calculateDelta(prev: AuditResult | null, curr: AuditResult): MonitorDeltaResult {
  if (!prev) {
    // First run baseline
    return {
      newClaimsCount: curr.claim_audit.claims.length,
      changedClaimsCount: 0,
      resolvedClaimsCount: 0,
      riskScoreDelta: curr.claim_audit.summary.claim_support_score, // Initial score
      newEvidenceGaps: curr.claim_audit.summary.unsupported_count,
      aiVisibilityDelta: 'Baseline AI Visibility established.',
      newClaims: curr.claim_audit.claims.map((claim) => ({
        claim: claim.normalized_claim || claim.original_text,
        status: claim.claim_status,
        priority: claim.priority,
      })),
      changedClaims: [],
      resolvedClaims: [],
    };
  }

  const prevClaims = new Map(prev.claim_audit.claims.map(c => [claimKey(c), c]));
  const currClaims = new Map(curr.claim_audit.claims.map(c => [claimKey(c), c]));

  let newClaimsCount = 0;
  let changedClaimsCount = 0;
  let resolvedClaimsCount = 0;
  let newEvidenceGaps = 0;
  const newClaims: MonitorDeltaResult['newClaims'] = [];
  const changedClaims: MonitorDeltaResult['changedClaims'] = [];
  const resolvedClaims: MonitorDeltaResult['resolvedClaims'] = [];

  for (const [key, currClaim] of currClaims) {
    const prevClaim = prevClaims.get(key);
    if (!prevClaim) {
      newClaimsCount++;
      newClaims.push({
        claim: currClaim.normalized_claim || currClaim.original_text,
        status: currClaim.claim_status,
        priority: currClaim.priority,
      });
      if (currClaim.claim_status === 'unsupported' || currClaim.claim_status === 'overstated') {
        newEvidenceGaps++;
      }
    } else {
      if (
        prevClaim.claim_status !== currClaim.claim_status ||
        prevClaim.priority !== currClaim.priority ||
        prevClaim.support_gap !== currClaim.support_gap ||
        prevClaim.safer_framing !== currClaim.safer_framing
      ) {
        changedClaimsCount++;
        changedClaims.push({
          claim: currClaim.normalized_claim || currClaim.original_text,
          from: `${prevClaim.claim_status} / ${prevClaim.priority}`,
          to: `${currClaim.claim_status} / ${currClaim.priority}`,
        });
      }
    }
  }

  for (const [key, prevClaim] of prevClaims) {
    if (!currClaims.has(key)) {
      resolvedClaimsCount++;
      resolvedClaims.push({
        claim: prevClaim.normalized_claim || prevClaim.original_text,
        previousStatus: prevClaim.claim_status,
      });
    }
  }

  const riskScoreDelta = curr.claim_audit.summary.claim_support_score - prev.claim_audit.summary.claim_support_score;

  return {
    newClaimsCount,
    changedClaimsCount,
    resolvedClaimsCount,
    riskScoreDelta,
    newEvidenceGaps,
    aiVisibilityDelta: riskScoreDelta < 0 
      ? 'Risk score increased; AI engines may drop citation confidence.' 
      : 'Visibility remains stable or improved.',
    newClaims,
    changedClaims,
    resolvedClaims,
  };
}

function claimKey(claim: Claim): string {
  return (claim.normalized_claim || claim.original_text)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
}
