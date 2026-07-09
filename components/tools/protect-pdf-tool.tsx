"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Download,
  FileCheck2,
  FileLock2,
  Loader2,
  LockKeyhole,
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
  encryptPdfWithPassword,
  hasPdfEncryptionDictionary,
} from "@/components/tools/pdf/qpdf-client";
import { cn } from "@/lib/utils";

type SelectedPdf = {
  file: File;
  pageCount: number;
};

type GeneratedFile = {
  url: string;
  fileName: string;
};

type PasswordStrength = "Weak" | "Medium" | "Strong";

const outputFileName = "protected.pdf";

export function ProtectPdfTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isProtecting, setIsProtecting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
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

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );

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
    setError(null);
    setProgress(null);
    setIsReadingPdf(true);

    try {
      const fileBytes = new Uint8Array(await file.arrayBuffer());

      if (hasPdfEncryptionDictionary(fileBytes)) {
        setError("This PDF is already protected. Please choose an unlocked PDF.");
        return;
      }

      const pdf = await loadPdfDocument(file);
      setSelectedPdf({
        file,
        pageCount: pdf.numPages,
      });
      await pdf.destroy();
    } catch (caughtError) {
      setSelectedPdf(null);
      setError(
        isPasswordProtectedError(caughtError)
          ? "This PDF is already protected. Please choose an unlocked PDF."
          : "This PDF could not be read. Please choose another file.",
      );
    } finally {
      setIsReadingPdf(false);
    }
  }

  async function handleProtectPdf() {
    if (!selectedPdf) {
      setError("Please choose a PDF file before protecting it.");
      return;
    }

    const validationError = validatePassword(password, confirmPassword);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (typeof crossOriginIsolated !== "undefined" && !crossOriginIsolated) {
      setError(
        "This browser session cannot run the PDF encryption engine. Please reload the page and try again.",
      );
      return;
    }

    setError(null);
    setIsProtecting(true);
    setProgress("Preparing PDF...");
    clearGeneratedFile();

    try {
      const fileBuffer = await selectedPdf.file.arrayBuffer();
      setProgress("Encrypting PDF...");
      const encryptedBytes = await encryptPdfWithPassword(
        new Uint8Array(fileBuffer),
        password,
      );

      if (!hasPdfEncryptionDictionary(encryptedBytes)) {
        throw new Error("The exported PDF was not encrypted.");
      }

      setProgress("Generating encrypted PDF...");
      const buffer = new ArrayBuffer(encryptedBytes.byteLength);
      new Uint8Array(buffer).set(encryptedBytes);
      const blob = new Blob([buffer], { type: "application/pdf" });
      const nextFile = {
        url: URL.createObjectURL(blob),
        fileName: outputFileName,
      };

      setGeneratedFile(nextFile);
      setProgress("PDF protected successfully.");
      triggerDownload(nextFile.url, nextFile.fileName);
    } catch {
      setError("The PDF could not be encrypted. Please try another file.");
      setProgress(null);
    } finally {
      setIsProtecting(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setError(null);
    setIsReadingPdf(false);
    setIsProtecting(false);
    setProgress(null);
    clearGeneratedFile();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your PDF file here"
          description="Upload one unlocked PDF file and add a password locally in your browser."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        {error ? (
          <StatusNotice id="protect-pdf-error" tone="error">
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
                Password protection
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your PDF is encrypted locally in your browser with QPDF WASM.
                Your password and file are never uploaded.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                <LockKeyhole className="size-3.5 text-primary" aria-hidden="true" />
                Private by Design
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            <PasswordField
              id="protect-password"
              label="Password"
              value={password}
              showPassword={showPassword}
              describedBy="protect-password-help protect-pdf-error"
              onChange={(value) => {
                clearGeneratedFile();
                setError(null);
                setPassword(value);
              }}
              onToggleShow={() => setShowPassword((current) => !current)}
            />
            <PasswordField
              id="protect-confirm-password"
              label="Confirm password"
              value={confirmPassword}
              showPassword={showPassword}
              describedBy="protect-password-help protect-pdf-error"
              onChange={(value) => {
                clearGeneratedFile();
                setError(null);
                setConfirmPassword(value);
              }}
              onToggleShow={() => setShowPassword((current) => !current)}
            />

            <div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-muted-foreground">
                  Password strength
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    passwordStrength === "Strong" && "text-green-700",
                    passwordStrength === "Medium" && "text-primary",
                    passwordStrength === "Weak" && "text-red-700",
                  )}
                  aria-live="polite"
                >
                  {passwordStrength}
                </span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                aria-hidden="true"
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    passwordStrength === "Weak" && "w-1/3 bg-red-600",
                    passwordStrength === "Medium" && "w-2/3 bg-primary",
                    passwordStrength === "Strong" && "w-full bg-green-700",
                  )}
                />
              </div>
              <p
                id="protect-password-help"
                className="mt-2 text-sm leading-6 text-muted-foreground"
              >
                Use at least 6 characters. A stronger password mixes uppercase,
                lowercase, numbers and symbols.
              </p>
            </div>
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
              Protect settings
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Add an open password to the selected PDF.
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
                Encryption runs locally. The PDF and password are not sent to a
                LiftPDF server.
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
            value={selectedPdf ? String(selectedPdf.pageCount) : "0"}
          />
          <PdfSummaryRow
            label="File size"
            value={selectedPdf ? formatFileSize(selectedPdf.file.size) : "-"}
          />
          <PdfSummaryRow label="Encryption" value="AES 256-bit" />
          <PdfSummaryRow label="Password strength" value={passwordStrength} />
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
            onClick={handleProtectPdf}
            disabled={!selectedPdf || isReadingPdf || isProtecting}
            className="shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            {isProtecting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            {isProtecting ? "Protecting PDF..." : "Protect PDF"}
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a href={generatedFile.url} download={generatedFile.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download PDF
              </a>
            </Button>
          ) : null}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            {generatedFile ? "Protect another PDF" : "Reset"}
          </Button>
        </div>

        {generatedFile ? (
          <div
            className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            aria-live="polite"
          >
            <p className="flex items-center gap-2 font-semibold">
              <FileCheck2 className="size-4" aria-hidden="true" />
              PDF protected successfully
            </p>
            <p className="mt-1 leading-6">
              The encrypted PDF was generated and the download started
              automatically.
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function validatePassword(password: string, confirmPassword: string) {
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 4) {
    return "Strong";
  }

  if (score >= 2) {
    return "Medium";
  }

  return "Weak";
}

function isPasswordProtectedError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /password|encrypted/i.test(message);
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
