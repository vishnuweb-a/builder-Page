import type { ElementType, ReactNode } from 'react';
import { cx } from '@/lib/cx.ts';

export type ContainerWidth = 'narrow' | 'content' | 'wide' | 'bleed';

const widths: Record<ContainerWidth, string> = {
  /** Editorial text column. */
  narrow: 'max-w-narrow',
  /** Standard content frame — the default. */
  content: 'max-w-content',
  /** Near-full-bleed, for large architectural imagery. */
  wide: 'max-w-wide',
  /** Edge-to-edge. No max width, no gutter. */
  bleed: 'max-w-none',
};

interface ContainerProps {
  children: ReactNode;
  width?: ContainerWidth;
  /** Drop the horizontal gutter — lets imagery run to the viewport edge. */
  flush?: boolean;
  as?: ElementType;
  className?: string;
}

/**
 * The one horizontal-rhythm primitive.
 *
 * docs/design.md §7 asks for editorial composition rather than a uniform card
 * grid, so `bleed` and `flush` exist to let imagery escape the content frame
 * deliberately, instead of every section inventing its own negative margins.
 */
export function Container({
  children,
  width = 'content',
  flush = false,
  as: Tag = 'div',
  className,
}: ContainerProps) {
  return (
    <Tag
      className={cx(
        'mx-auto w-full',
        widths[width],
        !flush && width !== 'bleed' && 'px-gutter',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
