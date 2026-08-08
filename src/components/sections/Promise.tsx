import { Container } from '@/components/layout/Container.tsx';
import { Section } from '@/components/layout/Section.tsx';
import { Figure } from '@/components/media/Figure.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { HairlineRule } from '@/components/ui/HairlineRule.tsx';
import { images } from '@/assets/manifest.ts';
import { greens, hero, sections } from '@/content/index.ts';
import { drawRule, revealImage, revealText, revealUp, useAnimeScope } from '@/motion/index.ts';

/**
 * The first idea after the hero.
 *
 * Text-led and deliberately uncrowded, then a full-bleed landscape with no copy
 * over it at all — the visual pause that stops the page reading as a stack of
 * content blocks.
 */
export function Promise() {
  const ref = useAnimeScope<HTMLDivElement>(({ reduced, root }) => {
    if (reduced) return;
    revealUp('[data-reveal-up]', { stagger: 90, root });
    revealText('[data-reveal-headline]');
    drawRule('[data-rule]', { root });
    revealImage('[data-figure]', { root });
  });

  return (
    <div ref={ref}>
      <Section tone="ivory" rhythm="large">
        <Container>
          <div className="grid gap-block lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
            <div className="flex flex-col gap-7">
              <div data-reveal-up>
                <Eyebrow rule>{sections.promise.eyebrow}</Eyebrow>
              </div>
              <h2 data-reveal-headline className="t-h1 text-charcoal">
                {sections.promise.headline}
              </h2>
              {/*
                The brand line. It used to open the page; the first viewport now
                opens with the invitation instead, and this is where the idea
                belongs — beside the argument it introduces rather than above a
                form it has nothing to do with.
              */}
              <p data-reveal-up className="t-h2 text-forest">
                {hero.brandline} {hero.subhead}
              </p>
            </div>

            <div className="flex flex-col gap-8 lg:pt-4">
              <p data-reveal-up className="t-body-lg text-charcoal">
                {sections.promise.lead}
              </p>
              <HairlineRule tone="gold" className="w-20" />
              <p data-reveal-up className="t-body text-charcoal/70">
                {sections.promise.body}
              </p>
              <p data-reveal-up className="t-eyebrow text-accent">
                {greens.value}
              </p>
            </div>
          </div>

          {/*
            The spaciousness argument, made four ways.

            Deliberately a rhythm of short columns rather than cards: no
            borders, no backgrounds, just a champagne rule and a heading. Each
            point describes something drawn on the plans — none of them ranks
            the project against anything, because no source supports a ranking.
          */}
          <ul className="mt-block grid list-none grid-cols-1 gap-x-14 gap-y-10 p-0 md:grid-cols-2 lg:mt-section lg:grid-cols-4">
            {sections.promise.aspects.map((aspect) => (
              <li key={aspect.title} data-reveal-up className="flex flex-col gap-4">
                <HairlineRule tone="gold" className="w-8" />
                <h3 className="t-h3 text-charcoal">{aspect.title}</h3>
                <p className="t-small text-charcoal/65">{aspect.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/*
        Visual pause — full width, no overlay, no copy.

        Cropped low. This frame is a genuine ATS render, but it carries taller
        blocks along its skyline than the low-rise campus this brochure is
        titled for. Biasing the crop to the landscape keeps the subject on the
        greens and avoids implying a building height the source does not settle.
      */}
      <Figure
        asset={images.greenLawns}
        sizes="100vw"
        ratio="aspect-[4/3] md:aspect-[21/9]"
        imgClassName="object-[50%_82%]"
      />
    </div>
  );
}
