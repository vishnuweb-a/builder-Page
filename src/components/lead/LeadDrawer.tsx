import { useEffect, useId, useRef, useState } from 'react';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { Logo } from '@/components/ui/Logo.tsx';
import { HairlineRule } from '@/components/ui/HairlineRule.tsx';
import { useDialogBehavior } from '@/components/ui/useDialogBehavior.ts';
import { leadForm, project } from '@/content/index.ts';
import { useMediaQuery } from '@/lib/useMediaQuery.ts';
import { drawerEnter, drawerExit, primeDrawer, useReducedMotion } from '@/motion/index.ts';
import { LeadForm } from './LeadForm.tsx';
import type { CTAPlacement } from './LeadDrawerContext.ts';

interface LeadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  placement: CTAPlacement;
  /** Increments on every open. Remounts the body, so each visit starts clean. */
  session: number;
}

/**
 * The enquiry drawer.
 *
 * The shell — transition, focus trap, scroll lock, Escape, focus restoration —
 * is Phase 2 work and is untouched. Phase 4 only replaced what sat inside it:
 * where the panel used to explain that there was no endpoint yet, it now holds
 * the form, and the confirmation that follows a successful send.
 */
export function LeadDrawer({ isOpen, onClose, placement, session }: LeadDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const side = isDesktop ? 'right' : 'bottom';
  const titleId = useId();

  // Park the panel offscreen before its first appearance.
  useEffect(() => {
    if (panelRef.current && scrimRef.current) {
      primeDrawer(panelRef.current, scrimRef.current, side);
    }
  }, [side]);

  // Transition in/out.
  useEffect(() => {
    const panel = panelRef.current;
    const scrim = scrimRef.current;
    if (!panel || !scrim) return;
    if (isOpen) drawerEnter(panel, scrim, side, reduced);
    else drawerExit(panel, scrim, side, reduced);
  }, [isOpen, side, reduced]);

  // Scroll lock, initial focus, focus trap, Escape.
  useDialogBehavior(isOpen, onClose, panelRef);

  return (
    <>
      <div
        ref={scrimRef}
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-forest-deep/60 ${isOpen ? '' : 'pointer-events-none'}`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-placement={placement}
        /*
         * `inert` rather than a `visibility: hidden` class for the closed state.
         *
         * inert is an attribute, so removing it takes effect immediately in the
         * DOM; visibility is a computed style, and `focus()` silently no-ops
         * while the browser still holds the pre-commit value. That race made
         * initial focus land on <body> whenever no animation happened to force
         * a style flush first — i.e. exactly under reduced motion. inert is also
         * the purpose-built API here: it removes the panel from the tab order
         * AND the accessibility tree while closed, which visibility alone does
         * only for the former.
         */
        inert={!isOpen}
        /*
         * The bottom padding carries `env(safe-area-inset-bottom)` because on a
         * phone this panel is anchored to the bottom edge, which is where the
         * home indicator lives. Without it the submit button sits under the
         * gesture bar on an iPhone. `dvh` rather than `vh` for the same family
         * of reasons: it tracks the visible viewport as the on-screen keyboard
         * opens, so the panel shrinks instead of being pushed off-screen.
         */
        className={`surface-dark fixed z-50 flex flex-col gap-8 overflow-y-auto overscroll-contain bg-forest p-8 lg:p-12
          inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[2px] pb-[calc(2rem+env(safe-area-inset-bottom))]
          lg:inset-y-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-[30rem] lg:rounded-none lg:pb-12
          ${isOpen ? '' : 'pointer-events-none'}`}
      >
        <div className="flex items-start justify-between gap-6">
          {/* The mark is what tells a visitor whose form they are about to fill
              in. It sits on a plate here because the panel is forest green and
              the artwork's own green wordmark would vanish into it. */}
          <div className="flex flex-col items-start gap-4">
            <Logo plate className="h-7" />
            <Eyebrow rule>{project.locality.value}</Eyebrow>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-2 -mr-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-ivory/60 transition-colors duration-[var(--dur-fast)] hover:text-ivory"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 stroke-current stroke-[1.25]">
              <path d="M2 2 14 14M14 2 2 14" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/*
          Keyed on the session counter, so every opening of the drawer mounts a
          new body. That is what guarantees §28: a visitor who enquires, closes
          and comes back gets a clean form rather than their previous message —
          or, worse, the confirmation for an enquiry they already sent.
        */}
        <LeadDrawerBody key={session} titleId={titleId} onClose={onClose} />
      </div>
    </>
  );
}

/**
 * Form, then confirmation.
 *
 * Split out purely so the `key` above can remount it. Holding `sent` here
 * rather than in the drawer means the reset is structural — there is no
 * "remember to clear this too" state left behind.
 */
function LeadDrawerBody({ titleId, onClose }: { titleId: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);

  if (sent) return <LeadSuccess titleId={titleId} onClose={onClose} />;

  return (
    <>
      <div className="flex flex-col gap-5">
        <h2 id={titleId} className="t-h2 text-ivory">
          {leadForm.title}
        </h2>
        <HairlineRule tone="gold" className="w-16" />
        <p className="t-body-lg text-ivory/75">{leadForm.intro}</p>
      </div>

      <LeadForm onSuccess={() => setSent(true)} />

      <p className="t-fine text-ivory/50">{leadForm.privacy}</p>
    </>
  );
}

/**
 * The confirmation.
 *
 * It takes focus on mount, for two reasons. The obvious one is that the button
 * focus was on has just been unmounted, and leaving focus on <body> breaks the
 * dialog's keyboard trap. The less obvious one is that moving focus to a
 * container holding the new heading is what makes a screen reader announce the
 * outcome at all — the form did not navigate anywhere, so nothing else would.
 *
 * The wording promises only that someone will be in touch. No callback window,
 * no reference number, no "your visit is confirmed" — nothing has been
 * confirmed, and a landing page that says otherwise is lying on the developer's
 * behalf at the exact moment it has earned some trust.
 */
function LeadSuccess({ titleId, onClose }: { titleId: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div ref={ref} tabIndex={-1} className="flex flex-col gap-6 outline-none">
      <h2 id={titleId} className="t-h2 text-ivory">
        {leadForm.successTitle}
      </h2>

      <HairlineRule tone="gold" className="w-16" />

      <p className="t-body-lg text-ivory/75">{leadForm.successBody}</p>

      <CTAButton variant="secondary" onClick={onClose} className="mt-2 self-start">
        {leadForm.successClose}
      </CTAButton>
    </div>
  );
}
