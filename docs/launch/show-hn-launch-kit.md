# LiftPDF Show HN Launch Kit

Date: 2026-08-12

## Readiness

Show HN readiness: READY_WITH_BASELINE_CAVEAT  
Publish automatically: NO

Hacker News says Show HN posts should show something users can try, ideally without barriers such as signups or emails. LiftPDF satisfies this product condition.

Reference: https://news.ycombinator.com/showhn.html

## Recommended Title

```text
Show HN: LiftPDF - 17 PDF tools that process files in your browser
```

## Post Body

```text
I built LiftPDF, a browser-based PDF toolkit for common document workflows:

https://liftpdf.com

V1 has 17 tools: merge, split, compress, rotate, watermark, add page numbers, delete/extract/reorder pages, image to PDF, PDF to JPG/PNG, Protect PDF, Unlock PDF and PDF to Text.

The technical goal was to keep the core workflows local in the browser. LiftPDF uses PDF.js for previews/rendering/text extraction, pdf-lib for page operations, QPDF WASM for compression/protect/unlock, JSZip for multi-file outputs, and browser image APIs for image workflows.

Some things I deliberately did not claim:

- no OCR;
- no password cracking or bypass;
- no unlimited file size;
- no guaranteed exact compression target;
- no server-side conversion hidden behind the UI.

Files and passwords stay in the browser for the V1 tools. Analytics is optional and only records aggregate tool events after consent.

I would appreciate feedback on browser PDF reliability, privacy wording, and which workflows feel incomplete.
```

## Comment Response Principles

- Be technical and direct.
- Acknowledge limitations clearly.
- Do not argue about competitors.
- If someone reports a PDF bug, ask for a minimal non-sensitive reproducible sample.
- If a bug involves private documents, ask them not to upload or share sensitive files publicly.

