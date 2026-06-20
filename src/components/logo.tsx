import Image from 'next/image';

// AuditGPT logo component.
// - variant="shield" → shield icon only (for favicon, small contexts)
// - variant="full" → full horizontal logo (shield + "AuditGPT" wordmark)
//
// The full logo is a single PNG (shield + wordmark) for crisp rendering.
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
  height = 28,
  priority = false,
}: LogoProps) {
  if (variant === 'shield') {
    return (
      <Image
        src="/logo-shield.png"
        alt="AuditGPT"
        width={height}
        height={height}
        priority={priority}
        className={className}
        style={{ height, width: 'auto' }}
      />
    );
  }

  // Full logo: 806x450 aspect ratio → width = height * 1.79
  const width = Math.round(height * 1.79);
  return (
    <Image
      src="/logo-full.png"
      alt="AuditGPT"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ height: 'auto', width: 'auto', maxHeight: height }}
    />
  );
}
