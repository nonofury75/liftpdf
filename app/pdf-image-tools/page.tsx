import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "PDF Image Tools | LiftPDF";
const description =
  "Convert images to PDF and export PDF pages as JPG or PNG directly in your browser.";

export const metadata: Metadata = {
  title: { absolute: `${title} - Image and PDF Converters` },
  description,
  alternates: { canonical: "/pdf-image-tools" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/pdf-image-tools`,
    images: [
      {
        url: "/images/seo/categories/images-og.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF PDF image tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/categories/images-og.svg"],
  },
};

export default function PdfImageToolsPage() {
  return (
    <CategoryPageShell
      title={title}
      description={description}
      canonical="/pdf-image-tools"
      category="Images"
      seoTitle="Convert between images and PDF"
      seoText="LiftPDF image tools connect the most common visual document workflows: create PDFs from JPG, PNG and WEBP images, or export PDF pages as JPG and PNG files. This hub explains which format to choose."
      intro={{
        eyebrow: "PDF image hub",
        title: "Move between image files and PDF documents",
        paragraphs: [
          "Image and PDF workflows are often confused. A photo scan may need to become a PDF for submission, while a PDF page may need to become a JPG or PNG for a website, message or design workflow.",
          "LiftPDF separates these jobs by source and output format. That makes quality decisions clearer: JPG for photos, PNG for screenshots, Images to PDF for mixed batches and PDF to image tools for rendered pages.",
        ],
      }}
      chooseTools={{
        title: "How to choose the right image tool",
        description:
          "Start with the file you have and the format you need. JPG, PNG and PDF are not interchangeable; each format has a better use case.",
        items: [
          {
            tool: "JPG to PDF",
            href: "/jpg-to-pdf",
            useWhen:
              "Photos, camera scans, receipts or JPG document images should become PDF pages.",
            avoidWhen:
              "The source is PNG, WEBP or a mixed folder. Use PNG to PDF or Images to PDF.",
          },
          {
            tool: "PNG to PDF",
            href: "/png-to-pdf",
            useWhen:
              "Screenshots, transparent images, diagrams or sharp graphics should become a PDF.",
          },
          {
            tool: "Images to PDF",
            href: "/images-to-pdf",
            useWhen:
              "A mixed batch of JPG, PNG and WEBP images should become one PDF.",
          },
          {
            tool: "PDF to JPG",
            href: "/pdf-to-jpg",
            useWhen:
              "PDF pages should become photo-style JPG images for sharing or uploading.",
          },
          {
            tool: "PDF to PNG",
            href: "/pdf-to-png",
            useWhen:
              "PDF pages contain screenshots, text, diagrams or graphics that need sharp image output.",
          },
        ],
      }}
      commonTasks={{
        title: "Common image and PDF tasks",
        tasks: [
          {
            title: "Turn photos into PDF",
            text: "Create a document from camera scans, receipts or signed pages.",
            href: "/jpg-to-pdf",
          },
          {
            title: "Convert screenshots",
            text: "Use PNG to PDF for sharp UI captures, diagrams and graphics.",
            href: "/png-to-pdf",
          },
          {
            title: "Export PDF pages",
            text: "Render pages from a PDF into JPG or PNG image files.",
            href: "/pdf-to-jpg",
          },
          {
            title: "Combine mixed images",
            text: "Put JPG, PNG and WEBP files into one ordered PDF.",
            href: "/images-to-pdf",
          },
        ],
      }}
      workflow={{
        title: "A practical image/PDF workflow",
        steps: [
          {
            title: "Identify the source",
            text: "Check whether your files are JPG photos, PNG screenshots, mixed images or PDF pages.",
          },
          {
            title: "Pick the output format",
            text: "Use PDF for documents, JPG for lightweight visual pages and PNG for sharper graphics.",
          },
          {
            title: "Review quality and size",
            text: "Open the output once, then compress or convert again only if the file does not meet the use case.",
          },
        ],
      }}
      screenshots={{
        title: "Real image conversion previews",
        description:
          "LiftPDF image tools include live previews so users can see page layout before export.",
        images: [
          {
            src: "/images/seo/jpg-to-pdf/jpg-to-pdf-before.webp",
            alt: "LiftPDF JPG to PDF selected images before conversion",
            width: 1280,
            height: 860,
            label: "Images selected before creating a PDF",
          },
          {
            src: "/images/seo/jpg-to-pdf/jpg-to-pdf-preview.webp",
            alt: "LiftPDF JPG to PDF live page preview",
            width: 1280,
            height: 860,
            label: "Live PDF layout preview",
          },
        ],
      }}
      guides={{
        title: "Image and PDF guides",
        links: [
          {
            label: "How to convert JPG to PDF",
            href: "/guides/how-to-convert-jpg-to-pdf",
            text: "Create PDFs from JPG images with a clean browser workflow.",
          },
          {
            label: "Convert multiple JPGs to PDF",
            href: "/guides/how-to-convert-multiple-jpg-to-pdf",
            text: "Turn several images into one ordered PDF document.",
          },
          {
            label: "JPG vs PNG",
            href: "/guides/jpg-vs-png",
            text: "Choose the right image format before converting.",
          },
        ],
      }}
      faq={[
        {
          question: "Can I convert images to PDF?",
          answer:
            "Yes. JPG to PDF, PNG to PDF and Images to PDF are available now.",
        },
        {
          question: "Can I export PDF pages as images?",
          answer:
            "Yes. PDF to JPG and PDF to PNG are available from the converter category.",
        },
        {
          question: "Should I use JPG to PDF or Images to PDF?",
          answer:
            "Use JPG to PDF for JPG-only batches. Use Images to PDF when your files include PNG, WEBP or mixed image formats.",
        },
        {
          question: "Should I export PDF pages as JPG or PNG?",
          answer:
            "Use JPG for smaller photo-like previews. Use PNG for screenshots, diagrams or pages with small text.",
        },
        {
          question: "Are image tools uploaded to a server?",
          answer:
            "Available LiftPDF image tools are designed to process supported files locally in the browser.",
        },
      ]}
    />
  );
}
