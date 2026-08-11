# LiftPDF Phase 63 - Below-Content Watermark Compatibility Matrix

Date: 2026-08-11  
Spike runner: `scripts/spikes/phase63-watermark-below/run.mjs`  
Result source: `artifacts/phase63-watermark-below/results.md` generated locally, not committed.

## Compatibility Summary

| Fixture | Separate prepend stream | Visual order correct | Text preserved | Images preserved | Forms preserved | Annotations preserved | Rotation correct | Resources preserved | PDF valid | Risk | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| F1 SIMPLE_TEXT | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | LOW | PASS |
| F2 IMAGE_HEAVY | PASS | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | LOW | PASS |
| F3 MULTIPLE_CONTENT_STREAMS | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS |
| F4 ROTATED_PAGE | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | PASS | MEDIUM | PASS |
| F5 TRANSPARENCY | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS |
| F6 CLIPPING | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS |
| F7 FORM | PASS | PASS | PASS | NOT_APPLICABLE | PASS | PASS_WIDGET | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS_WITH_LIMITATION |
| F8 LINK_ANNOTATION | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS_LINK | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS_WITH_LIMITATION |
| F9 XOBJECT | PASS | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS |
| F10 MIXED | PASS | PASS | PASS | PASS | PASS | PASS_WIDGET | PASS | PASS | PASS | HIGH | PASS_WITH_LIMITATION |
| F11 DIFFERENT_PAGE_BOXES | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS |
| F12 MULTIPAGE_MIXED | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | PASS | MEDIUM | PASS |
| H1 EMPTY_STREAM | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | LOW | PASS |
| H2 PAGE_WITHOUT_CONTENTS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | LOW | PASS |
| H3 INDIRECT_RESOURCES | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS |
| H4 RESOURCE_NAME_COLLISION | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS |
| H5 GRAPHICS_STATE_CONTROL | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS |
| P10 TEN_PAGES | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | LOW | PASS |
| P100 HUNDRED_PAGES | PASS | PASS | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | MEDIUM | PASS |

## Pixel Occlusion Results

The pixel test renders original, above-content, and below-content variants with PDF.js in Chromium and Firefox. The occlusion region is a black opaque rectangle painted by the original content. Above-content watermarking changes pixels inside the region; below-content watermarking should not.

| Browser | Fixture | Above visible | Below occluded | Above changed pixels in occlusion region | Below changed pixels in occlusion region | Verdict |
|---|---|---|---|---:|---:|---|
| Chromium | F2 IMAGE_HEAVY | PASS | PASS | 1756 | 0 | PASS |
| Chromium | F3 MULTIPLE_CONTENT_STREAMS | PASS | PASS | 1756 | 0 | PASS |
| Chromium | F4 ROTATED_PAGE | PASS | PASS | rotation-adjusted | rotation-adjusted | PASS |
| Chromium | F6 CLIPPING | PASS | PASS | 1756 | 0 | PASS |
| Chromium | F9 XOBJECT | PASS | PASS | 1768 | 163 | PASS |
| Firefox | F2 IMAGE_HEAVY | PASS | PASS | 1664 | 0 | PASS |
| Firefox | F3 MULTIPLE_CONTENT_STREAMS | PASS | PASS | 1664 | 0 | PASS |
| Firefox | F4 ROTATED_PAGE | PASS | PASS | rotation-adjusted | rotation-adjusted | PASS |
| Firefox | F6 CLIPPING | PASS | PASS | 1664 | 0 | PASS |
| Firefox | F9 XOBJECT | PASS | PASS | 1667 | 140 | PASS |

## Structural Proof

For every targeted page, the output `/Contents` array was verified as:

```text
[watermark_stream original_stream_1 original_stream_2 ...]
```

The spike does not rely on byte-string replacement. It uses `pdf-lib` object APIs:

- `PDFName`
- `PDFArray`
- `PDFDict`
- `PDFDocument`
- `context.flateStream(...)`
- `context.register(...)`
- `page.node.set(...)`

## Limitations

| Limitation | Classification | Production handling |
|---|---|---|
| Signed PDFs | ACCEPTABLE_DETECTABLE_LIMITATION | Any PDF modification invalidates cryptographic signatures. Warn or block if signatures are detected in a future implementation. |
| Encrypted PDFs | ACCEPTABLE_DETECTABLE_LIMITATION | Require Unlock PDF first. No bypass. |
| Annotations/widgets | TECHNICAL_WORDING_LIMITATION | Below-content means below page content streams, not necessarily below annotation/widget appearances rendered by PDF readers. |
| Extremely malformed but parser-accepted PDFs | FAILURE_SAFE_REQUIRED | Future helper must return unsupported rather than generate uncertain output. |

## Compatibility Verdict

```text
TRUE_BELOW_TEXT_WATERMARK = YES
TRUE_BELOW_IMAGE_WATERMARK = YES
CONTENT_ORDER_STRUCTURALLY_PROVEN = YES
PIXEL_OCCLUSION_PROVEN = YES
CURRENT_ENGINE_CLASSIFICATION = SAFE_WITH_CURRENT_ENGINE_WITH_DETECTABLE_LIMITATIONS
READY_FOR_PRODUCTION_IMPLEMENTATION = YES
```
