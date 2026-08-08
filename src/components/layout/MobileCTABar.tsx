import { useEffect, useState } from 'react';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { useLeadDrawer } from '@/components/lead/LeadDrawerContext.ts';
import { cta } from '@/content/index.ts';
import { cx } from '@/lib/cx.ts';

/**
 * The persistent mobile conversion bar (docs/prd.md §14).
 *
 * Four things it must not do, each of which is handled here rather than left
 * to CSS luck:
 *
 * • Cover content. The bar is `fixed`, so <MobileCTASpacer> reserves the same
 *   height at the foot of the page — otherwise the last line of the regulatory
 *   strip sits permanently underneath it.
 * • Ignore the home indicator. `env(safe-area-inset-bottom)` is added to its
 *   padding, so on an iPhone the label is not half-swallowed by the gesture
 *   bar.
 * • Fight the lead drawer. It hides itself while the drawer is open — on a
 *   phone the drawer enters from the bottom edge, exactly where this sits.
 *   `inert` takes it out of the tab order at the same moment. (The floor-plan
 *   dialog needs no such handling: it traps Tab and covers the bar with its
 *   own scrim.)
 * • Appear on desktop. `lg:hidden`, and the header's own CTA takes over there.
 *
 * It also stays out of the way for the first screen, and that rule got stricter
 * once the enquiry form moved into the first viewport: a fixed bar reading
 * "Book a Site Visit" floating over the panel that says SEND ENQUIRY is two
 * primary actions arguing on a 375px screen.
 *
 * So the trigger is the panel itself rather than a scroll distance. The bar
 * appears only once #enquiry has left the viewport entirely — which is exactly
 * the moment it stops being duplication and starts being useful. A scroll
 * threshold cannot express that: 85% of the viewport height still leaves the
 * form on screen on a tall phone, and overshoots it on a short one.
 */
export function MobileCTABar() {
  const { open, isOpen } = useLeadDrawer();
  const [past, setPast] = useState(false);

  useEffect(() => {
    const panel = document.getElementById('enquiry');

    // Fallback for any page that renders this bar without the panel. Keeps the
    // bar working rather than pinning it permanently hidden or permanently on.
    if (!panel) {
      const onScroll = () => setPast(window.scrollY > window.innerHeight);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  const shown = past && !isOpen;

  return (
    <div
      inert={!shown}
      className={cx(
        'surface-dark fixed inset-x-0 bottom-0 z-30 lg:hidden',
        'bg-forest/95 backdrop-blur-sm',
        'border-t border-ivory/12',
        'px-gutter pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]',
        'transition-[opacity,transform] duration-[var(--dur-base)] ease-[var(--ease-out)]',
        'motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0',
      )}
    >
      <CTAButton variant="gold" onClick={() => open('mobile-bar')} className="w-full">
        {cta.mobile}
      </CTAButton>
    </div>
  );
}

/**
 * The height the fixed bar occupies: the md button (3.25rem) plus its 0.75rem
 * padding top and bottom, plus the home-indicator inset. Rendered at the foot
 * of the page so nothing ever ends up underneath the bar.
 */
export function MobileCTASpacer() {
  return (
    <div
      aria-hidden="true"
      className="h-[calc(4.75rem+env(safe-area-inset-bottom))] bg-charcoal lg:hidden"
    />
  );
}
