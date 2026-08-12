import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "PDF Security Tools - Protect and Unlock PDFs | LiftPDF";
const description =
  "Add PDF passwords, remove known PDF passwords and handle restricted PDFs with browser-side security tools from LiftPDF.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/pdf-security" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/pdf-security`,
    images: [
      {
        url: "/images/seo/categories/security-og.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF PDF security tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/categories/security-og.svg"],
  },
};

export default function PdfSecurityPage() {
  return (
    <CategoryPageShell
      title={title}
      description={description}
      canonical="/pdf-security"
      category="Security"
      seoTitle="Privacy-first PDF security"
      seoText="LiftPDF security tools are built for practical document workflows: add real PDF encryption with QPDF WASM, remove protection only when you know the valid password, and keep sensitive files in the browser instead of sending them to a server."
      intro={{
        eyebrow: "PDF security",
        title: "Protect, unlock and understand sensitive PDFs",
        paragraphs: [
          "PDF security is not one single feature. A document may need an open password, an owner password, printing restrictions, copy restrictions or a visible watermark before it is shared.",
          "LiftPDF keeps the security workflow simple: protect a file before sending it, unlock a file only when you have the valid password or permission, and read clear guidance about what PDF permissions can and cannot guarantee.",
        ],
      }}
      chooseTools={{
        title: "Choose the right PDF security tool",
        description:
          "Use the tool that matches the protection you actually need. LiftPDF does not bypass unknown passwords or claim that PDF permissions are the same as DRM.",
        items: [
          {
            tool: "Protect PDF",
            href: "/protect-pdf",
            useWhen:
              "You want to add an open password, an owner password or compatible-reader permissions before sharing a PDF.",
            avoidWhen:
              "You need a legally binding signature workflow or enterprise document management.",
          },
          {
            tool: "Unlock PDF",
            href: "/unlock-pdf",
            useWhen:
              "You know the valid open password or owner password and need an unlocked copy for your own authorized workflow.",
            avoidWhen:
              "You do not know the password or do not have permission to remove restrictions.",
          },
          {
            tool: "Watermark PDF",
            href: "/watermark-pdf",
            useWhen:
              "You need a visible text or image mark on a document before review, approval or sharing.",
          },
          {
            tool: "PDF to Text",
            href: "/pdf-to-text",
            useWhen:
              "You need selectable text from an accessible PDF and want to avoid uploading the document.",
            avoidWhen: "The document is scanned and needs OCR.",
          },
        ],
      }}
      commonTasks={{
        title: "Common PDF security tasks",
        tasks: [
          {
            title: "Add a PDF password",
            text: "Encrypt a PDF with a password before sending it by email or storing it in a shared folder.",
            href: "/protect-pdf",
          },
          {
            title: "Remove known restrictions",
            text: "Use a valid owner password to remove restrictions from a PDF you are authorized to change.",
            href: "/unlock-pdf",
          },
          {
            title: "Understand browser processing",
            text: "Learn why local processing matters when a PDF contains confidential or personal information.",
            href: "/guides/what-is-browser-based-pdf-processing",
          },
          {
            title: "Prepare sensitive files",
            text: "Review password, watermark and file-size decisions before sending confidential documents.",
            href: "/guides/protect-pdf-before-sending",
          },
        ],
      }}
      workflow={{
        title: "A safer PDF sharing workflow",
        steps: [
          {
            title: "Check the document",
            text: "Remove pages you do not need, verify the content and decide whether the recipient needs editing rights.",
          },
          {
            title: "Apply protection",
            text: "Use Protect PDF for encryption and permissions, or add a watermark when the document needs a visible handling label.",
          },
          {
            title: "Keep passwords separate",
            text: "Share the PDF and its password through different channels when the document is sensitive.",
          },
        ],
      }}
      guides={{
        title: "Security guides",
        links: [
          {
            label: "How to password protect a PDF before sharing",
            href: "/guides/protect-pdf-before-sending",
            text: "When to use an open password, an owner password and permission controls.",
          },
          {
            label: "How to remove a PDF password you know",
            href: "/guides/unlock-pdf-with-known-password",
            text: "A practical workflow for authorized PDF unlocking.",
          },
          {
            label: "What is a password-protected PDF?",
            href: "/guides/what-is-a-password-protected-pdf",
            text: "The difference between encryption, restrictions and compatible-reader behavior.",
          },
          {
            label: "Browser-based PDF processing",
            href: "/guides/what-is-browser-based-pdf-processing",
            text: "Why local processing can reduce exposure for sensitive documents.",
          },
          {
            label: "How to share sensitive PDFs safely",
            href: "/guides/protect-pdf-before-sending",
            text: "A checklist for sending confidential files without overpromising security.",
          },
        ],
      }}
      faq={[
        {
          question: "Can LiftPDF protect a PDF with a real password?",
          answer:
            "Yes. Protect PDF uses QPDF WASM in the browser to add PDF encryption with a user password and optional owner-password permissions.",
        },
        {
          question: "Can LiftPDF unlock any PDF?",
          answer:
            "No. Unlock PDF only works when you know the valid open password or owner password, or when the PDF does not require a password for authorized decryption.",
        },
        {
          question: "Are PDF permissions the same as DRM?",
          answer:
            "No. PDF permissions depend on compatible readers respecting them. They are useful for document handling but should not be treated as unbreakable DRM.",
        },
        {
          question: "Are passwords uploaded to LiftPDF?",
          answer:
            "No. Password handling for Protect PDF and Unlock PDF happens locally in your browser.",
        },
        {
          question: "Can LiftPDF add digital signatures?",
          answer:
            "No. Sign PDF is not a live LiftPDF tool in V1, so it remains non-clickable until a real signing workflow exists.",
        },
      ]}
    />
  );
}
