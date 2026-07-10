import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "Organize PDF Online | LiftPDF";
const description =
  "Organize PDF pages online with merge, split, delete, extract and reorder tools.";

export const metadata: Metadata = {
  title: { absolute: `${title} - Free PDF Organizer` },
  description,
  alternates: { canonical: "/organize-pdf" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/organize-pdf`,
    images: [
      {
        url: "/images/seo/categories/organize-og.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF organize PDF tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/categories/organize-og.svg"],
  },
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
            "Yes. Delete Pages, Extract Pages and Reorder Pages are available now alongside Merge PDF and Split PDF.",
        },
      ]}
    />
  );
}
