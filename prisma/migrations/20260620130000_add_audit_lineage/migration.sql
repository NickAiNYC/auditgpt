PRAGMA foreign_keys=OFF;
PRAGMA defer_foreign_keys=ON;

-- CreateTable (Initial User Table if not exists)
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateTable (Initial Audit Table if not exists)
CREATE TABLE IF NOT EXISTS "Audit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "companyName" TEXT,
    "websiteUrl" TEXT,
    "industry" TEXT,
    "focusNotes" TEXT,
    "auditJson" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "userId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Audit_publicId_key" ON "Audit"("publicId");
CREATE INDEX IF NOT EXISTS "Audit_publicId_idx" ON "Audit"("publicId");
CREATE INDEX IF NOT EXISTS "Audit_userId_idx" ON "Audit"("userId");
CREATE INDEX IF NOT EXISTS "Audit_verified_idx" ON "Audit"("verified");

-- CreateTable (Initial Account Table if not exists)
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateTable (Initial Session Table if not exists)
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateTable (Initial VerificationToken Table if not exists)
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateTable (Initial Subscription Table if not exists)
CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "currentPeriodEnd" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateTable (Initial AgentConfig Table if not exists)
CREATE TABLE IF NOT EXISTS "AgentConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "auditId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AgentConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AgentConfig_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "AgentConfig_userId_idx" ON "AgentConfig"("userId");

-- CreateTable (Initial AgentRun Table if not exists)
CREATE TABLE IF NOT EXISTS "AgentRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentConfigId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "triggered" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AgentRun_agentConfigId_fkey" FOREIGN KEY ("agentConfigId") REFERENCES "AgentConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AgentRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "AgentRun_agentConfigId_idx" ON "AgentRun"("agentConfigId");
CREATE INDEX IF NOT EXISTS "AgentRun_userId_idx" ON "AgentRun"("userId");

-- CreateTable (Initial Integration Table if not exists)
CREATE TABLE IF NOT EXISTS "Integration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "externalId" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Integration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Integration_userId_provider_key" ON "Integration"("userId", "provider");
CREATE INDEX IF NOT EXISTS "Integration_userId_idx" ON "Integration"("userId");

-- CreateTable (Initial OAuthState Table if not exists)
CREATE TABLE IF NOT EXISTS "OAuthState" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);
CREATE INDEX IF NOT EXISTS "OAuthState_expiresAt_idx" ON "OAuthState"("expiresAt");

-- CreateTable (Initial MonitoredSite Table if not exists)
CREATE TABLE IF NOT EXISTS "MonitoredSite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "MonitoredSite_url_key" ON "MonitoredSite"("url");

-- CreateTable (Initial RescanLock Table if not exists)
CREATE TABLE IF NOT EXISTS "RescanLock" (
    "auditId" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

BEGIN;

-- Rebuild the Audit Table to add foreign key relations and new columns
CREATE TABLE "new_Audit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "companyName" TEXT,
    "websiteUrl" TEXT,
    "industry" TEXT,
    "focusNotes" TEXT,
    "auditJson" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "userId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" DATETIME,
    "score" INTEGER,
    "verdict" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monitoredSiteId" TEXT,
    "previousAuditId" TEXT,
    CONSTRAINT "Audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Audit_monitoredSiteId_fkey" FOREIGN KEY ("monitoredSiteId") REFERENCES "MonitoredSite" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Audit_previousAuditId_fkey" FOREIGN KEY ("previousAuditId") REFERENCES "Audit" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Copy all columns that existed in the pre-lineage Audit table.
-- In pre-lineage databases, score, verdict, previousAuditId and monitoredSiteId did not exist.
-- Thus, they are initialized to NULL defaults.
INSERT INTO "new_Audit" ("id", "path", "companyName", "websiteUrl", "industry", "focusNotes", "auditJson", "publicId", "userId", "verified", "verifiedAt", "score", "verdict", "monitoredSiteId", "previousAuditId", "createdAt")
SELECT "id", "path", "companyName", "websiteUrl", "industry", "focusNotes", "auditJson", "publicId", "userId", "verified", "verifiedAt", NULL, NULL, NULL, NULL, "createdAt" FROM "Audit";

DROP TABLE "Audit";

ALTER TABLE "new_Audit" RENAME TO "Audit";

CREATE UNIQUE INDEX "Audit_publicId_key" ON "Audit"("publicId");
CREATE INDEX "Audit_publicId_idx" ON "Audit"("publicId");
CREATE INDEX "Audit_userId_idx" ON "Audit"("userId");
CREATE INDEX "Audit_verified_idx" ON "Audit"("verified");
CREATE INDEX "Audit_monitoredSiteId_idx" ON "Audit"("monitoredSiteId");
CREATE UNIQUE INDEX "Audit_previousAuditId_key" ON "Audit"("previousAuditId");

COMMIT;

PRAGMA defer_foreign_keys=OFF;
PRAGMA foreign_keys=ON;
