import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ImageToPdfPage } from "@/components/tools/image-to-pdf-page";

export const metadata: Metadata = {
  title: {
    absolute: "JPG to PDF Converter - Free Online Tool | LiftPDF",
  },
  description:
    "Convert JPG images to a PDF online for free. Upload multiple images, reorder them and download a clean A4 PDF in seconds.",
  alternates: {
    canonical: "/jpg-to-pdf",
  },
  openGraph: {
    title: "JPG to PDF Converter - Free Online Tool | LiftPDF",
    description: "Convert JPG images to a PDF online for free with LiftPDF.",
    url: `${siteConfig.url}/jpg-to-pdf`,
  },
  twitter: {
    card: "summary_large_image",
    title: "JPG to PDF Converter - Free Online Tool | LiftPDF",
    description: "Convert JPG images to a PDF online for free with LiftPDF.",
  },
};

export default function JpgToPdfPage() {
  return (
    <ImageToPdfPage
      title="JPG to PDF Converter"
      intro="Upload JPG, JPEG, PNG or WEBP images, arrange them in the right order and convert them into a single PDF."
      seoText="LiftPDF lets you turn JPG images into a PDF directly in your browser. Your images are placed on A4 pages, centered and scaled to keep their original ratio."
      downloadFileName="jpg-to-pdf.pdf"
      currentHref="/jpg-to-pdf"
      faq={[
        {
          question: "Can I convert multiple JPG files at once?",
          answer:
            "Yes. Select or drop multiple images and each one will become a separate page in the PDF.",
        },
        {
          question: "Are my images uploaded to a server?",
          answer:
            "No. This converter runs in your browser, so the PDF is created locally on your device.",
        },
        {
          question: "What page size does the PDF use?",
          answer:
            "The PDF uses A4 pages by default and keeps each image centered with its original aspect ratio.",
        },
      ]}
    />
  );
}
