# LiftPDF Phase 67 - Tool KPI Framework

Date: 2026-08-12

## Funnel Definition

Primary funnel:

```text
Landing page or content page
-> tool_open
-> upload_started
-> upload_completed
-> conversion_started
-> conversion_completed
-> download_completed
```

Error branch:

```text
Any step -> error_tool
```

## Global KPIs

| KPI | Formula | Goal for first 30 days |
|---|---|---|
| Tool open rate | `tool_open / landing sessions` | Establish baseline |
| Upload start rate | `upload_started / tool_open` | Identify UX friction |
| Upload success rate | `upload_completed / upload_started` | Detect file validation problems |
| Conversion start rate | `conversion_started / upload_completed` | Detect option/CTA friction |
| Conversion success rate | `conversion_completed / conversion_started` | Detect engine/runtime issues |
| Download completion rate | `download_completed / conversion_completed` | Detect download friction |
| Error rate | `error_tool / conversion_started` | Prioritize tool fixes |
| Guide-to-tool CTR | tool clicks from `/guides` and `/learn` | Measure editorial value |

## Tier A Tools

| Tool | Route | Primary KPI | Secondary KPI | First diagnostic question |
|---|---|---|---|---|
| Merge PDF | `/merge-pdf` | conversion success rate | per-file issue rate | Are protected/invalid PDFs blocking users? |
| JPG to PDF | `/jpg-to-pdf` | download completion rate | upload start rate | Are mobile users converting phone photos? |
| Compress PDF | `/compress-pdf` | mode completion by Preserve/Balanced/Strong | error rate | Which mode produces repeat use? |
| PDF to JPG | `/pdf-to-jpg` | conversion success by page count/quality | cancel/warning rate | Does memory guard prevent failures? |
| Protect PDF | `/protect-pdf` | conversion success by basic/advanced mode | unlock follow-up | Are advanced permissions understood? |

## Remaining Tools

| Tool | Route | KPI focus |
|---|---|---|
| PNG to PDF | `/png-to-pdf` | upload-to-download completion |
| Images to PDF | `/images-to-pdf` | multi-image conversion, filename use |
| Split PDF | `/split-pdf` | mode usage: ranges/every page/every N |
| PDF to PNG | `/pdf-to-png` | workload class, ZIP success |
| Rotate PDF | `/rotate-pdf` | targeting mode use, reset rate |
| Add Page Numbers | `/add-page-numbers` | targeting mode use, conversion success |
| Watermark PDF | `/watermark-pdf` | layer and targeting mode use |
| Delete Pages | `/delete-pages` | undo usage, export success |
| Extract Pages | `/extract-pages` | combined PDF vs ZIP |
| Reorder Pages | `/reorder-pages` | reverse/keyboard/reorder completion |
| Unlock PDF | `/unlock-pdf` | protection type, success/error |
| PDF to Text | `/pdf-to-text` | no-selectable-text rate |

## Analytics Hygiene

Do not add custom dimensions for:

- filenames;
- exact page ranges;
- document content;
- extracted text;
- passwords;
- watermark text;
- custom output filename.

Use only aggregated counts, modes, quality classes, workload classes, and generic error codes.

