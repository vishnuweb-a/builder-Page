import { useSyncExternalStore } from 'react';

/**
 * Reactive media query. Used where a breakpoint changes *behaviour* rather than
 * styling — Tailwind variants remain the right tool for anything purely visual.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () =>
      typeof window === 'undefined' || !window.matchMedia
        ? serverValue
        : window.matchMedia(query).matches,
    () => serverValue,
  );
}
