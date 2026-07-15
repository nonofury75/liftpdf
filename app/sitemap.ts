import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { tools } from "@/data/tools";
import { extractPagesGuides } from "@/data/extract-pages-cluster";
import { mergePdfGuides } from "@/data/merge-pdf-cluster";
import { jpgToPdfGuides } from "@/data/jpg-to-pdf-cluster";
import { foundationGuides } from "@/data/foundation-guides";
import { learningTopics } from "@/data/learning-center";

const releaseLastModified = new Date("2026-07-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/pdf-tools", priority: 0.95 },
    { path: "/pdf-converter", priority: 0.85 },
    { path: "/pdf-editor", priority: 0.85 },
    { path: "/pdf-security", priority: 0.8 },
    { path: "/pdf-image-tools", priority: 0.85 },
    { path: "/organize-pdf", priority: 0.85 },
    { path: "/privacy", priority: 0.75 },
    { path: "/cookies", priority: 0.55 },
    { path: "/security", priority: 0.75 },
    { path: "/about", priority: 0.65 },
    { path: "/why-liftpdf", priority: 0.75 },
    { path: "/terms", priority: 0.55 },
    { path: "/contact", priority: 0.55 },
    { path: "/learn", priority: 0.82 },
    { path: "/guides", priority: 0.78 },
    { path: "/pdf-glossary", priority: 0.72 },
    { path: "/help", priority: 0.68 },
  ];

  const toolRoutes = tools
    .filter((tool) => tool.available)
    .map((tool) => ({
      path: tool.href,
      priority: 0.9,
    }));

  const guideRoutes = [
    ...extractPagesGuides,
    ...mergePdfGuides,
    ...jpgToPdfGuides,
    ...foundationGuides,
  ].map((guide) => ({
    path: guide.canonical,
    priority: "intent" in guide && guide.intent === "guide" ? 0.72 : 0.68,
  }));

  const learningRoutes = learningTopics.map((topic) => ({
    path: topic.href,
    priority: 0.74,
  }));

  return [...staticRoutes, ...learningRoutes, ...toolRoutes, ...guideRoutes].map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: releaseLastModified,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
