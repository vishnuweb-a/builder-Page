import type { FormHTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@/lib/cx.ts';

interface FormContainerProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'className'> {
  children: ReactNode;
  className?: string;
  /**
   * Declared explicitly because React 19 passes `ref` as an ordinary prop but
   * `FormHTMLAttributes` does not describe one. The form uses it to move focus
   * to the first invalid control by name after a failed submit.
   */
  ref?: Ref<HTMLFormElement>;
}

/**
 * Form shell.
 *
 * `noValidate` is set so validation messaging is ours: the browser's native
 * bubbles cannot be styled, are not announced consistently, and stop at the
 * first invalid field. Phase 2 supplies the validation itself; this only
 * establishes the shell and its rhythm.
 *
 * No `action` is set: submission goes through the `onSubmit` handler and the
 * provider module in src/lib/lead, so a failed post keeps the visitor on the
 * page with their message intact rather than navigating them to a bare
 * response body.
 */
export function FormContainer({ children, className, ...props }: FormContainerProps) {
  return (
    <form noValidate {...props} className={cx('flex flex-col gap-7', className)}>
      {children}
    </form>
  );
}
