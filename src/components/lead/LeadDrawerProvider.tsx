import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { LeadDrawerContext, type CTAPlacement } from './LeadDrawerContext.ts';
import { LeadDrawer } from './LeadDrawer.tsx';

/**
 * Owns the enquiry drawer.
 *
 * Deliberately a boolean, the invoking element and a counter — no state
 * library, no reducer. The form's own state lives in the form, which is the
 * only component that needs it; hoisting three strings up here would put the
 * visitor's details in a context that every section subscribes to, for no gain.
 */
export function LeadDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<CTAPlacement>('hero');
  /**
   * Bumped on each open so the drawer can remount its body. Incremented here,
   * in the event handler that opens the drawer, rather than derived from
   * `isOpen` in an effect — an effect would run a render late and would fire
   * during the closing transition too.
   */
  const [session, setSession] = useState(0);
  /** Focus returns here on close — a hard requirement for dialog a11y. */
  const invokerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((from: CTAPlacement) => {
    invokerRef.current = document.activeElement as HTMLElement | null;
    setPlacement(from);
    setSession((n) => n + 1);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    invokerRef.current?.focus();
    invokerRef.current = null;
  }, []);

  const value = useMemo(
    () => ({ isOpen, open, close, session }),
    [isOpen, open, close, session],
  );

  return (
    <LeadDrawerContext value={value}>
      {children}
      <LeadDrawer isOpen={isOpen} onClose={close} placement={placement} session={session} />
    </LeadDrawerContext>
  );
}
