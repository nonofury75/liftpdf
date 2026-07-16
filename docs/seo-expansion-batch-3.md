# SEO Expansion Batch 3

Date: 2026-07-17

## Goal

Batch 3 expands LiftPDF around organize/edit workflows that already connect naturally to existing tools and Search Console signals. The batch avoids doorway platform pages and focuses on distinct user problems: splitting ranges, saving selected pages, preparing PDFs for email or print, and applying final finishing steps.

## Pages Added

| Route | Primary intent | Tool path | Image |
| --- | --- | --- | --- |
| `/guides/split-pdf-into-separate-pages` | Split every PDF page into separate files | `/split-pdf` | `/images/editorial/split-pdf-page-range-workflow.svg` |
| `/guides/split-pdf-by-page-range` | Split a PDF using page ranges | `/split-pdf` | `/images/editorial/split-pdf-page-range-workflow.svg` |
| `/guides/save-selected-pages-from-pdf` | Save selected pages into one PDF | `/extract-pages` | `/images/editorial/save-selected-pdf-pages-workflow.svg` |
| `/guides/delete-pages-from-pdf-before-sending` | Remove unnecessary pages before sharing | `/delete-pages` | `/images/editorial/save-selected-pdf-pages-workflow.svg` |
| `/guides/organize-pdf-before-printing` | Final page order and print preparation | `/reorder-pages` | `/images/editorial/pdf-final-checklist-workflow.svg` |
| `/guides/prepare-pdf-for-email` | Prepare a PDF email attachment | `/compress-pdf` | `/images/editorial/pdf-final-checklist-workflow.svg` |
| `/guides/rotate-pdf-before-upload` | Fix rotated pages before upload | `/rotate-pdf` | `/images/editorial/pdf-editing-controls-workflow.svg` |
| `/guides/watermark-pdf-before-sharing` | Add a visible watermark before sharing | `/watermark-pdf` | `/images/editorial/pdf-editing-controls-workflow.svg` |
| `/guides/add-page-numbers-before-sharing-pdf` | Add readable numbers before sending | `/add-page-numbers` | `/images/editorial/pdf-editing-controls-workflow.svg` |
| `/guides/extract-pdf-pages-for-email` | Extract only pages needed for email | `/extract-pages` | `/images/editorial/save-selected-pdf-pages-workflow.svg` |

## Images Added

- `/images/editorial/split-pdf-page-range-workflow.svg`
- `/images/editorial/save-selected-pdf-pages-workflow.svg`
- `/images/editorial/pdf-final-checklist-workflow.svg`
- `/images/editorial/pdf-editing-controls-workflow.svg`

The SVGs are original, lightweight and explanatory. They are used as guide images and are crawlable static assets.

## Internal Linking

- Added Batch 3 to `seoExpansionGuides`, which flows into `foundationGuides`, `/guides`, individual guide routes and the sitemap.
- Added selected guides to Learning Center hubs:
  - `/learn/organize-pdf`
  - `/learn/edit-pdf`
- Added selected guides to popular how-to lists.

## Cannibalization Decisions

- No separate Windows/Mac/iPhone/Android pages were created in this batch.
- Similar actions were separated only where the search intent differs:
  - split every page vs split by page range;
  - save selected pages vs delete pages before sending;
  - prepare for email vs prepare for printing.

## Validation Scope

Expected checks:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`
- Production route smoke tests after deployment

## Remaining Opportunities

- Watch Search Console for impressions on split/range/email/print queries before adding more pages.
- Expand only the guides that earn impressions or clicks.
