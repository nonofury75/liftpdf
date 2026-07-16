import type { FoundationGuide } from "@/data/foundation-guides";

const basicsImage = {
  src: "/images/learn/pdf-basics.webp",
  alt: "PDF basics learning visual with document workflow",
  width: 1200,
  height: 720,
};

const imagesImage = {
  src: "/images/learn/pdf-images.webp",
  alt: "PDF and image formats learning visual",
  width: 1200,
  height: 720,
};

const organizeImage = {
  src: "/images/learn/organize-pdf.webp",
  alt: "Organize PDF visual with pages being merged and reordered",
  width: 1200,
  height: 720,
};

const securityImage = {
  src: "/images/learn/pdf-security.webp",
  alt: "PDF security learning visual with protected document",
  width: 1200,
  height: 720,
};

const troubleshootingImage = {
  src: "/images/learn/scanned-vs-searchable-pdf.webp",
  alt: "Troubleshooting visual comparing scanned and searchable PDFs",
  width: 1200,
  height: 720,
};

const commonLinks = [
  {
    label: "Learning Center",
    href: "/learn",
    text: "Browse related PDF guides and explanations.",
  },
  {
    label: "All PDF Tools",
    href: "/pdf-tools",
    text: "Choose the LiftPDF tool that matches your workflow.",
  },
];

export const additionalFoundationGuides: FoundationGuide[] = [
  {
    slug: "why-is-my-pdf-too-large",
    title: "Why Is My PDF Too Large? Causes and Fixes | LiftPDF",
    description:
      "Understand why a PDF file is too large and how to reduce size safely without damaging readability.",
    h1: "Why Is My PDF Too Large?",
    topic: "Troubleshooting",
    primaryKeyword: "why is my pdf too large",
    summary:
      "PDFs usually become large because of scans, high-resolution photos, embedded fonts, attachments or unnecessary pages.",
    ctaLabel: "Compress PDF",
    canonical: "/guides/why-is-my-pdf-too-large",
    image: troubleshootingImage,
    quickAnswer:
      "A PDF is usually too large because it contains image-heavy pages, scans, embedded assets or pages that do not need to be included. Remove unnecessary pages first, then compress once and check the result.",
    quickSteps: [
      "Check whether the PDF is scan-heavy or image-heavy.",
      "Remove pages that do not need to be sent.",
      "Compress the cleaned PDF once.",
      "Open the result and check small text before sharing.",
    ],
    sections: [
      {
        heading: "Large PDFs usually have a visible cause",
        body: [
          "A text-only PDF can be dozens of pages and still remain small. A one-page scan can be large if it contains a high-resolution image. Page count alone does not explain file size.",
          "Before compressing, ask what the PDF contains: scanned pages, photos, attachments, embedded fonts or repeated exports. The safest fix depends on that answer.",
        ],
      },
      {
        heading: "Fix the structure before compression",
        body: [
          "If the file includes blank pages, duplicate pages or sections the recipient does not need, remove those first. Compressing unnecessary pages wastes quality and still leaves a larger file than needed.",
        ],
        list: [
          "Use Delete Pages for blank or irrelevant pages.",
          "Use Extract Pages when only one section needs to be sent.",
          "Use Compress PDF after the page set is final.",
        ],
      },
    ],
    faq: [
      {
        question: "Can every PDF be made much smaller?",
        answer:
          "No. Already optimized text PDFs may not shrink much. Scan-heavy PDFs usually have more room for reduction.",
      },
      {
        question: "Will compression lower quality?",
        answer:
          "It can if the PDF contains images or scans. Always open the compressed file and check readability.",
      },
    ],
    relatedLinks: [
      { label: "Compress PDF", href: "/compress-pdf", text: "Reduce PDF file size." },
      { label: "Reduce PDF size for email", href: "/guides/how-to-reduce-pdf-file-size-for-email", text: "Prepare a smaller email attachment." },
      { label: "Delete Pages", href: "/delete-pages", text: "Remove pages before compression." },
    ],
    publishedAt: "2026-07-16",
    readingMinutes: 7,
  },
  {
    slug: "how-to-reduce-pdf-file-size-for-email",
    title: "How to Reduce PDF File Size for Email | LiftPDF",
    description:
      "Learn practical ways to make a PDF small enough for email without making the document unreadable.",
    h1: "How to Reduce PDF File Size for Email",
    topic: "PDF Basics",
    primaryKeyword: "reduce pdf file size for email",
    summary:
      "Start by removing pages you do not need, then compress the PDF once and check readability before sending.",
    ctaLabel: "Compress PDF",
    canonical: "/guides/how-to-reduce-pdf-file-size-for-email",
    image: basicsImage,
    quickAnswer:
      "To reduce a PDF for email, remove unnecessary pages first, compress the file once, then open the result and check small text before attaching it.",
    quickSteps: [
      "Check the email size limit.",
      "Delete or extract pages that do not need to be sent.",
      "Compress the cleaned PDF.",
      "Open the result and verify readability.",
    ],
    sections: [
      {
        heading: "Why email PDFs get rejected",
        body: [
          "Email systems often reject files because of attachment size limits. Large PDFs usually contain scans, photos, duplicate pages or embedded assets rather than plain text.",
          "Trying to compress the same file repeatedly can damage readability without solving the underlying problem. It is better to remove what should not be sent and compress the useful document once.",
        ],
      },
      {
        heading: "A clean email workflow",
        body: [
          "If the PDF contains pages the recipient does not need, use Delete Pages or Extract Pages before compression. If the file is a set of scans, expect compression to change image quality and check the result carefully.",
        ],
        list: [
          "Use Delete Pages for blank or irrelevant pages.",
          "Use Extract Pages when only one section needs to be sent.",
          "Use Compress PDF after the document structure is final.",
        ],
      },
    ],
    faq: [
      {
        question: "What size should an email PDF be?",
        answer:
          "Many email systems allow 10 MB to 25 MB, but the exact limit depends on the provider and recipient system.",
      },
      {
        question: "Can compression make a PDF unreadable?",
        answer:
          "Aggressive compression can reduce scan or image quality. Always open the compressed PDF before sending.",
      },
    ],
    relatedLinks: [
      { label: "Compress PDF", href: "/compress-pdf", text: "Reduce PDF size in your browser." },
      { label: "Delete Pages", href: "/delete-pages", text: "Remove pages before compressing." },
      { label: "Why is my PDF too large?", href: "/guides/why-is-my-pdf-too-large", text: "Diagnose what makes a PDF heavy." },
    ],
    publishedAt: "2026-07-16",
    readingMinutes: 6,
  },
  {
    slug: "how-to-combine-scanned-documents-into-one-pdf",
    title: "How to Combine Scanned Documents Into One PDF | LiftPDF",
    description:
      "Turn scanned pages or scan PDFs into one organized PDF while keeping page order clear.",
    h1: "How to Combine Scanned Documents Into One PDF",
    topic: "Organize PDF",
    primaryKeyword: "combine scanned documents into one pdf",
    summary:
      "Combine scans by checking page order first, converting photos to PDF if needed, then merging the final PDFs into one document.",
    ctaLabel: "Merge PDF",
    canonical: "/guides/how-to-combine-scanned-documents-into-one-pdf",
    image: organizeImage,
    quickAnswer:
      "If your scans are already PDFs, merge them. If they are phone photos, convert images to PDF first, then merge or organize the result.",
    quickSteps: [
      "Group scans by document section.",
      "Convert image scans to PDF if needed.",
      "Merge PDF files in the correct order.",
      "Reorder or delete pages before sending.",
    ],
    sections: [
      {
        heading: "Scans can be PDFs or images",
        body: [
          "A scanner app may create one PDF per scan session, while a camera app usually creates JPG or PNG images. The right workflow depends on the input files.",
          "Do not convert a PDF scan into images just to merge it again. Merge PDFs directly when possible because that preserves the page as a PDF page.",
        ],
      },
      {
        heading: "Order matters more than format labels",
        body: [
          "Scanned packets often include cover pages, IDs, forms and signatures. Put pages in review order before exporting so the recipient does not have to guess the sequence.",
        ],
      },
    ],
    faq: [
      {
        question: "Can scanned documents be searchable?",
        answer:
          "Only if OCR has been applied. A scan PDF can still be image-only even when it looks like typed text.",
      },
      {
        question: "Should I use Merge PDF or Images to PDF?",
        answer:
          "Use Merge PDF for PDF scans. Use Images to PDF when the scans are JPG, PNG or WEBP files.",
      },
    ],
    relatedLinks: [
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine scan PDFs into one file." },
      { label: "Images to PDF", href: "/images-to-pdf", text: "Turn image scans into a PDF." },
      { label: "Scanned vs searchable PDF", href: "/guides/scanned-pdf-vs-searchable-pdf", text: "Understand what your scan contains." },
    ],
    publishedAt: "2026-07-16",
    readingMinutes: 7,
  },
  {
    slug: "how-to-prepare-a-pdf-for-online-submission",
    title: "How to Prepare a PDF for Online Submission | LiftPDF",
    description:
      "Prepare a PDF for portals, school submissions, applications and online forms without unnecessary conversions.",
    h1: "How to Prepare a PDF for Online Submission",
    topic: "PDF Basics",
    primaryKeyword: "prepare pdf for online submission",
    summary:
      "A submission-ready PDF should have the right pages, readable quality, acceptable file size and no password unless the portal asks for one.",
    ctaLabel: "Browse PDF tools",
    canonical: "/guides/how-to-prepare-a-pdf-for-online-submission",
    image: basicsImage,
    quickAnswer:
      "Before uploading a PDF, check page order, remove irrelevant pages, confirm readability, reduce size only if needed and avoid password protection unless required.",
    quickSteps: [
      "Open the PDF and check every page.",
      "Delete or extract pages if the portal asks for a section.",
      "Compress only if the file exceeds the limit.",
      "Upload the final PDF and keep a copy.",
    ],
    sections: [
      {
        heading: "What online portals usually care about",
        body: [
          "Most portals care about file type, file size and readability. They rarely care which app created the PDF. The safest workflow is to make the smallest change that satisfies the requirement.",
          "If a portal asks for one PDF, merge related documents. If it asks for one section, extract it. If it sets a size limit, compress after the pages are final.",
        ],
      },
      {
        heading: "Submission checklist",
        body: [
          "A PDF that opens correctly on your device can still fail online if it is too large, encrypted or missing required pages. Check those basics before the deadline.",
        ],
        list: [
          "File extension is .pdf.",
          "All required pages are present and in order.",
          "Small text is readable after compression.",
          "The PDF is not password-protected unless requested.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I compress before every upload?",
        answer:
          "No. Compress only when the file is over the stated limit or clearly too large for the portal.",
      },
      {
        question: "Should submitted PDFs be password protected?",
        answer:
          "Only if the recipient or portal specifically requires password protection.",
      },
    ],
    relatedLinks: commonLinks,
    publishedAt: "2026-07-16",
    readingMinutes: 7,
  },
  {
    slug: "how-to-organize-pdf-pages-before-sending",
    title: "How to Organize PDF Pages Before Sending | LiftPDF",
    description:
      "Learn how to reorder, delete, extract and merge PDF pages before sending a clean final document.",
    h1: "How to Organize PDF Pages Before Sending",
    topic: "Organize PDF",
    primaryKeyword: "organize pdf pages before sending",
    summary:
      "Organize pages before sending by deciding whether the final task is reorder, delete, extract, split or merge.",
    ctaLabel: "Organize PDF",
    canonical: "/guides/how-to-organize-pdf-pages-before-sending",
    image: organizeImage,
    quickAnswer:
      "Use Reorder Pages when the pages are out of sequence, Delete Pages for unwanted pages, Extract Pages for a smaller copy and Merge PDF when several files belong together.",
    quickSteps: [
      "Open the PDF and identify the final recipient's need.",
      "Remove pages that should not be shared.",
      "Put pages in reading order.",
      "Merge attachments only after each file is clean.",
    ],
    sections: [
      {
        heading: "Choose the smallest edit",
        body: [
          "The best PDF organization workflow changes only what is necessary. Rebuilding a whole document when you only need to delete a blank page adds unnecessary risk.",
          "Think in terms of the recipient: what should they see first, what can be removed and whether the output should be one PDF or several files.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I merge before reordering?",
        answer:
          "Usually clean each file first, then merge, then do a final order check on the combined PDF.",
      },
      {
        question: "Can I delete all pages from a PDF?",
        answer:
          "No. A valid output PDF needs at least one page.",
      },
    ],
    relatedLinks: [
      { label: "Reorder Pages", href: "/reorder-pages", text: "Move pages into the right sequence." },
      { label: "Delete Pages", href: "/delete-pages", text: "Remove unwanted pages." },
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine cleaned PDFs." },
    ],
    publishedAt: "2026-07-16",
    readingMinutes: 6,
  },
  {
    slug: "how-to-turn-phone-photos-into-a-pdf",
    title: "How to Turn Phone Photos Into a PDF | LiftPDF",
    description:
      "Turn phone photos, receipts or document pictures into a PDF with clean page layout and readable quality.",
    h1: "How to Turn Phone Photos Into a PDF",
    topic: "PDF and Images",
    primaryKeyword: "turn phone photos into pdf",
    summary:
      "Use the original phone photos, put them in order, choose a page layout and export one PDF instead of sending loose images.",
    ctaLabel: "Convert images to PDF",
    canonical: "/guides/how-to-turn-phone-photos-into-a-pdf",
    image: imagesImage,
    quickAnswer:
      "Add the photos to JPG to PDF or Images to PDF, check the page preview, keep margins low for document photos and download one PDF.",
    quickSteps: [
      "Use original photos instead of compressed chat copies.",
      "Rotate or retake unreadable photos before converting.",
      "Add images in reading order.",
      "Use Fit when edges must remain visible.",
    ],
    sections: [
      {
        heading: "Photo quality matters before conversion",
        body: [
          "A converter can place photos into a PDF page, but it cannot fix motion blur, glare or missing edges. Retake important pages before converting if text is hard to read.",
          "For receipts and forms, even lighting and a straight-on photo usually matter more than any PDF setting.",
        ],
      },
    ],
    faq: [
      {
        question: "Should phone photos use JPG to PDF or Images to PDF?",
        answer:
          "Use JPG to PDF for JPG/JPEG photos. Use Images to PDF when the set includes JPG, PNG or WEBP files.",
      },
      {
        question: "Why is my photo PDF large?",
        answer:
          "Modern phone photos can be high resolution. Compress the final PDF only after checking readability.",
      },
    ],
    relatedLinks: [
      { label: "JPG to PDF", href: "/jpg-to-pdf", text: "Convert phone JPG photos into PDF." },
      { label: "Images to PDF", href: "/images-to-pdf", text: "Combine mixed image formats." },
      { label: "Keep PDF images sharp", href: "/guides/how-to-keep-pdf-images-sharp", text: "Avoid blurry output." },
    ],
    publishedAt: "2026-07-16",
    readingMinutes: 6,
  },
  {
    slug: "how-to-keep-pdf-images-sharp",
    title: "How to Keep PDF Images Sharp | LiftPDF",
    description:
      "Avoid blurry images in PDF files by choosing the right source image, layout and conversion workflow.",
    h1: "How to Keep PDF Images Sharp",
    topic: "PDF and Images",
    primaryKeyword: "keep pdf images sharp",
    summary:
      "Sharp PDF images start with high-resolution source files and layout settings that do not stretch or repeatedly recompress them.",
    ctaLabel: "Convert JPG to PDF",
    canonical: "/guides/how-to-keep-pdf-images-sharp",
    image: imagesImage,
    quickAnswer:
      "Use original images, avoid enlarging small files, choose Fit when edges matter and do not repeatedly resave JPGs before PDF conversion.",
    quickSteps: [
      "Start with the original image.",
      "Avoid screenshots of images.",
      "Use a page size close to the image shape when possible.",
      "Check the PDF before compressing it.",
    ],
    sections: [
      {
        heading: "Sharpness is mostly decided before export",
        body: [
          "If an image is already low resolution, placing it in a PDF will not restore detail. The PDF can preserve pixels, but it cannot invent missing pixels.",
          "For screenshots with small text, PNG often stays sharper than JPG. For camera photos, JPG is usually fine if the original has enough resolution.",
        ],
      },
    ],
    faq: [
      {
        question: "Does PDF make images blurry?",
        answer:
          "PDF itself does not have to blur images. Blurriness usually comes from low source resolution, stretching or heavy compression.",
      },
      {
        question: "Should I use Fit or Fill?",
        answer:
          "Use Fit when the whole image must remain visible. Fill can look larger but may crop edges.",
      },
    ],
    relatedLinks: [
      { label: "JPG to PDF quality guide", href: "/guides/how-to-convert-jpg-to-pdf-without-losing-quality", text: "Choose safer conversion settings." },
      { label: "Why JPG looks blurry", href: "/guides/why-is-my-jpg-blurry-after-pdf", text: "Diagnose blurry output." },
      { label: "JPG vs PNG", href: "/guides/jpg-vs-png", text: "Pick the right image format." },
    ],
    publishedAt: "2026-07-16",
    readingMinutes: 6,
  },
  {
    slug: "why-pdf-opens-blank",
    title: "Why a PDF Opens Blank and How to Fix It | LiftPDF",
    description:
      "Understand why a PDF may open as blank pages and what to check before converting, compressing or sending it.",
    h1: "Why a PDF Opens Blank and How to Fix It",
    topic: "Troubleshooting",
    primaryKeyword: "pdf opens blank",
    summary:
      "A blank-looking PDF can be damaged, encrypted, partially downloaded, image-only with rendering issues or created by an app with unusual layers.",
    ctaLabel: "Open Help Center",
    canonical: "/guides/why-pdf-opens-blank",
    image: troubleshootingImage,
    quickAnswer:
      "Try opening the PDF in another viewer, confirm it is fully downloaded, check whether it is protected and avoid processing it further until the pages display correctly.",
    quickSteps: [
      "Re-download the file if it came from email or a portal.",
      "Open it in another PDF viewer.",
      "Check for password protection.",
      "Ask for a fresh export if it still appears blank.",
    ],
    sections: [
      {
        heading: "Do not process a broken-looking PDF blindly",
        body: [
          "If a PDF opens blank, converting or compressing it can preserve the problem. Confirm the original file displays correctly before using any tool.",
          "Some blank-page issues are local viewer problems, while others mean the file is damaged or incomplete.",
        ],
      },
    ],
    faq: [
      {
        question: "Can LiftPDF repair blank PDFs?",
        answer:
          "LiftPDF does not claim to repair damaged PDFs. Start by getting a clean source file.",
      },
      {
        question: "Can a protected PDF look blank?",
        answer:
          "Some protected or unusual PDFs may fail to render correctly in certain viewers until opened with the right password or software.",
      },
    ],
    relatedLinks: [
      { label: "Help Center", href: "/help", text: "Check common PDF errors." },
      { label: "Unlock PDF", href: "/unlock-pdf", text: "Unlock a protected PDF when you know the password." },
      { label: "PDF to Text", href: "/pdf-to-text", text: "Check selectable text after the PDF opens correctly." },
    ],
    publishedAt: "2026-07-16",
    readingMinutes: 6,
  },
  {
    slug: "why-a-pdf-is-password-protected",
    title: "Why a PDF Is Password Protected | LiftPDF",
    description:
      "Learn why PDFs are password protected, what that means and why you need the correct password to unlock them.",
    h1: "Why a PDF Is Password Protected",
    topic: "PDF Security",
    primaryKeyword: "why is a pdf password protected",
    summary:
      "A PDF is usually password protected to limit opening, sharing or editing. Real protection means encryption, not just a warning label.",
    ctaLabel: "Learn PDF security",
    canonical: "/guides/why-a-pdf-is-password-protected",
    image: securityImage,
    quickAnswer:
      "PDFs are password protected to control access. To remove protection, you need the correct password; LiftPDF does not bypass unknown passwords.",
    quickSteps: [
      "Ask the document owner for the password.",
      "Open the file with the correct password.",
      "Unlock only files you have permission to modify.",
      "Protect the exported copy again if it remains sensitive.",
    ],
    sections: [
      {
        heading: "Why protection exists",
        body: [
          "Invoices, contracts, bank documents and confidential forms often contain personal or business information. Password protection reduces casual access when the file is shared.",
          "It is not a replacement for secure delivery or good access control, but it is a useful document-level safeguard.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I unlock a PDF without the password?",
        answer:
          "No. LiftPDF Unlock PDF requires the correct password and does not recover or bypass unknown passwords.",
      },
      {
        question: "Is a watermark the same as password protection?",
        answer:
          "No. A watermark is visible labeling. Password protection uses encryption to restrict opening the file.",
      },
    ],
    relatedLinks: [
      { label: "Password-protected PDFs explained", href: "/guides/what-is-a-password-protected-pdf", text: "Understand real PDF encryption." },
      { label: "Protect PDF", href: "/protect-pdf", text: "Add a real opening password." },
      { label: "Unlock PDF", href: "/unlock-pdf", text: "Remove encryption with the correct password." },
    ],
    publishedAt: "2026-07-16",
    readingMinutes: 6,
  },
  {
    slug: "pdf-vs-jpg",
    title: "PDF vs JPG: Which Format Should You Use? | LiftPDF",
    description:
      "Compare PDF and JPG for documents, photos, scans, sharing, printing and online submissions.",
    h1: "PDF vs JPG",
    topic: "Comparisons",
    primaryKeyword: "pdf vs jpg",
    summary:
      "Use JPG for individual photos and PDF for documents, submissions and multi-page page-based workflows.",
    ctaLabel: "Convert JPG to PDF",
    canonical: "/guides/pdf-vs-jpg",
    image: imagesImage,
    quickAnswer:
      "Choose JPG for a single photo. Choose PDF when the content should behave like a document, especially for multiple pages, printing or upload portals.",
    quickSteps: [
      "Ask whether the file is an image or a document.",
      "Use JPG for photos and previews.",
      "Use PDF for forms, submissions and multi-page packets.",
    ],
    sections: [
      {
        heading: "The practical difference",
        body: [
          "JPG is a compressed image format. PDF is a document format that can contain text, pages, images, forms and metadata.",
          "A single photographed receipt may start as JPG. A group of receipts that need to be submitted together is usually better as PDF.",
        ],
      },
    ],
    faq: [
      {
        question: "Can a PDF contain JPG images?",
        answer:
          "Yes. JPG to PDF places JPG images onto PDF pages.",
      },
      {
        question: "Is JPG smaller than PDF?",
        answer:
          "Often for a single photo, yes. For documents, PDF is usually easier to organize and submit.",
      },
    ],
    relatedLinks: [
      { label: "JPG to PDF", href: "/jpg-to-pdf", text: "Turn JPG images into PDF." },
      { label: "PDF to JPG", href: "/pdf-to-jpg", text: "Export PDF pages as JPG." },
      { label: "JPG vs PNG", href: "/guides/jpg-vs-png", text: "Compare image formats." },
    ],
    publishedAt: "2026-07-16",
    readingMinutes: 6,
  },
  {
    slug: "pdf-vs-png",
    title: "PDF vs PNG: Which Format Should You Use? | LiftPDF",
    description:
      "Compare PDF and PNG for screenshots, forms, scans, transparent graphics and document sharing.",
    h1: "PDF vs PNG",
    topic: "Comparisons",
    primaryKeyword: "pdf vs png",
    summary:
      "Use PNG for screenshots and transparent graphics. Use PDF when pages need to be shared, printed or submitted as a document.",
    ctaLabel: "Convert PNG to PDF",
    canonical: "/guides/pdf-vs-png",
    image: imagesImage,
    quickAnswer:
      "PNG is best for a single crisp image or screenshot. PDF is best for documents, multiple pages, forms and predictable printing.",
    quickSteps: [
      "Use PNG for screenshots or transparent graphics.",
      "Use PDF for submissions and multi-page documents.",
      "Convert PNG to PDF when a portal requires PDF.",
    ],
    sections: [
      {
        heading: "Screenshots versus documents",
        body: [
          "PNG preserves sharp edges and interface text well, which makes it useful for screenshots. PDF is better when that image needs to become part of a page-based document.",
          "If you have several PNG screenshots for one task, converting them into one PDF can make the submission easier to review.",
        ],
      },
    ],
    faq: [
      {
        question: "Can PNG transparency stay transparent in PDF?",
        answer:
          "PDF can contain transparent graphics, but many document workflows display or print them on a white page background.",
      },
      {
        question: "Is PNG better than PDF for quality?",
        answer:
          "They solve different problems. PNG stores pixels; PDF stores document pages that may include images and text.",
      },
    ],
    relatedLinks: [
      { label: "PNG to PDF", href: "/png-to-pdf", text: "Convert PNG files to PDF." },
      { label: "PNG vs PDF", href: "/guides/png-vs-pdf", text: "Compare PNG and PDF more directly." },
      { label: "PDF Image Tools", href: "/pdf-image-tools", text: "Choose image and PDF workflows." },
    ],
    publishedAt: "2026-07-16",
    readingMinutes: 6,
  },
];
