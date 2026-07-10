import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { TrustCards } from "@/components/trust/trust-cards";
import { TrustPageShell } from "@/components/trust/trust-page-shell";

const title = "Why LiftPDF | Private PDF Tools in Your Browser";
const description =
  "Compare LiftPDF with typical online converters and learn why browser processing, no upload and modern UX matter.";

const comparisonRows = [
  ["File handling", "Processed locally by current tools", "Often uploaded to a remote server"],
  ["Privacy model", "No document storage for current tools", "Depends on provider policy"],
  ["Speed", "Starts after file selection", "Can wait for upload and processing queues"],
  ["Account", "No registration required", "May require account or trial for some actions"],
  ["Transparency", "Browser-side behavior is explained", "Processing model is often less visible"],
];

const faq = [
  {
    question: "Is LiftPDF better than every online converter?",
    answer:
      "Not for every workflow. Some advanced conversions may require server-side engines. LiftPDF is strongest when browser-side processing is practical and privacy matters.",
  },
  {
    question: "Why is no upload important?",
    answer:
      "Skipping document upload reduces exposure, avoids remote processing queues and makes the privacy model easier to understand.",
  },
  {
    question: "Does LiftPDF replace Adobe Acrobat?",
    answer:
      "No. Adobe Acrobat is a full professional PDF platform. LiftPDF focuses on fast browser-based tools for common online PDF tasks.",
  },
];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/why-liftpdf" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/why-liftpdf`,
    images: [
      {
        url: "/images/seo/trust/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Why LiftPDF browser-based PDF tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/seo/trust/og-image.svg"],
  },
};

export default function WhyLiftPdfPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        url: `${siteConfig.url}/why-liftpdf`,
        description,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Why LiftPDF",
            item: `${siteConfig.url}/why-liftpdf`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <TrustPageShell
      eyebrow="Why LiftPDF"
      title="A private way to work with PDFs"
      description="LiftPDF is designed for people who want fast PDF tools without sending every document to a remote conversion server."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:px-8">
        <TrustCards />

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold tracking-normal text-foreground">
            LiftPDF vs typical online converters
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <div className="grid grid-cols-[0.9fr_1.1fr_1.1fr] bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground">
              <span>Topic</span>
              <span>LiftPDF</span>
              <span>Typical converter</span>
            </div>
            {comparisonRows.map(([topic, liftpdf, other]) => (
              <div
                key={topic}
                className="grid grid-cols-[0.9fr_1.1fr_1.1fr] gap-3 border-t border-border px-4 py-4 text-sm"
              >
                <span className="font-semibold text-foreground">{topic}</span>
                <span className="flex gap-2 text-muted-foreground">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {liftpdf}
                </span>
                <span className="text-muted-foreground">{other}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Privacy",
              text: "The current tools avoid document uploads and process files locally.",
            },
            {
              title: "Speed",
              text: "Local processing starts quickly because there is no upload queue.",
            },
            {
              title: "Modern UX",
              text: "LiftPDF keeps upload, preview, options and download states clear.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-border bg-muted/35 p-6"
            >
              <h2 className="text-xl font-bold tracking-normal text-foreground">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.text}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold tracking-normal text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {faq.map((item) => (
              <article key={item.question}>
                <h3 className="font-semibold text-foreground">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-muted/35 p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-normal text-foreground">
            Start with a real tool
          </h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-primary sm:grid-cols-4">
            <Link href="/jpg-to-pdf">JPG to PDF</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/protect-pdf">Protect PDF</Link>
            <Link href="/pdf-tools">All tools</Link>
          </div>
        </section>
      </main>
    </TrustPageShell>
  );
}
