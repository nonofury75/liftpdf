# LiftPDF V1 Known Limitations

Date: 2026-08-12

This document records honest V1 limitations. These are not launch blockers unless they violate the declared tool behavior.

## USER_VISIBLE_LIMITATION

| Area | Limitation | User-facing wording |
|---|---|---|
| PDF to Text | Extracts selectable text only. | Scanned or image-only PDFs need OCR, which is not part of LiftPDF V1. |
| OCR | No OCR engine in V1. | LiftPDF can tell when selectable text is missing, but it does not recognize text from images. |
| Protect PDF permissions | PDF permissions are not DRM. | Permissions are written into the PDF, but compatible readers decide how strictly they enforce them. |
| Unlock PDF | No bypass of unknown passwords. | You must know the valid open password or owner password, or have permission to remove restrictions. |
| Compression | Results depend on document structure. | Already optimized PDFs may shrink very little. Image-heavy PDFs usually benefit more. |
| Compression target size | No exact target-size guarantee. | V1 provides real compression modes, not a guaranteed "make this exactly 2 MB" mode. |
| Large files | Browser resources define practical limits. | Very large or complex files may require fewer selected pages, standard quality, or a stronger device. |
| PDF to Image | Raster output only. | JPG/PNG output is an image rendering of the page, not editable vector content. |
| Watermark below content | Below-content means below page content streams. | Annotations, widgets or some viewer overlays can still appear above the watermark. |
| Signed PDFs | Editing can invalidate signatures. | Adding watermarks, page numbers, rotation or page edits changes the file and may invalidate existing digital signatures. |
| Image to PDF | JPG/PNG dedicated routes have fixed output names. | Editable output filename is available in Images to PDF and Merge PDF, not every converter in V1. |

## TECHNICAL_LIMITATION

| Area | Limitation | Reason |
|---|---|---|
| Browser memory | Client-side processing holds PDF/image buffers in browser memory. | V1 intentionally avoids backend uploads. |
| JSZip | Multi-output ZIPs are generated client-side. | Streaming ZIP generation is not part of V1. |
| PDF.js rendering | Some tests print non-fatal `standardFontDataUrl` warnings. | Rendering succeeds; warning is not a V1 blocker. |
| QPDF WASM | Requires browser WebAssembly support and isolated execution headers. | Protect, Unlock and advanced compression depend on local WASM. |
| PDF forms/annotations | `pdf-lib` preserves many structures but V1 does not claim complete fidelity for every exotic PDF. | PDFs are complex containers; edge cases can exist. |
| Corrupt PDFs | Invalid or unsupported PDFs can be rejected. | Rebuilding corrupt files safely is outside V1. |

## RARE_EDGE_CASE

| Area | Limitation | Handling |
|---|---|---|
| Exotic encryption | Some unsupported encrypted PDFs may fail. | User is told the file could not be processed safely. |
| Huge image pages | High-quality PDF to image may be heavy. | Workload preflight warns before conversion and allows changing selection/quality. |
| Restriction-only PDFs | Some owner-password workflows depend on QPDF compatibility. | V1 verifies output is unencrypted before success. |
| Lazy image optimizer quota | Vercel Image Optimization can return 402 for local SEO assets. | V1 bypasses optimization for `/images/seo/*` assets rendered on tool pages. |

## Public Wording Recommendation

Use:

```text
LiftPDF processes supported files in your browser. Practical limits depend on your device, browser memory and the complexity of the PDF.
```

Avoid:

```text
Unlimited file size.
```
