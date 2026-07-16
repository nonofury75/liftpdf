import { EditorialArticlePage } from "@/components/content/editorial-article-page";
import type { FoundationGuide } from "@/data/foundation-guides";

type FoundationGuidePageProps = {
  guide: FoundationGuide;
};

const topicToolMap: Record<
  FoundationGuide["topic"],
  {
    href: string;
    title: string;
    description: string;
    secondaryHref: string;
    secondaryLabel: string;
    trustItems: string[];
  }
> = {
  "PDF Basics": {
    href: "/pdf-tools",
    title: "Choose the right PDF tool",
    description:
      "Use the guide to understand the file, then choose the smallest LiftPDF workflow that solves the task.",
    secondaryHref: "/learn/pdf-basics",
    secondaryLabel: "Browse PDF basics",
    trustItems: ["Plain-English guide", "Tool-linked examples", "No fake claims"],
  },
  "Convert PDF": {
    href: "/pdf-converter",
    title: "Open conversion tools",
    description:
      "Convert between PDF, images and text with browser-based LiftPDF tools.",
    secondaryHref: "/learn/convert-pdf",
    secondaryLabel: "Browse conversion guides",
    trustItems: ["Format guidance", "Quality notes", "Browser workflow"],
  },
  "Organize PDF": {
    href: "/organize-pdf",
    title: "Open organize tools",
    description:
      "Merge, split, delete, extract and reorder PDF pages with focused tools.",
    secondaryHref: "/learn/organize-pdf",
    secondaryLabel: "Browse organize guides",
    trustItems: ["Page workflow", "Private by design", "Tool-linked examples"],
  },
  "PDF Security": {
    href: "/pdf-security",
    title: "Open PDF security tools",
    description:
      "Protect PDFs with real encryption or unlock files when you know the password.",
    secondaryHref: "/learn/pdf-security",
    secondaryLabel: "Browse security guides",
    trustItems: ["No password bypass", "Real encryption", "Local processing"],
  },
  "PDF and Images": {
    href: "/pdf-image-tools",
    title: "Open image PDF tools",
    description:
      "Convert JPG, PNG and PDF pages while keeping quality tradeoffs visible.",
    secondaryHref: "/learn/pdf-images",
    secondaryLabel: "Browse image guides",
    trustItems: ["Format guidance", "Image quality notes", "Layout examples"],
  },
  Troubleshooting: {
    href: "/help",
    title: "Open Help Center",
    description:
      "Diagnose common PDF failures before retrying the same workflow.",
    secondaryHref: "/learn/troubleshooting",
    secondaryLabel: "Browse troubleshooting",
    trustItems: ["Concrete causes", "Honest limits", "Next steps"],
  },
  Comparisons: {
    href: "/learn/comparisons",
    title: "Compare PDF workflows",
    description:
      "Choose the format or tool that changes the file the least.",
    secondaryHref: "/pdf-tools",
    secondaryLabel: "Browse PDF tools",
    trustItems: ["Decision tables", "Format examples", "No keyword stuffing"],
  },
};

export function FoundationGuidePage({ guide }: FoundationGuidePageProps) {
  const topic = topicToolMap[guide.topic];

  return (
    <EditorialArticlePage
      guide={guide}
      label={guide.topic}
      toolHref={topic.href}
      toolTitle={topic.title}
      toolDescription={topic.description}
      secondaryHref={topic.secondaryHref}
      secondaryLabel={topic.secondaryLabel}
      trustItems={topic.trustItems}
      faqHeading="Common questions"
    />
  );
}
