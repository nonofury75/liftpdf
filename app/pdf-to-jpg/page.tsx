import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PdfToJpgTool } from "@/components/tools/pdf-to-jpg-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";

const title = "PDF to JPG Converter - Free Online Tool | LiftPDF";
const description =
  "Convert PDF pages to high-quality JPG images online for free. Fast, secure and easy PDF to JPG converter by LiftPDF.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/pdf-to-jpg" },
  openGraph: { title, description, url: `${siteConfig.url}/pdf-to-jpg` },
  twitter: { card: "summary_large_image", title, description },
};

export default function PdfToJpgPage() {
  return (
    <ToolPageShell
      title="PDF to JPG Converter"
      description="Convert every PDF page into a high-quality JPG image directly in your browser."
      seoTitle="Convert PDF pages to JPG online"
      seoText="LiftPDF renders your PDF pages in the browser and exports them as readable JPG images. Single-page PDFs download as one JPG, while multi-page PDFs are packaged into a ZIP file."
      currentHref="/pdf-to-jpg"
      faq={[
        {
          question: "Can I convert every page of a PDF?",
          answer: "Yes. LiftPDF converts every page into a separate JPG image.",
        },
        {
          question: "What happens with multi-page PDFs?",
          answer:
            "Multi-page PDFs are downloaded as a ZIP file containing page-1.jpg, page-2.jpg and the remaining pages.",
        },
        {
          question: "Are my PDF files uploaded?",
          answer:
            "No. The conversion runs client-side with PDF.js, canvas and JSZip.",
        },
      ]}
    >
      <PdfToJpgTool />
    </ToolPageShell>
  );
}
