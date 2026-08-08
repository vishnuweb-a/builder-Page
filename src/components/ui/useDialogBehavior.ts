import { useEffect, type RefObject } from 'react';

/**
 * Everything a modal surface owes the keyboard, in one place.
 *
 * Scroll lock, initial focus, focus trap, Escape. Extracted from the lead
 * drawer in Phase 3 when the floor-plan dialog needed the identical
 * behaviour — two hand-written focus traps in one page is two chances to get
 * it subtly wrong, and the second one is always the one that ships broken.
 *
 * Focus RESTORATION is deliberately not here. The element to return focus to
 * is known by whoever opened the dialog, not by the dialog, so each owner
 * captures it at open time and restores it on close.
 */

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function useDialogBehavior(
  isOpen: boolean,
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
) {
  // Scroll lock. Padding compensates for the scrollbar so the page cannot shift.
  useEffect(() => {
    if (!isOpen) return;
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [isOpen]);

  // Focus trap + Escape.
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    // Move focus into the dialog, synchronously first.
    //
    // Do NOT rely on requestAnimationFrame alone here: under reduced motion no
    // animations run, so there is no active frame loop and the callback can be
    // deferred indefinitely on an idle page — focus was being left on <body>.
    // The rAF is kept only as a retry for the case where the panel has not been
    // painted yet, and it no-ops if focus already landed.
    const focusFirst = () => {
      if (panel.contains(document.activeElement)) return;
      (panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel).focus();
    };
    focusFirst();
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose, panelRef]);
}
