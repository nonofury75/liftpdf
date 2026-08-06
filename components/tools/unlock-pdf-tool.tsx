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
  inspectQpdfEncryption,
  type QpdfEncryptionInspection,
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
  protectionType: PdfProtectionType;
  permissions: QpdfEncryptionInspection["permissions"] | null;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

type PdfProtectionType =
  | "open_password"
  | "restrictions_only"
  | "unprotected";

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

      const hasEncryption = hasPdfEncryptionDictionary(fileBytes);

      if (!hasEncryption) {
        const pdf = await loadPdfDocument(file);
        setSelectedPdf({
          file,
          pageCount: pdf.numPages,
          protectionType: "unprotected",
          permissions: null,
        });
        await pdf.destroy();
        setError("This PDF is not password protected.");
        analytics.trackUploadCompleted({
          ...summarizeFilesForAnalytics([file]),
          pageCount: pdf.numPages,
          outputFormat: "pdf",
          status: "not_protected",
          protectionType: "unprotected",
        });
        analytics.trackError({ errorCode: "not_protected" });
        return;
      }

      const inspection = inspectQpdfEncryption(fileBytes);

      try {
        const pdf = await loadPdfDocument(file);
        setSelectedPdf({
          file,
          pageCount: pdf.numPages,
          protectionType: "restrictions_only",
          permissions: inspection.permissions,
        });
        analytics.trackUploadCompleted({
          ...summarizeFilesForAnalytics([file]),
          pageCount: pdf.numPages,
          outputFormat: "pdf",
          status: "protected",
          protectionType: "restrictions_only",
        });
        await pdf.destroy();
        return;
      } catch {
        // If PDF.js cannot open an encrypted file without a password, treat it
        // as an open-password PDF. The actual password is still verified by QPDF.
      }

      setSelectedPdf({
        file,
        pageCount: null,
        protectionType: "open_password",
        permissions: inspection.permissions,
      });
      analytics.trackUploadCompleted({
        ...summarizeFilesForAnalytics([file]),
        outputFormat: "pdf",
        status: "protected",
        protectionType: "open_password",
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

    if (selectedPdf.protectionType === "unprotected") {
      setError("This PDF is not password protected.");
      analytics.trackError({ errorCode: "not_protected" });
      return;
    }

    if (!password) {
      setError(
        selectedPdf.protectionType === "restrictions_only"
          ? "Please enter the owner password."
          : "Please enter the PDF password.",
      );
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
      mode:
        selectedPdf.protectionType === "restrictions_only"
          ? "remove_restrictions"
          : "decrypt",
      outputFormat: "pdf",
      protectionType: selectedPdf.protectionType,
      passwordType:
        selectedPdf.protectionType === "restrictions_only" ? "owner" : "user",
    });

    try {
      const fileBuffer = await selectedPdf.file.arrayBuffer();
      setProgress(
        selectedPdf.protectionType === "restrictions_only"
          ? "Removing restrictions..."
          : "Decrypting PDF...",
      );
      const unlockedBytes = await unlockPdfWithPassword(
        new Uint8Array(fileBuffer),
        password,
      );
      setProgress("Generating unlocked PDF...");
      const buffer = new ArrayBuffer(unlockedBytes.byteLength);
      new Uint8Array(buffer).set(unlockedBytes);
      const blob = new Blob([buffer], { type: "application/pdf" });

      if (selectedPdf.pageCount !== null) {
        const unlockedPdf = await loadPdfDocument(
          new File([blob], outputFileName, { type: "application/pdf" }),
        );

        if (unlockedPdf.numPages !== selectedPdf.pageCount) {
          await unlockedPdf.destroy();
          throw new Error("Unlocked PDF page count changed.");
        }

        await unlockedPdf.destroy();
      }

      const nextFile = {
        url: URL.createObjectURL(blob),
        fileName: outputFileName,
      };

      setGeneratedFile(nextFile);
      setProgress("PDF unlocked successfully.");
      analytics.trackConversionCompleted({
        mode:
          selectedPdf.protectionType === "restrictions_only"
            ? "remove_restrictions"
            : "decrypt",
        outputFormat: "pdf",
        status: "success",
        protectionType: selectedPdf.protectionType,
        passwordType:
          selectedPdf.protectionType === "restrictions_only" ? "owner" : "user",
      });
      analytics.trackDownloadStarted({ outputFormat: "pdf" });
      triggerDownload(nextFile.url, nextFile.fileName);
      analytics.trackDownloadCompleted({ outputFormat: "pdf" });
    } catch (caughtError) {
      setError(
        caughtError instanceof QpdfPasswordError
          ? selectedPdf.protectionType === "restrictions_only"
            ? "The owner password is incorrect or the restrictions could not be removed."
            : "The password is incorrect or the PDF could not be unlocked."
          : "The PDF was not downloaded because its encryption or restrictions could not be removed safely.",
      );
      analytics.trackError({
        errorCode:
          caughtError instanceof QpdfPasswordError
            ? "incorrect_password"
            : "unlock_failed",
        protectionType: selectedPdf.protectionType,
        passwordType:
          selectedPdf.protectionType === "restrictions_only" ? "owner" : "user",
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
          description="Upload one protected or restricted PDF file and unlock it locally in your browser."
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

        {selectedPdf && selectedPdf.protectionType !== "unprotected" ? (
          <StatusNotice>
            {selectedPdf.protectionType === "restrictions_only"
              ? "This PDF opens without a password but contains usage restrictions. Enter the valid owner password to remove them."
              : "Open password required. Enter the valid PDF password to unlock this file."}
          </StatusNotice>
        ) : null}

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {selectedPdf?.protectionType === "restrictions_only"
                  ? "Owner password unlock"
                  : "Password unlock"}
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
              label={
                selectedPdf?.protectionType === "restrictions_only"
                  ? "Owner password"
                  : "PDF password"
              }
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
              {selectedPdf?.protectionType === "restrictions_only"
                ? "This PDF opens without a password but has restrictions. Enter the valid owner password to remove them."
                : "Enter the current PDF password. LiftPDF cannot unlock a protected PDF without the correct password."}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              You must know the valid PDF password or have permission to remove
              its restrictions.
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
              Remove encryption or restrictions when you know the valid
              password.
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
                Decryption runs locally. LiftPDF cannot see your PDF or
                password.
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
              selectedPdf?.pageCount
                ? String(selectedPdf.pageCount)
                : selectedPdf?.protectionType === "open_password"
                  ? "Open password required"
                  : "0"
            }
          />
          <PdfSummaryRow
            label="File size"
            value={selectedPdf ? formatFileSize(selectedPdf.file.size) : "-"}
          />
          <PdfSummaryRow
            label="Encryption"
            value={
              selectedPdf
                ? selectedPdf.protectionType === "unprotected"
                  ? "None"
                  : "Present"
                : "-"
            }
          />
          <PdfSummaryRow
            label="Restriction status"
            value={formatRestrictionStatus(selectedPdf)}
          />
          <PdfSummaryRow
            label="Password type required"
            value={formatPasswordType(selectedPdf)}
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
            disabled={
              !selectedPdf ||
              selectedPdf.protectionType === "unprotected" ||
              isReadingPdf ||
              isUnlocking
            }
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

function formatRestrictionStatus(selectedPdf: SelectedPdf | null) {
  if (!selectedPdf) {
    return "-";
  }

  if (selectedPdf.protectionType === "unprotected") {
    return "None";
  }

  if (selectedPdf.protectionType === "open_password") {
    return "Open password required";
  }

  const permissions = selectedPdf.permissions;

  if (
    permissions?.printing === "full" &&
    permissions.allowExtraction === true &&
    permissions.modification === "all"
  ) {
    return "Encrypted, no limited permissions detected";
  }

  return "Usage restrictions detected";
}

function formatPasswordType(selectedPdf: SelectedPdf | null) {
  if (!selectedPdf) {
    return "-";
  }

  if (selectedPdf.protectionType === "restrictions_only") {
    return "Owner password";
  }

  if (selectedPdf.protectionType === "open_password") {
    return "PDF password";
  }

  return "None";
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
