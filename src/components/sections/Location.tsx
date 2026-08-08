import { Container } from '@/components/layout/Container.tsx';
import { Section } from '@/components/layout/Section.tsx';
import { Figure } from '@/components/media/Figure.tsx';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { HairlineRule } from '@/components/ui/HairlineRule.tsx';
import { useLeadDrawer } from '@/components/lead/LeadDrawerContext.ts';
import { images } from '@/assets/manifest.ts';
import { cta, landmarks, positioning, project, sections } from '@/content/index.ts';
import { drawRule, revealImage, revealText, revealUp, useAnimeScope } from '@/motion/index.ts';

/**
 * Location.
 *
 * Two rules govern this section, and both are absolute.
 *
 * 1. NO TRAVEL TIMES. The brochure states no distance and no minute figure
 *    anywhere, and its map is printed "not to scale". Connectivity is
 *    therefore described by naming what is on the map — never "20 minutes from
 *    the airport". The page says so out loud, because a family that has read
 *    four landing pages with four different sets of invented drive times will
 *    recognise the one that didn't.
 *
 * 2. THE 80% GREEN COVER BELONGS TO SECTOR 150. It describes the sports sector
 *    the project sits in, not Kingston Heath. It appears here only inside the
 *    brochure's own sentence, where the subject is unambiguous, and it is
 *    presented as a quotation with its source named.
 */
export function Location() {
  const { open } = useLeadDrawer();
  const copy = sections.location;

  const ref = useAnimeScope<HTMLDivElement>(({ reduced, root }) => {
    if (reduced) return;
    revealUp('[data-reveal-up]', { stagger: 90, root });
    revealText('[data-reveal-headline]');
    drawRule('[data-rule]', { root });
    revealImage('[data-figure]', { root });
    revealUp('[data-landmarks] > *', { stagger: 110, root });
  });

  return (
    <Section id="location" tone="ivory" rhythm="large">
      <div ref={ref}>
        <Container className="flex flex-col gap-block lg:gap-24">
          <header className="grid gap-block lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
            <div className="flex flex-col gap-7">
              <div data-reveal-up>
                <Eyebrow rule>{copy.eyebrow}</Eyebrow>
              </div>
              <h2 data-reveal-headline className="t-h1 text-charcoal">
                {copy.headline}
              </h2>
              <p data-reveal-up className="t-h3 text-forest">
                {project.sector} · {project.city}
              </p>
            </div>

            <div className="flex flex-col gap-8 lg:pt-4">
              <p data-reveal-up className="t-body-lg text-charcoal">
                {copy.lead}
              </p>
              <HairlineRule tone="gold" className="w-20" />
              <p data-reveal-up className="t-body text-charcoal/70">
                {copy.body}
              </p>

              {/* The brochure's own words. Quoted, so the subject of the 80%
                  figure stays visibly attached to Sector 150. */}
              <figure data-reveal-up className="m-0 flex flex-col gap-3 border-l border-gold/40 pl-6">
                <blockquote className="m-0">
                  <p className="t-small text-charcoal/75">“{positioning.value}”</p>
                </blockquote>
                <figcaption className="t-fine text-charcoal/45">
                  Sector 150, as described in the {project.name} brochure. The green-cover figure
                  describes the sector, not this project.
                </figcaption>
              </figure>
            </div>
          </header>

          <figure className="m-0 flex flex-col gap-5">
            <Figure asset={images.locationMap} sizes="(min-width: 64rem) 77rem, 92vw" />
            {/* `disclaimers.sitePlan` is deliberately not repeated here: it
                covers the campus layout, and its "map not to scale" clause is
                already said once, in the caption. */}
            <figcaption className="t-fine text-charcoal/45">
              {copy.mapCaption} {images.locationMap.credit}.
            </figcaption>
          </figure>

          {/* What is on the map, grouped. Names only — no distances, because
              the source gives none. */}
          <div data-landmarks className="grid gap-x-12 gap-y-block md:grid-cols-2 lg:grid-cols-5">
            {landmarks.map((category) => (
              <div key={category.id} className="flex flex-col gap-5">
                <HairlineRule tone="gold" className="w-8" />
                <h3 className="t-eyebrow text-charcoal/50">{category.title}</h3>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {category.items.map((item) => (
                    <li key={item} className="t-small text-charcoal/75">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 border-t border-stone pt-10 md:flex-row md:items-start md:justify-between">
            <p className="t-fine max-w-xl text-charcoal/50">{copy.noTravelTimes}</p>
            <CTAButton onClick={() => open('location')} className="shrink-0">
              {cta.primary}
            </CTAButton>
          </div>
        </Container>
      </div>
    </Section>
  );
}
