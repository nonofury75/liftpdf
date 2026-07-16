import { extractPagesGuides } from "@/data/extract-pages-cluster";
import type { GuideFaqItem, GuideLink } from "@/data/extract-pages-cluster";
import { redirectedGuideSlugs } from "@/data/editorial-depth";
import { foundationGuides } from "@/data/foundation-guides";
import { jpgToPdfGuides } from "@/data/jpg-to-pdf-cluster";
import { mergePdfGuides } from "@/data/merge-pdf-cluster";

export type LearningGuide = {
  slug: string;
  title: string;
  description: string;
  href: string;
  category: LearningTopicKey;
  categoryLabel: string;
  type: "Guide" | "Problem" | "Comparison" | "FAQ" | "Foundation";
  readingMinutes: number;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  tool?: {
    label: string;
    href: string;
  };
  publishedAt: string;
};

export type LearningTopicKey =
  | "pdf-basics"
  | "convert-pdf"
  | "organize-pdf"
  | "edit-pdf"
  | "pdf-security"
  | "pdf-images"
  | "troubleshooting"
  | "comparisons";

export type LearningTopic = {
  slug: LearningTopicKey;
  title: string;
  eyebrow: string;
  description: string;
  intro: string;
  href: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  startGuideSlug: string;
  guideSlugs: string[];
  toolLinks: GuideLink[];
  tasks: string[];
  commonMistakes: string[];
  faq: GuideFaqItem[];
  relatedTopics: LearningTopicKey[];
};

const topicImages = {
  "pdf-basics": {
    src: "/images/learn/pdf-basics.webp",
    alt: "Illustrated PDF basics workflow with pages and document blocks",
    width: 1200,
    height: 720,
  },
  "convert-pdf": {
    src: "/images/learn/convert-pdf.webp",
    alt: "PDF conversion workflow showing files changing formats",
    width: 1200,
    height: 720,
  },
  "organize-pdf": {
    src: "/images/learn/organize-pdf.webp",
    alt: "Organize PDF visual with pages being merged and reordered",
    width: 1200,
    height: 720,
  },
  "edit-pdf": {
    src: "/images/learn/edit-pdf.webp",
    alt: "PDF editing visual with page numbers watermark and rotation",
    width: 1200,
    height: 720,
  },
  "pdf-security": {
    src: "/images/learn/pdf-security.webp",
    alt: "PDF security visual with password protection and encryption",
    width: 1200,
    height: 720,
  },
  "pdf-images": {
    src: "/images/learn/pdf-images.webp",
    alt: "PDF image formats visual with JPG PNG and PDF pages",
    width: 1200,
    height: 720,
  },
  troubleshooting: {
    src: "/images/learn/scanned-vs-searchable-pdf.webp",
    alt: "Troubleshooting visual comparing scanned and searchable PDFs",
    width: 1200,
    height: 720,
  },
  comparisons: {
    src: "/images/learn/jpg-vs-png.webp",
    alt: "Comparison visual with image and PDF format cards",
    width: 1200,
    height: 720,
  },
} satisfies Record<LearningTopicKey, { src: string; alt: string; width: number; height: number }>;

const organizeToolLinks = [
  {
    label: "Merge PDF",
    href: "/merge-pdf",
    text: "Combine PDFs into one ordered document.",
  },
  {
    label: "Split PDF",
    href: "/split-pdf",
    text: "Extract ranges or split every page into separate files.",
  },
  {
    label: "Delete Pages",
    href: "/delete-pages",
    text: "Remove pages you no longer need.",
  },
  {
    label: "Extract Pages",
    href: "/extract-pages",
    text: "Save selected pages as a new PDF.",
  },
  {
    label: "Reorder Pages",
    href: "/reorder-pages",
    text: "Move pages into the right sequence.",
  },
] satisfies GuideLink[];

const imageToolLinks = [
  {
    label: "JPG to PDF",
    href: "/jpg-to-pdf",
    text: "Convert JPG images into a clean PDF.",
  },
  {
    label: "PNG to PDF",
    href: "/png-to-pdf",
    text: "Convert PNG screenshots or graphics into PDF.",
  },
  {
    label: "Images to PDF",
    href: "/images-to-pdf",
    text: "Combine JPG, PNG and WEBP images in one PDF.",
  },
  {
    label: "PDF to JPG",
    href: "/pdf-to-jpg",
    text: "Export PDF pages as JPG images.",
  },
] satisfies GuideLink[];

export const learningTopics = [
  {
    slug: "pdf-basics",
    title: "PDF Basics",
    eyebrow: "Start here",
    description:
      "Understand how PDF files work, what they preserve and when a PDF task needs conversion, compression or OCR.",
    intro:
      "PDFs are designed to keep documents consistent across devices, but that also means some tasks require the right workflow. This hub explains the core terms before you choose a tool.",
    href: "/learn/pdf-basics",
    image: topicImages["pdf-basics"],
    startGuideSlug: "what-is-a-pdf",
    guideSlugs: [
      "what-is-a-pdf",
      "what-is-pdf-compression",
      "why-is-my-pdf-too-large",
      "how-to-compress-pdf-without-losing-quality",
      "compress-pdf-for-email",
      "pdf-compression-vs-optimization",
      "scanned-pdf-vs-searchable-pdf",
      "how-to-tell-if-pdf-is-scanned",
      "what-is-browser-based-pdf-processing",
      "how-to-prepare-a-pdf-for-online-submission",
    ],
    toolLinks: [
      { label: "All PDF Tools", href: "/pdf-tools", text: "Browse the full LiftPDF tool suite." },
      { label: "PDF Glossary", href: "/pdf-glossary", text: "Look up common PDF terms." },
    ],
    tasks: [
      "Learn when a PDF is better than an image or Word document.",
      "Understand why scanned PDFs behave differently from searchable PDFs.",
      "Choose the right first tool without changing the file unnecessarily.",
    ],
    commonMistakes: [
      "Assuming every PDF contains selectable text.",
      "Using image conversion when page extraction would preserve quality better.",
      "Compressing repeatedly instead of checking what makes the file large.",
    ],
    faq: [
      {
        question: "Is PDF a document format or an image format?",
        answer:
          "PDF is a document format. A PDF can contain text, vector graphics, images, forms and metadata.",
      },
      {
        question: "Where should I start if I am new to PDFs?",
        answer:
          "Start with What is a PDF?, then use the glossary when a tool mentions compression, encryption, OCR or page ranges.",
      },
    ],
    relatedTopics: ["convert-pdf", "organize-pdf", "troubleshooting"],
  },
  {
    slug: "convert-pdf",
    title: "Convert PDF",
    eyebrow: "Format workflows",
    description:
      "Convert between PDF, images and text while keeping the workflow honest about quality and OCR limits.",
    intro:
      "Conversion is useful when the destination format matters: images for previews, text for copying, or PDF for sharing. This hub helps you pick the least destructive path.",
    href: "/learn/convert-pdf",
    image: topicImages["convert-pdf"],
    startGuideSlug: "how-to-convert-jpg-to-pdf",
    guideSlugs: [
      "how-to-convert-jpg-to-pdf",
      "jpg-to-pdf-online",
      "how-to-convert-jpg-to-pdf-without-losing-quality",
      "how-to-turn-phone-photos-into-a-pdf",
      "how-to-convert-pdf-to-jpg",
      "how-to-convert-pdf-to-png",
      "how-to-copy-text-from-pdf",
      "what-is-browser-based-pdf-processing",
    ],
    toolLinks: [
      { label: "JPG to PDF", href: "/jpg-to-pdf", text: "Create a PDF from JPG images." },
      { label: "PDF to JPG", href: "/pdf-to-jpg", text: "Turn PDF pages into JPG files." },
      { label: "PDF to Text", href: "/pdf-to-text", text: "Extract selectable text from a PDF." },
    ],
    tasks: [
      "Create PDFs from photos, receipts and scans.",
      "Export PDF pages as images for previews or sharing.",
      "Extract existing text without pretending to perform OCR.",
    ],
    commonMistakes: [
      "Expecting OCR from a text extractor.",
      "Using JPG when PNG is better for screenshots.",
      "Choosing Fill when preserving the complete image matters.",
    ],
    faq: [
      {
        question: "Does conversion always preserve quality?",
        answer:
          "Not always. PDF page extraction preserves the PDF page, while image conversion depends on output format and rendering quality.",
      },
      {
        question: "Can LiftPDF convert scanned PDFs to text?",
        answer:
          "PDF to Text extracts selectable text only. Scanned PDFs require OCR, which is not part of that tool.",
      },
    ],
    relatedTopics: ["pdf-images", "pdf-basics", "troubleshooting"],
  },
  {
    slug: "organize-pdf",
    title: "Organize PDF",
    eyebrow: "Pages and structure",
    description:
      "Merge, split, delete, extract and reorder PDF pages without changing the document more than necessary.",
    intro:
      "Organizing a PDF is usually about page structure. This hub explains when to combine files, when to extract a clean copy and when deleting or reordering pages is the safer choice.",
    href: "/learn/organize-pdf",
    image: topicImages["organize-pdf"],
    startGuideSlug: "how-to-merge-pdf",
    guideSlugs: [
      "how-to-merge-pdf",
      "merge-multiple-pdf-files",
      "how-to-combine-scanned-documents-into-one-pdf",
      "how-to-organize-pdf-pages-before-sending",
      "how-to-extract-pages-from-pdf",
      "extract-multiple-pages-from-pdf",
      "merge-pdf-vs-combine-pdf",
    ],
    toolLinks: organizeToolLinks,
    tasks: [
      "Combine related documents into a single PDF.",
      "Extract only the pages needed for sharing.",
      "Delete unnecessary pages before sending a file.",
      "Reorder pages after scanning or collecting documents.",
    ],
    commonMistakes: [
      "Deleting pages when extraction would preserve the original file.",
      "Merging files before checking page order.",
      "Trying to edit a password-protected PDF before unlocking it.",
    ],
    faq: [
      {
        question: "Should I use Split PDF or Extract Pages?",
        answer:
          "Use Extract Pages when you want selected pages in one new PDF. Use Split PDF when you need ranges or separate files.",
      },
      {
        question: "Can I reorganize a PDF without uploading it?",
        answer:
          "LiftPDF organize tools are designed to work locally in your browser for supported files.",
      },
    ],
    relatedTopics: ["pdf-security", "troubleshooting", "pdf-basics"],
  },
  {
    slug: "edit-pdf",
    title: "Edit PDF",
    eyebrow: "Simple document changes",
    description:
      "Learn practical PDF edits such as rotating pages, adding page numbers, watermarking and reducing file size.",
    intro:
      "PDF editing should stay focused. LiftPDF avoids fake advanced editing and concentrates on changes that can be applied reliably in the browser.",
    href: "/learn/edit-pdf",
    image: topicImages["edit-pdf"],
    startGuideSlug: "what-is-pdf-compression",
    guideSlugs: [
      "what-is-pdf-compression",
      "how-to-reduce-pdf-file-size-for-email",
      "how-to-compress-pdf-without-losing-quality",
      "compress-pdf-for-email",
      "reduce-scanned-pdf-size",
      "pdf-compression-vs-optimization",
      "why-is-my-merged-pdf-too-large",
      "why-is-my-pdf-too-large",
      "how-to-keep-original-image-quality",
    ],
    toolLinks: [
      { label: "Compress PDF", href: "/compress-pdf", text: "Reduce PDF size when safe compression is possible." },
      { label: "Rotate PDF", href: "/rotate-pdf", text: "Rotate pages without rebuilding the whole workflow." },
      { label: "Watermark PDF", href: "/watermark-pdf", text: "Add a visible text or image watermark." },
      { label: "Add Page Numbers", href: "/add-page-numbers", text: "Number pages with clear formats and positions." },
    ],
    tasks: [
      "Fix rotated scans or pages.",
      "Add page numbers before sharing a report.",
      "Watermark drafts or review copies.",
      "Reduce file size before email upload limits.",
    ],
    commonMistakes: [
      "Expecting compression to shrink already optimized PDFs.",
      "Using watermarks as a security feature.",
      "Adding page numbers before the page order is final.",
    ],
    faq: [
      {
        question: "Can LiftPDF edit the text inside a PDF?",
        answer:
          "LiftPDF V1 focuses on reliable browser-based operations. It does not offer full text editing inside PDF content.",
      },
      {
        question: "Should I reorder pages before adding numbers?",
        answer:
          "Yes. Finalize page order first, then add page numbers so the numbering matches the finished document.",
      },
    ],
    relatedTopics: ["organize-pdf", "pdf-security", "troubleshooting"],
  },
  {
    slug: "pdf-security",
    title: "PDF Security",
    eyebrow: "Passwords and privacy",
    description:
      "Understand password-protected PDFs, encryption, unlocking with a known password and browser-based privacy.",
    intro:
      "Security tools must be honest. LiftPDF protects PDFs with real encryption and unlocks only when the correct password is provided.",
    href: "/learn/pdf-security",
    image: topicImages["pdf-security"],
    startGuideSlug: "what-is-a-password-protected-pdf",
    guideSlugs: [
      "what-is-a-password-protected-pdf",
      "why-a-pdf-is-password-protected",
      "protect-pdf-before-sending",
      "unlock-pdf-with-known-password",
      "password-protected-pdf-not-opening",
      "what-is-browser-based-pdf-processing",
      "extract-pages-from-password-protected-pdf",
    ],
    toolLinks: [
      { label: "Protect PDF", href: "/protect-pdf", text: "Add a real opening password to a PDF." },
      { label: "Unlock PDF", href: "/unlock-pdf", text: "Remove encryption when you know the password." },
      { label: "Privacy", href: "/privacy", text: "Read how LiftPDF handles privacy." },
      { label: "Security", href: "/security", text: "Learn about browser processing and QPDF WASM." },
    ],
    tasks: [
      "Add password protection before sending a sensitive file.",
      "Unlock a document you own and know the password for.",
      "Understand why protected PDFs can block other workflows.",
    ],
    commonMistakes: [
      "Thinking a watermark encrypts a PDF.",
      "Expecting password recovery without the password.",
      "Uploading sensitive documents to tools that require server processing.",
    ],
    faq: [
      {
        question: "Can LiftPDF recover a forgotten PDF password?",
        answer:
          "No. Unlock PDF requires the correct password. It does not bypass or recover unknown passwords.",
      },
      {
        question: "Does Protect PDF really encrypt the file?",
        answer:
          "Yes. The Protect PDF tool uses QPDF WebAssembly for real PDF encryption rather than a visual lock.",
      },
    ],
    relatedTopics: ["pdf-basics", "troubleshooting", "organize-pdf"],
  },
  {
    slug: "pdf-images",
    title: "PDF and Images",
    eyebrow: "JPG, PNG and page images",
    description:
      "Learn when to use JPG, PNG, PDF pages and image conversion without losing the point of the original file.",
    intro:
      "Image workflows often look simple until quality, margins, transparency or file size matter. This hub explains the tradeoffs before conversion.",
    href: "/learn/pdf-images",
    image: topicImages["pdf-images"],
    startGuideSlug: "jpg-vs-png",
    guideSlugs: [
      "jpg-vs-png",
      "jpg-vs-jpeg",
      "png-vs-pdf",
      "pdf-vs-jpg",
      "pdf-vs-png",
      "pdf-to-jpg-vs-pdf-to-png",
      "how-to-convert-pdf-to-jpg",
      "how-to-convert-pdf-to-png",
      "why-are-pdf-to-jpg-images-blurry",
      "how-to-convert-multiple-jpg-to-pdf",
      "how-to-keep-pdf-images-sharp",
      "why-is-my-jpg-blurry-after-pdf",
    ],
    toolLinks: imageToolLinks,
    tasks: [
      "Build PDFs from photos or screenshots.",
      "Choose JPG or PNG based on image content.",
      "Convert PDF pages back to images for previews.",
    ],
    commonMistakes: [
      "Using JPG for screenshots with small text.",
      "Using PNG for photos when file size matters.",
      "Confusing page margins with ratio bands in Fit mode.",
    ],
    faq: [
      {
        question: "Is JPG or PNG better for PDF conversion?",
        answer:
          "JPG is usually better for photos. PNG is better for screenshots, transparent graphics and sharp interface images.",
      },
      {
        question: "Can one PDF contain both JPG and PNG images?",
        answer:
          "Yes. Use Images to PDF when you want to combine multiple image formats into one PDF.",
      },
    ],
    relatedTopics: ["convert-pdf", "pdf-basics", "troubleshooting"],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    eyebrow: "Fix common PDF issues",
    description:
      "Find practical explanations for failed conversions, protected PDFs, blank pages, huge files and scanned documents.",
    intro:
      "Most PDF failures have a concrete cause: encryption, damaged files, browser memory, scanned pages or the wrong output format. Start here when a workflow does not behave as expected.",
    href: "/learn/troubleshooting",
    image: topicImages.troubleshooting,
    startGuideSlug: "why-cant-i-merge-pdf-files",
    guideSlugs: [
      "why-cant-i-merge-pdf-files",
      "why-does-merge-pdf-fail",
      "why-cant-i-merge-protected-pdfs",
      "why-cant-i-convert-jpg-to-pdf",
      "why-cant-i-copy-text-from-pdf",
      "why-are-pdf-to-jpg-images-blurry",
      "password-protected-pdf-not-opening",
      "why-pdf-opens-blank",
      "why-is-my-pdf-too-large",
      "reduce-scanned-pdf-size",
      "scanned-pdf-vs-searchable-pdf",
    ],
    toolLinks: [
      { label: "Help Center", href: "/help", text: "Browse common support answers." },
      { label: "Unlock PDF", href: "/unlock-pdf", text: "Unlock protected PDFs when you know the password." },
      { label: "PDF to Text", href: "/pdf-to-text", text: "Check whether a PDF contains selectable text." },
    ],
    tasks: [
      "Diagnose failed merges or conversions.",
      "Understand why a PDF cannot be edited before unlocking.",
      "Tell scanned files apart from searchable PDFs.",
    ],
    commonMistakes: [
      "Retrying the same damaged file without opening it first.",
      "Assuming a browser memory limit is a server error.",
      "Expecting text extraction from image-only pages.",
    ],
    faq: [
      {
        question: "Why does a PDF tool say my file is invalid?",
        answer:
          "The PDF may be damaged, encrypted, empty or built in a way the browser parser cannot read safely.",
      },
      {
        question: "What should I check first?",
        answer:
          "Open the file locally, confirm whether it is password-protected, then choose the smallest workflow that matches your goal.",
      },
    ],
    relatedTopics: ["pdf-security", "pdf-basics", "convert-pdf"],
  },
  {
    slug: "comparisons",
    title: "Comparisons",
    eyebrow: "Choose the right format or workflow",
    description:
      "Compare formats, tools and workflows so you do not convert or edit more than necessary.",
    intro:
      "The best PDF workflow is often the one that changes the least. Comparisons help you decide between similar options before you process a file.",
    href: "/learn/comparisons",
    image: topicImages.comparisons,
    startGuideSlug: "jpg-vs-png",
    guideSlugs: [
      "jpg-vs-png",
      "jpg-vs-jpeg",
      "png-vs-pdf",
      "pdf-vs-jpg",
      "pdf-vs-png",
      "pdf-to-jpg-vs-pdf-to-png",
      "pdf-compression-vs-optimization",
      "merge-pdf-vs-combine-pdf",
      "jpg-to-pdf-vs-word",
    ],
    toolLinks: [
      { label: "PDF Tools", href: "/pdf-tools", text: "Compare available tool categories." },
      { label: "PDF Image Tools", href: "/pdf-image-tools", text: "Choose image and PDF workflows." },
      { label: "Organize PDF", href: "/organize-pdf", text: "Compare page organization tools." },
    ],
    tasks: [
      "Choose between JPG, JPEG, PNG and PDF.",
      "Understand merge vs combine terminology.",
      "Decide when Word is the wrong output format.",
    ],
    commonMistakes: [
      "Creating duplicate files when one browser workflow is enough.",
      "Choosing a competitor workflow because the tool name sounds broader.",
      "Using a format comparison as a substitute for checking the actual file.",
    ],
    faq: [
      {
        question: "Are JPG and JPEG different formats?",
        answer:
          "No. JPG and JPEG usually refer to the same image format; the shorter extension exists for older filename conventions.",
      },
      {
        question: "Is merge PDF the same as combine PDF?",
        answer:
          "In most search and tool contexts, both phrases mean putting multiple PDFs into one ordered PDF.",
      },
    ],
    relatedTopics: ["pdf-images", "organize-pdf", "convert-pdf"],
  },
] satisfies LearningTopic[];

const topicLabelBySlug = new Map(
  learningTopics.map((topic) => [topic.slug, topic.title] as const),
);

function inferCategory(slug: string, intent?: string): LearningTopicKey {
  if (
    slug.includes("jpg") ||
    slug.includes("png") ||
    slug.includes("image-quality")
  ) {
    return intent === "comparison" ? "comparisons" : "pdf-images";
  }

  if (slug.includes("protected") || slug.includes("password")) {
    return "pdf-security";
  }

  if (intent === "comparison") {
    return "comparisons";
  }

  if (intent === "problem" || slug.startsWith("why-")) {
    return "troubleshooting";
  }

  if (slug.includes("merge") || slug.includes("extract")) {
    return "organize-pdf";
  }

  return "pdf-basics";
}

function readingMinutesFromSections(sections: { body: string[]; list?: string[] }[]) {
  const words = sections
    .flatMap((section) => [...section.body, ...(section.list || [])])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(4, Math.ceil(words / 210));
}

function toGuide(
  guide: (typeof extractPagesGuides)[number] | (typeof mergePdfGuides)[number] | (typeof jpgToPdfGuides)[number],
  tool: { label: string; href: string },
): LearningGuide {
  const category = inferCategory(guide.slug, guide.intent);

  return {
    slug: guide.slug,
    title: guide.h1,
    description: guide.summary,
    href: guide.canonical,
    category,
    categoryLabel: topicLabelBySlug.get(category) || "PDF Guides",
    type:
      guide.intent === "problem"
        ? "Problem"
        : guide.intent === "comparison"
          ? "Comparison"
          : guide.intent === "faq"
            ? "FAQ"
            : "Guide",
    readingMinutes: readingMinutesFromSections(guide.sections),
    image: guide.image,
    tool,
    publishedAt: "2026-07-12",
  };
}

export const learningGuides = [
  ...foundationGuides.map((guide) => {
    const category = (
      guide.topic === "PDF Basics"
        ? "pdf-basics"
        : guide.topic === "Convert PDF"
          ? "convert-pdf"
          : guide.topic === "Organize PDF"
            ? "organize-pdf"
          : guide.topic === "PDF Security"
            ? "pdf-security"
            : guide.topic === "Troubleshooting"
              ? "troubleshooting"
              : guide.topic === "Comparisons"
                ? "comparisons"
                : "pdf-images"
    ) satisfies LearningTopicKey;

    return {
      slug: guide.slug,
      title: guide.h1,
      description: guide.summary,
      href: guide.canonical,
      category,
      categoryLabel: topicLabelBySlug.get(category) || guide.topic,
      type: "Foundation",
      readingMinutes: guide.readingMinutes,
      image: guide.image,
      tool: undefined,
      publishedAt: guide.publishedAt,
    } satisfies LearningGuide;
  }),
  ...extractPagesGuides.map((guide) =>
    toGuide(guide, { label: "Extract Pages", href: "/extract-pages" }),
  ),
  ...mergePdfGuides.map((guide) =>
    toGuide(guide, { label: "Merge PDF", href: "/merge-pdf" }),
  ),
  ...jpgToPdfGuides.map((guide) =>
    toGuide(guide, { label: "JPG to PDF", href: "/jpg-to-pdf" }),
  ),
]
  .filter((guide) => !redirectedGuideSlugs.has(guide.slug))
  .sort((a, b) => a.title.localeCompare(b.title));

export const featuredLearningGuides = [
  "how-to-extract-pages-from-pdf",
  "how-to-merge-pdf",
  "how-to-convert-jpg-to-pdf",
  "what-is-browser-based-pdf-processing",
]
  .map((slug) => learningGuides.find((guide) => guide.slug === slug))
  .filter((guide): guide is LearningGuide => Boolean(guide));

export const popularHowToGuides = [
  "how-to-merge-pdf",
  "merge-multiple-pdf-files",
  "how-to-prepare-a-pdf-for-online-submission",
  "how-to-compress-pdf-without-losing-quality",
  "how-to-convert-pdf-to-jpg",
  "how-to-copy-text-from-pdf",
  "how-to-convert-multiple-jpg-to-pdf",
  "how-to-turn-phone-photos-into-a-pdf",
  "extract-multiple-pages-from-pdf",
  "what-is-a-password-protected-pdf",
]
  .map((slug) => learningGuides.find((guide) => guide.slug === slug))
  .filter((guide): guide is LearningGuide => Boolean(guide));

export const commonProblemGuides = [
  "why-cant-i-merge-pdf-files",
  "why-cant-i-merge-protected-pdfs",
  "why-is-my-pdf-too-large",
  "why-cant-i-copy-text-from-pdf",
  "password-protected-pdf-not-opening",
  "why-is-my-jpg-blurry-after-pdf",
  "why-are-pdf-to-jpg-images-blurry",
  "why-pdf-opens-blank",
  "why-is-my-pdf-too-large-after-converting-jpg",
  "scanned-pdf-vs-searchable-pdf",
]
  .map((slug) => learningGuides.find((guide) => guide.slug === slug))
  .filter((guide): guide is LearningGuide => Boolean(guide));

export function getLearningTopic(slug: string) {
  return learningTopics.find((topic) => topic.slug === slug);
}

export function getLearningGuidesForTopic(topic: LearningTopic) {
  return topic.guideSlugs
    .map((slug) => learningGuides.find((guide) => guide.slug === slug))
    .filter((guide): guide is LearningGuide => Boolean(guide));
}
