import type { PremiumToolContentData } from "@/components/tools/premium-tool-content";

const imageToolFeatures = [
  {
    title: "No upload required",
    text: "Your files are processed locally in the browser instead of being sent to a server.",
    icon: "privacy",
  },
  {
    title: "Fast for everyday batches",
    text: "Create a PDF from one image or a full set without waiting for remote upload queues.",
    icon: "speed",
  },
  {
    title: "Mobile and desktop",
    text: "Use the same workflow on Windows, macOS, Linux, iPhone, iPad or Android browsers.",
    icon: "mobile",
  },
  {
    title: "Clean PDF output",
    text: "Choose page size, orientation, margin and image fit before generating the file.",
    icon: "quality",
  },
  {
    title: "Reusable workflow",
    text: "Reorder, remove and add files before converting, so the PDF pages match your final order.",
    icon: "settings",
  },
  {
    title: "Free to use",
    text: "No account, trial wall or watermark is added by LiftPDF.",
    icon: "browser",
  },
] satisfies PremiumToolContentData["features"];

const imageUseCases = [
  {
    title: "Students",
    text: "Combine photographed notes, homework pages or class handouts into one file.",
    icon: "students",
  },
  {
    title: "Business",
    text: "Send receipts, signed scans, product photos or proof documents as a compact PDF.",
    icon: "business",
  },
  {
    title: "Designers",
    text: "Share mockups, export previews or visual references in a format clients can open easily.",
    icon: "design",
  },
  {
    title: "Photographers",
    text: "Turn selected images into a review document while keeping the order you choose.",
    icon: "photo",
  },
  {
    title: "Administration",
    text: "Prepare identity documents, forms or supporting files for portals that expect PDFs.",
    icon: "admin",
  },
  {
    title: "Personal documents",
    text: "Archive warranties, letters, family papers and scans without installing a desktop app.",
    icon: "personal",
  },
] satisfies PremiumToolContentData["useCases"];

export const premiumToolContent: Record<string, PremiumToolContentData> = {
  jpgToPdf: {
    heroImage: {
      src: "/images/seo/jpg-to-pdf/hero.webp",
      alt: "JPG images flowing into a clean PDF document",
      width: 1200,
      height: 760,
    },
    ogImage: {
      src: "/images/seo/jpg-to-pdf/og-image.webp",
      alt: "LiftPDF JPG to PDF converter",
      width: 1200,
      height: 630,
    },
    thumbnail: {
      src: "/images/seo/jpg-to-pdf/thumbnail.webp",
      alt: "JPG to PDF document preview",
      width: 640,
      height: 480,
    },
    howItWorks: [
      {
        title: "Upload JPG files",
        text: "Drop one or more JPG images into the tool or choose them from your device.",
        icon: "upload",
      },
      {
        title: "Choose PDF settings",
        text: "Set page size, orientation, margins and fit mode while watching the live preview.",
        icon: "settings",
      },
      {
        title: "Convert in your browser",
        text: "LiftPDF creates the PDF locally, so the images do not need to leave your device.",
        icon: "convert",
      },
      {
        title: "Download your PDF",
        text: "Save a clean PDF with each image placed in the order you selected.",
        icon: "download",
      },
    ],
    whyUse: [
      {
        title: "Turn photos into documents",
        text: "JPG is great for photos, but PDF is easier to submit, print and archive.",
        icon: "photo",
      },
      {
        title: "Prepare scans for sharing",
        text: "Convert camera scans, receipts and ID photos into one consistent document.",
        icon: "print",
      },
      {
        title: "Control page layout",
        text: "Use Auto for natural image pages or A4/Letter when a standard document page is required.",
        icon: "settings",
      },
    ],
    features: imageToolFeatures,
    useCases: imageUseCases,
    guide: [
      {
        title: "When JPG to PDF is the right format",
        paragraphs: [
          "JPG files are convenient for photos and screenshots, but they are not always ideal when you need to submit a formal document. A PDF keeps related pages together, opens consistently on most systems and is easier to print without accidental resizing.",
          "Use JPG to PDF when you have photographed documents, scanned receipts, class notes, signed pages or a group of images that should travel as one file. If the images contain transparency or sharp interface graphics, PNG to PDF may be a better source format.",
        ],
      },
      {
        title: "Quality and layout tips",
        paragraphs: [
          "For photos and scans, start with Auto page size and no margin. This keeps the PDF close to the original image ratio. Choose A4 or Letter when the PDF must match a printer or upload portal requirement.",
          "Fit keeps the full image visible. Fill is useful when you want the page covered edge to edge and can accept cropping. Before converting, reorder images so page one is really the first document page.",
        ],
      },
      {
        title: "Privacy advantage",
        paragraphs: [
          "LiftPDF performs the conversion in your browser. That means private documents, IDs and work files do not need to be uploaded to a remote conversion server. This also keeps the workflow quick for normal files because the browser can begin processing immediately.",
        ],
      },
    ],
    internalLinks: [
      {
        label: "PNG to PDF",
        href: "/png-to-pdf",
        text: "Use this when your source images are PNG files or include transparency.",
      },
      {
        label: "Images to PDF",
        href: "/images-to-pdf",
        text: "Combine JPG, PNG and WEBP images in one mixed-format PDF.",
      },
      {
        label: "PDF to JPG",
        href: "/pdf-to-jpg",
        text: "Export finished PDF pages back into JPG images when needed.",
      },
      {
        label: "Compress PDF",
        href: "/compress-pdf",
        text: "Rebuild the final PDF with safe browser-side compression.",
      },
    ],
  },
  pngToPdf: {
    heroImage: {
      src: "/images/seo/png-to-pdf/hero.webp",
      alt: "PNG graphics arranged into a clean PDF file",
      width: 1200,
      height: 760,
    },
    ogImage: {
      src: "/images/seo/png-to-pdf/og-image.webp",
      alt: "LiftPDF PNG to PDF converter",
      width: 1200,
      height: 630,
    },
    thumbnail: {
      src: "/images/seo/png-to-pdf/thumbnail.webp",
      alt: "PNG to PDF page preview",
      width: 640,
      height: 480,
    },
    howItWorks: [
      {
        title: "Upload PNG files",
        text: "Select one or more PNG images from your device.",
        icon: "upload",
      },
      {
        title: "Preview the pages",
        text: "Check the order and choose page settings before creating the PDF.",
        icon: "settings",
      },
      {
        title: "Convert locally",
        text: "The PDF is generated in your browser with a white page background.",
        icon: "convert",
      },
      {
        title: "Download the PDF",
        text: "Save a document that is easy to send, print or archive.",
        icon: "download",
      },
    ],
    whyUse: [
      {
        title: "For crisp graphics",
        text: "PNG is often used for screenshots, UI captures, diagrams and sharp text images.",
        icon: "image",
      },
      {
        title: "For transparent sources",
        text: "Transparent PNG files convert cleanly onto a white PDF page background.",
        icon: "quality",
      },
      {
        title: "For standard submissions",
        text: "Many forms and portals prefer one PDF instead of several separate PNG files.",
        icon: "admin",
      },
    ],
    features: imageToolFeatures,
    useCases: imageUseCases,
    guide: [
      {
        title: "When PNG to PDF is best",
        paragraphs: [
          "PNG is a strong format for screenshots, design exports, diagrams and images that include sharp edges. Converting PNG files to PDF is useful when those images need to be sent as a single document rather than as loose attachments.",
          "Unlike JPG, PNG can contain transparent areas. LiftPDF places transparent PNG images on a white PDF page, which is the most predictable result for printing, sharing and document portals.",
        ],
      },
      {
        title: "Choosing layout options",
        paragraphs: [
          "Auto page size with no margin keeps the PDF close to the source image. A4 or Letter is better when the result needs to behave like a formal document. Fit keeps the whole PNG visible, while Fill covers the page and may crop the image.",
          "If your PNG is a screenshot with important edges, use Fit and a small margin only when you need visible whitespace. If it is a full-page scan, no margin is usually the cleanest choice.",
        ],
      },
      {
        title: "Privacy and speed",
        paragraphs: [
          "Because conversion happens in the browser, PNG files do not need to be uploaded before the PDF is created. This is especially useful for screenshots that may include private account details, addresses or work information.",
        ],
      },
    ],
    internalLinks: [
      {
        label: "JPG to PDF",
        href: "/jpg-to-pdf",
        text: "Convert photo-style images into PDF pages.",
      },
      {
        label: "Images to PDF",
        href: "/images-to-pdf",
        text: "Mix PNG with JPG or WEBP files in a single PDF.",
      },
      {
        label: "PDF to PNG",
        href: "/pdf-to-png",
        text: "Export PDF pages back into PNG images.",
      },
      {
        label: "Merge PDF",
        href: "/merge-pdf",
        text: "Combine this PDF with other PDF documents.",
      },
    ],
  },
  imagesToPdf: {
    heroImage: {
      src: "/images/seo/images-to-pdf/hero.webp",
      alt: "Mixed image formats combined into one PDF",
      width: 1200,
      height: 760,
    },
    ogImage: {
      src: "/images/seo/images-to-pdf/og-image.webp",
      alt: "LiftPDF Images to PDF converter",
      width: 1200,
      height: 630,
    },
    thumbnail: {
      src: "/images/seo/images-to-pdf/thumbnail.webp",
      alt: "Images to PDF multi-page preview",
      width: 640,
      height: 480,
    },
    howItWorks: [
      {
        title: "Add images",
        text: "Upload JPG, PNG or WEBP files and add more whenever needed.",
        icon: "upload",
      },
      {
        title: "Arrange pages",
        text: "Move images into the correct order and remove anything you do not want.",
        icon: "settings",
      },
      {
        title: "Set the layout",
        text: "Choose page size, orientation, margin and image fit from the sidebar.",
        icon: "convert",
      },
      {
        title: "Download one PDF",
        text: "Generate a single document from mixed image formats.",
        icon: "download",
      },
    ],
    whyUse: [
      {
        title: "One file from many formats",
        text: "Combine JPG, PNG and WEBP without converting each image separately first.",
        icon: "image",
      },
      {
        title: "Better than loose attachments",
        text: "A PDF keeps image order, file purpose and document flow clear for recipients.",
        icon: "pdf",
      },
      {
        title: "Private document assembly",
        text: "Create the document locally when images include IDs, receipts or personal records.",
        icon: "privacy",
      },
    ],
    features: imageToolFeatures,
    useCases: imageUseCases,
    guide: [
      {
        title: "Why combine images into a PDF",
        paragraphs: [
          "Separate image files are easy to lose, reorder accidentally or display at different sizes. A PDF gives the set a clear sequence and makes it easier to send as one attachment or upload to a document portal.",
          "Images to PDF is useful when your source files are mixed formats. For example, you may have JPG photos, PNG screenshots and WEBP downloads that all belong in the same final document.",
        ],
      },
      {
        title: "Preparing the best result",
        paragraphs: [
          "Start by checking the order of every image. The first image becomes the first PDF page. Use Auto page size when image proportions vary and you want each page to feel natural. Use A4 or Letter when the final document needs consistent paper size.",
          "If the PDF will be printed, Fit is usually safer because no image content is cropped. Fill creates a stronger edge-to-edge result but should be used only when cropping is acceptable.",
        ],
      },
      {
        title: "Local processing matters",
        paragraphs: [
          "A mixed set of images often contains personal information: receipts, scans, screenshots or business details. LiftPDF builds the PDF in the browser, so the source images are not transferred to a backend conversion service.",
        ],
      },
    ],
    internalLinks: [
      {
        label: "JPG to PDF",
        href: "/jpg-to-pdf",
        text: "Use the dedicated JPG workflow for photo-only batches.",
      },
      {
        label: "PNG to PDF",
        href: "/png-to-pdf",
        text: "Use the PNG-only workflow for screenshots and transparent images.",
      },
      {
        label: "Merge PDF",
        href: "/merge-pdf",
        text: "Combine your image PDF with other PDF documents.",
      },
      {
        label: "Compress PDF",
        href: "/compress-pdf",
        text: "Optimize the final file after converting images.",
      },
    ],
  },
  pdfToJpg: {
    heroImage: {
      src: "/images/seo/pdf-to-jpg/hero.webp",
      alt: "PDF pages exported as JPG image files",
      width: 1200,
      height: 760,
    },
    ogImage: {
      src: "/images/seo/pdf-to-jpg/og-image.webp",
      alt: "LiftPDF PDF to JPG converter",
      width: 1200,
      height: 630,
    },
    thumbnail: {
      src: "/images/seo/pdf-to-jpg/thumbnail.webp",
      alt: "PDF to JPG page export preview",
      width: 640,
      height: 480,
    },
    howItWorks: [
      {
        title: "Upload a PDF",
        text: "Choose one PDF file and let LiftPDF render page previews with PDF.js.",
        icon: "upload",
      },
      {
        title: "Choose pages",
        text: "Export all pages, a single page or a specific page range.",
        icon: "settings",
      },
      {
        title: "Convert to JPG",
        text: "Selected pages are rendered to high-quality JPG images in the browser.",
        icon: "convert",
      },
      {
        title: "Download images",
        text: "Download one JPG for a single page or a ZIP file for multiple pages.",
        icon: "download",
      },
    ],
    whyUse: [
      {
        title: "Share a visual page",
        text: "JPG is easier to place in messages, websites, slides and design tools.",
        icon: "image",
      },
      {
        title: "Extract selected pages",
        text: "Convert only the pages you need instead of exporting the full document.",
        icon: "settings",
      },
      {
        title: "Keep documents private",
        text: "Pages are rendered locally, avoiding an upload step for sensitive PDFs.",
        icon: "privacy",
      },
    ],
    features: [
      {
        title: "All pages or ranges",
        text: "Export the full PDF, one page or a range such as 1,3,5-8.",
        icon: "settings",
      },
      {
        title: "Normal or high quality",
        text: "Choose a practical output quality without pretending to use fake DPI values.",
        icon: "quality",
      },
      {
        title: "ZIP for multiple pages",
        text: "Multi-page exports are packaged with clean names like page-1.jpg.",
        icon: "download",
      },
      {
        title: "PDF.js rendering",
        text: "The browser renders pages through the same reliable preview engine used by LiftPDF.",
        icon: "browser",
      },
      {
        title: "No server upload",
        text: "The PDF is processed on your device for a private workflow.",
        icon: "privacy",
      },
      {
        title: "Works across devices",
        text: "Use it from modern desktop and mobile browsers without installing software.",
        icon: "mobile",
      },
    ],
    useCases: [
      {
        title: "Students",
        text: "Export assignment pages or reading excerpts as images for notes and slides.",
        icon: "students",
      },
      {
        title: "Business",
        text: "Turn a PDF page into a shareable image for chat, CRM records or quick review.",
        icon: "business",
      },
      {
        title: "Designers",
        text: "Create JPG previews from PDF proofs, mockups and layout documents.",
        icon: "design",
      },
      {
        title: "Photographers",
        text: "Export portfolio PDF pages as image previews for review workflows.",
        icon: "photo",
      },
      {
        title: "Administration",
        text: "Create a JPG copy of a page when a form or portal asks for an image upload.",
        icon: "admin",
      },
      {
        title: "Personal documents",
        text: "Save a visual copy of tickets, confirmations or single-page PDFs.",
        icon: "personal",
      },
    ],
    guide: [
      {
        title: "When PDF to JPG is useful",
        paragraphs: [
          "PDF is the best format for structured documents, but JPG is often easier to use when a page needs to become a visual asset. You might need a JPG for a website upload, a presentation, a support chat, a design review or a quick preview in an app that does not accept PDF.",
          "LiftPDF focuses on page-to-image conversion. It does not pretend to extract embedded images separately; that is a different workflow. Each selected PDF page is rendered and exported as a JPG image.",
        ],
      },
      {
        title: "Selecting pages and quality",
        paragraphs: [
          "For one page, use Single page and download a single JPG. For a document section, use Page range with values like 1-3 or 1,3,5-8. When multiple pages are selected, LiftPDF packages the JPG files into a ZIP so the output stays organized.",
          "Normal quality is enough for quick sharing and previews. High quality is better when the page includes small text, charts or detailed graphics. Larger images may take more memory, especially on mobile devices.",
        ],
      },
      {
        title: "Private conversion",
        paragraphs: [
          "PDF to JPG runs with PDF.js and canvas in your browser. The browser renders pages locally and creates the JPG or ZIP file on your device, which is useful for documents that should not be uploaded to a third-party server.",
        ],
      },
    ],
    internalLinks: [
      {
        label: "PDF to PNG",
        href: "/pdf-to-png",
        text: "Use PNG output when you need lossless screenshots or transparency support.",
      },
      {
        label: "JPG to PDF",
        href: "/jpg-to-pdf",
        text: "Convert JPG images back into a clean PDF document.",
      },
      {
        label: "Images to PDF",
        href: "/images-to-pdf",
        text: "Combine exported pages with other image formats.",
      },
      {
        label: "Compress PDF",
        href: "/compress-pdf",
        text: "Optimize the source PDF before sharing or archiving.",
      },
    ],
  },
};

function makePdfWorkflowContent({
  slug,
  label,
  left,
  right,
  purpose,
  action,
  output,
  related,
  guide,
  commonProblems,
  workflowScreenshots,
  emphasis = "browser",
}: {
  slug: string;
  label: string;
  left: string;
  right: string;
  purpose: string;
  action: string;
  output: string;
  related: PremiumToolContentData["internalLinks"];
  guide: PremiumToolContentData["guide"];
  commonProblems?: PremiumToolContentData["commonProblems"];
  workflowScreenshots?: PremiumToolContentData["workflowScreenshots"];
  emphasis?: "browser" | "security" | "pages" | "edit";
}): PremiumToolContentData {
  const privacyText =
    emphasis === "security"
      ? "Security-sensitive files are handled locally so the document and password do not need to be uploaded."
      : "The workflow runs locally in your browser, which keeps everyday documents private and avoids an upload queue.";

  return {
    heroImage: {
      src: `/images/seo/${slug}/hero.webp`,
      alt: `${label} workflow illustration`,
      width: 1200,
      height: 760,
    },
    ogImage: {
      src: `/images/seo/${slug}/og-image.webp`,
      alt: `LiftPDF ${label}`,
      width: 1200,
      height: 630,
    },
    thumbnail: {
      src: `/images/seo/${slug}/thumbnail.webp`,
      alt: `${label} preview`,
      width: 640,
      height: 480,
    },
    howItWorks: [
      {
        title: `Upload ${left}`,
        text: "Choose your PDF file from the device or drop it into the upload area.",
        icon: "upload",
      },
      {
        title: "Preview and choose",
        text: "Check the file summary, pages or options before starting the operation.",
        icon: "settings",
      },
      {
        title: action,
        text: `${label} runs in the browser and prepares the new file locally.`,
        icon: "convert",
      },
      {
        title: `Download ${right}`,
        text: output,
        icon: "download",
      },
    ],
    whyUse: [
      {
        title: "Keep the workflow simple",
        text: purpose,
        icon: emphasis === "pages" ? "pdf" : "settings",
      },
      {
        title: "Private by design",
        text: privacyText,
        icon: "privacy",
      },
      {
        title: "Works anywhere",
        text: "Use the tool from modern desktop and mobile browsers without installing a PDF app.",
        icon: "mobile",
      },
    ],
    features: [
      {
        title: "Browser processing",
        text: "The file is processed on your device with client-side PDF libraries.",
        icon: "browser",
      },
      {
        title: "Clear preview",
        text: "Review the file, pages or selected options before downloading the result.",
        icon: "pdf",
      },
      {
        title: "No account required",
        text: "Use the tool without sign-in, subscriptions or trial walls.",
        icon: "quality",
      },
      {
        title: "Responsive layout",
        text: "The upload, options and download states remain usable on small screens.",
        icon: "mobile",
      },
      {
        title: "Clean file names",
        text: "Downloaded files use readable names instead of generic output.pdf labels.",
        icon: "download",
      },
      {
        title: "Error messages",
        text: "Invalid files, unsupported states and empty selections are reported clearly.",
        icon: "settings",
      },
    ],
    useCases: [
      {
        title: "Students",
        text: "Prepare class documents, notes and shared materials without desktop software.",
        icon: "students",
      },
      {
        title: "Business",
        text: "Handle receipts, contracts, reports and client documents in a quick browser workflow.",
        icon: "business",
      },
      {
        title: "Administration",
        text: "Prepare files for portals, email attachments and formal submissions.",
        icon: "admin",
      },
      {
        title: "Design review",
        text: "Adjust visual documents, proofs or exported PDF pages before sharing them.",
        icon: "design",
      },
      {
        title: "Personal documents",
        text: "Work with tickets, scans, confirmations and archives from your own device.",
        icon: "personal",
      },
      {
        title: "Mobile tasks",
        text: "Complete small PDF fixes from a phone or tablet when you are away from a computer.",
        icon: "mobile",
      },
    ],
    commonProblems,
    workflowScreenshots,
    guide,
    internalLinks: related,
  };
}

Object.assign(premiumToolContent, {
  pdfToPng: makePdfWorkflowContent({
    slug: "pdf-to-png",
    label: "PDF to PNG",
    left: "a PDF",
    right: "PNG images",
    purpose:
      "Convert PDF pages into crisp PNG files when you need lossless-looking screenshots, design assets or transparent-friendly image output.",
    action: "Convert pages",
    output:
      "Save a single PNG for one page or a ZIP file when several pages are selected.",
    related: [
      {
        label: "PDF to JPG",
        href: "/pdf-to-jpg",
        text: "Use JPG when smaller photo-style images are enough.",
      },
      {
        label: "PNG to PDF",
        href: "/png-to-pdf",
        text: "Turn PNG images back into a PDF document.",
      },
      {
        label: "Images to PDF",
        href: "/images-to-pdf",
        text: "Combine exported pages with other images.",
      },
      {
        label: "Compress PDF",
        href: "/compress-pdf",
        text: "Optimize a PDF before converting or sharing it.",
      },
    ],
    guide: [
      {
        title: "When PNG is better than JPG",
        paragraphs: [
          "PNG is a strong choice for PDF pages with text, line art, UI screenshots or graphics where sharp edges matter. It is usually larger than JPG, but the result is often cleaner for documents and interface captures.",
          "Use PDF to PNG when you plan to place a page in a design tool, keep a crisp screenshot, or avoid compression artifacts around text.",
        ],
      },
      {
        title: "Pages and output",
        paragraphs: [
          "Export all pages for a full document conversion, choose a single page for a quick image, or enter a range when only part of the PDF is needed. Multiple pages are packaged as a ZIP file with predictable page names.",
        ],
      },
    ],
  }),
  mergePdf: makePdfWorkflowContent({
    slug: "merge-pdf",
    label: "Merge PDF",
    left: "PDF files",
    right: "one PDF",
    purpose:
      "Combine related PDFs into one document so recipients do not need to open several attachments.",
    action: "Merge files",
    output: "Download a single PDF that keeps every page in the order you chose.",
    emphasis: "pages",
    related: [
      { label: "Split PDF", href: "/split-pdf", text: "Separate a PDF into selected pages or individual files." },
      { label: "Compress PDF", href: "/compress-pdf", text: "Rebuild the merged PDF with safe compression." },
      { label: "Reorder Pages", href: "/reorder-pages", text: "Arrange pages after merging if the order needs changes." },
      { label: "Delete Pages", href: "/delete-pages", text: "Remove pages that should not stay in the final document." },
    ],
    guide: [
      {
        title: "Prepare files before merging",
        paragraphs: [
          "The most important merge setting is order. Place cover pages, forms, supporting documents and appendices exactly as they should appear in the final PDF.",
          "If a file includes pages you do not need, use Delete Pages or Extract Pages first. That keeps the merged document cleaner and easier to review.",
        ],
      },
      {
        title: "Local merging",
        paragraphs: [
          "LiftPDF copies pages into a new PDF directly in your browser. This is useful for contracts, invoices, scans and personal records that should not be uploaded just to combine files.",
        ],
      },
    ],
  }),
  splitPdf: makePdfWorkflowContent({
    slug: "split-pdf",
    label: "Split PDF",
    left: "a PDF",
    right: "split files",
    purpose:
      "Extract the pages you need or split every page into its own PDF for sharing, filing or review.",
    action: "Split pages",
    output: "Download one extracted PDF or a ZIP containing one PDF per page.",
    emphasis: "pages",
    related: [
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine split pages back into one PDF later." },
      { label: "Extract Pages", href: "/extract-pages", text: "Select pages visually and save only those pages." },
      { label: "Delete Pages", href: "/delete-pages", text: "Remove unwanted pages from the original PDF." },
      { label: "Reorder Pages", href: "/reorder-pages", text: "Arrange selected pages before exporting." },
    ],
    guide: [
      {
        title: "Choose the right split mode",
        paragraphs: [
          "Use Extract pages when you need a new PDF containing a specific range such as 1,3,5-8. Use Split every page when every page should become an individual file.",
          "For visual page picking, Extract Pages gives a thumbnail-based workflow. Split PDF is faster when you already know the page numbers.",
        ],
      },
      {
        title: "Avoid range mistakes",
        paragraphs: [
          "Check that page ranges are inside the document length and that ranges go forward. LiftPDF validates invalid syntax before generating the output.",
        ],
      },
    ],
  }),
  compressPdf: makePdfWorkflowContent({
    slug: "compress-pdf",
    label: "Compress PDF",
    left: "a PDF",
    right: "a compressed PDF",
    purpose:
      "Rebuild a PDF with safe client-side optimization when you need a cleaner or sometimes smaller file.",
    action: "Compress safely",
    output: "Download the rebuilt PDF and compare original and final file sizes.",
    emphasis: "edit",
    related: [
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine files before optimizing the final document." },
      { label: "PDF to JPG", href: "/pdf-to-jpg", text: "Export pages as images when a visual copy is needed." },
      { label: "Split PDF", href: "/split-pdf", text: "Keep only the pages you need before compression." },
      { label: "Protect PDF", href: "/protect-pdf", text: "Encrypt the final document after optimization." },
    ],
    guide: [
      {
        title: "What safe compression means",
        paragraphs: [
          "Client-side PDF compression is intentionally conservative. LiftPDF rebuilds the document and removes metadata where possible, but it does not pretend to perform heavy server-side image recompression.",
          "If the output is not smaller, the tool explains that the file was already optimized. That honesty is better than fake compression levels that produce the same file.",
        ],
      },
      {
        title: "Best results",
        paragraphs: [
          "Remove unnecessary pages before compressing and avoid converting high-resolution images into PDFs unless they are needed. The biggest file-size wins usually come from simplifying the source document.",
        ],
      },
    ],
  }),
  rotatePdf: makePdfWorkflowContent({
    slug: "rotate-pdf",
    label: "Rotate PDF",
    left: "a PDF",
    right: "a rotated PDF",
    purpose:
      "Fix sideways scans, landscape pages or mixed-orientation PDFs while preserving the original page content.",
    action: "Rotate pages",
    output: "Download a PDF with the selected page rotations applied.",
    emphasis: "edit",
    related: [
      { label: "Reorder Pages", href: "/reorder-pages", text: "Arrange pages after fixing orientation." },
      { label: "Delete Pages", href: "/delete-pages", text: "Remove pages that do not belong in the document." },
      { label: "Add Page Numbers", href: "/add-page-numbers", text: "Number pages after orientation is correct." },
      { label: "Watermark PDF", href: "/watermark-pdf", text: "Add a watermark once the layout is finalized." },
    ],
    guide: [
      {
        title: "Fix orientation before editing",
        paragraphs: [
          "Rotating pages is often the first cleanup step after scanning. Fixing orientation before adding numbers, watermarks or page order changes makes the rest of the workflow easier.",
          "LiftPDF applies PDF page rotation, so the original text, images, dimensions and page content are preserved.",
        ],
      },
    ],
  }),
  addPageNumbers: makePdfWorkflowContent({
    slug: "add-page-numbers",
    label: "Add Page Numbers",
    left: "a PDF",
    right: "a numbered PDF",
    purpose:
      "Add clear page numbers to reports, packets and documents that need easy references.",
    action: "Add numbers",
    output: "Download the PDF with your chosen number format and position.",
    emphasis: "edit",
    related: [
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine documents before numbering the final packet." },
      { label: "Watermark PDF", href: "/watermark-pdf", text: "Add branding or draft labels to numbered pages." },
      { label: "Rotate PDF", href: "/rotate-pdf", text: "Fix page orientation before placing numbers." },
      { label: "Protect PDF", href: "/protect-pdf", text: "Password-protect the final numbered document." },
    ],
    guide: [
      {
        title: "Numbering readable documents",
        paragraphs: [
          "Page numbers are most useful when readers need to cite, review or print a document. Choose a bottom position for standard reports and a top position when the bottom margin contains important content.",
          "Use formats like Page 1 of 10 when the total page count helps the reader understand the document size.",
        ],
      },
    ],
  }),
  watermarkPdf: makePdfWorkflowContent({
    slug: "watermark-pdf",
    label: "Watermark PDF",
    left: "a PDF",
    right: "a watermarked PDF",
    purpose:
      "Apply text or image watermarks for drafts, branding, review copies and ownership marks.",
    action: "Apply watermark",
    output: "Download the PDF with the watermark applied to every page.",
    emphasis: "edit",
    related: [
      { label: "Add Page Numbers", href: "/add-page-numbers", text: "Add numbering alongside a watermark." },
      { label: "Protect PDF", href: "/protect-pdf", text: "Encrypt the watermarked document." },
      { label: "Rotate PDF", href: "/rotate-pdf", text: "Fix orientation before placing the watermark." },
      { label: "Compress PDF", href: "/compress-pdf", text: "Rebuild the final PDF after watermarking." },
    ],
    guide: [
      {
        title: "Choose visible but readable watermarks",
        paragraphs: [
          "A good watermark identifies the document without making the main content hard to read. Use opacity and rotation carefully, and preview every page before downloading.",
          "Text watermarks are best for draft labels and confidentiality notes. Image watermarks are useful for logos or brand marks.",
        ],
      },
    ],
  }),
  deletePages: makePdfWorkflowContent({
    slug: "delete-pages",
    label: "Delete Pages",
    left: "a PDF",
    right: "a cleaned PDF",
    purpose:
      "Remove blank pages, duplicates or private pages before sending or archiving a PDF.",
    action: "Delete selected pages",
    output: "Download a new PDF that keeps at least one page and excludes deleted pages.",
    emphasis: "pages",
    related: [
      { label: "Extract Pages", href: "/extract-pages", text: "Save selected pages instead of deleting the rest." },
      { label: "Reorder Pages", href: "/reorder-pages", text: "Move pages into the correct order." },
      { label: "Split PDF", href: "/split-pdf", text: "Split known page ranges into separate files." },
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine cleaned PDFs together." },
    ],
    guide: [
      {
        title: "Delete pages safely",
        paragraphs: [
          "Thumbnail selection helps prevent deleting the wrong page. LiftPDF also blocks removing every page because a valid PDF must contain at least one page.",
          "For confidential documents, deleting pages locally is useful because the original file does not need to be uploaded to a remote editor.",
        ],
      },
      {
        title: "When removing pages is better than extracting pages",
        paragraphs: [
          "Use Delete Pages when most of the PDF should stay and only a few blank, duplicate or outdated pages need to be removed. This is faster than rebuilding a document from selected pages.",
          "Use Extract Pages instead when you only need a small part of a large PDF, such as one contract clause, one invoice page or a short excerpt from a report.",
        ],
      },
    ],
    commonProblems: [
      {
        title: "How to remove only one page",
        paragraphs: [
          "Upload the PDF, select the single page thumbnail you want to remove, then export the updated PDF. The other pages remain in their original order.",
        ],
      },
      {
        title: "How to remove multiple pages",
        paragraphs: [
          "Select every unwanted thumbnail before exporting. The selected counter helps you confirm how many pages will be removed and how many pages will remain.",
        ],
      },
      {
        title: "Why all pages cannot be deleted",
        paragraphs: [
          "A PDF needs at least one page to remain valid. If every page is selected, LiftPDF blocks the export and asks you to keep at least one page.",
        ],
      },
      {
        title: "What to do with password-protected PDFs",
        paragraphs: [
          "If the PDF is encrypted, unlock it first with the correct password. This avoids failed exports and keeps the page removal workflow honest.",
        ],
      },
    ],
    workflowScreenshots: {
      before: {
        src: "/images/seo/delete-pages/delete-pages-before.png",
        alt: "Delete PDF Pages page thumbnails before removing selected pages",
        width: 1280,
        height: 860,
        label: "Before deleting",
        caption:
          "Preview thumbnails make it easier to identify blank, duplicate or private pages before export.",
      },
      after: {
        src: "/images/seo/delete-pages/delete-pages-after.png",
        alt: "Delete PDF Pages success state after creating an updated PDF",
        width: 1280,
        height: 860,
        label: "After export",
        caption:
          "The updated PDF is generated locally and is ready to download without uploading the original file.",
      },
    },
  }),
  extractPages: makePdfWorkflowContent({
    slug: "extract-pages",
    label: "Extract Pages",
    left: "a PDF",
    right: "an extracted PDF",
    purpose:
      "Select important pages visually and save them into a new PDF without keeping the rest.",
    action: "Extract selected pages",
    output: "Download a new PDF containing only the selected pages in original order.",
    emphasis: "pages",
    related: [
      { label: "Delete Pages", href: "/delete-pages", text: "Remove pages from the original document instead." },
      { label: "Reorder Pages", href: "/reorder-pages", text: "Arrange pages before exporting a new version." },
      { label: "Split PDF", href: "/split-pdf", text: "Use typed ranges or split every page." },
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine extracted pages with other PDFs." },
    ],
    guide: [
      {
        title: "Extract only what matters",
        paragraphs: [
          "Extract Pages is useful when you need to send a few pages from a longer PDF. Selecting pages visually reduces mistakes compared with typing ranges from memory.",
          "The exported PDF keeps the selected pages in their original order, which is usually what recipients expect.",
        ],
      },
      {
        title: "Extract one page, several pages or an excerpt",
        paragraphs: [
          "For a single page, select only that page and download a one-page PDF. For multiple pages, select each thumbnail you need and LiftPDF creates one clean PDF in the original order.",
          "This workflow is useful for reports, books, contracts and scanned packets where the page numbers are known but the surrounding pages should not be shared.",
        ],
      },
    ],
    commonProblems: [
      {
        title: "How to extract only one page",
        paragraphs: [
          "Select one thumbnail and export. The result is a new PDF containing only that page, which is easier to share than sending the full document.",
        ],
      },
      {
        title: "How to extract selected pages online",
        paragraphs: [
          "Use the visual page grid to select pages such as 2, 5 and 8. LiftPDF keeps the selected pages in document order so the output remains predictable.",
        ],
      },
      {
        title: "Why extracted pages may look blank",
        paragraphs: [
          "If the original page is blank, image-only, damaged or encrypted, the extracted result can appear empty. Check the preview first and unlock protected PDFs before extracting.",
        ],
      },
      {
        title: "How to extract pages without Adobe",
        paragraphs: [
          "LiftPDF performs the page copy in your browser. You do not need Acrobat, a desktop installer or an account for basic selected-page extraction.",
        ],
      },
    ],
    workflowScreenshots: {
      before: {
        src: "/images/seo/extract-pages/extract-pages-before.png",
        alt: "Extract PDF Pages page preview before selecting pages",
        width: 1280,
        height: 860,
        label: "Before extracting",
        caption:
          "Every page is visible as a thumbnail, so you can select one page or several pages before creating a new PDF.",
      },
      after: {
        src: "/images/seo/extract-pages/extract-pages-after.png",
        alt: "Extract PDF Pages success state after selected pages are exported",
        width: 1280,
        height: 860,
        label: "After export",
        caption:
          "The selected pages are copied into a new PDF while the original document stays on your device.",
      },
    },
  }),
  reorderPages: makePdfWorkflowContent({
    slug: "reorder-pages",
    label: "Reorder Pages",
    left: "a PDF",
    right: "a reordered PDF",
    purpose:
      "Move PDF pages into the right sequence before sending a packet, report or scan.",
    action: "Reorder pages",
    output: "Download a new PDF using the page order shown in the preview grid.",
    emphasis: "pages",
    related: [
      { label: "Delete Pages", href: "/delete-pages", text: "Remove pages that should not be included." },
      { label: "Extract Pages", href: "/extract-pages", text: "Save only the selected pages." },
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine files before arranging pages." },
      { label: "Split PDF", href: "/split-pdf", text: "Split the document after reordering if needed." },
    ],
    guide: [
      {
        title: "Use visual order, not guesswork",
        paragraphs: [
          "Scanned packets often arrive out of order. A thumbnail grid lets you identify pages visually and move them with drag and drop or accessible move buttons.",
          "If you are combining several workflows, merge first, reorder second, then add page numbers or watermarks last.",
        ],
      },
      {
        title: "Reorder PDF pages without changing quality",
        paragraphs: [
          "Reordering changes page sequence, not page content. LiftPDF copies each page into a new document in the order shown by the preview grid.",
          "Use Reset order if you want to return to the original sequence before exporting. On mobile, the move buttons provide the same control without relying on drag and drop.",
        ],
      },
    ],
    commonProblems: [
      {
        title: "How to reorder pages in a PDF",
        paragraphs: [
          "Upload the PDF, move thumbnails into the correct sequence, then export. The output PDF follows the new order shown in the preview grid.",
        ],
      },
      {
        title: "How to move one page to the beginning",
        paragraphs: [
          "Drag the page to the first position on desktop, or use the move buttons on mobile and keyboard workflows until the page reaches position one.",
        ],
      },
      {
        title: "Why the order did not change",
        paragraphs: [
          "The preview order is only applied after export. If the downloaded PDF still looks unchanged, confirm that at least one page was moved before clicking Reorder PDF.",
        ],
      },
      {
        title: "What to do with password-protected PDFs",
        paragraphs: [
          "Encrypted PDFs must be unlocked first with the correct password before pages can be rearranged and exported.",
        ],
      },
    ],
    workflowScreenshots: {
      before: {
        src: "/images/seo/reorder-pages/reorder-pages-before.png",
        alt: "Reorder PDF Pages thumbnail grid before changing page order",
        width: 1280,
        height: 860,
        label: "Before reordering",
        caption:
          "Original page numbers and current positions help you understand the document sequence before moving pages.",
      },
      after: {
        src: "/images/seo/reorder-pages/reorder-pages-after.png",
        alt: "Reorder PDF Pages success state after creating a reordered PDF",
        width: 1280,
        height: 860,
        label: "After export",
        caption:
          "The reordered PDF is generated locally with pages copied in the exact order shown in the preview.",
      },
    },
  }),
  protectPdf: makePdfWorkflowContent({
    slug: "protect-pdf",
    label: "Protect PDF",
    left: "a PDF",
    right: "an encrypted PDF",
    purpose:
      "Add real password encryption to PDFs that should not open without the password.",
    action: "Encrypt PDF",
    output: "Download a password-protected PDF that requires the password when opened.",
    emphasis: "security",
    related: [
      { label: "Unlock PDF", href: "/unlock-pdf", text: "Remove password protection later if you know the password." },
      { label: "Watermark PDF", href: "/watermark-pdf", text: "Mark a document before encrypting it." },
      { label: "Compress PDF", href: "/compress-pdf", text: "Optimize the file before protecting it." },
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine documents before adding protection." },
    ],
    guide: [
      {
        title: "Use a strong password",
        paragraphs: [
          "PDF encryption is only as useful as the password protecting it. Use a password that is long, unique and not reused from another account.",
          "LiftPDF uses QPDF WASM locally for real PDF encryption. Your password and file are not uploaded to a server during the process.",
        ],
      },
    ],
  }),
  unlockPdf: makePdfWorkflowContent({
    slug: "unlock-pdf",
    label: "Unlock PDF",
    left: "a protected PDF",
    right: "an unlocked PDF",
    purpose:
      "Remove password encryption from a PDF when you know the correct password and have permission to unlock it.",
    action: "Remove password",
    output: "Download a copy that opens without the password.",
    emphasis: "security",
    related: [
      { label: "Protect PDF", href: "/protect-pdf", text: "Add a new password after editing or sharing." },
      { label: "PDF to Text", href: "/pdf-to-text", text: "Extract text after unlocking a protected document." },
      { label: "Compress PDF", href: "/compress-pdf", text: "Optimize the unlocked copy." },
      { label: "Merge PDF", href: "/merge-pdf", text: "Combine unlocked PDFs with other files." },
    ],
    guide: [
      {
        title: "Unlock only authorized documents",
        paragraphs: [
          "Unlock PDF is designed for files you own or are allowed to access. You still need the correct password; the tool does not bypass encryption.",
          "The unlocked copy is created locally with QPDF WASM and can be used in other LiftPDF tools that cannot process encrypted PDFs directly.",
        ],
      },
    ],
  }),
  pdfToText: makePdfWorkflowContent({
    slug: "pdf-to-text",
    label: "PDF to Text",
    left: "a PDF",
    right: "plain text",
    purpose:
      "Extract selectable text from digital PDFs for copying, searching, notes and plain-text archives.",
    action: "Extract text",
    output: "Copy the text or download a UTF-8 TXT file with page separators.",
    related: [
      { label: "Unlock PDF", href: "/unlock-pdf", text: "Unlock protected PDFs before text extraction." },
      { label: "PDF to JPG", href: "/pdf-to-jpg", text: "Export pages as images when the PDF is visual." },
      { label: "PDF to PNG", href: "/pdf-to-png", text: "Create sharp image copies of PDF pages." },
      { label: "Images to PDF", href: "/images-to-pdf", text: "Build PDFs from image sources." },
    ],
    guide: [
      {
        title: "Text extraction is not OCR",
        paragraphs: [
          "PDF to Text extracts text that already exists inside the PDF. If the document is scanned or image-only, there may be no selectable text to extract.",
          "For digital PDFs, the tool separates content by page so the output is easier to read, copy or save as a text file.",
        ],
      },
    ],
  }),
});
