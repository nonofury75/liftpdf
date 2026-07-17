# Compress PDF Professional Upgrade

Date: 2026-07-17  
Tool: `/compress-pdf`  
Scope: First functional-depth implementation after the global audit.

## Previous Limitation

Compress PDF previously relied on a browser-side PDF rebuild path that could create a valid PDF but could not honestly provide professional compression intensity. That was acceptable for a simple V1 tool, but it was weaker than competitors that expose meaningful compression choices.

The core issue was not design. It was engine capability:

- `pdf-lib` is strong for page manipulation and drawing.
- `pdf-lib` is not a dedicated PDF compression optimizer.
- Multiple UI levels would have been misleading unless the output changed measurably.

## Benchmark Summary

Public competitor capabilities checked:

- Adobe Acrobat Online: exposes compression levels such as low, medium and high on public pages; advanced optimization is part of Acrobat Pro.
- Smallpdf: publicly describes Basic and Strong compression.
- iLovePDF: exposes Extreme, Recommended and Less compression levels in the public Compress PDF workflow.
- PDF24: describes adjustable DPI and image quality settings in its compression tool.

The important benchmark conclusion: users expect real compression choices. LiftPDF should not claim exact target sizes unless the engine can prove them.

## Engines Evaluated

| Candidate | Decision | Reason |
|---|---|---|
| `pdf-lib` rebuild | Rejected as primary compressor | Valid PDFs, but not professional compression levels. |
| QPDF WASM | Selected | Already in the project, runs locally, supports object streams, stream recompression, image optimization and metadata removal. |
| Ghostscript WASM | Not selected now | Potentially powerful, but heavier, licensing/performance risk and may flatten/damage PDF structure. |
| MuPDF WASM | Not selected now | Powerful but heavier and licensing/commercial complexity is higher. |
| PDFium WASM | Not selected now | Too heavy/complex for a focused V1 upgrade. |
| Server-side compression | Rejected for default LiftPDF | Breaks the no-upload privacy differentiator unless introduced later as a separate opt-in product. |

## Selected Approach

LiftPDF now compresses with QPDF WASM using three honest modes:

1. Preserve quality
   - Recompresses safe streams.
   - Generates object streams.
   - Avoids intentional image quality loss.

2. Balanced
   - Includes QPDF image optimization.
   - Uses a moderate JPEG quality setting for image-heavy PDFs.
   - Intended for general upload/email use.

3. Strong
   - Uses stronger image optimization.
   - Removes metadata/info entries.
   - Intended for smaller files when image quality tradeoffs are acceptable.

No exact 1 MB, 2 MB or 5 MB target is exposed. That remains intentionally unimplemented because QPDF cannot guarantee exact target sizes across arbitrary files without a heavier iterative or raster-based pipeline.

## Measured Fixture Results

Deterministic fixture: `tests/e2e/.generated/image-heavy.pdf`

| File / mode | Size |
|---|---:|
| Original fixture | 3,240,020 bytes |
| Preserve quality | 3,240,072 bytes |
| Balanced | 3,124,095 bytes |
| Strong | 2,699,499 bytes |

Interpretation:

- Preserve can be roughly equal or slightly larger because the PDF is rewritten deterministically rather than visually degraded.
- Balanced produces a real measurable reduction on image-heavy content.
- Strong produces a larger reduction than Balanced.
- Text-only or already optimized PDFs may shrink little; the UI now explains that honestly.

## Files Modified

- `components/tools/pdf/qpdf-client.ts`
  - Added `compressPdfWithQpdf`.
  - Added QPDF mode arguments.
  - Added captured QPDF error messages.

- `components/tools/compress-pdf-tool.tsx`
  - Replaced rebuild compression with QPDF WASM compression.
  - Added Preserve/Balanced/Strong mode selection.
  - Added mode summary and honest target-size messaging.
  - Kept all processing local in the browser.

- `app/compress-pdf/page.tsx`
  - Updated public SEO and FAQ copy to describe QPDF modes honestly.
  - Removed outdated wording that implied only one safe compression mode.

- `data/premium-tool-content.ts`
  - Updated guide content and tool context for QPDF compression.

- `app/pdf-editor/page.tsx`
  - Updated category copy so it no longer says LiftPDF avoids compression levels.

- `tests/e2e/fixtures.ts`
  - Added professional PDF/image fixtures for current and future result-level testing.

- `tests/e2e/product-audit.spec.ts`
  - Added result-level Playwright coverage for the three QPDF compression modes.

## Tests Added

New test:

`compress PDF exposes real QPDF modes with measurable outputs`

It verifies:

- Preserve quality output downloads.
- Balanced output downloads.
- Strong output downloads.
- Each output is a valid PDF.
- Page count is preserved.
- Mode outputs have distinct file sizes.
- Balanced is no larger than Preserve on the image-heavy fixture.
- Strong is no larger than Balanced on the image-heavy fixture.

## Privacy

The privacy model is preserved:

- Files are processed in the browser.
- No backend upload is introduced.
- QPDF WASM runs client-side.
- No filenames, PDF content or passwords are sent by this change.

## Known Limits

- Exact target size is not implemented.
- DPI controls are not implemented.
- Before/after visual preview is not implemented yet.
- Full automated preservation tests for links, forms and annotations are still a recommended follow-up.
- Strong compression can reduce image quality on image-heavy PDFs; the UI now states that clearly.

## Validation Status

Targeted validation completed:

- Playwright targeted Compress PDF test: OK

Full validation completed before deployment:

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- `npm run test:e2e`: OK, 60 passed, 6 skipped mobile-heavy workflow tests
- Local production smoke test: `http://127.0.0.1:3000/compress-pdf` returned HTTP 200

## Release Gate Summary

Global audit complete: YES  
Compress PDF engine adequate: PARTIAL  
Real compression levels added: YES  
Target size added: NOT_FEASIBLE  
Output quality verified: PARTIAL  
Forms and links preserved: NOT_APPLICABLE_FOR_CURRENT_TEST  
Privacy model preserved: YES  
Lint: OK  
Typecheck: OK  
Build: OK  
E2E: OK  
Production deployed: PENDING
