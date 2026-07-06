"use client";

import { FileText } from "lucide-react";

type PdfFileSummaryProps = {
  fileName: string;
  fileSize: number;
  pageCount: number | null;
};

export function PdfFileSummary({
  fileName,
  fileSize,
  pageCount,
}: PdfFileSummaryProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-[48px_1fr]">
        <div className="grid size-12 place-items-center rounded-md border border-border bg-muted text-primary">
          <FileText className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {fileName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatFileSize(fileSize)} -{" "}
            {pageCount === null
              ? "Locked PDF"
              : `${pageCount} ${pageCount === 1 ? "page" : "pages"}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}
