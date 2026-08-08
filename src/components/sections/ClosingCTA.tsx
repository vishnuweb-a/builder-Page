import { Container } from '@/components/layout/Container.tsx';
import { Section } from '@/components/layout/Section.tsx';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { HairlineRule } from '@/components/ui/HairlineRule.tsx';
import { useLeadDrawer } from '@/components/lead/LeadDrawerContext.ts';
import { cta, project, sections } from '@/content/index.ts';
import { drawRule, revealText, revealUp, useAnimeScope } from '@/motion/index.ts';

/**
 * The closing invitation.
 *
 * The last thing a visitor should read is the project's name, where it is, one
 * sentence, and one button. No countdown, no "only a few units left", no
 * "limited period offer" — nothing in any source supports a claim about
 * availability or about a deadline, and a family that has just been told the
 * page does not publish invented drive times would notice the contradiction
 * immediately.
 *
 * The regulatory detail that used to live here moved to <RegulatoryStrip>, so
 * this section can be the invitation and nothing else.
 */
export function ClosingCTA() {
  const { open } = useLeadDrawer();

  const ref = useAnimeScope<HTMLDivElement>(({ reduced, root }) => {
    if (reduced) return;
    revealUp('[data-reveal-up]', { stagger: 100, root });
    revealText('[data-reveal-headline]');
    drawRule('[data-rule]', { root });
  });

  return (
    <Section id="visit" tone="mist" rhythm="large" label="Book a site visit">
      <div ref={ref}>
        <Container className="flex flex-col items-start gap-10">
          <div data-reveal-up>
            <Eyebrow rule>{sections.closing.eyebrow}</Eyebrow>
          </div>

          <div data-reveal-up className="flex flex-col gap-3">
            <p className="t-h3 text-forest">{project.name}</p>
            <p className="t-eyebrow text-charcoal/65">
              {project.sector} · {project.city}
            </p>
          </div>

          <h2 data-reveal-headline className="t-display max-w-4xl text-charcoal">
            {sections.closing.headline}
          </h2>

          <HairlineRule tone="gold" className="w-20" />

          <p data-reveal-up className="t-body-lg text-charcoal/70">
            {sections.closing.body}
          </p>

          <div data-reveal-up className="flex flex-col gap-5 pt-2">
            <CTAButton size="lg" onClick={() => open('closing')}>
              {cta.primary}
            </CTAButton>
            <p className="t-small text-charcoal/65">{sections.closing.invitation}</p>
          </div>
        </Container>
      </div>
    </Section>
  );
}
