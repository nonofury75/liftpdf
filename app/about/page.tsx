import type { Metadata } from "next";
import Link from "next/link";
import { FileText, LockKeyhole, MonitorCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { TrustPageShell } from "@/components/trust/trust-page-shell";

const title = "About LiftPDF | Private Browser-Based PDF Tools";
const description =
  "Learn why LiftPDF exists and how it is building fast, private PDF tools that work directly in the browser.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/about`,
    images: [
      {
        url: "/images/seo/trust/og-image.svg",
        width: 1200,
        height: 630,
        alt: "About LiftPDF",
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

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: title,
        url: `${siteConfig.url}/about`,
        description,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "About",
            item: `${siteConfig.url}/about`,
          },
        ],
      },
    ],
  };

  return (
    <TrustPageShell
      eyebrow="About"
      title="Why LiftPDF exists"
      description="LiftPDF exists to make everyday PDF work faster, simpler and more private by moving useful document tools into the browser."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Mission",
              text: "Make practical PDF tools available without forcing users to upload private documents for simple tasks.",
              icon: FileText,
            },
            {
              title: "Vision",
              text: "Build a modern PDF suite where privacy, speed and clarity are default product choices.",
              icon: MonitorCheck,
            },
            {
              title: "Principle",
              text: "If a task can run safely in the browser, LiftPDF should keep it local and explain that clearly.",
              icon: LockKeyhole,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-xl font-bold tracking-normal text-foreground">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.text}
                </p>
              </article>
            );
          })}
        </section>

        <section className="rounded-3xl border border-border bg-muted/35 p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-normal text-foreground">
            A browser-side approach to PDF tools
          </h2>
          <div className="mt-4 grid gap-4 text-sm leading-7 text-muted-foreground lg:grid-cols-2">
            <p>
              Many online PDF tools work by uploading files to a server,
              processing them remotely and sending the result back. That model
              can be powerful, but it is not always necessary for everyday
              tasks like merging, splitting, converting images or rotating
              pages.
            </p>
            <p>
              LiftPDF focuses on tools that can run locally in modern browsers.
              This keeps the product fast, reduces server dependency and makes
              privacy easier to understand.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold tracking-normal text-foreground">
            Helpful links
          </h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-primary sm:grid-cols-3">
            <Link href="/privacy">Privacy</Link>
            <Link href="/security">Security</Link>
            <Link href="/why-liftpdf">Why LiftPDF</Link>
          </div>
        </section>
      </main>
    </TrustPageShell>
  );
}
