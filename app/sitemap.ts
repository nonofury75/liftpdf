import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { tools } from "@/data/tools";

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
    { path: "/security", priority: 0.75 },
    { path: "/about", priority: 0.65 },
    { path: "/why-liftpdf", priority: 0.75 },
  ];

  const toolRoutes = tools
    .filter((tool) => tool.available)
    .map((tool) => ({
      path: tool.href,
      priority: 0.9,
    }));

  return [...staticRoutes, ...toolRoutes].map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
