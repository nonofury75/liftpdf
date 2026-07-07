"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
};

type ImagePreviewListProps = {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onAddMore?: () => void;
};

export function ImagePreviewList({
  images,
  onRemove,
  onMove,
  onAddMore,
}: ImagePreviewListProps) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Selected images
          </h2>
          <p className="text-sm text-muted-foreground">
            {images.length} {images.length === 1 ? "image" : "images"} ready
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onAddMore ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-primary/25 bg-background text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              onClick={onAddMore}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add more images
            </Button>
          ) : null}
          <ImageIcon className="size-5 text-primary" aria-hidden="true" />
        </div>
      </div>

      <ul className="grid gap-4 p-5">
        {images.map((image, index) => (
          <li
            key={image.id}
            className="grid gap-4 rounded-xl border border-border bg-background p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md sm:grid-cols-[136px_1fr_auto]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted shadow-inner sm:size-[136px]">
              <Image
                src={image.previewUrl}
                alt=""
                fill
                sizes="136px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="min-w-0 self-center">
              <p className="truncate text-sm font-semibold text-foreground">
                {image.file.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatFileSize(image.file.size)} - {image.width} x{" "}
                {image.height}px
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 self-center justify-self-start sm:grid-cols-1 sm:justify-self-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                aria-label={`Move ${image.file.name} up`}
                disabled={index === 0}
                onClick={() => onMove(image.id, "up")}
              >
                <ArrowUp className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                aria-label={`Move ${image.file.name} down`}
                disabled={index === images.length - 1}
                onClick={() => onMove(image.id, "down")}
              >
                <ArrowDown className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
                aria-label={`Remove ${image.file.name}`}
                onClick={() => onRemove(image.id)}
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
