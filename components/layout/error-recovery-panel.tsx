"use client";

import { useEffect, useMemo, useState } from "react";

type ErrorRecoveryPanelProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title: string;
  description: string;
  framed?: boolean;
};

export function ErrorRecoveryPanel({
  error,
  reset,
  title,
  description,
  framed = false,
}: ErrorRecoveryPanelProps) {
  useRecoverFromClientError(error);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const errorDetails = useMemo(() => createErrorDetails(error), [error]);

  const content = (
    <>
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-600">
        LiftPDF
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
        {description}
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => reloadWithFreshUrl()}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          Reload latest version
        </button>
        <button
          type="button"
          onClick={() => clearBrowserStateAndReload()}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          Clear cache
        </button>
      </div>
      <div className="mt-8 w-full max-w-2xl rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-slate-950">
            Error details
          </h2>
          <button
            type="button"
            onClick={async () => {
              const copied = await copyText(errorDetails);
              setCopyStatus(
                copied
                  ? "Copied error details."
                  : "Could not copy. Select the text manually.",
              );
            }}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            Copy error details
          </button>
        </div>
        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-xs leading-5 text-slate-700">
          {errorDetails}
        </pre>
        {copyStatus ? (
          <p className="mt-2 text-sm font-medium text-slate-600" aria-live="polite">
            {copyStatus}
          </p>
        ) : null}
      </div>
    </>
  );

  if (framed) {
    return (
      <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {content}
      </section>
    );
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      {content}
    </main>
  );
}

function createErrorDetails(error: Error & { digest?: string }) {
  const now = new Date().toISOString();
  const route =
    typeof window === "undefined"
      ? "unknown"
      : `${window.location.pathname}${window.location.search}`;
  const browser =
    typeof navigator === "undefined" ? "unknown" : navigator.userAgent;

  return [
    `timestamp: ${now}`,
    `route: ${route}`,
    `browser: ${browser}`,
    `error.name: ${error.name || "Unknown"}`,
    `error.message: ${error.message || "No message"}`,
    `error.digest: ${error.digest ?? "none"}`,
    "componentStack: unavailable in Next.js App Router error.tsx",
    "error.stack:",
    error.stack ?? "No stack",
  ].join("\n");
}

async function copyText(text: string) {
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

function useRecoverFromClientError(error: Error) {
  useEffect(() => {
    console.error("LiftPDF client error boundary:", error);

    const reloadKey = createReloadKey(error);

    if (window.sessionStorage.getItem(reloadKey) === "true") {
      return;
    }

    window.sessionStorage.setItem(reloadKey, "true");
    reloadWithFreshUrl();
  }, [error]);
}

function createReloadKey(error: Error & { digest?: string }) {
  const fingerprint = `${error.name}:${error.message}:${error.digest ?? ""}`
    .replace(/[^a-z0-9:._-]/gi, "-")
    .slice(0, 140);

  return `liftpdf:error-reload:${fingerprint}`;
}

function reloadWithFreshUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("liftpdf_reload", Date.now().toString());
  window.location.replace(url.toString());
}

async function clearBrowserStateAndReload() {
  window.sessionStorage.clear();

  if ("caches" in window) {
    const cacheNames = await window.caches.keys();
    await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
  }

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister()),
    );
  }

  reloadWithFreshUrl();
}
