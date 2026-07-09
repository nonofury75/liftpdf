# PDF to JPG Enterprise Tool Audit

Date: 2026-07-09

Scope: `/pdf-to-jpg` only. Shared `PdfToImageTool` was touched only for generic UX wording that does not change the PDF to PNG export engine.

## Executive Decision

PDF to JPG is already technically strong in LiftPDF:

- PDF.js page rendering.
- Real page previews.
- All pages, single page and page range export.
- Standard/High quality modes without fake DPI claims.
- Direct JPG download for one page.
- ZIP download for multiple pages.
- Client-side processing only.

This phase keeps the existing engine and improves polish, trust and clarity. No new conversion mode was added.

## Competitor Benchmark

Evidence:

- Browser screenshots: `artifacts/pdf-to-jpg-audit/`
- Automated upload benchmark: `artifacts/pdf-to-jpg-audit/competitor-benchmark.json`
- Public page source audit for Adobe, Smallpdf, iLovePDF and PDF24.

### Adobe Acrobat Online

Headless Chromium navigation failed with `ERR_HTTP2_PROTOCOL_ERROR`, consistent with previous Adobe tests in this project. Public page content was available and used for workflow comparison.

Strengths:

- Very high trust and brand authority.
- Simple upload-first workflow.
- Converts PDF pages to JPG, PNG or TIFF.
- Strong SEO content, FAQ and cross-links.
- Clear “full PDF page to JPG conversion” messaging.

Weaknesses:

- Online tool processes files through Adobe servers.
- Account/sign-in pressure after conversion.
- Heavier product marketing around the tool.

Good ideas:

- Keep workflow extremely direct.
- Explain that JPG output is page-image conversion, not selectable text.
- Mention mobile/desktop compatibility.

Rejected:

- PNG/TIFF selector inside PDF to JPG. LiftPDF already has dedicated PDF to PNG and future formats should be separate or carefully designed.

### Smallpdf PDF to JPG

Tested with real upload in Chromium.

Strengths:

- Upload-to-result flow is very fast for a one-page PDF.
- Clean success screen.
- Direct download.
- Good continuation links to other tools.

Weaknesses:

- Less page-level control in the observed flow.
- Cloud processing and cookie/analytics layer.
- Premium/account surface is visible.

Good ideas:

- Success state should be obvious.
- Download should be visible only when output exists.

Rejected:

- Cloud storage/account workflows.

### iLovePDF PDF to JPG

Tested with real upload in Chromium.

Strengths:

- Clear sidebar title: “PDF to JPG options”.
- Mode selector: Page to JPG vs Extract images.
- Quality selector: Normal and High.
- Strong CTA placement.

Weaknesses:

- Extract images is a separate real capability that LiftPDF does not currently implement.
- Heavy cookie/consent layer.
- Remote upload workflow.

Good ideas:

- Use “PDF to JPG options” wording.
- Keep Normal/High quality simple.
- Show Extract images only if it is explicitly disabled or actually implemented.

Rejected:

- Active Extract images mode. LiftPDF does not extract embedded images today, so it remains disabled/Coming Soon.

### PDF24 PDF to JPG

Tested with real upload in Chromium.

Strengths:

- Shows file page count and size.
- Offers DPI and image quality controls.
- Very direct Convert button.
- Strong free/no limits positioning.

Weaknesses:

- Advertising-heavy interface.
- Server-side conversion.
- DPI controls are powerful but can confuse casual users.

Good ideas:

- Page count, size and quality summary are useful.
- Advanced controls should be honest and explicit.

Rejected:

- DPI labels. LiftPDF uses render scale internally, not a user-facing print DPI guarantee. “Standard” and “High” are more honest.

## LiftPDF Audit Before Upgrade

| Category | Score | Notes |
|---|---:|---|
| Upload | 9.6 | Drag and drop, PDF-only validation, single-file workflow. |
| Preview | 9.5 | Large first-page preview and selected page thumbnails already present. |
| Sidebar | 9.2 | Good summary, but title was generic and trust could be clearer. |
| Page selection | 9.7 | All pages, single page and ranges such as `1,3,5-8`. |
| Quality | 9.4 | Normal/High render scale, honest labels. |
| Download | 9.6 | JPG for one page, ZIP for multiple pages. |
| Messages | 9.0 | Good errors, but progress wording could be more premium. |
| Responsive | 9.3 | Works on mobile/tablet/desktop with preview above sidebar. |
| SEO/FAQ | 9.4 | Strong metadata and FAQ already present. |
| Trust | 9.0 | Browser-local processing needed more visible in the tool itself. |
| Accessibility | 9.2 | Buttons/labels present; disabled Extract images is explicit. |
| Performance | 9.1 | PDF.js and JSZip load only in tool flow; 100-page PDFs remain memory-sensitive. |

## Comparison Table

| Capability | Adobe | Smallpdf | iLovePDF | PDF24 | LiftPDF |
|---|---|---|---|---|---|
| Browser-local processing | No for online tool | No | No | No | Yes |
| Large preview | Limited/online app | Result focused | File list/options | Basic file card | Yes |
| Page selection | Limited in public flow | Limited in observed flow | Page to JPG mode | Basic conversion | All, single, range |
| JPG quality | Trusted output | Automatic | Normal/High | DPI/quality | Normal/High |
| Extract embedded images | Pro/available elsewhere | Varies | Yes | Separate related tool | Disabled Coming Soon |
| Multi-page ZIP | Yes/expected | Yes/expected | Yes/expected | Yes/expected | Yes |
| No account required | Limited | Limited/free path | Yes/free path | Yes | Yes |
| No upload required | No | No | No | No | Yes |

## Implemented Improvements

Files changed:

- `components/tools/pdf-to-jpg-tool.tsx`
- `components/tools/pdf-to-image-tool.tsx`

### Sidebar Wording

Changed PDF to JPG sidebar title from generic “Conversion summary” to:

`PDF to JPG options`

This matches user intent and competitor clarity.

### Progress Wording

Improved processing states:

- `Rendering PDF pages...`
- `Preparing PDF...`
- `Generating JPG X of Y`

This makes long PDFs feel less opaque.

### Trust

Added a visible “Private by design” panel after upload:

- PDF pages are rendered in browser.
- Files are not uploaded to a server.

### Success Reset

After generation, reset action now reads:

`Convert another PDF`

This is clearer than a generic “Start over” after success.

## Rejected Improvements

### Active Extract Images Mode

Status: rejected.

Reason: LiftPDF currently converts full PDF pages to JPG. It does not extract embedded images from a PDF. Showing this as active would be a fake feature.

Current decision: keep Extract images disabled with Coming Soon.

### DPI Selector

Status: rejected.

Reason: the engine uses PDF.js render scale, not a user-facing print DPI contract. “Standard” and “High” are accurate and simpler.

### TIFF Export

Status: rejected for this tool.

Reason: this route is PDF to JPG. Additional output formats should not clutter this page unless the product intentionally becomes a combined PDF-to-image converter.

### Cloud Integrations

Status: rejected.

Reason: Drive/Dropbox/account flows do not support LiftPDF's current privacy-first, no-backend positioning.

## Functional Validation Plan

Required cases:

- PDF 1 page -> direct JPG.
- PDF 10 pages -> ZIP.
- PDF 100 pages -> ZIP.
- All pages.
- Single page.
- Page range `1`.
- Page range `1-2`.
- Invalid range.
- Password-protected PDF message.
- Invalid PDF message.
- Desktop Chromium.
- Firefox.
- Mobile Chromium.
- Production local.
- Vercel production.

## Local Production Validation

Tested with `next build` + `next start -p 3001`.

| Case | Result |
|---|---|
| PDF 1 page, High quality | Direct `page-1.jpg`, valid JPG header |
| PDF 10 pages, All pages | `pdf-to-jpg.zip`, valid ZIP header |
| PDF 100 pages, All pages | `pdf-to-jpg.zip`, valid ZIP header |
| Page range `1` | Direct `page-1.jpg`, valid JPG header |
| Page range `1-2` | `pdf-to-jpg.zip`, valid ZIP header |
| Invalid range `999` | Clean range error |
| Invalid PDF | Clean read error |
| Password-protected PDF | Clean Unlock PDF message |
| Firefox desktop | Upload and preview usable |
| Mobile Chromium | Upload and preview usable |

Local screenshots/results:

- `artifacts/pdf-to-jpg-audit/liftpdf-local-production-pdf-to-jpg.png`
- `artifacts/pdf-to-jpg-audit/liftpdf-local-firefox.png`
- `artifacts/pdf-to-jpg-audit/liftpdf-local-mobile.png`
- `artifacts/pdf-to-jpg-audit/liftpdf-local-production-results.json`

## Production Validation

Deployment:

- Commit: `236a22d`
- Vercel deployment: `https://liftpdf-hg05x26vg-rachator75010-5712s-projects.vercel.app`
- Production alias: `https://liftpdf.com`
- Vercel status: Ready

Tested on `https://liftpdf.com/pdf-to-jpg`:

| Browser / viewport | Result |
|---|---|
| Chromium desktop | 1-page PDF -> `page-1.jpg`; 10-page PDF -> `pdf-to-jpg.zip`; range `1` -> `page-1.jpg`; invalid PDF error OK |
| Firefox desktop | 1-page PDF -> `page-1.jpg`; 10-page PDF -> `pdf-to-jpg.zip`; range `1` -> `page-1.jpg`; invalid PDF error OK |
| Mobile Chromium | Upload and preview usable; no page errors |

Production screenshots/results:

- `artifacts/pdf-to-jpg-audit/liftpdf-production-chromium.png`
- `artifacts/pdf-to-jpg-audit/liftpdf-production-firefox.png`
- `artifacts/pdf-to-jpg-audit/liftpdf-production-mobile.png`
- `artifacts/pdf-to-jpg-audit/liftpdf-production-results.json`

## Validation Commands

Completed locally:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`

Result: 45 passed, 5 skipped.

## Known Limits

- JPG output is rasterized; selectable text is not preserved.
- Embedded image extraction is not implemented.
- Very large PDFs can be memory-heavy because each selected page is rendered in browser canvas.

## Final Positioning

PDF to JPG is a strong premium tool because it offers something most competitors do not: private browser-side conversion with page selection and clear output behavior. The tool should remain focused on full-page JPG conversion until a real embedded-image extraction engine exists.
