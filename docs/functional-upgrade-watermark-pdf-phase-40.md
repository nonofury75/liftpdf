# Watermark PDF Functional Upgrade

Date: 2026-07-17  
Tool: `/watermark-pdf`  
Phase: 40

## Priority Selection

Reference documents read:

- `docs/functional-depth-audit.md`
- `docs/functional-upgrade-roadmap.md`
- `docs/compress-pdf-professional-upgrade.md`
- `docs/functional-upgrade-add-page-numbers.md`

Already treated:

- Compress PDF P0: real QPDF WASM compression modes.
- Add Page Numbers P1: skip first page and page range targeting.

Remaining P1 candidates after filtering:

| Tool | Feature | Status |
|---|---|---|
| Compress PDF | Before/after visual comparison, structural preservation tests, metadata toggle | Deferred by Phase 40 instruction: do not modify Compress PDF unless critical regression. |
| JPG/PNG/Images to PDF | Editable output filename, EXIF, per-image rotation | Valuable, but shared across a tool family and riskier for a single-tool phase. |
| PDF to JPG/PNG | Memory guard/progress for 100-page files | Useful, but less directly visible in the final file. |
| Merge PDF | Editable filename / per-file protected error | Useful, but filename does not change PDF content. |
| Watermark PDF | Page range | Selected. It changes the PDF output directly and is next in roadmap implementation order after Add Page Numbers. |
| Protect PDF | Permission toggles if verified | Useful but higher crypto compatibility risk. |
| Unlock PDF | Restriction-only PDF handling | Useful but higher QPDF edge-case risk. |
| PDF to Text | Page range | Useful, but lower visual/professional editing impact than Watermark page range. |

## Decision

Selected priority: P1  
Tool: Watermark PDF  
Feature: Page range targeting  

Why this feature is next:

- It is listed in the roadmap as `Watermark PDF | Page range`.
- It is the next item in the roadmap implementation order after Add Page Numbers.
- It fixes a currently incomplete professional workflow: users often need to watermark only selected pages, appendices, drafts or confidential sections.
- It is fully browser-feasible with the existing `pdf-lib` draw loop.
- It can be verified programmatically by extracting text from the final PDF.

## Targeted Benchmark

Observed/documented public competitor behavior:

- Adobe Acrobat documentation states that watermark settings include font, size, rotation, opacity and page range.
- iLovePDF’s watermark guide describes page range options and layer placement.
- Smallpdf-related public materials describe applying watermarks to certain pages with page range options.
- PDF24 publicly exposes a general watermark tool with configurable watermark options, but public documentation is less explicit about page range in the main tool page.

Sources:

- Adobe Help: `https://helpx.adobe.com/acrobat/desktop/edit-documents/add-backgrounds-and-watermarks/add-watermarks.html`
- iLovePDF tool: `https://www.ilovepdf.com/pdf_add_watermark`
- iLovePDF guide: `https://www.ilovepdf.com/blog/how-to-watermark-pages-in-a-pdf-document-online`
- PDF24: `https://tools.pdf24.org/en/add-watermark`
- Smallpdf guide: `https://smallpdf.com/blog/how-to-add-watermark-to-pdf-2-free-methods`

No competitor internals were inferred.

## Previous Limitation

LiftPDF previously applied text or image watermarks to every page. That was fine for basic drafts, but incomplete for professional documents where only selected pages should be marked.

Examples:

- watermark only pages containing confidential attachments;
- watermark only a preview section;
- leave a cover page or signed page clean;
- watermark only pages being sent for review.

## New Functionality

New controls:

1. `All pages`
   - Default behavior.
   - Preserves the previous workflow.

2. `Page range`
   - Accepts input such as `2-5` or `1,3,7`.
   - Deduplicates repeated pages.
   - Rejects empty input.
   - Rejects pages outside the PDF.
   - Rejects descending ranges such as `5-2`.

Preview:

- Targeted pages show the watermark overlay.
- Skipped pages show no overlay and receive a `Skipped` badge.
- Watermarked pages receive a `Watermarked` badge.

Export:

- Only targeted pages are modified.
- Page count remains unchanged.
- Output remains `watermarked.pdf`.

## Engine

- Current engine: `pdf-lib`
- Required engine: existing `pdf-lib`
- New dependency: none
- Browser-side processing: yes
- Privacy model: unchanged

`pdf-lib` is sufficient because this feature selects which pages receive existing text/image drawing operations.

## Files Modified

- `components/tools/watermark-pdf-tool.tsx`
  - Added `All pages` / `Page range` targeting.
  - Added range parsing and validation.
  - Updated text and image watermark export loops to skip non-target pages.
  - Updated preview overlay and page status badges.
  - Added sidebar summary for pages watermarked.

- `app/watermark-pdf/page.tsx`
  - Updated public description and FAQ to describe page range targeting.

- `data/premium-tool-content.ts`
  - Updated Watermark PDF content to mention selected-page watermarking.

- `tests/e2e/product-audit.spec.ts`
  - Added result-level assertions for Watermark PDF page range.

## Result Tests

Targeted Playwright test:

`edit tools generate valid PDFs`

Checks:

- Existing Watermark PDF workflow still generates a valid 10-page PDF.
- Page range workflow uses text watermark `PHASE40-WATERMARK`.
- Page range `2-3` produces a valid 10-page PDF.
- Extracted text from page 1 does not contain `PHASE40-WATERMARK`.
- Extracted text from page 2 contains `PHASE40-WATERMARK`.
- Extracted text from page 3 contains `PHASE40-WATERMARK`.
- Extracted text from page 4 does not contain `PHASE40-WATERMARK`.

Targeted result: OK.

## Options Rejected

- Even/odd pages: useful later, but page range is the P1 roadmap item.
- Layer above/below content: listed as P3/optional and not part of this pass.
- Tiling spacing controls: useful for power users, but not needed to prove selected-page watermarking.
- Signature/stamp workflow: explicitly rejected in the functional audit as a different tool category.

## Performance and Mobile

Expected impact:

- Bundle impact: small local UI/range parsing addition.
- Measured build route size: `/watermark-pdf` is 7.28 kB first-route JS in the Next build output.
- Memory impact: unchanged from existing watermark workflow.
- Mobile impact: one additional option group plus optional range input.

## Validation Status

- Targeted Chromium Playwright result test: OK
- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- `npm run test:e2e`: OK, 60 passed, 6 skipped mobile-heavy workflow tests
- Local production start: OK
- Firefox verification: OK, `watermarked.pdf` downloaded and `%PDF` magic bytes verified
- Production deployment: OK
- Commit: `7afe932`
- Vercel deployment: `https://liftpdf-2pdrtkj79-rachator75010-5712s-projects.vercel.app`
- Vercel status: READY
- Production URL: `https://liftpdf.com/watermark-pdf`
- Production workflow: OK
- Production output: `watermarked.pdf`
- Production output magic bytes: `%PDF`
- Production page errors / console errors / critical failed requests: none detected during smoke test

## Summary

Selected priority: P1  
Tool: Watermark PDF  
Feature: Page range targeting  
Implemented: YES  
Real output difference verified: YES_TARGETED_CHROMIUM  
Output valid: YES_TARGETED_CHROMIUM  
Previous workflow preserved: YES_TARGETED_CHROMIUM  
Privacy model preserved: YES  
New dependency: NO  
Bundle impact: SMALL_ROUTE_LOCAL_ONLY  
Mobile verified: YES_ROUTE_AND_RESPONSIVE_E2E  
Firefox verified: YES_TARGETED_LOCAL_PRODUCTION  
Lint: OK  
Typecheck: OK  
Build: OK  
E2E: OK  
Production deployed: YES  
Next remaining P1: Image-to-PDF output filename/per-image rotation or PDF to Text page range, to be selected in a later phase.
