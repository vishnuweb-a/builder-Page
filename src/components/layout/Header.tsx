import { useEffect, useState } from 'react';
import { Container } from './Container.tsx';
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
          'flex items-center justify-between gap-6',
          'transition-[padding] duration-500 ease-[var(--ease-out)]',
          scrolled ? 'py-3 lg:py-4' : 'py-5 lg:py-7',
        )}
      >
        {/* Wordmark */}
        <a
          href="#overview"
          className={cx(
            'flex flex-col gap-1 no-underline transition-colors duration-500',
            scrolled ? 'text-ivory' : 'text-charcoal',
          )}
        >
          <span className="t-h3 leading-none font-semibold tracking-tight">{project.name}</span>
          <span className={cx('t-eyebrow text-[0.625rem]', scrolled ? 'text-gold' : 'text-charcoal/55')}>
            {project.locality.value}
          </span>
        </a>

        <div className="flex items-center gap-8">
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

          <CTAButton variant={scrolled ? 'gold' : 'secondary'} onClick={() => open('header')}>
            <span className="hidden lg:inline">{cta.primaryShort}</span>
            <span className="lg:hidden">Book</span>
          </CTAButton>
        </div>
      </Container>
    </header>
  );
}
