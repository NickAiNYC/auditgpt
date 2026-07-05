import { db } from "@/lib/db";
import crypto from "crypto";
import { extractClaimsFromHtml } from "./page-extraction";
import { capturePageSnapshot } from "@/lib/snapshot-store";

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

export async function writeMultiClaimPageCapture(input: {
  domain: string;
  sourceUrl: string;
}): Promise<{
  observationId: string;
  claimsProcessed: number;
  lifecycleEvents: Array<"FIRST_OBSERVED" | "MODIFIED" | "REMOVED">;
  pageSnapshotHash: string;
}> {
  const observedAt = new Date();
  // We need to fetch the page HTML first
  const response = await fetch(input.sourceUrl, {
    headers: { "User-Agent": "AuditGPT-Guardian/0.1 (+https://auditgpt.ai)" },
  });
  const body = await response.text();
  const hash = sha256(body);
  const resolvedUrl = response.url || input.sourceUrl;

  const observationId = crypto.randomUUID();
  const PAGE_PROMPT_ID = "guardian-page-extraction";
  const PAGE_PROMPT_VERSION = 1;
  const PAGE_PROMPT_TEXT = "Extract discrete, high-risk claims from page HTML.";

  // Store observation
  await db.$executeRawUnsafe(
    `INSERT OR IGNORE INTO PromptDefinition (id, version, promptHash, promptText, createdAt)
     VALUES (?, ?, ?, ?, datetime('now'))`,
    PAGE_PROMPT_ID,
    PAGE_PROMPT_VERSION,
    sha256(PAGE_PROMPT_TEXT),
    PAGE_PROMPT_TEXT
  );

  await db.$executeRawUnsafe(
    `INSERT INTO Observation (
       id, domain, sourceUrl, resolvedUrl, pageSnapshotHash, captureMethod, httpStatus, contentType,
       capturedAt, observedAt, aiSurface, modelProvider, modelVersionSource, promptId, promptVersion, promptHash
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    observationId,
    input.domain,
    input.sourceUrl,
    resolvedUrl,
    hash,
    "fetch",
    response.status,
    response.headers.get("content-type"),
    observedAt,
    observedAt,
    "page-html-extraction",
    "openai",
    "gpt-4o-mini",
    PAGE_PROMPT_ID,
    PAGE_PROMPT_VERSION,
    sha256(PAGE_PROMPT_TEXT)
  );

  // 2. Extract Claims
  const extractedClaims = await extractClaimsFromHtml(body, input.domain);
  const activeLocators = new Set<string>();
  const emittedEvents: Array<"FIRST_OBSERVED" | "MODIFIED" | "REMOVED"> = [];

  for (let i = 0; i < extractedClaims.length; i++) {
    const claimText = extractedClaims[i];
    const normalizedClaimText = normalizeClaim(claimText);
    const claimHash = sha256(normalizedClaimText);
    // Unique source locator for the page HTML track
    const sourceLocator = `guardian:page-html:${claimHash}`;
    activeLocators.add(sourceLocator);

    const stateHash = sha256(`${claimHash}::${normalizedClaimText}::${sourceLocator}`);

    // Find prior state for THIS specific claim on THIS domain
    const priorStates = await db.$queryRawUnsafe<Array<{
      observationId: string;
      claimHash: string;
      stateHash: string;
      normalizedClaimText: string;
      observedAt: string;
      eventDigest: string;
      chainPosition: number;
    }>>(
      `SELECT cs.observationId, cs.claimHash, cs.stateHash, cs.normalizedClaimText, o.observedAt, cle.eventDigest, cle.chainPosition
         FROM ClaimState cs
         JOIN Observation o ON o.id = cs.observationId
         LEFT JOIN ClaimLifecycleEvent cle ON cle.claimHash = cs.claimHash AND cle.domain = o.domain
        WHERE o.domain = ?
          AND cs.sourceLocator = ?
        ORDER BY o.observedAt DESC, cle.chainPosition DESC
        LIMIT 1`,
      input.domain,
      sourceLocator
    );
    const priorState = priorStates[0];

    const claimStateId = crypto.randomUUID();
    await db.$executeRawUnsafe(
      `INSERT INTO ClaimState (
         id, observationId, claimHash, stateHash, claimText, normalizedClaimText,
         sourceLocator, createdAt
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      claimStateId,
      observationId,
      claimHash,
      stateHash,
      claimText,
      normalizedClaimText,
      sourceLocator
    );

    const lifecycleEvent = !priorState
      ? "FIRST_OBSERVED"
      : priorState.stateHash !== stateHash
        ? "MODIFIED"
        : null;

    if (lifecycleEvent) {
      emittedEvents.push(lifecycleEvent);
      const chainPosition = (priorState?.chainPosition ?? 0) + 1;
      const priorObservedAt = priorState ? new Date(priorState.observedAt) : null;
      const latencyFromPriorEventMs = priorObservedAt ? observedAt.getTime() - priorObservedAt.getTime() : null;

      const eventBody = {
        claimHash,
        domain: input.domain,
        eventType: lifecycleEvent,
        observationId,
        priorObservationId: priorState?.observationId ?? null,
        pageSnapshotHash: hash,
        priorStateHash: priorState?.stateHash ?? null,
        observedAt: observedAt.toISOString(),
        chainPosition,
        priorEventDigest: priorState?.eventDigest ?? null,
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
        claimHash,
        input.domain,
        lifecycleEvent,
        observationId,
        priorState?.observationId ?? null,
        hash,
        priorState?.stateHash ?? null,
        "page-html-extraction",
        "gpt-4o-mini",
        PAGE_PROMPT_ID,
        observedAt,
        priorObservedAt,
        chainPosition,
        latencyFromPriorEventMs,
        eventDigest
      );
    }
  }

  // 3. Handle REMOVED
  // Find all previously active page-html claims for this domain that are NOT in activeLocators
  const allPriorActive = await db.$queryRawUnsafe<Array<{
    claimHash: string;
    sourceLocator: string;
    stateHash: string;
    observationId: string;
    observedAt: string;
    eventDigest: string;
    chainPosition: number;
    eventType: string;
  }>>(
    `WITH RankedEvents AS (
       SELECT cs.claimHash, cs.sourceLocator, cs.stateHash, cs.observationId, o.observedAt, cle.eventDigest, cle.chainPosition, cle.eventType,
              ROW_NUMBER() OVER(PARTITION BY cs.claimHash ORDER BY o.observedAt DESC) as rn
       FROM ClaimState cs
       JOIN Observation o ON o.id = cs.observationId
       JOIN ClaimLifecycleEvent cle ON cle.claimHash = cs.claimHash AND cle.domain = o.domain
       WHERE o.domain = ? AND cs.sourceLocator LIKE 'guardian:page-html:%'
    )
    SELECT * FROM RankedEvents WHERE rn = 1 AND eventType != 'REMOVED'`,
    input.domain
  );

  for (const prior of allPriorActive) {
    if (!activeLocators.has(prior.sourceLocator)) {
      // It was removed!
      emittedEvents.push("REMOVED");
      const chainPosition = prior.chainPosition + 1;
      const priorObservedAt = new Date(prior.observedAt);
      const latencyFromPriorEventMs = observedAt.getTime() - priorObservedAt.getTime();
      
      const eventBody = {
        claimHash: prior.claimHash,
        domain: input.domain,
        eventType: "REMOVED",
        observationId,
        priorObservationId: prior.observationId,
        pageSnapshotHash: hash,
        priorStateHash: prior.stateHash,
        observedAt: observedAt.toISOString(),
        chainPosition,
        priorEventDigest: prior.eventDigest,
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
        prior.claimHash,
        input.domain,
        "REMOVED",
        observationId,
        prior.observationId,
        hash,
        prior.stateHash,
        "page-html-extraction",
        "gpt-4o-mini",
        PAGE_PROMPT_ID,
        observedAt,
        priorObservedAt,
        chainPosition,
        latencyFromPriorEventMs,
        eventDigest
      );
    }
  }

  return {
    observationId,
    claimsProcessed: extractedClaims.length,
    lifecycleEvents: emittedEvents,
    pageSnapshotHash: hash,
  };
}
