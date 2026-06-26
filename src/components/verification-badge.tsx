'use client';

// ============================================================
// AuditGPT Report Review Badge (Scrutexity v2)
// ============================================================
// Replaces the old "Verified by AuditGPT" trust badge.
// Now: a scoped report-review chip that links to the public
// report and (optionally) the badge SVG endpoint. The badge
// states what was checked (claim count, supported, etc.).
// It does NOT certify truth, ranking, or AI visibility.
// ============================================================

import { useState } from 'react';
import { ScrollText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReportReviewBadgeProps {
  publicId: string | null | undefined;
  available: boolean;
  // Optional summary string shown inside the chip ("12 claims reviewed")
  scopeLabel?: string;
}

export function VerificationBadge({
  publicId,
  available,
  scopeLabel,
}: ReportReviewBadgeProps) {
  const [issuing, setIssuing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(available);

  if (!publicId) return null;

  const handleIssue = async () => {
    if (!publicId || issuing) return;
    setIssuing(true);
    try {
      const res = await fetch(`/api/verify?publicId=${publicId}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not issue report review');
      setIsAvailable(true);
      toast.success('Report review issued.');
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err.message || 'Could not issue report review');
    } finally {
      setIssuing(false);
    }
  };

  if (isAvailable) {
    return (
      <a
        href={`/verified/${publicId}`}
        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-foreground border border-border hover:border-black px-3 py-1.5 rounded-sm transition-colors"
        title="View public report review"
      >
        <ScrollText className="h-3.5 w-3.5" />
        AuditGPT Report Review{scopeLabel ? ` · ${scopeLabel}` : ''}
      </a>
    );
  }

  return (
    <button
      onClick={handleIssue}
      disabled={issuing}
      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border hover:border-black px-3 py-1.5 rounded-sm transition-colors disabled:opacity-50"
      title="Publish a public report review for this audit"
    >
      {issuing ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> Issuing...
        </>
      ) : (
        <>
          <ScrollText className="h-3 w-3" /> Issue report review
        </>
      )}
    </button>
  );
}

// Legacy helper kept so older imports compile. Now: always returns true
// (any audit can have a report review issued; criteria are no longer
// grade-based). New code should not call this.
export function canVerifyAudit(_audit: unknown): boolean {
  return true;
}
