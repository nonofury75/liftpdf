"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  FileCheck2,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { PdfFileList, UploadedPdf } from "@/components/tools/pdf-file-list";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import {
  loadPdfDocument,
  renderPdfPageThumbnail,
} from "@/components/tools/pdf/pdfjs-client";
import {
  summarizeFilesForAnalytics,
  useToolAnalytics,
} from "@/hooks/use-tool-analytics";
import { createClientId } from "@/lib/create-client-id";

const mergedFileName = "merged.pdf";

export function MergePdfTool() {
  const [files, setFiles] = useState<UploadedPdf[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<UploadedPdf[]>([]);
  const mergedPdfUrlRef = useRef<string | null>(null);
  const analytics = useToolAnalytics({ tool: "Merge PDF", route: "/merge-pdf" });

  const totalSize = useMemo(
    () => files.reduce((sum, pdf) => sum + pdf.file.size, 0),
    [files],
  );
  const totalPages = useMemo(
    () =>
      files.reduce(
        (sum, pdf) => sum + (pdf.pageCount === null ? 0 : pdf.pageCount),
        0,
      ),
    [files],
  );
  const isReadingFiles = files.some((file) => file.status === "loading");
  const hasUnreadableFiles = files.some((file) => file.status === "error");

  useEffect(() => {
    mergedPdfUrlRef.current = mergedPdfUrl;
  }, [mergedPdfUrl]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });

      if (mergedPdfUrlRef.current) {
        URL.revokeObjectURL(mergedPdfUrlRef.current);
      }
    };
  }, []);

  function handleFilesSelected(selectedFiles: File[]) {
    analytics.trackUploadStarted(summarizeFilesForAnalytics(selectedFiles));
    const validFiles = selectedFiles.filter(isPdfFile);
    const invalidCount = selectedFiles.length - validFiles.length;

    if (invalidCount > 0) {
      setError("Only PDF files are supported.");
      analytics.trackError({ errorCode: "invalid_file_type" });
    } else {
      setError(null);
    }

    if (!validFiles.length) {
      return;
    }

    clearMergedPdfUrl();

    const pendingFiles = validFiles.map((file) => ({
      id: createClientId("pdf"),
      file,
      pageCount: null,
      previewHeight: null,
      previewUrl: null,
      previewWidth: null,
      status: "loading" as const,
    }));

    setFiles((currentFiles) => [
      ...currentFiles,
      ...pendingFiles,
    ]);
    analytics.trackUploadCompleted({
      ...summarizeFilesForAnalytics(validFiles),
      outputFormat: "pdf",
    });

    pendingFiles.forEach((pdf) => {
      void hydratePdfMetadata(pdf.id, pdf.file);
    });
  }

  function handleAddMoreChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files;

    if (selectedFiles?.length) {
      handleFilesSelected(Array.from(selectedFiles));
    }

    event.target.value = "";
  }

  function handleRemove(id: string) {
    clearMergedPdfUrl();
    setFiles((currentFiles) => {
      const fileToRemove = currentFiles.find((file) => file.id === id);

      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }

      return currentFiles.filter((file) => file.id !== id);
    });
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

  function handleReorder(draggedId: string, targetId: string) {
    clearMergedPdfUrl();
    setFiles((currentFiles) => {
      const draggedIndex = currentFiles.findIndex((file) => file.id === draggedId);
      const targetIndex = currentFiles.findIndex((file) => file.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
        return currentFiles;
      }

      const nextFiles = [...currentFiles];
      const [draggedFile] = nextFiles.splice(draggedIndex, 1);
      nextFiles.splice(targetIndex, 0, draggedFile);

      return nextFiles;
    });
  }

  async function handleMerge() {
    if (!files.length) {
      setError("Please choose at least one PDF file before merging.");
      analytics.trackError({ errorCode: "missing_file" });
      return;
    }

    if (isReadingFiles) {
      setError("Please wait until the selected PDFs are ready.");
      analytics.trackError({ errorCode: "files_not_ready" });
      return;
    }

    if (hasUnreadableFiles) {
      setError("One of the selected PDFs could not be read. Remove it and try another file.");
      analytics.trackError({ errorCode: "pdf_read_failed" });
      return;
    }

    setError(null);
    setIsMerging(true);
    clearMergedPdfUrl();
    analytics.trackConversionStarted({
      fileCount: files.length,
      pageCount: totalPages,
      outputFormat: "pdf",
    });

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
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      analytics.trackConversionCompleted({
        fileCount: files.length,
        pageCount: totalPages,
        outputFormat: "pdf",
        status: "success",
      });
      analytics.trackDownloadStarted({ outputFormat: "pdf" });
      triggerDownload(url, mergedFileName);
      analytics.trackDownloadCompleted({ outputFormat: "pdf" });
    } catch (mergeError) {
      const message =
        mergeError instanceof Error &&
        /encrypted|password|protected/i.test(mergeError.message)
          ? "One of the selected PDFs is password protected. Unlock it first, then try merging again."
          : "The selected PDFs could not be merged. Please try different PDF files.";
      setError(
        message,
      );
      analytics.trackError({ errorCode: "merge_failed" });
    } finally {
      setIsMerging(false);
    }
  }

  function handleReset() {
    files.forEach((file) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
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

  async function hydratePdfMetadata(id: string, file: File) {
    let previewUrl: string | null = null;
    let pdf: Awaited<ReturnType<typeof loadPdfDocument>> | null = null;

    try {
      pdf = await loadPdfDocument(file);
      const thumbnail = await renderPdfPageThumbnail(pdf, 1);
      previewUrl = thumbnail.previewUrl;
      const pageCount = pdf.numPages;

      if (!filesRef.current.some((currentFile) => currentFile.id === id)) {
        URL.revokeObjectURL(previewUrl);
        await pdf.destroy();
        return;
      }

      setFiles((currentFiles) =>
        currentFiles.map((currentFile) =>
          currentFile.id === id
            ? {
                ...currentFile,
                pageCount,
                previewHeight: thumbnail.height,
                previewUrl,
                previewWidth: thumbnail.width,
                status: "ready",
              }
            : currentFile,
        ),
      );
      await pdf.destroy();
    } catch {
      if (pdf) {
        await pdf.destroy();
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setFiles((currentFiles) =>
        currentFiles.map((currentFile) =>
          currentFile.id === id
            ? {
                ...currentFile,
                pageCount: null,
                previewHeight: null,
                previewUrl: null,
                previewWidth: null,
                status: "error",
              }
            : currentFile,
        ),
      );
      setError("One of the selected PDFs could not be read. Remove it and try another file.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone onFilesSelected={handleFilesSelected} />
        <input
          ref={addMoreInputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          aria-label="Add more PDF files"
          className="hidden"
          onChange={handleAddMoreChange}
        />

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <PdfFileList
          files={files}
          onRemove={handleRemove}
          onMove={handleMove}
          onReorder={handleReorder}
          onAddMore={() => addMoreInputRef.current?.click()}
        />
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-md xl:sticky xl:top-24">
        <h2 className="text-xl font-semibold text-foreground">Merge summary</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Files are merged from top to bottom in the order shown.
        </p>

        <div className="mt-5 space-y-3 rounded-xl border border-border bg-muted/25 p-4 text-sm">
          <SummaryRow label="Files" value={String(files.length)} />
          <SummaryRow
            label="Pages"
            value={
              isReadingFiles
                ? "Reading..."
                : totalPages > 0
                  ? String(totalPages)
                  : "-"
            }
          />
          <SummaryRow label="Total size" value={formatFileSize(totalSize)} />
          <SummaryRow label="Output filename" value={mergedFileName} />
        </div>

        <div className="mt-7 grid gap-3">
          <Button
            type="button"
            onClick={handleMerge}
            disabled={isMerging}
            className="h-12 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            {isMerging ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {isMerging ? "Merging..." : "Merge PDF"}
          </Button>

          {mergedPdfUrl ? (
            <>
              <p
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm"
                aria-live="polite"
              >
                <CheckCircle2 className="mr-2 inline size-4" aria-hidden="true" />
                Merged PDF created successfully
              </p>
              <Button
                asChild
                variant="outline"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <a
                  href={mergedPdfUrl}
                  download={mergedFileName}
                  onClick={() => {
                    analytics.trackDownloadStarted({ outputFormat: "pdf" });
                    analytics.trackDownloadCompleted({ outputFormat: "pdf" });
                  }}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download PDF
                </a>
              </Button>
            </>
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

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
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
