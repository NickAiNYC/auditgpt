#!/usr/bin/env tsx
// AuditGPT contract eval runner.
//   npx tsx scripts/eval.ts            # recorded mode (CI, deterministic)
//   npx tsx scripts/eval.ts --json     # machine-readable report to stdout
// Exit code is non-zero if any hard check fails, so CI blocks a regression.

import { runContract, ContractReport } from '../src/lib/eval/contract';
import { FIXTURES } from '../src/lib/eval/fixtures';

// Always-allowed numbers: the 0-100 score scale denominators.
const SCALE = ['0', '100'];

interface PerFixture {
  id: string;
  pass: boolean;
  report: ContractReport;
}

function main() {
  const jsonOut = process.argv.includes('--json');
  const results: PerFixture[] = [];

  for (const fx of FIXTURES) {
    const allowed = new Set([...fx.allowedNumbers, ...SCALE]);
    const report = runContract(fx.output, {
      expectInsufficientData: fx.expectInsufficientData,
      allowedNumbers: allowed,
    });
    results.push({ id: fx.id, pass: report.pass, report });
  }

  const n = results.length;
  const bannedTotal = results.reduce((a, r) => a + r.report.bannedPhrases.length, 0);
  const capTotal = results.reduce((a, r) => a + r.report.sentenceCap.length, 0);
  const idExpected = results.reduce(
    (a, r) => a + r.report.insufficientData.covered.length + r.report.insufficientData.missing.length, 0);
  const idCovered = results.reduce((a, r) => a + r.report.insufficientData.covered.length, 0);
  const advisoryNumbers = results.reduce((a, r) => a + r.report.untracedNumbers.length, 0);
  const allPass = results.every((r) => r.pass);

  const summary = {
    runAt: new Date().toISOString(),
    audits: n,
    bannedPhraseViolations: bannedTotal,
    sentenceCapViolations: capTotal,
    insufficientDataCoverage: `${idCovered}/${idExpected}`,
    advisoryUntracedNumbers: advisoryNumbers,
    pass: allPass,
  };

  // Badge-citable one-liner: only verifiable, hard-check facts.
  const badge =
    `${bannedTotal} banned phrases and ${capTotal} over-length fields across ${n} audits; ` +
    `${idCovered}/${idExpected} known-missing facts marked "insufficient data" ` +
    `(run ${summary.runAt.slice(0, 10)}).`;

  if (jsonOut) {
    console.log(JSON.stringify({ summary, badge, results }, null, 2));
  } else {
    console.log('AuditGPT contract eval');
    console.log('──────────────────────');
    for (const r of results) {
      console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.id}`);
      for (const v of r.report.bannedPhrases) console.log(`        banned: ${v.field} → "${v.detail}"`);
      for (const v of r.report.sentenceCap) console.log(`        length: ${v.field} → ${v.detail}`);
      for (const m of r.report.insufficientData.missing) console.log(`        missing ID: ${m}`);
    }
    console.log('──────────────────────');
    console.log('Summary:', JSON.stringify(summary));
    console.log('Badge:  ', badge);
  }

  process.exit(allPass ? 0 : 1);
}

main();
