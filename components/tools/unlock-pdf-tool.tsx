"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Download,
  FileCheck2,
  FileLock2,
  Loader2,
  LockOpen,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import {
  formatFileSize,
  PdfFileSummary,
} from "@/components/tools/pdf/pdf-file-summary";
import { PasswordField } from "@/components/tools/pdf/password-field";
import { PdfSummaryRow } from "@/components/tools/pdf/pdf-summary-row";
import { loadPdfDocument } from "@/components/tools/pdf/pdfjs-client";
import {
  hasPdfEncryptionDictionary,
  QpdfPasswordError,
  unlockPdfWithPassword,
} from "@/components/tools/pdf/qpdf-client";
import {
  summarizeFilesForAnalytics,
  useToolAnalytics,
} from "@/hooks/use-tool-analytics";
import { cn } from "@/lib/utils";

type SelectedPdf = {
  file: File;
  pageCount: number | null;
  isProtected: boolean;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

const outputFileName = "unlocked.pdf";

export function UnlockPdfTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(null);

  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const analytics = useToolAnalytics({
    tool: "Unlock PDF",
    route: "/unlock-pdf",
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
    setPassword("");
    setError(null);
    setProgress(null);
    setIsReadingPdf(true);

    try {
      const fileBytes = new Uint8Array(await file.arrayBuffer());

      if (!hasPdfEncryptionDictionary(fileBytes)) {
        const pdf = await loadPdfDocument(file);
        setSelectedPdf({
          file,
          pageCount: pdf.numPages,
          isProtected: false,
        });
        await pdf.destroy();
        setError("This PDF does not appear to be password protected.");
        analytics.trackUploadCompleted({
          ...summarizeFilesForAnalytics([file]),
          pageCount: pdf.numPages,
          outputFormat: "pdf",
          status: "not_protected",
        });
        analytics.trackError({ errorCode: "not_protected" });
        return;
      }

      setSelectedPdf({
        file,
        pageCount: null,
        isProtected: true,
      });
      analytics.trackUploadCompleted({
        ...summarizeFilesForAnalytics([file]),
        outputFormat: "pdf",
        status: "protected",
      });
    } catch {
      setSelectedPdf(null);
      setError("This PDF could not be read. Please choose another file.");
      analytics.trackError({ errorCode: "pdf_read_failed" });
    } finally {
      setIsReadingPdf(false);
    }
  }

  async function handleUnlockPdf() {
    if (!selectedPdf) {
      setError("Please choose a PDF file before unlocking it.");
      analytics.trackError({ errorCode: "missing_file" });
      return;
    }

    if (!selectedPdf.isProtected) {
      setError("This PDF does not appear to be password protected.");
      analytics.trackError({ errorCode: "not_protected" });
      return;
    }

    if (!password) {
      setError("Please enter the PDF password.");
      analytics.trackError({ errorCode: "missing_password" });
      return;
    }

    if (typeof crossOriginIsolated !== "undefined" && !crossOriginIsolated) {
      setError(
        "This browser session cannot run the PDF unlock engine. Please reload the page and try again.",
      );
      analytics.trackError({ errorCode: "browser_not_isolated" });
      return;
    }

    setError(null);
    setIsUnlocking(true);
    setProgress("Preparing PDF...");
    clearGeneratedFile();
    analytics.trackConversionStarted({
      mode: "decrypt",
      outputFormat: "pdf",
    });

    try {
      const fileBuffer = await selectedPdf.file.arrayBuffer();
      setProgress("Decrypting PDF...");
      const unlockedBytes = await unlockPdfWithPassword(
        new Uint8Array(fileBuffer),
        password,
      );
      setProgress("Generating unlocked PDF...");
      const buffer = new ArrayBuffer(unlockedBytes.byteLength);
      new Uint8Array(buffer).set(unlockedBytes);
      const blob = new Blob([buffer], { type: "application/pdf" });
      const nextFile = {
        url: URL.createObjectURL(blob),
        fileName: outputFileName,
      };

      setGeneratedFile(nextFile);
      setProgress("PDF unlocked successfully.");
      analytics.trackConversionCompleted({
        mode: "decrypt",
        outputFormat: "pdf",
        status: "success",
      });
      analytics.trackDownloadStarted({ outputFormat: "pdf" });
      triggerDownload(nextFile.url, nextFile.fileName);
      analytics.trackDownloadCompleted({ outputFormat: "pdf" });
    } catch (caughtError) {
      setError(
        caughtError instanceof QpdfPasswordError
          ? "The password is incorrect or the PDF could not be unlocked."
          : "The PDF could not be unlocked. Please try another file.",
      );
      analytics.trackError({
        errorCode:
          caughtError instanceof QpdfPasswordError
            ? "incorrect_password"
            : "unlock_failed",
      });
      setProgress(null);
    } finally {
      setIsUnlocking(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setPassword("");
    setShowPassword(false);
    setError(null);
    setIsReadingPdf(false);
    setIsUnlocking(false);
    setProgress(null);
    clearGeneratedFile();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your protected PDF here"
          description="Upload one password-protected PDF file and unlock it locally in your browser."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        {error ? (
          <StatusNotice id="unlock-pdf-error" tone="error">
            {error}
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
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Password unlock
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your PDF is decrypted locally in your browser with QPDF WASM.
                Your password and file are never uploaded.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                <LockOpen className="size-3.5 text-primary" aria-hidden="true" />
                Private by Design
              </span>
            </div>
          </div>

          <div className="mt-6">
            <PasswordField
              id="unlock-password"
              label="PDF password"
              value={password}
              showPassword={showPassword}
              describedBy="unlock-password-help unlock-pdf-error"
              onChange={(value) => {
                clearGeneratedFile();
                setError(null);
                setPassword(value);
              }}
              onToggleShow={() => setShowPassword((current) => !current)}
            />
            <p
              id="unlock-password-help"
              className="mt-2 text-sm leading-6 text-muted-foreground"
            >
              Enter the current PDF password. LiftPDF cannot unlock a protected
              PDF without the correct password.
            </p>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <FileLock2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Unlock settings
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Remove encryption when you know the current password.
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
                Decryption runs locally. LiftPDF cannot see your PDF password.
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
            value={
              selectedPdf?.pageCount ? String(selectedPdf.pageCount) : "Locked"
            }
          />
          <PdfSummaryRow
            label="File size"
            value={selectedPdf ? formatFileSize(selectedPdf.file.size) : "-"}
          />
          <PdfSummaryRow
            label="Encrypted"
            value={selectedPdf?.isProtected ? "Yes" : "No"}
          />
          <PdfSummaryRow label="Output" value={outputFileName} />
        </div>

        {progress ? (
          <p
            className={cn(
              "mt-5 rounded-xl px-3 py-2 text-sm font-medium",
              generatedFile
                ? "bg-green-50 text-green-700"
                : "bg-muted text-muted-foreground",
            )}
            aria-live="polite"
          >
            {progress}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            onClick={handleUnlockPdf}
            disabled={!selectedPdf || isReadingPdf || isUnlocking}
            className="shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            {isUnlocking ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {isUnlocking ? "Unlocking PDF..." : "Unlock PDF"}
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a
                href={generatedFile.url}
                download={generatedFile.fileName}
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
            {generatedFile ? "Unlock another PDF" : "Reset"}
          </Button>
        </div>

        {generatedFile ? (
          <div
            className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            aria-live="polite"
          >
            <p className="flex items-center gap-2 font-semibold">
              <FileCheck2 className="size-4" aria-hidden="true" />
              PDF unlocked successfully
            </p>
            <p className="mt-1 leading-6">
              The unlocked PDF was generated and the download started
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
  tone?: "neutral" | "error";
  children: ReactNode;
}) {
  return (
    <p
      id={id}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-medium",
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-border bg-muted text-muted-foreground",
      )}
      role={tone === "error" ? "alert" : undefined}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      {children}
    </p>
  );
}
