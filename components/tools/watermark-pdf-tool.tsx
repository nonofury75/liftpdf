"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Download, FileCheck2, Loader2, RotateCcw, Stamp } from "lucide-react";
import {
  degrees,
  PDFDocument,
  rgb,
  StandardFonts,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { PdfFileSummary } from "@/components/tools/pdf/pdf-file-summary";
import {
  loadPdfDocument,
  renderPdfPagePreview,
} from "@/components/tools/pdf/pdfjs-client";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";
import { cn } from "@/lib/utils";

type WatermarkMode = "text" | "image";
type FontChoice = "helvetica" | "times" | "courier";
type WatermarkPosition =
  | "center"
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "tile";

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type PagePreview = {
  pageNumber: number;
  previewUrl: string;
};

type ImageWatermark = {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

const watermarkedFileName = "watermarked.pdf";

const positionOptions: Array<{ label: string; value: WatermarkPosition }> = [
  { label: "Center", value: "center" },
  { label: "Top Left", value: "top-left" },
  { label: "Top Center", value: "top-center" },
  { label: "Top Right", value: "top-right" },
  { label: "Middle Left", value: "middle-left" },
  { label: "Middle Right", value: "middle-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Center", value: "bottom-center" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Tile / Repeat", value: "tile" },
];

const fontOptions: Array<{ label: string; value: FontChoice }> = [
  { label: "Helvetica", value: "helvetica" },
  { label: "Times", value: "times" },
  { label: "Courier", value: "courier" },
];

export function WatermarkPdfTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [mode, setMode] = useState<WatermarkMode>("text");
  const [position, setPosition] = useState<WatermarkPosition>("center");
  const [text, setText] = useState("LiftPDF");
  const [font, setFont] = useState<FontChoice>("helvetica");
  const [textSize, setTextSize] = useState(42);
  const [textColor, setTextColor] = useState("#111827");
  const [textOpacity, setTextOpacity] = useState(0.25);
  const [textRotation, setTextRotation] = useState(-35);
  const [imageWatermark, setImageWatermark] = useState<ImageWatermark | null>(
    null,
  );
  const [imageSize, setImageSize] = useState(35);
  const [imageOpacity, setImageOpacity] = useState(0.35);
  const [imageRotation, setImageRotation] = useState(-25);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(
    null,
  );
  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const pagesRef = useRef<PagePreview[]>([]);
  const imageWatermarkRef = useRef<ImageWatermark | null>(null);

  const activeOpacity = mode === "text" ? textOpacity : imageOpacity;
  const activeRotation = mode === "text" ? textRotation : imageRotation;

  const previewWatermark = useMemo(
    () => ({
      mode,
      position,
      text,
      font,
      textSize,
      textColor,
      textOpacity,
      textRotation,
      imageWatermark,
      imageSize,
      imageOpacity,
      imageRotation,
    }),
    [
      font,
      imageOpacity,
      imageRotation,
      imageSize,
      imageWatermark,
      mode,
      position,
      text,
      textColor,
      textOpacity,
      textRotation,
      textSize,
    ],
  );

  useEffect(() => {
    generatedFileRef.current = generatedFile;
  }, [generatedFile]);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  useEffect(() => {
    imageWatermarkRef.current = imageWatermark;
  }, [imageWatermark]);

  useEffect(() => {
    return () => {
      if (generatedFileRef.current) {
        URL.revokeObjectURL(generatedFileRef.current.url);
      }

      pagesRef.current.forEach((page) => URL.revokeObjectURL(page.previewUrl));

      if (imageWatermarkRef.current) {
        URL.revokeObjectURL(imageWatermarkRef.current.previewUrl);
      }
    };
  }, []);

  async function handlePdfSelected(files: File[]) {
    const [file] = files;

    if (!file) {
      return;
    }

    if (files.length > 1) {
      setError("Please choose only one PDF file.");
      return;
    }

    if (!isPdfFile(file)) {
      setError("Only PDF files are supported.");
      return;
    }

    clearGeneratedFile();
    clearPagePreviews();
    setSelectedPdf(null);
    setError(null);
    setIsLoadingPreview(true);

    try {
      const pdf = await loadPdfDocument(file);
      const previews: PagePreview[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        previews.push({
          pageNumber,
          previewUrl: await renderPdfPagePreview(pdf, pageNumber),
        });
      }

      setSelectedPdf({
        file,
        pageCount: pdf.numPages,
      });
      setPages(previews);
      await pdf.destroy();
    } catch {
      clearPagePreviews();
      setSelectedPdf(null);
      setError("This PDF could not be read. Please choose another file.");
    } finally {
      setIsLoadingPreview(false);
    }
  }

  async function handleImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!isImageFile(file)) {
      setError("Only PNG, JPG, JPEG and WEBP images are supported.");
      return;
    }

    clearGeneratedFile();
    setError(null);

    const previewUrl = URL.createObjectURL(file);

    try {
      const dimensions = await readImageDimensions(previewUrl);

      setImageWatermark((currentImage) => {
        if (currentImage) {
          URL.revokeObjectURL(currentImage.previewUrl);
        }

        return {
          file,
          previewUrl,
          width: dimensions.width,
          height: dimensions.height,
        };
      });
    } catch {
      URL.revokeObjectURL(previewUrl);
      setError("This image could not be read. Please choose another file.");
    }
  }

  async function handleAddWatermark() {
    if (!selectedPdf) {
      setError("Please choose one PDF file before adding a watermark.");
      return;
    }

    if (mode === "text" && !text.trim()) {
      setError("Enter watermark text before generating the PDF.");
      return;
    }

    if (mode === "image" && !imageWatermark) {
      setError("Choose an image watermark before generating the PDF.");
      return;
    }

    setError(null);
    setIsGenerating(true);
    clearGeneratedFile();

    try {
      const pdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const pdfPages = pdf.getPages();

      if (mode === "text") {
        const embeddedFont = await embedSelectedFont(pdf, font);
        const color = hexToRgb(textColor);

        pdfPages.forEach((page) => {
          drawTextWatermark({
            page,
            text: text.trim(),
            font: embeddedFont,
            color,
            size: textSize,
            opacity: textOpacity,
            rotation: textRotation,
            position,
          });
        });
      } else if (imageWatermark) {
        const imageBytes = await getEmbeddableImageBytes(imageWatermark.file);
        const embeddedImage =
          imageBytes.type === "jpg"
            ? await pdf.embedJpg(imageBytes.bytes)
            : await pdf.embedPng(imageBytes.bytes);

        pdfPages.forEach((page) => {
          drawImageWatermark({
            page,
            image: embeddedImage,
            imageWidth: imageWatermark.width,
            imageHeight: imageWatermark.height,
            sizePercent: imageSize,
            opacity: imageOpacity,
            rotation: imageRotation,
            position,
          });
        });
      }

      const bytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      const buffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buffer).set(bytes);
      const blob = new Blob([buffer], { type: "application/pdf" });

      setGeneratedFile({
        url: URL.createObjectURL(blob),
        fileName: watermarkedFileName,
      });
    } catch {
      setError(
        "The watermark could not be added. Please try another PDF file.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function clearGeneratedFile() {
    setGeneratedFile((currentFile) => {
      if (currentFile) {
        URL.revokeObjectURL(currentFile.url);
      }

      return null;
    });
  }

  function clearPagePreviews() {
    setPages((currentPages) => {
      currentPages.forEach((page) => URL.revokeObjectURL(page.previewUrl));
      return [];
    });
  }

  function updateWatermark(nextUpdate: () => void) {
    clearGeneratedFile();
    nextUpdate();
  }

  function handleReset() {
    setSelectedPdf(null);
    setPages((currentPages) => {
      currentPages.forEach((page) => URL.revokeObjectURL(page.previewUrl));
      return [];
    });
    setMode("text");
    setPosition("center");
    setText("LiftPDF");
    setFont("helvetica");
    setTextSize(42);
    setTextColor("#111827");
    setTextOpacity(0.25);
    setTextRotation(-35);
    setImageSize(35);
    setImageOpacity(0.35);
    setImageRotation(-25);
    setImageWatermark((currentImage) => {
      if (currentImage) {
        URL.revokeObjectURL(currentImage.previewUrl);
      }

      return null;
    });
    setError(null);
    clearGeneratedFile();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, customize a text or image watermark and preview every page."
          buttonLabel="Choose PDF file"
          onFilesSelected={handlePdfSelected}
        />

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {selectedPdf ? (
          <PdfFileSummary
            fileName={selectedPdf.file.name}
            fileSize={selectedPdf.file.size}
            pageCount={selectedPdf.pageCount}
          />
        ) : null}

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Stamp className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">
              Watermark options
            </h2>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <OptionButton
              isActive={mode === "text"}
              label="Text watermark"
              onClick={() =>
                updateWatermark(() => {
                  setMode("text");
                })
              }
            />
            <OptionButton
              isActive={mode === "image"}
              label="Image watermark"
              onClick={() =>
                updateWatermark(() => {
                  setMode("image");
                })
              }
            />
          </div>

          <div className="mt-6 space-y-6">
            {mode === "text" ? (
              <>
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">
                    Watermark text
                  </span>
                  <input
                    value={text}
                    onChange={(event) =>
                      updateWatermark(() => setText(event.target.value))
                    }
                    className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                </label>

                <FieldGroup label="Font">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {fontOptions.map((fontOption) => (
                      <OptionButton
                        key={fontOption.value}
                        isActive={font === fontOption.value}
                        label={fontOption.label}
                        onClick={() =>
                          updateWatermark(() => setFont(fontOption.value))
                        }
                      />
                    ))}
                  </div>
                </FieldGroup>

                <div className="grid gap-5 sm:grid-cols-2">
                  <RangeInput
                    label={`Size: ${textSize}px`}
                    min={12}
                    max={96}
                    step={1}
                    value={textSize}
                    onChange={(value) =>
                      updateWatermark(() => setTextSize(value))
                    }
                  />
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">
                      Color
                    </span>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(event) =>
                        updateWatermark(() => setTextColor(event.target.value))
                      }
                      className="mt-2 h-11 w-full rounded-md border border-input bg-background p-1"
                    />
                  </label>
                  <RangeInput
                    label={`Opacity: ${textOpacity.toFixed(1)}`}
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={textOpacity}
                    onChange={(value) =>
                      updateWatermark(() => setTextOpacity(value))
                    }
                  />
                  <RangeInput
                    label={`Rotation: ${textRotation} deg`}
                    min={-90}
                    max={90}
                    step={1}
                    value={textRotation}
                    onChange={(value) =>
                      updateWatermark(() => setTextRotation(value))
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">
                    Watermark image
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
                    onChange={handleImageSelected}
                  />
                </label>

                {imageWatermark ? (
                  <div className="flex items-center gap-4 rounded-lg border border-border bg-background p-3">
                    <div className="relative size-20 overflow-hidden rounded-md border border-border bg-muted">
                      <Image
                        src={imageWatermark.previewUrl}
                        alt="Watermark preview"
                        fill
                        sizes="80px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {imageWatermark.file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {imageWatermark.width} x {imageWatermark.height}px
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-5 sm:grid-cols-2">
                  <RangeInput
                    label={`Size: ${imageSize}%`}
                    min={10}
                    max={100}
                    step={1}
                    value={imageSize}
                    onChange={(value) =>
                      updateWatermark(() => setImageSize(value))
                    }
                  />
                  <RangeInput
                    label={`Opacity: ${imageOpacity.toFixed(1)}`}
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={imageOpacity}
                    onChange={(value) =>
                      updateWatermark(() => setImageOpacity(value))
                    }
                  />
                  <RangeInput
                    label={`Rotation: ${imageRotation} deg`}
                    min={-90}
                    max={90}
                    step={1}
                    value={imageRotation}
                    onChange={(value) =>
                      updateWatermark(() => setImageRotation(value))
                    }
                  />
                </div>
              </>
            )}

            <FieldGroup label="Position">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {positionOptions.map((positionOption) => (
                  <OptionButton
                    key={positionOption.value}
                    isActive={position === positionOption.value}
                    label={positionOption.label}
                    onClick={() =>
                      updateWatermark(() => setPosition(positionOption.value))
                    }
                  />
                ))}
              </div>
            </FieldGroup>
          </div>
        </div>

        {isLoadingPreview ? (
          <p className="rounded-md bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
            Loading PDF preview...
          </p>
        ) : null}

        {pages.length ? (
          <div className="rounded-lg border border-border bg-card p-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Live preview
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Watermark changes appear immediately on every page preview.
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <article
                  key={page.pageNumber}
                  className="rounded-lg border border-border bg-background p-3 transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div className="relative flex min-h-52 items-center justify-center overflow-hidden rounded-md bg-muted p-3">
                    <Image
                      src={page.previewUrl}
                      alt={`Page ${page.pageNumber}`}
                      width={170}
                      height={230}
                      className="h-auto max-h-56 w-auto rounded-sm bg-white shadow-sm"
                      unoptimized
                    />
                    <WatermarkPreviewOverlay watermark={previewWatermark} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Page {page.pageNumber}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Watermark summary
        </h2>
        <div className="mt-5 space-y-3 text-sm">
          <PdfSummaryRow
            label="PDF file"
            value={selectedPdf ? selectedPdf.file.name : "None"}
          />
          <PdfSummaryRow
            label="Pages"
            value={selectedPdf ? String(selectedPdf.pageCount) : "0"}
          />
          <PdfSummaryRow
            label="Type"
            value={mode === "text" ? "Text watermark" : "Image watermark"}
          />
          <PdfSummaryRow label="Position" value={labelForPosition(position)} />
          <PdfSummaryRow label="Opacity" value={activeOpacity.toFixed(1)} />
          <PdfSummaryRow label="Rotation" value={`${activeRotation} deg`} />
          <PdfSummaryRow label="Output" value={watermarkedFileName} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            onClick={handleAddWatermark}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Add watermark
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a href={generatedFile.url} download={generatedFile.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download watermarked PDF
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Add a watermark before downloading.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download watermarked PDF
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Start over
          </Button>
        </div>

        {generatedFile ? (
          <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            Your watermarked PDF is ready to download.
          </p>
        ) : null}
      </aside>
    </div>
  );
}

type FieldGroupProps = {
  label: string;
  children: React.ReactNode;
};

function FieldGroup({ label, children }: FieldGroupProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-foreground">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

type OptionButtonProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

function OptionButton({ isActive, label, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-md border border-border px-3 py-2 text-left text-sm font-medium transition-colors",
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "bg-background text-foreground hover:bg-muted",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

type RangeInputProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

function RangeInput({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: RangeInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-primary"
      />
    </label>
  );
}

type WatermarkPreviewOverlayProps = {
  watermark: {
    mode: WatermarkMode;
    position: WatermarkPosition;
    text: string;
    font: FontChoice;
    textSize: number;
    textColor: string;
    textOpacity: number;
    textRotation: number;
    imageWatermark: ImageWatermark | null;
    imageSize: number;
    imageOpacity: number;
    imageRotation: number;
  };
};

function WatermarkPreviewOverlay({ watermark }: WatermarkPreviewOverlayProps) {
  if (watermark.mode === "image" && !watermark.imageWatermark) {
    return null;
  }

  if (watermark.position === "tile") {
    return (
      <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-3 place-items-center overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <WatermarkPreviewMark key={index} watermark={watermark} isTile />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute",
        previewPositionClassName(watermark.position),
      )}
    >
      <WatermarkPreviewMark watermark={watermark} />
    </div>
  );
}

function WatermarkPreviewMark({
  watermark,
  isTile = false,
}: WatermarkPreviewOverlayProps & { isTile?: boolean }) {
  if (watermark.mode === "text") {
    return (
      <span
        className="block whitespace-nowrap rounded-sm bg-white/50 px-1 font-semibold shadow-sm"
        style={{
          color: watermark.textColor,
          fontFamily: previewFontFamily(watermark.font),
          fontSize: `${Math.max(12, watermark.textSize * 0.42)}px`,
          opacity: watermark.textOpacity,
          transform: `rotate(${watermark.textRotation}deg)`,
        }}
      >
        {watermark.text || "Watermark"}
      </span>
    );
  }

  if (!watermark.imageWatermark) {
    return null;
  }

  const previewSize = isTile
    ? Math.max(36, watermark.imageSize * 0.55)
    : Math.max(44, watermark.imageSize * 1.05);

  return (
    <Image
      src={watermark.imageWatermark.previewUrl}
      alt=""
      width={previewSize}
      height={previewSize}
      className="h-auto w-auto object-contain"
      style={{
        maxWidth: `${previewSize}px`,
        maxHeight: `${previewSize}px`,
        opacity: watermark.imageOpacity,
        transform: `rotate(${watermark.imageRotation}deg)`,
      }}
      unoptimized
    />
  );
}

async function embedSelectedFont(pdf: PDFDocument, font: FontChoice) {
  const fontMap: Record<FontChoice, StandardFonts> = {
    helvetica: StandardFonts.Helvetica,
    times: StandardFonts.TimesRoman,
    courier: StandardFonts.Courier,
  };

  return pdf.embedFont(fontMap[font]);
}

function drawTextWatermark({
  page,
  text,
  font,
  color,
  size,
  opacity,
  rotation,
  position,
}: {
  page: PDFPage;
  text: string;
  font: PDFFont;
  color: RGB;
  size: number;
  opacity: number;
  rotation: number;
  position: WatermarkPosition;
}) {
  const { width, height } = page.getSize();
  const textWidth = font.widthOfTextAtSize(text, size);
  const textHeight = size;

  if (position === "tile") {
    const xStep = Math.max(180, textWidth + 90);
    const yStep = Math.max(120, textHeight + 80);

    for (let x = 36; x < width; x += xStep) {
      for (let y = 48; y < height; y += yStep) {
        page.drawText(text, {
          x,
          y,
          size,
          font,
          color,
          opacity,
          rotate: degrees(rotation),
        });
      }
    }

    return;
  }

  const coordinates = getCoordinates({
    position,
    pageWidth: width,
    pageHeight: height,
    markWidth: textWidth,
    markHeight: textHeight,
  });

  page.drawText(text, {
    x: coordinates.x,
    y: coordinates.y,
    size,
    font,
    color,
    opacity,
    rotate: degrees(rotation),
  });
}

function drawImageWatermark({
  page,
  image,
  imageWidth,
  imageHeight,
  sizePercent,
  opacity,
  rotation,
  position,
}: {
  page: PDFPage;
  image: { width: number; height: number };
  imageWidth: number;
  imageHeight: number;
  sizePercent: number;
  opacity: number;
  rotation: number;
  position: WatermarkPosition;
}) {
  const { width, height } = page.getSize();
  const drawWidth = width * (sizePercent / 100);
  const drawHeight = drawWidth * (imageHeight / imageWidth);
  const drawableImage = image as Parameters<PDFPage["drawImage"]>[0];

  if (position === "tile") {
    const tileWidth = drawWidth * 0.55;
    const tileHeight = drawHeight * 0.55;
    const xStep = Math.max(140, tileWidth + 80);
    const yStep = Math.max(120, tileHeight + 70);

    for (let x = 36; x < width; x += xStep) {
      for (let y = 48; y < height; y += yStep) {
        page.drawImage(drawableImage, {
          x,
          y,
          width: tileWidth,
          height: tileHeight,
          opacity,
          rotate: degrees(rotation),
        });
      }
    }

    return;
  }

  const coordinates = getCoordinates({
    position,
    pageWidth: width,
    pageHeight: height,
    markWidth: drawWidth,
    markHeight: drawHeight,
  });

  page.drawImage(drawableImage, {
    x: coordinates.x,
    y: coordinates.y,
    width: drawWidth,
    height: drawHeight,
    opacity,
    rotate: degrees(rotation),
  });
}

function getCoordinates({
  position,
  pageWidth,
  pageHeight,
  markWidth,
  markHeight,
}: {
  position: Exclude<WatermarkPosition, "tile">;
  pageWidth: number;
  pageHeight: number;
  markWidth: number;
  markHeight: number;
}) {
  const margin = 36;
  const xByPosition: Record<Exclude<WatermarkPosition, "tile">, number> = {
    center: (pageWidth - markWidth) / 2,
    "top-left": margin,
    "top-center": (pageWidth - markWidth) / 2,
    "top-right": pageWidth - margin - markWidth,
    "middle-left": margin,
    "middle-right": pageWidth - margin - markWidth,
    "bottom-left": margin,
    "bottom-center": (pageWidth - markWidth) / 2,
    "bottom-right": pageWidth - margin - markWidth,
  };
  const yByPosition: Record<Exclude<WatermarkPosition, "tile">, number> = {
    center: (pageHeight - markHeight) / 2,
    "top-left": pageHeight - margin - markHeight,
    "top-center": pageHeight - margin - markHeight,
    "top-right": pageHeight - margin - markHeight,
    "middle-left": (pageHeight - markHeight) / 2,
    "middle-right": (pageHeight - markHeight) / 2,
    "bottom-left": margin,
    "bottom-center": margin,
    "bottom-right": margin,
  };

  return {
    x: xByPosition[position],
    y: yByPosition[position],
  };
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
      throw new Error("Canvas is not available.");
    }

    context.drawImage(image, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Image conversion failed."));
        }
      }, "image/png");
    });

    return blob.arrayBuffer();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function readImageDimensions(src: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () =>
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    image.onerror = () => reject(new Error("Image could not load."));
    image.src = src;
  });
}

function loadHtmlImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not load."));
    image.src = src;
  });
}

function hexToRgb(hex: string): RGB {
  const normalizedHex = hex.replace("#", "");
  const red = Number.parseInt(normalizedHex.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16) / 255;

  return rgb(red, green, blue);
}

function previewPositionClassName(position: WatermarkPosition) {
  const classNames: Record<Exclude<WatermarkPosition, "tile">, string> = {
    center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    "top-left": "left-6 top-6",
    "top-center": "left-1/2 top-6 -translate-x-1/2",
    "top-right": "right-6 top-6",
    "middle-left": "left-6 top-1/2 -translate-y-1/2",
    "middle-right": "right-6 top-1/2 -translate-y-1/2",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-6 right-6",
  };

  return position === "tile" ? "" : classNames[position];
}

function previewFontFamily(font: FontChoice) {
  const fontFamilies: Record<FontChoice, string> = {
    helvetica: "Arial, Helvetica, sans-serif",
    times: "Times New Roman, Times, serif",
    courier: "Courier New, Courier, monospace",
  };

  return fontFamilies[font];
}

function labelForPosition(position: WatermarkPosition) {
  return (
    positionOptions.find((option) => option.value === position)?.label ??
    "Center"
  );
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

function isImageFile(file: File) {
  return ["image/png", "image/jpeg", "image/webp"].includes(file.type);
}
