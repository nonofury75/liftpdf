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
const phase53BaseJpg =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoK" +
  "CgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoK" +
  "CgoKCgoKCgr/wAARCABQAHgDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUF" +
  "BAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVW" +
  "V1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi" +
  "4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAEC" +
  "AxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVm" +
  "Z2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq" +
  "8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5fr+bz/awKACgAoAKACgAoA9O/Zy/5jP/AG7/APtWvJzT7Hz/AEP8lf2pH/NI/wDc/wD+" +
  "6R6dXkn+SoUAFABQAUAFABQB8x19Yf8AWoFABQAUAFABQAUAenfs5f8AMZ/7d/8A2rXk5p9j5/of5K/tSP8Amkf+5/8A90j06vJP" +
  "8lQoAKACgAoAKACgD5jr6w/61AoAKACgAoAKACgD079nL/mM/wDbv/7Vryc0+x8/0P8AJX9qR/zSP/c//wC6R6dXkn+SoUAFABQA" +
  "UAFABQB8x19Yf9agUAFABQAUAFABQB6d+zl/zGf+3f8A9q15OafY+f6H+Sv7Uj/mkf8Auf8A/dI9OryT/JUKACgAoAKACgAoA+Y6" +
  "+sP+tQKACgAoAKACgAoA9O/Zy/5jP/bv/wC1a8nNPsfP9D/JX9qR/wA0j/3P/wDukenV5J/kqFABQAUAFABQAUAfGdf9DB/SgUAF" +
  "ABQAUAFABQB96f8ABEX/AJqd/wBwX/2/r/I39qf/AM0h/wB1D/3SP6G8Bv8AmY/9wf8A3Kfelf5Gn9DBQAUAFABQAUAFAH4L1/1y" +
  "H+eYUAFABQAUAFABQB96f8ERf+anf9wX/wBv6/yN/an/APNIf91D/wB0j+hvAb/mY/8AcH/3Kfelf5Gn9DBQAUAFABQAUAFAH4L1" +
  "/wBch/nmFABQAUAFABQAUAfen/BEX/mp3/cF/wDb+v8AI39qf/zSH/dQ/wDdI/obwG/5mP8A3B/9yn3pX+Rp/QwUAFABQAUAFABQ" +
  "B+C9f9ch/nmFABQAUAFABQAUAfen/BEX/mp3/cF/9v6/yN/an/8ANIf91D/3SP6G8Bv+Zj/3B/8Acp96V/kaf0MFABQAUAFABQAU" +
  "AfgvX/XIf55hQAUAFABQAUAFAH3p/wAERf8Amp3/AHBf/b+v8jf2p/8AzSH/AHUP/dI/obwG/wCZj/3B/wDcp96V/kaf0MFABQAU" +
  "AFABQAUAf//Z";

export type FixturePaths = {
  text1: string;
  text10: string;
  text100: string;
  text200: string;
  phase41Markers: string;
  phase44Markers: string;
  phase45Markers: string;
  phase46Markers: string;
  phase51A: string;
  phase51B: string;
  phase51C: string;
  phase52A: string;
  phase52B: string;
  phase53Exif: Record<string, string>;
  phase53CorruptExif: string;
  phase53NoExif: string;
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
  rotationMarkerPng: string;
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
    phase44Markers: path.join(fixturesDir, "phase44-markers.pdf"),
    phase45Markers: path.join(fixturesDir, "phase45-markers.pdf"),
    phase46Markers: path.join(fixturesDir, "phase46-markers.pdf"),
    phase51A: path.join(fixturesDir, "phase51-a.pdf"),
    phase51B: path.join(fixturesDir, "phase51-b.pdf"),
    phase51C: path.join(fixturesDir, "phase51-c.pdf"),
    phase52A: path.join(fixturesDir, "phase52-a.pdf"),
    phase52B: path.join(fixturesDir, "phase52-b.pdf"),
    phase53Exif: Object.fromEntries(
      Array.from({ length: 8 }, (_, index) => {
        const orientation = index + 1;
        return [
          String(orientation),
          path.join(fixturesDir, `phase53-orientation-${orientation}.jpg`),
        ];
      }),
    ) as Record<string, string>,
    phase53CorruptExif: path.join(fixturesDir, "phase53-corrupt-exif.jpg"),
    phase53NoExif: path.join(fixturesDir, "phase53-no-exif.jpg"),
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
    rotationMarkerPng: path.join(fixturesDir, "rotation-marker.png"),
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
    createPhase44MarkerPdf(paths.phase44Markers),
    createPhase45MarkerPdf(paths.phase45Markers),
    createPhase46MarkerPdf(paths.phase46Markers),
    createPhase51MarkerPdf(paths.phase51A, "PHASE51-A"),
    createPhase51MarkerPdf(paths.phase51B, "PHASE51-B"),
    createPhase51MarkerPdf(paths.phase51C, "PHASE51-C"),
    createMarkerPdf(paths.phase52A, "PHASE52-A"),
    createMarkerPdf(paths.phase52B, "PHASE52-B"),
    ...Object.entries(paths.phase53Exif).map(([orientation, filePath]) =>
      writeFileAtomic(
        filePath,
        createJpegWithExifOrientation(Number(orientation)),
      ),
    ),
    writeFileAtomic(paths.phase53CorruptExif, createCorruptExifJpeg()),
    writeFileAtomic(paths.phase53NoExif, Buffer.from(phase53BaseJpg, "base64")),
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
    writeFileAtomic(paths.rotationMarkerPng, createDirectionalPng(320, 180)),
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

async function createPhase44MarkerPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  for (let pageNumber = 1; pageNumber <= 12; pageNumber += 1) {
    const page = pdf.addPage([595, 842]);
    page.drawText(`PHASE44-PAGE-${pageNumber}`, {
      x: 72,
      y: 760,
      size: 24,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(
      `Fixed interval split marker for Phase 44 page ${pageNumber}.`,
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

async function createPhase45MarkerPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  for (let pageNumber = 1; pageNumber <= 10; pageNumber += 1) {
    const page = pdf.addPage([595, 842]);
    page.drawText(`PHASE45-PAGE-${pageNumber}`, {
      x: 72,
      y: 760,
      size: 24,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`Rotate targeting marker for Phase 45 page ${pageNumber}.`, {
      x: 72,
      y: 720,
      size: 14,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  await writeFileAtomic(filePath, Buffer.from(await pdf.save()));
}

async function createPhase46MarkerPdf(filePath: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  for (let pageNumber = 1; pageNumber <= 6; pageNumber += 1) {
    const page = pdf.addPage([595, 842]);
    page.drawText(`PHASE46-PAGE-${pageNumber}`, {
      x: 72,
      y: 760,
      size: 24,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`Extract ZIP marker for Phase 46 page ${pageNumber}.`, {
      x: 72,
      y: 720,
      size: 14,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  await writeFileAtomic(filePath, Buffer.from(await pdf.save()));
}

async function createPhase51MarkerPdf(filePath: string, marker: string) {
  await createMarkerPdf(filePath, marker);
}

async function createMarkerPdf(filePath: string, marker: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  const page = pdf.addPage([595, 842]);
  page.drawText(marker, {
    x: 72,
    y: 760,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  page.drawText(`Merge isolation marker for ${marker}.`, {
    x: 72,
    y: 720,
    size: 14,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  await writeFileAtomic(filePath, Buffer.from(await pdf.save()));
}

function createJpegWithExifOrientation(orientation: number) {
  return insertJpegApp1Segment(
    Buffer.from(phase53BaseJpg, "base64"),
    createExifOrientationSegment(orientation),
  );
}

function createCorruptExifJpeg() {
  return insertJpegApp1Segment(
    Buffer.from(phase53BaseJpg, "base64"),
    createExifOrientationSegment(99),
  );
}

function insertJpegApp1Segment(jpeg: Buffer, app1Segment: Buffer) {
  if (jpeg[0] !== 0xff || jpeg[1] !== 0xd8) {
    throw new Error("Expected JPEG SOI marker.");
  }

  return Buffer.concat([jpeg.subarray(0, 2), app1Segment, jpeg.subarray(2)]);
}

function createExifOrientationSegment(orientation: number) {
  const exifPayload = Buffer.alloc(38);
  exifPayload.write("Exif\0\0", 0, "ascii");
  exifPayload.write("II", 6, "ascii");
  exifPayload.writeUInt16LE(42, 8);
  exifPayload.writeUInt32LE(8, 10);
  exifPayload.writeUInt16LE(1, 14);
  exifPayload.writeUInt16LE(0x0112, 16);
  exifPayload.writeUInt16LE(3, 18);
  exifPayload.writeUInt32LE(1, 20);
  exifPayload.writeUInt16LE(orientation, 24);
  exifPayload.writeUInt16LE(0, 26);
  exifPayload.writeUInt32LE(0, 28);
  // Extra bytes deliberately resemble unrelated sensitive metadata. The parser
  // must ignore everything except the Orientation tag.
  exifPayload.write("GPS", 32, "ascii");

  const segment = Buffer.alloc(4 + exifPayload.length);
  segment[0] = 0xff;
  segment[1] = 0xe1;
  segment.writeUInt16BE(exifPayload.length + 2, 2);
  exifPayload.copy(segment, 4);

  return segment;
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

function createDirectionalPng(width: number, height: number) {
  const bytesPerPixel = 4;
  const scanlineLength = 1 + width * bytesPerPixel;
  const raw = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * scanlineLength;
    raw[rowOffset] = 0;

    for (let x = 0; x < width; x += 1) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      const isTop = y < height * 0.22;
      const isRight = x > width * 0.78;
      const isBottom = y > height * 0.78;
      const isLeft = x < width * 0.22;
      let color = [245, 245, 245];

      if (isTop) {
        color = [220, 30, 50];
      } else if (isRight) {
        color = [30, 120, 220];
      } else if (isBottom) {
        color = [30, 170, 80];
      } else if (isLeft) {
        color = [245, 190, 30];
      }

      raw[pixelOffset] = color[0];
      raw[pixelOffset + 1] = color[1];
      raw[pixelOffset + 2] = color[2];
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
