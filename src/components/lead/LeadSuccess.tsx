import { useEffect, useRef } from 'react';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
import { HairlineRule } from '@/components/ui/HairlineRule.tsx';
import { leadForm } from '@/content/index.ts';
import { cx } from '@/lib/cx.ts';

interface LeadSuccessProps {
  /** Set when the confirmation replaces a dialog's own title. */
  titleId?: string;
  /** Rendered only when there is something to dismiss — i.e. in the drawer. */
  onClose?: () => void;
  className?: string;
}

/**
 * The confirmation, shared by the first-viewport panel and the drawer.
 *
 * One component rather than two, for the same reason there is one form: two
 * copies of a confirmation drift, and the one that drifts is always the one
 * nobody is looking at.
 *
 * It takes focus on mount. Two reasons: the submit button focus was on has just
 * been unmounted, so leaving focus on <body> would drop a keyboard user back to
 * the top of the document (and, in the drawer, break the dialog's trap); and
 * moving focus to a container holding the new heading is what makes a screen
 * reader announce the outcome at all, since the form did not navigate anywhere.
 * This is a response to a deliberate action — it is NOT the page-load focus
 * theft the brief rules out, which is about the empty form.
 *
 * The wording promises only that someone will be in touch. No callback window,
 * no reference number, no "your visit is confirmed" — nothing has been
 * confirmed, and a landing page that says otherwise is lying on the developer's
 * behalf at the exact moment it has earned some trust.
 */
export function LeadSuccess({ titleId, onClose, className }: LeadSuccessProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div ref={ref} tabIndex={-1} className={cx('flex flex-col gap-6 outline-none', className)}>
      <h2 id={titleId} className="t-h2 text-charcoal [.surface-dark_&]:text-ivory">
        {leadForm.successTitle}
      </h2>

      <HairlineRule tone="gold" className="w-16" />

      <p className="t-body-lg text-charcoal/75 [.surface-dark_&]:text-ivory/75">
        {leadForm.successBody}
      </p>

      {onClose && (
        <CTAButton variant="secondary" onClick={onClose} className="mt-2 self-start">
          {leadForm.successClose}
        </CTAButton>
      )}
    </div>
  );
}
