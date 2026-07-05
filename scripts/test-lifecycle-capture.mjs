import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

const DOMAIN = 'lifecycle-test.local';
const SOURCE_URL = 'https://lifecycle-test.local/glp1';
const PROMPT_ID = 'guardian-domain-summary';
const PROMPT_VERSION = 1;
const PROMPT_TEXT =
  'Review the public page and summarize observed weight-loss or wellness marketing claims. Record only what is visible or what the AI answer surface explicitly returns.';
const CHANGED_PROMPT_TEXT =
  'Review the public page and summarize observed weight-loss or wellness marketing claims. Record only visible claims and preserve exact language.';
const SOURCE_LOCATOR = 'guardian:ai-answer:primary-observation';
const SNAPSHOT_ROOT = path.join(process.cwd(), 'data', 'snapshots-test');

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizeClaim(value) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function canonicalize(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`)
    .join(',')}}`;
}

function iso(value) {
  return new Date(value).toISOString();
}

async function resetFixture() {
  await prisma.$executeRawUnsafe('DELETE FROM ClaimLifecycleEvent WHERE domain = ?', DOMAIN);
  await prisma.$executeRawUnsafe(
    `DELETE FROM ClaimState
      WHERE observationId IN (SELECT id FROM Observation WHERE domain = ?)`,
    DOMAIN
  );
  await prisma.$executeRawUnsafe('DELETE FROM Observation WHERE domain = ?', DOMAIN);
  await prisma.$executeRawUnsafe('DELETE FROM PromptDefinition WHERE id = ?', PROMPT_ID);
}

async function storeSnapshot(pageBody) {
  const pageSnapshotHash = sha256(pageBody);
  const bytes = Buffer.from(pageBody, 'utf8');
  const dir = path.join(SNAPSHOT_ROOT, DOMAIN, pageSnapshotHash.slice(0, 2));
  const rawSnapshotLocation = path.join(dir, `${pageSnapshotHash}.snapshot`);
  await mkdir(dir, { recursive: true });
  await writeFile(rawSnapshotLocation, bytes, { flag: 'w' });
  return {
    pageSnapshotHash,
    rawSnapshotLocation,
    snapshotByteLength: bytes.byteLength,
    snapshotStorageStatus: 'STORED',
  };
}

async function ensurePrompt(promptText = PROMPT_TEXT, version = PROMPT_VERSION) {
  const promptHash = sha256(promptText);
  await prisma.$executeRawUnsafe(
    `INSERT OR IGNORE INTO PromptDefinition (id, version, promptHash, promptText, createdAt)
     VALUES (?, ?, ?, ?, datetime('now'))`,
    PROMPT_ID,
    version,
    promptHash,
    promptText
  );
  return { promptHash, promptText, version };
}

async function capture({ claimText, pageBody, observedAt, promptText = PROMPT_TEXT, promptVersion = PROMPT_VERSION }) {
  const prompt = await ensurePrompt(promptText, promptVersion);
  const answerPayload = JSON.stringify({
    source: 'test-fixture',
    answer: claimText,
    timestamp: observedAt.toISOString(),
  });
  const snapshot = await storeSnapshot(pageBody);
  const observationId = crypto.randomUUID();
  const answerDigest = sha256(answerPayload);
  const normalizedClaimText = claimText ? normalizeClaim(claimText) : null;
  const claimHash = normalizedClaimText ? sha256(normalizedClaimText) : null;
  const stateHash = claimHash && normalizedClaimText
    ? sha256(`${claimHash}::${normalizedClaimText}::${SOURCE_LOCATOR}`)
    : null;

  await prisma.$executeRawUnsafe(
    `INSERT INTO Observation (
       id, domain, sourceUrl, pageSnapshotHash, rawSnapshotLocation, snapshotByteLength,
       snapshotStorageStatus, captureMethod, httpStatus, contentType,
       capturedAt, observedAt, aiSurface, modelProvider, modelVersionId, modelVersionSource,
       promptId, promptVersion, promptText, promptHash, answerPayload, answerDigest
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    observationId,
    DOMAIN,
    SOURCE_URL,
    snapshot.pageSnapshotHash,
    snapshot.rawSnapshotLocation,
    snapshot.snapshotByteLength,
    snapshot.snapshotStorageStatus,
    'test-fixture',
    200,
    'text/html',
    observedAt,
    observedAt,
    'guardian-simulation',
    'internal',
    null,
    'SIMULATED_NO_PROVIDER_CALL',
    PROMPT_ID,
    prompt.version,
    prompt.promptText,
    prompt.promptHash,
    answerPayload,
    answerDigest
  );

  const priorStates = await prisma.$queryRawUnsafe(
    `SELECT cs.observationId, cs.claimHash, cs.stateHash, cs.normalizedClaimText, o.observedAt
       FROM ClaimState cs
       JOIN Observation o ON o.id = cs.observationId
      WHERE o.domain = ?
        AND cs.sourceLocator = ?
        AND cs.observationId != ?
      ORDER BY o.observedAt DESC
      LIMIT 1`,
    DOMAIN,
    SOURCE_LOCATOR,
    observationId
  );
  const priorState = priorStates[0];

  let claimStateId = null;
  if (claimText && normalizedClaimText && claimHash && stateHash) {
    claimStateId = crypto.randomUUID();
    await prisma.$executeRawUnsafe(
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
      SOURCE_LOCATOR
    );
  }

  const eventType = claimHash && stateHash
    ? !priorState
      ? 'FIRST_OBSERVED'
      : priorState.stateHash !== stateHash
        ? 'MODIFIED'
        : null
    : priorState
      ? 'REMOVED'
      : null;
  if (!eventType) return { observationId, eventType: null };

  const previousEvents = await prisma.$queryRawUnsafe(
    `SELECT eventDigest, chainPosition
       FROM ClaimLifecycleEvent
      WHERE domain = ?
      ORDER BY chainPosition DESC
      LIMIT 1`,
    DOMAIN
  );
  const previousEvent = previousEvents[0];
  const chainPosition = (previousEvent?.chainPosition ?? 0) + 1;
  const priorObservedAt = priorState ? new Date(priorState.observedAt) : null;
  const latencyFromPriorEventMs = priorObservedAt ? observedAt.getTime() - priorObservedAt.getTime() : null;
  const lifecycleClaimHash = claimHash ?? priorState.claimHash;
  const eventBody = {
    claimHash: lifecycleClaimHash,
    domain: DOMAIN,
    eventType,
    observationId,
    priorObservationId: priorState?.observationId ?? null,
    pageSnapshotHash: snapshot.pageSnapshotHash,
    priorStateHash: priorState?.stateHash ?? null,
    aiSurface: 'guardian-simulation',
    modelVersionId: null,
    promptId: PROMPT_ID,
    observedAt: observedAt.toISOString(),
    priorObservedAt: priorObservedAt?.toISOString() ?? null,
    chainPosition,
    latencyFromPriorEventMs,
    priorEventDigest: previousEvent?.eventDigest ?? null,
  };
  const eventDigest = sha256(canonicalize(eventBody));

  await prisma.$executeRawUnsafe(
    `INSERT OR IGNORE INTO ClaimLifecycleEvent (
       id, claimHash, domain, eventType, observationId, priorObservationId, pageSnapshotHash,
       priorStateHash, aiSurface, modelVersionId, promptId, observedAt, priorObservedAt,
       chainPosition, latencyFromPriorEventMs, eventDigest, createdAt
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    crypto.randomUUID(),
    lifecycleClaimHash,
    DOMAIN,
    eventType,
    observationId,
    priorState?.observationId ?? null,
    snapshot.pageSnapshotHash,
    priorState?.stateHash ?? null,
    'guardian-simulation',
    null,
    PROMPT_ID,
    observedAt,
    priorObservedAt,
    chainPosition,
    latencyFromPriorEventMs,
    eventDigest
  );

  return { observationId, eventType, eventDigest, chainPosition, latencyFromPriorEventMs };
}

async function loadEvents() {
  return prisma.$queryRawUnsafe(
    `SELECT cle.*, o.observedAt as observationObservedAt
       FROM ClaimLifecycleEvent cle
       JOIN Observation o ON o.id = cle.observationId
      WHERE cle.domain = ?
      ORDER BY cle.chainPosition ASC`,
    DOMAIN
  );
}

function eventBodyFromRow(row, priorEventDigest, tamper = false) {
  return {
    claimHash: row.claimHash,
    domain: row.domain,
    eventType: row.eventType,
    observationId: row.observationId,
    priorObservationId: row.priorObservationId,
    pageSnapshotHash: row.pageSnapshotHash,
    priorStateHash: row.priorStateHash,
    aiSurface: row.aiSurface,
    modelVersionId: row.modelVersionId,
    promptId: row.promptId,
    observedAt: tamper ? '1999-01-01T00:00:00.000Z' : iso(row.observedAt),
    priorObservedAt: row.priorObservedAt ? iso(row.priorObservedAt) : null,
    chainPosition: row.chainPosition,
    latencyFromPriorEventMs:
      row.latencyFromPriorEventMs === null ? null : Number(row.latencyFromPriorEventMs),
    priorEventDigest,
  };
}

function verifyChain(events, { tamperFirst = false } = {}) {
  let priorEventDigest = null;
  const checks = [];
  for (const row of events) {
    const body = eventBodyFromRow(row, priorEventDigest, tamperFirst && row.chainPosition === 1);
    const recomputed = sha256(canonicalize(body));
    const ok = recomputed === row.eventDigest;
    checks.push({ chainPosition: row.chainPosition, eventType: row.eventType, ok, recomputed, stored: row.eventDigest });
    priorEventDigest = recomputed;
  }
  return { ok: checks.every((check) => check.ok), checks };
}

async function verifySnapshots() {
  const observations = await prisma.$queryRawUnsafe(
    `SELECT id, pageSnapshotHash, rawSnapshotLocation, snapshotByteLength, snapshotStorageStatus
       FROM Observation
      WHERE domain = ?
      ORDER BY observedAt ASC`,
    DOMAIN
  );

  const checks = [];
  for (const observation of observations) {
    const bytes = await readFile(observation.rawSnapshotLocation);
    checks.push({
      observationId: observation.id,
      stored: observation.snapshotStorageStatus,
      hashVerified: sha256(bytes.toString('utf8')) === observation.pageSnapshotHash,
      byteLengthVerified: bytes.byteLength === observation.snapshotByteLength,
      rawSnapshotLocation: observation.rawSnapshotLocation,
    });
  }
  return { ok: checks.every((check) => check.stored === 'STORED' && check.hashVerified && check.byteLengthVerified), checks };
}

async function verifyPromptBehavior() {
  const first = await ensurePrompt(PROMPT_TEXT, 1);
  const duplicate = await ensurePrompt(PROMPT_TEXT, 1);
  const second = await ensurePrompt(CHANGED_PROMPT_TEXT, 2);
  const prompts = await prisma.$queryRawUnsafe(
    `SELECT id, version, promptHash, promptText
       FROM PromptDefinition
      WHERE id = ?
      ORDER BY version ASC`,
    PROMPT_ID
  );

  return {
    promptReuse: first.promptHash === duplicate.promptHash,
    promptVersionSplit: first.promptHash !== second.promptHash && prompts.length === 2,
    prompts: prompts.map((prompt) => ({
      version: prompt.version,
      promptHash: prompt.promptHash,
      promptTextLength: prompt.promptText.length,
    })),
  };
}

async function main() {
  await resetFixture();

  const first = await capture({
    claimText: 'Patients can lose 30 pounds in 8 weeks.',
    pageBody: '<h1>Lose 30 pounds in 8 weeks</h1>',
    observedAt: new Date('2026-07-06T10:00:00.000Z'),
  });
  const repeat = await capture({
    claimText: 'Patients can lose 30 pounds in 8 weeks.',
    pageBody: '<h1>Lose 30 pounds in 8 weeks</h1>',
    observedAt: new Date('2026-07-07T10:00:00.000Z'),
  });
  const modified = await capture({
    claimText: 'Patients may lose weight over time with clinician guidance.',
    pageBody: '<h1>Patients may lose weight over time</h1>',
    observedAt: new Date('2026-07-10T10:00:00.000Z'),
  });
  const removed = await capture({
    claimText: '',
    pageBody: '<h1>Clinical weight management consults available</h1>',
    observedAt: new Date('2026-07-12T10:00:00.000Z'),
  });

  const events = await loadEvents();
  const chain = verifyChain(events);
  const tamperedChain = verifyChain(events, { tamperFirst: true });
  const snapshots = await verifySnapshots();
  const promptBehavior = await verifyPromptBehavior();

  const output = {
    captures: { first, repeat, modified, removed },
    lifecycleEvents: events.map((event) => ({
      eventType: event.eventType,
      chainPosition: event.chainPosition,
      priorStateHash: event.priorStateHash,
      latencyFromPriorEventMs:
        event.latencyFromPriorEventMs === null ? null : event.latencyFromPriorEventMs.toString(),
      eventDigest: event.eventDigest,
    })),
    chain,
    tamperedChain,
    snapshots,
    promptBehavior,
  };

  console.log(JSON.stringify(output, null, 2));

  if (events.length !== 3) throw new Error(`Expected 3 lifecycle events, got ${events.length}`);
  if (events.map((event) => event.eventType).join(',') !== 'FIRST_OBSERVED,MODIFIED,REMOVED') {
    throw new Error(`Unexpected lifecycle sequence: ${events.map((event) => event.eventType).join(',')}`);
  }
  if (repeat.eventType !== null) throw new Error('Unchanged observation emitted an event');
  if (!chain.ok) throw new Error('Chain verification failed before tampering');
  if (tamperedChain.ok) throw new Error('Tamper detection did not fail');
  if (!snapshots.ok) throw new Error('Snapshot storage verification failed');
  if (!promptBehavior.promptReuse) throw new Error('Prompt reuse check failed');
  if (!promptBehavior.promptVersionSplit) throw new Error('Prompt version split check failed');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
