import type { ReactNode } from 'react';
import { contact, contactActions, publish } from '@/content/index.ts';
import { formatPhone, telHref, whatsappHref } from '@/lib/contact.ts';
import { cx } from '@/lib/cx.ts';

/**
 * Call and WhatsApp — the two secondary contact paths (docs/prd.md §2).
 *
 * Three rules hold this component to its place in the hierarchy:
 *
 * • It is never a button. "Book a Private Site Visit" owns <CTAButton> and its
 *   solid fill; these are links that read as links. A visitor scanning the
 *   header must still see one dominant action, not three competing ones.
 * • It carries no Anime.js. src/motion/presets.ts is explicit that CSS owns
 *   hover and focus and Anime.js owns entrances — a JS-driven hover here would
 *   be both slower and off-architecture. The movement is a colour shift and the
 *   same champagne hairline <CTAButton> draws, nothing more. No pulse, no
 *   bounce, no infinite loop; docs/design.md §17 asks for calm.
 * • It reads the number from the content layer and derives every URL through
 *   src/lib/contact.ts, so no placement can drift from another.
 *
 * `data-contact-action` / `data-placement` are here for the analytics phase
 * (docs/prd.md §21 lists `phone_click` and `whatsapp_click` with a placement).
 * No analytics library exists in this project yet and this task is not the
 * moment to introduce one, so the hooks are attributes: a later delegated
 * listener can read them without touching this file again. Nothing the visitor
 * types is involved — these attributes are a channel and a placement, never
 * a name, an email or a message.
 */

export type ContactPlacement = 'header' | 'footer';

/** Icon-only for tight rails (the header); icon + label where there is room. */
type ContactAppearance = 'icon' | 'inline';

/* --- Icons -------------------------------------------------------------- */

/**
 * Stroked handset, matching the 1.25px line weight of the existing dialog
 * icons. Drawn rather than imported: two glyphs do not justify an icon
 * package, and a package would arrive with its own sizing conventions.
 */
function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-[1.125rem] w-[1.125rem] shrink-0 stroke-current stroke-[1.5]"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.5 16.9v2.7a1.9 1.9 0 0 1-2.1 1.9 18.8 18.8 0 0 1-8.2-2.9 18.5 18.5 0 0 1-5.7-5.7A18.8 18.8 0 0 1 2.6 4.6 1.9 1.9 0 0 1 4.5 2.5h2.7a1.9 1.9 0 0 1 1.9 1.6c.1.9.3 1.8.7 2.7a1.9 1.9 0 0 1-.4 2L8.2 9.9a15.2 15.2 0 0 0 5.7 5.7l1.1-1.2a1.9 1.9 0 0 1 2-.4c.9.4 1.8.6 2.7.7a1.9 1.9 0 0 1 1.8 2Z" />
    </svg>
  );
}

/**
 * The WhatsApp mark. Filled rather than stroked on purpose — the glyph is a
 * registered logo and a stroked redraw of it is both unrecognisable and a
 * misuse of the mark.
 */
function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[1.125rem] w-[1.125rem] shrink-0 fill-current"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/* --- The link ----------------------------------------------------------- */

interface ContactActionProps {
  channel: 'call' | 'whatsapp';
  href: string;
  /** Always applied. For `icon` it is the only accessible name. */
  ariaLabel: string;
  /** Rendered beside the icon in the `inline` appearance. */
  label: string;
  icon: ReactNode;
  appearance: ContactAppearance;
  placement: ContactPlacement;
  /** WhatsApp leaves the site; `tel:` hands off without navigating. */
  external?: boolean;
  className?: string;
}

const base = cx(
  'group relative inline-flex items-center justify-center no-underline',
  // 44px in both axes on every appearance — the WCAG 2.2 target minimum, and
  // the reason the icon variant is a square rather than a hugged 18px glyph.
  'min-h-11',
  'transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
  // Light ground (transparent header over the hero); ivory once the surface is
  // dark, which covers both the scrolled header and the footer.
  'text-charcoal/65 hover:text-charcoal',
  '[.surface-dark_&]:text-ivory/75 [.surface-dark_&]:hover:text-ivory',
);

const appearances: Record<ContactAppearance, string> = {
  // Square, so the 44px minimum holds on the axis an icon does not fill.
  icon: 'w-11',
  // Height still comes from min-h-11; width is the label's.
  inline: 't-eyebrow px-1',
};

export function ContactAction({
  channel,
  href,
  ariaLabel,
  label,
  icon,
  appearance,
  placement,
  external = false,
  className,
}: ContactActionProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      data-contact-action={channel}
      data-placement={placement}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cx(base, appearances[appearance], className)}
    >
      <span
        className={cx(
          'inline-flex items-center gap-2.5',
          // The only movement: the glyph lifts a single pixel. Matched to the
          // CTA's own 1px lift so the page has one idea of "responding".
          'transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]',
          'group-hover:-translate-y-px motion-reduce:transform-none',
        )}
      >
        {icon}
        {appearance === 'inline' && <span aria-hidden="true">{label}</span>}
      </span>

      {/* Champagne hairline, drawn in on hover and focus — the same device as
          <CTAButton>. Decorative, so hidden from assistive technology. */}
      <span
        aria-hidden="true"
        className={cx(
          'pointer-events-none absolute inset-x-1 bottom-1.5 h-px origin-left scale-x-0 bg-gold',
          'transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]',
          'group-hover:scale-x-100 group-focus-visible:scale-x-100',
          'motion-reduce:transition-none',
        )}
      />
    </a>
  );
}

/* --- The pair ----------------------------------------------------------- */

interface ContactActionsProps {
  placement: ContactPlacement;
  appearance?: ContactAppearance;
  /**
   * Hold the WhatsApp action back until `md`. Only the header needs this, and
   * only because of arithmetic: at 375px the wordmark, two 44px targets and the
   * primary CTA come to ~379px inside a 335px content box. Something has to
   * give, and it is not going to be the 44px target or the primary CTA. Call
   * survives at every width; WhatsApp joins it at 768px and is carried in full
   * by the footer below that.
   */
  compact?: boolean;
  className?: string;
}

/**
 * Call, then WhatsApp, in that order everywhere. WhatsApp renders only when a
 * WhatsApp line is actually published — see the note on `contact.whatsapp`.
 */
export function ContactActions({
  placement,
  appearance = 'icon',
  compact = false,
  className,
}: ContactActionsProps) {
  const phone = contact.campaignPhone.value;
  const whatsapp = publish(contact.whatsapp);

  return (
    <div className={cx('flex items-center', appearance === 'icon' ? 'gap-0.5' : 'gap-6', className)}>
      <ContactAction
        channel="call"
        href={telHref(phone)}
        ariaLabel={`${contactActions.call.ariaLabel} on ${formatPhone(phone)}`}
        label={contactActions.call.label}
        icon={<PhoneIcon />}
        appearance={appearance}
        placement={placement}
      />

      {whatsapp && (
        <ContactAction
          channel="whatsapp"
          href={whatsappHref(whatsapp, contactActions.whatsapp.prefill)}
          ariaLabel={contactActions.whatsapp.ariaLabel}
          label={contactActions.whatsapp.label}
          icon={<WhatsAppIcon />}
          appearance={appearance}
          placement={placement}
          className={compact ? 'hidden md:inline-flex' : undefined}
          external
        />
      )}
    </div>
  );
}
