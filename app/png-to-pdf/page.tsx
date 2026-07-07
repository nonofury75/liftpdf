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
      intro="Convert PNG images into a clean PDF directly in your browser."
      seoText="Use LiftPDF to create a PDF from PNG images without installing software. The conversion happens locally in your browser, centers each PNG on the page and uses a white PDF page background for transparent images."
      downloadFileName="png-to-pdf.pdf"
      currentHref="/png-to-pdf"
      acceptedImageTypes={["image/png"]}
      addMoreAriaLabel="Add more PNG images"
      invalidFileMessage="Only PNG files are supported."
      uploadButtonLabel="Choose PNG files"
      uploadTitle="Drop your PNG images here."
      uploadDescription="Drop your PNG images here or choose PNG files. Each PNG will become one PDF page."
      faq={[
        {
          question: "Can transparent PNG images be converted?",
          answer:
            "Yes. Transparent PNG files can be converted directly in the browser. The PDF page uses a white background.",
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
