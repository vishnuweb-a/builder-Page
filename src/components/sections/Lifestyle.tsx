import { Container } from '@/components/layout/Container.tsx';
import { Section } from '@/components/layout/Section.tsx';
import { Figure } from '@/components/media/Figure.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { HairlineRule } from '@/components/ui/HairlineRule.tsx';
import { images } from '@/assets/manifest.ts';
import { golf, greens, sections } from '@/content/index.ts';
import { drawRule, revealImage, revealText, revealUp, useAnimeScope } from '@/motion/index.ts';

/**
 * Setting — golf and green.
 *
 * The wording here is load-bearing. The brochure says Kingston Heath is
 * "nestled alongside a Golf Course" and lists a nine-hole course under nearby
 * recreation; the project itself contains no golf course. Every phrase below
 * comes from `golf` / `greens` in the content layer for exactly that reason,
 * and the adjacency is stated outright rather than implied.
 */
export function Lifestyle() {
  const ref = useAnimeScope<HTMLDivElement>(({ reduced, root }) => {
    if (reduced) return;
    revealUp('[data-reveal-up]', { stagger: 90, root });
    revealText('[data-reveal-headline]');
    drawRule('[data-rule]', { root });
    revealImage('[data-figure]', { root });
  });

  return (
    // `flush` + explicit top padding: the full-bleed pool image is the last
    // child, so section bottom padding would leave an empty green band beneath
    // it. The image should meet the next section edge to edge.
    <Section id="lifestyle" tone="forest" rhythm="flush">
      <div ref={ref} className="flex flex-col gap-section pt-section-lg">
        <Container>
          <div className="grid gap-block lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
            <div className="flex flex-col gap-7">
              <div data-reveal-up>
                <Eyebrow rule>{sections.lifestyle.eyebrow}</Eyebrow>
              </div>
              <h2 data-reveal-headline className="t-h1 text-ivory">
                {sections.lifestyle.headline}
              </h2>
            </div>

            <div className="flex flex-col gap-8 lg:pt-4">
              <p data-reveal-up className="t-body-lg text-ivory/85">
                {sections.lifestyle.lead}
              </p>
              <HairlineRule tone="gold" className="w-20" />
              <p data-reveal-up className="t-body text-ivory/65">
                {sections.lifestyle.body}
              </p>

              <div data-reveal-up className="flex flex-col gap-3 border-l border-gold/40 pl-6">
                <p className="t-eyebrow text-gold">{golf.value.phrasing}</p>
                <p className="t-small text-ivory/60">
                  {golf.value.nearbyFacility} is among the recreation in the surrounding sector.
                  Kingston Heath sits {golf.value.relationship} to it and does not include a golf
                  course of its own.
                </p>
              </div>
            </div>
          </div>
        </Container>

        <div className="relative">
          <Figure asset={images.poolDeck} sizes="100vw" ratio="aspect-[4/3] md:aspect-[21/9]" />
          <Container className="pointer-events-none absolute inset-x-0 bottom-0 pb-8">
            <p className="t-eyebrow text-ivory drop-shadow-[0_1px_6px_rgba(12,36,29,0.8)]">
              {greens.value}
            </p>
          </Container>
        </div>
      </div>
    </Section>
  );
}
