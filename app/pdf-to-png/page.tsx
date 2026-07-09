import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PdfToPngTool } from "@/components/tools/pdf-to-png-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "PDF to PNG Converter - Free Online Tool | LiftPDF";
const description =
  "Convert PDF pages into high-quality PNG images online for free.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/pdf-to-png" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/pdf-to-png`,
    images: [{ url: "/images/seo/pdf-to-png/og-image.webp", width: 1200, height: 630, alt: "LiftPDF PDF to PNG converter" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/pdf-to-png/og-image.webp"] },
};

export default function PdfToPngPage() {
  return (
    <ToolPageShell
      title="PDF to PNG Converter"
      description="Convert PDF pages into sharp PNG images directly in your browser."
      seoTitle="Convert PDF pages to PNG online"
      seoText="LiftPDF renders your PDF pages in the browser and exports them as high-quality PNG images. Single-page PDFs download as one PNG, while multi-page PDFs are packaged into a ZIP file."
      currentHref="/pdf-to-png"
      premiumContent={premiumToolContent.pdfToPng}
      faq={[
        {
          question: "Can I convert every page of a PDF to PNG?",
          answer: "Yes. LiftPDF converts every page into a separate PNG image.",
        },
        {
          question: "Can I convert only one PDF page?",
          answer:
            "Yes. Choose Single page and enter the page number you want to export as PNG.",
        },
        {
          question: "Can I export a page range?",
          answer:
            "Yes. Use Page range for selections such as 1-3 or 1,3,5-8.",
        },
        {
          question: "What happens with multi-page PDFs?",
          answer:
            "Multi-page PDFs are downloaded as a ZIP file containing page-1.png, page-2.png and the remaining pages.",
        },
        {
          question: "Does PNG keep transparent backgrounds?",
          answer:
            "When possible, you can keep transparent PDF areas transparent with the transparent background option. Most regular PDFs render on a white page background.",
        },
        {
          question: "Why is there no DPI option?",
          answer:
            "LiftPDF uses simple Standard and High render quality settings instead of promising a print DPI value that may not match every PDF.",
        },
        {
          question: "Can I convert password-protected PDFs?",
          answer:
            "Password-protected PDFs must be unlocked first with Unlock PDF before conversion.",
        },
        {
          question: "Are my PDF files uploaded?",
          answer:
            "No. The conversion runs client-side with PDF.js, canvas and JSZip.",
        },
      ]}
    >
      <PdfToPngTool />
    </ToolPageShell>
  );
}
