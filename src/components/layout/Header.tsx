import { useEffect, useState } from 'react';
import { Container } from './Container.tsx';
import { ContactActions } from '@/components/ui/ContactActions.tsx';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { Logo } from '@/components/ui/Logo.tsx';
import { cta, nav, project } from '@/content/index.ts';
import { cx } from '@/lib/cx.ts';

/**
 * Every entry in `nav` now has a section to land on. Phase 2 kept an allow-list
 * here because Location and the ATS block did not exist yet; that has been
 * replaced by a development-time assertion, which is strictly better — an
 * allow-list silently drops a link when someone renames a section id, whereas
 * this shouts about it in the console the moment the page loads.
 */
function useAssertAnchorsExist() {
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const missing = nav.filter((item) => !document.getElementById(item.id));
    if (missing.length > 0) {
      console.error(
        `[nav] dead anchor(s): ${missing.map((m) => `#${m.id}`).join(', ')}. ` +
          'Every entry in content/copy.ts `nav` must match a rendered section id.',
      );
    }
  }, []);
}

/**
 * Minimal header.
 *
 * Transparent over the hero's ivory ground, settling into deep green once the
 * visitor scrolls — a colour and height change only. No shadow, no blur, no
 * border: docs/design.md §16 asks for restraint, and a heavy sticky bar is the
 * fastest way to make a premium page look like a template.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useAssertAnchorsExist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-40',
        'transition-colors duration-500 ease-[var(--ease-out)]',
        scrolled ? 'surface-dark bg-forest' : 'bg-transparent',
      )}
    >
      <Container
        className={cx(
          // Tighter at 375px: the wordmark, a 44px call target and the CTA add
          // up to ~302px inside a 335px content box, so the gaps are what pays
          // for the contact actions rather than the touch target.
          'flex items-center justify-between gap-3 lg:gap-6',
          'transition-[padding] duration-500 ease-[var(--ease-out)]',
          scrolled ? 'py-3 lg:py-4' : 'py-5 lg:py-7',
        )}
      >
        {/*
          Wordmark. One link, two renderings of the same thing.

          Below `lg` it is the ATS mark; from `lg` up it is the project name set
          in type, exactly as before. The two never appear together, and that is
          a measurement rather than a taste: from 1024 up the right rail alone
          runs 861px of nav, contact targets and CTA against a 1160px content
          box, so a 61px mark beside a ~215px name pushes the name into its own
          ellipsis. Below `lg` the nav is hidden and the 375px content box has
          no room for two lines of type either — but it has room for the mark,
          which is also the stronger brand signal on a phone.

          `aria-label` on the link keeps the accessible name identical in both,
          so the swap is purely visual.
        */}
        <a
          href="#overview"
          aria-label={`${project.name}, ${project.locality.value} — back to top`}
          className={cx(
            'flex min-w-0 items-center no-underline transition-colors duration-500',
            scrolled ? 'text-ivory' : 'text-charcoal',
          )}
        >
          {/* The plate only reads as a plate once the bar turns green; over the
              hero it is the same ivory as the page behind it. */}
          <Logo plate={scrolled} className="h-8" containerClassName="lg:hidden" />

          <span aria-hidden="true" className="hidden min-w-0 flex-col gap-1 lg:flex">
            {/* `truncate` is a safety net, not a layout choice: it should never
                fire at the four target widths, but if a future label grows it
                ellipsizes here instead of scrolling the whole page sideways. */}
            <span className="t-h3 truncate leading-none font-semibold tracking-tight">
              {project.name}
            </span>
            <span
              className={cx(
                't-eyebrow truncate text-[0.625rem]',
                scrolled ? 'text-gold-lift' : 'text-charcoal/65',
              )}
            >
              {project.locality.value}
            </span>
          </span>
        </a>

        {/*
          The right rail, in ascending order of weight: sections, then the two
          contact channels, then the one action this page is for. The contact
          icons are links with no fill and no border — at a glance the eye still
          lands on a single solid CTA, which is the whole point of putting them
          here rather than giving them buttons of their own.
        */}
        <div className="flex shrink-0 items-center gap-3 lg:gap-8">
          <nav aria-label="Sections" className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cx(
                  't-eyebrow no-underline transition-colors duration-300',
                  scrolled ? 'text-ivory/75 hover:text-ivory' : 'text-charcoal/65 hover:text-charcoal',
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:gap-5">
            <ContactActions placement="header" compact />

            {/* Hairline separating the secondary channels from the CTA. The
                brochure's own divider; it also keeps the icons from reading as
                part of the button. */}
            <span
              aria-hidden="true"
              className={cx(
                'hidden h-5 w-px transition-colors duration-500 md:block',
                scrolled ? 'bg-ivory/20' : 'bg-charcoal/15',
              )}
            />
          </div>

          {/*
            The header CTA is now a link to the form, not a button that opens a
            drawer.

            The form is in the first viewport, so a drawer here would be a
            second copy of something already on screen — and on a phone it would
            cover the very panel the visitor was heading for. An anchor to
            `#enquiry` scrolls to the real thing, hands keyboard focus to it (the
            panel carries `tabIndex={-1}` for exactly that), and needs no state.

            The drawer is untouched and still serves every CTA further down the
            page, where scrolling a visitor back to the top would be worse.
          */}
          <CTAButton href="#enquiry" variant={scrolled ? 'gold' : 'secondary'}>
            <span className="hidden lg:inline">{cta.primaryShort}</span>
            <span className="lg:hidden">Book</span>
          </CTAButton>
        </div>
      </Container>
    </header>
  );
}
