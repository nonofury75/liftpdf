import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ImageToPdfPage } from "@/components/tools/image-to-pdf-page";

export const metadata: Metadata = {
  title: {
    absolute: "Images to PDF Converter - Free Online Tool | LiftPDF",
  },
  description:
    "Convert JPG, PNG and WEBP images to PDF online. Upload multiple images, reorder them and download one PDF file.",
  alternates: {
    canonical: "/images-to-pdf",
  },
  openGraph: {
    title: "Images to PDF Converter - Free Online Tool | LiftPDF",
    description: "Convert JPG, PNG and WEBP images to PDF online with LiftPDF.",
    url: `${siteConfig.url}/images-to-pdf`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Images to PDF Converter - Free Online Tool | LiftPDF",
    description: "Convert JPG, PNG and WEBP images to PDF online with LiftPDF.",
  },
};

export default function ImagesToPdfPage() {
  return (
    <ImageToPdfPage
      title="Images to PDF Converter"
      intro="Combine JPG, JPEG, PNG and WEBP images into one PDF file in a few clicks."
      seoText="The LiftPDF images to PDF converter creates a PDF from common image formats on your device. Add images, remove files you do not need, reorder pages and download the final PDF."
      downloadFileName="images.pdf"
      currentHref="/images-to-pdf"
      compactHero
      compactRelatedTools
      presentation="showcase"
      faq={[
        {
          question: "Which image formats are supported?",
          answer:
            "You can use JPG, JPEG, PNG and WEBP files with this converter.",
        },
        {
          question: "Will every image become a PDF page?",
          answer:
            "Yes. Each selected image is placed on its own A4 page in the final PDF.",
        },
        {
          question: "Is the conversion private?",
          answer:
            "Yes. The PDF is generated client-side in your browser without a backend API.",
        },
      ]}
    />
  );
}
