import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Library } from "lucide-react";
import { siteConfig } from "@/config/site";
import { glossaryTerms } from "@/data/pdf-glossary";

export const metadata: Metadata = {
  title: { absolute: "PDF Glossary | LiftPDF" },
  description:
    "Plain-English PDF definitions for terms like OCR, compression, encryption, DPI, selectable text and browser processing.",
  alternates: { canonical: "/pdf-glossary" },
  openGraph: {
    title: "PDF Glossary | LiftPDF",
    description:
      "Understand common PDF terms before choosing a conversion, editing, security or organization workflow.",
    url: `${siteConfig.url}/pdf-glossary`,
    images: [
      {
        url: "/images/learn/pdf-basics.webp",
        width: 1200,
        height: 720,
        alt: "PDF glossary visual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Glossary | LiftPDF",
    description:
      "Plain-English PDF definitions for common document and file terms.",
    images: ["/images/learn/pdf-basics.webp"],
  },
};

export default function PdfGlossaryPage() {
  const letters = Array.from(
    new Set(glossaryTerms.map((item) => item.term[0].toUpperCase())),
  ).sort();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        name: "PDF Glossary",
        url: `${siteConfig.url}/pdf-glossary`,
        hasDefinedTerm: glossaryTerms.map((item) => ({
          "@type": "DefinedTerm",
          name: item.term,
          description: item.definition,
          url: `${siteConfig.url}/pdf-glossary#${item.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "PDF Glossary",
            item: `${siteConfig.url}/pdf-glossary`,
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
              Glossary
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
              PDF terms explained simply
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Look up the words that appear in PDF tools and guides. Each
              definition includes a practical example and a relevant LiftPDF
              resource.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Glossary letters"
              className="flex flex-wrap gap-2 rounded-3xl border border-border bg-card p-4 shadow-sm"
            >
              {letters.map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="grid size-9 place-items-center rounded-full border border-border bg-background text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {letter}
                </a>
              ))}
            </nav>

            <div className="mt-10 space-y-10">
              {letters.map((letter) => {
                const terms = glossaryTerms.filter(
                  (item) => item.term[0].toUpperCase() === letter,
                );

                return (
                  <section key={letter} id={`letter-${letter}`}>
                    <h2 className="text-3xl font-bold">{letter}</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {terms.map((item) => (
                        <article
                          key={item.slug}
                          id={item.slug}
                          className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Library
                              className="size-5 text-primary"
                              aria-hidden="true"
                            />
                            <h3 className="text-xl font-bold">{item.term}</h3>
                          </div>
                          <p className="mt-3 leading-7 text-muted-foreground">
                            {item.definition}
                          </p>
                          <p className="mt-4 rounded-2xl bg-muted/45 p-4 text-sm leading-6 text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              Example:
                            </span>{" "}
                            {item.example}
                          </p>
                          <Link
                            href={item.relatedHref}
                            className="mt-5 inline-flex items-center gap-2 font-semibold text-primary"
                          >
                            {item.relatedLabel}
                            <ArrowRight
                              className="size-4"
                              aria-hidden="true"
                            />
                          </Link>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
