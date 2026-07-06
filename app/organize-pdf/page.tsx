import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "Organize PDF Online | LiftPDF";
const description =
  "Organize PDF pages online with merge, split and upcoming page management tools.";

export const metadata: Metadata = {
  title: { absolute: `${title} - Free PDF Organizer` },
  description,
  alternates: { canonical: "/organize-pdf" },
  openGraph: { title, description, url: `${siteConfig.url}/organize-pdf` },
  twitter: { card: "summary_large_image", title, description },
};

export default function OrganizePdfPage() {
  return (
    <CategoryPageShell
      title={title}
      description={description}
      canonical="/organize-pdf"
      category="Organize"
      seoTitle="Organize PDF pages with a consistent workflow"
      seoText="LiftPDF organizer tools help you combine files, split documents and prepare for future page management workflows like deleting, extracting and reordering pages."
      faq={[
        {
          question: "Can I merge and split PDFs?",
          answer:
            "Yes. Merge PDF and Split PDF are available now and process files in your browser.",
        },
        {
          question: "Are delete and reorder tools available?",
          answer:
            "Delete Pages, Extract Pages and Reorder Pages are listed as coming soon and are not clickable yet.",
        },
      ]}
    />
  );
}
