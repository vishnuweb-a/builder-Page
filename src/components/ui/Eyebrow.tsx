import type { ReactNode } from 'react';
import { cx } from '@/lib/cx.ts';

interface EyebrowProps {
  children: ReactNode;
  /** Prefix the label with a short champagne rule. */
  rule?: boolean;
  className?: string;
}

/**
 * Small tracked label — "SECTOR 150 · NOIDA".
 * The optional leading rule is the brochure's own device for section openers.
 */
export function Eyebrow({ children, rule = false, className }: EyebrowProps) {
  return (
    <p className={cx('t-eyebrow flex items-center gap-4 text-gold', className)}>
      {rule && <span aria-hidden="true" className="h-px w-10 shrink-0 bg-gold" />}
      <span>{children}</span>
    </p>
  );
}
