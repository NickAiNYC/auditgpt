import { db } from "@/lib/db";
import crypto from "crypto";

/* ── Types matching the public spec ───────────────────────────── */

export interface CaseFileSubject {
  domain: string;
  requested_urls: string[];
  resolved_urls: string[];
}

export interface CoverageWindow {
  from: string | null;
  to: string | null;
}

export interface CoverageGap {
  from: string;
  to: string;
  reason: string;
}

export interface Coverage {
  first_observed: string | null;
  last_observed: string | null;
  observation_count: number;
  page_claim_count: number;
  ai_observation_count: number;
  gaps: CoverageGap[];
}

export interface LifecycleEvent {
  event_type: string;
  observed_at: string;
  observation_id: string;
  prior_observation_id: string | null;
  page_snapshot_hash: string;
  prior_state_hash: string | null;
  chain_position: number;
  latency_from_prior_event_ms: number | null;
  event_digest: string;
}

export interface PageClaim {
  claim_hash: string;
  source_locator: string;
  current_text: string | null;
  first_observed: string;
  last_state: string;
  events: LifecycleEvent[];
}

export interface AiObservation {
  observation_id: string;
  surface: string;
  model_provider: string;
  model_version_id: string | null;
  model_version_source: string;
  prompt: { id: string; version: number; prompt_hash: string } | null;
  answer_digest: string;
  answer_excerpt: string | null;
  discrepancy_type: string | null;
  severity: string | null;
  matched_page_claim_hash: string | null;
  observed_at: string;
}

export interface SnapshotRecord {
  page_snapshot_hash: string;
  resolved_url: string | null;
  captured_at: string;
  byte_length: number | null;
  content_type: string | null;
  capture_method: string | null;
  http_status: number | null;
  storage_status: string | null;
}

export interface IntegritySection {
  crt_log_id: string;
  chain_head_digest: string;
  chain_head_url: string;
  included_event_digests: string[];
  verification_instructions_ref: string;
  methodology_version: string;
}

export interface CaseFileBundle {
  casefile_version: string;
  casefile_id: string;
  generated_at: string;
  bundle_sha256: string;
  subject: CaseFileSubject;
  requested_window: CoverageWindow;
  coverage: Coverage;
  page_claims: PageClaim[];
  ai_observations: AiObservation[];
  snapshots: SnapshotRecord[];
  integrity: IntegritySection;
  scope_statement: string;
}

/* ── Generator ────────────────────────────────────────────────── */

export async function generateCaseFile(
  domain: string,
  from: string | null,
  to: string | null
): Promise<CaseFileBundle> {
  const casefileId = `cf_${crypto.randomUUID()}`;
  const generatedAt = new Date().toISOString();

  // ── Observations ────────────────────────────────────────────
  const whereClause: string[] = ["domain = ?"];
  const params: unknown[] = [domain];
  if (from) { whereClause.push("observedAt >= ?"); params.push(from); }
  if (to) { whereClause.push("observedAt <= ?"); params.push(to); }

  const observations = await db.$queryRawUnsafe<
    Array<{
      id: string; domain: string; sourceUrl: string; resolvedUrl: string | null;
      pageSnapshotHash: string; rawSnapshotLocation: string | null;
      snapshotByteLength: number | null; snapshotStorageStatus: string | null;
      captureMethod: string | null; httpStatus: number | null; contentType: string | null;
      observedAt: Date; aiSurface: string | null; modelProvider: string | null;
      modelVersionId: string | null; modelVersionSource: string | null;
      promptId: string | null; promptVersion: number | null;
      answerPayload: string | null; answerDigest: string | null;
      promptText: string | null; promptHash: string | null;
    }>
  >(`SELECT * FROM Observation WHERE ${whereClause.join(" AND ")} ORDER BY observedAt ASC`, ...params);

  const realObservations = observations.filter(
    (o) => o.modelVersionSource !== "SIMULATED_NO_PROVIDER_CALL"
  );

  // ── Coverage ────────────────────────────────────────────────
  const firstObs = realObservations.length > 0 ? realObservations[0].observedAt.toISOString() : null;
  const lastObs = realObservations.length > 0 ? realObservations[realObservations.length - 1].observedAt.toISOString() : null;

  // ── Page claims with lifecycle events ───────────────────────
  const queryParamStr = from || to
    ? `WHERE domain = '${domain}'` +
      (from ? ` AND observedAt >= '${from}'` : "") +
      (to ? ` AND observedAt <= '${to}'` : "")
    : `WHERE domain = '${domain}'`;

  const lifecycleEvents = await db.$queryRawUnsafe<
    Array<{
      id: string; claimHash: string; domain: string; eventType: string;
      observationId: string; priorObservationId: string | null;
      pageSnapshotHash: string; priorStateHash: string | null;
      chainPosition: number; latencyFromPriorEventMs: bigint | null;
      eventDigest: string; observedAt: Date;
    }>
  >(`SELECT * FROM ClaimLifecycleEvent WHERE domain = ?` +
    (from ? ` AND observedAt >= ?` : "") +
    (to ? ` AND observedAt <= ?` : "") +
    ` ORDER BY claimHash, chainPosition ASC`,
    ...[domain, ...(from ? [from] : []), ...(to ? [to] : [])]
  );

  // Group events by claimHash
  const claimEvents = new Map<string, typeof lifecycleEvents>();
  for (const ev of lifecycleEvents) {
    if (!claimEvents.has(ev.claimHash)) claimEvents.set(ev.claimHash, []);
    claimEvents.get(ev.claimHash)!.push(ev);
  }

  // Get latest ClaimState per claimHash
  const claimStates = await db.$queryRawUnsafe<
    Array<{
      claimHash: string; claimText: string; sourceLocator: string | null;
      discrepancyType: string | null; severity: string | null;
    }>
  >(
    `SELECT cs1.claimHash, cs1.claimText, cs1.sourceLocator, cs1.discrepancyType, cs1.severity
     FROM ClaimState cs1
     INNER JOIN (
       SELECT claimHash, MAX(createdAt) AS maxCt FROM ClaimState
       WHERE claimHash IN (SELECT DISTINCT claimHash FROM ClaimLifecycleEvent WHERE domain = ?)
       GROUP BY claimHash
     ) cs2 ON cs1.claimHash = cs2.claimHash AND cs1.createdAt = cs2.maxCt`,
    domain
  );
  const stateMap = new Map(
    (claimStates as Array<{
      claimHash: string; claimText: string; sourceLocator: string | null;
      discrepancyType: string | null; severity: string | null;
    }>).map((s) => [s.claimHash, s])
  );

  const pageClaims: PageClaim[] = [];
  const claimEntries = Array.from(claimEvents.entries());
  for (const [claimHash, events] of claimEntries) {
    const s = stateMap.get(claimHash);
    const state = s ? s as { claimText: string; sourceLocator: string | null } : null;
    const lastEvent = events[events.length - 1];
    pageClaims.push({
      claim_hash: claimHash,
      source_locator: state?.sourceLocator || `guardian:page-html:${claimHash}`,
      current_text: lastEvent.eventType === "REMOVED" ? null : (state?.claimText || null),
      first_observed: events[0].observedAt.toISOString(),
      last_state: lastEvent.eventType === "REMOVED" ? "REMOVED" : "ACTIVE",
      events: events.map((ev) => ({
        event_type: ev.eventType,
        observed_at: ev.observedAt.toISOString(),
        observation_id: ev.observationId,
        prior_observation_id: ev.priorObservationId,
        page_snapshot_hash: ev.pageSnapshotHash,
        prior_state_hash: ev.priorStateHash,
        chain_position: ev.chainPosition,
        latency_from_prior_event_ms: ev.latencyFromPriorEventMs === null ? null : Number(ev.latencyFromPriorEventMs),
        event_digest: ev.eventDigest,
      })),
    });
  }

  // ── AI observations from DistortionLog (non-simulated) ──────
  const aiObs = await db.$queryRawUnsafe<
    Array<{
      id: string; domain: string; query: string; answerPayload: string;
      digest: string; checkedAt: Date;
    }>
  >(`SELECT * FROM DistortionLog WHERE domain = ?` +
    (from ? ` AND checkedAt >= ?` : "") +
    (to ? ` AND checkedAt <= ?` : ""),
    ...[domain, ...(from ? [from] : []), ...(to ? [to] : [])]
  );

  const aiObservations: AiObservation[] = realObservations
    .filter((o) => o.aiSurface)
    .map((o) => {
      const matched = claimEvents.get(o.id);
      return {
        observation_id: o.id,
        surface: o.aiSurface || "unknown",
        model_provider: o.modelProvider || "unknown",
        model_version_id: o.modelVersionId,
        model_version_source: o.modelVersionSource || "NOT_EXPOSED_BY_PROVIDER",
        prompt: o.promptId
          ? { id: o.promptId, version: o.promptVersion || 1, prompt_hash: o.promptHash || "" }
          : null,
        answer_digest: o.answerDigest || "",
        answer_excerpt: o.answerPayload
          ? o.answerPayload.substring(0, 500)
          : null,
        discrepancy_type: null, // populated from matched claim state if available
        severity: null,
        matched_page_claim_hash: null,
        observed_at: o.observedAt.toISOString(),
      };
    });

  // ── Snapshots ───────────────────────────────────────────────
  const snapshots: SnapshotRecord[] = realObservations.map((o) => ({
    page_snapshot_hash: o.pageSnapshotHash,
    resolved_url: o.resolvedUrl,
    captured_at: o.observedAt.toISOString(),
    byte_length: o.snapshotByteLength,
    content_type: o.contentType,
    capture_method: o.captureMethod,
    http_status: o.httpStatus,
    storage_status: o.snapshotStorageStatus,
  }));

  // ── Integrity ───────────────────────────────────────────────
  const allDigests = lifecycleEvents.map((e) => e.eventDigest).filter(Boolean);
  const chainHeadDigest = allDigests.length > 0 ? allDigests[allDigests.length - 1] : "";

  // ── Build bundle (without sha256) ──────────────────────────
  const bundle: Omit<CaseFileBundle, "bundle_sha256"> = {
    casefile_version: "1.0",
    casefile_id: casefileId,
    generated_at: generatedAt,
    subject: {
      domain,
      requested_urls: Array.from(new Set(realObservations.map((o) => o.sourceUrl))),
      resolved_urls: Array.from(new Set(realObservations.map((o) => o.resolvedUrl).filter(Boolean))) as string[],
    },
    requested_window: { from, to },
    coverage: {
      first_observed: firstObs,
      last_observed: lastObs,
      observation_count: realObservations.length,
      page_claim_count: claimEvents.size,
      ai_observation_count: aiObservations.length,
      gaps: [],
    },
    page_claims: pageClaims,
    ai_observations: aiObservations,
    snapshots,
    integrity: {
      crt_log_id: "scrutexity-log-1",
      chain_head_digest: chainHeadDigest,
      chain_head_url: "https://auditgpt.ai/verify",
      included_event_digests: allDigests,
      verification_instructions_ref: "Evidence Methodology Declaration §5",
      methodology_version: "0.9.2",
    },
    scope_statement:
      "This CaseFile records observations of publicly accessible statements at the dates shown. It does not attest to the truth, legality, or regulatory status of any statement, and reports the absence of visible evidence as a proof gap, not a finding of falsity.",
  };

  // ── Canonical hash ──────────────────────────────────────────
  const canonical = JSON.stringify(bundle, Object.keys(bundle).sort());
  const bundleSha256 = crypto.createHash("sha256").update(canonical).digest("hex");

  return { ...bundle, bundle_sha256: bundleSha256 };
}
