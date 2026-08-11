# LiftPDF Phase 61 - Watermark PDF Odd/Even Targeting

## Selection

Selected priority: P2 MEDIUM_VALUE_AUTONOMOUS
Tool: Watermark PDF
Feature: Odd/even page targeting
Roadmap status: completed in Phase 61

This feature was selected after Phase 60 because it extends the same professional page-side workflow to watermarking. The previously listed layer above/below toggle was not implemented because the current `pdf-lib` append draw flow can reliably draw over existing page content, but does not provide a simple deterministic below-content layer without deeper content-stream manipulation.

## Previous Limitation

Watermark PDF supported all pages and page ranges. Users who needed to watermark only odd or even pages had to type manual ranges.

## Implementation

- Added `Odd pages` target mode.
- Added `Even pages` target mode.
- The existing text and image watermark draw paths both use the same target page set.
- Preview cards continue to show `Watermarked` for targeted pages and `Skipped` for non-targeted pages.
- Sidebar summary reports `5 odd pages` or `5 even pages` for a 10-page document.
- One-page PDFs produce a clear error for `Even pages`.
- Existing all-pages and range behavior remains unchanged.

Files changed:

- `components/tools/watermark-pdf-tool.tsx`
- `tests/e2e/product-audit.spec.ts`
- `docs/functional-upgrade-roadmap.md`

## Engine

Current engine: `pdf-lib` text/image draw loop.
Required engine: existing engine only.
New dependency: none.
Bundle impact: negligible target-mode branches.

## Output Verification

Fixture: `text-10.pdf`, 10 pages with extractable text.

Odd pages test:

- Watermark text: `PHASE61-WM`.
- Target: Odd pages.
- Verify page 1 contains `PHASE61-WM`.
- Verify page 2 does not contain `PHASE61-WM`.
- Verify page 3 contains `PHASE61-WM`.

Even pages test:

- Watermark text: `PHASE61-WM`.
- Target: Even pages.
- Verify page 1 does not contain `PHASE61-WM`.
- Verify page 2 contains `PHASE61-WM`.
- Verify page 4 contains `PHASE61-WM`.

The test verifies final PDF text extraction, not only the UI.

## Validation

- `npm run typecheck`: OK
- `npm run lint`: OK
- Targeted Playwright test: OK
- `npm run build`: OK
- `npm run test:e2e`: OK, 76 passed / 22 skipped
- Local production smoke on `/watermark-pdf`: Chromium desktop OK
- Local production smoke on `/watermark-pdf`: Firefox desktop OK
- Local production smoke on `/watermark-pdf`: Chromium mobile-size OK

## Rejected Option

Watermark layer above/below toggle: rejected for this autonomous pass. Drawing over content is the current verified behavior. A true below-content implementation needs deterministic content stream insertion/prepending tests across PDFs with existing content, annotations, forms, and images. Shipping a UI toggle before proving that would be misleading.

## Privacy

No file content, file name, watermark text, target pages, or page-side choice is sent to analytics. Processing remains local in the browser.

## Production

- Commit: `8893b03 Upgrade Watermark PDF odd even targeting`
- Vercel deployment: `https://liftpdf-2xp1blcx3-rachator75010-5712s-projects.vercel.app`
- Vercel status: READY
- Production route tested: `https://liftpdf.com/watermark-pdf`
- HTTP 200: YES
- Chromium desktop production smoke: OK
- Firefox desktop production smoke: OK
- Chromium mobile-size production smoke: OK
- Odd pages summary visible: YES
- Even pages summary visible: YES
- Download link generated: YES
- Critical console/page/request errors: none observed

## Remaining Limits

Layer below content, tile spacing controls, and odd/even image-specific visual regression tests remain possible later phases. The current Phase 61 scope is page targeting only.

## Summary

Selected priority: P2 MEDIUM_VALUE_AUTONOMOUS  
Tool: Watermark PDF  
Feature: Odd/even page targeting  
Implemented: YES  
Odd pages verified: YES  
Even pages verified: YES  
Non-targeted pages unchanged: YES  
Real output difference verified: YES  
Output valid: YES  
Layer toggle implemented: NO, rejected as misleading with current engine  
Previous workflow preserved: YES  
Privacy model preserved: YES  
New dependency: NO  
Bundle impact: negligible  
Mobile verified: YES  
Firefox verified: YES  
Lint: OK  
Typecheck: OK  
Build: OK  
E2E: OK  
Production deployed: YES  
Production smoke: OK  
Next remaining P2: no clearly safe high-value autonomous P2; remaining items require human prioritization or deeper engine work
