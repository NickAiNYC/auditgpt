# AuditGPT CI Integration

Block deployments when your site has unsupported claims.

## How it works

AuditGPT runs a full audit against a preview deployment URL, evaluates the
results against configurable thresholds, and returns a pass/fail decision. If
critical unsupported claims exceed the threshold, the deployment is blocked.

The endpoint is **stateless** — no audit persistence, no claims stored, no
public audit pages created. It exists solely as a CI gate.

## Quick start

1.  **Set your CI API key** — add `CI_API_KEY=<random-string>` to your
    AuditGPT instance's environment variables.

2.  **Add the secret to your CI provider** as `AUDITGPT_CI_API_KEY`.

3.  **Call the endpoint** in your CI pipeline:

```bash
curl -X POST https://auditgpt.ai/api/ci/check \
  -H "Authorization: Bearer $AUDITGPT_CI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-preview-url.vercel.app"
  }'
```

## Request format

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `url` | string | yes | — | The deployment URL to audit |
| `threshold` | object | no | (see below) | Custom pass/fail criteria |

### Threshold configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `maxCriticalFindings` | 0 | Block on any critical finding (fabricated metrics, AI placeholder text) |
| `maxHighFindings` | 3 | Allow up to 3 high-severity findings (red flags) |
| `maxMediumFindings` | 10 | Allow up to 10 medium-severity findings (assumptions, slop signals) |
| `requireScoreAbove` | 60 | Minimum overall audit score to pass |

Example with custom threshold:

```bash
curl -X POST https://auditgpt.ai/api/ci/check \
  -H "Authorization: Bearer $AUDITGPT_CI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://staging.myapp.com",
    "threshold": {
      "maxCriticalFindings": 0,
      "maxHighFindings": 1,
      "requireScoreAbove": 80
    }
  }'
```

## Response format

```json
{
  "pass": false,
  "score": 45,
  "threshold": {
    "maxCriticalFindings": 0,
    "maxHighFindings": 3,
    "maxMediumFindings": 10,
    "requireScoreAbove": 60
  },
  "findings": {
    "critical": 1,
    "high": 2,
    "medium": 4,
    "total": 7
  },
  "failures": [
    {
      "severity": "critical",
      "claim": "Fabricated metric: 'trusted by 10,000+ businesses' with no case studies",
      "rule": "slop_marker"
    },
    {
      "severity": "high",
      "claim": "No pricing page found",
      "rule": "red_flag"
    }
  ],
  "summary": "Check failed: 1 critical, 2 high findings. Score: 45/100."
}
```

## GitHub Actions integration

Add `.github/workflows/auditgpt-check.yml` to your repo (included in this
project as a template):

```yaml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Run AuditGPT check
        uses: actions/github-script@v7
        with:
          script: |
            const response = await fetch(
              '${{ secrets.AUDITGPT_API_URL }}/api/ci/check',
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${process.env.AUDITGPT_CI_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  url: process.env.VERCEL_PREVIEW_URL || 'https://staging.example.com',
                }),
              },
            );
            const result = await response.json();
            if (!result.pass) {
              core.setFailed(result.summary);
              for (const f of result.failures) {
                core.warning(`[${f.severity}] ${f.claim}`, { title: f.rule });
              }
            } else {
              core.notice(result.summary);
            }
        env:
          AUDITGPT_CI_API_KEY: ${{ secrets.AUDITGPT_CI_API_KEY }}
```

Add `AUDITGPT_CI_API_KEY` to your repository secrets. Set `AUDITGPT_API_URL` if
self-hosting.

## Vercel integration

Add a checks script to your `vercel.json` or use the Vercel CLI `vercel
--prebuilt` with the GitHub Action above. The recommended approach is the GitHub
Action, which runs against the Vercel preview URL before the deployment is
promoted.

## Errors

| Status | Meaning |
|--------|---------|
| `401` | Missing or invalid `Authorization: Bearer <key>` header |
| `400` | `url` is missing, not a string, or not a valid URL |
| `500` | Upstream LLM or scrape failure |

## Design rules

- **Stateless**: No audit is persisted. The result exists only in the response.
- **Fast**: Single scrape + single LLM call. No DB writes.
- **Configurable**: Thresholds per call so strictness varies by project.
- **Side-effect-free**: No public audit pages, no badges, no notifications.
