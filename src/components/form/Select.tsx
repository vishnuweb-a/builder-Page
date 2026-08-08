import type { SelectHTMLAttributes } from 'react';
import { cx } from '@/lib/cx.ts';
import { useFieldContext } from './FieldContext.ts';
import { fieldSurface } from './fieldStyles.ts';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'aria-describedby' | 'aria-invalid' | 'required' | 'className' | 'children'
> & {
  options: readonly SelectOption[];
  /** Shown as a disabled first option when the value is empty. */
  placeholder?: string;
  className?: string;
};

/**
 * Native select with the platform chevron replaced.
 *
 * Native on purpose: on mobile it opens the OS picker, which is faster to
 * complete than any custom listbox and needs no keyboard or focus-trap work.
 */
export function Select({ options, placeholder, className, ...props }: SelectProps) {
  const { id, describedBy, invalid, required } = useFieldContext('Select');

  return (
    <div className="relative">
      <select
        {...props}
        id={id}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className={cx(fieldSurface, 'cursor-pointer appearance-none pr-8', className)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-1 bottom-5 h-2 w-3 fill-none stroke-current stroke-[1.25] text-charcoal/65 [.surface-dark_&]:text-ivory/75"
      >
        <path d="M1 1.5 6 6.5 11 1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
