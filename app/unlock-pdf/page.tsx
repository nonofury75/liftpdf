import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { UnlockPdfTool } from "@/components/tools/unlock-pdf-tool";
import { premiumToolContent } from "@/data/premium-tool-content";

const title = "Unlock PDF Online Free | Remove PDF Password | LiftPDF";
const description =
  "Unlock a password-protected PDF online for free. Remove PDF password protection locally in your browser without uploading your file.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/unlock-pdf" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/unlock-pdf`,
    images: [{ url: "/images/seo/unlock-pdf/og-image.webp", width: 1200, height: 630, alt: "LiftPDF Unlock PDF" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/seo/unlock-pdf/og-image.webp"] },
};

export default function UnlockPdfPage() {
  return (
    <ToolPageShell
      title="Unlock PDF"
      description="Remove password protection from a PDF locally in your browser when you know the correct password."
      seoTitle="Unlock a password-protected PDF online"
      seoText="LiftPDF uses QPDF compiled to WebAssembly to decrypt protected PDFs locally in your browser. Enter the current password, remove encryption and download an unlocked copy without uploading your file."
      currentHref="/unlock-pdf"
      premiumContent={premiumToolContent.unlockPdf}
      faq={[
        {
          question: "Can I unlock a PDF for free?",
          answer: "Yes. Unlock PDF is free to use directly in your browser.",
        },
        {
          question: "Are my PDFs uploaded?",
          answer:
            "No. Your PDF and password stay on your device and are processed locally.",
        },
        {
          question: "Do I need to know the password?",
          answer:
            "Yes. LiftPDF cannot remove encryption without the correct PDF password.",
        },
        {
          question: "Does Unlock PDF remove encryption?",
          answer:
            "Yes. When the correct password is provided, LiftPDF exports a new PDF without the encryption dictionary.",
        },
        {
          question: "Is the unlocked PDF saved on your servers?",
          answer:
            "No. The unlocked PDF is generated in your browser and is not saved on LiftPDF servers.",
        },
      ]}
    >
      <UnlockPdfTool />
    </ToolPageShell>
  );
}
