# LiftPDF Phase 49 - PDF to Image Memory Guard & Large Document Progress

## Summary

Phase 49 upgrades the shared PDF to image engine used by:

- `/pdf-to-jpg`
- `/pdf-to-png`

The goal was not to add formats or change quality settings. The goal was to make large conversions safer and more honest: estimate the workload, warn before heavy jobs, process pages sequentially, clean canvas/PDF.js resources, expose real progress, allow cancellation, and preserve all existing outputs.

## Roadmap Confirmation

Reference: `docs/functional-upgrade-roadmap.md`

Open P1 confirmed:

| Priority | Engine | Tools | Feature | Status |
|---|---|---|---|---|
| P1 | PDF to image | PDF to JPG / PDF to PNG | Memory guard and progress for 100-page files | Implemented in Phase 49 |

Phase 48 also recommended this as the next P1 after Unlock PDF restriction handling.

## Competitive Benchmark

Observed public behavior:

| Competitor | Observable behavior | LiftPDF decision |
|---|---|---|
| Adobe Acrobat Online | PDF to image conversion is server-assisted and supports image output choices such as JPG/PNG/TIFF. Public UX emphasizes upload, conversion, download. | LiftPDF stays browser-local and therefore needs clearer local memory warnings. |
| Smallpdf | Public PDF to JPG flow focuses on page conversion, upload, convert, and download. Heavy processing is handled remotely. | LiftPDF cannot hide local browser limits, so workload preflight is more important. |
| iLovePDF | PDF to JPG exposes page-to-image and image extraction concepts. Server-side processing reduces client memory exposure. | LiftPDF keeps the current page-to-image scope and does not add extract-images in this phase. |
| PDF24 | Public pages explicitly position conversion as server-based and state the local system is not burdened. | LiftPDF has the opposite privacy model, so it now warns when browser memory may be significant. |

Sources reviewed:

- https://www.adobe.com/acrobat/online/pdf-to-jpg.html
- https://smallpdf.com/pdf-to-jpg
- https://www.ilovepdf.com/pdf_to_jpg
- https://tools.pdf24.org/en/pdf-to-images
- https://tools.pdf24.org/en/pdf-to-jpg

## Architecture Before

Pipeline before Phase 49:

```text
Load PDF with PDF.js
-> select pages
-> render each selected page to canvas
-> canvas.toBlob()
-> add Blob to JSZip for multipage output
-> generate final Blob
-> create Object URL
```

Existing strengths:

- The export loop was already sequential.
- Single-page output downloaded directly.
- Multi-page output used JSZip.
- Page range targeting already existed.

Limitations:

- No workload estimate before export.
- No distinction between safe and heavy jobs.
- No warning for 100-page or high-quality workloads.
- No cancellation during long conversions.
- Canvas was not reset after encoding.
- PDF.js page cleanup was not called after each rendered page.
- Progress was generic and less useful on large documents.

## Memory Before

For an A4-like page in the fixtures:

| Quality | Render scale | Approx page pixels | Approx raw canvas memory |
|---|---:|---:|---:|
| Standard | 2x | 1190 x 1684 | about 7.6 MB per rendered page |
| High | 3x | 1785 x 2526 | about 17.2 MB per rendered page |

The previous loop only kept one canvas active at a time, but it did not explicitly release the canvas backing store after encoding. Large ZIPs still necessarily retain encoded image data until the final ZIP is generated.

## Pipeline After

```text
Select pages
-> estimate workload from page dimensions, render scale, page count
-> classify SAFE / HEAVY / VERY_HEAVY
-> warn user when needed
-> load PDF
-> render one page
-> encode image
-> reset canvas to 0 x 0
-> call PDF.js page cleanup
-> add encoded image to ZIP if multipage
-> continue sequentially
-> prepare ZIP
-> generate download
-> revoke Object URLs on reset/unmount
```

## Workload Estimation

Implemented in `components/tools/pdf/pdf-image-export.ts`.

Inputs:

- selected page count
- selected page dimensions
- render scale
- approximate raw canvas bytes: `width x height x 4`
- optional `navigator.deviceMemory` as a local-only signal

Classes:

| Class | Meaning | User behavior |
|---|---|---|
| SAFE | Expected normal workload | Convert immediately |
| HEAVY | Significant memory possible | Show warning and ask user to continue |
| VERY_HEAVY | Very large local workload | Show warning and require explicit continue |

The estimate is intentionally approximate. LiftPDF does not display exact MB values because browser memory use also depends on PDF.js internals, image encoding, ZIP generation, and device/browser behavior.

## Sequential Processing

Confirmed and hardened:

- One page is rendered at a time.
- No `Promise.all` over selected pages.
- Active PDF.js render task can be cancelled through `AbortController`.
- The next page is not started after cancellation.

## Canvas Cleanup

After each encoded page:

- canvas backing store is released with `canvas.width = 0` and `canvas.height = 0`;
- temporary canvas reference is dropped;
- PDF.js page cleanup is called;
- React state does not store rendered canvases.

## PDF.js Cleanup

After export:

- the `PDFDocumentProxy` loaded for export is destroyed;
- cancellation also reaches the active render task;
- upload previews continue to use their own object URLs and are revoked on reset/unmount.

The shared PDF.js worker lifecycle was not changed.

## JSZip

JSZip remains the ZIP engine. No new dependency was added.

Adjustments:

- JPG ZIP entries use `STORE` because JPG is already compressed.
- PNG ZIP entries keep `DEFLATE`.
- Output file names remain unchanged.

Limit retained:

- JSZip still needs encoded image blobs in memory before final ZIP generation. A streaming ZIP library may be evaluated later only if real user data shows this is a bottleneck.

## Memory Guard UX

For heavy jobs LiftPDF now shows:

> This conversion may use significant memory. Selecting fewer pages or Standard quality can improve reliability on this device.

Actions:

- Continue
- Use Standard quality
- Change page selection

Important behavior:

- High quality is never downgraded automatically.
- The user must choose Standard quality explicitly.
- The warning does not expose exact memory, pixels, dimensions, page ranges, or filenames.

## Progress

The progress now reflects selected pages:

```text
Preparing PDF
Rendering page 1 of 100 (1%)
...
Preparing ZIP
Generating download
Success
```

For page range `95-100`, progress is based on 6 selected pages, not the full 100-page PDF.

## Cancel

`Cancel conversion` is now available during processing.

Behavior:

- aborts the active render task when PDF.js supports it;
- stops before the next page;
- does not generate ZIP;
- returns the tool to ready state;
- keeps the uploaded PDF available;
- clears progress.

## Analytics

Only aggregate fields were added:

- `quality`
- `selected_page_count`
- `workload_class`
- `cancelled`

Not sent:

- file name
- page range
- exact page numbers
- dimensions
- pixels
- memory estimate
- PDF content

## Files Modified

- `components/tools/pdf/pdf-image-export.ts`
- `components/tools/pdf-to-image-tool.tsx`
- `lib/analytics.ts`
- `tests/e2e/product-audit.spec.ts`

No new dependency was added.

## Tests

Validation commands:

```text
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Results:

| Check | Result |
|---|---|
| lint | OK |
| typecheck | OK |
| build | OK |
| e2e | OK - 67 passed, 13 skipped |

Additional focused checks:

- Phase 49 isolated Chromium test passed.
- Production local smoke test passed on Chromium.
- Production local smoke test passed on Firefox.

## 100-Page Tests

Added e2e coverage:

- PDF to JPG Standard, 100 pages:
  - warning shown;
  - explicit Continue required;
  - ZIP valid;
  - exactly 100 JPG entries;
  - `page-1.jpg` through `page-100.jpg`;
  - JPG magic bytes verified;
  - dimensions verified for first page.

- PDF to PNG Standard, 100 pages:
  - warning shown;
  - explicit Continue required;
  - ZIP valid;
  - exactly 100 PNG entries;
  - `page-1.png` through `page-100.png`;
  - PNG magic bytes verified;
  - dimensions verified for first page.

- PDF to JPG range `95-100`:
  - ZIP contains exactly 6 images;
  - entries are `page-95.jpg` through `page-100.jpg`;
  - confirms selected range output only.

- PDF to JPG High:
  - warning shown;
  - cancel button visible;
  - cancel returns to ready state.

## Output Preservation

Preserved exactly:

| Case | Filename |
|---|---|
| Single JPG | `page-N.jpg` |
| Multiple JPG | `pdf-to-jpg.zip` |
| Single PNG | `page-N.png` |
| Multiple PNG | `pdf-to-png.zip` |

Quality behavior:

- Standard quality unchanged.
- High quality unchanged.
- No automatic quality downgrade.

## Performance

Build output:

| Route | First Load JS after Phase 49 |
|---|---:|
| `/pdf-to-jpg` | 166 kB |
| `/pdf-to-png` | 166 kB |

Bundle impact:

- No new dependency.
- No meaningful bundle increase.

## Mobile

Mobile route smoke coverage remains active in e2e:

- `/pdf-to-jpg` loads on mobile profile.
- `/pdf-to-png` loads on mobile profile.

The large file warning is designed for mobile reliability: it recommends fewer pages or Standard quality without forcing a hidden downgrade.

## Firefox

Production local Firefox smoke test:

- `/pdf-to-jpg` single-page conversion OK;
- `/pdf-to-png` single-page conversion OK;
- no page errors;
- no critical failed requests.

`navigator.deviceMemory` is optional and absent browsers continue normally.

## Privacy

Privacy model preserved:

- processing remains local in the browser;
- no upload added;
- no backend added;
- memory estimate stays local;
- file contents and names are not sent to analytics.

## Known Limits

- ZIP generation with JSZip is still memory-bound by encoded image blobs and the final ZIP blob.
- Browser memory limits vary by device and cannot be guaranteed.
- 100 pages High quality may still be too heavy on some devices; LiftPDF now warns before the risk instead of pretending it is always safe.
- PDF.js warnings about `standardFontDataUrl` appeared in e2e logs for existing PDF text rendering paths, but output assertions passed and this phase did not modify font handling.

## Production

Local production build:

- `npm run start` on `127.0.0.1:3020`;
- `/pdf-to-jpg` HTTP 200;
- `/pdf-to-png` HTTP 200;
- Chromium smoke OK;
- Firefox smoke OK.

Remote production deployment must be performed after commit/push and Vercel READY.

## Summary Checklist

Selected priority: P1  
Engine: PDF to image  
Tools: PDF to JPG / PDF to PNG  
Feature: Memory guard and large-document progress  
Implemented: YES  
Sequential page processing: YES  
Canvas cleanup verified: YES  
PDF.js cleanup verified: YES  
Object URL cleanup verified: YES  
Workload estimation implemented: YES  
SAFE classification verified: YES  
HEAVY classification verified: YES  
VERY_HEAVY classification verified: YES  
Large workload warning verified: YES  
Automatic quality downgrade: NO  
Cancel implemented: YES  
100-page JPG Standard: YES  
100-page PNG Standard: YES  
Range 95-100 only renders 6 pages: YES  
Progress accurate: YES  
ZIP outputs valid: YES  
Existing quality preserved: YES  
Existing filenames preserved: YES  
Previous workflows preserved: YES  
Privacy model preserved: YES  
New dependency: NO  
Bundle impact: NONE  
Mobile verified: YES  
Firefox verified: YES  
Lint: OK  
Typecheck: OK  
Build: OK  
E2E: OK  
Production deployed: PENDING  
Next remaining P1: Use `docs/functional-upgrade-roadmap.md` after production validation.
