import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PdfToPngTool } from "@/components/tools/pdf-to-png-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";

const title = "PDF to PNG Converter - Free Online Tool | LiftPDF";
const description =
  "Convert PDF pages into high-quality PNG images online for free.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/pdf-to-png" },
  openGraph: { title, description, url: `${siteConfig.url}/pdf-to-png` },
  twitter: { card: "summary_large_image", title, description },
};

export default function PdfToPngPage() {
  return (
    <ToolPageShell
      title="PDF to PNG Converter"
      description="Convert PDF pages into sharp PNG images directly in your browser."
      seoTitle="Convert PDF pages to PNG online"
      seoText="LiftPDF renders your PDF pages in the browser and exports them as high-quality PNG images. Single-page PDFs download as one PNG, while multi-page PDFs are packaged into a ZIP file."
      currentHref="/pdf-to-png"
      faq={[
        {
          question: "Can I convert every page of a PDF to PNG?",
          answer: "Yes. LiftPDF converts every page into a separate PNG image.",
        },
        {
          question: "What happens with multi-page PDFs?",
          answer:
            "Multi-page PDFs are downloaded as a ZIP file containing page-1.png, page-2.png and the remaining pages.",
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
