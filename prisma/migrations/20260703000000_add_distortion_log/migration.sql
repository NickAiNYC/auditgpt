-- CreateTable
CREATE TABLE "DistortionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "answerPayload" TEXT NOT NULL,
    "sourcePayload" TEXT,
    "status" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "DistortionLog_domain_checkedAt_idx" ON "DistortionLog"("domain", "checkedAt");

-- CreateIndex
CREATE INDEX "DistortionLog_status_idx" ON "DistortionLog"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DistortionLog_digest_key" ON "DistortionLog"("digest");
