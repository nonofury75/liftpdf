"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, FileCheck2, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import {
  formatFileSize,
  PdfFileSummary,
} from "@/components/tools/pdf/pdf-file-summary";
import { PageSelectionToolbar } from "@/components/tools/pdf/page-selection-toolbar";
import {
  PageThumbnail,
  type PdfPageThumbnail,
} from "@/components/tools/pdf/page-thumbnail";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";
import {
  loadPdfDocument,
  renderPdfPageThumbnail,
} from "@/components/tools/pdf/pdfjs-client";

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

const outputFileName = "deleted-pages.pdf";

export function DeletePagesTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PdfPageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [deletedPages, setDeletedPages] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
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
    resetSelectionState();
    setSelectedPdf(null);
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
      await pdf.destroy();
    } catch {
      clearPagePreviews();
      resetSelectionState();
      setSelectedPdf(null);
      setError("This PDF could not be read. Please choose another file.");
    } finally {
      setIsLoadingPreview(false);
    }
  }

  const handleTogglePage = useCallback(
    (pageNumber: number) => {
      clearGeneratedFile();
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
    setError(null);
    setSelectedPages(visiblePages.map((page) => page.pageNumber));
  }, [clearGeneratedFile, visiblePages]);

  const handleClearSelection = useCallback(() => {
    clearGeneratedFile();
    setError(null);
    setSelectedPages([]);
  }, [clearGeneratedFile]);

  const handleInvertSelection = useCallback(() => {
    clearGeneratedFile();
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
      return;
    }

    if (!deletedPages.length) {
      setError("Delete at least one page before downloading.");
      return;
    }

    if (remainingPageCount < 1) {
      setError("A PDF must contain at least one page.");
      return;
    }

    setError(null);
    setIsExporting(true);
    clearGeneratedFile();

    try {
      const { PDFDocument } = await import("pdf-lib");
      const sourcePdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const outputPdf = await PDFDocument.create();
      const deletedSet = new Set(deletedPages);

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
        return;
      }

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
      setError("The PDF could not be exported. Please try another file.");
    } finally {
      setIsExporting(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setError(null);
    setIsLoadingPreview(false);
    setIsExporting(false);
    clearGeneratedFile();
    clearPagePreviews();
    resetSelectionState();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, select pages to remove and download a new PDF."
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

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePages.map((page) => (
                <PageThumbnail
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

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Delete summary
        </h2>
        <div className="mt-5 space-y-3 text-sm">
          <PdfSummaryRow
            label="PDF file"
            value={selectedPdf ? selectedPdf.file.name : "None"}
          />
          <PdfSummaryRow
            label="Original pages"
            value={selectedPdf ? String(selectedPdf.pageCount) : "0"}
          />
          <PdfSummaryRow label="Deleted" value={String(deletedPages.length)} />
          <PdfSummaryRow label="Remaining" value={String(remainingPageCount)} />
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
            Delete Pages
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
              onClick={() => setError("Delete pages before downloading.")}
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
          <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            <Trash2 className="mr-2 inline size-4" aria-hidden="true" />
            Your PDF is ready. The download has started automatically.
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

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
