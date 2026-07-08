import {
  BadgeCheck,
  LockKeyhole,
  MonitorCheck,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SecurityBadgesProps = {
  className?: string;
  compact?: boolean;
};

const badges = [
  {
    label: "Browser Processing",
    icon: MonitorCheck,
  },
  {
    label: "No Upload",
    icon: ShieldCheck,
  },
  {
    label: "Privacy First",
    icon: LockKeyhole,
  },
  {
    label: "Local Conversion",
    icon: BadgeCheck,
  },
  {
    label: "Fast",
    icon: Zap,
  },
];

export function SecurityBadges({
  className,
  compact = false,
}: SecurityBadgesProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {badges.map((badge) => {
        const Icon = badge.icon;

        return (
          <span
            key={badge.label}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-border bg-background font-medium text-muted-foreground shadow-sm",
              compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
            )}
          >
            <Icon className="size-4 text-primary" aria-hidden="true" />
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
