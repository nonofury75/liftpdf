import {
  BadgeCheck,
  Clock3,
  Download,
  MonitorCheck,
  ShieldCheck,
} from "lucide-react";
import type { Feature } from "@/types/features";

export const features: Feature[] = [
  {
    title: "Fast",
    icon: Clock3,
  },
  {
    title: "Secure",
    icon: ShieldCheck,
  },
  {
    title: "Free",
    icon: BadgeCheck,
  },
  {
    title: "No Installation",
    icon: Download,
  },
  {
    title: "Works in Browser",
    icon: MonitorCheck,
  },
];
