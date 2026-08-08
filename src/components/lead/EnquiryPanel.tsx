import { useState } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { leadForm } from '@/content/index.ts';
import { cx } from '@/lib/cx.ts';
import { LeadForm } from './LeadForm.tsx';
import { LeadSuccess } from './LeadSuccess.tsx';

interface EnquiryPanelProps {
  /** Anchor target. The header CTA links here rather than opening a drawer. */
  id?: string;
  /** The heading this panel belongs to — usually the first-viewport h1. */
  labelledBy?: string;
  className?: string;
}

/**
 * The first-viewport enquiry panel.
 *
 * A sheet of warm ivory on the page's light green ground, edged with a single
 * green hairline. That is the whole treatment: no glass, no blur, no drop
 * shadow, no rounded card. docs/design.md §7 asks for editorial composition,
 * and an inset panel of paper laid on a landscape colour is the device a
 * printed property campaign would use.
 *
 * It is NOT a drawer, a modal or a disclosure. It renders in the initial HTML,
 * in the initial viewport, with no opacity gate and nothing to click first —
 * a visitor arriving from an ad can type their name and send without any
 * interaction preceding it. It also does not take focus on mount: it is visible,
 * which is a different thing from being where the keyboard already is.
 *
 * `sent` lives here rather than in the form so that the reset is structural —
 * unmounting <LeadForm> is what drops the name from memory.
 */
export function EnquiryPanel({ id, labelledBy, className }: EnquiryPanelProps) {
  const [sent, setSent] = useState(false);

  return (
    /*
      A named region rather than a bare div: `aria-labelledby` points at the
      first-viewport headline, so the panel announces itself as "Book your
      private site visit" and appears in a screen reader's landmark list. That
      is how someone navigating by landmarks finds the form without it having
      grabbed their focus on load.
    */
    <section
      id={id}
      aria-labelledby={labelledBy}
      /*
        Focusable only as a link target. The header CTA is an ordinary anchor to
        this id, and `tabIndex={-1}` is what makes the browser move keyboard
        focus here on that jump instead of leaving it behind in the masthead —
        so the field is the next thing Tab reaches. It stays out of the tab
        order otherwise, and it never takes focus on page load.
      */
      tabIndex={-1}
      className={cx(
        'rounded-edge border border-sage-line/35 bg-ivory-raised',
        'px-5 py-4 outline-none md:p-9',
        className,
      )}
    >
      {sent ? (
        <LeadSuccess />
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          <Eyebrow rule>{leadForm.formTitle}</Eyebrow>

          <LeadForm onSuccess={() => setSent(true)} />

          <p className="t-fine text-charcoal/65">{leadForm.privacy}</p>
        </div>
      )}
    </section>
  );
}
