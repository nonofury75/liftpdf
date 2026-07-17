import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ExtractPagesTool } from "@/components/tools/extract-pages-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Extract PDF Pages Online Free | LiftPDF";
const description =
  "Extract one page or selected pages from a PDF online for free. Create one PDF or separate PDFs in a ZIP directly in your browser.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/extract-pages" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/extract-pages`,
    images: [{ url: "/images/seo/extract-pages/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Extract Pages" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/extract-pages/og-image.webp"] },
};

export default function ExtractPagesPage() {
  return (
    <ToolPageShell
      title="Extract PDF Pages"
      description="Select one page, multiple pages, or a focused excerpt and save them as one PDF or separate PDFs in a ZIP directly in your browser."
      seoTitle="Extract pages from PDF online"
      seoText="LiftPDF helps you extract one page or selected pages from a PDF without Adobe Acrobat. Preview every page, choose exactly what you need and export one combined PDF or separate PDFs in a ZIP locally while preserving page order and quality."
      currentHref="/extract-pages"
      premiumContent={premiumToolContent.extractPages}
      faq={[
        {
          question: "Can I extract PDF pages online for free?",
          answer:
            "Yes. LiftPDF lets you extract selected PDF pages for free directly in your browser.",
        },
        {
          question: "Are my files uploaded?",
          answer:
            "No. The PDF is read and processed locally on your device without a backend upload.",
        },
        {
          question: "Can I extract multiple pages from a PDF?",
          answer:
            "Yes. Select one page, several pages, or all pages before exporting one combined PDF or separate PDF files in a ZIP.",
        },
        {
          question: "Can I save each extracted page as a separate PDF?",
          answer:
            "Yes. Choose Separate PDFs in ZIP and LiftPDF creates one PDF file for each selected page, packaged in a ZIP download.",
        },
        {
          question: "How do I extract one page from a PDF?",
          answer:
            "Upload your PDF, select only the page thumbnail you need, then export. LiftPDF creates a new one-page PDF.",
        },
        {
          question: "Can I extract pages from a PDF without Adobe Acrobat?",
          answer:
            "Yes. LiftPDF runs in the browser and does not require Adobe Acrobat, a desktop installer, or an account.",
        },
        {
          question: "Can I preview pages before extracting them?",
          answer:
            "Yes. LiftPDF shows page thumbnails so you can choose exactly which pages should be saved.",
        },
        {
          question: "What happens if I do not select any page?",
          answer:
            "LiftPDF blocks the export and asks you to select at least one page before creating the new PDF.",
        },
        {
          question: "Will the page quality change?",
          answer:
            "No. LiftPDF copies the selected PDF pages into a new document with pdf-lib, preserving their content and quality.",
        },
        {
          question: "Can I extract pages from a password-protected PDF?",
          answer:
            "Password-protected PDFs must be unlocked first with Unlock PDF before selected pages can be extracted.",
        },
        {
          question: "Can I extract pages from a scanned PDF?",
          answer:
            "Yes, if you want to copy whole pages. Scanned pages remain images inside the new PDF; OCR is only needed when you want to extract text from scans.",
        },
        {
          question: "Why are extracted pages blank?",
          answer:
            "Blank results usually come from blank source pages, damaged PDFs, or protected files. Check the preview first and unlock encrypted PDFs before extracting.",
        },
      ]}
    >
      <ExtractPagesTool />
    </ToolPageShell>
  );
}
