import { createContext, useContext } from 'react';

export interface FieldContextValue {
  /** Id of the control, wired to the label's `htmlFor`. */
  readonly id: string;
  /** Space-separated ids of hint and/or error text, or undefined. */
  readonly describedBy: string | undefined;
  readonly invalid: boolean;
  readonly required: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Controls read their wiring from the enclosing <Field>.
 *
 * Throwing when the context is missing is deliberate: it makes an unlabelled
 * input a build-time-visible bug rather than a silent accessibility failure
 * discovered in an audit.
 */
export function useFieldContext(component: string): FieldContextValue {
  const ctx = useContext(FieldContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside a <Field> so it has an associated label.`);
  }
  return ctx;
}
