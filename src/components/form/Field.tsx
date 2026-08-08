import { useId, type ReactNode } from 'react';
import { cx } from '@/lib/cx.ts';
import { FieldContext } from './FieldContext.ts';

interface FieldProps {
  label: string;
  children: ReactNode;
  /** Helper text shown under the label. */
  hint?: string;
  /** Error message. Presence of this switches the field into its invalid state. */
  error?: string;
  required?: boolean;
  className?: string;
}

/**
 * Label + control + hint + error, wired for assistive technology.
 *
 * Follows the form rules surfaced by the ui-ux-pro-max UX database:
 * visible label (never placeholder-only), error rendered directly below the
 * offending control rather than collected at the top of the form, and
 * announced via role="alert" so it is not a colour-only signal.
 */
export function Field({ label, children, hint, error, required = false, className }: FieldProps) {
  const uid = useId();
  const id = `${uid}-control`;
  const hintId = hint ? `${uid}-hint` : undefined;
  const errorId = error ? `${uid}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <FieldContext value={{ id, describedBy, invalid: Boolean(error), required }}>
      <div className={cx('flex flex-col gap-2', className)}>
        <label htmlFor={id} className="t-eyebrow text-charcoal/70 [.surface-dark_&]:text-ivory/75">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-accent">
              *
            </span>
          )}
        </label>

        {hint && (
          <p id={hintId} className="t-fine text-charcoal/65 [.surface-dark_&]:text-ivory/75">
            {hint}
          </p>
        )}

        {children}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="t-small flex items-start gap-1.5 text-danger [.surface-dark_&]:text-gold-lift"
          >
            <span aria-hidden="true">↳</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    </FieldContext>
  );
}
