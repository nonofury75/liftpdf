# LiftPDF V1 Privacy Processing Matrix

Date: 2026-08-12

Scope: the 17 V1 tools.

| Tool | Processing location | File uploaded externally? | Backend involved? | Third-party API? | Passwords exposed? | Filename analytics? | Content analytics? | Temporary object URLs? | WASM? | Privacy claim valid? |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| JPG to PDF | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| PNG to PDF | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| Images to PDF | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| Merge PDF | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| Split PDF | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| Compress PDF | Browser | No | No | No | N/A | No | No | Yes | Yes, QPDF | Yes |
| PDF to JPG | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| PDF to PNG | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| Rotate PDF | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| Add Page Numbers | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| Watermark PDF | Browser | No | No | No | N/A | No | No watermark text analytics | Yes | No | Yes |
| Delete Pages | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| Extract Pages | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| Reorder Pages | Browser | No | No | No | N/A | No | No | Yes | No | Yes |
| Protect PDF | Browser | No | No | No | No | No | No | Yes | Yes, QPDF | Yes |
| Unlock PDF | Browser | No | No | No | No | No | No | Yes | Yes, QPDF | Yes |
| PDF to Text | Browser | No | No | No | N/A | No | No extracted text analytics | Yes | No | Yes |

## Analytics Boundary

Allowed analytics payloads are aggregate product telemetry only:

- tool id / route;
- file count;
- page count or selected page count;
- output format;
- mode/status/error code;
- file size bucket;
- quality/workload class/cancelled boolean where applicable.

Forbidden analytics payloads:

- file names;
- local file paths;
- PDF bytes or image bytes;
- document text;
- extracted text;
- password values;
- watermark text;
- EXIF/GPS data;
- custom output filename.

## Consent Evidence

Production consent audit on 2026-08-12:

- Rejected consent: GA script count `0`.
- Accepted consent: GA script count `1`.
- Consent Mode default is denied before acceptance.

## Network Evidence Summary

Representative production checks were run with analytics rejected. No PDF, image source, password, extracted text or custom filename payload was observed leaving the browser during tested workflows. Normal same-origin static assets and application chunks were expected.
