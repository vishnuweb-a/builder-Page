import type { InputHTMLAttributes } from 'react';
import { cx } from '@/lib/cx.ts';
import { useFieldContext } from './FieldContext.ts';
import { fieldSurface } from './fieldStyles.ts';

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'aria-describedby' | 'aria-invalid' | 'required' | 'className'
> & { className?: string };

/** Bottom-rule text input. Labelling and error wiring come from <Field>. */
export function Input({ className, ...props }: InputProps) {
  const { id, describedBy, invalid, required } = useFieldContext('Input');

  return (
    <input
      {...props}
      id={id}
      required={required}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cx(fieldSurface, className)}
    />
  );
}
