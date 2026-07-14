export type GuideFaqItem = {
  question: string;
  answer: string;
};

export type GuideLink = {
  label: string;
  href: string;
  text: string;
};

export type GuideSection = {
  heading: string;
  body: string[];
  list?: string[];
};

export type ExtractPagesGuide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intent: "guide" | "problem" | "comparison";
  primaryKeyword: string;
  secondaryKeywords: string[];
  summary: string;
  ctaLabel: string;
  canonical: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  quickSteps?: string[];
  sections: GuideSection[];
  faq: GuideFaqItem[];
  relatedLinks: GuideLink[];
};

const extractToolLink = {
  label: "Extract Pages",
  href: "/extract-pages",
  text: "Open the visual page picker and save selected PDF pages.",
};

const organizeLinks = [
  {
    label: "Delete Pages",
    href: "/delete-pages",
    text: "Remove unwanted pages and keep the rest of the PDF.",
  },
  {
    label: "Split PDF",
    href: "/split-pdf",
    text: "Use typed page ranges or split every page into files.",
  },
  {
    label: "Reorder Pages",
    href: "/reorder-pages",
    text: "Move PDF pages into the right order before exporting.",
  },
  {
    label: "Merge PDF",
    href: "/merge-pdf",
    text: "Combine extracted pages with other PDF documents.",
  },
] satisfies GuideLink[];

const defaultImage = {
  src: "/images/seo/extract-pages/extract-pages-before.png",
  alt: "LiftPDF Extract Pages visual page picker with PDF thumbnails",
  width: 1280,
  height: 860,
};

const resultImage = {
  src: "/images/seo/extract-pages/extract-pages-after.png",
  alt: "LiftPDF Extract Pages success state after selected pages are exported",
  width: 1280,
  height: 860,
};

export const extractPagesGuides: ExtractPagesGuide[] = [
  {
    slug: "how-to-extract-pages-from-pdf",
    title: "How to Extract Pages From a PDF | LiftPDF",
    description:
      "Learn how to extract selected pages from a PDF online, save them as a new PDF and keep your file private in the browser.",
    h1: "How to Extract Pages From a PDF",
    intent: "guide",
    primaryKeyword: "how to extract pages from pdf",
    secondaryKeywords: [
      "extract pdf pages",
      "extract selected pages from pdf",
      "pdf page extractor",
    ],
    summary:
      "The fastest way to extract PDF pages is to preview the document, select the pages you need, and export those pages into a new PDF. LiftPDF does this in your browser, so the file does not need to be uploaded to a server.",
    ctaLabel: "Extract PDF pages",
    canonical: "/guides/how-to-extract-pages-from-pdf",
    image: defaultImage,
    quickSteps: [
      "Open Extract Pages.",
      "Drop your PDF into the upload area.",
      "Wait for the page thumbnails to appear.",
      "Select the pages you want to keep.",
      "Click Extract Selected and download the new PDF.",
    ],
    sections: [
      {
        heading: "When extraction is the right choice",
        body: [
          "Use extraction when you need a smaller PDF that contains only selected pages from a larger document. It is different from deleting pages: extraction starts with the pages you want to keep, while deletion starts with the pages you want to remove.",
          "This is useful for contracts, reports, invoices, books, course material and scanned packets where sending the full document would be unnecessary or risky.",
        ],
      },
      {
        heading: "How the LiftPDF workflow works",
        body: [
          "After you upload a PDF, LiftPDF renders page thumbnails so you can make a visual decision. This helps prevent page-number mistakes, especially when cover pages, blank pages or appendices change the expected numbering.",
          "When you export, the selected pages are copied into a new PDF in their original order. The operation is designed to preserve page content and layout.",
        ],
      },
      {
        heading: "Privacy and file safety",
        body: [
          "The extraction workflow runs locally in your browser. That means your PDF does not need to be sent to a backend just to copy selected pages.",
          "For sensitive files, this is the main reason to use LiftPDF: the document remains on your device during the extraction process.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "Do not rely only on memory when choosing page numbers. Preview the thumbnails and confirm that the selected pages match what you need.",
          "If the PDF is password protected, unlock it first with the correct password. If the PDF is scanned, extraction still works for whole pages, but it will not turn images into selectable text.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I extract pages from a PDF for free?",
        answer:
          "Yes. LiftPDF lets you extract selected pages from a PDF for free in your browser.",
      },
      {
        question: "Are my PDF files uploaded?",
        answer:
          "No. The extraction workflow is handled locally in your browser for supported files.",
      },
      {
        question: "Can I extract non-consecutive pages?",
        answer:
          "Yes. Select any page thumbnails you need. The output keeps selected pages in their original order.",
      },
      {
        question: "Will the extracted PDF lose quality?",
        answer:
          "No. LiftPDF copies the selected PDF pages into a new document instead of rasterizing them.",
      },
    ],
    relatedLinks: [extractToolLink, ...organizeLinks],
  },
  {
    slug: "extract-one-page-from-pdf",
    title: "How to Extract One Page From a PDF | LiftPDF",
    description:
      "Extract one page from a PDF and save it as a new one-page PDF directly in your browser.",
    h1: "How to Extract One Page From a PDF",
    intent: "guide",
    primaryKeyword: "extract one page from pdf",
    secondaryKeywords: [
      "save one page from pdf",
      "extract single page from pdf",
      "one page pdf extractor",
    ],
    summary:
      "To extract one page, upload the PDF, select exactly one page thumbnail, and export. The result is a new PDF containing only that selected page.",
    ctaLabel: "Extract one page",
    canonical: "/guides/extract-one-page-from-pdf",
    image: defaultImage,
    quickSteps: [
      "Open Extract Pages.",
      "Upload the PDF.",
      "Click only the page you want to save.",
      "Confirm that one page is selected.",
      "Export and download the new one-page PDF.",
    ],
    sections: [
      {
        heading: "Best cases for one-page extraction",
        body: [
          "Single-page extraction is useful when you need one receipt, one contract page, one certificate, one invoice or one signature page from a larger PDF.",
          "It also helps when a document contains private surrounding pages that should not be shared with the recipient.",
        ],
      },
      {
        heading: "Why thumbnails matter",
        body: [
          "Page numbers can be misleading when a PDF has a cover page or blank pages. A visual thumbnail lets you confirm the exact page before creating the new file.",
          "LiftPDF shows the pages before export so you can avoid accidentally sending the wrong page.",
        ],
      },
      {
        heading: "What happens to the original PDF",
        body: [
          "The original PDF is not changed. LiftPDF creates a separate PDF containing the selected page.",
          "If you need to remove the page from the original document instead, use Delete Pages.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I save only page 1 from a PDF?",
        answer:
          "Yes. Select only page 1 and export. The output will be a one-page PDF.",
      },
      {
        question: "Can I extract a single page without Adobe Acrobat?",
        answer:
          "Yes. LiftPDF can extract one page in the browser without Acrobat or a desktop installer.",
      },
      {
        question: "Does extracting one page delete it from the original file?",
        answer:
          "No. Extraction creates a new PDF. It does not edit or overwrite the original document.",
      },
    ],
    relatedLinks: [extractToolLink, ...organizeLinks],
  },
  {
    slug: "extract-multiple-pages-from-pdf",
    title: "How to Extract Multiple PDF Pages | LiftPDF",
    description:
      "Select multiple PDF pages and save them into one clean PDF while preserving the original page order.",
    h1: "How to Extract Multiple Pages From a PDF",
    intent: "guide",
    primaryKeyword: "extract multiple pages from pdf",
    secondaryKeywords: [
      "extract selected pages from pdf",
      "save selected pdf pages",
      "extract several pages from pdf",
    ],
    summary:
      "To extract multiple pages, select each thumbnail you want to keep and export them together. LiftPDF keeps the selected pages in their original order.",
    ctaLabel: "Extract selected pages",
    canonical: "/guides/extract-multiple-pages-from-pdf",
    image: defaultImage,
    quickSteps: [
      "Upload the PDF.",
      "Review the page thumbnails.",
      "Select every page you want in the new PDF.",
      "Check the selected-page counter.",
      "Export the selected pages.",
    ],
    sections: [
      {
        heading: "Selecting pages visually",
        body: [
          "Multiple-page extraction is safer when you select pages visually. This matters when a PDF includes cover sheets, dividers or blank pages that change the expected numbering.",
          "The new PDF is built from the selected pages only. Unselected pages stay out of the exported file.",
        ],
      },
      {
        heading: "Original order vs custom order",
        body: [
          "Extract Pages keeps selected pages in the original document order. This is usually best for reports, contracts and packets where the sequence should remain familiar.",
          "If you need to change the order first, use Reorder Pages, then extract or export the reordered document.",
        ],
      },
      {
        heading: "One PDF or separate files",
        body: [
          "LiftPDF Extract Pages creates one new PDF from the selected pages. If your goal is to create separate files for every page, use Split PDF instead.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I extract pages 2, 5 and 8?",
        answer:
          "Yes. Select those thumbnails and export. The output will contain the selected pages in original order.",
      },
      {
        question: "Can I reorder the extracted pages?",
        answer:
          "Extract Pages preserves original order. Use Reorder Pages if you need a custom sequence.",
      },
      {
        question: "Can I extract all pages into one PDF?",
        answer:
          "If you select all pages, the output will contain all pages. For separate one-page PDFs, use Split PDF.",
      },
    ],
    relatedLinks: [extractToolLink, ...organizeLinks],
  },
  {
    slug: "extract-pdf-pages-without-adobe",
    title: "Extract PDF Pages Without Adobe | LiftPDF",
    description:
      "Extract selected PDF pages without Adobe Acrobat using a private browser-based workflow.",
    h1: "How to Extract PDF Pages Without Adobe",
    intent: "guide",
    primaryKeyword: "extract pdf pages without adobe",
    secondaryKeywords: [
      "extract pages without acrobat",
      "free pdf page extractor",
      "browser pdf extractor",
    ],
    summary:
      "You do not need Adobe Acrobat for basic page extraction. LiftPDF lets you select PDF pages and export them in your browser.",
    ctaLabel: "Extract without Adobe",
    canonical: "/guides/extract-pdf-pages-without-adobe",
    image: resultImage,
    quickSteps: [
      "Open the browser-based Extract Pages tool.",
      "Upload the PDF from your device.",
      "Select the pages you want to save.",
      "Export the selected pages.",
      "Download the new PDF.",
    ],
    sections: [
      {
        heading: "What you can do without Acrobat",
        body: [
          "For basic extraction, you can create a new PDF from selected pages without installing Acrobat. The key requirement is that the PDF can be read by the browser.",
          "LiftPDF is designed for this everyday task: preview pages, pick what you need, and download the result.",
        ],
      },
      {
        heading: "When Acrobat may still be needed",
        body: [
          "Complex enterprise workflows, redaction, prepress tools, advanced forms and heavily damaged PDFs may need dedicated desktop software.",
          "LiftPDF should be used when you need a fast, private page extraction workflow, not a full Acrobat replacement for every professional editing scenario.",
        ],
      },
      {
        heading: "Why browser processing matters",
        body: [
          "Traditional online tools often upload the PDF before processing. LiftPDF focuses on browser-side processing for supported files, which is better for private everyday documents.",
        ],
      },
    ],
    faq: [
      {
        question: "Is LiftPDF a replacement for Adobe Acrobat?",
        answer:
          "No. LiftPDF is a focused browser tool for common PDF tasks. It is useful when you need quick page extraction without a full desktop editor.",
      },
      {
        question: "Do I need an account?",
        answer:
          "No. You can use the Extract Pages tool without creating an account.",
      },
      {
        question: "Can I use it on Windows or Mac?",
        answer:
          "Yes. It works in modern browsers on Windows, macOS, Linux and mobile devices.",
      },
    ],
    relatedLinks: [extractToolLink, ...organizeLinks],
  },
  {
    slug: "extract-pages-from-password-protected-pdf",
    title: "Extract Pages From a Password Protected PDF | LiftPDF",
    description:
      "Learn what to do before extracting pages from a password-protected PDF and why you need the correct password.",
    h1: "How to Extract Pages From a Password Protected PDF",
    intent: "problem",
    primaryKeyword: "extract pages from password protected pdf",
    secondaryKeywords: [
      "password protected pdf pages",
      "unlock pdf before extracting pages",
      "extract encrypted pdf pages",
    ],
    summary:
      "If a PDF is encrypted, you need the correct password before extracting pages. LiftPDF does not bypass passwords; it only works with files you can legally open.",
    ctaLabel: "Unlock then extract pages",
    canonical: "/guides/extract-pages-from-password-protected-pdf",
    image: resultImage,
    quickSteps: [
      "Confirm that you have permission to open the PDF.",
      "Use Unlock PDF with the correct password.",
      "Download the unlocked copy.",
      "Open Extract Pages.",
      "Select and export the pages you need.",
    ],
    sections: [
      {
        heading: "Why extraction can fail on protected PDFs",
        body: [
          "Password protection prevents unauthorized access to the PDF content. A page extractor cannot safely copy pages from a file it cannot read.",
          "That is why the correct workflow is to unlock the PDF first with the password, then extract the pages from the unlocked copy.",
        ],
      },
      {
        heading: "What LiftPDF will not do",
        body: [
          "LiftPDF does not recover lost passwords, bypass encryption or remove restrictions without authorization.",
          "This is intentional. A trustworthy PDF tool should not pretend that password protection can be ignored.",
        ],
      },
      {
        heading: "After unlocking",
        body: [
          "Once the file opens normally, you can use Extract Pages to select the pages you need and save them into a new PDF.",
          "If the document is sensitive, use browser-based tools and avoid uploading files unnecessarily.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I extract pages without knowing the password?",
        answer:
          "No. You need the correct password or an unlocked copy of the PDF.",
      },
      {
        question: "Does LiftPDF bypass PDF passwords?",
        answer:
          "No. LiftPDF only unlocks PDFs when you provide the correct password.",
      },
      {
        question: "Should I protect the extracted PDF again?",
        answer:
          "If the extracted pages are sensitive, use Protect PDF after extraction to add password encryption to the new file.",
      },
    ],
    relatedLinks: [
      {
        label: "Unlock PDF",
        href: "/unlock-pdf",
        text: "Remove password protection when you have the correct password.",
      },
      extractToolLink,
      {
        label: "Protect PDF",
        href: "/protect-pdf",
        text: "Encrypt the extracted PDF if it contains sensitive pages.",
      },
      ...organizeLinks,
    ],
  },
  {
    slug: "extract-pages-from-scanned-pdf",
    title: "Extract Pages From a Scanned PDF | LiftPDF",
    description:
      "Learn how page extraction works with scanned PDFs, image-only pages and OCR limitations.",
    h1: "How to Extract Pages From a Scanned PDF",
    intent: "problem",
    primaryKeyword: "extract pages from scanned pdf",
    secondaryKeywords: [
      "scanned pdf extract pages",
      "image based pdf extract pages",
      "ocr extract pages pdf",
    ],
    summary:
      "You can extract whole pages from a scanned PDF because the page is copied as part of the PDF. OCR is only needed if you want to extract editable text from the scanned image.",
    ctaLabel: "Extract scanned PDF pages",
    canonical: "/guides/extract-pages-from-scanned-pdf",
    image: defaultImage,
    quickSteps: [
      "Upload the scanned PDF.",
      "Wait for page thumbnails.",
      "Select the scanned pages you need.",
      "Export a new PDF.",
      "Use OCR later only if you need selectable text.",
    ],
    sections: [
      {
        heading: "Page extraction is not OCR",
        body: [
          "A scanned PDF usually contains images of pages. Extracting pages copies those pages into a new PDF, but it does not convert the image into editable text.",
          "This is still useful when you need to share only a few scanned pages from a larger packet.",
        ],
      },
      {
        heading: "Why scanned pages may look blank",
        body: [
          "If a scan is damaged, unusually encoded or protected, the preview may fail or appear blank. Try opening the file in a PDF viewer first to confirm the page itself is readable.",
          "If the PDF is password protected, unlock it before extraction.",
        ],
      },
      {
        heading: "When you need OCR",
        body: [
          "Use OCR when you need selectable or searchable text from scanned pages. Extract Pages is for copying whole pages, not recognizing words inside images.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I extract scanned pages?",
        answer:
          "Yes. You can select and copy whole scanned pages into a new PDF.",
      },
      {
        question: "Will the extracted scanned PDF become searchable?",
        answer:
          "No. Page extraction does not add OCR. The page remains image-based unless OCR is applied separately.",
      },
      {
        question: "Can I extract text from a scanned PDF?",
        answer:
          "Not with Extract Pages. Use OCR for scanned text, or PDF to Text for PDFs that already contain selectable text.",
      },
    ],
    relatedLinks: [
      extractToolLink,
      {
        label: "PDF to Text",
        href: "/pdf-to-text",
        text: "Extract selectable text from PDFs that already contain text.",
      },
      ...organizeLinks,
    ],
  },
  {
    slug: "extract-pages-vs-split-pdf",
    title: "Extract Pages vs Split PDF | LiftPDF",
    description:
      "Understand when to use Extract Pages, Split PDF, Delete Pages or Reorder Pages for PDF page management.",
    h1: "Extract Pages vs Split PDF",
    intent: "comparison",
    primaryKeyword: "extract pages vs split pdf",
    secondaryKeywords: [
      "extract pages or split pdf",
      "difference between split and extract pdf",
      "delete pages vs extract pages",
    ],
    summary:
      "Use Extract Pages when you want one new PDF containing selected pages. Use Split PDF when you want ranges or separate files. Use Delete Pages when most of the document should stay.",
    ctaLabel: "Extract selected pages",
    canonical: "/guides/extract-pages-vs-split-pdf",
    image: resultImage,
    sections: [
      {
        heading: "The quick decision table",
        body: [
          "Choose the tool based on the output you want, not just the input PDF. Most mistakes happen when users use Split PDF for a selection task or Delete Pages when they only need a short excerpt.",
        ],
        list: [
          "Extract Pages: save selected pages into one new PDF.",
          "Split PDF: create files from ranges or every page.",
          "Delete Pages: remove unwanted pages and keep the rest.",
          "Reorder Pages: change page order before exporting.",
          "Merge PDF: combine extracted pages with other documents.",
        ],
      },
      {
        heading: "When Extract Pages is better",
        body: [
          "Extract Pages is best when you already know which pages matter and the rest should not be included. It is especially good for contracts, reports, books and invoice packets.",
          "The visual thumbnail workflow reduces mistakes because you choose the pages you want to keep.",
        ],
      },
      {
        heading: "When Split PDF is better",
        body: [
          "Split PDF is better when you want to separate a document by typed ranges or create one file per page. It is faster when the page numbers are known and the output should be split into multiple files.",
        ],
      },
      {
        heading: "When Delete Pages is better",
        body: [
          "Delete Pages is better when the final PDF should contain most of the original document. Instead of selecting the pages to keep, you select the pages to remove.",
        ],
      },
    ],
    faq: [
      {
        question: "Is extracting pages the same as splitting a PDF?",
        answer:
          "No. Extracting usually saves selected pages into a new PDF. Splitting usually creates files from ranges or every page.",
      },
      {
        question: "Should I delete pages or extract pages?",
        answer:
          "Extract pages when you need a small excerpt. Delete pages when most of the document should remain.",
      },
      {
        question: "Can I reorder pages before extracting?",
        answer:
          "Use Reorder Pages first if you need a custom order, then export the document or extract the pages you need.",
      },
    ],
    relatedLinks: [extractToolLink, ...organizeLinks],
  },
];

export function getExtractPagesGuide(slug: string) {
  return extractPagesGuides.find((guide) => guide.slug === slug);
}
