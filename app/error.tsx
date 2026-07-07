"use client";

import { ErrorRecoveryPanel } from "@/components/layout/error-recovery-panel";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <ErrorRecoveryPanel
      error={error}
      reset={reset}
      title="Something went wrong"
      description="The tool could not load correctly. This can happen after a fresh deployment if your browser kept an older version of the app."
    />
  );
}
