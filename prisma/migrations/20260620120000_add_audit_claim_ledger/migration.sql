-- CreateTable
CREATE TABLE "AuditClaim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "claimHash" TEXT NOT NULL,
    "claimText" TEXT NOT NULL,
    "claimType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "sourceKind" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceText" TEXT,
    "section" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "ruleVersion" TEXT NOT NULL,
    "crawledAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "supersededAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditClaim_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AuditClaim_auditId_section_position_key" ON "AuditClaim"("auditId", "section", "position");
CREATE INDEX "AuditClaim_auditId_status_idx" ON "AuditClaim"("auditId", "status");
CREATE INDEX "AuditClaim_claimHash_idx" ON "AuditClaim"("claimHash");
CREATE INDEX "AuditClaim_expiresAt_idx" ON "AuditClaim"("expiresAt");
