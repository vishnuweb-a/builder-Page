import { useEffect, useState } from 'react';
import { Container } from './Container.tsx';
import { ContactActions } from '@/components/ui/ContactActions.tsx';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { useLeadDrawer } from '@/components/lead/LeadDrawerContext.ts';
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
  const { open } = useLeadDrawer();
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
        {/* Wordmark */}
        <a
          href="#overview"
          className={cx(
            'flex min-w-0 flex-col gap-1 no-underline transition-colors duration-500',
            scrolled ? 'text-ivory' : 'text-charcoal',
          )}
        >
          {/* `truncate` is a safety net, not a layout choice: it should never
              fire at the four target widths, but if a future label grows it
              ellipsizes here instead of scrolling the whole page sideways. */}
          <span className="t-h3 truncate leading-none font-semibold tracking-tight">
            {project.name}
          </span>
          <span
            className={cx(
              't-eyebrow truncate text-[0.625rem]',
              scrolled ? 'text-gold' : 'text-charcoal/55',
            )}
          >
            {project.locality.value}
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
                  scrolled ? 'text-ivory/70 hover:text-ivory' : 'text-charcoal/60 hover:text-charcoal',
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

          <CTAButton variant={scrolled ? 'gold' : 'secondary'} onClick={() => open('header')}>
            <span className="hidden lg:inline">{cta.primaryShort}</span>
            <span className="lg:hidden">Book</span>
          </CTAButton>
        </div>
      </Container>
    </header>
  );
}
