import { useEffect, useId, useRef } from 'react';
import { HairlineRule } from '@/components/ui/HairlineRule.tsx';
import { useDialogBehavior } from '@/components/ui/useDialogBehavior.ts';
import { srcSet, variantUrl, type ImageAsset } from '@/assets/manifest.ts';
import { disclaimers, sections, type Residence } from '@/content/index.ts';
import { formatNumber } from '@/lib/format.ts';
import { modalEnter, modalExit, primeModal, useReducedMotion } from '@/motion/index.ts';

interface FloorPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  residence: Residence;
  asset: ImageAsset;
  /**
   * False until the visitor has opened a plan at least once. Owned by the
   * parent because that is where the "opened" event happens; see the note on
   * point 2 below for why it is not simply `loading="lazy"`.
   */
  loadPlan: boolean;
}

/**
 * The floor plan, full size.
 *
 * A plan is a drawing meant to be read, so this is the one place on the page
 * where an image is allowed to be larger than its column. Two consequences
 * follow, and both are deliberate:
 *
 * 1. The drawing is NOT scaled to fit on a phone. At 375px a 1600px plan is a
 *    grey smudge. Instead it keeps a legible minimum width inside its own
 *    scroll container, so a visitor can pan across it the way they would a
 *    paper plan on a table. That container clips its own overflow — the page
 *    behind it never scrolls sideways.
 * 2. The drawing is not put in the DOM until the dialog has been opened once,
 *    so a plan nobody opens never costs a byte. `loading="lazy"` alone would
 *    not achieve that: the panel is a full-viewport fixed element, so the
 *    browser considers it in view and fetches immediately.
 */
export function FloorPlanDialog({
  isOpen,
  onClose,
  residence,
  asset,
  loadPlan,
}: FloorPlanDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (panelRef.current && scrimRef.current) primeModal(panelRef.current, scrimRef.current);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    const scrim = scrimRef.current;
    if (!panel || !scrim) return;
    if (isOpen) modalEnter(panel, scrim, reduced);
    else modalExit(panel, scrim, reduced);
  }, [isOpen, reduced]);

  useDialogBehavior(isOpen, onClose, panelRef);

  const largest = asset.widths[asset.widths.length - 1];
  const { plans } = sections.residences;

  return (
    <>
      <div
        ref={scrimRef}
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-forest-deep/80 ${isOpen ? '' : 'pointer-events-none'}`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        /* See LeadDrawer for why this is `inert` and not a visibility class. */
        inert={!isOpen}
        className={`fixed inset-3 z-50 flex flex-col overflow-hidden rounded-edge bg-ivory-raised
          md:inset-6 lg:inset-10
          ${isOpen ? '' : 'pointer-events-none'}`}
      >
        <header className="flex shrink-0 items-start justify-between gap-6 border-b border-stone px-5 py-4 md:px-8 md:py-6">
          <div className="flex flex-col gap-2">
            <h2 id={titleId} className="t-h3 text-charcoal">
              {residence.headline}
            </h2>
            <p className="t-fine text-charcoal/55">
              {residence.label} · {formatNumber(residence.areas.superAreaSqFt)} sq ft super area ·{' '}
              {formatNumber(residence.areas.carpetSqFt)} sq ft carpet
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="-mt-1 -mr-1 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-charcoal/50 transition-colors duration-[var(--dur-fast)] hover:text-charcoal"
          >
            <span className="sr-only">{plans.close}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 stroke-current stroke-[1.25]">
              <path d="M2 2 14 14M14 2 2 14" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/*
          The drawing. Panning happens here and nowhere else.

          The drawing is sized to the panel's WIDTH, not fitted inside it. On a
          900px-tall window, fitting the whole plan on screen shrinks it to
          about 680px across and the room annotations become unreadable — which
          defeats the point of opening it. Filling the width gives a drawing you
          can actually read and costs one short vertical scroll, and the plan
          visibly running past the fold is its own invitation to do that.
        */}
        <div className="min-h-0 grow overflow-auto overscroll-contain p-4 md:p-8">
          {loadPlan && (
            <picture className="mx-auto block w-full max-w-[80rem]">
              <source
                type="image/webp"
                srcSet={srcSet(asset, 'webp')}
                sizes="(min-width: 48rem) 92vw, 672px"
              />
              <source
                type="image/jpeg"
                srcSet={srcSet(asset, 'jpg')}
                sizes="(min-width: 48rem) 92vw, 672px"
              />
              <img
                src={variantUrl(asset.base, largest, 'jpg')}
                alt={asset.alt}
                width={asset.width}
                height={asset.height}
                decoding="async"
                className="h-auto w-full min-w-[42rem] md:min-w-0"
              />
            </picture>
          )}
        </div>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-stone px-5 py-4 md:px-8 md:py-5">
          <HairlineRule tone="gold" className="w-12" />
          <p id={descId} className="t-fine text-charcoal/55">
            {plans.note} {asset.credit}. {disclaimers.area.value} {disclaimers.imagery.value}
          </p>
        </footer>
      </div>
    </>
  );
}
