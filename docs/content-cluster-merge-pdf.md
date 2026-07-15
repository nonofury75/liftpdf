# Merge PDF SEO Cluster

Date: 2026-07-15  
Status: implemented

## Scope

This phase produced the real Merge PDF content cluster. It did not create a roadmap and did not change the Merge PDF engine.

Primary tool page:

- `/merge-pdf`

Published guide routes:

- `/guides/how-to-merge-pdf`
- `/guides/merge-pdf-online`
- `/guides/merge-pdf-without-adobe`
- `/guides/merge-two-pdf-files`
- `/guides/merge-multiple-pdf-files`
- `/guides/merge-pdf-on-windows`
- `/guides/merge-pdf-on-mac`
- `/guides/merge-pdf-on-iphone`
- `/guides/merge-pdf-on-android`
- `/guides/merge-pdf-free`

Published problem routes:

- `/guides/why-cant-i-merge-pdf-files`
- `/guides/why-is-my-merged-pdf-too-large`
- `/guides/why-does-merge-pdf-fail`
- `/guides/why-cant-i-merge-protected-pdfs`

Published comparison routes:

- `/guides/merge-pdf-vs-combine-pdf`
- `/guides/merge-pdf-vs-adobe`
- `/guides/merge-pdf-vs-smallpdf`
- `/guides/merge-pdf-vs-ilovepdf`

Published FAQ route:

- `/guides/merge-pdf-faq`

## Files Created

- `data/merge-pdf-cluster.ts`
- `components/content/merge-pdf-guide-page.tsx`
- `docs/content-cluster-merge-pdf.md`
- `public/images/seo/merge-pdf/merge-pdf-before.webp`
- `public/images/seo/merge-pdf/merge-pdf-after.webp`
- `public/images/seo/merge-pdf/merge-pdf-workflow.webp`
- `public/images/seo/merge-pdf/merge-pdf-og.webp`

## Files Updated

- `app/guides/[slug]/page.tsx`
- `app/sitemap.ts`
- `app/merge-pdf/page.tsx`
- `data/premium-tool-content.ts`
- `tests/e2e/product-audit.spec.ts`

## Images Created

The cluster uses real LiftPDF interface captures, generated from `/merge-pdf` with two local sample PDFs.

| Image | Purpose | Size |
| --- | --- | ---: |
| `merge-pdf-before.webp` | Before state with selected PDF files | 37 KB |
| `merge-pdf-after.webp` | Success/download state after merge | 38 KB |
| `merge-pdf-workflow.webp` | Workflow hero/guide image | 36 KB |
| `merge-pdf-og.webp` | OpenGraph image for Merge PDF | 27 KB |

## Schema

Every Merge PDF guide route is rendered through `/guides/[slug]` with:

- Article schema;
- BreadcrumbList schema;
- HowTo schema based on visible quick steps;
- FAQPage schema based on visible FAQ content.

The schema mirrors visible content. No hidden FAQ or invisible HowTo content was added.

## FAQ Coverage

The cluster covers real user questions around:

- free merging;
- browser-side processing;
- upload/privacy;
- file order;
- quality preservation;
- merging two PDFs;
- merging multiple PDFs;
- Windows, Mac, iPhone and Android workflows;
- failed merges;
- protected PDFs;
- large merged files;
- Merge vs Combine terminology;
- Adobe, Smallpdf and iLovePDF comparisons.

## Internal Linking

Every Merge PDF cluster page links back to:

- `/merge-pdf`
- `/split-pdf`
- `/delete-pages`
- `/extract-pages`
- `/reorder-pages`
- `/compress-pdf`

Problem pages also link where relevant to:

- `/unlock-pdf`
- `/protect-pdf`
- `/images-to-pdf`

## Main Tool Page Reinforcement

`/merge-pdf` now uses the new dedicated OpenGraph image:

- `/images/seo/merge-pdf/merge-pdf-og.webp`

The premium content block now includes:

- real before/after screenshots;
- common problems section;
- file-order guidance;
- protected PDF guidance;
- merged-file-size guidance;
- images-to-PDF workflow caveat.

The Merge PDF tool logic was not changed.

## SEO Intent Map

| Route | Primary intent |
| --- | --- |
| `/guides/how-to-merge-pdf` | general how-to |
| `/guides/merge-pdf-online` | online/free tool intent |
| `/guides/merge-pdf-without-adobe` | Adobe alternative |
| `/guides/merge-two-pdf-files` | two-file workflow |
| `/guides/merge-multiple-pdf-files` | multi-file workflow |
| `/guides/merge-pdf-on-windows` | Windows platform |
| `/guides/merge-pdf-on-mac` | macOS platform |
| `/guides/merge-pdf-on-iphone` | iPhone platform |
| `/guides/merge-pdf-on-android` | Android platform |
| `/guides/merge-pdf-free` | free PDF merger |
| `/guides/why-cant-i-merge-pdf-files` | troubleshooting |
| `/guides/why-is-my-merged-pdf-too-large` | file-size problem |
| `/guides/why-does-merge-pdf-fail` | merge failure problem |
| `/guides/why-cant-i-merge-protected-pdfs` | protected PDF problem |
| `/guides/merge-pdf-vs-combine-pdf` | terminology comparison |
| `/guides/merge-pdf-vs-adobe` | competitor comparison |
| `/guides/merge-pdf-vs-smallpdf` | competitor comparison |
| `/guides/merge-pdf-vs-ilovepdf` | competitor comparison |
| `/guides/merge-pdf-faq` | FAQ support hub |

## Validation

Local checks:

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run test:e2e`: passed, 49 passed and 5 skipped mobile-heavy workflows.

Post-deploy checks required:

- `/merge-pdf`
- all `/guides/...merge...` routes
- `/sitemap.xml`
- metadata/canonical/OG on representative routes
- JSON-LD script on representative routes

## Notes

The content intentionally avoids false claims:

- no claim that LiftPDF replaces Adobe for every PDF workflow;
- no claim that protected PDFs can be merged without the correct password;
- no claim that every large PDF can be compressed dramatically;
- no fake testimonials, fake logos or fake statistics.
