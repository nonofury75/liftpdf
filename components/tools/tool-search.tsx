"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ToolCard, ToolCategory } from "@/types/tools";
import { toolCategories } from "@/data/tools";
import { cn } from "@/lib/utils";

type ToolSearchProps = {
  tools: ToolCard[];
  activeCategory: ToolCategory | "All";
  onCategoryChange: (category: ToolCategory | "All") => void;
  onResultsChange: (tools: ToolCard[]) => void;
  placeholder?: string;
  className?: string;
};

const allCategories = ["All", ...toolCategories] as const;

export function ToolSearch({
  tools,
  activeCategory,
  onCategoryChange,
  onResultsChange,
  placeholder = "Search tools...",
  className,
}: ToolSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory =
        activeCategory === "All" || tool.category === activeCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        tool.title,
        tool.description,
        tool.category,
        ...tool.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [activeCategory, debouncedQuery, tools]);

  useEffect(() => {
    onResultsChange(results);
  }, [onResultsChange, results]);

  return (
    <div className={cn("space-y-5", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label="Search PDF tools"
          suppressHydrationWarning
          className="h-14 w-full rounded-lg border border-input bg-background pl-12 pr-4 text-base font-medium text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter tools by category"
      >
        {allCategories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "rounded-md border px-4 py-2 text-sm font-semibold transition-colors",
              activeCategory === category
                ? "border-primary bg-primary text-white"
                : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="text-sm font-medium text-muted-foreground" aria-live="polite">
        {results.length} {results.length === 1 ? "tool" : "tools"} found
      </p>
    </div>
  );
}
