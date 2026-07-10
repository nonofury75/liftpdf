"use client";

import { sendGAEvent } from "@next/third-parties/google";

export type ToolEventName =
  | "tool_open"
  | "upload_started"
  | "upload_completed"
  | "conversion_started"
  | "conversion_completed"
  | "download_started"
  | "download_completed"
  | "error_tool";

export type ToolAnalyticsPayload = {
  tool: string;
  route?: string;
  fileCount?: number;
  pageCount?: number;
  outputFormat?: string;
  mode?: string;
  status?: string;
  errorCode?: string;
  fileSizeBucket?: string;
};

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function trackToolEvent(
  eventName: ToolEventName,
  payload: ToolAnalyticsPayload,
) {
  if (!gaMeasurementId || typeof window === "undefined") {
    return;
  }

  sendGAEvent("event", eventName, sanitizePayload(payload));
}

export function getFileSizeBucket(bytes: number) {
  if (bytes < 1024 * 1024) {
    return "<1MB";
  }

  if (bytes < 5 * 1024 * 1024) {
    return "1-5MB";
  }

  if (bytes < 20 * 1024 * 1024) {
    return "5-20MB";
  }

  if (bytes < 100 * 1024 * 1024) {
    return "20-100MB";
  }

  return "100MB+";
}

function sanitizePayload(payload: ToolAnalyticsPayload) {
  return {
    tool_name: payload.tool,
    route: payload.route,
    file_count: payload.fileCount,
    page_count: payload.pageCount,
    output_format: payload.outputFormat,
    mode: payload.mode,
    status: payload.status,
    error_code: payload.errorCode,
    file_size_bucket: payload.fileSizeBucket,
  };
}

