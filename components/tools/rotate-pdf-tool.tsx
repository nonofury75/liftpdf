"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Download,
  FileCheck2,
  Loader2,
  RotateCcw,
  RotateCcwSquare,
  RotateCwSquare,
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
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(
    null,
  );
  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const pagesRef = useRef<PagePreview[]>([]);

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
      setError("This PDF could not be read. Please choose another file.");
    } finally {
      setIsLoadingPreview(false);
    }
  }

  function rotatePage(pageNumber: number, degreesToAdd: number) {
    clearGeneratedFile();
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
    setPages((currentPages) =>
      currentPages.map((page) => ({
        ...page,
        rotation: normalizeRotation(page.rotation + degreesToAdd),
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
    clearGeneratedFile();

    try {
      const pdf = await PDFDocument.load(await selectedPdf.file.arrayBuffer());
      const pdfPages = pdf.getPages();

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
    } catch {
      setError("The PDF could not be rotated. Please try another file.");
    } finally {
      setIsRotating(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setError(null);
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
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one PDF file, preview every page and rotate pages before downloading."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Page preview
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Rotate one page or apply a rotation to every page.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => rotateAll(-90)}
                >
                  <RotateCcwSquare className="size-4" aria-hidden="true" />
                  Rotate All Left
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => rotateAll(90)}
                >
                  <RotateCwSquare className="size-4" aria-hidden="true" />
                  Rotate All Right
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <article
                  key={page.pageNumber}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-md bg-muted p-3">
                    <div
                      className="transition-transform duration-200"
                      style={{
                        transform: `rotate(${page.rotation}deg)`,
                      }}
                    >
                      <Image
                        src={page.previewUrl}
                        alt={`Page ${page.pageNumber}`}
                        width={160}
                        height={220}
                        className="h-auto max-h-52 w-auto rounded-sm bg-white shadow-sm"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      Page {page.pageNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {page.rotation} deg
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => rotatePage(page.pageNumber, -90)}
                    >
                      <RotateCcwSquare className="size-4" aria-hidden="true" />
                      Left
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => rotatePage(page.pageNumber, 90)}
                    >
                      <RotateCwSquare className="size-4" aria-hidden="true" />
                      Right
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Rotation summary
        </h2>
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
            label="File size"
            value={selectedPdf ? formatFileSize(selectedPdf.file.size) : "-"}
          />
          <PdfSummaryRow label="Output" value={rotatedFileName} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button type="button" onClick={handleRotatePdf} disabled={isRotating}>
            {isRotating ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Rotate PDF
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a href={generatedFile.url} download={generatedFile.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download rotated PDF
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Rotate your PDF before downloading.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download rotated PDF
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {generatedFile ? (
          <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            Your rotated PDF is ready to download.
          </p>
        ) : null}
      </aside>
    </div>
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
