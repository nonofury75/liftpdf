"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Info,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
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
import { formatFileSize } from "@/components/tools/pdf/pdf-file-summary";

type SelectedPdf = {
  file: File;
  pageCount: number;
  previewUrl: string | null;
  previewWidth: number | null;
  previewHeight: number | null;
};

type CompressionResult = {
  url: string;
  fileName: string;
  originalSize: number;
  finalSize: number;
};

const compressedFileName = "compressed.pdf";

export function CompressPdfTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStep, setCompressionStep] = useState<string | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const resultRef = useRef<CompressionResult | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const analytics = useToolAnalytics({
    tool: "Compress PDF",
    route: "/compress-pdf",
  });

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  useEffect(() => {
    return () => {
      if (resultRef.current) {
        URL.revokeObjectURL(resultRef.current.url);
      }

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
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

    clearResult();
    clearPreview();
    setSelectedPdf(null);
    setError(null);
    setIsReadingPdf(true);

    try {
      const pdf = await loadPdfDocument(file);
      const firstPage = await renderPdfPageThumbnail(pdf, 1);

      previewUrlRef.current = firstPage.previewUrl;
      setSelectedPdf({
        file,
        pageCount: pdf.numPages,
        previewUrl: firstPage.previewUrl,
        previewWidth: firstPage.width,
        previewHeight: firstPage.height,
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
    }
  }

  async function handleCompress() {
    if (!selectedPdf) {
      setError("Please choose one PDF file before compressing.");
      analytics.trackError({ errorCode: "missing_file" });
      return;
    }

    setError(null);
    setIsCompressing(true);
    setCompressionStep("Preparing PDF...");
    clearResult();
    analytics.trackConversionStarted({
      mode: "basic",
      outputFormat: "pdf",
      pageCount: selectedPdf.pageCount,
    });

    try {
      const sourcePdf = await PDFDocument.load(
        await selectedPdf.file.arrayBuffer(),
        {
          updateMetadata: false,
        },
      );

      setCompressionStep("Rebuilding pages safely...");
      const compressedPdf = await PDFDocument.create();
      const copiedPages = await compressedPdf.copyPages(
        sourcePdf,
        sourcePdf.getPageIndices(),
      );

      copiedPages.forEach((page) => compressedPdf.addPage(page));
      applyMinimalMetadata(compressedPdf);

      setCompressionStep("Generating compressed PDF...");
      const compressedBytes = await compressedPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      const compressedBuffer = new ArrayBuffer(compressedBytes.byteLength);
      new Uint8Array(compressedBuffer).set(compressedBytes);
      const blob = new Blob([compressedBuffer], { type: "application/pdf" });

      setResult({
        url: URL.createObjectURL(blob),
        fileName: compressedFileName,
        originalSize: selectedPdf.file.size,
        finalSize: blob.size,
      });
      setCompressionStep("Compressed PDF created successfully.");
      analytics.trackConversionCompleted({
        mode: "basic",
        outputFormat: "pdf",
        pageCount: selectedPdf.pageCount,
        status: "success",
      });
    } catch {
      setError(
        "The PDF could not be compressed. If it is password protected, unlock it first and try again.",
      );
      analytics.trackError({ errorCode: "compression_failed" });
      setCompressionStep(null);
    } finally {
      setIsCompressing(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setError(null);
    setCompressionStep(null);
    clearResult();
    clearPreview();
  }

  function clearResult() {
    setResult((currentResult) => {
      if (currentResult) {
        URL.revokeObjectURL(currentResult.url);
      }

      return null;
    });
  }

  function clearPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }

  const reduction = result
    ? Math.max(
        0,
        Math.round(
          ((result.originalSize - result.finalSize) / result.originalSize) *
            100,
        ),
      )
    : 0;
  const isSmaller = result ? result.finalSize < result.originalSize : false;
  const isBusy = isReadingPdf || isCompressing;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file and rebuild it with safe client-side compression."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        <div aria-live="polite" className="space-y-3">
          {isReadingPdf ? (
            <StatusNotice
              tone="neutral"
              icon={<Loader2 className="size-4 animate-spin" />}
              message="Reading PDF and preparing preview..."
            />
          ) : null}

          {error ? (
            <StatusNotice tone="error" icon={<Info className="size-4" />} message={error} />
          ) : null}
        </div>

        {selectedPdf ? <PdfPreviewPanel selectedPdf={selectedPdf} /> : null}

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Compression mode
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                LiftPDF uses one safe browser compression mode. It rebuilds the
                PDF, keeps every page and avoids destructive image quality loss.
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Basic
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <CompressionFact
              title="Preserves pages"
              text="All pages are copied into a clean PDF."
            />
            <CompressionFact
              title="Private"
              text="Your PDF stays in this browser."
            />
            <CompressionFact
              title="No fake levels"
              text="No low, balanced or max labels unless the engine truly changes output."
            />
          </div>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            This first version does not downsample images or recompress scanned
            PDFs. Image-heavy files may need a future advanced compression
            engine for larger reductions.
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-md xl:sticky xl:top-24">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <FileCheck2 className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Compress PDF
            </h2>
            <p className="text-sm text-muted-foreground">
              Safe browser optimization
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Private by design
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your PDF is compressed locally in your browser. No upload, no
            account and no server storage.
          </p>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <SummaryRow
            label="PDF file"
            value={selectedPdf ? selectedPdf.file.name : "None"}
          />
          <SummaryRow
            label="Pages"
            value={selectedPdf ? String(selectedPdf.pageCount) : "0"}
          />
          <SummaryRow
            label="Original size"
            value={selectedPdf ? formatFileSize(selectedPdf.file.size) : "-"}
          />
          <SummaryRow
            label="Final size"
            value={result ? formatFileSize(result.finalSize) : "-"}
          />
          <SummaryRow label="Reduced" value={result ? `${reduction}%` : "-"} />
          <SummaryRow label="Output" value={compressedFileName} />
        </div>

        {compressionStep ? (
          <p
            aria-live="polite"
            className="mt-5 rounded-xl bg-muted px-3 py-2 text-sm font-medium text-muted-foreground"
          >
            {compressionStep}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            onClick={handleCompress}
            disabled={isBusy}
            className="shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {isCompressing ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {isCompressing ? "Compressing..." : "Compress PDF"}
          </Button>

          {result ? (
            <Button asChild variant="outline">
              <a
                href={result.url}
                download={result.fileName}
                onClick={() => {
                  analytics.trackDownloadStarted({ outputFormat: "pdf" });
                  analytics.trackDownloadCompleted({ outputFormat: "pdf" });
                }}
              >
                <Download className="size-4" aria-hidden="true" />
                Download compressed PDF
              </a>
            </Button>
          ) : null}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            {result ? "Compress another PDF" : "Start over"}
          </Button>
        </div>

        {result ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-800">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Compressed PDF created successfully
              </span>
            </div>
            {!isSmaller ? (
              <p className="rounded-xl bg-muted px-3 py-3 text-sm font-medium text-muted-foreground">
                This PDF is already optimized. We rebuilt it with safe
                compression.
              </p>
            ) : null}
          </div>
        ) : null}
      </aside>
    </div>
  );
}

type PdfPreviewPanelProps = {
  selectedPdf: SelectedPdf;
};

function PdfPreviewPanel({ selectedPdf }: PdfPreviewPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            PDF preview
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            First page preview, file details and current document size.
          </p>
        </div>
        <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {selectedPdf.pageCount} {selectedPdf.pageCount === 1 ? "page" : "pages"}
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(220px,360px)_1fr]">
        <div className="grid min-h-72 place-items-center rounded-2xl border border-border bg-slate-100 p-5">
          {selectedPdf.previewUrl ? (
            <Image
              src={selectedPdf.previewUrl}
              alt={`First page preview for ${selectedPdf.file.name}`}
              width={selectedPdf.previewWidth ?? 320}
              height={selectedPdf.previewHeight ?? 420}
              unoptimized
              className="max-h-[420px] w-auto rounded-md bg-white object-contain shadow-xl ring-1 ring-black/10"
            />
          ) : (
            <div className="grid size-28 place-items-center rounded-xl border border-border bg-card text-primary">
              <FileText className="size-10" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="min-w-0 rounded-2xl border border-border bg-muted/30 p-4">
          <p className="truncate text-base font-semibold text-foreground">
            {selectedPdf.file.name}
          </p>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <InfoTile label="File size" value={formatFileSize(selectedPdf.file.size)} />
            <InfoTile label="Pages" value={String(selectedPdf.pageCount)} />
            <InfoTile
              label="First page"
              value={
                selectedPdf.previewWidth && selectedPdf.previewHeight
                  ? `${selectedPdf.previewWidth} x ${selectedPdf.previewHeight} pt`
                  : "Preview ready"
              }
            />
            <InfoTile label="Output" value={compressedFileName} />
          </div>
        </div>
      </div>
    </section>
  );
}

type InfoTileProps = {
  label: string;
  value: string;
};

function InfoTile({ label, value }: InfoTileProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

type CompressionFactProps = {
  title: string;
  text: string;
};

function CompressionFact({ title, text }: CompressionFactProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
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
    >
      {icon}
      {message}
    </p>
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
      <span className="max-w-44 truncate text-right font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function applyMinimalMetadata(pdf: PDFDocument) {
  pdf.setTitle("");
  pdf.setAuthor("");
  pdf.setSubject("");
  pdf.setKeywords([]);
  pdf.setProducer("LiftPDF");
  pdf.setCreator("LiftPDF");
  pdf.setCreationDate(new Date(0));
  pdf.setModificationDate(new Date(0));
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}
