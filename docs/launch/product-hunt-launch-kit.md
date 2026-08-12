# LiftPDF Product Hunt Launch Kit

Date: 2026-08-12

## Readiness

Product readiness: READY  
Metrics baseline readiness: PARTIAL  
Publish automatically: NO

Product Hunt's own launch material emphasizes preparing launch assets and maker context before launch. Phase 68 prepares those assets but does not post automatically.

Reference: https://www.producthunt.com/launch

## Listing

Name:

```text
LiftPDF
```

Tagline:

```text
Private browser-based PDF tools for everyday document work
```

Short description:

```text
LiftPDF is a browser-based PDF toolkit with 17 tools for merging, compressing, converting, protecting, unlocking, watermarking and organizing PDFs without sending files to a conversion server.
```

Website:

```text
https://liftpdf.com
```

Topics/categories:

- Productivity
- Developer Tools
- Privacy
- Design Tools
- SaaS

## First Comment

```text
Hi Product Hunt,

I built LiftPDF because everyday PDF tasks are still weirdly stressful: merging files, shrinking a PDF for email, turning phone photos into a document, protecting a file before sharing it, or extracting a few pages without uploading sensitive documents somewhere.

V1 includes 17 tools:

- image to PDF workflows;
- merge, split, delete, extract and reorder pages;
- compress PDF with real QPDF WASM modes;
- PDF to JPG/PNG and PDF to Text;
- watermark, rotate and page numbering;
- protect/unlock workflows with user and owner password handling.

The product is intentionally browser-first. Files and passwords stay in the browser for V1 tools. Analytics is optional and only records aggregate tool events after consent.

Honest limits: no OCR, no password bypass, no guaranteed exact compression target, and very large PDFs still depend on browser/device memory.

I would love feedback on reliability, workflow clarity, and which PDF tasks feel most important next.
```

## Maker Story

```text
LiftPDF started as a tool collection, but the V1 goal became stricter: make the core PDF workflows reliable enough to be useful, and be honest about what browser-side processing can and cannot promise.

The release uses PDF.js, pdf-lib, QPDF WASM, JSZip and browser image APIs. The work focused on output-level verification: page counts, rotations, ZIP entries, encryption removal, permissions, compression modes and file validity.
```

## Screenshots

Use current production screenshots:

| Asset | File |
|---|---|
| Homepage | `docs/launch/assets/homepage.png` |
| Merge PDF | `docs/launch/assets/merge-pdf.png` |
| Compress PDF | `docs/launch/assets/compress-pdf.png` |
| Watermark PDF | `docs/launch/assets/watermark-pdf.png` |
| Protect PDF | `docs/launch/assets/protect-pdf.png` |
| Images to PDF | `docs/launch/assets/images-to-pdf.png` |

## Demo Assets Needed

- 60-90 second screen recording showing Merge PDF, Compress PDF and Protect PDF.
- Optional animated GIF for one workflow.
- Logo/icon if Product Hunt requires a square thumbnail.

Do not redesign the product just for screenshots.

