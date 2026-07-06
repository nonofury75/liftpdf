"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  FileCheck2,
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
    setPassword("");
    setError(null);
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
        return;
      }

      setSelectedPdf({
        file,
        pageCount: null,
        isProtected: true,
      });
    } catch {
      setSelectedPdf(null);
      setError("This PDF could not be read. Please choose another file.");
    } finally {
      setIsReadingPdf(false);
    }
  }

  async function handleUnlockPdf() {
    if (!selectedPdf) {
      setError("Please choose a PDF file before unlocking it.");
      return;
    }

    if (!selectedPdf.isProtected) {
      setError("This PDF does not appear to be password protected.");
      return;
    }

    if (!password) {
      setError("Please enter the PDF password.");
      return;
    }

    if (typeof crossOriginIsolated !== "undefined" && !crossOriginIsolated) {
      setError(
        "This browser session cannot run the PDF unlock engine. Please reload the page and try again.",
      );
      return;
    }

    setError(null);
    setIsUnlocking(true);
    clearGeneratedFile();

    try {
      const fileBuffer = await selectedPdf.file.arrayBuffer();
      const unlockedBytes = await unlockPdfWithPassword(
        new Uint8Array(fileBuffer),
        password,
      );
      const buffer = new ArrayBuffer(unlockedBytes.byteLength);
      new Uint8Array(buffer).set(unlockedBytes);
      const blob = new Blob([buffer], { type: "application/pdf" });
      const nextFile = {
        url: URL.createObjectURL(blob),
        fileName: outputFileName,
      };

      setGeneratedFile(nextFile);
      triggerDownload(nextFile.url, nextFile.fileName);
    } catch (caughtError) {
      setError(
        caughtError instanceof QpdfPasswordError
          ? "The password is incorrect or the PDF could not be unlocked."
          : "The PDF could not be unlocked. Please try another file.",
      );
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
    clearGeneratedFile();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PdfUploadZone
          multiple={false}
          title="Drop your protected PDF here"
          description="Upload one password-protected PDF file and unlock it locally in your browser."
          buttonLabel="Choose PDF file"
          onFilesSelected={handleFilesSelected}
        />

        {error ? (
          <p
            id="unlock-pdf-error"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {isReadingPdf ? (
          <p className="rounded-md bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
            Reading PDF...
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
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Password unlock
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your PDF is unlocked locally in your browser. Your password and
                file are never uploaded.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
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

      <aside className="h-fit rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Unlock summary</h2>
        <div className="mt-5 space-y-3 text-sm">
          <PdfSummaryRow
            label="PDF file"
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
            label="Protected"
            value={selectedPdf?.isProtected ? "Yes" : "No"}
          />
          <PdfSummaryRow label="Output" value={outputFileName} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button type="button" onClick={handleUnlockPdf} disabled={isUnlocking}>
            {isUnlocking ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileCheck2 className="size-4" aria-hidden="true" />
            )}
            Unlock PDF
          </Button>

          {generatedFile ? (
            <Button asChild variant="outline">
              <a href={generatedFile.url} download={generatedFile.fileName}>
                <Download className="size-4" aria-hidden="true" />
                Download PDF
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setError("Unlock your PDF before downloading.")}
            >
              <Download className="size-4" aria-hidden="true" />
              Download PDF
            </Button>
          )}

          <Button type="button" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {generatedFile ? (
          <p
            className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
            aria-live="polite"
          >
            Your unlocked PDF is ready. The download has started automatically.
          </p>
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
