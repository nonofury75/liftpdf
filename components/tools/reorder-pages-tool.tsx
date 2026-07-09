"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck2,
  GripVertical,
  Info,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  type DragEvent,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import {
  formatFileSize,
  PdfFileSummary,
} from "@/components/tools/pdf/pdf-file-summary";
import type { PdfPageThumbnail } from "@/components/tools/pdf/page-thumbnail";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";
import {
  loadPdfDocument,
  renderPdfPageThumbnail,
} from "@/components/tools/pdf/pdfjs-client";
import { cn } from "@/lib/utils";

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

const outputFileName = "pages-reordered.pdf";

export function ReorderPagesTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PdfPageThumbnail[]>([]);
  const [draggedPageNumber, setDraggedPageNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(null);

  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const pagesRef = useRef<PdfPageThumbnail[]>([]);

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

  const hasOrderChanged = useMemo(
    () => pages.some((page, index) => page.pageNumber !== index + 1),
    [pages],
  );

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

    if (file.size === 0) {
      setError("This PDF is empty. Please choose another file.");
      return;
    }

    clearGeneratedFile();
    clearPagePreviews();
    setSelectedPdf(null);
    setDraggedPageNumber(null);
    setError(null);
    setStatus(null);
    setProgress(null);
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
      await pdf.destroy();
    } catch {
      clearPagePreviews();
      setSelectedPdf(null);
      setError(
        "This PDF could not be read. If it is password protected, unlock it first and try again.",
      );
    } finally {
      setIsLoadingPreview(false);
    }
  }

  const movePage = useCallback(
    (pageNumber: number, direction: -1 | 1) => {
      clearGeneratedFile();
      setError(null);
      setStatus(null);
      setProgress(null);
      setPages((currentPages) => {
        const currentIndex = currentPages.findIndex(
          (page) => page.pageNumber === pageNumber,
        );
        const nextIndex = currentIndex + direction;

        if (
          currentIndex < 0 ||
          nextIndex < 0 ||
          nextIndex >= currentPages.length
        ) {
          return currentPages;
        }

        return moveItem(currentPages, currentIndex, nextIndex);
      });
    },
    [clearGeneratedFile],
  );

  const handleDragStart = useCallback(
    (pageNumber: number) => {
      setDraggedPageNumber(pageNumber);
    },
    [],
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (targetPageNumber: number) => {
      if (draggedPageNumber === null || draggedPageNumber === targetPageNumber) {
        setDraggedPageNumber(null);
        return;
      }

      clearGeneratedFile();
      setError(null);
      setStatus(null);
      setProgress(null);
      setPages((currentPages) => {
        const fromIndex = currentPages.findIndex(
          (page) => page.pageNumber === draggedPageNumber,
        );
        const toIndex = currentPages.findIndex(
          (page) => page.pageNumber === targetPageNumber,
        );

        if (fromIndex < 0 || toIndex < 0) {
          return currentPages;
        }

        return moveItem(currentPages, fromIndex, toIndex);
      });
      setDraggedPageNumber(null);
    },
    [clearGeneratedFile, draggedPageNumber],
  );

  const handleResetOrder = useCallback(() => {
    clearGeneratedFile();
    setError(null);
    setStatus(null);
    setProgress(null);
    setDraggedPageNumber(null);
    setPages((currentPages) =>
      currentPages.slice().sort((a, b) => a.pageNumber - b.pageNumber),
    );
  }, [clearGeneratedFile]);

  async function handleExportPdf() {
    if (!selectedPdf) {
      setError("Please choose a PDF file before reordering pages.");
      return;
    }

    setError(null);
    setStatus(
      hasOrderChanged
        ? null
        : "The PDF keeps the current page order because no pages were moved.",
    );
    setIsExporting(true);
    setProgress("Preparing PDF...");
    clearGeneratedFile();

    try {
      const { PDFDocument } = await import("pdf-lib");
      const sourcePdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const outputPdf = await PDFDocument.create();
      const pageIndexes = pages.map((page) => page.pageNumber - 1);
      setProgress("Reordering pages...");
      const copiedPages = await outputPdf.copyPages(sourcePdf, pageIndexes);

      copiedPages.forEach((page) => outputPdf.addPage(page));

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
      setProgress("Pages reordered successfully.");
      triggerDownload(nextFile.url, nextFile.fileName);
    } catch {
      setError(
        "The PDF could not be reordered. If it is password protected, unlock it first and try again.",
      );
      setProgress(null);
    } finally {
      setIsExporting(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setError(null);
    setStatus(null);
    setProgress(null);
    setDraggedPageNumber(null);
    setIsLoadingPreview(false);
    setIsExporting(false);
    clearGeneratedFile();
    clearPagePreviews();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, drag pages into a new order and download a reordered PDF."
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

          {status ? (
            <StatusNotice
              tone="neutral"
              icon={<Info className="size-4" />}
              message={status}
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
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Page order
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Drag pages on desktop or use the move buttons for keyboard and
                  mobile control.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetOrder}
                disabled={!hasOrderChanged}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Reset order
              </Button>
            </div>

            <div className="grid max-h-[780px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page, index) => (
                <ReorderPageCard
                  key={page.pageNumber}
                  page={page}
                  position={index + 1}
                  totalPages={pages.length}
                  isDragging={draggedPageNumber === page.pageNumber}
                  onMoveLeft={() => movePage(page.pageNumber, -1)}
                  onMoveRight={() => movePage(page.pageNumber, 1)}
                  onDragStart={() => handleDragStart(page.pageNumber)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(page.pageNumber)}
                  onDragEnd={() => setDraggedPageNumber(null)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-md xl:sticky xl:top-24">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <GripVertical className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Reorder Pages
            </h2>
            <p className="text-sm text-muted-foreground">
              Arrange page order
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Private by design
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Page reordering happens locally in this browser. Your PDF is never
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
            label="Current order"
            value={hasOrderChanged ? "Changed" : "Original"}
          />
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
            {isExporting ? "Generating PDF..." : "Reorder PDF"}
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a
                href={generatedFile.url}
                download={generatedFile.fileName}
                aria-label="Download PDF"
              >
                <Download className="size-4" aria-hidden="true" />
                Download PDF
              </a>
            </Button>
          ) : null}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            {generatedFile ? "Reorder another PDF" : "Start over"}
          </Button>
        </div>

        {generatedFile ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-800">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Pages reordered successfully
            </span>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

type ReorderPageCardProps = {
  page: PdfPageThumbnail;
  position: number;
  totalPages: number;
  isDragging: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDragStart: () => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
};

const ReorderPageCard = memo(function ReorderPageCard({
  page,
  position,
  totalPages,
  isDragging,
  onMoveLeft,
  onMoveRight,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: ReorderPageCardProps) {
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-2xl border border-border bg-background p-3 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md",
        isDragging && "border-primary opacity-75 ring-2 ring-primary/20",
      )}
      aria-label={`Original page ${page.pageNumber}, position ${position}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          <GripVertical className="size-3.5 text-primary" aria-hidden="true" />
          Drag
        </span>
        <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          Position {position}
        </span>
      </div>

      <div className="flex min-h-60 items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-4 shadow-inner">
        <Image
          src={page.previewUrl}
          alt={`Preview of original page ${page.pageNumber}`}
          width={190}
          height={260}
          className="h-auto max-h-64 w-auto rounded-sm bg-white shadow-lg ring-1 ring-black/10"
          unoptimized
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Original page {page.pageNumber}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {page.width} x {page.height} pt
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onMoveLeft}
          disabled={position === 1}
          aria-label={`Move original page ${page.pageNumber} left`}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Left
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onMoveRight}
          disabled={position === totalPages}
          aria-label={`Move original page ${page.pageNumber} right`}
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          Right
        </Button>
      </div>
    </article>
  );
});

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);

  if (item === undefined) {
    return items;
  }

  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

type StatusNoticeProps = {
  tone: "neutral" | "error";
  icon: ReactNode;
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
