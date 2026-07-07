import fs from "node:fs/promises";
import path from "node:path";
import { deflateSync } from "node:zlib";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const fixturesDir = path.join(
  process.cwd(),
  "tests",
  "e2e",
  `.fixtures-${process.env.TEST_WORKER_INDEX ?? "default"}`,
);

const onePixelPng =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";
const transparentPng =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
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
  transparentPng: string;
  widePng: string;
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
    transparentPng: path.join(fixturesDir, "transparent.png"),
    widePng: path.join(fixturesDir, "wide-2x1.png"),
    webp: path.join(fixturesDir, "sample.webp"),
  };

  await Promise.all([
    createTextPdf(paths.text1, 1),
    createTextPdf(paths.text10, 10),
    createTextPdf(paths.text100, 100),
    createTextPdf(paths.text200, 200),
    createImageOnlyPdf(paths.imageOnly),
    writeFileAtomic(paths.invalidPdf, Buffer.from("not a pdf")),
    writeFileAtomic(paths.emptyPdf, Buffer.from("")),
    writeFileAtomic(paths.png, Buffer.from(onePixelPng, "base64")),
    writeFileAtomic(paths.transparentPng, Buffer.from(transparentPng, "base64")),
    writeFileAtomic(paths.widePng, createSolidPng(300, 150)),
    writeFileAtomic(paths.jpg, Buffer.from(onePixelJpg, "base64")),
    writeFileAtomic(paths.webp, Buffer.from(onePixelWebp, "base64")),
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

  await writeFileAtomic(filePath, Buffer.from(await pdf.save()));
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

  await writeFileAtomic(filePath, Buffer.from(await pdf.save()));
}

async function writeFileAtomic(filePath: string, data: Buffer) {
  const temporaryPath = `${filePath}.${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}.tmp`;

  await fs.writeFile(temporaryPath, data);
  await fs.rename(temporaryPath, filePath);
}

function createSolidPng(width: number, height: number) {
  const bytesPerPixel = 4;
  const scanlineLength = 1 + width * bytesPerPixel;
  const raw = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * scanlineLength;
    raw[rowOffset] = 0;

    for (let x = 0; x < width; x += 1) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      raw[pixelOffset] = 220;
      raw[pixelOffset + 1] = 40;
      raw[pixelOffset + 2] = 80;
      raw[pixelOffset + 3] = 255;
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    createPngChunk("IHDR", Buffer.concat([
      uint32(width),
      uint32(height),
      Buffer.from([8, 6, 0, 0, 0]),
    ])),
    createPngChunk("IDAT", deflateSync(raw)),
    createPngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function createPngChunk(type: string, data: Buffer) {
  const typeBuffer = Buffer.from(type, "ascii");
  const crcInput = Buffer.concat([typeBuffer, data]);

  return Buffer.concat([
    uint32(data.length),
    typeBuffer,
    data,
    uint32(crc32(crcInput)),
  ]);
}

function uint32(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(value >>> 0, 0);
  return buffer;
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}
