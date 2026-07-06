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
};

export type PdfImageExportResult = {
  blob: Blob;
  fileName: string;
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

  if (pageNumbers.length === 1) {
    const [pageNumber] = pageNumbers;
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
    options.onProgress?.(index + 1, pageNumbers.length);
    const blob = await renderPdfPageToImageBlob(pdf, pageNumber, options);
    zip.file(`page-${pageNumber}.${options.format}`, blob);
  }

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

  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({
    scale: resolutionScale[options.resolution],
  });
  const canvas = document.createElement("canvas");
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

  await page.render({
    canvasContext: context,
    viewport,
    background:
      options.format === "png" && options.transparentBackground
        ? "rgba(0,0,0,0)"
        : "#ffffff",
  }).promise;

  return canvasToBlob(canvas, mimeType, normalizeQuality(options.quality));
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
