import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "PDF Image Tools | LiftPDF";
const description =
  "Convert images to PDF and export PDF pages as JPG or PNG directly in your browser.";

export const metadata: Metadata = {
  title: { absolute: `${title} - Image and PDF Converters` },
  description,
  alternates: { canonical: "/pdf-image-tools" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/pdf-image-tools`,
    images: [
      {
        url: "/images/seo/categories/images-og.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF PDF image tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/categories/images-og.svg"],
  },
};

export default function PdfImageToolsPage() {
  return (
    <CategoryPageShell
      title={title}
      description={description}
      canonical="/pdf-image-tools"
      category="Images"
      seoTitle="Convert between images and PDF"
      seoText="LiftPDF image tools cover the most common browser workflows: create PDFs from JPG, PNG and WEBP files, or export PDF pages into image formats."
      faq={[
        {
          question: "Can I convert images to PDF?",
          answer:
            "Yes. JPG to PDF, PNG to PDF and Images to PDF are available now.",
        },
        {
          question: "Can I export PDF pages as images?",
          answer:
            "Yes. PDF to JPG and PDF to PNG are available from the converter category.",
        },
      ]}
    />
  );
}
