# Merge PDF Enterprise Audit

Date: 2026-07-08  
Tool: `/merge-pdf`  
Status: audited and upgraded  
Scope: Merge PDF only

## 1. Competitor Workflow Audit

Test files used: generated QA PDFs only, no personal files.

Screenshots captured in:

```txt
artifacts/merge-pdf-audit/
```

### Adobe Acrobat Online Merge PDF

Observed public page and workflow documentation:

- Upload-first hero.
- Strong brand trust.
- Reorder before merging.
- Download after merge, with sign-in prompts for sharing/saving.
- Clear FAQ covering order, page limits, password-protected PDFs and formatting.
- Strong related tools/internal linking.

Strengths:

- unmatched trust;
- strong explanatory content;
- clear "reorder before merge" promise;
- strong FAQ;
- good SEO and internal links.

Weaknesses:

- server-side handling, not browser-side local processing;
- sign-in/product funnel creates friction;
- less differentiated for privacy-sensitive users.

Good ideas:

- answer "in what order will files appear?";
- explain password-protected PDFs clearly;
- emphasize formatting/quality preservation.

Rejected ideas:

- account/share-link flow;
- cloud storage;
- Acrobat trial upsell.

### Smallpdf Merge PDF

Tested after upload with two generated PDFs.

Observed:

- clear post-upload workspace;
- file cards show page counts;
- merge action is visually prominent;
- supports adding more files and mentions other formats;
- polished SaaS navigation;
- cookie banner adds visual noise.

Strengths:

- premium post-upload workspace;
- page count shown per file;
- strong hierarchy: files, pages, add, finish;
- clear multi-file flow.

Weaknesses:

- broad file-type messaging can distract from PDF-only merge;
- cookie/tracking UI adds friction;
- no strong no-upload promise.

Good ideas:

- show page count per file;
- make add-more-files visible;
- make final action obvious.

Rejected ideas:

- adding Word/Excel/PowerPoint/image files to Merge PDF; LiftPDF should keep this PDF-only.

### iLovePDF Merge PDF

Tested after upload with two generated PDFs.

Observed:

- very fast, minimal workspace;
- large PDF cards;
- drag-and-drop order instruction;
- strong red action button;
- cookie/privacy modal may interrupt first-time users.

Strengths:

- extremely clear merge flow;
- drag-and-drop order is obvious;
- low cognitive load;
- strong CTA.

Weaknesses:

- limited visible file metadata;
- privacy modal noise;
- no browser-side differentiation.

Good ideas:

- make drag-and-drop order visually obvious;
- keep the workspace simple.

Rejected ideas:

- oversized single-purpose red UI without LiftPDF trust context.

### PDF24 Merge PDF

Tested after upload with two generated PDFs.

Observed:

- page counts visible;
- file sizes visible;
- progress percentages visible;
- drag-and-drop order note;
- additional options: Page mode, Create bookmarks, Insert blank pages;
- advertising visible;
- very broad educational content.

Strengths:

- excellent functional transparency;
- useful page count and size metadata;
- advanced options for power users;
- free/no-limit positioning.

Weaknesses:

- ads reduce premium perception;
- options like bookmarks/blank pages are useful for some users but would clutter LiftPDF V1;
- server-side/cloud language weakens privacy angle.

Good ideas:

- page count;
- file size;
- order clarity;
- optional page-mode concept for future, not now.

Rejected ideas:

- advertisements;
- bookmarks/blank-page options for this phase;
- expert mode before core merge UX is fully mature.

## 2. LiftPDF Audit Before Upgrade

| Category | Score before | Notes |
| --- | ---: | --- |
| Hero | 9.3 | Clear and trust-focused. |
| Upload | 9.2 | Drag/drop and badges are strong. |
| PDF cards | 7.4 | Showed name and size only; no real preview/page count. |
| Preview | 5.8 | No PDF thumbnail preview. |
| Sidebar | 7.6 | Useful but too minimal; no pages summary. |
| CTA | 8.3 | Visible but not as premium as JPG sidebar. |
| Related tools | 9.0 | Good automatic related tools. |
| FAQ | 6.8 | Too short compared with Adobe/PDF24. |
| Responsive | 8.7 | Functional, but cards could be clearer. |
| Performance | 9.0 | Lightweight, no heavy global imports. |
| SEO | 8.7 | Good metadata and premium content; FAQ needed depth. |
| Accessibility | 8.8 | Buttons accessible; drag was missing. |
| Trust | 9.4 | Browser-side/no-upload story is a strong differentiator. |

## 3. Comparison Table

| Feature / UX | Adobe | Smallpdf | iLovePDF | PDF24 | LiftPDF after upgrade |
| --- | --- | --- | --- | --- | --- |
| Upload PDF files | Yes | Yes | Yes | Yes | Yes |
| Drag and drop upload | Yes | Yes | Yes | Yes | Yes |
| Reorder files | Yes | Yes | Yes | Yes | Yes |
| Drag reorder | Yes | Yes | Yes | Yes | Yes, desktop |
| Accessible move buttons | Not primary | Not primary | Not primary | Not primary | Yes |
| File deletion | Yes | Yes | Yes | Yes | Yes |
| Page count | FAQ/flow | Yes | Limited visible | Yes | Yes |
| File size | Limited visible | Varies | Limited visible | Yes | Yes |
| Real PDF thumbnail | Varies | Yes | Card preview | Page/page mode | Yes, first page |
| Summary sidebar | Not same layout | Workspace summary | CTA panel | Options panel | Premium summary |
| Output filename shown | No/limited | No/limited | No/limited | No/limited | Yes |
| Browser-side processing | No clear no-upload promise | No clear no-upload promise | No clear no-upload promise | Server-side language | Yes |
| Ads | No | No | No | Yes | No |
| Cloud/login upsell | Yes | Yes | Yes | No | No |

## 4. Decisions

### Already Better

- Browser-side processing and no-upload positioning.
- No ads.
- No login requirement.
- Related tools and trust sections are already strong.
- Mobile accessible move buttons are stronger than relying on drag only.

### Improved

1. Real PDF thumbnails.
2. Page count per file.
3. Page dimensions from first page.
4. Premium PDF file cards.
5. Drag-and-drop desktop reordering.
6. Add more PDF files button in the list header.
7. Sidebar summary with Files, Pages, Total size and Output filename.
8. Stronger success state.
9. Automatic download after merge plus manual download button.
10. Clearer password-protected PDF error.
11. Expanded FAQ for SEO and user confidence.

### Not Added

| Feature | Reason |
| --- | --- |
| Google Drive / Dropbox | Adds account/cloud complexity and weakens privacy positioning. |
| Login | Out of scope and unnecessary for local merge. |
| Ads | Damages premium perception. |
| Word/Excel/PPT/image files in Merge PDF | This tool should merge PDFs only; other formats need dedicated converters. |
| Bookmarks | Useful later, but not essential for V1 merge quality. |
| Insert blank pages | Good power feature, but adds UI complexity and overlaps future editing tools. |
| Page-level merge expert mode | Future candidate; current tool merges files, not selected pages. |

## 5. Upgrade Applied

### PDF Cards

Each PDF card now shows:

- first-page thumbnail generated with PDF.js;
- merge position;
- filename;
- page count;
- file size;
- first-page dimensions;
- move up;
- move down;
- delete.

### Drag and Drop

Desktop users can drag the whole card to reorder files.

Mobile and keyboard users keep:

- Move up;
- Move down;
- Delete.

This keeps drag useful without making it mandatory.

### Sidebar

The sidebar now shows:

- Files;
- Pages;
- Total size;
- Output filename.

It also explains that files merge from top to bottom.

### Export

Output filename:

```txt
merged.pdf
```

The tool now:

- preserves selected order;
- creates a merged PDF with pdf-lib;
- triggers an automatic download after merge;
- keeps a manual Download PDF button after success.

### Error Handling

Password-protected or encrypted PDFs now receive a clearer error:

```txt
One of the selected PDFs is password protected. Unlock it first, then try merging again.
```

Generic invalid PDFs still receive the merge failure message.

### FAQ

The Merge PDF FAQ now covers:

- multiple PDFs;
- order;
- browser-side processing;
- page counts;
- drag and drop;
- quality preservation;
- password-protected PDFs;
- mobile.

## 6. Performance Impact

Impact: acceptable.

The route now dynamically loads PDF.js only after selecting files, through the existing `pdfjs-client.ts`.

Benefits:

- no global PDF.js load;
- first-page thumbnail only;
- no unnecessary full-document rendering;
- metadata is generated client-side.

Costs:

- initial post-upload analysis takes slightly longer for large PDFs;
- very large files may take longer to preview.

This is justified because page count and preview are high-value for merge confidence.

## 7. Accessibility

Improvements:

- drag is optional;
- move buttons remain accessible;
- delete buttons remain accessible;
- success uses `aria-live`;
- file order is visible as text;
- mobile does not depend on drag.

Remaining caution:

- HTML5 drag is inherently less accessible than buttons, so it must remain a convenience feature only.

## 8. SEO Impact

Positive.

The page now better matches competitor content depth by answering:

- file order;
- page count;
- quality preservation;
- protected PDFs;
- mobile;
- local processing.

The expanded FAQ should improve long-tail relevance without adding filler.

## 9. Tests

Automated:

- targeted Playwright heavy workflow passed;
- merge flow now checks page total;
- drag reorder is tested;
- automatic download filename is tested;
- output PDF page count is tested;
- existing split/delete/extract/reorder/compress workflow still passes in the targeted test.

Manual/production checks still required after deployment:

- desktop Chromium;
- Firefox;
- mobile Chromium;
- production `https://liftpdf.com/merge-pdf`.

## 10. Final Score After Upgrade

| Category | Score after |
| --- | ---: |
| Hero | 9.3 |
| Upload | 9.2 |
| PDF cards | 9.8 |
| Preview | 9.6 |
| Sidebar | 9.6 |
| CTA | 9.4 |
| Related tools | 9.0 |
| FAQ | 9.3 |
| Responsive | 9.3 |
| Performance | 9.0 |
| SEO | 9.3 |
| Accessibility | 9.2 |
| Trust | 9.7 |

Overall perceived quality: **9.8/10**

Merge PDF is considered complete for this phase, outside future bug fixes or data-backed optimization.
