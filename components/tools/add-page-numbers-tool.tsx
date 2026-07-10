"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  FileCheck2,
  Hash,
  Info,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { PDFDocument, rgb, StandardFonts, type RGB } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { PdfFileSummary } from "@/components/tools/pdf/pdf-file-summary";
import {
  loadPdfDocument,
  renderPdfPagePreview,
} from "@/components/tools/pdf/pdfjs-client";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";
import {
  summarizeFilesForAnalytics,
  useToolAnalytics,
} from "@/hooks/use-tool-analytics";
import { cn } from "@/lib/utils";

type NumberPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type FontChoice = "helvetica" | "times" | "courier";
type SizeChoice = "small" | "medium" | "large";
type NumberFormat =
  | "number"
  | "page-number"
  | "number-total"
  | "page-number-total";

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type PagePreview = {
  pageNumber: number;
  previewUrl: string;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

type PageNumberOptions = {
  position: NumberPosition;
  font: FontChoice;
  size: SizeChoice;
  color: string;
  startNumber: number;
  format: NumberFormat;
};

const numberedFileName = "numbered.pdf";

const positionOptions: Array<{ label: string; value: NumberPosition }> = [
  { label: "Top Left", value: "top-left" },
  { label: "Top Center", value: "top-center" },
  { label: "Top Right", value: "top-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Center", value: "bottom-center" },
  { label: "Bottom Right", value: "bottom-right" },
];

const fontOptions: Array<{ label: string; value: FontChoice }> = [
  { label: "Helvetica", value: "helvetica" },
  { label: "Times", value: "times" },
  { label: "Courier", value: "courier" },
];

const sizeOptions: Array<{ label: string; value: SizeChoice; points: number }> =
  [
    { label: "Small", value: "small", points: 10 },
    { label: "Medium", value: "medium", points: 14 },
    { label: "Large", value: "large", points: 20 },
  ];

const formatOptions: Array<{ label: string; value: NumberFormat }> = [
  { label: "1", value: "number" },
  { label: "Page 1", value: "page-number" },
  { label: "1 / 10", value: "number-total" },
  { label: "Page 1 of 10", value: "page-number-total" },
];

const colorOptions = [
  { label: "Black", value: "#111827" },
  { label: "Gray", value: "#4b5563" },
  { label: "Red", value: "#dc2626" },
  { label: "Blue", value: "#2563eb" },
] as const;

export function AddPageNumbersTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [options, setOptions] = useState<PageNumberOptions>({
    position: "bottom-center",
    font: "helvetica",
    size: "medium",
    color: "#111827",
    startNumber: 1,
    format: "number",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(
    null,
  );
  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const pagesRef = useRef<PagePreview[]>([]);
  const analytics = useToolAnalytics({
    tool: "Add Page Numbers",
    route: "/add-page-numbers",
  });

  const previewTotalNumber = useMemo(
    () =>
      selectedPdf
        ? options.startNumber + selectedPdf.pageCount - 1
        : options.startNumber,
    [options.startNumber, selectedPdf],
  );

  useEffect(() => {
    generatedFileRef.current = generatedFile;
  }, [generatedFile]);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  useEffect(() => {
    return () => {
      if (generatedFileRef.current) {
        URL.revokeObjectURL(generatedFileRef.current.url);
      }

      pagesRef.current.forEach((page) => URL.revokeObjectURL(page.previewUrl));
    };
  }, []);

  async function handleFilesSelected(files: File[]) {
    analytics.trackUploadStarted(summarizeFilesForAnalytics(files));
    const [file] = files;

    if (!file) {
      return;
    }

    if (files.length > 1) {
      setError("Please choose only one PDF file.");
      analytics.trackError({ errorCode: "too_many_files" });
      return;
    }

    if (!isPdfFile(file)) {
      setError("Only PDF files are supported.");
      analytics.trackError({ errorCode: "invalid_file_type" });
      return;
    }

    clearGeneratedFile();
    clearPagePreviews();
    setSelectedPdf(null);
    setProgress(null);
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
      analytics.trackUploadCompleted({
        ...summarizeFilesForAnalytics([file]),
        pageCount: pdf.numPages,
        outputFormat: "pdf",
      });
      await pdf.destroy();
    } catch {
      clearPagePreviews();
      setSelectedPdf(null);
      setError(
        "This PDF could not be read. If it is password protected, unlock it first and try again.",
      );
      analytics.trackError({ errorCode: "pdf_read_failed" });
    } finally {
      setIsLoadingPreview(false);
    }
  }

  async function handleAddPageNumbers() {
    if (!selectedPdf) {
      setError("Please choose one PDF file before adding page numbers.");
      analytics.trackError({ errorCode: "missing_file" });
      return;
    }

    if (!Number.isInteger(options.startNumber) || options.startNumber < 1) {
      setError("Start number must be 1 or higher.");
      analytics.trackError({ errorCode: "invalid_start_number" });
      return;
    }

    setError(null);
    setIsGenerating(true);
    setProgress("Preparing PDF...");
    clearGeneratedFile();
    analytics.trackConversionStarted({
      mode: options.format,
      pageCount: selectedPdf.pageCount,
      outputFormat: "pdf",
    });

    try {
      const pdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const font = await embedSelectedFont(pdf, options.font);
      const color = hexToRgb(options.color);
      const totalNumber = options.startNumber + pdf.getPageCount() - 1;
      const fontSize = sizeToPoints(options.size);

      setProgress("Adding page numbers...");
      pdf.getPages().forEach((page, index) => {
        const pageNumber = options.startNumber + index;
        const text = formatPageNumberText(
          pageNumber,
          totalNumber,
          options.format,
        );
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const { width, height } = page.getSize();
        const coordinates = getTextCoordinates({
          position: options.position,
          pageWidth: width,
          pageHeight: height,
          textWidth,
          fontSize,
        });

        page.drawText(text, {
          x: coordinates.x,
          y: coordinates.y,
          size: fontSize,
          font,
          color,
        });
      });

      setProgress("Generating numbered PDF...");
      const numberedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      const buffer = new ArrayBuffer(numberedBytes.byteLength);
      new Uint8Array(buffer).set(numberedBytes);
      const blob = new Blob([buffer], { type: "application/pdf" });

      setGeneratedFile({
        url: URL.createObjectURL(blob),
        fileName: numberedFileName,
      });
      setProgress("Numbered PDF created successfully.");
      analytics.trackConversionCompleted({
        mode: options.format,
        pageCount: selectedPdf.pageCount,
        outputFormat: "pdf",
        status: "success",
      });
    } catch {
      setError(
        "Page numbers could not be added. If the PDF is password protected, unlock it first and try again.",
      );
      analytics.trackError({ errorCode: "numbering_failed" });
      setProgress(null);
    } finally {
      setIsGenerating(false);
    }
  }

  function updateOptions(nextOptions: Partial<PageNumberOptions>) {
    clearGeneratedFile();
    setProgress(null);
    setOptions((currentOptions) => ({
      ...currentOptions,
      ...nextOptions,
    }));
  }

  function handleReset() {
    setSelectedPdf(null);
    setOptions({
      position: "bottom-center",
      font: "helvetica",
      size: "medium",
      color: "#111827",
      startNumber: 1,
      format: "number",
    });
    setError(null);
    setProgress(null);
    clearGeneratedFile();
    clearPagePreviews();
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

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, customize page numbers and preview the result before download."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        <div aria-live="polite" className="space-y-3">
          {error ? (
            <StatusNotice
              tone="error"
              icon={<Info className="size-4" />}
              message={error}
            />
          ) : null}

          {isLoadingPreview ? (
            <StatusNotice
              tone="neutral"
              icon={<Loader2 className="size-4 animate-spin" />}
              message="Rendering PDF pages..."
            />
          ) : null}
        </div>

        {selectedPdf ? (
          <PdfFileSummary
            fileName={selectedPdf.file.name}
            fileSize={selectedPdf.file.size}
            pageCount={selectedPdf.pageCount}
          />
        ) : null}

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Hash className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">
              Page number options
            </h2>
          </div>

          <div className="mt-5 space-y-6">
            <FieldGroup label="Position">
              <div className="grid gap-2 sm:grid-cols-3">
                {positionOptions.map((position) => (
                  <OptionButton
                    key={position.value}
                    isActive={options.position === position.value}
                    label={position.label}
                    onClick={() => updateOptions({ position: position.value })}
                  />
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="Font">
              <div className="grid gap-2 sm:grid-cols-3">
                {fontOptions.map((font) => (
                  <OptionButton
                    key={font.value}
                    isActive={options.font === font.value}
                    label={font.label}
                    onClick={() => updateOptions({ font: font.value })}
                  />
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="Size">
              <div className="grid gap-2 sm:grid-cols-3">
                {sizeOptions.map((size) => (
                  <OptionButton
                    key={size.value}
                    isActive={options.size === size.value}
                    label={size.label}
                    onClick={() => updateOptions({ size: size.value })}
                  />
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="Color">
              <div className="grid gap-2 sm:grid-cols-4">
                {colorOptions.map((color) => (
                  <ColorButton
                    key={color.value}
                    isActive={options.color === color.value}
                    label={color.label}
                    value={color.value}
                    onClick={() => updateOptions({ color: color.value })}
                  />
                ))}
              </div>
            </FieldGroup>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Start number
                </span>
                <input
                  type="number"
                  min={1}
                  value={options.startNumber}
                  onChange={(event) =>
                    updateOptions({
                      startNumber: Math.max(1, Number(event.target.value)),
                    })
                  }
                  className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </label>

              <FieldGroup label="Format">
                <div className="grid gap-2">
                  {formatOptions.map((format) => (
                    <OptionButton
                      key={format.value}
                      isActive={options.format === format.value}
                      label={format.label}
                      onClick={() => updateOptions({ format: format.value })}
                    />
                  ))}
                </div>
              </FieldGroup>
            </div>
          </div>
        </div>

        {pages.length ? (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Live preview
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Page numbers update instantly in the selected position.
              </p>
            </div>

            <div className="mt-5 grid max-h-[760px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => {
                const pageNumber = options.startNumber + page.pageNumber - 1;
                const text = formatPageNumberText(
                  pageNumber,
                  previewTotalNumber,
                  options.format,
                );

                return (
                  <article
                    key={page.pageNumber}
                    className="rounded-2xl border border-border bg-background p-3 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                  >
                    <div className="relative flex min-h-60 items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-4 shadow-inner">
                      <Image
                        src={page.previewUrl}
                        alt={`Page ${page.pageNumber}`}
                        width={190}
                        height={260}
                        className="h-auto max-h-64 w-auto rounded-sm bg-white shadow-lg ring-1 ring-black/10"
                        unoptimized
                      />
                      <span
                        className={cn(
                          "absolute rounded-sm bg-white/85 px-1.5 py-0.5 font-semibold shadow-sm",
                          previewPositionClassName(options.position),
                        )}
                        style={{
                          color: options.color,
                          fontFamily: previewFontFamily(options.font),
                          fontSize: `${previewFontSize(options.size)}px`,
                        }}
                      >
                        {text}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      Page {page.pageNumber}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-md xl:sticky xl:top-24">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Hash className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Add Page Numbers
            </h2>
            <p className="text-sm text-muted-foreground">
              Preview before download
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Private by design
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Page numbers are added locally in this browser. Your PDF is never
            uploaded to a server.
          </p>
        </div>

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
            label="Position"
            value={labelForPosition(options.position)}
          />
          <PdfSummaryRow
            label="Format"
            value={formatLabelFor(options.format)}
          />
          <PdfSummaryRow label="Font" value={labelForFont(options.font)} />
          <PdfSummaryRow
            label="Size"
            value={labelForSize(options.size)}
          />
          <PdfSummaryRow
            label="Start number"
            value={String(options.startNumber)}
          />
          <PdfSummaryRow label="Output" value={numberedFileName} />
        </div>

        {progress ? (
          <p
            aria-live="polite"
            className="mt-5 rounded-xl bg-muted px-3 py-2 text-sm font-medium text-muted-foreground"
          >
            {progress}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            onClick={handleAddPageNumbers}
            disabled={!selectedPdf || isGenerating}
            className="h-12 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-md"
          >
            {isGenerating ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {isGenerating ? "Adding page numbers..." : "Add page numbers"}
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a
                href={generatedFile.url}
                download={generatedFile.fileName}
                aria-label="Download numbered PDF"
                onClick={() => {
                  analytics.trackDownloadStarted({ outputFormat: "pdf" });
                  analytics.trackDownloadCompleted({ outputFormat: "pdf" });
                }}
              >
                <Download className="size-4" aria-hidden="true" />
                Download PDF
              </a>
            </Button>
          ) : null}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            {generatedFile ? "Number another PDF" : "Start over"}
          </Button>
        </div>

        {generatedFile ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-800">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Numbered PDF created successfully
            </span>
          </div>
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
      aria-pressed={isActive}
      className={cn(
        "rounded-xl border border-border px-3 py-2.5 text-left text-sm font-semibold transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm",
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

type ColorButtonProps = {
  isActive: boolean;
  label: string;
  value: string;
  onClick: () => void;
};

function ColorButton({ isActive, label, value, onClick }: ColorButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={`Use ${label} page numbers`}
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm",
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-foreground hover:bg-muted",
      )}
      onClick={onClick}
    >
      <span
        className="size-4 rounded-full border border-black/10"
        style={{ backgroundColor: value }}
        aria-hidden="true"
      />
      {label}
    </button>
  );
}

type StatusNoticeProps = {
  tone: "neutral" | "error";
  icon: React.ReactNode;
  message: string;
};

function StatusNotice({ tone, icon, message }: StatusNoticeProps) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-border bg-muted text-muted-foreground";

  return (
    <p
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${toneClass}`}
    >
      {icon}
      {message}
    </p>
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

function sizeToPoints(size: SizeChoice) {
  return sizeOptions.find((option) => option.value === size)?.points ?? 14;
}

function getTextCoordinates({
  position,
  pageWidth,
  pageHeight,
  textWidth,
  fontSize,
}: {
  position: NumberPosition;
  pageWidth: number;
  pageHeight: number;
  textWidth: number;
  fontSize: number;
}) {
  const margin = 36;
  const isTop = position.startsWith("top");
  const isCenter = position.endsWith("center");
  const isRight = position.endsWith("right");

  let x = margin;

  if (isCenter) {
    x = (pageWidth - textWidth) / 2;
  } else if (isRight) {
    x = pageWidth - margin - textWidth;
  }

  return {
    x,
    y: isTop ? pageHeight - margin - fontSize : margin,
  };
}

function formatPageNumberText(
  pageNumber: number,
  totalNumber: number,
  format: NumberFormat,
) {
  if (format === "page-number") {
    return `Page ${pageNumber}`;
  }

  if (format === "number-total") {
    return `${pageNumber} / ${totalNumber}`;
  }

  if (format === "page-number-total") {
    return `Page ${pageNumber} of ${totalNumber}`;
  }

  return String(pageNumber);
}

function formatLabelFor(format: NumberFormat) {
  return formatOptions.find((option) => option.value === format)?.label ?? "1";
}

function hexToRgb(hex: string): RGB {
  const normalizedHex = hex.replace("#", "");
  const red = Number.parseInt(normalizedHex.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16) / 255;

  return rgb(red, green, blue);
}

function previewFontSize(size: SizeChoice) {
  const previewSizes: Record<SizeChoice, number> = {
    small: 11,
    medium: 14,
    large: 18,
  };

  return previewSizes[size];
}

function previewPositionClassName(position: NumberPosition) {
  const classNames: Record<NumberPosition, string> = {
    "top-left": "left-6 top-6",
    "top-center": "left-1/2 top-6 -translate-x-1/2",
    "top-right": "right-6 top-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-6 right-6",
  };

  return classNames[position];
}

function previewFontFamily(font: FontChoice) {
  const fontFamilies: Record<FontChoice, string> = {
    helvetica: "Arial, Helvetica, sans-serif",
    times: "Times New Roman, Times, serif",
    courier: "Courier New, Courier, monospace",
  };

  return fontFamilies[font];
}

function labelForFont(font: FontChoice) {
  return fontOptions.find((option) => option.value === font)?.label ?? "Helvetica";
}

function labelForSize(size: SizeChoice) {
  return sizeOptions.find((option) => option.value === size)?.label ?? "Medium";
}

function labelForPosition(position: NumberPosition) {
  return (
    positionOptions.find((option) => option.value === position)?.label ??
    "Bottom Center"
  );
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}
