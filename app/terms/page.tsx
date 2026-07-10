import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const title = "Terms of Use | LiftPDF";
const description =
  "Read the LiftPDF terms of use for free browser-based PDF tools, including acceptable use, limitations and privacy-first processing.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/terms" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/terms`,
    images: [
      {
        url: "/images/seo/trust/og-image.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF terms of use",
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

export default function TermsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${siteConfig.url}/terms`,
    description,
  };

  return (
    <main className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
          Terms of Use
        </h1>
        <p className="mt-5 text-lg leading-8 text-foreground/70">
          LiftPDF provides browser-based PDF tools for everyday document tasks.
          By using the site, you agree to use the tools responsibly and only
          with files you have the right to process.
        </p>

        <div className="mt-10 grid gap-6">
          {[
            {
              title: "Use of the tools",
              text: "LiftPDF tools are provided for lawful personal, educational and business document workflows. You are responsible for the files you select and the results you download.",
            },
            {
              title: "Browser-side processing",
              text: "The current tools are designed to run in your browser whenever possible. Some future tools may require different processing, and any meaningful change should be explained before use.",
            },
            {
              title: "No guarantee of perfect output",
              text: "PDF files can vary widely. LiftPDF aims to preserve quality, structure and privacy, but you should review downloaded files before relying on them for legal, financial or official submissions.",
            },
            {
              title: "Prohibited use",
              text: "Do not use LiftPDF to process files you do not have permission to use, to bypass rights you do not own, or for harmful, unlawful or abusive activity.",
            },
            {
              title: "Availability",
              text: "LiftPDF may change, improve, pause or remove parts of the service over time. The site is provided as-is without a guarantee of uninterrupted availability.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold tracking-normal text-foreground">
                {item.title}
              </h2>
              <p className="mt-3 leading-7 text-foreground/70">{item.text}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-muted/35 p-6">
          <h2 className="text-xl font-bold tracking-normal text-foreground">
            Questions
          </h2>
          <p className="mt-3 leading-7 text-foreground/70">
            For product, privacy or legal questions, use the contact page.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex font-semibold text-primary hover:text-primary/80"
          >
            Contact LiftPDF
          </Link>
        </section>
      </section>
    </main>
  );
}
