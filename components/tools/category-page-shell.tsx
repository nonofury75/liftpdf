import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getToolsByCategory, toolCategories } from "@/data/tools";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolFaq, type ToolFaqItem } from "@/components/tools/tool-faq";
import { ToolHero } from "@/components/tools/tool-hero";
import { ToolSeoBlock } from "@/components/tools/tool-seo-block";
import type { ToolCategory } from "@/types/tools";

type CategoryPageShellProps = {
  title: string;
  description: string;
  canonical: string;
  category: ToolCategory;
  seoTitle: string;
  seoText: string;
  faq: ToolFaqItem[];
};

const categoryLinks = [
  { label: "Convert PDF", href: "/pdf-converter" },
  { label: "Edit PDF", href: "/pdf-editor" },
  { label: "Organize PDF", href: "/organize-pdf" },
  { label: "Image Tools", href: "/pdf-image-tools" },
  { label: "Security", href: "/pdf-security" },
];

export function CategoryPageShell({
  title,
  description,
  canonical,
  category,
  seoTitle,
  seoText,
  faq,
}: CategoryPageShellProps) {
  const pageTools = getToolsByCategory(category);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: title,
        url: `${siteConfig.url}${canonical}`,
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
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: `${siteConfig.url}${canonical}`,
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
      <ToolHero title={title} description={description} />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/pdf-tools">
              Browse all tools
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#category-tools">View {category} tools</Link>
          </Button>
        </div>

        <div id="category-tools" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-normal text-foreground">
              Related categories
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <ToolSeoBlock title={seoTitle} text={seoText} />
            <ToolFaq items={faq} />
          </div>
          <div className="sr-only">
            {toolCategories.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
