import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const fixturesDir = path.join(process.cwd(), "tests", "e2e", ".fixtures");

const onePixelPng =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";
const onePixelJpg =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAEFAqf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/ASP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/ASP/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAY/Aqf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/IV//2gAMAwEAAgADAAAAEP/EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QH//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QH//EABQQAQAAAAAAAAAAAAAAAAAAABD/2gAIAQEAAT8QH//Z";
const onePixelWebp =
  "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";

export type FixturePaths = {
  text1: string;
  text10: string;
  text100: string;
  text200: string;
  imageOnly: string;
  invalidPdf: string;
  emptyPdf: string;
  jpg: string;
  png: string;
  webp: string;
};

export async function ensureFixtures(): Promise<FixturePaths> {
  await fs.mkdir(fixturesDir, { recursive: true });

  const paths = {
    text1: path.join(fixturesDir, "text-1.pdf"),
    text10: path.join(fixturesDir, "text-10.pdf"),
    text100: path.join(fixturesDir, "text-100.pdf"),
    text200: path.join(fixturesDir, "text-200.pdf"),
    imageOnly: path.join(fixturesDir, "image-only.pdf"),
    invalidPdf: path.join(fixturesDir, "invalid.pdf"),
    emptyPdf: path.join(fixturesDir, "empty.pdf"),
    jpg: path.join(fixturesDir, "sample.jpg"),
    png: path.join(fixturesDir, "sample.png"),
    webp: path.join(fixturesDir, "sample.webp"),
  };

  await Promise.all([
    createTextPdf(paths.text1, 1),
    createTextPdf(paths.text10, 10),
    createTextPdf(paths.text100, 100),
    createTextPdf(paths.text200, 200),
    createImageOnlyPdf(paths.imageOnly),
    fs.writeFile(paths.invalidPdf, "not a pdf"),
    fs.writeFile(paths.emptyPdf, ""),
    fs.writeFile(paths.png, Buffer.from(onePixelPng, "base64")),
    fs.writeFile(paths.jpg, Buffer.from(onePixelJpg, "base64")),
    fs.writeFile(paths.webp, Buffer.from(onePixelWebp, "base64")),
  ]);

  return paths;
}

async function createTextPdf(filePath: string, pageCount: number) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = pdf.addPage([595, 842]);
    page.drawText(`LiftPDF QA page ${pageNumber}`, {
      x: 72,
      y: 760,
      size: 22,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`This is selectable text for page ${pageNumber}.`, {
      x: 72,
      y: 720,
      size: 14,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  await fs.writeFile(filePath, await pdf.save());
}

async function createImageOnlyPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);

  page.drawRectangle({
    x: 72,
    y: 620,
    width: 360,
    height: 120,
    color: rgb(0.86, 0.9, 0.95),
  });
  page.drawRectangle({
    x: 92,
    y: 680,
    width: 280,
    height: 16,
    color: rgb(0.38, 0.43, 0.5),
  });
  page.drawRectangle({
    x: 92,
    y: 650,
    width: 230,
    height: 16,
    color: rgb(0.38, 0.43, 0.5),
  });

  await fs.writeFile(filePath, await pdf.save());
}
