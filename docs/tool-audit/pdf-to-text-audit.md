# PDF to Text Enterprise Audit

Date: 2026-07-10

Scope: `/pdf-to-text`

Goal: make PDF to Text a premium, simple and honest extraction tool. The tool extracts selectable text that already exists in the PDF. It does not perform OCR and must never imply OCR support.

## Competitor Benchmark

Benchmark method:

- Browser automation with Playwright.
- Real upload using `artifacts/pdf-to-text-audit/benchmark-text.pdf`.
- Desktop viewport: 1440 x 1000.
- Mobile screenshots captured with Pixel 5 emulation.
- Artifact: `artifacts/pdf-to-text-audit/competitor-benchmark.json`.

Important benchmark note:

- Adobe, Smallpdf and iLovePDF do not consistently expose a pure "PDF to TXT" tool equivalent to LiftPDF.
- Their closest flows are OCR, PDF to Word, or Acrobat export guidance.
- PDF24 has the closest direct equivalent: `PDF to Text`.

### Adobe PDF to Text / Export Guidance

URL: `https://www.adobe.com/acrobat/resources/document-files/pdf-to-txt.html`

Status: page could not be opened in headless Chromium due to `net::ERR_HTTP2_PROTOCOL_ERROR`.

Observed positioning from official Adobe result:

- Adobe explains converting PDF to TXT via Acrobat export.
- Strong authority and documentation value.
- Not a simple browser-local TXT extractor workflow.

Useful ideas:

- Explain limitations and expected output clearly.
- Avoid pretending layout will be preserved in plain text.

Rejected ideas:

- Acrobat app workflow and account/product dependency.
- Promising rich document structure in a TXT output.

### Adobe OCR PDF

URL: `https://www.adobe.com/acrobat/online/ocr-pdf.html`

Status: page could not be opened in headless Chromium due to `net::ERR_HTTP2_PROTOCOL_ERROR`.

Useful ideas:

- Strong OCR positioning for scanned PDFs.
- Clear distinction between searchable/selectable text and image-only scans.

Rejected ideas:

- OCR. It is out of scope for LiftPDF PDF to Text until a real OCR engine is implemented.

### Smallpdf PDF OCR

URL: `https://smallpdf.com/pdf-ocr`

Result: opened and real PDF upload succeeded.

Strengths:

- Strong OCR education.
- Clear scanned-PDF intent.
- Fast upload and result workflow.

Weaknesses:

- Not the same product category as LiftPDF PDF to Text.
- Cloud processing and tracking/consent surface weaken privacy perception.
- The workflow is more heavyweight than extracting already-selectable text.

Useful ideas:

- Be explicit about scanned PDFs needing OCR.
- Show success and download clearly.

Rejected ideas:

- OCR claims.
- Cloud workflow.

### Smallpdf PDF to Word

URL: `https://smallpdf.com/pdf-to-word`

Result: opened and real PDF upload succeeded.

Strengths:

- Clear upload workflow.
- Explains editable output and conversion intent.
- Useful distinction between basic conversion and OCR.

Weaknesses:

- Produces DOCX, not TXT.
- Heavier workflow than a plain text extraction task.
- More conversion promise than LiftPDF should make for TXT.

Useful ideas:

- Distinguish selectable text from scanned text.

Rejected ideas:

- Word/DOCX generation.
- Formatting-preservation claims.

### iLovePDF OCR PDF

URL: `https://www.ilovepdf.com/ocr-pdf`

Result: opened and real PDF upload succeeded.

Strengths:

- Clear OCR language.
- Language selection is useful for OCR.

Weaknesses:

- Not a PDF to TXT extractor.
- Cookie/advertising consent surface distracts from the workflow.
- OCR language options would be fake for LiftPDF's current tool.

Useful ideas:

- Make the OCR boundary clear.

Rejected ideas:

- Language selection or OCR controls without OCR.

### iLovePDF PDF to Word

URL: `https://www.ilovepdf.com/pdf_to_word`

Result: opened and real PDF upload succeeded.

Strengths:

- Explicit "No OCR" vs "OCR Premium" distinction.
- Clean file card and conversion CTA.

Weaknesses:

- DOCX output, not TXT.
- OCR option is premium and not relevant to LiftPDF PDF to Text.

Useful ideas:

- Honest no-OCR positioning.

Rejected ideas:

- PDF to Word scope.
- Premium OCR upsell.

### PDF24 PDF to Text

URL: `https://tools.pdf24.org/en/pdf-to-txt`

Result: opened and real PDF upload succeeded.

Strengths:

- Closest direct equivalent.
- Simple upload-to-convert workflow.
- Shows file name, page count and size.
- Explains TXT conversion plainly.

Weaknesses:

- Server-side processing.
- Ad-heavy layout.
- No rich text preview before download in the benchmarked flow.

Useful ideas:

- Keep the workflow direct.
- Show file and output summary.

Rejected ideas:

- Ads and server-processing positioning.

## LiftPDF Audit

### Scores Before Upgrade

| Category | Score | Notes |
|---|---:|---|
| Hero | 9.1 | Clear and honest about selectable text. |
| Upload | 9.1 | Shared PDF upload zone is consistent. |
| Text preview | 8.1 | Functional, but not premium enough. |
| Page counter | 8.5 | Present but could be more visible. |
| Word counter | 8.4 | Present. |
| Character counter | 8.4 | Present. |
| Copy Text | 8.7 | Useful and already implemented. |
| Download TXT | 8.2 | Functional but visible before generation. |
| Sidebar | 7.8 | Functional, but less polished than locked tools. |
| Loading | 7.6 | Progress existed but could be more explicit. |
| Success | 7.8 | Too subtle. |
| FAQ | 9.1 | Correctly says scanned PDFs require OCR. |
| Trust | 9.0 | Browser-local positioning is strong. |
| Responsive | 8.8 | Good baseline. |
| Accessibility | 9.0 | Labels and aria-describedby present. |
| Performance | 9.2 | PDF.js loads client-side for the tool. |

### Key Gaps

- Download button appeared before TXT existed.
- Success state was not visually strong enough.
- Sidebar did not show words, pages processed and output together.
- Preview felt like a basic textarea rather than a document extraction result.
- No dedicated privacy block in the active tool UI.
- Progress could be clearer: preparing, extracting page X of Y, generating TXT.

## Product Decisions

### Implemented

| Decision | Reason | Impact |
|---|---|---|
| Larger premium text preview | The extracted text is the product output and should be central. | UX improvement. |
| Visible counters above preview | Users need quick confirmation of output size and processed pages. | UX and confidence improvement. |
| Sidebar with File, Pages, Status, Pages processed, Words, Characters, Output | Makes the workflow scan-friendly. | UX improvement. |
| Hide Download TXT until generated | Prevents confusing dead-end actions. | CRO and clarity improvement. |
| Progress: Preparing PDF, Extracting text page X of Y, Generating TXT | More transparent for long PDFs. | UX improvement. |
| Success: Text extracted successfully | Clear completion signal. | UX improvement. |
| Private by design block | Reinforces local browser processing. | Trust improvement. |
| Shorter no-text error | Uses the exact honest product boundary: no selectable text means OCR is required. | Error clarity improvement. |

### Rejected

| Decision | Reason |
|---|---|
| OCR | Not implemented. Adding it as text would be deceptive. |
| Translation | Separate AI/content feature. |
| Summarization | Separate AI/content feature. |
| Advanced table extraction | Would require a different parser and quality expectations. |
| PDF to Word | Separate conversion tool. |
| Cloud imports | Contradicts browser-local positioning. |
| Login | Unnecessary friction. |
| Drive / Dropbox | Adds scope and data-sharing concerns. |

## Functional Validation Plan

Required cases:

- Text PDF 1 page.
- Text PDF 10 pages.
- Text PDF 100 pages.
- Image-only PDF.
- Invalid PDF.
- Password-protected PDF.
- Special characters and accents.
- Line breaks and page separators.
- Copy clipboard.
- Download TXT.
- Desktop Chromium.
- Firefox.
- Mobile Chromium.
- Local production build.
- Vercel production.

## Local Production Validation

Environment:

- `npm run build`
- `npm run start -- -p 3001`
- Browser automation with Playwright.
- Results: `artifacts/pdf-to-text-audit/liftpdf-local-production-results.json`

Validated cases:

| Case | Browser | Result |
|---|---|---|
| 1-page text PDF | Chromium | `extracted-text.txt`, page separator present, text extracted |
| 10-page text PDF | Firefox | `extracted-text.txt`, page 10 text extracted |
| 100-page text PDF | Chromium | `extracted-text.txt`, page 100 text extracted |
| 1-page text PDF on mobile | Chromium mobile emulation | TXT generated, mobile layout usable |
| Copy Text | Chromium / Firefox | Copy action exercised; UI returned copy success or browser fallback message |
| Image-only PDF | Chromium mobile emulation | Clear no-selectable-text / OCR-required message |
| Password-protected PDF | Chromium mobile emulation | Clear unlock-first message |
| Invalid PDF | Chromium mobile emulation | Clear read error |

Screenshots:

- `artifacts/pdf-to-text-audit/chromium-one-page-success.png`
- `artifacts/pdf-to-text-audit/firefox-ten-pages-success.png`
- `artifacts/pdf-to-text-audit/chromium-hundred-pages-success.png`
- `artifacts/pdf-to-text-audit/chromium-mobile-one-page-success.png`
- `artifacts/pdf-to-text-audit/chromium-mobile-error-states.png`

## Known Limits

- No OCR.
- No table-structure reconstruction.
- No layout-preserving export.
- Plain TXT output cannot preserve complex visual PDF formatting.

These are intentional limits. A high-quality PDF to Text tool should be honest rather than imply OCR or Word-like layout fidelity.

## Final Positioning

PDF to Text is strongest as a fast, private, browser-local extractor for selectable PDF text. It should be the cleanest path to copy or download existing PDF text, while clearly directing scanned/image-only documents toward a future OCR workflow.
