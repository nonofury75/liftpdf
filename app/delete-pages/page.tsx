import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { DeletePagesTool } from "@/components/tools/delete-pages-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Delete PDF Pages Online - Free PDF Page Remover | LiftPDF";
const description =
  "Delete pages from PDF files online for free. Select one or multiple pages, remove them and download a clean PDF with LiftPDF.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/delete-pages" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/delete-pages`,
    images: [{ url: "/images/seo/delete-pages/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Delete Pages" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/delete-pages/og-image.webp"] },
};

export default function DeletePagesPage() {
  return (
    <ToolPageShell
      title="Delete PDF Pages"
      description="Remove unwanted pages from a PDF directly in your browser with page previews and multi-select controls."
      seoTitle="Delete pages from PDF files online"
      seoText="LiftPDF lets you preview every PDF page, select the pages you do not need and download a new PDF with the remaining pages preserved in their original order."
      currentHref="/delete-pages"
      premiumContent={premiumToolContent.deletePages}
      faq={[
        {
          question: "Can I remove pages for free?",
          answer:
            "Yes. Delete PDF Pages is free to use and runs directly in your browser.",
        },
        {
          question: "Are my PDFs uploaded?",
          answer:
            "No. Your PDF is processed locally on your device. LiftPDF does not upload your document to a backend API.",
        },
        {
          question: "Can I delete multiple pages?",
          answer:
            "Yes. Select one page, multiple pages, all pages except one, or invert your selection before deleting.",
        },
        {
          question: "Does it work offline?",
          answer:
            "After the page and required assets are loaded, the PDF processing itself happens in your browser without uploading files.",
        },
        {
          question: "Is the quality preserved?",
          answer:
            "Yes. LiftPDF copies the remaining PDF pages into a new document with pdf-lib, preserving page content and quality.",
        },
      ]}
    >
      <DeletePagesTool />
    </ToolPageShell>
  );
}
