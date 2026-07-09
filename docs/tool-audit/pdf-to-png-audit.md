# PDF to PNG Enterprise Tool Audit

Date: 2026-07-09

Scope: `/pdf-to-png` only.

## Executive Decision

PDF to PNG should match PDF to JPG in perceived quality while staying focused:

- Full PDF page rendering to PNG.
- All pages, single page and page range.
- Direct PNG for one selected page.
- ZIP for multiple selected pages.
- Browser-local processing.
- No fake DPI claims.
- No Extract images mode unless a real embedded-image extraction engine is added later.

The shared PDF-to-image engine was already upgraded during PDF to JPG. This phase adds PNG-specific clarity without changing the export algorithm.

## Competitor Benchmark

Evidence:

- Browser screenshots: `artifacts/pdf-to-png-audit/`
- Automated upload benchmark: `artifacts/pdf-to-png-audit/competitor-benchmark.json`
- Public page source/search audit for Adobe, Smallpdf, iLovePDF and PDF24.

### Adobe Acrobat Online PDF to PNG

Headless Chromium navigation failed with `ERR_HTTP2_PROTOCOL_ERROR`, consistent with previous Adobe tests. Public Adobe content was available for workflow comparison.

Strengths:

- Very strong brand trust.
- Direct PDF to PNG positioning.
- Communicates detail preservation and device compatibility.
- Mentions protected PDFs can be converted after password entry.
- Strong SEO/FAQ coverage.

Weaknesses:

- Server-side upload workflow.
- Less explicit page selection in the public content.
- Broader Acrobat funnel around the tool.

Good ideas:

- Emphasize detail preservation.
- Explain protected PDF behavior clearly.
- Keep the workflow simple.

Rejected:

- Password entry inside PDF to PNG. LiftPDF already has a dedicated Unlock PDF workflow and should keep tool boundaries clear.

### Smallpdf PDF to PNG

Tested with real upload through Smallpdf's image conversion flow. The observed route redirected into the PDF to JPG/image tool flow and produced JPG output in the tested path.

Strengths:

- Very fast upload-to-result workflow.
- Clear success screen and download CTA.
- Strong continuation links.

Weaknesses:

- The observed flow did not expose a dedicated PNG result after upload.
- Cloud processing and account/cookie layers.
- Limited page-selection control in the observed flow.

Good ideas:

- Result state should be simple and immediate.
- Related next tools can be useful after conversion.

Rejected:

- Cloud/account-oriented workflow.

### iLovePDF PDF to PNG

Tested route: `https://www.ilovepdf.com/pdf_to_png`.

Result: route returned Page not found. iLovePDF's primary public PDF image conversion tool is PDF to JPG, with Page to JPG and Extract images modes.

Strengths:

- iLovePDF's PDF to JPG has excellent sidebar clarity.
- Quality selector and mode language are easy to understand.

Weaknesses:

- No dedicated PDF to PNG route was available in the tested public product.

Good ideas:

- Clear “options” sidebar wording.
- Keep conversion mode obvious.

Rejected:

- Copying PDF to JPG-specific Extract images into PNG. LiftPDF does not support embedded-image extraction.

### PDF24 PDF to PNG

Tested with real upload in Chromium.

Strengths:

- Dedicated PDF to PNG route.
- Shows page count and file size.
- Offers DPI control.
- Direct Convert button.
- Free/no limits positioning.

Weaknesses:

- Advertising-heavy.
- Server-side processing.
- DPI can be useful but also more technical and potentially confusing.

Good ideas:

- File summary matters.
- Dedicated PDF to PNG route matters.
- Simple conversion workflow is better than heavy options.

Rejected:

- DPI control. LiftPDF uses Standard/High render quality rather than a print DPI guarantee.

## LiftPDF Audit Before Upgrade

| Category | Score | Notes |
|---|---:|---|
| Upload | 9.6 | Drag and drop, single PDF, clear validation. |
| Preview | 9.6 | Large first-page preview and selected thumbnails via PDF.js. |
| Sidebar | 9.1 | Strong summary, but title was generic before this phase. |
| Page selection | 9.7 | All pages, single page and ranges such as `1,3,5-8`. |
| Quality | 9.1 | Standard/High resolution and PNG quality control; DPI is intentionally not promised. |
| Download | 9.7 | Direct PNG for one page, ZIP for many pages. |
| Messages | 9.4 | Improved shared progress from PDF to JPG phase. |
| Responsive | 9.4 | Mobile upload/preview works; sidebar stacks below preview. |
| SEO/FAQ | 8.8 | Metadata good; FAQ needed more PNG-specific answers. |
| Trust | 9.5 | Browser-local processing visible in the tool. |
| Accessibility | 9.3 | Buttons, labels and state messages are clear. |
| Performance | 9.1 | Browser canvas rendering is efficient but large PDFs remain memory-sensitive. |

## Comparison Table

| Capability | Adobe | Smallpdf | iLovePDF | PDF24 | LiftPDF |
|---|---|---|---|---|---|
| Dedicated PDF to PNG page | Yes | Mixed image flow observed | No public route observed | Yes | Yes |
| Browser-local processing | No | No | No route observed | No | Yes |
| Large preview | Limited in public flow | Result focused | N/A | Basic file card | Yes |
| Page selection | Limited in public content | Limited observed | N/A | Basic conversion | All, single, range |
| PNG direct for one page | Expected | Not confirmed in observed flow | N/A | Expected | Yes |
| ZIP for multiple pages | Expected | Expected | N/A | Expected | Yes |
| DPI | Not primary | Not observed | N/A | Yes | Rejected intentionally |
| Transparent background option | Not prominent | Not observed | N/A | Not observed | Yes, when possible |

## Implemented Improvements

Files changed:

- `components/tools/pdf-to-png-tool.tsx`
- `app/pdf-to-png/page.tsx`

### Sidebar Wording

Changed PNG sidebar title from generic:

`Conversion summary`

to:

`PDF to PNG options`

### FAQ Improvements

Added PNG-specific FAQ coverage:

- Single page conversion.
- Page ranges.
- ZIP behavior.
- Transparent backgrounds.
- Why LiftPDF does not use a DPI selector.
- Password-protected PDFs.

## Rejected Improvements

### TIFF

Status: rejected.

Reason: this is PDF to PNG. TIFF belongs in a separate future converter if implemented with a real output path.

### Extract Images

Status: rejected.

Reason: LiftPDF converts full PDF pages to PNG. It does not extract embedded images from PDF object streams.

### DPI

Status: rejected.

Reason: PDF.js render scale is not the same as a guaranteed print DPI setting. Standard/High render quality is more honest.

### Cloud Integrations

Status: rejected.

Reason: LiftPDF's core advantage is browser-local conversion with no upload.

## Functional Validation Plan

Required cases:

- PDF 1 page -> direct `page-1.png`.
- PDF 10 pages -> `pdf-to-png.zip`.
- PDF 100 pages -> `pdf-to-png.zip`.
- All pages.
- Single page.
- Page range `1`.
- Page range `1-2`.
- Invalid range.
- Invalid PDF.
- Password-protected PDF.
- Desktop Chromium.
- Firefox.
- Mobile Chromium.
- Production local.
- Vercel production.

## Local Production Validation

Tested with `next build` + `next start -p 3001`.

| Case | Result |
|---|---|
| PDF 1 page, all pages | Direct `page-1.png`, valid PNG header |
| PDF 10 pages, single page 2 | Direct `page-2.png`, valid PNG header |
| PDF 10 pages, all pages | `pdf-to-png.zip`, valid ZIP header |
| PDF 100 pages, all pages | `pdf-to-png.zip`, valid ZIP header |
| Page range `1` | Direct `page-1.png`, valid PNG header |
| Page range `1-2` | `pdf-to-png.zip`, valid ZIP header |
| Invalid range `999` | Clean range error |
| Invalid PDF | Clean read error |
| Password-protected PDF | Clean Unlock PDF message |
| Firefox desktop | Upload and preview usable |
| Mobile Chromium | Upload and preview usable |

Local screenshots/results:

- `artifacts/pdf-to-png-audit/liftpdf-local-production-pdf-to-png.png`
- `artifacts/pdf-to-png-audit/liftpdf-local-firefox.png`
- `artifacts/pdf-to-png-audit/liftpdf-local-mobile.png`
- `artifacts/pdf-to-png-audit/liftpdf-local-production-results.json`

## Validation Commands

Completed locally:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`

Result: 45 passed, 5 skipped.

## Known Limits

- PNG output is rasterized; selectable text is not preserved.
- Transparent background depends on source PDF transparency and browser canvas rendering.
- Very large PDFs can be memory-heavy because each selected page is rendered in browser canvas.

## Final Positioning

PDF to PNG is now aligned with PDF to JPG in UX quality while keeping PNG-specific clarity. Its main competitive edge is private browser-side conversion with precise page selection and no server upload.
