import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AddPageNumbersTool } from "@/components/tools/add-page-numbers-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";

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
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function AddPageNumbersPage() {
  return (
    <ToolPageShell
      title="Add Page Numbers to PDF"
      description="Add custom page numbers to your PDF with live preview, position controls, font choices and styling options."
      seoTitle="Add page numbers online"
      seoText="LiftPDF lets you add page numbers directly in your browser. Choose where numbers appear, customize the font, size, color and format, then download a numbered PDF without uploading files to a backend API."
      currentHref="/add-page-numbers"
      faq={[
        {
          question: "Can I choose where page numbers appear?",
          answer:
            "Yes. You can place numbers in any corner or centered at the top or bottom of each page.",
        },
        {
          question: "Can I customize the page number style?",
          answer:
            "Yes. Choose Helvetica, Times or Courier, adjust the size, select a color and pick a format such as Page 1 or 1 / 10.",
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
