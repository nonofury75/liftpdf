"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  CheckCircle2,
  Download,
  FileCheck2,
  Info,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import {
  formatFileSize,
  PdfFileSummary,
} from "@/components/tools/pdf/pdf-file-summary";
import { PageSelectionToolbar } from "@/components/tools/pdf/page-selection-toolbar";
import { type PdfPageThumbnail } from "@/components/tools/pdf/page-thumbnail";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";
import {
  loadPdfDocument,
  renderPdfPageThumbnail,
} from "@/components/tools/pdf/pdfjs-client";
import {
  summarizeFilesForAnalytics,
  useToolAnalytics,
} from "@/hooks/use-tool-analytics";

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

const outputFileName = "pages-deleted.pdf";

export function DeletePagesTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PdfPageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [deletedPages, setDeletedPages] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(null);

  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const pagesRef = useRef<PdfPageThumbnail[]>([]);
  const analytics = useToolAnalytics({
    tool: "Delete Pages",
    route: "/delete-pages",
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

  const deletedPageSet = useMemo(() => new Set(deletedPages), [deletedPages]);
  const selectedPageSet = useMemo(() => new Set(selectedPages), [selectedPages]);
  const visiblePages = useMemo(
    () => pages.filter((page) => !deletedPageSet.has(page.pageNumber)),
    [deletedPageSet, pages],
  );
  const remainingPageCount = visiblePages.length;

  const clearGeneratedFile = useCallback(() => {
    setGeneratedFile((currentFile) => {
      if (currentFile) {
        URL.revokeObjectURL(currentFile.url);
      }

      return null;
    });
  }, []);

  const clearPagePreviews = useCallback(() => {
    setPages((currentPages) => {
      currentPages.forEach((page) => URL.revokeObjectURL(page.previewUrl));
      return [];
    });
  }, []);

  const resetSelectionState = useCallback(() => {
    setSelectedPages([]);
    setDeletedPages([]);
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

    if (file.size === 0) {
      setError("This PDF is empty. Please choose another file.");
      analytics.trackError({ errorCode: "empty_file" });
      return;
    }

    clearGeneratedFile();
    clearPagePreviews();
    resetSelectionState();
    setSelectedPdf(null);
    setProgress(null);
    setError(null);
    setIsLoadingPreview(true);

    try {
      const pdf = await loadPdfDocument(file);
      const thumbnails: PdfPageThumbnail[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        thumbnails.push(await renderPdfPageThumbnail(pdf, pageNumber));
      }

      setSelectedPdf({
        file,
        pageCount: pdf.numPages,
      });
      setPages(thumbnails);
      analytics.trackUploadCompleted({
        ...summarizeFilesForAnalytics([file]),
        pageCount: pdf.numPages,
        outputFormat: "pdf",
      });
      await pdf.destroy();
    } catch {
      clearPagePreviews();
      resetSelectionState();
      setSelectedPdf(null);
      setError(
        "This PDF could not be read. If it is password protected, unlock it first and try again.",
      );
      analytics.trackError({ errorCode: "pdf_read_failed" });
    } finally {
      setIsLoadingPreview(false);
    }
  }

  const handleTogglePage = useCallback(
    (pageNumber: number) => {
      clearGeneratedFile();
      setProgress(null);
      setError(null);
      setSelectedPages((currentPages) =>
        currentPages.includes(pageNumber)
          ? currentPages.filter((item) => item !== pageNumber)
          : [...currentPages, pageNumber].sort((a, b) => a - b),
      );
    },
    [clearGeneratedFile],
  );

  const handleSelectAll = useCallback(() => {
    clearGeneratedFile();
    setProgress(null);
    setError(null);
    setSelectedPages(visiblePages.map((page) => page.pageNumber));
  }, [clearGeneratedFile, visiblePages]);

  const handleClearSelection = useCallback(() => {
    clearGeneratedFile();
    setProgress(null);
    setError(null);
    setSelectedPages([]);
  }, [clearGeneratedFile]);

  const handleInvertSelection = useCallback(() => {
    clearGeneratedFile();
    setProgress(null);
    setError(null);
    setSelectedPages((currentPages) => {
      const currentSet = new Set(currentPages);
      return visiblePages
        .map((page) => page.pageNumber)
        .filter((pageNumber) => !currentSet.has(pageNumber));
    });
  }, [clearGeneratedFile, visiblePages]);

  const handleDeletePages = useCallback(
    (pageNumbers: number[]) => {
      if (!selectedPdf) {
        setError("Please choose a PDF file before deleting pages.");
        return;
      }

      const uniquePageNumbers = [...new Set(pageNumbers)].filter(
        (pageNumber) => !deletedPageSet.has(pageNumber),
      );

      if (!uniquePageNumbers.length) {
        setError("Select at least one page to delete.");
        return;
      }

      if (remainingPageCount - uniquePageNumbers.length < 1) {
        setError("A PDF must contain at least one page.");
        return;
      }

      clearGeneratedFile();
      setProgress(null);
      setError(null);
      setDeletedPages((currentPages) =>
        [...currentPages, ...uniquePageNumbers].sort((a, b) => a - b),
      );
      setSelectedPages((currentPages) =>
        currentPages.filter((pageNumber) => !uniquePageNumbers.includes(pageNumber)),
      );
    },
    [
      clearGeneratedFile,
      deletedPageSet,
      remainingPageCount,
      selectedPdf,
    ],
  );

  const handleDeleteSelected = useCallback(() => {
    handleDeletePages(selectedPages);
  }, [handleDeletePages, selectedPages]);

  const handleDeleteSinglePage = useCallback(
    (pageNumber: number) => {
      handleDeletePages([pageNumber]);
    },
    [handleDeletePages],
  );

  async function handleExportPdf() {
    if (!selectedPdf) {
      setError("Please choose a PDF file before exporting.");
      analytics.trackError({ errorCode: "missing_file" });
      return;
    }

    if (!deletedPages.length) {
      setError("Delete at least one page before downloading.");
      analytics.trackError({ errorCode: "no_pages_deleted" });
      return;
    }

    if (remainingPageCount < 1) {
      setError("A PDF must contain at least one page.");
      analytics.trackError({ errorCode: "all_pages_removed" });
      return;
    }

    setError(null);
    setIsExporting(true);
    setProgress("Preparing PDF...");
    clearGeneratedFile();
    analytics.trackConversionStarted({
      mode: "delete_pages",
      pageCount: deletedPages.length,
      outputFormat: "pdf",
    });

    try {
      const { PDFDocument } = await import("pdf-lib");
      const sourcePdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const outputPdf = await PDFDocument.create();
      const deletedSet = new Set(deletedPages);

      setProgress("Removing pages...");
      for (let index = 0; index < selectedPdf.pageCount; index += 1) {
        const pageNumber = index + 1;

        if (deletedSet.has(pageNumber)) {
          continue;
        }

        const [copiedPage] = await outputPdf.copyPages(sourcePdf, [index]);
        outputPdf.addPage(copiedPage);
      }

      if (outputPdf.getPageCount() < 1) {
        setError("A PDF must contain at least one page.");
        setProgress(null);
        analytics.trackError({ errorCode: "all_pages_removed" });
        return;
      }

      setProgress("Generating PDF...");
      const pdfBytes = await outputPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      const buffer = new ArrayBuffer(pdfBytes.byteLength);
      new Uint8Array(buffer).set(pdfBytes);
      const blob = new Blob([buffer], { type: "application/pdf" });
      const nextFile = {
        url: URL.createObjectURL(blob),
        fileName: outputFileName,
      };

      setGeneratedFile(nextFile);
      setProgress("PDF updated successfully.");
      analytics.trackConversionCompleted({
        mode: "delete_pages",
        pageCount: outputPdf.getPageCount(),
        outputFormat: "pdf",
        status: "success",
      });
      analytics.trackDownloadStarted({ outputFormat: "pdf" });
      triggerDownload(nextFile.url, nextFile.fileName);
      analytics.trackDownloadCompleted({ outputFormat: "pdf" });
    } catch {
      setError(
        "The PDF could not be exported. If it is password protected, unlock it first and try again.",
      );
      analytics.trackError({ errorCode: "export_failed" });
      setProgress(null);
    } finally {
      setIsExporting(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setError(null);
    setProgress(null);
    setIsLoadingPreview(false);
    setIsExporting(false);
    clearGeneratedFile();
    clearPagePreviews();
    resetSelectionState();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, select pages to remove and download a new PDF."
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

        {pages.length ? (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                Page preview
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Select pages to remove. The remaining pages will keep their
                original order and quality.
              </p>
            </div>

            <PageSelectionToolbar
              selectedCount={selectedPages.length}
              totalPages={visiblePages.length}
              onDeleteSelected={handleDeleteSelected}
              onSelectAll={handleSelectAll}
              onClear={handleClearSelection}
              onInvertSelection={handleInvertSelection}
              actionLabel="Remove Selected"
            />

            <div className="mt-5 grid max-h-[780px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePages.map((page) => (
                <DeletePageCard
                  key={page.pageNumber}
                  page={page}
                  isSelected={selectedPageSet.has(page.pageNumber)}
                  onToggle={handleTogglePage}
                  onDelete={handleDeleteSinglePage}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-md xl:sticky xl:top-24">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Trash2 className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Delete Pages
            </h2>
            <p className="text-sm text-muted-foreground">
              Remove unwanted pages
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Private by design
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Page removal happens locally in this browser. Your PDF is never
            uploaded to a server.
          </p>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <PdfSummaryRow
            label="PDF file"
            value={selectedPdf ? selectedPdf.file.name : "None"}
          />
          <PdfSummaryRow
            label="Original pages"
            value={selectedPdf ? String(selectedPdf.pageCount) : "0"}
          />
          <PdfSummaryRow label="Selected" value={String(selectedPages.length)} />
          <PdfSummaryRow label="Removed" value={String(deletedPages.length)} />
          <PdfSummaryRow label="Remaining" value={String(remainingPageCount)} />
          <PdfSummaryRow
            label="File size"
            value={selectedPdf ? formatFileSize(selectedPdf.file.size) : "-"}
          />
          <PdfSummaryRow label="Output" value={outputFileName} />
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
            onClick={handleExportPdf}
            disabled={!selectedPdf || isExporting}
            className="h-12 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-md"
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {isExporting ? "Generating PDF..." : "Delete Pages"}
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a
                href={generatedFile.url}
                download={generatedFile.fileName}
                aria-label="Download PDF"
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
            {generatedFile ? "Delete pages from another PDF" : "Start over"}
          </Button>
        </div>

        {generatedFile ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-800">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              PDF updated successfully
            </span>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

type DeletePageCardProps = {
  page: PdfPageThumbnail;
  isSelected: boolean;
  onToggle: (pageNumber: number) => void;
  onDelete: (pageNumber: number) => void;
};

function DeletePageCard({
  page,
  isSelected,
  onToggle,
  onDelete,
}: DeletePageCardProps) {
  return (
    <article
      className={`rounded-2xl border bg-background p-3 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-md ${
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/25"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(page.pageNumber)}
        aria-pressed={isSelected}
        aria-label={`Select page ${page.pageNumber}`}
        className="group relative flex min-h-60 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Image
          src={page.previewUrl}
          alt={`Preview of page ${page.pageNumber}`}
          width={190}
          height={260}
          className="h-auto max-h-64 w-auto rounded-sm bg-white shadow-lg ring-1 ring-black/10"
          unoptimized
        />
        <span
          className={`absolute right-3 top-3 grid size-8 place-items-center rounded-full border text-xs font-bold transition-colors ${
            isSelected
              ? "border-primary bg-primary text-white"
              : "border-border bg-background text-muted-foreground"
          }`}
          aria-hidden="true"
        >
          {isSelected ? <Check className="size-4" /> : page.pageNumber}
        </span>
      </button>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Page {page.pageNumber}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {page.width} x {page.height} pt
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onDelete(page.pageNumber)}
          aria-label={`Delete page ${page.pageNumber}`}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </article>
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
      role={tone === "error" ? "alert" : undefined}
    >
      {icon}
      {message}
    </p>
  );
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
