import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AddPageNumbersTool } from "@/components/tools/add-page-numbers-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Add Page Numbers to PDF Online | LiftPDF";
const description =
  "Add page numbers to PDF files online for free. Customize position, font, size and style in seconds.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/add-page-numbers" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/add-page-numbers`,
    images: [{ url: "/images/seo/add-page-numbers/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Add Page Numbers" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/add-page-numbers/og-image.webp"] },
};

export default function AddPageNumbersPage() {
  return (
    <ToolPageShell
      title="Add Page Numbers to PDF"
      description="Add custom page numbers to your PDF with live preview, position controls, font choices and styling options."
      seoTitle="Add page numbers online"
      seoText="LiftPDF lets you add page numbers directly in your browser. Choose where numbers appear, customize the font, size, color and format, then download a numbered PDF without uploading files to a backend API."
      currentHref="/add-page-numbers"
      premiumContent={premiumToolContent.addPageNumbers}
      faq={[
        {
          question: "Can I choose where page numbers appear?",
          answer:
            "Yes. You can place numbers in any corner or centered at the top or bottom of each page.",
        },
        {
          question: "Can I customize the page number style?",
          answer:
            "Yes. Choose Helvetica, Times or Courier, use Small, Medium or Large size, select a color and pick a format such as Page 1 or 1 / 10.",
        },
        {
          question: "Can I start numbering from a different number?",
          answer:
            "Yes. Set the start number to 1, 5, 10 or any positive number before generating the numbered PDF.",
        },
        {
          question: "Can I preview the numbers before downloading?",
          answer:
            "Yes. LiftPDF shows every page as a preview and updates the number position, format, font, size and color instantly.",
        },
        {
          question: "Will adding page numbers change the PDF quality?",
          answer:
            "No. LiftPDF keeps the original PDF pages and draws the page numbers on top while preserving dimensions and existing content.",
        },
        {
          question: "Can I number a password-protected PDF?",
          answer:
            "Password-protected PDFs must be unlocked first with Unlock PDF before page numbers can be added.",
        },
        {
          question: "Are my PDFs uploaded to a server?",
          answer:
            "No. Preview and numbering run client-side with PDF.js and pdf-lib.",
        },
      ]}
    >
      <AddPageNumbersTool />
    </ToolPageShell>
  );
}
