DROP INDEX IF EXISTS "DistortionLog_digest_idx";

CREATE UNIQUE INDEX IF NOT EXISTS "DistortionLog_digest_key" ON "DistortionLog"("digest");
