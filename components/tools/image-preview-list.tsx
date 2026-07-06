"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, ImageIcon, Trash2 } from "lucide-react";
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
};

export function ImagePreviewList({
  images,
  onRemove,
  onMove,
}: ImagePreviewListProps) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Selected images
          </h2>
          <p className="text-sm text-muted-foreground">
            {images.length} {images.length === 1 ? "image" : "images"} ready
          </p>
        </div>
        <ImageIcon className="size-5 text-primary" aria-hidden="true" />
      </div>

      <ul className="divide-y divide-border">
        {images.map((image, index) => (
          <li
            key={image.id}
            className="grid gap-4 p-4 sm:grid-cols-[72px_1fr_auto]"
          >
            <div className="relative size-[72px] overflow-hidden rounded-md border border-border bg-muted">
              <Image
                src={image.previewUrl}
                alt=""
                fill
                sizes="72px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="min-w-0 self-center">
              <p className="truncate text-sm font-semibold text-foreground">
                {image.file.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatFileSize(image.file.size)} · {image.width} ×{" "}
                {image.height}px
              </p>
            </div>

            <div className="flex items-center gap-2 self-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
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
