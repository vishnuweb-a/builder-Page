import type { ReactNode } from 'react';
import { cx } from '@/lib/cx.ts';

export type SectionTone = 'mist' | 'sage' | 'ivory' | 'raised' | 'forest' | 'charcoal';
export type SectionRhythm = 'default' | 'large' | 'flush';

/**
 * Six surfaces, running light green → warm paper → green → ink.
 *
 * The two green grounds are what keep the light palette from flattening: a page
 * that is one green everywhere has no depth, and a page that alternates only
 * between two ivories has lost the direction it was supposed to take. `mist` is
 * the page ground itself, so a section using it sits flush with the body and
 * reads as continuous space rather than as another band.
 */
const tones: Record<SectionTone, string> = {
  mist: 'bg-sage-mist text-charcoal',
  sage: 'bg-sage text-charcoal',
  ivory: 'bg-ivory text-charcoal',
  raised: 'bg-ivory-raised text-charcoal',
  forest: 'surface-dark bg-forest text-ivory',
  charcoal: 'surface-dark bg-charcoal text-ivory',
};

const rhythms: Record<SectionRhythm, string> = {
  default: 'py-section',
  large: 'py-section-lg',
  flush: 'py-0',
};

interface SectionProps {
  children: ReactNode;
  /** Anchor target for the nav. */
  id?: string;
  tone?: SectionTone;
  rhythm?: SectionRhythm;
  /** Accessible name for the landmark, when the visible heading is not enough. */
  label?: string;
  className?: string;
}

/**
 * Vertical rhythm and surface tone in one place.
 *
 * Sections never set their own `py-*`. That is the whole point: consistent
 * spacing across the page comes from there being exactly three rhythm options.
 * `surface-dark` is attached automatically on dark tones so focus rings and
 * hairlines invert without each section remembering to do it.
 */
export function Section({
  children,
  id,
  tone = 'ivory',
  rhythm = 'default',
  label,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cx('relative w-full', tones[tone], rhythms[rhythm], className)}
    >
      {children}
    </section>
  );
}
