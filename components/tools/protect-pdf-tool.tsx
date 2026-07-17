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
  protectPdfWithOptions,
  type PdfModificationPermission,
  type PdfPrintingPermission,
} from "@/components/tools/pdf/qpdf-client";
import {
  summarizeFilesForAnalytics,
  useToolAnalytics,
} from "@/hooks/use-tool-analytics";
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
type CopyingPermission = "allowed" | "not_allowed";

const outputFileName = "protected.pdf";
const printingOptions = [
  { value: "full", label: "Full quality" },
  { value: "low", label: "Low resolution only" },
  { value: "none", label: "Not allowed" },
] satisfies Array<{ value: PdfPrintingPermission; label: string }>;
const editingOptions = [
  { value: "all", label: "Full editing" },
  { value: "annotate", label: "Comments and form filling" },
  { value: "form", label: "Form filling and signing" },
  { value: "assembly", label: "Page assembly only" },
  { value: "none", label: "No editing" },
] satisfies Array<{ value: PdfModificationPermission; label: string }>;

export function ProtectPdfTool() {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [advancedPermissionsEnabled, setAdvancedPermissionsEnabled] =
    useState(false);
  const [ownerPassword, setOwnerPassword] = useState("");
  const [confirmOwnerPassword, setConfirmOwnerPassword] = useState("");
  const [printingPermission, setPrintingPermission] =
    useState<PdfPrintingPermission>("full");
  const [copyingPermission, setCopyingPermission] =
    useState<CopyingPermission>("allowed");
  const [editingPermission, setEditingPermission] =
    useState<PdfModificationPermission>("all");
  const [error, setError] = useState<string | null>(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isProtecting, setIsProtecting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [generatedFile, setGeneratedFile] = useState<GeneratedFile | null>(null);

  const generatedFileRef = useRef<GeneratedFile | null>(null);
  const analytics = useToolAnalytics({
    tool: "Protect PDF",
    route: "/protect-pdf",
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

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );
  const effectivePrinting = advancedPermissionsEnabled
    ? printingPermission
    : "full";
  const effectiveCopying = advancedPermissionsEnabled
    ? copyingPermission
    : "allowed";
  const effectiveEditing = advancedPermissionsEnabled
    ? editingPermission
    : "all";

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
    setError(null);
    setProgress(null);
    setIsReadingPdf(true);

    try {
      const fileBytes = new Uint8Array(await file.arrayBuffer());

      if (hasPdfEncryptionDictionary(fileBytes)) {
        setError("This PDF is already protected. Please choose an unlocked PDF.");
        analytics.trackError({ errorCode: "already_protected" });
        return;
      }

      const pdf = await loadPdfDocument(file);
      setSelectedPdf({
        file,
        pageCount: pdf.numPages,
      });
      analytics.trackUploadCompleted({
        ...summarizeFilesForAnalytics([file]),
        pageCount: pdf.numPages,
        outputFormat: "pdf",
      });
      await pdf.destroy();
    } catch (caughtError) {
      setSelectedPdf(null);
      setError(
        isPasswordProtectedError(caughtError)
          ? "This PDF is already protected. Please choose an unlocked PDF."
          : "This PDF could not be read. Please choose another file.",
      );
      analytics.trackError({ errorCode: "pdf_read_failed" });
    } finally {
      setIsReadingPdf(false);
    }
  }

  async function handleProtectPdf() {
    if (!selectedPdf) {
      setError("Please choose a PDF file before protecting it.");
      analytics.trackError({ errorCode: "missing_file" });
      return;
    }

    const validationError = validatePassword({
      password,
      confirmPassword,
      advancedPermissionsEnabled,
      ownerPassword,
      confirmOwnerPassword,
    });

    if (validationError) {
      setError(validationError);
      analytics.trackError({ errorCode: "password_validation_failed" });
      return;
    }

    if (typeof crossOriginIsolated !== "undefined" && !crossOriginIsolated) {
      setError(
        "This browser session cannot run the PDF encryption engine. Please reload the page and try again.",
      );
      analytics.trackError({ errorCode: "browser_not_isolated" });
      return;
    }

    setError(null);
    setIsProtecting(true);
    setProgress("Preparing PDF...");
    clearGeneratedFile();
    analytics.trackConversionStarted({
      mode: advancedPermissionsEnabled ? "encrypt_with_permissions" : "encrypt",
      outputFormat: "pdf",
      pageCount: selectedPdf.pageCount,
      advancedPermissionsEnabled,
      printingMode: effectivePrinting,
      copyingAllowed: effectiveCopying === "allowed",
      editingPreset: effectiveEditing,
    });

    try {
      const fileBuffer = await selectedPdf.file.arrayBuffer();
      setProgress("Encrypting PDF...");
      const encryptedBytes = advancedPermissionsEnabled
        ? await protectPdfWithOptions(new Uint8Array(fileBuffer), {
            userPassword: password,
            ownerPassword,
            printing: printingPermission,
            allowExtraction: copyingPermission === "allowed",
            modification: editingPermission,
          })
        : await encryptPdfWithPassword(new Uint8Array(fileBuffer), password);

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
      analytics.trackConversionCompleted({
        mode: advancedPermissionsEnabled
          ? "encrypt_with_permissions"
          : "encrypt",
        outputFormat: "pdf",
        pageCount: selectedPdf.pageCount,
        advancedPermissionsEnabled,
        printingMode: effectivePrinting,
        copyingAllowed: effectiveCopying === "allowed",
        editingPreset: effectiveEditing,
        status: "success",
      });
      analytics.trackDownloadStarted({ outputFormat: "pdf" });
      triggerDownload(nextFile.url, nextFile.fileName);
      analytics.trackDownloadCompleted({ outputFormat: "pdf" });
    } catch {
      setError(
        "The PDF was not downloaded because the requested permissions could not be verified.",
      );
      analytics.trackError({ errorCode: "encryption_failed" });
      setProgress(null);
    } finally {
      setIsProtecting(false);
    }
  }

  function handleReset() {
    setSelectedPdf(null);
    setPassword("");
    setConfirmPassword("");
    setOwnerPassword("");
    setConfirmOwnerPassword("");
    setShowPassword(false);
    setAdvancedPermissionsEnabled(false);
    setPrintingPermission("full");
    setCopyingPermission("allowed");
    setEditingPermission("all");
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

            <details
              className="rounded-2xl border border-border bg-background p-4"
              open={advancedPermissionsEnabled}
              onToggle={(event) => {
                const isOpen = event.currentTarget.open;
                clearGeneratedFile();
                setError(null);
                setAdvancedPermissionsEnabled(isOpen);
              }}
            >
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                Advanced permissions
              </summary>
              <div className="mt-4 space-y-5">
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
                  PDF permissions are respected by compatible PDF readers, but
                  they are not absolute DRM protection. AES-256 encryption and
                  the open password provide the real protection.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <PasswordField
                    id="protect-owner-password"
                    label="Owner password"
                    value={ownerPassword}
                    showPassword={showPassword}
                    describedBy="protect-owner-password-help protect-pdf-error"
                    onChange={(value) => {
                      clearGeneratedFile();
                      setError(null);
                      setOwnerPassword(value);
                    }}
                    onToggleShow={() => setShowPassword((current) => !current)}
                  />
                  <PasswordField
                    id="protect-confirm-owner-password"
                    label="Confirm owner password"
                    value={confirmOwnerPassword}
                    showPassword={showPassword}
                    describedBy="protect-owner-password-help protect-pdf-error"
                    onChange={(value) => {
                      clearGeneratedFile();
                      setError(null);
                      setConfirmOwnerPassword(value);
                    }}
                    onToggleShow={() => setShowPassword((current) => !current)}
                  />
                </div>
                <p
                  id="protect-owner-password-help"
                  className="text-sm leading-6 text-muted-foreground"
                >
                  Use a separate owner password to change permissions later.
                  Keep it somewhere safe; LiftPDF does not store it.
                </p>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-semibold text-foreground">
                    Printing
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {printingOptions.map((option) => (
                      <PermissionOption
                        key={option.value}
                        label={option.label}
                        selected={printingPermission === option.value}
                        onClick={() => {
                          clearGeneratedFile();
                          setPrintingPermission(option.value);
                        }}
                      />
                    ))}
                  </div>
                </fieldset>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-semibold text-foreground">
                    Copying text and images
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { value: "allowed", label: "Allowed" },
                      { value: "not_allowed", label: "Not allowed" },
                    ].map((option) => (
                      <PermissionOption
                        key={option.value}
                        label={option.label}
                        selected={copyingPermission === option.value}
                        onClick={() => {
                          clearGeneratedFile();
                          setCopyingPermission(option.value as CopyingPermission);
                        }}
                      />
                    ))}
                  </div>
                </fieldset>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-semibold text-foreground">
                    Editing
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {editingOptions.map((option) => (
                      <PermissionOption
                        key={option.value}
                        label={option.label}
                        selected={editingPermission === option.value}
                        onClick={() => {
                          clearGeneratedFile();
                          setEditingPermission(option.value);
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Page assembly includes actions such as rotating or
                    reordering pages in compatible readers.
                  </p>
                </fieldset>
              </div>
            </details>
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
                Your file, passwords and permission settings remain in your
                browser.
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
          <PdfSummaryRow
            label="Printing"
            value={formatPrintingPermission(effectivePrinting)}
          />
          <PdfSummaryRow
            label="Copying"
            value={effectiveCopying === "allowed" ? "Allowed" : "Not allowed"}
          />
          <PdfSummaryRow
            label="Editing"
            value={formatModificationPermission(effectiveEditing)}
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

function validatePassword({
  advancedPermissionsEnabled,
  confirmOwnerPassword,
  confirmPassword,
  ownerPassword,
  password,
}: {
  password: string;
  confirmPassword: string;
  advancedPermissionsEnabled: boolean;
  ownerPassword: string;
  confirmOwnerPassword: string;
}) {
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  if (!advancedPermissionsEnabled) {
    return null;
  }

  if (ownerPassword.length < 6) {
    return "Owner password must be at least 6 characters.";
  }

  if (ownerPassword !== confirmOwnerPassword) {
    return "Owner passwords do not match.";
  }

  if (ownerPassword === password) {
    return "Owner password must be different from the open password when advanced permissions are enabled.";
  }

  return null;
}

function formatPrintingPermission(value: PdfPrintingPermission) {
  return (
    printingOptions.find((option) => option.value === value)?.label ?? "Allowed"
  );
}

function formatModificationPermission(value: PdfModificationPermission) {
  return editingOptions.find((option) => option.value === value)?.label ?? "Allowed";
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

function PermissionOption({
  label,
  onClick,
  selected,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
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
