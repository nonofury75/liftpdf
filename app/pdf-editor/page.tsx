import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "PDF Editor Online | LiftPDF";
const description =
  "Edit PDF files online for free with browser-based tools for compression, rotation, page numbers and watermarks.";

export const metadata: Metadata = {
  title: { absolute: `${title} - Free PDF Editing Tools` },
  description,
  alternates: { canonical: "/pdf-editor" },
  openGraph: { title, description, url: `${siteConfig.url}/pdf-editor` },
  twitter: { card: "summary_large_image", title, description },
};

export default function PdfEditorPage() {
  return (
    <CategoryPageShell
      title={title}
      description={description}
      canonical="/pdf-editor"
      category="Edit"
      seoTitle="Edit PDFs directly in your browser"
      seoText="LiftPDF editing tools help you rotate pages, add page numbers, place watermarks and rebuild PDFs with safe compression. The workflow stays consistent across every editor."
      faq={[
        {
          question: "Can I edit PDFs for free?",
          answer:
            "Yes. Available LiftPDF editor tools are free and run in your browser.",
        },
        {
          question: "Do editor tools preserve PDF content?",
          answer:
            "The tools are designed to preserve page content and dimensions while applying the selected edit.",
        },
      ]}
    />
  );
}
