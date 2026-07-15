import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { helpCategories } from "@/data/help-center";

export const metadata: Metadata = {
  title: { absolute: "Help Center | LiftPDF" },
  description:
    "Get help with LiftPDF uploads, PDF passwords, browser processing, downloads, common errors, mobile use, privacy and large files.",
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Help Center | LiftPDF",
    description:
      "Find practical answers for common LiftPDF questions and PDF workflow problems.",
    url: `${siteConfig.url}/help`,
    images: [
      {
        url: "/images/learn/learning-center-hero.webp",
        width: 1200,
        height: 720,
        alt: "LiftPDF Help Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center | LiftPDF",
    description: "Find practical answers for common LiftPDF questions.",
    images: ["/images/learn/learning-center-hero.webp"],
  },
};

export default function HelpPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "LiftPDF Help Center",
        description: metadata.description,
        url: `${siteConfig.url}/help`,
      },
      {
        "@type": "FAQPage",
        mainEntity: helpCategories.flatMap((category) =>
          category.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        ),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Help Center",
            item: `${siteConfig.url}/help`,
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
              Help Center
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
              Help for common PDF workflows
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Find quick answers about uploads, downloads, passwords, privacy,
              mobile use and common PDF errors.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/pdf-tools">
                  Open PDF tools
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact support</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
            <nav
              aria-label="Help categories"
              className="rounded-3xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit"
            >
              <h2 className="font-bold">Categories</h2>
              <div className="mt-4 grid gap-2 text-sm">
                {helpCategories.map((category) => (
                  <a
                    key={category.slug}
                    href={`#${category.slug}`}
                    className="rounded-xl px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {category.title}
                  </a>
                ))}
              </div>
            </nav>

            <div className="space-y-8">
              {helpCategories.map((category) => (
                <section
                  key={category.slug}
                  id={category.slug}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <CircleHelp
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-background">
                    {category.items.map((item) => (
                      <details key={item.question} className="p-5">
                        <summary className="cursor-pointer list-none font-semibold">
                          {item.question}
                        </summary>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {item.answer}
                        </p>
                        {item.links?.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/5"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
