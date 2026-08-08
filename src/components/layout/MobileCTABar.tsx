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
 * It also stays out of the way for the first screen: the hero already carries a
 * full-size CTA, and a bar that slides in on top of it is pure noise. It
 * appears once the visitor has scrolled past the hero.
 */
export function MobileCTABar() {
  const { open, isOpen } = useLeadDrawer();
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
