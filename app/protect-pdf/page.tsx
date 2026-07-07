import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ProtectPdfTool } from "@/components/tools/protect-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Protect PDF Online Free | Add Password to PDF | LiftPDF";
const description =
  "Protect a PDF with a password online for free. Encrypt your PDF locally in your browser without uploading your file.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/protect-pdf" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/protect-pdf`,
    images: [{ url: "/images/seo/protect-pdf/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Protect PDF" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/protect-pdf/og-image.webp"] },
};

export default function ProtectPdfPage() {
  return (
    <ToolPageShell
      title="Protect PDF"
      description="Add a real password to a PDF with local browser encryption and no file upload."
      seoTitle="Protect a PDF with a password online"
      seoText="LiftPDF uses QPDF compiled to WebAssembly to apply real PDF password encryption locally in your browser. Your file and password are never uploaded to a server."
      currentHref="/protect-pdf"
      premiumContent={premiumToolContent.protectPdf}
      faq={[
        {
          question: "Can I protect a PDF for free?",
          answer:
            "Yes. Protect PDF is free to use directly in your browser.",
        },
        {
          question: "Are my PDFs uploaded?",
          answer:
            "No. Your PDF stays on your device and is encrypted locally in the browser.",
        },
        {
          question: "Is the password added locally?",
          answer:
            "Yes. LiftPDF runs the encryption engine in your browser and does not send your password to a backend.",
        },
        {
          question: "Can I remove the password later?",
          answer:
            "You can remove a PDF password later with an unlock tool if you know the correct password.",
        },
        {
          question: "Does this encrypt the PDF?",
          answer:
            "Yes. The exported file uses real PDF password encryption and requires the password when opened in PDF viewers.",
        },
      ]}
    >
      <ProtectPdfTool />
    </ToolPageShell>
  );
}
