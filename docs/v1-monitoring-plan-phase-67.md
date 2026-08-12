# LiftPDF Phase 67 - V1 Monitoring Plan

Date: 2026-08-12

No new monitoring SaaS was installed during Phase 67.

## Current Signals

| Signal | Current source | Status |
|---|---|---|
| Deployment health | Vercel dashboard | READY documented in Phase 66; CLI token unavailable in this session. |
| Route uptime | Manual Playwright/request smoke | Production key routes 200. |
| Full regression | Playwright E2E | Last full V1 gate green in Phase 66. |
| Tool errors | GA4 `error_tool` after consent | Available after user accepts analytics. |
| Search visibility | Google Search Console | Available to account owner; not accessible in this session. |
| Runtime JS errors | Browser console/manual smoke | No dedicated SaaS installed. |

## Daily Checks

- Homepage 200.
- `/pdf-tools` 200.
- Tier A tool routes 200.
- `/sitemap.xml` 200.
- `/robots.txt` 200.
- GA4 Realtime receives accepted-consent sessions.
- `error_tool` spikes reviewed.
- Search Console Pages report checked for sudden crawl/indexing problems.

## Weekly Checks

- Full `npm run lint`.
- Full `npm run typecheck`.
- Full `npm run build`.
- Full `npm run test:e2e` before any release.
- Review top 10 error events by tool.
- Review top 20 Search Console queries.

## Recommended Post-V1 Additions

1. Uptime monitor for `/`, `/pdf-tools`, `/merge-pdf`, `/compress-pdf`, `/protect-pdf`, `/sitemap.xml`.
2. Privacy-reviewed runtime error monitoring such as Sentry, with PII/file-content scrubbing.
3. Vercel deployment failure notifications.
4. GA4 dashboard for tool funnel and errors.

## No-Go Alerts

Stop launch activity if any appear:

- production route down;
- download broken on Tier A tool;
- password/file leak;
- GA4 firing before consent;
- sustained conversion errors after deploy;
- sitemap unavailable;
- Vercel production not READY.

