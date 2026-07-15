export type GlossaryTerm = {
  term: string;
  slug: string;
  definition: string;
  example: string;
  relatedHref: string;
  relatedLabel: string;
};

export const glossaryTerms = [
  {
    term: "PDF",
    slug: "pdf",
    definition:
      "PDF is a document format designed to preserve page layout across devices, apps and operating systems.",
    example: "A contract sent as a PDF should keep the same page order and appearance on Windows, Mac and mobile.",
    relatedHref: "/guides/what-is-a-pdf",
    relatedLabel: "What is a PDF?",
  },
  {
    term: "PDF/A",
    slug: "pdf-a",
    definition:
      "PDF/A is an archival PDF standard intended for long-term preservation with embedded resources.",
    example: "An archive may request PDF/A so the document remains readable years later.",
    relatedHref: "/pdf-tools",
    relatedLabel: "PDF tools",
  },
  {
    term: "OCR",
    slug: "ocr",
    definition:
      "OCR means optical character recognition. It converts text visible in an image into selectable text.",
    example: "A scanned PDF needs OCR before PDF to Text can extract words from the page image.",
    relatedHref: "/guides/scanned-pdf-vs-searchable-pdf",
    relatedLabel: "Scanned vs searchable PDF",
  },
  {
    term: "Metadata",
    slug: "metadata",
    definition:
      "Metadata is information stored about a file, such as title, author, creation date or software history.",
    example: "Safe compression may remove or minimize metadata while preserving pages.",
    relatedHref: "/compress-pdf",
    relatedLabel: "Compress PDF",
  },
  {
    term: "Compression",
    slug: "compression",
    definition:
      "Compression reduces file size by storing document data more efficiently or reducing heavy content.",
    example: "An image-heavy PDF may need stronger image compression than a text-only PDF.",
    relatedHref: "/guides/what-is-pdf-compression",
    relatedLabel: "What is PDF compression?",
  },
  {
    term: "Encryption",
    slug: "encryption",
    definition:
      "Encryption protects file content so the document cannot be opened without the required password or key.",
    example: "A protected PDF should ask for a password in Chrome PDF Viewer or Adobe Acrobat.",
    relatedHref: "/protect-pdf",
    relatedLabel: "Protect PDF",
  },
  {
    term: "Password protection",
    slug: "password-protection",
    definition:
      "Password protection means a PDF requires a password to open or modify it, depending on the protection settings.",
    example: "A client document may be protected before being emailed.",
    relatedHref: "/guides/what-is-a-password-protected-pdf",
    relatedLabel: "Password-protected PDFs",
  },
  {
    term: "Page range",
    slug: "page-range",
    definition:
      "A page range describes selected pages, such as 1-3, 5 or 7-10.",
    example: "Use 1,3,5-8 to export pages 1, 3, 5, 6, 7 and 8.",
    relatedHref: "/split-pdf",
    relatedLabel: "Split PDF",
  },
  {
    term: "Raster image",
    slug: "raster-image",
    definition:
      "A raster image is made of pixels. JPG, PNG and WEBP are common raster image formats.",
    example: "A scanned PDF page is often a raster image inside a PDF file.",
    relatedHref: "/pdf-image-tools",
    relatedLabel: "PDF image tools",
  },
  {
    term: "Vector image",
    slug: "vector-image",
    definition:
      "A vector image uses shapes and paths instead of fixed pixels, so it can scale cleanly.",
    example: "Logos and diagrams may use vector graphics inside a PDF.",
    relatedHref: "/guides/what-is-a-pdf",
    relatedLabel: "PDF basics",
  },
  {
    term: "JPEG",
    slug: "jpeg",
    definition:
      "JPEG is a common lossy image format used for photos and camera images.",
    example: "A phone photo saved as JPEG can be converted into a PDF page.",
    relatedHref: "/guides/jpg-vs-jpeg",
    relatedLabel: "JPG vs JPEG",
  },
  {
    term: "JPG",
    slug: "jpg",
    definition:
      "JPG is the common file extension for JPEG images, often used for photos and scans.",
    example: "Use JPG to PDF when document photos should become a single PDF.",
    relatedHref: "/jpg-to-pdf",
    relatedLabel: "JPG to PDF",
  },
  {
    term: "PNG",
    slug: "png",
    definition:
      "PNG is a raster image format commonly used for screenshots, diagrams and transparent images.",
    example: "A PNG screenshot can be converted to PDF for easier sharing.",
    relatedHref: "/png-to-pdf",
    relatedLabel: "PNG to PDF",
  },
  {
    term: "WEBP",
    slug: "webp",
    definition:
      "WEBP is a modern image format designed for efficient web images.",
    example: "Images to PDF can combine WEBP with JPG and PNG files.",
    relatedHref: "/images-to-pdf",
    relatedLabel: "Images to PDF",
  },
  {
    term: "DPI",
    slug: "dpi",
    definition:
      "DPI means dots per inch and is often used to describe print or scan density.",
    example: "A higher scan DPI can produce a sharper but larger image-based PDF.",
    relatedHref: "/guides/how-to-keep-original-image-quality",
    relatedLabel: "Keep image quality",
  },
  {
    term: "Resolution",
    slug: "resolution",
    definition:
      "Resolution describes the amount of image detail, commonly measured in pixels.",
    example: "A low-resolution JPG may look blurry when placed on a large PDF page.",
    relatedHref: "/guides/why-is-my-jpg-blurry-after-pdf",
    relatedLabel: "Blurry JPG after PDF",
  },
  {
    term: "Lossless compression",
    slug: "lossless-compression",
    definition:
      "Lossless compression reduces file size without discarding original data.",
    example: "Some PNG compression is lossless, preserving sharp edges.",
    relatedHref: "/guides/jpg-vs-png",
    relatedLabel: "JPG vs PNG",
  },
  {
    term: "Lossy compression",
    slug: "lossy-compression",
    definition:
      "Lossy compression reduces file size by discarding some data, which can affect visual quality.",
    example: "Strong JPG compression can create artifacts or blur.",
    relatedHref: "/guides/how-to-convert-jpg-to-pdf-without-losing-quality",
    relatedLabel: "JPG quality guide",
  },
  {
    term: "Merge PDF",
    slug: "merge-pdf",
    definition:
      "Merge PDF means combining multiple PDF files into one document.",
    example: "Merge a contract, appendix and cover page into one PDF packet.",
    relatedHref: "/merge-pdf",
    relatedLabel: "Merge PDF",
  },
  {
    term: "Split PDF",
    slug: "split-pdf",
    definition:
      "Split PDF means dividing a PDF into ranges or separate output files.",
    example: "Split every page of a 10-page document into separate PDFs.",
    relatedHref: "/split-pdf",
    relatedLabel: "Split PDF",
  },
  {
    term: "Extract pages",
    slug: "extract-pages",
    definition:
      "Extract pages means saving selected pages from a PDF into a new file.",
    example: "Extract pages 2, 5 and 8 from a report.",
    relatedHref: "/extract-pages",
    relatedLabel: "Extract Pages",
  },
  {
    term: "Delete pages",
    slug: "delete-pages",
    definition:
      "Delete pages means removing unwanted pages while keeping the rest of the PDF.",
    example: "Delete blank scan pages before sending a document.",
    relatedHref: "/delete-pages",
    relatedLabel: "Delete Pages",
  },
  {
    term: "Reorder pages",
    slug: "reorder-pages",
    definition:
      "Reorder pages means changing the sequence of pages inside a PDF.",
    example: "Move the signature page after the final contract page.",
    relatedHref: "/reorder-pages",
    relatedLabel: "Reorder Pages",
  },
  {
    term: "Watermark",
    slug: "watermark",
    definition:
      "A watermark is visible text or an image placed on document pages.",
    example: "Add a draft watermark before sending a PDF for review.",
    relatedHref: "/watermark-pdf",
    relatedLabel: "Watermark PDF",
  },
  {
    term: "Browser processing",
    slug: "browser-processing",
    definition:
      "Browser processing means the file is handled locally by the browser for supported workflows.",
    example: "LiftPDF can merge supported PDFs without uploading them to a backend conversion queue.",
    relatedHref: "/guides/what-is-browser-based-pdf-processing",
    relatedLabel: "Browser processing guide",
  },
  {
    term: "WebAssembly",
    slug: "webassembly",
    definition:
      "WebAssembly is a browser technology that lets compiled code run efficiently on the web.",
    example: "QPDF WASM helps LiftPDF perform real PDF encryption and decryption in the browser.",
    relatedHref: "/security",
    relatedLabel: "Security",
  },
  {
    term: "Selectable text",
    slug: "selectable-text",
    definition:
      "Selectable text is real text in a PDF that can be highlighted, copied or extracted.",
    example: "PDF to Text works when the PDF contains selectable text.",
    relatedHref: "/pdf-to-text",
    relatedLabel: "PDF to Text",
  },
  {
    term: "Scanned PDF",
    slug: "scanned-pdf",
    definition:
      "A scanned PDF usually contains images of pages rather than real text objects.",
    example: "A photographed book page saved as PDF may require OCR before text extraction.",
    relatedHref: "/guides/scanned-pdf-vs-searchable-pdf",
    relatedLabel: "Scanned vs searchable PDF",
  },
] satisfies GlossaryTerm[];
