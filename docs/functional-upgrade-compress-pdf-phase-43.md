# Phase 43 - Compress PDF Metadata Removal

## Decision

Selected priority: P1

Tool: Compress PDF

Feature: Optional document metadata removal during compression

Why this was selected:

- Phase 38 already delivered real QPDF WASM compression modes.
- Phase 39 delivered Add Page Numbers page targeting.
- Phase 40 delivered Watermark PDF page range targeting.
- Phase 41 delivered PDF to Text page range targeting.
- Phase 42 delivered Images to PDF individual image rotation.
- The remaining P1 with the best balance of user value, browser feasibility and measurable file output was a Compress PDF privacy option: remove document metadata.

This was preferred over lower-impact P1 items such as editable output filenames, visual-only before/after preview work, or test-only preservation assertions because metadata removal changes the generated PDF itself and can be verified programmatically.

## Current Limitation Before Phase 43

Compress PDF supported three real QPDF WASM modes:

- Preserve quality
- Balanced
- Strong

However, users could not explicitly decide whether standard PDF metadata should be kept or removed. Strong mode previously bundled metadata removal into the mode behavior, which made the effect less visible and less controllable.

## Targeted Competitor Check

Publicly observable competitor pattern:

- Adobe treats metadata removal as a separate Acrobat workflow rather than a clear option in the basic online compressor.
- Smallpdf discusses metadata cleanup as a privacy workflow adjacent to compression, not as a simple public compressor control.
- iLovePDF documents metadata editing/removal in its broader product set.
- PDF24 exposes dedicated metadata removal tools in addition to compression.

Decision: LiftPDF should not pretend metadata cleanup is full redaction or sanitization. A simple browser-side toggle inside Compress PDF is useful, honest and aligned with LiftPDF's privacy positioning.

## Implementation

Files modified:

- `components/tools/pdf/qpdf-client.ts`
- `components/tools/compress-pdf-tool.tsx`
- `app/compress-pdf/page.tsx`
- `data/premium-tool-content.ts`
- `tests/e2e/product-audit.spec.ts`

Engine:

- Existing QPDF WASM engine.
- No new dependency.
- No backend.

New user control:

- `Remove document metadata`
- Default: off for Preserve quality and Balanced.
- Strong mode turns it on by default because strong compression is the most aggressive privacy/size-oriented path, but the user can still uncheck it.

QPDF behavior:

- Metadata removal is now passed explicitly through `compressPdfWithQpdf(..., { removeMetadata })`.
- When enabled, QPDF receives:
  - `--remove-metadata`
  - `--remove-info`

Analytics:

- No file names, metadata fields or PDF content are sent.
- Only an aggregate mode suffix is emitted:
  - `metadata_removed`
  - `metadata_kept`

## Acceptance Tests

Added e2e coverage:

- Metadata-rich PDF fixture keeps title/author/subject/creator when the option is off.
- Metadata-rich PDF removes those fields when the option is on.
- Output remains a valid PDF.
- Page count remains unchanged.
- Strong mode enables the metadata toggle by default.
- Existing QPDF compression mode test still verifies distinct output sizes across Preserve quality, Balanced and Strong.

Local production verification:

- Route tested: `http://127.0.0.1:3066/compress-pdf`
- Fixture: `metadata-rich.pdf`
- Mode: Preserve quality
- Toggle: Remove document metadata enabled
- Download: `compressed.pdf`
- Result:
  - valid PDF
  - 1 page
  - title metadata empty
  - no page errors
  - no critical console errors

## Validation

Commands run:

- `npm run lint` - OK
- `npm run typecheck` - OK
- `npm run build` - OK
- `npm run test:e2e` - OK

E2E result:

- 61 passed
- 7 skipped
- 0 failed

Targeted tests run before full suite:

- `compress PDF exposes real QPDF modes with measurable outputs` - OK
- `compress PDF can remove metadata without changing page count` - OK

Build result:

- `/compress-pdf` first-load JS: 129 kB
- No new dependency.
- No meaningful bundle increase from this feature.

## Privacy

Privacy model preserved: yes.

All processing remains local in the browser through QPDF WASM. No metadata, file names, document text, passwords or document content are sent to analytics.

## Rejected Options

Full redaction:

- Rejected. Metadata removal is not content redaction.

Guaranteed total sanitization:

- Rejected. PDF metadata can exist in complex custom structures. The UI only claims standard metadata removal through QPDF.

Target size:

- Rejected for this phase. It requires a separate approximate-size loop and should not be mixed with metadata removal.

New engine:

- Rejected. QPDF already supports the required output-level operation.

Backend processing:

- Rejected. It would weaken the local-processing promise.

## Remaining P1 Candidates

Potential next P1 items still open in the roadmap:

- Protect PDF: verified permission controls, only if QPDF applies them reliably.
- Unlock PDF: restriction-only PDF behavior.
- JPG/PNG/Images to PDF: EXIF orientation handling.
- Merge PDF: protected-file error specificity and editable output filename.
- PDF to JPG/PNG: large-document memory guard and clearer progress.

## Summary

Selected priority: P1

Tool: Compress PDF

Feature: Optional remove metadata toggle

Implemented: YES

Real output difference verified: YES

Metadata removed: YES

Metadata keep workflow preserved: YES

Output valid: YES

Pages preserved: YES

QPDF modes preserved: YES

Privacy model preserved: YES

New dependency: NO

Bundle impact: NONE OBSERVED

Mobile verified: ROUTE COVERED BY E2E; heavy PDF workflow skipped by existing mobile policy

Firefox verified: NOT YET IN THIS PHASE

Lint: OK

Typecheck: OK

Build: OK

E2E: OK

Production deployed: PENDING

Next remaining P1: Protect PDF verified permission controls or Unlock PDF restriction-only behavior, depending on final roadmap priority review.
