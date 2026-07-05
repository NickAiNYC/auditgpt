-- CreateTable
CREATE TABLE "PromptDefinition" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "promptHash" TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retiredAt" DATETIME,
    PRIMARY KEY ("id", "version")
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "pageSnapshotHash" TEXT NOT NULL,
    "rawSnapshotLocation" TEXT,
    "captureMethod" TEXT,
    "httpStatus" INTEGER,
    "contentType" TEXT,
    "capturedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aiSurface" TEXT,
    "modelProvider" TEXT,
    "modelVersionId" TEXT,
    "modelVersionSource" TEXT,
    "promptId" TEXT,
    "promptVersion" INTEGER,
    "promptText" TEXT,
    "promptHash" TEXT,
    "answerPayload" TEXT,
    "answerDigest" TEXT,
    CONSTRAINT "Observation_promptId_promptVersion_fkey" FOREIGN KEY ("promptId", "promptVersion") REFERENCES "PromptDefinition" ("id", "version") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClaimState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "observationId" TEXT NOT NULL,
    "claimHash" TEXT NOT NULL,
    "stateHash" TEXT NOT NULL,
    "claimText" TEXT NOT NULL,
    "normalizedClaimText" TEXT NOT NULL,
    "supportState" TEXT,
    "discrepancyType" TEXT,
    "severity" TEXT,
    "sourceLocator" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClaimState_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClaimLifecycleEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "claimHash" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "observationId" TEXT NOT NULL,
    "priorObservationId" TEXT,
    "pageSnapshotHash" TEXT NOT NULL,
    "priorStateHash" TEXT,
    "aiSurface" TEXT,
    "modelVersionId" TEXT,
    "promptId" TEXT,
    "observedAt" DATETIME NOT NULL,
    "priorObservedAt" DATETIME,
    "chainPosition" INTEGER NOT NULL,
    "latencyFromPriorEventMs" BIGINT,
    "eventDigest" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClaimLifecycleEvent_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PromptDefinition_promptHash_key" ON "PromptDefinition"("promptHash");

-- CreateIndex
CREATE INDEX "Observation_domain_observedAt_idx" ON "Observation"("domain", "observedAt");
CREATE INDEX "Observation_pageSnapshotHash_idx" ON "Observation"("pageSnapshotHash");
CREATE INDEX "Observation_answerDigest_idx" ON "Observation"("answerDigest");
CREATE INDEX "Observation_promptId_promptVersion_idx" ON "Observation"("promptId", "promptVersion");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimState_observationId_sourceLocator_key" ON "ClaimState"("observationId", "sourceLocator");
CREATE INDEX "ClaimState_claimHash_idx" ON "ClaimState"("claimHash");
CREATE INDEX "ClaimState_stateHash_idx" ON "ClaimState"("stateHash");
CREATE INDEX "ClaimState_sourceLocator_idx" ON "ClaimState"("sourceLocator");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimLifecycleEvent_eventDigest_key" ON "ClaimLifecycleEvent"("eventDigest");
CREATE INDEX "ClaimLifecycleEvent_domain_observedAt_idx" ON "ClaimLifecycleEvent"("domain", "observedAt");
CREATE INDEX "ClaimLifecycleEvent_claimHash_chainPosition_idx" ON "ClaimLifecycleEvent"("claimHash", "chainPosition");
CREATE INDEX "ClaimLifecycleEvent_eventType_idx" ON "ClaimLifecycleEvent"("eventType");
