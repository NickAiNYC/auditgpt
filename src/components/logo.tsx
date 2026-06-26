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
  const actualHeight = Math.max(36, height); 
  const displayHeight = actualHeight * 1.1; 

  if (variant === 'shield') {
    return (
      <Image
        src="/logo-shield.png"
        alt="AuditGPT"
        width={displayHeight}
        height={displayHeight}
        priority={priority}
        className={`mix-blend-multiply dark:invert ${className}`}
        style={{ 
          height: displayHeight, 
          width: 'auto',
          filter: 'grayscale(100%) contrast(500%) brightness(120%)',
          transform: 'scale(2.2)',
          transformOrigin: 'left center'
        }}
      />
    );
  }

  // Render the full logo which contains both the shield and the text
  return (
    <span
      aria-label="AuditGPT"
      className={`inline-flex items-center text-foreground ${className}`}
      style={{ height: actualHeight }}
    >
      <Image
        src="/logo-full.png"
        alt="AuditGPT"
        width={displayHeight * 4} 
        height={displayHeight}
        priority={priority}
        className="mix-blend-multiply dark:invert"
        style={{ 
          height: displayHeight, 
          width: 'auto',
          objectFit: 'contain',
          filter: 'grayscale(100%) contrast(500%) brightness(120%)',
          transform: 'scale(2.2)',
          transformOrigin: 'left center'
        }}
      />
    </span>
  );
}
