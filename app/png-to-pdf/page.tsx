import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ImageToPdfPage } from "@/components/tools/image-to-pdf-page";
import { premiumToolContent } from "@/data/premium-tool-content";

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
    images: [
      {
        url: "/images/seo/png-to-pdf/og-image.webp",
        width: 1200,
        height: 630,
        alt: "LiftPDF PNG to PDF converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG to PDF Converter - Free Online Tool | LiftPDF",
    description: "Convert PNG images to a PDF online for free with LiftPDF.",
    images: ["/images/seo/png-to-pdf/og-image.webp"],
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
      premiumContent={premiumToolContent.pngToPdf}
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
          question: "Can I convert several PNG files into one PDF?",
          answer:
            "Yes. Add multiple PNG images and LiftPDF creates one PDF page for each image.",
        },
        {
          question: "Can I change the order before converting?",
          answer:
            "Yes. Use the up and down controls beside each image to set the page order.",
        },
        {
          question: "Can I choose margins and page size?",
          answer:
            "Yes. PNG to PDF supports Auto, A4 and Letter page sizes, portrait or landscape orientation, and no, small or large margins.",
        },
        {
          question: "Will PNG quality be preserved?",
          answer:
            "The PNG is placed into the PDF layout without an unnecessary server recompression step. The final result still depends on the page size and fit mode you choose.",
        },
        {
          question: "Are my PNG files uploaded?",
          answer:
            "No. The PDF is generated locally in your browser and the source PNG files are not uploaded to LiftPDF.",
        },
        {
          question: "Does PNG to PDF work on mobile?",
          answer:
            "Yes. You can upload, reorder, preview and convert PNG files from modern mobile browsers.",
        },
        {
          question: "Can I use JPG files on this page?",
          answer:
            "No. This page accepts PNG files only. Use JPG to PDF or Images to PDF for other image formats.",
        },
        {
          question: "Do I need to install anything?",
          answer:
            "No. The PNG to PDF converter runs in your browser without installing desktop software.",
        },
      ]}
    />
  );
}
