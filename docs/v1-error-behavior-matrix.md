# LiftPDF V1 Error Behavior Matrix

Date: 2026-08-12

| Scenario | Detection | Message style | Recovery | File preserved | User action |
|---|---|---|---|---:|---|
| Invalid PDF | PDF.js/pdf-lib/QPDF load failure | Specific invalid/read failure | Remove/reset/retry | Usually yes | Upload another PDF |
| Empty file | `file.size === 0` where implemented | `Empty file` or upload rejection | Remove/reset | N/A | Choose a non-empty file |
| Protected PDF in edit/organize tools | Load/decrypt failure | Unlock guidance | Reset or open Unlock PDF | Yes until reset | Unlock first |
| Wrong open password | QPDF failure | Wrong/invalid password message | Retry password | Yes | Enter correct password |
| Wrong owner password | QPDF failure or output verification failure | Owner password rejection | Retry password | Yes | Enter valid owner password |
| Unsupported image format | MIME/extension validation | Format-specific message | Re-upload | N/A | Choose supported image |
| Invalid page range | Central page range parser | Inline range error | Edit range | Yes | Enter valid pages |
| Page range out of bounds | Central parser with total pages | `Enter pages between 1 and N` style | Edit range | Yes | Use existing pages |
| Huge PDF to image workload | Preflight estimation | Memory warning | Continue, use Standard, change selection, cancel | Yes | Reduce workload or continue |
| Cancelled conversion | User cancel flag/render task cancellation | Ready state restored | Retry | Yes | Convert again |
| Invalid filename | `lib/output-filename.ts` | Inline filename validation | Edit filename | Yes | Use safe name |
| Per-file merge error | Per-file validation state | Card-level issue | Remove/unlock/replace | Valid files preserved | Remove problematic file |
| QPDF failure | WASM command failure/output verification | Safe failure message | Retry/reset | Yes | Try another file/password |
| PDF.js failure | PDF.js load/render rejection | Safe read/render failure | Retry/reset | Yes | Try another PDF |
| Signed PDF modified | Byte pattern warning in Watermark PDF | Warning before edit | User decision | Yes until export | Continue only if acceptable |

## No-Go Error Conditions

The following block launch:

- output PDF corruption in a core workflow;
- password leak;
- file upload leak to an external API;
- broken production route;
- full E2E regression;
- broken download path;
- domain or HTTPS failure.

Non-blocking when documented:

- rare browser memory limit;
- unsupported corrupt PDF;
- cosmetic copy/layout issue without workflow impact;
- viewer-specific interpretation of PDF permissions.
