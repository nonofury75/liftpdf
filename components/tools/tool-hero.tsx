import { BadgeCheck, LockKeyhole, MonitorCheck } from "lucide-react";

type ToolHeroProps = {
  title: string;
  description: string;
};

const trustBadges = [
  {
    label: "Free",
    icon: BadgeCheck,
  },
  {
    label: "Secure",
    icon: LockKeyhole,
  },
  {
    label: "Works in your browser",
    icon: MonitorCheck,
  },
];

export function ToolHero({ title, description }: ToolHeroProps) {
  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Free online PDF tool
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;

              return (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm"
                >
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  {badge.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
