"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import {
  CheckCircle2,
  Download,
  FileCheck2,
  Loader2,
  RotateCcw,
} from "lucide-react";
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
  acceptedImageTypes?: string[];
  addMoreAriaLabel?: string;
  invalidFileMessage?: string;
  uploadButtonLabel?: string;
  uploadDescription?: string;
  uploadTitle?: string;
};

type ImagePdfPageSize = "auto" | "a4" | "letter";
type ImagePdfOrientation = "auto" | "portrait" | "landscape";
type ImagePdfMargin = "none" | "small" | "large";
type ImageFitMode = "fit" | "fill";

const defaultAcceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const pageSizeOptions: Array<{
  label: string;
  value: ImagePdfPageSize;
  description?: string;
}> = [
  { label: "Auto", value: "auto", description: "Match image ratio" },
  { label: "A4", value: "a4", description: "210 x 297 mm" },
  { label: "Letter", value: "letter", description: "8.5 x 11 in" },
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
  { label: "Large", value: "large" },
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
  large: 72,
};

export function ImageToPdfTool({
  downloadFileName,
  acceptedImageTypes = defaultAcceptedImageTypes,
  addMoreAriaLabel = "Add more images",
  invalidFileMessage = "Only JPG, JPEG, PNG and WEBP files are supported.",
  uploadButtonLabel = "Choose files",
  uploadDescription,
  uploadTitle,
}: ImageToPdfToolProps) {
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
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const acceptedImageTypeSet = useMemo(
    () => new Set(acceptedImageTypes),
    [acceptedImageTypes],
  );
  const acceptedImageTypeList = acceptedImageTypes.join(",");

  const totalSize = useMemo(
    () => images.reduce((sum, image) => sum + image.file.size, 0),
    [images],
  );
  const previewModel = useMemo(
    () =>
      createPreviewModel({
        fitMode,
        image: images[0],
        margin,
        orientation,
        pageSize,
      }),
    [fitMode, images, margin, orientation, pageSize],
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
    const validFiles = files.filter((file) =>
      acceptedImageTypeSet.has(file.type),
    );
    const invalidCount = files.length - validFiles.length;

    if (invalidCount > 0) {
      setError(invalidFileMessage);
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

  function handleAddMoreChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files;

    if (selectedFiles?.length) {
      void handleFilesSelected(Array.from(selectedFiles));
    }

    event.target.value = "";
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="order-1 space-y-6 xl:col-start-1 xl:row-start-1">
        {!images.length ? (
          <ImageUploadZone
            accept={acceptedImageTypeList}
            buttonLabel={uploadButtonLabel}
            description={uploadDescription}
            title={uploadTitle}
            onFilesSelected={handleFilesSelected}
          />
        ) : null}

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {images.length ? (
          <>
            <PdfLivePreview
              image={images[0]}
              margin={margin}
              model={previewModel}
            />
            <input
              ref={addMoreInputRef}
              type="file"
              accept={acceptedImageTypeList}
              multiple
              aria-label={addMoreAriaLabel}
              className="hidden"
              onChange={handleAddMoreChange}
            />
          </>
        ) : null}
      </div>

      <aside className="order-2 h-fit rounded-2xl border border-border bg-card p-6 shadow-md xl:sticky xl:top-24 xl:col-start-2 xl:row-span-2 xl:row-start-1">
        <h2 className="text-xl font-semibold text-foreground">PDF settings</h2>
        <div className="mt-5 space-y-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
          <SummaryRow
            label="Orientation"
            value={labelFor(orientationOptions, orientation)}
          />
          <SummaryRow label="Page size" value={labelFor(pageSizeOptions, pageSize)} />
          <SummaryRow label="Margins" value={labelFor(marginOptions, margin)} />
          <SummaryRow label="Image fit" value={labelFor(fitOptions, fitMode)} />
          <SummaryRow label="Images" value={String(images.length)} />
          <SummaryRow label="Total size" value={formatFileSize(totalSize)} />
        </div>

        <div className="mt-7 space-y-7">
          <OptionGroup
            label="Page orientation"
            options={orientationOptions}
            value={orientation}
            onChange={setOrientation}
            onBeforeChange={clearPdfUrl}
          />
          <OptionGroup
            label="Page size"
            options={pageSizeOptions}
            value={pageSize}
            onChange={setPageSize}
            onBeforeChange={clearPdfUrl}
          />
          <OptionGroup
            label="Margin"
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

        <div className="mt-7 grid gap-3">
          <Button
            type="button"
            onClick={handleConvert}
            disabled={isConverting}
            className="h-12 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            {isConverting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Convert to PDF
          </Button>

          {pdfUrl ? (
            <>
              <p
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all duration-200"
                aria-live="polite"
              >
                <CheckCircle2 className="mr-2 inline size-4" aria-hidden="true" />
                PDF created successfully
              </p>
              <Button
                asChild
                variant="outline"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <a href={pdfUrl} download={downloadFileName}>
                  <Download className="size-4" aria-hidden="true" />
                  Download PDF
                </a>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                onClick={handleReset}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Convert another file
              </Button>
            </>
          ) : null}

          {!pdfUrl ? (
            <Button type="button" variant="ghost" onClick={handleReset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          ) : null}
        </div>
      </aside>

      {images.length ? (
        <div className="order-3 xl:col-start-1 xl:row-start-2">
          <ImagePreviewList
            images={images}
            onRemove={handleRemove}
            onMove={handleMove}
            onAddMore={() => addMoreInputRef.current?.click()}
          />
        </div>
      ) : null}
    </div>
  );
}

type OptionGroupProps<T extends string> = {
  label: string;
  options: Array<{ description?: string; label: string; value: T }>;
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
              "rounded-lg border border-border px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
              value === option.value
                ? "border-primary bg-primary/10 text-primary"
                : "bg-background text-foreground hover:bg-muted",
            )}
            onClick={() => {
              onBeforeChange();
              onChange(option.value);
            }}
          >
            <span className="block">{option.label}</span>
            {option.description ? (
              <span className="mt-1 block text-xs font-medium text-muted-foreground">
                {option.description}
              </span>
            ) : null}
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
    <div className="flex items-center justify-between gap-4 border-b border-border/80 pb-3 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}

type PdfLivePreviewProps = {
  image: UploadedImage;
  margin: ImagePdfMargin;
  model: PreviewModel;
};

function PdfLivePreview({ image, margin, model }: PdfLivePreviewProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            PDF preview
          </h2>
          <p className="text-sm text-muted-foreground">
            The first page updates instantly as you change settings.
          </p>
        </div>
        <span className="rounded-md bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
          {Math.round(model.pageWidth)} x {Math.round(model.pageHeight)} pt
        </span>
      </div>

      <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-3 shadow-inner sm:min-h-[610px] sm:p-5 xl:min-h-[660px]">
        <div
          aria-label="Live PDF page preview"
          data-preview-orientation={model.isLandscape ? "landscape" : "portrait"}
          data-preview-margin={margin}
          className="relative bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)] ring-1 ring-black/10 transition-[aspect-ratio,width,max-height,transform,box-shadow] duration-200 ease-out"
          style={{
            aspectRatio: `${model.pageWidth} / ${model.pageHeight}`,
            width: model.isLandscape ? "min(100%, 720px)" : "min(90%, 470px)",
            maxHeight: "620px",
          }}
        >
          <div
            className="absolute overflow-hidden rounded-sm border border-dashed border-primary/25 bg-primary/5 transition-[inset,transform] duration-200 ease-out"
            style={{
              inset: `${model.marginPercent}%`,
            }}
          >
            <NextImage
              src={image.previewUrl}
              alt=""
              fill
              sizes="520px"
              className="transition-[object-fit,transform] duration-200 ease-out"
              unoptimized
              style={{
                objectFit: model.fitMode === "fill" ? "cover" : "contain",
                transform:
                  model.fitMode === "fill" ? "scale(1.025)" : "scale(1)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type PreviewModel = {
  fitMode: ImageFitMode;
  isLandscape: boolean;
  marginPercent: number;
  pageHeight: number;
  pageWidth: number;
};

function createPreviewModel({
  fitMode,
  image,
  margin,
  orientation,
  pageSize,
}: {
  fitMode: ImageFitMode;
  image: UploadedImage | undefined;
  margin: ImagePdfMargin;
  orientation: ImagePdfOrientation;
  pageSize: ImagePdfPageSize;
}): PreviewModel {
  const imageWidth = image?.width ?? 595;
  const imageHeight = image?.height ?? 842;
  const marginSize = marginSizes[margin];
  const pageBox = getPageBox({
    imageHeight,
    imageWidth,
    margin: marginSize,
    orientation,
    pageSize,
  });
  const shortestSide = Math.min(pageBox.width, pageBox.height);

  return {
    fitMode,
    isLandscape: pageBox.width > pageBox.height,
    marginPercent: Math.min(22, (marginSize / shortestSide) * 100),
    pageHeight: pageBox.height,
    pageWidth: pageBox.width,
  };
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
