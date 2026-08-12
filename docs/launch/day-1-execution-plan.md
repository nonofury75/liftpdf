# LiftPDF Launch Day 1 Execution Plan

Date: 2026-08-12

Do not change code during launch day unless a critical blocker appears.

## Order Of Operations

1. Save baseline.
   - Export GA4 users/sessions/events.
   - Export Search Console queries/pages/indexing.
   - Fill `docs/launch-baseline-final-phase-68.md`.

2. Production health check.
   - `/`
   - `/pdf-tools`
   - `/merge-pdf`
   - `/compress-pdf`
   - `/jpg-to-pdf`
   - `/protect-pdf`
   - `/sitemap.xml`
   - `/robots.txt`

3. Confirm analytics consent.
   - Reject: no GA4 requests.
   - Accept: GA4 Realtime session appears.
   - No sensitive payload.

4. Finalize Product Hunt assets.
   - Use `docs/launch/product-hunt-launch-kit.md`.
   - Use screenshots in `docs/launch/assets/`.
   - Do not publish until baseline exports are saved.

5. First acquisition channel.
   - Preferred Channel 1: Show HN, because it is clear, technical and attributable.
   - Alternative: Product Hunt if maker availability and assets are ready.

6. First directory batch.
   - Submit to 3 maximum on Day 1.
   - Recommended: AlternativeTo, SaaSHub, Uneed.

7. First backlink outreach batch.
   - Send 3-5 personalized messages maximum.
   - No generic blast.

8. Monitor.
   - GA4 Realtime.
   - `error_tool`.
   - Vercel production.
   - User replies/comments.

9. End-of-day KPI capture.
   - Users.
   - Sessions.
   - Successful PDF jobs.
   - Downloads.
   - Top tools.
   - Errors.
   - Referrals.
   - Organic clicks/impressions if available.

## J+3 Check

Capture:

- users;
- successful jobs;
- downloads;
- organic impressions;
- organic clicks;
- referrals;
- top tools;
- errors.

Compare against baseline. Do not over-interpret small samples.

## J+7 Check

Calculate:

- traffic delta;
- successful jobs delta;
- top acquisition source;
- top tool;
- worst funnel step;
- Search Console opportunity changes;
- new referring domains.

Allowed decisions:

- `DOUBLE_DOWN`
- `CONTINUE`
- `CHANGE_CHANNEL`
- `FIX_BUG`
- `IMPROVE_CONVERSION`

Not allowed:

- `BUILD_RANDOM_FEATURE`

