import type {
  GuideFaqItem,
  GuideLink,
  GuideSection,
} from "@/data/extract-pages-cluster";
import { additionalFoundationGuides } from "@/data/additional-foundation-guides";

export type FoundationGuide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  topic:
    | "PDF Basics"
    | "Convert PDF"
    | "Organize PDF"
    | "PDF Security"
    | "PDF and Images"
    | "Troubleshooting"
    | "Comparisons";
  primaryKeyword: string;
  summary: string;
  ctaLabel: string;
  canonical: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  quickAnswer: string;
  quickSteps?: string[];
  sections: GuideSection[];
  faq: GuideFaqItem[];
  relatedLinks: GuideLink[];
  publishedAt: string;
  readingMinutes: number;
};

const basicsImage = {
  src: "/images/learn/pdf-basics.webp",
  alt: "PDF basics learning visual with document workflow",
  width: 1200,
  height: 720,
};

const securityImage = {
  src: "/images/learn/pdf-security.webp",
  alt: "PDF security learning visual with protected document",
  width: 1200,
  height: 720,
};

const imagesImage = {
  src: "/images/learn/pdf-images.webp",
  alt: "PDF and image formats learning visual",
  width: 1200,
  height: 720,
};

const scannedImage = {
  src: "/images/learn/scanned-vs-searchable-pdf.webp",
  alt: "Scanned PDF compared with searchable PDF",
  width: 1200,
  height: 720,
};

const commonLinks = [
  {
    label: "All PDF Tools",
    href: "/pdf-tools",
    text: "Browse every available LiftPDF tool.",
  },
  {
    label: "Learning Center",
    href: "/learn",
    text: "Explore PDF guides, glossary terms and help resources.",
  },
] satisfies GuideLink[];

function guide(input: Omit<FoundationGuide, "canonical" | "relatedLinks"> & {
  relatedLinks?: GuideLink[];
}): FoundationGuide {
  return {
    ...input,
    canonical: `/guides/${input.slug}`,
    relatedLinks: input.relatedLinks || commonLinks,
  };
}

export const foundationGuides = [
  guide({
    slug: "what-is-a-pdf",
    title: "What Is a PDF? Simple Definition and Examples | LiftPDF",
    description:
      "Learn what a PDF is, why it is used, what it preserves and when to choose PDF instead of images or editable documents.",
    h1: "What Is a PDF?",
    topic: "PDF Basics",
    primaryKeyword: "what is a pdf",
    summary:
      "A PDF is a document format designed to keep pages looking consistent across devices, apps and operating systems.",
    ctaLabel: "Browse PDF tools",
    image: basicsImage,
    quickAnswer:
      "PDF stands for Portable Document Format. It is commonly used for forms, reports, scans, contracts, invoices and documents that should look the same when opened or printed.",
    quickSteps: [
      "Use PDF when page layout matters.",
      "Use editable formats when text needs to be rewritten.",
      "Use image formats when the page is only a visual asset.",
    ],
    sections: [
      {
        heading: "Why PDF exists",
        body: [
          "PDF was created to make documents portable. A PDF can include text, images, fonts, page sizes, links, forms and metadata in one file.",
          "That portability is why PDFs are used for invoices, legal documents, school submissions, manuals, resumes, tickets and scanned records.",
        ],
      },
      {
        heading: "What a PDF is good at",
        body: [
          "PDF is good when a document should be viewed or printed predictably. It is less ideal when the main job is collaborative writing or live editing.",
        ],
        list: [
          "Preserving page layout.",
          "Combining several pages into one file.",
          "Sharing forms, scans and reports.",
          "Archiving documents for later review.",
        ],
      },
      {
        heading: "Example",
        body: [
          "A photographed receipt can become a JPG. Several receipts can become a PDF so they stay in order and are easier to submit as one document.",
        ],
      },
    ],
    faq: [
      {
        question: "Is a PDF an image?",
        answer:
          "Not always. A PDF can contain selectable text, images, vector graphics, forms and scanned pages.",
      },
      {
        question: "Can I edit a PDF like a Word document?",
        answer:
          "Only with the right editor and only if the PDF structure supports it. Many PDFs are designed for stable sharing rather than editing.",
      },
    ],
    publishedAt: "2026-07-15",
    readingMinutes: 4,
  }),
  guide({
    slug: "jpg-vs-jpeg",
    title: "JPG vs JPEG: Is There a Difference? | LiftPDF",
    description:
      "Understand JPG vs JPEG, why both names exist and how they behave when converting images to PDF.",
    h1: "JPG vs JPEG",
    topic: "PDF and Images",
    primaryKeyword: "jpg vs jpeg",
    summary:
      "JPG and JPEG usually mean the same image format. The shorter .jpg extension became common because older systems used three-letter file extensions.",
    ctaLabel: "Convert JPG to PDF",
    image: imagesImage,
    quickAnswer:
      "For normal PDF workflows, JPG and JPEG are the same practical format. LiftPDF's JPG to PDF tool accepts both image/jpeg file types.",
    sections: [
      {
        heading: "Why two names exist",
        body: [
          "JPEG is the format name from the Joint Photographic Experts Group. JPG is the common three-letter file extension used by many operating systems and apps.",
          "In everyday use, .jpg and .jpeg files are treated the same by browsers, photo apps and PDF converters.",
        ],
      },
      {
        heading: "When converting to PDF",
        body: [
          "Use the same quality rules for both: start with the original file, avoid repeated resaving, and choose PDF layout settings that do not unnecessarily enlarge the image.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I rename JPEG to JPG?",
        answer:
          "Usually no. Modern tools handle both extensions. Renaming alone does not improve quality.",
      },
      {
        question: "Does JPG or JPEG create a better PDF?",
        answer:
          "Neither is inherently better. Source resolution and compression quality matter more.",
      },
    ],
    relatedLinks: [
      {
        label: "JPG to PDF",
        href: "/jpg-to-pdf",
        text: "Convert JPG or JPEG images into PDF pages.",
      },
      {
        label: "JPG vs PNG",
        href: "/guides/jpg-vs-png",
        text: "Choose between photo and screenshot image formats.",
      },
    ],
    publishedAt: "2026-07-15",
    readingMinutes: 3,
  }),
  guide({
    slug: "png-vs-pdf",
    title: "PNG vs PDF: Which Format Should You Use? | LiftPDF",
    description:
      "Compare PNG and PDF for screenshots, scans, documents, sharing, printing and archiving.",
    h1: "PNG vs PDF",
    topic: "PDF and Images",
    primaryKeyword: "png vs pdf",
    summary:
      "PNG is an image format. PDF is a document format. Use PNG for a single visual image and PDF when pages should behave like a document.",
    ctaLabel: "Convert PNG to PDF",
    image: imagesImage,
    quickAnswer:
      "Use PNG for screenshots, transparent graphics and image assets. Use PDF for multi-page documents, forms, submissions and files that should print consistently.",
    sections: [
      {
        heading: "The main difference",
        body: [
          "A PNG is one raster image. A PDF can hold pages, text, images, forms, metadata and links. That makes PDF better for document workflows.",
        ],
      },
      {
        heading: "Examples",
        body: [
          "A screenshot of an app interface is naturally a PNG. A set of screenshots that must be submitted as one file is usually better as a PDF.",
        ],
      },
    ],
    faq: [
      {
        question: "Can a PDF contain PNG images?",
        answer:
          "Yes. PNG files can be placed onto PDF pages, which is what PNG to PDF tools do.",
      },
      {
        question: "Is PNG better quality than PDF?",
        answer:
          "They are different formats. PNG quality depends on image pixels; PDF quality depends on the content stored inside it.",
      },
    ],
    relatedLinks: [
      {
        label: "PNG to PDF",
        href: "/png-to-pdf",
        text: "Turn PNG images into a clean PDF.",
      },
      {
        label: "PDF Image Tools",
        href: "/pdf-image-tools",
        text: "Compare image and PDF conversion workflows.",
      },
    ],
    publishedAt: "2026-07-15",
    readingMinutes: 4,
  }),
  guide({
    slug: "what-is-pdf-compression",
    title: "What Is PDF Compression? | LiftPDF",
    description:
      "Learn what PDF compression means, why file size changes and why some PDFs cannot shrink much without quality loss.",
    h1: "What Is PDF Compression?",
    topic: "PDF Basics",
    primaryKeyword: "what is pdf compression",
    summary:
      "PDF compression reduces file size by optimizing how document data is stored. The result depends on what the PDF contains.",
    ctaLabel: "Compress PDF",
    image: basicsImage,
    quickAnswer:
      "Text-heavy PDFs can often be rebuilt efficiently. Image-heavy PDFs may need image recompression, which can affect quality.",
    sections: [
      {
        heading: "Why compression results vary",
        body: [
          "A PDF is a container. It may include text, fonts, images, forms, metadata and scanned pages. Each kind of content behaves differently when optimized.",
          "A scanned PDF made from photos is often large because the pages are images. A text report may already be small and have little room to shrink.",
        ],
      },
      {
        heading: "Safe compression vs aggressive compression",
        body: [
          "Safe compression rebuilds and cleans the PDF without pretending to downsample every image. Aggressive compression may reduce image quality to achieve a smaller file.",
        ],
      },
    ],
    faq: [
      {
        question: "Will every PDF become smaller?",
        answer:
          "No. Some PDFs are already optimized or contain content that cannot shrink safely.",
      },
      {
        question: "Does compression always reduce quality?",
        answer:
          "Not always. Safe compression can preserve content, while aggressive image compression can reduce visual quality.",
      },
    ],
    relatedLinks: [
      {
        label: "Compress PDF",
        href: "/compress-pdf",
        text: "Rebuild a PDF with safe browser-side compression.",
      },
      {
        label: "Why is my merged PDF too large?",
        href: "/guides/why-is-my-merged-pdf-too-large",
        text: "Understand why combined files can grow.",
      },
    ],
    publishedAt: "2026-07-15",
    readingMinutes: 5,
  }),
  guide({
    slug: "what-is-a-password-protected-pdf",
    title: "What Is a Password-Protected PDF? | LiftPDF",
    description:
      "Learn how password-protected PDFs work, what encryption means and why you need the password to unlock a protected file.",
    h1: "What Is a Password-Protected PDF?",
    topic: "PDF Security",
    primaryKeyword: "password protected pdf",
    summary:
      "A password-protected PDF is encrypted so the document requires a password before it can be opened or changed.",
    ctaLabel: "Protect PDF",
    image: securityImage,
    quickAnswer:
      "Real password protection is encryption. It is not a watermark, visual lock or metadata note.",
    sections: [
      {
        heading: "What the password does",
        body: [
          "A protected PDF can require a user password to open the file. Some PDFs also include owner permissions for printing, copying or editing depending on the software used.",
          "LiftPDF only presents protection as real encryption when the output actually requires a password to open.",
        ],
      },
      {
        heading: "Unlocking requires permission",
        body: [
          "Unlocking a PDF is not password recovery. You need the correct password and permission to use the document.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I remove a PDF password without knowing it?",
        answer:
          "No. LiftPDF does not bypass encryption or recover unknown passwords.",
      },
      {
        question: "Is a watermark the same as password protection?",
        answer:
          "No. A watermark is visible page content. Password protection encrypts the file.",
      },
    ],
    relatedLinks: [
      {
        label: "Protect PDF",
        href: "/protect-pdf",
        text: "Add real password protection to a PDF.",
      },
      {
        label: "Unlock PDF",
        href: "/unlock-pdf",
        text: "Remove protection when you have the correct password.",
      },
    ],
    publishedAt: "2026-07-15",
    readingMinutes: 5,
  }),
  guide({
    slug: "what-is-browser-based-pdf-processing",
    title: "What Is Browser-Based PDF Processing? | LiftPDF",
    description:
      "Understand browser-based PDF processing, how files can be handled locally and what privacy benefits and limits it has.",
    h1: "What Is Browser-Based PDF Processing?",
    topic: "PDF Security",
    primaryKeyword: "browser based pdf processing",
    summary:
      "Browser-based PDF processing means the browser performs the PDF task on your device instead of sending the file to a backend upload queue.",
    ctaLabel: "Explore PDF tools",
    image: securityImage,
    quickAnswer:
      "For supported LiftPDF tools, the browser reads the file, processes it locally and creates the download on your device.",
    sections: [
      {
        heading: "Why it matters",
        body: [
          "Many online converters upload files to a server before processing. Browser processing can avoid that upload step for supported workflows, which is useful for private documents.",
          "It also means your device memory and browser capabilities matter. Very large files may be harder to process locally.",
        ],
      },
      {
        heading: "Example workflow",
        body: [
          "When you merge PDFs in LiftPDF, the browser reads the selected files, copies pages into a new document and generates the download locally.",
        ],
      },
    ],
    faq: [
      {
        question: "Does browser-based mean offline?",
        answer:
          "The tool page must load first. After that, supported processing happens locally in the browser.",
      },
      {
        question: "Can browser tools handle every PDF?",
        answer:
          "No. Very large, damaged or unsupported PDFs can still fail because the browser has limits.",
      },
    ],
    relatedLinks: [
      {
        label: "Privacy",
        href: "/privacy",
        text: "Read LiftPDF privacy information.",
      },
      {
        label: "Security",
        href: "/security",
        text: "Learn about browser-side PDF security.",
      },
    ],
    publishedAt: "2026-07-15",
    readingMinutes: 5,
  }),
  guide({
    slug: "scanned-pdf-vs-searchable-pdf",
    title: "Scanned PDF vs Searchable PDF | LiftPDF",
    description:
      "Learn the difference between scanned PDFs and searchable PDFs, and why OCR is needed for image-only documents.",
    h1: "Scanned PDF vs Searchable PDF",
    topic: "PDF Basics",
    primaryKeyword: "scanned pdf vs searchable pdf",
    summary:
      "A scanned PDF is usually made of page images. A searchable PDF contains selectable text that can be copied or extracted.",
    ctaLabel: "Extract PDF text",
    image: scannedImage,
    quickAnswer:
      "If you cannot select text with your cursor, the PDF may be scanned or image-based. OCR is required to turn scanned text into selectable text.",
    sections: [
      {
        heading: "Scanned PDFs",
        body: [
          "A scanned PDF often looks like a document but behaves like a picture of a document. The page may contain pixels instead of real text.",
        ],
      },
      {
        heading: "Searchable PDFs",
        body: [
          "A searchable PDF contains text objects or an OCR text layer. That text can usually be selected, copied and extracted.",
        ],
      },
      {
        heading: "Why this matters for tools",
        body: [
          "PDF to Text can extract selectable text. It cannot read text from a scanned image-only page without OCR.",
        ],
      },
    ],
    faq: [
      {
        question: "Can LiftPDF do OCR?",
        answer:
          "No. Current PDF to Text extracts text already present in the PDF and clearly says when OCR is required.",
      },
      {
        question: "How can I tell if a PDF is scanned?",
        answer:
          "Try selecting a word. If the whole page behaves like one image, it is probably scanned or image-based.",
      },
    ],
    relatedLinks: [
      {
        label: "PDF to Text",
        href: "/pdf-to-text",
        text: "Extract selectable text from PDF files.",
      },
      {
        label: "PDF Basics",
        href: "/learn/pdf-basics",
        text: "Learn core PDF concepts.",
      },
    ],
    publishedAt: "2026-07-15",
    readingMinutes: 5,
  }),
  ...additionalFoundationGuides,
] satisfies FoundationGuide[];

export function getFoundationGuide(slug: string) {
  return foundationGuides.find((guideItem) => guideItem.slug === slug);
}
