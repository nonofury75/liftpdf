import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileQuestion,
  Library,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningResourceCard } from "@/components/learn/learning-resource-card";
import { siteConfig } from "@/config/site";
import {
  commonProblemGuides,
  featuredLearningGuides,
  learningTopics,
  popularHowToGuides,
} from "@/data/learning-center";
import { glossaryTerms } from "@/data/pdf-glossary";

export const metadata: Metadata = {
  title: {
    absolute: "LiftPDF Learning Center | PDF Guides, Help and Glossary",
  },
  description:
    "Learn how PDF files work, solve common PDF problems and find practical guides for converting, organizing, securing and editing PDFs in your browser.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "LiftPDF Learning Center",
    description:
      "PDF guides, troubleshooting, glossary definitions and practical resources for browser-based PDF workflows.",
    url: `${siteConfig.url}/learn`,
    images: [
      {
        url: "/images/learn/learning-center-hero.webp",
        width: 1200,
        height: 720,
        alt: "LiftPDF Learning Center editorial visual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LiftPDF Learning Center",
    description:
      "Learn how to convert, organize, secure and understand PDF files.",
    images: ["/images/learn/learning-center-hero.webp"],
  },
};

export default function LearnPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "LiftPDF Learning Center",
        description: metadata.description,
        url: `${siteConfig.url}/learn`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Learning Center",
            item: `${siteConfig.url}/learn`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="bg-background">
        <section className="border-b border-border bg-muted/35">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-primary">
                PDF knowledge base
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
                LiftPDF Learning Center
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                Practical PDF guides, troubleshooting help and plain-English
                explanations for people who want to finish a document task
                without guessing.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/guides">
                    Browse guides
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/pdf-tools">Explore PDF tools</Link>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm">
              <Image
                src="/images/learn/learning-center-hero.webp"
                alt="LiftPDF Learning Center visual with guides, tools and PDF workflow cards"
                width={1200}
                height={720}
                priority
                className="h-auto w-full rounded-2xl"
                sizes="(min-width: 1024px) 620px, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="py-14" aria-labelledby="learning-paths">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Guided paths
            </p>
            <h2 id="learning-paths" className="mt-2 text-3xl font-bold">
              Follow a path instead of guessing the next article
            </h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <LearningPath
                title="New to PDF"
                description="Start with the format, then learn how scans, images and tools fit together."
                links={[
                  { label: "What Is a PDF?", href: "/guides/what-is-a-pdf" },
                  { label: "Scanned vs Searchable PDF", href: "/guides/scanned-pdf-vs-searchable-pdf" },
                  { label: "JPG vs PNG", href: "/guides/jpg-vs-png" },
                  { label: "PDF Glossary", href: "/pdf-glossary" },
                ]}
              />
              <LearningPath
                title="Working with documents"
                description="Prepare files for sending, submission or review without changing more than needed."
                links={[
                  { label: "How to Merge PDF Files", href: "/guides/how-to-merge-pdf" },
                  { label: "Extract Pages From a PDF", href: "/guides/how-to-extract-pages-from-pdf" },
                  { label: "Reduce PDF Size for Email", href: "/guides/how-to-reduce-pdf-file-size-for-email" },
                  { label: "Organize Pages Before Sending", href: "/guides/how-to-organize-pdf-pages-before-sending" },
                ]}
              />
              <LearningPath
                title="Sensitive files"
                description="Understand browser processing, passwords and what LiftPDF can honestly do."
                links={[
                  { label: "Browser-Based Processing", href: "/guides/what-is-browser-based-pdf-processing" },
                  { label: "Password-Protected PDFs", href: "/guides/what-is-a-password-protected-pdf" },
                  { label: "Why a PDF Is Password Protected", href: "/guides/why-a-pdf-is-password-protected" },
                  { label: "PDF Security Hub", href: "/learn/pdf-security" },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="py-14" aria-labelledby="featured-guides">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-normal text-primary">
                  Featured guides
                </p>
                <h2 id="featured-guides" className="mt-2 text-3xl font-bold">
                  Start with the most useful resources
                </h2>
              </div>
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 font-semibold text-primary"
              >
                View all guides
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredLearningGuides.map((guide, index) => (
                <LearningResourceCard
                  key={guide.href}
                  guide={guide}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/35 py-14" aria-labelledby="browse-topic">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Browse by topic
            </p>
            <h2 id="browse-topic" className="mt-2 text-3xl font-bold">
              Learn by the task you are trying to finish
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {learningTopics.map((topic) => (
                <Link
                  key={topic.href}
                  href={topic.href}
                  className="group rounded-3xl border border-border bg-background p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
                >
                  <Image
                    src={topic.image.src}
                    alt={topic.image.alt}
                    width={topic.image.width}
                    height={topic.image.height}
                    className="aspect-[16/9] rounded-2xl object-cover"
                    sizes="(min-width: 1024px) 260px, 50vw"
                  />
                  <h3 className="mt-4 text-lg font-bold">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {topic.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <ContentList
              icon={BookOpen}
              title="Popular how-to guides"
              items={popularHowToGuides}
            />
            <ContentList
              icon={FileQuestion}
              title="Common PDF problems"
              items={commonProblemGuides}
            />
          </div>
        </section>

        <section className="bg-muted/35 py-14">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Library className="size-5 text-primary" aria-hidden="true" />
                <h2 className="text-2xl font-bold">Glossary preview</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Look up the terms that appear in PDF tools, from encryption to
                OCR and selectable text.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {glossaryTerms.slice(0, 10).map((term) => (
                  <Link
                    key={term.slug}
                    href={`/pdf-glossary#${term.slug}`}
                    className="rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {term.term}
                  </Link>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/pdf-glossary">Open PDF Glossary</Link>
              </Button>
            </div>

            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
                <h2 className="text-2xl font-bold">
                  Privacy and browser processing
                </h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                LiftPDF tools are designed around local browser processing. The
                Learning Center explains where that helps, where browser limits
                still matter and when password-protected files need special
                handling.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/guides/what-is-browser-based-pdf-processing">
                    Learn how it works
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/help">Open Help Center</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function LearningPath({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: { label: string; href: string }[];
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Workflow className="size-5 text-primary" aria-hidden="true" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <ol className="mt-5 grid gap-3">
        {links.map((link, index) => (
          <li key={link.href} className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {index + 1}
            </span>
            <Link
              href={link.href}
              className="pt-1 text-sm font-semibold text-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ContentList({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof BookOpen;
  title: string;
  items: typeof popularHowToGuides;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="mt-5 grid gap-3">
        {items.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="font-semibold">{guide.title}</span>
            <span className="mt-1 block text-sm leading-6 text-muted-foreground">
              {guide.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
