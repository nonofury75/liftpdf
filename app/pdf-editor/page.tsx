import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "PDF Editor Online | LiftPDF";
const description =
  "Edit PDF files online for free with browser-based tools for compression, rotation, page numbers and watermarks.";

export const metadata: Metadata = {
  title: { absolute: `${title} - Free PDF Editing Tools` },
  description,
  alternates: { canonical: "/pdf-editor" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/pdf-editor`,
    images: [
      {
        url: "/images/seo/categories/edit-og.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF PDF editor tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/categories/edit-og.svg"],
  },
};

export default function PdfEditorPage() {
  return (
    <CategoryPageShell
      title={title}
      description={description}
      canonical="/pdf-editor"
      category="Edit"
      seoTitle="Edit PDFs directly in your browser"
      seoText="LiftPDF editing tools cover focused PDF changes: rotate pages, add page numbers, apply watermarks and rebuild files with safe compression. The hub explains which edit tool to use and what requires a more advanced PDF editor."
      intro={{
        eyebrow: "PDF editor hub",
        title: "Make focused PDF edits without opening a heavy editor",
        paragraphs: [
          "PDF editing is a broad phrase. Some users need to rewrite text, while others simply need to rotate pages, add numbering, place a watermark or reduce file size before sharing.",
          "LiftPDF focuses on the second group: clear browser-based tools for common PDF finishing tasks. The page is explicit about what the tools do so users do not expect fake text editing or OCR.",
        ],
      }}
      chooseTools={{
        title: "How to choose the right PDF editing tool",
        description:
          "Choose the smallest edit that solves the problem. This keeps the workflow easier and avoids changing parts of the PDF that should stay untouched.",
        items: [
          {
            tool: "Rotate PDF",
            href: "/rotate-pdf",
            useWhen:
              "Pages are sideways, upside down or mixed between portrait and landscape orientation.",
          },
          {
            tool: "Add Page Numbers",
            href: "/add-page-numbers",
            useWhen:
              "A report, packet or contract needs readable page numbering before sharing or printing.",
          },
          {
            tool: "Watermark PDF",
            href: "/watermark-pdf",
            useWhen:
              "Every page should show a text or image watermark for drafts, ownership, review or branding.",
          },
          {
            tool: "Compress PDF",
            href: "/compress-pdf",
            useWhen:
              "The file is ready but too large for email, storage or a document portal.",
            avoidWhen:
              "You expect aggressive image downsampling. LiftPDF uses safe browser-side compression.",
          },
        ],
      }}
      commonTasks={{
        title: "Common PDF editing tasks",
        tasks: [
          {
            title: "Fix page direction",
            text: "Rotate one page or every page while preserving the document content.",
            href: "/rotate-pdf",
          },
          {
            title: "Add visible page numbers",
            text: "Choose position, format, size and color for document numbering.",
            href: "/add-page-numbers",
          },
          {
            title: "Apply a watermark",
            text: "Place text or an image watermark with opacity, rotation and repeat options.",
            href: "/watermark-pdf",
          },
          {
            title: "Reduce file size safely",
            text: "Use QPDF WASM compression modes and compare the real output size.",
            href: "/compress-pdf",
          },
        ],
      }}
      workflow={{
        title: "A clean PDF editing workflow",
        steps: [
          {
            title: "Finish the structure first",
            text: "Merge, delete or reorder pages before adding numbers or watermarks.",
          },
          {
            title: "Apply one edit at a time",
            text: "Use the focused tool that matches the change so the result stays predictable.",
          },
          {
            title: "Review the final PDF",
            text: "Open the downloaded file and confirm rotation, numbering, watermark or size before sending.",
          },
        ],
      }}
      screenshots={{
        title: "Real editing previews",
        description:
          "LiftPDF edit tools show previews and settings before generating the final PDF.",
        images: [
          {
            src: "/images/seo/merge-pdf/merge-pdf-before.webp",
            alt: "LiftPDF PDF workflow preview before export",
            width: 1280,
            height: 860,
            label: "Preview before changing a PDF",
          },
          {
            src: "/images/seo/merge-pdf/merge-pdf-after.webp",
            alt: "LiftPDF PDF success state after export",
            width: 1280,
            height: 860,
            label: "Edited PDF ready to download",
          },
        ],
      }}
      guides={{
        title: "Editing guides and related workflows",
        links: [
          {
            label: "Why is my merged PDF too large?",
            href: "/guides/why-is-my-merged-pdf-too-large",
            text: "Understand when compression helps after combining files.",
          },
          {
            label: "How to keep image quality in PDF",
            href: "/guides/how-to-keep-original-image-quality",
            text: "Choose layout settings that avoid unnecessary image scaling.",
          },
          {
            label: "Extract pages before editing",
            href: "/guides/how-to-extract-pages-from-pdf",
            text: "Save only the pages that should receive a later edit.",
          },
        ],
      }}
      faq={[
        {
          question: "Can I edit PDFs for free?",
          answer:
            "Yes. Available LiftPDF editor tools are free and run in your browser.",
        },
        {
          question: "Do editor tools preserve PDF content?",
          answer:
            "The tools are designed to preserve page content and dimensions while applying the selected edit.",
        },
        {
          question: "Can LiftPDF edit existing PDF text?",
          answer:
            "Not yet. LiftPDF does not claim full text editing. The current editor hub focuses on rotation, page numbers, watermarks and safe compression.",
        },
        {
          question: "Should I organize pages before editing?",
          answer:
            "Usually yes. Merge, delete, extract or reorder pages first, then apply page numbers, watermarks or compression to the final document.",
        },
        {
          question: "Are editor tools processed locally?",
          answer:
            "Available LiftPDF editor tools are designed to run in the browser for supported files.",
        },
      ]}
    />
  );
}
