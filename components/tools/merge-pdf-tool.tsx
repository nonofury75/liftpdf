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
import {
  getPdfOutputFileNameBase,
  parsePdfOutputFileName,
} from "@/lib/output-filename";

const mergedFileName = "merged.pdf";

type MergeIssueStatus = "protected" | "invalid" | "empty" | "error";

export function MergePdfTool() {
  const [files, setFiles] = useState<UploadedPdf[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [outputFileNameInput, setOutputFileNameInput] = useState(
    getPdfOutputFileNameBase(mergedFileName),
  );
  const [generatedFileName, setGeneratedFileName] = useState(mergedFileName);
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
  const readyFiles = useMemo(
    () => files.filter((file) => file.status === "ready"),
    [files],
  );
  const issueFiles = useMemo(
    () =>
      files.filter((file) =>
        ["protected", "invalid", "empty", "error"].includes(file.status),
      ),
    [files],
  );
  const isCheckingFiles = files.some((file) => file.status === "checking");
  const outputFileNameValidation = useMemo(() => {
    try {
      return {
        error: null,
        fileName: parsePdfOutputFileName(outputFileNameInput, mergedFileName),
      };
    } catch (validationError) {
      return {
        error:
          validationError instanceof Error
            ? validationError.message
            : "Enter a valid file name.",
        fileName: null,
      };
    }
  }, [outputFileNameInput]);
  const canMerge =
    readyFiles.length >= 2 &&
    issueFiles.length === 0 &&
    !isCheckingFiles &&
    !outputFileNameValidation.error;

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
      status: file.size === 0 ? ("empty" as const) : ("checking" as const),
      errorMessage:
        file.size === 0 ? "This PDF file is empty." : undefined,
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
      if (pdf.status !== "empty") {
        void hydratePdfMetadata(pdf.id, pdf.file);
      }
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
    const currentFiles = filesRef.current;
    const fileToRemove = currentFiles.find((file) => file.id === id);
    const nextFiles = currentFiles.filter((file) => file.id !== id);

    if (fileToRemove?.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }

    setFiles(nextFiles);

    if (
      fileToRemove &&
      ["protected", "invalid", "empty", "error"].includes(fileToRemove.status)
    ) {
      const nextIssueCount = nextFiles.filter((file) =>
        ["protected", "invalid", "empty", "error"].includes(file.status),
      ).length;
      const nextReadyCount = nextFiles.filter(
        (file) => file.status === "ready",
      ).length;

      setError(
        nextIssueCount > 0
          ? formatIssueSummary(nextIssueCount)
          : nextReadyCount >= 2
            ? "File removed. Merge is ready."
            : null,
      );
    } else {
      setError(null);
    }
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

    if (isCheckingFiles) {
      setError("Please wait until the selected PDFs are ready.");
      analytics.trackError({ errorCode: "files_not_ready" });
      return;
    }

    if (issueFiles.length > 0) {
      setError(formatIssueSummary(issueFiles.length));
      analytics.trackError({ errorCode: "merge_blocked_file_issue" });
      return;
    }

    if (readyFiles.length < 2) {
      setError("Add at least two ready PDF files before merging.");
      analytics.trackError({ errorCode: "not_enough_ready_files" });
      return;
    }

    if (!outputFileNameValidation.fileName) {
      setError(outputFileNameValidation.error ?? "Enter a valid file name.");
      analytics.trackError({ errorCode: "invalid_output_filename" });
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

      for (const pdf of readyFiles) {
        try {
          const sourcePdf = await PDFDocument.load(await pdf.file.arrayBuffer());
          const copiedPages = await mergedPdf.copyPages(
            sourcePdf,
            sourcePdf.getPageIndices(),
          );

          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (fileMergeError) {
          const issue = classifyPdfError(fileMergeError);
          markFileIssue(pdf.id, issue.status, issue.message);
          throw new Error(
            `${pdf.file.name} could not be merged. Remove it and try again.`,
          );
        }
      }

      const mergedBytes = await mergedPdf.save();
      const mergedBuffer = new ArrayBuffer(mergedBytes.byteLength);
      new Uint8Array(mergedBuffer).set(mergedBytes);

      const blob = new Blob([mergedBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setGeneratedFileName(outputFileNameValidation.fileName);
      setMergedPdfUrl(url);
      analytics.trackConversionCompleted({
        fileCount: readyFiles.length,
        pageCount: totalPages,
        outputFormat: "pdf",
        status: "success",
      });
      analytics.trackDownloadStarted({ outputFormat: "pdf" });
      triggerDownload(url, outputFileNameValidation.fileName);
      analytics.trackDownloadCompleted({ outputFormat: "pdf" });
    } catch (mergeError) {
      setError(
        mergeError instanceof Error
          ? mergeError.message
          : "Merge failed. The PDFs could not be combined safely. Your files are still available so you can try again.",
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
    setOutputFileNameInput(getPdfOutputFileNameBase(mergedFileName));
    setGeneratedFileName(mergedFileName);
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
    } catch (loadError) {
      if (pdf) {
        await pdf.destroy();
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const issue = classifyPdfError(loadError);
      setFiles((currentFiles) =>
        currentFiles.map((currentFile) =>
          currentFile.id === id
            ? {
                ...currentFile,
                errorMessage: issue.message,
                pageCount: null,
                previewHeight: null,
                previewUrl: null,
                previewWidth: null,
                status: issue.status,
              }
            : currentFile,
        ),
      );
      setError(issue.message);
    }
  }

  function markFileIssue(
    id: string,
    status: MergeIssueStatus,
    errorMessage: string,
  ) {
    setFiles((currentFiles) =>
      currentFiles.map((currentFile) =>
        currentFile.id === id
          ? {
              ...currentFile,
              errorMessage,
              status,
            }
          : currentFile,
      ),
    );
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
          <SummaryRow label="Ready" value={String(readyFiles.length)} />
          {issueFiles.length > 0 ? (
            <SummaryRow label="Issues" value={String(issueFiles.length)} />
          ) : null}
          <SummaryRow
            label="Pages"
            value={
              isCheckingFiles
                ? "Reading..."
                : totalPages > 0
                  ? String(totalPages)
                  : "-"
            }
          />
          <SummaryRow label="Total size" value={formatFileSize(totalSize)} />
          <SummaryRow
            label="Output filename"
            value={outputFileNameValidation.fileName ?? mergedFileName}
          />
        </div>

        <label className="mt-7 block">
          <span className="text-sm font-semibold text-foreground">
            Output file name
          </span>
          <input
            value={outputFileNameInput}
            onChange={(event) => {
              clearMergedPdfUrl();
              setGeneratedFileName(mergedFileName);
              setOutputFileNameInput(event.target.value);
            }}
            aria-describedby={
              outputFileNameValidation.error
                ? "merge-output-file-name-error"
                : "merge-output-file-name-help"
            }
            aria-invalid={outputFileNameValidation.error ? "true" : "false"}
            placeholder={getPdfOutputFileNameBase(mergedFileName)}
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
          {outputFileNameValidation.error ? (
            <span
              id="merge-output-file-name-error"
              className="mt-2 block text-xs font-semibold leading-5 text-red-700"
              aria-live="polite"
            >
              {outputFileNameValidation.error}
            </span>
          ) : (
            <span
              id="merge-output-file-name-help"
              className="mt-2 block text-xs leading-5 text-muted-foreground"
            >
              Use a simple PDF file name. LiftPDF adds .pdf when needed.
            </span>
          )}
        </label>

        {issueFiles.length > 0 ? (
          <p
            className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800"
            aria-live="polite"
          >
            {formatIssueSummary(issueFiles.length)}
          </p>
        ) : null}

        <div className="mt-7 grid gap-3">
          <Button
            type="button"
            onClick={handleMerge}
            disabled={isMerging || !canMerge}
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
                  download={generatedFileName}
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

function classifyPdfError(error: unknown): {
  status: MergeIssueStatus;
  message: string;
} {
  const name = error instanceof Error ? error.name.toLowerCase() : "";
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (
    name.includes("password") ||
    message.includes("password") ||
    message.includes("encrypted") ||
    message.includes("protected")
  ) {
    return {
      status: "protected",
      message: "This PDF must be unlocked before it can be merged.",
    };
  }

  if (
    name.includes("invalid") ||
    message.includes("invalid") ||
    message.includes("corrupt") ||
    message.includes("pdf header") ||
    message.includes("no pdf")
  ) {
    return {
      status: "invalid",
      message: "This file could not be read as a valid PDF.",
    };
  }

  return {
    status: "error",
    message: "This file could not be read safely.",
  };
}

function formatIssueSummary(issueCount: number) {
  return issueCount === 1
    ? "Remove or unlock 1 file before merging."
    : `Remove or unlock ${issueCount} files before merging.`;
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
