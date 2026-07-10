"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { ToolSearch } from "@/components/tools/tool-search";
import type { ToolCard as ToolCardType, ToolCategory } from "@/types/tools";

type HomeToolsBrowserProps = {
  tools: ToolCardType[];
};

export function HomeToolsBrowser({ tools }: HomeToolsBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">(
    "All",
  );
  const [results, setResults] = useState<ToolCardType[]>(tools);

  const handleResultsChange = useCallback((nextResults: ToolCardType[]) => {
    setResults(nextResults);
  }, []);

  return (
    <div className="space-y-8">
      <ToolSearch
        tools={tools}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onResultsChange={handleResultsChange}
        placeholder="Search tools..."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
          >
            <span>
              <span className="block font-semibold text-foreground">
                {tool.title}
              </span>
              <span className="mt-1 block text-sm leading-6 text-foreground/70">
                {tool.description}
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
