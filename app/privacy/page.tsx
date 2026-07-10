import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { HowBrowserProcessingWorks } from "@/components/trust/how-browser-processing-works";
import { TrustCards } from "@/components/trust/trust-cards";
import { TrustPageShell } from "@/components/trust/trust-page-shell";

const title = "Privacy First PDF Tools | LiftPDF";
const description =
  "Learn how LiftPDF processes PDF files locally in your browser without uploading documents to a conversion server.";

const faq = [
  {
    question: "Are my PDF files uploaded to LiftPDF?",
    answer:
      "The current LiftPDF tools are designed for browser-side processing, so selected files are processed locally on your device and do not require a document upload API.",
  },
  {
    question: "Does LiftPDF store my documents?",
    answer:
      "No. The current tools do not store your documents on LiftPDF servers. Output files are generated in your browser for you to download.",
  },
  {
    question: "Can a future tool require a server?",
    answer:
      "Some future workflows, such as advanced OCR or Office document conversion, may require server-side processing. If that happens, LiftPDF should label the behavior clearly before files are selected.",
  },
  {
    question: "What happens to passwords?",
    answer:
      "Protect PDF and Unlock PDF run with QPDF compiled to WebAssembly in the browser, so passwords are used locally for the encryption or decryption task.",
  },
];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/privacy`,
    images: [
      {
        url: "/images/seo/trust/og-image.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF privacy first PDF tools",
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

export default function PrivacyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        url: `${siteConfig.url}/privacy`,
        description,
      },
      breadcrumb("Privacy", "/privacy"),
      faqSchema(faq),
    ],
  };

  return (
    <TrustPageShell
      eyebrow="Privacy"
      title="Privacy First"
      description="LiftPDF is built around a simple idea: when a PDF task can run in your browser, your file should not need to leave your device."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:px-8">
        <TrustCards />
        <HowBrowserProcessingWorks />

        <TwoColumnSection
          title="Why local processing is safer"
          text="A typical online converter receives your document, processes it on a remote server and then sends a result back. LiftPDF's current tools avoid that upload step. Your browser reads the file, performs the operation and creates a downloadable result locally."
          items={[
            "No document upload is required for the current tools.",
            "Files are not stored on LiftPDF servers by the available tools.",
            "Sensitive PDFs, scans, IDs and work files remain on your device.",
          ]}
        />

        <TwoColumnSection
          title="Technologies used"
          text="LiftPDF uses browser-compatible libraries that run on the user's device. The exact library depends on the tool."
          items={[
            "PDF.js renders and reads PDF pages for previews and text extraction.",
            "pdf-lib creates, copies, rotates and edits PDF pages in the browser.",
            "QPDF WASM handles real password protection and unlocking locally.",
            "Browser APIs handle files, canvas rendering, Blob downloads and object URLs.",
          ]}
        />

        <TwoColumnSection
          title="Tools that currently work in the browser"
          text="The available LiftPDF tools are designed as client-side workflows. This includes image conversion, PDF page organization, PDF to image, page numbers, watermarks, compression, protection, unlocking and text extraction."
          items={[
            "Images to PDF, JPG to PDF and PNG to PDF",
            "Merge, Split, Delete, Extract and Reorder Pages",
            "PDF to JPG, PDF to PNG and PDF to Text",
            "Protect PDF and Unlock PDF with QPDF WASM",
          ]}
        />

        <section className="rounded-3xl border border-border bg-muted/35 p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-normal text-foreground">
            Browser compatibility
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            LiftPDF is built for modern browsers such as Chrome, Edge, Firefox
            and Safari. Advanced tools that use WebAssembly, PDF.js or canvas
            may work best on up-to-date browsers with enough device memory for
            the file size being processed.
          </p>
        </section>

        <FaqSection items={faq} />

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold tracking-normal text-foreground">
            Related trust pages
          </h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-primary sm:grid-cols-3">
            <Link href="/security">Security overview</Link>
            <Link href="/why-liftpdf">Why LiftPDF</Link>
            <Link href="/about">About LiftPDF</Link>
          </div>
        </section>
      </main>
    </TrustPageShell>
  );
}

function TwoColumnSection({
  title,
  text,
  items,
}: {
  title: string;
  text: string;
  items: string[];
}) {
  return (
    <section className="grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h2 className="text-2xl font-bold tracking-normal text-foreground">
          {title}
        </h2>
        <p className="mt-4 leading-7 text-muted-foreground">{text}</p>
      </div>
      <ul className="grid gap-3 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-border bg-muted/30 p-4">
            {item}
          </li>
        ))}
      </ul>
    </section>
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
        Frequently Asked Questions
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
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
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
