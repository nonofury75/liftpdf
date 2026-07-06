"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clipboard,
  Download,
  FileCheck2,
  FileText,
  Loader2,
  RotateCcw,
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
  "No selectable text was found. This PDF may be scanned or image-based. OCR is required to extract text from scanned documents.";

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
        return;
      }

      const pdf = await loadPdfDocument(file);
      setSelectedPdf({ file, pageCount: pdf.numPages });
      await pdf.destroy();
    } catch {
      setError("This PDF could not be read. Please choose another file.");
    } finally {
      setIsReadingPdf(false);
    }
  }

  async function handleExtractText() {
    if (!selectedPdf) {
      setError("Please choose a PDF file before extracting text.");
      return;
    }

    clearGeneratedFile();
    setExtractedText("");
    setProcessedPages(0);
    setError(null);
    setStatusMessage(null);
    setIsExtracting(true);

    let pdfDocument: Awaited<ReturnType<typeof loadPdfDocument>> | null = null;

    try {
      pdfDocument = await loadPdfDocument(selectedPdf.file);
      const pages = await extractPdfText(pdfDocument, (pageNumber) => {
        setProcessedPages(pageNumber);
      });
      const text = pages
        .map((page) => `Page ${page.pageNumber}\n\n${page.text}`)
        .join("\n\n");
      const hasSelectableText = pages.some((page) => page.text.length > 0);

      if (!hasSelectableText) {
        setError(noTextMessage);
        setExtractedText("");
        return;
      }

      setExtractedText(text);

      const nextFile = createTextDownload(text);
      setGeneratedFile(nextFile);
      triggerDownload(nextFile.url, nextFile.fileName);
      setStatusMessage("Text extracted successfully. The download has started.");
    } catch {
      setError("The text could not be extracted. Please try another PDF file.");
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
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF here"
          description="Upload one PDF file and extract selectable text directly in your browser."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        {error ? (
          <p
            id="pdf-to-text-error"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {statusMessage ? (
          <p
            className="rounded-md bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
            aria-live="polite"
          >
            {statusMessage}
          </p>
        ) : null}

        {isReadingPdf ? (
          <p className="rounded-md bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
            Reading PDF...
          </p>
        ) : null}

        {isExtracting && selectedPdf ? (
          <p
            className="rounded-md bg-muted px-4 py-3 text-sm font-medium text-muted-foreground"
            aria-live="polite"
          >
            Extracting page {Math.max(processedPages, 1)} of{" "}
            {selectedPdf.pageCount}
          </p>
        ) : null}

        {selectedPdf ? (
          <PdfFileSummary
            fileName={selectedPdf.file.name}
            fileSize={selectedPdf.file.size}
            pageCount={selectedPdf.pageCount}
          />
        ) : null}

        <section className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
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

          <label
            htmlFor="pdf-to-text-preview"
            className="mt-5 block text-sm font-semibold text-foreground"
          >
            Extracted text
          </label>
          <textarea
            id="pdf-to-text-preview"
            value={extractedText}
            readOnly
            aria-describedby="pdf-to-text-preview-help pdf-to-text-error"
            className="mt-2 min-h-80 w-full resize-y rounded-lg border border-border bg-background p-4 font-mono text-sm leading-6 text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="Your extracted text will appear here."
          />
          <p
            id="pdf-to-text-preview-help"
            className="mt-2 text-sm text-muted-foreground"
          >
            {characterCount} characters - {wordCount} words - {processedPages}{" "}
            pages processed
          </p>
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Extraction summary
        </h2>
        <div className="mt-5 space-y-3 text-sm">
          <PdfSummaryRow
            label="PDF file"
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
          <PdfSummaryRow label="Characters" value={String(characterCount)} />
          <PdfSummaryRow label="Output" value={outputFileName} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            onClick={handleExtractText}
            disabled={isReadingPdf || isExtracting}
          >
            {isExtracting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Extract Text
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
              <a href={generatedFile.url} download={generatedFile.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download TXT
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Extract text before downloading.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download TXT
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
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
