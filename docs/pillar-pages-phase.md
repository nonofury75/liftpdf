# Pillar Pages Phase

Date: 2026-07-15

## Objective

Transform four thin category pages into SEO pillar pages without creating new tools or changing any PDF engine.

Pages:

- `/organize-pdf`
- `/pdf-converter`
- `/pdf-editor`
- `/pdf-image-tools`

## Benchmark Summary

Public competitor review showed the same pattern across Adobe, Smallpdf, iLovePDF and PDF24:

- category or hub pages are not only tool grids;
- they explain workflows and tool choice;
- they link heavily to individual tools;
- they include FAQ or Q&A blocks;
- they use trust and device-support copy;
- they connect category pages to related tools and guides.

Relevant observed patterns:

- Smallpdf's Organize PDF page focuses on page rearrangement, mobile use and FAQ.
- iLovePDF's Organize PDF workflow emphasizes sorting, adding and deleting PDF pages.
- Adobe's online Acrobat pages use how-to sections, related tools and trust messaging.
- PDF24 uses broad all-tools/category linking and practical Q&A sections.

LiftPDF should not copy their text or design. The useful strategy to reproduce is the structure: clear tool choice, practical workflows, FAQ, screenshots and internal links.

## Shared Component Upgrade

Updated:

- `components/tools/category-page-shell.tsx`

New optional sections:

- richer introduction;
- "How to choose the right tool";
- common tasks;
- workflow steps;
- real LiftPDF screenshots;
- associated guides;
- stronger related categories;
- `Article` JSON-LD in addition to `CollectionPage`, `BreadcrumbList` and `FAQPage`.

## `/organize-pdf`

### Sections Added

- Organize PDF hub introduction.
- Tool choice guide for Merge, Split, Delete, Extract, Reorder and Compress.
- Common tasks: build one packet, remove unwanted pages, save selected pages, fix page order.
- Safe organization workflow.
- Real LiftPDF workflow screenshots from Merge PDF.
- Organize PDF guide links.
- Expanded FAQ.

### Internal Links Added

- `/merge-pdf`
- `/split-pdf`
- `/delete-pages`
- `/extract-pages`
- `/reorder-pages`
- `/compress-pdf`
- `/guides/how-to-merge-pdf`
- `/guides/how-to-extract-pages-from-pdf`
- `/guides/merge-pdf-without-adobe`

### SEO Hypothesis

Google should better understand `/organize-pdf` as a decision hub for page and file organization, not just a shallow category list.

## `/pdf-converter`

### Sections Added

- PDF Converter hub introduction.
- Honest tool selection guide for PDF to JPG, PDF to PNG, PDF to Text, JPG to PDF, PNG to PDF and Images to PDF.
- Common conversion tasks.
- Practical conversion workflow.
- Real LiftPDF conversion screenshots from JPG to PDF.
- Conversion guide links.
- Expanded FAQ explaining available tools and coming-soon Office tools.

### Internal Links Added

- `/pdf-to-jpg`
- `/pdf-to-png`
- `/pdf-to-text`
- `/jpg-to-pdf`
- `/png-to-pdf`
- `/images-to-pdf`
- `/guides/how-to-convert-jpg-to-pdf`
- `/guides/how-to-convert-jpg-to-pdf-without-losing-quality`
- `/guides/jpg-vs-png`

### SEO Hypothesis

Google should see the page as an honest converter hub, with clear distinction between available browser tools and unavailable Office conversion workflows.

## `/pdf-editor`

### Sections Added

- PDF Editor hub introduction.
- Clarification that LiftPDF offers focused editing tools, not fake full text editing.
- Tool choice guide for Rotate, Add Page Numbers, Watermark and Compress.
- Common PDF editing tasks.
- Clean editing workflow.
- Real LiftPDF workflow screenshots.
- Editing-related guide links.
- Expanded FAQ about limitations and workflow order.

### Internal Links Added

- `/rotate-pdf`
- `/add-page-numbers`
- `/watermark-pdf`
- `/compress-pdf`
- `/guides/why-is-my-merged-pdf-too-large`
- `/guides/how-to-keep-original-image-quality`
- `/guides/how-to-extract-pages-from-pdf`

### SEO Hypothesis

Google should better understand `/pdf-editor` as a focused editing-tools hub rather than a broad, misleading "edit PDF text" page.

## `/pdf-image-tools`

### Sections Added

- PDF Image Tools hub introduction.
- Tool choice guide for JPG to PDF, PNG to PDF, Images to PDF, PDF to JPG and PDF to PNG.
- Common image/PDF tasks.
- Practical image/PDF workflow.
- Real LiftPDF screenshots from JPG to PDF.
- Image and PDF guide links.
- Expanded FAQ.

### Internal Links Added

- `/jpg-to-pdf`
- `/png-to-pdf`
- `/images-to-pdf`
- `/pdf-to-jpg`
- `/pdf-to-png`
- `/guides/how-to-convert-jpg-to-pdf`
- `/guides/how-to-convert-multiple-jpg-to-pdf`
- `/guides/jpg-vs-png`

### SEO Hypothesis

Google should see this page as the official hub for image-to-PDF and PDF-to-image workflows, reducing confusion between sibling tools.

## Captures Added

No new image generation was required. The pillar pages reuse real LiftPDF screenshots already captured from production-like workflows:

- `public/images/seo/merge-pdf/merge-pdf-before.webp`
- `public/images/seo/merge-pdf/merge-pdf-after.webp`
- `public/images/seo/jpg-to-pdf/jpg-to-pdf-before.webp`
- `public/images/seo/jpg-to-pdf/jpg-to-pdf-after.webp`
- `public/images/seo/jpg-to-pdf/jpg-to-pdf-preview.webp`

## Expected SEO Improvement

The pages should improve because they now:

- answer complete category-level intent;
- explain how to choose between similar tools;
- reduce cannibalization between child pages;
- link into existing content clusters;
- include real product screenshots;
- expose richer FAQ and Article schema;
- provide clearer topical coverage for Google's indexer.

## Validation

Local validation:

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run test:e2e`: passed, 51 passed and 5 skipped mobile-heavy workflows.

Post-deploy checks:

- HTTP 200 for all four pages.
- Canonical present.
- OpenGraph present.
- JSON-LD includes CollectionPage, Article, BreadcrumbList and FAQPage.
- Sitemap includes all four category URLs.
- Responsive rendering remains intact.
