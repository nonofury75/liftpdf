# Add Page Numbers Functional Upgrade

Date: 2026-07-17  
Tool: `/add-page-numbers`  
Phase: 39

## Selection Decision

There was no remaining untreated P0 in `docs/functional-upgrade-roadmap.md` after Phase 38 because every P0 item was Compress PDF and had already been completed. Compress PDF was therefore excluded as requested.

The highest documented untreated priority was P1. The selected item was:

- Tool: Add Page Numbers
- Feature: page targeting with `Skip first page` and custom `Page range`
- Roadmap source: `Add Page Numbers | Skip first page / page range`

## Why This Feature

Professional page numbering often starts after a cover page, a title sheet or front matter. Applying numbers to every page makes reports, contracts and submission packets look less polished.

This upgrade has high user value because it changes the actual output PDF, not just the interface:

- users can leave a cover page unnumbered;
- users can number only selected pages;
- numbering sequence starts from the configured start number within the selected target pages;
- skipped pages remain unchanged.

## Targeted Competitor Comparison

Public competitor capability checked:

- Adobe Acrobat Online documentation states that Acrobat on the web supports position and page range for numbering PDFs.
- Adobe public online page-numbering page says users can number all pages or just a page range.
- iLovePDF exposes page numbering options including `First page is cover page`, first number and from/to page selection.
- Smallpdf exposes a simpler page-numbering workflow focused on placing numbers in the document.
- PDF24-related public materials show page numbering customization as a common expectation, though exact public online options vary by surface.

Implementation decision:

- Add page targeting because it is a real professional workflow.
- Do not add roman numerals, chapter sections or multiple numbering schemas in this pass.
- Do not add fake page labels separate from visible drawn numbers.

Sources:

- Adobe Help: `https://helpx.adobe.com/acrobat/web/edit-pdfs/organize-documents/number-pages.html`
- Adobe online tool page: `https://www.adobe.com/acrobat/online/add-pdf-page-numbers.html`
- iLovePDF: `https://www.ilovepdf.com/add_pdf_page_number`
- Smallpdf: `https://smallpdf.com/add-page-numbers-to-pdf`

## Functional Specification

Default behavior:

- `All pages`
- Start number `1`
- Existing position, font, size, color and format defaults remain unchanged.

New options:

1. `All pages`
   - Draws numbers on every page.
   - Existing behavior preserved.

2. `Skip first page`
   - Leaves physical page 1 unchanged.
   - Draws the first visible number on physical page 2.
   - If start number is `900`, page 2 receives `Page 900` when the selected format is `Page 1`.

3. `Page range`
   - Accepts ranges like `2-5` and comma selections like `1,3,7`.
   - Deduplicates repeated pages.
   - Rejects pages outside the PDF.
   - Rejects descending ranges like `5-2`.

Output:

- Existing output filename remains `numbered.pdf`.
- PDF page count and dimensions are preserved.
- Only selected pages receive drawn page-number text.

Error behavior:

- Invalid range shows a clear message.
- A one-page PDF cannot use `Skip first page` because no target page remains.
- Protected or unreadable PDFs keep the existing unlock-first message.

## Engine

- Current engine: `pdf-lib`
- New dependency: none
- Processing: browser-side only
- Privacy model: unchanged; no backend upload

`pdf-lib` is sufficient because this feature draws visible text onto selected pages. It does not require a new PDF engine.

## Files Modified

- `components/tools/add-page-numbers-tool.tsx`
  - Added page target mode state.
  - Added custom page range parsing.
  - Updated preview to mark `Numbered` vs `Skipped`.
  - Updated export logic so skipped pages are not modified.
  - Updated sidebar summary with pages numbered.

- `app/add-page-numbers/page.tsx`
  - Updated public description and FAQ to mention skip-cover and page range targeting.

- `data/premium-tool-content.ts`
  - Updated Add Page Numbers content to describe page targeting.

- `tests/e2e/product-audit.spec.ts`
  - Added output-level assertions using PDF.js text extraction.

## Result Tests

Targeted Playwright test:

`edit tools generate valid PDFs`

Result-level checks added:

- Generate numbered PDF with `Skip first page`.
- Use start number `900`.
- Confirm final PDF opens with 10 pages.
- Extract page 1 text and verify it does not contain `Page 900`.
- Extract page 2 text and verify it contains `Page 900`.
- Generate numbered PDF with custom range `2-3`.
- Use start number `700`.
- Verify page 1 does not contain `Page 700`.
- Verify page 2 contains `Page 700`.
- Verify page 3 contains `Page 701`.
- Verify page 4 does not contain `Page 702`.

Targeted result: OK.

Full validation:

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- `npm run test:e2e`: OK, 60 passed, 6 skipped mobile-heavy workflow tests
- Firefox production-local workflow: OK, `numbered.pdf` downloaded and `%PDF` magic bytes verified

Production validation:

- Commit: `5c83070`
- Vercel deployment: `https://liftpdf-qha862ujs-rachator75010-5712s-projects.vercel.app`
- Vercel status: READY
- Production URL: `https://liftpdf.com/add-page-numbers`
- Production workflow: OK
- Production output: `numbered.pdf`
- Production output magic bytes: `%PDF`
- Production page errors / console errors / critical failed requests: none detected during smoke test

## Performance and Mobile

No new dependency was added. The feature reuses the existing preview render and `pdf-lib` draw loop.

Expected impact:

- Bundle impact: about +1 kB on `/add-page-numbers` in the Next build output, with no new dependency.
- Memory impact: unchanged from existing page-numbering workflow.
- Mobile impact: UI adds one compact option group and one optional input.

## Rejected Options

- Roman numerals: useful for power users but out of scope for this functional depth pass.
- Chapters/sections: too complex for a focused browser tool.
- Multiple independent numbering schemas: valuable in full desktop editors, but too much for this pass.
- Page label metadata instead of visible numbers: would not solve the user-visible numbering task.

## Remaining Limitations

- No margin/offset controls yet.
- No even/odd page targeting yet.
- No roman numerals.
- No independent front-matter/main-body numbering schemas.

## Summary

Selected P0: NONE_REMAINING_AFTER_PHASE_38; selected highest untreated P1  
Tool: Add Page Numbers  
Feature: Skip first page and page range targeting  
Implemented: YES  
Real output difference verified: YES  
Output valid: YES  
Privacy model preserved: YES  
New dependency: NO  
Bundle impact: NEGLIGIBLE  
Mobile verified: YES_ROUTE_AND_RESPONSIVE_E2E  
Firefox verified: YES_TARGETED_LOCAL_PRODUCTION  
Lint: OK  
Typecheck: OK  
Build: OK  
E2E: OK  
Production deployed: YES  
Remaining limitations: margin offsets, even/odd targeting, roman numerals and multi-schema numbering remain out of scope.
