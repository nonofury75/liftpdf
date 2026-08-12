# LiftPDF Phase 67 - Analytics Privacy Audit

Date: 2026-08-12

## GA4 Configuration

| Item | Status |
|---|---|
| Measurement ID | `G-0EVEJXJRVL` |
| Environment variable | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| Analytics library | `lib/analytics.ts` |
| Consent component | `components/analytics/analytics-consent.tsx` |
| Tool hook | `hooks/use-tool-analytics.ts` |
| Tool open tracker | `components/tools/tool-analytics.tsx` |

## Consent Verification

Production check:

| Scenario | Result |
|---|---|
| Fresh visit + Reject analytics | 0 Google Analytics / Google Tag Manager network requests |
| Fresh visit + Accept analytics | GA4 script loaded for `G-0EVEJXJRVL` |
| Consent default | denied |
| Stored choice | `localStorage.liftpdf_analytics_consent` |
| User can change choice | Analytics preferences button remains available |

Observed production output:

```text
REJECT {"consent":"rejected","dataLayer":1,"hasGtag":true,"gaRequests":0}
ACCEPT {"consent":"accepted","dataLayer":7,"hasGtag":true,"gaRequests":8,"firstGa":"https://www.googletagmanager.com/gtag/js?id=G-0EVEJXJRVL"}
```

## Funnel Events

Expected V1 funnel:

```text
LANDING
-> TOOL_OPEN
-> UPLOAD_STARTED
-> UPLOAD_COMPLETED
-> CONVERSION_STARTED
-> CONVERSION_COMPLETED
-> DOWNLOAD_COMPLETED
```

Implemented event names:

| Event | Status |
|---|---|
| `tool_open` | PRESENT |
| `upload_started` | PRESENT |
| `upload_completed` | PRESENT |
| `conversion_started` | PRESENT |
| `conversion_completed` | PRESENT |
| `download_started` | PRESENT |
| `download_completed` | PRESENT |
| `error_tool` | PRESENT |

Events are centralized through `lib/analytics.ts` and `hooks/use-tool-analytics.ts`.

## Allowed Payload

`sanitizePayload()` only permits aggregate product fields:

- tool name;
- route;
- file count;
- page count;
- selected page count;
- output format;
- mode/status/error code;
- file size bucket;
- feature flags such as quality, workload class, protection type, password type, permissions preset, watermark layer.

## Forbidden Payload Audit

The analytics type and sanitizer do not include:

- filename;
- local path;
- PDF content;
- extracted text;
- password;
- owner password;
- watermark text;
- custom output filename;
- image metadata;
- EXIF;
- GPS;
- exact page range string;
- exact pixel/memory estimate.

## GA4 Report Access

GA4 Realtime / DebugView was not accessible from this Codex session. Network proof confirms the consent gate and the correct GA4 measurement ID after acceptance. The launch operator should capture a GA4 Realtime screenshot on launch day after performing one clean accepted-consent workflow.

## Verdict

GA4 consent before loading: YES  
Refusal respected: YES  
GA4 accepted path loads: YES  
Sensitive analytics payload found: NO  
Realtime GA4 UI verified in this session: NO  
Ready for privacy-safe acquisition: YES

