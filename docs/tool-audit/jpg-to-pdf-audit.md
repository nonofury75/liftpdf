# JPG to PDF Enterprise Audit

Date: 2026-07-08  
Tool: `/jpg-to-pdf`  
Status: audited and upgraded  
Scope: JPG to PDF only

## 1. Competitor Baseline

### Adobe Acrobat Online

Adobe emphasizes brand trust, a simple upload-first flow and quality preservation. The page is strong because users trust Adobe immediately. The tradeoff is a heavier corporate funnel and weaker "files stay in your browser" positioning.

### Smallpdf

Smallpdf has polished UX, broad image support and strong trust language. Its main advantage is perceived product maturity. The tradeoff is that processing generally depends on uploading files, which creates a privacy opening for LiftPDF.

### iLovePDF

iLovePDF is the closest direct UX reference for JPG to PDF. It exposes orientation, page size and margin settings in a compact sidebar. It is very fast to understand. The weakness is that the privacy model is less differentiated than LiftPDF's browser-side story.

### PDF24

PDF24 wins on free/no-limits breadth and utility. Its visual system is less premium, but its functional clarity is high.

### ILoveIMG

ILoveIMG is more relevant for image manipulation than JPG to PDF specifically. It reinforces the idea that image workflows should be visually clear, fast and batch-friendly.

## 2. LiftPDF Current State

### Excellent

- Large live PDF preview after upload.
- Sidebar with Page orientation, Page size, Margin and Image fit.
- Neutral initial option state after upload.
- CSS preview reflects export settings.
- `calculateImagePlacement()` aligns preview/export logic.
- `Margin None` maps to `0` real margin.
- Add more images action is visible.
- Image cards show thumbnail, filename, dimensions, size and move/delete controls.
- Success state is clean and download is hidden until PDF generation.
- Browser-side processing is a strong trust differentiator.
- Existing e2e tests cover conversion, preview state, margin behavior and download filename.

### To Improve

- The JPG route accepted and described PNG/WEBP despite dedicated `/png-to-pdf` and `/images-to-pdf` tools.
- This diluted search intent and made `/jpg-to-pdf` less precise than iLovePDF's JPG-specific flow.
- Users with PNG/WEBP should be routed to Images to PDF, not silently handled on the JPG page.

### Inutile / Rejected

- Google Drive / Dropbox import: not needed now; adds integration weight and privacy ambiguity.
- More paper sizes: A4, Letter and Auto are enough for the current audience.
- A3/Legal: lower usage; would add UI noise.
- Advanced compression controls: unrelated to JPG to PDF and risk misleading users.
- OCR: unrelated to image-to-PDF conversion.
- Drag-and-drop reordering library: current accessible move controls are stable and lightweight.
- Account/login: out of scope and weakens the free/private promise.

## 3. Visual Comparison

| Area | LiftPDF | Competitor benchmark | Decision |
| --- | --- | --- | --- |
| Layout | Preview left/center, settings sidebar right | iLovePDF-style sidebar | Keep |
| Preview | Large live page preview | Better than many competitors for settings feedback | Keep |
| Upload | Drag/drop with trust badges | Comparable | Keep |
| Sidebar | Clear grouped controls | Comparable to iLovePDF | Keep |
| CTA | Convert at bottom of sidebar | Matches best pattern | Keep |
| Success | Clear success + download + convert another | Strong | Keep |
| Format specificity | Previously too broad | iLovePDF is stricter for JPG | Improve |

## 4. Functional Comparison

| Function | LiftPDF after upgrade | Adobe | Smallpdf | iLovePDF | PDF24 |
| --- | --- | --- | --- | --- | --- |
| Multiple JPG upload | Yes | Yes/limited by flow | Yes | Yes | Yes |
| Reorder images | Yes | Varies | Yes | Yes | Varies |
| Page orientation | Auto/Portrait/Landscape | Limited visible control | Varies | Portrait/Landscape | Varies |
| Page size | Auto/A4/Letter | Limited visible control | Varies | Fit/A4/Letter | Varies |
| Margin | None/Small/Large | Limited visible control | Varies | No/Small/Big | Varies |
| Fit/Fill | Yes | Not prominently exposed | Varies | Fit-like page option | Varies |
| Browser-side processing | Yes | No clear no-upload promise | No clear no-upload promise | No clear no-upload promise | No clear no-upload promise |
| Strict JPG route | Yes | Yes | Broader image route | Yes | Broader converter |

## 5. Upgrade Applied

### Change

`/jpg-to-pdf` now accepts only:

- `image/jpeg`

The page copy now says:

- "Upload JPG or JPEG images..."
- "Drop your JPG images here"
- "Upload JPG or JPEG images. Each image will become one PDF page."

Invalid PNG/WEBP/mixed formats now show:

```txt
Only JPG and JPEG files are supported here. Use Images to PDF for PNG, WEBP or mixed image formats.
```

### Why

JPG to PDF should satisfy a precise transactional intent. PNG and mixed images already have their own pages. Keeping JPG strict improves:

- UX clarity;
- SEO intent alignment;
- internal routing;
- future analytics clarity;
- user confidence that the page does exactly what it says.

### User Value

Users immediately understand what this tool accepts. Users with PNG/WEBP are guided to the correct tool instead of mixing route responsibilities.

### SEO Impact

Positive. The page now targets JPG/JPEG intent more cleanly and avoids competing with `/images-to-pdf` for mixed image workflows.

### UX Impact

Positive. Clearer upload copy and clearer invalid-file message.

### Performance Impact

Neutral. No new dependency and no heavier runtime behavior.

### Maintenance Impact

Positive. The three image tools now have clearer responsibilities:

- `/jpg-to-pdf`: JPG/JPEG only.
- `/png-to-pdf`: PNG only.
- `/images-to-pdf`: JPG, PNG, WEBP and mixed images.

## 6. Quality and Output

The PDF generation logic remains unchanged:

- each image becomes one PDF page;
- page size, orientation, margin and fit settings are still respected;
- preview/export placement still uses the shared calculation logic;
- filename remains `jpg-to-pdf.pdf`.

No PDF engine change was needed.

## 7. Accessibility

Existing strengths:

- file input has accessible label;
- buttons expose `aria-pressed`;
- move/delete buttons have per-file labels;
- success message uses `aria-live`;
- keyboard-accessible controls;
- visible focus inherited from button system.

No accessibility regression introduced.

## 8. Responsive

Existing responsive structure is appropriate:

- desktop: preview + sidebar + image list;
- tablet/mobile: stacked flow;
- sidebar remains usable;
- no known horizontal overflow.

No layout change was needed.

## 9. Tests Added / Updated

Updated Playwright coverage:

- JPG upload still works on `/jpg-to-pdf`.
- JPG conversion still downloads `jpg-to-pdf.pdf`.
- PNG upload on `/jpg-to-pdf` is rejected with a clear message.
- Existing PNG to PDF and Images to PDF checks remain in the same flow.

## 10. Final Result

JPG to PDF is now considered complete for this phase.

Remaining future improvements should only be bug fixes or evidence-backed CRO changes from analytics/Search Console, not new options.
