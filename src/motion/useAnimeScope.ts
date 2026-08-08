import { useEffect, useRef, type DependencyList, type RefObject } from 'react';
import { createScope } from 'animejs';
import { prefersReducedMotion } from './useReducedMotion.ts';

export interface MotionContext {
  /** True when the user has asked for reduced motion. Skip movement entirely. */
  readonly reduced: boolean;
  /** The scope root. Selectors inside `setup` are scoped to this subtree. */
  readonly root: HTMLElement;
}

/**
 * Binds an Anime.js scope to a component's lifetime.
 *
 * Everything created inside `setup` is reverted on unmount, which cleans up
 * inline styles, scroll observers and split-text wrappers in one call — the
 * main source of leaks when Anime.js is used ad hoc inside components.
 *
 * Usage:
 *   const ref = useAnimeScope(({ reduced }) => {
 *     if (reduced) return;
 *     revealUp('[data-reveal]');
 *   });
 *   return <section ref={ref}>…</section>;
 */
export function useAnimeScope<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: MotionContext) => void,
  deps: DependencyList = [],
): RefObject<T | null> {
  const root = useRef<T | null>(null);

  // Held in a ref so callers can pass an inline closure without re-running the
  // whole scope on every render. `useRef(setup)` already holds the correct
  // value on mount; this effect only keeps it fresh afterwards.
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = prefersReducedMotion();
    const scope = createScope({ root: el }).add(() => {
      setupRef.current({ reduced, root: el });
    });

    return () => {
      scope.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return root;
}
