import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearningTopicPage } from "@/components/learn/learning-topic-page";
import { siteConfig } from "@/config/site";
import {
  getLearningGuidesForTopic,
  getLearningTopic,
  learningTopics,
} from "@/data/learning-center";

type TopicPageProps = {
  params: Promise<{
    topic: string;
  }>;
};

export function generateStaticParams() {
  return learningTopics.map((topic) => ({
    topic: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getLearningTopic(topicSlug);

  if (!topic) {
    return {};
  }

  return {
    title: { absolute: `${topic.title} Guides | LiftPDF Learning Center` },
    description: topic.description,
    alternates: { canonical: topic.href },
    openGraph: {
      title: `${topic.title} Guides | LiftPDF`,
      description: topic.description,
      url: `${siteConfig.url}${topic.href}`,
      images: [
        {
          url: topic.image.src,
          width: topic.image.width,
          height: topic.image.height,
          alt: topic.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.title} Guides | LiftPDF`,
      description: topic.description,
      images: [topic.image.src],
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic: topicSlug } = await params;
  const topic = getLearningTopic(topicSlug);

  if (!topic) {
    notFound();
  }

  const guides = getLearningGuidesForTopic(topic);
  const relatedTopics = topic.relatedTopics
    .map((slug) => getLearningTopic(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `${topic.title} Guides`,
        description: topic.description,
        url: `${siteConfig.url}${topic.href}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Learning Center",
            item: `${siteConfig.url}/learn`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: topic.title,
            item: `${siteConfig.url}${topic.href}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: topic.faq.map((item) => ({
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
      <LearningTopicPage
        topic={topic}
        guides={guides}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
