import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  extractPagesGuides,
  getExtractPagesGuide,
} from "@/data/extract-pages-cluster";
import {
  getMergePdfGuide,
  mergePdfOgImage,
  mergePdfGuides,
} from "@/data/merge-pdf-cluster";
import {
  getJpgToPdfGuide,
  jpgToPdfGuides,
  jpgToPdfOgImage,
} from "@/data/jpg-to-pdf-cluster";
import {
  foundationGuides,
  getFoundationGuide,
} from "@/data/foundation-guides";
import { ExtractPagesGuidePage } from "@/components/content/extract-pages-guide-page";
import { MergePdfGuidePage } from "@/components/content/merge-pdf-guide-page";
import { JpgToPdfGuidePage } from "@/components/content/jpg-to-pdf-guide-page";
import { FoundationGuidePage } from "@/components/learn/foundation-guide-page";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return [
    ...extractPagesGuides,
    ...mergePdfGuides,
    ...jpgToPdfGuides,
    ...foundationGuides,
  ].map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const extractGuide = getExtractPagesGuide(slug);
  const mergeGuide = getMergePdfGuide(slug);
  const jpgGuide = getJpgToPdfGuide(slug);
  const foundationGuide = getFoundationGuide(slug);
  const guide = extractGuide || mergeGuide || jpgGuide || foundationGuide;

  if (!guide) {
    return {};
  }

  const socialImage = mergeGuide
    ? mergePdfOgImage
    : jpgGuide
      ? jpgToPdfOgImage
      : guide.image;

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
          url: socialImage.src,
          width: socialImage.width,
          height: socialImage.height,
          alt: socialImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [socialImage.src],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const extractGuide = getExtractPagesGuide(slug);
  const mergeGuide = getMergePdfGuide(slug);
  const jpgGuide = getJpgToPdfGuide(slug);
  const foundationGuide = getFoundationGuide(slug);
  const guide = extractGuide || mergeGuide || jpgGuide || foundationGuide;

  if (!guide) {
    notFound();
  }

  const toolCrumb = foundationGuide
    ? {
        name: "Learning Center",
        url: `${siteConfig.url}/learn`,
      }
    : mergeGuide
    ? {
        name: "Merge PDF",
        url: `${siteConfig.url}/merge-pdf`,
      }
    : jpgGuide
      ? {
          name: "JPG to PDF",
          url: `${siteConfig.url}/jpg-to-pdf`,
        }
    : {
        name: "Extract Pages",
        url: `${siteConfig.url}/extract-pages`,
      };

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
            name: toolCrumb.name,
            item: toolCrumb.url,
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
      {mergeGuide ? <MergePdfGuidePage guide={mergeGuide} /> : null}
      {jpgGuide ? <JpgToPdfGuidePage guide={jpgGuide} /> : null}
      {foundationGuide ? (
        <FoundationGuidePage guide={foundationGuide} />
      ) : null}
      {extractGuide ? (
        <ExtractPagesGuidePage guide={extractGuide} />
      ) : null}
    </>
  );
}
