# LiftPDF Growth Implementation

Date: 2026-07-10

Production: `https://liftpdf.com`

Status: growth measurement foundation implemented.

## 1. Analytics Status

GA4 was not previously installed in the codebase.

Implemented:

- official Next.js App Router integration using `@next/third-parties/google`;
- conditional GA4 loading from `NEXT_PUBLIC_GA_MEASUREMENT_ID`;
- no analytics script is loaded when the environment variable is missing;
- shared analytics abstraction in `lib/analytics.ts`;
- reusable tool analytics hook in `hooks/use-tool-analytics.ts`;
- shared `ToolAnalytics` component in `ToolPageShell` for `tool_open`.

Activation required:

1. Create a GA4 web data stream for `https://liftpdf.com`.
2. Copy the Measurement ID, format `G-XXXXXXXXXX`.
3. Add it in Vercel:

```txt
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. Redeploy production.
5. Confirm Realtime events in GA4.

## 2. Events Tracked

Official event names:

| Event | Meaning |
|---|---|
| `page_view` | GA4 default page view |
| `tool_open` | Tool page opened |
| `upload_started` | User selected or dropped files |
| `upload_completed` | File accepted and parsed enough for the tool |
| `conversion_started` | User clicked the primary action |
| `conversion_completed` | Output generated successfully |
| `download_started` | Download action triggered |
| `download_completed` | Download action was handed to the browser |
| `error_tool` | Tool-specific validation or processing error |

Privacy rule:

Analytics never sends:

- file names;
- document content;
- extracted text;
- passwords;
- raw file metadata;
- user-provided page ranges;
- watermark text.

Allowed event payload:

- tool name;
- route;
- file count;
- page count;
- output format;
- mode;
- status;
- error code;
- size bucket.

## 3. Current Instrumentation

Implemented:

- all tool pages send `tool_open` from `ToolPageShell`;
- Image to PDF family sends upload, conversion, download and error events:
  - `/jpg-to-pdf`
  - `/png-to-pdf`
  - `/images-to-pdf`
- PDF to Image family sends upload, conversion, download and error events:
  - `/pdf-to-jpg`
  - `/pdf-to-png`
- key PDF workflows now emit core funnel events:
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

The event payloads stay intentionally minimal and privacy-safe.

## 4. KPI Model

Product KPIs:

- visitors;
- sessions;
- tool opens;
- uploads;
- completed conversions;
- downloads;
- tool errors;
- completion rate;
- download rate;
- related-tool continuation.

SEO KPIs:

- indexed pages;
- impressions;
- clicks;
- CTR;
- average position;
- top queries;
- top pages;
- country split;
- device split.

Tool-level funnel:

```txt
tool_open
↓
upload_started
↓
upload_completed
↓
conversion_started
↓
conversion_completed
↓
download_started
↓
download_completed
```

## 5. Search Console Status

Code-level checks completed:

- `https://liftpdf.com/robots.txt` returns 200.
- `https://liftpdf.com/sitemap.xml` returns 200.
- `https://liftpdf.com/manifest.webmanifest` returns 200.
- canonical metadata exists on tested tool route.
- OpenGraph metadata exists on tested tool route.
- Twitter metadata exists on tested tool route.
- structured data exists on tested tool route.

Search Console account data was not available from the local CLI, so live indexation, impressions, clicks and query reports must be checked inside Google Search Console.

Required next steps:

1. Open Google Search Console.
2. Confirm property `https://liftpdf.com`.
3. Submit `https://liftpdf.com/sitemap.xml`.
4. Inspect:
   - `/`
   - `/pdf-tools`
   - `/jpg-to-pdf`
   - `/merge-pdf`
   - `/protect-pdf`
   - `/pdf-to-text`
5. Start weekly reporting using `docs/seo-monitoring.md`.

## 6. Lighthouse Results

Measured against production with Lighthouse CLI on 2026-07-10.

Important note:

Lighthouse warned that the local test device CPU was slower than expected. Scores should be treated as a baseline, not an absolute production-user score.

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---|---|---|
| `/` | 83 | 100 | 100 | 100 | 1.7 s | 0 | 680 ms |
| `/jpg-to-pdf` | 88 | 100 | 100 | 100 | 2.7 s | 0 | 350 ms |
| `/merge-pdf` | 90 | 100 | 100 | 100 | 2.7 s | 0 | 290 ms |
| `/protect-pdf` | 95 | 100 | 100 | 100 | 1.8 s | 0 | 250 ms |
| `/pdf-to-text` | 94 | 100 | 100 | 100 | 1.9 s | 0 | 280 ms |

Objective status:

- Accessibility: achieved.
- Best Practices: achieved.
- SEO: achieved.
- Performance: not yet achieved on every tested route in this Lighthouse environment.

Performance recommendations:

1. Re-run Lighthouse from Vercel Speed Insights or PageSpeed Insights for field/lab comparison.
2. Investigate homepage total blocking time.
3. Keep GA4 conditional and lightweight.
4. Avoid adding new third-party scripts.
5. Consider splitting non-critical homepage client components if field INP/TBT confirms a problem.

## 7. CRO Operating System

Use `docs/conversion-checklist.md`.

Weekly questions:

1. Which tools are opened most?
2. Which tools get uploads but not conversions?
3. Which errors happen most?
4. Which downloads fail to happen after success?
5. Which pages need stronger trust copy?

Do not run A/B tests until traffic is large enough for meaningful results.

## 8. Roadmap

Use `docs/growth-roadmap.md`.

Targets:

- 30 days: measurement and indexing baseline.
- 90 days: first reliable traffic and query clusters.
- 180 days: authority growth and content expansion based on data.
- 365 days: serious organic footprint if content and backlinks execute well.

## 9. Files Added Or Changed

Added:

- `lib/analytics.ts`
- `hooks/use-tool-analytics.ts`
- `components/tools/tool-analytics.tsx`
- `docs/seo-monitoring.md`
- `docs/conversion-checklist.md`
- `docs/growth-roadmap.md`
- `docs/growth-implementation.md`

Changed:

- `app/layout.tsx`
- `components/tools/tool-page-shell.tsx`
- `components/tools/image-to-pdf-tool.tsx`
- `components/tools/pdf-to-image-tool.tsx`
- `components/tools/merge-pdf-tool.tsx`
- `components/tools/split-pdf-tool.tsx`
- `components/tools/compress-pdf-tool.tsx`
- `components/tools/rotate-pdf-tool.tsx`
- `components/tools/add-page-numbers-tool.tsx`
- `components/tools/watermark-pdf-tool.tsx`
- `components/tools/delete-pages-tool.tsx`
- `components/tools/extract-pages-tool.tsx`
- `components/tools/reorder-pages-tool.tsx`
- `components/tools/protect-pdf-tool.tsx`
- `components/tools/unlock-pdf-tool.tsx`
- `components/tools/pdf-to-text-tool.tsx`
- `package.json`
- `package-lock.json`

## 10. Recommendations

Immediate:

1. Add the GA4 Measurement ID to Vercel.
2. Confirm Realtime events.
3. Submit sitemap in Search Console.
4. Create a weekly growth review using Search Console plus GA4.

Next:

1. Add a simple internal dashboard only after enough data exists.
2. Use real query data before creating new content.
3. Prioritize fixes from `error_tool` before adding features.
4. Re-run Lighthouse with PageSpeed Insights after GA4 is active.

## Conclusion

LiftPDF now has a clean growth measurement foundation.

The system is deliberately privacy-preserving and does not collect document names, document content, passwords or raw file details.

The next real unlock is not code. It is activation:

- add the GA4 Measurement ID;
- confirm events;
- connect Search Console data;
- review funnels weekly;
- make decisions from actual usage.
