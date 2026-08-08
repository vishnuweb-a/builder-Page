import { animate, onScroll, splitText, stagger, utils, createTimeline } from 'animejs';
import type { TargetsParam } from 'animejs';
import { SCROLL_ENTER, distance, duration, ease, staggerMs } from './presets.ts';

/**
 * Reusable animation factories.
 *
 * Two rules hold this layer together:
 *
 * 1. Initial "hidden" states are applied HERE, in JavaScript, never in CSS.
 *    If JS fails or reduced motion is on, the page renders fully visible.
 *    A CSS `opacity: 0` default would leave a blank page on any script error.
 *
 * 2. Only opacity / transform / clip-path are animated, so everything stays on
 *    the compositor. No width, height, top or left.
 *
 * Every factory is a no-op-safe building block; callers gate on `reduced`
 * (see useAnimeScope) before invoking them.
 */

interface RevealOptions {
  /** Extra delay before the reveal starts, in ms. */
  delay?: number;
  /** Per-target stagger, in ms. */
  stagger?: number;
  /** Trigger on scroll instead of immediately. Defaults to true. */
  onEnter?: boolean;
  /** Element whose position drives the scroll trigger. Defaults to the target. */
  trigger?: TargetsParam;
  /**
   * Scope root. Selector strings are resolved inside it, matching the Anime
   * scope the caller is already running in.
   */
  root?: HTMLElement;
}

/**
 * Scroll trigger: play once, when the element rises past ~85% viewport height.
 *
 * `sync: 'play'` is essential. Anime's default is `'play pause'`, which pauses
 * the animation again as soon as the element leaves the viewport — so anything
 * scrolled past briskly freezes half-revealed and never finishes. Passing a
 * single method means play on enter and nothing on leave.
 */
const enterOnce = (target: TargetsParam) =>
  onScroll({ target, enter: SCROLL_ENTER, sync: 'play', repeat: false });

const autoplayFor = (opts: RevealOptions, target: TargetsParam) =>
  opts.onEnter === false ? true : enterOnce(opts.trigger ?? target);

/** Resolve a selector to concrete elements, scoped to `root` when given. */
function resolve(target: string | Element, root?: HTMLElement): HTMLElement[] {
  if (typeof target !== 'string') return [target as HTMLElement];
  return [...(root ?? document).querySelectorAll<HTMLElement>(target)];
}

/**
 * Content rising into place. The workhorse — headlines, paragraphs, list items.
 *
 * Each element gets its OWN scroll observer. One observer shared across a set
 * takes its position from the first element, so a group further down the page
 * fires at the wrong moment and can be left mid-animation — which is exactly
 * what happened with the residence specification lists. The stagger is applied
 * as an index-based delay instead of `stagger()`, which keeps the cascade for
 * items that enter together and behaves sensibly for items that do not.
 */
export function revealUp(target: string | Element, opts: RevealOptions = {}) {
  const els = resolve(target, opts.root);
  if (els.length === 0) return;

  utils.set(els, { opacity: 0, translateY: distance.md });
  const step = opts.stagger ?? staggerMs.tight;

  els.forEach((el, i) => {
    animate(el, {
      opacity: [0, 1],
      translateY: [distance.md, 0],
      duration: duration.base,
      delay: (opts.delay ?? 0) + i * step,
      ease: ease.out,
      autoplay: opts.onEnter === false ? true : enterOnce(opts.trigger ?? el),
    });
  });
}

/**
 * Headline reveal, line by line, each line rising out of a clipped band.
 * Returns the splitter so callers can `.revert()` early if needed; the owning
 * Anime scope reverts it automatically on unmount.
 */
export function revealText(target: string | Element, opts: RevealOptions = {}) {
  const split = splitText(target, {
    lines: { wrap: 'clip' },
    // Keeps an accessible copy of the original text for screen readers.
    accessible: true,
  });

  // Splitting into lines needs layout measurement, so `split.lines` is empty
  // on the tick it is created — animating it directly logs "No target found"
  // and silently does nothing. `addEffect` runs once the split is ready, and
  // re-runs it whenever the element reflows, so line breaks stay correct as
  // the viewport changes.
  split.addEffect((self: { lines: HTMLElement[] }) => {
    utils.set(self.lines, { opacity: 0, translateY: '100%' });

    return animate(self.lines, {
      opacity: [0, 1],
      translateY: ['100%', '0%'],
      duration: duration.slow,
      delay: stagger(opts.stagger ?? staggerMs.text, { start: opts.delay ?? 0 }),
      ease: ease.outLong,
      autoplay: autoplayFor(opts, target),
    });
  });

  return split;
}

/**
 * Architectural image reveal: a wipe from the bottom edge combined with a slow
 * settle out of a slight over-scale. This is the signature move of the page.
 *
 * The two halves are applied to different elements on purpose. The clip runs on
 * the frame; the over-scale runs on the `img` INSIDE it. Scaling the frame
 * itself makes the element 6% wider than its column, which pushes past the
 * viewport and creates horizontal scroll — the frame's `overflow-hidden` can
 * only contain the scale if the scale happens within it.
 *
 * `frameSelector` must therefore resolve to elements that clip their overflow;
 * <Figure> marks those with `data-figure`.
 */
export function revealImage(frameSelector: string, opts: RevealOptions = {}) {
  const frames = resolve(frameSelector, opts.root);
  if (frames.length === 0) return;

  frames.forEach((frame) => {
    const img = frame.querySelector('img');
    // One observer per frame, for the same reason as revealUp.
    const trigger = opts.onEnter === false ? true : enterOnce(opts.trigger ?? frame);

    utils.set(frame, { clipPath: 'inset(0% 0% 100% 0%)' });
    if (img) {
      utils.set(img, { scale: 1.06 });
      animate(img, {
        scale: [1.06, 1],
        duration: duration.cinematic,
        delay: opts.delay ?? 0,
        ease: ease.out,
        autoplay: opts.onEnter === false ? true : enterOnce(opts.trigger ?? frame),
      });
    }

    animate(frame, {
      clipPath: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
      duration: duration.cinematic,
      delay: opts.delay ?? 0,
      ease: ease.out,
      autoplay: trigger,
    });
  });
}

/**
 * Almost-imperceptible drift on a hero image. Desktop only, and never under
 * reduced motion — callers must check both.
 *
 * Target the figure's inner wrapper (`data-figure-inner`), not the `img`:
 * `revealImage` owns `scale` on the img, and two animations competing for one
 * property is a fight neither wins.
 */
export function imageDrift(target: TargetsParam) {
  return animate(target, {
    scale: [1, 1.03],
    duration: 12000,
    ease: 'linear',
    loop: true,
    alternate: true,
  });
}

/** Hairline rules drawing themselves left-to-right. */
export function drawRule(target: string | Element, opts: RevealOptions = {}) {
  const els = resolve(target, opts.root);
  if (els.length === 0) return;

  utils.set(els, { scaleX: 0, transformOrigin: '0% 50%' });

  els.forEach((el) => {
    animate(el, {
      scaleX: [0, 1],
      duration: duration.base,
      delay: opts.delay ?? 0,
      ease: ease.inOut,
      autoplay: opts.onEnter === false ? true : enterOnce(opts.trigger ?? el),
    });
  });
}

/**
 * Counts a numeric value up. Writes through `format` so areas and dimensions
 * animate without the DOM ever holding a half-formatted string.
 *
 * IMPORTANT: render the FINAL value in the markup, not a zero placeholder.
 * Callers skip this entirely under reduced motion, and whatever the markup
 * contains is what those users will read.
 */
export function countUp(
  el: HTMLElement,
  to: number,
  format: (n: number) => string = (n) => String(Math.round(n)),
  opts: RevealOptions = {},
) {
  const state = { n: 0 };
  el.textContent = format(0);

  return animate(state, {
    n: to,
    duration: duration.slow,
    delay: opts.delay ?? 0,
    ease: ease.outLong,
    onUpdate: () => {
      el.textContent = format(state.n);
    },
    autoplay: autoplayFor(opts, el),
  });
}

/* ---------------------------------------------------------------------------
   Modal / drawer transitions (consumed by the lead modal in a later phase)
   --------------------------------------------------------------------------- */

export type DrawerSide = 'right' | 'bottom';

const offscreen = (side: DrawerSide): Record<string, string> =>
  side === 'right' ? { translateX: '100%' } : { translateY: '100%' };

/** Sets the closed state without animating. Call before the first open. */
export function primeDrawer(panel: TargetsParam, scrim: TargetsParam, side: DrawerSide) {
  utils.set(scrim, { opacity: 0 });
  utils.set(panel, offscreen(side));
}

export function drawerEnter(
  panel: TargetsParam,
  scrim: TargetsParam,
  side: DrawerSide,
  reduced: boolean,
) {
  if (reduced) {
    utils.set(scrim, { opacity: 1 });
    utils.set(panel, { translateX: '0%', translateY: '0%' });
    return null;
  }

  const from = side === 'right' ? 'translateX' : 'translateY';

  return createTimeline()
    .add(scrim, { opacity: [0, 1], duration: 250, ease: ease.out })
    .add(
      panel,
      {
        [from]: ['100%', '0%'],
        duration: 420,
        ease: 'outQuint',
      },
      '<',
    );
}

/* ---------------------------------------------------------------------------
   Centred dialog (the floor-plan viewer)
   --------------------------------------------------------------------------- */

/** Closed state, applied before the first open. */
export function primeModal(panel: TargetsParam, scrim: TargetsParam) {
  utils.set(scrim, { opacity: 0 });
  utils.set(panel, { opacity: 0, translateY: distance.md });
}

/**
 * A lift and a fade, not a zoom. A plan that scales up on entry is unreadable
 * for the first half-second, which is precisely the moment the visitor is
 * looking at it.
 */
export function modalEnter(panel: TargetsParam, scrim: TargetsParam, reduced: boolean) {
  if (reduced) {
    utils.set(scrim, { opacity: 1 });
    utils.set(panel, { opacity: 1, translateY: 0 });
    return null;
  }

  return createTimeline()
    .add(scrim, { opacity: [0, 1], duration: 250, ease: ease.out })
    .add(
      panel,
      { opacity: [0, 1], translateY: [distance.md, 0], duration: 420, ease: 'outQuint' },
      '<',
    );
}

export function modalExit(panel: TargetsParam, scrim: TargetsParam, reduced: boolean) {
  if (reduced) {
    primeModal(panel, scrim);
    return null;
  }

  return createTimeline()
    .add(panel, { opacity: [1, 0], translateY: [0, distance.sm], duration: 200, ease: ease.in })
    .add(scrim, { opacity: [1, 0], duration: 200, ease: ease.in }, '<');
}

/** Exits are faster than entrances — the standard interaction convention. */
export function drawerExit(
  panel: TargetsParam,
  scrim: TargetsParam,
  side: DrawerSide,
  reduced: boolean,
) {
  if (reduced) {
    primeDrawer(panel, scrim, side);
    return null;
  }

  const to = side === 'right' ? 'translateX' : 'translateY';

  return createTimeline()
    .add(panel, { [to]: ['0%', '100%'], duration: 280, ease: ease.in })
    .add(scrim, { opacity: [1, 0], duration: 220, ease: ease.in }, '<+=60');
}
