# LiftPDF V1 Production Smoke Matrix

Date: 2026-08-12

Production domain: `https://liftpdf.com`

## Route Smoke

Each V1 route was checked for:

- HTTP 200;
- upload input available;
- main CTA/button present;
- no page error;
- no critical failed request;
- no horizontal overflow in mobile viewport.

| Tool | Route | Chromium desktop | Chromium mobile | Firefox desktop | V1 result |
|---|---|---|---|---|---|
| JPG to PDF | `/jpg-to-pdf` | PASS | PASS | PASS | READY |
| PNG to PDF | `/png-to-pdf` | PASS | PASS | PASS | READY |
| Images to PDF | `/images-to-pdf` | PASS | PASS | PASS | READY |
| Merge PDF | `/merge-pdf` | PASS | PASS | PASS | READY |
| Split PDF | `/split-pdf` | PASS | PASS | PASS | READY |
| Compress PDF | `/compress-pdf` | PASS | PASS | PASS | READY |
| PDF to JPG | `/pdf-to-jpg` | PASS | PASS | PASS | READY |
| PDF to PNG | `/pdf-to-png` | PASS | PASS | PASS | READY |
| Rotate PDF | `/rotate-pdf` | PASS | PASS | PASS | READY |
| Add Page Numbers | `/add-page-numbers` | PASS | PASS | PASS | READY |
| Watermark PDF | `/watermark-pdf` | PASS | PASS | PASS | READY |
| Delete Pages | `/delete-pages` | PASS | PASS | PASS | READY |
| Extract Pages | `/extract-pages` | PASS | PASS | PASS | READY |
| Reorder Pages | `/reorder-pages` | PASS | PASS | PASS | READY |
| Protect PDF | `/protect-pdf` | PASS | PASS | PASS | READY |
| Unlock PDF | `/unlock-pdf` | PASS | PASS | PASS | READY |
| PDF to Text | `/pdf-to-text` | PASS | PASS | PASS | READY |

Note: an initial pre-release Chromium smoke exposed 402 console errors for optimized `/images/seo/*` assets on several tool pages. The release fix bypasses Vercel Image Optimization for those local SEO assets. The final production smoke after the release commit is the authoritative result.

## Core Workflow Smoke

| Family | Representative workflow | Result |
|---|---|---|
| Image to PDF | JPG/PNG/Images to PDF covered by full E2E | PASS |
| PDF organize | Merge/Split/Delete/Extract/Reorder covered by full E2E | PASS |
| PDF edit | Rotate/Page Numbers/Watermark covered by full E2E | PASS |
| PDF security | Protect/Unlock covered by QPDF E2E | PASS |
| PDF to image | JPG/PNG output and large-document guard covered by full E2E | PASS |
| PDF to text | Text/range/scanned/protected behavior covered by full E2E | PASS |
| Compression | QPDF modes and metadata removal covered by full E2E | PASS |
