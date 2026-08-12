# LiftPDF V1 Tool Capability Matrix

Date: 2026-08-12

V1 status values:

- `READY`: production-ready for the declared V1 scope.
- `READY_WITH_LIMITATION`: production-ready with a documented public or technical limitation.
- `NOT_READY`: launch blocker.

| Tool | Route | Input formats | Output format | Engine | Multi-file | Page targeting | Preview | Large-file guard | Protected PDF handling | Custom filename | Mobile | Firefox | Local processing | Known limitation | V1 status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| JPG to PDF | `/jpg-to-pdf` | JPG/JPEG | `jpg-to-pdf.pdf` | Browser image APIs + pdf-lib | Yes | N/A | Live page preview | Browser memory bound | N/A | No | Ready | Ready | Yes | JPG/JPEG only; no per-image PDF output in V1 | READY_WITH_LIMITATION |
| PNG to PDF | `/png-to-pdf` | PNG | `png-to-pdf.pdf` | Browser image APIs + pdf-lib | Yes | N/A | Live page preview | Browser memory bound | N/A | No | Ready | Ready | Yes | PNG only; transparent background color is not configurable in V1 | READY_WITH_LIMITATION |
| Images to PDF | `/images-to-pdf` | JPG, PNG, WEBP | `images.pdf` or custom PDF name | Browser image APIs + pdf-lib | Yes | N/A | Live page preview | Browser memory bound | N/A | Yes | Ready | Ready | Yes | No separate PDF per image in V1 | READY_WITH_LIMITATION |
| Merge PDF | `/merge-pdf` | PDF | `merged.pdf` or custom PDF name | PDF.js validation + pdf-lib | Yes | File-level reorder/delete | First-page previews | Browser memory bound | Protected files isolated and must be unlocked first | Yes | Ready | Ready | Yes | No page-level composition or bookmarks in V1 | READY_WITH_LIMITATION |
| Split PDF | `/split-pdf` | PDF | `split.pdf` or `split-pages.zip` | PDF.js + pdf-lib + JSZip | No | Ranges, every page, every N pages | Page thumbnails/groups | Browser memory bound | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | No split-by-bookmarks in V1 | READY_WITH_LIMITATION |
| Compress PDF | `/compress-pdf` | PDF | `compressed.pdf` | PDF.js + QPDF WASM | No | N/A | First-page preview | Browser memory bound | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | Compression savings depend on PDF structure; no guaranteed target size | READY_WITH_LIMITATION |
| PDF to JPG | `/pdf-to-jpg` | PDF | `page-N.jpg` or `pdf-to-jpg.zip` | PDF.js + canvas + JSZip | No | All, single page, page range | PDF preview | Workload preflight, warning, sequential rendering, cancel | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | Output is rasterized; quality depends on render scale and source | READY_WITH_LIMITATION |
| PDF to PNG | `/pdf-to-png` | PDF | `page-N.png` or `pdf-to-png.zip` | PDF.js + canvas + JSZip | No | All, single page, page range | PDF preview | Workload preflight, warning, sequential rendering, cancel | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | Output is rasterized; no vector preservation | READY_WITH_LIMITATION |
| Rotate PDF | `/rotate-pdf` | PDF | `rotated.pdf` | PDF.js + pdf-lib | No | All, selected, odd, even, ranges | Page thumbnails | Browser memory bound | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | Rotation changes page rotation metadata, not page content pixels | READY_WITH_LIMITATION |
| Add Page Numbers | `/add-page-numbers` | PDF | `numbered.pdf` | PDF.js + pdf-lib | No | All, skip first, page range, odd/even | Page thumbnails/preview | Browser memory bound | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | Does not detect all design-safe margins automatically | READY_WITH_LIMITATION |
| Watermark PDF | `/watermark-pdf` | PDF + optional image watermark | `watermarked.pdf` | PDF.js + pdf-lib + custom content stream utilities | No | All, odd, even, page range | Live PDF preview | Browser memory bound | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | Below-content watermark sits below page content, not necessarily below annotations/widgets | READY_WITH_LIMITATION |
| Delete Pages | `/delete-pages` | PDF | `pages-deleted.pdf` | PDF.js + pdf-lib | No | Visual selection, range, undo | Page thumbnails | Browser memory bound | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | Cannot delete all pages | READY |
| Extract Pages | `/extract-pages` | PDF | `pages-extracted.pdf` or `extracted-pages.zip` | PDF.js + pdf-lib + JSZip | No | Visual selection and ranges | Page thumbnails | Browser memory bound | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | No OCR or content-aware extraction | READY_WITH_LIMITATION |
| Reorder Pages | `/reorder-pages` | PDF | `pages-reordered.pdf` | PDF.js + pdf-lib | No | Visual reorder, reverse, keyboard movement | Page thumbnails | Browser memory bound | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | No multi-selection move in V1 | READY_WITH_LIMITATION |
| Protect PDF | `/protect-pdf` | PDF | `protected.pdf` | QPDF WASM | No | N/A | File summary | Browser memory bound | Can protect unencrypted PDFs; rejects unreadable inputs | No | Ready | Ready | Yes | PDF permissions are viewer-enforced and not DRM | READY_WITH_LIMITATION |
| Unlock PDF | `/unlock-pdf` | PDF | `unlocked.pdf` | QPDF WASM | No | N/A | File/protection summary | Browser memory bound | Supports valid user password, owner password and restriction-only PDFs | No | Ready | Ready | Yes | Does not bypass unknown passwords | READY_WITH_LIMITATION |
| PDF to Text | `/pdf-to-text` | PDF | `extracted-text.txt` | PDF.js text extraction | No | All, single/ranges | Text preview | Browser memory bound | Protected PDFs rejected with unlock guidance | No | Ready | Ready | Yes | Selectable text only; no OCR | READY_WITH_LIMITATION |

## Summary

- Total V1 tools: 17
- READY: 1
- READY_WITH_LIMITATION: 16
- NOT_READY: 0

Launch interpretation: V1 is launchable because every limitation above is documented, non-critical, and consistent with the public privacy/browser-processing model.
