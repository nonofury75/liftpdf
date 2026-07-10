"use client";

import { BadgeCheck, LockKeyhole, MonitorCheck, ShieldCheck } from "lucide-react";
import { useCallback, useState } from "react";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolSearch } from "@/components/tools/tool-search";
import type { ToolCard as ToolCardType, ToolCategory } from "@/types/tools";

type ToolCatalogProps = {
  tools: ToolCardType[];
};

const stats = [
  "17+ PDF tools",
  "100% Browser Processing",
  "Free",
  "No Upload Required",
];

const privacyItems = [
  {
    title: "Your files never leave your browser.",
    icon: ShieldCheck,
  },
  {
    title: "All processing happens locally on your device.",
    icon: MonitorCheck,
  },
  {
    title: "No upload.",
    icon: BadgeCheck,
  },
  {
    title: "No account.",
    icon: LockKeyhole,
  },
  {
    title: "No tracking of your documents.",
    icon: ShieldCheck,
  },
];

export function ToolCatalog({ tools }: ToolCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">(
    "All",
  );
  const [results, setResults] = useState<ToolCardType[]>(tools);

  const handleResultsChange = useCallback((nextResults: ToolCardType[]) => {
    setResults(nextResults);
  }, []);

  return (
    <div className="space-y-14">
      <section id="browse-tools" className="space-y-8">
        <h2 className="sr-only">Browse PDF tools</h2>
        <ToolSearch
          tools={tools}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onResultsChange={handleResultsChange}
        />

        {results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-foreground">
              No tools found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another search or switch categories.
            </p>
          </div>
        )}
      </section>

      <section
        className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
        aria-label="LiftPDF statistics"
      >
        {stats.map((stat) => (
          <div key={stat} className="rounded-lg bg-muted px-4 py-5 text-center">
            <p className="text-sm font-bold text-foreground">{stat}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Privacy
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
            Private by Design
          </h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {privacyItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-lg border border-border bg-muted/50 p-4"
              >
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold leading-6 text-foreground">
                  {item.title}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
