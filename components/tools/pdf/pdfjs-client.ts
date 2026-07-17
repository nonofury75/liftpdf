import type { PDFDocumentProxy } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

export async function loadPdfDocument(file: File): Promise<PDFDocumentProxy> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const fileBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(fileBuffer.byteLength);
  bytes.set(new Uint8Array(fileBuffer));

  return pdfjs.getDocument({ data: bytes }).promise;
}

export async function renderPdfPagePreview(
  pdf: PDFDocumentProxy,
  pageNumber: number,
) {
  const thumbnail = await renderPdfPageThumbnail(pdf, pageNumber);
  return thumbnail.previewUrl;
}

export async function renderPdfPageThumbnail(
  pdf: PDFDocumentProxy,
  pageNumber: number,
) {
  const page = await pdf.getPage(pageNumber);
  const originalViewport = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: 0.35 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available.");
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  const previewUrl = await new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Preview generation failed."));
        return;
      }

      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });

  return {
    pageNumber,
    previewUrl,
    width: Math.round(originalViewport.width),
    height: Math.round(originalViewport.height),
  };
}

export type PdfPageText = {
  pageNumber: number;
  text: string;
};

export async function extractPdfText(
  pdf: PDFDocumentProxy,
  onProgress?: (
    pageNumber: number,
    pageCount: number,
    processedIndex: number,
  ) => void,
  pageNumbers?: number[],
) {
  const pages: PdfPageText[] = [];
  const pagesToExtract =
    pageNumbers && pageNumbers.length > 0
      ? pageNumbers
      : Array.from({ length: pdf.numPages }, (_, index) => index + 1);

  for (const [index, pageNumber] of pagesToExtract.entries()) {
    onProgress?.(pageNumber, pagesToExtract.length, index + 1);

    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .filter(isTextItem)
      .map((item) => item.str.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    pages.push({ pageNumber, text });

    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  return pages;
}

function isTextItem(item: unknown): item is TextItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "str" in item &&
    typeof item.str === "string"
  );
}
