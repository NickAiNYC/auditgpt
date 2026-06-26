import Image from 'next/image';

// AuditGPT logo component.
// - variant="shield" → shield icon only (for favicon, small contexts)
// - variant="full" → full horizontal logo (shield + "AuditGPT" wordmark)
//
// The full logo composes the shield asset with live text for clearer headers.
// The shield-only version is a 256x256 crop used as favicon and small icons.

interface LogoProps {
  variant?: 'shield' | 'full';
  className?: string;
  // Height in pixels; width auto-scales to maintain aspect ratio.
  height?: number;
  priority?: boolean;
}

export function Logo({
  variant = 'full',
  className = '',
  height = 36,
  priority = false,
}: LogoProps) {
  const actualHeight = Math.max(36, height); // override the hardcoded 28px in the codebase

  if (variant === 'shield') {
    return (
      <Image
        src="/logo.svg"
        alt="AuditGPT"
        width={actualHeight}
        height={actualHeight}
        priority={priority}
        className={className}
        style={{ height: actualHeight, width: 'auto' }}
      />
    );
  }

  return (
    <span
      aria-label="AuditGPT"
      className={`inline-flex items-center gap-2.5 text-foreground ${className}`}
      style={{ height: actualHeight }}
    >
      <Image
        src="/logo.svg"
        alt=""
        width={actualHeight}
        height={actualHeight}
        priority={priority}
        aria-hidden="true"
        style={{ height: actualHeight * 1.15, width: actualHeight * 1.15 }}
      />
      <span
        className="font-bold leading-none tracking-tight"
        style={{ fontSize: Math.max(20, Math.round(actualHeight * 0.85)) }}
      >
        AuditGPT
      </span>
    </span>
  );
}
