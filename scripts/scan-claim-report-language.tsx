import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClaimIntelligenceReport } from '../src/components/claim-intelligence-report';
import { aiSaasClaimSupportFixture, medSpaFoundersAuditFixture } from '../src/lib/claim-report-fixtures';
import { REPORT_DISCLAIMER } from '../src/lib/claim-report';

const prohibited = [
  /\bFTC\b/i, /\bliabilit(?:y|ies)\b/i, /legal[- ]threat/i, /compliance[- ]certification/i,
  /\bclinical\b/i, /fear[- ]based/i, /slop detected/i, /\bPolsia\b/i,
  /\blawsuit\b/i, /\bviolation\b/i, /\bfined\b/i, /\billegal\b/i,
];

let failed = false;
for (const report of [aiSaasClaimSupportFixture, medSpaFoundersAuditFixture]) {
  const html = renderToStaticMarkup(<ClaimIntelligenceReport report={report} />);
  const disclaimerCount = html.split(REPORT_DISCLAIMER).length - 1;
  if (disclaimerCount !== 1) {
    failed = true;
    console.error(`${report.metadata.targetName}: FAIL — expected one required disclaimer, found ${disclaimerCount}`);
    continue;
  }
  const scannable = html.replace(REPORT_DISCLAIMER, '');
  const hits = prohibited.filter((pattern) => pattern.test(scannable)).map(String);
  if (hits.length) { failed = true; console.error(`${report.metadata.targetName}: FAIL ${hits.join(', ')}`); }
  else console.log(`${report.metadata.targetName}: PASS — no prohibited language in rendered report body`);
}
if (failed) process.exit(1);
