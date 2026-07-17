# LiftPDF Functional Upgrade Roadmap

Date: 2026-07-17

This roadmap is based on `docs/functional-depth-audit.md`. It prioritizes professional capability over visual polish.

## P0 — Blocks Professional Credibility

| Tool | Task | Reason | Technology | Estimate | Risk | Tests required | Bundle/mobile/privacy impact |
|---|---|---|---|---:|---|---|---|
| Compress PDF | Replace weak PDF rebuild with real compression modes | Competitors expose real compression levels; fake levels would be misleading | QPDF WASM | Completed in Phase 38 | Medium | Output validity, page count, mode size comparison | Existing WASM dependency; privacy preserved |
| Compress PDF | Remove exact target-size promises | Current browser engine cannot guarantee 1 MB / 2 MB outputs | Copy/UI change | Completed | Low | Metadata/FAQ smoke | No impact |
| Compress PDF | Add deterministic image-heavy fixture | Compression must be measured on files that can actually change | Playwright fixture generation | Completed | Low | Fixture generation and e2e | Test-only |

## P1 — Important Professional Upgrades

| Tool | Feature | Reason | Technology | Estimate | Risk | Tests required | Impact |
|---|---|---|---|---:|---|---|---|
| Compress PDF | Before/after visual comparison | Users need to judge scan/image quality after Strong mode | PDF.js thumbnail render | 1-2 days | Medium | Visual thumbnail render, no pageerror, mobile | More client CPU, privacy preserved |
| Compress PDF | Link/form/annotation preservation tests | QPDF should preserve structure, but this must be proven | Fixtures + PDF inspection | 1 day | Medium | `/Annots`, `/AcroForm`, link annotations where inspectable | Test-only |
| Compress PDF | Optional remove metadata toggle | Safe and useful when users need smaller/private PDFs | QPDF `--remove-metadata --remove-info` | 0.5-1 day | Low | Metadata-rich fixture before/after | Privacy positive |
| JPG/PNG/Images to PDF | Editable output filename | Common professional expectation | UI state only | 0.5 day | Low | Download filename tests | No privacy impact |
| JPG/PNG/Images to PDF | EXIF orientation handling | Phone photos often arrive rotated | Browser EXIF parser or image decode checks | 1-2 days | Medium | EXIF fixture visual/export | Small bundle if parser added |
| JPG/PNG/Images to PDF | Per-image rotation | Fixes common scanned/photo workflow without another tool | Existing placement logic | 1-2 days | Medium | Preview/export parity | No privacy impact |
| PDF to JPG/PNG | Add memory guard and progress for 100-page files | Current workflow can be heavy on mobile | Existing render loop | 1 day | Medium | 100-page fixture, cancellation/error | Better mobile stability |
| Merge PDF | Editable output filename | Professional workflow expectation | UI state | 0.5 day | Low | Download name test | No impact |
| Merge PDF | Per-file protected PDF error | Users need to know which PDF failed | PDF load error mapping | 1 day | Low | Protected fixture | No privacy impact |
| Add Page Numbers | Skip first page / page range | Common for cover pages and reports | Existing pdf-lib draw loop | 1 day | Medium | Range/cover fixture | No privacy impact |
| Watermark PDF | Page range | Common professional need | Existing pdf-lib draw loop | 1 day | Medium | Range fixture | No privacy impact |
| Protect PDF | Permission toggles only if verified | Useful but dangerous if fake | QPDF permission flags | 2-3 days | High | Acrobat/Chrome/Firefox compatibility, `/Encrypt` inspection | Privacy preserved |
| Unlock PDF | Restriction-only PDF handling | Important for real-world locked PDFs | QPDF tests | 1-2 days | Medium | Owner/user password fixtures | Privacy preserved |
| PDF to Text | Page range | Helps large documents and selective extraction | PDF.js text extraction loop | 1 day | Low | Range text fixture | No privacy impact |

## P2 — Power User Enhancements

| Tool | Feature | Reason | Technology | Estimate | Risk | Tests required | Impact |
|---|---|---|---|---:|---|---|---|
| Split PDF | Split every N pages | Useful for batches and scans | pdf-lib + JSZip | 1 day | Medium | 10/100-page fixture | No privacy impact |
| Split PDF | Split by bookmarks | Useful but requires outline parsing | PDF outline inspection | 2-4 days | High | Bookmark fixture | No privacy impact |
| Extract Pages | Export each selected page separately as ZIP | Common admin workflow | pdf-lib + JSZip | 1 day | Medium | ZIP names/count | No privacy impact |
| Reorder Pages | Keyboard reordering | Accessibility and power use | UI/event handling | 1 day | Medium | Keyboard e2e | No privacy impact |
| Reorder Pages | Reverse order | Useful for scanned stacks | Array transform | 0.5 day | Low | Order fixture | No privacy impact |
| Delete Pages | Undo last selection/delete | Prevents user mistakes | UI state | 1 day | Medium | Selection state e2e | No privacy impact |
| Compress PDF | Approximate target size | Only if controlled loop proves reliable | QPDF quality loop or new engine | 3-5 days | High | Size convergence, quality checks | More CPU/memory |

## P3 — Optional / Later

| Tool | Feature | Reason to delay |
|---|---|---|
| Image to PDF | One PDF per image ZIP | Useful, but not central to current traffic intent |
| PDF to JPG/PNG | Embedded image extraction | It is a different tool and must not be faked |
| Merge PDF | Bookmarks from file names | Nice for long merged reports but not required for V1 |
| Add Page Numbers | Roman numerals/chapters | Power-user feature that adds complexity |
| Watermark PDF | Layer above/below toggle | Useful but less urgent than page range |
| PDF to Text | Preserve layout mode | Hard to do reliably; can disappoint on columns/tables |

## Rejected

| Proposal | Status | Reason |
|---|---|---|
| Guaranteed 1 MB / 2 MB Compress PDF buttons | `REJECTED_MISLEADING` | Browser QPDF modes cannot guarantee exact target size across arbitrary PDFs. |
| Full server-side compression as default | `REQUIRES_BACKEND` / rejected for V1 | It would break the core privacy promise that files stay in the browser. |
| Fake DPI controls for PDF to image | `REJECTED_MISLEADING` | Current engine exposes render scale, not a true DPI contract. |
| Unlock without password | `REJECTED_MISLEADING` | LiftPDF must not bypass encryption or imply password recovery. |
| Cloud import/export integrations | `REJECTED_LOW_VALUE` | Adds account/privacy complexity and does not improve core browser tools. |

## Implementation Order

1. Compress PDF professional baseline. Done in Phase 38.
2. Compress PDF structural preservation tests and metadata toggle.
3. Image-to-PDF output filename + per-image rotation.
4. Add Page Numbers page range / skip first page.
5. Watermark page range.
6. Protect/Unlock advanced QPDF compatibility matrix.
7. PDF to Text page range.

The roadmap deliberately avoids changing all tools at once. Each P1 item should ship as a small measured pass with output-level tests.

