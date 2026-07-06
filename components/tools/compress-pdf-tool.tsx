"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  FileCheck2,
  FileText,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";

type SelectedPdf = {
  file: File;
  pageCount: number;
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
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const resultRef = useRef<CompressionResult | null>(null);

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  useEffect(() => {
    return () => {
      if (resultRef.current) {
        URL.revokeObjectURL(resultRef.current.url);
      }
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

    clearResult();
    setError(null);

    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      setSelectedPdf({
        file,
        pageCount: pdf.getPageCount(),
      });
    } catch {
      setSelectedPdf(null);
      setError("This PDF could not be read. Please choose another file.");
    }
  }

  async function handleCompress() {
    if (!selectedPdf) {
      setError("Please choose one PDF file before compressing.");
      return;
    }

    setError(null);
    setIsCompressing(true);
    clearResult();

    try {
      const sourcePdf = await PDFDocument.load(
        await selectedPdf.file.arrayBuffer(),
        {
          updateMetadata: false,
        },
      );
      const compressedPdf = await PDFDocument.create();
      const copiedPages = await compressedPdf.copyPages(
        sourcePdf,
        sourcePdf.getPageIndices(),
      );

      copiedPages.forEach((page) => compressedPdf.addPage(page));
      applyMinimalMetadata(compressedPdf);

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
    } catch {
      setError("The PDF could not be compressed. Please try another file.");
    } finally {
      setIsCompressing(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setError(null);
    clearResult();
  }

  function clearResult() {
    setResult((currentResult) => {
      if (currentResult) {
        URL.revokeObjectURL(currentResult.url);
      }

      return null;
    });
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

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file and rebuild it with safe client-side compression."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {selectedPdf ? (
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="grid gap-4 sm:grid-cols-[48px_1fr]">
              <div className="grid size-12 place-items-center rounded-md border border-border bg-muted text-primary">
                <FileText className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {selectedPdf.file.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatFileSize(selectedPdf.file.size)} ·{" "}
                  {selectedPdf.pageCount}{" "}
                  {selectedPdf.pageCount === 1 ? "page" : "pages"}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Compression options
          </h2>
          <div className="mt-5 rounded-lg border border-primary bg-primary/5 p-4">
            <p className="text-sm font-semibold text-foreground">
              Basic compression
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Rebuilds the PDF safely, copies all pages and minimizes document
              metadata where possible.
            </p>
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Compression summary
        </h2>
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
            value={result ? formatFileSize(result.originalSize) : "-"}
          />
          <SummaryRow
            label="Final size"
            value={result ? formatFileSize(result.finalSize) : "-"}
          />
          <SummaryRow label="Reduced" value={result ? `${reduction}%` : "-"} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            onClick={handleCompress}
            disabled={isCompressing}
          >
            {isCompressing ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Compress PDF
          </Button>

          {result ? (
            <Button asChild variant="outline">
              <a href={result.url} download={result.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download compressed PDF
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Compress your PDF before downloading.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download compressed PDF
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Start over
          </Button>
        </div>

        {result ? (
          <div className="mt-4 space-y-3">
            <p className="rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
              Your compressed PDF is ready to download.
            </p>
            {!isSmaller ? (
              <p className="rounded-md bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
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

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-40 truncate font-semibold text-foreground">
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
