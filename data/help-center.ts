export type HelpCategory = {
  slug: string;
  title: string;
  description: string;
  items: {
    question: string;
    answer: string;
    links?: { label: string; href: string }[];
  }[];
};

export const helpCategories = [
  {
    slug: "upload-supported-files",
    title: "Upload and supported files",
    description:
      "Understand which files each tool accepts and what to check before uploading.",
    items: [
      {
        question: "Why is my file rejected?",
        answer:
          "Each tool accepts specific formats. JPG to PDF accepts JPG/JPEG, PNG to PDF accepts PNG, and PDF tools accept PDF files. Use Images to PDF for mixed image formats.",
        links: [
          { label: "Images to PDF", href: "/images-to-pdf" },
          { label: "PDF Tools", href: "/pdf-tools" },
        ],
      },
      {
        question: "Can I upload multiple files?",
        answer:
          "Some tools accept multiple files, such as Merge PDF and image-to-PDF tools. Tools that work on one document, such as Compress PDF, accept one PDF at a time.",
      },
    ],
  },
  {
    slug: "pdf-passwords",
    title: "PDF passwords",
    description:
      "Work with protected PDFs safely and without pretending to bypass encryption.",
    items: [
      {
        question: "Why can't I open a protected PDF?",
        answer:
          "A protected PDF may be encrypted and require the correct password before another tool can read it.",
        links: [{ label: "Unlock PDF", href: "/unlock-pdf" }],
      },
      {
        question: "Can LiftPDF recover a forgotten password?",
        answer:
          "No. LiftPDF does not recover or bypass unknown passwords. Unlock PDF works only when you provide the correct password.",
      },
    ],
  },
  {
    slug: "browser-processing",
    title: "Browser processing",
    description:
      "Learn what it means when LiftPDF processes files locally in your browser.",
    items: [
      {
        question: "Are my files uploaded?",
        answer:
          "Available LiftPDF tools are designed to process supported files locally in your browser. The site may still need to load scripts and assets, but the document operation runs on your device.",
        links: [
          {
            label: "Browser processing guide",
            href: "/guides/what-is-browser-based-pdf-processing",
          },
        ],
      },
      {
        question: "Why can a browser tool fail on huge files?",
        answer:
          "Browser tools use your device memory and browser APIs. Very large, damaged or unusual files can hit local limits.",
      },
    ],
  },
  {
    slug: "downloads",
    title: "Downloads",
    description: "Find out where results are saved and what file names mean.",
    items: [
      {
        question: "Where did my file download?",
        answer:
          "Most browsers save generated files to the Downloads folder unless you choose another location.",
      },
      {
        question: "Why did I get a ZIP file?",
        answer:
          "When a conversion creates multiple output files, such as multiple JPG images from a PDF, LiftPDF packages them into a ZIP for easier download.",
      },
    ],
  },
  {
    slug: "common-errors",
    title: "Common errors",
    description: "Fix invalid files, failed conversions and unreadable PDFs.",
    items: [
      {
        question: "Why did conversion fail?",
        answer:
          "The file may be damaged, encrypted, too large for the device or unsupported by the selected tool.",
        links: [
          {
            label: "Why can't I convert JPG to PDF?",
            href: "/guides/why-cant-i-convert-jpg-to-pdf",
          },
        ],
      },
      {
        question: "Why are extracted pages blank?",
        answer:
          "Blank output can happen when the source page is blank, damaged or rendered in an unusual way. Open the source PDF first to confirm content is visible.",
      },
    ],
  },
  {
    slug: "mobile-use",
    title: "Mobile use",
    description: "Use LiftPDF on iPhone, iPad and Android browsers.",
    items: [
      {
        question: "Does LiftPDF work on mobile?",
        answer:
          "Yes. LiftPDF is responsive and works in modern mobile browsers. Very large files may still be easier on desktop.",
      },
      {
        question: "How do I choose files on iPhone or Android?",
        answer:
          "Use the upload button and choose files from Photos, Files, Downloads or another local file provider.",
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    description: "Understand LiftPDF privacy and document handling.",
    items: [
      {
        question: "Does LiftPDF track my document contents?",
        answer:
          "LiftPDF is designed so current tools process supported files locally. Document contents are not needed for analytics.",
        links: [{ label: "Privacy", href: "/privacy" }],
      },
      {
        question: "Should I use LiftPDF for sensitive files?",
        answer:
          "Browser processing is a privacy advantage, but you should still follow your organization's rules for sensitive documents.",
      },
    ],
  },
  {
    slug: "large-files",
    title: "Large files",
    description: "Understand memory limits and file-size troubleshooting.",
    items: [
      {
        question: "Why is my PDF still large after compression?",
        answer:
          "Some PDFs are already optimized or contain images that cannot shrink safely without visible quality loss.",
        links: [{ label: "PDF compression", href: "/guides/what-is-pdf-compression" }],
      },
      {
        question: "What should I do with huge image batches?",
        answer:
          "Remove duplicate images, convert smaller batches or use a desktop workflow if the browser runs out of memory.",
      },
    ],
  },
  {
    slug: "scanned-pdfs",
    title: "Scanned PDFs",
    description: "Know when OCR is needed and what PDF to Text can extract.",
    items: [
      {
        question: "Why did PDF to Text find no text?",
        answer:
          "The PDF may be scanned or image-only. OCR is required to extract text from scanned pages.",
        links: [
          {
            label: "Scanned vs searchable PDF",
            href: "/guides/scanned-pdf-vs-searchable-pdf",
          },
        ],
      },
    ],
  },
  {
    slug: "contact-support",
    title: "Contact support",
    description: "Know when to contact LiftPDF.",
    items: [
      {
        question: "How can I report a bug?",
        answer:
          "Use the contact page and include the tool name, browser, device and a description of what happened. Do not send private documents unless explicitly requested.",
        links: [{ label: "Contact", href: "/contact" }],
      },
    ],
  },
] satisfies HelpCategory[];
