# LiftPDF Phase 62 - Deep Engine Feasibility And Remaining P2 Classification

Date: 2026-08-11  
Project: LiftPDF  
Scope: feasibility and classification only. No production runtime code changed.

## 1. Executive Summary

Phase 62 reconciles the roadmap, code, tests, and Phase 38-61 reports after the autonomous functional pass.

The P1 track is closed. The last completed P2 work also removed most safe, high-value items:

- Reorder Pages: reverse order and keyboard movement.
- Delete Pages: undo last deletion.
- Add Page Numbers: odd/even targeting.
- Watermark PDF: odd/even targeting.

The remaining work is no longer a simple backlog of small controls. It splits into three groups:

1. Safe browser-local polish with current engines.
2. Engine-risk features that need a spike before any UI.
3. Features that should be rejected because they would be misleading, too narrow, or strategically wrong for LiftPDF.

The most important technical decision is that Watermark PDF "below content" is not safe to ship with the current append-only `pdf-lib` draw path. It may be possible for controlled PDFs with low-level content stream insertion, but it is not guaranteed across real-world PDFs without a spike.

Recommended Phase 63:

```text
NEXT_PHASE_TYPE = ENGINE_SPIKE
NEXT_TOOL = Watermark PDF
NEXT_FEATURE = True below-content watermark
NEXT_REASON = This is the clearest remaining feature where a UI promise would be misleading unless low-level content-stream behavior is proven first.
```

A safe implementation alternative exists: Delete Pages range input. It is lower risk and useful, but it does not answer the deeper engine question blocking the next professional tier.

## 2. Current Engine Architecture

| Engine | Version / status | Current production use | Main value | Main limit |
|---|---:|---|---|---|
| `pdf-lib` | 1.17.1 | Merge, Split, Rotate, Delete, Extract, Reorder, Add Page Numbers, Watermark, Image to PDF | Browser-local PDF creation, page copy, page rotation, drawing text/images | Not a full arbitrary PDF content-stream editor, compressor, OCR engine, or semantic parser |
| PDF.js / `pdfjs-dist` | 4.10.38 | Thumbnails, preview, PDF to JPG/PNG, PDF to Text | Browser rendering and selectable text extraction | Text order/layout is heuristic; no OCR; no original embedded-image extraction |
| QPDF WASM | qpdf 11.7.0 | Compress, Protect, Unlock | Real encryption/decryption, permissions, structural optimization | No exact target size guarantee; no full visual downsampling pipeline |
| JSZip | 3.10.1 | Multi-output ZIPs | Browser-local packaging | Complete archive generated in memory |
| Canvas/browser image APIs | Browser native | PDF to image and Image to PDF bridges | Native image decode/render/encode | Memory scales with pixels; recompression can occur |
| `lib/page-ranges.ts` | internal | Shared page targeting | Validated page range parsing | Only page numbers, not bookmarks/semantic sections |

Detailed engine matrix: `docs/engine-capability-matrix-phase-62.md`.

## 3. Remaining P2 Inventory

Official roadmap and closure reports list a small set of unfinished P2/P3 items. Additional candidates below are separated as `NEW_CANDIDATE` when they are not official roadmap items.

| Tool | Feature | Source status | Current implementation | Actually missing |
|---|---|---|---|---|
| Compress PDF | Approximate target size | Official P2 open | QPDF Preserve/Balanced/Strong and metadata removal | A controlled iterative target-size loop with quality checks |
| Split PDF | Split by bookmarks | Official P2 open | Range, every page, every N pages | Robust outline/bookmark parsing and group export |
| Watermark PDF | Layer above/below toggle | P3/rejected in roadmap, still decision item | Overlay watermark verified | True below-content insertion below existing page content |
| PDF to Text | Preserve layout / columns / paragraphs | P3 open / risky | Plain text and page range extraction | Honest structured text reconstruction |
| PDF to JPG/PNG | Embedded image extraction | P3 open / separate workflow | Page rendering to JPG/PNG | Original embedded image stream extraction |
| Merge PDF | Bookmarks from filenames | P3 open | Merge, validation isolation, output filename | Creating `/Outlines` entries reliably |
| Reorder Pages | Move page to exact position | Remaining decision item | Drag/drop, buttons, reverse, keyboard | Direct target-position UI and state update |
| Reorder Pages | Multi-selection | Remaining decision item | Single-page movement and drag | Multi-select state, batch movement, focus model |
| Delete Pages | Range input | Closure limitation | Visual selection, grouped delete, undo | Typed range deletion using central parser |
| Extract Pages | Custom output naming | Closure limitation | Single combined PDF and separate ZIP | Filename/prefix controls |
| Images to PDF | One PDF per image ZIP | P3 open | Combined PDF, filename, rotation, EXIF handling | Separate PDFs packaged in ZIP |
| PNG to PDF | Transparent PNG background color | Closure limitation | Transparent PNG rendered over current PDF page background | Explicit matte/background choice |
| PDF to JPG/PNG | Output filename/prefix | Closure limitation | Fixed names retained intentionally | User prefix for single images and ZIP entries |
| PDF to JPG/PNG | Explicit resolution / DPI | Closure limitation / rejected fake DPI | Standard/High render scale | Honest pixel-size controls without fake DPI wording |
| Add Page Numbers | Roman numerals / chapters | P3 open | Formats, range, odd/even, skip cover | Complex numbering templates |
| JPG/PNG tools | Dedicated per-image rotation parity | NEW_CANDIDATE from audits | Images to PDF already handles individual rotation | Deciding whether dedicated tools should stay simple |
| Protect/Unlock | More security controls | NEW_CANDIDATE | AES-256, user/owner passwords, permissions, restriction-only unlock | No real missing P2 except rejected bypass/recovery |
| Cloud import/export | Rejected earlier | Not implemented | Third-party account flows | Strategically rejected |

## 4. P2 Classification

| Feature | Tool | Priority | Classification | Current engine | Required engine | Implementation risk | User value | Privacy | Testability | Recommended action | Recommended phase |
|---|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| Approximate target size | Compress PDF | P2 | NEEDS_ENGINE_SPIKE | QPDF WASM | QPDF loop or new local compressor | 5 | 4 | 5 | 3 | Spike only; reject exact guarantees | NEXT |
| Split by bookmarks | Split PDF | P2 | NEEDS_ENGINE_SPIKE | pdf-lib / PDF parsing | Outline parser plus pdf-lib grouping | 4 | 3 | 5 | 3 | Spike with bookmark fixtures | NEXT |
| True below-content watermark | Watermark PDF | P3/decision | NEEDS_ENGINE_SPIKE | pdf-lib append drawing | Low-level content stream insertion or new engine | 5 | 3 | 5 | 2 | Spike before UI | PHASE 63 |
| Preserve layout text | PDF to Text | P3 | NEEDS_ENGINE_SPIKE | PDF.js text items | PDF.js heuristics or new extraction engine | 4 | 3 | 5 | 3 | Spike as "layout-aware", never perfect | LATER |
| Embedded image extraction | PDF to JPG/PNG | P3 | NEEDS_NEW_DEPENDENCY | PDF.js page rendering | Low-level object/image extractor | 5 | 2 | 5 | 3 | Treat as separate future tool | LATER |
| Bookmarks from filenames | Merge PDF | P3 | NEEDS_ENGINE_SPIKE | pdf-lib | Low-level `/Outlines` creation or new engine | 4 | 3 | 5 | 3 | Spike only if demand appears | LATER |
| Move page to exact position | Reorder Pages | P2 candidate | SAFE_WITH_CURRENT_ENGINE | pdf-lib + state | Current engine | 2 | 3 | 5 | 5 | Safe implementation candidate | NOW alternative |
| Multi-selection | Reorder Pages | P2 candidate | NEEDS_ARCHITECTURAL_CHANGE | pdf-lib + state | Current engine plus state redesign | 4 | 3 | 5 | 4 | Defer until UX need is proven | LATER |
| Range input | Delete Pages | P2 candidate | SAFE_WITH_CURRENT_ENGINE | pdf-lib + page ranges | Current engine | 2 | 3 | 5 | 5 | Safe implementation candidate | NOW alternative |
| Custom output naming | Extract Pages | P2 candidate | SAFE_WITH_CURRENT_ENGINE | pdf-lib + JSZip | Current engine | 1 | 2 | 5 | 5 | Low-risk polish | LATER |
| One PDF per image ZIP | Images to PDF | P3 | SAFE_WITH_CURRENT_ENGINE | pdf-lib + JSZip | Current engine | 3 | 3 | 5 | 4 | Implement only if analytics supports | LATER |
| PNG background color | PNG to PDF | P2 candidate | SAFE_WITH_CURRENT_ENGINE | pdf-lib + canvas/image decode | Current engine | 2 | 2 | 5 | 4 | Safe but narrow | LATER |
| Filename/prefix | PDF to JPG/PNG | P2 candidate | SAFE_WITH_CURRENT_ENGINE | PDF.js + JSZip | Current engine | 1 | 2 | 5 | 5 | Low-risk polish | LATER |
| Explicit pixel resolution | PDF to JPG/PNG | P2 candidate | NEEDS_ENGINE_SPIKE | PDF.js render scale | Current engine with honest pixel labels | 3 | 3 | 5 | 4 | Spike wording and output contract | NEXT/LATER |
| Roman numerals / chapters | Add Page Numbers | P3 | NOT_WORTH_IMPLEMENTING | pdf-lib | Current engine | 2 | 2 | 5 | 5 | Reject for now; too niche | REJECT |
| Dedicated JPG/PNG rotations | JPG to PDF / PNG to PDF | NEW_CANDIDATE | DUPLICATE | Shared image-to-PDF engine | Current engine | 2 | 1 | 5 | 4 | Keep dedicated tools simple | REJECT |
| Additional security/bypass | Protect/Unlock | NEW_CANDIDATE | ALREADY_DONE / NOT_WORTH_IMPLEMENTING | QPDF WASM | N/A | 5 | 1 | 5 | 5 | No bypass/recovery features | REJECT |
| Cloud import/export | All tools | Rejected | NOT_WORTH_IMPLEMENTING | N/A | Third-party integrations/backend | 4 | 2 | 2 | 2 | Reject for privacy-first V1 | REJECT |

## 5. Engine Capability Matrix

See `docs/engine-capability-matrix-phase-62.md`.

Key takeaways:

- `pdf-lib` is strong for creating/copying/rotating/drawing, weak for arbitrary content stream editing.
- PDF.js is strong for rendering and selectable text items, weak for semantic layout or original embedded image extraction.
- QPDF WASM is strong for encryption/decryption and structural optimization, weak for exact target-size compression.
- JSZip works for current ZIP outputs but remains memory-bound.
- Canvas is useful but pixel-memory sensitive.

## 6. pdf-lib Limits

`pdf-lib` can create new page content and copy existing pages. It is already production-proven in LiftPDF for:

- `copyPages` in Merge, Split, Delete, Extract, Reorder.
- `setRotation` in Rotate PDF.
- `drawText` in Add Page Numbers and Watermark.
- `drawImage` in Watermark and Image to PDF.
- Low-level dictionary inspection in tests.

The risky zone is arbitrary existing content manipulation:

| Area | Classification | Risk |
|---|---|---|
| Content streams | POSSIBLE_WITH_LOW_LEVEL_PDF_OBJECTS | Need to inspect `/Contents` as stream or array; inserting before existing content can break assumptions. |
| Page resources | POSSIBLE_BUT_FRAGILE | New XObjects/extGState/fonts must be available to the inserted stream and not conflict with inherited resources. |
| Drawing order | NOT_SAFE_WITH_CURRENT_APPROACH | Current production drawing appends visible overlay marks; below-content needs prepending or content array manipulation. |
| Annotations/forms/links | SUPPORTED_WITH_TESTING for copy operations | Visual layering can still be affected because annotations often render above page contents. |
| Inherited resources | POSSIBLE_BUT_FRAGILE | Parent page tree resources can complicate inserted stream references. |
| Transparency/clipping/transforms | POSSIBLE_BUT_FRAGILE | Existing graphics state and clipping must be isolated with save/restore operators. |
| XObjects/nested forms | POSSIBLE_BUT_FRAGILE | Content inside Form XObjects will still render according to original order. |
| Signed PDFs | NOT_SAFE_WITH_CURRENT_APPROACH | Any content change invalidates signatures; UI would need warnings. |

Conclusion: `pdf-lib` remains the right engine for page-level operations. It should not be treated as a full PDF editor engine.

## 7. PDF.js Limits

PDF.js exposes `getDocument`, `getPage`, rendering, and `getTextContent()`. LiftPDF uses those safely for previews, image export, and plain text extraction.

Advanced PDF to Text is the dangerous part. PDF.js text items include strings and positioning transforms, but PDFs do not guarantee DOM-like paragraphs, columns, or reading order. A two-column article, table, header/footer, footnote, rotated label, or overlapping text can all produce surprising item order.

Honest product tiers:

| Public mode | Feasibility | Notes |
|---|---|---|
| Plain text | YES | Current behavior. |
| Structured text | PARTIAL | Can group lines by coordinates and spacing with warnings. |
| Layout-preserved text | NO as a strong promise | Could only be heuristic unless a more specialized engine is adopted. |

Any future feature should be called "layout-aware text" or "preserve line breaks where possible", not "perfect layout preservation".

## 8. QPDF Limits

QPDF WASM is currently the right engine for:

- AES-256 Protect PDF.
- Owner/user passwords.
- Permissions.
- Restriction-only Unlock PDF.
- Removing `/Encrypt`.
- Structural compression modes.
- Removing metadata.

It is not enough alone for an honest exact file-size target:

- Output size depends on PDF structure, embedded images, fonts, object streams, existing compression, and content entropy.
- QPDF image options can change JPEG quality and optimize images, but they do not provide a universal "make this 2 MB" contract.
- A target-size loop would need repeated passes, quality assessment, time limits, fallback messaging, and final "approximately" wording.
- Rasterizing pages to hit size targets would alter text, links, forms, annotations, accessibility, and searchability unless scoped to a separate destructive mode.

Conclusion: approximate target size is a spike, not a safe implementation.

## 9. JSZip / Memory Considerations

Phase 49 hardened PDF to image processing by rendering pages sequentially, cleaning canvas and PDF.js page resources, adding workload estimation, warnings, progress, and cancellation.

JSZip still builds complete ZIP outputs in memory. This is acceptable for the current tools with warnings and page selection, but it is the limiting factor for very large outputs:

- Many PNG pages can consume substantial memory.
- ZIP generation can duplicate data temporarily.
- Streaming ZIP would require a new dependency or architectural change.

No current remaining P2 requires changing JSZip by default. If "one PDF per image ZIP" is implemented later, it should reuse the Phase 49 workload mindset.

## 10. Targeted Spikes

Recommended spikes before any risky public UI:

| Spike | Goal | Fixtures required | Exit criteria |
|---|---|---|---|
| Watermark below content | Determine whether `pdf-lib` can prepend a safe below-content stream | Simple text, image-heavy, multiple content streams, rotated page, form, annotation, transparency, nested XObject, signed sample if available | `WATERMARK_BELOW_CONTENT_FEASIBLE_WITH_CURRENT_ENGINE = YES/PARTIAL/NO` with exact exclusions |
| Split by bookmarks | Parse outlines and named destinations into page ranges | PDF with top-level and nested bookmarks, named destinations, malformed outline, no bookmarks | Groups match visible bookmarks; invalid outlines fail cleanly |
| Compress approximate target | Try bounded QPDF iterative loop | Text-only, image-heavy, scanned, already optimized, forms/links | Can converge approximately without hidden quality loss or timeout |
| PDF to Text layout-aware | Evaluate coordinate grouping | One-column, two-column, table, header/footer, rotated text | Decide whether a limited "layout-aware" mode is honest |
| PDF to image resolution contract | Define honest pixel-size controls | Standard pages, large pages, selected ranges | Public labels do not imply fake DPI; output dimensions verified |

## 11. New Dependency Candidates

No new dependency should be installed during Phase 62.

Potential candidates:

| Candidate | License / maintenance signal | Browser support | P2 it could unlock | Concerns |
|---|---|---|---|---|
| MuPDF.js | Official MuPDF/Artifex package; official pages describe JavaScript/TypeScript and WebAssembly support; repo states AGPL or commercial licensing | Designed for JS/WASM | Deeper parsing, extraction, possible content handling | Licensing must be resolved before proprietary/SaaS use; bundle and worker model need measurement |
| Ghostscript WASM | Official Ghostscript is AGPL or commercial | WASM ports exist outside current stack | Raster/print-style compression experiments | AGPL/commercial licensing, large bundle, destructive raster risk |
| PDFium | Official Chromium PDF engine source | Browser WASM requires wrapper/build evaluation | Rendering, possible parsing and embedded image work | Heavy build and wrapper risk; security update process required |
| pdfcpu | Apache-2.0 project with CLI/API | Go/WASM browser path not first-class in LiftPDF today | Structural operations, validation, possible extraction | Browser integration and memory model need proof |

Sources consulted:

- pdf-lib repository: https://github.com/hopding/pdf-lib
- PDF.js API docs: https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html
- QPDF manual: https://qpdf.readthedocs.io/en/stable/cli.html
- JSZip docs: https://stuk.github.io/jszip/documentation/api_jszip/generate_async.html
- MuPDF.js: https://mupdf.com/mupdf-js and https://github.com/ArtifexSoftware/mupdf.js/
- Ghostscript releases/licensing: https://ghostscript.com/releases/gsdnld.html
- PDFium source: https://pdfium.googlesource.com/pdfium/
- pdfcpu: https://pdfcpu.io/

## 12. Backend-only Candidates

No official remaining P2 should default to backend.

Backend would be required or strongly preferred for:

- OCR at scale.
- Office conversion.
- highly reliable destructive compression/raster pipelines on weak devices.
- cloud import/export or account storage.
- server-side commercial engines.

Backend impact:

- Files would leave the browser.
- Privacy copy would need a different promise.
- Retention, deletion, encryption-at-rest, abuse handling, DPA/compliance, rate limits, and cost controls become product requirements.
- It would weaken LiftPDF's current strongest differentiator unless offered as an explicit opt-in separate product tier.

## 13. Features To Reject

| Feature | Reason |
|---|---|
| Guaranteed 1 MB / 2 MB / 5 MB compression | Misleading across arbitrary PDFs. Only approximate target wording is acceptable after a spike. |
| Fake DPI controls | Current PDF to image engine controls render scale/pixels, not a full DPI contract. |
| Unlock without a known valid password | Security and ethics violation; already rejected. |
| Cloud import/export by default | Conflicts with browser-local privacy positioning. |
| Roman numerals/chapters now | Too niche relative to complexity; current page numbering is already professional. |
| Dedicated JPG/PNG rotation controls now | Duplicates Images to PDF complexity; dedicated tools should stay focused unless analytics proves demand. |
| True below-content watermark without proof | Would be a false option if it only appends or visually simulates layering. |

## 14. Recommended Development Order

### NOW

Safe implementation candidates if the next phase should ship a feature:

1. Delete Pages - range input.
2. Reorder Pages - move page to exact position.
3. PDF to JPG/PNG - filename prefix.
4. Extract Pages - custom output naming.

These are browser-local and testable with current engines.

### NEXT

Engine spikes that answer important professional-depth questions:

1. Watermark PDF - true below-content watermark.
2. Split PDF - split by bookmarks.
3. Compress PDF - approximate target size.
4. PDF to image - explicit pixel-size / resolution contract without fake DPI.

### LATER

Useful but not urgent:

1. Images to PDF - one PDF per image ZIP.
2. PNG to PDF - transparent background color.
3. Merge PDF - bookmarks from filenames.
4. PDF to Text - layout-aware extraction.
5. Reorder Pages - multi-selection.

### REJECT

1. Guaranteed target-size compression.
2. Perfect layout-preserved TXT.
3. Password bypass/recovery.
4. Default backend/cloud workflows.
5. Below-content watermark UI before a successful spike.

## 15. Next Phase Recommendation

```text
NEXT_PHASE_TYPE = ENGINE_SPIKE
NEXT_TOOL = Watermark PDF
NEXT_FEATURE = True below-content watermark
```

Reason:

Watermark below-content is the clearest remaining feature where current UI would be dangerous. Users understand "behind content" as a real PDF layer/order guarantee, not as a visual approximation. The current `pdf-lib` production path draws over existing content. A spike can answer whether low-level insertion is reliable enough, and if it is not, the feature can be rejected with confidence.

Phase 63 should not ship UI unless the spike proves:

- output order is truly below existing page content;
- overlays/forms/annotations are understood;
- the implementation isolates graphics state safely;
- text/image watermarks work;
- rotated pages and multiple content streams work;
- failures are detectable.

If the user prefers a shipping phase instead of a spike, choose:

```text
NEXT_PHASE_TYPE = IMPLEMENT_SAFE_P2
NEXT_TOOL = Delete Pages
NEXT_FEATURE = Range input
```

That would be safe and useful, but it would not resolve the remaining engine ceiling.

## Final Verdict

```text
PHASE_62_COMPLETE = YES
PRODUCTION_RUNTIME_MODIFIED = NO
REMAINING_P2_COUNT = 18
SAFE_WITH_CURRENT_ENGINE_COUNT = 6
NEEDS_ENGINE_SPIKE_COUNT = 6
NEEDS_NEW_DEPENDENCY_COUNT = 1
NEEDS_BACKEND_COUNT = 0
NEEDS_ARCHITECTURAL_CHANGE_COUNT = 1
NOT_WORTH_IMPLEMENTING_COUNT = 3
DUPLICATE_COUNT = 1
ALREADY_DONE_COUNT = 1
ALL_REMAINING_P2_CLASSIFIED = YES
CURRENT_ENGINE_LIMITS_DOCUMENTED = YES
WATERMARK_BELOW_CONTENT_CLASSIFIED = YES
WATERMARK_BELOW_CONTENT_FEASIBLE_WITH_CURRENT_ENGINE = PARTIAL
PDF_TO_TEXT_ADVANCED_CLASSIFIED = YES
NEW_ENGINE_REQUIRED = PARTIAL
PRIVACY_MODEL_CAN_BE_PRESERVED = PARTIAL
FUNCTIONAL_DEPTH_V1_COMPLETE = YES
NEXT_PHASE_TYPE = ENGINE_SPIKE
NEXT_TOOL = Watermark PDF
NEXT_FEATURE = True below-content watermark
READY_FOR_PHASE_63 = YES
```
