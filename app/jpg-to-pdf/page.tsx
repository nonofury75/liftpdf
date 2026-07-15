import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ImageToPdfPage } from "@/components/tools/image-to-pdf-page";
import { premiumToolContent } from "@/data/premium-tool-content";

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
    images: [
      {
        url: "/images/seo/jpg-to-pdf/jpg-to-pdf-og.webp",
        width: 1200,
        height: 630,
        alt: "LiftPDF JPG to PDF converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JPG to PDF Converter - Free Online Tool | LiftPDF",
    description: "Convert JPG images to a PDF online for free with LiftPDF.",
    images: ["/images/seo/jpg-to-pdf/jpg-to-pdf-og.webp"],
  },
};

export default function JpgToPdfPage() {
  return (
    <ImageToPdfPage
      title="JPG to PDF Converter"
      intro="Upload JPG or JPEG images, arrange them in the right order and convert them into a single PDF."
      seoText="LiftPDF lets you turn JPG images into a PDF directly in your browser. Choose the page size, orientation, margins and image fit, then download a clean document without sending your files to a server."
      downloadFileName="jpg-to-pdf.pdf"
      currentHref="/jpg-to-pdf"
      acceptedImageTypes={["image/jpeg"]}
      invalidFileMessage="Only JPG and JPEG files are supported here. Use Images to PDF for PNG, WEBP or mixed image formats."
      premiumContent={premiumToolContent.jpgToPdf}
      uploadDescription="Drop files here or choose files. Upload JPG or JPEG images. Each image will become one PDF page."
      uploadTitle="Drop your JPG images here"
      faq={[
        {
          question: "Can I convert multiple JPG files at once?",
          answer:
            "Yes. Select or drop multiple images and each one will become a separate page in the PDF.",
        },
        {
          question: "Can I reorder JPG images before converting?",
          answer:
            "Yes. Use the move controls in the image list to place files in the exact page order you want.",
        },
        {
          question: "Will image quality change?",
          answer:
            "LiftPDF embeds your images into the PDF page layout. Fit mode keeps the full image visible, while Fill can crop edges to cover the page.",
        },
        {
          question: "Can I choose A4 or Letter pages?",
          answer:
            "Yes. You can use Auto, A4 or Letter page size, plus portrait, landscape or automatic orientation.",
        },
        {
          question: "Are my images uploaded to a server?",
          answer:
            "No. This converter runs in your browser, so the PDF is created locally on your device.",
        },
        {
          question: "Does JPG to PDF work on mobile?",
          answer:
            "Yes. The tool works in modern mobile browsers, including Chrome, Safari, Edge and Firefox.",
        },
        {
          question: "Is there a file size limit?",
          answer:
            "There is no LiftPDF upload limit because files are not sent to a server. Very large images can still be limited by your device memory.",
        },
        {
          question: "Can I use the tool offline?",
          answer:
            "After the page has loaded, the conversion itself happens locally in your browser. A network connection may still be needed to load the site.",
        },
        {
          question: "Does it work on Windows and Mac?",
          answer:
            "Yes. JPG to PDF runs in the browser, so it works across Windows, macOS, Linux and mobile systems.",
        },
      ]}
    />
  );
}
