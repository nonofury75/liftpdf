# Editorial Depth & Visual SEO Phase

## Summary

Phase 37 focused on making LiftPDF feel like a real PDF media property instead of a uniform list of tools and lightly templated guides. No PDF engine was modified.

## Content Inventory Decisions

| Content group | Decision | Reason |
| --- | --- | --- |
| Merge PDF platform pages | Merged through permanent redirects | Windows, Mac, iPhone and Android variants were too close to the main merge workflow to justify separate indexable pages. |
| JPG to PDF platform pages | Merged through permanent redirects | The workflow is browser-based and nearly identical across devices; separate pages risk doorway/cannibalization behavior. |
| Extract Pages cluster | Kept | Search Console already shows impressions and the pages answer distinct extract/split/password/scanned intents. |
| Merge PDF cluster | Kept, except platform variants | Merge intent remains strong, but platform pages were folded into the main guide. |
| JPG to PDF cluster | Kept, except platform variants | Quality, multiple images, problems and comparisons are distinct enough to keep. |
| Foundation guides | Expanded | Core PDF education supports trust, internal linking and topical authority. |

## Pages Deepened

The following 12 pillar articles now use the premium editorial article system with metadata, table of contents, quick answer, visual examples, decision tables where relevant, tool CTA, author note and related resources:

1. `/guides/what-is-a-pdf`
2. `/guides/how-to-merge-pdf`
3. `/guides/how-to-convert-jpg-to-pdf`
4. `/guides/how-to-extract-pages-from-pdf`
5. `/guides/what-is-pdf-compression`
6. `/guides/scanned-pdf-vs-searchable-pdf`
7. `/guides/what-is-browser-based-pdf-processing`
8. `/guides/what-is-a-password-protected-pdf`
9. `/guides/jpg-vs-png`
10. `/guides/extract-pages-vs-split-pdf`
11. `/guides/why-is-my-pdf-too-large`
12. `/guides/why-is-my-jpg-blurry-after-pdf`

## Pages Created

The following 10 requested pages were created because their search intent is distinct and useful:

- `/guides/how-to-reduce-pdf-file-size-for-email`
- `/guides/how-to-combine-scanned-documents-into-one-pdf`
- `/guides/how-to-prepare-a-pdf-for-online-submission`
- `/guides/how-to-organize-pdf-pages-before-sending`
- `/guides/how-to-turn-phone-photos-into-a-pdf`
- `/guides/how-to-keep-pdf-images-sharp`
- `/guides/why-pdf-opens-blank`
- `/guides/why-a-pdf-is-password-protected`
- `/guides/pdf-vs-jpg`
- `/guides/pdf-vs-png`

One additional pillar page was also created because it was explicitly part of the 12 cornerstone set and was not covered by the existing merge-specific size article:

- `/guides/why-is-my-pdf-too-large`

## Pages Fused With Redirects

Permanent redirects were added:

- `/guides/merge-pdf-on-windows` -> `/guides/how-to-merge-pdf`
- `/guides/merge-pdf-on-mac` -> `/guides/how-to-merge-pdf`
- `/guides/merge-pdf-on-iphone` -> `/guides/how-to-merge-pdf`
- `/guides/merge-pdf-on-android` -> `/guides/how-to-merge-pdf`
- `/guides/jpg-to-pdf-on-windows` -> `/guides/how-to-convert-jpg-to-pdf`
- `/guides/jpg-to-pdf-on-mac` -> `/guides/how-to-convert-jpg-to-pdf`
- `/guides/jpg-to-pdf-on-iphone` -> `/guides/how-to-convert-jpg-to-pdf`
- `/guides/jpg-to-pdf-on-android` -> `/guides/how-to-convert-jpg-to-pdf`

These redirected URLs are excluded from the sitemap and guide index.

## Components Created or Consolidated

- `components/content/editorial-article-page.tsx`
  - Article header
  - Stable author/date metadata
  - Table of contents
  - Quick answer
  - Visual examples
  - Comparison/decision table
  - Tool CTA
  - Editorial author note
  - Related resources

Existing guide renderers now delegate to this shared component:

- `MergePdfGuidePage`
- `JpgToPdfGuidePage`
- `ExtractPagesGuidePage`
- `FoundationGuidePage`

## Images Produced

New editorial SVG assets:

- `pdf-document-structure-diagram.svg`
- `pdf-compression-workflow.svg`
- `password-protected-pdf-diagram.svg`
- `extract-vs-split-workflow.svg`
- `pdf-file-size-causes.svg`
- `jpg-blurry-causes.svg`

See `docs/editorial-image-inventory.md` for alt text, dimensions and usage.

## Guides and Learn Improvements

`/guides` now has:

- featured article;
- editorial folders;
- latest resources;
- troubleshooting corner;
- comparisons;
- PDF basics;
- full searchable guide index.

`/learn` now has:

- guided paths for new PDF users;
- working-with-documents path;
- sensitive-files path;
- clearer journeys from education to tools.

## Internal Linking

The tool learning block was expanded with specific links per tool:

- primary guide;
- problem or comparison;
- related hub or glossary term;
- no generic 20-link block.

New guides are linked from relevant hubs and included in the sitemap.

## Schema

Guide pages keep:

- Article;
- BreadcrumbList;
- FAQPage;
- HowTo where visible steps exist.

Article schema now includes stable `datePublished`, `dateModified` and the `LiftPDF Editorial Team` organization author.

## Anti-Cannibalization Decisions

Not created:

- separate Windows/Mac/iPhone/Android replacements for Merge PDF and JPG to PDF;
- duplicate “best converter” pages;
- thin device-specific pages;
- separate micro-pages for every help answer.

Reason: those would risk doorway-style pages and would not be useful without Google.

## Testing

Updated Playwright coverage verifies:

- 12 pillar articles;
- 10 new pages;
- editorial article structure;
- image alt text;
- canonical;
- JSON-LD;
- sitemap inclusion;
- sitemap exclusion for redirected platform pages;
- permanent redirects for merged platform pages.

## Remaining Debt

- Dedicated OpenGraph images for every foundation guide can be added later if Search Console shows image impressions.
- Some non-pillar cluster pages still use shorter content and should only be deepened if they receive impressions.
- Real screenshots for the new troubleshooting pages would be useful once the related workflows show Search Console demand.
