"use client";

import { ArrowDown, ArrowUp, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type UploadedPdf = {
  id: string;
  file: File;
};

type PdfFileListProps = {
  files: UploadedPdf[];
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
};

export function PdfFileList({ files, onRemove, onMove }: PdfFileListProps) {
  if (!files.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Selected PDF files
          </h2>
          <p className="text-sm text-muted-foreground">
            {files.length} {files.length === 1 ? "PDF" : "PDFs"} ready
          </p>
        </div>
        <FileText className="size-5 text-primary" aria-hidden="true" />
      </div>

      <ul className="divide-y divide-border">
        {files.map((pdf, index) => (
          <li
            key={pdf.id}
            className="grid gap-4 p-4 sm:grid-cols-[48px_1fr_auto]"
          >
            <div className="grid size-12 place-items-center rounded-md border border-border bg-muted text-primary">
              <FileText className="size-5" aria-hidden="true" />
            </div>

            <div className="min-w-0 self-center">
              <p className="truncate text-sm font-semibold text-foreground">
                {pdf.file.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatFileSize(pdf.file.size)}
              </p>
            </div>

            <div className="flex items-center gap-2 self-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Move ${pdf.file.name} up`}
                disabled={index === 0}
                onClick={() => onMove(pdf.id, "up")}
              >
                <ArrowUp className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Move ${pdf.file.name} down`}
                disabled={index === files.length - 1}
                onClick={() => onMove(pdf.id, "down")}
              >
                <ArrowDown className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Remove ${pdf.file.name}`}
                onClick={() => onRemove(pdf.id)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}
