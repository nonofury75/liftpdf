"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  FileCheck2,
  FileText,
  Loader2,
  RotateCcw,
} from "lucide-react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { cn } from "@/lib/utils";

type SplitMode = "extract" | "every-page";

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

const extractedFileName = "split.pdf";
const splitZipFileName = "split-pages.zip";

export function SplitPdfTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [mode, setMode] = useState<SplitMode>("extract");
  const [rangeInput, setRangeInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(
    null,
  );
  const generatedFileRef = useRef<GeneratedFile | null>(null);

  const outputFileName = useMemo(
    () => (mode === "extract" ? extractedFileName : splitZipFileName),
    [mode],
  );

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

  async function handleSplit() {
    if (!selectedPdf) {
      setError("Please choose one PDF file before splitting.");
      return;
    }

    setError(null);
    setIsSplitting(true);
    clearGeneratedFile();

    try {
      const sourcePdf = await PDFDocument.load(
        await selectedPdf.file.arrayBuffer(),
      );

      if (mode === "extract") {
        const pageNumbers = parsePageRanges(rangeInput, selectedPdf.pageCount);
        const outputPdf = await PDFDocument.create();
        const copiedPages = await outputPdf.copyPages(
          sourcePdf,
          pageNumbers.map((pageNumber) => pageNumber - 1),
        );

        copiedPages.forEach((page) => outputPdf.addPage(page));

        const bytes = await outputPdf.save();
        setGeneratedFile({
          url: createBlobUrl(bytes, "application/pdf"),
          fileName: extractedFileName,
        });
      } else {
        const zip = new JSZip();

        for (const pageIndex of sourcePdf.getPageIndices()) {
          const singlePagePdf = await PDFDocument.create();
          const [page] = await singlePagePdf.copyPages(sourcePdf, [pageIndex]);
          singlePagePdf.addPage(page);
          const bytes = await singlePagePdf.save();
          zip.file(`page-${pageIndex + 1}.pdf`, bytes);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        setGeneratedFile({
          url: URL.createObjectURL(zipBlob),
          fileName: splitZipFileName,
        });
      }
    } catch (splitError) {
      setError(
        splitError instanceof Error
          ? splitError.message
          : "The PDF could not be split. Please try another file.",
      );
    } finally {
      setIsSplitting(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setRangeInput("");
    setMode("extract");
    setError(null);
    clearGeneratedFile();
  }

  function clearGeneratedFile() {
    setGeneratedFile((currentFile) => {
      if (currentFile) {
        URL.revokeObjectURL(currentFile.url);
      }

      return null;
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, then extract selected pages or split every page into a separate PDF."
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
                  {formatFileSize(selectedPdf.file.size)} -{" "}
                  {selectedPdf.pageCount}{" "}
                  {selectedPdf.pageCount === 1 ? "page" : "pages"}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Split options
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className={cn(
                "rounded-lg border border-border p-4 text-left transition-colors",
                mode === "extract" && "border-primary bg-primary/5",
              )}
              onClick={() => {
                setMode("extract");
                clearGeneratedFile();
              }}
            >
              <span className="text-sm font-semibold text-foreground">
                Extract pages
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                Create one PDF from selected pages.
              </span>
            </button>
            <button
              type="button"
              className={cn(
                "rounded-lg border border-border p-4 text-left transition-colors",
                mode === "every-page" && "border-primary bg-primary/5",
              )}
              onClick={() => {
                setMode("every-page");
                clearGeneratedFile();
              }}
            >
              <span className="text-sm font-semibold text-foreground">
                Split every page
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                Create a ZIP with one PDF per page.
              </span>
            </button>
          </div>

          {mode === "extract" ? (
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-foreground">
                Pages to extract
              </span>
              <input
                value={rangeInput}
                onChange={(event) => {
                  setRangeInput(event.target.value);
                  clearGeneratedFile();
                }}
                placeholder="1,3,5-8"
                className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
              />
            </label>
          ) : null}
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Split summary</h2>
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
            label="Output"
            value={generatedFile?.fileName ?? outputFileName}
          />
        </div>

        <div className="mt-6 grid gap-3">
          <Button type="button" onClick={handleSplit} disabled={isSplitting}>
            {isSplitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Split PDF
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a href={generatedFile.url} download={generatedFile.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Split your PDF before downloading.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Start over
          </Button>
        </div>

        {generatedFile ? (
          <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            Your file is ready to download.
          </p>
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

function parsePageRanges(input: string, pageCount: number) {
  const normalizedInput = input.trim();

  if (!normalizedInput) {
    throw new Error(
      "Enter the pages you want to extract, for example 1,3,5-8.",
    );
  }

  const pageNumbers: number[] = [];
  const parts = normalizedInput.split(",");

  for (const rawPart of parts) {
    const part = rawPart.trim();

    if (!part) {
      throw new Error("The page range is invalid. Use a format like 1,3,5-8.");
    }

    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    const singlePageMatch = part.match(/^\d+$/);

    if (rangeMatch) {
      const startPage = Number(rangeMatch[1]);
      const endPage = Number(rangeMatch[2]);

      if (startPage > endPage) {
        throw new Error(
          "Page ranges must go from low to high, for example 2-5.",
        );
      }

      for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
        validatePageNumber(pageNumber, pageCount);
        pageNumbers.push(pageNumber);
      }
    } else if (singlePageMatch) {
      const pageNumber = Number(part);
      validatePageNumber(pageNumber, pageCount);
      pageNumbers.push(pageNumber);
    } else {
      throw new Error("The page range is invalid. Use a format like 1,3,5-8.");
    }
  }

  return pageNumbers;
}

function validatePageNumber(pageNumber: number, pageCount: number) {
  if (pageNumber < 1 || pageNumber > pageCount) {
    throw new Error(`Page ${pageNumber} does not exist in this PDF.`);
  }
}

function createBlobUrl(bytes: Uint8Array<ArrayBufferLike>, type: string) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);

  return URL.createObjectURL(new Blob([buffer], { type }));
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
