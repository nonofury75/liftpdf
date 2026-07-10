import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Combine,
  FileArchive,
  ImageIcon,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HomeToolsBrowser } from "@/components/home/home-tools-browser";
import { Button } from "@/components/ui/button";
import { popularTools } from "@/data/tools";
import type { ToolCard } from "@/types/tools";

const featuredTitles = ["JPG to PDF", "Merge PDF", "Compress PDF", "Protect PDF"];

const featuredIconMap: Record<string, LucideIcon> = {
  "JPG to PDF": ImageIcon,
  "Merge PDF": Combine,
  "Compress PDF": FileArchive,
  "Protect PDF": LockKeyhole,
};

export function PopularTools() {
  const featuredTools = featuredTitles
    .map((title) => popularTools.find((tool) => tool.title === title))
    .filter((tool): tool is ToolCard => Boolean(tool));

  return (
    <section id="popular-tools" className="bg-muted/35 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Featured Tools
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
              Start with the tools people use every day
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              The core workflows are ready immediately: convert images, merge
              files, reduce size and protect sensitive PDFs.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
            <Link href="/pdf-tools">
              Browse all tools
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((tool, index) => (
            <FeaturedToolCard
              key={tool.href}
              tool={tool}
              index={index}
              icon={featuredIconMap[tool.title]}
            />
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-normal text-foreground">
                Browse every available tool
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Search by task, format or category. Coming-soon tools stay out
                of the way until they are real.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {popularTools.length} available tools
            </span>
          </div>
          <HomeToolsBrowser tools={popularTools} />
        </div>
      </div>
    </section>
  );
}

type FeaturedToolCardProps = {
  tool: ToolCard;
  icon?: LucideIcon;
  index: number;
};

function FeaturedToolCard({ tool, icon: Icon = ImageIcon, index }: FeaturedToolCardProps) {
  return (
    <Link
      href={tool.href}
      aria-label={`Open ${tool.title}`}
      className="group block h-full"
    >
      <article className="relative flex min-h-72 h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
        <div className="absolute right-4 top-4 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
          0{index + 1}
        </div>
        <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
          <Icon className="size-6" aria-hidden="true" />
        </span>

        <div className="mt-6">
          <h3 className="text-xl font-bold text-foreground">{tool.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {tool.description}
          </p>
        </div>

        <div className="mt-auto space-y-4 pt-8">
          <div className="flex flex-wrap gap-2">
            {["Free", "Secure", "Browser"].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground"
              >
                <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            Open tool
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </article>
    </Link>
  );
}
