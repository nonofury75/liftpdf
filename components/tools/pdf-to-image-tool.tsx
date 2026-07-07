"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  FileCheck2,
  FileImage,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { PdfFileSummary } from "@/components/tools/pdf/pdf-file-summary";
import {
  exportPdfPagesAsImages,
  PdfImageResolution,
} from "@/components/tools/pdf/pdf-image-export";
import {
  loadPdfDocument,
  renderPdfPageThumbnail,
} from "@/components/tools/pdf/pdfjs-client";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";
import { cn } from "@/lib/utils";

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type PagePreview = {
  height: number;
  pageNumber: number;
  previewUrl: string;
  width: number;
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
const jpgQualityOptions: Array<{ label: string; value: PdfImageResolution }> = [
  { label: "Normal", value: "standard" },
  { label: "High", value: "high" },
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
  const isJpg = format === "jpg";
  const selectedPages = useMemo(
    () =>
      selectedPdf
        ? getSelectedPagesSafely({
            mode: pageSelectionMode,
            pageCount: selectedPdf.pageCount,
            pageRange,
            singlePage,
          })
        : [],
    [pageRange, pageSelectionMode, selectedPdf, singlePage],
  );
  const previewPages = useMemo(() => {
    if (!pages.length) {
      return [];
    }

    const selectedPageSet = new Set(selectedPages);
    const filteredPages = selectedPages.length
      ? pages.filter((page) => selectedPageSet.has(page.pageNumber))
      : pages;

    return filteredPages.slice(0, isJpg ? 12 : pages.length);
  }, [isJpg, pages, selectedPages]);
  const selectedPagesLabel = selectedPdf
    ? formatSelectedPagesLabel(selectedPages, selectedPdf.pageCount)
    : "None";
  const expectedOutputName = getExpectedOutputName({
    format,
    selectedPages,
    selectedPdf,
    singlePageFileName,
    zipFileName,
  });

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
        previews.push(await renderPdfPageThumbnail(pdf, pageNumber));
      }

      setSelectedPdf({
        file,
        pageCount: pdf.numPages,
      });
      setPages(previews);
      await pdf.destroy();
    } catch (loadError) {
      setSelectedPdf(null);
      clearPagePreviews();
      setError(getPdfLoadErrorMessage(loadError));
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="order-1 space-y-6 xl:col-start-1 xl:row-start-1">
        {!selectedPdf ? (
          <PdfUploadZone
            multiple={false}
            title="Drop your PDF file here"
            description={description}
            buttonLabel="Choose PDF file"
            onFilesSelected={handleFilesSelected}
          />
        ) : null}

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {isLoadingPreview ? (
          <p className="rounded-md bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
            Loading PDF preview...
          </p>
        ) : null}

        {selectedPdf && pages[0] ? (
          <section className="rounded-2xl border border-border bg-card p-4 shadow-md sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  PDF preview
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  First page preview. Selected pages appear below.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                <FileImage className="size-3.5 text-primary" aria-hidden="true" />
                Output {format.toUpperCase()}
              </span>
            </div>

            <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-200/70 p-4 shadow-inner sm:min-h-[620px]">
              <Image
                src={pages[0].previewUrl}
                alt="First page preview"
                width={Math.max(260, pages[0].width)}
                height={Math.max(360, pages[0].height)}
                className="max-h-[560px] w-auto rounded-sm bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] ring-1 ring-black/10"
                unoptimized
                priority
              />
            </div>
          </section>
        ) : null}

        {pages.length ? (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Page preview
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Showing {previewPages.length} of{" "}
                {selectedPages.length || pages.length} selected pages.
              </p>
            </div>

            <div className="mt-5 grid max-h-[620px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {previewPages.map((page) => (
                <article
                  key={page.pageNumber}
                  className="rounded-xl border border-border bg-background p-3 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
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

      <aside className="order-2 h-fit rounded-2xl border border-border bg-card p-6 shadow-md xl:sticky xl:top-24 xl:col-start-2 xl:row-start-1">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="mt-2 text-sm leading-6 text-muted-foreground">
          {isJpg
            ? "Choose how to export your PDF pages as JPG images."
            : "Choose how to export your PDF pages as PNG images."}
        </div>

        {selectedPdf ? (
          <div className="mt-5">
            <PdfFileSummary
              fileName={selectedPdf.file.name}
              fileSize={selectedPdf.file.size}
              pageCount={selectedPdf.pageCount}
            />
          </div>
        ) : null}

        <div className="mt-5 space-y-3 rounded-xl border border-border bg-muted/25 p-4 text-sm">
          <PdfSummaryRow
            label="PDF file"
            value={selectedPdf ? selectedPdf.file.name : "None"}
          />
          <PdfSummaryRow
            label="Pages"
            value={selectedPdf ? String(selectedPdf.pageCount) : "0"}
          />
          <PdfSummaryRow label="Output format" value={format.toUpperCase()} />
          <PdfSummaryRow
            label="Quality"
            value={
              isJpg
                ? labelFor(jpgQualityOptions, resolution)
                : `${quality} / ${labelFor(resolutionOptions, resolution)}`
            }
          />
          <PdfSummaryRow label="Selected pages" value={selectedPagesLabel} />
          <PdfSummaryRow
            label="Output"
            value={generatedFile?.fileName ?? expectedOutputName}
          />
        </div>

        <div className="mt-7 space-y-6">
          {isJpg ? (
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-foreground">
                Mode
              </legend>
              <div className="grid gap-2">
                <button
                  type="button"
                  aria-pressed="true"
                  className="rounded-xl border border-primary bg-primary/10 px-3 py-3 text-left text-sm font-semibold text-primary shadow-sm"
                >
                  Page to JPG
                  <span className="mt-1 block text-xs font-medium text-muted-foreground">
                    Each selected page becomes one JPG image.
                  </span>
                </button>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-xl border border-border bg-muted/50 px-3 py-3 text-left text-sm font-semibold text-muted-foreground"
                >
                  Extract images
                  <span className="ml-2 rounded-full bg-background px-2 py-0.5 text-[11px] font-bold uppercase text-muted-foreground">
                    Coming Soon
                  </span>
                </button>
              </div>
            </fieldset>
          ) : null}

          {isJpg ? (
            <OptionButtons
              label="Quality"
              options={jpgQualityOptions}
              value={resolution}
              onChange={(value) => {
                invalidateGeneratedFile();
                setResolution(value);
                setQuality(value === "high" ? Math.max(defaultQuality, 92) : 85);
              }}
            />
          ) : (
            <>
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

              <OptionButtons
                label="Resolution"
                options={resolutionOptions}
                value={resolution}
                onChange={(value) => {
                  invalidateGeneratedFile();
                  setResolution(value);
                }}
              />
            </>
          )}

          <OptionButtons
            label="Pages"
            options={pageSelectionOptions}
            value={pageSelectionMode}
            onChange={(value) => {
              invalidateGeneratedFile();
              setPageSelectionMode(value);
            }}
          />

          {pageSelectionMode === "single" ? (
            <label className="block">
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
            <label className="block">
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

        <div className="mt-7 grid gap-3">
          <Button
            type="button"
            onClick={handleConvert}
            disabled={!selectedPdf || isConverting}
            className="h-12 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-lg"
          >
            {isConverting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {actionLabel}
          </Button>

          {generatedFile ? (
            <Button
              asChild
              variant="outline"
              className="transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm"
            >
              <a href={generatedFile.url} download={generatedFile.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download {selectedPages.length === 1 ? format.toUpperCase() : "ZIP"}
              </a>
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            className="transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm"
            onClick={handleReset}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Start over
          </Button>
        </div>

        {progress ? (
          <p className="mt-4 rounded-md bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
            Converting pages... {progress}
          </p>
        ) : null}

        {generatedFile ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm">
            {selectedPages.length === 1
              ? `${format.toUpperCase()} created successfully`
              : "ZIP created successfully"}
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

type OptionButtonProps<T extends string> = {
  label: string;
  onChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
  value: T;
};

function OptionButtons<T extends string>({
  label,
  onChange,
  options,
  value,
}: OptionButtonProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-foreground">
        {label}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            className={cn(
              "rounded-xl border border-border px-3 py-2.5 text-left text-sm font-semibold transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm",
              value === option.value
                ? "border-primary bg-primary/10 text-primary"
                : "bg-background text-foreground hover:bg-muted",
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function getSelectedPagesSafely({
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
  try {
    return parseSelectedPages({ mode, pageCount, pageRange, singlePage });
  } catch {
    return [];
  }
}

function formatSelectedPagesLabel(pageNumbers: number[], pageCount: number) {
  if (!pageNumbers.length) {
    return "Invalid";
  }

  if (pageNumbers.length === pageCount) {
    return "All pages";
  }

  if (pageNumbers.length === 1) {
    return `Page ${pageNumbers[0]}`;
  }

  return `${pageNumbers.length} pages`;
}

function getExpectedOutputName({
  format,
  selectedPages,
  selectedPdf,
  singlePageFileName,
  zipFileName,
}: {
  format: "jpg" | "png";
  selectedPages: number[];
  selectedPdf: SelectedPdf | null;
  singlePageFileName: string;
  zipFileName: string;
}) {
  if (!selectedPdf) {
    return "None";
  }

  if (selectedPages.length === 1) {
    return selectedPages[0] === 1
      ? singlePageFileName
      : `page-${selectedPages[0]}.${format}`;
  }

  return zipFileName;
}

function labelFor<T extends string>(
  options: Array<{ label: string; value: T }>,
  value: T,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function getPdfLoadErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  const name = error instanceof Error ? error.name.toLowerCase() : "";

  if (
    name.includes("password") ||
    message.includes("password") ||
    message.includes("encrypted")
  ) {
    return "This PDF is password protected. Please unlock it first.";
  }

  return "This PDF could not be read. Please choose another file.";
}
