"use client";

import { ErrorRecoveryPanel } from "@/components/layout/error-recovery-panel";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-center">
          <ErrorRecoveryPanel
            error={error}
            reset={reset}
            title="The app needs to reload"
            description="A browser-side error stopped the app from loading. Reloading the latest version usually fixes this after a deployment."
            framed
          />
        </main>
      </body>
    </html>
  );
}
