'use client';

// Inline "Verified by AuditGPT" badge component for the audit dashboard.
// If `verified` is true, shows the green shield badge.
// If `verified` is false but `canVerify` is true, shows the "Verify now" button.
// If neither, shows nothing.

import { useState } from 'react';
import { ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface VerificationBadgeProps {
  publicId: string | null | undefined;
  verified: boolean;
  // Whether the current audit passes verification criteria (per the client-side check).
  // The server is the source of truth — this is just for the button label.
  canVerifyClient?: boolean;
}

export function VerificationBadge({
  publicId,
  verified,
  canVerifyClient,
}: VerificationBadgeProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(verified);

  if (!publicId) return null;

  const handleVerify = async () => {
    if (!publicId || isVerifying) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/verify?publicId=${publicId}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      if (data.verified) {
        setIsVerified(true);
        toast.success('Site verified — badge is now active');
      } else {
        toast.error(`Verification failed: ${data.reason}`);
      }
    } catch (e: any) {
      toast.error(e.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerified) {
    return (
      <a
        href={`/verified/${publicId}`}
        className="verified-badge"
        title="View verification page"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Verified by AuditGPT
      </a>
    );
  }

  return (
    <button
      onClick={handleVerify}
      disabled={isVerifying}
      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border hover:border-black px-3 py-1.5 rounded-sm transition-colors disabled:opacity-50"
      title={
        canVerifyClient
          ? 'Run verification check'
          : 'Run verification check (likely to fail based on current grade)'
      }
    >
      {isVerifying ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> Verifying...
        </>
      ) : (
        <>
          <ShieldCheck className="h-3 w-3" /> Verify
        </>
      )}
    </button>
  );
}

// Helper: client-side check of verification criteria (for button label hint).
// Mirrors the server-side logic in lib/audit-persistence.ts evaluateVerification().
export function canVerifyAudit(audit: {
  grade_stamp?: string;
  verdict?: string;
  score?: number;
  verdict_header?: string;
  red_flags?: string[];
  slop_markers?: { detected?: boolean };
}): boolean {
  const grade = (audit.grade_stamp || audit.verdict || 'F').toUpperCase();
  const gradePasses = ['A+', 'A', 'A-', 'B+', 'B', 'B-'].includes(grade);
  // Prefer dedicated score field; fall back to regex parse for back-compat.
  let score: number;
  if (typeof audit.score === 'number' && !isNaN(audit.score)) {
    score = audit.score;
  } else {
    const scoreMatch = audit.verdict_header?.match(/\((\d{1,3})\/100\)/);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  }
  const scorePasses = score >= 70;
  const noCriticalRedFlags = !audit.red_flags?.some((f) => /critical/i.test(f));
  const noSlopMarkers = !audit.slop_markers?.detected;
  return gradePasses && scorePasses && noCriticalRedFlags && noSlopMarkers;
}
