"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Download, FileCheck2, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { PdfFileSummary } from "@/components/tools/pdf/pdf-file-summary";
import {
  exportPdfPagesAsImages,
  PdfImageResolution,
} from "@/components/tools/pdf/pdf-image-export";
import {
  loadPdfDocument,
  renderPdfPagePreview,
} from "@/components/tools/pdf/pdfjs-client";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";
import { cn } from "@/lib/utils";

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

type PageSelectionMode = "all" | "single" | "range";

type PdfToImageToolProps = {
  format: "jpg" | "png";
  title: string;
  description: string;
  actionLabel: string;
  successMessage: string;
  singlePageFileName: string;
  zipFileName: string;
  qualityLabel: string;
  defaultQuality: number;
  showTransparentBackground?: boolean;
};

const resolutionOptions: Array<{ label: string; value: PdfImageResolution }> = [
  { label: "Standard quality", value: "standard" },
  { label: "High quality", value: "high" },
];
const pageSelectionOptions: Array<{ label: string; value: PageSelectionMode }> =
  [
    { label: "All pages", value: "all" },
    { label: "Single page", value: "single" },
    { label: "Page range", value: "range" },
];

export function PdfToImageTool({
  format,
  title,
  description,
  actionLabel,
  successMessage,
  singlePageFileName,
  zipFileName,
  qualityLabel,
  defaultQuality,
  showTransparentBackground = false,
}: PdfToImageToolProps) {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [quality, setQuality] = useState(defaultQuality);
  const [resolution, setResolution] =
    useState<PdfImageResolution>("standard");
  const [pageSelectionMode, setPageSelectionMode] =
    useState<PageSelectionMode>("all");
  const [singlePage, setSinglePage] = useState("1");
  const [pageRange, setPageRange] = useState("");
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(
    null,
  );
  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const pagesRef = useRef<PagePreview[]>([]);

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
      await pdf.destroy();
    } catch {
      setSelectedPdf(null);
      clearPagePreviews();
      setError("This PDF could not be read. Please choose another file.");
    } finally {
      setIsLoadingPreview(false);
    }
  }

  async function handleConvert() {
    if (!selectedPdf) {
      setError("Please choose one PDF file before converting.");
      return;
    }

    setError(null);
    setIsConverting(true);
    clearGeneratedFile();

    try {
      const selectedPages = parseSelectedPages({
        mode: pageSelectionMode,
        pageCount: selectedPdf.pageCount,
        pageRange,
        singlePage,
      });
      const pdf = await loadPdfDocument(selectedPdf.file);
      const result = await exportPdfPagesAsImages({
        pdf,
        singlePageFileName,
        zipFileName,
        options: {
          format,
          quality,
          resolution,
          pageNumbers: selectedPages,
          transparentBackground,
          onProgress: (currentPage, pageCount) => {
            setProgress(`Converting page ${currentPage} of ${pageCount}`);
          },
        },
      });

      setGeneratedFile({
        url: URL.createObjectURL(result.blob),
        fileName: result.fileName,
      });
      await pdf.destroy();
      setProgress(null);
    } catch (conversionError) {
      setError(
        conversionError instanceof Error
          ? conversionError.message
          : "The PDF could not be converted. Please try another file.",
      );
      setProgress(null);
    } finally {
      setIsConverting(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setQuality(defaultQuality);
    setResolution("standard");
    setPageSelectionMode("all");
    setSinglePage("1");
    setPageRange("");
    setTransparentBackground(false);
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

  function invalidateGeneratedFile() {
    clearGeneratedFile();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description={description}
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
          <h2 className="text-lg font-semibold text-foreground">
            Export options
          </h2>

          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-foreground">
                {qualityLabel}: {quality}
              </span>
              <input
                type="range"
                min={50}
                max={100}
                step={1}
                value={quality}
                onChange={(event) => {
                  invalidateGeneratedFile();
                  setQuality(Number(event.target.value));
                }}
                className="mt-3 w-full accent-primary"
              />
            </label>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-foreground">
                Resolution
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {resolutionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "rounded-md border border-border px-3 py-2 text-left text-sm font-medium transition-colors",
                      resolution === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-background text-foreground hover:bg-muted",
                    )}
                    onClick={() => {
                      invalidateGeneratedFile();
                      setResolution(option.value);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-foreground">
                Pages
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {pageSelectionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "rounded-md border border-border px-3 py-2 text-left text-sm font-medium transition-colors",
                      pageSelectionMode === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-background text-foreground hover:bg-muted",
                    )}
                    onClick={() => {
                      invalidateGeneratedFile();
                      setPageSelectionMode(option.value);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {pageSelectionMode === "single" ? (
                <label className="mt-3 block">
                  <span className="text-sm font-semibold text-foreground">
                    Page number
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={selectedPdf?.pageCount ?? 1}
                    value={singlePage}
                    onChange={(event) => {
                      invalidateGeneratedFile();
                      setSinglePage(event.target.value);
                    }}
                    className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                </label>
              ) : null}

              {pageSelectionMode === "range" ? (
                <label className="mt-3 block">
                  <span className="text-sm font-semibold text-foreground">
                    Page range
                  </span>
                  <input
                    value={pageRange}
                    onChange={(event) => {
                      invalidateGeneratedFile();
                      setPageRange(event.target.value);
                    }}
                    placeholder="1,3,5-8"
                    className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                </label>
              ) : null}
            </fieldset>

            {showTransparentBackground ? (
              <label className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    Transparent background
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    Keep transparent PDF areas transparent when possible.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={transparentBackground}
                  onChange={(event) => {
                    invalidateGeneratedFile();
                    setTransparentBackground(event.target.checked);
                  }}
                  className="size-5 accent-primary"
                />
              </label>
            ) : null}
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
                Page preview
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Each PDF page will be exported as a {format.toUpperCase()}{" "}
                image.
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <article
                  key={page.pageNumber}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-md bg-muted p-3">
                    <Image
                      src={page.previewUrl}
                      alt={`Page ${page.pageNumber}`}
                      width={170}
                      height={230}
                      className="h-auto max-h-56 w-auto rounded-sm bg-white shadow-sm"
                      unoptimized
                    />
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
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <div className="mt-5 space-y-3 text-sm">
          <PdfSummaryRow
            label="PDF file"
            value={selectedPdf ? selectedPdf.file.name : "None"}
          />
          <PdfSummaryRow
            label="Pages"
            value={selectedPdf ? String(selectedPdf.pageCount) : "0"}
          />
          <PdfSummaryRow label="Format" value={format.toUpperCase()} />
          <PdfSummaryRow
            label="Output"
            value={
              generatedFile?.fileName ??
              (selectedPdf?.pageCount === 1 ? singlePageFileName : zipFileName)
            }
          />
        </div>

        <div className="mt-6 grid gap-3">
          <Button type="button" onClick={handleConvert} disabled={isConverting}>
            {isConverting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {actionLabel}
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a href={generatedFile.url} download={generatedFile.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Convert your PDF before downloading.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Start over
          </Button>
        </div>

        {progress ? (
          <p className="mt-4 rounded-md bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
            {progress}
          </p>
        ) : null}

        {generatedFile ? (
          <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            {successMessage}
          </p>
        ) : null}
      </aside>
    </div>
  );
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

function parseSelectedPages({
  mode,
  pageCount,
  pageRange,
  singlePage,
}: {
  mode: PageSelectionMode;
  pageCount: number;
  pageRange: string;
  singlePage: string;
}) {
  if (mode === "all") {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (mode === "single") {
    const pageNumber = Number(singlePage);

    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pageCount) {
      throw new Error(`Please enter a page number between 1 and ${pageCount}.`);
    }

    return [pageNumber];
  }

  const selectedPages = parsePageRange(pageRange, pageCount);

  if (!selectedPages.length) {
    throw new Error("Please enter a valid page range such as 1,3,5-8.");
  }

  return selectedPages;
}

function parsePageRange(value: string, pageCount: number) {
  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const selectedPages: number[] = [];
  const seenPages = new Set<number>();

  for (const part of parts) {
    const rangeMatch = /^(\d+)-(\d+)$/.exec(part);
    const singleMatch = /^(\d+)$/.exec(part);

    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);

      if (start > end || start < 1 || end > pageCount) {
        throw new Error("Page range cannot include pages outside this PDF.");
      }

      for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
        if (!seenPages.has(pageNumber)) {
          selectedPages.push(pageNumber);
          seenPages.add(pageNumber);
        }
      }
    } else if (singleMatch) {
      const pageNumber = Number(singleMatch[1]);

      if (pageNumber < 1 || pageNumber > pageCount) {
        throw new Error("Page range cannot include pages outside this PDF.");
      }

      if (!seenPages.has(pageNumber)) {
        selectedPages.push(pageNumber);
        seenPages.add(pageNumber);
      }
    } else {
      throw new Error("Please enter a valid page range such as 1,3,5-8.");
    }
  }

  return selectedPages;
}
