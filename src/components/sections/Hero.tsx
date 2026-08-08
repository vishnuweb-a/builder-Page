import { Figure } from '@/components/media/Figure.tsx';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { EnquiryPanel } from '@/components/lead/EnquiryPanel.tsx';
import { images } from '@/assets/manifest.ts';
import { cta, hero, project } from '@/content/index.ts';
import { useMediaQuery } from '@/lib/useMediaQuery.ts';
import { imageDrift, revealImage, revealUp, useAnimeScope } from '@/motion/index.ts';

/**
 * The first viewport — a property campaign with an enquiry form inside it.
 *
 * The composition is the same asymmetric editorial split the page has always
 * used, with the conversion moved into it rather than bolted beneath it:
 *
 *   LEFT   eyebrow → headline → one supporting line → THE FORM
 *   RIGHT  the campus render, inset below the masthead
 *
 * Three constraints shaped it, in this order.
 *
 * The form is never animated. `revealUp` and `revealText` work by setting
 * `opacity: 0` from JavaScript and animating back — which is safe for a
 * headline and unacceptable for the page's primary conversion point, because a
 * failed script, a slow parse or a blocked bundle would leave a blank space
 * where the enquiry is. So the copy above the form animates and the panel does
 * not: it is in the first paint, at full opacity, interactive immediately.
 *
 * The headline is set at `t-h1` rather than the old `t-display`. A 104px
 * display line and a form cannot share a column at 1440 without one of them
 * looking like an afterthought, and the one that must not look like an
 * afterthought is the form.
 *
 * The hero's own "Book a Private Site Visit" button is gone. It would now sit
 * directly beside the form it opens a drawer to duplicate — §9 of the brief,
 * and simple sense. "Explore Residences" stays: it is a quiet in-page link, it
 * competes with nothing, and it is the only way to say "there is more below"
 * to a visitor who is not ready to enquire yet.
 */
export function Hero() {
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  const ref = useAnimeScope<HTMLDivElement>(
    ({ reduced, root }) => {
      if (reduced) return;

      // Note what is NOT in this list: [data-enquiry]. The panel is deliberately
      // outside the motion layer's reach — see the note above.
      revealImage('[data-figure]', { onEnter: false, root });
      revealUp('[data-hero-eyebrow]', { delay: 150, onEnter: false, root });
      revealUp('[data-hero-headline]', { delay: 280, onEnter: false, root });
      revealUp('[data-hero-sub]', { delay: 420, onEnter: false, root });
      revealUp('[data-hero-actions] > *', { delay: 560, stagger: 90, onEnter: false, root });

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
      className="relative bg-sage-mist lg:grid lg:min-h-[92svh] lg:grid-cols-[48fr_52fr] lg:items-stretch"
    >
      {/* Copy, then the form. */}
      {/*
        The mobile measurements this spacing is set to.

        At 375×667 — the shortest viewport the brief names — the stack has to
        put the eyebrow, the headline, one line of support copy AND the whole
        enquiry panel above the fold, under a 92px masthead. It fits with about
        6px to spare, and it only fits because the top inset is 96px rather than
        112px and the rhythm is 20px rather than 24px until `lg`. Anything added
        to this column above the panel comes out of that margin.
      */}
      <div className="flex flex-col justify-center px-gutter pt-20 pb-14 lg:py-section lg:pr-14">
        <div className="flex max-w-xl flex-col gap-4 lg:gap-8">
          <div data-hero-eyebrow className="flex flex-col gap-2 lg:gap-3">
            <Eyebrow rule>{project.name}</Eyebrow>
            <p className="t-eyebrow text-forest">{hero.eyebrow}</p>
          </div>

          <h1 data-hero-headline id="hero-headline" className="t-h1 text-charcoal">
            {hero.headline}
          </h1>

          <p data-hero-sub className="t-body-lg text-charcoal/75">
            {hero.support}
          </p>

          {/*
            The conversion. No `data-*` motion hook, no entrance, no delay: it
            renders with the document and is usable before Anime.js has been
            asked for an opinion.
          */}
          <EnquiryPanel id="enquiry" labelledBy="hero-headline" className="lg:mt-1" />

          <div data-hero-actions className="flex flex-wrap items-center gap-4">
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
        element stays on the light ground it was designed for. It also reads as
        a magazine masthead, which suits the page better than a full bleed.
      */}
      <div className="relative lg:h-full lg:pt-27">
        <Figure
          asset={images.campusAerial}
          priority
          sizes="(min-width: 64rem) 52vw, 100vw"
          ratio="aspect-[4/3] md:aspect-[16/10] lg:aspect-auto lg:h-full"
          className="h-full"
        />
        <p className="t-fine absolute right-4 bottom-4 bg-forest-deep/85 px-3 py-1.5 text-ivory">
          Artist’s impression
        </p>
      </div>
    </section>
  );
}
