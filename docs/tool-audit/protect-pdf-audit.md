# Protect PDF Enterprise Audit

Date: 2026-07-09

Scope: `/protect-pdf`

Goal: make Protect PDF feel like a premium, trustworthy security tool while keeping the implementation honest: real PDF encryption only, no fake permissions, no cloud workflow.

## Competitor Benchmark

Benchmark method:

- Browser automation with Playwright.
- Real upload using `artifacts/protect-pdf-audit/benchmark-protect.pdf`.
- Desktop viewport: 1440 x 1000.
- Mobile screenshots captured with Pixel 5 emulation.
- Artifact: `artifacts/protect-pdf-audit/competitor-benchmark.json`.

### Adobe Acrobat Online Protect PDF

URL: `https://www.adobe.com/acrobat/online/password-protect-pdf.html`

Status: page could not be opened in the headless benchmark due to `net::ERR_HTTP2_PROTOCOL_ERROR`.

Observed from official page indexing and product positioning:

- Strongest trust and brand authority.
- Very clear promise: password protect a PDF so only people with the password can view it.
- Strong visual security language.

Weaknesses:

- Adobe account and product ecosystem can add friction.
- The workflow is less privacy-positioned than LiftPDF's browser-local approach.
- Headless access was unreliable during this audit, so upload workflow could not be validated directly.

Useful ideas:

- Use explicit security wording.
- Keep the CTA direct and confidence-building.

Rejected ideas:

- Adobe-style account-driven ecosystem. It adds friction and does not match LiftPDF's privacy-first free tooling.

### Smallpdf Protect PDF

URL: `https://smallpdf.com/protect-pdf`

Result: opened and real PDF upload succeeded.

Strengths:

- Clean upload workflow.
- After upload, the password fields are immediately visible.
- Clear file name and size.
- Simple security copy.
- Password confirmation is visible and easy to understand.

Weaknesses:

- Heavy consent and tracking surface.
- Cloud processing message is less compelling for privacy-sensitive users.
- AES 128-bit is presented, while LiftPDF can honestly present AES 256-bit through QPDF.

Useful ideas:

- Keep password and confirmation central.
- Show encryption level.
- Avoid showing download before the file is generated.

Rejected ideas:

- Cloud workflow and file retention copy. LiftPDF's advantage is local processing.

### iLovePDF Protect PDF

URL: `https://www.ilovepdf.com/protect-pdf`

Result: opened and real PDF upload succeeded.

Strengths:

- Fast workflow.
- File preview/list is very direct.
- Simple password panel.
- Clear "Protect PDF" CTA.

Weaknesses:

- Cookie banner and advertising/tracking language distract from the security task.
- Password requirements are useful but can feel strict if they block low-risk personal use.
- The interface is efficient but not particularly reassuring about local privacy.

Useful ideas:

- Direct single-task layout.
- Make password strength visible and practical.

Rejected ideas:

- Extra account or cloud import actions.
- Hard mandatory 8-character policy. LiftPDF keeps a minimum of 6 and shows strength guidance without pretending it can judge all password risk.

### PDF24 Protect PDF

URL: `https://tools.pdf24.org/en/protect-pdf`

Result: opened and real PDF upload succeeded.

Strengths:

- Very clear "AES 256 bits" trust signal.
- Shows file name, size and page count.
- Mentions adjustable permissions.
- Broad platform support messaging.

Weaknesses:

- Ad-heavy page.
- Server/cloud processing is explicit.
- Permissions are useful but can become confusing when not explained carefully.

Useful ideas:

- Sidebar-style summary: file, pages, encryption, output.
- Trust language around encryption level.

Rejected ideas:

- Permissions controls. LiftPDF should not expose printing/copying/editing toggles unless QPDF enforcement is implemented and tested end-to-end.
- Ads and desktop-app upsell.

## LiftPDF Audit

### Scores Before Upgrade

| Category | Score | Notes |
|---|---:|---|
| Hero | 9.2 | Clear, privacy-first, already strong. |
| Upload | 9.1 | Consistent shared PDF upload zone. |
| Password fields | 8.9 | Present and accessible, but visual hierarchy could be stronger. |
| Confirmation | 9.0 | Clear and simple. |
| Show / Hide password | 9.0 | Good accessible control. |
| Password strength | 8.6 | Present, but summary did not surface it. |
| Sidebar | 7.9 | Functional but not premium enough compared with locked tools. |
| Loading | 7.6 | Generic, no staged progress. |
| Success | 7.8 | Functional but not polished. |
| FAQ | 9.0 | Honest and security-specific. |
| Trust | 9.4 | Browser-local QPDF positioning is a strong differentiator. |
| Responsive | 8.8 | Good, but sidebar polish improves hierarchy. |
| Accessibility | 9.0 | Labels and aria-describedby present. |
| Performance | 9.1 | QPDF loaded dynamically only when needed. |

### Key Gaps

- The Download button appeared before a protected file existed.
- Progress did not explain the encryption steps.
- Success copy did not clearly say "PDF protected successfully".
- Sidebar did not highlight "Private by design" strongly enough.
- Already-protected PDF detection depended on PDF.js failure instead of an explicit `/Encrypt` check.
- The UI did not verify that the QPDF output actually contained an encryption dictionary.

## Product Decisions

### Implemented

| Decision | Reason | Impact |
|---|---|---|
| Premium sidebar with File, Pages, File size, Encryption, Password strength, Output | Matches user expectations after upload and reduces uncertainty. | UX and trust improvement. |
| Hide Download until a protected file exists | Prevents confusing dead-end action. | CRO and clarity improvement. |
| Staged progress: Preparing PDF, Encrypting PDF, Generating encrypted PDF | Makes a security-sensitive operation feel reliable. | UX improvement. |
| Success state: PDF protected successfully | Clear completion signal. | UX and confidence improvement. |
| Explicit `/Encrypt` detection on input | Better message for already-protected PDFs. | Error quality improvement. |
| Verify encrypted output contains `/Encrypt` | Prevents false success if the encryption engine fails unexpectedly. | Security correctness improvement. |
| Stronger private-by-design block | LiftPDF's main competitive advantage is local processing. | Trust improvement. |

### Rejected

| Decision | Reason |
|---|---|
| Permission toggles for printing/copying/editing | Not exposed because the current UI does not implement and validate them end-to-end. Fake security controls would damage trust. |
| Certificates | Not this tool; would require a different signing/security model. |
| Electronic signatures | Separate product category. |
| Cloud imports | Contradicts local-processing positioning. |
| Login | Unnecessary friction for a free browser-local task. |
| Drive / Dropbox | Adds scope, data-sharing concerns and maintenance cost. |

## Functional Validation Plan

Required cases:

- Normal PDF.
- 1-page PDF.
- 100-page PDF.
- Empty password.
- Password too short.
- Passwords do not match.
- Already-protected PDF.
- Invalid PDF.
- Encrypted output contains `/Encrypt`.
- Unlock with wrong password fails.
- Unlock with correct password succeeds.
- Desktop Chromium.
- Firefox.
- Mobile Chromium.
- Local production build.
- Vercel production.

## Local Production Validation

Environment:

- `npm run build`
- `npm run start -- -p 3001`
- Browser automation with Playwright.
- Results: `artifacts/protect-pdf-audit/liftpdf-local-production-results.json`

Validated cases:

| Case | Browser | Result |
|---|---|---|
| 1-page PDF, strong password | Chromium | `protected.pdf`, `/Encrypt` present, no unexpected console/page errors |
| 100-page PDF, strong password | Firefox | `protected.pdf`, `/Encrypt` present, no unexpected console/page errors |
| 1-page PDF, mobile layout | Chromium mobile emulation | `protected.pdf`, `/Encrypt` present, form usable |
| Protected PDF + wrong password in Unlock PDF | Chromium | Unlock rejected with incorrect password message |
| Protected PDF + correct password in Unlock PDF | Chromium | Unlocked output generated and `/Encrypt` removed |
| Invalid PDF | Chromium mobile emulation | Clear error shown |
| Already-protected PDF uploaded to Protect PDF | Chromium mobile emulation | Clear "already protected" error shown |
| Empty/short password | Chromium mobile emulation | `Password must be at least 6 characters.` |
| Mismatched confirmation | Chromium mobile emulation | `Passwords do not match.` |

Screenshots:

- `artifacts/protect-pdf-audit/chromium-one-page-success.png`
- `artifacts/protect-pdf-audit/firefox-hundred-pages-success.png`
- `artifacts/protect-pdf-audit/chromium-mobile-one-page-success.png`
- `artifacts/protect-pdf-audit/chromium-mobile-error-states.png`

## Cryptographic Validation

Validated:

- QPDF WASM generated encrypted PDFs containing `/Encrypt`.
- Wrong password was rejected by the unlock workflow.
- Correct password produced an unlocked PDF.
- The unlocked PDF no longer contained `/Encrypt`.
- Protect PDF now checks the encrypted output and does not show success if `/Encrypt` is missing.

## Production Validation

Deployment:

- Product commit: `e1293ef Upgrade Protect PDF experience`
- Vercel deployment: `https://liftpdf-64ef123kr-rachator75010-5712s-projects.vercel.app`
- Production route: `https://liftpdf.com/protect-pdf`
- Status: `Ready`

Production smoke test:

| Case | Browser | Result |
|---|---|---|
| 1-page PDF, strong password, export | Chromium | `protected.pdf`, `/Encrypt` present, no unexpected console/page errors, no failed requests |
| Protected PDF + wrong password in Unlock PDF | Chromium | Unlock rejected |
| Protected PDF + correct password in Unlock PDF | Chromium | Unlocked output generated and `/Encrypt` removed |

Artifacts:

- `artifacts/protect-pdf-audit/liftpdf-production-results.json`
- `artifacts/protect-pdf-audit/final-prod-protect-success.png`

## Known Limits

- LiftPDF currently applies an open password with AES 256-bit encryption.
- It does not expose owner-password permission toggles.
- It does not support certificate-based security.

These limits are intentional. The tool should only promise security features that are actually applied and verified.

## Final Positioning

Protect PDF is strongest when it focuses on a simple promise: add a real password to a PDF locally in the browser, without uploading the file or password. That is more useful and more trustworthy than copying every cloud-based competitor option.
