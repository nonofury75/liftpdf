import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { RotatePdfTool } from "@/components/tools/rotate-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Rotate PDF Online - Free PDF Rotator | LiftPDF";
const description =
  "Rotate PDF pages online for free. Rotate all pages, selected pages, odd or even pages, or custom page ranges with LiftPDF.";

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
      description="Preview every PDF page, rotate individual pages, or target all, selected, odd, even or custom page ranges."
      seoTitle="Rotate PDF pages online"
      seoText="LiftPDF rotates PDF pages directly in your browser. Target all pages, selected pages, odd pages, even pages or a custom range, then download a valid PDF with page dimensions and content preserved."
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
            "Yes. Choose All pages, then use Rotate left 90 deg, Rotate right 90 deg or Rotate 180 deg.",
        },
        {
          question: "Can I rotate only odd or even pages?",
          answer:
            "Yes. Choose Odd pages or Even pages, then apply a 90 degree or 180 degree rotation only to those targeted pages.",
        },
        {
          question: "Can I rotate a custom page range?",
          answer:
            "Yes. Choose Page range and enter values like 2-5, 1,3,7 or 1-3,6,9-12. LiftPDF validates the range before applying the rotation.",
        },
        {
          question: "Can I rotate a page by 180 degrees?",
          answer:
            "Yes. Click the same page rotation button twice, or rotate all pages twice, to reach 180 degrees.",
        },
        {
          question: "Will rotating pages reduce PDF quality?",
          answer:
            "No. LiftPDF updates the page rotation setting and keeps the original page content, text, images and dimensions intact.",
        },
        {
          question: "Can I reset rotations before downloading?",
          answer:
            "Yes. Use Reset rotations to return every preview page to its original orientation before exporting.",
        },
        {
          question: "Can I rotate password-protected PDFs?",
          answer:
            "Password-protected PDFs must be unlocked first with Unlock PDF before rotation.",
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
