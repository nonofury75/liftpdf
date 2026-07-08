import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { HowBrowserProcessingWorks } from "@/components/trust/how-browser-processing-works";
import { TrustPageShell } from "@/components/trust/trust-page-shell";

const title = "LiftPDF Security Overview | Browser-Side PDF Processing";
const description =
  "Understand how LiftPDF protects files with browser-side PDF processing, QPDF WASM, PDF.js and security headers.";

const faq = [
  {
    question: "Do passwords leave my browser?",
    answer:
      "Protect PDF and Unlock PDF use the password locally in the browser through QPDF WASM. LiftPDF does not need to send the password to a backend API for these tools.",
  },
  {
    question: "Why does LiftPDF use COOP and COEP headers?",
    answer:
      "These headers help enable a safer isolated browser context for advanced WebAssembly workflows. They are part of the production configuration.",
  },
  {
    question: "Does LiftPDF claim a security certification?",
    answer:
      "No. LiftPDF does not claim ISO, SOC2 or external audit certification. The trust model is based on transparent browser-side processing.",
  },
  {
    question: "Are encrypted PDFs really encrypted?",
    answer:
      "Protect PDF uses QPDF compiled to WebAssembly to create password-protected PDF files. The exported file requires the password in PDF viewers.",
  },
];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/security" },
  openGraph: { title, description, url: `${siteConfig.url}/security` },
  twitter: { card: "summary_large_image", title, description },
};

export default function SecurityPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        url: `${siteConfig.url}/security`,
        description,
      },
      breadcrumb("Security", "/security"),
      faqSchema(faq),
    ],
  };

  return (
    <TrustPageShell
      eyebrow="Security"
      title="Security Overview"
      description="LiftPDF protects files by reducing unnecessary movement. The safest upload is the one your browser does not need to make."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:px-8">
        <HowBrowserProcessingWorks />

        <section className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "QPDF WASM",
              text: "Protect PDF and Unlock PDF use QPDF compiled to WebAssembly, so encryption and decryption can run locally in modern browsers.",
            },
            {
              title: "PDF.js",
              text: "PDF.js renders previews and extracts readable PDF content in the browser without needing a document upload endpoint.",
            },
            {
              title: "COOP and COEP",
              text: "LiftPDF serves Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy headers to support isolated browser execution for advanced workflows.",
            },
            {
              title: "crossOriginIsolated",
              text: "When supported by the browser and headers, this creates a stronger execution environment for WebAssembly and related browser features.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <CheckCircle2 className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold tracking-normal text-foreground">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.text}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-muted/35 p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-normal text-foreground">
            What LiftPDF does not claim
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            LiftPDF does not claim ISO 27001, SOC2, external audit status or
            any other certification that has not been earned. The security
            promise is intentionally narrower: the current tools are designed to
            process files locally in the browser whenever possible.
          </p>
        </section>

        <FaqSection items={faq} />

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold tracking-normal text-foreground">
            Learn more
          </h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-primary sm:grid-cols-3">
            <Link href="/privacy">Privacy details</Link>
            <Link href="/protect-pdf">Protect PDF</Link>
            <Link href="/unlock-pdf">Unlock PDF</Link>
          </div>
        </section>
      </main>
    </TrustPageShell>
  );
}

function FaqSection({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-normal text-foreground">
        Security FAQ
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.question}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <h3 className="font-semibold text-foreground">{item.question}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function breadcrumb(name: string, path: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `${siteConfig.url}${path}`,
      },
    ],
  };
}

function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
