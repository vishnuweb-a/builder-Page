/**
 * Provenance layer.
 *
 * Every project claim on this page must be traceable. The research phase found
 * that one headline number (the ₹/sq ft campaign price) exists only in our own
 * docs and is absent from the brochure. Rather than leave that as a note in a
 * markdown file, provenance is encoded in the type system: a `Fact` cannot be
 * rendered without going through `publish()`, and `publish()` returns `null`
 * for anything still marked unverified.
 */

export type Provenance =
  /** Printed in the ATS Kingston Heath brochure. Highest confidence. */
  | 'brochure'
  /** Stated in docs/prd.md or docs/design.md. Marketing-owned copy. */
  | 'docs'
  /** Not yet confirmed against a primary source. Must not be published. */
  | 'unverified';

export interface Fact<T> {
  readonly value: T;
  readonly source: Provenance;
  /** Why this provenance, or what still needs checking. */
  readonly note?: string;
}

export const brochure = <T>(value: T, note?: string): Fact<T> => ({
  value,
  source: 'brochure',
  note,
});

export const docs = <T>(value: T, note?: string): Fact<T> => ({
  value,
  source: 'docs',
  note,
});

/** An explanation of what must be verified is mandatory. */
export const unverified = <T>(value: T, note: string): Fact<T> => ({
  value,
  source: 'unverified',
  note,
});

/**
 * The publication gate. Returns the value, or `null` when the fact has not
 * been verified — callers render nothing (or a fallback) in that case.
 */
export const publish = <T>(f: Fact<T>): T | null =>
  f.source === 'unverified' ? null : f.value;

/** Every fact that is currently blocked from rendering. Used by the audit view. */
export const pendingVerification = (facts: Record<string, Fact<unknown>>): string[] =>
  Object.entries(facts)
    .filter(([, f]) => f.source === 'unverified')
    .map(([key, f]) => `${key}: ${f.note ?? 'no note'}`);
