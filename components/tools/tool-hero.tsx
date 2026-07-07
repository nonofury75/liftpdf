import { BadgeCheck, LockKeyhole, MonitorCheck } from "lucide-react";
import Image from "next/image";

type ToolHeroImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type ToolHeroProps = {
  title: string;
  description: string;
  compact?: boolean;
  image?: ToolHeroImage;
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

export function ToolHero({
  title,
  description,
  compact = false,
  image,
}: ToolHeroProps) {
  return (
    <section className="border-b border-border bg-muted/40">
      <div
        className={`mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8 ${compact ? "py-10" : "py-12"} ${image ? "lg:grid-cols-[minmax(0,1fr)_420px]" : ""}`}
      >
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Free online PDF tool
          </p>
          <h1 className={`${compact ? "mt-2" : "mt-3"} text-4xl font-bold tracking-normal text-foreground sm:text-5xl`}>
            {title}
          </h1>
          <p className={`${compact ? "mt-3" : "mt-4"} max-w-3xl text-lg leading-8 text-muted-foreground`}>
            {description}
          </p>
          <div className={`${compact ? "mt-4" : "mt-6"} flex flex-wrap gap-2`}>
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
        {image ? (
          <div className="hidden overflow-hidden rounded-3xl border border-border bg-background p-3 shadow-sm lg:block">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
              className="h-auto w-full rounded-2xl"
              sizes="420px"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
