# LiftPDF Phase 50 - Images to PDF Editable Output Filename

## Scope

Tool: `/images-to-pdf`

Selected P1: editable output filename.

This phase deliberately does not change `/jpg-to-pdf`, `/png-to-pdf`, image rotation, EXIF behavior, page sizing, margins, Fit/Fill, or any PDF engine.

## Current P1 State

Already completed before Phase 50:

- Compress PDF: real Preserve / Balanced / Strong modes.
- Compress PDF: remove document metadata.
- Add Page Numbers: skip first page and page range.
- Watermark PDF: page range.
- PDF to Text: page range.
- Images to PDF: individual image rotation.
- Split PDF: split every N pages.
- Rotate PDF: all / selected / odd / even / range targeting.
- Extract Pages: selected pages as one PDF and separate PDFs in ZIP.
- Protect PDF: AES-256, user password, owner password, permissions.
- Unlock PDF: open-password, owner-password and restriction-only PDFs.
- PDF to JPG / PDF to PNG: memory guard, sequential processing, progress and cancel.

Remaining meaningful P1 candidates after filtering:

| Tool | Feature | Status | Reason not selected |
|---|---|---|---|
| Compress PDF | Before/after visual comparison | Open | Useful, but mostly preview UX and higher CPU risk. |
| Compress PDF | Link/form/annotation preservation tests | Open | Test-only hardening, not a user-facing functional upgrade. |
| JPG/PNG/Images to PDF | EXIF orientation handling | Partially done for Images to PDF | Dedicated JPG/PNG EXIF handling needs separate proof and may need more fixture work. |
| Merge PDF | Editable output filename | Open | Good next candidate, but Images to PDF batch naming is more immediately visible after Phase 42. |
| Merge PDF | Per-file protected PDF error | Open | Error UX improvement, but less direct output-level difference. |

## Selection Gate

Selected priority: P1  
Selected tool: Images to PDF  
Selected feature: Editable output filename  
Roadmap status: Still open for the image-to-PDF family; implemented only for `/images-to-pdf` in this phase.  
Current limitation: The tool always downloaded `images.pdf`.  
Why this is the highest-value remaining P1: Batch image workflows often produce named scan packets, reports, submissions and document bundles. A generic filename forces a manual rename after every conversion.  
Competitor expectation: Online image-to-PDF tools center the flow on convert and download. Even where public pages do not clearly expose pre-export filename editing, professional document workflows expect control of the final file name.  
Current engine: `pdf-lib` and existing browser image decoding.  
Required engine: Existing engine only.  
New dependency required: No.  
Privacy impact: No file name is sent to analytics.  
Expected bundle impact: None.  
Implementation complexity: Low-medium.  
Main risks: invalid filesystem characters, accidental change to JPG/PNG dedicated tools, and stale download names after changing settings.  
Acceptance criteria: custom name changes the downloaded filename, PDF remains valid, empty name falls back to `images.pdf`, `.pdf` is appended when omitted, invalid path characters are rejected, and JPG/PNG dedicated tools keep their existing names.  
Output verification strategy: Playwright checks the `download` attribute and parses the generated PDF with `pdf-lib`.

## Targeted Benchmark

| Product | Evidence level | Observed behavior |
|---|---|---|
| Adobe JPG to PDF | PUBLIC_DOCS_ONLY | Public flow emphasizes upload, convert and download. No public evidence of pre-export custom filename in the online page copy. |
| Smallpdf JPG to PDF | PUBLIC_DOCS_ONLY | Public flow lists upload, adjust settings, convert, download/share. Filename editing is not clearly documented on the public page. |
| iLovePDF JPG to PDF | PUBLIC_UI_OBSERVED | Public page exposes orientation, page size, margin and merge-all-images option. Filename editing was not clearly exposed in public copy. |
| PDF24 Images/JPG to PDF | PUBLIC_DOCS_ONLY | Public pages emphasize saving the result after conversion. PDF24 desktop/help material references output filename patterns, but online custom naming was not clearly documented. |

Sources:

- https://www.adobe.com/acrobat/online/jpg-to-pdf.html
- https://smallpdf.com/jpg-to-pdf
- https://www.ilovepdf.com/jpg_to_pdf
- https://tools.pdf24.org/en/images-to-pdf
- https://tools.pdf24.org/en/jpg-to-pdf

No competitor internals were inferred.

## Implementation

Files changed:

- `app/images-to-pdf/page.tsx`
- `components/tools/image-to-pdf-page.tsx`
- `components/tools/image-to-pdf-tool.tsx`
- `tests/e2e/product-audit.spec.ts`

Behavior:

- `/images-to-pdf` now shows `Output file name`.
- Default value remains `images`.
- Download defaults to `images.pdf`.
- If the user enters `client scan packet`, the download becomes `client scan packet.pdf`.
- If the user enters a name already ending in `.pdf`, it is preserved.
- Empty input falls back to `images.pdf`.
- Invalid filename/path characters are rejected with a clear error:
  - `<`
  - `>`
  - `:`
  - `"`
  - `/`
  - `\`
  - `|`
  - `?`
  - `*`
  - control characters

The feature is activated through `enableOutputFileName` and is enabled only for `/images-to-pdf`.

## Rejected Options

| Option | Decision | Reason |
|---|---|---|
| Enable for JPG to PDF and PNG to PDF in the same phase | Rejected for Phase 50 | The phase requires one tool. Dedicated pages can be handled later if still prioritized. |
| Send filename to analytics | Rejected | The filename may contain personal or document context. |
| Auto-derive output name from uploaded file names | Rejected | Could leak sensitive names into UI assumptions and creates complex multi-file behavior. |
| Allow folder-like paths | Rejected | Browsers cannot write arbitrary paths via download attribute and path characters are unsafe. |

## Proof of Result

New e2e test:

`Images to PDF supports a custom output filename without changing JPG or PNG tools`

Assertions:

- uploads two images to `/images-to-pdf`;
- sets `Output file name` to `client scan packet`;
- verifies generated link download name is `client scan packet.pdf`;
- parses the PDF with `pdf-lib`;
- verifies page count is `2`;
- verifies invalid name `bad/name` shows a validation error;
- verifies `/jpg-to-pdf` has no output filename field and still downloads `jpg-to-pdf.pdf`;
- verifies `/png-to-pdf` has no output filename field and still downloads `png-to-pdf.pdf`.

## Fixtures

Existing deterministic image fixtures were reused:

- `wide-2x1.png`
- `square.png`
- `sample.jpg`
- `sample.png`

No new fixture was required.

## Edge Cases

Covered:

- custom filename without `.pdf`;
- invalid filename with `/`;
- unchanged JPG to PDF default filename;
- unchanged PNG to PDF default filename;
- valid PDF parsing after custom filename.

Behavior defined:

- empty filename falls back to `images.pdf`;
- `.pdf` extension is appended when omitted;
- dangerous path characters are blocked.

## Analytics

No filename is sent to GA4.

Existing aggregate events remain:

- file count;
- file size bucket;
- output format;
- conversion status.

## Privacy

Privacy model preserved:

- images stay in the browser;
- filename state stays local;
- no backend added;
- no new dependency added.

## Performance and Bundle

Build output remained stable:

| Route | First Load JS |
|---|---:|
| `/images-to-pdf` | 305 kB |

No dependency was added.

## Validation

Commands:

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
| e2e | OK - 68 passed, 14 skipped |

Production-local checks:

- `npm run start` on `127.0.0.1:3020`;
- Chromium `/images-to-pdf` custom filename workflow OK;
- Firefox `/images-to-pdf` custom filename workflow OK;
- generated PDF parsed successfully.

## Production

Pending until commit, push and Vercel READY.

## Remaining Limits

- `/jpg-to-pdf` and `/png-to-pdf` still use fixed output names by design in this phase.
- Filename is not auto-derived from source images.
- This does not add one-PDF-per-image ZIP export.

## Summary

Selected priority: P1  
Tool: Images to PDF  
Feature: Editable output filename  
Implemented: YES  
Real output difference verified: YES  
Output valid: YES  
Acceptance criteria passed: YES  
Previous workflow preserved: YES  
Shared tools regression: JPG to PDF and PNG to PDF preserved  
Privacy model preserved: YES  
New dependency: NO  
Bundle impact: NONE  
100-page test: NOT_APPLICABLE  
Mobile verified: YES via route e2e smoke  
Firefox verified: YES local production smoke  
Lint: OK  
Typecheck: OK  
Build: OK  
E2E: OK  
Production deployed: PENDING  
Remaining P1 count: 5 meaningful candidates after this phase  
Next remaining P1: Merge PDF editable output filename or Merge PDF per-file protected error, depending on whether the next phase prioritizes output polish or error precision.
