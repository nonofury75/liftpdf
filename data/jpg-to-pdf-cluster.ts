import type {
  GuideFaqItem,
  GuideLink,
  GuideSection,
} from "@/data/extract-pages-cluster";

export type JpgToPdfGuide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intent: "guide" | "problem" | "comparison" | "faq";
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
  quickSteps: string[];
  sections: GuideSection[];
  faq: GuideFaqItem[];
  relatedLinks: GuideLink[];
};

const jpgToolLink = {
  label: "JPG to PDF",
  href: "/jpg-to-pdf",
  text: "Convert JPG images into a clean PDF document.",
} satisfies GuideLink;

const imageLinks = [
  {
    label: "PNG to PDF",
    href: "/png-to-pdf",
    text: "Use this for PNG screenshots or images with transparency.",
  },
  {
    label: "Images to PDF",
    href: "/images-to-pdf",
    text: "Combine JPG, PNG and WEBP files in one PDF.",
  },
  {
    label: "PDF to JPG",
    href: "/pdf-to-jpg",
    text: "Export PDF pages back into JPG images.",
  },
  {
    label: "Compress PDF",
    href: "/compress-pdf",
    text: "Reduce the final PDF size after conversion.",
  },
  {
    label: "Merge PDF",
    href: "/merge-pdf",
    text: "Combine the created PDF with other PDF documents.",
  },
] satisfies GuideLink[];

const workflowImage = {
  src: "/images/seo/jpg-to-pdf/jpg-to-pdf-workflow.webp",
  alt: "LiftPDF JPG to PDF workflow with upload, preview and download",
  width: 1280,
  height: 860,
};

const beforeImage = {
  src: "/images/seo/jpg-to-pdf/jpg-to-pdf-before.webp",
  alt: "LiftPDF JPG to PDF before conversion with selected images",
  width: 1280,
  height: 860,
};

const afterImage = {
  src: "/images/seo/jpg-to-pdf/jpg-to-pdf-after.webp",
  alt: "LiftPDF JPG to PDF success state after creating a PDF",
  width: 1280,
  height: 860,
};

const previewImage = {
  src: "/images/seo/jpg-to-pdf/jpg-to-pdf-preview.webp",
  alt: "LiftPDF JPG to PDF live page preview with layout settings",
  width: 1280,
  height: 860,
};

export const jpgToPdfOgImage = {
  src: "/images/seo/jpg-to-pdf/jpg-to-pdf-og.webp",
  alt: "LiftPDF JPG to PDF browser-based converter preview",
  width: 1200,
  height: 630,
};

const privacySection = {
  heading: "Privacy and browser processing",
  body: [
    "LiftPDF creates the PDF in your browser for supported JPG files. The conversion does not need a document upload API, which is useful when photos include IDs, receipts, contracts, class notes or personal records.",
    "This does not replace careful file handling, but it removes a common risk in online converters: sending private images to a remote conversion queue for a simple PDF task.",
  ],
} satisfies GuideSection;

const qualitySection = {
  heading: "How to keep the PDF looking sharp",
  body: [
    "The final PDF can only be as sharp as the source JPG. Start with the highest-resolution original image you have, avoid screenshots of screenshots, and do not repeatedly resave the same JPG before converting.",
    "Use Auto page size with no margin when you want the PDF page to follow the image ratio. Use A4 or Letter when a school, office or upload portal requires a standard document page.",
  ],
  list: [
    "Fit keeps the full image visible.",
    "Fill covers the page but can crop edges.",
    "Large margins are useful for printing notes, not for maximum image size.",
  ],
} satisfies GuideSection;

const layoutSection = {
  heading: "Page size, orientation and margins",
  body: [
    "JPG images do not have a fixed paper size. The PDF layout is created during conversion, so page size and margin choices matter. Auto keeps the document close to the image shape, while A4 and Letter create standard paper pages.",
    "Portrait and landscape should match the way the image is meant to be read. If you are unsure, Auto is the simplest starting point.",
  ],
} satisfies GuideSection;

const commonFaq = [
  {
    question: "Can I convert JPG to PDF for free?",
    answer:
      "Yes. LiftPDF lets you convert JPG and JPEG images into a PDF for free in your browser.",
  },
  {
    question: "Can I convert multiple JPG files into one PDF?",
    answer:
      "Yes. Add multiple JPG images, arrange them in the right order and export one PDF with each image on its own page.",
  },
  {
    question: "Will converting JPG to PDF reduce quality?",
    answer:
      "LiftPDF places the original image into a PDF page. Quality mainly depends on the source image resolution and the layout choices you make.",
  },
  {
    question: "Are my JPG files uploaded?",
    answer:
      "For supported files, the PDF is generated locally in your browser. Your images do not need to be uploaded to a server for conversion.",
  },
] satisfies GuideFaqItem[];

function guide(input: Omit<JpgToPdfGuide, "canonical" | "relatedLinks"> & {
  relatedLinks?: GuideLink[];
}): JpgToPdfGuide {
  return {
    ...input,
    canonical: `/guides/${input.slug}`,
    relatedLinks: input.relatedLinks || [jpgToolLink, ...imageLinks],
  };
}

export const jpgToPdfGuides = [
  guide({
    slug: "how-to-convert-jpg-to-pdf",
    title: "How to Convert JPG to PDF Online | LiftPDF",
    description:
      "Learn how to convert JPG images to PDF online, choose clean layout settings and download a private browser-generated PDF.",
    h1: "How to Convert JPG to PDF",
    intent: "guide",
    primaryKeyword: "how to convert jpg to pdf",
    secondaryKeywords: ["jpg to pdf", "convert jpeg to pdf", "make pdf from jpg"],
    summary:
      "The cleanest JPG to PDF workflow is simple: add your images, check the live PDF preview, choose page settings and export one document.",
    ctaLabel: "Convert JPG to PDF",
    image: workflowImage,
    quickSteps: [
      "Open the JPG to PDF tool.",
      "Upload one or more JPG or JPEG images.",
      "Choose page size, orientation, margin and image fit.",
      "Convert and download the PDF.",
    ],
    sections: [
      {
        heading: "When JPG to PDF is the right choice",
        body: [
          "JPG is excellent for photos, camera scans and compressed images. PDF is better when those images need to travel as a document, print consistently or be submitted to a school, business, government portal or client.",
          "A PDF keeps related images together and preserves page order. That is why JPG to PDF is useful for receipts, signed pages, homework, ID copies, visual reports and photo-based document scans.",
        ],
      },
      qualitySection,
      layoutSection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can I reorder images before converting?",
        answer:
          "Yes. Move images up or down in the selected file list before exporting. The PDF follows that order.",
      },
      {
        question: "Should I use Auto, A4 or Letter?",
        answer:
          "Use Auto for natural image pages. Use A4 or Letter when the PDF must match a standard paper size.",
      },
    ],
  }),
  guide({
    slug: "how-to-convert-multiple-jpg-to-pdf",
    title: "How to Convert Multiple JPG Files to One PDF | LiftPDF",
    description:
      "Convert multiple JPG images into one PDF. Learn how to order pages, choose layout settings and avoid file-size problems.",
    h1: "How to Convert Multiple JPG Files to One PDF",
    intent: "guide",
    primaryKeyword: "convert multiple jpg to pdf",
    secondaryKeywords: ["multiple jpg to pdf", "combine jpg into pdf", "jpg images to one pdf"],
    summary:
      "When several images belong together, convert them into one PDF instead of sending a loose batch of attachments.",
    ctaLabel: "Convert multiple JPGs",
    image: beforeImage,
    quickSteps: [
      "Add every JPG image that belongs in the document.",
      "Move files until the page order is correct.",
      "Use Auto page size for image-like pages or A4/Letter for documents.",
      "Create and download one PDF.",
    ],
    sections: [
      {
        heading: "The order matters more than the button",
        body: [
          "For multi-image PDFs, the most common mistake is page order. Put cover pages, forms, receipts, supporting photos and final pages in the same order the reader should see them.",
          "If filenames are unclear, rename them before upload or use the preview thumbnails to confirm the sequence.",
        ],
      },
      qualitySection,
      {
        heading: "When the final PDF becomes large",
        body: [
          "Multiple high-resolution JPGs can create a large PDF. That is normal: the PDF contains the images you selected. If the final document is too large for email or upload portals, use Compress PDF after conversion.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Is each JPG placed on its own PDF page?",
        answer:
          "Yes. LiftPDF creates one PDF page per image so the result stays predictable.",
      },
      {
        question: "Can I add more images after upload?",
        answer:
          "Yes. Use Add more images, then reorder the full list before converting.",
      },
    ],
  }),
  guide({
    slug: "how-to-convert-jpg-to-pdf-without-losing-quality",
    title: "Convert JPG to PDF Without Losing Quality | LiftPDF",
    description:
      "Learn how to keep JPG images sharp when converting to PDF, including source resolution, fit mode, margins and page size.",
    h1: "How to Convert JPG to PDF Without Losing Quality",
    intent: "guide",
    primaryKeyword: "jpg to pdf without losing quality",
    secondaryKeywords: ["convert jpg to pdf high quality", "jpg blurry after pdf", "keep image quality pdf"],
    summary:
      "A sharp PDF starts with a sharp JPG. The best settings preserve the full image, avoid unnecessary margins and do not enlarge a low-resolution source.",
    ctaLabel: "Create high-quality PDF",
    image: previewImage,
    quickSteps: [
      "Use the original JPG instead of a compressed copy.",
      "Choose Auto page size when the PDF should match the image ratio.",
      "Use Fit to keep the full image visible.",
      "Avoid large margins unless you need print whitespace.",
    ],
    sections: [
      qualitySection,
      {
        heading: "What conversion can and cannot improve",
        body: [
          "A converter cannot add detail that is not in the source image. If the JPG is small, heavily compressed or already blurry, the PDF will show the same limits.",
          "What LiftPDF can do is avoid unnecessary layout damage. Auto page size, no margin and Fit mode are usually the safest settings for preserving the original look.",
        ],
      },
      layoutSection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Why does my PDF look blurry after converting?",
        answer:
          "The source JPG may be low resolution, heavily compressed or enlarged too much on the PDF page.",
      },
      {
        question: "Is Fill better quality than Fit?",
        answer:
          "No. Fill covers the page and can crop edges. Fit is safer when preserving the full image matters.",
      },
    ],
  }),
  guide({
    slug: "jpg-to-pdf-online",
    title: "JPG to PDF Online Free | LiftPDF",
    description:
      "Convert JPG to PDF online for free with layout preview, page settings and browser-based processing.",
    h1: "JPG to PDF Online",
    intent: "guide",
    primaryKeyword: "jpg to pdf online",
    secondaryKeywords: ["online jpg to pdf", "jpg to pdf converter online", "jpeg to pdf online"],
    summary:
      "An online JPG to PDF tool should be fast, predictable and private. LiftPDF keeps the workflow focused: upload images, preview the PDF and download.",
    ctaLabel: "Use JPG to PDF online",
    image: workflowImage,
    quickSteps: [
      "Choose JPG images from your device.",
      "Review the PDF preview and page order.",
      "Adjust page settings if needed.",
      "Download the generated PDF.",
    ],
    sections: [
      {
        heading: "What makes a good online converter",
        body: [
          "The tool should make the result clear before export. A live page preview helps you see orientation, page size, margins and fit mode without guessing.",
          "It should also avoid account friction for a simple conversion task. JPG to PDF is often a quick job, not a full document-management project.",
        ],
      },
      qualitySection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Do I need to install software?",
        answer:
          "No. LiftPDF runs in a modern browser, so there is no desktop app to install for this workflow.",
      },
      {
        question: "Can I use JPG to PDF on mobile?",
        answer:
          "Yes. The online tool works on modern mobile browsers, including Safari and Chrome.",
      },
    ],
  }),
  guide({
    slug: "jpg-to-pdf-without-adobe",
    title: "JPG to PDF Without Adobe | LiftPDF",
    description:
      "Convert JPG files to PDF without Adobe Acrobat. Use a simple browser workflow for everyday image-to-document tasks.",
    h1: "How to Convert JPG to PDF Without Adobe",
    intent: "guide",
    primaryKeyword: "jpg to pdf without adobe",
    secondaryKeywords: ["convert jpg without adobe", "adobe alternative jpg to pdf", "free jpg to pdf"],
    summary:
      "Adobe Acrobat is powerful, but you do not always need a full PDF suite just to turn JPG images into a document.",
    ctaLabel: "Convert without Adobe",
    image: afterImage,
    quickSteps: [
      "Open LiftPDF JPG to PDF.",
      "Add your JPG images.",
      "Set page layout if needed.",
      "Download the PDF.",
    ],
    sections: [
      {
        heading: "When Adobe is useful",
        body: [
          "Adobe Acrobat is a strong choice for advanced editing, enterprise PDF review, signatures, redaction and long document workflows.",
          "If your task is only to make a PDF from JPG images, a focused browser tool can be faster and easier.",
        ],
      },
      {
        heading: "When LiftPDF is the simpler choice",
        body: [
          "LiftPDF keeps the JPG workflow narrow: choose images, see the preview, adjust layout and export. There is no cloud drive requirement or unrelated editing step in the conversion flow.",
        ],
      },
      qualitySection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Is LiftPDF a full Adobe replacement?",
        answer:
          "No. LiftPDF is a focused browser tool suite for common PDF tasks. Adobe remains stronger for advanced professional workflows.",
      },
      {
        question: "Can I use LiftPDF without an account?",
        answer:
          "Yes. The current JPG to PDF workflow does not require an account.",
      },
    ],
  }),
  guide({
    slug: "jpg-to-pdf-on-windows",
    title: "Convert JPG to PDF on Windows | LiftPDF",
    description:
      "Learn how to convert JPG images to PDF on Windows using a browser-based workflow with page preview and layout settings.",
    h1: "How to Convert JPG to PDF on Windows",
    intent: "guide",
    primaryKeyword: "jpg to pdf on windows",
    secondaryKeywords: ["convert jpg to pdf windows", "jpeg to pdf windows", "windows jpg to pdf"],
    summary:
      "On Windows, you can convert JPG images to PDF directly in Edge, Chrome or Firefox without installing a desktop converter.",
    ctaLabel: "Convert on Windows",
    image: beforeImage,
    quickSteps: [
      "Open LiftPDF in a Windows browser.",
      "Choose JPG images from File Explorer.",
      "Set A4, Letter or Auto page size.",
      "Download the PDF to your Downloads folder.",
    ],
    sections: [
      {
        heading: "Windows workflow tips",
        body: [
          "If your images are in different folders, collect them into one folder first. Clear filenames make it easier to check page order before converting.",
          "For printer-ready documents, A4 or Letter with Fit mode is usually safer. For photo-like PDFs, Auto page size with no margin keeps the image shape more natural.",
        ],
      },
      qualitySection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Does this work in Microsoft Edge?",
        answer:
          "Yes. LiftPDF works in modern Edge, Chrome, Firefox and other current Chromium-based browsers.",
      },
    ],
  }),
  guide({
    slug: "jpg-to-pdf-on-mac",
    title: "Convert JPG to PDF on Mac | LiftPDF",
    description:
      "Convert JPG images to PDF on Mac with a browser-based workflow that keeps page order, layout and privacy clear.",
    h1: "How to Convert JPG to PDF on Mac",
    intent: "guide",
    primaryKeyword: "jpg to pdf on mac",
    secondaryKeywords: ["convert jpg to pdf mac", "jpeg to pdf mac", "mac jpg to pdf"],
    summary:
      "Mac users can create a PDF from JPG images in Safari, Chrome or Firefox while previewing page layout before export.",
    ctaLabel: "Convert on Mac",
    image: workflowImage,
    quickSteps: [
      "Open LiftPDF in Safari, Chrome or Firefox.",
      "Upload JPG images from Finder or Photos exports.",
      "Preview the PDF page layout.",
      "Convert and save the PDF.",
    ],
    sections: [
      {
        heading: "Browser workflow vs Preview app",
        body: [
          "macOS Preview can handle simple PDF tasks, but a browser workflow is useful when you want the same controls across Mac, Windows and mobile.",
          "LiftPDF gives a dedicated page preview, order controls and layout options in one place before export.",
        ],
      },
      qualitySection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Does JPG to PDF work in Safari?",
        answer:
          "Yes. Use an updated Safari version for the best browser API support.",
      },
    ],
  }),
  guide({
    slug: "jpg-to-pdf-on-iphone",
    title: "Convert JPG to PDF on iPhone | LiftPDF",
    description:
      "Turn iPhone JPG photos into a PDF online. Learn how to select images, keep order clear and download the result.",
    h1: "How to Convert JPG to PDF on iPhone",
    intent: "guide",
    primaryKeyword: "jpg to pdf on iphone",
    secondaryKeywords: ["convert photo to pdf iphone", "iphone jpg to pdf", "jpeg to pdf iphone"],
    summary:
      "On iPhone, JPG to PDF is useful for receipts, signed pages, handwritten notes and photographed documents.",
    ctaLabel: "Convert on iPhone",
    image: previewImage,
    quickSteps: [
      "Open LiftPDF in Safari.",
      "Choose JPG images from Photos or Files.",
      "Check the image order and preview.",
      "Download the PDF to Files.",
    ],
    sections: [
      {
        heading: "Mobile conversion tips",
        body: [
          "Before uploading, crop obvious background areas in Photos if the document was photographed on a desk. Better source images make better PDFs.",
          "Use move controls to place pages in order. On mobile, clear filenames and careful selection matter more than drag gestures.",
        ],
      },
      qualitySection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Where does the PDF download on iPhone?",
        answer:
          "Safari usually asks where to save downloads, commonly in the Files app.",
      },
    ],
  }),
  guide({
    slug: "jpg-to-pdf-on-android",
    title: "Convert JPG to PDF on Android | LiftPDF",
    description:
      "Convert Android JPG photos into a PDF with a browser-based workflow. Choose images, preview layout and download.",
    h1: "How to Convert JPG to PDF on Android",
    intent: "guide",
    primaryKeyword: "jpg to pdf on android",
    secondaryKeywords: ["convert image to pdf android", "android jpg to pdf", "jpeg to pdf android"],
    summary:
      "Android users can convert camera photos and downloaded JPGs into one PDF directly in Chrome or another modern browser.",
    ctaLabel: "Convert on Android",
    image: workflowImage,
    quickSteps: [
      "Open LiftPDF in Chrome on Android.",
      "Select JPG images from Files, Gallery or Downloads.",
      "Check the preview and page order.",
      "Create and download the PDF.",
    ],
    sections: [
      {
        heading: "Best Android workflow",
        body: [
          "If your photos are in a gallery app, select only the final images before converting. Avoid duplicate shots and blurred photos so the PDF stays smaller and cleaner.",
          "For document photos, portrait orientation usually works best. For screenshots or wide images, landscape may be clearer.",
        ],
      },
      qualitySection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Does this work on Samsung phones?",
        answer:
          "Yes. Use Chrome, Samsung Internet or another modern browser with local file access.",
      },
    ],
  }),
  guide({
    slug: "jpg-to-pdf-free",
    title: "Free JPG to PDF Converter | LiftPDF",
    description:
      "Use a free JPG to PDF converter that works in your browser. Convert one or many JPG files without watermarks.",
    h1: "Free JPG to PDF Converter",
    intent: "guide",
    primaryKeyword: "jpg to pdf free",
    secondaryKeywords: ["free jpg to pdf", "jpg to pdf no watermark", "jpeg to pdf free"],
    summary:
      "A free JPG to PDF converter should let you create the document, download it and move on without adding watermarks or account friction.",
    ctaLabel: "Use free converter",
    image: afterImage,
    quickSteps: [
      "Open the free JPG to PDF tool.",
      "Upload your images.",
      "Choose layout settings.",
      "Download the PDF.",
    ],
    sections: [
      {
        heading: "What free should mean",
        body: [
          "For a basic image-to-PDF task, free should mean no watermark on the output, no surprise account requirement before download and no unnecessary workflow detour.",
          "LiftPDF keeps JPG to PDF direct for current use: image selection, live preview, settings and download.",
        ],
      },
      qualitySection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Does LiftPDF add a watermark?",
        answer:
          "No. The JPG to PDF output is not watermarked by LiftPDF.",
      },
    ],
  }),
  guide({
    slug: "why-is-my-jpg-blurry-after-pdf",
    title: "Why Is My JPG Blurry After Converting to PDF? | LiftPDF",
    description:
      "Learn why JPG images can look blurry in PDFs and how to fix source resolution, scaling, margins and fit settings.",
    h1: "Why Is My JPG Blurry After PDF Conversion?",
    intent: "problem",
    primaryKeyword: "jpg blurry after pdf",
    secondaryKeywords: ["image blurry in pdf", "pdf image quality problem", "jpg to pdf blurry"],
    summary:
      "Blurry PDF output usually comes from low source resolution, over-compression, excessive scaling or viewer zoom behavior.",
    ctaLabel: "Convert with preview",
    image: previewImage,
    quickSteps: [
      "Check the original JPG at full size.",
      "Use Auto page size and no margin for natural image ratio.",
      "Choose Fit to avoid unwanted crop.",
      "Avoid enlarging a small image onto a large page.",
    ],
    sections: [
      {
        heading: "The common causes",
        body: [
          "JPG files lose detail when they are saved with strong compression or repeatedly exported. If the source image is already soft, putting it into a PDF will not restore lost pixels.",
          "Another common cause is scaling. A small JPG stretched across an A4 or Letter page can look soft because the page is larger than the image detail supports.",
        ],
      },
      qualitySection,
      layoutSection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can a PDF converter sharpen a blurry JPG?",
        answer:
          "No. It can preserve the image layout, but it cannot recreate detail that is missing from the JPG.",
      },
    ],
  }),
  guide({
    slug: "why-is-my-pdf-too-large-after-converting-jpg",
    title: "Why Is My PDF Too Large After Converting JPG? | LiftPDF",
    description:
      "Understand why JPG-to-PDF files can become large and how to reduce size without choosing fake quality settings.",
    h1: "Why Is My PDF Too Large After Converting JPG?",
    intent: "problem",
    primaryKeyword: "pdf too large after converting jpg",
    secondaryKeywords: ["jpg to pdf file too big", "reduce jpg pdf size", "large image pdf"],
    summary:
      "Large image PDFs are usually caused by many high-resolution photos. The PDF has to carry the pixels you put into it.",
    ctaLabel: "Create image PDF",
    image: afterImage,
    quickSteps: [
      "Remove duplicate or unnecessary images.",
      "Use only the pages the recipient needs.",
      "Convert the JPG images to PDF.",
      "Use Compress PDF if the result is still too large.",
    ],
    sections: [
      {
        heading: "Why image PDFs grow quickly",
        body: [
          "A single modern phone photo can be several megabytes. Ten or twenty photos placed into one PDF can therefore create a large document even when the workflow is working correctly.",
          "Margins and page size do not magically reduce image data. They mostly change layout. To reduce size meaningfully, start by removing extra images or compress the finished PDF.",
        ],
      },
      {
        heading: "Best fixes",
        body: [
          "Delete duplicates before upload, avoid adding every alternate photo, and use the image that best represents each page. After conversion, run Compress PDF if the final file must fit an email or upload limit.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can every image PDF be compressed a lot?",
        answer:
          "No. Some files are already efficient or contain images that cannot shrink much without visible quality loss.",
      },
    ],
  }),
  guide({
    slug: "why-cant-i-convert-jpg-to-pdf",
    title: "Why Can't I Convert JPG to PDF? | LiftPDF",
    description:
      "Fix common JPG to PDF conversion problems, including unsupported files, huge images, corrupt images and browser limits.",
    h1: "Why Can't I Convert JPG to PDF?",
    intent: "problem",
    primaryKeyword: "can't convert jpg to pdf",
    secondaryKeywords: ["jpg to pdf not working", "jpeg to pdf error", "image to pdf failed"],
    summary:
      "Most JPG conversion failures come from unsupported file types, damaged images, very large files or browser memory limits.",
    ctaLabel: "Try JPG to PDF again",
    image: beforeImage,
    quickSteps: [
      "Confirm the file is JPG or JPEG.",
      "Open the image locally to make sure it is not corrupted.",
      "Try fewer images if the batch is huge.",
      "Refresh the page and convert again.",
    ],
    sections: [
      {
        heading: "Check the file type first",
        body: [
          "A file can have a confusing name. If the image is actually PNG, WEBP, HEIC or another format, use Images to PDF or convert the source first.",
          "LiftPDF's dedicated JPG page accepts JPG and JPEG so the workflow stays predictable.",
        ],
      },
      {
        heading: "Large images and memory",
        body: [
          "Browser-based tools use your device memory. Very large camera images or huge batches can be limited by the browser or device, especially on older phones.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can I upload PNG on the JPG tool?",
        answer:
          "No. Use PNG to PDF or Images to PDF for PNG, WEBP or mixed image formats.",
      },
    ],
  }),
  guide({
    slug: "how-to-keep-original-image-quality",
    title: "How to Keep Original Image Quality in PDF | LiftPDF",
    description:
      "Practical settings for preserving original JPG quality when creating a PDF: source resolution, page ratio, margins and fit mode.",
    h1: "How to Keep Original Image Quality in PDF",
    intent: "problem",
    primaryKeyword: "keep original image quality pdf",
    secondaryKeywords: ["preserve jpg quality in pdf", "high quality image pdf", "pdf from images quality"],
    summary:
      "To keep original quality, avoid unnecessary resizing. Match the PDF page to the image when possible and use the cleanest source JPG.",
    ctaLabel: "Make quality PDF",
    image: previewImage,
    quickSteps: [
      "Start with the original JPG file.",
      "Use Auto page size for natural image dimensions.",
      "Use None or Small margin depending on the document.",
      "Use Fit unless edge-to-edge cropping is intentional.",
    ],
    sections: [
      qualitySection,
      {
        heading: "Original quality means realistic expectations",
        body: [
          "A PDF can preserve the visible image, but it cannot turn a small compressed JPG into a print-grade scan. If the file needs to be printed, use a high-resolution source image from the beginning.",
        ],
      },
      layoutSection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Should I choose no margin for best quality?",
        answer:
          "No margin gives the image more page space. That helps avoid unnecessary shrinking, but source resolution still matters most.",
      },
    ],
  }),
  guide({
    slug: "jpg-vs-png",
    title: "JPG vs PNG: Which Should You Convert to PDF? | LiftPDF",
    description:
      "Compare JPG and PNG for PDF conversion, including photos, screenshots, transparency, file size and document quality.",
    h1: "JPG vs PNG for PDF Conversion",
    intent: "comparison",
    primaryKeyword: "jpg vs png",
    secondaryKeywords: ["jpg or png to pdf", "png vs jpg quality", "best image format for pdf"],
    summary:
      "JPG and PNG are both useful, but they solve different problems. Choose JPG for photos and PNG for screenshots, sharp graphics or transparency.",
    ctaLabel: "Convert JPG to PDF",
    image: workflowImage,
    quickSteps: [
      "Use JPG for photos and camera scans.",
      "Use PNG for screenshots, logos and transparent images.",
      "Use Images to PDF when the batch contains both.",
      "Choose layout settings based on the final document.",
    ],
    sections: [
      {
        heading: "When JPG is better",
        body: [
          "JPG is usually better for photographs because it compresses natural color and gradients efficiently. It is common for camera scans, receipts and document photos.",
        ],
      },
      {
        heading: "When PNG is better",
        body: [
          "PNG is often better for screenshots, UI captures, logos, diagrams and images with transparency. It can preserve sharp edges more cleanly than a heavily compressed JPG.",
        ],
      },
      {
        heading: "When to use Images to PDF",
        body: [
          "If your source folder contains a mix of JPG, PNG and WEBP files, use Images to PDF. It is designed for mixed-format batches.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can one PDF contain both JPG and PNG pages?",
        answer:
          "Yes. Use Images to PDF when you want mixed image formats in one PDF.",
      },
    ],
    relatedLinks: [
      jpgToolLink,
      {
        label: "PNG to PDF",
        href: "/png-to-pdf",
        text: "Convert PNG screenshots and transparent images.",
      },
      ...imageLinks,
    ],
  }),
  guide({
    slug: "jpg-to-pdf-vs-word",
    title: "JPG to PDF vs Word: Which Format Should You Use? | LiftPDF",
    description:
      "Compare JPG to PDF and Word workflows for photos, scans, document submissions, editing and sharing.",
    h1: "JPG to PDF vs Word",
    intent: "comparison",
    primaryKeyword: "jpg to pdf vs word",
    secondaryKeywords: ["image to pdf or word", "jpg document format", "pdf vs docx for images"],
    summary:
      "Use PDF when you need a stable document. Use Word when you need editable text and layout, not just image pages.",
    ctaLabel: "Create image PDF",
    image: afterImage,
    quickSteps: [
      "Use JPG to PDF for scanned or photographed pages.",
      "Use Word when text must remain editable.",
      "Do not expect JPG to PDF to create editable text.",
      "Use OCR only when scanned text must become selectable.",
    ],
    sections: [
      {
        heading: "PDF is better for submission and printing",
        body: [
          "A PDF keeps page order, dimensions and viewing behavior more consistent. That makes it a better choice for forms, receipts, homework, photos and official uploads.",
        ],
      },
      {
        heading: "Word is better for editing",
        body: [
          "Word is the right format when you need paragraphs, headings, tables and editable text. A JPG converted to PDF remains an image-based page unless OCR is applied later.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Does JPG to PDF create editable text?",
        answer:
          "No. It creates PDF pages from images. OCR is required if scanned text must become selectable.",
      },
    ],
  }),
  guide({
    slug: "jpg-to-pdf-vs-smallpdf",
    title: "JPG to PDF: LiftPDF vs Smallpdf | LiftPDF",
    description:
      "Compare LiftPDF and Smallpdf for JPG to PDF conversion, including workflow simplicity, privacy and layout control.",
    h1: "JPG to PDF: LiftPDF vs Smallpdf",
    intent: "comparison",
    primaryKeyword: "jpg to pdf vs smallpdf",
    secondaryKeywords: ["smallpdf jpg to pdf alternative", "liftpdf vs smallpdf", "jpg to pdf privacy"],
    summary:
      "Smallpdf is a broad PDF platform. LiftPDF focuses on a fast browser-based JPG to PDF workflow with clear preview and simple layout controls.",
    ctaLabel: "Try LiftPDF JPG to PDF",
    image: workflowImage,
    quickSteps: [
      "Use Smallpdf if you need its broader platform.",
      "Use LiftPDF for a focused browser-based JPG to PDF workflow.",
      "Check preview and layout before export.",
      "Download the PDF.",
    ],
    sections: [
      {
        heading: "Where Smallpdf is strong",
        body: [
          "Smallpdf has a mature product ecosystem and many PDF workflows around conversion, editing and business document handling.",
        ],
      },
      {
        heading: "Where LiftPDF is focused",
        body: [
          "LiftPDF is designed for direct tool workflows. For JPG to PDF, the emphasis is preview, layout settings and private browser processing for supported files.",
        ],
      },
      qualitySection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Is LiftPDF trying to copy Smallpdf?",
        answer:
          "No. LiftPDF uses its own browser-first workflow and focuses on simple PDF tasks without copying competitor content or design.",
      },
    ],
  }),
  guide({
    slug: "jpg-to-pdf-vs-adobe",
    title: "JPG to PDF: LiftPDF vs Adobe Acrobat | LiftPDF",
    description:
      "Compare LiftPDF and Adobe Acrobat for JPG to PDF conversion, including advanced workflows, privacy and everyday use.",
    h1: "JPG to PDF: LiftPDF vs Adobe Acrobat",
    intent: "comparison",
    primaryKeyword: "jpg to pdf vs adobe",
    secondaryKeywords: ["adobe jpg to pdf alternative", "convert jpg without acrobat", "liftpdf vs adobe"],
    summary:
      "Adobe Acrobat is a professional PDF platform. LiftPDF is a focused browser tool for quick JPG to PDF conversion.",
    ctaLabel: "Convert with LiftPDF",
    image: afterImage,
    quickSteps: [
      "Use Adobe for advanced PDF workflows.",
      "Use LiftPDF for fast JPG to PDF conversion.",
      "Choose page settings.",
      "Download the PDF.",
    ],
    sections: [
      {
        heading: "Where Adobe is stronger",
        body: [
          "Adobe is stronger for advanced editing, signatures, redaction, enterprise controls and deep PDF management. It is a complete PDF platform.",
        ],
      },
      {
        heading: "Where LiftPDF is simpler",
        body: [
          "For everyday JPG to PDF conversion, LiftPDF keeps the path short: add images, preview, adjust layout and download. It is designed for speed and privacy-oriented browser processing.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Should I use Adobe or LiftPDF?",
        answer:
          "Use Adobe for advanced document workflows. Use LiftPDF when you only need a quick JPG to PDF conversion in the browser.",
      },
    ],
  }),
  guide({
    slug: "jpg-to-pdf-faq",
    title: "JPG to PDF FAQ | LiftPDF",
    description:
      "Answers to common JPG to PDF questions about quality, file size, multiple images, mobile support, privacy and layout settings.",
    h1: "JPG to PDF FAQ",
    intent: "faq",
    primaryKeyword: "jpg to pdf faq",
    secondaryKeywords: ["jpg to pdf questions", "jpeg to pdf help", "image to pdf faq"],
    summary:
      "This FAQ covers the questions people usually have before converting JPG images into PDF documents.",
    ctaLabel: "Open JPG to PDF",
    image: previewImage,
    quickSteps: [
      "Choose JPG images.",
      "Preview the PDF layout.",
      "Adjust settings if needed.",
      "Convert and download.",
    ],
    sections: [
      {
        heading: "Before you convert",
        body: [
          "Use the original JPG files when possible, remove duplicates, and put pages in the order you want the reader to see them.",
          "If your source folder contains PNG or WEBP files too, use Images to PDF instead of the dedicated JPG page.",
        ],
      },
      {
        heading: "After you convert",
        body: [
          "Open the PDF once before sending it. Confirm the order, page size and visible image area. If the file is too large, use Compress PDF on the exported document.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can I convert one JPG only?",
        answer:
          "Yes. A single JPG becomes a one-page PDF.",
      },
      {
        question: "Can I convert screenshots?",
        answer:
          "Yes, if they are JPG files. For PNG screenshots, use PNG to PDF.",
      },
      {
        question: "Can I add margins?",
        answer:
          "Yes. Choose no margin, small margin or large margin depending on the final document.",
      },
      {
        question: "Can I make an A4 PDF from JPG?",
        answer:
          "Yes. Choose A4 as the page size before conversion.",
      },
      {
        question: "Can I make a landscape PDF?",
        answer:
          "Yes. Choose Landscape orientation, or keep Auto if you want LiftPDF to follow the image shape.",
      },
      {
        question: "What should I do if the PDF is too large?",
        answer:
          "Remove unnecessary images or use Compress PDF after conversion.",
      },
      {
        question: "Does JPG to PDF include OCR?",
        answer:
          "No. JPG to PDF creates image-based PDF pages. OCR is a separate workflow.",
      },
    ],
  }),
] satisfies JpgToPdfGuide[];

export function getJpgToPdfGuide(slug: string) {
  return jpgToPdfGuides.find((guideItem) => guideItem.slug === slug);
}
