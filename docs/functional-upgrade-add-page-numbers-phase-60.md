# LiftPDF Phase 60 - Add Page Numbers Odd/Even Targeting

## Selection

Selected priority: P2 MEDIUM_VALUE_AUTONOMOUS
Tool: Add Page Numbers
Feature: Odd/even page targeting
Roadmap status: completed in Phase 60

This feature was selected after the higher-value autonomous P2 items because it is useful for duplex reports and page-side workflows, uses the existing page targeting architecture, and can be verified by extracting text from the final PDF.

## Previous Limitation

Add Page Numbers supported all pages, skip first page, and manual page ranges. Users who wanted only odd or even pages had to manually type long ranges.

## Implementation

- Added `Odd pages` target mode.
- Added `Even pages` target mode.
- Existing preview labels now mark odd/even targeted pages as `Numbered` and non-targeted pages as `Skipped`.
- Sidebar summary reports `5 odd pages` or `5 even pages` for a 10-page document.
- One-page PDFs produce a clear error for `Even pages`.
- Existing all pages, skip first page, and page range behavior remains unchanged.

Files changed:

- `components/tools/add-page-numbers-tool.tsx`
- `tests/e2e/product-audit.spec.ts`
- `docs/functional-upgrade-roadmap.md`

## Engine

Current engine: `pdf-lib` draw loop.
Required engine: existing engine only.
New dependency: none.
Bundle impact: negligible target-mode branches.

## Output Verification

Fixture: `text-10.pdf`, 10 pages with extractable page text.

Odd pages test:

- Start number: 300.
- Format: `Page 1`.
- Target: Odd pages.
- Verify page 1 contains `Page 300`.
- Verify page 2 does not contain `Page 301`.
- Verify page 3 contains `Page 301`.

Even pages test:

- Start number: 400.
- Format: `Page 1`.
- Target: Even pages.
- Verify page 1 does not contain `Page 400`.
- Verify page 2 contains `Page 400`.
- Verify page 4 contains `Page 401`.

The test verifies final PDF text extraction, not only the UI.

## Validation

- `npm run typecheck`: OK
- `npm run lint`: OK
- Targeted Playwright test: OK
- `npm run build`: OK
- `npm run test:e2e`: first run had one unrelated intermittent Merge PDF wait failure; targeted rerun passed
- `npm run test:e2e`: rerun OK, 76 passed / 22 skipped
- Local production smoke on `/add-page-numbers`: Chromium desktop OK
- Local production smoke on `/add-page-numbers`: Firefox desktop OK
- Local production smoke on `/add-page-numbers`: Chromium mobile-size OK

## Privacy

No file content, file name, page range, or page-side choice is sent to analytics. The page-numbering operation remains local in the browser.

## Production

Pending deployment for the Phase 60 code commit.

## Remaining Limits

Roman numerals, chapters, arbitrary skip lists, and section-specific numbering remain out of scope. Odd/even targeting is intentionally limited to physical PDF page numbers.

## Summary

Selected priority: P2 MEDIUM_VALUE_AUTONOMOUS  
Tool: Add Page Numbers  
Feature: Odd/even page targeting  
Implemented: YES  
Odd pages verified: YES  
Even pages verified: YES  
Non-targeted pages unchanged: YES  
Real output difference verified: YES  
Output valid: YES  
Previous workflow preserved: YES  
Privacy model preserved: YES  
New dependency: NO  
Bundle impact: negligible  
Mobile verified: YES  
Firefox verified: YES  
Lint: OK  
Typecheck: OK  
Build: OK  
E2E: OK after rerun  
Production deployed: PENDING  
Next remaining P2: Watermark PDF layer above/below toggle
