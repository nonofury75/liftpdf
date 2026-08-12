# LiftPDF Phase 67 - Search Console Opportunity Framework

Date: 2026-08-12

Direct Search Console export was not available in this Codex session. This document defines the first opportunity pass to run before and after public launch.

## Baseline Export Needed

Export these Search Console reports before outreach:

1. Performance by query, last 7 days.
2. Performance by page, last 7 days.
3. Performance by query, last 28 days.
4. Performance by page, last 28 days.
5. Pages report: indexed, discovered not indexed, crawled not indexed.
6. Sitemap report for `/sitemap.xml`.

## URL Groups

| Group | Routes |
|---|---|
| Homepage | `/` |
| Tool index | `/pdf-tools` |
| Tier A tools | `/merge-pdf`, `/jpg-to-pdf`, `/compress-pdf`, `/pdf-to-jpg`, `/protect-pdf` |
| Other tools | remaining 12 tool routes |
| Learning | `/learn`, `/guides`, `/pdf-glossary`, `/help` |
| Trust | `/privacy`, `/security`, `/about`, `/why-liftpdf`, `/terms`, `/contact`, `/cookies` |

## Opportunity Scoring

Score each page/query pair:

| Signal | Weight |
|---|---:|
| Impressions already present | 3 |
| Position 4-20 | 3 |
| CTR below expected | 2 |
| Tool intent clear | 3 |
| Page already has strong matching content | 2 |
| Cannibalization risk low | 2 |

Prioritize high-scoring pairs for title/meta/internal-link refinements before creating new pages.

## Queries To Watch

Tier A query families:

- merge pdf;
- combine pdf files;
- jpg to pdf;
- convert image to pdf;
- compress pdf;
- reduce pdf size;
- pdf to jpg;
- convert pdf pages to images;
- password protect pdf;
- protect pdf online.

Privacy differentiator queries:

- browser based pdf tools;
- local pdf processing;
- pdf tools no upload;
- private pdf converter.

## No-New-Batch Rule

For the first seven launch days:

- do not publish mass SEO pages;
- do not create device doorway pages;
- update existing pages only if Search Console shows a clear mismatch;
- preserve the V1 product freeze.

## Baseline Status

Search Console baseline captured in this session: NOT_AVAILABLE  
Framework ready for manual export: YES

