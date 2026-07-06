import type { ReactNode } from "react";
import { RelatedTools } from "@/components/tools/related-tools";
import { ToolFaq, type ToolFaqItem } from "@/components/tools/tool-faq";
import { ToolHero } from "@/components/tools/tool-hero";
import { ToolSeoBlock } from "@/components/tools/tool-seo-block";

type ToolPageShellProps = {
  title: string;
  description: string;
  seoTitle: string;
  seoText: string;
  faq: ToolFaqItem[];
  currentHref?: string;
  children: ReactNode;
};

export function ToolPageShell({
  title,
  description,
  seoTitle,
  seoText,
  faq,
  currentHref,
  children,
}: ToolPageShellProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: title,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ToolHero title={title} description={description} />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:px-8">
          {currentHref ? <RelatedTools currentHref={currentHref} /> : null}
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <ToolSeoBlock title={seoTitle} text={seoText} />
            <ToolFaq items={faq} />
          </div>
        </div>
      </section>
    </div>
  );
}
