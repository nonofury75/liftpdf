"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  FileCheck2,
  Info,
  Loader2,
  RotateCcw,
  RotateCcwSquare,
  RotateCwSquare,
  ShieldCheck,
} from "lucide-react";
import { degrees, PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import {
  formatFileSize,
  PdfFileSummary,
} from "@/components/tools/pdf/pdf-file-summary";
import {
  loadPdfDocument,
  renderPdfPagePreview,
} from "@/components/tools/pdf/pdfjs-client";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type PagePreview = {
  pageNumber: number;
  previewUrl: string;
  rotation: number;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

const rotatedFileName = "rotated.pdf";

export function RotatePdfTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(
    null,
  );
  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const pagesRef = useRef<PagePreview[]>([]);

  const rotatedPagesCount = useMemo(
    () => pages.filter((page) => page.rotation !== 0).length,
    [pages],
  );
  const rotationSummary = useMemo(() => {
    if (!pages.length) {
      return "None";
    }

    if (rotatedPagesCount === 0) {
      return "No page rotated";
    }

    if (rotatedPagesCount === pages.length) {
      return "All pages";
    }

    return `${rotatedPagesCount} selected`;
  }, [pages, rotatedPagesCount]);

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
    setSelectedPdf(null);
    setProgress(null);
    setError(null);
    setIsLoadingPreview(true);

    try {
      const pdf = await loadPdfDocument(file);
      const previews: PagePreview[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        previews.push({
          pageNumber,
          previewUrl: await renderPdfPagePreview(pdf, pageNumber),
          rotation: 0,
        });
      }

      setSelectedPdf({
        file,
        pageCount: pdf.numPages,
      });
      setPages(previews);
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

  function rotatePage(pageNumber: number, degreesToAdd: number) {
    clearGeneratedFile();
    setProgress(null);
    setPages((currentPages) =>
      currentPages.map((page) =>
        page.pageNumber === pageNumber
          ? {
              ...page,
              rotation: normalizeRotation(page.rotation + degreesToAdd),
            }
          : page,
      ),
    );
  }

  function rotateAll(degreesToAdd: number) {
    clearGeneratedFile();
    setProgress(null);
    setPages((currentPages) =>
      currentPages.map((page) => ({
        ...page,
        rotation: normalizeRotation(page.rotation + degreesToAdd),
      })),
    );
  }

  function resetRotations() {
    clearGeneratedFile();
    setProgress(null);
    setPages((currentPages) =>
      currentPages.map((page) => ({
        ...page,
        rotation: 0,
      })),
    );
  }

  async function handleRotatePdf() {
    if (!selectedPdf) {
      setError("Please choose one PDF file before rotating.");
      return;
    }

    setError(null);
    setIsRotating(true);
    setProgress("Preparing PDF...");
    clearGeneratedFile();

    try {
      const pdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const pdfPages = pdf.getPages();

      setProgress("Applying page rotations...");
      pages.forEach((pagePreview, index) => {
        const page = pdfPages[index];

        if (!page) {
          return;
        }

        const existingRotation = page.getRotation().angle;
        page.setRotation(
          degrees(normalizeRotation(existingRotation + pagePreview.rotation)),
        );
      });

      setProgress("Generating rotated PDF...");
      const rotatedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      const buffer = new ArrayBuffer(rotatedBytes.byteLength);
      new Uint8Array(buffer).set(rotatedBytes);
      const blob = new Blob([buffer], { type: "application/pdf" });

      setGeneratedFile({
        url: URL.createObjectURL(blob),
        fileName: rotatedFileName,
      });
      setProgress("Rotated PDF created successfully.");
    } catch {
      setError(
        "The PDF could not be rotated. If it is password protected, unlock it first and try again.",
      );
      setProgress(null);
    } finally {
      setIsRotating(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
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

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, preview every page and rotate pages before downloading."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        <div aria-live="polite" className="space-y-3">
          {error ? (
            <StatusNotice tone="error" icon={<Info className="size-4" />} message={error} />
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
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Page preview
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Rotate individual pages or apply the same turn to every page.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => rotateAll(-90)}
                  className="transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <RotateCcwSquare className="size-4" aria-hidden="true" />
                  Rotate all left
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => rotateAll(90)}
                  className="transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <RotateCwSquare className="size-4" aria-hidden="true" />
                  Rotate all right
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetRotations}
                  className="transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Reset rotations
                </Button>
              </div>
            </div>

            <div className="mt-5 grid max-h-[760px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <article
                  key={page.pageNumber}
                  className="rounded-2xl border border-border bg-background p-3 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                >
                  <div className="flex min-h-60 items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-4 shadow-inner">
                    <div
                      className="transition-transform duration-[180ms] ease-out"
                      style={{
                        transform: `rotate(${page.rotation}deg)`,
                      }}
                    >
                      <Image
                        src={page.previewUrl}
                        alt={`Page ${page.pageNumber}`}
                        width={180}
                        height={250}
                        className="h-auto max-h-60 w-auto rounded-sm bg-white shadow-lg ring-1 ring-black/10"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      Page {page.pageNumber}
                    </p>
                    <p className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                      {page.rotation} deg
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label={`Rotate page ${page.pageNumber} left`}
                      onClick={() => rotatePage(page.pageNumber, -90)}
                    >
                      <RotateCcwSquare className="size-4" aria-hidden="true" />
                      Left
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label={`Rotate page ${page.pageNumber} right`}
                      onClick={() => rotatePage(page.pageNumber, 90)}
                    >
                      <RotateCwSquare className="size-4" aria-hidden="true" />
                      Right
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-md xl:sticky xl:top-24">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <RotateCwSquare className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Rotate PDF
            </h2>
            <p className="text-sm text-muted-foreground">
              Turn pages left or right
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Private by design
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your pages are previewed and rotated locally in this browser. No
            upload to a server.
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
            label="Rotated pages"
            value={rotationSummary}
          />
          <PdfSummaryRow
            label="File size"
            value={selectedPdf ? formatFileSize(selectedPdf.file.size) : "-"}
          />
          <PdfSummaryRow label="Output" value={rotatedFileName} />
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
            onClick={handleRotatePdf}
            disabled={!selectedPdf || isRotating}
            className="h-12 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-md"
          >
            {isRotating ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {isRotating ? "Rotating..." : "Rotate PDF"}
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a
                href={generatedFile.url}
                download={generatedFile.fileName}
                aria-label="Download rotated PDF"
              >
                <Download className="size-4" aria-hidden="true" />
                Download PDF
              </a>
            </Button>
          ) : null}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            {generatedFile ? "Rotate another PDF" : "Reset"}
          </Button>
        </div>

        {generatedFile ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-800">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Rotated PDF created successfully
            </span>
          </div>
        ) : null}
      </aside>
    </div>
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
    >
      {icon}
      {message}
    </p>
  );
}

function normalizeRotation(rotation: number) {
  return ((rotation % 360) + 360) % 360;
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}
