import { Eyebrow } from './Eyebrow.tsx';
import { pricing, publish, sections } from '@/content/index.ts';
import { formatRupees } from '@/lib/format.ts';
import { cx } from '@/lib/cx.ts';

/**
 * The price, if there is one to show.
 *
 * There is not. ₹16,500/sq ft appears in docs/prd.md and docs/design.md but
 * nowhere in the brochure, and its basis (super or carpet) is unstated, so
 * `pricing.perSqFt` is marked `unverified` and `publish()` returns null — this
 * component renders nothing at all.
 *
 * It exists anyway, mounted where the price belongs, so that confirming the
 * figure with ATS sales is a one-line change to src/content/project.ts and not
 * a redesign of the residences header. Do NOT invent a "starting from" value to
 * fill the gap, and do not read `pricing.perSqFt.value` directly to get around
 * the gate.
 */
export function PriceLine({ className }: { className?: string }) {
  const price = publish(pricing.perSqFt);
  if (!price) return null;

  return (
    <div className={cx('flex flex-col gap-3', className)}>
      <Eyebrow>Starting from</Eyebrow>
      <p className="t-numeral text-forest [.surface-dark_&]:text-ivory">
        {formatRupees(price.amount)}
        <span className="t-eyebrow ml-3 text-charcoal/65 [.surface-dark_&]:text-ivory/75">
          / sq ft
        </span>
      </p>
      <p className="t-fine max-w-sm text-charcoal/65 [.surface-dark_&]:text-ivory/75">
        {sections.regulatory.priceBasisNote} {pricing.disclaimer.value}
      </p>
    </div>
  );
}
