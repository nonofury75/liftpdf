import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { LearningGuide } from "@/data/learning-center";

type LearningResourceCardProps = {
  guide: LearningGuide;
  priority?: boolean;
};

export function LearningResourceCard({
  guide,
  priority = false,
}: LearningResourceCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
      <Link href={guide.href} className="block focus-visible:outline-none">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={guide.image.src}
            alt={guide.image.alt}
            width={guide.image.width}
            height={guide.image.height}
            priority={priority}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
              {guide.categoryLabel}
            </span>
            <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
              {guide.type}
            </span>
          </div>
          <h3 className="mt-4 text-lg font-bold leading-7 text-foreground">
            {guide.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {guide.description}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock3 className="size-4" aria-hidden="true" />
              {guide.readingMinutes} min read
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-primary">
              Read guide
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
