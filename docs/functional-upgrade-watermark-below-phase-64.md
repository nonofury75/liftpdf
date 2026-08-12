# LiftPDF Phase 64 - Production True Below-Content Watermark

Date: 2026-08-11

## Summary

Selected priority: P2  
Tool: Watermark PDF  
Feature: True below-content watermark layer  
Implemented: YES  
Default above-content preserved: YES  
Below text watermark verified: YES  
Below image watermark verified: YES  
Content stream order verified: YES  
Pixel occlusion verified: YES  
Odd/even/range targeting preserved: YES  
Forms/links preserved: YES  
Privacy model preserved: YES  
New dependency: NO  
Bundle impact: Small TypeScript helper only  

## Roadmap Confirmation

The original roadmap rejected an above/below toggle because the normal `pdf-lib` draw API appends operators and would make a below-content claim misleading.

Phase 63 changed that conclusion with a spike proving that a new watermark content stream can be prepended before the existing page streams:

`/Contents [W A B C]`

Phase 64 implements that production path and updates the roadmap from rejected to completed with limitations.

## Implementation

Files changed:

- `components/tools/watermark-pdf-tool.tsx`
- `lib/pdf/watermark-content-stream.ts`
- `lib/analytics.ts`
- `tests/e2e/product-audit.spec.ts`
- `docs/functional-upgrade-roadmap.md`

The UI now exposes:

- `Above content` (default)
- `Below content`

Above content keeps the existing `pdf-lib` `page.drawText` / `page.drawImage` path.

Below content uses `lib/pdf/watermark-content-stream.ts` to:

- create a dedicated watermark stream;
- register font, image and ExtGState resources;
- prepend the stream before existing page content;
- verify the first `/Contents` reference before saving;
- reload the saved PDF and verify the order again before exposing a download.

If below-content order cannot be verified, no file is offered.

## Scope

Supported:

- text watermark below page content;
- image watermark below page content;
- position;
- opacity;
- rotation;
- tile/repeat;
- all pages;
- odd pages;
- even pages;
- page range via `lib/page-ranges.ts`;
- existing above-content behavior.

## Targeted Benchmark

Sources checked on 2026-08-11:

- Adobe Acrobat help: public documentation describes text/image watermarks embedded into PDF pages and specific-page application, but the consulted documentation did not expose a clear public online below-content option. Source: https://helpx.adobe.com/acrobat/desktop/edit-documents/add-backgrounds-and-watermarks/add-watermarks.html
- iLovePDF: public guide explicitly documents layer options to apply the watermark over PDF content or below PDF content. Source: https://www.ilovepdf.com/blog/how-to-watermark-pages-in-a-pdf-document-online
- iLovePDF tool page: public UI text shows text/image watermark, typography, transparency and position controls. Source: https://www.ilovepdf.com/pdf_add_watermark
- PDF24: public tool page describes adding and configuring watermarks, but the consulted public page did not expose a clear above/below layer option. Source: https://tools.pdf24.org/en/add-watermark
- Smallpdf: consulted public landing/tool information did not expose a verifiable below-content layer option without deeper interactive testing. Source: https://smallpdf.com/

LiftPDF now supports the important layer distinction where it is publicly documented, without copying UI text or relying on a fake visual overlay.

Not changed:

- PDF engines outside Watermark PDF;
- SEO/content;
- output filename;
- watermark presets.

## Limitations

- PDF annotations, form widgets and viewer overlays are separate from normal page content and can still render above a below-content watermark.
- Adding any watermark modifies the document and may invalidate an existing digital signature. The tool now warns when signature markers are detectable.
- Password-protected PDFs still need Unlock PDF first.
- The feature does not rasterize or flatten PDFs.

## Tests

Targeted test run:

`npx playwright test tests/e2e/product-audit.spec.ts -g "watermark PDF supports verified below-content"`

Result:

- Chromium: passed.
- Mobile Chromium project: skipped for the deep structural test by design.

Assertions added:

- default above-content watermark remains above and text-extractable;
- below text watermark is the first stream on targeted pages;
- non-targeted pages do not receive the below stream;
- below image stream is created;
- odd/even/page range targeting work with below layer;
- links remain present after below watermark;
- AcroForm remains present after below watermark;
- pixel occlusion proves below watermark renders behind existing opaque page content.

Validation completed so far:

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- targeted Playwright below-content test: OK
- full `npm run test:e2e`: one unrelated `GET /sitemap.xml` `ECONNRESET` in the JPG guide navigation test; the same test passed on isolated rerun.
- second full `npm run test:e2e` rerun: blocked without useful output and was killed; no Phase 64 failure was observed.
- production-local mobile Chromium `/watermark-pdf` below-content workflow: OK
- production-local Firefox `/watermark-pdf` below-content workflow: OK

## Production Status

Deployment: READY  
Commit: `1596c85`  
Deployment URL: https://liftpdf-n0fykjiwi-rachator75010-5712s-projects.vercel.app  
Production aliases verified by Vercel: https://liftpdf.com, https://www.liftpdf.com  

Production test on `https://liftpdf.com/watermark-pdf`:

- HTTP 200: OK
- Below-content control visible: OK
- Upload fixture PDF: OK
- Generate below-content watermark: OK
- Download link created as blob PDF: OK
- Critical page errors: none observed
- Critical failed requests affecting the workflow: none observed

Observed non-blocking production issue:

- `/_next/image` returned 402 for `/images/seo/watermark-pdf/hero.webp` and `/images/seo/watermark-pdf/thumbnail.webp`.
- The watermark workflow still completed successfully.
- This appears unrelated to the Phase 64 PDF engine change and should be tracked separately if image optimization billing/quota is expected to serve those assets.
