import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { tools } from "@/data/tools";
import { Button } from "@/components/ui/button";
import { ToolCatalog } from "@/components/tools/tool-catalog";
import { ToolFaq } from "@/components/tools/tool-faq";
import { ToolHero } from "@/components/tools/tool-hero";

const title = "All PDF Tools Online - 17 Browser PDF Tools | LiftPDF";
const description =
  "Browse 17 browser-based PDF tools to convert, merge, split, compress, edit, secure and extract PDF files without uploading your documents.";

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
      "LiftPDF includes 17 live tools for image to PDF conversion, PDF to image conversion, merging, splitting, compression, rotation, page numbers, watermarking, page deletion, page extraction, page reordering, password protection, unlocking and text extraction.",
  },
];

const toolGroups = [
  {
    title: "Convert images and PDFs",
    text: "Use these tools when you need to turn images into a PDF or export PDF pages as image files for sharing, previews or forms.",
    links: [
      { label: "JPG to PDF", href: "/jpg-to-pdf" },
      { label: "PNG to PDF", href: "/png-to-pdf" },
      { label: "Images to PDF", href: "/images-to-pdf" },
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
      { label: "PDF to PNG", href: "/pdf-to-png" },
    ],
  },
  {
    title: "Organize pages",
    text: "Use these tools when a document has the right content but the wrong order, too many pages or pages that need to be separated.",
    links: [
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Split PDF", href: "/split-pdf" },
      { label: "Extract Pages", href: "/extract-pages" },
      { label: "Delete Pages", href: "/delete-pages" },
      { label: "Reorder Pages", href: "/reorder-pages" },
    ],
  },
  {
    title: "Edit and finish a PDF",
    text: "Use these tools to reduce file size, rotate scans, add visible document marks or add page numbering before sending.",
    links: [
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Rotate PDF", href: "/rotate-pdf" },
      { label: "Watermark PDF", href: "/watermark-pdf" },
      { label: "Add Page Numbers", href: "/add-page-numbers" },
    ],
  },
  {
    title: "Secure and extract content",
    text: "Use these tools when you need password protection, authorized unlocking or selectable text from a PDF.",
    links: [
      { label: "Protect PDF", href: "/protect-pdf" },
      { label: "Unlock PDF", href: "/unlock-pdf" },
      { label: "PDF to Text", href: "/pdf-to-text" },
    ],
  },
];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/pdf-tools" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/pdf-tools`,
    images: [
      {
        url: "/images/seo/categories/pdf-tools-og.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF all PDF tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/categories/pdf-tools-og.svg"],
  },
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

      <section className="border-y border-border bg-muted/35">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Choose the right workflow
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
              PDF tools grouped by real document tasks
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              LiftPDF is organized around what you need to do with a file:
              convert it, organize its pages, finish it for sharing or secure
              it with a password. Planned tools may appear in the catalog as
              non-clickable roadmap items, but this page prioritizes the 17
              tools that are live today.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {toolGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-xl border border-border bg-background p-5 shadow-sm"
              >
                <h3 className="text-xl font-bold text-foreground">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {group.text}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <ToolFaq items={faq} />
        </div>
      </section>
    </div>
  );
}
