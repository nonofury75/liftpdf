# LiftPDF Phase 62 - Engine Capability Matrix

Date: 2026-08-11  
Scope: documentation-only feasibility audit. No production runtime change.

## Engine Inventory

| Engine / helper | Version in LiftPDF | Used by | Current production role | Strengths | Hard limits / risk | Privacy impact |
|---|---:|---|---|---|---|---|
| `pdf-lib` | 1.17.1 | Merge, Split, Rotate, Delete, Extract, Reorder, Add Page Numbers, Watermark, Image to PDF | Create PDFs, copy pages, draw text/images, rotate pages, inspect low-level dictionaries in tests | Excellent browser-local page operations; deterministic output tests; no server needed | Public API appends drawing operations. It is not a full content-stream editor, compressor, layout parser, OCR engine, or bookmark/outline authoring API. Low-level object edits are possible but fragile. | Files stay local |
| PDF.js / `pdfjs-dist` | 4.10.38 | Preview thumbnails, PDF to JPG/PNG rendering, PDF to Text | Render pages to canvas, read page count/dimensions, extract selectable text | Strong browser renderer; good preview parity; text extraction exposes text items and transforms | Rendering is memory-heavy for large pages; text extraction is not semantic reading order; no OCR; not an embedded-image extraction engine; does not write PDFs | Files stay local |
| QPDF WASM | qpdf 11.7.0 | Compress PDF, Protect PDF, Unlock PDF | Structural optimization, stream recompression, image optimization knobs, AES-256 encryption/decryption, permissions | Real browser-side encryption/decryption and structural PDF optimization; preserves PDF structure better than raster workflows | Does not guarantee exact target file sizes; image optimization is limited to QPDF options; no visual layout editing; WASM memory/filesystem must be cleaned carefully | Files and passwords stay local |
| JSZip | 3.10.1 | Split, Extract separate pages, PDF to JPG/PNG multi-page output | Generate ZIP downloads in browser | Reliable for moderate client-side ZIP outputs; progress can be surfaced by caller | Generates complete archives in memory; large image/PDF batches can duplicate bytes; no true streaming download in current setup | Files stay local |
| Canvas / browser image APIs | Browser-provided | Image to PDF, PDF to JPG/PNG, Watermark image conversion | Decode images, rotate images, render PDF pages, encode JPG/PNG/WebP | Native, no dependency, good preview/export path when dimensions are controlled | Memory scales with pixel count; canvas export can recompress; EXIF behavior depends on decode path; no PDF semantic insight | Files stay local |
| `lib/page-ranges.ts` | internal | PDF to Text, Rotate, Add Page Numbers, Watermark and related tests | Parse user ranges like `1-3, 5, 8-10` | Centralized validation, dedupe, natural ordering, consistent errors | Only page-number ranges. Does not model bookmark ranges, named destinations, or semantic sections | No file data |
| Tool-specific state helpers | internal | Reorder, Delete, Merge, image tools | Per-file/per-page state, previews, progress, reset cleanup | Keeps workflows simple and testable | Multi-select and deep history features can turn state models complex quickly | No analytics-sensitive state required |

## Current Architecture

LiftPDF intentionally uses browser-local engines:

1. PDF.js reads or renders PDFs when visual preview, page dimensions, page count, or selectable text are needed.
2. `pdf-lib` writes new PDFs or modifies page-level structures.
3. QPDF WASM handles operations that require real PDF encryption, decryption, permission dictionaries, and structural compression.
4. JSZip packages multiple outputs.
5. Canvas APIs bridge browser image decoding, PDF raster output, and image-to-PDF placement.

This architecture is strong for the current V1 promise: private, fast, no-upload PDF tools. It becomes weaker when a feature requires semantic PDF rewriting, precise content-stream insertion, OCR, Office conversion, deep compression convergence, or embedded object extraction.

## pdf-lib Capability Detail

| Capability | Status | Notes |
|---|---|---|
| Copy pages between PDFs | SUPPORTED_DIRECTLY | Used by Merge, Split, Delete, Extract, Reorder. Output page counts and order are covered by tests. |
| Rotate pages | SUPPORTED_DIRECTLY | Used by Rotate PDF with page targeting. Rotation dictionaries are testable. |
| Draw text/images on pages | SUPPORTED_DIRECTLY | Used by Add Page Numbers and Watermark. Current behavior is overlay/append-style drawing. |
| Preserve links/forms/annotations during page copy | SUPPORTED_WITH_TESTING | Current fixture tests cover links/forms/annotations for relevant workflows, but arbitrary PDFs still require regression care. |
| Create simple AcroForm fixtures | SUPPORTED_DIRECTLY | Used in tests. Not a full form editor product surface. |
| Low-level object dictionary edits | POSSIBLE_WITH_LOW_LEVEL_PDF_OBJECTS | Used in tests for fixtures/inspection. Production use should be isolated and heavily tested. |
| Create reliable document outlines/bookmarks | POSSIBLE_BUT_FRAGILE | No high-level production API currently used. Would need low-level `/Outlines` and destination objects. |
| Prepend content below existing content | POSSIBLE_BUT_FRAGILE | Requires content stream and resource manipulation. Not safe as a UI promise without a spike. |
| Edit arbitrary existing content streams | NOT_SAFE_WITH_CURRENT_APPROACH | Needed for true below-content layering, clipping-safe insertion, and deep content changes. |
| Compress PDFs professionally | NOT_SAFE_WITH_CURRENT_APPROACH | Rebuilds can shrink incidental overhead but cannot provide professional compression levels. QPDF replaced this path. |
| Extract semantic layout/text | NOT_SUPPORTED | Use PDF.js for text extraction; still heuristic. |

## PDF.js Capability Detail

| Capability | Status | Notes |
|---|---|---|
| Load browser-local PDF bytes | SUPPORTED_DIRECTLY | `loadPdfDocument` copies bytes and creates a PDF.js document. |
| Render page thumbnails/previews | SUPPORTED_DIRECTLY | Current preview helpers create canvas thumbnails and object URLs. |
| Render page images | SUPPORTED_DIRECTLY | PDF to JPG/PNG uses controlled scale and sequential cleanup. |
| Extract selectable text | SUPPORTED_DIRECTLY | `getTextContent()` exposes text items. Current tool joins strings into plain text. |
| Preserve paragraph/column reading order | POSSIBLE_BUT_FRAGILE | Requires heuristic grouping from coordinates/transforms. Not guaranteed. |
| OCR scanned PDFs | NOT_SUPPORTED | Requires OCR engine/backend/new dependency; current UX correctly says OCR is required. |
| Extract original embedded image streams | NOT_SAFE_WITH_CURRENT_APPROACH | Rendering a page to pixels is different from extracting original image XObjects. |

## QPDF WASM Capability Detail

| Capability | Status | Notes |
|---|---|---|
| AES-256 protection | SUPPORTED_DIRECTLY | Phase 47 verifies user/owner passwords and permission bits. |
| User/owner password unlock | SUPPORTED_DIRECTLY | Phase 48 verifies open-password and restriction-only workflows. |
| Remove `/Encrypt` safely | SUPPORTED_DIRECTLY | Output is verified before success. |
| Structural compression | SUPPORTED_DIRECTLY | Preserve/Balanced/Strong modes use object streams, stream recompression, compression level and image optimization knobs. |
| Remove metadata | SUPPORTED_DIRECTLY | Phase 43 verifies metadata removal. |
| Approximate target size | POSSIBLE_BUT_FRAGILE | Needs an iterative loop and quality checks; not guaranteed by a single QPDF pass. |
| Full image downsampling / raster compression | NOT_SAFE_WITH_CURRENT_APPROACH | QPDF image optimization is not a complete visual compressor. |
| Content stream editing / layout work | NOT_SUPPORTED | QPDF is not the current page content editing engine. |

## JSZip And Memory

| Capability | Status | Notes |
|---|---|---|
| ZIP multiple PDF/image outputs | SUPPORTED_DIRECTLY | Used by Split, Extract, PDF to image exports. |
| Generate browser Blob archives | SUPPORTED_DIRECTLY | Current outputs are in-memory blobs. |
| Progress from calling pipeline | SUPPORTED_INDIRECTLY | LiftPDF controls page-by-page progress before ZIP creation. |
| Large streaming downloads | NOT_SUPPORTED_CURRENTLY | JSZip `.generateAsync()` produces a complete archive representation in memory. |
| Very large PNG batches | RISKY | Phase 49 mitigates render memory; ZIP memory remains bounded by batch size and browser memory. |

## Candidate Engines Not Installed

These are feasibility candidates only. No dependency was installed in Phase 62.

| Candidate | Source | License note | Browser/WASM note | Potentially unlocks | Fit for LiftPDF |
|---|---|---|---|---|---|
| MuPDF.js | https://mupdf.com/mupdf-js and https://github.com/ArtifexSoftware/mupdf.js/ | Dual AGPL/commercial according to official repo/package pages | Official JavaScript/TypeScript WASM library | Deeper parsing, rendering, extraction, possibly content inspection | Technically promising, licensing must be resolved before any proprietary/SaaS use |
| Ghostscript WASM | https://ghostscript.com/releases/gsdnld.html | Ghostscript is AGPL or commercial | WASM ports exist, but would need separate evaluation | Raster compression, PostScript/PDF conversion-style workflows | High licensing and bundle risk; not a default LiftPDF browser dependency |
| PDFium | https://pdfium.googlesource.com/pdfium/ | Chromium/PDFium source has permissive-style licensing in source checkout, but wrappers vary | Native engine; browser WASM path requires wrapper/build audit | Rendering, parsing, possibly embedded image/content work | Promising but heavy; needs new-engine evaluation, not direct implementation |
| pdfcpu | https://pdfcpu.io/ and https://github.com/pdfcpu/pdfcpu | Apache-2.0 on official project | Go library/CLI; browser WASM is not a first-class official LiftPDF dependency today | Validation, optimization, extraction, structural operations | Good backend/CLI candidate; browser fit requires spike |

## Privacy Boundary

The current model can be preserved for:

- page ordering/deletion/extraction variants;
- filename controls;
- PNG matte/background controls;
- moderate text layout heuristics;
- bookmark/outline spikes if browser-local.

The model becomes weaker or must be explicitly changed for:

- backend OCR;
- Office conversion;
- server-side Ghostscript/MuPDF compression;
- any cloud import/export;
- large proprietary engine services.

## Conclusion

Current engines are sufficient for several small safe P2 items, but not for the ambiguous high-risk promises:

- true below-content watermarking;
- reliable split by bookmarks;
- perfect layout-preserved text;
- guaranteed or exact target-size compression;
- original embedded image extraction.

Those need either a constrained engine spike, a new browser-side engine evaluation, or rejection as misleading.
