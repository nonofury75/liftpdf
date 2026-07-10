# LiftPDF Conversion Checklist

Date: 2026-07-10

Status: CRO operating checklist.

## Conversion Definition

For LiftPDF, a conversion is not a purchase.

Primary conversion:

- user completes a tool action and downloads a file.

Secondary conversions:

- user uploads a file;
- user starts a conversion;
- user opens another related tool;
- user returns from Google to another LiftPDF page.

## Funnel

Every tool should be measured as:

1. `tool_open`
2. `upload_started`
3. `upload_completed`
4. `conversion_started`
5. `conversion_completed`
6. `download_started`
7. `download_completed`
8. `error_tool`

## Weekly CRO Checks

| Check | Signal | Action |
|---|---|---|
| Low upload rate | Many tool opens, few uploads | Improve upload clarity and trust copy near chooser |
| High upload errors | Many `invalid_file_type` events | Make accepted file type clearer |
| High conversion abandonment | Upload completed, conversion not started | Move CTA, simplify sidebar or improve default options |
| High conversion errors | Many `conversion_failed` events | Investigate files and edge cases |
| Low download rate | Conversion completed, no download | Improve success block and manual download visibility |
| High protected-PDF errors | `password_protected` on non-security tools | Add stronger Unlock PDF internal path |
| No-text PDF errors | `no_selectable_text` | Prioritize OCR feasibility/content |

## Trust Improvements

Trust copy should be visible at upload and action points:

- files stay in your browser;
- no account required;
- no upload for supported client-side tools;
- passwords are not sent to a server.

Do not add fake badges, fake reviews or invented user counts.

## CTA Rules

Primary buttons should:

- be visible without hunting;
- use action-specific text;
- stay disabled only when clearly necessary;
- show loading state during processing.

Secondary buttons should:

- appear after success;
- use consistent labels: `Download`, `Start over`, or tool-specific reset copy.

## Error Rules

Good error messages:

- explain what happened;
- say what to do next;
- avoid raw technical stack traces;
- avoid blaming the user.

## Optimization Priorities

1. Fix real errors first.
2. Improve upload-to-action conversion.
3. Improve success-to-download conversion.
4. Improve related-tool continuation.
5. Improve search snippet CTR after Search Console data exists.

## What Not To Do

- Do not add popups.
- Do not force account creation.
- Do not add ads near the tool.
- Do not hide download buttons behind friction.
- Do not over-test colors before there is traffic volume.

