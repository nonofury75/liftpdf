# LiftPDF V1 Launch Checklist

Date: 2026-08-12

Checked items reflect conditions verified during Phase 65 and Phase 66.

- [x] Domain
- [x] HTTPS
- [x] www redirect
- [x] Search Console
- [x] Sitemap
- [x] Robots
- [x] Analytics consent
- [x] Privacy
- [x] Security
- [x] Terms
- [x] Contact
- [x] 17 tools smoke
- [x] Mobile
- [x] Firefox
- [x] Chromium
- [x] Full E2E
- [x] Vercel READY
- [x] Git clean
- [x] v1.0.0 tag
- [x] Known limitations published/available
- [x] Rollback documented

## Launch No-Go Conditions

Launch must stop if any of these appear:

- critical PDF corruption;
- password leak;
- file upload leak;
- broken production route;
- full E2E regression;
- broken download;
- domain or HTTPS failure;
- Vercel production not READY;
- release tag missing or on wrong commit.

## Non-Blocking Known Constraints

- minor cosmetic issue;
- rare browser limitation;
- known large-file constraint;
- PDF viewer-specific permission enforcement;
- missing OCR.

## Rollback

Rollback target for V1 is the commit tagged `v1.0.0`.

Simple rollback path:

1. Identify the Vercel deployment associated with `v1.0.0`.
2. Promote/redeploy that deployment from Vercel.
3. If needed, checkout `v1.0.0`, rebuild and push/deploy from that state.
