import JSZip from "jszip";
import type { PDFDocumentProxy } from "pdfjs-dist";

export type PdfImageFormat = "jpg" | "png" | "webp" | "tiff";
export type PdfImageResolution = "standard" | "high";

export type PdfImageExportOptions = {
  format: PdfImageFormat;
  quality: number;
  resolution: PdfImageResolution;
  pageNumbers?: number[];
  transparentBackground?: boolean;
  onProgress?: (pageNumber: number, pageCount: number) => void;
  onStageChange?: (stage: PdfImageExportStage) => void;
  signal?: AbortSignal;
};

export type PdfImageExportResult = {
  blob: Blob;
  fileName: string;
};

export type PdfImageExportStage =
  | "preparing_pdf"
  | "rendering_pages"
  | "preparing_zip"
  | "generating_download";

export type PdfImageWorkloadClass = "SAFE" | "HEAVY" | "VERY_HEAVY";

export type PdfImagePageDimensions = {
  pageNumber: number;
  width: number;
  height: number;
};

export type PdfImageWorkloadEstimate = {
  className: PdfImageWorkloadClass;
  pageCount: number;
  scale: number;
  maxCanvasBytes: number;
  estimatedCanvasBytes: number;
  deviceMemoryGb?: number;
};

const resolutionScale: Record<PdfImageResolution, number> = {
  standard: 2,
  high: 3,
};

const mimeByFormat: Record<Exclude<PdfImageFormat, "tiff">, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function exportPdfPagesAsImages({
  pdf,
  options,
  singlePageFileName,
  zipFileName,
}: {
  pdf: PDFDocumentProxy;
  options: PdfImageExportOptions;
  singlePageFileName: string;
  zipFileName: string;
}): Promise<PdfImageExportResult> {
  const pageNumbers =
    options.pageNumbers ?? Array.from({ length: pdf.numPages }, (_, index) => index + 1);

  throwIfAborted(options.signal);
  options.onStageChange?.("preparing_pdf");

  if (pageNumbers.length === 1) {
    const [pageNumber] = pageNumbers;
    options.onStageChange?.("rendering_pages");
    options.onProgress?.(1, 1);
    return {
      blob: await renderPdfPageToImageBlob(pdf, pageNumber, options),
      fileName:
        pageNumber === 1
          ? singlePageFileName
          : `page-${pageNumber}.${options.format}`,
    };
  }

  const zip = new JSZip();

  for (const [index, pageNumber] of pageNumbers.entries()) {
    throwIfAborted(options.signal);
    options.onStageChange?.("rendering_pages");
    options.onProgress?.(index + 1, pageNumbers.length);
    const blob = await renderPdfPageToImageBlob(pdf, pageNumber, options);
    zip.file(`page-${pageNumber}.${options.format}`, blob, {
      compression: options.format === "jpg" ? "STORE" : "DEFLATE",
    });
  }

  throwIfAborted(options.signal);
  options.onStageChange?.("preparing_zip");
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  options.onStageChange?.("generating_download");

  return {
    blob: await zip.generateAsync({ type: "blob" }),
    fileName: zipFileName,
  };
}

export async function renderPdfPageToImageBlob(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  options: PdfImageExportOptions,
) {
  if (options.format === "tiff") {
    throw new Error("TIFF export is not supported yet.");
  }

  const mimeType = mimeByFormat[options.format];

  throwIfAborted(options.signal);
  const page = await pdf.getPage(pageNumber);
  let canvas: HTMLCanvasElement | null = null;

  try {
    const viewport = page.getViewport({
      scale: resolutionScale[options.resolution],
    });
    canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", {
      alpha: options.format === "png" && options.transparentBackground,
    });

    if (!context) {
      throw new Error("Canvas is not available.");
    }

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    if (!(options.format === "png" && options.transparentBackground)) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    const activeRenderTask = page.render({
      canvasContext: context,
      viewport,
      background:
        options.format === "png" && options.transparentBackground
          ? "rgba(0,0,0,0)"
          : "#ffffff",
    });
    const abortHandler = () => activeRenderTask.cancel();
    options.signal?.addEventListener("abort", abortHandler, { once: true });

    try {
      await activeRenderTask.promise;
    } finally {
      options.signal?.removeEventListener("abort", abortHandler);
    }

    throwIfAborted(options.signal);
    return await canvasToBlob(canvas, mimeType, normalizeQuality(options.quality));
  } finally {
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }

    page.cleanup();
  }
}

export function estimatePdfImageWorkload({
  pages,
  selectedPageNumbers,
  resolution,
  deviceMemoryGb,
}: {
  pages: PdfImagePageDimensions[];
  selectedPageNumbers: number[];
  resolution: PdfImageResolution;
  deviceMemoryGb?: number;
}): PdfImageWorkloadEstimate {
  const scale = resolutionScale[resolution];
  const selected = new Set(selectedPageNumbers);
  const selectedPages = pages.filter((page) => selected.has(page.pageNumber));
  const pageEstimates = selectedPages.map((page) => {
    const width = Math.ceil(page.width * scale);
    const height = Math.ceil(page.height * scale);

    return width * height * 4;
  });
  const maxCanvasBytes = Math.max(0, ...pageEstimates);
  const estimatedCanvasBytes = pageEstimates.reduce((sum, bytes) => sum + bytes, 0);
  const className = classifyPdfImageWorkload({
    estimatedCanvasBytes,
    maxCanvasBytes,
    pageCount: selectedPages.length,
    deviceMemoryGb,
  });

  return {
    className,
    pageCount: selectedPages.length,
    scale,
    maxCanvasBytes,
    estimatedCanvasBytes,
    deviceMemoryGb,
  };
}

function classifyPdfImageWorkload({
  estimatedCanvasBytes,
  maxCanvasBytes,
  pageCount,
  deviceMemoryGb,
}: {
  estimatedCanvasBytes: number;
  maxCanvasBytes: number;
  pageCount: number;
  deviceMemoryGb?: number;
}): PdfImageWorkloadClass {
  const mb = 1024 * 1024;
  const lowMemoryDevice = typeof deviceMemoryGb === "number" && deviceMemoryGb <= 4;

  if (
    pageCount >= 150 ||
    estimatedCanvasBytes > 1400 * mb ||
    maxCanvasBytes > 120 * mb ||
    (lowMemoryDevice && estimatedCanvasBytes > 700 * mb)
  ) {
    return "VERY_HEAVY";
  }

  if (
    pageCount >= 40 ||
    estimatedCanvasBytes > 450 * mb ||
    maxCanvasBytes > 64 * mb ||
    (lowMemoryDevice && estimatedCanvasBytes > 260 * mb)
  ) {
    return "HEAVY";
  }

  return "SAFE";
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException("Conversion cancelled.", "AbortError");
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Image export failed."));
        }
      },
      mimeType,
      quality,
    );
  });
}

function normalizeQuality(quality: number) {
  if (quality > 1) {
    return Math.min(1, Math.max(0, quality / 100));
  }

  return Math.min(1, Math.max(0, quality));
}
