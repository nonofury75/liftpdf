"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useRecoverFromStaleChunk(error);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-center">
          <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-600">
              LiftPDF
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              The app needs to reload
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              A browser-side error stopped the app from loading. Reloading the
              latest version usually fixes this after a deployment.
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
                onClick={() => window.location.reload()}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Reload page
              </button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}

function useRecoverFromStaleChunk(error: Error) {
  useEffect(() => {
    if (!isChunkLoadError(error)) {
      return;
    }

    const reloadKey = "liftpdf:global-chunk-reload-attempted";

    if (window.sessionStorage.getItem(reloadKey) === "true") {
      return;
    }

    window.sessionStorage.setItem(reloadKey, "true");
    window.location.reload();
  }, [error]);
}

function isChunkLoadError(error: Error) {
  const value = `${error.name} ${error.message} ${error.stack ?? ""}`;

  return /ChunkLoadError|Loading chunk|failed to fetch dynamically imported module|Importing a module script failed/i.test(
    value,
  );
}
