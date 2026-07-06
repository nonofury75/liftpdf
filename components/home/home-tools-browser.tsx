"use client";

import { useCallback, useState } from "react";
import { ToolCard } from "@/components/tools/tool-card";
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((tool) => (
          <ToolCard key={tool.href} tool={tool} />
        ))}
      </div>
    </div>
  );
}
