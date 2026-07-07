"use client";

import { PdfToImageTool } from "@/components/tools/pdf-to-image-tool";

export function PdfToJpgTool() {
  return (
    <PdfToImageTool
      format="jpg"
      title="Conversion summary"
      description="Upload one PDF file and convert every page into a high-quality JPG image."
      actionLabel="Convert to JPG"
      singlePageFileName="page-1.jpg"
      zipFileName="pdf-to-jpg.zip"
      qualityLabel="JPG quality"
      defaultQuality={92}
    />
  );
}
