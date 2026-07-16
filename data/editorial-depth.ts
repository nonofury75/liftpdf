import type { GuideLink, GuideSection } from "@/data/extract-pages-cluster";

export type ArticleFigure = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type ArticleMeta = {
  category: string;
  readingMinutes: number;
  publishedAt: string;
  updatedAt: string;
  cornerstone?: boolean;
};

export type DecisionTable = {
  heading: string;
  columns: [string, string, string];
  rows: [string, string, string][];
};

export const editorialAuthor = {
  name: "LiftPDF Editorial Team",
  note:
    "LiftPDF articles are written against the behavior of the public LiftPDF tools. We avoid fake expert bylines, invented claims and workflows that the product cannot actually perform.",
};

export const redirectedGuideSlugs = new Set([
  "merge-pdf-on-windows",
  "merge-pdf-on-mac",
  "merge-pdf-on-iphone",
  "merge-pdf-on-android",
  "jpg-to-pdf-on-windows",
  "jpg-to-pdf-on-mac",
  "jpg-to-pdf-on-iphone",
  "jpg-to-pdf-on-android",
]);

export const articleMetaBySlug: Record<string, ArticleMeta> = {
  "what-is-a-pdf": {
    category: "PDF Basics",
    readingMinutes: 9,
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "how-to-merge-pdf": {
    category: "Organize PDF",
    readingMinutes: 10,
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "how-to-convert-jpg-to-pdf": {
    category: "PDF and Images",
    readingMinutes: 10,
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "how-to-extract-pages-from-pdf": {
    category: "Organize PDF",
    readingMinutes: 10,
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "what-is-pdf-compression": {
    category: "PDF Basics",
    readingMinutes: 9,
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "scanned-pdf-vs-searchable-pdf": {
    category: "PDF Basics",
    readingMinutes: 9,
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "what-is-browser-based-pdf-processing": {
    category: "Privacy",
    readingMinutes: 8,
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "what-is-a-password-protected-pdf": {
    category: "PDF Security",
    readingMinutes: 8,
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "jpg-vs-png": {
    category: "PDF and Images",
    readingMinutes: 8,
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "extract-pages-vs-split-pdf": {
    category: "Comparisons",
    readingMinutes: 8,
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "why-is-my-pdf-too-large": {
    category: "Troubleshooting",
    readingMinutes: 9,
    publishedAt: "2026-07-16",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "why-is-my-jpg-blurry-after-pdf": {
    category: "Troubleshooting",
    readingMinutes: 8,
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-16",
    cornerstone: true,
  },
  "how-to-compress-pdf-without-losing-quality": {
    category: "Compression",
    readingMinutes: 7,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "compress-pdf-for-email": {
    category: "Compression",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "reduce-scanned-pdf-size": {
    category: "Troubleshooting",
    readingMinutes: 7,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "pdf-compression-vs-optimization": {
    category: "Comparisons",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "how-to-convert-pdf-to-jpg": {
    category: "Convert PDF",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "how-to-convert-pdf-to-png": {
    category: "Convert PDF",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "pdf-to-jpg-vs-pdf-to-png": {
    category: "Comparisons",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "why-are-pdf-to-jpg-images-blurry": {
    category: "Troubleshooting",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "how-to-copy-text-from-pdf": {
    category: "PDF to Text",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "why-cant-i-copy-text-from-pdf": {
    category: "Troubleshooting",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "how-to-tell-if-pdf-is-scanned": {
    category: "PDF Basics",
    readingMinutes: 5,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "protect-pdf-before-sending": {
    category: "PDF Security",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "unlock-pdf-with-known-password": {
    category: "PDF Security",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "password-protected-pdf-not-opening": {
    category: "Troubleshooting",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "make-pdf-smaller-for-upload": {
    category: "PDF Submission",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "pdf-file-size-limit-explained": {
    category: "PDF Basics",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "convert-receipts-to-pdf": {
    category: "PDF and Images",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "combine-screenshots-into-pdf": {
    category: "PDF and Images",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "turn-school-assignment-photos-into-pdf": {
    category: "Students",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "remove-blank-pages-from-pdf": {
    category: "Organize PDF",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "fix-pdf-pages-out-of-order": {
    category: "Organize PDF",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "rotate-scanned-pdf-pages": {
    category: "Organize PDF",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "add-page-numbers-to-pdf-report": {
    category: "PDF Reports",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "add-confidential-watermark-to-pdf": {
    category: "PDF Security",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "extract-text-from-pdf-without-ocr": {
    category: "PDF to Text",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
  "why-pdf-text-extraction-fails": {
    category: "Troubleshooting",
    readingMinutes: 6,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
  },
};

const mergeFigures: ArticleFigure[] = [
  {
    src: "/images/seo/merge-pdf/merge-pdf-before.webp",
    alt: "LiftPDF Merge PDF upload preview with two PDF files ready to combine",
    width: 1280,
    height: 860,
    caption: "Before merging, check file names, page counts and order.",
  },
  {
    src: "/images/seo/merge-pdf/merge-pdf-workflow.webp",
    alt: "LiftPDF Merge PDF workflow from upload to browser processing and download",
    width: 1280,
    height: 860,
    caption: "The merge workflow should stay simple: upload, order, process locally, download.",
  },
  {
    src: "/images/seo/merge-pdf/merge-pdf-after.webp",
    alt: "LiftPDF Merge PDF success state after generating a merged PDF",
    width: 1280,
    height: 860,
    caption: "After export, download the merged file and keep the originals unchanged.",
  },
];

const jpgFigures: ArticleFigure[] = [
  {
    src: "/images/seo/jpg-to-pdf/jpg-to-pdf-preview.webp",
    alt: "LiftPDF JPG to PDF live preview with page size and margin settings",
    width: 1280,
    height: 860,
    caption: "Use the preview to see how page size, margin and fit change the PDF page.",
  },
  {
    src: "/images/seo/jpg-to-pdf/jpg-to-pdf-workflow.webp",
    alt: "LiftPDF JPG to PDF workflow from image upload to PDF download",
    width: 1280,
    height: 860,
    caption: "A good JPG to PDF workflow keeps layout choices visible before export.",
  },
  {
    src: "/images/learn/jpg-vs-png.webp",
    alt: "Comparison visual showing JPG PNG and PDF image workflows",
    width: 1200,
    height: 720,
    caption: "JPG works well for photos; PNG is often better for screenshots and sharp interface text.",
  },
];

export const articleFiguresBySlug: Record<string, ArticleFigure[]> = {
  "what-is-a-pdf": [
    {
      src: "/images/editorial/pdf-document-structure-diagram.svg",
      alt: "Diagram showing a PDF as pages with text images fonts metadata and links",
      width: 1200,
      height: 720,
      caption: "A PDF is a container for page content, not just a flat screenshot.",
    },
    {
      src: "/images/learn/pdf-basics.webp",
      alt: "LiftPDF PDF basics learning visual with document workflow cards",
      width: 1200,
      height: 720,
      caption: "PDF workflows usually start by understanding what the file contains.",
    },
  ],
  "how-to-merge-pdf": mergeFigures,
  "how-to-convert-jpg-to-pdf": jpgFigures,
  "how-to-extract-pages-from-pdf": [
    {
      src: "/images/seo/extract-pages/extract-pages-before.png",
      alt: "LiftPDF Extract Pages page picker before extracting selected pages",
      width: 1280,
      height: 860,
      caption: "Select only the pages that belong in the new PDF.",
    },
    {
      src: "/images/seo/extract-pages/extract-pages-after.png",
      alt: "LiftPDF Extract Pages success state after export",
      width: 1280,
      height: 860,
      caption: "The exported PDF contains a copy of selected pages; the original file is unchanged.",
    },
    {
      src: "/images/editorial/extract-vs-split-workflow.svg",
      alt: "Diagram comparing Extract Pages and Split PDF workflows",
      width: 1200,
      height: 720,
      caption: "Extract Pages creates one selected-page PDF; Split PDF creates ranges or many files.",
    },
  ],
  "what-is-pdf-compression": [
    {
      src: "/images/editorial/pdf-compression-workflow.svg",
      alt: "Diagram showing PDF compression by rebuilding images streams and document structure",
      width: 1200,
      height: 720,
      caption: "Compression reduces what can be safely rebuilt; it cannot magically shrink every PDF.",
    },
  ],
  "scanned-pdf-vs-searchable-pdf": [
    {
      src: "/images/learn/scanned-vs-searchable-pdf.webp",
      alt: "Scanned PDF compared with searchable PDF",
      width: 1200,
      height: 720,
      caption: "A scanned PDF can look readable while still containing no selectable text.",
    },
  ],
  "what-is-browser-based-pdf-processing": [
    {
      src: "/images/learn/browser-processing-diagram.svg",
      alt: "Browser processing diagram showing a PDF staying on the device",
      width: 1200,
      height: 720,
      caption: "Browser processing means the tool runs in your tab instead of sending files to an upload queue.",
    },
  ],
  "what-is-a-password-protected-pdf": [
    {
      src: "/images/editorial/password-protected-pdf-diagram.svg",
      alt: "Diagram showing PDF encryption requiring a password before opening",
      width: 1200,
      height: 720,
      caption: "A real protected PDF asks for a password before the document can be opened.",
    },
  ],
  "jpg-vs-png": jpgFigures,
  "extract-pages-vs-split-pdf": [
    {
      src: "/images/editorial/extract-vs-split-workflow.svg",
      alt: "Extract Pages versus Split PDF decision workflow",
      width: 1200,
      height: 720,
      caption: "Choose based on the output you need, not just the words in the tool name.",
    },
  ],
  "why-is-my-pdf-too-large": [
    {
      src: "/images/editorial/pdf-file-size-causes.svg",
      alt: "Diagram showing images scans fonts attachments and repeated compression as PDF size causes",
      width: 1200,
      height: 720,
      caption: "Large PDFs usually come from image-heavy pages, scans, embedded fonts or attachments.",
    },
  ],
  "why-is-my-jpg-blurry-after-pdf": [
    {
      src: "/images/editorial/jpg-blurry-causes.svg",
      alt: "Diagram showing low resolution resaving stretching and wrong fit causing blurry JPG to PDF output",
      width: 1200,
      height: 720,
      caption: "Blurriness usually starts before export: low source resolution, resaving or stretching.",
    },
    ...jpgFigures.slice(0, 2),
  ],
  "how-to-compress-pdf-without-losing-quality": [
    {
      src: "/images/editorial/compress-pdf-without-quality-loss.svg",
      alt: "PDF compression workflow showing size reduction with readability checks",
      width: 1200,
      height: 720,
      caption: "Safe compression is a workflow: clean pages first, compress once, then inspect readability.",
    },
    {
      src: "/images/seo/compress-pdf/hero.webp",
      alt: "LiftPDF Compress PDF tool preview",
      width: 1200,
      height: 720,
      caption: "Use the Compress PDF tool after the document structure is final.",
    },
  ],
  "compress-pdf-for-email": [
    {
      src: "/images/editorial/compress-pdf-without-quality-loss.svg",
      alt: "Email PDF compression checklist with file size and readability checks",
      width: 1200,
      height: 720,
      caption: "For email, the output must be small enough to attach and clear enough to read.",
    },
  ],
  "reduce-scanned-pdf-size": [
    {
      src: "/images/editorial/compress-pdf-without-quality-loss.svg",
      alt: "Scanned PDF compression visual showing image-heavy pages becoming smaller",
      width: 1200,
      height: 720,
      caption: "Scanned PDFs are usually large because the page content is stored as images.",
    },
    {
      src: "/images/editorial/selectable-text-vs-scanned-text.svg",
      alt: "Scanned PDF page compared with selectable text PDF page",
      width: 1200,
      height: 720,
      caption: "Compression and OCR solve different problems.",
    },
  ],
  "pdf-compression-vs-optimization": [
    {
      src: "/images/editorial/compress-pdf-without-quality-loss.svg",
      alt: "PDF compression and optimization comparison workflow",
      width: 1200,
      height: 720,
      caption: "Optimization can include cleanup; compression focuses on reducing stored data.",
    },
  ],
  "how-to-convert-pdf-to-jpg": [
    {
      src: "/images/editorial/pdf-to-image-workflow.svg",
      alt: "PDF to JPG workflow showing PDF pages exported as JPG files",
      width: 1200,
      height: 720,
      caption: "PDF to JPG turns each selected PDF page into an image file.",
    },
    {
      src: "/images/seo/pdf-to-jpg/hero.webp",
      alt: "LiftPDF PDF to JPG converter preview",
      width: 1200,
      height: 720,
      caption: "A single selected page downloads as JPG; multiple pages download as ZIP.",
    },
  ],
  "how-to-convert-pdf-to-png": [
    {
      src: "/images/editorial/pdf-to-image-workflow.svg",
      alt: "PDF to PNG workflow showing sharp page image export",
      width: 1200,
      height: 720,
      caption: "PNG is useful when crisp text, screenshots or diagrams matter.",
    },
    {
      src: "/images/seo/pdf-to-png/hero.webp",
      alt: "LiftPDF PDF to PNG converter preview",
      width: 1200,
      height: 720,
      caption: "PDF to PNG exports selected pages as image files.",
    },
  ],
  "pdf-to-jpg-vs-pdf-to-png": [
    {
      src: "/images/editorial/pdf-to-image-workflow.svg",
      alt: "PDF to JPG compared with PDF to PNG output choices",
      width: 1200,
      height: 720,
      caption: "Choose JPG for lighter previews and PNG for sharper graphics.",
    },
  ],
  "why-are-pdf-to-jpg-images-blurry": [
    {
      src: "/images/editorial/pdf-to-image-workflow.svg",
      alt: "PDF to JPG quality troubleshooting showing source page render quality and output image",
      width: 1200,
      height: 720,
      caption: "Blurry exports usually come from source quality, render settings or enlarging the result.",
    },
  ],
  "how-to-copy-text-from-pdf": [
    {
      src: "/images/editorial/selectable-text-vs-scanned-text.svg",
      alt: "Selectable text PDF compared with scanned PDF for text copying",
      width: 1200,
      height: 720,
      caption: "Text extraction only works when the PDF contains selectable text.",
    },
    {
      src: "/images/seo/pdf-to-text/hero.webp",
      alt: "LiftPDF PDF to Text tool preview",
      width: 1200,
      height: 720,
      caption: "PDF to Text extracts readable text already present in the file.",
    },
  ],
  "why-cant-i-copy-text-from-pdf": [
    {
      src: "/images/editorial/selectable-text-vs-scanned-text.svg",
      alt: "Image-only PDF page compared with selectable PDF text layer",
      width: 1200,
      height: 720,
      caption: "If the PDF has no text layer, normal copy and extraction tools need OCR first.",
    },
  ],
  "how-to-tell-if-pdf-is-scanned": [
    {
      src: "/images/editorial/selectable-text-vs-scanned-text.svg",
      alt: "Visual test for scanned PDF versus searchable PDF",
      width: 1200,
      height: 720,
      caption: "Try selecting a word: searchable PDFs behave differently from image-only scans.",
    },
  ],
  "protect-pdf-before-sending": [
    {
      src: "/images/editorial/pdf-password-workflow.svg",
      alt: "Protect PDF before sending workflow with password and encrypted output",
      width: 1200,
      height: 720,
      caption: "A protected PDF should be tested before it is sent.",
    },
    {
      src: "/images/seo/protect-pdf/hero.webp",
      alt: "LiftPDF Protect PDF tool preview",
      width: 1200,
      height: 720,
      caption: "Protect PDF creates a new encrypted download.",
    },
  ],
  "unlock-pdf-with-known-password": [
    {
      src: "/images/editorial/pdf-password-workflow.svg",
      alt: "Unlock PDF workflow requiring a known password",
      width: 1200,
      height: 720,
      caption: "Unlocking requires the correct password and permission to process the file.",
    },
    {
      src: "/images/seo/unlock-pdf/hero.webp",
      alt: "LiftPDF Unlock PDF tool preview",
      width: 1200,
      height: 720,
      caption: "Unlock PDF creates a new copy without the password prompt.",
    },
  ],
  "password-protected-pdf-not-opening": [
    {
      src: "/images/editorial/pdf-password-workflow.svg",
      alt: "Troubleshooting password-protected PDF that will not open",
      width: 1200,
      height: 720,
      caption: "Check the password, file integrity and viewer before processing a protected PDF.",
    },
  ],
};

export const extraArticleSectionsBySlug: Record<string, GuideSection[]> = {
  "what-is-a-pdf": [
    {
      heading: "What a PDF can contain",
      body: [
        "A PDF page can contain selectable text, placed images, vector drawings, links, form fields, embedded fonts and metadata. That is why two PDFs that look similar can behave very differently when copied, compressed or converted.",
        "For example, a report exported from a word processor may contain real text and vector graphics. A scan from a phone may contain only a page-sized image. Both files are PDFs, but only one has text that a browser extractor can read without OCR.",
      ],
      list: [
        "Selectable text can be copied or extracted.",
        "Raster images are made of pixels and can blur when enlarged.",
        "Vector graphics remain sharp because they are drawn mathematically.",
        "Metadata can describe the title, authoring app or page structure.",
      ],
    },
    {
      heading: "When PDF is the wrong format",
      body: [
        "PDF is not always the best starting point. If you need collaborative writing, use an editable document. If you need a single photo for a website, use an image format. If you need text from a scan, plan for OCR before expecting text extraction.",
        "The practical rule is simple: use PDF when page layout, submission, printing or archiving matters. Use another format when editing or image reuse is the main task.",
      ],
    },
  ],
  "how-to-merge-pdf": [
    {
      heading: "Example: application packet",
      body: [
        "Imagine you need to send a signed form, a scan of an ID and two supporting letters. If each file is sent separately, the recipient has to open them in the right order. A merged PDF turns that packet into one reviewable document.",
        "The clean sequence is cover form first, ID second, supporting letters last. If one letter has extra blank pages, delete those pages before merging rather than sending unnecessary pages forward.",
      ],
    },
    {
      heading: "Before you merge, check these details",
      body: [
        "Most merge mistakes are not technical. They are order mistakes, duplicate pages or protected files that cannot be read. A short preflight check prevents the final PDF from looking careless.",
      ],
      list: [
        "Open each PDF once to confirm it is the right file.",
        "Remove blank pages before merging if they are not intentional.",
        "Put cover pages and forms before attachments.",
        "Unlock password-protected PDFs only if you know the password.",
      ],
    },
  ],
  "how-to-convert-jpg-to-pdf": [
    {
      heading: "Example: phone photos into one submission",
      body: [
        "A common JPG to PDF task starts with phone photos of receipts, forms or class notes. The goal is not to make the image more beautiful; it is to package related images into a document that uploads and prints predictably.",
        "Use Auto page size when the portal accepts any PDF shape. Use A4 or Letter when the submission needs a standard page. Use Fit when losing edges would be a problem, and Fill only when edge cropping is acceptable.",
      ],
    },
    {
      heading: "Quality checklist before converting",
      body: [
        "JPG to PDF cannot restore detail that is missing from the original image. The best quality gains happen before export: use the original camera file, crop obvious background, keep the image upright and avoid sending screenshots of photos.",
      ],
      list: [
        "Use the original image instead of a compressed chat copy.",
        "Avoid stretching a small image to a large page.",
        "Choose PNG instead of JPG for screenshots with small text.",
        "Compress the final PDF only if file size is actually a problem.",
      ],
    },
  ],
  "how-to-extract-pages-from-pdf": [
    {
      heading: "Example: send only the pages a recipient needs",
      body: [
        "If a 40-page report contains a two-page invoice section, extracting those two pages is cleaner than sending the whole report. It keeps the recipient focused and reduces accidental disclosure of unrelated pages.",
        "Extraction creates a new PDF from selected pages. It is different from Delete Pages because the original document remains the source file, while the export is a separate smaller copy.",
      ],
    },
    {
      heading: "Selection mistakes to avoid",
      body: [
        "The biggest risk is choosing the wrong page numbers after a cover sheet, table of contents or blank scan page shifts the count. Use thumbnails when available and confirm the exported file before sending it onward.",
      ],
      list: [
        "Check page thumbnails, not only typed page numbers.",
        "Include appendix pages only when they belong to the extracted section.",
        "Use Split PDF for many separate output files.",
        "Use Delete Pages when the goal is to keep the original document minus unwanted pages.",
      ],
    },
  ],
  "what-is-pdf-compression": [
    {
      heading: "Why some PDFs shrink more than others",
      body: [
        "A scan-heavy PDF may shrink because the embedded images can be rebuilt or recompressed. A text-only PDF that was already exported cleanly may barely change because there is little waste to remove.",
        "That is why honest compression tools should not promise a fixed percentage. The result depends on what is inside the file, not just the number of pages.",
      ],
    },
    {
      heading: "Compression versus quality",
      body: [
        "Compression is a tradeoff when images are involved. Reducing file size too aggressively can make photos, scans or small text harder to read. For forms and submissions, readability matters more than reaching the smallest possible file.",
      ],
      list: [
        "Keep a copy of the original file.",
        "Check small text after compression.",
        "Avoid compressing the same file repeatedly.",
      ],
    },
  ],
  "scanned-pdf-vs-searchable-pdf": [
    {
      heading: "The quick test",
      body: [
        "Try selecting one word in the PDF. If you can highlight individual letters or copy the sentence into a text editor, the file likely contains selectable text. If selection draws a rectangle over the whole page, the PDF is probably image-only.",
        "This distinction matters for PDF to Text. A browser extractor can read selectable text, but it cannot invent text from a photograph of a page. That requires OCR.",
      ],
    },
  ],
  "what-is-browser-based-pdf-processing": [
    {
      heading: "What stays local",
      body: [
        "In a browser-based workflow, JavaScript, PDF.js, pdf-lib or WebAssembly code runs inside the browser tab. For supported LiftPDF tools, files are read from your device, processed in memory and exported back as downloads.",
        "This model is useful for everyday private documents because it avoids a server upload queue. It also has limits: very large files can hit browser memory limits, and older browsers may lack required APIs.",
      ],
    },
  ],
  "what-is-a-password-protected-pdf": [
    {
      heading: "Real protection versus visual restriction",
      body: [
        "A real password-protected PDF is encrypted. A viewer should ask for the password before the file opens. Cosmetic restrictions, watermarks or metadata labels are not the same thing.",
        "LiftPDF's Protect PDF tool uses QPDF WebAssembly to apply real PDF encryption locally. Unlock PDF only removes that encryption when the correct password is provided.",
      ],
    },
  ],
  "jpg-vs-png": [
    {
      heading: "A practical decision rule",
      body: [
        "Use JPG for photos and camera scans where smooth tones matter and a smaller file is useful. Use PNG for screenshots, interface captures, logos, transparent graphics and small text that should stay crisp.",
        "When those images become PDF pages, the same rule still applies. A blurry source image will not become sharp simply because it is placed inside a PDF.",
      ],
    },
  ],
  "extract-pages-vs-split-pdf": [
    {
      heading: "The output is the real difference",
      body: [
        "Extract Pages is best when you want one new PDF containing selected pages. Split PDF is best when you need multiple files: one file per page, or separate PDFs for several ranges.",
        "If the recipient should receive one smaller document, extract. If your workflow needs separate attachments, split.",
      ],
    },
  ],
  "why-is-my-pdf-too-large": [
    {
      heading: "The most common causes",
      body: [
        "Large PDFs usually come from high-resolution scans, full-page photos, embedded fonts, attached files or repeated exports from design software. Page count matters, but one scanned page can be larger than twenty text pages.",
        "Before compressing, identify what kind of PDF you have. A text report and a photo-heavy scan need different expectations.",
      ],
      list: [
        "Scanned pages are often large because each page is an image.",
        "Photos inside PDFs can be much larger than they look on screen.",
        "Repeated exporting can preserve unused data.",
        "Attachments and embedded assets can add hidden weight.",
      ],
    },
  ],
  "why-is-my-jpg-blurry-after-pdf": [
    {
      heading: "Blurry output usually starts with the source image",
      body: [
        "A PDF page can preserve a JPG, but it cannot add detail that the JPG does not contain. If the original photo was low resolution, compressed by a messaging app or enlarged beyond its natural size, the PDF will show that weakness.",
        "Fit mode preserves the whole image. Fill mode can crop edges. Stretching is the danger: it makes the image match a page shape by distorting or enlarging it.",
      ],
    },
  ],
};

export const decisionTablesBySlug: Record<string, DecisionTable> = {
  "what-is-a-pdf": {
    heading: "Should you use PDF?",
    columns: ["Need", "Use PDF when", "Use another format when"],
    rows: [
      ["Sharing", "The page should look the same everywhere.", "The recipient must rewrite the text."],
      ["Printing", "Margins, pages and layout matter.", "Only a single image asset is needed."],
      ["Archiving", "The document should remain stable.", "Live collaboration is still happening."],
    ],
  },
  "how-to-merge-pdf": {
    heading: "Merge or another organize tool?",
    columns: ["Goal", "Best tool", "Why"],
    rows: [
      ["One packet from many PDFs", "Merge PDF", "Keeps documents together in order."],
      ["Only selected pages", "Extract Pages", "Creates a focused copy without extra pages."],
      ["Remove unwanted pages", "Delete Pages", "Keeps the remaining document together."],
    ],
  },
  "how-to-convert-jpg-to-pdf": {
    heading: "Layout choices",
    columns: ["Choice", "Use it when", "Watch out for"],
    rows: [
      ["Auto", "The PDF should follow the image shape.", "Some upload portals require A4 or Letter."],
      ["Fit", "The full image must remain visible.", "Ratio bands can appear on standard pages."],
      ["Fill", "The page should be visually full.", "Edges can be cropped."],
    ],
  },
  "how-to-extract-pages-from-pdf": {
    heading: "Extract, delete or split?",
    columns: ["Need", "Use", "Result"],
    rows: [
      ["Send a few pages", "Extract Pages", "One new PDF with selected pages."],
      ["Remove pages from a copy", "Delete Pages", "One PDF with unwanted pages removed."],
      ["Create many files", "Split PDF", "Separate PDFs or ranges."],
    ],
  },
  "why-is-my-pdf-too-large": {
    heading: "How to reduce size safely",
    columns: ["Cause", "Best first action", "Avoid"],
    rows: [
      ["Scanned pages", "Compress once and check readability.", "Repeated compression."],
      ["Unneeded pages", "Delete or extract before compressing.", "Compressing irrelevant pages."],
      ["Many source files", "Merge only the final set.", "Merging duplicates."],
    ],
  },
  "how-to-compress-pdf-without-losing-quality": {
    heading: "Compression safety checklist",
    columns: ["Situation", "Best action", "Why"],
    rows: [
      ["Text-heavy PDF", "Compress once and compare.", "Text PDFs may shrink without visible change."],
      ["Scan-heavy PDF", "Check small text after compression.", "Image recompression can affect readability."],
      ["Unneeded pages", "Delete or extract first.", "Fewer pages reduce size without quality loss."],
    ],
  },
  "pdf-compression-vs-optimization": {
    heading: "Compression or optimization?",
    columns: ["Goal", "Use", "Reason"],
    rows: [
      ["Smaller attachment", "Compression", "The main target is file size."],
      ["Cleaner file structure", "Optimization", "The file may contain unused data or inefficient objects."],
      ["Fewer pages", "Organize tools", "Page removal is not a compression problem."],
    ],
  },
  "pdf-to-jpg-vs-pdf-to-png": {
    heading: "JPG or PNG output?",
    columns: ["PDF page type", "Best output", "Why"],
    rows: [
      ["Photo or scan", "JPG", "Usually smaller for photographic content."],
      ["Screenshot or diagram", "PNG", "Cleaner edges and less text artifacting."],
      ["Need selectable text", "Neither", "Use PDF to Text or keep the PDF."],
    ],
  },
  "how-to-copy-text-from-pdf": {
    heading: "Can the text be copied?",
    columns: ["What you see", "Likely file type", "Next step"],
    rows: [
      ["Words highlight individually", "Searchable PDF", "Use PDF to Text or copy normally."],
      ["Whole page selects as an image", "Scanned PDF", "OCR is required."],
      ["Password prompt appears", "Protected PDF", "Unlock with the known password first."],
    ],
  },
};

export const editorialParentLinks: GuideLink[] = [
  {
    label: "Learning Center",
    href: "/learn",
    text: "Browse PDF tutorials, comparisons and troubleshooting resources.",
  },
  {
    label: "PDF Glossary",
    href: "/pdf-glossary",
    text: "Look up the terms used in this article.",
  },
];
