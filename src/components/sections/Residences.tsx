import { useCallback, useRef, useState } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { Section } from '@/components/layout/Section.tsx';
import { Figure } from '@/components/media/Figure.tsx';
import { FloorPlanDialog } from '@/components/media/FloorPlanDialog.tsx';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { HairlineRule } from '@/components/ui/HairlineRule.tsx';
import { Metric } from '@/components/ui/Metric.tsx';
import { PriceLine } from '@/components/ui/PriceLine.tsx';
import { useLeadDrawer } from '@/components/lead/LeadDrawerContext.ts';
import { images, type ImageAsset } from '@/assets/manifest.ts';
import {
  TYPE_A,
  TYPE_B,
  cta,
  disclaimers,
  findRoom,
  sections,
  type Residence,
} from '@/content/index.ts';
import { formatDimension, formatNumber } from '@/lib/format.ts';
import { cx } from '@/lib/cx.ts';
import { drawRule, revealImage, revealText, revealUp, useAnimeScope } from '@/motion/index.ts';

/**
 * The rooms that make the case for space — not the full schedule.
 *
 * Brochure labels, because that is what `findRoom` matches on; the marketing
 * name (Bedroom-2 → "Kids' Bedroom") comes from the residence data itself, so
 * the drawing and the page can never drift apart. Five entries for Type A and
 * four for Type B: enough to feel the scale, short of becoming a spec sheet.
 */
const HIGHLIGHTS: Record<Residence['id'], readonly string[]> = {
  'type-b': ['Living / Dining', 'Bedroom-2', 'Bedroom-3', 'Study'],
  'type-a': ['Living Room', 'Master Bedroom', 'Family Lounge', 'Bedroom-2', 'Puja'],
};

/** Isometric cutaway on the page; measured plan inside the dialog. */
const PLAN_ASSETS: Record<Residence['id'], { isometric: ImageAsset; plan: ImageAsset }> = {
  'type-b': { isometric: images.isometric3BHK, plan: images.floorPlan3BHK },
  'type-a': { isometric: images.isometric4BHK, plan: images.floorPlan4BHK },
};

interface BlockProps {
  residence: Residence;
  pitch: string;
  index: string;
  onOpenPlan: (residence: Residence, invoker: HTMLElement) => void;
  /** Flip the drawing to the right. Alternating keeps the rhythm from settling. */
  reverse?: boolean;
}

function ResidenceBlock({ residence, pitch, index, onOpenPlan, reverse = false }: BlockProps) {
  const rooms = HIGHLIGHTS[residence.id]
    .map((label) => findRoom(residence, label))
    .filter((r) => r !== undefined);

  const { isometric } = PLAN_ASSETS[residence.id];
  const { plans } = sections.residences;

  return (
    <article className="grid items-start gap-block lg:grid-cols-12 lg:gap-16">
      {/* The drawing keeps its own proportions — a plan must never be cropped.
          Its background was blended to the section tone so it sits on the page
          rather than in a white box. */}
      {/* Sticky on large screens: the plan stays in view while its
          specifications scroll past, which removes the dead column a short
          drawing beside a tall spec list would otherwise leave. */}
      {/*
        Below lg the naming comes first and the drawing follows. A visitor
        scrolling a phone should be told which residence they are looking at
        before they are shown it — on desktop the two sit side by side and the
        question does not arise.
      */}
      <div
        className={cx(
          'flex flex-col gap-5 max-lg:order-2 lg:sticky lg:top-28 lg:col-span-7',
          reverse && 'lg:order-2',
        )}
      >
        <Figure asset={isometric} sizes="(min-width: 64rem) 55vw, 92vw" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <CTAButton
            variant="secondary"
            onClick={(e) => onOpenPlan(residence, e.currentTarget)}
            aria-label={plans.triggerLabel(residence.headline)}
          >
            {plans.trigger}
            <span aria-hidden="true" className="text-accent">
              ↗
            </span>
          </CTAButton>
          <p className="t-fine text-charcoal/65">{isometric.credit}</p>
        </div>
      </div>

      <div
        className={cx('flex flex-col gap-8 max-lg:order-1 lg:col-span-5', reverse && 'lg:order-1')}
      >
        <div className="flex flex-col gap-4">
          <span className="t-eyebrow text-accent">{index}</span>
          <h3 className="t-h2 text-balance text-charcoal">{residence.headline}</h3>
          <HairlineRule tone="gold" className="w-16" />
          <p className="t-small text-charcoal/65">{residence.label}</p>
        </div>

        <p className="t-body text-charcoal/70">{pitch}</p>

        <div className="flex flex-wrap gap-x-14 gap-y-6">
          <Metric value={`${formatNumber(residence.areas.superAreaSqFt)} sq ft`} label="Super area" />
          <Metric value={`${formatNumber(residence.areas.carpetSqFt)} sq ft`} label="Carpet area" />
        </div>

        <HairlineRule />

        {/*
          Dimensions as evidence, two to a row from md up. Rendered from the
          structured [feet, inches] pairs through `formatDimension`, which is
          the only thing standing between this page and the "14.9 × 16.4"
          decimal-feet transcription error that reached both source documents.
        */}
        <dl className="m-0 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {rooms.map((room) => (
            <div key={room.label} className="flex flex-col gap-1.5">
              <dt className="t-eyebrow order-2 text-charcoal/65">
                {room.displayLabel ?? room.label}
              </dt>
              <dd className="t-numeral order-1 m-0 text-forest">
                {formatDimension(room.width, room.depth)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export function Residences() {
  const { open } = useLeadDrawer();
  const [planFor, setPlanFor] = useState<Residence | null>(null);
  /** Focus returns to the trigger that opened the dialog. */
  const invokerRef = useRef<HTMLElement | null>(null);
  /**
   * The last plan shown, kept after closing so the dialog animates out with its
   * content intact instead of blanking mid-transition. It is null until the
   * first open, which is also what tells the dialog it may fetch the drawing —
   * a 100 KB plan nobody asks for should never be downloaded.
   */
  const [lastPlan, setLastPlan] = useState<Residence | null>(null);

  const openPlan = useCallback((residence: Residence, invoker: HTMLElement) => {
    invokerRef.current = invoker;
    setLastPlan(residence);
    setPlanFor(residence);
  }, []);

  const closePlan = useCallback(() => {
    setPlanFor(null);
    invokerRef.current?.focus();
    invokerRef.current = null;
  }, []);

  /** Whatever the dialog should be showing right now, open or animating shut. */
  const shown = planFor ?? lastPlan ?? TYPE_B;

  const ref = useAnimeScope<HTMLDivElement>(({ reduced, root }) => {
    if (reduced) return;
    revealUp('[data-reveal-up]', { stagger: 90, root });
    revealText('[data-reveal-headline]');
    drawRule('[data-rule]', { root });
    revealImage('[data-figure]', { root });
    revealUp('article dl > div', { stagger: 110, root });
  });

  return (
    <Section id="residences" tone="raised" rhythm="large">
      <div ref={ref}>
        <Container className="flex flex-col gap-block lg:gap-28">
          <header className="grid gap-block lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
            <div className="flex flex-col gap-7">
              <div data-reveal-up>
                <Eyebrow rule>{sections.residences.eyebrow}</Eyebrow>
              </div>
              <h2 data-reveal-headline className="t-h1 text-charcoal">
                {sections.residences.headline}
              </h2>
            </div>
            <div className="flex flex-col gap-8 lg:pt-4">
              <p data-reveal-up className="t-body-lg text-charcoal/70">
                {sections.residences.lead}
              </p>
              {/* Renders nothing until the campaign rate is verified. */}
              <PriceLine />
            </div>
          </header>

          <div className="flex flex-col gap-section">
            <ResidenceBlock
              index="01"
              residence={TYPE_B}
              pitch={sections.residences.typeB.pitch}
              onOpenPlan={openPlan}
            />
            <ResidenceBlock
              index="02"
              residence={TYPE_A}
              pitch={sections.residences.typeA.pitch}
              onOpenPlan={openPlan}
              reverse
            />
          </div>

          <div className="flex flex-col gap-6 border-t border-sage-line/40 pt-10 md:flex-row md:items-center md:justify-between">
            <p className="t-fine max-w-md text-charcoal/65">
              {disclaimers.area.value} {disclaimers.imagery.value}
            </p>
            <CTAButton onClick={() => open('residences')}>{cta.primary}</CTAButton>
          </div>
        </Container>
      </div>

      <FloorPlanDialog
        isOpen={planFor !== null}
        onClose={closePlan}
        residence={shown}
        asset={PLAN_ASSETS[shown.id].plan}
        loadPlan={lastPlan !== null}
      />
    </Section>
  );
}
