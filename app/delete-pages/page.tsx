import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { DeletePagesTool } from "@/components/tools/delete-pages-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Remove Pages from PDF Online Free | LiftPDF";
const description =
  "Remove pages from PDF files online for free. Delete one page, multiple pages, blank pages or unwanted pages directly in your browser.";

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
      description="Remove unwanted, blank, duplicate or private pages from a PDF directly in your browser."
      seoTitle="Remove pages from PDF files online"
      seoText="LiftPDF lets you preview every PDF page, select one or multiple pages to remove and download a new PDF with the remaining pages preserved in their original order."
      currentHref="/delete-pages"
      premiumContent={premiumToolContent.deletePages}
      faq={[
        {
          question: "Can I remove pages from a PDF for free?",
          answer:
            "Yes. Delete PDF Pages is free to use and runs directly in your browser.",
        },
        {
          question: "How do I remove one page from a PDF?",
          answer:
            "Upload your PDF, click the page thumbnail you want to remove, then export the updated PDF. The other pages stay in order.",
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
          question: "Can I remove blank pages from a PDF?",
          answer:
            "Yes. Use the page thumbnails to identify blank pages, select them, and export a cleaned PDF.",
        },
        {
          question: "Can I preview pages before deleting them?",
          answer:
            "Yes. LiftPDF renders page thumbnails so you can select exactly which pages should be removed before exporting.",
        },
        {
          question: "Can I delete every page?",
          answer:
            "No. A PDF must contain at least one page, so LiftPDF blocks exports that would remove the entire document.",
        },
        {
          question: "Does it work offline?",
          answer:
            "After the page and required assets are loaded, the PDF processing itself happens in your browser without uploading files.",
        },
        {
          question: "Can I delete pages from a password-protected PDF?",
          answer:
            "Password-protected PDFs must be unlocked first with Unlock PDF before pages can be removed.",
        },
        {
          question: "Can I remove pages from a PDF without Adobe Acrobat?",
          answer:
            "Yes. LiftPDF removes pages locally in your browser without requiring Acrobat, a desktop app, or an account.",
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
