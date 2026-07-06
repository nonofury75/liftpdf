import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { tools } from "@/data/tools";
import { Button } from "@/components/ui/button";
import { ToolCatalog } from "@/components/tools/tool-catalog";
import { ToolFaq } from "@/components/tools/tool-faq";
import { ToolHero } from "@/components/tools/tool-hero";

const title = "All PDF Tools Online | LiftPDF";
const description =
  "Everything you need to edit, convert, organize and secure PDF files directly in your browser.";

const faq = [
  {
    question: "Are LiftPDF tools free?",
    answer:
      "Yes. The available LiftPDF tools are free to use directly in your browser.",
  },
  {
    question: "Are my files uploaded?",
    answer:
      "No. LiftPDF is designed for browser-side processing, so your documents stay on your device.",
  },
  {
    question: "Which tools are available now?",
    answer:
      "LiftPDF currently includes image to PDF, merge, split, compress, rotate, watermark, page numbers and PDF to image tools.",
  },
];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/pdf-tools" },
  openGraph: { title, description, url: `${siteConfig.url}/pdf-tools` },
  twitter: { card: "summary_large_image", title, description },
};

export default function PdfToolsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "All PDF Tools",
        url: `${siteConfig.url}/pdf-tools`,
        description,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "PDF Tools",
            item: `${siteConfig.url}/pdf-tools`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ToolHero title="All PDF Tools" description={description} />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="#browse-tools">Browse tools</Link>
          </Button>
          <Button asChild>
            <Link href="/merge-pdf">
              Start with Merge PDF
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <ToolCatalog tools={tools} />
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <ToolFaq items={faq} />
        </div>
      </section>
    </div>
  );
}
