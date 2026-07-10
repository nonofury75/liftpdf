import {
  BadgeCheck,
  FileCheck2,
  Laptop,
  LockKeyhole,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const featureCards: Array<{
  title: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    title: "Fast",
    text: "Open a tool, choose files and get a result without a heavy workflow.",
    icon: Zap,
  },
  {
    title: "Private",
    text: "Supported tools process files locally in your browser.",
    icon: LockKeyhole,
  },
  {
    title: "Browser",
    text: "No desktop installer is required for everyday PDF tasks.",
    icon: Laptop,
  },
  {
    title: "Free",
    text: "The current tools are available without an account or paywall.",
    icon: BadgeCheck,
  },
  {
    title: "Secure",
    text: "Security tools are honest about what is really applied.",
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Why choose LiftPDF
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
            A calmer PDF suite for real work
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            LiftPDF is built to feel focused: fewer distractions, clear results
            and privacy claims that match how the tools actually work.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featureCards.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  text,
  icon: Icon,
}: {
  title: string;
  text: string;
  icon: LucideIcon;
}) {
  return (
    <article className="group min-h-64 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl">
      <div className="relative h-24 overflow-hidden rounded-xl bg-muted">
        <div className="absolute left-4 top-4 grid size-12 place-items-center rounded-xl bg-background text-primary shadow-sm transition-transform duration-200 group-hover:scale-105">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 h-2 rounded-full bg-background">
          <div className="h-2 w-2/3 rounded-full bg-primary" />
        </div>
        <FileCheck2 className="absolute right-4 top-4 size-8 text-primary/20" aria-hidden="true" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-card-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
    </article>
  );
}
