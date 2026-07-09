"use client";

import { PdfToImageTool } from "@/components/tools/pdf-to-image-tool";

export function PdfToPngTool() {
  return (
    <PdfToImageTool
      format="png"
      title="PDF to PNG options"
      description="Upload one PDF file and convert every page into a high-quality PNG image."
      actionLabel="Convert to PNG"
      singlePageFileName="page-1.png"
      zipFileName="pdf-to-png.zip"
      qualityLabel="PNG quality"
      defaultQuality={100}
      showTransparentBackground
    />
  );
}
