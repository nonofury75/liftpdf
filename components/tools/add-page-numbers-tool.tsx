"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Download, FileCheck2, Hash, Loader2, RotateCcw } from "lucide-react";
import { PDFDocument, rgb, StandardFonts, type RGB } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { PdfFileSummary } from "@/components/tools/pdf/pdf-file-summary";
import {
  loadPdfDocument,
  renderPdfPagePreview,
} from "@/components/tools/pdf/pdfjs-client";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";
import { cn } from "@/lib/utils";

type NumberPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type FontChoice = "helvetica" | "times" | "courier";
type NumberFormat =
  | "number"
  | "page-number"
  | "dash-number"
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
  size: number;
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

const formatOptions: Array<{ label: string; value: NumberFormat }> = [
  { label: "1", value: "number" },
  { label: "Page 1", value: "page-number" },
  { label: "- 1 -", value: "dash-number" },
  { label: "1 / 10", value: "number-total" },
  { label: "Page 1 of 10", value: "page-number-total" },
];

export function AddPageNumbersTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [options, setOptions] = useState<PageNumberOptions>({
    position: "bottom-center",
    font: "helvetica",
    size: 14,
    color: "#111827",
    startNumber: 1,
    format: "number",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(
    null,
  );
  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const pagesRef = useRef<PagePreview[]>([]);

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

  async function handleAddPageNumbers() {
    if (!selectedPdf) {
      setError("Please choose one PDF file before adding page numbers.");
      return;
    }

    if (!Number.isInteger(options.startNumber) || options.startNumber < 1) {
      setError("Start number must be 1 or higher.");
      return;
    }

    setError(null);
    setIsGenerating(true);
    clearGeneratedFile();

    try {
      const pdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const font = await embedSelectedFont(pdf, options.font);
      const color = hexToRgb(options.color);
      const totalNumber = options.startNumber + pdf.getPageCount() - 1;

      pdf.getPages().forEach((page, index) => {
        const pageNumber = options.startNumber + index;
        const text = formatPageNumberText(
          pageNumber,
          totalNumber,
          options.format,
        );
        const textWidth = font.widthOfTextAtSize(text, options.size);
        const { width, height } = page.getSize();
        const coordinates = getTextCoordinates({
          position: options.position,
          pageWidth: width,
          pageHeight: height,
          textWidth,
          fontSize: options.size,
        });

        page.drawText(text, {
          x: coordinates.x,
          y: coordinates.y,
          size: options.size,
          font,
          color,
        });
      });

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
    } catch {
      setError("Page numbers could not be added. Please try another PDF file.");
    } finally {
      setIsGenerating(false);
    }
  }

  function updateOptions(nextOptions: Partial<PageNumberOptions>) {
    clearGeneratedFile();
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
      size: 14,
      color: "#111827",
      startNumber: 1,
      format: "number",
    });
    setError(null);
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
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, customize page numbers and preview the result before download."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
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

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Size: {options.size}px
                </span>
                <input
                  type="range"
                  min={8}
                  max={48}
                  value={options.size}
                  onChange={(event) =>
                    updateOptions({ size: Number(event.target.value) })
                  }
                  className="mt-3 w-full accent-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Color
                </span>
                <input
                  type="color"
                  value={options.color}
                  onChange={(event) =>
                    updateOptions({ color: event.target.value })
                  }
                  className="mt-2 h-11 w-full rounded-md border border-input bg-background p-1"
                />
              </label>
            </div>

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
                Page numbers update instantly in the selected position.
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      <span
                        className={cn(
                          "absolute rounded-sm bg-white/80 px-1 font-semibold shadow-sm",
                          previewPositionClassName(options.position),
                        )}
                        style={{
                          color: options.color,
                          fontFamily: previewFontFamily(options.font),
                          fontSize: `${Math.max(10, options.size * 0.72)}px`,
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

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Numbering summary
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
            label="Position"
            value={labelForPosition(options.position)}
          />
          <PdfSummaryRow label="Output" value={numberedFileName} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            onClick={handleAddPageNumbers}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Add page numbers
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a href={generatedFile.url} download={generatedFile.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download numbered PDF
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Add page numbers before downloading.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download numbered PDF
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {generatedFile ? (
          <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            Your numbered PDF is ready to download.
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

async function embedSelectedFont(pdf: PDFDocument, font: FontChoice) {
  const fontMap: Record<FontChoice, StandardFonts> = {
    helvetica: StandardFonts.Helvetica,
    times: StandardFonts.TimesRoman,
    courier: StandardFonts.Courier,
  };

  return pdf.embedFont(fontMap[font]);
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

  if (format === "dash-number") {
    return `- ${pageNumber} -`;
  }

  if (format === "number-total") {
    return `${pageNumber} / ${totalNumber}`;
  }

  if (format === "page-number-total") {
    return `Page ${pageNumber} of ${totalNumber}`;
  }

  return String(pageNumber);
}

function hexToRgb(hex: string): RGB {
  const normalizedHex = hex.replace("#", "");
  const red = Number.parseInt(normalizedHex.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16) / 255;

  return rgb(red, green, blue);
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
