import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { WatermarkPdfTool } from "@/components/tools/watermark-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Watermark PDF Online - Add Text or Image Watermark | LiftPDF";
const description =
  "Add text or image watermarks to PDF files online for free. Customize position, opacity, rotation, style and page range with LiftPDF.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/watermark-pdf" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/watermark-pdf`,
    images: [{ url: "/images/seo/watermark-pdf/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Watermark PDF" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/watermark-pdf/og-image.webp"] },
};

export default function WatermarkPdfPage() {
  return (
    <ToolPageShell
      title="Watermark PDF Online"
      description="Add a custom text or image watermark to every PDF page or only selected pages with live preview and precise styling controls."
      seoTitle="Add text or image watermarks"
      seoText="LiftPDF lets you watermark PDFs directly in your browser. Choose a text or image watermark, adjust position, opacity and rotation, apply it to every page or a selected page range, preview the result and download a finished PDF without a backend API."
      currentHref="/watermark-pdf"
      premiumContent={premiumToolContent.watermarkPdf}
      faq={[
        {
          question: "Can I add an image watermark?",
          answer:
            "Yes. Upload PNG, JPG, JPEG or WEBP images and LiftPDF will place the image watermark on each page.",
        },
        {
          question: "Can I add a text watermark?",
          answer:
            "Yes. You can enter custom text, choose a standard font, adjust size, color, opacity, rotation and position.",
        },
        {
          question: "Can I repeat the watermark across the page?",
          answer:
            "Yes. Use Tile / Repeat to place the watermark multiple times across every PDF page.",
        },
        {
          question: "Can I watermark only selected pages?",
          answer:
            "Yes. Apply the watermark to every page or enter a page range such as 2-5 or 1,3,7.",
        },
        {
          question: "Can I control opacity and rotation?",
          answer:
            "Yes. Text and image watermarks both support opacity and rotation controls with a live preview.",
        },
        {
          question: "Will the PDF quality change?",
          answer:
            "LiftPDF keeps the original PDF pages and adds the watermark on top. Page dimensions and existing content are preserved.",
        },
        {
          question: "Can I watermark a password-protected PDF?",
          answer:
            "Password-protected PDFs must be unlocked first with Unlock PDF before adding a watermark.",
        },
        {
          question: "Are my PDFs uploaded to a server?",
          answer:
            "No. Preview and watermark generation run client-side with PDF.js, canvas and pdf-lib.",
        },
      ]}
    >
      <WatermarkPdfTool />
    </ToolPageShell>
  );
}
