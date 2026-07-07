"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, FileCheck2, Loader2, RotateCcw } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { PdfFileList, UploadedPdf } from "@/components/tools/pdf-file-list";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { createClientId } from "@/lib/create-client-id";

const mergedFileName = "merged.pdf";

export function MergePdfTool() {
  const [files, setFiles] = useState<UploadedPdf[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const mergedPdfUrlRef = useRef<string | null>(null);

  const totalSize = useMemo(
    () => files.reduce((sum, pdf) => sum + pdf.file.size, 0),
    [files],
  );

  useEffect(() => {
    mergedPdfUrlRef.current = mergedPdfUrl;
  }, [mergedPdfUrl]);

  useEffect(() => {
    return () => {
      if (mergedPdfUrlRef.current) {
        URL.revokeObjectURL(mergedPdfUrlRef.current);
      }
    };
  }, []);

  function handleFilesSelected(selectedFiles: File[]) {
    const validFiles = selectedFiles.filter(isPdfFile);
    const invalidCount = selectedFiles.length - validFiles.length;

    if (invalidCount > 0) {
      setError("Only PDF files are supported.");
    } else {
      setError(null);
    }

    if (!validFiles.length) {
      return;
    }

    clearMergedPdfUrl();

    setFiles((currentFiles) => [
      ...currentFiles,
      ...validFiles.map((file) => ({
        id: createClientId("pdf"),
        file,
      })),
    ]);
  }

  function handleRemove(id: string) {
    clearMergedPdfUrl();
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== id));
  }

  function handleMove(id: string, direction: "up" | "down") {
    clearMergedPdfUrl();
    setFiles((currentFiles) => {
      const index = currentFiles.findIndex((file) => file.id === id);

      if (index === -1) {
        return currentFiles;
      }

      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= currentFiles.length) {
        return currentFiles;
      }

      const nextFiles = [...currentFiles];
      const [movedFile] = nextFiles.splice(index, 1);
      nextFiles.splice(nextIndex, 0, movedFile);

      return nextFiles;
    });
  }

  async function handleMerge() {
    if (!files.length) {
      setError("Please choose at least one PDF file before merging.");
      return;
    }

    setError(null);
    setIsMerging(true);
    clearMergedPdfUrl();

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdf of files) {
        const sourcePdf = await PDFDocument.load(await pdf.file.arrayBuffer());
        const copiedPages = await mergedPdf.copyPages(
          sourcePdf,
          sourcePdf.getPageIndices(),
        );

        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const mergedBuffer = new ArrayBuffer(mergedBytes.byteLength);
      new Uint8Array(mergedBuffer).set(mergedBytes);

      const blob = new Blob([mergedBuffer], { type: "application/pdf" });
      setMergedPdfUrl(URL.createObjectURL(blob));
    } catch {
      setError(
        "The selected PDFs could not be merged. Please try different PDF files.",
      );
    } finally {
      setIsMerging(false);
    }
  }

  function handleReset() {
    setFiles([]);
    setError(null);
    clearMergedPdfUrl();
  }

  function clearMergedPdfUrl() {
    setMergedPdfUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return null;
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone onFilesSelected={handleFilesSelected} />

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <PdfFileList
          files={files}
          onRemove={handleRemove}
          onMove={handleMove}
        />
      </div>

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Merge summary</h2>
        <div className="mt-5 space-y-3 text-sm">
          <SummaryRow label="PDF files" value={String(files.length)} />
          <SummaryRow label="Total size" value={formatFileSize(totalSize)} />
          <SummaryRow label="Output" value={mergedFileName} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button type="button" onClick={handleMerge} disabled={isMerging}>
            {isMerging ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Merge PDF
          </Button>

          {mergedPdfUrl ? (
            <Button asChild variant="outline">
              <a href={mergedPdfUrl} download={mergedFileName}>
                <Download className="size-4" aria-hidden="true" />
                Download PDF
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Merge your PDF files before downloading.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download PDF
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Start over
          </Button>
        </div>

        {mergedPdfUrl ? (
          <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            Your merged PDF is ready to download.
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
