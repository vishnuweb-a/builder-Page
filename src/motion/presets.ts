/**
 * Motion constants.
 *
 * Mirrors the --dur-* / --ease-* custom properties in src/index.css. CSS owns
 * transitions (hover, focus); this file owns Anime.js. Keep the two in sync.
 *
 * The vocabulary is deliberately small: docs/design.md §17 asks for motion that
 * is "slow, smooth, architectural, controlled" — that comes from reusing four
 * durations and two curves everywhere, not from per-component invention.
 */

export const duration = {
  fast: 220,
  base: 600,
  slow: 1200,
  cinematic: 1600,
} as const;

export const ease = {
  /** Default. Decisive start, long settle — reads as "expensive". */
  out: 'outQuart',
  /** Longer tail, for text and entrances. */
  outLong: 'outExpo',
  /** Symmetric, for hairlines and scroll-synced movement. */
  inOut: 'inOutQuad',
  /** Exits are faster and flatter than entrances. */
  in: 'inQuad',
} as const;

/** Travel distances, in px. Small on purpose — this is not a slide deck. */
export const distance = {
  /** Body copy, list items. */
  sm: 16,
  /** Headlines, figures. */
  md: 24,
  /** Section-level blocks. */
  lg: 40,
} as const;

export const staggerMs = {
  tight: 45,
  text: 80,
  loose: 120,
} as const;

/**
 * Default scroll-trigger threshold: start when the element's top passes 85% of
 * the viewport height — visible, but not so late that the reveal is missed.
 */
export const SCROLL_ENTER = 'bottom-=15% top' as const;
