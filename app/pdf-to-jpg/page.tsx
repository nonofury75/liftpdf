import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PdfToJpgTool } from "@/components/tools/pdf-to-jpg-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "PDF to JPG Converter - Free Online Tool | LiftPDF";
const description =
  "Convert PDF pages to high-quality JPG images online for free. Fast, secure and easy PDF to JPG converter by LiftPDF.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/pdf-to-jpg" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/pdf-to-jpg`,
    images: [
      {
        url: "/images/seo/pdf-to-jpg/og-image.webp",
        width: 1200,
        height: 630,
        alt: "LiftPDF PDF to JPG converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/pdf-to-jpg/og-image.webp"],
  },
};

export default function PdfToJpgPage() {
  return (
    <ToolPageShell
      title="PDF to JPG Converter"
      description="Convert every PDF page into a high-quality JPG image directly in your browser."
      seoTitle="Convert PDF pages to JPG online"
      seoText="LiftPDF renders your PDF pages in the browser and exports selected pages as readable JPG images. Download a single page as one JPG or multiple pages as a ZIP file, without uploading your PDF to a server."
      currentHref="/pdf-to-jpg"
      premiumContent={premiumToolContent.pdfToJpg}
      faq={[
        {
          question: "Can I convert every page of a PDF?",
          answer: "Yes. LiftPDF converts every page into a separate JPG image.",
        },
        {
          question: "Can I convert only one PDF page?",
          answer:
            "Yes. Choose Single page and enter the page number you want to export.",
        },
        {
          question: "Can I export a page range?",
          answer:
            "Yes. Use ranges such as 1-3 or mixed selections such as 1,3,5-8.",
        },
        {
          question: "What happens with multi-page PDFs?",
          answer:
            "Multi-page PDFs are downloaded as a ZIP file containing page-1.jpg, page-2.jpg and the remaining pages.",
        },
        {
          question: "What is the difference between Normal and High quality?",
          answer:
            "Normal is suitable for quick sharing. High renders pages at a larger scale for clearer text and details, but can create larger files.",
        },
        {
          question: "Does PDF to JPG extract embedded images?",
          answer:
            "No. This tool converts full PDF pages into JPG images. Extracting embedded images is a separate workflow.",
        },
        {
          question: "Can I convert a password-protected PDF?",
          answer:
            "Password-protected PDFs must be unlocked first with the Unlock PDF tool before conversion.",
        },
        {
          question: "Are my PDF files uploaded?",
          answer:
            "No. The conversion runs client-side with PDF.js, canvas and JSZip.",
        },
        {
          question: "Does it work on mobile?",
          answer:
            "Yes. PDF to JPG works in modern mobile browsers, although very large PDFs can require more memory.",
        },
        {
          question: "Will the JPG keep selectable text?",
          answer:
            "No. JPG is an image format, so text becomes pixels. Use PDF to Text if you need selectable text.",
        },
      ]}
    >
      <PdfToJpgTool />
    </ToolPageShell>
  );
}
