"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileCheck2,
  GripVertical,
  Loader2,
  RotateCcw,
} from "lucide-react";
import {
  type DragEvent,
  memo,
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

const outputFileName = "reordered.pdf";

export function ReorderPagesTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PdfPageThumbnail[]>([]);
  const [draggedPageNumber, setDraggedPageNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
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
      setError("This PDF could not be read. Please choose another file.");
    } finally {
      setIsLoadingPreview(false);
    }
  }

  const movePage = useCallback(
    (pageNumber: number, direction: -1 | 1) => {
      clearGeneratedFile();
      setError(null);
      setStatus(null);
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
    clearGeneratedFile();

    try {
      const { PDFDocument } = await import("pdf-lib");
      const sourcePdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const outputPdf = await PDFDocument.create();
      const pageIndexes = pages.map((page) => page.pageNumber - 1);
      const copiedPages = await outputPdf.copyPages(sourcePdf, pageIndexes);

      copiedPages.forEach((page) => outputPdf.addPage(page));

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
      triggerDownload(nextFile.url, nextFile.fileName);
    } catch {
      setError("The PDF could not be reordered. Please try another file.");
    } finally {
      setIsExporting(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setError(null);
    setStatus(null);
    setDraggedPageNumber(null);
    setIsLoadingPreview(false);
    setIsExporting(false);
    clearGeneratedFile();
    clearPagePreviews();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, drag pages into a new order and download a reordered PDF."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        {error ? (
          <p
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {status ? (
          <p
            className="rounded-md bg-muted px-4 py-3 text-sm font-medium text-muted-foreground"
            aria-live="polite"
          >
            {status}
          </p>
        ) : null}

        {selectedPdf ? (
          <PdfFileSummary
            fileName={selectedPdf.file.name}
            fileSize={selectedPdf.file.size}
            pageCount={selectedPdf.pageCount}
          />
        ) : null}

        {isLoadingPreview ? (
          <p className="rounded-md bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
            Loading PDF preview...
          </p>
        ) : null}

        {pages.length ? (
          <div className="rounded-lg border border-border bg-card p-5">
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Reorder summary
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
            label="Order changed"
            value={hasOrderChanged ? "Yes" : "No"}
          />
          <PdfSummaryRow
            label="File size"
            value={selectedPdf ? formatFileSize(selectedPdf.file.size) : "-"}
          />
          <PdfSummaryRow label="Output" value={outputFileName} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button type="button" onClick={handleExportPdf} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Reorder PDF
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a href={generatedFile.url} download={generatedFile.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download PDF
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Reorder or export your PDF first.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download PDF
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {generatedFile ? (
          <p
            className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
            aria-live="polite"
          >
            Your reordered PDF is ready. The download has started automatically.
          </p>
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
        "rounded-lg border border-border bg-background p-3 transition-colors",
        isDragging && "border-primary opacity-70 ring-2 ring-primary/20",
      )}
      aria-label={`Original page ${page.pageNumber}, position ${position}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          <GripVertical className="size-3.5 text-primary" aria-hidden="true" />
          Drag
        </span>
        <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          Position {position}
        </span>
      </div>

      <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-md bg-muted p-3">
        <Image
          src={page.previewUrl}
          alt={`Preview of original page ${page.pageNumber}`}
          width={160}
          height={220}
          className="h-auto max-h-52 w-auto rounded-sm bg-white shadow-sm"
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
