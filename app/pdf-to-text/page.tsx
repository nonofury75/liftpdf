import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { PdfToTextTool } from "@/components/tools/pdf-to-text-tool";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "PDF to Text Online Free | Extract Text from PDF | LiftPDF";
const description =
  "Extract text from PDF files online for free. Convert PDF content to plain text directly in your browser without uploading your file.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/pdf-to-text" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/pdf-to-text`,
    images: [{ url: "/images/seo/pdf-to-text/og-image.webp", width: 1200, height: 630, alt: "LiftPDF PDF to Text" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/pdf-to-text/og-image.webp"] },
};

export default function PdfToTextPage() {
  return (
    <ToolPageShell
      title="PDF to Text"
      description="Extract selectable text from PDF files and download it as a plain TXT file in your browser."
      seoTitle="Extract readable text from PDF files"
      seoText="LiftPDF converts selectable PDF text into a clean plain text file locally in your browser. It does not perform OCR, so scanned or image-only PDFs need a dedicated OCR tool."
      currentHref="/pdf-to-text"
      premiumContent={premiumToolContent.pdfToText}
      faq={[
        {
          question: "Can I convert PDF to text for free?",
          answer:
            "Yes. PDF to Text is free and runs directly in your browser.",
        },
        {
          question: "Are my PDFs uploaded?",
          answer:
            "No. Your PDF is processed locally on your device and is not uploaded to LiftPDF servers.",
        },
        {
          question: "Does this work with scanned PDFs?",
          answer:
            "No. This tool extracts selectable text already present in the PDF. Scanned PDFs require OCR.",
        },
        {
          question: "Can I copy the extracted text?",
          answer:
            "Yes. After extraction, you can copy the text or download it as a TXT file.",
        },
        {
          question: "Is the text formatting preserved?",
          answer:
            "The tool keeps page separators and readable spacing, but complex PDF layouts may not preserve their exact visual formatting.",
        },
      ]}
    >
      <PdfToTextTool />
    </ToolPageShell>
  );
}
