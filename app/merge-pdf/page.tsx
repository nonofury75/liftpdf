import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MergePdfTool } from "@/components/tools/merge-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";

const title = "Merge PDF Online - Free PDF Merger | LiftPDF";
const description =
  "Merge multiple PDF files into one document for free. Fast, secure and easy online PDF merger by LiftPDF.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/merge-pdf" },
  openGraph: { title, description, url: `${siteConfig.url}/merge-pdf` },
  twitter: { card: "summary_large_image", title, description },
};

export default function MergePdfPage() {
  return (
    <ToolPageShell
      title="Merge PDF Online"
      description="Combine multiple PDF files into a single document directly in your browser."
      seoTitle="Merge PDF files online"
      seoText="LiftPDF lets you merge PDFs in the order you choose. Add files, reorder them, remove anything you do not need and download one combined PDF without using a backend API."
      currentHref="/merge-pdf"
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
      ]}
    >
      <MergePdfTool />
    </ToolPageShell>
  );
}
