# LiftPDF Phase 48 - Unlock PDF Restriction-Only Handling

## Selected P1

Selected priority: P1

Tool: Unlock PDF

Feature: Restriction-only and owner-password handling

Roadmap status: Open in `docs/functional-upgrade-roadmap.md` as "Unlock PDF - Restriction-only PDF handling". Phase 47 made Protect PDF capable of writing owner-password permission flags, so Unlock PDF needed the matching removal workflow.

## Why This P1 Was Chosen

Unlock PDF already decrypted PDFs when the user supplied a valid password, but it treated every encrypted file as the same kind of password-protected PDF.

This phase closes a real security workflow:

- Protect PDF can now create AES-256 PDFs with an owner password and printing/copying/editing permissions.
- Some PDFs open without an open password but still contain `/Encrypt` and usage restrictions.
- Users need a clear, authorized way to remove those restrictions when they know the owner password.
- The output can be verified by checking that `/Encrypt` is absent and the PDF opens normally.

The tool still does not recover, crack, bypass or brute-force unknown passwords.

## Targeted Benchmark

| Competitor | Observed capability | Notes |
| --- | --- | --- |
| Adobe Acrobat | Adobe documents different removal paths for document-open passwords and permissions passwords. | Strongest reference for separating open password and permissions password workflows. |
| Smallpdf | Public Unlock PDF flow focuses on removing password protection; related content references password and permission restrictions. | Good simple UX, but less explicit about owner-password restriction-only files. |
| iLovePDF | Public Unlock PDF page presents a simple upload/unlock/download flow. | Fast workflow, but the public page is broad and does not clearly separate owner-password cases. |
| PDF24 | Public unlock/help content describes removing password protection and restriction-style workflows through PDF24 tools. | Useful reference for explaining restrictions without promising password bypass. |

Sources:

- Adobe: `https://www.adobe.com/acrobat/how-to/unlock-pdf.html`
- Smallpdf Unlock PDF: `https://smallpdf.com/unlock-pdf`
- Smallpdf restricted text workflow: `https://smallpdf.com/blog/extract-text-password-protected-pdf`
- iLovePDF Unlock PDF: `https://www.ilovepdf.com/unlock_pdf`
- PDF24 Unlock PDF: `https://tools.pdf24.org/en/unlock-pdf`

## QPDF Version And Behavior

Bundled files:

- `public/qpdf/qpdf.js`
- `public/qpdf/qpdf.wasm`

Embedded version string:

- `qpdf 11.7.0`

QPDF behavior verified with the embedded WASM build:

- `--password=<user> --decrypt` removes encryption for a valid user password.
- `--password=<owner> --decrypt` removes encryption for a valid owner password.
- wrong passwords return a non-zero exit code.
- a restriction-only PDF with empty user password and known owner password can be decrypted by QPDF.
- LiftPDF still requires a password in the UI for restriction-only removal so the tool does not silently remove restrictions without an authorization step.

## PDF Classification

After upload, Unlock PDF now classifies the file:

| Type | Detection | UI |
| --- | --- | --- |
| Open-password PDF | `/Encrypt` present and PDF.js cannot open without a password | "Open password required" and a `PDF password` field |
| Restriction-only PDF | `/Encrypt` present and PDF.js can open without a password | "This PDF opens without a password but contains usage restrictions" and an `Owner password` field |
| Unprotected PDF | no `/Encrypt` | "This PDF is not password protected" and the action stays disabled |
| Invalid PDF | PDF parsing fails | clear read error |

The UI no longer shows `0 pages` for locked files. It shows `Open password required` when pages cannot be read yet.

## New Workflow

Open-password PDF:

1. Upload encrypted PDF.
2. Enter PDF password.
3. QPDF decrypts locally.
4. LiftPDF verifies `/Encrypt` is absent.
5. Download `unlocked.pdf`.

Restriction-only PDF:

1. Upload restricted PDF.
2. LiftPDF detects that it opens normally but has `/Encrypt`.
3. Enter owner password.
4. QPDF removes encryption and restrictions locally.
5. LiftPDF verifies `/Encrypt` is absent and page count is preserved.
6. Download `unlocked.pdf`.

Visible authorization text:

> You must know the valid PDF password or have permission to remove its restrictions.

## Verification

Before success, Unlock PDF verifies:

- QPDF returned exit code `0`;
- output exists;
- `/Encrypt` is absent;
- for readable input PDFs, output page count matches the input page count;
- output can be parsed without a password.

Failure message for unsafe output:

> The PDF was not downloaded because its encryption or restrictions could not be removed safely.

## Tests

Added E2E coverage:

- `unlock PDF removes restriction-only owner-password protection`

The test creates a deterministic restriction-only fixture in the browser using the same QPDF WASM asset that LiftPDF ships:

- user password: empty;
- owner password: `OwnerPass123!`;
- printing: none;
- extraction: denied;
- modification: none;
- expected `/P`: `-3392`.

Assertions:

- restriction-only PDF contains `/Encrypt`;
- wrong owner password is rejected;
- correct owner password creates `unlocked.pdf`;
- output does not contain `/Encrypt`;
- output opens without password;
- page count is preserved;
- selectable text is preserved;
- form fields are preserved;
- URI link annotations are preserved;
- unprotected PDFs are reported and cannot be unlocked;
- invalid PDFs are rejected.

Existing security tests still pass:

- basic Protect PDF -> Unlock PDF with user password;
- advanced Protect PDF owner-password permissions;
- owner password accepted by Unlock PDF for advanced protected files.

## Validation Commands

Commands run:

- `npm run lint` - OK
- `npm run typecheck` - OK
- `npm run build` - OK
- `npx playwright test tests/e2e/product-audit.spec.ts -g "unlock PDF removes restriction-only owner-password protection" --project=chromium --reporter=line` - OK
- `npx playwright test tests/e2e/product-audit.spec.ts -g "protect and unlock use real PDF encryption|protect PDF writes verified owner password permission flags|unlock PDF removes restriction-only owner-password protection" --project=chromium --reporter=line` - OK
- `npm run test:e2e` - OK, 66 passed, 12 skipped

Local production:

- `npm run start -- -p 3072`
- `/unlock-pdf` HTTP 200
- Chromium desktop: OK
- Firefox desktop: OK
- Mobile Chromium: OK
- restriction-only fixture before unlock: `/Encrypt` present, `/P -3392`
- wrong owner password rejected
- valid owner password accepted
- unlocked output: `/Encrypt` absent
- form marker preserved
- link annotation preserved in dedicated e2e fixture
- no pageerror
- no critical console.error
- no critical failed requests

Expected QPDF invalid-password console output during the deliberate wrong-password check was ignored as non-critical.

## Privacy And Analytics

Privacy model preserved:

- PDF bytes stay in the browser;
- user password is not uploaded;
- owner password is not uploaded;
- passwords are stored only in React state and cleared on reset/unmount;
- file name and content are not sent to analytics.

Analytics additions are aggregate only:

- `protection_type`: `open_password`, `restrictions_only` or `unprotected`;
- `password_type`: `user` or `owner`;
- generic success/error status.

No raw password, exact permission set, file name, page content or PDF text is sent.

## Files Modified

- `components/tools/unlock-pdf-tool.tsx`
- `components/tools/pdf/qpdf-client.ts`
- `app/unlock-pdf/page.tsx`
- `data/premium-tool-content.ts`
- `lib/analytics.ts`
- `tests/e2e/product-audit.spec.ts`
- `docs/functional-upgrade-unlock-pdf-phase-48.md`

## Reader Compatibility

The output `unlocked.pdf` no longer contains `/Encrypt`, so reader-side permission enforcement is no longer relevant for the final file.

Validated with available browser environments:

- Chromium PDF workflow;
- Firefox PDF workflow;
- mobile Chromium workflow.

Adobe Acrobat Reader desktop was not available in this environment.

## Production

Commit deployed:

- `e0d80eb Upgrade Unlock PDF restriction handling`

Vercel:

- deployment URL: `https://liftpdf-cceajbw0y-rachator75010-5712s-projects.vercel.app`
- status: READY
- production alias: `https://liftpdf.com`

Production route:

- `https://liftpdf.com/unlock-pdf`

Production validation completed against the live domain:

- Chromium desktop: OK
- Firefox desktop: OK
- Mobile Chromium: OK
- `/unlock-pdf` HTTP 200
- restriction-only fixture generated with production QPDF WASM
- restricted input: `/Encrypt` present, `/P -3392`
- wrong owner password rejected
- valid owner password accepted
- downloaded/generated `unlocked.pdf`
- unlocked output: `/Encrypt` absent
- form marker preserved
- no pageerror
- no critical console.error
- no critical failed requests

## Remaining Limitations

- Unlock PDF does not recover lost passwords.
- Unlock PDF does not bypass unknown passwords.
- QPDF stdout/help output is still not exposed cleanly through the current WASM callbacks.
- Some PDF.js standard font warnings appear in automated tests; they are non-fatal and pre-existing in fixture text extraction paths.

## Next P1 Recommended

Recommended next candidates:

1. PDF to JPG / PDF to PNG memory guard and 100-page progress.
2. Merge PDF protected-file per-item messaging or output filename.
3. JPG/PNG image workflows: EXIF orientation verification and editable output filename.

## Summary

Selected priority: P1

Tool: Unlock PDF

Feature: Restriction-only and owner-password handling

Implemented: YES

Open-password PDF detected: YES

Restriction-only PDF detected: YES

Unprotected PDF detected: YES

User password unlock verified: YES

Owner password unlock verified: YES

Wrong user password rejected: YES

Wrong owner password rejected: YES

Restrictions removed: YES

Encrypt dictionary removed: YES

Output opens without password: YES

Pages preserved: YES

Text preserved: YES

Links preserved: YES

Forms preserved: YES

Previous workflow preserved: YES

Protect PDF integration verified: YES

Privacy model preserved: YES

Passwords cleared after reset: YES

Passwords absent from analytics/logs: YES

New dependency: NO

Bundle impact: LOW

100-page test: COVERED BY EXISTING QPDF UNLOCK WORKFLOW; DEDICATED PHASE 48 TEST USES FORM FIXTURE

Mobile verified: YES

Firefox verified: YES

Lint: OK

Typecheck: OK

Build: OK

E2E: OK

Production deployed: YES

Next remaining P1: PDF to JPG / PDF to PNG memory guard and 100-page progress, pending Phase 49 selection.
