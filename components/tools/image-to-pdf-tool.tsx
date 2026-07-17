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
import { degrees, PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import {
  ImageRotation,
  ImagePreviewList,
  UploadedImage,
} from "@/components/tools/image-preview-list";
import { ImageUploadZone } from "@/components/tools/image-upload-zone";
import {
  getFileSizeBucket,
  summarizeFilesForAnalytics,
  useToolAnalytics,
} from "@/hooks/use-tool-analytics";
import { createClientId } from "@/lib/create-client-id";
import { cn } from "@/lib/utils";

type ImageToPdfToolProps = {
  downloadFileName: string;
  acceptedImageTypes?: string[];
  addMoreAriaLabel?: string;
  allowIndividualRotation?: boolean;
  invalidFileMessage?: string;
  presentation?: "standard" | "showcase";
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
  allowIndividualRotation = false,
  invalidFileMessage = "Only JPG, JPEG, PNG and WEBP files are supported.",
  presentation = "standard",
  uploadButtonLabel = "Choose files",
  uploadDescription,
  uploadTitle,
}: ImageToPdfToolProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pageSize, setPageSize] = useState<ImagePdfPageSize | null>(null);
  const [orientation, setOrientation] = useState<ImagePdfOrientation | null>(null);
  const [margin, setMargin] = useState<ImagePdfMargin | null>(null);
  const [fitMode, setFitMode] = useState<ImageFitMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const imagesRef = useRef<UploadedImage[]>([]);
  const pdfUrlRef = useRef<string | null>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const toolName = getToolNameFromFileName(downloadFileName);
  const analytics = useToolAnalytics({
    tool: toolName,
    route: `/${downloadFileName.replace(".pdf", "")}`,
  });
  const acceptedImageTypeSet = useMemo(
    () => new Set(acceptedImageTypes),
    [acceptedImageTypes],
  );
  const acceptedImageTypeList = acceptedImageTypes.join(",");
  const effectiveFitMode = fitMode ?? "fit";
  const effectiveMargin = margin ?? "none";
  const effectiveOrientation = orientation ?? "auto";
  const effectivePageSize = pageSize ?? "auto";

  const totalSize = useMemo(
    () => images.reduce((sum, image) => sum + image.file.size, 0),
    [images],
  );
  const previewModel = useMemo(
    () =>
      createPreviewModel({
        fitMode: effectiveFitMode,
        image: images[0],
        margin: effectiveMargin,
        orientation: effectiveOrientation,
        pageSize: effectivePageSize,
      }),
    [
      effectiveFitMode,
      effectiveMargin,
      effectiveOrientation,
      effectivePageSize,
      images,
    ],
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
    analytics.trackUploadStarted(summarizeFilesForAnalytics(files));
    const validFiles = files.filter((file) =>
      acceptedImageTypeSet.has(file.type),
    );
    const invalidCount = files.length - validFiles.length;

    if (invalidCount > 0) {
      setError(invalidFileMessage);
      analytics.trackError({ errorCode: "invalid_file_type" });
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
      analytics.trackError({ errorCode: "image_read_failed" });
    }

    setImages((currentImages) => [...currentImages, ...uploadedImages]);
    analytics.trackUploadCompleted({
      ...summarizeFilesForAnalytics(validFiles),
      outputFormat: "pdf",
    });
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

  function handleRotate(id: string, direction: "left" | "right") {
    clearPdfUrl();
    setImages((currentImages) =>
      currentImages.map((image) => {
        if (image.id !== id) {
          return image;
        }

        return {
          ...image,
          rotation: normalizeImageRotation(
            image.rotation + (direction === "right" ? 90 : -90),
          ),
        };
      }),
    );
  }

  async function handleConvert() {
    if (!images.length) {
      setError("Please choose at least one image before converting.");
      analytics.trackError({ errorCode: "missing_file" });
      return;
    }

    setError(null);
    setIsConverting(true);
    clearPdfUrl();
    analytics.trackConversionStarted({
      fileCount: images.length,
      fileSizeBucket: getFileSizeBucket(totalSize),
      mode: `${effectivePageSize}_${effectiveOrientation}_${effectiveMargin}_${effectiveFitMode}`,
      outputFormat: "pdf",
    });

    try {
      const pdfDocument = await PDFDocument.create();

      for (const image of images) {
        let imageBytes = await getEmbeddableImageBytes(image.file);
        let embeddedImage =
          imageBytes.type === "jpg"
            ? await pdfDocument.embedJpg(imageBytes.bytes)
            : await pdfDocument.embedPng(imageBytes.bytes);

        if (
          allowIndividualRotation &&
          imageBytes.type === "jpg" &&
          (embeddedImage.width !== image.width ||
            embeddedImage.height !== image.height)
        ) {
          imageBytes = {
            type: "png",
            bytes: await convertImageToPngBytes(image.file),
          };
          embeddedImage = await pdfDocument.embedPng(imageBytes.bytes);
        }

        const rotatedDimensions = getRotatedImageDimensions({
          height: embeddedImage.height,
          rotation: image.rotation,
          width: embeddedImage.width,
        });
        const placement = calculateImagePlacement({
          fitMode: effectiveFitMode,
          imageWidth: rotatedDimensions.width,
          imageHeight: rotatedDimensions.height,
          margin: effectiveMargin,
          orientation: effectiveOrientation,
          pageSize: effectivePageSize,
        });

        const page = pdfDocument.addPage([
          placement.pageWidth,
          placement.pageHeight,
        ]);
        page.drawImage(
          embeddedImage,
          getRotatedImageDrawOptions({
            placement,
            rotation: image.rotation,
          }),
        );
      }

      const pdfBytes = await pdfDocument.save();
      const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
      new Uint8Array(pdfBuffer).set(pdfBytes);

      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(blob));
      analytics.trackConversionCompleted({
        fileCount: images.length,
        mode: images.some((image) => image.rotation !== 0)
          ? "images_rotated"
          : "no_image_rotation",
        outputFormat: "pdf",
        status: "success",
      });
    } catch {
      setError("The PDF could not be created. Please try another image file.");
      analytics.trackError({ errorCode: "conversion_failed" });
    } finally {
      setIsConverting(false);
    }
  }

  function handleReset() {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setImages([]);
    setPageSize(null);
    setOrientation(null);
    setMargin(null);
    setFitMode(null);
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
              margin={effectiveMargin}
              model={previewModel}
              presentation={presentation}
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
        <div className="mt-5 space-y-3 rounded-xl border border-border bg-muted/25 p-4 text-sm">
          <SummaryRow
            label="Orientation"
            value={labelFor(orientationOptions, effectiveOrientation)}
            presentation={presentation}
          />
          <SummaryRow
            label="Page size"
            value={labelFor(pageSizeOptions, effectivePageSize)}
            presentation={presentation}
          />
          <SummaryRow
            label="Margins"
            value={labelFor(marginOptions, effectiveMargin)}
            presentation={presentation}
          />
          <SummaryRow
            label="Image fit"
            value={labelFor(fitOptions, effectiveFitMode)}
            presentation={presentation}
          />
          <SummaryRow
            label="Images"
            value={String(images.length)}
            presentation={presentation}
          />
          <SummaryRow
            label="Total size"
            value={formatFileSize(totalSize)}
            presentation={presentation}
          />
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
                <a
                  href={pdfUrl}
                  download={downloadFileName}
                  onClick={() => {
                    analytics.trackDownloadStarted({ outputFormat: "pdf" });
                    analytics.trackDownloadCompleted({ outputFormat: "pdf" });
                  }}
                >
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
            allowIndividualRotation={allowIndividualRotation}
            images={images}
            onRemove={handleRemove}
            onMove={handleMove}
            onRotate={handleRotate}
            onAddMore={() => addMoreInputRef.current?.click()}
            presentation={presentation}
          />
        </div>
      ) : null}
    </div>
  );
}

type OptionGroupProps<T extends string> = {
  label: string;
  options: Array<{ description?: string; label: string; value: T }>;
  value: T | null;
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
            aria-pressed={value === option.value}
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
  presentation: "standard" | "showcase";
};

function SummaryRow({ label, value, presentation }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/80 pb-3 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right font-semibold text-foreground",
          presentation === "showcase" &&
            "rounded-full border border-border bg-background px-2.5 py-1 text-xs shadow-sm",
        )}
      >
        {value}
      </span>
    </div>
  );
}

type PdfLivePreviewProps = {
  image: UploadedImage;
  margin: ImagePdfMargin;
  model: PreviewModel;
  presentation: "standard" | "showcase";
};

function PdfLivePreview({
  image,
  margin,
  model,
  presentation,
}: PdfLivePreviewProps) {
  const isShowcase = presentation === "showcase";

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

      <div
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-xl p-3 shadow-inner sm:p-5",
          isShowcase
            ? "min-h-[450px] bg-gradient-to-br from-slate-50 to-slate-200/70 sm:min-h-[650px] xl:min-h-[700px]"
            : "min-h-[420px] bg-gradient-to-br from-slate-100 to-slate-200 sm:min-h-[610px] xl:min-h-[660px]",
        )}
      >
        <div
          aria-label="Live PDF page preview"
          data-preview-orientation={model.isLandscape ? "landscape" : "portrait"}
          data-preview-margin={margin}
          data-preview-margin-px={model.marginPx}
          data-preview-image-left={model.imageLeftPercent.toFixed(3)}
          data-preview-image-top={model.imageTopPercent.toFixed(3)}
          data-preview-image-width={model.imageWidthPercent.toFixed(3)}
          data-preview-image-height={model.imageHeightPercent.toFixed(3)}
          data-preview-image-rotation={model.imageRotation}
          className={cn(
            "relative bg-white ring-1 ring-black/10 transition-[aspect-ratio,width,max-height,transform,box-shadow] ease-out",
            isShowcase
              ? "duration-[180ms] shadow-[0_28px_90px_rgba(15,23,42,0.26)]"
              : "duration-200 shadow-[0_24px_70px_rgba(15,23,42,0.24)]",
          )}
          style={{
            aspectRatio: `${model.pageWidth} / ${model.pageHeight}`,
            width: model.isLandscape
              ? isShowcase
                ? "min(100%, 790px)"
                : "min(100%, 720px)"
              : isShowcase
                ? "min(94%, 520px)"
                : "min(90%, 470px)",
            maxHeight: isShowcase ? "670px" : "620px",
            transform: isShowcase && model.isLandscape ? "scale(1.01)" : "scale(1)",
          }}
        >
          <div
            className={cn(
              "pointer-events-none absolute rounded-sm border border-dashed border-primary/25 transition-[inset,opacity] ease-out",
              isShowcase ? "duration-[180ms]" : "duration-200",
            )}
            style={{
              inset: `${model.marginPercent}%`,
              opacity: model.marginPx === 0 ? 0 : 1,
            }}
          />
          <div
            className={cn(
              "absolute overflow-hidden transition-[left,top,width,height,transform] ease-out",
              isShowcase ? "duration-[180ms]" : "duration-200",
            )}
            style={{
              left: `${model.imageLeftPercent}%`,
              top: `${model.imageTopPercent}%`,
              width: `${model.imageWidthPercent}%`,
              height: `${model.imageHeightPercent}%`,
            }}
          >
            <div
              className={cn(
                "absolute left-1/2 top-1/2 transition-[width,height,transform] ease-out",
                isShowcase ? "duration-[180ms]" : "duration-200",
              )}
              style={getLivePreviewImageFrameStyle(model)}
            >
              <NextImage
                src={image.previewUrl}
                alt=""
                fill
                sizes="520px"
                className="object-fill"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type PreviewModel = {
  fitMode: ImageFitMode;
  imageHeightPercent: number;
  imageLeftPercent: number;
  imageRotation: ImageRotation;
  imageRotationFrameHeightPercent: number;
  imageRotationFrameWidthPercent: number;
  imageTopPercent: number;
  imageWidthPercent: number;
  isLandscape: boolean;
  marginPx: number;
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
  const rotatedDimensions = getRotatedImageDimensions({
    height: image?.height ?? 842,
    rotation: image?.rotation ?? 0,
    width: image?.width ?? 595,
  });
  const imageWidth = rotatedDimensions.width;
  const imageHeight = rotatedDimensions.height;
  const placement = calculateImagePlacement({
    fitMode,
    imageHeight,
    imageWidth,
    margin,
    orientation,
    pageSize,
  });
  const isSideways = (image?.rotation ?? 0) === 90 || (image?.rotation ?? 0) === 270;

  return {
    fitMode,
    imageRotation: image?.rotation ?? 0,
    imageRotationFrameHeightPercent: isSideways
      ? (placement.drawWidth / placement.drawHeight) * 100
      : 100,
    imageRotationFrameWidthPercent: isSideways
      ? (placement.drawHeight / placement.drawWidth) * 100
      : 100,
    imageHeightPercent:
      (placement.drawHeight / placement.pageHeight) * 100,
    imageLeftPercent: (placement.drawX / placement.pageWidth) * 100,
    imageTopPercent:
      ((placement.pageHeight - placement.drawY - placement.drawHeight) /
        placement.pageHeight) *
      100,
    imageWidthPercent: (placement.drawWidth / placement.pageWidth) * 100,
    isLandscape: placement.pageWidth > placement.pageHeight,
    marginPx: placement.marginPx,
    marginPercent:
      (placement.marginPx / Math.min(placement.pageWidth, placement.pageHeight)) *
      100,
    pageHeight: placement.pageHeight,
    pageWidth: placement.pageWidth,
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
      rotation: 0,
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

type ImagePlacement = {
  drawHeight: number;
  drawWidth: number;
  drawX: number;
  drawY: number;
  marginPx: number;
  pageHeight: number;
  pageWidth: number;
};

function getRotatedImageDimensions({
  height,
  rotation,
  width,
}: {
  height: number;
  rotation: ImageRotation;
  width: number;
}) {
  return rotation === 90 || rotation === 270
    ? { height: width, width: height }
    : { height, width };
}

function getRotatedImageDrawOptions({
  placement,
  rotation,
}: {
  placement: ImagePlacement;
  rotation: ImageRotation;
}) {
  const originalDrawWidth =
    rotation === 90 || rotation === 270
      ? placement.drawHeight
      : placement.drawWidth;
  const originalDrawHeight =
    rotation === 90 || rotation === 270
      ? placement.drawWidth
      : placement.drawHeight;

  if (rotation === 90) {
    return {
      height: originalDrawHeight,
      rotate: degrees(270),
      width: originalDrawWidth,
      x: placement.drawX,
      y: placement.drawY + originalDrawWidth,
    };
  }

  if (rotation === 180) {
    return {
      height: originalDrawHeight,
      rotate: degrees(180),
      width: originalDrawWidth,
      x: placement.drawX + originalDrawWidth,
      y: placement.drawY + originalDrawHeight,
    };
  }

  if (rotation === 270) {
    return {
      height: originalDrawHeight,
      rotate: degrees(90),
      width: originalDrawWidth,
      x: placement.drawX + originalDrawHeight,
      y: placement.drawY,
    };
  }

  return {
    height: originalDrawHeight,
    rotate: degrees(0),
    width: originalDrawWidth,
    x: placement.drawX,
    y: placement.drawY,
  };
}

function getLivePreviewImageFrameStyle(model: PreviewModel) {
  return {
    height: `${model.imageRotationFrameHeightPercent}%`,
    transform: `translate(-50%, -50%) rotate(${model.imageRotation}deg)`,
    width: `${model.imageRotationFrameWidthPercent}%`,
  };
}

function calculateImagePlacement({
  fitMode,
  imageWidth,
  imageHeight,
  margin,
  orientation,
  pageSize,
}: {
  fitMode: ImageFitMode;
  imageWidth: number;
  imageHeight: number;
  margin: ImagePdfMargin;
  orientation: ImagePdfOrientation;
  pageSize: ImagePdfPageSize;
}): ImagePlacement {
  const marginPx = marginSizes[margin];
  const naturalPage =
    pageSize === "auto"
      ? {
          width: imageWidth + marginPx * 2,
          height: imageHeight + marginPx * 2,
        }
      : fixedPageSizes[pageSize];
  const pageBox = orientPageBox(naturalPage, orientation, imageWidth >= imageHeight);
  const availableWidth = Math.max(1, pageBox.width - marginPx * 2);
  const availableHeight = Math.max(1, pageBox.height - marginPx * 2);
  const scale =
    fitMode === "fill"
      ? Math.max(availableWidth / imageWidth, availableHeight / imageHeight)
      : Math.min(availableWidth / imageWidth, availableHeight / imageHeight);
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;

  return {
    drawHeight,
    drawWidth,
    drawX: marginPx + (availableWidth - drawWidth) / 2,
    drawY: marginPx + (availableHeight - drawHeight) / 2,
    marginPx,
    pageHeight: pageBox.height,
    pageWidth: pageBox.width,
  };
}

function normalizeImageRotation(rotation: number): ImageRotation {
  return (((rotation % 360) + 360) % 360) as ImageRotation;
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

function getToolNameFromFileName(fileName: string) {
  if (fileName === "jpg-to-pdf.pdf") {
    return "JPG to PDF";
  }

  if (fileName === "png-to-pdf.pdf") {
    return "PNG to PDF";
  }

  return "Images to PDF";
}
