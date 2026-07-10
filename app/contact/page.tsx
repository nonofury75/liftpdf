import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";

const title = "Contact LiftPDF | Support and Product Questions";
const description =
  "Contact LiftPDF for product questions, feedback, privacy questions or security concerns about browser-based PDF tools.";

const contactEmail = "zidanegenelan75@gmail.com";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/contact`,
    images: [
      {
        url: "/images/seo/trust/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Contact LiftPDF",
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

export default function ContactPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: title,
    url: `${siteConfig.url}/contact`,
    description,
  };

  return (
    <main className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
          Contact LiftPDF
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground/70">
          Send product questions, bug reports, privacy questions or security
          concerns. Please do not attach private documents unless explicitly
          requested.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <Mail className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold tracking-normal text-foreground">
              Email
            </h2>
            <p className="mt-3 leading-7 text-foreground/70">
              Use email for support requests, product feedback and general
              questions.
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-4 inline-flex font-semibold text-primary hover:text-primary/80"
            >
              {contactEmail}
            </a>
          </article>

          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold tracking-normal text-foreground">
              Security and privacy
            </h2>
            <p className="mt-3 leading-7 text-foreground/70">
              If you report a security or privacy concern, include the affected
              page, browser, operating system and a clear reproduction path.
            </p>
            <Link
              href="/security"
              className="mt-4 inline-flex font-semibold text-primary hover:text-primary/80"
            >
              Read the security overview
            </Link>
          </article>
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-muted/35 p-6">
          <h2 className="text-xl font-bold tracking-normal text-foreground">
            Before sending files
          </h2>
          <p className="mt-3 leading-7 text-foreground/70">
            LiftPDF is designed so current tools process files directly in your
            browser. For privacy, avoid sending personal PDFs by email unless a
            support request specifically requires a sample file.
          </p>
        </section>
      </section>
    </main>
  );
}
