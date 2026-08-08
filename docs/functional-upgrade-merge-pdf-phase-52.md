# LiftPDF Phase 52 - Merge PDF Editable Output Filename

## Scope

- Route: `/merge-pdf`
- Selected priority: P1
- Feature: Editable output filename
- Out of scope: bookmarks, page-level merge, output directory, templates, metadata editing, auto-naming from source files

## Roadmap Status

`docs/functional-upgrade-roadmap.md` still lists `Merge PDF | Editable output filename` as a P1. Phase 51 also documents it as the next remaining P1 after per-file validation.

## Previous Limitation

Merge PDF always downloaded `merged.pdf`. Users could reorder, remove and validate files professionally after Phase 51, but the final merged package still required manual renaming after download.

## New UX

The Merge PDF sidebar now includes:

- `Output file name`
- default input value: `merged`
- output summary preview: `merged.pdf` or the normalized custom name
- inline validation error tied to the input with `aria-describedby`

The field remains editable:

- before merge
- after upload
- after reorder
- after removing a file
- after recovering from invalid/protected/empty-file issues

Reset / Start over restores the input to `merged`.

## Filename Normalization

A shared helper was added in `lib/output-filename.ts` and reused by Images to PDF and Merge PDF.

Rules:

- `contract-bundle` -> `contract-bundle.pdf`
- `contract-bundle.pdf` -> `contract-bundle.pdf`
- `contract-bundle.PDF` -> `contract-bundle.PDF`
- internal spaces are preserved
- leading/trailing spaces are trimmed
- `.pdf` extension checks are case-insensitive
- no arbitrary slugification is applied

Merge PDF rejects empty effective names. Images to PDF keeps its Phase 50 behavior where an empty value falls back to `images.pdf`.

## Validation

Rejected values include:

- empty or spaces-only names
- dots-only values such as `.` and `..`
- names containing `< > : " / \ | ? *`
- control characters
- values longer than 120 characters including `.pdf`

Invalid names disable `Merge PDF` immediately and show inline text. LiftPDF does not wait until download to report the problem.

## Download Behavior

The PDF content is unchanged. Only the download filename changes.

Both download paths use the same normalized filename:

- automatic download triggered after merge
- manual `Download PDF` link after success

The generated PDF is still a `Blob` with `application/pdf`, exported through the existing `pdf-lib` merge logic.

## Helper Shared With Images To PDF

Extracted logic:

- `getPdfOutputFileNameBase`
- `parsePdfOutputFileName`
- `getSafePdfOutputFileNameOrFallback`

Images to PDF behavior remains unchanged:

- `/images-to-pdf` still supports custom filename
- empty input still falls back to `images.pdf`
- `/jpg-to-pdf` and `/png-to-pdf` still do not expose the field

## Tests

Added coverage:

- helper normalization and rejection cases
- default Merge output remains `merged.pdf`
- custom Merge output without extension appends `.pdf`
- existing `.pdf` is not duplicated
- uppercase `.PDF` is not double-appended
- invalid slash disables Merge and shows an error
- empty/spaces-only name disables Merge and shows an error
- filename persists after reorder
- filename persists after invalid-file removal
- automatic download uses the custom name
- manual download uses the custom name
- reset restores `merged`
- final merged PDF parses with `pdf-lib`
- Phase 51 per-file validation remains intact
- Images to PDF regression remains intact

Two existing heavy tests received explicit 180s timeouts because they were already close to the 90s default in full-suite runs:

- Compress PDF QPDF mode comparison
- PDF to image 100-page workload

No product behavior changed for those tools.

## Local Validation

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- `npm run test:e2e`: OK, 71 passed, 17 skipped by existing project config

Targeted:

- Phase 52 Merge filename test: OK
- Phase 51 Merge validation regression: OK
- Images to PDF filename regression: OK
- helper normalization/rejection test: OK

Production build local:

- `npm run start` on `127.0.0.1:3022`: OK
- Chromium mobile custom filename + invalid recovery: OK
- Firefox custom filename + invalid recovery: OK
- final PDF parsed as 2 pages: OK
- critical console/page/request errors: none observed

## Analytics And Privacy

No filename is sent to GA4.

The filename remains only in client component state:

- no localStorage
- no sessionStorage
- no URL query
- no backend
- no logs
- no analytics payload

## Production

- Implementation commit: `17c7474 Upgrade Merge PDF output filename`
- Vercel deployment: `https://liftpdf-bilhj3jpu-rachator75010-5712s-projects.vercel.app`
- Vercel status: READY
- Production aliases: `https://liftpdf.com`, `https://www.liftpdf.com`
- Production URL tested: `https://liftpdf.com/merge-pdf`
- Chromium mobile production test: OK
- Firefox production test: OK
- Scenario 1: 2 valid PDFs, custom filename, reorder, merge, custom automatic/manual filename verified, PDF parsed as 2 pages
- Scenario 2: custom filename, invalid file added, invalid file removed, filename preserved, merge, PDF parsed as 2 pages
- Critical console/page/request errors: none observed

## Remaining P1

Remaining P1 count after this phase: 3

Likely next P1 candidates:

- JPG/PNG/Images to PDF EXIF orientation handling
- Compress PDF before/after visual comparison
- Compress PDF link/form/annotation preservation tests

## Summary

Selected priority: P1
Tool: Merge PDF
Feature: Editable output filename
Implemented: YES
Default merged.pdf preserved: YES
Custom filename verified: YES
.pdf appended automatically: YES
Existing .pdf not duplicated: YES
Uppercase .PDF handled: YES
Invalid characters rejected: YES
Empty filename rejected: YES
Filename preserved after reorder: YES
Filename preserved after file removal: YES
Filename preserved after validation error: YES
Automatic download uses custom filename: YES
Manual download uses custom filename: YES
Reset restores merged.pdf: YES
Final PDF valid: YES
Previous Merge workflow preserved: YES
Phase 51 per-file validation preserved: YES
Images to PDF regression: YES
Privacy model preserved: YES
Filename excluded from analytics: YES
New dependency: NO
Bundle impact: NONE
Mobile verified: YES
Firefox verified: YES
Lint: OK
Typecheck: OK
Build: OK
E2E: OK
Production deployed: YES
Remaining P1 count: 3
Next remaining P1: JPG/PNG/Images to PDF EXIF orientation handling
