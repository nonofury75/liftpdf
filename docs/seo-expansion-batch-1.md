# SEO Expansion Batch 1

Date: 2026-07-17

This pass expands LiftPDF with a controlled set of editorial pages. The goal is not to flood Google with thin content. Each page targets a distinct search intent connected to an existing LiftPDF tool or a real PDF troubleshooting question.

## Published Pages

| Page | Primary intent | Target tool / hub | Notes |
| --- | --- | --- | --- |
| `/guides/how-to-compress-pdf-without-losing-quality` | Compress PDF safely | Compress PDF | Explains realistic quality limits and safe workflow. |
| `/guides/compress-pdf-for-email` | Make PDF email-ready | Compress PDF | Focuses on email attachment constraints and readability. |
| `/guides/reduce-scanned-pdf-size` | Reduce large scanned PDFs | Compress PDF / PDF to Text | Clarifies scanned PDFs and OCR boundary. |
| `/guides/pdf-compression-vs-optimization` | Compare compression concepts | Compress PDF | Avoids fake compression claims. |
| `/guides/how-to-convert-pdf-to-jpg` | Export PDF pages as JPG | PDF to JPG | Covers page selection and ZIP behavior. |
| `/guides/how-to-convert-pdf-to-png` | Export PDF pages as PNG | PDF to PNG | Explains when PNG is the better output. |
| `/guides/pdf-to-jpg-vs-pdf-to-png` | Compare image export formats | PDF image tools | Helps users choose JPG or PNG. |
| `/guides/why-are-pdf-to-jpg-images-blurry` | Troubleshoot blurry exports | PDF to JPG / PDF to PNG | Explains source quality and format limits. |
| `/guides/how-to-copy-text-from-pdf` | Copy selectable PDF text | PDF to Text | Honest about OCR not being included. |
| `/guides/why-cant-i-copy-text-from-pdf` | Diagnose copy failures | PDF to Text / Unlock PDF | Covers scanned, protected and damaged PDFs. |
| `/guides/how-to-tell-if-pdf-is-scanned` | Detect scanned PDFs | PDF Basics / PDF to Text | Practical tests before extraction. |
| `/guides/protect-pdf-before-sending` | Protect sensitive PDFs | Protect PDF | Covers safe password sharing behavior. |
| `/guides/unlock-pdf-with-known-password` | Unlock with known password | Unlock PDF | Explicitly rejects password bypass. |
| `/guides/password-protected-pdf-not-opening` | Troubleshoot protected PDFs | Unlock PDF / Help | Covers password, damaged file and viewer issues. |

## SEO Images Created

| File | Used by | Role |
| --- | --- | --- |
| `public/images/editorial/compress-pdf-without-quality-loss.svg` | Compression pages | Hero / workflow visual |
| `public/images/editorial/pdf-to-image-workflow.svg` | PDF to JPG / PNG pages | Hero / comparison visual |
| `public/images/editorial/selectable-text-vs-scanned-text.svg` | PDF to Text / scanned PDF pages | Hero / explanation visual |
| `public/images/editorial/pdf-password-workflow.svg` | Protect / Unlock / password pages | Hero / troubleshooting visual |

All images are original SVG files with descriptive filenames and useful alt text. They are intentionally lightweight to preserve performance.

## Internal Linking

The new pages are integrated into:

- `/guides`
- `/learn/pdf-basics`
- `/learn/convert-pdf`
- `/learn/edit-pdf`
- `/learn/pdf-security`
- `/learn/pdf-images`
- `/learn/troubleshooting`
- `/learn/comparisons`
- `sitemap.xml`

Each guide links naturally to the relevant tool, related guides and Learning Center hubs.

## Anti-Spam Decisions

Not added:

- Device doorway pages such as separate weak Windows/Mac/iPhone/Android variants.
- Fake “best” comparison pages without real evidence.
- OCR claims, because LiftPDF does not include OCR.
- Fake compression levels or guarantees.
- Pages targeting unavailable tools such as PDF to Word.

## Expected Search Coverage

This batch strengthens semantic coverage around:

- compress PDF without losing quality
- compress PDF for email
- reduce scanned PDF size
- PDF compression vs optimization
- convert PDF to JPG
- convert PDF to PNG
- PDF to JPG vs PNG
- PDF to JPG blurry
- copy text from PDF
- cannot copy text from PDF
- tell if PDF is scanned
- protect PDF before sending
- unlock PDF with password
- password protected PDF not opening

## Validation Scope

Tests were updated to verify:

- new routes return 200;
- canonical links exist;
- JSON-LD exists;
- hero images have alt text;
- sitemap includes key new pages;
- redirected historical doorway pages remain excluded.

