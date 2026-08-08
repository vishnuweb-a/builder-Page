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
  'text-charcoal placeholder:text-charcoal/35',
  'border-stone transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
  'hover:border-charcoal/45',
  'focus:border-charcoal',
  '[.surface-dark_&]:text-ivory [.surface-dark_&]:placeholder:text-ivory/35',
  '[.surface-dark_&]:border-ivory/25 [.surface-dark_&]:hover:border-ivory/50',
  '[.surface-dark_&]:focus:border-gold',
  'aria-invalid:border-danger [.surface-dark_&]:aria-invalid:border-gold',
  'disabled:cursor-not-allowed disabled:opacity-45',
);
