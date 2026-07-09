import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ReorderPagesTool } from "@/components/tools/reorder-pages-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Reorder PDF Pages Online Free | LiftPDF";
const description =
  "Reorder PDF pages online for free. Drag and drop pages to rearrange your PDF directly in your browser.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/reorder-pages" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/reorder-pages`,
    images: [{ url: "/images/seo/reorder-pages/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Reorder Pages" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/reorder-pages/og-image.webp"] },
};

export default function ReorderPagesPage() {
  return (
    <ToolPageShell
      title="Reorder PDF Pages"
      description="Drag and drop PDF pages into a new order, then download a reordered PDF directly from your browser."
      seoTitle="Reorder PDF pages online"
      seoText="LiftPDF lets you preview every page, rearrange the order with drag and drop or accessible move buttons, and export a new PDF while preserving page quality."
      currentHref="/reorder-pages"
      premiumContent={premiumToolContent.reorderPages}
      faq={[
        {
          question: "Can I reorder PDF pages for free?",
          answer:
            "Yes. Reorder PDF Pages is free to use directly in your browser.",
        },
        {
          question: "Are my PDFs uploaded?",
          answer:
            "No. LiftPDF reads, previews and exports your PDF locally in your browser.",
        },
        {
          question: "Can I drag and drop pages?",
          answer:
            "Yes. On desktop, drag pages into a new order. You can also use move buttons for keyboard and mobile control.",
        },
        {
          question: "Can I reorder pages without drag and drop?",
          answer:
            "Yes. Every page has move buttons, so the tool remains usable on mobile and with keyboard navigation.",
        },
        {
          question: "Can I reset the original order?",
          answer:
            "Yes. Use Reset order to restore the original page sequence before exporting.",
        },
        {
          question: "Does it work on mobile?",
          answer:
            "Yes. Mobile users can reorder pages with the left and right move buttons.",
        },
        {
          question: "Can I reorder a password-protected PDF?",
          answer:
            "Password-protected PDFs must be unlocked first with Unlock PDF before pages can be rearranged.",
        },
        {
          question: "Will the quality change?",
          answer:
            "No. LiftPDF copies the original PDF pages into a new document in the order you choose.",
        },
      ]}
    >
      <ReorderPagesTool />
    </ToolPageShell>
  );
}
