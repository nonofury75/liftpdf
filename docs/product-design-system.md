# LiftPDF Product Design System

Date: 2026-07-10

Status: official product UX reference for LiftPDF V1.

Scope: all production tools, shared tool pages, upload workflows, sidebars, progress states, success states, trust blocks, FAQ and related tools.

## Product Principle

LiftPDF must feel like one coherent application, not a collection of independent utilities.

Every tool should be fast, calm, private, predictable and easy to understand within a few seconds. The product should avoid feature noise and keep the browser-processing promise visible at the moment the user chooses a file.

## Official Tool Workflow

Every tool page follows this order:

1. Hero
2. Upload
3. Preview
4. Options
5. Primary action
6. Progress
7. Success
8. Guide
9. FAQ
10. Related Tools
11. Trust reinforcement

The shared `ToolPageShell` owns the global order after the tool interface:

1. Tool UI
2. Premium guide content when available
3. SEO guide block
4. FAQ
5. Related Tools
6. Browser-processing trust section

## Hero Standard

Each tool hero must include:

- one clear H1;
- one concise description;
- badges for Free, Secure and Works in your browser;
- no marketing detour before the tool.

Hero copy must describe the real tool behavior. It must not imply OCR, Office conversion, cloud storage or advanced compression when those capabilities are not implemented.

## Upload Standard

Default upload headline:

`Drop your file here.`

Default upload body:

`Drop your file here or choose files.`

Allowed variants:

- `Drop your PDF file here` for single-PDF tools.
- `Drop your PDF files here` for multi-PDF tools.
- `Drop your JPG images here` for JPG-only pages.
- `Drop your PNG images here` for PNG-only pages.

Upload badges:

- Free
- Secure
- Works in your browser

Rules:

- The upload zone must be large enough to be the first obvious action.
- Invalid file messages must appear near the upload area or primary action.
- Multi-file tools must keep add-more behavior visible after first upload.
- Single-file tools must reject multiple uploads with a clear message.

## Preview Standard

Preview is the visual proof that the tool understood the file.

PDF tools:

- show real PDF.js thumbnails when page-level work matters;
- show page count and file name;
- keep thumbnails large enough to inspect;
- avoid recalculating thumbnails unnecessarily.

Image-to-PDF tools:

- show a large live PDF page preview;
- reflect page size, orientation, margin and fit choices;
- keep preview and export placement logic aligned.

Text extraction tools:

- show the extracted text in a readable scrollable area;
- show page, word and character counts when available;
- state clearly when OCR is required.

## Sidebar Standard

Every sidebar follows the same information hierarchy:

1. Tool title or action title
2. Short workflow hint
3. File
4. Pages
5. Output
6. Settings
7. Tool-specific data
8. Privacy/trust note when relevant
9. Primary action
10. Progress
11. Success
12. Download
13. Start over

Common labels:

- File
- PDF file
- Pages
- Selected pages
- Output
- Output format
- Output filename
- Total size
- Settings

Tool-specific labels are allowed only when they clarify the action:

- Password strength
- Encryption
- Rotation
- Watermark type
- Words
- Characters
- Remaining pages

## Button Standard

Primary action:

- red primary button;
- full-width inside sidebar where possible;
- height close to `h-12`;
- includes a relevant Lucide icon;
- hover uses a subtle lift and shadow;
- disabled state remains readable.

Secondary actions:

- Download uses `variant="outline"`;
- Start over uses `variant="ghost"`;
- manual download appears only after a file exists;
- no inactive Download button should appear unless it is required for an explicit validation message.

Preferred action labels:

- Convert to PDF
- Convert to JPG
- Convert to PNG
- Merge PDF
- Split PDF
- Compress PDF
- Rotate PDF
- Add page numbers
- Add watermark
- Delete Pages
- Extract Selected
- Reorder PDF
- Protect PDF
- Unlock PDF
- Extract Text

## Progress Standard

Long actions should use this sequence where relevant:

1. `Preparing...`
2. `Processing...`
3. `Generating...`
4. `Downloading...`

Page-based actions may add a specific detail after the standard word:

- `Processing... Page 3 of 10`
- `Generating... Page 3 of 10`

Do not create inconsistent alternatives such as:

- `Doing magic`
- `Working on it`
- `Optimizing now`

Tool-specific details are acceptable only if they improve clarity:

- encryption tools may say `Processing... Encrypting PDF`;
- unlock tools may say `Processing... Decrypting PDF`;
- text tools may say `Processing... Extracting text page X of Y`.

## Success Standard

Default success structure:

1. Green success card
2. Check icon
3. Headline: `Success`
4. Tool-specific result sentence
5. Download button
6. Start over button

Approved result sentences:

- `PDF created successfully.`
- `JPG created successfully.`
- `PNG created successfully.`
- `ZIP created successfully.`
- `PDF updated successfully.`
- `Text extracted successfully.`
- `PDF protected successfully.`
- `PDF unlocked successfully.`

## Error Standard

Errors must be:

- short;
- specific;
- actionable;
- displayed with consistent red styling;
- announced via `aria-live` when possible.

Preferred examples:

- `Only PDF files are supported.`
- `Only image files are supported.`
- `Please choose a file first.`
- `This PDF is password protected. Please unlock it first.`
- `A PDF must contain at least one page.`
- `Please select at least one page.`
- `The page range is invalid. Use a format like 1-3, 5, 8-10.`

Do not blame the user. Do not expose raw library errors unless inside a diagnostic error boundary.

## Card Standard

Preview cards, thumbnail cards, sidebars, alerts and repeated tool cards use:

- rounded corners consistent with the existing LiftPDF UI;
- light borders;
- controlled shadows;
- comfortable padding;
- no nested decorative cards unless the inner card represents a real item.

Visual states:

- selected: primary border and light primary background;
- error: red border and red-tinted background;
- success: emerald border and emerald-tinted background;
- disabled: muted background and clear text.

## FAQ Standard

Every tool page uses the shared FAQ component.

Rules:

- question as `h3`;
- concise answer;
- no keyword stuffing;
- answers must match the real tool capability;
- scanned PDF questions must not imply OCR unless OCR exists.

## Related Tools Standard

Related Tools must be generated from `data/tools.ts`.

Rules:

- never hard-code related links inside individual tools;
- show only available linked tools unless a coming-soon state is intentionally part of the catalog;
- keep cards consistent with the main catalog;
- related tools appear after FAQ in the official page order.

## Trust Standard

LiftPDF trust language must be specific and honest.

Approved trust claims:

- Browser Processing
- Private by Design
- No Upload
- Secure
- Fast

Use `No Upload` only when the tool truly processes the file locally and does not send it to a server.

Security tools must be especially precise:

- Protect PDF must state real password encryption only because QPDF WASM applies real encryption.
- Unlock PDF must state that the user needs the correct password.
- PDF to Text must state that it extracts selectable text and does not perform OCR.

## Responsive Standard

Desktop:

- main preview/content on the left;
- sidebar on the right;
- sidebar may be sticky.

Tablet:

- preview first;
- options second;
- lists remain readable.

Mobile:

- upload first;
- preview second;
- options and action controls below;
- no horizontal overflow;
- buttons remain large enough for touch.

## Accessibility Standard

Each tool must keep:

- keyboard-accessible primary actions;
- visible focus states;
- `aria-label` on icon-only buttons;
- `aria-live` for success and error messages where possible;
- labels for inputs;
- disabled states that explain what is missing;
- contrast meeting WCAG AA.

## Performance Standard

Heavy libraries must stay tool-local:

- PDF.js only on tools that need rendering or text extraction;
- `pdf-lib` only on tools that edit or generate PDFs;
- QPDF WASM only on Protect and Unlock;
- JSZip only on ZIP-producing tools.

Memory cleanup:

- revoke Blob URLs;
- revoke preview object URLs;
- destroy PDF.js documents;
- avoid recreating thumbnails after every minor option change;
- do not generate PDFs during visual-only preview changes.

## Naming Standard

Generated files should be clear and tool-specific:

- `jpg-to-pdf.pdf`
- `png-to-pdf.pdf`
- `images-to-pdf.pdf`
- `merged.pdf`
- `split.pdf`
- `split-pages.zip`
- `compressed.pdf`
- `rotated.pdf`
- `numbered.pdf`
- `watermarked.pdf`
- `pages-deleted.pdf`
- `pages-extracted.pdf`
- `pages-reordered.pdf`
- `protected.pdf`
- `unlocked.pdf`
- `pdf-text.txt`
- `pdf-to-jpg.zip`
- `pdf-to-png.zip`

Avoid generic names:

- `output.pdf`
- `result.pdf`
- `download.pdf`

## Product Rule

When a future tool is added, it must follow this document before it is considered production-ready.

