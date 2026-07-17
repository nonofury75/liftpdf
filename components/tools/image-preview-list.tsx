"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  Plus,
  RotateCcw,
  RotateCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  rotation: ImageRotation;
};

export type ImageRotation = 0 | 90 | 180 | 270;

type ImagePreviewListProps = {
  allowIndividualRotation?: boolean;
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onRotate?: (id: string, direction: "left" | "right") => void;
  onAddMore?: () => void;
  presentation?: "standard" | "showcase";
};

export function ImagePreviewList({
  allowIndividualRotation = false,
  images,
  onRemove,
  onMove,
  onRotate,
  onAddMore,
  presentation = "standard",
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
              className="border-primary/25 bg-background text-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              onClick={onAddMore}
            >
              <Plus
                className={presentation === "showcase" ? "size-[18px]" : "size-4"}
                aria-hidden="true"
              />
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
            className={
              presentation === "showcase"
                ? "grid gap-5 rounded-xl border border-border bg-background p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md sm:grid-cols-[150px_1fr_auto]"
                : "grid gap-4 rounded-xl border border-border bg-background p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md sm:grid-cols-[136px_1fr_auto]"
            }
          >
            <div
              className={
                presentation === "showcase"
                  ? "relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted shadow-inner sm:size-[150px]"
                  : "relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted shadow-inner sm:size-[136px]"
              }
            >
              <div
                className="absolute left-1/2 top-1/2 transition-transform duration-200 ease-out"
                style={getRotatedPreviewStyle(image.rotation)}
              >
                <Image
                  src={image.previewUrl}
                  alt=""
                  fill
                  sizes={presentation === "showcase" ? "150px" : "136px"}
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            <div className="min-w-0 self-center sm:pr-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {image.file.name}
              </p>
              <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {formatFileSize(image.file.size)} - {image.width} x{" "}
                  {image.height}px
                </span>
                {allowIndividualRotation && image.rotation !== 0 ? (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {image.rotation} deg
                  </span>
                ) : null}
              </p>
            </div>

            <div
              className={cn(
                "grid gap-2 self-center justify-self-start sm:justify-self-end",
                allowIndividualRotation
                  ? "grid-cols-5 sm:grid-cols-1"
                  : "grid-cols-3 sm:grid-cols-1",
              )}
            >
              {allowIndividualRotation && onRotate ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="min-h-11 min-w-11 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                    aria-label={`Rotate ${image.file.name} left`}
                    onClick={() => onRotate(image.id, "left")}
                  >
                    <RotateCcw className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="min-h-11 min-w-11 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                    aria-label={`Rotate ${image.file.name} right`}
                    onClick={() => onRotate(image.id, "right")}
                  >
                    <RotateCw className="size-4" aria-hidden="true" />
                  </Button>
                </>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="min-h-11 min-w-11 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
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
                className="min-h-11 min-w-11 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
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
                className="min-h-11 min-w-11 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
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

function getRotatedPreviewStyle(rotation: ImageRotation) {
  const normalizedRotation = normalizeImageRotation(rotation);
  const isSideways = normalizedRotation === 90 || normalizedRotation === 270;

  return {
    height: isSideways ? "100%" : "100%",
    transform: `translate(-50%, -50%) rotate(${normalizedRotation}deg)`,
    width: isSideways ? "75%" : "100%",
    aspectRatio: isSideways ? "3 / 4" : "4 / 3",
  };
}

function normalizeImageRotation(rotation: number): ImageRotation {
  return (((rotation % 360) + 360) % 360) as ImageRotation;
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
