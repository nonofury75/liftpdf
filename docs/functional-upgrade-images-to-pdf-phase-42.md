# Images to PDF Functional Upgrade

Date: 2026-07-17  
Tool: `/images-to-pdf`  
Phase: 42

## Reason for Selection

Reference documents:

- `docs/functional-depth-audit.md`
- `docs/functional-upgrade-roadmap.md`
- `docs/functional-upgrade-pdf-to-text-phase-41.md`
- `docs/functional-upgrade-watermark-pdf-phase-40.md`
- `docs/functional-upgrade-add-page-numbers.md`

Already completed:

- Compress PDF: real QPDF WASM modes.
- Add Page Numbers: skip first page and page range.
- Watermark PDF: page range.
- PDF to Text: page range.

Selected priority: P1  
Tool: Images to PDF  
Feature: Individual image rotation

This closes a professional workflow gap for mixed image batches: users can now fix one sideways photo or screenshot without rotating the whole PDF after export.

## Targeted Benchmark

The benchmark focused only on image rotation before image-to-PDF conversion.

| Product | Observed/documented capability | Notes |
|---|---|---|
| iLovePDF JPG to PDF | Public JPG to PDF page exposes page orientation, page size and margin. iLoveIMG separately exposes image rotation before export. | Rotation exists in the image tool family, but not clearly in the public JPG-to-PDF copy. |
| Smallpdf JPG to PDF | Public copy mentions adjusting size, orientation and margin. Smallpdf Android help mentions using a rotate option in the preview panel to fix orientation. | Individual rotation is an expected workflow for image conversion. |
| Adobe JPG to PDF | Public docs emphasize uploading and converting. Adobe guidance says to check image orientation and rotate images before converting. | Rotation is recommended, but the public online JPG-to-PDF copy does not clearly expose per-image rotation. |
| PDF24 Images to PDF | Public Images to PDF page documents image-to-PDF conversion and related rotate tools. | Public page does not clearly document individual image rotation in the converter. |
| ILoveIMG Rotate Image | Public rotate-image tool supports rotating uploaded images right or left. | Relevant because it confirms image-level rotation is a standard image workflow. |

Sources:

- iLovePDF JPG to PDF: `https://www.ilovepdf.com/jpg_to_pdf`
- ILoveIMG Rotate Image: `https://www.iloveimg.com/rotate-image/rotate-jpg`
- Smallpdf JPG to PDF: `https://smallpdf.com/jpg-to-pdf`
- Smallpdf Android JPG to PDF guide: `https://smallpdf.com/blog/jpg-to-pdf-converter-for-android`
- Adobe JPG to PDF: `https://www.adobe.com/acrobat/online/jpg-to-pdf.html`
- Adobe UK JPG to PDF guidance: `https://www.adobe.com/uk/acrobat/online/jpg-to-pdf.html`
- PDF24 Images to PDF: `https://tools.pdf24.org/en/images-to-pdf`

No competitor internals were inferred.

## Engine Retained

Current engine:

- `pdf-lib` for PDF creation.
- Browser image decoding for preview dimensions.
- Canvas conversion only for formats that cannot be embedded directly, such as WEBP.

Decision:

- Keep `pdf-lib`.
- Apply manual image rotation with `page.drawImage(..., { rotate })`.
- Recalculate placement using the dimensions after rotation.
- Avoid canvas recompression for normal JPG and PNG rotations.

This preserves quality better than rotating every image through canvas before embedding.

## Data Model

Each uploaded image now carries:

- `id`
- `file`
- `previewUrl`
- `width`
- `height`
- `rotation`

Rotation type:

```ts
type ImageRotation = 0 | 90 | 180 | 270;
```

Rotation remains attached to the image when:

- moving up;
- moving down;
- adding more images;
- deleting another image;
- changing PDF settings;
- generating the final PDF.

Reset removes all uploaded images and therefore resets rotations to `0`.

## UX

Only `/images-to-pdf` enables the new controls.

Each image card now supports:

- Rotate left;
- Rotate right;
- Move up;
- Move down;
- Delete.

Accessibility:

- rotate buttons use file-specific `aria-label`;
- buttons keep visible focus through the shared button system;
- touch targets are at least 44px;
- keyboard activation is available through native button behavior.

JPG to PDF and PNG to PDF do not expose the controls in this phase.

## Preview

The live PDF preview now uses rotated dimensions before calling the same placement logic used for export.

This means:

- Auto page size follows the rotated ratio.
- Auto orientation follows the rotated ratio.
- Fit and Fill use dimensions after rotation.
- Margins remain exact.
- The preview exposes `data-preview-image-rotation` for tests.

## Export

The final PDF applies actual image drawing rotation:

- `0`: unchanged;
- `90`: clockwise;
- `180`: upside down;
- `270`: clockwise, equivalent to left rotation.

The rotation is applied to the image drawing operation, not by rotating the PDF page.

The export still respects:

- image order;
- page size;
- orientation;
- margin;
- Fit / Fill;
- mixed JPG / PNG / WEBP batches.

## Image Quality

Normal JPG and PNG rotation does not require a canvas pass.

WEBP continues to be converted to PNG because `pdf-lib` cannot embed WEBP directly.

For EXIF-oriented JPG files in `/images-to-pdf`, a canvas normalization is used only if the browser-displayed dimensions differ from the raw embedded JPEG dimensions. This avoids preview/export mismatch for EXIF orientation without introducing an EXIF toggle.

## EXIF Behavior

Verified with a temporary JPEG containing EXIF orientation `6`:

- Chromium reports browser display dimensions as `140 x 80`.
- `pdf-lib` reads the raw JPEG dimensions as `80 x 140`.

Result:

- Normal JPG/PNG files are embedded directly.
- In `/images-to-pdf`, EXIF mismatch cases are normalized through canvas to match the browser preview.
- JPG to PDF and PNG to PDF were not changed by this phase.

## Components Shared

Files changed:

- `components/tools/image-to-pdf-tool.tsx`
  - Added per-image rotation state and export drawing transforms.
  - Reused `calculateImagePlacement()` with rotated dimensions.
  - Added EXIF mismatch normalization only when individual rotation is enabled.

- `components/tools/image-preview-list.tsx`
  - Added optional rotate controls.
  - Added rotation badge.
  - Kept move/delete controls.

- `components/tools/image-to-pdf-page.tsx`
  - Added typed `allowIndividualRotation` prop.

- `app/images-to-pdf/page.tsx`
  - Enables individual rotation and updates copy/FAQ.

- `data/premium-tool-content.ts`
  - Updates Images to PDF copy to mention rotation.

- `tests/e2e/fixtures.ts`
  - Adds `rotation-marker.png`.

- `tests/e2e/product-audit.spec.ts`
  - Adds result-level rotation tests and shared-component regression checks.

## Analytics and Privacy

No sensitive image data is sent.

Analytics uses only existing aggregate fields:

- file count;
- file size bucket;
- output format;
- generic mode `images_rotated` or `no_image_rotation`.

It does not send:

- filenames;
- dimensions;
- per-image rotations;
- local paths;
- image content.

## Tests

Added/updated tests verify:

- rotate buttons appear on `/images-to-pdf`;
- rotate buttons do not appear on `/jpg-to-pdf`;
- rotate buttons do not appear on `/png-to-pdf`;
- live preview reports `0`, `90`, `180`, `270`;
- `0` output is landscape for an asymmetric fixture;
- `90` output is portrait;
- `180` output is landscape and has different drawing streams from `0`;
- `270` output is portrait and has different drawing streams from `90`;
- four repeated right rotations return to `0`;
- rotation persists after reorder/delete;
- final reordered PDF has the expected 2 pages;
- page orientation order after reorder/delete is preserved.

## Performance and Memory

Bundle impact:

- no new dependency;
- only small UI and geometry helpers.

Memory:

- normal JPG/PNG rotation uses PDF drawing transforms;
- no additional canvas is used for regular rotation;
- canvas is still used for WEBP conversion;
- canvas is used for EXIF mismatch normalization only in `/images-to-pdf`.

## Validation

Local validation:

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- `npm run test:e2e`: OK, 60 passed, 6 skipped
- Targeted Images to PDF e2e: OK
- Production build local via `npm run start`: OK
- Chromium desktop local production: OK
- Firefox mobile-size local production: OK
- Rotation PDF output check: OK

Production validation:

- Vercel production: Pending

## Remaining Limits

- No editable output filename in this phase.
- No one-PDF-per-image mode in this phase.
- No background color control for transparent PNG in this phase.
- No EXIF toggle in this phase.
- The JPG-only and PNG-only tools intentionally do not expose individual rotation yet.

## Summary

Selected priority: P1  
Tool: Images to PDF  
Feature: Individual image rotation  
Implemented: Yes  
0° verified: Yes  
90° verified: Yes  
180° verified: Yes  
270° verified: Yes  
Rotation persists after reorder: Yes  
Preview matches output: Yes  
Image quality preserved: Yes  
EXIF behavior verified: Yes  
Previous workflow preserved: Yes  
JPG to PDF regression: OK  
PNG to PDF regression: OK  
Privacy model preserved: Yes  
New dependency: No  
Bundle impact: Minimal  
Mobile verified: Yes  
Firefox verified: Yes  
Lint: OK  
Typecheck: OK  
Build: OK  
E2E: OK  
Production deployed: Pending  
Next remaining P1: Protect PDF permission toggles if verified, Unlock PDF restriction-only handling, Merge PDF protected-file diagnostics/editable filename, PDF image conversion memory guard.
