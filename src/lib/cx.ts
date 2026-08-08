/**
 * Minimal class-name joiner.
 *
 * Deliberately not clsx + tailwind-merge: this page has a small, fixed set of
 * components with variant maps rather than deep prop-driven class overriding,
 * so ~8 KB of merge logic would buy nothing.
 */
export type ClassValue = string | false | null | undefined;

export const cx = (...values: ClassValue[]): string => values.filter(Boolean).join(' ');
