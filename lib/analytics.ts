"use client";

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
  advancedPermissionsEnabled?: boolean;
  printingMode?: string;
  copyingAllowed?: boolean;
  editingPreset?: string;
};

export type AnalyticsConsent = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const analyticsConsentStorageKey = "liftpdf_analytics_consent";
export const analyticsConsentChangedEvent = "liftpdf:analytics-consent-changed";

export function trackToolEvent(
  eventName: ToolEventName,
  payload: ToolAnalyticsPayload,
) {
  if (!canTrackAnalytics()) {
    return;
  }

  window.gtag?.("event", eventName, {
    send_to: gaMeasurementId,
    ...sanitizePayload(payload),
  });
}

export function trackPageView(url: string) {
  if (!canTrackAnalytics()) {
    return;
  }

  window.gtag?.("event", "page_view", {
    send_to: gaMeasurementId,
    page_location: window.location.origin + url,
    page_path: url,
  });
}

export function getStoredAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(analyticsConsentStorageKey);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setStoredAnalyticsConsent(consent: AnalyticsConsent) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(analyticsConsentStorageKey, consent);
  window.dispatchEvent(
    new CustomEvent(analyticsConsentChangedEvent, { detail: consent }),
  );
}

export function canTrackAnalytics() {
  return (
    Boolean(gaMeasurementId) &&
    typeof window !== "undefined" &&
    getStoredAnalyticsConsent() === "accepted" &&
    typeof window.gtag === "function"
  );
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
    advanced_permissions_enabled: payload.advancedPermissionsEnabled,
    printing_mode: payload.printingMode,
    copying_allowed: payload.copyingAllowed,
    editing_preset: payload.editingPreset,
  };
}
