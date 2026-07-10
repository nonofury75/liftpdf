"use client";

import { useCallback } from "react";
import {
  getFileSizeBucket,
  trackToolEvent,
  type ToolAnalyticsPayload,
} from "@/lib/analytics";

type UseToolAnalyticsOptions = {
  tool: string;
  route: string;
};

export function useToolAnalytics({ tool, route }: UseToolAnalyticsOptions) {
  const basePayload = useCallback(
    (payload?: Omit<ToolAnalyticsPayload, "tool" | "route">) => ({
      tool,
      route,
      ...payload,
    }),
    [route, tool],
  );

  return {
    trackUploadStarted(payload?: Omit<ToolAnalyticsPayload, "tool" | "route">) {
      trackToolEvent("upload_started", basePayload(payload));
    },
    trackUploadCompleted(
      payload?: Omit<ToolAnalyticsPayload, "tool" | "route">,
    ) {
      trackToolEvent("upload_completed", basePayload(payload));
    },
    trackConversionStarted(
      payload?: Omit<ToolAnalyticsPayload, "tool" | "route">,
    ) {
      trackToolEvent("conversion_started", basePayload(payload));
    },
    trackConversionCompleted(
      payload?: Omit<ToolAnalyticsPayload, "tool" | "route">,
    ) {
      trackToolEvent("conversion_completed", basePayload(payload));
    },
    trackDownloadStarted(
      payload?: Omit<ToolAnalyticsPayload, "tool" | "route">,
    ) {
      trackToolEvent("download_started", basePayload(payload));
    },
    trackDownloadCompleted(
      payload?: Omit<ToolAnalyticsPayload, "tool" | "route">,
    ) {
      trackToolEvent("download_completed", basePayload(payload));
    },
    trackError(payload?: Omit<ToolAnalyticsPayload, "tool" | "route">) {
      trackToolEvent("error_tool", basePayload(payload));
    },
  };
}

export function summarizeFilesForAnalytics(files: File[]) {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return {
    fileCount: files.length,
    fileSizeBucket: getFileSizeBucket(totalSize),
  };
}

export { getFileSizeBucket };
