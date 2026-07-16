# LiftPDF Semantic SEO Gap Analysis

Date: 2026-07-14  
Scope: semantic coverage audit only. No code or product changes.

## Executive Summary

LiftPDF already covers a strong V1 tool set: image to PDF, PDF to image, organize PDF, edit PDF, security PDF and PDF to text. The technical and trust positioning is clearer than many generic converters because the product repeatedly explains browser-side processing and avoids false claims.

The largest semantic gaps are not inside the existing tool pages themselves. The gaps are around the supporting search universe:

1. Platform workflows: Windows, Mac, iPhone, Android, Chromebook, Safari, Chrome and Edge.
2. Problem-led searches: blurry output, file too large, password-protected PDFs, blank pages, failed extraction, scanned PDFs and page range mistakes.
3. Format comparisons: JPG vs PDF, PNG vs PDF, JPG vs PNG, PDF to JPG vs PDF to PNG, extract vs split vs delete vs reorder.
4. Office conversion intent: PDF to Word, Word to PDF, Excel to PDF, PPT to PDF, PDF to Excel, PDF to PowerPoint. These are currently shown as coming soon, so they should not be targeted with transactional tool claims until real tools exist.
5. Security and trust intent: no-upload PDF tools, browser PDF tools, local PDF processing, private PDF converter, encrypted PDF locally.
6. Use-case pages: students, invoices, contracts, reports, scanned documents, photos, receipts, administrative portals and legal packets.

The best near-term semantic ROI is to strengthen pages that already exist and already have topical authority: `/extract-pages`, `/delete-pages`, `/reorder-pages`, `/jpg-to-pdf`, `/pdf-to-jpg`, `/merge-pdf`, `/protect-pdf`, `/unlock-pdf`, `/pdf-to-text` and the trust pages.

## Methodology

This audit used:

- Local LiftPDF inventory: `app/`, `data/tools.ts`, `data/premium-tool-content.ts`, `data/extract-pages-cluster.ts`, existing docs and tool audit files.
- Public competitor pages and snippets from Adobe Acrobat Online, Smallpdf, iLovePDF and PDF24.
- Estimated search volume ranges. These are directional, not paid keyword-tool exports:
  - Very High: 100k+ monthly global searches.
  - High: 10k-100k.
  - Medium: 1k-10k.
  - Low: 100-1k.
  - Very Low: <100 or niche.

Sources reviewed include:

- iLovePDF tool architecture and organize/rotate pages: https://www.ilovepdf.com/rotate_pdf and https://www.ilovepdf.com/organize-pdf
- iLovePDF guide examples: https://www.ilovepdf.com/blog/how-to-delete-pages-from-a-pdf-file-online-free and https://www.ilovepdf.com/blog/organize-pdf-pages
- Smallpdf tool hub: https://smallpdf.com/pdf-tools
- Smallpdf Merge, Split and Unlock pages: https://smallpdf.com/merge-pdf, https://smallpdf.com/split-pdf, https://smallpdf.com/unlock-pdf
- Adobe PDF to JPG, PDF to PNG, PNG to PDF, Merge PDF and Split PDF pages: https://www.adobe.com/acrobat/online/pdf-to-jpg.html, https://www.adobe.com/acrobat/online/pdf-to-png.html, https://www.adobe.com/acrobat/online/png-to-pdf.html, https://www.adobe.com/acrobat/online/merge-pdf.html, https://www.adobe.com/acrobat/online/split-pdf.html
- PDF24 all tools and organize pages: https://tools.pdf24.org/en/, https://tools.pdf24.org/en/all-tools, https://tools.pdf24.org/en/remove-pdf-pages, https://tools.pdf24.org/en/rearrange-pdf-pages

## Competitive Semantic Patterns

### Adobe

Adobe wins on authority, format breadth and trust language. Its pages often include:

- device and browser compatibility terms;
- quality preservation claims;
- file security language;
- direct how-to steps;
- adjacent tool links;
- strong PDF brand authority.

LiftPDF opportunity: compete on privacy and no-upload intent, not on Adobe brand trust. Add exact browser-side explanations where users are anxious about private files.

### Smallpdf

Smallpdf wins on breadth and category taxonomy. Its hub exposes 30+ tools including Office conversion, OCR, AI, signing, annotation, form filling, redaction and scanner workflows.

LiftPDF opportunity: avoid claiming missing tools. Use coming-soon terms in catalog only, and target available tools with stronger long-tail content.

### iLovePDF

iLovePDF wins on simple tool naming and internal linking. Its navigation clusters tools into Organize, Optimize, Convert to PDF, Convert from PDF, Edit and Security. It also publishes blog guides for practical tasks like deleting pages and organizing PDFs.

LiftPDF opportunity: mimic the architecture principle, not the content. Build guide clusters around existing tools and link them tightly to tool pages.

### PDF24

PDF24 wins on tool breadth, free/no-install/no-registration wording and platform compatibility. It covers many exact tool names that users search for: remove pages, extract pages, rearrange pages, web optimize PDF, overlay PDF, compare PDFs.

LiftPDF opportunity: target exact long-tail "free, no upload, browser" modifiers and practical page-operation terms.

## Current Semantic Coverage by Page

| Page | Primary keyword | Current coverage | Main missing semantic fields | Score |
| --- | --- | --- | --- | ---: |
| `/` | free online PDF tools | Strong product overview | more explicit "private PDF tools", "browser PDF suite", platform phrases | 82 |
| `/pdf-tools` | all PDF tools | Strong catalog | tool count/breadth comparison, office/OCR distinction, "no upload PDF tools" | 86 |
| `/pdf-converter` | PDF converter | Medium | Office conversion, PDF to Word/Excel/PPT caveat, TXT, HTML, EPUB, OCR intent | 63 |
| `/pdf-editor` | PDF editor online | Medium | edit/annotate/fill/sign/crop/redact distinction; honest unavailable-tool coverage | 61 |
| `/organize-pdf` | organize PDF | Strong | organize vs reorder/delete/extract/split decision framework, scanned packet use cases | 84 |
| `/pdf-image-tools` | PDF image tools | Strong | image format glossary, TIFF/BMP/GIF/HEIC/WebP intent, screenshot workflows | 78 |
| `/pdf-security` | PDF security tools | Good trust | "remove restrictions", "permissions", "certificate", "password recovery" caveats | 76 |
| `/privacy` | private PDF tools | Strong | competitor comparison, "files never leave browser" queries, GDPR/security caveats | 88 |
| `/security` | secure browser PDF tools | Strong | WebAssembly safety, QPDF, COOP/COEP, password handling, limitations glossary | 86 |
| `/why-liftpdf` | why LiftPDF | Good brand support | privacy proof, comparison matrix, browser vs cloud processing FAQ | 80 |
| `/about` | about LiftPDF | Basic trust | founder/company transparency, roadmap, contact/trust signals | 68 |
| `/contact` | contact LiftPDF | Functional | support intent by tool, bug report, privacy/security report language | 72 |
| `/terms` | LiftPDF terms | Functional | clearer usage limits for sensitive documents and client-side processing | 72 |
| `/jpg-to-pdf` | JPG to PDF | Strong | Windows/Mac/iPhone/Android, blurry output, file too large, JPG vs JPEG, print settings | 88 |
| `/png-to-pdf` | PNG to PDF | Strong | transparency, screenshots, logos, PNG vs PDF, white background explanation | 84 |
| `/images-to-pdf` | Images to PDF | Strong | mixed formats, receipts, mobile photos, HEIC/BMP/GIF caveats | 82 |
| `/pdf-to-jpg` | PDF to JPG | Strong | extract embedded images vs page rendering, JPG quality, social/share use cases | 84 |
| `/pdf-to-png` | PDF to PNG | Good | lossless PNG, transparency limitations, PDF screenshot, high-resolution queries | 78 |
| `/merge-pdf` | Merge PDF | Strong | merge JPG/PDF caveat, order pages, combine scanned files, email/portfolio use cases | 83 |
| `/split-pdf` | Split PDF | Good | split by range, split every page, split large PDF, split vs extract decision | 80 |
| `/compress-pdf` | Compress PDF | Honest but semantically narrow | reduce size for email, image-heavy PDFs, why compression may not shrink | 74 |
| `/rotate-pdf` | Rotate PDF | Strong | rotate scanned PDF, rotate one page, rotate permanently, 90/180/270 language | 82 |
| `/add-page-numbers` | Add page numbers to PDF | Good | footer/header terms, Bates numbering caveat, start number, Page X of Y | 78 |
| `/watermark-pdf` | Watermark PDF | Strong | confidential/draft/stamp/logo terms, diagonal/repeat, image watermark use cases | 83 |
| `/delete-pages` | Delete PDF pages | Strong | remove one page, blank pages, duplicate pages, scanned PDFs, delete vs extract | 89 |
| `/extract-pages` | Extract PDF pages | Very strong | platform variants, Google Docs/Preview/Acrobat comparison, one-page snippets | 92 |
| `/reorder-pages` | Reorder PDF pages | Strong | rearrange/sort/move pages, organize PDF, drag and drop, mobile workflow | 88 |
| `/protect-pdf` | Protect PDF | Strong | encrypt vs password protect, open password vs permissions, AES/QPDF explanation | 84 |
| `/unlock-pdf` | Unlock PDF | Strong | remove known password, cannot recover password, permissions vs encryption | 84 |
| `/pdf-to-text` | PDF to Text | Good | scanned PDF/OCR distinction, copy text, TXT export, preserve layout limitations | 81 |
| `/guides/how-to-extract-pages-from-pdf` | how to extract pages from PDF | Strong | platform-specific links, Acrobat/Preview/Chrome comparison | 89 |
| `/guides/extract-one-page-from-pdf` | extract one page from PDF | Strong | "save one page", "page 1 only", mobile steps | 87 |
| `/guides/extract-multiple-pages-from-pdf` | extract multiple pages from PDF | Strong | non-consecutive pages, page ranges, examples | 86 |
| `/guides/extract-pdf-pages-without-adobe` | extract pages without Adobe | Strong | Acrobat alternative, free without account, browser/no upload | 88 |
| `/guides/extract-pages-from-password-protected-pdf` | extract pages from password protected PDF | Strong | unlock first, permissions, wrong password failure | 87 |
| `/guides/extract-pages-from-scanned-pdf` | extract pages from scanned PDF | Strong | OCR, image-only pages, blank pages | 86 |
| `/guides/extract-pages-vs-split-pdf` | extract pages vs split PDF | Strong | add delete/reorder comparison table, examples by output | 86 |

## Keyword Coverage Matrix

| Keyword | Estimated volume | Intent | Best target | Present? | Priority |
| --- | --- | --- | --- | --- | --- |
| jpg to pdf | Very High | Tool | `/jpg-to-pdf` | Yes | CRITICAL |
| jpeg to pdf | Very High | Tool | `/jpg-to-pdf` | Partial | CRITICAL |
| convert jpg to pdf | Very High | Tool | `/jpg-to-pdf` | Yes | CRITICAL |
| multiple jpg to pdf | High | Tool/guide | `/jpg-to-pdf` + guide | Partial | CRITICAL |
| png to pdf | High | Tool | `/png-to-pdf` | Yes | CRITICAL |
| images to pdf | High | Tool | `/images-to-pdf` | Yes | CRITICAL |
| photo to pdf | High | Use case | `/images-to-pdf` + guide | Partial | IMPORTANT |
| screenshots to pdf | Medium | Use case | `/png-to-pdf` + guide | Partial | IMPORTANT |
| pdf to jpg | Very High | Tool | `/pdf-to-jpg` | Yes | CRITICAL |
| pdf to png | High | Tool | `/pdf-to-png` | Yes | CRITICAL |
| pdf to image | High | Category | `/pdf-image-tools` | Partial | IMPORTANT |
| extract images from pdf | High | Tool/future | future or caveat | No | IMPORTANT |
| merge pdf | Very High | Tool | `/merge-pdf` | Yes | CRITICAL |
| combine pdf | High | Tool | `/merge-pdf` | Yes | CRITICAL |
| split pdf | Very High | Tool | `/split-pdf` | Yes | CRITICAL |
| separate pdf pages | Medium | Tool/guide | `/split-pdf` | Partial | IMPORTANT |
| compress pdf | Very High | Tool | `/compress-pdf` | Yes | CRITICAL |
| reduce pdf size | Very High | Tool/guide | `/compress-pdf` | Partial | CRITICAL |
| rotate pdf | High | Tool | `/rotate-pdf` | Yes | CRITICAL |
| rotate one page in pdf | Medium | Long-tail | `/rotate-pdf` | Partial | IMPORTANT |
| add page numbers to pdf | High | Tool | `/add-page-numbers` | Yes | CRITICAL |
| watermark pdf | High | Tool | `/watermark-pdf` | Yes | CRITICAL |
| delete pages from pdf | High | Tool | `/delete-pages` | Yes | CRITICAL |
| remove pages from pdf | High | Tool | `/delete-pages` | Yes | CRITICAL |
| extract pages from pdf | High | Tool/guide | `/extract-pages` | Yes | CRITICAL |
| extract one page from pdf | Medium | Guide | guide + `/extract-pages` | Yes | CRITICAL |
| reorder pdf pages | Medium | Tool | `/reorder-pages` | Yes | CRITICAL |
| rearrange pdf pages | Medium | Tool | `/reorder-pages` | Partial | IMPORTANT |
| organize pdf | High | Category/tool | `/organize-pdf` | Yes | CRITICAL |
| protect pdf | High | Tool | `/protect-pdf` | Yes | CRITICAL |
| password protect pdf | High | Tool | `/protect-pdf` | Partial | CRITICAL |
| unlock pdf | High | Tool | `/unlock-pdf` | Yes | CRITICAL |
| remove pdf password | High | Tool | `/unlock-pdf` | Partial | CRITICAL |
| pdf to text | High | Tool | `/pdf-to-text` | Yes | CRITICAL |
| extract text from pdf | High | Tool/guide | `/pdf-to-text` | Partial | IMPORTANT |
| scanned pdf to text | High | OCR/future | future OCR/caveat | No | IMPORTANT |
| pdf to word | Very High | Future tool | coming soon only | No real tool | CRITICAL later |
| word to pdf | Very High | Future tool | coming soon only | No real tool | CRITICAL later |
| pdf to excel | Very High | Future tool | coming soon only | No real tool | CRITICAL later |
| pdf to powerpoint | High | Future tool | coming soon only | No real tool | CRITICAL later |
| sign pdf | High | Future tool | coming soon only | No real tool | IMPORTANT later |
| redact pdf | High | Missing tool | none | No | OPTIONAL now |
| crop pdf | Medium | Future tool | coming soon only | No real tool | IMPORTANT later |
| fill pdf form | High | Future tool | coming soon only | No real tool | IMPORTANT later |
| private pdf tools | Medium | Trust | `/privacy` + homepage | Partial | CRITICAL |
| no upload pdf converter | Medium | Trust/tool | trust + tools | Partial | CRITICAL |
| browser pdf tools | Medium | Trust/category | `/pdf-tools` | Partial | IMPORTANT |

## TOP 200 Semantic Opportunities

Priority definitions:

- CRITICAL: should be covered by current pages or next guide cluster because it supports existing tools and likely search demand.
- IMPORTANT: useful if Search Console shows impressions or the parent page needs topical depth.
- OPTIONAL: useful later, lower volume, or should wait until the matching tool exists.

| # | Keyword / topic | Volume | Intent | Target page | Status | Priority |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | convert jpg to pdf without uploading | Medium | Privacy transactional | `/jpg-to-pdf` + guide | Partial | CRITICAL |
| 2 | multiple jpg to one pdf | High | Transactional | `/jpg-to-pdf` | Partial | CRITICAL |
| 3 | jpeg to pdf converter | Very High | Transactional | `/jpg-to-pdf` | Partial | CRITICAL |
| 4 | jpg to pdf on iphone | High | Platform tutorial | `/jpg-to-pdf` + guide | Missing | CRITICAL |
| 5 | jpg to pdf on android | High | Platform tutorial | `/jpg-to-pdf` + guide | Missing | CRITICAL |
| 6 | jpg to pdf on windows | Medium | Platform tutorial | `/jpg-to-pdf` + guide | Missing | IMPORTANT |
| 7 | jpg to pdf on mac | Medium | Platform tutorial | `/jpg-to-pdf` + guide | Missing | IMPORTANT |
| 8 | jpg to pdf no margin | Low | Settings support | `/jpg-to-pdf` | Partial | IMPORTANT |
| 9 | jpg to pdf A4 size | Medium | Settings support | `/jpg-to-pdf` | Partial | IMPORTANT |
| 10 | jpg to pdf landscape | Low | Settings support | `/jpg-to-pdf` | Partial | IMPORTANT |
| 11 | jpg to pdf portrait | Low | Settings support | `/jpg-to-pdf` | Partial | IMPORTANT |
| 12 | jpg to pdf fit image | Low | Settings support | `/jpg-to-pdf` | Partial | IMPORTANT |
| 13 | jpg to pdf fill page | Low | Settings support | `/jpg-to-pdf` | Partial | IMPORTANT |
| 14 | why is my jpg blurry after pdf conversion | Low | Problem | `/jpg-to-pdf` + guide | Missing | IMPORTANT |
| 15 | why is my jpg to pdf file too large | Low | Problem | `/jpg-to-pdf` + `/compress-pdf` | Missing | IMPORTANT |
| 16 | create pdf from photos | High | Use case | `/images-to-pdf` | Partial | CRITICAL |
| 17 | photos to pdf | High | Use case | `/images-to-pdf` | Partial | CRITICAL |
| 18 | receipts to pdf | Medium | Use case | `/images-to-pdf` | Missing | IMPORTANT |
| 19 | scanned photos to pdf | Medium | Use case | `/images-to-pdf` | Missing | IMPORTANT |
| 20 | jpeg vs jpg for pdf | Medium | Comparison | `/jpg-to-pdf` + guide | Missing | OPTIONAL |
| 21 | jpg vs pdf | Medium | Comparison | guide | Missing | IMPORTANT |
| 22 | jpg vs png for documents | Medium | Comparison | `/jpg-to-pdf` + `/png-to-pdf` | Missing | IMPORTANT |
| 23 | convert png to pdf without upload | Low-Medium | Privacy transactional | `/png-to-pdf` + guide | Partial | CRITICAL |
| 24 | multiple png to pdf | Medium | Transactional | `/png-to-pdf` | Partial | IMPORTANT |
| 25 | transparent png to pdf | Medium | Problem/support | `/png-to-pdf` | Partial | CRITICAL |
| 26 | png to pdf white background | Low | Problem/support | `/png-to-pdf` | Partial | IMPORTANT |
| 27 | screenshot to pdf | High | Use case | `/png-to-pdf` + guide | Partial | CRITICAL |
| 28 | screenshots to one pdf | Medium | Use case | `/images-to-pdf` | Partial | IMPORTANT |
| 29 | png to pdf on iphone | Medium | Platform tutorial | `/png-to-pdf` + guide | Missing | IMPORTANT |
| 30 | png to pdf on android | Medium | Platform tutorial | `/png-to-pdf` + guide | Missing | IMPORTANT |
| 31 | png to pdf on windows | Low-Medium | Platform tutorial | `/png-to-pdf` | Missing | OPTIONAL |
| 32 | png to pdf on mac | Low-Medium | Platform tutorial | `/png-to-pdf` | Missing | OPTIONAL |
| 33 | png vs pdf | Medium | Comparison | guide | Missing | IMPORTANT |
| 34 | png vs jpg vs pdf | Medium | Comparison | guide | Missing | IMPORTANT |
| 35 | combine png images into pdf | Medium | Transactional | `/png-to-pdf` | Partial | IMPORTANT |
| 36 | image to pdf converter | Very High | Transactional | `/images-to-pdf` | Yes | CRITICAL |
| 37 | convert images to pdf without uploading | Medium | Privacy transactional | `/images-to-pdf` | Partial | CRITICAL |
| 38 | combine images into pdf | High | Transactional | `/images-to-pdf` | Yes | CRITICAL |
| 39 | multiple images to pdf | High | Transactional | `/images-to-pdf` | Yes | CRITICAL |
| 40 | webp to pdf | Medium | Transactional | `/images-to-pdf` | Partial | IMPORTANT |
| 41 | bmp to pdf | Medium | Future/support | guide/caveat | Missing | OPTIONAL |
| 42 | gif to pdf | Medium | Future/support | guide/caveat | Missing | OPTIONAL |
| 43 | heic to pdf | High | Future/support | future tool/caveat | Missing | IMPORTANT later |
| 44 | tiff to pdf | Medium | Future/support | future tool/caveat | Missing | IMPORTANT later |
| 45 | images to pdf on mobile | Medium | Platform | `/images-to-pdf` | Partial | IMPORTANT |
| 46 | photos to pdf on iphone | High | Platform use case | `/images-to-pdf` | Missing | CRITICAL |
| 47 | photos to pdf on android | High | Platform use case | `/images-to-pdf` | Missing | CRITICAL |
| 48 | how to make a pdf from pictures | High | How-to | `/images-to-pdf` + guide | Partial | CRITICAL |
| 49 | convert photo to pdf for email | Medium | Use case | `/images-to-pdf` | Missing | IMPORTANT |
| 50 | image PDF too large | Low | Problem | `/images-to-pdf` + `/compress-pdf` | Missing | IMPORTANT |
| 51 | pdf to jpg without uploading | Medium | Privacy transactional | `/pdf-to-jpg` + guide | Partial | CRITICAL |
| 52 | convert pdf pages to jpg | High | Transactional | `/pdf-to-jpg` | Yes | CRITICAL |
| 53 | pdf to jpeg | High | Transactional | `/pdf-to-jpg` | Partial | CRITICAL |
| 54 | pdf page to jpg | Medium | Transactional | `/pdf-to-jpg` | Yes | CRITICAL |
| 55 | single page pdf to jpg | Medium | Settings | `/pdf-to-jpg` | Partial | IMPORTANT |
| 56 | pdf to jpg page range | Low-Medium | Settings | `/pdf-to-jpg` | Partial | IMPORTANT |
| 57 | pdf to jpg high quality | High | Quality | `/pdf-to-jpg` | Yes | CRITICAL |
| 58 | pdf to jpg 300 dpi | High | Quality | `/pdf-to-jpg` + caveat | Missing/caveat | IMPORTANT |
| 59 | extract images from pdf | High | Different feature | future/caveat | Missing | IMPORTANT later |
| 60 | pdf to jpg zip | Low | Output support | `/pdf-to-jpg` | Partial | OPTIONAL |
| 61 | pdf to jpg on iphone | Medium | Platform | `/pdf-to-jpg` | Missing | IMPORTANT |
| 62 | pdf to jpg on android | Medium | Platform | `/pdf-to-jpg` | Missing | IMPORTANT |
| 63 | pdf to jpg on windows | Medium | Platform | `/pdf-to-jpg` | Missing | IMPORTANT |
| 64 | pdf to jpg on mac | Medium | Platform | `/pdf-to-jpg` | Missing | IMPORTANT |
| 65 | pdf to jpg vs png | Medium | Comparison | `/pdf-to-jpg` + `/pdf-to-png` | Missing | IMPORTANT |
| 66 | why is pdf to jpg blurry | Low | Problem | `/pdf-to-jpg` | Missing | IMPORTANT |
| 67 | pdf to image converter | High | Category | `/pdf-image-tools` | Partial | CRITICAL |
| 68 | pdf to png without upload | Low-Medium | Privacy transactional | `/pdf-to-png` | Partial | IMPORTANT |
| 69 | convert pdf to png high quality | High | Quality | `/pdf-to-png` | Partial | CRITICAL |
| 70 | pdf page to png | Medium | Transactional | `/pdf-to-png` | Partial | IMPORTANT |
| 71 | pdf to png transparent background | Medium | Feature/support | `/pdf-to-png` + caveat | Partial | IMPORTANT |
| 72 | pdf to png page range | Low | Settings | `/pdf-to-png` | Partial | IMPORTANT |
| 73 | single page pdf to png | Medium | Settings | `/pdf-to-png` | Partial | IMPORTANT |
| 74 | pdf to png on iphone | Low-Medium | Platform | `/pdf-to-png` | Missing | OPTIONAL |
| 75 | pdf to png on android | Low-Medium | Platform | `/pdf-to-png` | Missing | OPTIONAL |
| 76 | pdf to png on windows | Low-Medium | Platform | `/pdf-to-png` | Missing | OPTIONAL |
| 77 | pdf to png on mac | Low-Medium | Platform | `/pdf-to-png` | Missing | OPTIONAL |
| 78 | png or jpg from pdf | Medium | Comparison | `/pdf-to-jpg` + `/pdf-to-png` | Missing | IMPORTANT |
| 79 | convert pdf to image without account | Medium | Trust | `/pdf-image-tools` | Partial | IMPORTANT |
| 80 | pdf screenshot converter | Low | Use case | `/pdf-to-png` | Missing | OPTIONAL |
| 81 | merge pdf without uploading | Medium | Privacy transactional | `/merge-pdf` + guide | Partial | CRITICAL |
| 82 | combine pdf files online free | Very High | Transactional | `/merge-pdf` | Yes | CRITICAL |
| 83 | join pdf files | High | Transactional | `/merge-pdf` | Partial | CRITICAL |
| 84 | combine multiple pdfs into one | High | Transactional | `/merge-pdf` | Yes | CRITICAL |
| 85 | merge pdf in order | Medium | Support | `/merge-pdf` | Partial | IMPORTANT |
| 86 | reorder before merge pdf | Low | Support | `/merge-pdf` | Partial | IMPORTANT |
| 87 | merge scanned pdf files | Medium | Use case | `/merge-pdf` | Missing | IMPORTANT |
| 88 | merge pdf and jpg | High | Feature gap/caveat | `/merge-pdf` + `/images-to-pdf` | Missing | IMPORTANT |
| 89 | merge password protected pdf | Medium | Problem | `/merge-pdf` + `/unlock-pdf` | Missing | IMPORTANT |
| 90 | merge pdf on iphone | Medium | Platform | `/merge-pdf` | Missing | IMPORTANT |
| 91 | merge pdf on android | Medium | Platform | `/merge-pdf` | Missing | IMPORTANT |
| 92 | merge pdf on windows | Medium | Platform | `/merge-pdf` | Missing | IMPORTANT |
| 93 | merge pdf on mac | Medium | Platform | `/merge-pdf` | Missing | IMPORTANT |
| 94 | merge pdf for email | Low | Use case | `/merge-pdf` | Missing | OPTIONAL |
| 95 | combine reports into one pdf | Low | Use case | `/merge-pdf` | Missing | OPTIONAL |
| 96 | split pdf without uploading | Medium | Privacy transactional | `/split-pdf` | Partial | CRITICAL |
| 97 | split pdf by page range | High | Transactional | `/split-pdf` | Yes | CRITICAL |
| 98 | split every page pdf | Medium | Transactional | `/split-pdf` | Yes | CRITICAL |
| 99 | split pdf into separate pages | High | Transactional | `/split-pdf` | Yes | CRITICAL |
| 100 | separate pdf pages online | Medium | Transactional | `/split-pdf` | Partial | IMPORTANT |
| 101 | extract pages vs split pdf | Low-Medium | Comparison | guide | Yes | IMPORTANT |
| 102 | split pdf into multiple files | High | Transactional | `/split-pdf` | Partial | CRITICAL |
| 103 | split large pdf file | Medium | Use case | `/split-pdf` | Missing | IMPORTANT |
| 104 | split password protected pdf | Low-Medium | Problem | `/split-pdf` + `/unlock-pdf` | Missing | IMPORTANT |
| 105 | split scanned pdf | Medium | Use case | `/split-pdf` | Missing | IMPORTANT |
| 106 | split pdf on iphone | Medium | Platform | `/split-pdf` | Missing | IMPORTANT |
| 107 | split pdf on android | Medium | Platform | `/split-pdf` | Missing | IMPORTANT |
| 108 | split pdf on windows | Medium | Platform | `/split-pdf` | Missing | OPTIONAL |
| 109 | split pdf on mac | Medium | Platform | `/split-pdf` | Missing | OPTIONAL |
| 110 | invalid pdf page range | Very Low | Problem | `/split-pdf` | Missing | OPTIONAL |
| 111 | compress pdf without uploading | Medium | Privacy transactional | `/compress-pdf` | Partial | CRITICAL |
| 112 | reduce pdf size online | Very High | Transactional | `/compress-pdf` | Partial | CRITICAL |
| 113 | make pdf smaller | Very High | Transactional | `/compress-pdf` | Partial | CRITICAL |
| 114 | compress pdf for email | High | Use case | `/compress-pdf` | Missing | CRITICAL |
| 115 | compress pdf under 1mb | High | Size target | `/compress-pdf` + caveat | Missing | IMPORTANT |
| 116 | compress pdf under 2mb | High | Size target | `/compress-pdf` + caveat | Missing | IMPORTANT |
| 117 | compress pdf under 5mb | High | Size target | `/compress-pdf` + caveat | Missing | IMPORTANT |
| 118 | why pdf compression did not reduce size | Low | Problem | `/compress-pdf` | Partial | IMPORTANT |
| 119 | image pdf too large | Medium | Problem | `/compress-pdf` + `/images-to-pdf` | Missing | IMPORTANT |
| 120 | compress scanned pdf | Medium | Use case | `/compress-pdf` | Missing | IMPORTANT |
| 121 | safe pdf compression | Low | Trust | `/compress-pdf` | Yes | IMPORTANT |
| 122 | lossless pdf compression | Medium | Quality/caveat | `/compress-pdf` | Partial | IMPORTANT |
| 123 | compress pdf on iphone | Medium | Platform | `/compress-pdf` | Missing | IMPORTANT |
| 124 | compress pdf on android | Medium | Platform | `/compress-pdf` | Missing | IMPORTANT |
| 125 | compress pdf on windows | Medium | Platform | `/compress-pdf` | Missing | OPTIONAL |
| 126 | rotate pdf without uploading | Low-Medium | Privacy transactional | `/rotate-pdf` | Partial | IMPORTANT |
| 127 | rotate one page in pdf | Medium | Transactional | `/rotate-pdf` | Partial | CRITICAL |
| 128 | rotate all pages pdf | Medium | Transactional | `/rotate-pdf` | Partial | IMPORTANT |
| 129 | rotate pdf 90 degrees | Medium | Transactional | `/rotate-pdf` | Partial | IMPORTANT |
| 130 | rotate pdf 180 degrees | Low-Medium | Transactional | `/rotate-pdf` | Partial | IMPORTANT |
| 131 | rotate pdf permanently | Medium | Problem | `/rotate-pdf` | Missing | IMPORTANT |
| 132 | fix sideways pdf scan | Medium | Problem | `/rotate-pdf` | Missing | IMPORTANT |
| 133 | rotate scanned pdf | Medium | Use case | `/rotate-pdf` | Missing | IMPORTANT |
| 134 | rotate pdf on iphone | Medium | Platform | `/rotate-pdf` | Missing | IMPORTANT |
| 135 | rotate pdf on android | Medium | Platform | `/rotate-pdf` | Missing | IMPORTANT |
| 136 | add page numbers without uploading | Low | Privacy transactional | `/add-page-numbers` | Partial | IMPORTANT |
| 137 | add footer page numbers to pdf | Medium | Transactional | `/add-page-numbers` | Partial | IMPORTANT |
| 138 | add header page numbers to pdf | Low | Transactional | `/add-page-numbers` | Partial | OPTIONAL |
| 139 | page 1 of 10 pdf | Low-Medium | Format support | `/add-page-numbers` | Yes | IMPORTANT |
| 140 | start page numbering at 5 | Low | Settings | `/add-page-numbers` | Partial | IMPORTANT |
| 141 | add page numbers to merged pdf | Low | Workflow | `/add-page-numbers` + `/merge-pdf` | Missing | OPTIONAL |
| 142 | add page numbers to scanned pdf | Low | Use case | `/add-page-numbers` | Missing | OPTIONAL |
| 143 | Bates numbering PDF | Medium | Advanced/future | caveat/future | Missing | OPTIONAL |
| 144 | watermark pdf without uploading | Medium | Privacy transactional | `/watermark-pdf` | Partial | CRITICAL |
| 145 | add text watermark to pdf | High | Transactional | `/watermark-pdf` | Yes | CRITICAL |
| 146 | add image watermark to pdf | High | Transactional | `/watermark-pdf` | Yes | CRITICAL |
| 147 | add logo to pdf | Medium | Use case | `/watermark-pdf` | Partial | IMPORTANT |
| 148 | confidential watermark pdf | Medium | Use case | `/watermark-pdf` | Partial | IMPORTANT |
| 149 | draft watermark pdf | Medium | Use case | `/watermark-pdf` | Partial | IMPORTANT |
| 150 | diagonal watermark pdf | Medium | Settings | `/watermark-pdf` | Partial | IMPORTANT |
| 151 | repeat watermark pdf | Medium | Settings | `/watermark-pdf` | Yes | IMPORTANT |
| 152 | watermark scanned pdf | Low | Use case | `/watermark-pdf` | Missing | OPTIONAL |
| 153 | remove pages from pdf without uploading | Medium | Privacy transactional | `/delete-pages` | Partial | CRITICAL |
| 154 | delete one page from pdf | High | Transactional | `/delete-pages` | Partial | CRITICAL |
| 155 | remove blank pages from pdf | High | Problem/use case | `/delete-pages` | Partial | CRITICAL |
| 156 | remove duplicate pages from pdf | Medium | Problem/use case | `/delete-pages` | Partial | IMPORTANT |
| 157 | delete selected pages from pdf | Medium | Transactional | `/delete-pages` | Yes | CRITICAL |
| 158 | remove first page from pdf | Medium | Transactional | `/delete-pages` | Missing | IMPORTANT |
| 159 | remove last page from pdf | Low-Medium | Transactional | `/delete-pages` | Missing | OPTIONAL |
| 160 | delete pages from scanned pdf | Medium | Use case | `/delete-pages` | Partial | IMPORTANT |
| 161 | delete pages from password protected pdf | Medium | Problem | `/delete-pages` + `/unlock-pdf` | Partial | IMPORTANT |
| 162 | delete vs extract pdf pages | Low | Comparison | `/delete-pages` + guide | Partial | IMPORTANT |
| 163 | extract pdf pages without uploading | Medium | Privacy transactional | `/extract-pages` | Yes | CRITICAL |
| 164 | extract selected pages from pdf | High | Transactional | `/extract-pages` | Yes | CRITICAL |
| 165 | save selected pages from pdf | Medium | Transactional | `/extract-pages` | Yes | CRITICAL |
| 166 | extract one page from pdf | High | Guide/tool | guide + `/extract-pages` | Yes | CRITICAL |
| 167 | extract multiple pages from pdf | Medium | Guide/tool | guide + `/extract-pages` | Yes | CRITICAL |
| 168 | extract non consecutive pages pdf | Low-Medium | Support | `/extract-pages` | Partial | IMPORTANT |
| 169 | extract pages from scanned pdf | Medium | Problem | guide | Yes | CRITICAL |
| 170 | extract pages from password protected pdf | Medium | Problem | guide | Yes | CRITICAL |
| 171 | extract pages without Adobe | Medium | Comparison | guide | Yes | CRITICAL |
| 172 | extract pages on iPhone | Low-Medium | Platform | guide | Missing | IMPORTANT |
| 173 | extract pages on Android | Low-Medium | Platform | guide | Missing | IMPORTANT |
| 174 | extract pages on Mac | Low-Medium | Platform | guide | Missing | IMPORTANT |
| 175 | extract pages on Windows | Low-Medium | Platform | guide | Missing | IMPORTANT |
| 176 | why extracted pages are blank | Low | Problem | guide | Partial | IMPORTANT |
| 177 | reorder pdf pages without uploading | Medium | Privacy transactional | `/reorder-pages` | Partial | CRITICAL |
| 178 | rearrange pdf pages online | Medium | Transactional | `/reorder-pages` | Partial | CRITICAL |
| 179 | move pages in pdf | Medium | Transactional | `/reorder-pages` | Yes | CRITICAL |
| 180 | sort pdf pages | Low-Medium | Transactional | `/reorder-pages` | Partial | IMPORTANT |
| 181 | organize pdf pages | High | Transactional | `/organize-pdf` + `/reorder-pages` | Yes | CRITICAL |
| 182 | change order of pdf pages | Medium | Transactional | `/reorder-pages` | Partial | IMPORTANT |
| 183 | drag and drop pdf pages | Low | UX/support | `/reorder-pages` | Partial | OPTIONAL |
| 184 | reorder scanned pdf pages | Low-Medium | Use case | `/reorder-pages` | Missing | IMPORTANT |
| 185 | reorder pages after merging pdf | Low | Workflow | `/merge-pdf` + `/reorder-pages` | Missing | OPTIONAL |
| 186 | protect pdf without uploading | Medium | Privacy transactional | `/protect-pdf` | Yes | CRITICAL |
| 187 | password protect pdf online | High | Transactional | `/protect-pdf` | Partial | CRITICAL |
| 188 | encrypt pdf online | High | Transactional | `/protect-pdf` | Yes | CRITICAL |
| 189 | lock pdf with password | Medium | Transactional | `/protect-pdf` | Partial | IMPORTANT |
| 190 | protect pdf locally | Low-Medium | Trust | `/protect-pdf` + guide | Partial | IMPORTANT |
| 191 | AES encrypted PDF | Low | Technical trust | `/protect-pdf` | Partial | OPTIONAL |
| 192 | pdf owner password vs user password | Low | Educational | `/protect-pdf` | Missing | OPTIONAL |
| 193 | unlock pdf without uploading | Medium | Privacy transactional | `/unlock-pdf` | Yes | CRITICAL |
| 194 | remove password from pdf | High | Transactional | `/unlock-pdf` | Partial | CRITICAL |
| 195 | decrypt pdf online | Medium | Transactional | `/unlock-pdf` | Yes | CRITICAL |
| 196 | unlock pdf with known password | Low-Medium | Trust/support | `/unlock-pdf` | Partial | IMPORTANT |
| 197 | recover pdf password | High | Not supported | `/unlock-pdf` caveat | Missing | IMPORTANT |
| 198 | pdf to text without uploading | Medium | Privacy transactional | `/pdf-to-text` | Partial | CRITICAL |
| 199 | extract selectable text from pdf | Medium | Transactional | `/pdf-to-text` | Yes | CRITICAL |
| 200 | scanned pdf text extraction OCR | High | Missing OCR/caveat | `/pdf-to-text` + future OCR | Partial caveat | IMPORTANT |

## Page-Specific Semantic Gaps

### Homepage

Coverage score: 82/100.

Missing terms worth adding naturally:

- private PDF tools;
- browser PDF tools;
- no-upload PDF converter;
- local PDF processing;
- PDF tools for Windows, Mac, iPhone and Android;
- exact available tool groups: organize, convert, edit, security, image tools.

Do not add:

- fake user counts;
- fake enterprise logos;
- claims of offline support unless tested and defined carefully.

### `/pdf-tools`

Coverage score: 86/100.

Missing:

- "all PDF tools" variants;
- "free PDF suite";
- "PDF tools without upload";
- clearer distinction between available tools and coming-soon Office/OCR/signing tools;
- internal links to category pages with descriptive anchor text.

### `/jpg-to-pdf`

Coverage score: 88/100.

Missing:

- JPEG synonym coverage;
- platform variants for iPhone, Android, Windows and Mac;
- troubleshooting: blurry output, file too large, white margins, rotated images;
- print settings: A4, Letter, margins, Fit/Fill;
- comparisons: JPG vs JPEG, JPG vs PNG, JPG vs PDF.

### `/png-to-pdf`

Coverage score: 84/100.

Missing:

- transparent PNG to PDF;
- screenshot to PDF;
- PNG logo to PDF;
- white background explanation;
- PNG vs JPG vs PDF;
- platform variants.

### `/images-to-pdf`

Coverage score: 82/100.

Missing:

- photo to PDF;
- pictures to PDF;
- receipts to PDF;
- screenshots to PDF;
- mixed JPG/PNG/WEBP workflow;
- unsupported/future formats: HEIC, TIFF, BMP, GIF.

### `/pdf-to-jpg`

Coverage score: 84/100.

Missing:

- PDF to JPEG;
- PDF page to JPG;
- single page and page range queries;
- "extract images from PDF" caveat;
- high quality vs fake DPI explanation;
- device/platform variants.

### `/pdf-to-png`

Coverage score: 78/100.

Missing:

- lossless PNG language;
- transparent-background caveat;
- page range/single page semantics;
- PDF screenshot use case;
- PDF to PNG vs PDF to JPG comparison.

### `/merge-pdf`

Coverage score: 83/100.

Missing:

- join PDF files;
- merge scanned PDFs;
- merge PDF and JPG caveat/workflow;
- merge encrypted PDFs after unlocking;
- order/reorder before merge;
- portfolio/report/invoice packet use cases.

### `/split-pdf`

Coverage score: 80/100.

Missing:

- split by ranges;
- split every page;
- split into multiple files;
- separate pages from PDF;
- split scanned PDFs;
- split vs extract vs delete comparison;
- password-protected PDF workflow.

### `/compress-pdf`

Coverage score: 74/100.

Missing:

- reduce PDF size;
- make PDF smaller;
- compress for email;
- target sizes under 1 MB / 2 MB / 5 MB with honest caveat;
- image-heavy PDF explanation;
- why a PDF may already be optimized.

### `/rotate-pdf`

Coverage score: 82/100.

Missing:

- rotate one page;
- rotate all pages;
- rotate PDF permanently;
- fix sideways scanned pages;
- 90, 180 and 270 degree language;
- platform variants.

### `/add-page-numbers`

Coverage score: 78/100.

Missing:

- footer page numbers;
- header page numbers;
- Page X of Y;
- start numbering at a different number;
- add numbers after merging;
- Bates numbering caveat.

### `/watermark-pdf`

Coverage score: 83/100.

Missing:

- confidential watermark;
- draft watermark;
- logo watermark;
- diagonal watermark;
- repeated watermark;
- watermark scanned PDF;
- watermark vs signature distinction.

### `/delete-pages`

Coverage score: 89/100.

Missing:

- remove first/last page;
- remove blank pages;
- remove duplicate pages;
- delete pages from scanned PDF;
- delete pages from protected PDF;
- delete vs extract decision examples.

### `/extract-pages`

Coverage score: 92/100.

Missing:

- platform variants;
- "save selected pages" variants;
- "extract non-consecutive pages";
- "extract without Acrobat" on page-level content, even though guide exists;
- stronger Google Preview/Adobe/Preview alternatives in guide cluster.

### `/reorder-pages`

Coverage score: 88/100.

Missing:

- rearrange pages;
- sort pages;
- change page order;
- organize scanned packets;
- reorder after merge;
- mobile move-button workflow.

### `/protect-pdf`

Coverage score: 84/100.

Missing:

- password protect PDF;
- encrypt PDF;
- lock PDF;
- user password vs owner password;
- permissions caveat;
- AES/QPDF WASM explanation in plain language.

### `/unlock-pdf`

Coverage score: 84/100.

Missing:

- remove password from PDF;
- decrypt PDF;
- unlock with known password;
- cannot recover lost password;
- permissions restrictions vs open password distinction.

### `/pdf-to-text`

Coverage score: 81/100.

Missing:

- extract selectable text;
- copy text from PDF;
- TXT export;
- no OCR / scanned PDF limitations;
- preserve layout limitations;
- protected PDF unlock flow.

### Trust Pages

Coverage scores:

- `/privacy`: 88/100.
- `/security`: 86/100.
- `/why-liftpdf`: 80/100.
- `/about`: 68/100.
- `/contact`: 72/100.
- `/terms`: 72/100.

Missing:

- one canonical phrase set repeated naturally across trust pages: browser-side processing, no document upload, local processing, no account, no document storage;
- clearer "what LiftPDF cannot promise" section;
- support/report issue language;
- security limitations without weakening trust.

## People Also Ask Coverage Gaps

These questions should be added only where they help the user, not as hidden FAQ stuffing.

### Image to PDF

- Can I convert multiple JPG files into one PDF?
- Can I convert JPG to PDF without uploading files?
- Why does my JPG to PDF have white margins?
- How do I make a JPG fit an A4 PDF page?
- Does converting JPG to PDF reduce image quality?
- Can I convert photos to PDF on iPhone?
- Can I convert PNG transparency to PDF?
- Why does a transparent PNG become white in PDF?
- Is JPG or PNG better for PDF?
- Can I combine JPG, PNG and WEBP in one PDF?

### PDF to Image

- Can I convert one PDF page to JPG?
- Can I convert only selected PDF pages to JPG?
- Does PDF to JPG reduce quality?
- Should I use JPG or PNG for PDF pages?
- Can I extract images from a PDF?
- Why is my exported JPG blurry?
- Can I convert PDF to image without uploading?
- Can I convert a protected PDF to JPG?

### Organize PDF

- How do I remove one page from a PDF?
- How do I remove blank pages from a PDF?
- Can I extract pages from a PDF for free?
- Can I extract non-consecutive pages from a PDF?
- Is extracting pages the same as splitting a PDF?
- How do I rearrange PDF pages?
- Can I reorder PDF pages on mobile?
- Can I organize a scanned PDF?
- Can I split a password-protected PDF?
- Can I merge PDFs without uploading them?

### Edit PDF

- How do I rotate one page in a PDF?
- How do I permanently rotate a PDF?
- Can I add page numbers to a PDF online?
- Can I start page numbering from a custom number?
- How do I add a confidential watermark to PDF?
- Can I add a logo watermark to PDF?
- Can I compress a PDF under 1 MB?
- Why did PDF compression not reduce my file size?

### Security and Text

- Can I password protect a PDF online?
- Does password protection encrypt the PDF?
- Can I remove a PDF password if I know it?
- Can I recover a lost PDF password?
- Are my PDF files uploaded?
- Can I extract text from a scanned PDF?
- Why was no selectable text found?
- Can I copy text from a PDF into TXT?

## Entities and Terms Missing from LiftPDF's Semantic Graph

High-value entities:

- Adobe Acrobat, Acrobat Reader, Preview on Mac, Microsoft Edge, Google Chrome, Safari, Firefox.
- Windows 11, macOS, iOS, iPadOS, Android, Chromebook.
- PDF.js, QPDF, WebAssembly, browser-side processing, local processing, client-side processing.
- JPEG, JPG, PNG, WEBP, HEIC, TIFF, BMP, GIF, TXT, DOCX, XLSX, PPTX.
- OCR, scanned PDF, image-only PDF, selectable text, embedded images.
- AES encryption, user password, owner password, permissions, password recovery.
- A4, Letter, portrait, landscape, margin, Fit, Fill, page range, non-consecutive pages.

## Recommended Semantic Architecture

### 1. Tool Page Layer

Each tool page should own the head term and immediate variants:

- `/jpg-to-pdf`: jpg to pdf, jpeg to pdf, convert jpg to pdf.
- `/delete-pages`: delete pages from pdf, remove pages from pdf.
- `/extract-pages`: extract pages from pdf, save selected pages from pdf.

### 2. Guide Layer

Guides should target one specific intent each:

- platform;
- problem;
- comparison;
- settings;
- privacy/no-upload;
- use case.

### 3. Category Layer

Category pages should own broad clusters:

- `/organize-pdf`: merge, split, delete, extract, reorder.
- `/pdf-image-tools`: JPG/PNG/images/PDF to image.
- `/pdf-security`: protect, unlock, encryption, password.

### 4. Trust Layer

Trust pages should support every tool with consistent language:

- "Your files never leave your browser" when technically true;
- "No upload required";
- "No account";
- "Browser-side processing";
- "Powered by PDF.js/QPDF WASM where relevant."

## Highest ROI Recommendations

### Critical

1. Expand platform coverage for `/jpg-to-pdf`, `/pdf-to-jpg`, `/merge-pdf`, `/extract-pages`, `/delete-pages` and `/reorder-pages`.
2. Build problem-led sections for image quality, PDF size, scanned PDFs, blank pages, protected PDFs and invalid ranges.
3. Add stronger semantic support for "no upload" and "browser-side" across tool pages.
4. Add exact synonyms to page copy where natural: jpeg, join, combine, remove, rearrange, save selected pages, reduce file size.
5. Create decision tables for organize tools: Extract vs Split vs Delete vs Reorder vs Merge.

### Important

1. Add format comparison guides: JPG vs PDF, JPG vs PNG, PDF to JPG vs PDF to PNG.
2. Add use-case blocks for students, invoices, contracts, scanned packets, receipts and reports.
3. Expand trust content with QPDF/PDF.js/WebAssembly explanations.
4. Add unsupported-feature caveats for OCR, embedded image extraction, Office conversion, password recovery and advanced compression.
5. Strengthen category pages so they are real hubs, not thin lists.

### Optional

1. Create glossary pages only after core guides receive impressions.
2. Add low-volume advanced terms like Bates numbering, owner password, lossless compression.
3. Add future-tool semantic placeholders only when they do not imply a working feature.

## What Not to Add Yet

- Transactional landing pages for PDF to Word, Word to PDF, Excel to PDF, PPT to PDF, OCR, Redact PDF, Fill PDF or Sign PDF until the corresponding tool exists.
- "Best converter" pages without proof, comparisons or real differentiators.
- Keyword-only FAQ pages.
- Claims of offline support unless tested in a service-worker/offline context.
- Security certifications, compliance labels or audit claims that LiftPDF does not have.

## Semantic Coverage Scorecard

| Area | Score | Notes |
| --- | ---: | --- |
| Image to PDF cluster | 85 | Strong tools and guide text; needs platform/problem pages. |
| PDF to image cluster | 81 | Good tool coverage; needs extract-images caveat and quality comparisons. |
| Organize PDF cluster | 89 | Strongest cluster thanks to Extract Pages guides and screenshots. |
| Edit PDF cluster | 79 | Good tools; needs richer problem/use-case semantics. |
| Security cluster | 84 | Strong honesty and real encryption; needs more user-language password terms. |
| PDF to Text cluster | 81 | Honest no-OCR positioning; needs scanned/OCR and TXT/export terms. |
| Category pages | 74 | Useful but could become stronger semantic hubs. |
| Trust pages | 82 | Good; should align repeated trust phrases more deliberately. |
| Guide coverage | 62 | Extract Pages is strong; other tools lack published guide clusters. |
| Overall semantic coverage | 81 | Strong V1 tool coverage, incomplete long-tail ecosystem. |

## Final Priority Order

1. Extract/Delete/Reorder pages cluster expansion because Search Console already shows impressions.
2. Image to PDF cluster expansion because the product already has polished tools.
3. PDF to JPG/PDF to PNG comparison and quality cluster.
4. Merge/Split/Compress support pages.
5. Protect/Unlock/PDF to Text trust and limitation guides.
6. Category page strengthening.
7. Office/OCR/signature semantic work only after real tools exist.

