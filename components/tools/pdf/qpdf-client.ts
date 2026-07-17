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

// pdf-lib and PDF.js do not write encrypted PDFs. QPDF WASM is used here
// because it applies real PDF password encryption in the browser.
export async function encryptPdfWithPassword(
  bytes: Uint8Array,
  password: string,
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
      password,
      password,
      "256",
      "--",
      inputPath,
      outputPath,
    ]);

    if (exitCode !== 0) {
      throw new Error("QPDF encryption failed.");
    }

    return qpdf.FS.readFile(outputPath);
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
) {
  const qpdf = await loadQpdf();
  const fileId = createFileId();
  const inputPath = `/compress-input-${fileId}.pdf`;
  const outputPath = `/compress-output-${fileId}.pdf`;

  try {
    qpdf.FS.writeFile(inputPath, bytes);
    const exitCode = qpdf.callMain([
      ...getCompressionArgs(mode),
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

function getCompressionArgs(mode: QpdfCompressionMode) {
  const sharedArgs = [
    "--object-streams=generate",
    "--compress-streams=y",
    "--recompress-flate",
    "--compression-level=9",
    "--deterministic-id",
  ];

  if (mode === "preserve") {
    return sharedArgs;
  }

  if (mode === "balanced") {
    return [
      ...sharedArgs,
      "--optimize-images",
      "--jpeg-quality=68",
      "--oi-min-width=240",
      "--oi-min-height=240",
    ];
  }

  return [
    ...sharedArgs,
    "--optimize-images",
    "--jpeg-quality=58",
    "--oi-min-width=120",
    "--oi-min-height=120",
    "--remove-metadata",
    "--remove-info",
  ];
}

function createFileId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
