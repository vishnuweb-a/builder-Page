import { createContext, useContext } from 'react';

/**
 * Where the visitor clicked. Not used yet — it becomes the `placement`
 * parameter on the `site_visit_cta_click` event in the analytics phase, which
 * is what tells marketing which CTA actually converts.
 */
export type CTAPlacement =
  | 'header'
  | 'hero'
  | 'residences'
  | 'amenities'
  | 'lifestyle'
  | 'location'
  | 'closing'
  | 'mobile-bar';

export interface LeadDrawerValue {
  readonly isOpen: boolean;
  readonly open: (placement: CTAPlacement) => void;
  readonly close: () => void;
  /**
   * Increments on every open. The drawer keys its body on it, which is how a
   * reopened drawer shows an empty form rather than the previous visitor's
   * message or a stale confirmation.
   */
  readonly session: number;
}

export const LeadDrawerContext = createContext<LeadDrawerValue | null>(null);

export function useLeadDrawer(): LeadDrawerValue {
  const ctx = useContext(LeadDrawerContext);
  if (!ctx) throw new Error('useLeadDrawer must be used inside <LeadDrawerProvider>.');
  return ctx;
}
