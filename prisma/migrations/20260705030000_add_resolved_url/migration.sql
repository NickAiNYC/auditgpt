-- Add URL resolution provenance to Observation.
-- sourceUrl is the requested URL; resolvedUrl is the URL that actually
-- served the captured bytes after redirects. Null when capture failed.
ALTER TABLE "Observation" ADD COLUMN "resolvedUrl" TEXT;
