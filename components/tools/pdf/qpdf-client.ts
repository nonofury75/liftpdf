type QpdfFileSystem = {
  writeFile: (path: string, data: Uint8Array) => void;
  readFile: (path: string) => Uint8Array;
  unlink?: (path: string) => void;
};

type QpdfModule = {
  FS: QpdfFileSystem;
  callMain: (args: string[]) => number;
};

type QpdfFactory = {
  default: (options: {
    locateFile: (fileName: string) => string;
    print: (message?: unknown) => void;
    printErr: (message?: unknown) => void;
  }) => Promise<QpdfModule>;
};

let qpdfPromise: Promise<QpdfModule> | null = null;
let qpdfLastMessages: string[] = [];

export class QpdfPasswordError extends Error {
  constructor() {
    super("The password is incorrect or the PDF could not be unlocked.");
    this.name = "QpdfPasswordError";
  }
}

export type QpdfCompressionMode = "preserve" | "balanced" | "strong";
export type PdfPrintingPermission = "full" | "low" | "none";
export type PdfModificationPermission =
  | "all"
  | "annotate"
  | "form"
  | "assembly"
  | "none";

export type ProtectPdfOptions = {
  userPassword: string;
  ownerPassword: string;
  printing: PdfPrintingPermission;
  allowExtraction: boolean;
  modification: PdfModificationPermission;
};

export type QpdfEncryptionInspection = {
  encrypted: boolean;
  aes256: boolean;
  revision: number | null;
  version: number | null;
  keyLength: number | null;
  permissions: {
    rawP: number | null;
    printing: PdfPrintingPermission | null;
    allowExtraction: boolean | null;
    modification: PdfModificationPermission | null;
    accessibility: boolean | null;
  };
};

// pdf-lib and PDF.js do not write encrypted PDFs. QPDF WASM is used here
// because it applies real PDF password encryption in the browser.
export async function encryptPdfWithPassword(
  bytes: Uint8Array,
  password: string,
) {
  return protectPdfWithOptions(bytes, {
    userPassword: password,
    ownerPassword: password,
    printing: "full",
    allowExtraction: true,
    modification: "all",
  });
}

export async function protectPdfWithOptions(
  bytes: Uint8Array,
  options: ProtectPdfOptions,
) {
  const qpdf = await loadQpdf();
  const fileId = createFileId();
  const inputPath = `/input-${fileId}.pdf`;
  const outputPath = `/protected-${fileId}.pdf`;

  try {
    qpdfLastMessages = [];
    qpdf.FS.writeFile(inputPath, bytes);
    const exitCode = qpdf.callMain([
      "--encrypt",
      options.userPassword,
      options.ownerPassword,
      "256",
      `--print=${options.printing}`,
      `--extract=${options.allowExtraction ? "y" : "n"}`,
      `--modify=${options.modification}`,
      "--",
      inputPath,
      outputPath,
    ]);

    if (exitCode !== 0) {
      throw new Error("QPDF encryption failed.");
    }

    const outputBytes = qpdf.FS.readFile(outputPath);
    const inspection = inspectQpdfEncryption(outputBytes);

    if (!matchesRequestedPermissions(inspection, options)) {
      throw new Error("The requested PDF permissions could not be verified.");
    }

    return outputBytes;
  } finally {
    removeQpdfFile(qpdf, inputPath);
    removeQpdfFile(qpdf, outputPath);
  }
}

export async function unlockPdfWithPassword(bytes: Uint8Array, password: string) {
  const qpdf = await loadQpdf();
  const fileId = createFileId();
  const inputPath = `/locked-${fileId}.pdf`;
  const outputPath = `/unlocked-${fileId}.pdf`;

  try {
    qpdf.FS.writeFile(inputPath, bytes);
    const exitCode = qpdf.callMain([
      `--password=${password}`,
      "--decrypt",
      inputPath,
      outputPath,
    ]);

    if (exitCode !== 0) {
      throw new QpdfPasswordError();
    }

    const unlockedBytes = qpdf.FS.readFile(outputPath);

    if (hasPdfEncryptionDictionary(unlockedBytes)) {
      throw new Error("QPDF produced an encrypted output file.");
    }

    return unlockedBytes;
  } finally {
    removeQpdfFile(qpdf, inputPath);
    removeQpdfFile(qpdf, outputPath);
  }
}

export async function compressPdfWithQpdf(
  bytes: Uint8Array,
  mode: QpdfCompressionMode,
  options: { removeMetadata?: boolean } = {},
) {
  const qpdf = await loadQpdf();
  const fileId = createFileId();
  const inputPath = `/compress-input-${fileId}.pdf`;
  const outputPath = `/compress-output-${fileId}.pdf`;

  try {
    qpdf.FS.writeFile(inputPath, bytes);
    const exitCode = qpdf.callMain([
      ...getCompressionArgs(mode, options),
      "--",
      inputPath,
      outputPath,
    ]);

    if (exitCode !== 0) {
      throw new Error(
        `QPDF compression failed.${formatQpdfMessages(qpdfLastMessages)}`,
      );
    }

    return qpdf.FS.readFile(outputPath);
  } finally {
    removeQpdfFile(qpdf, inputPath);
    removeQpdfFile(qpdf, outputPath);
  }
}

export function hasPdfEncryptionDictionary(bytes: Uint8Array) {
  return new TextDecoder("latin1").decode(bytes).includes("/Encrypt");
}

export function inspectQpdfEncryption(bytes: Uint8Array): QpdfEncryptionInspection {
  const source = new TextDecoder("latin1").decode(bytes);
  const rawP = parseInteger(source, /\/P\s+(-?\d+)/);
  const revision = parseInteger(source, /\/R\s+(\d+)/);
  const version = parseInteger(source, /\/V\s+(\d+)/);
  const keyLength =
    source.includes("/Filter /Standard") && source.includes("/Length 256")
      ? 256
      : parseInteger(source, /\/Length\s+(\d+)/);

  return {
    encrypted: source.includes("/Encrypt"),
    aes256: revision === 6 && version === 5 && source.includes("/AESV3"),
    revision,
    version,
    keyLength,
    permissions: {
      rawP,
      ...decodeQpdfPermissionBits(rawP),
    },
  };
}

export function getExpectedQpdfPermissionValue(options: {
  printing: PdfPrintingPermission;
  allowExtraction: boolean;
  modification: PdfModificationPermission;
}) {
  const printDelta = {
    full: 0,
    low: 2048,
    none: 2052,
  } satisfies Record<PdfPrintingPermission, number>;
  const modifyDelta = {
    all: 0,
    annotate: 8,
    form: 40,
    assembly: 296,
    none: 1320,
  } satisfies Record<PdfModificationPermission, number>;

  return (
    -4 -
    printDelta[options.printing] -
    (options.allowExtraction ? 0 : 16) -
    modifyDelta[options.modification]
  );
}

async function loadQpdf() {
  if (!qpdfPromise) {
    const qpdfScriptUrl = "/qpdf/qpdf.js";
    const qpdfModule = (await import(
      /* webpackIgnore: true */ qpdfScriptUrl
    )) as QpdfFactory;

    qpdfPromise = qpdfModule.default({
      locateFile: (fileName) => `/qpdf/${fileName}`,
      print: () => undefined,
      printErr: (message) => {
        qpdfLastMessages.push(String(message));
      },
    });
  }

  return qpdfPromise;
}

function formatQpdfMessages(messages: string[]) {
  if (!messages.length) {
    return "";
  }

  return ` ${messages.slice(-3).join(" ")}`;
}

function removeQpdfFile(qpdf: QpdfModule, path: string) {
  try {
    qpdf.FS.unlink?.(path);
  } catch {
    // QPDF may fail before creating the output file; cleanup is best-effort.
  }
}

function getCompressionArgs(
  mode: QpdfCompressionMode,
  options: { removeMetadata?: boolean },
) {
  const sharedArgs = [
    "--object-streams=generate",
    "--compress-streams=y",
    "--recompress-flate",
    "--compression-level=9",
    "--deterministic-id",
  ];

  if (mode === "preserve") {
    return withOptionalMetadataRemoval(sharedArgs, options);
  }

  if (mode === "balanced") {
    return withOptionalMetadataRemoval([
      ...sharedArgs,
      "--optimize-images",
      "--jpeg-quality=68",
      "--oi-min-width=240",
      "--oi-min-height=240",
    ], options);
  }

  return withOptionalMetadataRemoval([
    ...sharedArgs,
    "--optimize-images",
    "--jpeg-quality=58",
    "--oi-min-width=120",
    "--oi-min-height=120",
  ], options);
}

function withOptionalMetadataRemoval(
  args: string[],
  options: { removeMetadata?: boolean },
) {
  if (!options.removeMetadata) {
    return args;
  }

  return [
    ...args,
    "--remove-metadata",
    "--remove-info",
  ];
}

function matchesRequestedPermissions(
  inspection: QpdfEncryptionInspection,
  options: ProtectPdfOptions,
) {
  return (
    inspection.encrypted &&
    inspection.aes256 &&
    inspection.permissions.rawP ===
      getExpectedQpdfPermissionValue({
        printing: options.printing,
        allowExtraction: options.allowExtraction,
        modification: options.modification,
      }) &&
    inspection.permissions.accessibility === true
  );
}

function decodeQpdfPermissionBits(rawP: number | null) {
  if (rawP === null) {
    return {
      printing: null,
      allowExtraction: null,
      modification: null,
      accessibility: null,
    };
  }

  const unsignedPermissions = rawP >>> 0;
  const hasBit = (bitPosition: number) =>
    Boolean(unsignedPermissions & (1 << (bitPosition - 1)));
  const canPrint = hasBit(3);
  const canModify = hasBit(4);
  const canExtract = hasBit(5);
  const canAnnotate = hasBit(6);
  const canFillForms = hasBit(9);
  const canExtractForAccessibility = hasBit(10);
  const canAssemble = hasBit(11);
  const canPrintHighQuality = hasBit(12);
  const printing: PdfPrintingPermission = canPrint
    ? canPrintHighQuality
      ? "full"
      : "low"
    : "none";
  let modification: PdfModificationPermission = "none";

  if (canModify) {
    modification = "all";
  } else if (canAnnotate) {
    modification = "annotate";
  } else if (canFillForms) {
    modification = "form";
  } else if (canAssemble) {
    modification = "assembly";
  }

  return {
    printing,
    allowExtraction: canExtract,
    modification,
    accessibility: canExtractForAccessibility,
  };
}

function parseInteger(source: string, pattern: RegExp) {
  const match = pattern.exec(source);
  return match ? Number(match[1]) : null;
}

function createFileId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
