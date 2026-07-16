# Google Indexation Recovery Audit

Date: 2026-07-15

## Executive Summary

Google Search Console reports several LiftPDF URLs as **Detected, currently not indexed**. The technical baseline is healthy: production is live, sitemap is submitted, robots/canonical are valid, pages return 200, OpenGraph exists, schema exists and Lighthouse has previously been strong.

The likely issue is not a single technical blocker. It is a mix of:

1. **Young domain / low authority** in extremely competitive PDF SERPs.
2. **Thin category pages** for `/organize-pdf`, `/pdf-converter`, `/pdf-editor`, `/pdf-image-tools`.
3. **Tool pages without supporting clusters yet** for many high-volume tools.
4. **Similarity between image/PDF converter pages**, especially before Google has enough authority signals to trust all variants.
5. **Strong competing pages from Adobe, Smallpdf, iLovePDF and PDF24** with older domains, many backlinks, deeper tool ecosystems and often localized or help content.

Important: this is not a reason to panic. "Detected, currently not indexed" often means Google knows the URL but has not yet spent crawl/indexing budget on it, or has not yet decided the page is sufficiently distinct and valuable relative to competing URLs.

## Pages Audited

- `/compress-pdf`
- `/images-to-pdf`
- `/jpg-to-pdf`
- `/organize-pdf`
- `/pdf-converter`
- `/pdf-editor`
- `/pdf-image-tools`
- `/pdf-to-jpg`
- `/pdf-to-png`
- `/pdf-to-text`
- `/png-to-pdf`
- `/rotate-pdf`
- `/split-pdf`

## Production Measurements

Measured from `https://liftpdf.com` on 2026-07-15.

| Page | HTTP | Words | H1 | H2 | JSON-LD | FAQ details | Unique internal links | Canonical | OG |
| --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- | --- |
| `/compress-pdf` | 200 | 1243 | Compress PDF Online | 19 | 2 | 1 | 27 | OK | OK |
| `/images-to-pdf` | 200 | 1301 | Images to PDF Converter | 18 | 2 | 1 | 24 | OK | OK |
| `/jpg-to-pdf` | 200 | 1628 | JPG to PDF Converter | 20 | 2 | 1 | 25 | OK | OK |
| `/organize-pdf` | 200 | 271 | Organize PDF Online \| LiftPDF | 6 | 2 | 1 | 25 | OK | OK |
| `/pdf-converter` | 200 | 316 | PDF Converter Online \| LiftPDF | 6 | 2 | 1 | 24 | OK | OK |
| `/pdf-editor` | 200 | 298 | PDF Editor Online \| LiftPDF | 6 | 2 | 1 | 24 | OK | OK |
| `/pdf-image-tools` | 200 | 255 | PDF Image Tools \| LiftPDF | 6 | 2 | 1 | 23 | OK | OK |
| `/pdf-to-jpg` | 200 | 1389 | PDF to JPG Converter | 18 | 2 | 1 | 23 | OK | OK |
| `/pdf-to-png` | 200 | 1239 | PDF to PNG Converter | 18 | 2 | 1 | 24 | OK | OK |
| `/pdf-to-text` | 200 | 1151 | PDF to Text | 19 | 2 | 1 | 25 | OK | OK |
| `/png-to-pdf` | 200 | 1340 | PNG to PDF Converter | 18 | 2 | 1 | 24 | OK | OK |
| `/rotate-pdf` | 200 | 1105 | Rotate PDF Online | 18 | 2 | 1 | 25 | OK | OK |
| `/split-pdf` | 200 | 1218 | Split PDF Online | 19 | 2 | 1 | 24 | OK | OK |

## Competitor Patterns

Public SERP/page review shows a consistent pattern:

- **Adobe Acrobat Online** ranks because it combines huge domain authority, trusted brand/entity signals, full tool pages, "how to" sections, FAQs, security claims and deep internal links across Acrobat tools. Adobe pages also often mention related tools such as compress, merge, delete, reduce file size and conversions.
- **Smallpdf** ranks because it has mature tool pages, strong brand demand, platform trust claims, device compatibility content, FAQs, many tool links and supporting blog pages. Its pages often target both tool intent and informational intent.
- **iLovePDF** ranks because it has exact-match tool pages, a simple product grid, broad localization, huge internal-link density and long-standing authority in PDF tool queries.
- **PDF24** ranks because it has very broad tool coverage, old indexed pages, many "100% free" utility pages, OS/platform support copy, Q&A blocks and a large all-tools hub.

Specific public examples observed:

- Adobe PDF to JPG page has a detailed HowTo section, device/browser support, security/privacy explanation and FAQ.
- Adobe JPG to PDF page has FAQ around image quality, multiple images and Acrobat workflows.
- Smallpdf JPG to PDF and PDF to JPG pages include FAQ, device support, no-signup/free claims and related workflows.
- PDF24 JPG to PDF, PDF to JPG, Images to PDF, Compress PDF and PDF Converter pages include simple "how easy it is" sections, platform support and Q&A.
- Smallpdf Split PDF and Rotate PDF pages include workflow copy, trust claims and cross-links to its broader suite.

## Why Google Indexes Some LiftPDF Pages First

Pages such as Merge PDF, Protect PDF, Delete Pages, Extract Pages and Reorder Pages likely got indexed earlier because:

- they had stronger recent internal attention and e2e validation;
- the organize-family pages received richer tool-specific work and Search Console opportunity reinforcement;
- Extract/Delete/Reorder match clearer long-tail intents with less ambiguity than broad converter hubs;
- Protect/Unlock have a stronger unique claim because true QPDF WASM encryption/decryption is more distinctive;
- Merge PDF now has an entire content cluster, giving Google supporting context and internal links.

The non-indexed pages are mostly in two groups:

1. **High-volume converter tools** where competition is brutal and LiftPDF authority is still low.
2. **Category hub pages** that are thin, similar and probably not yet valuable enough to index independently.

## Page-by-Page Audit

### `/compress-pdf`

Status:

- 1243 words.
- Title, description, canonical, OG and schema present.
- FAQ is honest about safe client-side compression.
- Strong internal linking.

Content quality:

- Good honesty: no fake Low/Balanced/Maximum modes.
- Good differentiation: safe browser-side rebuild, no fake advanced compression.
- Weakness: searchers expect meaningful file reduction. LiftPDF's current engine is honest but not competitive with server-side image recompression.

Competitor comparison:

- Adobe explicitly describes automatic optimization and image/file-size reduction.
- PDF24 highlights adjustable quality and better compression for image PDFs.
- Smallpdf/iLovePDF are perceived as stronger compression products because users expect visible shrinkage.

Likely cause:

- **Authority + product capability mismatch vs SERP expectation.**

Confidence: High.

Recommendation:

- Do not add fake compression levels.
- Add a stronger "What this compressor can and cannot reduce" section.
- Add examples: text PDFs, image PDFs, already optimized PDFs.
- Add a "when to use Compress PDF after Merge/JPG to PDF" section.
- Build one supporting guide later: "Why did my PDF not get smaller?"

Priority: IMPORTANT.

Do not modify urgently if resources are limited.

### `/images-to-pdf`

Status:

- 1301 words.
- Solid premium content.
- Canonical/OG/schema present.
- Overlaps with JPG to PDF and PNG to PDF.

Content quality:

- Useful for mixed-format workflows.
- Explains JPG/PNG/WEBP.
- Still close semantically to JPG to PDF and PNG to PDF.

Competitor comparison:

- Adobe has broader image-to-PDF page covering JPG, PNG, BMP, HEIC, TIFF.
- Smallpdf has image-to-PDF with connected workflows and multiple image formats.
- PDF24 has Images to PDF with Q&A and user-oriented use cases.

Likely cause:

- **Cannibalization / similarity with JPG to PDF and PNG to PDF, plus authority.**

Confidence: High.

Recommendation:

- Clarify unique intent: "mixed image formats to one PDF".
- Add a comparison block: JPG to PDF vs PNG to PDF vs Images to PDF.
- Add examples: receipts + screenshots + WEBP downloads in one document.
- Link more strongly from JPG/PNG pages and guides.

Priority: IMPORTANT.

### `/jpg-to-pdf`

Status:

- 1628 words.
- Stronger after Phase 32.
- Has real screenshots, common problems, cluster pages and dedicated OG.
- Canonical/OG/schema present.

Content quality:

- Now strong.
- Clear UX, layout options, privacy, quality advice.
- Strongest image-to-PDF page on LiftPDF.

Competitor comparison:

- Adobe and Smallpdf rank with authority and known brand.
- PDF24 has old indexed utility page and platform support.
- LiftPDF is now differentiated by browser processing and detailed quality/problem cluster.

Likely cause:

- **Google has not recrawled/re-evaluated after recent cluster publication + young domain authority.**

Confidence: High.

Recommendation:

- Do not rewrite now.
- Request indexing in Search Console after sitemap recrawl.
- Wait for crawl data after the new cluster.
- Build backlinks to this page and supporting guides.

Priority: DO NOT MODIFY NOW.

### `/organize-pdf`

Status:

- 271 words.
- Category hub.
- Title/canonical/OG/schema present.
- Thin compared with tool pages.

Content quality:

- Useful as a navigation hub.
- Not enough unique informational value.
- Some wording still says "future page management workflows" despite delete/extract/reorder being available. That weakens freshness/trust.

Competitor comparison:

- iLovePDF/PDF24 category hubs are broad all-tools/category ecosystems.
- Smallpdf and Adobe often rely on tool pages more than category hubs, but their internal authority is high.

Likely cause:

- **Content insufficient + category page lower unique value.**

Confidence: Very high.

Recommendation:

- Add a real category guide: when to merge, split, delete, extract, reorder.
- Add workflow decision table.
- Add "Organize PDF problems" section.
- Remove outdated "future workflows" copy.
- Add links to the Merge and Extract clusters.

Priority: CRITICAL among category pages.

### `/pdf-converter`

Status:

- 316 words.
- Category hub.
- Has many coming-soon tools in the Convert category.

Content quality:

- Too thin for a competitive "PDF converter" query.
- The page says upcoming Word/Excel/PowerPoint converters exist in the catalogue, but those tools are not available. That may dilute intent.

Competitor comparison:

- Adobe PDF converter page covers many file types and uses Acrobat authority.
- Smallpdf PDF converter page explains supported formats and links to many live converters.
- PDF24 converter page lists a very large set of active conversions.

Likely cause:

- **Content insufficient + unavailable tools dilute intent + authority.**

Confidence: Very high.

Recommendation:

- Do not try to rank this for "PDF converter" yet.
- Keep it as a hub, but clarify "available now" vs "coming soon".
- Add a concise matrix of currently available converters only.
- Add internal links to JPG/PDF image cluster.
- Consider no major SEO push until more converter tools exist.

Priority: IMPORTANT but not first.

### `/pdf-editor`

Status:

- 298 words.
- Category hub.
- Lists edit tools such as rotate, watermark, page numbers, compress.

Content quality:

- "PDF editor" is a broad and difficult intent. Users expect text editing, annotations, signatures, form filling and sometimes OCR.
- LiftPDF's current edit category is real but narrower.

Competitor comparison:

- Adobe and Smallpdf have broad editing suites.
- PDF24 has many edit-related tools.
- iLovePDF has edit PDF and surrounding tools.

Likely cause:

- **Intent mismatch + thin content + authority.**

Confidence: Very high.

Recommendation:

- Do not over-optimize for "PDF editor" as if LiftPDF edits text.
- Reposition as "PDF editing tools" or "simple PDF edit tasks".
- Add clear sections: rotate, watermark, page numbers, compress.
- Explain what LiftPDF does not do yet: direct text editing, OCR, signatures.

Priority: IMPORTANT.

### `/pdf-image-tools`

Status:

- 255 words.
- Category hub.
- Very thin.
- Covers image-to-PDF and PDF-to-image.

Content quality:

- Clear concept but underdeveloped.
- Strong potential because LiftPDF has several good image tools.
- Currently less informative than the individual tools.

Competitor comparison:

- PDF24 has broad PDF-to-images and images-to-PDF pages.
- Adobe has Image to PDF, JPG to PDF, PNG to PDF, PDF to JPG/PNG.
- Smallpdf has image/PDF pages and supporting blog content.

Likely cause:

- **Content insufficient + lower unique value than child tools.**

Confidence: Very high.

Recommendation:

- Add a decision table: JPG to PDF, PNG to PDF, Images to PDF, PDF to JPG, PDF to PNG.
- Add format guidance: JPG vs PNG vs WEBP vs PDF.
- Add internal links to new JPG cluster.
- Add Google Images-friendly screenshots.

Priority: CRITICAL among category pages.

### `/pdf-to-jpg`

Status:

- 1389 words.
- Strong tool page.
- Canonical/OG/schema present.
- Real conversion options and page-range UX.

Content quality:

- Good.
- Honest about quality labels.
- Could benefit from supporting cluster and deeper troubleshooting.

Competitor comparison:

- Adobe PDF to JPG page has HowTo, security copy, device support, FAQ and strong brand.
- Smallpdf has PDF2JPG blog content plus tool page.
- PDF24 has PDF to JPG plus PDF to Images ecosystem.

Likely cause:

- **High competition + no supporting cluster yet + authority.**

Confidence: High.

Recommendation:

- Do not rewrite heavily now.
- Future cluster should target: "PDF to JPG", "PDF to image", "convert one PDF page to JPG", "PDF to JPG high quality", "PDF to JPG on iPhone/Windows".
- Add one or two troubleshooting sections only if Search Console shows impressions.

Priority: IMPORTANT, likely next after Compress/PDF-to-JPG Search Console signals.

### `/pdf-to-png`

Status:

- 1239 words.
- Strong tool page.
- Description is short at 63 characters.
- Similar structure to PDF to JPG.

Content quality:

- Good but very close to PDF to JPG.
- PNG-specific value should be clearer: lossless-looking output, screenshots, transparency expectations, sharp text/graphics.

Competitor comparison:

- Adobe has PDF to PNG page.
- PDF24 often groups PDF to Images instead of separate JPG/PNG.
- Smallpdf historically emphasizes PDF to JPG more, but has image-converter ecosystem.

Likely cause:

- **Similarity with PDF to JPG + lower search demand + authority.**

Confidence: High.

Recommendation:

- Strengthen PNG-specific differentiation.
- Improve meta description.
- Add "PDF to PNG vs PDF to JPG" section.
- Add use cases: screenshots, diagrams, transparent design workflows where applicable.

Priority: IMPORTANT.

### `/pdf-to-text`

Status:

- 1151 words.
- Strong, honest page.
- Clear no-OCR positioning.
- Canonical/OG/schema present.

Content quality:

- Good. Honest limitation is a strength.
- Could use a dedicated content cluster later because "extract text from PDF" has many long-tail intents.

Competitor comparison:

- Adobe and Smallpdf often push PDF to Word/OCR/AI workflows.
- PDF24 has PDF to Text / OCR-related pages.
- LiftPDF is more honest for selectable-text extraction.

Likely cause:

- **Authority + possibly lower internal link equity than organize/security tools.**

Confidence: Medium-high.

Recommendation:

- Do not modify now.
- Build guide later: "PDF has no selectable text" / "PDF to Text vs OCR".
- Link from PDF Converter and PDF Editor hubs.

Priority: DO NOT MODIFY NOW unless Search Console shows impressions.

### `/png-to-pdf`

Status:

- 1340 words.
- Strong page.
- Similar to JPG to PDF and Images to PDF.

Content quality:

- Good. PNG transparency explanation exists.
- Could be more uniquely PNG-focused compared with JPG.

Competitor comparison:

- Adobe PNG to PDF emphasizes multiple formats and trusted file security.
- PDF24 has general image conversion pages.
- Smallpdf has broader image-to-PDF pages.

Likely cause:

- **Similarity/cannibalization with JPG/Images to PDF + authority.**

Confidence: High.

Recommendation:

- Strengthen unique PNG intent: screenshots, transparency, UI captures, diagrams.
- Add "PNG to PDF vs JPG to PDF" internal section.
- Do not create a full cluster until Search Console shows real impressions.

Priority: OPTIONAL/IMPORTANT depending on impressions.

### `/rotate-pdf`

Status:

- 1105 words.
- Good tool page.
- Canonical/OG/schema present.

Content quality:

- Solid but not as distinctive as Delete/Extract/Reorder.
- Rotation has simple intent, so Google may need fewer pages, and established competitors dominate.

Competitor comparison:

- Smallpdf Rotate PDF emphasizes preserve layout, works on any device and suite breadth.
- PDF24 has old utility page.
- Adobe has tool plus brand trust.

Likely cause:

- **Authority + lower content uniqueness.**

Confidence: Medium-high.

Recommendation:

- Add only if needed: "rotate one page vs all pages", "why PDF pages are sideways", "rotate scanned PDFs".
- Do not overbuild now.

Priority: DO NOT MODIFY NOW unless impressions rise.

### `/split-pdf`

Status:

- 1218 words.
- Strong page.
- Good FAQ.
- Real tool with preview and ranges.

Content quality:

- Good.
- Query is highly competitive.
- Possible cannibalization with Extract Pages because both discuss selected pages/ranges.

Competitor comparison:

- Adobe Split PDF describes divider lines and up to 20 split files.
- Smallpdf Split PDF has strong trust claims and broad workflow.
- PDF24 has long-standing split page.

Likely cause:

- **High competition + possible overlap with Extract Pages + authority.**

Confidence: High.

Recommendation:

- Clarify distinction between Split PDF and Extract Pages.
- Add short "Split vs Extract" section.
- Build supporting cluster only after Search Console signals.

Priority: IMPORTANT but behind category fixes.

## Cause Classification Table

| Page | Primary probability | Confidence | Secondary causes |
| --- | --- | --- | --- |
| `/compress-pdf` | Authority + product capability mismatch | High | SERP expects aggressive compression |
| `/images-to-pdf` | Cannibalization/similarity | High | Authority, child-page overlap |
| `/jpg-to-pdf` | Google has not reprocessed new cluster + authority | High | Very competitive query |
| `/organize-pdf` | Content insufficient | Very high | Some outdated copy, category thinness |
| `/pdf-converter` | Content insufficient + unavailable tools dilute intent | Very high | High competition |
| `/pdf-editor` | Intent mismatch + thin hub | Very high | Users expect broader editing |
| `/pdf-image-tools` | Content insufficient | Very high | Needs decision-table value |
| `/pdf-to-jpg` | Authority + no cluster yet | High | Very competitive |
| `/pdf-to-png` | Similarity with PDF to JPG | High | Lower demand, short description |
| `/pdf-to-text` | Authority / lower internal priority | Medium-high | Needs future no-OCR cluster |
| `/png-to-pdf` | Similarity with JPG/Images to PDF | High | Needs PNG-specific differentiation |
| `/rotate-pdf` | Authority + simple commodity intent | Medium-high | Competitors dominate |
| `/split-pdf` | Competition + overlap with Extract Pages | High | Needs clearer distinction |

## Priority Order for Recovery

### Priority 1: Category Hubs

1. `/pdf-image-tools`
2. `/organize-pdf`
3. `/pdf-converter`
4. `/pdf-editor`

Why:

- They are objectively thin.
- They help distribute internal link equity.
- They can clarify tool relationships and reduce cannibalization.
- They are safer to improve than rewriting already strong tool pages.

### Priority 2: High-Volume Tools With Existing Quality

1. `/pdf-to-jpg`
2. `/compress-pdf`
3. `/split-pdf`
4. `/pdf-to-png`

Why:

- They already have enough base content.
- They need targeted differentiators, not bulk text.
- They align with future cluster candidates.

### Priority 3: Image Conversion Family

1. `/images-to-pdf`
2. `/png-to-pdf`

Why:

- `/jpg-to-pdf` is now strong and should be observed first.
- These pages need unique positioning to avoid looking like variants of JPG to PDF.

## Pages Not To Modify Now

### `/jpg-to-pdf`

Reason:

- Just received a full content cluster.
- Has strongest image-tool content.
- Needs recrawl and Search Console observation.

### `/pdf-to-text`

Reason:

- Honest, useful page.
- No-OCR positioning is correct.
- Modify only after query data shows gaps.

### `/rotate-pdf`

Reason:

- Adequate page.
- Simple commodity intent.
- ROI of immediate edits is lower than category pages and PDF-to-image/compress pages.

## Realistic Improvements

No keyword stuffing. No "add 1000 words" for the sake of length.

### Category Pages

Add:

- decision tables;
- "which tool should I use?" sections;
- tool relationship diagrams;
- problem-based navigation;
- links to clusters;
- updated copy that reflects available tools;
- 4-6 richer FAQs based on actual tool differences.

### Tool Pages

Add only targeted sections:

- `/compress-pdf`: "why compression may not reduce size" and examples by PDF type.
- `/pdf-to-jpg`: "single page vs range vs all pages" and "JPG vs PNG output".
- `/pdf-to-png`: "when PNG is better than JPG" and "sharp screenshots/graphics".
- `/split-pdf`: "Split vs Extract" and "when to use ranges vs split every page".
- `/images-to-pdf`: "mixed formats vs JPG-only/PNG-only".
- `/png-to-pdf`: "transparent PNG on white PDF background" and "screenshots vs photos".

## Why Google Hesitates

Google is likely asking:

1. Is this new domain authoritative enough to index every PDF tool page?
2. Are these converter pages meaningfully different from each other?
3. Are category pages useful enough, or are they just navigational duplicates?
4. Does LiftPDF have enough external authority compared with Adobe, Smallpdf, iLovePDF and PDF24?
5. Are recent new clusters stable enough to crawl and index?

The answer is mixed:

- Tool pages are increasingly strong.
- Category hubs are thin.
- Authority is still early.
- New clusters need crawl time.

## Recovery Plan

### Week 1

- Request indexing for `/jpg-to-pdf`, `/guides/how-to-convert-jpg-to-pdf`, `/pdf-to-jpg`, `/compress-pdf`.
- Strengthen category hubs only.
- Do not rewrite JPG to PDF.

### Week 2

- Improve `/pdf-image-tools` and `/organize-pdf`.
- Add clearer internal links from category hubs to indexed pages and clusters.
- Check crawl stats and live URL inspection in Search Console.

### Week 3

- Improve `/pdf-converter` and `/pdf-editor`.
- Clarify available vs coming soon tools.
- Avoid making "PDF Converter" promise unavailable Office conversions.

### Week 4

- If impressions appear for `/pdf-to-jpg`, build or strengthen that cluster next.
- If Compress receives impressions but low indexing/clicks, add the honest compression troubleshooting guide.

## Final Answer

Google is likely indexing Merge PDF, Protect PDF, Delete Pages, Extract Pages and Reorder Pages earlier because those pages have clearer differentiated intent, stronger recent internal signals, and in some cases better unique product positioning.

Google is hesitating on Compress PDF, JPG/PNG/Images to PDF, PDF to JPG/PNG/Text, Rotate PDF and Split PDF mostly because LiftPDF is still a young domain in extremely competitive SERPs, and because some pages are either too similar to sibling pages or not yet supported by content clusters.

The clearest concrete weakness is not technical SEO. It is **content distinctiveness and authority distribution**, especially on category hubs.

The best next correction is not to rewrite every tool. It is to:

1. strengthen the thin category hubs;
2. wait for the newly published JPG to PDF cluster to be crawled;
3. improve only pages with Search Console impressions;
4. build authority through backlinks and content clusters.

