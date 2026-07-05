'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { AuditResult, Claim } from '@/lib/audit-schema';

const ACCENT = 'text-[#0B3D2E]';
const ACCENT_BG = 'bg-[#0B3D2E]';

// Pick the single most useful claim for a first-pass result:
// unsupported first, then overstated, then weakly supported.
function pickClaim(claims: Claim[]): Claim | null {
  const order = [
    'unsupported',
    'overstated',
    'weakly_supported',
    'insufficient_public_evidence',
  ];
  for (const status of order) {
    const match = claims.find((claim) => claim.claim_status === status);
    if (match) return match;
  }
  return claims[0] ?? null;
}

function statusLabel(status: Claim['claim_status']): string {
  switch (status) {
    case 'unsupported':
      return 'Unsupported claim';
    case 'overstated':
      return 'Overstated claim';
    case 'weakly_supported':
    case 'insufficient_public_evidence':
      return 'Weakly supported claim';
    default:
      return 'Reviewed claim';
  }
}

function Finding({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 border-b border-[#EAEAEA] py-8 sm:grid-cols-[180px_1fr]">
      <div>
        <div className="text-xs font-mono text-neutral-400">{index}</div>
        <div className={`mt-1 text-sm font-semibold ${ACCENT}`}>{label}</div>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function EmailCapture({ publicId }: { publicId: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/scan-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, email: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not send the scan.');
      }
      setState('done');
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err.message || 'Could not send the scan.');
      setState('idle');
    }
  };

  if (state === 'done') {
    return (
      <div className="border-b border-[#EAEAEA] py-8 text-sm leading-6 text-neutral-600">
        A full copy of this scan is on its way to <span className="font-medium text-black">{email.trim()}</span>.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border-b border-[#EAEAEA] py-8">
      <label
        htmlFor="scan-email"
        className="block text-sm font-medium text-black"
      >
        Email me the full copy of this scan.
      </label>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="scan-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          disabled={state === 'sending'}
          className="h-12 flex-1 border border-[#DADADA] bg-white px-4 text-base text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex h-12 items-center justify-center border border-black bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === 'sending' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            'Send my copy'
          )}
        </button>
      </div>
    </form>
  );
}

export function FirstPassReport({
  audit,
  websiteUrl,
  publicId,
  createdAt,
}: {
  audit: AuditResult;
  websiteUrl: string;
  publicId: string;
  createdAt?: Date;
}) {
  const claim = pickClaim(audit.claim_audit?.claims ?? []);
  const proofGap =
    claim?.support_gap ||
    audit.support_gaps?.[0] ||
    'No visible proof gap was identified on this page.';
  const saferRewrite = claim?.safer_framing || '';
  const sourceUrl = claim?.source_url || websiteUrl;
  const timestamp = createdAt
    ? new Date(createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Just now';

  return (
    <div className="mx-auto max-w-3xl">
      <div className="border border-[#DADADA] bg-white px-6 py-10 sm:px-10">
        {/* Document header */}
        <div className="border-b border-[#EAEAEA] pb-8">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            First-pass scan
          </div>
          <h1 className="mt-3 break-words text-2xl font-semibold tracking-[-0.02em] text-black sm:text-3xl">
            {websiteUrl}
          </h1>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <dt className="w-32 shrink-0 text-neutral-500">Source URL</dt>
              <dd className="min-w-0 break-all font-medium text-black">{sourceUrl}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <dt className="w-32 shrink-0 text-neutral-500">Scanned</dt>
              <dd className="font-medium text-black">{timestamp}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <dt className="w-32 shrink-0 text-neutral-500">Scope</dt>
              <dd className="font-medium text-black">Public pages only · read-only · first pass</dd>
            </div>
          </dl>
        </div>

        {/* Findings */}
        {claim ? (
          <Finding index="01" label={statusLabel(claim.claim_status)}>
            <p className="text-lg font-medium leading-7 text-black">
              &ldquo;{claim.original_text}&rdquo;
            </p>
          </Finding>
        ) : (
          <Finding index="01" label="Claims reviewed">
            <p className="text-base leading-7 text-neutral-600">
              No individual claims could be extracted from this page in the first pass.
            </p>
          </Finding>
        )}

        <Finding index="02" label="Visible proof gap">
          <p className="text-base leading-7 text-neutral-700">{proofGap}</p>
        </Finding>

        {saferRewrite ? (
          <Finding index="03" label="Safer rewrite">
            <p className="text-lg font-medium leading-7 text-black">
              &ldquo;{saferRewrite}&rdquo;
            </p>
          </Finding>
        ) : null}

        {/* Email capture — after the result, never before */}
        <EmailCapture publicId={publicId} />

        {/* Disclaimer */}
        <p className="pt-8 text-xs leading-5 text-neutral-500">
          This is a first-pass public-claims review, not legal, medical, regulatory,
          or financial advice. Absence of visible public evidence is reported as a
          proof gap, not a finding of falsity.
        </p>
      </div>

      {/* Conversion CTA */}
      <div className="mt-10 border-t border-[#EAEAEA] pt-10 text-center">
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-black">
          Need the full review?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-600">
          Get a Claim Intelligence Report: every claim on the page mapped to visible
          proof, with safer rewrites for each gap.
        </p>
        <a
          href={`/pricing?publicId=${publicId}`}
          className={`mt-6 inline-flex items-center justify-center ${ACCENT_BG} px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-black`}
        >
          Get a Claim Intelligence Report
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
