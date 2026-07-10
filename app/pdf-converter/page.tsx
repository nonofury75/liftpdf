import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "PDF Converter Online | LiftPDF";
const description =
  "Convert PDF files to images and documents directly in your browser with free LiftPDF converter tools.";

export const metadata: Metadata = {
  title: { absolute: `${title} - Free Browser PDF Tools` },
  description,
  alternates: { canonical: "/pdf-converter" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/pdf-converter`,
    images: [
      {
        url: "/images/seo/categories/convert-og.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF PDF converter tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/categories/convert-og.svg"],
  },
};

export default function PdfConverterPage() {
  return (
    <CategoryPageShell
      title={title}
      description={description}
      canonical="/pdf-converter"
      category="Convert"
      seoTitle="Convert PDFs without uploading files"
      seoText="LiftPDF converter tools run in your browser whenever possible. Convert PDF pages into images today, and use the same catalogue to follow upcoming Word, Excel, PowerPoint and text converters."
      faq={[
        {
          question: "Which PDF converters are available?",
          answer:
            "PDF to JPG and PDF to PNG are available now. Office converters are listed as coming soon.",
        },
        {
          question: "Do PDF converter tools upload documents?",
          answer:
            "No. Available LiftPDF converters process files locally in the browser.",
        },
      ]}
    />
  );
}
