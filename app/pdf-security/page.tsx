import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CategoryPageShell } from "@/components/tools/category-page-shell";

const title = "PDF Security Tools | LiftPDF";
const description =
  "Protect and unlock PDF files with privacy-first browser PDF security tools.";

export const metadata: Metadata = {
  title: { absolute: `${title} - Secure PDF Tools Online` },
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
      seoText="LiftPDF is built around browser-side processing. Security tools are planned around the same principle: keep sensitive documents on your device whenever possible."
      faq={[
        {
          question: "Are PDF security tools available now?",
          answer:
            "Protect PDF and Unlock PDF are available now. Sign PDF is listed as coming soon and stays non-clickable until it is real.",
        },
        {
          question: "Why show coming soon security tools?",
          answer:
            "They make the product roadmap clear while keeping unavailable tools non-clickable.",
        },
      ]}
    />
  );
}
