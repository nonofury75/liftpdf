"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, FileCheck2, Loader2, RotateCcw } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import {
  ImagePreviewList,
  UploadedImage,
} from "@/components/tools/image-preview-list";
import { ImageUploadZone } from "@/components/tools/image-upload-zone";
import { createClientId } from "@/lib/create-client-id";
import { cn } from "@/lib/utils";

type ImageToPdfToolProps = {
  downloadFileName: string;
};

type ImagePdfPageSize = "auto" | "a4" | "letter";
type ImagePdfOrientation = "auto" | "portrait" | "landscape";
type ImagePdfMargin = "none" | "small" | "medium";
type ImageFitMode = "fit" | "fill";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const pageSizeOptions: Array<{ label: string; value: ImagePdfPageSize }> = [
  { label: "Auto", value: "auto" },
  { label: "A4", value: "a4" },
  { label: "Letter", value: "letter" },
];
const orientationOptions: Array<{
  label: string;
  value: ImagePdfOrientation;
}> = [
  { label: "Auto", value: "auto" },
  { label: "Portrait", value: "portrait" },
  { label: "Landscape", value: "landscape" },
];
const marginOptions: Array<{ label: string; value: ImagePdfMargin }> = [
  { label: "None", value: "none" },
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
];
const fitOptions: Array<{ label: string; value: ImageFitMode }> = [
  { label: "Fit", value: "fit" },
  { label: "Fill", value: "fill" },
];
const fixedPageSizes: Record<Exclude<ImagePdfPageSize, "auto">, PageBox> = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};
const marginSizes: Record<ImagePdfMargin, number> = {
  none: 0,
  small: 24,
  medium: 48,
};

export function ImageToPdfTool({ downloadFileName }: ImageToPdfToolProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pageSize, setPageSize] = useState<ImagePdfPageSize>("a4");
  const [orientation, setOrientation] = useState<ImagePdfOrientation>("auto");
  const [margin, setMargin] = useState<ImagePdfMargin>("small");
  const [fitMode, setFitMode] = useState<ImageFitMode>("fit");
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const imagesRef = useRef<UploadedImage[]>([]);
  const pdfUrlRef = useRef<string | null>(null);

  const totalSize = useMemo(
    () => images.reduce((sum, image) => sum + image.file.size, 0),
    [images],
  );

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    pdfUrlRef.current = pdfUrl;
  }, [pdfUrl]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) =>
        URL.revokeObjectURL(image.previewUrl),
      );

      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, []);

  async function handleFilesSelected(files: File[]) {
    const validFiles = files.filter((file) => allowedImageTypes.has(file.type));
    const invalidCount = files.length - validFiles.length;

    if (invalidCount > 0) {
      setError("Only JPG, JPEG, PNG and WEBP files are supported.");
    } else {
      setError(null);
    }

    if (!validFiles.length) {
      return;
    }

    clearPdfUrl();

    const results = await Promise.allSettled(
      validFiles.map(createUploadedImage),
    );
    const uploadedImages = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );

    if (uploadedImages.length < validFiles.length) {
      setError("Some images could not be read and were skipped.");
    }

    setImages((currentImages) => [...currentImages, ...uploadedImages]);
  }

  function handleRemove(id: string) {
    clearPdfUrl();
    setImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return currentImages.filter((image) => image.id !== id);
    });
  }

  function handleMove(id: string, direction: "up" | "down") {
    clearPdfUrl();
    setImages((currentImages) => {
      const index = currentImages.findIndex((image) => image.id === id);

      if (index === -1) {
        return currentImages;
      }

      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= currentImages.length) {
        return currentImages;
      }

      const nextImages = [...currentImages];
      const [movedImage] = nextImages.splice(index, 1);
      nextImages.splice(nextIndex, 0, movedImage);

      return nextImages;
    });
  }

  async function handleConvert() {
    if (!images.length) {
      setError("Please choose at least one image before converting.");
      return;
    }

    setError(null);
    setIsConverting(true);
    clearPdfUrl();

    try {
      const pdfDocument = await PDFDocument.create();

      for (const image of images) {
        const imageBytes = await getEmbeddableImageBytes(image.file);
        const embeddedImage =
          imageBytes.type === "jpg"
            ? await pdfDocument.embedJpg(imageBytes.bytes)
            : await pdfDocument.embedPng(imageBytes.bytes);
        const marginSize = marginSizes[margin];
        const pageBox = getPageBox({
          imageWidth: embeddedImage.width,
          imageHeight: embeddedImage.height,
          margin: marginSize,
          orientation,
          pageSize,
        });
        const fittedSize = fitImageOnPage({
          imageWidth: embeddedImage.width,
          imageHeight: embeddedImage.height,
          margin: marginSize,
          mode: fitMode,
          pageHeight: pageBox.height,
          pageWidth: pageBox.width,
        });

        const page = pdfDocument.addPage([pageBox.width, pageBox.height]);
        page.drawImage(embeddedImage, {
          x: (pageBox.width - fittedSize.width) / 2,
          y: (pageBox.height - fittedSize.height) / 2,
          width: fittedSize.width,
          height: fittedSize.height,
        });
      }

      const pdfBytes = await pdfDocument.save();
      const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
      new Uint8Array(pdfBuffer).set(pdfBytes);

      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(blob));
    } catch {
      setError("The PDF could not be created. Please try another image file.");
    } finally {
      setIsConverting(false);
    }
  }

  function handleReset() {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setImages([]);
    setPageSize("a4");
    setOrientation("auto");
    setMargin("small");
    setFitMode("fit");
    setError(null);
    clearPdfUrl();
  }

  function clearPdfUrl() {
    setPdfUrl((currentPdfUrl) => {
      if (currentPdfUrl) {
        URL.revokeObjectURL(currentPdfUrl);
      }

      return null;
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <ImageUploadZone onFilesSelected={handleFilesSelected} />

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <ImagePreviewList
          images={images}
          onRemove={handleRemove}
          onMove={handleMove}
        />
      </div>

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">PDF settings</h2>
        <div className="mt-5 space-y-3 text-sm">
          <SummaryRow label="Page size" value={labelFor(pageSizeOptions, pageSize)} />
          <SummaryRow
            label="Orientation"
            value={labelFor(orientationOptions, orientation)}
          />
          <SummaryRow label="Margins" value={labelFor(marginOptions, margin)} />
          <SummaryRow label="Image fit" value={labelFor(fitOptions, fitMode)} />
          <SummaryRow label="Images" value={String(images.length)} />
          <SummaryRow label="Total size" value={formatFileSize(totalSize)} />
        </div>

        <div className="mt-6 space-y-5">
          <OptionGroup
            label="Page size"
            options={pageSizeOptions}
            value={pageSize}
            onChange={setPageSize}
            onBeforeChange={clearPdfUrl}
          />
          <OptionGroup
            label="Orientation"
            options={orientationOptions}
            value={orientation}
            onChange={setOrientation}
            onBeforeChange={clearPdfUrl}
          />
          <OptionGroup
            label="Margins"
            options={marginOptions}
            value={margin}
            onChange={setMargin}
            onBeforeChange={clearPdfUrl}
          />
          <OptionGroup
            label="Image fit"
            options={fitOptions}
            value={fitMode}
            onChange={setFitMode}
            onBeforeChange={clearPdfUrl}
          />
        </div>

        <div className="mt-6 grid gap-3">
          <Button type="button" onClick={handleConvert} disabled={isConverting}>
            {isConverting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Convert to PDF
          </Button>

          {pdfUrl ? (
            <Button asChild variant="outline">
              <a href={pdfUrl} download={downloadFileName}>
                <Download className="size-4" aria-hidden="true" />
                Download PDF
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setError("Convert your images before downloading the PDF.")
              }
            >
              <Download className="size-4" aria-hidden="true" />
              Download PDF
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {pdfUrl ? (
          <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            Your PDF is ready to download.
          </p>
        ) : null}
      </aside>
    </div>
  );
}

type OptionGroupProps<T extends string> = {
  label: string;
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
  onBeforeChange: () => void;
};

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  onBeforeChange,
}: OptionGroupProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-foreground">
        {label}
      </legend>
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              "rounded-md border border-border px-3 py-2 text-left text-sm font-medium transition-colors",
              value === option.value
                ? "border-primary bg-primary/10 text-primary"
                : "bg-background text-foreground hover:bg-muted",
            )}
            onClick={() => {
              onBeforeChange();
              onChange(option.value);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

async function readImageDimensions(src: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => reject(new Error("Invalid image"));
    image.src = src;
  });
}

async function createUploadedImage(file: File): Promise<UploadedImage> {
  const previewUrl = URL.createObjectURL(file);

  try {
    const dimensions = await readImageDimensions(previewUrl);

    return {
      id: createClientId("image"),
      file,
      previewUrl,
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch (error) {
    URL.revokeObjectURL(previewUrl);
    throw error;
  }
}

async function getEmbeddableImageBytes(file: File) {
  if (file.type === "image/jpeg") {
    return {
      type: "jpg" as const,
      bytes: await file.arrayBuffer(),
    };
  }

  if (file.type === "image/png") {
    return {
      type: "png" as const,
      bytes: await file.arrayBuffer(),
    };
  }

  return {
    type: "png" as const,
    bytes: await convertImageToPngBytes(file),
  };
}

async function convertImageToPngBytes(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadHtmlImage(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas is not available");
    }

    context.drawImage(image, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Image conversion failed"));
        }
      }, "image/png");
    });

    return blob.arrayBuffer();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function loadHtmlImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not load"));
    image.src = src;
  });
}

type PageBox = {
  width: number;
  height: number;
};

function getPageBox({
  imageWidth,
  imageHeight,
  margin,
  orientation,
  pageSize,
}: {
  imageWidth: number;
  imageHeight: number;
  margin: number;
  orientation: ImagePdfOrientation;
  pageSize: ImagePdfPageSize;
}) {
  const naturalPage =
    pageSize === "auto"
      ? {
          width: imageWidth + margin * 2,
          height: imageHeight + margin * 2,
        }
      : fixedPageSizes[pageSize];

  return orientPageBox(naturalPage, orientation, imageWidth >= imageHeight);
}

function orientPageBox(
  pageBox: PageBox,
  orientation: ImagePdfOrientation,
  imageIsLandscape: boolean,
) {
  const shouldBeLandscape =
    orientation === "landscape" ||
    (orientation === "auto" && imageIsLandscape);
  const width = shouldBeLandscape
    ? Math.max(pageBox.width, pageBox.height)
    : Math.min(pageBox.width, pageBox.height);
  const height = shouldBeLandscape
    ? Math.min(pageBox.width, pageBox.height)
    : Math.max(pageBox.width, pageBox.height);

  return { width, height };
}

function fitImageOnPage({
  imageWidth,
  imageHeight,
  margin,
  mode,
  pageWidth,
  pageHeight,
}: {
  imageWidth: number;
  imageHeight: number;
  margin: number;
  mode: ImageFitMode;
  pageWidth: number;
  pageHeight: number;
}) {
  const availableWidth = Math.max(1, pageWidth - margin * 2);
  const availableHeight = Math.max(1, pageHeight - margin * 2);
  const ratio =
    mode === "fill"
      ? Math.max(availableWidth / imageWidth, availableHeight / imageHeight)
      : Math.min(availableWidth / imageWidth, availableHeight / imageHeight);

  return {
    width: imageWidth * ratio,
    height: imageHeight * ratio,
  };
}

function labelFor<T extends string>(
  options: Array<{ label: string; value: T }>,
  value: T,
) {
  return options.find((option) => option.value === value)?.label ?? value;
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
