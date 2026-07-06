"use client";

import { useEffect } from "react";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  useRecoverFromStaleChunk(error);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-600">
        LiftPDF
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
        The tool could not load correctly. This can happen after a fresh
        deployment if your browser kept an older version of the app.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
    </main>
  );
}

function useRecoverFromStaleChunk(error: Error) {
  useEffect(() => {
    if (!isChunkLoadError(error)) {
      return;
    }

    const reloadKey = "liftpdf:chunk-reload-attempted";

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
