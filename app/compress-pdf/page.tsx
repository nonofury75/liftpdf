import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CompressPdfTool } from "@/components/tools/compress-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Compress PDF Online - Free PDF Compressor | LiftPDF";
const description =
  "Compress PDF files online for free. Reduce PDF file size quickly and securely with LiftPDF.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/compress-pdf" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/compress-pdf`,
    images: [{ url: "/images/seo/compress-pdf/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Compress PDF" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/compress-pdf/og-image.webp"] },
};

export default function CompressPdfPage() {
  return (
    <ToolPageShell
      title="Compress PDF Online"
      description="Rebuild a PDF with safe client-side compression and download a clean optimized copy."
      seoTitle="Compress PDF files online"
      seoText="LiftPDF provides a safe first-step PDF compression tool that runs in your browser. It rebuilds the document, keeps every page and removes or minimizes metadata where possible."
      currentHref="/compress-pdf"
      premiumContent={premiumToolContent.compressPdf}
      faq={[
        {
          question: "Is this advanced PDF compression?",
          answer:
            "No. This is safe client-side compression that rebuilds the PDF and minimizes metadata. It does not aggressively recompress images.",
        },
        {
          question: "Will every PDF become smaller?",
          answer:
            "Not always. Some PDFs are already optimized, and LiftPDF will show a clear message when the rebuilt file is not smaller.",
        },
        {
          question: "Are my PDFs uploaded to a server?",
          answer:
            "No. Compression runs client-side in your browser with pdf-lib.",
        },
      ]}
    >
      <CompressPdfTool />
    </ToolPageShell>
  );
}
