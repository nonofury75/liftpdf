import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "Organize PDF Online | LiftPDF";
const description =
  "Organize PDF pages online with browser-based tools to merge, split, delete, extract and reorder PDF files.";

export const metadata: Metadata = {
  title: { absolute: `${title} - Free PDF Organizer` },
  description,
  alternates: { canonical: "/organize-pdf" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/organize-pdf`,
    images: [
      {
        url: "/images/seo/categories/organize-og.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF organize PDF tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/categories/organize-og.svg"],
  },
};

export default function OrganizePdfPage() {
  return (
    <CategoryPageShell
      title={title}
      description={description}
      canonical="/organize-pdf"
      category="Organize"
      seoTitle="Organize PDF pages with a consistent workflow"
      seoText="LiftPDF organizer tools help you combine files, split documents, remove pages, save selected pages and rearrange page order. Use this hub to choose the right workflow before changing a document."
      intro={{
        eyebrow: "Organize PDF hub",
        title: "Prepare clean PDF documents before you share them",
        paragraphs: [
          "Organizing a PDF is not one task. Sometimes you need to combine several files, sometimes you need to remove extra pages, and sometimes you only need to save a few selected pages from a larger document.",
          "LiftPDF keeps these workflows separate so each tool stays simple. Choose the action that matches the document problem, preview the pages and export a clean PDF directly in your browser.",
        ],
      }}
      chooseTools={{
        title: "How to choose the right organize tool",
        description:
          "Start with the document problem, not the tool name. The right organizer preserves the PDF content while changing only the structure you need.",
        items: [
          {
            tool: "Merge PDF",
            href: "/merge-pdf",
            useWhen:
              "Several PDF files belong together and should become one final document.",
            avoidWhen:
              "Only a few pages from a larger source PDF are needed. Use Extract Pages first.",
          },
          {
            tool: "Split PDF",
            href: "/split-pdf",
            useWhen:
              "A PDF needs to become smaller files, page ranges or one file per page.",
            avoidWhen:
              "You only want to remove unwanted pages from the same document. Use Delete Pages.",
          },
          {
            tool: "Delete Pages",
            href: "/delete-pages",
            useWhen:
              "The PDF includes blank pages, duplicates, outdated pages or pages that should not be shared.",
          },
          {
            tool: "Extract Pages",
            href: "/extract-pages",
            useWhen:
              "Selected pages should become a new PDF while the original document stays unchanged.",
          },
          {
            tool: "Reorder Pages",
            href: "/reorder-pages",
            useWhen:
              "The pages are correct but the sequence is wrong.",
          },
          {
            tool: "Compress PDF",
            href: "/compress-pdf",
            useWhen:
              "The organized PDF is ready but too large to send, upload or archive comfortably.",
          },
        ],
      }}
      commonTasks={{
        title: "Common PDF organization tasks",
        tasks: [
          {
            title: "Build one packet",
            text: "Merge a cover page, contract, appendix and supporting documents into one PDF.",
            href: "/merge-pdf",
          },
          {
            title: "Remove unwanted pages",
            text: "Delete blank scans, duplicate receipts or outdated pages before sending.",
            href: "/delete-pages",
          },
          {
            title: "Save selected pages",
            text: "Extract only the pages needed for a client, class or submission.",
            href: "/extract-pages",
          },
          {
            title: "Fix page order",
            text: "Move pages into the correct reading sequence before exporting.",
            href: "/reorder-pages",
          },
        ],
      }}
      workflow={{
        title: "A safe PDF organization workflow",
        steps: [
          {
            title: "Preview the document",
            text: "Check page thumbnails, file names and page counts before changing anything.",
          },
          {
            title: "Choose one structure change",
            text: "Merge, split, delete, extract or reorder depending on the problem you are solving.",
          },
          {
            title: "Download and review",
            text: "Open the exported PDF once to confirm page order, page count and content.",
          },
        ],
      }}
      screenshots={{
        title: "See how organization looks in LiftPDF",
        description:
          "Real workflow screenshots help show how files and pages are reviewed before export.",
        images: [
          {
            src: "/images/seo/merge-pdf/merge-pdf-before.webp",
            alt: "LiftPDF Merge PDF file order preview",
            width: 1280,
            height: 860,
            label: "Merge PDF before export",
          },
          {
            src: "/images/seo/merge-pdf/merge-pdf-after.webp",
            alt: "LiftPDF Merge PDF successful export state",
            width: 1280,
            height: 860,
            label: "Merged PDF ready to download",
          },
        ],
      }}
      guides={{
        title: "Organize PDF guides",
        links: [
          {
            label: "How to merge PDF files",
            href: "/guides/how-to-merge-pdf",
            text: "Learn the clean workflow for combining multiple PDFs.",
          },
          {
            label: "Extract pages from a PDF",
            href: "/guides/how-to-extract-pages-from-pdf",
            text: "Save only the pages you need into a new document.",
          },
          {
            label: "Merge PDF without Adobe",
            href: "/guides/merge-pdf-without-adobe",
            text: "Use a focused browser workflow for simple merge tasks.",
          },
        ],
      }}
      faq={[
        {
          question: "Can I merge and split PDFs?",
          answer:
            "Yes. Merge PDF and Split PDF are available now and process files in your browser.",
        },
        {
          question: "Are delete and reorder tools available?",
          answer:
            "Yes. Delete Pages, Extract Pages and Reorder Pages are available now alongside Merge PDF and Split PDF.",
        },
        {
          question: "Should I split or extract pages?",
          answer:
            "Use Split PDF when you want to divide a document into ranges or separate files. Use Extract Pages when selected pages should become one new PDF.",
        },
        {
          question: "Should I delete pages before merging?",
          answer:
            "Yes, if a source PDF contains blank, duplicate or unrelated pages. Cleaning files before merging usually creates a better final document.",
        },
        {
          question: "Are organize tools uploaded to a server?",
          answer:
            "Available LiftPDF organize tools are designed to process supported PDFs locally in your browser.",
        },
      ]}
    />
  );
}
