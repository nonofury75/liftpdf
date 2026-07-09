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
          question: "Why are there no Low, Balanced or Maximum levels?",
          answer:
            "LiftPDF only shows options that change the output honestly. The current browser compression engine uses one safe mode, so fake compression levels are not displayed.",
        },
        {
          question: "Will every PDF become smaller?",
          answer:
            "Not always. Some PDFs are already optimized, and LiftPDF will show a clear message when the rebuilt file is not smaller.",
        },
        {
          question: "Does Compress PDF reduce image quality?",
          answer:
            "No. This version preserves page content and does not downsample images. That keeps quality stable, but image-heavy PDFs may not shrink as much as they would with server-side image recompression.",
        },
        {
          question: "Are my PDFs uploaded to a server?",
          answer:
            "No. Compression runs client-side in your browser with pdf-lib.",
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
