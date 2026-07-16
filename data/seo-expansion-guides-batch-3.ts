import type { FoundationGuide } from "@/data/foundation-guides";

const splitImage = {
  src: "/images/editorial/split-pdf-page-range-workflow.svg",
  alt: "Split PDF workflow showing page ranges becoming separate PDF outputs",
  width: 1200,
  height: 720,
};

const selectedPagesImage = {
  src: "/images/editorial/save-selected-pdf-pages-workflow.svg",
  alt: "Selected PDF pages workflow showing one page and multiple selected pages saved as a new PDF",
  width: 1200,
  height: 720,
};

const finalCheckImage = {
  src: "/images/editorial/pdf-final-checklist-workflow.svg",
  alt: "Final PDF checklist workflow showing page order, file size, numbering and download checks",
  width: 1200,
  height: 720,
};

const editControlsImage = {
  src: "/images/editorial/pdf-editing-controls-workflow.svg",
  alt: "PDF editing controls workflow showing rotate, watermark and page number actions",
  width: 1200,
  height: 720,
};

export const seoExpansionGuidesBatch3: FoundationGuide[] = [
  {
    slug: "split-pdf-into-separate-pages",
    title: "How to Split a PDF Into Separate Pages | LiftPDF",
    description:
      "Split a PDF into individual page files and understand when separate pages are better than one extracted PDF.",
    h1: "How to Split a PDF Into Separate Pages",
    topic: "Organize PDF",
    primaryKeyword: "split pdf into separate pages",
    summary:
      "Split every page when each page needs to become its own PDF. Use Extract Pages when selected pages should stay together in one file.",
    ctaLabel: "Split PDF",
    canonical: "/guides/split-pdf-into-separate-pages",
    image: splitImage,
    quickAnswer:
      "Upload the PDF to Split PDF, choose Split every page, generate the output and download the ZIP containing one PDF per page.",
    quickSteps: [
      "Open Split PDF.",
      "Upload the PDF.",
      "Choose Split every page.",
      "Download the ZIP with separate page PDFs.",
    ],
    sections: [
      {
        heading: "When separate pages make sense",
        body: [
          "Separate page files are useful when a form, packet or scan needs to be distributed page by page. It is different from extracting a few pages into one smaller document.",
          "If the recipient needs one focused PDF, use Extract Pages. If your workflow needs many individual files, split every page.",
        ],
      },
      {
        heading: "Why multiple outputs download as ZIP",
        body: [
          "A browser should not trigger dozens of individual downloads at once. A ZIP keeps all split pages together and preserves the page files in one package.",
        ],
      },
    ],
    faq: [
      {
        question: "Will splitting change the original PDF?",
        answer:
          "No. LiftPDF creates new output files and leaves the original PDF unchanged.",
      },
      {
        question: "What if I only need pages 2 to 5?",
        answer:
          "Use Extract page ranges instead of splitting every page.",
      },
    ],
    relatedLinks: [
      { label: "Split PDF", href: "/split-pdf", text: "Split every page or extract ranges." },
      { label: "Extract Pages", href: "/extract-pages", text: "Save selected pages as one PDF." },
      { label: "Extract vs Split PDF", href: "/guides/extract-pages-vs-split-pdf", text: "Choose the right output." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "split-pdf-by-page-range",
    title: "How to Split a PDF by Page Range | LiftPDF",
    description:
      "Use page ranges such as 1-3 or 5,8-10 to create a focused PDF from part of a larger document.",
    h1: "How to Split a PDF by Page Range",
    topic: "Organize PDF",
    primaryKeyword: "split pdf by page range",
    summary:
      "Page ranges let you export only the sections you need without manually deleting every other page.",
    ctaLabel: "Split PDF",
    canonical: "/guides/split-pdf-by-page-range",
    image: splitImage,
    quickAnswer:
      "Use range syntax like 1-3, 5, 8-10, check that every page exists, then split the PDF into the selected range output.",
    quickSteps: [
      "Upload the PDF to Split PDF.",
      "Choose Extract page ranges.",
      "Enter a range such as 1-3, 5, 8-10.",
      "Download the resulting PDF or ZIP.",
    ],
    sections: [
      {
        heading: "Range syntax should stay simple",
        body: [
          "Most users only need individual pages, continuous ranges or a comma-separated mix. A clear input such as 1-3, 5, 8-10 is easier to verify than complex rules.",
          "Before exporting, check the PDF page count. A range that includes a page outside the document should be blocked rather than silently ignored.",
        ],
      },
      {
        heading: "Use ranges for sections",
        body: [
          "Page ranges are useful for reports, contracts, books and application packets where only one section must be shared.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I enter multiple ranges?",
        answer:
          "Yes. Use commas to combine ranges and single pages, for example 1-2, 5, 9-12.",
      },
      {
        question: "What happens if the range is invalid?",
        answer:
          "LiftPDF validates the range and shows an error instead of creating a misleading output.",
      },
    ],
    relatedLinks: [
      { label: "Split PDF", href: "/split-pdf", text: "Split by ranges or every page." },
      { label: "Extract Pages", href: "/extract-pages", text: "Select pages visually." },
      { label: "Save selected PDF pages", href: "/guides/save-selected-pages-from-pdf", text: "Compare selection workflows." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "save-selected-pages-from-pdf",
    title: "How to Save Selected Pages From a PDF | LiftPDF",
    description:
      "Save one or more selected PDF pages as a new PDF without changing the original file.",
    h1: "How to Save Selected Pages From a PDF",
    topic: "Organize PDF",
    primaryKeyword: "save selected pages from pdf",
    summary:
      "Use Extract Pages when the selected pages should become one clean PDF copy and the original file should remain unchanged.",
    ctaLabel: "Extract Pages",
    canonical: "/guides/save-selected-pages-from-pdf",
    image: selectedPagesImage,
    quickAnswer:
      "Upload the PDF, select the pages you want to keep, extract them and download a new PDF containing only those selected pages.",
    quickSteps: [
      "Open Extract Pages.",
      "Upload the PDF.",
      "Select one or more pages.",
      "Download the extracted PDF.",
    ],
    sections: [
      {
        heading: "Selected pages are a copy",
        body: [
          "Extracting selected pages creates a new PDF. It does not delete pages from the original file, which makes it safer for sending only a section of a larger document.",
          "This workflow is common for invoices, contracts, reports, permits and application packets.",
        ],
      },
      {
        heading: "Check thumbnails before exporting",
        body: [
          "Cover pages, blank scan pages and appendices can shift page numbers. Use visual previews when available so the selected pages match the content you intend to send.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I save just one page?",
        answer:
          "Yes. Select one page and extract it as a new one-page PDF.",
      },
      {
        question: "Is this the same as Delete Pages?",
        answer:
          "No. Extract Pages keeps selected pages. Delete Pages removes selected pages from the output copy.",
      },
    ],
    relatedLinks: [
      { label: "Extract Pages", href: "/extract-pages", text: "Save selected pages as a PDF." },
      { label: "Delete Pages", href: "/delete-pages", text: "Remove pages instead." },
      { label: "Extract one page", href: "/guides/extract-one-page-from-pdf", text: "Learn the one-page workflow." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "delete-pages-from-pdf-before-sending",
    title: "Delete Pages From a PDF Before Sending It | LiftPDF",
    description:
      "Remove irrelevant, blank or private pages before sharing a PDF with someone else.",
    h1: "Delete Pages From a PDF Before Sending It",
    topic: "Organize PDF",
    primaryKeyword: "delete pages from pdf before sending",
    summary:
      "Before sending a PDF, remove pages the recipient should not see, then review the cleaned output from first page to last.",
    ctaLabel: "Delete Pages",
    canonical: "/guides/delete-pages-from-pdf-before-sending",
    image: selectedPagesImage,
    quickAnswer:
      "Upload the PDF to Delete Pages, select the pages to remove, generate a cleaned copy and verify that the remaining pages are correct.",
    quickSteps: [
      "Open Delete Pages.",
      "Upload the PDF.",
      "Select pages that should be removed.",
      "Download and review the cleaned PDF.",
    ],
    sections: [
      {
        heading: "Deletion is about reducing what you share",
        body: [
          "Deleting pages is useful when a document includes blank pages, duplicate pages, unrelated sections or private information that does not belong in the shared copy.",
          "If you only need to send a few pages from a large file, Extract Pages may be cleaner than deleting everything else.",
        ],
      },
      {
        heading: "Never delete blindly",
        body: [
          "Always open the output before sending. Accidentally removing a signature page, appendix or instruction page can make the document incomplete.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I delete all pages?",
        answer:
          "No. A valid PDF output needs at least one page.",
      },
      {
        question: "Does the original file change?",
        answer:
          "No. LiftPDF creates a new PDF download.",
      },
    ],
    relatedLinks: [
      { label: "Delete Pages", href: "/delete-pages", text: "Remove unwanted pages." },
      { label: "Extract Pages", href: "/extract-pages", text: "Save selected pages instead." },
      { label: "Remove blank pages", href: "/guides/remove-blank-pages-from-pdf", text: "Clean scan artifacts." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "organize-pdf-before-printing",
    title: "How to Organize a PDF Before Printing | LiftPDF",
    description:
      "Prepare a PDF for printing by checking page order, orientation, blank pages and page numbers.",
    h1: "How to Organize a PDF Before Printing",
    topic: "Organize PDF",
    primaryKeyword: "organize pdf before printing",
    summary:
      "Print-ready PDFs should have the right pages, correct order, readable orientation and page numbers added only after the layout is final.",
    ctaLabel: "Organize PDF tools",
    canonical: "/guides/organize-pdf-before-printing",
    image: finalCheckImage,
    quickAnswer:
      "Before printing, remove blank pages, fix page order, rotate sideways pages and add page numbers only after the document is final.",
    quickSteps: [
      "Remove blank or duplicate pages.",
      "Reorder pages into reading sequence.",
      "Rotate sideways pages.",
      "Add page numbers if the printed packet needs them.",
    ],
    sections: [
      {
        heading: "Printing reveals small mistakes",
        body: [
          "A PDF that looks acceptable on screen can be frustrating on paper if pages are out of order, blank pages waste sheets or scanned pages print sideways.",
          "Do the cleanup before page numbering, watermarking or compression so the final printed PDF is coherent.",
        ],
      },
      {
        heading: "Use the smallest necessary tool",
        body: [
          "You do not need a full editor for every printing problem. Delete blank pages, reorder the sequence or rotate scans depending on the visible issue.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I compress before printing?",
        answer:
          "Usually no, unless file size makes the PDF hard to transfer. Compression is not a print-quality improvement.",
      },
      {
        question: "Should page numbers be added before or after reorder?",
        answer:
          "After. Numbering should match the final page order.",
      },
    ],
    relatedLinks: [
      { label: "Reorder Pages", href: "/reorder-pages", text: "Put pages in sequence." },
      { label: "Rotate PDF", href: "/rotate-pdf", text: "Fix sideways pages." },
      { label: "Add Page Numbers", href: "/add-page-numbers", text: "Number the finished PDF." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "prepare-pdf-for-email",
    title: "How to Prepare a PDF for Email | LiftPDF",
    description:
      "Prepare a PDF email attachment by checking file size, pages, password protection and readability.",
    h1: "How to Prepare a PDF for Email",
    topic: "PDF Basics",
    primaryKeyword: "prepare pdf for email",
    summary:
      "A good email PDF is the right file, small enough to attach, readable and not password-protected unless the recipient expects it.",
    ctaLabel: "Compress PDF",
    canonical: "/guides/prepare-pdf-for-email",
    image: finalCheckImage,
    quickAnswer:
      "Before emailing a PDF, remove unnecessary pages, compress if needed, avoid accidental password locks and open the final file before sending.",
    quickSteps: [
      "Check that the PDF contains the right pages.",
      "Compress only if it exceeds the email limit.",
      "Avoid passwords unless expected.",
      "Open the attachment before sending.",
    ],
    sections: [
      {
        heading: "Email workflows need a final check",
        body: [
          "Email mistakes are usually simple: wrong file, huge attachment, missing pages or a password the recipient does not have. A short final check avoids most of them.",
          "If the file contains sensitive information, use password protection intentionally and send the password separately.",
        ],
      },
      {
        heading: "Use compression carefully",
        body: [
          "Compress when the file is too large, but do not compress the same document again and again. If it stays large, extract only the required pages or remove scans that do not belong.",
        ],
      },
    ],
    faq: [
      {
        question: "Is PDF better than images for email?",
        answer:
          "For multi-page documents, yes. PDF keeps pages together and easier to review.",
      },
      {
        question: "Should I send the password in the same email?",
        answer:
          "No. If you protect the PDF, share the password through a separate trusted channel.",
      },
    ],
    relatedLinks: [
      { label: "Compress PDF", href: "/compress-pdf", text: "Reduce attachment size." },
      { label: "Protect PDF", href: "/protect-pdf", text: "Add a password when needed." },
      { label: "Make PDF smaller for upload", href: "/guides/make-pdf-smaller-for-upload", text: "Use a similar upload checklist." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "rotate-pdf-before-upload",
    title: "Rotate PDF Before Upload: Fix Sideways Pages | LiftPDF",
    description:
      "Fix sideways PDF pages before uploading forms, scans, applications or assignment files.",
    h1: "Rotate PDF Before Upload",
    topic: "Organize PDF",
    primaryKeyword: "rotate pdf before upload",
    summary:
      "Rotate sideways pages before upload so reviewers do not have to turn pages manually or reject the file.",
    ctaLabel: "Rotate PDF",
    canonical: "/guides/rotate-pdf-before-upload",
    image: editControlsImage,
    quickAnswer:
      "Upload the PDF to Rotate PDF, rotate affected pages, download the corrected copy and open it once before uploading.",
    quickSteps: [
      "Open Rotate PDF.",
      "Upload the document.",
      "Rotate sideways pages.",
      "Download and verify before upload.",
    ],
    sections: [
      {
        heading: "Sideways pages can cause review problems",
        body: [
          "Many portals and reviewers expect documents to open in normal reading orientation. Sideways scans look careless and can slow down review.",
          "Fix rotation before adding page numbers, watermarks or final compression.",
        ],
      },
      {
        heading: "Rotate only what needs rotation",
        body: [
          "If only one page is sideways, rotate that page rather than all pages. If every scan came from the same orientation mistake, rotate all pages together.",
        ],
      },
    ],
    faq: [
      {
        question: "Does rotating a PDF change its content?",
        answer:
          "It changes page orientation, not the document text or scan itself.",
      },
      {
        question: "Can I rotate password-protected PDFs?",
        answer:
          "Protected PDFs may need to be unlocked with the correct password before processing.",
      },
    ],
    relatedLinks: [
      { label: "Rotate PDF", href: "/rotate-pdf", text: "Fix page orientation." },
      { label: "Unlock PDF", href: "/unlock-pdf", text: "Unlock protected files with permission." },
      { label: "Prepare PDF for upload", href: "/guides/make-pdf-smaller-for-upload", text: "Check upload readiness." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "watermark-pdf-before-sharing",
    title: "Watermark PDF Before Sharing: Draft, Review, Confidential | LiftPDF",
    description:
      "Add clear draft, review or confidential watermarks before sharing a PDF copy.",
    h1: "Watermark PDF Before Sharing",
    topic: "PDF Security",
    primaryKeyword: "watermark pdf before sharing",
    summary:
      "Watermarks help label a PDF copy, but they do not replace password protection or secure sharing.",
    ctaLabel: "Watermark PDF",
    canonical: "/guides/watermark-pdf-before-sharing",
    image: editControlsImage,
    quickAnswer:
      "Use Watermark PDF to add visible text such as Draft, Review or Confidential, then check that the document remains readable.",
    quickSteps: [
      "Open Watermark PDF.",
      "Upload the document.",
      "Choose text, position, opacity and rotation.",
      "Download and inspect the watermarked copy.",
    ],
    sections: [
      {
        heading: "Watermarks set expectations",
        body: [
          "A watermark can show that a file is a draft, review copy or confidential document. This is useful when the same PDF may circulate in several versions.",
          "A watermark is visible content. It does not encrypt the PDF or prevent forwarding.",
        ],
      },
      {
        heading: "Keep the content readable",
        body: [
          "A watermark should be noticeable without blocking the document. Lower opacity and diagonal placement often work well for review copies.",
        ],
      },
    ],
    faq: [
      {
        question: "Can a watermark protect a PDF?",
        answer:
          "It can label the file, but it does not restrict opening. Use Protect PDF for password protection.",
      },
      {
        question: "Should I watermark before or after merging?",
        answer:
          "Usually merge and finalize the document first, then watermark the finished copy.",
      },
    ],
    relatedLinks: [
      { label: "Watermark PDF", href: "/watermark-pdf", text: "Add a text or image watermark." },
      { label: "Protect PDF", href: "/protect-pdf", text: "Add password protection." },
      { label: "Confidential watermark guide", href: "/guides/add-confidential-watermark-to-pdf", text: "Use a specific confidential workflow." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "add-page-numbers-before-sharing-pdf",
    title: "Add Page Numbers Before Sharing a PDF | LiftPDF",
    description:
      "Add page numbers to a final PDF copy so recipients can reference pages clearly.",
    h1: "Add Page Numbers Before Sharing a PDF",
    topic: "Organize PDF",
    primaryKeyword: "add page numbers before sharing pdf",
    summary:
      "Page numbers help recipients discuss and review a PDF, especially when it contains reports, attachments or application packets.",
    ctaLabel: "Add Page Numbers",
    canonical: "/guides/add-page-numbers-before-sharing-pdf",
    image: editControlsImage,
    quickAnswer:
      "Finalize page order, add numbers in a readable position, then download and check the first and last pages.",
    quickSteps: [
      "Merge, delete or reorder pages first.",
      "Choose a clear page number format.",
      "Select position and size.",
      "Download the numbered PDF.",
    ],
    sections: [
      {
        heading: "Number after the PDF is final",
        body: [
          "Page numbering is easiest when the document structure is already final. If you reorder or delete pages after numbering, the result can be confusing.",
          "For longer documents, formats such as Page 1 of 10 make it easier for recipients to know whether they have the full file.",
        ],
      },
      {
        heading: "Readable beats decorative",
        body: [
          "Keep page numbers clear, small and consistently positioned. Avoid placing them over important document content.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I choose where numbers appear?",
        answer:
          "Yes. LiftPDF supports common top and bottom positions.",
      },
      {
        question: "Can I start at a number other than 1?",
        answer:
          "Yes. Start numbers are useful for appendices or combined packets.",
      },
    ],
    relatedLinks: [
      { label: "Add Page Numbers", href: "/add-page-numbers", text: "Number your final PDF." },
      { label: "Reorder Pages", href: "/reorder-pages", text: "Finalize order first." },
      { label: "Page numbers for reports", href: "/guides/add-page-numbers-to-pdf-report", text: "Use report-friendly numbering." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
  {
    slug: "extract-pdf-pages-for-email",
    title: "How to Extract PDF Pages for Email | LiftPDF",
    description:
      "Extract only the PDF pages needed for an email attachment instead of sending the whole document.",
    h1: "How to Extract PDF Pages for Email",
    topic: "Organize PDF",
    primaryKeyword: "extract pdf pages for email",
    summary:
      "If only a few pages are relevant, extracting them can create a smaller, clearer email attachment than sending the entire PDF.",
    ctaLabel: "Extract Pages",
    canonical: "/guides/extract-pdf-pages-for-email",
    image: selectedPagesImage,
    quickAnswer:
      "Select the pages the recipient needs, export them as one PDF, then attach the smaller copy to your email.",
    quickSteps: [
      "Open Extract Pages.",
      "Upload the source PDF.",
      "Select the pages needed for email.",
      "Download and attach the new PDF.",
    ],
    sections: [
      {
        heading: "Extracting reduces noise",
        body: [
          "A full PDF may include sections the recipient does not need. Extracting only relevant pages keeps the attachment focused and can reduce file size without quality loss.",
          "This is useful for invoices, certificates, application pages, contract sections and report excerpts.",
        ],
      },
      {
        heading: "Privacy benefit",
        body: [
          "Extracting pages can also avoid sharing unrelated or private information that happens to be in the same source document.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I extract or compress first?",
        answer:
          "Extract first when only some pages are needed. Compress afterward only if the extracted PDF is still too large.",
      },
      {
        question: "Can I extract pages from a protected PDF?",
        answer:
          "You may need to unlock it first with the correct password and permission.",
      },
    ],
    relatedLinks: [
      { label: "Extract Pages", href: "/extract-pages", text: "Save selected pages as a PDF." },
      { label: "Prepare PDF for email", href: "/guides/prepare-pdf-for-email", text: "Check the attachment workflow." },
      { label: "Compress PDF", href: "/compress-pdf", text: "Reduce size after extraction." },
    ],
    publishedAt: "2026-07-17",
    readingMinutes: 6,
  },
];
