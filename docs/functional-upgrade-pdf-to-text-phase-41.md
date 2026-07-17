# PDF to Text Functional Upgrade

Date: 2026-07-17  
Tool: `/pdf-to-text`  
Phase: 41

## Reason for Selection

Reference documents:

- `docs/functional-depth-audit.md`
- `docs/functional-upgrade-roadmap.md`
- `docs/functional-upgrade-add-page-numbers.md`
- `docs/functional-upgrade-watermark-pdf-phase-40.md`

Already treated:

- Compress PDF: real QPDF WASM compression modes.
- Add Page Numbers: skip first page and page range.
- Watermark PDF: all pages and page range.

Selected priority: P1  
Tool: PDF to Text  
Feature: Page range targeting

The roadmap lists `PDF to Text | Page range` as an important professional upgrade. It is valuable for long PDFs because users often need text from one section, a chapter, an invoice page or an appendix, not the whole document.

## Targeted Benchmark

The targeted benchmark focused only on page targeting around text/page extraction:

| Product | Observed capability | Notes |
|---|---|---|
| Adobe Acrobat Online | Page selection and page ranges are publicly documented for Extract PDF pages. | This validates page targeting as a standard user expectation, although it is for PDF page extraction rather than TXT extraction. |
| Smallpdf | Extract PDF Pages exposes selected-page extraction and single/separate PDF outputs. | Public PDF-to-text materials emphasize text/OCR conversion, not a visible page-range TXT workflow. |
| iLovePDF | Split PDF supports extract all pages and selected pages/ranges. | Public OCR/PDF text content focuses on OCR/searchable PDFs, not selective TXT page export. |
| PDF24 | PDF to TXT converts PDFs to text; Extract PDF Pages supports clicking selected pages. | PDF24's public PDF-to-TXT page does not visibly advertise page-range TXT extraction. |

Sources used:

- Adobe Extract PDF pages: `https://www.adobe.com/acrobat/online/extract-pdf-pages.html`
- Smallpdf Extract PDF Pages: `https://smallpdf.com/extract-pdf-pages`
- iLovePDF Split PDF: `https://www.ilovepdf.com/split_pdf`
- PDF24 PDF to TXT: `https://tools.pdf24.org/en/pdf-to-txt`
- PDF24 Extract PDF Pages: `https://tools.pdf24.org/en/extract-pdf-pages`

No competitor implementation details were inferred.

## Previous Limitation

LiftPDF previously extracted selectable text from every page only. For 100-page documents, users had to extract the full TXT and manually delete unrelated sections.

The previous PDF.js loop also reported progress against the full document only, because no subset was available.

## Parser Reused

A small central parser was added in `lib/page-ranges.ts` instead of creating another local parser inside `pdf-to-text-tool.tsx`.

The parser handles:

- spaces;
- commas;
- single pages;
- ranges;
- duplicate pages;
- natural PDF order;
- zero and negative values;
- descending ranges;
- pages outside the document;
- invalid syntax.

It returns sorted unique 1-based page numbers.

## New Interface

Sidebar section:

- `Pages to extract`
- `All pages`
- `Page range`
- input placeholder: `1-3, 5, 8-10`
- helper text: `Enter page numbers or ranges separated by commas.`

Summary rows now expose:

- File
- Total pages
- Selected pages
- File size
- Status
- Pages processed
- Words
- Characters
- Output

The main button remains `Extract Text` and is disabled when the page range is invalid.

## Extraction Behavior

Mode `All pages` preserves the previous behavior.

Mode `Page range`:

- loads the PDF once;
- calls `pdf.getPage()` only for selected page numbers;
- preserves original page numbers in the TXT;
- removes duplicates;
- processes pages in natural PDF order;
- keeps UTF-8 TXT output as `extracted-text.txt`.

Example for range `2-3`:

```text
Page 2

<text from original page 2>

Page 3

<text from original page 3>
```

## Empty Text Handling

If selected pages contain no selectable text, LiftPDF now reports:

`No selectable text was found in the selected pages. This PDF may be scanned or image-based. OCR is required.`

This is intentionally scoped to the selected pages because a PDF may contain selectable text elsewhere.

OCR was not added.

## Analytics and Privacy

Analytics events do not send:

- extracted text;
- raw page range input;
- file names;
- PDF content;
- passwords;
- local paths;
- personal data.

Allowed event fields remain product-level:

- mode: `all_pages` or `page_range`;
- selected page count;
- output format;
- generic success/error state.

All processing remains local in the browser with PDF.js.

## Files Modified

- `components/tools/pdf-to-text-tool.tsx`
  - Added all-pages/page-range targeting.
  - Added validation and disabled invalid conversion.
  - Updated progress to selected page count.
  - Updated no-text message for selected ranges.
  - Preserved original page numbers in output.

- `components/tools/pdf/pdfjs-client.ts`
  - Extended `extractPdfText()` to accept optional selected page numbers.
  - Progress now supports selected count and processed index.

- `lib/page-ranges.ts`
  - Added central range parsing and summary helper.

- `app/pdf-to-text/page.tsx`
  - Updated user-facing copy and FAQ for selected-page extraction.

- `data/premium-tool-content.ts`
  - Updated premium content to mention selected ranges and original page separators.

- `tests/e2e/fixtures.ts`
  - Added deterministic `phase41-markers.pdf` fixture.

- `tests/e2e/product-audit.spec.ts`
  - Added TXT content assertions for all pages, single page, multiple ranges, duplicates, invalid ranges, out-of-bounds ranges, image-only selected pages, protected PDF and 100-page late range.

## Result Tests

The main fixture contains:

- `PHASE41-PAGE-1`
- `PHASE41-PAGE-2`
- `PHASE41-PAGE-3`
- `PHASE41-PAGE-4`

Assertions verify:

- range `2-3` includes only pages 2 and 3;
- page 1 and page 4 text are absent;
- original page headers remain `Page 2` and `Page 3`;
- single page `2` excludes non-selected pages;
- disjoint range `1,3` excludes pages 2 and 4;
- multi-range `1-2,4` excludes page 3;
- duplicates `1,1,2-3,3` are removed;
- invalid syntax disables extraction;
- page `0` and out-of-range values are rejected;
- selected image-only pages show the selected-pages OCR message;
- 100-page range `95-100` excludes page 94.

## Performance

For a 100-page PDF with range `95-100`, the extraction loop receives only `[95, 96, 97, 98, 99, 100]`.

This means PDF.js does not extract text from pages 1-94. The PDF document is still opened once, which is required by PDF.js, but text extraction work is limited to the selected pages.

## Remaining Limits

- This is not OCR.
- Complex layouts, columns and tables are still flattened into plain text.
- The parser intentionally sorts selected pages into natural PDF order instead of preserving unusual input order like `3,1`.

## Validation

Local validation:

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- `npm run test:e2e`: OK, 60 passed, 6 skipped
- Targeted Playwright check: OK
- Production build local via `npm run start`: OK
- Chromium desktop local production: OK
- Firefox mobile-size local production: OK
- TXT download for `2-3`: OK
- Non-selected pages excluded: OK

Production validation:

- Vercel production: READY
- Production URL: `https://liftpdf.com/pdf-to-text`
- HTTP 200: OK
- Mobile viewport production check: OK
- TXT download for range `2-3`: OK
- Non-selected pages excluded in production TXT: OK
- Critical console/page/request errors: none observed

## Summary

Selected priority: P1  
Tool: PDF to Text  
Feature: Page range targeting  
Implemented: Yes  
Real output difference verified: Yes  
Non-selected pages excluded: Yes  
Original page numbers preserved: Yes  
Output UTF-8 valid: Yes  
All-pages workflow preserved: Yes  
Image-only selected range handled: Yes  
Privacy model preserved: Yes  
New dependency: No  
Bundle impact: Minimal TypeScript utility only  
Mobile verified: Yes, Firefox mobile-size local production  
Firefox verified: Yes  
Lint: OK  
Typecheck: OK  
Build: OK  
E2E: OK  
Production deployed: Yes  
Next remaining P1: Protect PDF permission toggles if verified, Unlock PDF restriction-only handling, Merge PDF protected-file diagnostics/editable filename, PDF image conversion memory guard.
