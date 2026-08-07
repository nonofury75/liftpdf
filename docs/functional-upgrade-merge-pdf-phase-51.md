# LiftPDF Phase 51 - Merge PDF Per-File Validation

## Scope

- Route: `/merge-pdf`
- Selected priority: P1
- Feature: Per-file validation and error isolation
- Roadmap status: open before this phase under `Merge PDF | Per-file protected PDF error`
- Out of scope: editable output filename, bookmarks, page-level merge, new PDF engines

## Why This P1 Was Selected

Per-file isolation is more important than editable output filename because it prevents a complete batch failure. A professional merge workflow must tell the user which PDF needs attention while preserving the rest of the uploaded set.

Before this phase, LiftPDF added files independently but collapsed unreadable files into a generic `error` state. The user could not reliably distinguish a protected PDF from an invalid PDF or an empty file, and the global message did not explain how to recover without re-uploading.

## Benchmark

| Product | Observed/source status | Relevant behavior |
| --- | --- | --- |
| Adobe Acrobat Online | Public UI/community evidence | Combining can fail when one source file is password protected or unreadable; Adobe surfaces password/protection errors but public evidence does not prove graceful per-file isolation. Sources: https://community.adobe.com/questions-12/trying-to-combine-pdf-files-results-in-password-protected-message-1511845 and https://community.adobe.com/questions-27/error-when-combining-files-in-acrobat-623031 |
| Smallpdf | Public UI observed | Merge workflow accepts multiple PDFs and emphasizes simple batch upload. Public pages do not document detailed per-file invalid/protected isolation. Source: https://smallpdf.com/ |
| iLovePDF | Public docs/UI observed | Protected PDFs are routed through Unlock PDF; unlock requires authorization/password. Source: https://www.ilovepdf.com/unlock_pdf |
| PDF24 | Public docs/UI observed | PDF24 exposes Unlock PDF separately and documents error-message based troubleshooting for failed files. Sources: https://tools.pdf24.org/en/unlock-pdf and https://help.pdf24.org/en/questions/question/error-messages/answer/3573/ |

The implementation follows the white-hat product pattern: do not bypass protected files in Merge PDF; identify them and route the user to Unlock PDF.

## Previous Limitation

- File validation happened through PDF.js thumbnail/page-count hydration.
- Success became `ready`.
- Any hydration failure became a generic `error`.
- Empty files were not short-circuited before PDF.js.
- Merge was blocked by unreadable files, but the card did not explain the specific issue.
- Removing one bad file did not provide a clear ready-state recovery message.

## New State Model

Each uploaded PDF now carries an independent status:

- `checking`
- `ready`
- `protected`
- `invalid`
- `empty`
- `error`

Each card keeps only local product data required for the workflow:

- id
- `File`
- preview URL and preview dimensions
- page count
- size
- status
- user-safe error message

No PDF content, password, local path, or extracted text is stored or sent outside the browser.

## New UX

On upload:

- cards appear immediately as `Checking PDF...`
- empty files are marked `Empty file` without invoking PDF.js
- protected PDFs show `Password protected`
- invalid PDFs show `Invalid PDF`
- valid PDFs show `Ready`

Protected PDFs show:

- `This PDF must be unlocked before it can be merged.`
- `Remove`
- `Unlock PDF` link to `/unlock-pdf`

Invalid PDFs show:

- `This file could not be read as a valid PDF.`
- `Remove`

The sidebar now reports:

- Files
- Ready
- Issues when present
- Pages
- Total size
- Output filename

Merge is enabled only when:

- at least two files are `ready`
- no file is still `checking`
- no file has an issue status

If one issue remains, the user sees:

`Remove or unlock 1 file before merging.`

## Merge Engine

- Validation/preview: existing PDF.js client
- Merge/export: existing `pdf-lib`
- New dependencies: none

During merge, LiftPDF now iterates only over ready files. If `pdf-lib` still fails on a file after preflight, that file is marked with a per-file issue and the uploaded lot remains available for retry/removal.

## Output Verification

New deterministic fixtures were added:

- `phase51-a.pdf` containing `PHASE51-A`
- `phase51-b.pdf` containing `PHASE51-B`
- `phase51-c.pdf` containing `PHASE51-C`
- existing invalid and empty fixtures
- protected fixture generated through the real Protect PDF UI during the e2e test

The Phase 51 e2e test verifies:

- A+B+C all become ready
- merged output has 3 pages
- page markers appear in the correct order
- protected file is identified per-card
- invalid file is identified per-card
- empty file is identified per-card
- Merge stays disabled while an issue remains
- removing the problematic file re-enables Merge
- valid files keep their state and order
- final output excludes the rejected/protected marker
- 10 valid PDFs plus 1 invalid PDF keep the 10 valid files usable

## Accessibility

- issue text is visible and not icon-only
- status blocks use `aria-live="polite"`
- Remove buttons keep file-specific accessible labels
- Unlock PDF is a visible text link
- focus-visible styles remain inherited from the existing button/link system

## Analytics And Privacy

Analytics remains aggregate-only:

- no filename
- no file content
- no passwords
- no local paths
- no page text

The existing error tracking now uses generic codes such as `merge_blocked_file_issue`, `not_enough_ready_files`, and `merge_failed`.

## Validation

Local validation:

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- `npm run test:e2e`: OK, 69 passed, 15 skipped by existing project config

Targeted tests:

- Chromium Phase 51 isolation test: OK
- invalid-file representative regression test: OK

Production build local:

- `npm run start` on `127.0.0.1:3021`: OK
- Chromium mobile smoke test: OK
- Firefox mobile smoke test: OK
- final merged PDF parsed with `pdf-lib`: OK, 2 pages
- console/page/request critical errors: none observed

## Production

- Commit: pending
- Vercel deployment: pending
- Production URL tested: pending

## Remaining Limitations

- Merge PDF still uses the fixed output filename `merged.pdf`.
- Bookmarks from filenames are still not implemented.
- Page-level merge/composition remains intentionally out of scope.
- Replace-file action was not added; Remove + Add PDF files is the simpler recovery path.

## Summary

Selected priority: P1
Tool: Merge PDF
Feature: Per-file validation and error isolation
Implemented: YES
Valid files preserved after invalid upload: YES
Protected file identified: YES
Invalid PDF identified: YES
Empty PDF identified: YES
Problematic file removable: YES
Unlock PDF link available: YES
Merge blocked while issue remains: YES
Merge enabled after issue removal: YES
Reorder state preserved: YES
Thumbnails preserved: YES
Final output verified: YES
Rejected file absent from output: YES
Previous workflow preserved: YES
Privacy model preserved: YES
New dependency: NO
Bundle impact: NONE
10-valid-plus-1-invalid test: YES
Mobile verified: YES
Firefox verified: YES
Accessibility verified: YES
Lint: OK
Typecheck: OK
Build: OK
E2E: OK
Production deployed: PENDING
Remaining P1 count: 4
Next remaining P1: Merge PDF editable output filename
