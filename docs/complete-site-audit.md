# LiftPDF Complete Site Audit

Date: 2026-07-10

Production audited: https://liftpdf.com

Scope: homepage, catalog, category pages, trust pages, all 17 tool pages, technical SEO files, QPDF assets, analytics presence, production headers, Lighthouse, local validation and e2e baseline.

No product code was changed during this audit.

## Executive Summary

LiftPDF is in a strong V1 state. The application is fast, stable, fully static where possible, and the core browser-side positioning is credible. All audited production pages returned HTTP 200, no client-side runtime errors were captured, no mobile or desktop horizontal overflow was found, QPDF WASM is served correctly, and local validation passes.

The main blockers before scaling traffic are not PDF engine problems. They are product trust and growth details:

1. Footer links to `/terms` and `/contact` return 404.
2. GA4 is implemented in code but not active in production because no measurement ID is present in the rendered page.
3. Homepage metadata is too generic: description is only `Fast PDF Tools Online`.
4. Homepage has no JSON-LD schema.
5. Category and trust pages do not expose page-specific OpenGraph images in production.
6. Lighthouse reports accessibility issues on tool cards because `aria-label="Open {tool}"` hides visible card text from the accessible name calculation.
7. Homepage mobile Lighthouse performance is lower than the rest of the site due to DOM size and main-thread work.
8. Sitemap uses `new Date()` for every route, which makes `lastmod` less meaningful.

None of these are catastrophic. They are the kind of issues that separate a technically good product from a polished commercial product.

## Validation Results

Local validation:

| Command | Result | Notes |
| --- | --- | --- |
| `npm run lint` | Passed | No ESLint errors |
| `npm run typecheck` | Passed | TypeScript clean |
| `npm run build` | Passed | 34 static pages generated |
| `npm run test:e2e` | Passed | 45 passed, 5 skipped |

Production route audit:

| Area | Result |
| --- | --- |
| HTML pages audited | 28 |
| HTTP 200 pages | 28 / 28 |
| Console errors | 0 |
| Page errors | 0 |
| Failed critical requests | 0 |
| Desktop overflow | 0 pages |
| Mobile overflow | 0 pages |
| H1 count | 1 per audited page |
| Missing image alt | 0 detected |
| Buttons without accessible names | 0 detected |

Critical assets:

| Asset | Status | Content-Type | Notes |
| --- | ---: | --- | --- |
| `/robots.txt` | 200 | `text/plain` | OK |
| `/sitemap.xml` | 200 | `application/xml` | OK |
| `/manifest.webmanifest` | 200 | `application/manifest+json` | OK |
| `/qpdf/qpdf.js` | 200 | `application/javascript` | OK |
| `/qpdf/qpdf.wasm` | 200 | `application/wasm` | OK |

Production headers:

| Header | Status |
| --- | --- |
| HTTPS | Active |
| HSTS | Active |
| COOP | `same-origin` |
| COEP | `require-corp` |
| QPDF WASM MIME | Correct |

## Lighthouse Summary

Representative production pages were tested with Lighthouse.

| Page | Device | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | Desktop | 100 | 96 | 100 | 100 | 0.4 s | 0 | 20 ms |
| `/` | Mobile | 85 | 96 | 100 | 100 | 1.9 s | 0 | 540 ms |
| `/pdf-tools` | Desktop | 100 | 98 | 100 | 100 | 0.4 s | 0 | 20 ms |
| `/jpg-to-pdf` | Desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 40 ms |
| `/merge-pdf` | Desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 10 ms |
| `/protect-pdf` | Desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 | 60 ms |
| `/pdf-to-text` | Desktop | 100 | 100 | 100 | 100 | 0.5 s | 0.016 | 70 ms |

Interpretation:

- Tool pages are excellent.
- Homepage desktop is excellent.
- Homepage mobile is acceptable but not premium enough for a flagship landing page.
- Accessibility is generally strong, but the homepage and catalog have specific card-label issues.

## Page Coverage

Audited production pages:

- `/`
- `/pdf-tools`
- `/pdf-converter`
- `/pdf-editor`
- `/pdf-security`
- `/pdf-image-tools`
- `/organize-pdf`
- `/about`
- `/privacy`
- `/security`
- `/why-liftpdf`
- `/jpg-to-pdf`
- `/png-to-pdf`
- `/images-to-pdf`
- `/pdf-to-jpg`
- `/pdf-to-png`
- `/merge-pdf`
- `/split-pdf`
- `/compress-pdf`
- `/rotate-pdf`
- `/add-page-numbers`
- `/watermark-pdf`
- `/delete-pages`
- `/extract-pages`
- `/reorder-pages`
- `/protect-pdf`
- `/unlock-pdf`
- `/pdf-to-text`

## Key Findings

### Critical

#### 1. Footer contains broken links

Evidence:

- `https://liftpdf.com/terms` returns 404.
- `https://liftpdf.com/contact` returns 404.
- Both links are visible in the global footer.

Impact:

- Trust issue for users.
- Bad UX.
- Bad crawler signal.
- Weakens legal/commercial credibility.

Recommendation:

- Either create real `/terms` and `/contact` pages, or remove the links until they exist.
- For a public PDF tool site, creating both pages is the better option.

Priority: Critical.

#### 2. Analytics is not active in production

Evidence:

- Code supports `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Production HTML search found no `googletagmanager`, `gtag`, or `G-` measurement marker.

Impact:

- No reliable growth data.
- Cannot measure tool conversion, downloads, errors or top pages.
- Search Console alone will not explain product behavior.

Recommendation:

- Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel production environment.
- Redeploy.
- Verify `tool_open`, upload, conversion, download and error events.

Priority: Critical for growth, not for current functionality.

### Important

#### 3. Homepage meta description is too weak

Evidence:

- Homepage description length is 21 characters: `Fast PDF Tools Online`.

Impact:

- Search snippet is generic.
- Does not communicate browser processing, privacy or tool breadth.
- Underuses the highest-authority page.

Recommendation:

- Replace with a stronger description around 140-160 characters:
  `Free PDF tools to convert, merge, split, compress, protect and edit files directly in your browser. Private, fast and no upload required.`

Priority: Important.

#### 4. Homepage has no JSON-LD schema

Evidence:

- `schemaCount` for `/` is 0.
- Tool/category/trust pages generally expose 1 schema block.

Impact:

- Missed opportunity for Organization, WebSite and SearchAction structured data.
- Not a ranking magic bullet, but the homepage should be the canonical entity page.

Recommendation:

- Add Organization + WebSite schema on homepage.
- Include site name, URL, logo, description, and potential SearchAction if site search is intended.

Priority: Important.

#### 5. Category and trust pages miss page-specific OG images

Evidence:

- Tool pages expose route-specific WebP OG images.
- Category/trust pages returned `ogImage: null` in page-level production audit.

Impact:

- Shared links for category/trust pages are less polished.
- Weakens brand consistency across social and messaging previews.

Recommendation:

- Create or assign category OG images:
  - `/pdf-tools`
  - `/pdf-converter`
  - `/pdf-editor`
  - `/pdf-security`
  - `/pdf-image-tools`
  - `/organize-pdf`
  - trust pages.

Priority: Important.

#### 6. Tool cards have accessible-name mismatch

Evidence:

- Lighthouse reports `label-content-name-mismatch`.
- Affected examples use `aria-label="Open JPG to PDF"` while visible text includes title, description, badges and button text.

Impact:

- Accessibility score drops on homepage/catalog.
- Voice control users may not be able to activate links using visible text.

Recommendation:

- Remove unnecessary `aria-label` from full-card links when visible text already describes the link, or make the accessible name include the visible title.
- Prefer natural link text over custom labels.

Priority: Important.

#### 7. Small homepage contrast issue

Evidence:

- Lighthouse reports contrast around 4.01-4.36 for small muted text in animated hero cards.

Impact:

- Homepage accessibility score drops from 100 to 96.
- Small supporting copy is harder to read on mobile.

Recommendation:

- Use `text-foreground/70` or a slightly darker muted token for 12px text on white cards.

Priority: Important.

#### 8. Homepage mobile performance is good but not flagship-grade

Evidence:

- Mobile Lighthouse Performance: 85.
- TBT: 540 ms.
- DOM size: 1,172 elements.
- Main-thread work: 5.5 s.

Impact:

- Not broken, but the homepage is now the main launch page and should feel very fast on mobile.

Recommendation:

- Reduce DOM depth in homepage visual sections.
- Consider rendering fewer full tool cards on mobile before search interaction.
- Reduce icon duplication where possible.
- Keep the premium feel, but trim the most expensive decorative DOM.

Priority: Important.

### Medium

#### 9. Sitemap `lastmod` is generated with `new Date()`

Evidence:

- `app/sitemap.ts` sets `lastModified: new Date()` for all routes.

Impact:

- Every build marks all pages as freshly modified.
- This is common, but not ideal. Search engines prefer meaningful `lastmod`.

Recommendation:

- Use static release date, git commit date, or per-content last updated data.

Priority: Medium.

#### 10. Footer legal/commercial structure is incomplete

Evidence:

- Privacy and Security exist.
- Terms and Contact links exist but are 404.
- No explicit abuse/contact/report issue page.

Impact:

- Trust gap compared with Adobe/Smallpdf/iLovePDF.
- Especially relevant for security/password tools.

Recommendation:

- Add minimal but real pages:
  - Terms
  - Contact
  - optionally Responsible disclosure / security contact.

Priority: Medium to Important.

#### 11. Category pages are technically solid but visually less memorable than the new homepage

Evidence:

- Category pages score well.
- Their OG image is missing.
- They are structurally competent but not as distinctive as Homepage V2.

Impact:

- Category pages may rank but convert less strongly than tool pages.

Recommendation:

- Future polish pass: add category-specific visual identity and richer internal linking modules.

Priority: Medium.

#### 12. Homepage has high link density and long mobile scroll

Evidence:

- Homepage has 54 links and 1,172 DOM elements.
- Mobile page height in Playwright is very long.

Impact:

- Fine for SEO, but mobile users may need clearer shortcuts.

Recommendation:

- Keep Featured Tools strong.
- Consider a collapsed or paginated catalog on mobile after the first available tools.

Priority: Medium.

#### 13. GA event architecture exists but cannot be verified without production GA ID

Evidence:

- `lib/analytics.ts`, `components/tools/tool-analytics.tsx`, and `hooks/use-tool-analytics.ts` exist.
- No GA script present in production HTML.

Impact:

- Implementation cannot be trusted until production events are visible in GA DebugView or Realtime.

Recommendation:

- After adding GA ID, verify events with real tool usage.

Priority: Medium.

## Strengths

### Product

- Clear positioning: free, private, browser-based PDF tools.
- 17 functioning tools cover a strong V1 PDF suite.
- Security tools are unusually credible because QPDF WASM provides real encryption/decryption rather than fake protection.
- Tool workflows are consistent after prior design-system work.

### Technical

- Next.js static output is healthy.
- No runtime crash detected across production routes.
- COOP/COEP headers are correctly applied.
- QPDF WASM is served with the correct MIME type.
- No obvious sensitive file exposure found in audited routes.
- Build and TypeScript are clean.

### SEO

- Every audited page has a unique H1.
- Tool pages have unique titles, descriptions, canonicals and OG images.
- Sitemap and robots are accessible.
- Internal linking is dense.
- FAQ/guide content exists across tool pages.

### UX

- Homepage V2 now feels like a real product.
- Tool pages are more consistent than most early-stage utility sites.
- Upload-first workflows are understandable.
- Mobile has no horizontal overflow.

### Accessibility

- Buttons generally have accessible names.
- Images audited have alt attributes.
- Focus/accessibility test coverage exists in e2e.
- Remaining Lighthouse issues are specific and fixable.

## Weaknesses vs Premium Competitors

Compared with Adobe, Smallpdf, iLovePDF and PDF24, LiftPDF is technically leaner and more private, but weaker in institutional trust.

LiftPDF currently lacks:

- Terms page.
- Contact page.
- visible support channel.
- brand/legal entity signals.
- production analytics.
- homepage entity schema.
- polished social previews for category/trust pages.

The product feels fast and useful, but it still needs a few credibility surfaces before it feels like a fully established company.

## Tool Family Assessment

| Family | Status | Notes |
| --- | --- | --- |
| Image to PDF | Strong | Premium UI, e2e covered, higher bundle due shared image/PDF logic |
| PDF to Image | Strong | Good UX and export handling, representative Lighthouse excellent |
| Organize PDF | Strong | Merge/Split/Delete/Extract/Reorder covered in e2e |
| Edit PDF | Strong | Rotate, Watermark, Page Numbers functional and consistent |
| Security | Strong technically | Protect/Unlock are a differentiator, but trust/legal pages must be complete |
| Text extraction | Strong and honest | Correctly does not claim OCR |

## SEO Assessment

Score: 8.7 / 10

What is strong:

- Indexable static routes.
- Tool-specific metadata.
- Canonicals.
- Sitemap/robots.
- Internal linking.
- SEO images for tool pages.

What holds it back:

- Homepage description too short.
- Homepage missing schema.
- Category/trust pages missing visible OG image metadata.
- Broken footer links.
- Content scale still depends on future editorial execution.

## UX Assessment

Score: 8.9 / 10

What is strong:

- Homepage now has product motion and hierarchy.
- Tool pages are coherent.
- Upload and action flows are clear.
- Mobile works without overflow.

What holds it back:

- Legal/contact footer links break trust.
- Homepage mobile scroll is long.
- Some category pages feel less premium than homepage/tool pages.

## Performance Assessment

Score: 9.0 / 10

What is strong:

- Desktop Lighthouse is excellent.
- Tool pages are fast despite PDF capability.
- Heavy PDF logic appears isolated to relevant routes.

What holds it back:

- Homepage mobile TBT at 540 ms.
- Homepage DOM size is above the Lighthouse ideal.
- Static assets use `max-age=0, must-revalidate`; acceptable on Vercel, but QPDF WASM could benefit from stronger immutable caching if deployment strategy allows.

## Accessibility Assessment

Score: 8.8 / 10

What is strong:

- No missing image alts detected.
- No unnamed buttons detected.
- e2e catches runtime error states.

What holds it back:

- Full-card links use aria labels that do not include visible text.
- Small muted hero text fails strict contrast.
- `/pdf-tools` has a heading-order warning.

## Trust Assessment

Score: 8.2 / 10

What is strong:

- Privacy message is coherent and technically true for browser-side tools.
- Security page exists.
- Protect/Unlock behavior is backed by QPDF WASM.

What holds it back:

- Missing Terms and Contact pages.
- No visible support channel.
- No transparent product limitation page.
- Analytics not yet active, which limits ability to detect real user pain.

## Top Priorities

### Critical

1. Create or remove `/terms` and `/contact` links.
2. Configure GA4 production environment and verify events.

### Important

3. Upgrade homepage meta description.
4. Add homepage Organization/WebSite schema.
5. Fix full-card link accessible-name mismatch.
6. Improve small muted text contrast in homepage hero cards.
7. Add OG images/metadata to category and trust pages.
8. Reduce homepage mobile DOM/main-thread work.

### Medium

9. Replace sitemap `new Date()` with meaningful last modified dates.
10. Add a lightweight contact/support path.
11. Polish category pages to match Homepage V2.
12. Recheck mobile Lighthouse after trimming homepage DOM.
13. Verify GA DebugView events after env setup.

### Optional

14. Add a public changelog or product status page.
15. Add a “Known limitations” trust page for browser-side PDF processing.
16. Add WebSite SearchAction schema if site search becomes a first-class feature.
17. Create category-specific social preview images.

## Evidence Files

Generated artifacts:

- `artifacts/complete-site-audit/route-audit.json`
- `artifacts/complete-site-audit/lighthouse-summary.json`
- `artifacts/complete-site-audit/lighthouse-home-desktop.json`
- `artifacts/complete-site-audit/lighthouse-home-mobile.json`
- `artifacts/complete-site-audit/lighthouse-pdf-tools-desktop.json`
- `artifacts/complete-site-audit/lighthouse-jpg-to-pdf-desktop.json`
- `artifacts/complete-site-audit/lighthouse-merge-pdf-desktop.json`
- `artifacts/complete-site-audit/lighthouse-protect-pdf-desktop.json`
- `artifacts/complete-site-audit/lighthouse-pdf-to-text-desktop.json`

Note: Playwright direct navigation to `/qpdf/qpdf.wasm` did not behave like a normal document route, but `curl -I` confirmed the asset is served correctly as `application/wasm`.

## Final Scores

| Category | Score |
| --- | ---: |
| Technical stability | 9.4 / 10 |
| SEO foundation | 8.7 / 10 |
| UX | 8.9 / 10 |
| Performance | 9.0 / 10 |
| Accessibility | 8.8 / 10 |
| Trust | 8.2 / 10 |
| Product completeness | 9.0 / 10 |
| Growth readiness | 7.8 / 10 |

Global score: 8.7 / 10.

## Launch Readiness Verdict

LiftPDF is ready to be used publicly as a V1 product.

It is not yet ready to be pushed hard with paid acquisition or large backlink outreach until the broken footer links and analytics activation are fixed. Those are small tasks with high leverage.

The product itself is much stronger than the remaining issues. The next best work is not another tool. It is trust completion, analytics activation, and homepage/category SEO refinement.
