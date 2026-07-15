"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { LearningResourceCard } from "@/components/learn/learning-resource-card";
import type { LearningGuide, LearningTopic } from "@/data/learning-center";

type GuideSearchProps = {
  guides: LearningGuide[];
  topics: LearningTopic[];
};

export function GuideSearch({ guides, topics }: GuideSearchProps) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");

  const filteredGuides = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return guides.filter((guide) => {
      const matchesTopic = topic === "all" || guide.category === topic;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${guide.title} ${guide.description} ${guide.categoryLabel}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesTopic && matchesQuery;
    });
  }, [guides, query, topic]);

  return (
    <section aria-labelledby="all-guides" className="py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Guide library
            </p>
            <h2 id="all-guides" className="mt-2 text-3xl font-bold">
              Browse all LiftPDF guides
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,280px)_220px]">
            <label className="relative block">
              <span className="sr-only">Search guides</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search guides"
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </label>
            <label>
              <span className="sr-only">Filter by topic</span>
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option value="all">All topics</option>
                {topics.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {filteredGuides.length} guides found.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <LearningResourceCard key={guide.href} guide={guide} />
          ))}
        </div>
      </div>
    </section>
  );
}
