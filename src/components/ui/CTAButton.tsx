import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx.ts';

export type CTAVariant = 'primary' | 'gold' | 'secondary' | 'quiet';
export type CTASize = 'md' | 'lg';

/**
 * Variant styles.
 *
 * Square corners, uppercase tracked label, and a champagne hairline that draws
 * itself in on hover. docs/design.md §11 asks for a CTA that reads as a premium
 * invitation rather than a sales button, so there is no scale-up, no shadow
 * bloom and no gradient — the only movement is a 1px rule and a 1px lift.
 */
const variants: Record<CTAVariant, string> = {
  primary: cx(
    'bg-forest text-ivory',
    'hover:bg-forest-deep',
    'disabled:bg-stone disabled:text-charcoal/45',
  ),
  /**
   * For use ON the deep green — a forest button on a forest bar would vanish.
   * Forest-on-champagne measures 4.8:1, so the label stays AA at 13px.
   * Defined as its own variant rather than as overrides on `primary`: two
   * competing text-colour utilities resolve by stylesheet order, not by intent,
   * and that quietly shipped ivory-on-gold at 2.1:1.
   */
  gold: cx('bg-gold text-forest', 'hover:bg-gold/85', 'disabled:bg-stone disabled:text-charcoal/45'),
  secondary: cx(
    'bg-transparent text-charcoal border border-charcoal/25',
    'hover:border-charcoal/60',
    // On a dark surface the border and label flip to ivory.
    '[.surface-dark_&]:text-ivory [.surface-dark_&]:border-ivory/30',
    '[.surface-dark_&]:hover:border-ivory/70',
    'disabled:border-stone disabled:text-charcoal/40',
  ),
  quiet: cx(
    'bg-transparent text-charcoal px-0',
    '[.surface-dark_&]:text-ivory',
    'disabled:text-charcoal/40',
  ),
};

const sizes: Record<CTASize, string> = {
  // 52px — above the 44px minimum touch target.
  md: 'min-h-13 px-7',
  // 56px — the hero and modal submit.
  lg: 'min-h-14 px-9',
};

const base = cx(
  'group relative inline-flex items-center justify-center gap-3',
  't-button rounded-edge',
  'cursor-pointer select-none',
  'transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
  'active:translate-y-px',
  'disabled:pointer-events-none disabled:active:translate-y-0',
);

/** The champagne hairline. Purely decorative, so it is hidden from a11y. */
function HoverRule({ variant }: { variant: CTAVariant }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'pointer-events-none absolute bottom-0 h-px origin-left scale-x-0 bg-gold',
        'transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]',
        'group-hover:scale-x-100 group-focus-visible:scale-x-100',
        'group-disabled:hidden',
        variant === 'quiet' ? 'inset-x-0' : 'inset-x-4',
      )}
    />
  );
}

type CommonProps = {
  children: ReactNode;
  variant?: CTAVariant;
  size?: CTASize;
  className?: string;
};

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string;
  };

export type CTAButtonProps = ButtonProps | LinkProps;

export function CTAButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: CTAButtonProps) {
  const classes = cx(base, variants[variant], sizes[size], className);
  const content = (
    <>
      <span>{children}</span>
      <HoverRule variant={variant} />
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
      {content}
    </button>
  );
}
