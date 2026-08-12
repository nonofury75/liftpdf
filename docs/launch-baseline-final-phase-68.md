# LiftPDF Phase 68 - Final Pre-Acquisition Baseline

Date: 2026-08-12

## Baseline Availability

```text
GA4_EXPORT_FOUND = NO
SEARCH_CONSOLE_EXPORT_FOUND = NO
PRE_ACQUISITION_BASELINE_FINAL = PARTIAL
```

No real GA4 or Search Console export was found in the project folder. This baseline is therefore operationally frozen for production health and launch assets, but not metrically closed for GA4/GSC performance.

## Official Baseline Fields

| Field | Value |
|---|---|
| BASELINE_DATE | 2026-08-12 |
| GA4_USERS | NOT_AVAILABLE |
| GA4_SESSIONS | NOT_AVAILABLE |
| GA4_SUCCESSFUL_JOBS | NOT_AVAILABLE |
| GSC_CLICKS | NOT_AVAILABLE |
| GSC_IMPRESSIONS | NOT_AVAILABLE |
| GSC_CTR | NOT_AVAILABLE |
| GSC_POSITION | NOT_AVAILABLE |
| INDEXED_PAGES | NOT_AVAILABLE |
| PRODUCTION_HEALTH | HEALTHY |
| SITEMAP_URLS | 134 |
| V1_TOOLS | 17 |
| V1_TAG | `v1.0.0` |
| CURRENT_BRANCH | `main` |

## North Star Metric

Official North Star Metric:

```text
SUCCESSFUL PDF JOBS = conversion_completed
```

Reason: current LiftPDF tools fire `conversion_completed` only after the tool-specific export workflow reports success. `download_completed` remains a secondary downstream signal because a user can complete a job and delay or repeat download.

## Baseline Closure Requirement

Before declaring `PRE_ACQUISITION_BASELINE_FINAL = YES`, import real exports and fill:

- GA4 users/sessions/pageviews;
- GA4 event counts for the full tool funnel;
- Search Console clicks/impressions/CTR/position;
- Search Console indexed page count.

