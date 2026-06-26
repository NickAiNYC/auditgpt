// ============================================================
// AuditGPT — Shared audit context
// ============================================================

export function sanitizeInput(input: string, maxLength = 2000): string {
  if (!input) return '';
  let s = input.slice(0, maxLength);
  // Strip common prompt-injection markers
  s = s.replace(/<\|im_start\|>/gi, '');
  s = s.replace(/<\|im_end\|>/gi, '');
  s = s.replace(/\[system\]/gi, '[blocked]');
  s = s.replace(/\[assistant\]/gi, '[blocked]');
  s = s.replace(/```/g, '');
  // Strip control chars
  s = s.replace(/[ -   -  ]/g, '');
  return s.trim();
}

export function extractJson(raw: string): string {
  let out = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  const firstBrace = out.indexOf('{');
  const lastBrace = out.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    out = out.slice(firstBrace, lastBrace + 1);
  }
  return out;
}
