# LiftPDF Phase 67 - Launch Baseline

Date: 2026-08-12

Scope: public launch baseline after V1 freeze. No product feature, PDF engine, SEO page batch, or UI redesign was added.

## Release State

| Item | Status | Evidence |
|---|---|---|
| Production domain | HEALTHY | `https://liftpdf.com` returned 200 in Phase 67 smoke. |
| V1 release tag | PRESENT | `v1.0.0` exists and resolves to `10f81bd`. |
| Current HEAD | `3edca66` | Documentation commit after V1 release freeze. |
| Branch | `main` | Verified locally. |
| Remote | `https://github.com/nonofury75/liftpdf.git` | Verified locally. |
| Version | `1.0.0` | `package.json`. |
| V1 tools | 17 | `docs/v1-tool-capability-matrix.md`. |
| V1 launch verdict | READY | `docs/v1-release-final-report.md`. |

## Production Smoke Baseline

Checked on 2026-08-12:

| Route | HTTP |
|---|---:|
| `/` | 200 |
| `/pdf-tools` | 200 |
| `/merge-pdf` | 200 |
| `/compress-pdf` | 200 |
| `/jpg-to-pdf` | 200 |
| `/watermark-pdf` | 200 |
| `/protect-pdf` | 200 |
| `/sitemap.xml` | 200 |
| `/robots.txt` | 200 |

Sitemap:

- HTTP: 200
- URL count: 134
- Domain: `https://liftpdf.com`
- Robots sitemap line: `Sitemap: https://liftpdf.com/sitemap.xml`

## Analytics Baseline

Direct GA4 property report access was not available in this Codex session.

| Metric | Baseline |
|---|---|
| Active users | NOT_AVAILABLE |
| Sessions | NOT_AVAILABLE |
| Page views | NOT_AVAILABLE |
| Tool opens | NOT_AVAILABLE |
| Upload starts | NOT_AVAILABLE |
| Conversion starts | NOT_AVAILABLE |
| Downloads | NOT_AVAILABLE |
| Errors | NOT_AVAILABLE |
| Top routes | NOT_AVAILABLE |
| Top countries | NOT_AVAILABLE |
| Top devices | NOT_AVAILABLE |

Action: capture the first GA4 export manually at launch day + 24h, then repeat daily for the first 30 days using `docs/launch-daily-dashboard-template.md`.

## Search Console Baseline

Direct Search Console report access was not available in this Codex session.

| Metric | Baseline |
|---|---|
| Indexed pages | NOT_AVAILABLE |
| Discovered not indexed | NOT_AVAILABLE |
| Total impressions | NOT_AVAILABLE |
| Total clicks | NOT_AVAILABLE |
| Average CTR | NOT_AVAILABLE |
| Average position | NOT_AVAILABLE |
| Top queries | NOT_AVAILABLE |
| Top pages | NOT_AVAILABLE |

Action: export Performance and Pages reports before starting outreach. Use the route groups in `docs/search-console-opportunity-phase-67.md`.

## Tier A Launch Tools

Because GA4/GSC live reports were not accessible, Tier A is selected from product utility, documented SEO intent, and likely global demand. Mark observed traffic as `NOT_AVAILABLE` until GA4/Search Console confirms.

| Rank | Tool | Route | Reason |
|---:|---|---|---|
| 1 | Merge PDF | `/merge-pdf` | Universal workflow, many business/admin use cases, strong product depth after Phases 51/52. |
| 2 | JPG to PDF | `/jpg-to-pdf` | High global demand from phone photos, forms, IDs, school/work submissions. |
| 3 | Compress PDF | `/compress-pdf` | Strong differentiator after real QPDF modes and metadata removal. |
| 4 | PDF to JPG | `/pdf-to-jpg` | Common conversion intent with large-document guard. |
| 5 | Protect PDF | `/protect-pdf` | Privacy/security differentiator: local AES-256 and permissions. |

## First Decision Rule

Do not publish new SEO batches until at least seven days of data is collected:

- indexed pages;
- exact queries;
- impressions per URL;
- guide-to-tool clicks;
- tool funnel drop-offs;
- error rates;
- possible cannibalization.

