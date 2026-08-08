import type { TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/cx.ts';
import { useFieldContext } from './FieldContext.ts';
import { fieldSurface } from './fieldStyles.ts';

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id' | 'aria-describedby' | 'aria-invalid' | 'required' | 'className'
> & { className?: string };

/**
 * Multi-line counterpart to <Input>, on the same bottom-rule surface.
 *
 * `resize-y` rather than `resize-none`: a visitor writing more than three lines
 * should be able to see what they wrote, and taking the handle away to protect
 * a layout is the kind of tidiness that costs enquiries. Horizontal resize
 * stays off — that one can break the drawer.
 */
export function Textarea({ className, rows = 4, ...props }: TextareaProps) {
  const { id, describedBy, invalid, required } = useFieldContext('Textarea');

  return (
    <textarea
      {...props}
      id={id}
      rows={rows}
      required={required}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cx(fieldSurface, 'min-h-28 resize-y leading-relaxed', className)}
    />
  );
}
