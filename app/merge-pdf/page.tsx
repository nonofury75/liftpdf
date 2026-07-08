import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MergePdfTool } from "@/components/tools/merge-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Merge PDF Online - Free PDF Merger | LiftPDF";
const description =
  "Merge multiple PDF files into one document for free. Fast, secure and easy online PDF merger by LiftPDF.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/merge-pdf" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/merge-pdf`,
    images: [{ url: "/images/seo/merge-pdf/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Merge PDF" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/merge-pdf/og-image.webp"] },
};

export default function MergePdfPage() {
  return (
    <ToolPageShell
      title="Merge PDF Online"
      description="Combine multiple PDF files into a single document directly in your browser."
      seoTitle="Merge PDF files online"
      seoText="LiftPDF lets you merge PDFs in the order you choose. Add files, reorder them, remove anything you do not need and download one combined PDF without using a backend API."
      currentHref="/merge-pdf"
      premiumContent={premiumToolContent.mergePdf}
      faq={[
        {
          question: "Can I merge multiple PDFs at once?",
          answer:
            "Yes. Upload several PDF files and they will be merged into one document.",
        },
        {
          question: "Does the order matter?",
          answer:
            "Yes. The final PDF follows the order shown in the file list. Use the up and down buttons to reorder files before merging.",
        },
        {
          question: "Are my PDFs uploaded to LiftPDF?",
          answer:
            "No. The merge runs client-side in your browser with pdf-lib.",
        },
        {
          question: "Can I see how many pages each PDF has?",
          answer:
            "Yes. After upload, LiftPDF reads each PDF in your browser and shows the page count, file size and a first-page preview before you merge.",
        },
        {
          question: "Can I drag and drop PDFs to change the order?",
          answer:
            "Yes. On desktop, you can drag PDF cards into the order you want. You can also use the move up and move down buttons, which work well on mobile and with a keyboard.",
        },
        {
          question: "Will the quality change after merging?",
          answer:
            "No. LiftPDF copies the original PDF pages into a new document and preserves the page content, dimensions and quality.",
        },
        {
          question: "Can I merge password-protected PDFs?",
          answer:
            "Password-protected PDFs must be unlocked first. If a selected PDF is encrypted, LiftPDF will show an error instead of creating a broken merged file.",
        },
        {
          question: "Does Merge PDF work on mobile?",
          answer:
            "Yes. The tool works in modern mobile browsers. On smaller screens, use the move buttons to adjust file order before merging.",
        },
      ]}
    >
      <MergePdfTool />
    </ToolPageShell>
  );
}
