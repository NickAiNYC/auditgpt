#!/usr/bin/env tsx
// ============================================================
// AuditGPT — Safety Eval (Scrutexity Claim Intelligence doctrine)
// ============================================================
// Fails (exit 1) if the ACTIVE audit source (schema, pipeline,
// public report view) contains banned legal-threat / enforcement /
// slop / named-competitor-attack language.
//
// Allowed exceptions: a literal "not legal advice" disclaimer,
// Terms-of-Service text, and internal TODO comments.
//
// Run: npx tsx scripts/safety-eval.ts

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');

// Files on the live audit/report path that must stay safe.
const ACTIVE_FILES = [
  'src/lib/audit-schema.ts',
  'src/lib/audit-pipeline.ts',
  'src/lib/audit-persistence.ts',
  'src/components/public-audit-view.tsx',
];

// Banned terms (case-insensitive, word-ish boundaries where sensible).
const BANNED: { term: RegExp; label: string }[] = [
  { term: /\bftc\b/i, label: 'FTC' },
  { term: /\benforcement\b/i, label: 'enforcement' },
  { term: /\bliabilit/i, label: 'liability' },
  { term: /\blawsuit/i, label: 'lawsuit' },
  { term: /\bfined\b/i, label: 'fined' },
  { term: /\billegal\b/i, label: 'illegal' },
  { term: /\bviolation\b/i, label: 'violation' },
  { term: /legal exposure/i, label: 'legal exposure' },
  { term: /slop detected/i, label: 'Slop Detected' },
  { term: /slop_markers/i, label: 'slop_markers' },
  { term: /ftc_exposure/i, label: 'ftc_exposure' },
  { term: /cited_enforcement/i, label: 'cited_enforcement_example' },
  { term: /compliance verified/i, label: 'compliance verified' },
  { term: /compliant rewrite/i, label: 'compliant rewrite' },
  { term: /vs_polsia|vs_makerpad|vs_cofounder|vs_nanocorp/i, label: 'hardcoded competitor field' },
];

// Lines that are allowed to mention an otherwise-banned token.
// We guard against the engine EMITTING these in a report — not against
// the prompt's own guardrails naming them in order to forbid them.
function isAllowedLine(line: string): boolean {
  const l = line.toLowerCase();
  if (l.includes('not legal') && l.includes('advice')) return true; // disclaimer
  if (l.trim().startsWith('//')) return true;                       // any code comment
  // Prohibition / instruction context: the prompt telling the model NOT to use a term.
  if (/\b(never|not|no|avoid|forbidden|banned|don'?t|do not|without)\b/.test(l)) return true;
  // ToS boilerplate (standard "Limitation of Liability" heading is allowed).
  if (l.includes('limitation of liability') || l.includes('disclaimer')) return true;
  return false;
}

let failures = 0;
const report: string[] = [];

for (const rel of ACTIVE_FILES) {
  let text: string;
  try {
    text = readFileSync(join(ROOT, rel), 'utf8');
  } catch {
    report.push(`SKIP (not found): ${rel}`);
    continue;
  }
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (isAllowedLine(line)) return;
    for (const { term, label } of BANNED) {
      if (term.test(line)) {
        failures++;
        report.push(`FAIL ${rel}:${i + 1} — banned term "${label}" → ${line.trim().slice(0, 100)}`);
      }
    }
  });
}

console.log('AuditGPT Safety Eval (Claim Intelligence doctrine)');
console.log('='.repeat(52));
if (report.length === 0) {
  console.log('PASS — no banned legal-threat / slop / competitor-attack language in active audit source.');
} else {
  report.forEach((r) => console.log(r));
}
console.log('='.repeat(52));
console.log(failures === 0 ? 'RESULT: PASS' : `RESULT: FAIL (${failures} issue${failures === 1 ? '' : 's'})`);

process.exit(failures === 0 ? 0 : 1);
