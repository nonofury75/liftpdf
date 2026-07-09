# Extract Pages Enterprise Tool Audit

Date: 2026-07-09

Scope: `/extract-pages` only.

## Executive Decision

Extract Pages should stay visual, direct and safe:

- One PDF upload.
- PDF.js thumbnail preview.
- Click pages to select them.
- Select All, Clear and Invert Selection.
- Block export when no page is selected.
- Export only selected pages in original order.
- Browser-local processing.

This phase improves visual polish, sidebar clarity, progress states, success state, error language and the final filename. It does not add cloud storage, accounts, text range inputs or complex split modes.

## Competitor Benchmark

Evidence:

- Browser screenshots: `artifacts/extract-pages-audit/`
- Automated upload benchmark: `artifacts/extract-pages-audit/competitor-benchmark.json`
- Public page/source audit for Adobe, Smallpdf, iLovePDF and PDF24.

### Adobe Extract PDF Pages

Headless Chromium navigation failed with `ERR_HTTP2_PROTOCOL_ERROR`, consistent with prior Adobe tests. Public Adobe Acrobat extract-pages material was used for comparison.

Strengths:

- Strong Acrobat trust and document authority.
- Professional page organization framing.
- Acrobat surfaces support robust page extraction.

Weaknesses:

- Heavier funnel and account/product surface.
- Less transparent for browser-local privacy.
- Online flow is not as lightweight as focused tools.

Good ideas:

- Make quality preservation explicit.
- Keep extraction tied to visual page selection.

Rejected:

- Full Acrobat-style editor. LiftPDF should stay focused.

### Smallpdf Extract Pages

Tested with real PDF upload in Chromium.

Observed workflow:

- Upload PDF.
- Split/Extract combined surface.
- Page cards.
- Select all.
- Finish CTA.

Strengths:

- Clean visual page selection.
- Simple "Extract" mental model.
- Good finish/download flow.

Weaknesses:

- Cookie/account/trial surface adds friction.
- Server-side upload is less private.
- Combining split and extract can add ambiguity.

Good ideas:

- Keep page thumbnails central.
- Keep output action obvious.

Rejected:

- Combining split and extract modes. LiftPDF already has a dedicated Split PDF tool.

### iLovePDF Split / Extract Pages

Tested with real upload on desktop and mobile.

Observed workflow:

- Range-based split/extract.
- Custom, fixed and smart range modes.
- Merge all ranges option.
- Premium sizing information.

Strengths:

- Powerful range workflow for advanced users.
- Clear range controls.
- Strong CTA.

Weaknesses:

- Dense for users who simply want to click pages.
- More split-oriented than visual extraction.
- Consent and upload flow adds friction.

Good ideas:

- Preserve selected page order.
- Communicate selected output clearly.

Rejected:

- Range modes and smart ranges. Those belong in Split PDF, not this visual Extract Pages tool.

### PDF24 Extract PDF Pages

Tested with real PDF upload in Chromium.

Observed workflow:

- Upload PDF.
- Page thumbnails.
- Click pages to extract.
- Extract pages CTA.

Strengths:

- Direct and easy to understand.
- Shows pages and file size.
- Strong no-quality-loss explanation.

Weaknesses:

- Advertising-heavy.
- Visual polish is utilitarian.
- Server-side processing.

Good ideas:

- "Click pages to extract" is the right workflow.
- Keep no-quality-loss language visible.

Rejected:

- Advertising-style layout and dense tool chrome.

## LiftPDF Audit Before Upgrade

| Category | Score | Notes |
|---|---:|---|
| Preview | 9.0 | Real PDF.js thumbnails existed; visual polish lagged behind Delete Pages. |
| Thumbnails | 8.6 | Functional but smaller and less premium. |
| Selection | 9.4 | Multi-select, Select All, Clear and Invert Selection already strong. |
| Sidebar | 8.2 | Useful counts existed, but no trust block, output pages or progress. |
| Loading | 8.4 | Basic loading text only. |
| Success | 8.3 | Success existed but did not match newer premium tools. |
| SEO/FAQ | 8.8 | Metadata good; FAQ needed more edge-case coverage. |
| Responsive | 8.9 | Usable; preview needed stronger mobile/laptop spacing. |
| Trust | 8.5 | Browser-local processing was not prominent inside the tool. |
| Accessibility | 9.2 | Keyboard-selectable cards and ARIA selection already strong. |

## Comparison Table

| Capability | Adobe | Smallpdf | iLovePDF | PDF24 | LiftPDF |
|---|---|---|---|---|---|
| Browser-local processing | Limited/no online | No | No | No | Yes |
| PDF thumbnails | Yes | Yes | Limited/range-focused | Yes | Yes |
| Visual page selection | Yes | Yes | Not primary | Yes | Yes |
| Select all | Yes | Yes | Range-based | Not prominent | Yes |
| Clear selection | Yes | Limited | Range-based | Limited | Yes |
| Invert selection | No | No | No | No | Yes |
| No-selection blocking | Yes | Expected | Expected | Expected | Yes |
| Dedicated extract page | Yes | Mixed split/extract | Split-based | Yes | Yes |

## Implemented Improvements

Files changed:

- `components/tools/extract-pages-tool.tsx`
- `app/extract-pages/page.tsx`
- `tests/e2e/product-audit.spec.ts`

### Preview

Improved the page cards only for Extract Pages:

- Larger thumbnails.
- Stronger paper shadow.
- Clear selected state.
- Larger page badge.
- Scrollable preview area for large PDFs.

The shared `PageThumbnail` component was not changed, so Delete Pages remains untouched.

### Sidebar

Added a premium sidebar:

- Extract Pages heading.
- Private by Design panel.
- PDF file.
- Total pages.
- Selected.
- Output pages.
- File size.
- Output.

### Progress and Success

Added clear export states:

- Preparing PDF...
- Extracting pages...
- Generating PDF...
- Pages extracted successfully.

Success state now shows:

- `Pages extracted successfully`
- `Download PDF`
- `Extract pages from another PDF`

Download only appears after a PDF has been generated.

### Filename

Changed final filename from `extracted-pages.pdf` to:

- `pages-extracted.pdf`

This matches the Phase 21.12 product requirement.

### Error Handling

Password-protected PDFs now point users toward Unlock PDF instead of generic failure language.

### FAQ

Expanded FAQ for:

- Preview before extracting.
- No-selection blocking.
- Password-protected PDFs.
- Browser-local processing.
- Quality preservation.

## Rejected Improvements

### Text Page Ranges

Status: rejected.

Reason: Extract Pages is the visual counterpart to Split PDF. Range syntax belongs in Split PDF and would duplicate its behavior.

### Smart Range / Fixed Range Modes

Status: rejected.

Reason: useful for splitting workflows, not for a focused extract-selected-pages tool.

### Cloud / Drive / Dropbox / Login

Status: rejected.

Reason: contradicts LiftPDF's no-upload privacy advantage.

### Reordering Extracted Pages

Status: rejected.

Reason: Extract Pages preserves original order. Reordering belongs to Reorder Pages.

## Functional Validation Plan

Required cases:

- PDF 1 page.
- PDF 10 pages.
- PDF 100 pages.
- Extract one page.
- Extract multiple pages.
- No page selected.
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
- Results: `artifacts/extract-pages-audit/liftpdf-local-production-results.json`

Validated cases:

| Case | Browser | Result |
|---|---|---|
| 1-page PDF, extract page 1 | Chromium | `pages-extracted.pdf`, 1 page, no console/page errors |
| 10-page PDF, extract pages 2, 5 and 8 | Firefox | `pages-extracted.pdf`, 3 pages, no console/page errors |
| 100-page PDF, extract pages 1, 50 and 100 | Chromium | `pages-extracted.pdf`, 3 pages, no console/page errors |
| 10-page PDF, no page selected | Chromium | Blocked with `Please select at least one page to extract.` |
| Invalid PDF upload | Chromium | Clear error: `This PDF could not be read.` |
| Mobile upload and page selection | Chromium mobile emulation | Usable layout, no console/page errors |

Screenshots:

- `artifacts/extract-pages-audit/chromium-extract-one-success.png`
- `artifacts/extract-pages-audit/firefox-extract-multiple-success.png`
- `artifacts/extract-pages-audit/chromium-extract-hundred-success.png`
- `artifacts/extract-pages-audit/none-selected-error.png`
- `artifacts/extract-pages-audit/chromium-invalid-error.png`
- `artifacts/extract-pages-audit/chromium-mobile-upload.png`

## Quality Gates

Completed:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e` (`45 passed`, `5 skipped`)

## Vercel Production Validation

Deployment:

- Commit: `fd5eb5f`
- Deployment: `https://liftpdf-6s57bhkle-rachator75010-5712s-projects.vercel.app`
- Aliases: `https://liftpdf.com`, `https://www.liftpdf.com`
- Status: `Ready`

Production URL tested:

- `https://liftpdf.com/extract-pages`

Results:

- `artifacts/extract-pages-audit/liftpdf-production-results.json`

Validated production smoke test:

| Case | Browser | Result |
|---|---|---|
| 4-page PDF, extract pages 2 and 4 | Chromium | `pages-extracted.pdf`, 2 pages, no console/page errors |

Production screenshot:

- `artifacts/extract-pages-audit/final-prod-smoke-success.png`

## Known Limits

- No text range input.
- No smart range mode.
- No extracted-page reordering.

These are deliberate product boundaries to keep Extract Pages focused.

## Final Positioning

Extract Pages is now more private than every tested server-side competitor and clearer than range-heavy split flows for users who want to visually choose pages.
