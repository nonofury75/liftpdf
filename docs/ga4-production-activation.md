# GA4 Production Activation

## Measurement ID

- GA4 measurement ID: `G-0EVEJXJRVL`
- Expected public environment variable: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0EVEJXJRVL`

## Current Analytics Architecture

LiftPDF analytics is centralized in:

- `lib/analytics.ts`
- `hooks/use-tool-analytics.ts`
- `components/tools/tool-analytics.tsx`
- `components/analytics/analytics-consent.tsx`

The previous direct `GoogleAnalytics` layout integration was removed. GA4 is now loaded only by the consent component after analytics has been accepted.

## Consent Status

- GA4 does not load when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is absent.
- GA4 does not load before analytics consent.
- Rejecting analytics stores `rejected` locally and blocks GA4 loading.
- Accepting analytics stores `accepted` locally, loads GA4 and sends page/tool events.
- The user can reopen preferences through the persistent `Analytics preferences` button.
- `/cookies` explains analytics usage and consent withdrawal.
- `/privacy` now links to `/cookies` and documents optional analytics.

## Cross-Origin Isolation

- `Cross-Origin-Opener-Policy` remains `same-origin`.
- `Cross-Origin-Embedder-Policy` was changed from `require-corp` to `credentialless`.
- Reason: QPDF WASM still needs cross-origin isolation, while GA4's third-party script and collection endpoints must be allowed to load after consent without requiring Google to send Cross-Origin-Resource-Policy headers.
- Production verification confirmed `crossOriginIsolated=true`; Protect PDF created a PDF with `/Encrypt`; Unlock PDF removed `/Encrypt`.

## Privacy Controls

Events are limited to non-sensitive product usage fields:

- tool name
- route
- file count
- page count
- output format
- mode
- status
- error code
- coarse file-size bucket

The code does not intentionally send:

- file names
- document contents
- extracted text
- passwords
- local file paths
- email addresses
- tool input text
- manually added IP addresses

## Events Covered

- `page_view`
- `tool_open`
- `upload_started`
- `upload_completed`
- `conversion_started`
- `conversion_completed`
- `download_started`
- `download_completed`
- `error_tool`

## Vercel Environment Variables

- Production: configured with `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Preview: not configured by CLI because Vercel required a non-production Git branch and this repository currently only has `main`. Preview should be added manually in the Vercel UI for all Preview branches if the UI allows it, or after creating a real preview branch.

## Local Validation

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- `npm run test:e2e`: OK, 55 passed, 5 skipped

## Local Test Coverage Added

- GA4 scripts do not load locally when the measurement ID is absent.
- `/cookies` route is checked with canonical and JSON-LD through the Learning Center route suite.

## Production Verification

- Production URL: `https://liftpdf.com`
- Production deployment: `https://liftpdf-nmbrz4yax-rachator75010-5712s-projects.vercel.app`
- Commit: `7e64409`
- Vercel status: READY
- Reject scenario: consent banner visible, Reject Analytics clicked, then `/merge-pdf` opened. GA requests observed: `0`.
- Accept scenario: consent banner visible, Accept Analytics clicked, then `/`, `/learn`, `/jpg-to-pdf` and `/merge-pdf` visited.
- Network proof: `region1.google-analytics.com/g/collect` was requested with `tid=G-0EVEJXJRVL`.
- Tool event proof: the `/g/collect` POST body included `page_view`, `upload_started`, `upload_completed`, `conversion_started`, `conversion_completed`, `download_started` and `download_completed`.
- Error proof: invalid PDF flow queued `error_tool` with `error_code=files_not_ready`.
- Console errors: none observed during consent, merge, Protect PDF and Unlock PDF smoke tests.
- GA4 Realtime/DebugView: not directly verified in the Google Analytics UI from this session; production network proof confirms requests are sent to the correct GA4 measurement ID.

## Lighthouse

- `/`: Performance 99, Accessibility 100, Best Practices 100, SEO 100, CLS 0.
- `/jpg-to-pdf`: Performance 96, Accessibility 100, Best Practices 100, SEO 100, CLS 0.

## Final Status

- GA4 active: Yes
- Consent before loading: Yes
- Reject respected: Yes
- GA4 realtime verified: Not from GA UI; network proof verified
- Tool events verified: Yes
- Sensitive data sent: No intentional sensitive data
- Build: OK
- E2E: OK
- Vercel: READY
- Production: OK
