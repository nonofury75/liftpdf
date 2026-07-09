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
  Scissors,
  ShieldCheck,
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

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

const outputFileName = "pages-extracted.pdf";

export function ExtractPagesTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PdfPageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
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
      await pdf.destroy();
    } catch {
      clearPagePreviews();
      setSelectedPdf(null);
      setSelectedPages([]);
      setError(
        "This PDF could not be read. If it is password protected, unlock it first and try again.",
      );
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
    setSelectedPages(pages.map((page) => page.pageNumber));
  }, [clearGeneratedFile, pages]);

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
    setProgress("Preparing PDF...");
    clearGeneratedFile();

    try {
      const { PDFDocument } = await import("pdf-lib");
      const sourcePdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const outputPdf = await PDFDocument.create();
      const pageIndexes = selectedPages
        .slice()
        .sort((a, b) => a - b)
        .map((pageNumber) => pageNumber - 1);
      setProgress("Extracting pages...");
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
      setProgress("Pages extracted successfully.");
      triggerDownload(nextFile.url, nextFile.fileName);
    } catch {
      setError(
        "The selected pages could not be extracted. If the PDF is password protected, unlock it first and try again.",
      );
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
    setSelectedPages([]);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, select the pages you need and download a new PDF."
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

            <div className="mt-5 grid max-h-[780px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <ExtractPageCard
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

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-md xl:sticky xl:top-24">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Scissors className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Extract Pages
            </h2>
            <p className="text-sm text-muted-foreground">
              Save selected pages
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Private by design
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Page extraction happens locally in this browser. Your PDF is never
            uploaded to a server.
          </p>
        </div>

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
            label="Output pages"
            value={String(selectedPages.length)}
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
            onClick={handleExtractPages}
            disabled={!selectedPdf || isExporting}
            className="h-12 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-md"
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {isExporting ? "Generating PDF..." : "Extract Selected"}
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
            {generatedFile ? "Extract pages from another PDF" : "Start over"}
          </Button>
        </div>

        {generatedFile ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-800">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Pages extracted successfully
            </span>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

type ExtractPageCardProps = {
  page: PdfPageThumbnail;
  isSelected: boolean;
  onToggle: (pageNumber: number) => void;
};

function ExtractPageCard({ page, isSelected, onToggle }: ExtractPageCardProps) {
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

      <div className="mt-3">
        <p className="text-sm font-semibold text-foreground">
          Page {page.pageNumber}
        </p>
        <p className="mt-1 text-xs font-medium text-muted-foreground">
          {page.width} x {page.height} pt
        </p>
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
