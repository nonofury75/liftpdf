import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ImageToPdfPage } from "@/components/tools/image-to-pdf-page";
import { premiumToolContent } from "@/data/premium-tool-content";

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
    images: [
      {
        url: "/images/seo/images-to-pdf/og-image.webp",
        width: 1200,
        height: 630,
        alt: "LiftPDF Images to PDF converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Images to PDF Converter - Free Online Tool | LiftPDF",
    description: "Convert JPG, PNG and WEBP images to PDF online with LiftPDF.",
    images: ["/images/seo/images-to-pdf/og-image.webp"],
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
      premiumContent={premiumToolContent.imagesToPdf}
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
          question: "Can I mix JPG, PNG and WEBP in one PDF?",
          answer:
            "Yes. Add supported image formats together and arrange them in the order you want.",
        },
        {
          question: "Will every image become a PDF page?",
          answer:
            "Yes. Each selected image becomes its own page in the final PDF.",
        },
        {
          question: "Can I remove or reorder images?",
          answer:
            "Yes. You can delete images and move them before generating the PDF.",
        },
        {
          question: "Can I use Auto page size?",
          answer:
            "Yes. Auto keeps the PDF page close to the original image ratio. A4 and Letter are available when you need a standard document size.",
        },
        {
          question: "Should I use Fit or Fill?",
          answer:
            "Use Fit to keep the whole image visible. Use Fill when you want the page covered and cropping is acceptable.",
        },
        {
          question: "Are my images uploaded?",
          answer:
            "No. The PDF is generated client-side in your browser without a backend API.",
        },
        {
          question: "Does it work with large batches?",
          answer:
            "Yes for normal batches, but very large images or many files can be limited by your device memory.",
        },
        {
          question: "Can I convert on mobile?",
          answer:
            "Yes. The workflow is responsive and works on modern mobile browsers.",
        },
      ]}
    />
  );
}
