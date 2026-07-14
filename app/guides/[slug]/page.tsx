import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  extractPagesGuides,
  getExtractPagesGuide,
} from "@/data/extract-pages-cluster";
import { ExtractPagesGuidePage } from "@/components/content/extract-pages-guide-page";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return extractPagesGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getExtractPagesGuide(slug);

  if (!guide) {
    return {};
  }

  return {
    title: { absolute: guide.title },
    description: guide.description,
    alternates: { canonical: guide.canonical },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `${siteConfig.url}${guide.canonical}`,
      images: [
        {
          url: guide.image.src,
          width: guide.image.width,
          height: guide.image.height,
          alt: guide.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [guide.image.src],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getExtractPagesGuide(slug);

  if (!guide) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.h1,
        description: guide.description,
        image: `${siteConfig.url}${guide.image.src}`,
        mainEntityOfPage: `${siteConfig.url}${guide.canonical}`,
        author: {
          "@type": "Organization",
          name: siteConfig.name,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
      {
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
            name: "PDF Tools",
            item: `${siteConfig.url}/pdf-tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Extract Pages",
            item: `${siteConfig.url}/extract-pages`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: guide.h1,
            item: `${siteConfig.url}${guide.canonical}`,
          },
        ],
      },
      ...(guide.quickSteps?.length
        ? [
            {
              "@type": "HowTo",
              name: guide.h1,
              description: guide.description,
              step: guide.quickSteps.map((step, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                text: step,
              })),
            },
          ]
        : []),
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ExtractPagesGuidePage guide={guide} />
    </>
  );
}
