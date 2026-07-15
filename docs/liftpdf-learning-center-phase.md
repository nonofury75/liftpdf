# LiftPDF Learning Center Phase

## Routes Created

- `/learn`
- `/learn/pdf-basics`
- `/learn/convert-pdf`
- `/learn/organize-pdf`
- `/learn/edit-pdf`
- `/learn/pdf-security`
- `/learn/pdf-images`
- `/learn/troubleshooting`
- `/learn/comparisons`
- `/guides`
- `/pdf-glossary`
- `/help`
- `/guides/what-is-a-pdf`
- `/guides/jpg-vs-jpeg`
- `/guides/png-vs-pdf`
- `/guides/what-is-pdf-compression`
- `/guides/what-is-a-password-protected-pdf`
- `/guides/what-is-browser-based-pdf-processing`
- `/guides/scanned-pdf-vs-searchable-pdf`

## Existing Routes Reused

- Extract Pages guides already published under `/guides/...`
- Merge PDF cluster guides already published under `/guides/...`
- JPG to PDF cluster guides already published under `/guides/...`
- `/guides/jpg-vs-png` was reused instead of recreated to avoid cannibalization.

## Pages Not Created

- A second `/guides/jpg-vs-png` foundation page was not created because the JPG to PDF cluster already contains a full comparison page for that intent.
- Individual help article pages were not created. The first Help Center version keeps answers grouped on `/help` to avoid thin support pages.

## Components Created

- `components/learn/learning-resource-card.tsx`
- `components/learn/guide-search.tsx`
- `components/learn/foundation-guide-page.tsx`
- `components/learn/learning-topic-page.tsx`
- `components/home/learn-about-pdfs.tsx`
- `components/tools/tool-learning-links.tsx`

## Centralized Data

- `data/learning-center.ts`
- `data/foundation-guides.ts`
- `data/pdf-glossary.ts`
- `data/help-center.ts`

The Learning Center data model normalizes existing guide clusters and new foundation guides so `/learn`, `/guides`, topic hubs and tool learning links share the same source of truth.

## Images Created

- `public/images/learn/learning-center-hero.webp`
- `public/images/learn/pdf-basics.webp`
- `public/images/learn/convert-pdf.webp`
- `public/images/learn/organize-pdf.webp`
- `public/images/learn/edit-pdf.webp`
- `public/images/learn/pdf-security.webp`
- `public/images/learn/pdf-images.webp`
- `public/images/learn/scanned-vs-searchable-pdf.webp`
- `public/images/learn/jpg-vs-png.webp`
- `public/images/learn/browser-processing-diagram.svg`

These are original LiftPDF editorial visuals and diagrams, not competitor copies.

## Schemas

- `/learn`, `/guides`, topic hubs and `/help` use `CollectionPage`.
- Foundation guides use the existing `Article`, `BreadcrumbList`, `HowTo` where steps exist and `FAQPage`.
- `/pdf-glossary` uses `DefinedTermSet` with `DefinedTerm` entries.
- `/help` uses visible FAQ content and matching `FAQPage`.

## Internal Linking

- Header now includes `Learn`.
- Footer now includes a `Resources` group with Learning Center, Guides, PDF Glossary and Help Center.
- Homepage includes a compact `Learn about PDFs` section.
- Tool pages now include a lightweight `Learn more about this task` block.
- Topic hubs link to relevant tools, related hubs and selected guides.
- Foundation guides link back to `/learn`, `/pdf-tools` and related resources.

## SEO

- Every new route has a unique title, description, canonical, OpenGraph and Twitter metadata.
- New routes are included in `app/sitemap.ts`.
- New foundation guides reuse `/guides/[slug]` to avoid duplicate routing patterns.
- Editorial hubs are differentiated by intent: basics, conversion, organization, editing, security, images, troubleshooting and comparisons.

## Tests

Playwright coverage was extended to verify:

- `/learn`
- `/guides`
- all eight learning hubs
- `/pdf-glossary`
- `/help`
- all new foundation guide routes
- header and footer resource navigation
- homepage editorial section
- canonical tags
- JSON-LD scripts
- sitemap inclusion
- guide search behavior

## Lighthouse

Production Lighthouse was run on `/learn` after deployment:

- Performance: 99
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Production Notes

Deployment should be performed through the existing GitHub to Vercel pipeline after validation.

## Known Limits

- The Help Center intentionally remains one page. More help pages should only be created when Search Console or support questions prove distinct demand.
- The Learning Center starts with existing clusters plus seven foundation guides. Future additions should follow Search Console signals and avoid duplicating current guide intent.
- The current visuals are editorial diagrams and branded captures-style assets. Future guide-specific screenshots can be added when a page needs more concrete step-by-step evidence.

## Next Recommended Publications

- Add foundation content only where Search Console shows impressions.
- Expand PDF security explanations if Protect PDF or Unlock PDF queries grow.
- Add focused troubleshooting guides when real user errors recur.
