"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Loader2,
  RotateCcw,
} from "lucide-react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import {
  loadPdfDocument,
  renderPdfPageThumbnail,
} from "@/components/tools/pdf/pdfjs-client";
import {
  summarizeFilesForAnalytics,
  useToolAnalytics,
} from "@/hooks/use-tool-analytics";
import { cn } from "@/lib/utils";

type SplitMode = "extract" | "every-page";

type SplitPagePreview = {
  height: number;
  pageNumber: number;
  previewUrl: string;
  width: number;
};

type SelectedPdf = {
  file: File;
  pageCount: number;
  pages: SplitPagePreview[];
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

const extractedFileName = "split.pdf";
const splitZipFileName = "split-pages.zip";

export function SplitPdfTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [mode, setMode] = useState<SplitMode>("extract");
  const [rangeInput, setRangeInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [renderProgress, setRenderProgress] = useState<string | null>(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(
    null,
  );
  const selectedPdfRef = useRef<SelectedPdf | null>(null);
  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const analytics = useToolAnalytics({ tool: "Split PDF", route: "/split-pdf" });

  const outputFileName = useMemo(
    () => (mode === "extract" ? extractedFileName : splitZipFileName),
    [mode],
  );
  const parsedSelection = useMemo(() => {
    if (!selectedPdf || mode !== "extract" || !rangeInput.trim()) {
      return [];
    }

    try {
      return parsePageRanges(rangeInput, selectedPdf.pageCount);
    } catch {
      return [];
    }
  }, [mode, rangeInput, selectedPdf]);
  const selectedRangeLabel = useMemo(() => {
    if (mode === "every-page") {
      return `All ${selectedPdf?.pageCount ?? 0} pages`;
    }

    return parsedSelection.length
      ? formatPageNumbersAsRanges(parsedSelection)
      : "None";
  }, [mode, parsedSelection, selectedPdf]);

  useEffect(() => {
    generatedFileRef.current = generatedFile;
  }, [generatedFile]);

  useEffect(() => {
    selectedPdfRef.current = selectedPdf;
  }, [selectedPdf]);

  useEffect(() => {
    return () => {
      revokePagePreviews(selectedPdfRef.current);

      if (generatedFileRef.current) {
        URL.revokeObjectURL(generatedFileRef.current.url);
      }
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
    revokePagePreviews(selectedPdf);
    setSelectedPdf(null);
    setError(null);
    setIsReadingPdf(true);
    setRenderProgress("Reading PDF...");

    try {
      const pdf = await loadPdfDocument(file);
      const pages: SplitPagePreview[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        setRenderProgress(`Rendering page ${pageNumber} of ${pdf.numPages}`);
        const thumbnail = await renderPdfPageThumbnail(pdf, pageNumber);
        pages.push({
          height: thumbnail.height,
          pageNumber,
          previewUrl: thumbnail.previewUrl,
          width: thumbnail.width,
        });

        await new Promise((resolve) => window.setTimeout(resolve, 0));
      }

      setSelectedPdf({
        file,
        pageCount: pdf.numPages,
        pages,
      });
      analytics.trackUploadCompleted({
        ...summarizeFilesForAnalytics([file]),
        pageCount: pdf.numPages,
        outputFormat: "pdf",
      });
      await pdf.destroy();
    } catch {
      setSelectedPdf(null);
      setError(
        "This PDF could not be read. If it is password protected, unlock it first and try again.",
      );
      analytics.trackError({ errorCode: "pdf_read_failed" });
    } finally {
      setIsReadingPdf(false);
      setRenderProgress(null);
    }
  }

  async function handleSplit() {
    if (!selectedPdf) {
      setError("Please choose one PDF file before splitting.");
      analytics.trackError({ errorCode: "missing_file" });
      return;
    }

    setError(null);
    setIsSplitting(true);
    clearGeneratedFile();
    analytics.trackConversionStarted({
      mode,
      outputFormat: mode === "extract" ? "pdf" : "zip",
      pageCount: selectedPdf.pageCount,
    });

    try {
      const sourcePdf = await PDFDocument.load(
        await selectedPdf.file.arrayBuffer(),
      );

      if (mode === "extract") {
        const pageNumbers = parsePageRanges(rangeInput, selectedPdf.pageCount);
        const outputPdf = await PDFDocument.create();
        const copiedPages = await outputPdf.copyPages(
          sourcePdf,
          pageNumbers.map((pageNumber) => pageNumber - 1),
        );

        copiedPages.forEach((page) => outputPdf.addPage(page));

        const bytes = await outputPdf.save();
        const nextFile = {
          url: createBlobUrl(bytes, "application/pdf"),
          fileName: extractedFileName,
        };
        setGeneratedFile(nextFile);
        analytics.trackConversionCompleted({
          mode,
          outputFormat: "pdf",
          pageCount: pageNumbers.length,
          status: "success",
        });
        analytics.trackDownloadStarted({ outputFormat: "pdf" });
        triggerDownload(nextFile.url, nextFile.fileName);
        analytics.trackDownloadCompleted({ outputFormat: "pdf" });
      } else {
        const zip = new JSZip();

        for (const pageIndex of sourcePdf.getPageIndices()) {
          const singlePagePdf = await PDFDocument.create();
          const [page] = await singlePagePdf.copyPages(sourcePdf, [pageIndex]);
          singlePagePdf.addPage(page);
          const bytes = await singlePagePdf.save();
          zip.file(`page-${pageIndex + 1}.pdf`, bytes);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const nextFile = {
          url: URL.createObjectURL(zipBlob),
          fileName: splitZipFileName,
        };
        setGeneratedFile(nextFile);
        analytics.trackConversionCompleted({
          mode,
          outputFormat: "zip",
          pageCount: selectedPdf.pageCount,
          status: "success",
        });
        analytics.trackDownloadStarted({ outputFormat: "zip" });
        triggerDownload(nextFile.url, nextFile.fileName);
        analytics.trackDownloadCompleted({ outputFormat: "zip" });
      }
    } catch (splitError) {
      setError(
        splitError instanceof Error
          ? splitError.message
          : "The PDF could not be split. Please try another file.",
      );
      analytics.trackError({ errorCode: "split_failed" });
    } finally {
      setIsSplitting(false);
    }
  }

  function handleReset() {
    revokePagePreviews(selectedPdf);
    setSelectedPdf(null);
    setRangeInput("");
    setMode("extract");
    setError(null);
    setRenderProgress(null);
    clearGeneratedFile();
  }

  function clearGeneratedFile() {
    setGeneratedFile((currentFile) => {
      if (currentFile) {
        URL.revokeObjectURL(currentFile.url);
      }

      return null;
    });
  }

  function handlePageToggle(pageNumber: number) {
    if (!selectedPdf || mode !== "extract") {
      return;
    }

    clearGeneratedFile();
    setError(null);

    let currentPages: number[] = [];

    try {
      currentPages = rangeInput.trim()
        ? parsePageRanges(rangeInput, selectedPdf.pageCount)
        : [];
    } catch {
      currentPages = [];
    }

    const nextPages = currentPages.includes(pageNumber)
      ? currentPages.filter((currentPage) => currentPage !== pageNumber)
      : [...currentPages, pageNumber].sort((a, b) => a - b);

    setRangeInput(formatPageNumbersAsRanges(nextPages));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, then extract selected pages or split every page into a separate PDF."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        {isReadingPdf ? (
          <p className="rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
            <Loader2 className="mr-2 inline size-4 animate-spin" aria-hidden="true" />
            {renderProgress ?? "Preparing PDF preview..."}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {selectedPdf ? (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-md">
            <div className="grid gap-4 sm:grid-cols-[56px_1fr]">
              <div className="grid size-12 place-items-center rounded-md border border-border bg-muted text-primary">
                <FileText className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {selectedPdf.file.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatFileSize(selectedPdf.file.size)} -{" "}
                  {selectedPdf.pageCount}{" "}
                  {selectedPdf.pageCount === 1 ? "page" : "pages"}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-border bg-card p-5 shadow-md">
          <h2 className="text-lg font-semibold text-foreground">
            Split options
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              aria-pressed={mode === "extract"}
              className={cn(
                "rounded-xl border border-border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
                mode === "extract" && "border-primary bg-primary/5",
              )}
              onClick={() => {
                setMode("extract");
                clearGeneratedFile();
              }}
            >
              <span className="text-sm font-semibold text-foreground">
                Extract page ranges
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                Create one PDF from selected pages.
              </span>
            </button>
            <button
              type="button"
              aria-pressed={mode === "every-page"}
              className={cn(
                "rounded-xl border border-border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
                mode === "every-page" && "border-primary bg-primary/5",
              )}
              onClick={() => {
                setMode("every-page");
                clearGeneratedFile();
              }}
            >
              <span className="text-sm font-semibold text-foreground">
                Split every page
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                Create a ZIP with one PDF per page.
              </span>
            </button>
          </div>

          {mode === "extract" ? (
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-foreground">
                Pages to extract
              </span>
              <input
                value={rangeInput}
                onChange={(event) => {
                  setRangeInput(event.target.value);
                  clearGeneratedFile();
                }}
                placeholder="1-3, 5, 8-10"
                className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
              />
              <span className="mt-2 block text-xs font-medium text-muted-foreground">
                Examples: 1-3, 5, 8-10 or 1,3,5-8.
              </span>
            </label>
          ) : null}
        </div>

        {selectedPdf ? (
          <PagePreviewGrid
            mode={mode}
            pages={selectedPdf.pages}
            selectedPages={parsedSelection}
            onPageToggle={handlePageToggle}
          />
        ) : null}
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-md xl:sticky xl:top-24">
        <h2 className="text-xl font-semibold text-foreground">Split summary</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose page ranges for one PDF, or split every page into a ZIP.
        </p>
        <div className="mt-5 space-y-3 rounded-xl border border-border bg-muted/25 p-4 text-sm">
          <SummaryRow
            label="PDF file"
            value={selectedPdf ? selectedPdf.file.name : "None"}
          />
          <SummaryRow
            label="Pages"
            value={selectedPdf ? String(selectedPdf.pageCount) : "0"}
          />
          <SummaryRow
            label={mode === "extract" ? "Selected ranges" : "Split mode"}
            value={selectedRangeLabel}
          />
          <SummaryRow
            label="Output"
            value={generatedFile?.fileName ?? outputFileName}
          />
        </div>

        <div className="mt-7 grid gap-3">
          <Button
            type="button"
            onClick={handleSplit}
            disabled={isSplitting || isReadingPdf}
            className="h-12 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            {isSplitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {isSplitting ? "Splitting..." : "Split PDF"}
          </Button>

          {generatedFile ? (
            <>
              <p
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm"
                aria-live="polite"
              >
                <CheckCircle2 className="mr-2 inline size-4" aria-hidden="true" />
                {generatedFile.fileName.endsWith(".zip")
                  ? "ZIP created successfully"
                  : "PDF created successfully"}
              </p>
              <Button
                asChild
                variant="outline"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <a
                  href={generatedFile.url}
                  download={generatedFile.fileName}
                  onClick={() => {
                    const outputFormat = generatedFile.fileName.endsWith(".zip")
                      ? "zip"
                      : "pdf";
                    analytics.trackDownloadStarted({ outputFormat });
                    analytics.trackDownloadCompleted({ outputFormat });
                  }}
                >
                  <Download className="size-4" aria-hidden="true" />
                  {generatedFile.fileName.endsWith(".zip")
                    ? "Download ZIP"
                    : "Download PDF"}
                </a>
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Split your PDF before downloading.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Split another PDF
          </Button>
        </div>
      </aside>
    </div>
  );
}

type PagePreviewGridProps = {
  mode: SplitMode;
  pages: SplitPagePreview[];
  selectedPages: number[];
  onPageToggle: (pageNumber: number) => void;
};

function PagePreviewGrid({
  mode,
  pages,
  selectedPages,
  onPageToggle,
}: PagePreviewGridProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
      <div className="flex flex-col gap-2 border-b border-border bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Page preview
          </h2>
          <p className="text-sm text-muted-foreground">
            {mode === "extract"
              ? "Click pages or type ranges to choose what to extract."
              : "Every page will be exported as a separate PDF in a ZIP."}
          </p>
        </div>
        <span className="rounded-md bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
          {mode === "extract"
            ? `${selectedPages.length} selected`
            : `${pages.length} files`}
        </span>
      </div>

      <ul className="grid max-h-[720px] gap-4 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          const isSelected =
            mode === "every-page" || selectedPages.includes(page.pageNumber);

          return (
            <li key={page.pageNumber}>
              <button
                type="button"
                disabled={mode === "every-page"}
                aria-pressed={isSelected}
                aria-label={`Page ${page.pageNumber}`}
                className={cn(
                  "w-full rounded-xl border bg-background p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-default disabled:hover:translate-y-0",
                  isSelected
                    ? "border-primary ring-2 ring-primary/15"
                    : "border-border hover:border-primary/30",
                )}
                onClick={() => onPageToggle(page.pageNumber)}
              >
                <div className="relative mx-auto aspect-[3/4] max-h-52 overflow-hidden rounded-lg border border-border bg-muted shadow-inner">
                  <Image
                    src={page.previewUrl}
                    alt=""
                    fill
                    sizes="180px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    Page {page.pageNumber}
                  </span>
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-semibold",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {isSelected ? "Selected" : "Not selected"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {page.width} x {page.height} pt
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
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
      <span className="max-w-40 truncate text-right font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function parsePageRanges(input: string, pageCount: number) {
  const normalizedInput = input.trim();

  if (!normalizedInput) {
    throw new Error(
      "Enter the pages you want to extract, for example 1,3,5-8.",
    );
  }

  const pageNumbers: number[] = [];
  const parts = normalizedInput.split(",");

  for (const rawPart of parts) {
    const part = rawPart.trim();

    if (!part) {
      throw new Error("The page range is invalid. Use a format like 1,3,5-8.");
    }

    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    const singlePageMatch = part.match(/^\d+$/);

    if (rangeMatch) {
      const startPage = Number(rangeMatch[1]);
      const endPage = Number(rangeMatch[2]);

      if (startPage > endPage) {
        throw new Error(
          "Page ranges must go from low to high, for example 2-5.",
        );
      }

      for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
        validatePageNumber(pageNumber, pageCount);
        pageNumbers.push(pageNumber);
      }
    } else if (singlePageMatch) {
      const pageNumber = Number(part);
      validatePageNumber(pageNumber, pageCount);
      pageNumbers.push(pageNumber);
    } else {
      throw new Error("The page range is invalid. Use a format like 1,3,5-8.");
    }
  }

  return Array.from(new Set(pageNumbers));
}

function validatePageNumber(pageNumber: number, pageCount: number) {
  if (pageNumber < 1 || pageNumber > pageCount) {
    throw new Error(`Page ${pageNumber} does not exist in this PDF.`);
  }
}

function createBlobUrl(bytes: Uint8Array<ArrayBufferLike>, type: string) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);

  return URL.createObjectURL(new Blob([buffer], { type }));
}

function formatPageNumbersAsRanges(pageNumbers: number[]) {
  if (!pageNumbers.length) {
    return "";
  }

  const sortedPages = Array.from(new Set(pageNumbers)).sort((a, b) => a - b);
  const ranges: string[] = [];
  let startPage = sortedPages[0];
  let previousPage = sortedPages[0];

  for (const pageNumber of sortedPages.slice(1)) {
    if (pageNumber === previousPage + 1) {
      previousPage = pageNumber;
      continue;
    }

    ranges.push(
      startPage === previousPage
        ? String(startPage)
        : `${startPage}-${previousPage}`,
    );
    startPage = pageNumber;
    previousPage = pageNumber;
  }

  ranges.push(
    startPage === previousPage ? String(startPage) : `${startPage}-${previousPage}`,
  );

  return ranges.join(", ");
}

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

function revokePagePreviews(pdf: SelectedPdf | null) {
  pdf?.pages.forEach((page) => URL.revokeObjectURL(page.previewUrl));
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
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
