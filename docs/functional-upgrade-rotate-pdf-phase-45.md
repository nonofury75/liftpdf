# Phase 45 - Rotate PDF Advanced Page Targeting

## Roadmap Confirmation

Selected priority: P1

Tool: Rotate PDF

Feature: Advanced page targeting

Roadmap status:

- `docs/functional-depth-audit.md` lists Rotate PDF as P1 with `Even/odd/range shortcuts, reset all, keyboard support`.
- `docs/functional-upgrade-roadmap.md` does not include a detailed Rotate PDF row in the visible P1 table, but the functional-depth audit is the source document for this open gap.
- The feature was not delivered in phases 38-44.

Decision: implement the Rotate PDF targeting gap now, limited to one tool and one functional depth pass.

## Previous Limitation

Before this phase, Rotate PDF supported:

- individual page rotation
- rotating all pages left/right
- reset rotations
- valid `rotated.pdf` export

It did not provide professional bulk targeting for:

- odd pages
- even pages
- typed page ranges
- selected visual pages as a bulk action target

## Targeted Benchmark

Observed public competitor behavior:

- Adobe Acrobat Online publicly says users can rotate specific pages or all pages left/right.
- Smallpdf documents individual page rotation and finishing/download workflow.
- iLovePDF exposes bulk rotation by all, portrait or landscape pages.
- PDF24 shows page thumbnails and lets users rotate pages visually.
- Sejda and PDFsam publicly document odd/even/page-range rotation workflows.

Product decision:

- Add All pages, Selected pages, Odd pages, Even pages and Page range.
- Keep only 90 left, 90 right and 180 degree actions.
- Do not add arbitrary angle rotation.
- Do not add orientation-based Portrait/Landscape targeting in this phase.

## New Interface

Added a `Pages to rotate` section with:

- All pages
- Selected pages
- Odd pages
- Even pages
- Page range

For Page range:

- Input: `1-3, 6, 9-12`
- Parser: central `lib/page-ranges.ts`
- Errors are shown inline.
- Invalid targets disable rotation actions.

Actions:

- Rotate left 90 deg
- Rotate right 90 deg
- Rotate 180 deg

Each page preview now displays:

- page number
- current rotation
- targeted / not targeted state

Selected pages mode adds per-page selection buttons in the preview.

## Rotation Logic

The target mode only controls the next bulk action. It does not erase existing rotations.

Rotations accumulate:

- 0 -> 90 -> 180 -> 270 -> 0

Reset rotations:

- resets every page preview to 0 degrees
- preserves the selected target mode until the tool is reset

Export uses `pdf-lib` page rotation:

- page count preserved
- page order preserved
- non-targeted pages unchanged
- output filename remains `rotated.pdf`

## Analytics And Privacy

Privacy model preserved: yes.

All processing remains local in the browser.

Analytics mode is aggregate only:

- target mode
- targeted page count

Not sent:

- file name
- raw range input
- page numbers
- document content
- local paths

## Tests

Fixture added:

- `phase45-markers.pdf`
- 10 pages
- each page includes a marker:
  - `PHASE45-PAGE-1`
  - ...
  - `PHASE45-PAGE-10`

Result tests added:

- Odd pages + Rotate right:
  - pages 1, 3, 5, 7, 9 -> 90 degrees
  - pages 2, 4, 6, 8, 10 -> 0 degrees
- Even pages + Rotate left:
  - pages 2, 4, 6, 8, 10 -> 270 degrees
  - odd pages unchanged
- Page range `2-4,8` + Rotate 180:
  - pages 2, 3, 4, 8 -> 180 degrees
  - all others unchanged
- Duplicate range `1,1,3`:
  - pages deduplicated
- Selected page cumulative rotation:
  - page 2 receives 90 then 90 -> 180 degrees
- All pages:
  - all pages -> 180 degrees
- Reset:
  - rotations return to 0
- Invalid out-of-range:
  - action disabled
- PDF 1 page:
  - Odd targets page 1
  - Even targets 0 pages and disables action
- PDF 100 pages:
  - odd pages rotated
  - page count remains 100
  - first/last sampled rotations verified

Tests inspect actual page rotation using `pdf-lib`, not only the download.

## Validation

Commands run:

- `npm run lint` - OK
- `npm run typecheck` - OK
- `npm run build` - OK
- `npm run test:e2e` - OK

E2E result:

- 63 passed
- 9 skipped
- 0 failed

Targeted test:

- `rotate PDF targets all selected odd even and page ranges` - OK

Build impact:

- `/rotate-pdf` page size: 5.02 kB
- first-load JS: 304 kB
- no new dependency

## Local Production Verification

Route:

- `http://127.0.0.1:3068/rotate-pdf`

Chromium:

- uploaded `phase45-markers.pdf`
- selected Page range
- entered `2-4,8`
- applied Rotate 180 deg
- generated `rotated.pdf`
- verified rotations:
  - page 1: 0
  - page 2: 180
  - page 3: 180
  - page 4: 180
  - page 5: 0
  - page 8: 180

Firefox:

- route loaded
- Odd pages mode usable
- targeted previews visible
- Rotate right action usable

Mobile Chromium:

- route loaded
- Page range mode usable
- range input usable
- Rotate 180 action updates preview

## Production Verification

Route:

- `https://liftpdf.com/rotate-pdf`

Deployment:

- `https://liftpdf-odr9us9o0-rachator75010-5712s-projects.vercel.app`

Status:

- Vercel READY

Chromium production:

- uploaded `phase45-markers.pdf`
- selected Page range
- entered `2-4,8`
- applied Rotate 180 deg
- generated `rotated.pdf`
- verified rotations:
  - page 1: 0
  - page 2: 180
  - page 3: 180
  - page 4: 180
  - page 5: 0
  - page 8: 180
- no page errors
- no critical failed requests

Mobile Chromium production:

- route loaded
- Page range mode usable
- range input usable
- Rotate 180 action updates preview

## Rejected In This Phase

Arbitrary rotation angles:

- Rejected. PDF page rotation is naturally 90-degree based and arbitrary angles would require a different visual/content transformation.

Portrait/Landscape targeting:

- Rejected for this phase. Useful, but odd/even/range has higher value for scanned duplex documents and is easier to validate precisely.

Every N-th page:

- Rejected for this phase to keep the UI focused.

Keyboard shortcuts:

- Still useful but separate from page targeting.

## Summary

Selected priority: P1

Tool: Rotate PDF

Feature: Advanced page targeting

Implemented: YES

All pages verified: YES

Selected pages verified: YES

Odd pages verified: YES

Even pages verified: YES

Page range verified: YES

Cumulative rotations verified: YES

Reset verified: YES

Non-targeted pages unchanged: YES

Output valid: YES

Previous workflow preserved: YES

Privacy model preserved: YES

New dependency: NO

Bundle impact: LOW

100-page test: YES

Mobile verified: YES

Firefox verified: YES

Lint: OK

Typecheck: OK

Build: OK

E2E: OK

Production deployed: YES

Next remaining P1: Protect PDF verified permission controls, Unlock PDF restriction-only behavior, or JPG/PNG EXIF handling depending on the next roadmap pass.
