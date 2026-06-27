import Image from 'next/image';

// AuditGPT logo component.
// - variant="shield" → shield icon only
// - variant="full" → shield icon + "AuditGPT" wordmark

interface LogoProps {
  variant?: 'shield' | 'full';
  className?: string;
  height?: number;
  priority?: boolean;
}

export function Logo({
  variant = 'full',
  className = '',
  height = 28,
  priority = false,
}: LogoProps) {
  // 33% larger
  const iconSize = Math.max(20, Math.round(height * 1.33));

  if (variant === 'shield') {
    return (
      <Image
        src="/logo-shield.png"
        alt="AuditGPT"
        width={iconSize}
        height={iconSize}
        priority={priority}
        className={className}
        style={{
          display: 'block',
          flexShrink: 0,
          height: iconSize,
          width: iconSize,
          objectFit: 'contain',
        }}
      />
    );
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height,
        flexShrink: 0,
      }}
    >
      <Image
        src="/logo-shield.png"
        alt=""
        width={iconSize}
        height={iconSize}
        priority={priority}
        style={{
          display: 'block',
          flexShrink: 0,
          height: iconSize,
          width: iconSize,
          objectFit: 'contain',
        }}
      />
      <span
        style={{
          fontWeight: 600,
          fontSize: Math.max(14, height * 0.65),
          letterSpacing: '-0.01em',
          color: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        AuditGPT
      </span>
    </span>
  );
}
