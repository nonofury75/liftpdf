import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
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

        <section className="py-14" aria-labelledby="most-useful-guides">
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

        <GuideSearch guides={learningGuides} topics={learningTopics} />
      </main>
    </>
  );
}
