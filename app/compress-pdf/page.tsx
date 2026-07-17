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
      description="Compress a PDF locally with QPDF WASM modes for lossless optimization, balanced compression or stronger image-aware reduction."
      seoTitle="Compress PDF files online"
      seoText="LiftPDF compresses PDFs in your browser with QPDF WASM. Choose Preserve quality, Balanced or Strong compression, then compare the original and final file size before downloading."
      currentHref="/compress-pdf"
      premiumContent={premiumToolContent.compressPdf}
      faq={[
        {
          question: "What compression modes are available?",
          answer:
            "LiftPDF provides Preserve quality, Balanced and Strong modes. Preserve quality focuses on lossless PDF optimization, while Balanced and Strong can optimize large images when QPDF can do so safely.",
        },
        {
          question: "Does LiftPDF guarantee a target size like 1 MB?",
          answer:
            "No. The current browser engine does not guarantee exact target sizes. It reports the real output size after compression instead of promising a fixed number.",
        },
        {
          question: "Will every PDF become smaller?",
          answer:
            "Not always. Some PDFs are already optimized, and LiftPDF will show a clear message when the rebuilt file is not smaller.",
        },
        {
          question: "Does Compress PDF reduce image quality?",
          answer:
            "Preserve quality avoids intentional quality loss. Balanced and Strong may change image compression on image-heavy PDFs to reduce file size.",
        },
        {
          question: "Are my PDFs uploaded to a server?",
          answer:
            "No. Compression runs client-side in your browser with QPDF compiled to WebAssembly.",
        },
        {
          question: "Can I compress a password-protected PDF?",
          answer:
            "Password-protected PDFs must be unlocked first. Use Unlock PDF, then compress the unlocked copy.",
        },
      ]}
    >
      <CompressPdfTool />
    </ToolPageShell>
  );
}
