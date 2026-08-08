import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { Section } from '@/components/layout/Section.tsx';
import { ContactActions } from '@/components/ui/ContactActions.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import { formatPhone, telHref } from '@/lib/contact.ts';
import {
  contact,
  contactActions,
  developer,
  disclaimers,
  pricing,
  project,
  publish,
  regulatory,
  sections,
} from '@/content/index.ts';

/**
 * Regulatory information.
 *
 * Everything on a real-estate advertisement that a buyer is entitled to check,
 * set as a considered end to the page rather than as a wall of small print:
 * a labelled grid at 12px, one hairline, no boxes, no scare capitals.
 *
 * Two deliberate omissions:
 *
 * • The collection bank account number and IFSC code printed on the brochure's
 *   back cover are NOT modelled anywhere in this codebase. Publishing them on a
 *   page that advertising traffic lands on invites payment fraud against
 *   buyers, and the sales team can give them to a genuine purchaser directly.
 *
 * The two numbers on this page are different things and stay labelled as such.
 * The campaign line sits in the sales block above the grid, where a visitor who
 * has read to the end of the page can reach a human. The ATS corporate office
 * switchboard stays in the grid under "Corporate office" — it is what the
 * brochure prints, and calling it a sales line would be the first dishonest
 * thing on the page.
 */

function Entry({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="t-eyebrow text-ivory/75">{label}</dt>
      <dd className="t-fine m-0 text-ivory/75">{children}</dd>
    </div>
  );
}

const linkClass =
  'text-ivory/80 underline decoration-gold/60 underline-offset-4 transition-colors hover:decoration-gold';

export function RegulatoryStrip() {
  const campaignPhone = publish(contact.campaignPhone);
  const price = publish(pricing.perSqFt);
  const copy = sections.regulatory;

  return (
    <Section tone="charcoal" rhythm="default" label="Project and regulatory information">
      <Container as="footer" className="flex flex-col gap-10">
        <Eyebrow rule>{copy.eyebrow}</Eyebrow>

        {/*
          The sales block. Set as an editorial line — a display-type number and
          two quiet channels above a hairline — rather than as a card of filled
          buttons: this is the last thing on the page, and it should read like
          the close of a brochure, not a support widget. It is also the reason
          the campaign number no longer appears in the grid below; one number,
          one place.
        */}
        {campaignPhone && (
          <div className="flex flex-col gap-5 border-b border-ivory/12 pb-10">
            <p className="t-eyebrow m-0 text-ivory/75">{contactActions.footerHeading}</p>

            <div className="flex flex-col gap-x-12 gap-y-5 md:flex-row md:items-center md:justify-between">
              {/* The number is set, not linked. Linking it would put a second
                  `tel:` beside the Call action below it — one screen-reader
                  user hearing "Call ATS Kingston Heath" twice in a row, for no
                  extra reach. The actions own the interaction; this owns the
                  fact, and stays selectable and copyable. */}
              <p className="t-numeral m-0 text-ivory">{formatPhone(campaignPhone)}</p>

              <ContactActions placement="footer" appearance="inline" />
            </div>
          </div>
        )}

        <dl className="m-0 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          <Entry label={copy.reraLabel}>
            <span className="t-small block text-ivory">{regulatory.reraNumber.value}</span>
            <a
              href={regulatory.reraSite.value}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {copy.reraSiteLabel} up-rera.in
            </a>
          </Entry>

          <Entry label={copy.groupLabel}>
            <span className="t-small block text-ivory">{developer.group.value}</span>
            {developer.entity.value}
          </Entry>

          <Entry label={copy.siteLabel}>{regulatory.siteAddress.value}</Entry>

          <Entry label={copy.officeLabel}>
            {regulatory.corporateOffice.value}
            <br />
            <a href={telHref(contact.corporatePhone.value)} className={linkClass}>
              0120-7111500
            </a>
          </Entry>

          <Entry label={copy.startedLabel}>{regulatory.projectStartDate.value}</Entry>

          <Entry label="Project">
            {project.name} · {project.sector}, {project.city}
          </Entry>

          <Entry label={copy.chargesLabel}>{pricing.excludedCharges.value.join(' · ')}</Entry>

          <Entry label="ATS">
            <a
              href={developer.website.value}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              atsgreens.com
            </a>
            <br />
            <a href={`mailto:${developer.email.value}`} className={linkClass}>
              {developer.email.value}
            </a>
            <br />
            Member, {developer.membership.value}
          </Entry>
        </dl>

        <div className="flex flex-col gap-3 border-t border-ivory/12 pt-8">
          <p className="t-fine max-w-4xl text-ivory/75">
            {disclaimers.imagery.value} {disclaimers.area.value} {disclaimers.amenities.value}{' '}
            {disclaimers.sitePlan.value}
          </p>
          {/* The price disclaimer accompanies a price. There is no published
              price, so printing its disclaimer would only imply one exists. */}
          {price && (
            <p className="t-fine max-w-4xl text-ivory/75">{pricing.disclaimer.value}</p>
          )}
          <p className="t-fine text-ivory/75">
            © {new Date().getFullYear()} {developer.entity.value}. {developer.tagline.value}
          </p>
        </div>
      </Container>
    </Section>
  );
}
