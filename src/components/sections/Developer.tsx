import { Container } from '@/components/layout/Container.tsx';
import { Section } from '@/components/layout/Section.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { HairlineRule } from '@/components/ui/HairlineRule.tsx';
import { Metric } from '@/components/ui/Metric.tsx';
import { delivered, developer, sections, trackRecord } from '@/content/index.ts';
import { drawRule, revealText, revealUp, useAnimeScope } from '@/motion/index.ts';

/**
 * Who is behind this.
 *
 * The trust argument here is a list, not a badge. Twenty-three delivered
 * projects are named — every one of them printed in the brochure and every one
 * of them standing somewhere a buyer can drive to — and the counts beside them
 * are computed from that list rather than typed in, so the headline figure can
 * never drift away from its own evidence.
 *
 * What is deliberately absent: awards, ratings, "years of experience", "India's
 * No. 1", customer counts, square-footage-delivered totals. No source supports
 * any of them, and docs/design.md §28 forbids decorative trust badges. A family
 * checking a developer will look the projects up; the page should make that
 * easy rather than ask to be believed.
 */
export function Developer() {
  const copy = sections.developer;

  const ref = useAnimeScope<HTMLDivElement>(({ reduced, root }) => {
    if (reduced) return;
    revealUp('[data-reveal-up]', { stagger: 90, root });
    revealText('[data-reveal-headline]');
    drawRule('[data-rule]', { root });
    revealUp('[data-metrics] > *', { stagger: 140, root });
    revealUp('[data-projects] > li', { stagger: 30, root });
  });

  return (
    <Section id="developer" tone="forest" rhythm="large">
      <div ref={ref}>
        <Container className="flex flex-col gap-block lg:gap-24">
          <header className="grid gap-block lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
            <div className="flex flex-col gap-7">
              <div data-reveal-up>
                <Eyebrow rule>{copy.eyebrow}</Eyebrow>
              </div>
              <h2 data-reveal-headline className="t-h1 text-ivory">
                {copy.headline}
              </h2>
            </div>

            <div className="flex flex-col gap-8 lg:pt-4">
              <p data-reveal-up className="t-body-lg text-ivory/85">
                {copy.lead}
              </p>
              <HairlineRule tone="gold" className="w-20" />
              <p data-reveal-up className="t-body text-ivory/75">
                {copy.body}
              </p>
              <p data-reveal-up className="t-eyebrow text-accent">
                {developer.group.value}
              </p>
            </div>
          </header>

          <div data-metrics className="flex flex-wrap gap-x-20 gap-y-10 border-t border-ivory/15 pt-12">
            <Metric value={String(trackRecord.deliveredCount)} label={copy.deliveredLabel} />
            <Metric value={String(trackRecord.ongoingCount)} label={copy.ongoingLabel} />
            {/* Not a <Metric>: four region names set in 44px display serif would
                run three lines and read as a headline rather than as a figure. */}
            <div className="flex max-w-xs flex-col gap-2">
              <span className="t-h3 text-ivory">{trackRecord.regions.join(' · ')}</span>
              <span className="t-eyebrow text-ivory/75">{copy.regionsLabel}</span>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h3 className="t-eyebrow text-ivory/75">{copy.listLabel}</h3>
            <ul
              data-projects
              className="m-0 grid list-none grid-cols-1 gap-x-12 gap-y-5 p-0 md:grid-cols-2 lg:grid-cols-3"
            >
              {delivered.value.map((item) => (
                <li key={`${item.name}-${item.location}`} className="flex flex-col gap-1">
                  <span className="t-small text-ivory/85">{item.name}</span>
                  <span className="t-fine text-ivory/75">{item.location}</span>
                </li>
              ))}
            </ul>
            <p className="t-fine text-ivory/75">{copy.reraNote}</p>
          </div>
        </Container>
      </div>
    </Section>
  );
}
