import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { SplitPdfTool } from "@/components/tools/split-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Split PDF Online - Free PDF Splitter | LiftPDF";
const description =
  "Split PDF files online for free. Extract selected pages or split every page into separate PDF files with LiftPDF.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/split-pdf" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/split-pdf`,
    images: [{ url: "/images/seo/split-pdf/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Split PDF" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/split-pdf/og-image.webp"] },
};

export default function SplitPdfPage() {
  return (
    <ToolPageShell
      title="Split PDF Online"
      description="Extract selected pages or split every page into separate PDF files directly in your browser."
      seoTitle="Split PDF files online"
      seoText="LiftPDF helps you split a PDF without installing software. Choose specific pages like 1,3,5-8 to create one new PDF, or split every page into separate PDF files inside a ZIP archive."
      currentHref="/split-pdf"
      premiumContent={premiumToolContent.splitPdf}
      faq={[
        {
          question: "Can I extract only selected pages?",
          answer:
            "Yes. Use page ranges like 1,3,5-8 and LiftPDF will create one PDF with only those pages.",
        },
        {
          question: "Can I split every page into a separate PDF?",
          answer:
            "Yes. The split every page mode creates a ZIP file containing page-1.pdf, page-2.pdf and the rest of the pages.",
        },
        {
          question: "Are my PDFs uploaded to a server?",
          answer:
            "No. The split runs client-side in your browser with pdf-lib and JSZip.",
        },
      ]}
    >
      <SplitPdfTool />
    </ToolPageShell>
  );
}
