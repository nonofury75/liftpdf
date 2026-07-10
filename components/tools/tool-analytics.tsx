"use client";

import { useEffect } from "react";
import { trackToolEvent } from "@/lib/analytics";

type ToolAnalyticsProps = {
  title: string;
  currentHref?: string;
};

export function ToolAnalytics({ title, currentHref }: ToolAnalyticsProps) {
  useEffect(() => {
    if (!currentHref) {
      return;
    }

    trackToolEvent("tool_open", {
      tool: title,
      route: currentHref,
    });
  }, [currentHref, title]);

  return null;
}

