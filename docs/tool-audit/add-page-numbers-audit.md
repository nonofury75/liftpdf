# Add Page Numbers Enterprise Tool Audit

Date: 2026-07-09

Scope: `/add-page-numbers` only.

## Executive Decision

Add Page Numbers should stay simple, precise and fast:

- One PDF upload.
- Live preview of every page.
- Six common positions.
- Four useful formats.
- Three readable standard fonts.
- Simple Small / Medium / Large sizing.
- Simple color palette.
- Start number.
- Browser-local export.

This phase improves the perceived quality, sidebar, preview, progress, success and error states. It does not add page ranges, facing-page logic, Roman numerals, sections or complex print-production controls.

## Competitor Benchmark

Evidence:

- Browser screenshots: `artifacts/add-page-numbers-audit/`
- Automated upload benchmark: `artifacts/add-page-numbers-audit/competitor-benchmark.json`
- Public page/source audit for Adobe, Smallpdf, iLovePDF and PDF24.

### Adobe Acrobat Add PDF Page Numbers

Headless Chromium navigation failed with `ERR_HTTP2_PROTOCOL_ERROR`, consistent with prior Adobe tests. Public Adobe documentation and search-result content were available and used for comparison.

Strengths:

- Strong trust and professional positioning.
- Supports page range and position.
- More advanced customization is available behind "More" in Acrobat web/desktop flows.
- Clear framing around document structure and navigation.

Weaknesses:

- Heavier product funnel.
- Some advanced capabilities depend on Acrobat surfaces rather than the lightweight online flow.
- Less privacy-friendly than LiftPDF's browser-local model.

Good ideas:

- Keep position and range decisions visible.
- Explain that page numbers improve navigation and referencing.

Rejected:

- Page ranges for V1. Useful, but adds range parsing, preview selection and edge cases. Current LiftPDF applies numbering consistently to all pages.

### Smallpdf Add Page Numbers

Tested with real PDF upload in Chromium.

Observed controls:

- Position.
- Margins: Narrow, Default, Wide.
- Start numbering at.
- Number pages CTA.

Strengths:

- Very focused workflow.
- Good single-purpose sidebar.
- Start number is easy to understand.
- Clean download flow.

Weaknesses:

- Cookie/account/trial surface creates friction.
- Less visibly private because files are uploaded.
- Customization is intentionally limited.

Good ideas:

- Keep the tool narrow.
- Make start number and position prominent.

Rejected:

- Margin presets. LiftPDF's fixed safe offset is enough for V1 and avoids another setting that most users do not need.

### iLovePDF Page Numbers

Tested with real PDF upload on desktop and mobile.

Observed controls:

- Page mode: single page / facing pages.
- Position.
- Margin: Small / Recommended / Big.
- First number.
- Page range.
- Format presets: page number, `Page {n}`, `Page {n} of {p}`, custom text.
- Font selector.

Strengths:

- Very complete sidebar.
- Excellent format choices.
- Page range and facing pages support advanced documents.
- CTA remains clear despite many options.

Weaknesses:

- Dense settings panel for casual users.
- Consent and upload flow adds friction.
- Advanced options can distract from the most common task.

Good ideas:

- Keep four common number formats.
- Start number and font are useful.
- Immediate preview matters.

Rejected:

- Facing-page logic, page ranges and custom text. They are useful for complex layouts, but not necessary for LiftPDF V1.

### PDF24 Add Page Numbers

Tested with real PDF upload in Chromium.

Observed controls:

- Pattern.
- Font: Sans / Serif / Mono.
- Font size.
- Color and alpha.
- Nine positions.
- Angle.
- Space.
- First page.
- First number.
- Last page.
- CNT value.

Strengths:

- Broad customization.
- Multi-file summary shows pages and size.
- Practical for technical users.
- Free and clear CTA.

Weaknesses:

- Advertising-heavy.
- Server-side processing.
- Many controls are too technical for a simple page-numbering workflow.
- Visual polish is functional rather than premium.

Good ideas:

- Use simple font families.
- Display file summary and page count clearly.

Rejected:

- Angle, space, CNT value and first/last page. Too technical for the target UX and not worth the maintenance cost now.

## LiftPDF Audit Before Upgrade

| Category | Score | Notes |
|---|---:|---|
| Hero | 9.2 | Clear tool shell and metadata. |
| Upload | 9.5 | Drag/drop and PDF validation already strong. |
| Preview | 8.8 | Live preview existed but was visually small. |
| Sidebar | 8.2 | Summary existed but lacked trust, progress and useful option summary. |
| Formats | 9.0 | Included core formats and one less-essential dash format. |
| Position | 9.4 | Six practical positions. |
| Color | 8.5 | Color picker worked, but a simple palette is faster. |
| Font | 9.2 | Helvetica, Times and Courier are enough. |
| Size | 8.5 | Slider was flexible but less decision-friendly than simple presets. |
| Responsive | 8.8 | Usable, but card and sidebar polish lagged behind newer tools. |
| FAQ/SEO | 8.7 | Metadata good; FAQ was thin. |
| Trust | 8.6 | Browser-local processing needed to be visible inside the tool. |
| Performance | 9.0 | Preview URLs are cleaned; 100-page previews remain memory-sensitive but usable. |
| Accessibility | 8.9 | Labels present; button pressed states and live status needed strengthening. |

## Comparison Table

| Capability | Adobe | Smallpdf | iLovePDF | PDF24 | LiftPDF |
|---|---|---|---|---|---|
| Browser-local processing | Limited/no online | No | No | No | Yes |
| Position presets | Yes | Yes | Yes | Yes | Yes |
| Start number | Yes | Yes | Yes | Yes | Yes |
| Format presets | Yes | Limited | Yes | Pattern | Yes |
| Font choice | Yes | Limited | Yes | Yes | Yes |
| Color | Yes | Limited | Limited | Yes | Yes |
| Page ranges | Yes | Limited | Yes | Yes | Rejected |
| Facing pages | Acrobat/iLovePDF style | No | Yes | No | Rejected |
| Technical spacing/angle | Desktop-like | Margins | Margins | Yes | Rejected |

## Implemented Improvements

Files changed:

- `components/tools/add-page-numbers-tool.tsx`
- `app/add-page-numbers/page.tsx`

### Preview

Improved live preview cards:

- Larger page thumbnails.
- Better paper shadow and neutral preview background.
- Scrollable preview grid for large PDFs.
- Immediate visual updates for format, position, font, size, color and start number.

### Sidebar

Added a premium sidebar:

- Add Page Numbers heading.
- Private by Design panel.
- PDF file.
- Pages.
- Position.
- Format.
- Font.
- Size.
- Start number.
- Output.

### Options

Kept only high-value options:

- Formats: `1`, `Page 1`, `1 / 10`, `Page 1 of 10`.
- Positions: top/bottom left, center and right.
- Fonts: Helvetica, Times, Courier.
- Sizes: Small, Medium, Large.
- Colors: Black, Gray, Red, Blue.
- Start number.

### Progress and Success

Added clear generation states:

- Preparing PDF...
- Adding page numbers...
- Generating numbered PDF...
- Numbered PDF created successfully.

Success state now shows:

- `Numbered PDF created successfully`
- `Download PDF`
- `Number another PDF`

Download only appears after a PDF has actually been generated.

### Error Handling

Password-protected PDFs now point users toward Unlock PDF instead of generic failure language.

### FAQ

Expanded FAQ for:

- Position choices.
- Style customization.
- Start number.
- Live preview.
- Quality preservation.
- Password-protected PDFs.
- Browser-local processing.

## Rejected Improvements

### Page Ranges

Status: rejected for now.

Reason: useful for complex documents, but it adds range parsing and selection states. The current V1 should number the entire document predictably.

### Facing Pages

Status: rejected.

Reason: only valuable for book-like layouts. It increases mental load for ordinary invoices, reports and scanned documents.

### Roman Numerals

Status: rejected.

Reason: niche academic/book formatting. It would add complexity without improving the main online workflow.

### Chapters / Sections

Status: rejected.

Reason: document-structure features belong in a professional editor, not this focused browser tool.

### Angle and Spacing Controls

Status: rejected.

Reason: too technical for page numbering. LiftPDF should stay cleaner than PDF24 here.

### Cloud / Drive / Dropbox / Login

Status: rejected.

Reason: contradicts LiftPDF's no-upload privacy advantage.

## Functional Validation Plan

Required cases:

- PDF 1 page.
- PDF 10 pages.
- PDF 100 pages.
- All six positions.
- All four formats.
- Start number.
- Size presets.
- Color presets.
- Invalid PDF.
- Password-protected PDF.
- Desktop Chromium.
- Firefox.
- Mobile Chromium.
- Production local.
- Vercel production.

## Local Production Validation

Environment:

- `npm run build`
- `npm run start -- -p 3001`
- Browser automation with Playwright.
- Results: `artifacts/add-page-numbers-audit/liftpdf-local-production-results.json`

Validated cases:

| Case | Browser | Result |
|---|---|---|
| 1-page PDF + Top Left + Small + Red | Chromium | `numbered.pdf`, 1 page, no console/page errors |
| 1-page PDF + Bottom Right + Page 1 format | Firefox | `numbered.pdf`, 1 page, no console/page errors |
| 10-page PDF + Page 1 of 10 + Large + Blue + start number 5 | Chromium | `numbered.pdf`, 10 pages, no console/page errors |
| 100-page PDF + 1 / 10 + Top Center + Courier | Chromium | `numbered.pdf`, 100 pages, no console/page errors |
| Invalid PDF upload | Chromium | Clear error: `This PDF could not be read.` |
| Mobile upload and format interaction | Chromium mobile emulation | Usable layout, no console/page errors |

Screenshots:

- `artifacts/add-page-numbers-audit/chromium-one-page-success.png`
- `artifacts/add-page-numbers-audit/firefox-one-page-success.png`
- `artifacts/add-page-numbers-audit/chromium-ten-pages-success.png`
- `artifacts/add-page-numbers-audit/chromium-hundred-pages-success.png`
- `artifacts/add-page-numbers-audit/chromium-invalid-error.png`
- `artifacts/add-page-numbers-audit/chromium-mobile-upload.png`

## Quality Gates

Completed:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e` (`45 passed`, `5 skipped`)

## Known Limits

- Page numbers apply to all pages.
- No page ranges.
- No facing-pages mode.
- No custom text pattern beyond the four presets.
- No Roman numerals.

These are deliberate product decisions for a focused V1.

## Final Positioning

Add Page Numbers is now simpler than PDF24, less dense than iLovePDF, and more private than all tested server-side competitors. Its strongest differentiator is browser-local processing with a clean live preview and a low-friction export flow.
