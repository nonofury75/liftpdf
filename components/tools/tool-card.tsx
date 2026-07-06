import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Combine,
  Crop,
  FileArchive,
  FileText,
  Hash,
  ImageIcon,
  Layers,
  LockKeyhole,
  PenLine,
  RotateCw,
  Scissors,
  ShieldCheck,
  Stamp,
  Trash2,
  Type,
  UnlockKeyhole,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ToolCard as ToolCardType, ToolIcon } from "@/types/tools";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  tool: ToolCardType;
};

const iconMap: Record<ToolIcon, LucideIcon> = {
  fileText: FileText,
  image: ImageIcon,
  merge: Combine,
  split: Scissors,
  compress: FileArchive,
  rotate: RotateCw,
  hash: Hash,
  stamp: Stamp,
  lock: LockKeyhole,
  unlock: UnlockKeyhole,
  signature: PenLine,
  crop: Crop,
  trash: Trash2,
  layers: Layers,
  text: Type,
};

const trustBadges = [
  { label: "Free", icon: BadgeCheck },
  { label: "Secure", icon: ShieldCheck },
  { label: "Browser", icon: FileText },
];

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = iconMap[tool.icon];

  const card = (
    <Card className="group flex h-full min-h-64 flex-col transition-colors hover:border-primary/60 hover:bg-background">
      <CardHeader className="flex h-full flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          {tool.available ? (
            <ArrowRight
              className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
              aria-hidden="true"
            />
          ) : (
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              Coming Soon
            </span>
          )}
        </div>

        <div className="space-y-3">
          <CardTitle>{tool.title}</CardTitle>
          <p className="min-h-12 text-sm leading-6 text-muted-foreground">
            {tool.description}
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {trustBadges.map((badge) => {
              const BadgeIcon = badge.icon;

              return (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground"
                >
                  <BadgeIcon className="size-3.5 text-primary" aria-hidden="true" />
                  {badge.label}
                </span>
              );
            })}
          </div>

          <span
            className={cn(
              buttonVariants({ variant: tool.available ? "default" : "outline" }),
              "w-full",
              !tool.available && "opacity-70",
            )}
            aria-hidden="true"
          >
            {tool.available ? "Open tool" : "Coming Soon"}
          </span>
        </div>
      </CardHeader>
    </Card>
  );

  if (!tool.available) {
    return card;
  }

  return (
    <Link href={tool.href} aria-label={`Open ${tool.title}`} className="block h-full">
      {card}
    </Link>
  );
}
