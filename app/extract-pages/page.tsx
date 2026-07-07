import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ExtractPagesTool } from "@/components/tools/extract-pages-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Extract PDF Pages Online Free | LiftPDF";
const description =
  "Extract selected pages from a PDF online for free. Choose the pages you need and create a new PDF directly in your browser.";

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
      description="Select one or more PDF pages and save them into a new document directly in your browser."
      seoTitle="Extract selected PDF pages online"
      seoText="LiftPDF lets you preview every PDF page, select exactly the pages you need and export them into a new PDF while preserving the original page order and quality."
      currentHref="/extract-pages"
      premiumContent={premiumToolContent.extractPages}
      faq={[
        {
          question: "Can I extract PDF pages for free?",
          answer:
            "Yes. Extract PDF Pages is free to use directly in your browser.",
        },
        {
          question: "Are my files uploaded?",
          answer:
            "No. The PDF is read and processed locally on your device without a backend upload.",
        },
        {
          question: "Can I extract multiple pages?",
          answer:
            "Yes. Select one page, several pages, or all pages before exporting the new PDF.",
        },
        {
          question: "Will the page quality change?",
          answer:
            "No. LiftPDF copies the selected PDF pages into a new document with pdf-lib, preserving their content and quality.",
        },
        {
          question: "Can I extract one page only?",
          answer:
            "Yes. Select a single page and download it as a new one-page PDF.",
        },
      ]}
    >
      <ExtractPagesTool />
    </ToolPageShell>
  );
}
