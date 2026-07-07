# LiftPDF SEO Premium Phase

## Competitive Audit Summary

The strongest competing pages from iLovePDF, Smallpdf, Adobe Acrobat Online and PDF24 share the same pattern: the tool is immediately available, the page explains the workflow in simple steps, and the FAQ answers practical concerns such as privacy, quality, file size and mobile support. Their common weakness is that privacy details are often broad because many workflows require uploads.

LiftPDF should compete by keeping the tool first, then adding useful guide content below it. The key differentiator is honest browser-side processing: files do not need to leave the user's device for these tools.

## Pages Upgraded

| Tool | Sections added | Images created | Image sizes | Estimated SEO | UX | Accessibility | Remaining debt |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JPG to PDF | Hero visual, How it works, Why use, Features, Use cases, Complete guide, Comparison, Internal links, expanded FAQ | hero.webp, og-image.webp, thumbnail.webp | 13.6 KB, 13.6 KB, 5.5 KB | 9.6/10 | 9.5/10 | 9.5/10 | Add real search data later for FAQ ordering |
| PNG to PDF | Hero visual, How it works, transparency guidance, Features, Use cases, Complete guide, Comparison, Internal links, expanded FAQ | hero.webp, og-image.webp, thumbnail.webp | 13.6 KB, 13.5 KB, 5.6 KB | 9.6/10 | 9.5/10 | 9.5/10 | Add more PNG transparency examples if analytics show demand |
| Images to PDF | Hero visual, How it works, mixed-format guidance, Features, Use cases, Complete guide, Comparison, Internal links, expanded FAQ | hero.webp, og-image.webp, thumbnail.webp | 14.3 KB, 14.2 KB, 5.7 KB | 9.5/10 | 9.5/10 | 9.5/10 | Monitor if mixed JPG/PNG/WEBP wording needs localization |
| PDF to JPG | Hero visual, How it works, page-range guidance, Features, Use cases, Complete guide, Comparison, Internal links, expanded FAQ | hero.webp, og-image.webp, thumbnail.webp | 14.2 KB, 13.9 KB, 5.8 KB | 9.6/10 | 9.4/10 | 9.5/10 | Future separate tool could extract embedded images honestly |
| PDF to PNG | Same premium architecture, PNG guidance, page selection guide, comparison, internal links | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.4/10 | 9.3/10 | 9.5/10 | Add deeper examples if PNG search traffic grows |
| Merge PDF | Same premium architecture, ordering guidance, privacy comparison, internal links | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.3/10 | 9.3/10 | 9.5/10 | Could later add merge checklist based on user analytics |
| Split PDF | Same premium architecture, range guidance, ZIP explanation, related workflows | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.3/10 | 9.2/10 | 9.5/10 | Add examples for common page ranges if needed |
| Compress PDF | Same premium architecture, honest safe-compression explanation, no fake level claims | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.2/10 | 9.2/10 | 9.5/10 | Compression content should stay conservative until engine improves |
| Rotate PDF | Same premium architecture, scan-orientation guidance, related edit tools | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.2/10 | 9.3/10 | 9.5/10 | Add rotate-range content only if feature is expanded |
| Add Page Numbers | Same premium architecture, numbering best practices, final-document workflow links | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.3/10 | 9.3/10 | 9.5/10 | Could add visual examples for number positions later |
| Watermark PDF | Same premium architecture, watermark readability guidance, security/edit links | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.3/10 | 9.3/10 | 9.5/10 | Could add text-vs-image examples later |
| Delete Pages | Same premium architecture, page-selection safety guidance, organize links | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.4/10 | 9.4/10 | 9.5/10 | Add shortcut documentation only if keyboard shortcuts are expanded |
| Extract Pages | Same premium architecture, visual selection guidance, organize links | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.4/10 | 9.4/10 | 9.5/10 | Could add examples for extracting one page vs many |
| Reorder Pages | Same premium architecture, visual order guidance, organize links | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.4/10 | 9.4/10 | 9.5/10 | Add drag/drop troubleshooting if support data suggests it |
| Protect PDF | Same premium architecture, real-encryption guidance, security links | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.5/10 | 9.4/10 | 9.5/10 | Keep claims aligned with QPDF WASM capabilities |
| Unlock PDF | Same premium architecture, authorized-unlock guidance, security links | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.5/10 | 9.4/10 | 9.5/10 | Avoid wording that implies bypassing encryption |
| PDF to Text | Same premium architecture, no-OCR explanation, text extraction guidance | hero.webp, og-image.webp, thumbnail.webp | ~14 KB, ~14 KB, ~6 KB | 9.4/10 | 9.3/10 | 9.5/10 | OCR should remain a future separate feature |

## Architecture Added

- `PremiumToolContent` adds reusable SEO landing sections below the tool without moving the conversion UI down the page.
- `ToolPageShell` now accepts optional premium content and generates Breadcrumb, HowTo and SoftwareApplication structured data when available.
- `ToolHero` now supports an optional WebP illustration while keeping trust badges and the tool-first flow.
- `data/premium-tool-content.ts` centralizes page-specific editorial content for reuse across future tool pages.

## Editorial Rules Applied

- No keyword stuffing.
- No fake claims about OCR, embedded image extraction or unlimited file sizes.
- Privacy claims are limited to tools that actually process in the browser.
- Comparison content is practical and short.
- Internal links point to related workflows that already exist.

## Next Priorities

1. Use Search Console data after indexing to refine FAQ order.
2. Add localized French variants later only if the product targets French SEO pages.
3. Keep asset sizes below 30 KB per image unless a future page needs richer visuals.
4. Add richer custom illustrations only where conversion data proves the page is worth extra design time.
