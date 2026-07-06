"use client";

import Image from "next/image";
import { memo } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PdfPageThumbnail = {
  pageNumber: number;
  previewUrl: string;
  width: number;
  height: number;
};

type PageThumbnailProps = {
  page: PdfPageThumbnail;
  isSelected: boolean;
  onToggle: (pageNumber: number) => void;
  onDelete?: (pageNumber: number) => void;
  deleteLabel?: string;
};

export const PageThumbnail = memo(function PageThumbnail({
  page,
  isSelected,
  onToggle,
  onDelete,
  deleteLabel = "Delete",
}: PageThumbnailProps) {
  return (
    <article
      className={cn(
        "rounded-lg border bg-background p-3 transition-colors",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(page.pageNumber)}
        aria-pressed={isSelected}
        aria-label={`Select page ${page.pageNumber}`}
        className="group relative flex min-h-48 w-full items-center justify-center overflow-hidden rounded-md bg-muted p-3 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Image
          src={page.previewUrl}
          alt={`Preview of page ${page.pageNumber}`}
          width={160}
          height={220}
          className="h-auto max-h-52 w-auto rounded-sm bg-white shadow-sm"
          unoptimized
        />
        <span
          className={cn(
            "absolute right-3 top-3 grid size-7 place-items-center rounded-full border text-xs font-bold transition-colors",
            isSelected
              ? "border-primary bg-primary text-white"
              : "border-border bg-background text-muted-foreground",
          )}
          aria-hidden="true"
        >
          {isSelected ? <Check className="size-4" /> : page.pageNumber}
        </span>
      </button>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Page {page.pageNumber}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {page.width} x {page.height} pt
          </p>
        </div>
        {onDelete ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onDelete(page.pageNumber)}
            aria-label={`${deleteLabel} page ${page.pageNumber}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    </article>
  );
});
