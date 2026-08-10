import { cx } from '@/lib/cx.ts';

/**
 * Shared control surface for Input and Select.
 *
 * Bottom rule only — a boxed field reads as a CRM form, and docs/design.md §14
 * asks for "clean fields, minimal borders, strong focus states". The global
 * :focus-visible outline is deliberately left in place on top of the rule
 * colour change: an outline is the only focus signal that survives Windows
 * high-contrast mode.
 */
export const fieldSurface = cx(
  'w-full min-h-13 bg-transparent px-0 py-3',
  't-body max-w-none rounded-none border-0 border-b',
  'text-charcoal placeholder:text-charcoal/45',
  /*
   * The rule is `--sage-line`, not the warm `--stone` it used to be. Two
   * reasons, and the first is the one that matters: stone measures 1.4:1 on
   * the ivory panel, which is not a visible boundary for a control — WCAG 2.2
   * asks 3:1 of a component edge, and the mid green clears it at 3.4:1. The
   * second is that a warm grey line is the one neutral that reads as "off" on
   * a green ground now that the page has one.
   */
  'border-sage-line transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
  'hover:border-forest',
  'focus:border-forest-deep',
  /* No ivory variant for the value or the placeholder. The drawer is a light
     panel now, and typed text that inverted to ivory on it would be invisible
     — which is worse than an unreadable placeholder, because the visitor
     cannot check what they entered before sending it. Charcoal value, grey
     placeholder, on every surface. */
  '[.surface-dark_&]:border-ivory/40 [.surface-dark_&]:hover:border-ivory/70',
  '[.surface-dark_&]:focus:border-gold-lift',
  'aria-invalid:border-danger [.surface-dark_&]:aria-invalid:border-gold-lift',
  'disabled:cursor-not-allowed disabled:opacity-45',
);
