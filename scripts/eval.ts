#!/usr/bin/env tsx
// AuditGPT contract eval runner (Scrutexity v2)
//   npx tsx scripts/eval.ts            # recorded mode (CI, deterministic)
//   npx tsx scripts/eval.ts --json     # machine-readable report to stdout
// Exit code is non-zero if any hard check fails, so CI blocks regressions.

import { runContract, type ContractReport } from '../src/lib/eval/contract';
import { FIXTURES } from '../src/lib/eval/fixtures';

interface PerFixture {
  id: string;
  pass: boolean;
  report: ContractReport;
}

function main() {
  const jsonOut = process.argv.includes('--json');
  const results: PerFixture[] = [];

  for (const fx of FIXTURES) {
    const report = runContract(fx.output);
    results.push({ id: fx.id, pass: report.pass, report });
  }

  const n = results.length;
  const schemaTotal = results.reduce((a, r) => a + r.report.schema.length, 0);
  const forbiddenTotal = results.reduce((a, r) => a + r.report.forbiddenPhrases.length, 0);
  const structuralTotal = results.reduce((a, r) => a + r.report.structural.length, 0);
  const allPass = results.every((r) => r.pass);

  const summary = {
    runAt: new Date().toISOString(),
    audits: n,
    schemaViolations: schemaTotal,
    forbiddenPhraseViolations: forbiddenTotal,
    structuralViolations: structuralTotal,
    pass: allPass,
  };

  const badge =
    `${forbiddenTotal} forbidden phrases, ${schemaTotal} schema violations, ` +
    `${structuralTotal} structural violations across ${n} audits ` +
    `(run ${summary.runAt.slice(0, 10)}).`;

  if (jsonOut) {
    console.log(JSON.stringify({ summary, badge, results }, null, 2));
  } else {
    console.log('AuditGPT contract eval (Scrutexity v2)');
    console.log('──────────────────────');
    for (const r of results) {
      console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.id}`);
      for (const v of r.report.schema) console.log(`        schema: ${v.field} → ${v.detail}`);
      for (const v of r.report.forbiddenPhrases) console.log(`        forbidden: ${v.field} → "${v.detail}"`);
      for (const v of r.report.structural) console.log(`        structural: ${v.field} → ${v.detail}`);
    }
    console.log('──────────────────────');
    console.log('Summary:', JSON.stringify(summary));
    console.log('Badge:  ', badge);
  }

  process.exit(allPass ? 0 : 1);
}

main();
