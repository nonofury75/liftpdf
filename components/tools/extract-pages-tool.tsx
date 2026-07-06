"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, FileCheck2, Loader2, RotateCcw, Scissors } from "lucide-react";
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

const outputFileName = "extracted-pages.pdf";

export function ExtractPagesTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PdfPageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
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

  const selectedPageSet = useMemo(() => new Set(selectedPages), [selectedPages]);

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
    setSelectedPages([]);
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
      setSelectedPdf(null);
      setSelectedPages([]);
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
    setSelectedPages(pages.map((page) => page.pageNumber));
  }, [clearGeneratedFile, pages]);

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
      return pages
        .map((page) => page.pageNumber)
        .filter((pageNumber) => !currentSet.has(pageNumber));
    });
  }, [clearGeneratedFile, pages]);

  async function handleExtractPages() {
    if (!selectedPdf) {
      setError("Please choose a PDF file before extracting pages.");
      return;
    }

    if (!selectedPages.length) {
      setError("Please select at least one page to extract.");
      return;
    }

    setError(null);
    setIsExporting(true);
    clearGeneratedFile();

    try {
      const { PDFDocument } = await import("pdf-lib");
      const sourcePdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const outputPdf = await PDFDocument.create();
      const pageIndexes = selectedPages
        .slice()
        .sort((a, b) => a - b)
        .map((pageNumber) => pageNumber - 1);
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
      setError("The selected pages could not be extracted. Please try another file.");
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
    setSelectedPages([]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, select the pages you need and download a new PDF."
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
                Select the pages to extract. LiftPDF keeps the original page
                order in the exported PDF.
              </p>
            </div>

            <PageSelectionToolbar
              selectedCount={selectedPages.length}
              totalPages={pages.length}
              onDeleteSelected={handleExtractPages}
              onSelectAll={handleSelectAll}
              onClear={handleClearSelection}
              onInvertSelection={handleInvertSelection}
              actionLabel="Extract Selected"
              ActionIcon={Scissors}
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <PageThumbnail
                  key={page.pageNumber}
                  page={page}
                  isSelected={selectedPageSet.has(page.pageNumber)}
                  onToggle={handleTogglePage}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Extract summary
        </h2>
        <div className="mt-5 space-y-3 text-sm">
          <PdfSummaryRow
            label="PDF file"
            value={selectedPdf ? selectedPdf.file.name : "None"}
          />
          <PdfSummaryRow
            label="Total pages"
            value={selectedPdf ? String(selectedPdf.pageCount) : "0"}
          />
          <PdfSummaryRow label="Selected" value={String(selectedPages.length)} />
          <PdfSummaryRow
            label="File size"
            value={selectedPdf ? formatFileSize(selectedPdf.file.size) : "-"}
          />
          <PdfSummaryRow label="Output" value={outputFileName} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            onClick={handleExtractPages}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Extract Selected
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
              onClick={() =>
                setError("Please select at least one page to extract.")
              }
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
            Your extracted PDF is ready. The download has started automatically.
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
