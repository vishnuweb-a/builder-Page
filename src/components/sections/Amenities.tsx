import { Container } from '@/components/layout/Container.tsx';
import { Section } from '@/components/layout/Section.tsx';
import { Figure } from '@/components/media/Figure.tsx';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { HairlineRule } from '@/components/ui/HairlineRule.tsx';
import { useLeadDrawer } from '@/components/lead/LeadDrawerContext.ts';
import { images } from '@/assets/manifest.ts';
import {
  clubhouse,
  cta,
  disclaimers,
  findAmenityGroup,
  fitness,
  legendItemCount,
  sections,
} from '@/content/index.ts';
import { drawRule, revealImage, revealText, revealUp, useAnimeScope } from '@/motion/index.ts';

/**
 * A run of features, set as a line rather than as a grid of icon tiles.
 *
 * docs/design.md §3 rejects "a grid of generic amenity icons" outright, and it
 * is right to: fifty-one hand-drawn pictograms is a week of work that makes a
 * page look more like a template, not less. A champagne interpunct does the
 * same job at a fraction of the weight.
 */
function FeatureRun({ items }: { items: readonly string[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap items-center gap-x-3 gap-y-2 p-0">
      {items.map((item, i) => (
        <li key={item} className="t-small flex items-center gap-3 text-charcoal/65">
          {item}
          {/* Separator trails its item rather than leading the next one, so a
              wrapped line never begins with a floating interpunct. */}
          {i < items.length - 1 && (
            <span aria-hidden="true" className="text-accent">
              ·
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

interface MovementProps {
  title: string;
  body: string;
  items: readonly string[];
}

function Movement({ title, body, items }: MovementProps) {
  return (
    <div data-reveal-up className="flex flex-col gap-5">
      <HairlineRule tone="gold" className="w-8" />
      <h3 className="t-h3 text-charcoal">{title}</h3>
      <p className="t-small text-charcoal/70">{body}</p>
      <FeatureRun items={items} />
    </div>
  );
}

/**
 * Amenities.
 *
 * Every feature named on this page comes from one of exactly two places in the
 * brochure: the 51-item landscape legend (p.19) or the clubhouse specification
 * (p.25). Nothing is added because a competitor's page has it, and no adjective
 * is applied that the source does not apply itself.
 */
export function Amenities() {
  const { open } = useLeadDrawer();
  const { amenities } = sections;

  const ref = useAnimeScope<HTMLDivElement>(({ reduced, root }) => {
    if (reduced) return;
    revealUp('[data-reveal-up]', { stagger: 90, root });
    revealText('[data-reveal-headline]');
    drawRule('[data-rule]', { root });
    revealImage('[data-figure]', { root });
  });

  return (
    <Section id="amenities" tone="sage" rhythm="large" label="Amenities and campus">
      <div ref={ref}>
        <Container className="flex flex-col gap-block lg:gap-24">
          <header className="grid gap-block lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
            <div className="flex flex-col gap-7">
              <div data-reveal-up>
                <Eyebrow rule>{amenities.eyebrow}</Eyebrow>
              </div>
              <h2 data-reveal-headline className="t-h1 text-charcoal">
                {amenities.headline}
              </h2>
            </div>
            <p data-reveal-up className="t-body-lg text-charcoal/70 lg:pt-4">
              {amenities.lead}
            </p>
          </header>

          {/*
            The pool leads, because it is the thing a family pictures first —
            and because the site plan below shows exactly where it sits.
          */}
          <div className="grid gap-block lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
            <h3 data-reveal-headline className="t-h2 text-balance text-forest">
              {amenities.pool.title}
            </h3>
            <div className="flex flex-col gap-6 lg:pt-3">
              <p data-reveal-up className="t-body text-charcoal/70">
                {amenities.pool.body}
              </p>
              <div data-reveal-up>
                <FeatureRun items={findAmenityGroup('water').items} />
              </div>
            </div>
          </div>

          {/*
            The site plan. Presented large and uncropped: it is the one image
            that answers "where does all of this actually go?", and a visitor
            who wants to trace the walk from a block to the pool should be able
            to. Near-square, so it is centred in its own column rather than
            stretched across the frame.
          */}
          <figure className="m-0 flex flex-col gap-5">
            <Figure asset={images.sitePlan} sizes="(min-width: 64rem) 62rem, 92vw" className="mx-auto w-full max-w-4xl" />
            <figcaption className="t-fine mx-auto flex max-w-4xl flex-col gap-1 text-charcoal/65">
              <span>
                {images.sitePlan.credit} · {amenities.legendNote(legendItemCount.value)}
              </span>
              <span>{disclaimers.sitePlan.value}</span>
            </figcaption>
          </figure>

          <div className="grid gap-x-16 gap-y-block md:grid-cols-2">
            <Movement
              title={amenities.club.title}
              body={amenities.club.body}
              items={clubhouse.value.items}
            />
            {/* The gym and the jogging track are printed under the clubhouse
                specification too, and both runs sit side by side. Listing them
                twice in the same eyeful reads as carelessness, so this run
                shows only what the clubhouse list does not already carry — the
                prose above it still names the indoor gym. */}
            <Movement
              title={amenities.fitness.title}
              body={amenities.fitness.body}
              items={fitness.value.filter((item) => !clubhouse.value.items.includes(item))}
            />
            <Movement
              title={amenities.family.title}
              body={amenities.family.body}
              items={[...findAmenityGroup('family').items, ...findAmenityGroup('sport').items]}
            />
            <Movement
              title={amenities.green.title}
              body={amenities.green.body}
              items={findAmenityGroup('green').items}
            />
          </div>

          <div className="flex flex-col gap-6 border-t border-sage-line/40 pt-10 md:flex-row md:items-center md:justify-between">
            <p className="t-fine max-w-lg text-charcoal/65">{disclaimers.amenities.value}</p>
            <CTAButton onClick={() => open('amenities')}>{cta.primary}</CTAButton>
          </div>
        </Container>
      </div>
    </Section>
  );
}
