import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ImageToPdfPage } from "@/components/tools/image-to-pdf-page";

export const metadata: Metadata = {
  title: {
    absolute: "PNG to PDF Converter - Free Online Tool | LiftPDF",
  },
  description:
    "Convert PNG images to a PDF online for free. Add multiple images, reorder pages and download an A4 PDF instantly.",
  alternates: {
    canonical: "/png-to-pdf",
  },
  openGraph: {
    title: "PNG to PDF Converter - Free Online Tool | LiftPDF",
    description: "Convert PNG images to a PDF online for free with LiftPDF.",
    url: `${siteConfig.url}/png-to-pdf`,
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG to PDF Converter - Free Online Tool | LiftPDF",
    description: "Convert PNG images to a PDF online for free with LiftPDF.",
  },
};

export default function PngToPdfPage() {
  return (
    <ImageToPdfPage
      title="PNG to PDF Converter"
      intro="Convert PNG images into a clean PDF file with drag and drop, previews and simple ordering controls."
      seoText="Use LiftPDF to create a PDF from PNG images without installing software. The conversion happens locally in your browser and preserves the image ratio on A4 pages."
      downloadFileName="png-to-pdf.pdf"
      currentHref="/png-to-pdf"
      faq={[
        {
          question: "Can transparent PNG images be converted?",
          answer:
            "Yes. PNG files can be added and converted into PDF pages directly in the browser.",
        },
        {
          question: "Can I change the order before converting?",
          answer:
            "Yes. Use the up and down controls beside each image to set the page order.",
        },
        {
          question: "Do I need to install anything?",
          answer: "No. The PNG to PDF converter works online in your browser.",
        },
      ]}
    />
  );
}
