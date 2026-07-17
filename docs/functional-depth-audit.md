# LiftPDF Functional Depth Audit

Date: 2026-07-17  
Scope: 17 production tools, with the first implementation pass limited to Compress PDF.

## Verification Context

Repository guard completed before changes:

- Project path: `C:\Users\zidan\Desktop\LiftPDF`
- Required folders found: `app/`, `components/`, `data/`, `lib/`
- Git branch: `main`
- Git remote: `https://github.com/nonofury75/liftpdf.git`

Fixtures were expanded in `tests/e2e/fixtures.ts` so functional checks can use deterministic files instead of only happy-path samples.

## Competitor Evidence Level

This audit separates observable public capability from implementation claims:

- Adobe Acrobat Online: public pages describe low/medium/high compression levels and advanced optimization in Acrobat Pro.
- Smallpdf: public pages describe Basic and Strong compression flows.
- iLovePDF: public tool exposes Extreme, Recommended and Less compression levels.
- PDF24: public tool describes adjustable DPI and image quality settings for compression.

The audit does not infer private competitor internals. Where a competitor requires login, payment, quota or blocks automated download, the status is noted as public UI/documentation rather than fully downloaded output verification.

## Status Legend

- `PRESENT_AND_VERIFIED`: implemented and covered by result-level tests.
- `PRESENT_BUT_WEAK`: implemented but incomplete, fragile or not deeply tested.
- `MISSING_CRITICAL`: core professional capability missing.
- `MISSING_IMPORTANT`: useful feature expected by serious users.
- `MISSING_OPTIONAL`: useful for power users but not required.
- `NOT_FEASIBLE_CURRENT_ENGINE`: cannot be honestly implemented with the current engine.
- `REQUIRES_NEW_ENGINE`: feasible only with a different local engine.
- `REQUIRES_BACKEND`: likely needs server processing and changes the privacy model.
- `REJECTED_LOW_VALUE`: not worth adding now.
- `REJECTED_MISLEADING`: would create a false promise.

## Global Matrix

| Tool | Current engine | Current LiftPDF capabilities | Competitor capability observed | Critical gap | Important gap | Rejected / constraint | Feasibility | Priority |
|---|---|---|---|---|---|---|---|---|
| JPG to PDF | `pdf-lib`, browser image decoding | Multi-image PDF, Auto/A4/Letter, Auto/Portrait/Landscape, None/Small/Large margins, Fit/Fill, reorder/add/remove, live preview | iLovePDF/Smallpdf/Adobe focus on batch images, page size, orientation, margins | None currently blocking | Editable output filename, per-image rotation, EXIF orientation verification | Fake DPI controls | Browser feasible | P1 |
| PNG to PDF | `pdf-lib`, browser image decoding | PNG-only upload, transparent PNG supported on white page, same layout controls as JPG | Competitors usually support page size, orientation, margins | None currently blocking | Background color for transparency, editable filename, per-image rotation | Transparent PDF background option if not preserved by engine | Browser feasible | P1 |
| Images to PDF | `pdf-lib`, browser image decoding | Mixed image PDF, reorder, add/remove, shared placement logic | Competitors emphasize batch flow and sorting | None currently blocking | One PDF per image ZIP, editable filename, per-image rotation | Cloud import | Browser feasible | P1 |
| PDF to JPG | `pdfjs-dist`, canvas, JSZip | All pages, single page, ranges, Standard/High scale, JPG direct or ZIP | Competitors offer page export, ZIP, quality levels; some advertise DPI | None currently blocking | Real DPI label should remain absent unless implemented; memory guard for 100 pages | Embedded image extraction as fake mode | Browser feasible for current scope | P1 |
| PDF to PNG | `pdfjs-dist`, canvas, JSZip | All pages, single page, ranges, PNG direct or ZIP | Competitors mirror PDF to JPG with PNG output | None currently blocking | Memory guard for 100 pages, transparent rendering verification | TIFF/DPI claims without engine support | Browser feasible for current scope | P1 |
| Merge PDF | `pdf-lib` | Multiple PDFs, reorder, remove, add more, thumbnails, page count, merged output | Competitors provide reorder, thumbnails, cloud import, sometimes page-level organization | None currently blocking | Editable output filename, protected-file per-item messaging, bookmark preservation | Page-level interleaving belongs to Organize/Reorder, not Merge | Browser feasible | P1 |
| Split PDF | `pdf-lib`, JSZip | Extract ranges, split every page, ZIP/PDF output, validation | Competitors support ranges and split modes; PDF24 often exposes more technical split variants | None currently blocking | Split every N pages, split by bookmarks, output naming templates | Overloaded split wizard | Browser feasible | P2 |
| Compress PDF | Was `pdf-lib`; now QPDF WASM | QPDF Preserve/Balanced/Strong modes, result size comparison, local processing | Adobe low/medium/high, Smallpdf Basic/Strong, iLovePDF three levels, PDF24 DPI/image quality | Target-size compression not implemented | Visual before/after and deeper form/link preservation tests | Guaranteed 1 MB/2 MB targets are misleading | Current QPDF supports partial professional compression | P0 completed partially |
| Rotate PDF | `pdf-lib` | Rotate selected pages, all pages, visual previews, export | Competitors support 90/180/270 and page selection | None currently blocking | Even/odd/range shortcuts, reset all, keyboard support | Full editor-like page management | Browser feasible | P1 |
| Add Page Numbers | `pdf-lib` | Formats, positions, size, color, start number, preview/export | Competitors support position, format, starting page and styling | None currently blocking | Ignore first page, page range, margins/offset, even/odd positions | Roman numerals/chapters for V1 | Browser feasible | P1 |
| Watermark PDF | `pdf-lib` | Text/image watermark, opacity, rotation, position, repeat, preview/export | Competitors expose text/image, position, opacity, rotation, page ranges | None currently blocking | Page range, even/odd pages, layer above/below, tiling spacing | Signature/stamp workflows | Browser feasible | P1 |
| Delete Pages | `pdf-lib` | Page thumbnails, selection, counters, delete selected, prevents deleting all | Competitors provide visual page removal and batch selection | None currently blocking | Undo, keyboard selection, range input | Combining delete/extract/reorder into one overloaded tool | Browser feasible | P2 |
| Extract Pages | `pdf-lib` | Visual selection/ranges, output PDF, validation | Competitors support selected extraction and sometimes separate files | None currently blocking | One PDF per extracted page ZIP, custom order, naming | OCR/extraction of text | Browser feasible | P2 |
| Reorder Pages | `pdf-lib` | Drag/drop, move buttons, reset, page thumbnails | Competitors support visual page order and broader organize suites | None currently blocking | Keyboard reordering, multi-select moves, reverse order | Adding delete/rotate here would duplicate tools | Browser feasible | P2 |
| Protect PDF | QPDF WASM | Password + confirmation, strength, `/Encrypt` output path, local encryption | Competitors offer password workflow; some offer permissions | None currently blocking | Owner password and permissions only if QPDF path is fully verified | Fake permission toggles | Browser feasible with QPDF, needs tests | P1 |
| Unlock PDF | QPDF WASM | Known-password unlock, local decryption, `/Encrypt` removal target | Competitors require valid password; no bypass promised | None currently blocking | Owner-password restriction-only PDFs need deeper coverage | Password recovery/bypass | Browser feasible with QPDF, ethical constraint | P1 |
| PDF to Text | `pdfjs-dist` text extraction | Selectable text extraction, counters, copy, TXT download, image-only/OCR message | Competitors sometimes mix OCR upsells with text extraction | None currently blocking | Page range, preserve layout mode, better columns/tables handling | OCR inside this tool | Browser feasible for selectable text only | P1 |

## Key Findings

### 1. Compress PDF Was the Main Professional Gap

Before this phase, Compress PDF was visually mature but functionally shallow. A `pdf-lib` rebuild can create a valid PDF and sometimes remove incidental overhead, but it cannot honestly support multiple compression intensities comparable to Adobe, iLovePDF, Smallpdf or PDF24.

This has been corrected partially by using QPDF WASM for real browser-side optimization modes. The result is now measurable on image-heavy fixtures. It still does not provide exact target sizes or full DPI/downsampling controls.

### 2. Most Image-to-PDF Tools Are Honest but Need Power-User Polish

JPG, PNG and mixed Images to PDF have real page placement behavior and shared preview/export logic. The important remaining gaps are not core conversion but professional polish:

- filename control;
- per-image rotation;
- EXIF orientation verification;
- transparent PNG background selection;
- optional one-PDF-per-image export.

### 3. PDF-to-Image Tools Should Not Claim DPI Yet

PDF to JPG and PDF to PNG use PDF.js rendering scale. That is legitimate for Standard/High quality, but it is not the same as a true user-controlled DPI export contract. The current wording avoids a false DPI claim and should stay that way until an exact DPI pipeline exists.

### 4. Organize Tools Are Good V1 Tools, Not Full Acrobat Replacements

Merge, Split, Delete, Extract and Reorder are useful and privacy-preserving. The biggest gap versus full editors is cross-document page-level organization and advanced batch naming. Those features are valuable but should be added carefully to avoid turning each focused tool into the same overloaded organizer.

### 5. Security Tools Must Stay Strictly Honest

Protect and Unlock use QPDF WASM, which is the right architectural direction for local encryption/decryption. The next functional depth work should verify Acrobat/Chrome/Firefox compatibility, owner-password behavior and permission flags before exposing any advanced permission UI.

## Engine Assessment

| Engine / approach | Strength | Weakness | Privacy impact | Recommendation |
|---|---|---|---|---|
| QPDF WASM | Local optimization, stream recompression, object streams, image optimization, encryption/decryption | No exact target-size guarantee, limited visual preview, no full raster downsampling workflow | Preserves no-upload model | Keep and deepen tests |
| `pdf-lib` | Excellent for page operations, drawing, merge/split/rotate/watermark/page numbers | Not a professional compression engine | Preserves no-upload model | Keep for structural tools |
| PDF.js + canvas | Good page rendering/export to image | High memory for large PDFs; raster output loses PDF structure | Preserves no-upload model | Keep for PDF to image |
| Ghostscript WASM | Potentially strong compression and raster controls | Heavy, license and memory risks, can flatten/damage structure | Preserves no-upload if local, but high bundle/perf cost | Research only |
| MuPDF WASM | Powerful PDF engine | License/commercial complexity, weight, integration risk | Preserves no-upload if local | Research only |
| PDFium WASM | Strong rendering/editing base | Complex browser integration and large footprint | Preserves no-upload if local | Not V1 |
| Server compression | Can support heavier engines and target sizes | Files leave browser; changes privacy promise | Breaks current differentiator unless opt-in | Reject for default LiftPDF V1 |

## Priority Summary

P0 completed in this phase:

- Replace fake/weak Compress PDF behavior with real QPDF WASM compression modes.
- Add result-level Playwright coverage proving modes create distinct valid PDFs.
- Update public wording so target sizes are not promised.

P1 next candidates:

- Add professional output filename controls across file-producing tools.
- Add page range and first-page skipping to Add Page Numbers.
- Add page range to Watermark PDF.
- Add EXIF/per-image rotation to Image to PDF tools.
- Add deeper QPDF compatibility tests for Protect/Unlock.

P2 candidates:

- Split every N pages.
- Extract each selected page as separate PDFs in ZIP.
- Reorder keyboard/multi-select enhancements.
- Compression before/after preview.

Rejected for now:

- Guaranteed target size compression.
- Fake DPI controls.
- Password recovery or unlock without a valid password.
- Server-side compression as default.
- Cloud import integrations.

