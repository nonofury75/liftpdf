# LiftPDF Phase 65 - Release Reliability Closure

Date: 2026-08-12

## Scope

Phase 65 was a release reliability closure pass. No new product feature was added.

The work focused on:

- stabilizing the Playwright production harness;
- closing the Watermark PDF SEO image optimizer 402 issue;
- revalidating the Phase 64 Watermark PDF below-content release;
- fixing one real Merge PDF state race exposed during full E2E;
- validating local production and the deployed production domain.

## Initial Project Verification

- Local project: `C:\Users\zidan\Desktop\LiftPDF`
- Remote: `https://github.com/nonofury75/liftpdf.git`
- Branch: `main`
- Initial workspace: clean
- Phase 64 commits present before this phase:
  - `2acd4bc Document below-content watermark production validation`
  - `1596c85 Implement true below-content watermark`
  - `06453d6 Spike true below-content PDF watermarking`

## Reliability Issues Found

### Playwright Web Server Command

The previous Playwright web server command was:

```text
npm run build && npm run start -- -H 127.0.0.1 -p 3020
```

On this Windows/npm setup, `npm run start -- -H 127.0.0.1 -p 3020` printed npm help and exited without reliably starting `next start`. This explains the earlier full-run hang and sitemap connection instability.

Fix:

```text
npm run build && npx next start -H 127.0.0.1 -p 3020
```

### Watermark SEO Image 402

Production direct image URLs were valid:

- `https://liftpdf.com/images/seo/watermark-pdf/hero.webp` -> 200 `image/webp`
- `https://liftpdf.com/images/seo/watermark-pdf/thumbnail.webp` -> 200 `image/webp`

The optimized URLs returned 402:

- `/_next/image?url=%2Fimages%2Fseo%2Fwatermark-pdf%2Fhero.webp&w=640&q=75`
- `/_next/image?url=%2Fimages%2Fseo%2Fwatermark-pdf%2Fthumbnail.webp&w=640&q=75`

Vercel headers included:

```text
X-Matched-Path=/images/seo/watermark-pdf/hero.webp
X-Vercel-Error=OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED
```

Conclusion: the source images were present and crawlable. The failure was in Vercel Image Optimization for those Watermark transforms.

Fix:

- Added `lib/image-optimizer-bypass.ts`.
- Applied `unoptimized` only for `/images/seo/watermark-pdf/*`.
- Covered both the main `ToolHero` image and the lower `PremiumToolContent` hero/thumbnail images.
- Did not disable Next Image optimization globally.

Local production verification after the fix:

- `/watermark-pdf` rendered with zero Watermark `/_next/image` requests.
- Direct hero image: 200.
- Direct thumbnail image: 200.
- Lazy thumbnail loaded with `naturalWidth: 640`, `naturalHeight: 480`.

Production verification after deployment:

- `/watermark-pdf`: HTTP 200.
- No Watermark `/_next/image` requests.
- Direct hero image: 200 `image/webp`.
- Direct thumbnail image: 200 `image/webp`.
- No critical failed requests.
- No console errors.

### Merge PDF State Race

During the post-fix full E2E run, this test exposed a real race:

```text
merge PDF isolates invalid protected and empty files without losing valid files
```

The failure occurred after removing a problematic file. The remaining valid files could stay stuck in `checking`, leaving `Merge PDF` disabled.

Root cause:

- `hydratePdfMetadata` checked `filesRef.current` before React had synchronized the newest uploaded files into the ref.
- Small PDFs could finish metadata hydration before the ref contained their IDs.
- The metadata update was discarded, so ready files stayed blocked.

Fix:

- Added a synchronous `updateFiles(...)` wrapper in `components/tools/merge-pdf-tool.tsx`.
- Kept `filesRef.current` synchronized before calling `setFiles(...)`.
- Reworked metadata hydration to update by ID synchronously and revoke unused object URLs only when the file was actually removed.

Validation:

- Isolated Merge test passed after the fix.
- Full E2E passed after the fix.
- Production Merge smoke generated `merged.pdf`, 2 pages, parsed by `pdf-lib`.

## Files Modified

- `playwright.config.ts`
- `components/tools/merge-pdf-tool.tsx`
- `components/tools/premium-tool-content.tsx`
- `components/tools/tool-hero.tsx`
- `lib/image-optimizer-bypass.ts`
- `tests/e2e/product-audit.spec.ts`

## Tests And Validation

### Local Static Validation

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK

### Full E2E

Full run after reliability fixes:

```text
77 passed, 23 skipped
Duration: 8.3m
```

Final full run after the centralized Watermark image optimizer bypass:

```text
77 passed, 23 skipped
Duration: 8.9m
```

### Sitemap Stability

Targeted sitemap-covering Playwright test:

```text
npx playwright test tests/e2e/product-audit.spec.ts -g "JPG to PDF guide cluster routes render" --project=chromium
```

Executed five times against a local production server:

- Run 1: PASS
- Run 2: PASS
- Run 3: PASS
- Run 4: PASS
- Run 5: PASS

No `ECONNRESET` reproduced.

### Phase 64 Watermark Regression

The full E2E suite includes the deep Phase 64 test:

```text
watermark PDF supports verified below-content text and image layers
```

It verifies:

- above-content text watermark;
- below-content text watermark;
- below-content page range;
- below-content odd pages;
- below-content even pages;
- below-content image watermark;
- link preservation;
- AcroForm preservation;
- first content stream order for below-content placement;
- pixel occlusion comparison proving below-content rendering is visually behind page content.

Local mobile Watermark UI check:

- text watermark control visible;
- image watermark control visible;
- above-content layer visible;
- below-content layer visible;
- all pages visible;
- odd pages visible;
- even pages visible;
- page range visible;
- no horizontal overflow;
- no critical failed requests;
- no console errors.

### Production Validation

Deployment:

- Commit: `eee15c2 Harden LiftPDF release reliability`
- Vercel deployment: `dpl_AGwudXJtphY34ghzszqtmAYLNreR`
- URL: `https://liftpdf-1ol3gyqmx-rachator75010-5712s-projects.vercel.app`
- Alias: `https://liftpdf.com`
- Status: READY

Production route checks:

- `/`: 200
- `/watermark-pdf`: 200
- `/merge-pdf`: 200
- `/sitemap.xml`: 200

Production Watermark image checks:

- hero direct URL: 200 `image/webp`
- thumbnail direct URL: 200 `image/webp`
- no Watermark `/_next/image` requests from rendered page
- no critical failed requests
- no console errors

Production tool smoke:

- Merge PDF:
  - uploaded two generated PDFs;
  - generated `merged.pdf`;
  - parsed with `pdf-lib`;
  - page count: 2;
  - no critical failed requests;
  - no console errors.
- Watermark PDF:
  - uploaded a generated one-page PDF;
  - generated `watermarked.pdf`;
  - downloaded via visible fallback link;
  - parsed with `pdf-lib`;
  - page count: 1;
  - no critical failed requests;
  - no console errors.

Production mobile checks:

- `/watermark-pdf`: 200, no overflow, no critical failed requests, no console errors.
- `/merge-pdf`: 200, no overflow, no critical failed requests, no console errors.

## Temporary Files And Git Hygiene

- Local `tmp/` artifacts used for smoke tests were deleted.
- `.gitignore` already covers:
  - `test-results/`
  - `playwright-report/`
  - `artifacts/`
  - `tests/e2e/.fixtures/`
  - `tests/e2e/.fixtures-*/`
- No Playwright artifacts or temporary fixtures were committed.

## Known Notes

- Playwright/PDF.js still prints non-fatal warnings about `standardFontDataUrl` during some PDF rendering tests. These warnings did not fail tests and predate this reliability closure.
- Watermark automatic download can vary by browser/test timing, but the visible fallback `Download PDF` link was validated in production and returns a valid PDF.

## Final Release Verdict

- Release reliability closed: YES
- Full E2E stable: YES
- Sitemap ECONNRESET reproduced after fix: NO
- Sitemap repeated validation: 5/5 PASS
- Watermark SEO image 402 fixed: YES
- Watermark image direct URLs: 200
- Watermark optimizer requests from page: 0
- Phase 64 below-content regression: PASS
- Merge PDF race fixed: YES
- Production deployed: YES
- Vercel status: READY
- Production smoke: PASS
- Git temporary artifacts committed: NO
