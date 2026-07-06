"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import {
  BadgeCheck,
  ImagePlus,
  LockKeyhole,
  MonitorCheck,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploadZoneProps = {
  onFilesSelected: (files: File[]) => void;
};

const acceptedImageTypes = "image/jpeg,image/png,image/webp";

export function ImageUploadZone({ onFilesSelected }: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    onFilesSelected(Array.from(files));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.target.files);
    event.target.value = "";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  return (
    <div
      className={cn(
        "flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-sm transition-colors",
        isDragging && "border-primary bg-primary/10 ring-2 ring-primary/20",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptedImageTypes}
        multiple
        aria-label="Choose image files"
        className="hidden"
        onChange={handleInputChange}
      />

      <span className="grid size-16 place-items-center rounded-xl bg-primary/10 text-primary">
        <ImagePlus className="size-8" aria-hidden="true" />
      </span>

      <h2 className="mt-5 text-xl font-semibold text-foreground">
        Drop your images here
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Drop files here or choose files. Upload JPG, JPEG, PNG or WEBP files.
        Each image will become one A4 PDF page.
      </p>

      <Button
        type="button"
        className="mt-6"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-4" aria-hidden="true" />
        Choose files
      </Button>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {[
          { label: "Free", icon: BadgeCheck },
          { label: "Secure", icon: LockKeyhole },
          { label: "Works in your browser", icon: MonitorCheck },
        ].map((badge) => {
          const Icon = badge.icon;

          return (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
            >
              <Icon className="size-3.5 text-primary" aria-hidden="true" />
              {badge.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
