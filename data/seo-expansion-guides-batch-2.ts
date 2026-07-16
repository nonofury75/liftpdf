import type { FoundationGuide } from "@/data/foundation-guides";

const submissionImage = {
  src: "/images/editorial/online-pdf-submission-workflow.svg",
  alt: "Online PDF submission workflow with file size, page order and upload checks",
  width: 1200,
  height: 720,
};

const phoneImage = {
  src: "/images/editorial/phone-photos-to-pdf-workflow.svg",
  alt: "Phone photos to PDF workflow with receipts screenshots and school documents",
  width: 1200,
  height: 720,
};

const cleanupImage = {
  src: "/images/editorial/pdf-page-cleanup-workflow.svg",
  alt: "PDF page cleanup workflow showing blank pages removal, rotation and page order",
  width: 1200,
  height: 720,
};

const polishImage = {
  src: "/images/editorial/pdf-report-polish-workflow.svg",
  alt: "PDF report polish workflow with page numbers, watermark and final download",
  width: 1200,
  height: 720,
};

const textImage = {
  src: "/images/editorial/selectable-text-vs-scanned-text.svg",
  alt: "Selectable PDF text compared with scanned image-only PDF text",
  width: 1200,
  height: 720,
};

export const seoExpansionGuidesBatch2: FoundationGuide[] = [
  {
    slug: "make-pdf-smaller-for-upload",
    title: "How to Make a PDF Smaller for Upload | LiftPDF",
    description:
      "Prepare a PDF for upload limits by cleaning pages, reducing file size and checking the final document.",
    h1: "How to Make a PDF Smaller for Upload",
    topic: "PDF Basics",
    primaryKeyword: "make pdf smaller for upload",
    summary:
      "Upload portals usually reject PDFs because of size, password protection, missing pages or unreadable scans. Fix the structure first, then compress.",
    ctaLabel: "Compress PDF",
    canonical: "/guides/make-pdf-smaller-for-upload",
    image: submissionImage,
    quickAnswer:
      "To make a PDF smaller for upload, remove unnecessary pages, compress the final copy once, confirm it opens correctly and only then submit it.",
    quickSteps: [
      "Check the upload limit and required format.",
      "Delete or extract pages that do not belong.",
      "Compress the cleaned PDF.",
      "Open the result before uploading.",
    ],
    sections: [
      {
        heading: "Start with the portal requirement",
        body: [
          "Most upload portals care about file type, file size and whether the PDF can be opened. They usually do not care which app created the PDF.",
          "If the portal asks for one PDF under a size limit, avoid unnecessary conversions. Clean the pages first, then compress only if the file is still too large.",
        ],
      },
      {
        heading: "Do not sacrifice readability",
        body: [
          "A tiny file is not useful if signatures, stamps or small text become unreadable. For applications, school portals and government forms, the final PDF must remain clear.",
        ],
        list: [
          "Check small text after compression.",
          "Keep a copy of the original.",
          "Avoid compressing repeatedly.",
        ],
      },
    ],
    faq: [
      {
        question: "What if the PDF is still too large?",
        answer:
          "Extract only the required pages or ask whether the portal accepts multiple files. Some scan-heavy PDFs cannot shrink much without visible quality loss.",
      },
      {
        question: "Should I convert the PDF to images before uploading?",
        answer:
          "Usually no. If the portal asks for PDF, keep the file as PDF and reduce size carefully.",
      },
    ],
    relatedLinks: [
      { label: "Compress PDF", href: "/compress-pdf", text: "Reduce file size in your browser." },
      { label: "Delete Pages", href: "/delete-pages", text: "Remove pages before compression." },
      { label: "Prepare a PDF for online submission", href: "/guides/how-to-prepare-a-pdf-for-online-submission", text: "Use a full pre-upload checklist." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "pdf-file-size-limit-explained",
    title: "PDF File Size Limits Explained | LiftPDF",
    description:
      "Understand PDF file size limits for email, portals and online submissions, and what to do when a PDF is too large.",
    h1: "PDF File Size Limits Explained",
    topic: "PDF Basics",
    primaryKeyword: "pdf file size limit",
    summary:
      "PDF size limits are set by email providers, forms and portals. The best fix depends on whether the PDF is too large because of pages, scans or images.",
    ctaLabel: "Reduce PDF size",
    canonical: "/guides/pdf-file-size-limit-explained",
    image: submissionImage,
    quickAnswer:
      "If a PDF exceeds a size limit, remove unnecessary pages first, then compress. If the file is a scan, expect quality tradeoffs and check readability.",
    quickSteps: [
      "Find the exact limit stated by the recipient.",
      "Identify whether the PDF is text-heavy or scan-heavy.",
      "Remove pages that are not needed.",
      "Compress once and verify the output.",
    ],
    sections: [
      {
        heading: "Why limits vary",
        body: [
          "Email systems, application portals and school platforms all set their own size limits. A file that works in one place can fail somewhere else.",
          "The limit itself is not the only issue. Some portals reject encrypted PDFs, damaged PDFs or ZIP files even when the size is acceptable.",
        ],
      },
      {
        heading: "How to respond to a size error",
        body: [
          "Do not blindly convert the file to another format. If the final upload must be a PDF, keep it as a PDF and solve the actual cause.",
        ],
        list: [
          "Use Extract Pages if only one section is required.",
          "Use Compress PDF for image-heavy or scan-heavy files.",
          "Use Merge PDF only after each source file is clean.",
        ],
      },
    ],
    faq: [
      {
        question: "Is there a universal PDF size limit?",
        answer:
          "No. Limits depend on the receiving website, email system or organization.",
      },
      {
        question: "Can a PDF be too small?",
        answer:
          "Yes, if aggressive compression makes the content unreadable or removes useful detail.",
      },
    ],
    relatedLinks: [
      { label: "Why is my PDF too large?", href: "/guides/why-is-my-pdf-too-large", text: "Diagnose the cause." },
      { label: "Compress PDF", href: "/compress-pdf", text: "Create a smaller PDF." },
      { label: "Make PDF smaller for upload", href: "/guides/make-pdf-smaller-for-upload", text: "Follow an upload-ready workflow." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "convert-receipts-to-pdf",
    title: "How to Convert Receipts to PDF | LiftPDF",
    description:
      "Turn receipt photos or scans into one clean PDF for expenses, accounting or reimbursements.",
    h1: "How to Convert Receipts to PDF",
    topic: "PDF and Images",
    primaryKeyword: "convert receipts to pdf",
    summary:
      "Receipt PDFs are easiest to review when photos are clear, cropped, ordered and exported as one document instead of loose images.",
    ctaLabel: "Convert images to PDF",
    canonical: "/guides/convert-receipts-to-pdf",
    image: phoneImage,
    quickAnswer:
      "Use the original receipt photos, add them in date or expense order, keep margins small and export one PDF for submission.",
    quickSteps: [
      "Retake blurry or dark receipt photos.",
      "Add receipt images in the right order.",
      "Use Fit so no edges are cut off.",
      "Download one PDF for your expense workflow.",
    ],
    sections: [
      {
        heading: "Receipts need clarity more than beauty",
        body: [
          "A receipt PDF should make totals, dates, merchant names and tax details readable. If the source photo is blurry or cropped, converting it to PDF will not fix the missing information.",
          "For expense reports, one organized PDF is usually easier to review than a set of separate photos.",
        ],
      },
      {
        heading: "Order and naming matter",
        body: [
          "Put receipts in the same order as the expense report or reimbursement form. This makes review faster and reduces back-and-forth questions.",
        ],
      },
    ],
    faq: [
      {
        question: "Should receipt photos be JPG or PNG?",
        answer:
          "Phone receipt photos are usually JPG. PNG is fine for screenshots or digital receipts.",
      },
      {
        question: "Can LiftPDF read receipt totals automatically?",
        answer:
          "No. LiftPDF creates the PDF document; it does not perform receipt OCR or accounting extraction.",
      },
    ],
    relatedLinks: [
      { label: "Images to PDF", href: "/images-to-pdf", text: "Combine receipt images into one PDF." },
      { label: "JPG to PDF", href: "/jpg-to-pdf", text: "Convert JPG receipt photos." },
      { label: "Compress PDF", href: "/compress-pdf", text: "Reduce the final PDF if needed." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "combine-screenshots-into-pdf",
    title: "How to Combine Screenshots Into One PDF | LiftPDF",
    description:
      "Create one PDF from multiple screenshots for reports, support tickets, class notes or documentation.",
    h1: "How to Combine Screenshots Into One PDF",
    topic: "PDF and Images",
    primaryKeyword: "combine screenshots into pdf",
    summary:
      "Screenshots become easier to share when they are ordered, converted to PDF and checked for readable text.",
    ctaLabel: "Convert images to PDF",
    canonical: "/guides/combine-screenshots-into-pdf",
    image: phoneImage,
    quickAnswer:
      "Add screenshots to Images to PDF, arrange them in reading order, use Fit to avoid cropping and download one PDF.",
    quickSteps: [
      "Collect screenshots in sequence.",
      "Remove duplicate or accidental captures.",
      "Convert images to PDF with Fit.",
      "Review the final PDF before sending.",
    ],
    sections: [
      {
        heading: "Screenshots behave differently from photos",
        body: [
          "Screenshots often contain small interface text and sharp edges. PNG usually preserves that content better than JPG, but both can be placed into a PDF.",
          "If screenshots are sent as loose images, the recipient may open them out of order. A PDF keeps the sequence clear.",
        ],
      },
      {
        heading: "Avoid cropping important UI details",
        body: [
          "Use Fit when the whole screenshot matters. Fill can look bigger, but it may crop navigation bars, timestamps or labels.",
        ],
      },
    ],
    faq: [
      {
        question: "Can screenshots stay selectable in PDF?",
        answer:
          "No. Screenshot text is pixels unless OCR is applied later.",
      },
      {
        question: "Should screenshots use PNG to PDF?",
        answer:
          "PNG is usually a good choice for screenshots because it keeps sharp edges and text clearer.",
      },
    ],
    relatedLinks: [
      { label: "Images to PDF", href: "/images-to-pdf", text: "Combine JPG, PNG and WEBP screenshots." },
      { label: "PNG to PDF", href: "/png-to-pdf", text: "Create a PDF from PNG screenshots." },
      { label: "PNG vs PDF", href: "/guides/png-vs-pdf", text: "Understand the format difference." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "turn-school-assignment-photos-into-pdf",
    title: "How to Turn School Assignment Photos Into a PDF | LiftPDF",
    description:
      "Create a clean PDF from homework, notes or assignment photos before uploading to school portals.",
    h1: "How to Turn School Assignment Photos Into a PDF",
    topic: "PDF and Images",
    primaryKeyword: "turn assignment photos into pdf",
    summary:
      "Assignment photos should be readable, in page order and exported as one PDF when the school portal asks for PDF submission.",
    ctaLabel: "Convert photos to PDF",
    canonical: "/guides/turn-school-assignment-photos-into-pdf",
    image: phoneImage,
    quickAnswer:
      "Retake unclear photos, add pages in order, use Fit to keep edges visible and download a PDF that matches the assignment instructions.",
    quickSteps: [
      "Photograph each page straight-on.",
      "Check that handwriting or print is readable.",
      "Add photos in page order.",
      "Download one PDF and open it before submitting.",
    ],
    sections: [
      {
        heading: "Readability comes first",
        body: [
          "A PDF is only useful if the teacher or reviewer can read it. Fix lighting, blur and missing edges before conversion.",
          "If the assignment has multiple pages, order them exactly as they should be read. Page order mistakes are harder to catch after submission.",
        ],
      },
      {
        heading: "Choose simple layout settings",
        body: [
          "For assignment photos, Fit is usually safer than Fill because it keeps the full page visible. Margins can help the page feel cleaner, but they should not shrink text too much.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I use phone photos directly?",
        answer:
          "Yes, if they are clear and readable. Use the original files rather than compressed chat copies.",
      },
      {
        question: "Should I compress the assignment PDF?",
        answer:
          "Only if the school portal has a size limit or the PDF is unusually large.",
      },
    ],
    relatedLinks: [
      { label: "JPG to PDF", href: "/jpg-to-pdf", text: "Convert phone assignment photos." },
      { label: "Images to PDF", href: "/images-to-pdf", text: "Combine mixed image formats." },
      { label: "Prepare PDF for upload", href: "/guides/make-pdf-smaller-for-upload", text: "Check file size and readability." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "remove-blank-pages-from-pdf",
    title: "How to Remove Blank Pages From a PDF | LiftPDF",
    description:
      "Delete blank PDF pages before sending, merging, compressing or uploading a document.",
    h1: "How to Remove Blank Pages From a PDF",
    topic: "Organize PDF",
    primaryKeyword: "remove blank pages from pdf",
    summary:
      "Blank pages make PDFs look unfinished and increase file size. Remove them before merging, compressing or sending the file.",
    ctaLabel: "Delete PDF pages",
    canonical: "/guides/remove-blank-pages-from-pdf",
    image: cleanupImage,
    quickAnswer:
      "Upload the PDF to Delete Pages, select the blank pages, generate a new PDF and open the result to confirm at least one useful page remains.",
    quickSteps: [
      "Open Delete Pages.",
      "Upload the PDF.",
      "Select the blank pages only.",
      "Download and check the cleaned PDF.",
    ],
    sections: [
      {
        heading: "Blank pages often come from scans",
        body: [
          "Scanners and phone scan apps can add blank backsides, separator pages or accidental captures. Those pages can confuse reviewers and make the file larger.",
          "Remove blank pages before compression so the final PDF is smaller without sacrificing useful quality.",
        ],
      },
      {
        heading: "Do not delete every page",
        body: [
          "A valid output PDF must contain at least one page. If every page looks blank, the source file may be damaged or rendered incorrectly.",
        ],
      },
    ],
    faq: [
      {
        question: "Will deleting blank pages change the original PDF?",
        answer:
          "No. LiftPDF creates a new download and leaves the original file unchanged.",
      },
      {
        question: "Should I delete blank pages before merging?",
        answer:
          "Yes. Clean each file first, then merge the final set.",
      },
    ],
    relatedLinks: [
      { label: "Delete Pages", href: "/delete-pages", text: "Remove blank or unwanted pages." },
      { label: "Merge PDF", href: "/merge-pdf", text: "Merge cleaned files." },
      { label: "Compress PDF", href: "/compress-pdf", text: "Reduce the cleaned PDF size." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "fix-pdf-pages-out-of-order",
    title: "How to Fix PDF Pages Out of Order | LiftPDF",
    description:
      "Reorder PDF pages after scanning, combining files or exporting pages in the wrong sequence.",
    h1: "How to Fix PDF Pages Out of Order",
    topic: "Organize PDF",
    primaryKeyword: "pdf pages out of order",
    summary:
      "When PDF pages are out of order, reorder the pages visually before adding page numbers, watermarking or sending the document.",
    ctaLabel: "Reorder PDF pages",
    canonical: "/guides/fix-pdf-pages-out-of-order",
    image: cleanupImage,
    quickAnswer:
      "Use Reorder Pages to move pages into reading order, then download the corrected PDF and review it from first page to last.",
    quickSteps: [
      "Upload the PDF to Reorder Pages.",
      "Use thumbnails to identify the correct order.",
      "Move pages into sequence.",
      "Download and review the final PDF.",
    ],
    sections: [
      {
        heading: "Page order issues are common after scanning",
        body: [
          "Multi-page scans, combined attachments and manual exports can put pages in the wrong order. Fixing order early prevents mistakes later in the workflow.",
          "If you add page numbers before reordering, the numbering may no longer match the final reading sequence.",
        ],
      },
      {
        heading: "Use visual checks",
        body: [
          "Rely on page thumbnails and obvious document sections, not just page numbers printed inside the PDF. Cover sheets and appendices can shift expectations.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I reorder before merging?",
        answer:
          "Usually clean each file first, then merge, then do a final order check on the combined PDF.",
      },
      {
        question: "Can I move pages on mobile?",
        answer:
          "Yes. LiftPDF includes accessible move controls for page organization workflows.",
      },
    ],
    relatedLinks: [
      { label: "Reorder Pages", href: "/reorder-pages", text: "Move PDF pages into order." },
      { label: "Add Page Numbers", href: "/add-page-numbers", text: "Number pages after order is final." },
      { label: "Organize PDF", href: "/learn/organize-pdf", text: "Choose the right organize workflow." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "rotate-scanned-pdf-pages",
    title: "How to Rotate Scanned PDF Pages | LiftPDF",
    description:
      "Fix sideways or upside-down scanned PDF pages before sending or extracting them.",
    h1: "How to Rotate Scanned PDF Pages",
    topic: "Organize PDF",
    primaryKeyword: "rotate scanned pdf pages",
    summary:
      "Scanned PDF pages can appear sideways after scanning. Rotate the affected pages before sharing or adding page numbers.",
    ctaLabel: "Rotate PDF",
    canonical: "/guides/rotate-scanned-pdf-pages",
    image: cleanupImage,
    quickAnswer:
      "Upload the scanned PDF, rotate individual pages or all pages, then download a corrected copy.",
    quickSteps: [
      "Open Rotate PDF.",
      "Upload the scanned document.",
      "Rotate selected pages by 90, 180 or 270 degrees.",
      "Download and inspect the corrected PDF.",
    ],
    sections: [
      {
        heading: "Why scans rotate incorrectly",
        body: [
          "Scanner apps and office scanners can detect orientation incorrectly, especially with handwritten notes, receipts or pages with little text.",
          "Rotating a PDF page changes how it displays. It does not perform OCR or rewrite the scanned content.",
        ],
      },
      {
        heading: "Rotate before final edits",
        body: [
          "Fix orientation before adding page numbers or watermarks. That keeps those edits aligned with the final page direction.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I rotate only one page?",
        answer:
          "Yes. Rotate individual pages when only part of the PDF is sideways.",
      },
      {
        question: "Does rotating reduce quality?",
        answer:
          "Rotation changes page orientation. It should not require image recompression for normal PDF page rotation.",
      },
    ],
    relatedLinks: [
      { label: "Rotate PDF", href: "/rotate-pdf", text: "Rotate selected pages or all pages." },
      { label: "Scanned PDF vs searchable PDF", href: "/guides/scanned-pdf-vs-searchable-pdf", text: "Understand scanned documents." },
      { label: "Add Page Numbers", href: "/add-page-numbers", text: "Number pages after orientation is fixed." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "add-page-numbers-to-pdf-report",
    title: "How to Add Page Numbers to a PDF Report | LiftPDF",
    description:
      "Add readable page numbers to reports, packets and documents after page order is final.",
    h1: "How to Add Page Numbers to a PDF Report",
    topic: "Organize PDF",
    primaryKeyword: "add page numbers to pdf report",
    summary:
      "Add page numbers after merging, deleting and reordering pages so the numbering matches the final PDF.",
    ctaLabel: "Add Page Numbers",
    canonical: "/guides/add-page-numbers-to-pdf-report",
    image: polishImage,
    quickAnswer:
      "Finalize page order first, then choose a numbering format and position. Download the numbered PDF and check the first and last pages.",
    quickSteps: [
      "Reorder or delete pages first.",
      "Open Add Page Numbers.",
      "Choose a format such as Page 1 of 10.",
      "Download and inspect the numbered report.",
    ],
    sections: [
      {
        heading: "Numbering is a final-step edit",
        body: [
          "Page numbers should match the final document. If you add numbers before deleting or reordering pages, the result can confuse readers.",
          "Reports often benefit from clear bottom-center numbering, while packets and attachments may use a simpler corner position.",
        ],
      },
      {
        heading: "Choose a format readers understand",
        body: [
          "Formats like Page 1 of 10 are useful when the reader needs to know the total length. Simple numbers are cleaner when the document is short.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I start numbering at a custom number?",
        answer:
          "Yes. Use a start number when the PDF is part of a larger packet or appendix.",
      },
      {
        question: "Should I add numbers before merging PDFs?",
        answer:
          "Usually no. Merge and reorder first, then number the finished PDF.",
      },
    ],
    relatedLinks: [
      { label: "Add Page Numbers", href: "/add-page-numbers", text: "Add page numbers to the final PDF." },
      { label: "Reorder Pages", href: "/reorder-pages", text: "Fix order before numbering." },
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine report sections first." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "add-confidential-watermark-to-pdf",
    title: "How to Add a Confidential Watermark to a PDF | LiftPDF",
    description:
      "Add a visible Confidential watermark to a PDF while understanding what a watermark can and cannot protect.",
    h1: "How to Add a Confidential Watermark to a PDF",
    topic: "PDF Security",
    primaryKeyword: "add confidential watermark to pdf",
    summary:
      "A watermark labels a document visually. It is useful for drafts and confidential copies, but it is not the same as password protection.",
    ctaLabel: "Watermark PDF",
    canonical: "/guides/add-confidential-watermark-to-pdf",
    image: polishImage,
    quickAnswer:
      "Upload the PDF, choose a text watermark such as Confidential, set opacity and position, then download the watermarked PDF.",
    quickSteps: [
      "Open Watermark PDF.",
      "Upload the document.",
      "Enter the watermark text.",
      "Adjust opacity, position and rotation.",
    ],
    sections: [
      {
        heading: "Watermarks communicate status",
        body: [
          "A Confidential, Draft or Review watermark tells readers how the document should be treated. It is a visual label that travels with the page.",
          "It does not encrypt the file. If the PDF contains sensitive information, use password protection as well when appropriate.",
        ],
      },
      {
        heading: "Make the watermark visible but readable",
        body: [
          "A watermark should be visible without making the document impossible to read. Lower opacity and diagonal placement often work well for drafts.",
        ],
      },
    ],
    faq: [
      {
        question: "Does a watermark stop copying?",
        answer:
          "No. A watermark is visible content, not access control.",
      },
      {
        question: "Should I also protect the PDF?",
        answer:
          "Use Protect PDF when the file should require a password to open.",
      },
    ],
    relatedLinks: [
      { label: "Watermark PDF", href: "/watermark-pdf", text: "Add text or image watermarks." },
      { label: "Protect PDF", href: "/protect-pdf", text: "Add password protection." },
      { label: "PDF Security", href: "/learn/pdf-security", text: "Understand PDF safety workflows." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "extract-text-from-pdf-without-ocr",
    title: "Extract Text From PDF Without OCR: What Is Possible? | LiftPDF",
    description:
      "Learn when PDF text can be extracted without OCR and when a scanned document needs OCR first.",
    h1: "Extract Text From PDF Without OCR",
    topic: "Convert PDF",
    primaryKeyword: "extract text from pdf without ocr",
    summary:
      "You can extract text without OCR only when the PDF already contains selectable text or a text layer.",
    ctaLabel: "Extract PDF text",
    canonical: "/guides/extract-text-from-pdf-without-ocr",
    image: textImage,
    quickAnswer:
      "PDF to Text can extract selectable text already present in the PDF. It cannot read text from image-only scanned pages without OCR.",
    quickSteps: [
      "Try selecting text in the PDF.",
      "Use PDF to Text if words are selectable.",
      "Use OCR software if the PDF is scanned.",
      "Download TXT only after reviewing the extracted text.",
    ],
    sections: [
      {
        heading: "OCR is only needed for image text",
        body: [
          "If a PDF was exported from a digital document, it often contains real text. If it was scanned from paper, it may contain only images.",
          "OCR is the process that recognizes text inside images. LiftPDF does not claim OCR; it extracts text that already exists.",
        ],
      },
      {
        heading: "Why this distinction matters",
        body: [
          "Honest text extraction prevents false expectations. A scanned PDF can look readable to humans while still containing no selectable text for a normal extractor.",
        ],
      },
    ],
    faq: [
      {
        question: "Can a scanned PDF be extracted without OCR?",
        answer:
          "Only if OCR was already applied previously and the PDF includes a text layer.",
      },
      {
        question: "Does PDF to Text keep tables?",
        answer:
          "It extracts readable text, but it is not a table reconstruction or Word conversion tool.",
      },
    ],
    relatedLinks: [
      { label: "PDF to Text", href: "/pdf-to-text", text: "Extract selectable text." },
      { label: "Scanned vs searchable PDF", href: "/guides/scanned-pdf-vs-searchable-pdf", text: "Learn when OCR is required." },
      { label: "How to tell if PDF is scanned", href: "/guides/how-to-tell-if-pdf-is-scanned", text: "Check the file before extracting." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "why-pdf-text-extraction-fails",
    title: "Why PDF Text Extraction Fails | LiftPDF",
    description:
      "Understand why PDF text extraction may fail because of scans, encryption, damaged files or unusual page structure.",
    h1: "Why PDF Text Extraction Fails",
    topic: "Troubleshooting",
    primaryKeyword: "pdf text extraction fails",
    summary:
      "Text extraction can fail when a PDF has no selectable text, is protected, is damaged or stores text in an unusual visual order.",
    ctaLabel: "Try PDF to Text",
    canonical: "/guides/why-pdf-text-extraction-fails",
    image: textImage,
    quickAnswer:
      "If extraction fails, check whether the PDF is scanned, password-protected, damaged or built with text that does not follow normal reading order.",
    quickSteps: [
      "Open the PDF and try selecting text.",
      "Check whether it asks for a password.",
      "Try a smaller page range if the file is very large.",
      "Use OCR if the PDF is image-only.",
    ],
    sections: [
      {
        heading: "A PDF can display text without storing text normally",
        body: [
          "PDFs are visual page documents. Some store text as many positioned fragments. Others store whole pages as images. Both can look readable, but extraction behavior is very different.",
          "That is why extracted text can be missing, out of order or empty even when the page looks fine.",
        ],
      },
      {
        heading: "Protected PDFs must be unlocked first",
        body: [
          "If the PDF is encrypted, text extraction may be blocked until the correct password is provided. Unlocking requires permission and the known password.",
        ],
      },
    ],
    faq: [
      {
        question: "Why is the extracted text out of order?",
        answer:
          "PDF text can be stored by visual position rather than natural paragraph order, especially in columns or complex layouts.",
      },
      {
        question: "Why did PDF to Text return no text?",
        answer:
          "The PDF may be scanned or image-only. OCR is required for those files.",
      },
    ],
    relatedLinks: [
      { label: "PDF to Text", href: "/pdf-to-text", text: "Extract readable text when present." },
      { label: "Why can't I copy text from PDF?", href: "/guides/why-cant-i-copy-text-from-pdf", text: "Troubleshoot copy failures." },
      { label: "Unlock PDF", href: "/unlock-pdf", text: "Unlock protected files with the known password." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
];
