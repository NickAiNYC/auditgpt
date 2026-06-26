# Audit Endpoint Security Deployment

Repository controls are enforced by `src/lib/safe-fetch.ts` and
`src/lib/audit-usage.ts`. Complete these deployment steps before enabling public
audits in production.

Run `npm run db:deploy` from the build or operator environment with development
dependencies installed. It is not an application-runtime command.

## Required environment variables

- `DEEPSEEK_API_KEY`: provider credential. No application fallback exists.
- `RATE_LIMIT_SALT`: at least 32 random bytes used to hash stored IP identities.

Rotate any provider key that was previously committed or included as a fallback.
The quota store must use a persistent production database. A workspace-local
SQLite file does not persist reliably across Vercel function instances.

## Vercel WAF

Create a rate-limit rule for `POST /api/audit`:

- Counting key: IP and JA4 digest when available.
- Initial action: log for one day, then switch to deny with HTTP 429.
- Suggested edge limit: 10 requests per 10 minutes.

The application applies stricter completed-audit quotas. The WAF rule rejects
bursts before they allocate a function or reach the database.

## Operational checks

- Alert on HTTP 429 and 503 rates from `/api/audit`.
- Review `AuditUsageBucket` global budget consumption daily.
- Remove expired usage buckets with a scheduled database cleanup job.
- Keep public audit reports complete; `robots.txt` is crawler guidance, not an
  access-control boundary.
