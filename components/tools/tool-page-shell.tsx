import type { ReactNode } from "react";
import { RelatedTools } from "@/components/tools/related-tools";
import { PrivacyTrustSection } from "@/components/trust/privacy-trust-section";
import {
  PremiumToolContent,
  type PremiumToolContentData,
} from "@/components/tools/premium-tool-content";
import { ToolFaq, type ToolFaqItem } from "@/components/tools/tool-faq";
import { ToolAnalytics } from "@/components/tools/tool-analytics";
import { ToolHero } from "@/components/tools/tool-hero";
import { ToolSeoBlock } from "@/components/tools/tool-seo-block";

type ToolPageShellProps = {
  title: string;
  description: string;
  seoTitle: string;
  seoText: string;
  faq: ToolFaqItem[];
  currentHref?: string;
  compactHero?: boolean;
  compactRelatedTools?: boolean;
  premiumContent?: PremiumToolContentData;
  children: ReactNode;
};

export function ToolPageShell({
  title,
  description,
  seoTitle,
  seoText,
  faq,
  currentHref,
  compactHero = false,
  compactRelatedTools = false,
  premiumContent,
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
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://liftpdf.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "PDF Tools",
            item: "https://liftpdf.com/pdf-tools",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
          },
        ],
      },
      ...(premiumContent
        ? [
            {
              "@type": "HowTo",
              name: `How to use ${title}`,
              step: premiumContent.howItWorks.map((step, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: step.title,
                text: step.text,
              })),
            },
            {
              "@type": "SoftwareApplication",
              name: title,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              image: premiumContent.ogImage.src,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            },
          ]
        : []),
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
      <ToolAnalytics title={title} currentHref={currentHref} />
      <ToolHero
        title={title}
        description={description}
        compact={compactHero}
        image={premiumContent?.heroImage}
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </section>

      {premiumContent ? (
        <section className="border-t border-border bg-background">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <PremiumToolContent title={title} content={premiumContent} />
          </div>
        </section>
      ) : null}

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <ToolSeoBlock title={seoTitle} text={seoText} />
            <ToolFaq items={faq} />
          </div>
          {currentHref ? (
            <RelatedTools
              currentHref={currentHref}
              compact={compactRelatedTools}
            />
          ) : null}
        </div>
      </section>

      <PrivacyTrustSection />
    </div>
  );
}
