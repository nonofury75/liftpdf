import fs from "node:fs/promises";
import path from "node:path";
import { deflateSync } from "node:zlib";
import { PDFArray, PDFName, PDFString, PDFDocument, rgb, StandardFonts } from "pdf-lib";

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
  phase41Markers: string;
  imageHeavy: string;
  imageOnly: string;
  transparentPdf: string;
  formPdf: string;
  annotatedPdf: string;
  metadataRich: string;
  optimizedPdf: string;
  largePdf: string;
  invalidPdf: string;
  emptyPdf: string;
  jpg: string;
  jpgPortrait: string;
  jpgLandscape: string;
  jpgHighResolution: string;
  png: string;
  transparentPng: string;
  pngNoTransparency: string;
  widePng: string;
  squarePng: string;
  largePng: string;
  webp: string;
};

export async function ensureFixtures(): Promise<FixturePaths> {
  await fs.mkdir(fixturesDir, { recursive: true });

  const paths = {
    text1: path.join(fixturesDir, "text-1.pdf"),
    text10: path.join(fixturesDir, "text-10.pdf"),
    text100: path.join(fixturesDir, "text-100.pdf"),
    text200: path.join(fixturesDir, "text-200.pdf"),
    phase41Markers: path.join(fixturesDir, "phase41-markers.pdf"),
    imageHeavy: path.join(fixturesDir, "image-heavy.pdf"),
    imageOnly: path.join(fixturesDir, "image-only.pdf"),
    transparentPdf: path.join(fixturesDir, "transparent-content.pdf"),
    formPdf: path.join(fixturesDir, "form-fields.pdf"),
    annotatedPdf: path.join(fixturesDir, "links-and-annotations.pdf"),
    metadataRich: path.join(fixturesDir, "metadata-rich.pdf"),
    optimizedPdf: path.join(fixturesDir, "already-optimized.pdf"),
    largePdf: path.join(fixturesDir, "large-reasonable.pdf"),
    invalidPdf: path.join(fixturesDir, "invalid.pdf"),
    emptyPdf: path.join(fixturesDir, "empty.pdf"),
    jpg: path.join(fixturesDir, "sample.jpg"),
    jpgPortrait: path.join(fixturesDir, "portrait.jpg"),
    jpgLandscape: path.join(fixturesDir, "landscape.jpg"),
    jpgHighResolution: path.join(fixturesDir, "high-resolution.jpg"),
    png: path.join(fixturesDir, "sample.png"),
    transparentPng: path.join(fixturesDir, "transparent.png"),
    pngNoTransparency: path.join(fixturesDir, "no-transparency.png"),
    widePng: path.join(fixturesDir, "wide-2x1.png"),
    squarePng: path.join(fixturesDir, "square.png"),
    largePng: path.join(fixturesDir, "large.png"),
    webp: path.join(fixturesDir, "sample.webp"),
  };

  await Promise.all([
    createTextPdf(paths.text1, 1),
    createTextPdf(paths.text10, 10),
    createTextPdf(paths.text100, 100),
    createTextPdf(paths.text200, 200),
    createPhase41MarkerPdf(paths.phase41Markers),
    createImageHeavyPdf(paths.imageHeavy),
    createImageOnlyPdf(paths.imageOnly),
    createTransparentPdf(paths.transparentPdf),
    createFormPdf(paths.formPdf),
    createAnnotatedPdf(paths.annotatedPdf),
    createMetadataRichPdf(paths.metadataRich),
    createAlreadyOptimizedPdf(paths.optimizedPdf),
    createLargeReasonablePdf(paths.largePdf),
    writeFileAtomic(paths.invalidPdf, Buffer.from("not a pdf")),
    writeFileAtomic(paths.emptyPdf, Buffer.from("")),
    writeFileAtomic(paths.png, Buffer.from(onePixelPng, "base64")),
    writeFileAtomic(paths.transparentPng, Buffer.from(transparentPng, "base64")),
    writeFileAtomic(paths.pngNoTransparency, createSolidPng(240, 320)),
    writeFileAtomic(paths.widePng, createSolidPng(300, 150)),
    writeFileAtomic(paths.squarePng, createSolidPng(300, 300)),
    writeFileAtomic(paths.largePng, createSolidPng(1600, 1200)),
    writeFileAtomic(paths.jpg, Buffer.from(onePixelJpg, "base64")),
    writeFileAtomic(paths.jpgPortrait, Buffer.from(onePixelJpg, "base64")),
    writeFileAtomic(paths.jpgLandscape, Buffer.from(onePixelJpg, "base64")),
    writeFileAtomic(paths.jpgHighResolution, Buffer.from(onePixelJpg, "base64")),
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

async function createPhase41MarkerPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  for (let pageNumber = 1; pageNumber <= 4; pageNumber += 1) {
    const page = pdf.addPage([595, 842]);
    page.drawText(`PHASE41-PAGE-${pageNumber}`, {
      x: 72,
      y: 760,
      size: 24,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(
      `Selectable marker text for Phase 41 page ${pageNumber}. Resume cafe naive facade.`,
      {
        x: 72,
        y: 720,
        size: 14,
        font,
        color: rgb(0.2, 0.2, 0.2),
      },
    );
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

async function createImageHeavyPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const png = await pdf.embedPng(createNoisePng(1200, 900));

  for (let pageNumber = 1; pageNumber <= 6; pageNumber += 1) {
    const page = pdf.addPage([842, 595]);
    page.drawImage(png, {
      x: 36,
      y: 36,
      width: 770,
      height: 523,
    });
  }

  await writeFileAtomic(filePath, Buffer.from(await pdf.save()));
}

async function createTransparentPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const png = await pdf.embedPng(Buffer.from(transparentPng, "base64"));

  page.drawRectangle({
    x: 72,
    y: 580,
    width: 300,
    height: 180,
    color: rgb(0.95, 0.95, 0.95),
  });
  page.drawImage(png, {
    x: 130,
    y: 620,
    width: 120,
    height: 120,
  });

  await writeFileAtomic(filePath, Buffer.from(await pdf.save()));
}

async function createFormPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const form = pdf.getForm();
  const nameField = form.createTextField("applicant.name");
  const consentField = form.createCheckBox("applicant.consent");

  page.drawText("LiftPDF QA Form Fixture", {
    x: 72,
    y: 760,
    size: 22,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });
  page.drawText("Name", { x: 72, y: 702, size: 12, font });
  nameField.setText("Jane Example");
  nameField.addToPage(page, { x: 140, y: 690, width: 260, height: 28 });
  consentField.check();
  consentField.addToPage(page, { x: 72, y: 636, width: 18, height: 18 });
  page.drawText("I confirm this deterministic test form.", {
    x: 104,
    y: 640,
    size: 12,
    font,
  });

  await writeFileAtomic(filePath, Buffer.from(await pdf.save()));
}

async function createAnnotatedPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawText("LiftPDF QA Link Fixture", {
    x: 72,
    y: 760,
    size: 22,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });
  page.drawText("Open LiftPDF", {
    x: 72,
    y: 700,
    size: 16,
    font,
    color: rgb(0.1, 0.3, 0.8),
  });

  const linkAnnotation = pdf.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [72, 696, 180, 716],
    Border: [0, 0, 0],
    A: {
      Type: "Action",
      S: "URI",
      URI: PDFString.of("https://liftpdf.com"),
    },
  });
  const annotations = PDFArray.withContext(pdf.context);
  annotations.push(linkAnnotation);
  page.node.set(PDFName.of("Annots"), annotations);

  await writeFileAtomic(filePath, Buffer.from(await pdf.save()));
}

async function createMetadataRichPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawText("Metadata-rich PDF fixture", { x: 72, y: 740, size: 18, font });
  pdf.setTitle("LiftPDF Metadata Rich Fixture");
  pdf.setAuthor("LiftPDF QA");
  pdf.setSubject("Compression and metadata test");
  pdf.setKeywords(["liftpdf", "metadata", "compression", "fixture"]);
  pdf.setProducer("LiftPDF Test Fixture Producer");
  pdf.setCreator("LiftPDF Test Fixture Creator");

  await writeFileAtomic(filePath, Buffer.from(await pdf.save()));
}

async function createAlreadyOptimizedPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawText("Already optimized PDF fixture", { x: 72, y: 740, size: 18, font });

  await writeFileAtomic(
    filePath,
    Buffer.from(
      await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      }),
    ),
  );
}

async function createLargeReasonablePdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const png = await pdf.embedPng(createNoisePng(900, 700));

  for (let pageNumber = 1; pageNumber <= 30; pageNumber += 1) {
    const page = pdf.addPage([595, 842]);
    page.drawText(`Large PDF fixture page ${pageNumber}`, {
      x: 72,
      y: 760,
      size: 16,
      font,
    });
    page.drawImage(png, { x: 72, y: 240, width: 450, height: 350 });
  }

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

function createNoisePng(width: number, height: number) {
  const bytesPerPixel = 4;
  const scanlineLength = 1 + width * bytesPerPixel;
  const raw = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * scanlineLength;
    raw[rowOffset] = 0;

    for (let x = 0; x < width; x += 1) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      const seed = (x * 1103515245 + y * 12345 + ((x ^ y) << 8)) >>> 0;
      raw[pixelOffset] = seed & 0xff;
      raw[pixelOffset + 1] = (seed >> 8) & 0xff;
      raw[pixelOffset + 2] = (seed >> 16) & 0xff;
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
