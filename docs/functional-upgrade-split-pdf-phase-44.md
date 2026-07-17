# Phase 44 - Split PDF Fixed Interval Mode

## Roadmap Confirmation

Selected priority: P1

Tool: Split PDF

Feature: Split every N pages

Roadmap status: open in `docs/functional-upgrade-roadmap.md`.

Functional-depth note: `docs/functional-depth-audit.md` classed fixed interval splitting lower than some other items, but the Phase 44 instruction explicitly required checking the functional roadmap. The roadmap lists `Split PDF | Split every N pages` under P1, so this phase implemented it.

## Previous Limitation

Before this phase, Split PDF had two modes:

- Extract page ranges into one PDF.
- Split every page into one PDF per page inside a ZIP.

It could not split a long PDF into regular chunks such as every 2, 5 or 10 pages.

## Targeted Benchmark

Observed public competitor behavior:

- Adobe Acrobat documents splitting PDFs by a fixed number of pages in Acrobat, while its online splitter emphasizes divider-based page range separation.
- iLovePDF documents `Fixed ranges`, including choosing a fixed page range number.
- PDF24 public help indicates its online Split PDF tool can split after every X pages.
- Sejda exposes split by pages/ranges and every-page extraction; fixed interval is less explicit in the free public page.

Product decision:

- Add a focused fixed interval mode.
- Do not add split by file size, bookmarks or AI/content-based splitting in this phase.
- Keep the mode browser-only with `pdf-lib` and `JSZip`.

## New Interface

Split PDF now exposes three modes:

- Extract page ranges
- Split every page
- Split every N pages

For Split every N pages:

- Presets: 2 pages, 5 pages, 10 pages
- Custom numeric input
- Minimum: 1
- Maximum: total page count
- Decimal, zero, negative, empty and out-of-range values are blocked.

The sidebar now reports:

- PDF file
- Pages
- Split mode
- Pages per PDF
- Output files
- Output

Invalid ranges and invalid fixed intervals are shown immediately instead of waiting for a failed click.

## Grouping Logic

Example with 23 pages and interval 5:

- Group 1: pages 1-5
- Group 2: pages 6-10
- Group 3: pages 11-15
- Group 4: pages 16-20
- Group 5: pages 21-23

The final incomplete group is preserved and named by its real page range.

## Output Naming

Fixed interval mode always outputs `split-pages.zip`.

ZIP entries use explicit page ranges:

- `split-pages-1-5.pdf`
- `split-pages-6-10.pdf`
- `split-pages-11-12.pdf`

For a single-page group:

- `split-pages-1.pdf`

This is intentionally more explicit than generic names like `part1.pdf`.

## Engine

Current engine:

- `pdf-lib` for page copying.
- `JSZip` for ZIP output.

Required engine:

- Current engine is sufficient.

No new dependency was added.

## Privacy And Analytics

Privacy model preserved: yes.

All splitting remains local in the browser. Analytics only receives aggregate workflow information through the mode string, such as:

- `fixed_interval_5_pages_3_files`

It does not receive:

- file name
- document content
- exact page content
- page text
- local path

## Tests

Fixture added:

- `phase44-markers.pdf`
- 12 pages
- Each page contains a unique marker:
  - `PHASE44-PAGE-1`
  - ...
  - `PHASE44-PAGE-12`

Main result test:

- Input: 12 pages
- Interval: 5
- Expected ZIP:
  - `split-pages-1-5.pdf`
  - `split-pages-6-10.pdf`
  - `split-pages-11-12.pdf`

Verified:

- ZIP is valid.
- Exactly 3 PDF entries.
- Names are exact.
- First PDF has 5 pages.
- Second PDF has 5 pages.
- Third PDF has 2 pages.
- Page markers are present in the correct PDFs.
- Page markers are absent from the wrong PDFs.

Additional cases tested:

- interval 1
- interval 2
- interval 10
- interval equal to total pages
- interval greater than total pages
- decimal interval
- PDF 1 page
- PDF 100 pages with interval 10
- existing Extract page ranges workflow
- existing Split every page workflow

## Validation

Commands run:

- `npm run lint` - OK
- `npm run typecheck` - OK
- `npm run build` - OK
- `npm run test:e2e` - OK

E2E result:

- 62 passed
- 8 skipped
- 0 failed

Targeted tests:

- `split PDF creates fixed interval ZIP groups with explicit names` - OK
- `merge, split, delete, extract, reorder and compress PDFs` - OK

Build impact:

- `/split-pdf` first-load JS: 339 kB
- Page component size after change: 7.99 kB
- No new dependency.

## Local Production Verification

Route:

- `http://127.0.0.1:3067/split-pdf`

Chromium:

- Uploaded `phase44-markers.pdf`.
- Selected Split every N pages.
- Set pages per PDF to 5.
- Downloaded `split-pages.zip`.
- Verified entries:
  - `split-pages-1-5.pdf`
  - `split-pages-6-10.pdf`
  - `split-pages-11-12.pdf`
- Verified page counts:
  - 5
  - 5
  - 2

Firefox:

- Route loaded.
- Split every N pages selected.
- Group preview showed `Pages 11-12`.
- No page errors.

Mobile Chromium:

- Route loaded.
- File uploaded.
- Split every N pages selected.
- Pages per PDF input usable.
- Group preview showed `Pages 11-12`.

## Rejected In This Phase

Split by bookmarks:

- Still useful but requires outline parsing and a dedicated fixture.

Split by file size:

- Not deterministic with `pdf-lib` copying and would require estimation loops.

Smart/content-based splitting:

- Too broad, high maintenance, and not needed for this P1.

Custom output naming templates:

- Useful but separate from fixed interval grouping.

Direct PDF output for single-group fixed interval:

- Rejected for consistency. Fixed interval mode always produces a ZIP of explicitly named group PDFs, even when only one group is created.

## Summary

Selected priority: P1

Tool: Split PDF

Feature: Split every N pages

Implemented: YES

Real output grouping verified: YES

ZIP entries verified: YES

Page order preserved: YES

Last partial group handled: YES

Existing split modes preserved: YES

Output valid: YES

Privacy model preserved: YES

New dependency: NO

Bundle impact: LOW, page component increased modestly; no dependency added

100-page test: YES

Mobile verified: YES

Firefox verified: YES

Lint: OK

Typecheck: OK

Build: OK

E2E: OK

Production deployed: PENDING

Next remaining P1: Protect PDF verified permission controls, Unlock PDF restriction-only behavior, or JPG/PNG EXIF handling depending on the next roadmap pass.
