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
import {
  summarizeFilesForAnalytics,
  useToolAnalytics,
} from "@/hooks/use-tool-analytics";
import { parsePageRangeInput } from "@/lib/page-ranges";

type TargetMode = "all" | "selected" | "odd" | "even" | "range";

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
const targetModeOptions: Array<{ label: string; value: TargetMode }> = [
  { label: "All pages", value: "all" },
  { label: "Selected pages", value: "selected" },
  { label: "Odd pages", value: "odd" },
  { label: "Even pages", value: "even" },
  { label: "Page range", value: "range" },
];

export function RotatePdfTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState<TargetMode>("all");
  const [selectedPageNumbers, setSelectedPageNumbers] = useState<number[]>([]);
  const [rangeInput, setRangeInput] = useState("");
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(
    null,
  );
  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const pagesRef = useRef<PagePreview[]>([]);
  const analytics = useToolAnalytics({
    tool: "Rotate PDF",
    route: "/rotate-pdf",
  });

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
  const rangeInputError = useMemo(() => {
    if (!selectedPdf || targetMode !== "range" || !rangeInput.trim()) {
      return null;
    }

    try {
      parsePageRangeInput(rangeInput, selectedPdf.pageCount);
      return null;
    } catch (validationError) {
      return validationError instanceof Error
        ? validationError.message
        : "Enter page numbers or ranges separated by commas.";
    }
  }, [rangeInput, selectedPdf, targetMode]);
  const targetedPageNumbers = useMemo(() => {
    if (!selectedPdf) {
      return [];
    }

    if (targetMode === "all") {
      return pages.map((page) => page.pageNumber);
    }

    if (targetMode === "selected") {
      return selectedPageNumbers
        .filter((pageNumber) => pageNumber >= 1 && pageNumber <= selectedPdf.pageCount)
        .sort((a, b) => a - b);
    }

    if (targetMode === "odd") {
      return pages
        .map((page) => page.pageNumber)
        .filter((pageNumber) => pageNumber % 2 === 1);
    }

    if (targetMode === "even") {
      return pages
        .map((page) => page.pageNumber)
        .filter((pageNumber) => pageNumber % 2 === 0);
    }

    if (!rangeInput.trim()) {
      return [];
    }

    try {
      return parsePageRangeInput(rangeInput, selectedPdf.pageCount);
    } catch {
      return [];
    }
  }, [pages, rangeInput, selectedPageNumbers, selectedPdf, targetMode]);
  const targetedPageSet = useMemo(
    () => new Set(targetedPageNumbers),
    [targetedPageNumbers],
  );
  const canApplyTargetedRotation =
    Boolean(selectedPdf) && targetedPageNumbers.length > 0 && !rangeInputError;
  const targetSummary = useMemo(() => {
    if (!selectedPdf) {
      return "0";
    }

    if (targetedPageNumbers.length === 0) {
      return "0";
    }

    if (targetedPageNumbers.length === selectedPdf.pageCount) {
      return `All ${selectedPdf.pageCount}`;
    }

    return String(targetedPageNumbers.length);
  }, [selectedPdf, targetedPageNumbers.length]);

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
    clearPagePreviews();
    setSelectedPageNumbers([]);
    setTargetMode("all");
    setRangeInput("");
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
      analytics.trackUploadCompleted({
        ...summarizeFilesForAnalytics([file]),
        pageCount: pdf.numPages,
        outputFormat: "pdf",
      });
      await pdf.destroy();
    } catch {
      clearPagePreviews();
      setSelectedPdf(null);
      setError(
        "This PDF could not be read. If it is password protected, unlock it first and try again.",
      );
      analytics.trackError({ errorCode: "pdf_read_failed" });
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

  function rotatePages(pageNumbers: number[], degreesToAdd: number) {
    clearGeneratedFile();
    setProgress(null);
    setError(null);
    const pageNumberSet = new Set(pageNumbers);
    setPages((currentPages) =>
      currentPages.map((page) =>
        pageNumberSet.has(page.pageNumber)
          ? {
              ...page,
              rotation: normalizeRotation(page.rotation + degreesToAdd),
            }
          : page,
      ),
    );
  }

  function rotateTargetedPages(degreesToAdd: number) {
    if (!canApplyTargetedRotation) {
      setError("Choose at least one target page before rotating.");
      analytics.trackError({ errorCode: "no_target_pages" });
      return;
    }

    rotatePages(targetedPageNumbers, degreesToAdd);
  }

  function toggleSelectedPage(pageNumber: number) {
    clearGeneratedFile();
    setProgress(null);
    setError(null);
    setSelectedPageNumbers((currentPages) =>
      currentPages.includes(pageNumber)
        ? currentPages.filter((currentPage) => currentPage !== pageNumber)
        : [...currentPages, pageNumber].sort((a, b) => a - b),
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
      analytics.trackError({ errorCode: "missing_file" });
      return;
    }

    setError(null);
    setIsRotating(true);
    setProgress("Preparing PDF...");
    clearGeneratedFile();
    const analyticsMode = `${targetMode}_${targetedPageNumbers.length}_targeted`;
    analytics.trackConversionStarted({
      mode: analyticsMode,
      pageCount: selectedPdf.pageCount,
      outputFormat: "pdf",
    });

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
      analytics.trackConversionCompleted({
        mode: analyticsMode,
        pageCount: selectedPdf.pageCount,
        outputFormat: "pdf",
        status: "success",
      });
    } catch {
      setError(
        "The PDF could not be rotated. If it is password protected, unlock it first and try again.",
      );
      analytics.trackError({ errorCode: "rotate_failed" });
      setProgress(null);
    } finally {
      setIsRotating(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setError(null);
    setProgress(null);
    setTargetMode("all");
    setSelectedPageNumbers([]);
    setRangeInput("");
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
                  Choose which pages are targeted, then apply a rotation.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => rotateTargetedPages(-90)}
                  disabled={!canApplyTargetedRotation}
                  className="transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <RotateCcwSquare className="size-4" aria-hidden="true" />
                  Rotate left 90 deg
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => rotateTargetedPages(90)}
                  disabled={!canApplyTargetedRotation}
                  className="transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <RotateCwSquare className="size-4" aria-hidden="true" />
                  Rotate right 90 deg
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => rotateTargetedPages(180)}
                  disabled={!canApplyTargetedRotation}
                  className="transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <RotateCwSquare className="size-4" aria-hidden="true" />
                  Rotate 180 deg
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

            <div className="mt-5 rounded-2xl border border-border bg-muted/25 p-4">
              <h3 className="text-sm font-semibold text-foreground">
                Pages to rotate
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {targetModeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={targetMode === option.value}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition hover:border-primary/50 ${
                      targetMode === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-foreground"
                    }`}
                    onClick={() => {
                      setTargetMode(option.value);
                      setError(null);
                      setProgress(null);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {targetMode === "range" ? (
                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-foreground">
                    Page range
                  </span>
                  <input
                    value={rangeInput}
                    onChange={(event) => {
                      setRangeInput(event.target.value);
                      setError(null);
                      setProgress(null);
                      clearGeneratedFile();
                    }}
                    placeholder="1-3, 6, 9-12"
                    className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                  <span className="mt-2 block text-xs font-medium text-muted-foreground">
                    Enter page numbers or ranges separated by commas.
                  </span>
                  {rangeInputError ? (
                    <span className="mt-2 block rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                      {rangeInputError}
                    </span>
                  ) : null}
                </label>
              ) : null}

              {targetMode === "selected" ? (
                <p className="mt-3 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground">
                  Select pages in the preview below, then apply a rotation.
                </p>
              ) : null}

              <p className="mt-3 text-sm font-medium text-muted-foreground">
                Targeted pages: {targetSummary}
              </p>
            </div>

            <div className="mt-5 grid max-h-[760px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => {
                const isTargeted = targetedPageSet.has(page.pageNumber);
                const isSelected = selectedPageNumbers.includes(page.pageNumber);

                return (
                <article
                  key={page.pageNumber}
                  className={`rounded-2xl border bg-background p-3 shadow-sm transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md ${
                    isTargeted
                      ? "border-primary ring-2 ring-primary/15"
                      : "border-border"
                  }`}
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
                    <div className="flex flex-wrap justify-end gap-1">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                        {page.rotation} deg
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          isTargeted
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isTargeted ? "Targeted" : "Not targeted"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {targetMode === "selected" ? (
                      <Button
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        aria-pressed={isSelected}
                        aria-label={`${isSelected ? "Unselect" : "Select"} page ${page.pageNumber}`}
                        onClick={() => toggleSelectedPage(page.pageNumber)}
                        className="col-span-2"
                      >
                        {isSelected ? "Selected" : "Select page"}
                      </Button>
                    ) : null}
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
                );
              })}
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
            label="Target mode"
            value={getTargetModeLabel(targetMode)}
          />
          <PdfSummaryRow
            label="Targeted pages"
            value={targetSummary}
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

function getTargetModeLabel(mode: TargetMode) {
  return targetModeOptions.find((option) => option.value === mode)?.label ?? mode;
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}
