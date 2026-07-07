import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { RotatePdfTool } from "@/components/tools/rotate-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Rotate PDF Online - Free PDF Rotator | LiftPDF";
const description =
  "Rotate PDF pages online for free. Rotate one page or all pages quickly and securely with LiftPDF.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/rotate-pdf" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/rotate-pdf`,
    images: [{ url: "/images/seo/rotate-pdf/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Rotate PDF" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/rotate-pdf/og-image.webp"] },
};

export default function RotatePdfPage() {
  return (
    <ToolPageShell
      title="Rotate PDF Online"
      description="Preview every PDF page, rotate individual pages or apply the same rotation to all pages."
      seoTitle="Rotate PDF pages online"
      seoText="LiftPDF rotates PDF pages directly in your browser. The tool keeps page dimensions and document content intact while applying the page rotation you choose before download."
      currentHref="/rotate-pdf"
      premiumContent={premiumToolContent.rotatePdf}
      faq={[
        {
          question: "Can I rotate one page only?",
          answer:
            "Yes. Each preview has left and right rotation controls, so you can rotate individual pages.",
        },
        {
          question: "Can I rotate all pages together?",
          answer:
            "Yes. Use Rotate All Left or Rotate All Right to apply a 90 degree rotation to every page.",
        },
        {
          question: "Are my PDFs uploaded to a server?",
          answer:
            "No. Preview and rotation run client-side with PDF.js and pdf-lib.",
        },
      ]}
    >
      <RotatePdfTool />
    </ToolPageShell>
  );
}
