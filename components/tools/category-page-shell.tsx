import Link from "next/link";
import Image from "next/image";
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
  intro?: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  chooseTools?: {
    title: string;
    description: string;
    items: {
      tool: string;
      href: string;
      useWhen: string;
      avoidWhen?: string;
    }[];
  };
  commonTasks?: {
    title: string;
    tasks: {
      title: string;
      text: string;
      href: string;
    }[];
  };
  workflow?: {
    title: string;
    steps: {
      title: string;
      text: string;
    }[];
  };
  screenshots?: {
    title: string;
    description: string;
    images: {
      src: string;
      alt: string;
      width: number;
      height: number;
      label: string;
    }[];
  };
  guides?: {
    title: string;
    links: {
      label: string;
      href: string;
      text: string;
    }[];
  };
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
  intro,
  chooseTools,
  commonTasks,
  workflow,
  screenshots,
  guides,
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
        "@type": "Article",
        headline: seoTitle,
        description: seoText,
        mainEntityOfPage: `${siteConfig.url}${canonical}`,
        author: {
          "@type": "Organization",
          name: siteConfig.name,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
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

      {intro ? (
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-primary">
                {intro.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
                {intro.title}
              </h2>
            </div>
            <div className="space-y-4 text-base leading-8 text-muted-foreground">
              {intro.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {chooseTools ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Tool selection
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
              {chooseTools.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              {chooseTools.description}
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {chooseTools.items.map((item) => (
              <Link
                key={`${item.href}-${item.tool}`}
                href={item.href}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="text-lg font-bold text-foreground">
                  {item.tool}
                </span>
                <span className="mt-2 block text-sm font-semibold text-primary">
                  Use when
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {item.useWhen}
                </span>
                {item.avoidWhen ? (
                  <>
                    <span className="mt-3 block text-sm font-semibold text-muted-foreground">
                      Choose another tool when
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {item.avoidWhen}
                    </span>
                  </>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {commonTasks ? (
        <section className="border-y border-border bg-muted/35">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-normal text-foreground">
              {commonTasks.title}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {commonTasks.tasks.map((task) => (
                <Link
                  key={task.href}
                  href={task.href}
                  className="rounded-2xl border border-border bg-background p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <span className="font-bold text-foreground">{task.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                    {task.text}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {workflow ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-normal text-foreground">
            {workflow.title}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {workflow.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {screenshots ? (
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-normal text-primary">
                Real LiftPDF workflow
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
                {screenshots.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {screenshots.description}
              </p>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {screenshots.images.map((image) => (
                <figure
                  key={image.src}
                  className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="h-auto w-full rounded-2xl border border-border/70"
                    sizes="(min-width: 1024px) 580px, 100vw"
                  />
                  <figcaption className="px-2 py-3 text-sm font-semibold text-muted-foreground">
                    {image.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {guides ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-normal text-foreground">
            {guides.title}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.links.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="font-bold text-foreground">{guide.label}</span>
                <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                  {guide.text}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

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
