'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  publicId: string;
  companyName: string;
  claimsReviewed?: number;
}

// Native share buttons for X (Twitter) and LinkedIn.
// Pre-fills observational copy describing what the AuditGPT review covered.
// Includes a "Copy link" fallback.
export function ShareButtons({ publicId, companyName, claimsReviewed }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/audit/${publicId}` : '';
  const scopeStr = claimsReviewed ? ` ${claimsReviewed} claims reviewed.` : '';
  const shareText = `AuditGPT Visibility & Trust Review for ${companyName}.${scopeStr} Claim Intelligence:`;

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const logShare = () => {
    // Fire-and-forget. Never block the share on the log.
    fetch(`/api/snapshot-shared/${publicId}`, { method: 'POST' }).catch(() => {});
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      logShare();
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-2">
        Share
      </span>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={logShare}
        className="inline-flex items-center gap-1.5 text-xs font-medium border border-border hover:border-black px-3 py-1.5 rounded-sm transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Post on X
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={logShare}
        className="inline-flex items-center gap-1.5 text-xs font-medium border border-border hover:border-black px-3 py-1.5 rounded-sm transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
        </svg>
        Share on LinkedIn
      </a>
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 text-xs font-medium border border-border hover:border-black px-3 py-1.5 rounded-sm transition-colors"
      >
        {copied ? '✓ Copied' : 'Copy link'}
      </button>
    </div>
  );
}
