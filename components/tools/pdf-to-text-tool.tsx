"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Clipboard,
  Download,
  FileCheck2,
  FileText,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import {
  formatFileSize,
  PdfFileSummary,
} from "@/components/tools/pdf/pdf-file-summary";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";
import { extractPdfText, loadPdfDocument } from "@/components/tools/pdf/pdfjs-client";
import { hasPdfEncryptionDictionary } from "@/components/tools/pdf/qpdf-client";
import {
  summarizeFilesForAnalytics,
  useToolAnalytics,
} from "@/hooks/use-tool-analytics";
import { cn } from "@/lib/utils";

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

const outputFileName = "extracted-text.txt";
const noTextMessage =
  "No selectable text was found. This PDF may be scanned or image-based. OCR is required.";

export function PdfToTextTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [processedPages, setProcessedPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(null);

  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const analytics = useToolAnalytics({
    tool: "PDF to Text",
    route: "/pdf-to-text",
  });

  useEffect(() => {
    generatedFileRef.current = generatedFile;
  }, [generatedFile]);

  useEffect(() => {
    return () => {
      if (generatedFileRef.current) {
        URL.revokeObjectURL(generatedFileRef.current.url);
      }
    };
  }, []);

  const characterCount = extractedText.length;
  const wordCount = useMemo(() => countWords(extractedText), [extractedText]);
  const extractionState = getExtractionState({
    selectedPdf,
    isReadingPdf,
    isExtracting,
    extractedText,
  });

  function clearGeneratedFile() {
    setGeneratedFile((currentFile) => {
      if (currentFile) {
        URL.revokeObjectURL(currentFile.url);
      }

      return null;
    });
  }

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
    setSelectedPdf(null);
    setExtractedText("");
    setProcessedPages(0);
    setStatusMessage(null);
    setError(null);
    setIsReadingPdf(true);

    try {
      const fileBytes = new Uint8Array(await file.arrayBuffer());

      if (hasPdfEncryptionDictionary(fileBytes)) {
        setError(
          "This PDF is password protected. Please unlock it first using Unlock PDF.",
        );
        analytics.trackError({ errorCode: "password_protected" });
        return;
      }

      const pdf = await loadPdfDocument(file);
      setSelectedPdf({ file, pageCount: pdf.numPages });
      analytics.trackUploadCompleted({
        ...summarizeFilesForAnalytics([file]),
        pageCount: pdf.numPages,
        outputFormat: "txt",
      });
      await pdf.destroy();
    } catch {
      setError("This PDF could not be read. Please choose another file.");
      analytics.trackError({ errorCode: "pdf_read_failed" });
    } finally {
      setIsReadingPdf(false);
    }
  }

  async function handleExtractText() {
    if (!selectedPdf) {
      setError("Please choose a PDF file before extracting text.");
      analytics.trackError({ errorCode: "missing_file" });
      return;
    }

    clearGeneratedFile();
    setExtractedText("");
    setProcessedPages(0);
    setError(null);
    setStatusMessage("Preparing PDF...");
    setIsExtracting(true);
    analytics.trackConversionStarted({
      mode: "extract_text",
      outputFormat: "txt",
      pageCount: selectedPdf.pageCount,
    });

    let pdfDocument: Awaited<ReturnType<typeof loadPdfDocument>> | null = null;

    try {
      pdfDocument = await loadPdfDocument(selectedPdf.file);
      const pages = await extractPdfText(pdfDocument, (pageNumber) => {
        setProcessedPages(pageNumber);
        setStatusMessage(
          `Extracting text page ${pageNumber} of ${selectedPdf.pageCount}...`,
        );
      });
      const text = pages
        .map((page) => `Page ${page.pageNumber}\n\n${page.text}`)
        .join("\n\n");
      const hasSelectableText = pages.some((page) => page.text.length > 0);

      if (!hasSelectableText) {
        setError(noTextMessage);
        setExtractedText("");
        analytics.trackError({ errorCode: "no_selectable_text" });
        return;
      }

      setExtractedText(text);
      setStatusMessage("Generating TXT...");

      const nextFile = createTextDownload(text);
      setGeneratedFile(nextFile);
      analytics.trackConversionCompleted({
        mode: "extract_text",
        outputFormat: "txt",
        pageCount: selectedPdf.pageCount,
        status: "success",
      });
      analytics.trackDownloadStarted({ outputFormat: "txt" });
      triggerDownload(nextFile.url, nextFile.fileName);
      analytics.trackDownloadCompleted({ outputFormat: "txt" });
      setStatusMessage("Text extracted successfully.");
    } catch {
      setError("The text could not be extracted. Please try another PDF file.");
      analytics.trackError({ errorCode: "text_extraction_failed" });
    } finally {
      await pdfDocument?.destroy();
      setIsExtracting(false);
    }
  }

  async function handleCopyText() {
    if (!extractedText) {
      setError("Extract text before copying.");
      return;
    }

    try {
      await navigator.clipboard.writeText(extractedText);
      setError(null);
      setStatusMessage("Copied to clipboard.");
    } catch {
      setStatusMessage(null);
      setError("Could not copy text. Please select and copy manually.");
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setExtractedText("");
    setProcessedPages(0);
    setError(null);
    setStatusMessage(null);
    setIsReadingPdf(false);
    setIsExtracting(false);
    clearGeneratedFile();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF here"
          description="Upload one PDF file and extract selectable text directly in your browser."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        {error ? (
          <StatusNotice id="pdf-to-text-error" tone="error">
            {error}
          </StatusNotice>
        ) : null}

        {statusMessage ? (
          <StatusNotice tone={generatedFile ? "success" : "neutral"}>
            {statusMessage}
          </StatusNotice>
        ) : null}

        {isReadingPdf ? (
          <StatusNotice>Reading PDF...</StatusNotice>
        ) : null}

        {selectedPdf ? (
          <PdfFileSummary
            fileName={selectedPdf.file.name}
            fileSize={selectedPdf.file.size}
            pageCount={selectedPdf.pageCount}
          />
        ) : null}

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Text preview
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Extracted text keeps page separators so long documents stay easy
                to scan. Scanned PDFs require OCR and are not converted here.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/60 px-4 py-3">
              <label
                htmlFor="pdf-to-text-preview"
                className="text-sm font-semibold text-foreground"
              >
                Extracted text
              </label>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                <span className="rounded-full bg-background px-2.5 py-1">
                  {processedPages} pages processed
                </span>
                <span className="rounded-full bg-background px-2.5 py-1">
                  {wordCount} words
                </span>
                <span className="rounded-full bg-background px-2.5 py-1">
                  {characterCount} characters
                </span>
              </div>
            </div>
            <textarea
              id="pdf-to-text-preview"
              value={extractedText}
              readOnly
              aria-describedby="pdf-to-text-preview-help pdf-to-text-error"
              className="min-h-[28rem] w-full resize-y bg-transparent p-4 font-mono text-sm leading-7 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="Your extracted text will appear here."
            />
          </div>
          <p
            id="pdf-to-text-preview-help"
            className="mt-3 text-sm leading-6 text-muted-foreground"
          >
            Text is separated by page. Scanned or image-only PDFs require OCR
            and are reported clearly instead of producing an empty TXT file.
          </p>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Text extraction
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Extract selectable PDF text into a plain TXT file.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Private by design
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Text extraction runs locally in your browser. This is not OCR.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <PdfSummaryRow
            label="File"
            value={selectedPdf ? selectedPdf.file.name : "None"}
          />
          <PdfSummaryRow
            label="Pages"
            value={selectedPdf ? String(selectedPdf.pageCount) : "-"}
          />
          <PdfSummaryRow
            label="File size"
            value={selectedPdf ? formatFileSize(selectedPdf.file.size) : "-"}
          />
          <PdfSummaryRow label="Status" value={extractionState} />
          <PdfSummaryRow label="Pages processed" value={String(processedPages)} />
          <PdfSummaryRow label="Words" value={String(wordCount)} />
          <PdfSummaryRow label="Characters" value={String(characterCount)} />
          <PdfSummaryRow label="Output" value={outputFileName} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            onClick={handleExtractText}
            disabled={!selectedPdf || isReadingPdf || isExtracting}
            className="shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            {isExtracting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {isExtracting ? "Extracting Text..." : "Extract Text"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCopyText}
            disabled={!extractedText}
          >
            <Clipboard className="size-4" aria-hidden="true" />
            Copy Text
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a
                href={generatedFile.url}
                download={generatedFile.fileName}
                onClick={() => {
                  analytics.trackDownloadStarted({ outputFormat: "txt" });
                  analytics.trackDownloadCompleted({ outputFormat: "txt" });
                }}
              >
                <Download className="size-4" aria-hidden="true" />
                Download TXT
              </a>
            </Button>
          ) : null}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            {generatedFile ? "Extract text from another PDF" : "Reset"}
          </Button>
        </div>

        {generatedFile ? (
          <div
            className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            aria-live="polite"
          >
            <p className="flex items-center gap-2 font-semibold">
              <FileCheck2 className="size-4" aria-hidden="true" />
              Text extracted successfully
            </p>
            <p className="mt-1 leading-6">
              The TXT file was generated and the download started
              automatically.
            </p>
          </div>
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

function countWords(text: string) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return 0;
  }

  return trimmedText.split(/\s+/).length;
}

function getExtractionState({
  selectedPdf,
  isReadingPdf,
  isExtracting,
  extractedText,
}: {
  selectedPdf: SelectedPdf | null;
  isReadingPdf: boolean;
  isExtracting: boolean;
  extractedText: string;
}) {
  if (isReadingPdf) {
    return "Reading";
  }

  if (isExtracting) {
    return "Extracting";
  }

  if (extractedText) {
    return "Ready";
  }

  return selectedPdf ? "Loaded" : "Idle";
}

function createTextDownload(text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

  return {
    url: URL.createObjectURL(blob),
    fileName: outputFileName,
  };
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

function StatusNotice({
  id,
  tone = "neutral",
  children,
}: {
  id?: string;
  tone?: "neutral" | "error" | "success";
  children: ReactNode;
}) {
  return (
    <p
      id={id}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-medium",
        tone === "error" && "border-red-200 bg-red-50 text-red-700",
        tone === "success" && "border-green-200 bg-green-50 text-green-700",
        tone === "neutral" && "border-border bg-muted text-muted-foreground",
      )}
      role={tone === "error" ? "alert" : undefined}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      {children}
    </p>
  );
}
