# Assets

Provenance is the organising principle here, not file type. On a page whose
job is trust, the difference between an actual ATS render and an illustrative
image must never be ambiguous at a glance.

```
assets/
├── images/
│   ├── project/          ATS-originated. Safe to present as the project.
│   │   ├── renders/      Architectural renders (exterior, pool, landscape, interiors)
│   │   ├── plans/        Floor plans + isometric cutaways, Type A / Type B
│   │   └── site/         Site plan, landscape layout, location map
│   └── illustrative/     NOT the project. Must carry a visible caption if ever used.
├── logos/                ATS + Kingston Heath marks
└── icons/                Inline SVG, hairline style, matching the brochure
```

## Rules

1. **`project/` is for ATS-originated imagery only.** Anything in here may be
   shown without a qualifier, subject to the standard artist's-impression
   disclaimer (`disclaimers.imagery` in `src/content/project.ts`).
2. **`illustrative/` is empty and should stay that way** unless marketing
   supplies approved lifestyle imagery. Generic stock added merely to fill a
   layout is what makes a page look templated — and misrepresents the product.
3. **Do not copy the brochure's stock lifestyle photography here.** The
   brochure's licence covers print, not this website. Pages 1–5, 8–11 and 28 of
   the brochure are licensed stock and are excluded pending confirmation.
4. **No duplicates.** One source file per asset; responsive variants are
   generated at build time, not committed by hand.

## Fonts

Not stored here. Cormorant Garamond and Manrope are vendored through npm
(`@fontsource/*`) and emitted as self-hosted, content-hashed woff2 at build
time — no Google Fonts CDN request at runtime. See `src/index.css`.

## Source imagery

Eleven usable project visuals were identified in the brochure during research.
The highest native resolution among the renders is 1395×926, which is below
what a full-bleed desktop hero needs; the hero is therefore art-directed as a
contained editorial frame. Originals have been requested from ATS.

### Renders vs. drawings

The two kinds of asset came out of the PDF by different routes, and it matters:

- **Renders** (pool deck, green lawns, campus aerial) are embedded bitmaps.
  1395px is all there is, and no amount of processing will produce more.
- **Drawings** (both floor plans, the site plan, the location map) are *vector*
  artwork. They have no embedded bitmap at all, so they were rasterised from
  the page geometry at 500 dpi and downscaled. That is why the floor plans are
  sharp enough to read at 1600px inside the dialog while the renders are not,
  and why re-exporting them larger is possible later if it is ever needed.

The drawings are drawn on white paper. Each is tinted so pure white lands on
`--ivory-raised` (#FAF8F3), which is what stops a plan from sitting in a
glowing white box on an ivory page. The tint is a linear per-channel scale
rather than a threshold, so antialiased line edges pick up no halo.

### Still missing

- **The Kingston Heath wordmark.** It appears on the brochure cover and on the
  location map as artwork, but no usable *project* logo file has been supplied.
  The header pairs the ATS corporate mark with the project name set in type.
  Request the Kingston Heath mark from ATS.
- **Vector ATS artwork.** See "The ATS mark" below — what was supplied is a
  raster JPEG, and an SVG would replace four derived files with one.
- **Interior renders.** docs/design.md §8 asks for living room, master bedroom,
  family lounge and kids' bedroom visuals. The brochure's interior photography
  is licensed stock (pp. 8–11) and is excluded. Until ATS supplies interior
  renders, the residences are communicated by drawing and dimension — which is
  honest, and is why the floor-plan dialog matters as much as it does.

## The ATS mark

`icons/LOGO.jpeg` is the file as supplied: a 1280×668 JPEG of the ATS lockup
(diamond mark, "ATS" in forest green, "The better way home." in red) on a
**flattened black ground**. That black is not part of the design — it is a
transparent PNG that was saved to JPEG somewhere upstream — so it was keyed out
to alpha rather than shipped as a black box sitting on an ivory header.

Everything else is derived from it and should be regenerated, not hand-edited,
if a better original arrives:

| File | What it is |
| --- | --- |
| `logos/ats-logo.png` | 400×209 lockup, alpha. What `<Logo>` renders. |
| `public/og-logo.png` | 1280×668 lockup, alpha. Share cards only. |
| `public/favicon.png` | 256×256, diamond mark only. |
| `public/apple-touch-icon.png` | 180×180, same crop. |

Two constraints follow from the artwork itself and are worth knowing before
placing it anywhere new:

1. **It cannot go directly on `--forest`.** The wordmark is forest green and
   the strapline is red; both die against the dark ground. `<Logo plate>`
   sets it on ivory instead. Recolouring a registered corporate mark is not a
   decision this codebase gets to make.
2. **The favicon is the diamond alone.** The wordmark and strapline are mush
   below about 64px, and a favicon has to survive 16.

A vector original would collapse all four files into one and remove the JPEG
noise that keeps the 400px PNG at 43kB. It has been requested.
