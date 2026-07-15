import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "PDF Converter Online | LiftPDF";
const description =
  "Convert PDF files to images and documents directly in your browser with free LiftPDF converter tools.";

export const metadata: Metadata = {
  title: { absolute: `${title} - Free Browser PDF Tools` },
  description,
  alternates: { canonical: "/pdf-converter" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/pdf-converter`,
    images: [
      {
        url: "/images/seo/categories/convert-og.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF PDF converter tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/categories/convert-og.svg"],
  },
};

export default function PdfConverterPage() {
  return (
    <CategoryPageShell
      title={title}
      description={description}
      canonical="/pdf-converter"
      category="Convert"
      seoTitle="Convert PDFs without uploading files"
      seoText="LiftPDF converter tools focus on the formats available today: PDF pages to images, image files to PDF and readable PDF text extraction. The hub separates live tools from future Office converters so users can choose an honest workflow."
      intro={{
        eyebrow: "PDF converter hub",
        title: "Convert PDFs and image files with clear format choices",
        paragraphs: [
          "PDF conversion can mean several different things: exporting PDF pages as images, turning images into a document, or extracting selectable text. Each workflow has different output quality, privacy and file-size tradeoffs.",
          "LiftPDF keeps conversion tools focused and honest. Available converters run in the browser for supported files, while unavailable Office conversions stay marked as coming soon instead of pretending to work.",
        ],
      }}
      chooseTools={{
        title: "How to choose the right converter",
        description:
          "Pick the converter based on the output format you need. If you need editable Office files, wait for a real DOCX/XLSX/PPTX converter instead of using a fake text-only export.",
        items: [
          {
            tool: "PDF to JPG",
            href: "/pdf-to-jpg",
            useWhen:
              "PDF pages should become shareable JPG images for previews, uploads, slides or visual review.",
            avoidWhen:
              "You need sharper screenshot-style output. Try PDF to PNG.",
          },
          {
            tool: "PDF to PNG",
            href: "/pdf-to-png",
            useWhen:
              "PDF pages include small text, screenshots, diagrams or graphics where PNG is a better image output.",
          },
          {
            tool: "PDF to Text",
            href: "/pdf-to-text",
            useWhen:
              "The PDF already contains selectable text and you need a plain TXT copy.",
            avoidWhen:
              "The PDF is scanned or image-only. OCR is required for scanned text.",
          },
          {
            tool: "JPG to PDF",
            href: "/jpg-to-pdf",
            useWhen:
              "JPG photos, scans or receipts should become PDF pages.",
          },
          {
            tool: "PNG to PDF",
            href: "/png-to-pdf",
            useWhen:
              "Screenshots, transparent PNGs or sharp graphics should become a PDF.",
          },
          {
            tool: "Images to PDF",
            href: "/images-to-pdf",
            useWhen:
              "A mixed batch of JPG, PNG and WEBP images should become one document.",
          },
        ],
      }}
      commonTasks={{
        title: "Common PDF conversion tasks",
        tasks: [
          {
            title: "Export PDF as images",
            text: "Convert every page, one page or a range into JPG or PNG files.",
            href: "/pdf-to-jpg",
          },
          {
            title: "Create PDF from photos",
            text: "Turn camera scans, receipts or document photos into a PDF.",
            href: "/jpg-to-pdf",
          },
          {
            title: "Extract readable text",
            text: "Copy selectable PDF text into a plain TXT file without claiming OCR.",
            href: "/pdf-to-text",
          },
          {
            title: "Convert mixed images",
            text: "Combine different image formats into one PDF without separate steps.",
            href: "/images-to-pdf",
          },
        ],
      }}
      workflow={{
        title: "A practical conversion workflow",
        steps: [
          {
            title: "Choose the output first",
            text: "Decide whether the result should be JPG, PNG, TXT or PDF before uploading.",
          },
          {
            title: "Preview and select",
            text: "Use page ranges, image order or layout settings to control the final result.",
          },
          {
            title: "Download and verify",
            text: "Open the converted file once to confirm quality, page count and format.",
          },
        ],
      }}
      screenshots={{
        title: "Real conversion previews",
        description:
          "LiftPDF conversion tools show the file and output settings before generating the result.",
        images: [
          {
            src: "/images/seo/jpg-to-pdf/jpg-to-pdf-preview.webp",
            alt: "LiftPDF JPG to PDF live page preview",
            width: 1280,
            height: 860,
            label: "Image to PDF layout preview",
          },
          {
            src: "/images/seo/jpg-to-pdf/jpg-to-pdf-after.webp",
            alt: "LiftPDF JPG to PDF successful conversion state",
            width: 1280,
            height: 860,
            label: "Converted PDF ready to download",
          },
        ],
      }}
      guides={{
        title: "Conversion guides",
        links: [
          {
            label: "How to convert JPG to PDF",
            href: "/guides/how-to-convert-jpg-to-pdf",
            text: "Create a PDF from JPG images with layout and quality tips.",
          },
          {
            label: "Convert JPG without losing quality",
            href: "/guides/how-to-convert-jpg-to-pdf-without-losing-quality",
            text: "Understand source image quality, margins and fit mode.",
          },
          {
            label: "JPG vs PNG",
            href: "/guides/jpg-vs-png",
            text: "Choose the right image format before converting to PDF.",
          },
        ],
      }}
      faq={[
        {
          question: "Which PDF converters are available?",
          answer:
            "PDF to JPG, PDF to PNG, PDF to Text, JPG to PDF, PNG to PDF and Images to PDF are available now. Office converters are listed as coming soon until a real conversion engine is ready.",
        },
        {
          question: "Do PDF converter tools upload documents?",
          answer:
            "No. Available LiftPDF converters process files locally in the browser.",
        },
        {
          question: "Can LiftPDF convert PDF to Word?",
          answer:
            "Not yet. LiftPDF does not publish a PDF to Word tool until it can create a real DOCX file instead of a renamed text export.",
        },
        {
          question: "Should I choose JPG or PNG output?",
          answer:
            "Use JPG for photo-like pages and smaller visual previews. Use PNG for screenshots, diagrams or pages with small text that should stay sharp.",
        },
        {
          question: "Does PDF to Text include OCR?",
          answer:
            "No. PDF to Text extracts selectable text already present in the PDF. Scanned image-only PDFs require OCR.",
        },
      ]}
    />
  );
}
