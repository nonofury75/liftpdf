"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  GripVertical,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type UploadedPdf = {
  id: string;
  file: File;
  pageCount: number | null;
  previewHeight: number | null;
  previewUrl: string | null;
  previewWidth: number | null;
  status: "loading" | "ready" | "error";
};

type PdfFileListProps = {
  files: UploadedPdf[];
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onReorder?: (draggedId: string, targetId: string) => void;
  onAddMore?: () => void;
};

export function PdfFileList({
  files,
  onRemove,
  onMove,
  onReorder,
  onAddMore,
}: PdfFileListProps) {
  if (!files.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Selected PDF files
          </h2>
          <p className="text-sm text-muted-foreground">
            {files.length} {files.length === 1 ? "PDF" : "PDFs"} in merge order
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onAddMore ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-primary/25 bg-background text-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              onClick={onAddMore}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add PDF files
            </Button>
          ) : null}
          <FileText className="size-5 text-primary" aria-hidden="true" />
        </div>
      </div>

      <ul className="grid gap-4 p-5">
        {files.map((pdf, index) => (
          <PdfFileCard
            key={pdf.id}
            files={files}
            index={index}
            onMove={onMove}
            onRemove={onRemove}
            onReorder={onReorder}
            pdf={pdf}
          />
        ))}
      </ul>
    </div>
  );
}

type PdfFileCardProps = {
  files: UploadedPdf[];
  index: number;
  pdf: UploadedPdf;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onReorder?: (draggedId: string, targetId: string) => void;
};

function PdfFileCard({
  files,
  index,
  pdf,
  onRemove,
  onMove,
  onReorder,
}: PdfFileCardProps) {
  const pageLabel =
    pdf.status === "loading"
      ? "Reading pages..."
      : pdf.pageCount === null
        ? "Preview unavailable"
        : `${pdf.pageCount} ${pdf.pageCount === 1 ? "page" : "pages"}`;

  return (
    <li
      draggable={Boolean(onReorder)}
      className="group grid gap-4 rounded-xl border border-border bg-background p-4 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md sm:grid-cols-[118px_1fr_auto]"
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", pdf.id);
      }}
      onDragOver={(event) => {
        if (!onReorder) {
          return;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        if (!onReorder) {
          return;
        }

        event.preventDefault();
        const draggedId = event.dataTransfer.getData("text/plain");

        if (draggedId && draggedId !== pdf.id) {
          onReorder(draggedId, pdf.id);
        }
      }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-muted shadow-inner sm:w-[118px]">
        {pdf.previewUrl ? (
          <Image
            src={pdf.previewUrl}
            alt=""
            fill
            sizes="118px"
            className="object-contain"
            unoptimized
          />
        ) : (
          <div className="grid size-full place-items-center text-primary">
            {pdf.status === "loading" ? (
              <Loader2 className="size-6 animate-spin" aria-hidden="true" />
            ) : (
              <FileText className="size-7" aria-hidden="true" />
            )}
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold text-foreground shadow-sm">
          #{index + 1}
        </span>
      </div>

      <div className="min-w-0 self-center">
        <div className="flex items-center gap-2">
          <GripVertical
            className={cn(
              "hidden size-4 shrink-0 text-muted-foreground transition-colors sm:block",
              onReorder && "group-hover:text-primary",
            )}
            aria-hidden="true"
          />
          <p className="truncate text-sm font-semibold text-foreground">
            {pdf.file.name}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-md bg-muted px-2 py-1">
            {pageLabel}
          </span>
          <span className="rounded-md bg-muted px-2 py-1">
            {formatFileSize(pdf.file.size)}
          </span>
          {pdf.previewWidth && pdf.previewHeight ? (
            <span className="rounded-md bg-muted px-2 py-1">
              {pdf.previewWidth} x {pdf.previewHeight} pt
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Position {index + 1} in the merged PDF
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 self-center justify-self-start sm:grid-cols-1 sm:justify-self-end">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
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
          className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
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
          className="transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
          aria-label={`Remove ${pdf.file.name}`}
          onClick={() => onRemove(pdf.id)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
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
