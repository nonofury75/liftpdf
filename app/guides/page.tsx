import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, FileQuestion, Layers3, Scale } from "lucide-react";
import { GuideSearch } from "@/components/learn/guide-search";
import { LearningResourceCard } from "@/components/learn/learning-resource-card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  featuredLearningGuides,
  learningGuides,
  learningTopics,
} from "@/data/learning-center";

export const metadata: Metadata = {
  title: { absolute: "PDF Guides | LiftPDF Learning Center" },
  description:
    "Browse practical PDF guides for converting, merging, extracting, securing, troubleshooting and understanding PDF files.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "PDF Guides | LiftPDF",
    description:
      "Practical PDF tutorials, troubleshooting resources and format explanations from LiftPDF.",
    url: `${siteConfig.url}/guides`,
    images: [
      {
        url: "/images/learn/learning-center-hero.webp",
        width: 1200,
        height: 720,
        alt: "LiftPDF PDF guides library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Guides | LiftPDF",
    description: "Browse practical PDF guides and troubleshooting resources.",
    images: ["/images/learn/learning-center-hero.webp"],
  },
};

export default function GuidesIndexPage() {
  const featuredStory = learningGuides.find(
    (guide) => guide.slug === "what-is-a-pdf",
  ) || featuredLearningGuides[0];
  const latestGuides = [...learningGuides]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 6);
  const troubleshootingGuides = learningGuides
    .filter((guide) => guide.category === "troubleshooting")
    .slice(0, 5);
  const comparisonGuides = learningGuides
    .filter((guide) => guide.category === "comparisons")
    .slice(0, 5);
  const basicsGuides = learningGuides
    .filter((guide) => guide.category === "pdf-basics")
    .slice(0, 5);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "PDF Guides",
        description: metadata.description,
        url: `${siteConfig.url}/guides`,
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
          {
            "@type": "ListItem",
            position: 3,
            name: "PDF Guides",
            item: `${siteConfig.url}/guides`,
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
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Learning library
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
              PDF guides for real document tasks
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Find tutorials, troubleshooting pages, comparisons and foundation
              explanations that connect directly to LiftPDF tools.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/learn">
                  Learning Center
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pdf-tools">Open PDF tools</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-14" aria-labelledby="featured-editorial">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <Link
              href={featuredStory.href}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
            >
              <Image
                src={featuredStory.image.src}
                alt={featuredStory.image.alt}
                width={featuredStory.image.width}
                height={featuredStory.image.height}
                priority
                className="aspect-[16/8] w-full object-cover"
                sizes="(min-width: 1024px) 760px, 100vw"
              />
              <div className="p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-normal text-primary">
                  Featured article
                </p>
                <h2
                  id="featured-editorial"
                  className="mt-3 text-3xl font-bold tracking-normal"
                >
                  {featuredStory.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {featuredStory.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">
                  Read the guide
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </Link>

            <div className="grid gap-4">
              <EditorialFolder
                icon={Layers3}
                title="Popular PDF tasks"
                description="Merge, extract, compress and prepare files without guessing."
                href="/learn/organize-pdf"
              />
              <EditorialFolder
                icon={FileQuestion}
                title="Troubleshooting corner"
                description="Fix blank PDFs, protected files, huge PDFs and blurry image output."
                href="/learn/troubleshooting"
              />
              <EditorialFolder
                icon={Scale}
                title="Format comparisons"
                description="Choose between PDF, JPG, PNG and related workflows."
                href="/learn/comparisons"
              />
            </div>
          </div>
        </section>

        <section className="bg-muted/35 py-14" aria-labelledby="most-useful-guides">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" aria-hidden="true" />
              <h2 id="most-useful-guides" className="text-3xl font-bold">
                Most useful PDF guides
              </h2>
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

        <section className="py-14" aria-labelledby="editorial-sections">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Browse by editorial need
            </p>
            <h2 id="editorial-sections" className="mt-2 text-3xl font-bold">
              Different paths for different document problems
            </h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <GuideColumn title="Latest resources" guides={latestGuides} />
              <GuideColumn title="Common problems" guides={troubleshootingGuides} />
              <GuideColumn title="PDF basics and comparisons" guides={[...basicsGuides, ...comparisonGuides].slice(0, 6)} />
            </div>
          </div>
        </section>

        <GuideSearch guides={learningGuides} topics={learningTopics} />
      </main>
    </>
  );
}

function EditorialFolder({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: typeof Layers3;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-border bg-background p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
    >
      <Icon className="size-6 text-primary" aria-hidden="true" />
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}

function GuideColumn({
  title,
  guides,
}: {
  title: string;
  guides: typeof learningGuides;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="mt-5 grid gap-3">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="text-sm font-semibold text-primary">
              {guide.categoryLabel}
            </span>
            <span className="mt-1 block font-semibold text-foreground">
              {guide.title}
            </span>
            <span className="mt-1 block text-sm leading-6 text-muted-foreground">
              {guide.readingMinutes} min read
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
