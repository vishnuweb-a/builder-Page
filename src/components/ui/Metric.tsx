import { cx } from '@/lib/cx.ts';

interface MetricProps {
  /** The figure. Always pre-formatted — see src/lib/format.ts. */
  value: string;
  label: string;
  className?: string;
}

/**
 * A large figure over a small tracked label.
 *
 * docs/design.md §27 asks for specifications presented as evidence of space
 * rather than as a table, so dimensions get display-serif numerals at the size
 * of a heading instead of a row in a spec sheet.
 */
export function Metric({ value, label, className }: MetricProps) {
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <span className="t-numeral text-forest [.surface-dark_&]:text-ivory">{value}</span>
      <span className="t-eyebrow text-charcoal/65 [.surface-dark_&]:text-ivory/75">{label}</span>
    </div>
  );
}
