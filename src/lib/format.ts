/**
 * Formatting helpers.
 *
 * `formatFeetInches` exists to prevent a specific, real bug: docs/prd.md §8 and
 * docs/design.md §27 transcribe the brochure's 14'-9" × 16'-4" as "14.9 × 16.4
 * FT", which reads as decimal feet and is wrong. Storing feet and inches as
 * separate numbers makes that mistake structurally impossible.
 */

/** [feet, inches] */
export type FeetInches = readonly [number, number];

/** 14, 9 → 14′9″ (true primes, not straight quotes) */
export const formatFeetInches = ([feet, inches]: FeetInches): string =>
  inches === 0 ? `${feet}′` : `${feet}′${inches}″`;

/** Renders a room as 14′9″ × 16′4″ */
export const formatDimension = (w: FeetInches, d: FeetInches): string =>
  `${formatFeetInches(w)} × ${formatFeetInches(d)}`;

/** 3300 → "3,300" (Indian digit grouping) */
export const formatNumber = (n: number): string => new Intl.NumberFormat('en-IN').format(n);

/** 16500 → "₹16,500" */
export const formatRupees = (n: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
