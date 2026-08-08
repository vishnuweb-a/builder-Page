import { cx } from '@/lib/cx.ts';

interface HairlineRuleProps {
  tone?: 'gold' | 'stone' | 'ivory';
  className?: string;
}

const tones = {
  gold: 'bg-gold',
  stone: 'bg-stone',
  ivory: 'bg-ivory/25',
} as const;

/**
 * A 1px architectural rule. Carries `data-rule` so the motion layer can draw a
 * whole section's rules with one `drawRule('[data-rule]')` call.
 */
export function HairlineRule({ tone = 'stone', className }: HairlineRuleProps) {
  return <span data-rule aria-hidden="true" className={cx('block h-px w-full', tones[tone], className)} />;
}
