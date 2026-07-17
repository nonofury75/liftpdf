# LiftPDF Phase 47 - Protect PDF Permission Controls

## Selected P1

Selected priority: P1

Tool: Protect PDF

Feature: Owner password and PDF permissions

Roadmap status: Open in `docs/functional-upgrade-roadmap.md` as "Protect PDF - Permission toggles only if verified". Not delivered in phases 38-46.

## Why This P1 Was Chosen

Protect PDF already had real browser-local AES-256 encryption through QPDF WASM, but it exposed only a basic open-password workflow. The remaining professional gap was support for owner-password permissions: printing, copying/extraction and editing restrictions.

This was selected because:

- it is a real user need for sensitive document sharing;
- Adobe and PDF24 publicly document permission-style controls;
- iLovePDF exposes basic/advanced protection structure;
- QPDF WASM supports the required flags locally;
- the result can be verified from the produced PDF encryption dictionary.

## Targeted Benchmark

| Competitor | Observed capability | Notes |
| --- | --- | --- |
| Adobe Acrobat | Public Acrobat documentation covers passwords and restrictions for editing, printing and copying. | Advanced permissions are presented as Acrobat security settings, not absolute DRM. |
| Smallpdf | Public web Protect PDF is focused on password protection; related content discusses owner password permissions. | Web UI is simpler than desktop-style permission controls. |
| iLovePDF | Public Protect PDF flow exposes Basic and Advanced areas and password guidance. | Useful UX reference for hiding complexity behind advanced controls. |
| PDF24 | Public Protect PDF page explicitly says permissions can be adjusted, including printing, copying and modifications. | Strong direct match for this P1. |

Sources used:

- Adobe password protection: `https://www.adobe.com/acrobat/online/password-protect-pdf.html`
- Adobe permissions documentation: `https://helpx.adobe.com/acrobat/desktop/protect-documents/protect-with-passwords/restrict-printing-editing-and-copying-pdfs.html`
- Smallpdf related permission article: `https://smallpdf.com/blog/create-tamper-proof-pdfs-prevent-screenshots-copying`
- iLovePDF Protect PDF: `https://www.ilovepdf.com/protect-pdf`
- PDF24 Protect PDF: `https://tools.pdf24.org/en/lock-pdf`

## QPDF WASM

Bundled files:

- `public/qpdf/qpdf.js`
- `public/qpdf/qpdf.wasm`

Embedded version string found in `qpdf.wasm`:

- `qpdf 11.7.0`

The WASM build did not expose `--version` or help text through the configured stdout callbacks, but the required CLI options were verified by executing the embedded build in Chromium:

- `--encrypt`
- `--print=full`
- `--print=low`
- `--print=none`
- `--extract=y`
- `--extract=n`
- `--modify=all`
- `--modify=annotate`
- `--modify=form`
- `--modify=assembly`
- `--modify=none`

## Permission Model

Basic mode remains unchanged:

- open password;
- confirm password;
- password strength;
- AES-256 encryption;
- printing allowed;
- copying allowed;
- editing allowed;
- same password passed as user and owner password, preserving the previous behavior.

Advanced mode adds:

- separate owner password;
- owner password confirmation;
- printing permission;
- copying text/images permission;
- editing permission.

Owner password rule:

- when advanced permissions are enabled, owner password is required;
- owner password must be at least 6 characters;
- owner password must match confirmation;
- owner password must be different from the open password.

The owner password is not stored in localStorage, not sent to analytics and cleared on reset/unmount through React state teardown.

## UI Controls

Advanced permissions are hidden in a collapsible section.

Printing:

- Full quality
- Low resolution only
- Not allowed

Copying text and images:

- Allowed
- Not allowed

Editing:

- Full editing
- Comments and form filling
- Form filling and signing
- Page assembly only
- No editing

Visible warning:

> PDF permissions are respected by compatible PDF readers, but they are not absolute DRM protection. AES-256 encryption and the open password provide the real protection.

Accessibility:

- no accessibility toggle was added;
- accessibility extraction remains allowed in the PDF permission bits.

## QPDF Mapping

| UI | QPDF |
| --- | --- |
| Full quality printing | `--print=full` |
| Low resolution only | `--print=low` |
| Printing not allowed | `--print=none` |
| Copying allowed | `--extract=y` |
| Copying not allowed | `--extract=n` |
| Full editing | `--modify=all` |
| Comments and form filling | `--modify=annotate` |
| Form filling and signing | `--modify=form` |
| Page assembly only | `--modify=assembly` |
| No editing | `--modify=none` |

Measured `/P` values from the bundled QPDF:

| Printing | Extraction | Modification | `/P` |
| --- | --- | --- | --- |
| full | allowed | all | `-4` |
| none | denied | none | `-3392` |
| low | allowed | assembly | `-2348` |
| full | denied | form | `-60` |
| full | allowed | annotate | `-12` |

## Verification

The QPDF client now inspects the produced PDF after encryption and rejects the result if requested permissions cannot be verified.

Verified properties:

- `/Encrypt` present;
- `/AESV3` present;
- `/R 6`;
- `/V 5`;
- `/Length 256`;
- raw `/P` value matches the requested QPDF permissions;
- accessibility bit remains enabled.

The tool does not show success if the encrypted output cannot be verified.

Failure message:

> The PDF was not downloaded because the requested permissions could not be verified.

## Tests

Added E2E test:

- `protect PDF writes verified owner password permission flags`

Scenarios:

1. Fully permissive:
   - printing full;
   - extraction allowed;
   - modification all;
   - `/P -4`.

2. Strongly restricted:
   - printing none;
   - extraction denied;
   - modification none;
   - `/P -3392`.

3. Low-resolution printing with assembly:
   - printing low;
   - extraction allowed;
   - modification assembly;
   - `/P -2348`.

4. Form filling:
   - printing full;
   - extraction denied;
   - modification form;
   - `/P -60`.

5. Comments and form filling:
   - printing full;
   - extraction allowed;
   - modification annotate;
   - `/P -12`.

Additional checks:

- user password preserved;
- owner password accepted by Unlock PDF for a restricted file;
- unlocked output no longer contains `/Encrypt`;
- owner password equal to open password is blocked;
- permissions warning is visible;
- accessibility remains enabled.

Existing Protect / Unlock test still passes:

- incorrect password rejected;
- correct user password unlocks;
- unlocked file loads with `pdf-lib`;
- `/Encrypt` removed.

## Validation Commands

Commands run:

- `npm run lint` - OK
- `npm run typecheck` - OK
- `npm run build` - OK
- `npx playwright test tests/e2e/product-audit.spec.ts -g "protect PDF writes verified owner password permission flags" --project=chromium --reporter=line` - OK
- `npm run test:e2e` - OK, 65 passed, 11 skipped

Local production:

- `npm run start -- -p 3071`
- Chromium desktop: OK
- Firefox desktop: OK
- Mobile Chromium: OK
- `/protect-pdf` HTTP 200
- advanced permissions visible
- downloaded `protected.pdf`
- AES-256 verified
- `/P -2348` verified for `low + extraction allowed + assembly`
- no pageerror
- no critical console.error
- no critical failed requests

## Reader Compatibility

The produced PDF contains the correct QPDF permission flags. Enforcement depends on the PDF reader:

- compatible readers should respect printing/copying/editing restrictions;
- some software can ignore PDF permission flags;
- this is documented in the UI warning;
- LiftPDF does not describe these permissions as DRM or as unbreakable protection.

## Privacy And Analytics

Privacy model preserved:

- all encryption remains local in the browser;
- open password is not uploaded;
- owner password is not uploaded;
- permission settings are not stored;
- file name and content are not sent to analytics.

Analytics additions are aggregate only:

- `advanced_permissions_enabled`;
- `printing_mode`;
- `copying_allowed`;
- `editing_preset`.

## Files Modified

- `components/tools/pdf/qpdf-client.ts`
- `components/tools/protect-pdf-tool.tsx`
- `app/protect-pdf/page.tsx`
- `data/premium-tool-content.ts`
- `lib/analytics.ts`
- `tests/e2e/product-audit.spec.ts`
- `docs/functional-upgrade-protect-pdf-phase-47.md`

## Production

Commit deployed:

- `20862f2 Upgrade Protect PDF permission controls`
- `38ef66b Document Protect PDF production validation`

Vercel:

- deployment URL: `https://liftpdf-2zn0wtujb-rachator75010-5712s-projects.vercel.app`
- final deployment URL: `https://liftpdf-8r95idw97-rachator75010-5712s-projects.vercel.app`
- status: READY
- production alias: `https://liftpdf.com`

Production route:

- `https://liftpdf.com/protect-pdf`

Production validation completed against the live domain:

- Chromium desktop: OK
- Firefox desktop: OK
- Mobile Chromium: OK
- `/protect-pdf` HTTP 200
- advanced permissions visible
- downloaded `protected.pdf`
- AES-256 verified
- `/P -2348` verified for `low + extraction allowed + assembly`
- decoded printing permission: `low`
- decoded extraction permission: allowed
- decoded modification permission: `assembly`
- accessibility bit remains enabled
- no pageerror
- no critical console.error
- no critical failed requests

## Remaining Limitations

- Reader enforcement cannot be guaranteed across all PDF applications.
- QPDF help/version stdout is not exposed by the current WASM callback; version was found by inspecting the embedded WASM string.
- Acrobat Reader desktop was not available in this environment, so compatibility is documented at the flag level and tested in Chromium/Firefox browser workflows.

## Next P1 Recommended

Recommended next candidates:

1. Unlock PDF restriction-only owner-password files, building on this phase.
2. PDF to JPG / PDF to PNG memory guard and 100-page progress.
3. EXIF orientation handling for image-to-PDF workflows.

## Summary

Selected priority: P1

Tool: Protect PDF

Feature: Owner password and PDF permissions

Implemented: YES

AES-256 verified: YES

User password verified: YES

Owner password verified: YES

Printing full verified: YES

Printing low verified: YES

Printing none verified: YES

Extraction allowed verified: YES

Extraction denied verified: YES

Modify all verified: YES

Modify annotate verified: YES

Modify form verified: YES

Modify assembly verified: YES

Modify none verified: YES

Accessibility kept enabled: YES

Permissions warning visible: YES

Restrictions verified in PDF: YES

Reader enforcement limitations documented: YES

Unlock with user password: YES

Unlock with owner password: YES

Previous workflow preserved: YES

Privacy model preserved: YES

New dependency: NO

Bundle impact: LOW

100-page test: COVERED BY EXISTING QPDF WORKFLOWS; DEDICATED PERMISSION FLAG TEST USES FORM FIXTURE

Mobile verified: YES

Firefox verified: YES

Lint: OK

Typecheck: OK

Build: OK

E2E: OK

Production deployed: YES

Next remaining P1: Unlock PDF restriction-only owner-password files or PDF to image memory guard, pending Phase 48 selection.
