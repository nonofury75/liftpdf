import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const title = "Cookie Policy | LiftPDF";
const description =
  "Learn how LiftPDF uses analytics cookies, how consent works and how to change your analytics preference.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/cookies" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/cookies`,
    images: [
      {
        url: "/images/seo/trust/og-image.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF cookie policy",
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

export default function CookiesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        url: `${siteConfig.url}/cookies`,
        description,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cookie Policy",
            item: `${siteConfig.url}/cookies`,
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
          <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Cookies
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
              Cookie Policy
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              LiftPDF keeps analytics optional. Google Analytics only loads
              after you choose to accept analytics.
            </p>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
          <PolicySection title="Essential storage">
            <p>
              LiftPDF may use local browser storage to remember interface
              preferences, such as your analytics choice. This is used to keep
              the site usable and avoid asking the same question on every page.
            </p>
          </PolicySection>

          <PolicySection title="Analytics">
            <p>
              If you accept analytics, LiftPDF loads Google Analytics 4 with
              measurement ID <code>G-0EVEJXJRVL</code>. Analytics helps us
              understand page visits and broad tool usage patterns.
            </p>
            <p>
              Analytics events are limited to product information such as tool
              name, route, action, output format, file count, page count and
              coarse file-size bucket. LiftPDF does not intentionally send file
              names, document content, extracted text, passwords, local file
              paths, emails or typed tool content.
            </p>
          </PolicySection>

          <PolicySection title="Changing your choice">
            <p>
              Use the “Analytics preferences” button shown at the bottom of the
              site to accept or reject analytics later. Rejecting analytics
              prevents Google Analytics from loading for future page views in
              that browser.
            </p>
          </PolicySection>

          <PolicySection title="Related policies">
            <p>
              Read the{" "}
              <Link href="/privacy" className="font-semibold text-primary">
                Privacy page
              </Link>{" "}
              for how LiftPDF handles browser-based PDF processing, or contact
              us through{" "}
              <Link href="/contact" className="font-semibold text-primary">
                Contact
              </Link>{" "}
              if you have a privacy question.
            </p>
          </PolicySection>
        </section>
      </main>
    </>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-4 space-y-4 leading-8 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
