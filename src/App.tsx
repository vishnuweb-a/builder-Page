import { Header } from './components/layout/Header.tsx';
import { MobileCTABar, MobileCTASpacer } from './components/layout/MobileCTABar.tsx';
import { LeadDrawerProvider } from './components/lead/LeadDrawerProvider.tsx';
import { Hero } from './components/sections/Hero.tsx';
import { Promise } from './components/sections/Promise.tsx';
import { Residences } from './components/sections/Residences.tsx';
import { Lifestyle } from './components/sections/Lifestyle.tsx';
import { Amenities } from './components/sections/Amenities.tsx';
import { Location } from './components/sections/Location.tsx';
import { Developer } from './components/sections/Developer.tsx';
import { ClosingCTA } from './components/sections/ClosingCTA.tsx';
import { RegulatoryStrip } from './components/sections/RegulatoryStrip.tsx';

/**
 * The complete property story, with the conversion at the top of it.
 *
 * The order is an argument, not a menu. Each section answers the question the
 * previous one raises — but the enquiry no longer waits for the end of the
 * argument, because most of this page's traffic arrives from an ad and decides
 * in the first screen:
 *
 *   Hero          what is this, where — AND THE FORM
 *   Promise       why space is the proposition
 *   Residences    what you would actually live in  → CTA
 *   Lifestyle     what is outside the window
 *   Amenities     what the campus gives a family   → CTA
 *   Location      how it connects                  → CTA
 *   Developer     who is behind it
 *   Closing       the invitation                   → CTA
 *   Regulatory    what you can check
 *
 * The form is an opportunity, never a gate: every section below is reachable
 * without submitting anything, and a visitor who does submit stays exactly
 * where they are and can carry on reading.
 */
export default function App() {
  return (
    <LeadDrawerProvider>
      <a
        href="#main"
        className="t-button sr-only bg-forest px-6 py-4 text-ivory focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Promise />
        <Residences />
        <Lifestyle />
        <Amenities />
        <Location />
        <Developer />
        <ClosingCTA />
      </main>

      <RegulatoryStrip />
      <MobileCTASpacer />
      <MobileCTABar />
    </LeadDrawerProvider>
  );
}
