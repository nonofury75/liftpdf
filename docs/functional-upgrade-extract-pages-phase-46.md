# LiftPDF Phase 46 - Extract Pages Separate PDF ZIP

## Selected P1

Selected priority: P1

Tool: Extract Pages

Feature: Export each selected page separately as ZIP

Roadmap status: Open in `docs/functional-upgrade-roadmap.md` as "Extract Pages - Export each selected page separately as ZIP". Not delivered in phases 38-45.

## Other Remaining P1 Candidates

| Tool | Feature | Status |
| --- | --- | --- |
| Protect PDF | Owner password and permission toggles | Still open, high value but higher risk because PDF permissions must be verified across readers. |
| PDF to JPG / PDF to PNG | Memory guard and progress for 100-page files | Still open, useful for stability but less visible as a professional output capability. |
| JPG / PNG / Images to PDF | Editable output filename | Still open, useful but lower product depth than separate Extract Pages output. |
| JPG / PNG / Images to PDF | EXIF orientation handling | Still open, valuable for phone photos, but needs careful fixture and browser behavior verification. |
| Reorder Pages | Keyboard reordering / reverse order | Still open in the audit set, but lower current ROI than separate Extract Pages output. |

## Why This P1 Was Chosen

Extract Pages previously exported all selected pages into a single `pages-extracted.pdf`. That is correct for excerpts, but incomplete for administrative workflows where each selected page must become its own document.

This upgrade adds a second real output mode:

- One PDF with selected pages
- Separate PDFs in ZIP

The selected P1 has a strong balance of user value, low privacy risk, existing engine support and measurable output verification.

## Targeted Competitor Benchmark

| Competitor | Observed capability | Relevance |
| --- | --- | --- |
| Adobe Acrobat Online | Public split/extract pages flow separates PDF pages into multiple files or saves extracted pages as a smaller PDF. | Confirms page separation is a standard Acrobat workflow. |
| Smallpdf | Public Extract PDF Pages page describes selecting pages and toggling between a single PDF or separate PDFs. | Directly matches the selected P1. |
| iLovePDF | Public Split PDF page exposes extract selected pages, merge extracted pages into one PDF, or convert selected pages into separate PDF files. | Directly matches the selected P1. |
| PDF24 | Public Extract/Split PDF tools cover extracting pages and splitting files into several parts. | Confirms broad market expectation for split/extract outputs. |

Sources used:

- Adobe Acrobat Online split/extract documentation: `https://www.adobe.com/acrobat/online/split-pdf.html`, `https://www.adobe.com/learn/acrobat/web/extract-pages-from-pdf`
- Smallpdf Extract PDF Pages: `https://smallpdf.com/extract-pdf-pages`
- iLovePDF Split PDF: `https://www.ilovepdf.com/split_pdf`
- PDF24 Extract/Split PDF: `https://tools.pdf24.org/en/extract-pdf-pages`, `https://tools.pdf24.org/en/split-pdf`

## Previous Limitation

Before Phase 46:

- Visual page selection existed.
- Select all / clear / invert existed.
- Output was always a single PDF.
- There was no way to create one PDF per selected page.
- ZIP output was unavailable on `/extract-pages`.

## New Functionality

The sidebar now includes an Output selector:

- `One PDF with selected pages`
- `Separate PDFs in ZIP`

ZIP mode creates:

- `extracted-pages.zip`
- entries named `extracted-page-<original-page-number>.pdf`

Example selected pages:

- 2
- 4
- 6

Output ZIP:

- `extracted-page-2.pdf`
- `extracted-page-4.pdf`
- `extracted-page-6.pdf`

Each entry contains exactly one copied PDF page. Original page numbering is preserved in the file name.

## Engine

Current engine:

- `pdf-lib` for loading source PDFs and copying pages.
- `JSZip` for packaging separate PDFs.

No new dependency was added. `JSZip` was already used by Split PDF and PDF to image exports.

## Dependencies

New dependency: none.

Bundle impact: low. `/extract-pages` increased to a small client bundle that includes existing JSZip usage.

## Files Modified

- `components/tools/extract-pages-tool.tsx`
- `app/extract-pages/page.tsx`
- `data/premium-tool-content.ts`
- `tests/e2e/fixtures.ts`
- `tests/e2e/product-audit.spec.ts`
- `docs/functional-upgrade-extract-pages-phase-46.md`

## Result Tests

Added fixture:

- `phase46-markers.pdf`
- six pages with unique markers:
  - `PHASE46-PAGE-1`
  - `PHASE46-PAGE-2`
  - `PHASE46-PAGE-3`
  - `PHASE46-PAGE-4`
  - `PHASE46-PAGE-5`
  - `PHASE46-PAGE-6`

Primary Playwright test:

- Upload `phase46-markers.pdf`.
- Select pages 2, 4 and 6.
- Choose `Separate PDFs in ZIP`.
- Export.
- Verify ZIP file name is `extracted-pages.zip`.
- Verify exact entries:
  - `extracted-page-2.pdf`
  - `extracted-page-4.pdf`
  - `extracted-page-6.pdf`
- Load every ZIP entry with `pdf-lib`.
- Verify every entry has exactly one page.
- Extract text with PDF.js.
- Verify each entry contains the correct `PHASE46-PAGE-*` marker.
- Verify each entry does not contain markers from non-selected pages.
- Switch back to `One PDF with selected pages`.
- Verify the previous combined-PDF workflow still produces a valid three-page PDF.

Existing workflow test was also updated to verify ZIP output names in the broader edit-tools workflow.

## Cases Covered

- Combined PDF output preserved.
- Separate ZIP output added.
- Selected pages exported in original order.
- ZIP entry names are explicit.
- ZIP entries are valid PDFs.
- Each ZIP entry contains one page.
- Non-selected pages are excluded.
- Reset still clears the tool.
- Existing Select All / Clear / Invert workflows remain unchanged.
- Invalid/protected-file handling remains the existing Extract Pages error path.

## Performance And Memory

The ZIP export creates one small `PDFDocument` per selected page and writes it into a single ZIP archive. Blob URLs are still revoked through the existing generated file cleanup path.

Local production validation covered Chromium, Firefox and mobile Chromium. No page errors or critical console errors were observed.

## Privacy And Analytics

The privacy model is unchanged:

- all page extraction remains local in the browser;
- no PDF content is uploaded;
- no file names are sent to analytics;
- no selected page numbers are sent to analytics;
- analytics uses aggregate output mode and selected-page count only.

## Validation

Commands run:

- `npm run lint` - OK
- `npm run typecheck` - OK
- `npm run build` - OK
- `npx playwright test tests/e2e/product-audit.spec.ts -g "extract pages exports selected pages as separate marked PDFs" --project=chromium --reporter=line` - OK
- `npm run test:e2e` - OK, 64 passed, 10 skipped

Local production:

- `npm run start -- -p 3069`
- `http://127.0.0.1:3069/extract-pages`
- Chromium: OK
- Firefox: OK
- Mobile Chromium: OK
- ZIP names verified
- ZIP entry PDF page counts verified
- No pageerror
- No critical console.error

## Production

Production validation will be completed after the Phase 46 commit is pushed and Vercel reports READY.

## Remaining Limitations

- Extract Pages still uses visual selection only. Range input remains available in Split PDF, not this tool.
- ZIP mode creates one PDF per selected page, not one PDF per custom page group.
- Password-protected PDFs must still be unlocked first.
- Custom output filename remains a separate lower-priority item.

## Next P1 Recommended

Next remaining P1 should be selected from:

1. Protect PDF owner password / permission toggles, if QPDF flags can be verified honestly across Acrobat, Chrome and Firefox.
2. PDF to JPG / PDF to PNG memory guard for 100-page files.
3. EXIF orientation handling for JPG / PNG / Images to PDF.

## Summary

Selected priority: P1

Tool: Extract Pages

Feature: Export each selected page separately as ZIP

Implemented: YES

Real output difference verified: YES

Output valid: YES

Previous workflow preserved: YES

Shared tools regression: NONE DETECTED

Privacy model preserved: YES

New dependency: NO

Bundle impact: LOW

100-page test: NOT APPLICABLE TO THIS OUTPUT PASS

Mobile verified: YES

Firefox verified: YES

Lint: OK

Typecheck: OK

Build: OK

E2E: OK

Production deployed: PENDING

Next remaining P1: Protect PDF permission controls or PDF to image memory guard, pending Phase 47 selection.
