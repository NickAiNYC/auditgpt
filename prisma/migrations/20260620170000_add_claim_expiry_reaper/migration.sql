ALTER TABLE "Audit" ADD COLUMN "staleClaims" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Audit" ADD COLUMN "staleAt" DATETIME;

CREATE TABLE "ExpiryNotification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "attemptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" DATETIME,
    "error" TEXT,
    CONSTRAINT "ExpiryNotification_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExpiryRescanJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'claim_expiry',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ExpiryRescanJob_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ExpiryNotification_auditId_key" ON "ExpiryNotification"("auditId");
CREATE INDEX "ExpiryNotification_sentAt_idx" ON "ExpiryNotification"("sentAt");
CREATE UNIQUE INDEX "ExpiryRescanJob_auditId_key" ON "ExpiryRescanJob"("auditId");
CREATE INDEX "ExpiryRescanJob_status_createdAt_idx" ON "ExpiryRescanJob"("status", "createdAt");
CREATE INDEX "ExpiryRescanJob_userId_idx" ON "ExpiryRescanJob"("userId");
