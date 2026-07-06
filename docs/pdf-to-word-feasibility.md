# LiftPDF - Phase 9A - PDF to Word Feasibility Report

Date: 2026-07-06

## Executive summary

LiftPDF should not ship a public "PDF to Word" tool yet unless the product
claim is tightly scoped.

There is no strong open-source, browser-native TypeScript library that performs
high-fidelity PDF to DOCX conversion comparable to iLovePDF, Smallpdf or Adobe.
The realistic choices are:

1. Use a commercial browser SDK for high-fidelity PDF to Office conversion.
2. Build a LiftPDF open-source "editable DOCX" engine from PDF.js + docx, with
   clear limitations.
3. Use a Python/server engine such as pdf2docx, which conflicts with the current
   client-side/no-upload LiftPDF positioning.

Recommendation: keep `/pdf-to-word` as Coming Soon until a prototype proves a
minimum acceptable quality bar. For a premium iLovePDF-level result, evaluate a
paid client-side SDK first. For a free browser-only MVP, build a limited
PDF.js -> structured extraction -> docx pipeline and label it honestly.

## Current LiftPDF context

LiftPDF already has:

- Next.js 15 App Router, React 19, TypeScript, Tailwind CSS.
- Client-side PDF.js integration in `components/tools/pdf/pdfjs-client.ts`.
- QPDF WASM for real PDF encryption/decryption.
- PDF to Text, which already extracts selectable text with PDF.js.
- A catalog/data-driven architecture through `data/tools.ts`.
- Tool shell, related tools, SEO, FAQ and shared upload components.

This makes LiftPDF well prepared for a PDF-to-DOCX prototype, but not enough for
a faithful converter.

## What "true PDF to Word" means

A valid implementation must generate a real `.docx` file that opens in:

- Microsoft Word
- LibreOffice
- Google Docs import

It must not be:

- A `.txt` renamed as `.docx`.
- A DOCX containing only raw text while claiming layout fidelity.
- A fake converter that hides major loss of structure.

The hard part is not creating DOCX. The hard part is reconstructing a logical
Word document from a fixed-layout PDF.

PDF is page/canvas oriented. DOCX is flow/document oriented. A robust converter
must infer paragraphs, headings, columns, lists, tables, images and styles from
low-level glyph positions.

## Library comparison

| Library | Role | Browser compatible | License | Maintenance | TypeScript | Quality for PDF -> DOCX | Native dependencies | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PDF.js / pdfjs-dist | Parse/render PDF, extract text geometry | Yes | Apache-2.0 | Very active | Types available | Does not generate DOCX; provides raw text/items/rendering | No native deps | Best extraction base for a custom client-side engine |
| docx | Generate real DOCX in JS/TS | Yes | MIT | Active | TypeScript-first | Good DOCX writer, but no PDF understanding | No native deps | Best open-source DOCX generation target |
| pdf2docx Python | Full PDF -> DOCX pipeline | No browser support | MIT now, historically GPL lineage in older package mirrors/forks | No longer actively maintained by Artifex | Python, not TS | Best open-source quality among non-commercial options, but server/Python only | PyMuPDF/OpenCV/python-docx stack | Not compatible with LiftPDF client-only architecture |
| npm `pdf2docx` | Node wrapper around Python package | No practical browser support | Not clearly useful from npm metadata | Thin wrapper, version 0.0.0 | Weak | Depends on Python interop; not a browser solution | Python bridge | Reject |
| Mammoth | DOCX -> HTML | Browser possible | BSD-2-Clause | Active | Usable | Wrong direction; does not convert PDF to DOCX | No required native deps | Not useful for PDF -> Word |
| pdf-lib | PDF create/edit | Yes | MIT | Stable but less active recently | TypeScript | Cannot convert PDF to DOCX | No native deps | Useful elsewhere, not for this tool |
| Apryse Web/Core SDK | Commercial PDF <-> Office conversion | Browser/client-side options | Commercial | Vendor maintained | JS SDK | High-fidelity claim; likely closest to product target | Vendor WASM/assets | Best fidelity option, but paid/heavy |
| Nutrient Web SDK | Commercial PDF to Office in browser | Browser/client-side | Commercial | Vendor maintained | JS SDK | High-fidelity claim; designed for this use case | Vendor WASM/assets | Strongest browser-only premium candidate |
| GroupDocs/Aspose/ConvertAPI | Conversion APIs/SDKs | Mostly server/cloud | Commercial | Vendor maintained | SDKs available | High-fidelity possible | Backend/cloud or paid SDK | Conflicts with no-upload unless self-hosted/server accepted |

## Findings by library

### PDF.js / pdfjs-dist

PDF.js is already installed in LiftPDF and is the correct browser-side parser.
It can:

- Load PDFs in the browser.
- Render pages to canvas.
- Extract text content items.
- Provide text strings, transform matrices, width, height and font references.

It cannot:

- Generate DOCX.
- Recover semantic structure on its own.
- Reliably infer tables, headings or reading order without additional logic.

Use PDF.js as the extraction layer, not as the converter.

### docx

`docx` is the best open-source browser-compatible DOCX writer for this stack.
It can create real `.docx` files with:

- Paragraphs
- Runs
- Headings/styles
- Tables
- Images
- Page breaks
- Basic formatting

It cannot parse PDFs. It must receive a reconstructed document model from our
own engine.

### pdf2docx

The Python `pdf2docx` project is the closest open-source library to what users
expect from PDF to Word. It extracts content with PyMuPDF, parses layout by
rules and generates DOCX with python-docx.

However:

- It is Python, not browser TypeScript.
- It depends on native/document-processing packages.
- It is not compatible with LiftPDF's current no-backend architecture.
- The project is no longer actively maintained by Artifex.

It is a possible future server-side/self-hosted engine, but not a Phase 9B
client-side implementation.

### Mammoth

Mammoth converts DOCX to HTML. It is useful for previewing Word documents, not
for converting PDFs to Word.

Reject for this use case.

### pdf-lib

pdf-lib can read and modify PDFs, but it does not expose the layout extraction
needed for PDF to Word and cannot write DOCX.

Reject as the primary tool for PDF to Word.

### Commercial browser SDKs

Nutrient and Apryse are the only researched options that plausibly satisfy:

- Real PDF to DOCX
- Client-side/browser execution
- Higher-fidelity conversion
- No server upload

Tradeoffs:

- Paid license.
- Large WASM/assets.
- Vendor lock-in.
- Possible deployment/licensing constraints.
- Need proof-of-concept in Next.js with LiftPDF headers/COOP/COEP.

For a product trying to compete with iLovePDF/Smallpdf quality, this is the
most technically credible route.

## Preservation matrix

| Feature | PDF.js + docx custom engine | Commercial SDK | pdf2docx server/Python |
| --- | --- | --- | --- |
| Paragraphs | Possible with heuristics | Strong | Good |
| Titles/headings | Possible but inferred | Strong | Medium/Good |
| Lists | Hard; inferred | Stronger | Medium |
| Tables | Hard; high risk | Stronger | Medium/Good |
| Images | Possible; extract/render/crop complexity | Strong | Good |
| Links | Possible if annotations parsed | Stronger | Medium |
| Bold/italic | Limited; font-name heuristics | Stronger | Medium |
| Font size | Possible from transforms | Stronger | Medium/Good |
| Page breaks | Easy | Strong | Good |
| Multi-column order | Hard | Stronger | Medium |
| Scanned PDFs | Out of scope without OCR | Usually optional OCR | Out of scope unless OCR added |

## Recommended architecture

### Option A - Premium/high-fidelity route

Use a commercial browser SDK only for PDF to Word.

Flow:

1. User uploads PDF locally.
2. SDK loads PDF in browser.
3. SDK exports DOCX.
4. LiftPDF downloads generated `.docx`.
5. Tool UI stays consistent with existing `ToolPageShell`, upload and summary
   components.

Pros:

- Best chance of matching iLovePDF/Smallpdf expectations.
- Faster implementation after licensing.
- Less algorithmic risk.
- Keeps no-upload/privacy positioning if the SDK is truly local.

Cons:

- Paid.
- Bundle/WASM size likely large.
- Vendor lock-in.
- Must evaluate license terms before production.

### Option B - Open-source browser-only LiftPDF engine

Build a custom conversion engine:

```text
PDF.js
  -> page text items + viewport metrics + annotations + rendered assets
  -> layout analyzer
  -> logical document model
  -> docx generator
  -> .docx download
```

Proposed modules:

```text
components/tools/pdf/pdf-structured-text.ts
components/tools/pdf/pdf-layout-analyzer.ts
components/tools/word/docx-writer.ts
components/tools/pdf-to-word-tool.tsx
```

Internal model:

```text
DocumentModel
  sections[]
    blocks[]
      paragraph | heading | table | image | pageBreak
```

Minimum viable version:

- Extract selectable text.
- Preserve page breaks.
- Reconstruct paragraphs by line spacing and x/y positions.
- Detect basic headings by font size.
- Generate real DOCX with `docx`.
- Warn clearly: "Best for text-based PDFs. Complex layouts may not be preserved."

Pros:

- Free/open-source.
- Fully private.
- Fits current architecture.
- Reuses PDF.js and current PDF to Text work.

Cons:

- Not high fidelity initially.
- Tables, multi-column documents and complex layouts are high risk.
- Significant QA burden.
- Must avoid marketing it as equivalent to Adobe/iLovePDF.

### Option C - Server/Python conversion

Use `pdf2docx`/PyMuPDF server-side.

Pros:

- Better open-source conversion quality than a quick JS engine.
- More mature layout logic.

Cons:

- Breaks current "files never leave your browser" promise.
- Requires backend, queues, file cleanup, security, scaling and cost.
- Not aligned with current LiftPDF architecture.

Not recommended unless LiftPDF adds an optional private/self-hosted backend
tier later.

## Performance estimates

These are engineering estimates before a benchmark prototype.

### Browser open-source engine

| PDF size | Expected behavior | Memory | Time estimate | Risk |
| --- | --- | --- | --- | --- |
| 1 page | Smooth | 30-80 MB transient | < 2s | Low |
| 50 pages | Usable with progress and yielding | 100-300 MB transient | 10-45s | Medium |
| 200 pages | Heavy; must stream/yield and avoid full page render | 300 MB+ possible | 45s-3min | High |

Rules:

- Do not render every page to image unless needed.
- Process page by page.
- Yield to UI between pages.
- Keep only structured text model, not canvases.
- Use Web Worker if conversion becomes CPU-heavy.

### Commercial SDK

Expected to be faster/more accurate but heavier in JS/WASM payload. Needs real
benchmark with:

- 1-page invoice
- 50-page report
- 200-page mixed document
- tables
- images
- multi-column layout

## Browser compatibility

| Browser | PDF.js + docx | Commercial SDK |
| --- | --- | --- |
| Chrome | Expected good | Expected good |
| Edge | Expected good | Expected good |
| Firefox | Expected good | Must verify WASM/worker requirements |
| Safari | Most risk: memory, workers, WASM limits | Must verify with real iOS/macOS Safari |

Safari should be treated as a release gate for PDF to Word because DOCX
generation and large PDF processing can trigger memory pressure.

## OCR plan

OCR is explicitly out of scope for Phase 9A/9B.

Future architecture:

```text
PDF.js image/page render
  -> OCR engine or OCR service
  -> recognized text with bounding boxes
  -> same layout analyzer
  -> DOCX writer
```

Do not mix OCR into PDF to Word until the non-OCR converter is stable. A future
tool could be "OCR PDF" or "Scanned PDF to Word".

## Risks

1. Fidelity risk: browser open-source stack cannot match commercial converters
   without a large layout engine.
2. Product risk: users expect "PDF to Word" to preserve layout. A weak version
   will damage trust if not labelled accurately.
3. Performance risk: 100-200 page files can freeze the UI unless work is chunked
   or moved to a worker.
4. Safari risk: memory limits can break large client-side conversions.
5. Table detection risk: reliable table reconstruction is hard from PDF
   coordinates.
6. Font/style risk: bold/italic/headings are often font-name heuristics, not
   semantic data.
7. Licensing risk: premium SDKs may conflict with a free public product model.

## Difficulty estimate

| Approach | Difficulty | Time estimate | Product quality |
| --- | --- | --- | --- |
| Commercial SDK POC | Medium | 1-3 days | Potentially high |
| Commercial SDK production integration | Medium/High | 1-2 weeks after licensing | High |
| Open-source text-first DOCX MVP | Medium | 3-5 days | Useful but limited |
| Open-source layout-aware converter | Very high | 4-8+ weeks | Medium, still not perfect |
| Server pdf2docx integration | High | 1-2 weeks plus infra | Medium/Good, but not client-only |

## Proposed implementation plan

### Phase 9B - Decision prototype, not public

Build two hidden/local prototypes:

1. Open-source prototype:
   - Install `docx`.
   - Reuse PDF.js text items.
   - Generate a real DOCX with paragraphs and page breaks.
   - Test Word, LibreOffice and Google Docs import.
   - Benchmark 1, 50 and 200 pages.

2. Commercial SDK spike:
   - Request trial for Nutrient and/or Apryse.
   - Test in Next.js App Router with static route and client-only loading.
   - Measure bundle/WASM size.
   - Verify Chrome, Edge, Firefox, Safari.

Gate:

- If commercial SDK passes quality and licensing is acceptable, use it for the
  premium tool.
- If not, ship only an honest "PDF to editable Word" MVP with clear limitations,
  or keep `/pdf-to-word` Coming Soon.

### Phase 9C - Open-source MVP if chosen

1. Create `components/tools/pdf/pdf-structured-text.ts`.
2. Extract text items with coordinates, font size, width and height.
3. Group items into lines and paragraphs.
4. Detect simple headings.
5. Generate DOCX with `docx`.
6. Add warnings for complex layout/scanned PDFs.
7. Add QA fixtures:
   - text-only PDF
   - headings
   - lists
   - table
   - image
   - 50 pages
   - 200 pages
8. Keep `/pdf-to-word` unavailable until QA passes.

### Phase 9D - Production hardening

1. Move heavy conversion to a Web Worker if needed.
2. Add progress and cancellation.
3. Add memory guards.
4. Add compatibility tests on Safari.
5. Add honest SEO copy that avoids "perfect layout" claims.

## Recommendation

For LiftPDF as a professional competitor:

1. Do not launch PDF to Word as a simple PDF.js text export to DOCX.
2. Run a commercial SDK proof-of-concept first if high fidelity is required.
3. In parallel, build a small open-source prototype to understand the lower
   bound of quality.
4. Keep the public tool disabled until the output is validated in Microsoft
   Word, LibreOffice and Google Docs.

Final recommendation for Phase 9B:

- Build an internal open-source prototype with `docx`.
- Do not expose it in the catalog as available.
- Evaluate Nutrient/Apryse for true high-fidelity client-side conversion.
- Decide after comparing real output on a fixed QA corpus.

## Sources checked

- PDF.js official site and GitHub: browser PDF parsing/rendering, Apache-2.0.
- npm `pdfjs-dist`: active package, Apache-2.0.
- npm `docx`: browser-capable JS/TS DOCX generation, MIT.
- npm `mammoth`: DOCX to HTML direction, BSD-2-Clause.
- npm `pdf-lib`: PDF creation/editing, MIT.
- npm `pdf2docx`: Node wrapper around Python package, not a browser solution.
- PyPI/GitHub `pdf2docx`: Python PDF to DOCX library, no longer actively
  maintained by Artifex.
- pdf2docx documentation: PyMuPDF extraction, rule-based layout parsing,
  python-docx generation.
- Apryse PDF to Office pages: commercial SDK for high-fidelity PDF to Office.
- Nutrient Web SDK PDF to Office guide: commercial browser-side PDF to Office.
