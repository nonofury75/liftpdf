# LiftPDF V1 Freeze Policy

Date: 2026-08-12

V1 is frozen for public launch.

## Allowed During Freeze

- Critical production bug fixes.
- Privacy/security fixes.
- Broken route/download fixes.
- Analytics consent bug fixes.
- Documentation corrections.
- Small copy clarifications for known limitations.
- Search Console title/meta fixes only when evidence is clear.

## Not Allowed During Freeze

- New PDF tools.
- New PDF engines.
- New QPDF/PDF.js/pdf-lib workflow rewrites.
- New P2 features.
- Mass SEO page batches.
- Doorway pages by device/country/platform.
- New analytics fields containing sensitive data.
- Backend upload workflows that weaken the local-processing promise.
- Visual redesigns that risk conversion before baseline data exists.

## Emergency Exception

A freeze exception is allowed only for:

- critical PDF corruption;
- password/file leak;
- broken Tier A download;
- production route outage;
- GA4 firing before consent;
- security header or WASM isolation regression affecting tool execution.

Every exception must include:

1. user impact;
2. root cause;
3. exact files changed;
4. tests run;
5. production verification;
6. rollback note.

## V1.1 Gate

Start V1.1 only after:

- at least 7 days of GA4/Search Console data;
- top conversion leaks are identified;
- top error-producing tools are known;
- no launch blocker is open;
- the next feature is selected from data, not taste.

