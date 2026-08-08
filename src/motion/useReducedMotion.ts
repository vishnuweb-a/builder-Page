import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Imperative read, for use inside Anime.js setup callbacks where hooks cannot
 * run. SSR-safe: assumes reduced motion when `window` is unavailable, so the
 * cautious path is the default.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window === 'undefined' || !window.matchMedia
    ? true
    : window.matchMedia(QUERY).matches;

const subscribe = (onChange: () => void): (() => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

/**
 * Reactive version for render-time branching. Updates live if the user changes
 * the OS setting while the page is open.
 */
export const useReducedMotion = (): boolean =>
  useSyncExternalStore(subscribe, prefersReducedMotion, () => true);
