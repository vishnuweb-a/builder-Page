import { Figure } from '@/components/media/Figure.tsx';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { useLeadDrawer } from '@/components/lead/LeadDrawerContext.ts';
import { images } from '@/assets/manifest.ts';
import { cta, hero, project, residences } from '@/content/index.ts';
import { useMediaQuery } from '@/lib/useMediaQuery.ts';
import {
  imageDrift,
  revealImage,
  revealText,
  revealUp,
  useAnimeScope,
} from '@/motion/index.ts';

/**
 * Hero.
 *
 * An asymmetric split rather than a full-bleed image with text laid over it.
 * Two reasons, in this order: an editorial frame lets the typography carry the
 * page the way docs/design.md §7 asks, and the largest available render is
 * 1395px wide — enough to stay crisp in a 55% column on a retina display,
 * not enough to go full-bleed at 1440 without softening.
 *
 * Below lg the headline comes first and the image follows, which puts the
 * proposition above the fold on a phone and keeps the transparent header on a
 * light ground at every width.
 */
export function Hero() {
  const { open } = useLeadDrawer();
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  const ref = useAnimeScope<HTMLDivElement>(
    ({ reduced, root }) => {
      if (reduced) return;

      revealImage('[data-figure]', { onEnter: false, root });
      revealUp('[data-hero-eyebrow]', { delay: 300, onEnter: false, root });
      revealText('[data-hero-headline]', { delay: 450, stagger: 90, onEnter: false });
      revealUp('[data-hero-sub]', { delay: 950, onEnter: false, root });
      revealUp('[data-hero-actions] > *', { delay: 1100, stagger: 90, onEnter: false, root });

      // Desktop only: a 12s breath is invisible on a phone and costs battery.
      // Runs on the inner wrapper so it does not fight revealImage for `scale`.
      if (isDesktop) imageDrift('[data-figure-inner]');
    },
    [isDesktop],
  );

  return (
    <section
      id="overview"
      ref={ref}
      className="relative bg-ivory lg:grid lg:min-h-[92svh] lg:grid-cols-[45fr_55fr] lg:items-stretch"
    >
      {/* Copy */}
      <div className="flex flex-col justify-center px-gutter pt-32 pb-14 lg:py-section lg:pr-14">
        <div className="flex max-w-xl flex-col gap-7 lg:gap-9">
          <div data-hero-eyebrow>
            <Eyebrow rule>{hero.eyebrow}</Eyebrow>
          </div>

          <h1 data-hero-headline className="t-display text-charcoal">
            {hero.headline}
          </h1>

          <div data-hero-sub className="flex flex-col gap-5">
            <p className="t-h2 text-forest">{hero.subhead}</p>
            <p className="t-body-lg text-charcoal/70">
              {residences[0].label} and {residences[1].label} residences,
              alongside a golf course in {project.locality.value}.
            </p>
          </div>

          <div data-hero-actions className="flex flex-wrap items-center gap-4 pt-1">
            <CTAButton size="lg" onClick={() => open('hero')}>
              {cta.primary}
            </CTAButton>
            <CTAButton href="#residences" variant="quiet">
              {cta.secondary}
            </CTAButton>
          </div>
        </div>
      </div>

      {/*
        Visual.

        Inset from the top on desktop by the height of the masthead. The header
        is transparent at rest, and its nav and CTA sit on the right — directly
        over this column. Rather than tint the type or drop a scrim over the
        render, the image simply starts below the header, so every header
        element stays on the ivory ground it was designed for. It also reads as
        a magazine masthead, which suits the page better than a full bleed.
      */}
      <div className="relative lg:h-full lg:pt-27">
        <Figure
          asset={images.campusAerial}
          priority
          sizes="(min-width: 64rem) 55vw, 100vw"
          ratio="aspect-[4/3] md:aspect-[16/10] lg:aspect-auto lg:h-full"
          className="h-full"
        />
        <p className="t-fine absolute right-4 bottom-4 bg-forest-deep/55 px-3 py-1.5 text-ivory/80">
          Artist’s impression
        </p>
      </div>
    </section>
  );
}
