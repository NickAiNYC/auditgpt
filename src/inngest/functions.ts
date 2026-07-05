import { db } from "@/lib/db";
import { inngest } from "./client";
import { createSnapshotStore, type SnapshotStorageStatus } from "@/lib/snapshot-store";
import { writeMultiClaimPageCapture } from "@/lib/audit/write-multi-claim";
import crypto from "crypto";

/* ── Helpers ─────────────────────────────────────────────────── */

const GUARDIAN_PROMPT_ID = "guardian-domain-summary";
const GUARDIAN_PROMPT_VERSION = 1;
const GUARDIAN_PROMPT_TEXT =
  "Review the public page and summarize observed weight-loss or wellness marketing claims. Record only what is visible or what the AI answer surface explicitly returns.";

function digest(domain: string, query: string, status: string): string {
  return crypto.createHash("sha256").update(`${domain}::${query}::${status}`).digest("hex");
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeClaim(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  return `{${Object.keys(value as Record<string, unknown>)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize((value as Record<string, unknown>)[key])}`)
    .join(",")}}`;
}

function normalizeSourceUrl(domain: string, sourceUrl?: string): string {
  if (sourceUrl) return sourceUrl;
  if (/^https?:\/\//i.test(domain)) return domain;
  return `https://${domain}`;
}

// Durable snapshot persistence. Local filesystem in dev; Supabase Storage in
// production (SNAPSHOT_STORE=supabase or NODE_ENV=production + Supabase env).
// A hash only proves integrity of bytes we still have — storage must outlive
// the machine that captured them.
async function storeRawSnapshot(hash: string, body: string, contentType: string | null): Promise<{
  location: string | null;
  byteLength: number;
  status: SnapshotStorageStatus;
}> {
  const bytes = Buffer.from(body, "utf8");
  try {
    const stored = await createSnapshotStore().put({ digest: hash, bytes, contentType });
    return { location: stored.location, byteLength: stored.byteLength, status: stored.status };
  } catch (error) {
    console.warn("[guardian] Snapshot storage failed", error);
    return { location: null, byteLength: bytes.byteLength, status: "STORAGE_FAILED" };
  }
}

async function capturePageSnapshot(sourceUrl: string): Promise<{
  body: string;
  hash: string;
  resolvedUrl: string | null;
  rawSnapshotLocation: string | null;
  snapshotByteLength: number;
  snapshotStorageStatus: SnapshotStorageStatus;
  httpStatus: number | null;
  contentType: string | null;
  captureMethod: string;
}> {
  try {
    const response = await fetch(sourceUrl, {
      headers: { "User-Agent": "AuditGPT-Guardian/0.1 (+https://auditgpt.ai)" },
    });
    const body = await response.text();
    const hash = sha256(body);
    const stored = await storeRawSnapshot(hash, body, response.headers.get("content-type"));
    return {
      body,
      hash,
      // response.url is the final URL after redirects — the resource that
      // actually produced these bytes, which is what the hash describes.
      resolvedUrl: response.url || sourceUrl,
      rawSnapshotLocation: stored.location,
      snapshotByteLength: stored.byteLength,
      snapshotStorageStatus: stored.status,
      httpStatus: response.status,
      contentType: response.headers.get("content-type"),
      captureMethod: "fetch",
    };
  } catch (error) {
    const body = JSON.stringify({
      sourceUrl,
      captureError: error instanceof Error ? error.message : "Unknown capture error",
    });
    const hash = sha256(body);
    const stored = await storeRawSnapshot(hash, body, "application/json; capture-error");
    return {
      body,
      hash,
      resolvedUrl: null, // no successful response — nothing resolved
      rawSnapshotLocation: stored.location,
      snapshotByteLength: stored.byteLength,
      snapshotStorageStatus: stored.status,
      httpStatus: null,
      contentType: "application/json; capture-error",
      captureMethod: "fetch_error",
    };
  }
}

async function writeLifecycleCapture(input: {
  domain: string;
  sourceUrl: string;
  query: string;
  answerPayload: string;
  aiSurface: string;
  modelProvider: string;
  modelVersionId: string | null;
  modelVersionSource: string;
}): Promise<{
  observationId: string;
  claimStateId: string | null;
  lifecycleEvents: Array<"FIRST_OBSERVED" | "MODIFIED" | "REMOVED">;
  eventDigests: string[];
  pageSnapshotHash: string;
}> {
  const observedAt = new Date();
  const promptHash = sha256(GUARDIAN_PROMPT_TEXT);
  const answerDigest = sha256(input.answerPayload);
  const snapshot = await capturePageSnapshot(input.sourceUrl);
  const observationId = crypto.randomUUID();
  const sourceLocator = "guardian:ai-answer:primary-observation";
  const parsedAnswer = JSON.parse(input.answerPayload) as { answer?: unknown };
  const claimText =
    typeof parsedAnswer.answer === "string" && parsedAnswer.answer.trim().length > 0
      ? parsedAnswer.answer
      : null;
  const normalizedClaimText = claimText ? normalizeClaim(claimText) : null;
  const claimHash = normalizedClaimText ? sha256(normalizedClaimText) : null;
  const stateHash =
    claimHash && normalizedClaimText ? sha256(`${claimHash}::${normalizedClaimText}::${sourceLocator}`) : null;

  await db.$executeRawUnsafe(
    `INSERT OR IGNORE INTO PromptDefinition (id, version, promptHash, promptText, createdAt)
     VALUES (?, ?, ?, ?, datetime('now'))`,
    GUARDIAN_PROMPT_ID,
    GUARDIAN_PROMPT_VERSION,
    promptHash,
    GUARDIAN_PROMPT_TEXT
  );

  await db.$executeRawUnsafe(
    `INSERT INTO Observation (
       id, domain, sourceUrl, resolvedUrl, pageSnapshotHash, rawSnapshotLocation, snapshotByteLength,
       snapshotStorageStatus, captureMethod, httpStatus, contentType,
       capturedAt, observedAt, aiSurface, modelProvider, modelVersionId, modelVersionSource,
       promptId, promptVersion, promptText, promptHash, answerPayload, answerDigest
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    observationId,
    input.domain,
    input.sourceUrl,
    snapshot.resolvedUrl,
    snapshot.hash,
    snapshot.rawSnapshotLocation,
    snapshot.snapshotByteLength,
    snapshot.snapshotStorageStatus,
    snapshot.captureMethod,
    snapshot.httpStatus,
    snapshot.contentType,
    observedAt,
    observedAt,
    input.aiSurface,
    input.modelProvider,
    input.modelVersionId,
    input.modelVersionSource,
    GUARDIAN_PROMPT_ID,
    GUARDIAN_PROMPT_VERSION,
    GUARDIAN_PROMPT_TEXT,
    promptHash,
    input.answerPayload,
    answerDigest
  );

  const priorStates = await db.$queryRawUnsafe<Array<{
    observationId: string;
    claimHash: string;
    stateHash: string;
    normalizedClaimText: string;
    observedAt: string;
  }>>(
    `SELECT cs.observationId, cs.claimHash, cs.stateHash, cs.normalizedClaimText, o.observedAt
       FROM ClaimState cs
       JOIN Observation o ON o.id = cs.observationId
      WHERE o.domain = ?
        AND cs.sourceLocator = ?
        AND cs.observationId != ?
      ORDER BY o.observedAt DESC
      LIMIT 1`,
    input.domain,
    sourceLocator,
    observationId
  );
  const priorState = priorStates[0];

  let claimStateId: string | null = null;
  if (claimText && normalizedClaimText && claimHash && stateHash) {
    claimStateId = crypto.randomUUID();
    await db.$executeRawUnsafe(
      `INSERT INTO ClaimState (
         id, observationId, claimHash, stateHash, claimText, normalizedClaimText,
         supportState, discrepancyType, severity, sourceLocator, createdAt
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      claimStateId,
      observationId,
      claimHash,
      stateHash,
      claimText,
      normalizedClaimText,
      null,
      null,
      null,
      sourceLocator
    );
  }

  const lifecycleEvent =
    claimHash && stateHash
      ? !priorState
        ? "FIRST_OBSERVED"
        : priorState.stateHash !== stateHash
          ? "MODIFIED"
          : null
      : priorState
        ? "REMOVED"
        : null;

  if (!lifecycleEvent) {
    return {
      observationId,
      claimStateId,
      lifecycleEvents: [],
      eventDigests: [],
      pageSnapshotHash: snapshot.hash,
    };
  }

  const previousEvents = await db.$queryRawUnsafe<Array<{
    eventDigest: string;
    chainPosition: number;
  }>>(
    `SELECT eventDigest, chainPosition
       FROM ClaimLifecycleEvent
      WHERE domain = ?
      ORDER BY chainPosition DESC
      LIMIT 1`,
    input.domain
  );
  const previousEvent = previousEvents[0];
  const chainPosition = (previousEvent?.chainPosition ?? 0) + 1;
  const priorObservedAt = priorState ? new Date(priorState.observedAt) : null;
  const latencyFromPriorEventMs = priorObservedAt
    ? observedAt.getTime() - priorObservedAt.getTime()
    : null;
  const lifecycleClaimHash = claimHash ?? priorState.claimHash;
  const eventBody = {
    claimHash: lifecycleClaimHash,
    domain: input.domain,
    eventType: lifecycleEvent,
    observationId,
    priorObservationId: priorState?.observationId ?? null,
    pageSnapshotHash: snapshot.hash,
    priorStateHash: priorState?.stateHash ?? null,
    aiSurface: input.aiSurface,
    modelVersionId: input.modelVersionId,
    promptId: GUARDIAN_PROMPT_ID,
    observedAt: observedAt.toISOString(),
    priorObservedAt: priorObservedAt?.toISOString() ?? null,
    chainPosition,
    latencyFromPriorEventMs,
    priorEventDigest: previousEvent?.eventDigest ?? null,
  };
  const eventDigest = sha256(canonicalize(eventBody));

  await db.$executeRawUnsafe(
    `INSERT OR IGNORE INTO ClaimLifecycleEvent (
       id, claimHash, domain, eventType, observationId, priorObservationId, pageSnapshotHash,
       priorStateHash, aiSurface, modelVersionId, promptId, observedAt, priorObservedAt,
       chainPosition, latencyFromPriorEventMs, eventDigest, createdAt
    )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    crypto.randomUUID(),
    lifecycleClaimHash,
    input.domain,
    lifecycleEvent,
    observationId,
    priorState?.observationId ?? null,
    snapshot.hash,
    priorState?.stateHash ?? null,
    input.aiSurface,
    input.modelVersionId,
    GUARDIAN_PROMPT_ID,
    observedAt,
    priorObservedAt,
    chainPosition,
    latencyFromPriorEventMs,
    eventDigest
  );

  return {
    observationId,
    claimStateId,
    lifecycleEvents: [lifecycleEvent],
    eventDigests: [eventDigest],
    pageSnapshotHash: snapshot.hash,
  };
}

async function sendAlert(payload: {
  domain: string;
  query: string;
  status: string;
  digest: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.MONITOR_ALERT_TO || "thrivaiusa@gmail.com";
  const from = process.env.MONITOR_FROM || "AuditGPT Monitor <noreply@auditgpt.ai>";
  if (!apiKey) {
    console.warn("[guardian] No RESEND_API_KEY — skipping alert email");
    return;
  }

  const subject = `[Guardian] ${payload.status} — ${payload.domain}`;
  const text = [
    `Guardian Distortion Monitor — ${new Date().toISOString()}`,
    `Domain: ${payload.domain}`,
    `Query: ${payload.query}`,
    `Status: ${payload.status}`,
    `Digest: ${payload.digest}`,
    "",
    "This is an automated surveillance record from AuditGPT Guardian.",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend delivery failed (${res.status}): ${body.slice(0, 200)}`);
  }
}

/* ── Functions ────────────────────────────────────────────────── */

export const guardianDailyDistortionMonitor = inngest.createFunction(
  { id: "guardian-daily-distortion-monitor", name: "Guardian Daily Distortion Monitor", triggers: { event: "guardian/distortion.monitor.daily" }, concurrency: 1, retries: 2 },
  async ({ event, step }) => {
    const domain = (event.data?.domain as string) || process.env.GUARDIAN_DOMAIN || "";
    if (!domain) return { skipped: true, reason: "No domain configured" };

    const query = (event.data?.query as string) || `${domain} weight loss claims`;
    const sourceUrl = normalizeSourceUrl(domain, event.data?.sourceUrl as string | undefined);
    const answerPayload = JSON.stringify({
      source: "ai-answer-simulation",
      answer: `Observed claims on ${domain} related to "${query}"`,
      timestamp: new Date().toISOString(),
      simulated: true,
    });

    const record = await step.run("write-distortion-log", async () => {
      const status = "observed" as const;
      const d = digest(domain, query, status);
      const id = crypto.randomUUID();
      await db.$executeRawUnsafe(
        `INSERT OR IGNORE INTO DistortionLog (id, domain, query, answerPayload, status, digest, checkedAt, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        id, domain, query, answerPayload, status, d
      );
      return { digest: d, status };
    });

    const lifecycle = await step.run("write-lifecycle-capture", async () => {
      return writeLifecycleCapture({
        domain,
        sourceUrl,
        query,
        answerPayload,
        aiSurface: "guardian-simulation",
        modelProvider: "internal",
        modelVersionId: null,
        // No provider was called on this path — the answer is simulated.
        // "NOT_EXPOSED_BY_PROVIDER" is reserved for real provider calls that
        // omit a version identifier; conflating the two is the census
        // mislabeling failure mode.
        modelVersionSource: "SIMULATED_NO_PROVIDER_CALL",
      });
    });

    const pageLifecycle = await step.run("write-page-lifecycle-capture", async () => {
      return writeMultiClaimPageCapture({
        domain,
        sourceUrl,
      });
    });

    await step.run("send-alert", async () => {
      await sendAlert({ domain, query, status: record.status, digest: record.digest });
    });

    return {
      domain,
      query,
      status: record.status,
      digest: record.digest,
      logged: true,
      lifecycle,
      pageLifecycle,
    };
  }
);

export const guardianGlobalLifecycleSweep = inngest.createFunction(
  { id: "guardian-global-lifecycle-sweep", name: "Guardian Global Lifecycle Sweep" },
  { cron: "0 2 * * *" }, // Run at 2 AM every day
  async ({ step }) => {
    // 1. Fetch all domains from AgencyClient and MonitoredSite
    const clients = await step.run("fetch-domains", async () => {
      const agencies = await db.$queryRawUnsafe<{ url: string }[]>(`SELECT url FROM AgencyClient`);
      const monitored = await db.$queryRawUnsafe<{ url: string }[]>(`SELECT url FROM MonitoredSite`);
      
      const allUrls = [...agencies.map(a => a.url), ...monitored.map(m => m.url)];
      // Extract domains and deduplicate
      const domains = Array.from(new Set(allUrls.map(u => {
        try {
          return new URL(u.startsWith('http') ? u : `https://${u}`).hostname;
        } catch {
          return u;
        }
      })));
      return domains;
    });

    if (clients.length === 0) {
      return { skipped: true, reason: "No domains found to monitor" };
    }

    // 2. Fan out to individual monitoring jobs
    const events = clients.map(domain => ({
      name: "guardian/distortion.monitor.daily",
      data: { domain, query: `${domain} compliance and medical claims` }
    }));
    
    await step.sendEvent("fan-out-monitoring", events);
    
    return { 
      domainsSwept: clients.length, 
      domains: clients 
    };
  }
);

export const guardianMonthlyRescan = inngest.createFunction(
  { id: "guardian-monthly-rescan", name: "Guardian Monthly Rescan", triggers: { event: "guardian/rescan.monthly" }, concurrency: 1, retries: 1 },
  async ({ event, step }) => {
    const domain = (event.data?.domain as string) || process.env.GUARDIAN_DOMAIN || "";
    if (!domain) return { skipped: true, reason: "No domain configured" };

    await step.run("log-rescan", () => {
      console.log(`[guardian-monthly] Rescan triggered for ${domain}`);
    });

    return { domain, rescanned: true };
  }
);

export const scanIngest = inngest.createFunction(
  { id: "scan-ingest", name: "Scan Ingest", triggers: { event: "scan/ingest" }, concurrency: 5 },
  async ({ event }) => {
    const url = event.data?.url as string | undefined;
    const userId = event.data?.userId as string | undefined;
    if (!url) return { skipped: true, reason: "No URL provided" };

    console.log(`[scan-ingest] Queued scan for ${url} (user: ${userId})`);
    return { url, userId, ingested: true };
  }
);

export const receiptReadyOnApproval = inngest.createFunction(
  { id: "receipt-ready-on-approval", name: "Receipt Ready on Approval", triggers: { event: "receipt/ready" }, concurrency: 3 },
  async ({ event }) => {
    const auditId = event.data?.auditId as string | undefined;
    const email = event.data?.email as string | undefined;
    if (!auditId || !email) return { skipped: true, reason: "Missing auditId or email" };

    console.log(`[receipt] Receipt ready for audit ${auditId} → ${email}`);
    return { auditId, email, notified: true };
  }
);
