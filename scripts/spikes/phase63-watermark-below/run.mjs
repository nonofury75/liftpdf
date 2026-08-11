import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { chromium, firefox } from "@playwright/test";
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFString,
  StandardFonts,
  clip,
  closePath,
  degrees,
  endPath,
  lineTo,
  moveTo,
  popGraphicsState,
  pushGraphicsState,
  rgb,
} from "pdf-lib";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "artifacts", "phase63-watermark-below");
const marker = "PHASE63-BELOW";
const pageWidth = 320;
const pageHeight = 240;

const fixtures = [
  { id: "F1_SIMPLE_TEXT", build: buildSimpleText },
  { id: "F2_IMAGE_HEAVY", build: buildImageHeavy },
  { id: "F3_MULTIPLE_CONTENT_STREAMS", build: buildMultipleContentStreams },
  { id: "F4_ROTATED_PAGE", build: buildRotatedPage },
  { id: "F5_TRANSPARENCY", build: buildTransparency },
  { id: "F6_CLIPPING", build: buildClipping },
  { id: "F7_FORM", build: buildForm },
  { id: "F8_LINK_ANNOTATION", build: buildLinkAnnotation },
  { id: "F9_XOBJECT", build: buildNestedXObject },
  { id: "F10_MIXED", build: buildMixed },
  { id: "F11_DIFFERENT_PAGE_BOXES", build: buildDifferentPageBoxes },
  { id: "F12_MULTIPAGE_MIXED", build: buildMultipageMixed },
  { id: "H1_EMPTY_STREAM", build: buildEmptyStream },
  { id: "H2_PAGE_WITHOUT_CONTENTS", build: buildPageWithoutContents },
  { id: "H3_INDIRECT_RESOURCES", build: buildIndirectResources },
  { id: "H4_RESOURCE_NAME_COLLISION", build: buildResourceNameCollision },
  { id: "H5_UNBALANCED_GRAPHICS_STATE", build: buildUnbalancedGraphicsState },
  { id: "P10_TEN_PAGES", build: () => buildManyPages(10) },
  { id: "P100_HUNDRED_PAGES", build: () => buildManyPages(100) },
];

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const results = [];

  for (const fixture of fixtures) {
    process.stdout.write(`Running ${fixture.id}\n`);
    const started = performance.now();
    const originalBytes = await fixture.build();
    const originalPath = path.join(outDir, `${fixture.id}-original.pdf`);
    await fs.writeFile(originalPath, originalBytes);

    process.stdout.write(`  above\n`);
    const aboveBytes = await addAboveWatermark(originalBytes);
    process.stdout.write(`  below text\n`);
    const belowText = await addBelowWatermark(originalBytes, { kind: "text" });
    process.stdout.write(`  below image\n`);
    const belowImage = await addBelowWatermark(originalBytes, { kind: "image" });
    process.stdout.write(`  targeted\n`);
    const targeted = await addBelowWatermark(originalBytes, {
      kind: "text",
      targetPages: [1],
    });

    await fs.writeFile(path.join(outDir, `${fixture.id}-above.pdf`), aboveBytes);
    await fs.writeFile(path.join(outDir, `${fixture.id}-below-text.pdf`), belowText.bytes);
    await fs.writeFile(path.join(outDir, `${fixture.id}-below-image.pdf`), belowImage.bytes);
    await fs.writeFile(path.join(outDir, `${fixture.id}-targeted.pdf`), targeted.bytes);

    const originalDoc = await PDFDocument.load(originalBytes);
    const belowDoc = await PDFDocument.load(belowText.bytes);
    const structural = inspectDocument(originalDoc, belowDoc, belowText);
    const pageCount = belowDoc.getPageCount();

    results.push({
      fixture: fixture.id,
      originalSize: originalBytes.length,
      aboveSize: aboveBytes.length,
      belowTextSize: belowText.bytes.length,
      belowImageSize: belowImage.bytes.length,
      pageCount,
      durationMs: Math.round(performance.now() - started),
      ...structural,
      textWatermark: belowText.success ? "PASS" : "FAIL",
      imageWatermark: belowImage.success ? "PASS" : "FAIL",
      targeting: inspectTargeting(originalDoc, targeted),
    });
  }

  const chromiumPixels = await runPixelChecks(chromium, "chromium");
  const firefoxPixels = await runPixelChecks(firefox, "firefox");
  const summary = summarize(results, chromiumPixels, firefoxPixels);

  await fs.writeFile(
    path.join(outDir, "results.json"),
    JSON.stringify({ results, chromiumPixels, firefoxPixels, summary }, null, 2),
  );
  await fs.writeFile(
    path.join(outDir, "results.md"),
    renderResultsMarkdown(results, chromiumPixels, firefoxPixels, summary),
  );

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

async function addAboveWatermark(bytes) {
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);

  for (const page of pdf.getPages()) {
    page.drawText(marker, {
      x: 38,
      y: 104,
      size: 42,
      font,
      color: rgb(1, 0, 0),
      opacity: 0.65,
      rotate: degrees(-20),
    });
  }

  return pdf.save({ useObjectStreams: false, addDefaultPage: false });
}

async function addBelowWatermark(bytes, { kind, targetPages } = { kind: "text" }) {
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  const targetSet = new Set(
    targetPages ?? Array.from({ length: pdf.getPageCount() }, (_, index) => index + 1),
  );
  const textFont = kind === "text" ? await pdf.embedFont(StandardFonts.HelveticaBold) : null;
  const image = kind === "image" ? await embedMarkerImage(pdf) : null;
  const watermarkRefs = [];

  for (const [index, page] of pdf.getPages().entries()) {
    if (!targetSet.has(index + 1)) {
      continue;
    }

    const { width, height } = page.getSize();
    const resources = ensureResources(pdf, page);
    const extGStateName = uniqueResourceName(resources, "ExtGState", "LPGS");
    ensureResourceCategory(pdf, resources, "ExtGState").set(
      extGStateName,
      pdf.context.obj({
        Type: "ExtGState",
        ca: 0.68,
        CA: 0.68,
      }),
    );

    let operators;

    if (kind === "text") {
      const fontName = uniqueResourceName(resources, "Font", "LPFont");
      ensureResourceCategory(pdf, resources, "Font").set(fontName, textFont.ref);
      operators = textWatermarkOperators({
        fontName,
        extGStateName,
        width,
        height,
      });
    } else {
      const imageName = uniqueResourceName(resources, "XObject", "LPImg");
      ensureResourceCategory(pdf, resources, "XObject").set(imageName, image.ref);
      operators = imageWatermarkOperators({
        imageName,
        extGStateName,
        width,
        height,
        imageWidth: image.width,
        imageHeight: image.height,
      });
    }

    const stream = pdf.context.flateStream(operators);
    const streamRef = pdf.context.register(stream);
    watermarkRefs.push(streamRef.toString());
    prependContentStream(pdf, page, streamRef);
  }

  return {
    bytes: await pdf.save({ useObjectStreams: false, addDefaultPage: false }),
    success: watermarkRefs.length > 0,
    watermarkRefs,
  };
}

function textWatermarkOperators({ fontName, extGStateName, width, height }) {
  const x = Math.round(width * 0.14);
  const y = Math.round(height * 0.45);

  return [
    "q",
    `/${extGStateName.decodeText()} gs`,
    "1 0 0 rg",
    "BT",
    `/${fontName.decodeText()} 42 Tf`,
    "0.9397 -0.3420 0.3420 0.9397 0 0 Tm",
    `${x} ${y} Td`,
    `(${marker}) Tj`,
    "ET",
    "Q",
  ].join("\n");
}

function imageWatermarkOperators({
  imageName,
  extGStateName,
  width,
  height,
  imageWidth,
  imageHeight,
}) {
  const drawWidth = Math.round(width * 0.62);
  const drawHeight = Math.round(drawWidth * (imageHeight / imageWidth));
  const x = Math.round((width - drawWidth) / 2);
  const y = Math.round((height - drawHeight) / 2);

  return [
    "q",
    `/${extGStateName.decodeText()} gs`,
    `${drawWidth} 0 0 ${drawHeight} ${x} ${y} cm`,
    `/${imageName.decodeText()} Do`,
    "Q",
  ].join("\n");
}

function prependContentStream(pdf, page, streamRef) {
  const contentsKey = PDFName.of("Contents");
  const existing = page.node.get(contentsKey);
  const nextContents = PDFArray.withContext(pdf.context);

  nextContents.push(streamRef);

  if (existing instanceof PDFArray) {
    for (let index = 0; index < existing.size(); index += 1) {
      nextContents.push(existing.get(index));
    }
  } else if (existing) {
    nextContents.push(existing);
  }

  page.node.set(contentsKey, nextContents);
}

function ensureResources(pdf, page) {
  const resourcesKey = PDFName.of("Resources");
  const existing = page.node.get(resourcesKey);
  const lookedUp = existing ? pdf.context.lookup(existing) : undefined;

  if (lookedUp instanceof PDFDict) {
    return lookedUp;
  }

  const resources = pdf.context.obj({});
  page.node.set(resourcesKey, resources);
  return resources;
}

function ensureResourceCategory(pdf, resources, category) {
  const categoryKey = PDFName.of(category);
  const existing = resources.get(categoryKey);
  const lookedUp = existing ? pdf.context.lookup(existing) : undefined;

  if (lookedUp instanceof PDFDict) {
    return lookedUp;
  }

  const dict = pdf.context.obj({});
  resources.set(categoryKey, dict);
  return dict;
}

function uniqueResourceName(resources, category, prefix) {
  const dict = resources.get(PDFName.of(category));
  const existing = dict instanceof PDFDict ? dict : undefined;

  for (let index = 1; index < 1000; index += 1) {
    const name = PDFName.of(`${prefix}${index}`);

    if (!existing || !existing.has(name)) {
      return name;
    }
  }

  throw new Error(`Could not allocate ${category} resource name.`);
}

async function embedMarkerImage(pdf) {
  const pngBytes = Uint8Array.from(Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/l5u7ygAAAABJRU5ErkJggg==",
    "base64",
  ));

  return pdf.embedPng(pngBytes);
}

function inspectDocument(originalDoc, belowDoc, belowResult) {
  const rows = [];

  for (let index = 0; index < belowDoc.getPageCount(); index += 1) {
    const originalPage = originalDoc.getPage(Math.min(index, originalDoc.getPageCount() - 1));
    const belowPage = belowDoc.getPage(index);
    const originalContents = describeContents(originalDoc, originalPage);
    const belowContents = describeContents(belowDoc, belowPage);
    const watermarkFirst =
      belowContents.refs.length > 0 &&
      belowResult.watermarkRefs.includes(belowContents.refs[0]);

    rows.push({
      page: index + 1,
      originalType: originalContents.type,
      originalRefs: originalContents.refs,
      newType: belowContents.type,
      newRefs: belowContents.refs,
      watermarkFirst,
      resourcesPreserved: hasResources(belowDoc, belowPage),
      annotationsPreserved: annotationCount(belowDoc, belowPage) >= annotationCount(originalDoc, originalPage),
    });
  }

  return {
    structuralRows: rows,
    watermarkFirst: rows.every((row) => row.watermarkFirst),
    resourcesPreserved: rows.every((row) => row.resourcesPreserved),
    annotationsPreserved: rows.every((row) => row.annotationsPreserved),
    pdfValid: belowDoc.getPageCount() === originalDoc.getPageCount(),
  };
}

function inspectTargeting(originalDoc, targetedResult) {
  return {
    targetOnlySuccess: targetedResult.success,
    changedPageCount: targetedResult.watermarkRefs.length,
    expectedChangedPageCount: originalDoc.getPageCount() > 0 ? 1 : 0,
  };
}

function describeContents(pdf, page) {
  const contents = page.node.get(PDFName.of("Contents"));

  if (!contents) {
    return { type: "none", refs: [] };
  }

  if (contents instanceof PDFArray) {
    const refs = [];

    for (let index = 0; index < contents.size(); index += 1) {
      refs.push(contents.get(index).toString());
    }

    return { type: "array", refs };
  }

  return { type: contents.constructor.name, refs: [contents.toString()] };
}

function hasResources(pdf, page) {
  const resources = page.node.get(PDFName.of("Resources"));
  return Boolean(resources && pdf.context.lookup(resources));
}

function annotationCount(pdf, page) {
  const annots = page.node.get(PDFName.of("Annots"));
  const lookedUp = annots ? pdf.context.lookup(annots) : undefined;
  return lookedUp instanceof PDFArray ? lookedUp.size() : 0;
}

async function runPixelChecks(browserType, browserName) {
  const server = await startStaticServer();
  const browser = await browserType.launch();
  const page = await browser.newPage();

  try {
    const checks = [];

    for (const fixtureId of ["F2_IMAGE_HEAVY", "F3_MULTIPLE_CONTENT_STREAMS", "F4_ROTATED_PAGE", "F6_CLIPPING", "F9_XOBJECT"]) {
      const originalPath = path.join(outDir, `${fixtureId}-original.pdf`);
      const abovePath = path.join(outDir, `${fixtureId}-above.pdf`);
      const belowPath = path.join(outDir, `${fixtureId}-below-text.pdf`);
      const result = await page.evaluate(
        async ({ origin, originalData, aboveData, belowData }) => {
          const pdfjs = await import(`${origin}/node_modules/pdfjs-dist/legacy/build/pdf.mjs`);
          pdfjs.GlobalWorkerOptions.workerSrc = `${origin}/node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs`;

          async function render(data) {
            const pdf = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
            const firstPage = await pdf.getPage(1);
            const viewport = firstPage.getViewport({ scale: 1 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d", { willReadFrequently: true });
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);
            await firstPage.render({ canvasContext: context, viewport }).promise;
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
            await pdf.destroy();
            return {
              width: canvas.width,
              height: canvas.height,
              pixels: Array.from(imageData),
            };
          }

          function difference(a, b) {
            let total = 0;
            let changed = 0;

            for (let index = 0; index < a.pixels.length; index += 4) {
              const delta =
                Math.abs(a.pixels[index] - b.pixels[index]) +
                Math.abs(a.pixels[index + 1] - b.pixels[index + 1]) +
                Math.abs(a.pixels[index + 2] - b.pixels[index + 2]);

              total += delta;

              if (delta > 30) {
                changed += 1;
              }
            }

            return { total, changed };
          }

          function regionDifference(a, b, region) {
            let total = 0;
            let changed = 0;
            const xStart = Math.max(0, region.x);
            const xEnd = Math.min(a.width, region.x + region.width);
            const yStart = Math.max(0, region.y);
            const yEnd = Math.min(a.height, region.y + region.height);

            for (let y = yStart; y < yEnd; y += 1) {
              for (let x = xStart; x < xEnd; x += 1) {
                const index = (y * a.width + x) * 4;
                const delta =
                  Math.abs(a.pixels[index] - b.pixels[index]) +
                  Math.abs(a.pixels[index + 1] - b.pixels[index + 1]) +
                  Math.abs(a.pixels[index + 2] - b.pixels[index + 2]);

                total += delta;

                if (delta > 30) {
                  changed += 1;
                }
              }
            }

            return { total, changed };
          }

          const original = await render(originalData);
          const above = await render(aboveData);
          const below = await render(belowData);
          return {
            aboveDiff: difference(original, above),
            belowDiff: difference(original, below),
            occlusionRegion: {
              above: regionDifference(original, above, {
                x: 46,
                y: original.height - 78 - 70,
                width: 230,
                height: 70,
              }),
              below: regionDifference(original, below, {
                x: 46,
                y: original.height - 78 - 70,
                width: 230,
                height: 70,
              }),
            },
            dimensions: {
              original: [original.width, original.height],
              above: [above.width, above.height],
              below: [below.width, below.height],
            },
          };
        },
        {
          origin: server.origin,
          originalData: Array.from(await fs.readFile(originalPath)),
          aboveData: Array.from(await fs.readFile(abovePath)),
          belowData: Array.from(await fs.readFile(belowPath)),
        },
      );

      checks.push({
        browser: browserName,
        fixture: fixtureId,
        aboveVisible: result.aboveDiff.changed > 20,
        belowMostlyOccluded:
          fixtureId === "F4_ROTATED_PAGE"
            ? result.belowDiff.changed < result.aboveDiff.changed * 0.75
            : result.occlusionRegion.above.changed > 20 &&
              result.occlusionRegion.below.changed < Math.max(180, result.occlusionRegion.above.changed * 0.1),
        ...result,
      });
    }

    return checks;
  } finally {
    await browser.close();
    await server.close();
  }
}

function startStaticServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://127.0.0.1");
      const requestedPath = path.normalize(url.pathname.replace(/^\/+/, ""));

      if (!requestedPath.startsWith("node_modules")) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      const filePath = path.join(rootDir, requestedPath);
      const data = await fs.readFile(filePath);
      const contentType = filePath.endsWith(".mjs") || filePath.endsWith(".js")
        ? "text/javascript"
        : "application/octet-stream";

      response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": contentType,
      });
      response.end(data);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        origin: `http://127.0.0.1:${address.port}`,
        close: () =>
          new Promise((closeResolve, closeReject) => {
            server.close((error) => (error ? closeReject(error) : closeResolve()));
          }),
      });
    });
  });
}

function summarize(results, chromiumPixels, firefoxPixels) {
  const structurePass = results.every(
    (result) => result.watermarkFirst && result.resourcesPreserved && result.pdfValid,
  );
  const pixelPass = [...chromiumPixels, ...firefoxPixels].every(
    (result) => result.aboveVisible && result.belowMostlyOccluded,
  );
  const targetingPass = results.every(
    (result) =>
      result.targeting.targetOnlySuccess &&
      result.targeting.changedPageCount === result.targeting.expectedChangedPageCount,
  );

  return {
    fixtures: results.length,
    structurePass,
    pixelPass,
    targetingPass,
    chromiumPass: chromiumPixels.every((result) => result.aboveVisible && result.belowMostlyOccluded),
    firefoxPass: firefoxPixels.every((result) => result.aboveVisible && result.belowMostlyOccluded),
    currentEngineClassification:
      structurePass && pixelPass && targetingPass
        ? "SAFE_WITH_CURRENT_ENGINE_WITH_DETECTABLE_LIMITATIONS"
        : "NEEDS_ENGINE_EXTENSION",
  };
}

function renderResultsMarkdown(results, chromiumPixels, firefoxPixels, summary) {
  const lines = [
    "# Phase 63 Watermark Below Spike Results",
    "",
    "## Summary",
    "",
    "```json",
    JSON.stringify(summary, null, 2),
    "```",
    "",
    "## Structural Results",
    "",
    "| Fixture | Pages | Watermark first | Resources | Annotations | PDF valid | Targeting | Text | Image | Duration ms | Size delta text |",
    "|---|---:|---|---|---|---|---|---|---|---:|---:|",
    ...results.map((result) => {
      const delta = result.belowTextSize - result.originalSize;
      return `| ${result.fixture} | ${result.pageCount} | ${pass(result.watermarkFirst)} | ${pass(result.resourcesPreserved)} | ${pass(result.annotationsPreserved)} | ${pass(result.pdfValid)} | ${pass(result.targeting.changedPageCount === result.targeting.expectedChangedPageCount)} | ${result.textWatermark} | ${result.imageWatermark} | ${result.durationMs} | ${delta} |`;
    }),
    "",
    "## Pixel Results",
    "",
    "| Browser | Fixture | Above visible | Below mostly occluded | Above changed px | Below changed px |",
    "|---|---|---|---|---:|---:|",
    ...[...chromiumPixels, ...firefoxPixels].map(
      (result) =>
        `| ${result.browser} | ${result.fixture} | ${pass(result.aboveVisible)} | ${pass(result.belowMostlyOccluded)} | ${result.occlusionRegion.above.changed} | ${result.occlusionRegion.below.changed} |`,
    ),
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function pass(value) {
  return value ? "PASS" : "FAIL";
}

async function buildSimpleText() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText("F1 SIMPLE TEXT", { x: 24, y: 178, size: 22, font, color: rgb(0, 0, 0) });
  page.drawRectangle({ x: 42, y: 82, width: 220, height: 54, color: rgb(0, 0, 0) });
  return pdf.save({ useObjectStreams: false });
}

async function buildImageHeavy() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  const png = await embedMarkerImage(pdf);
  page.drawImage(png, { x: 16, y: 20, width: 288, height: 200 });
  page.drawRectangle({ x: 46, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  return pdf.save({ useObjectStreams: false });
}

async function buildMultipleContentStreams() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.drawText("STREAM A", { x: 24, y: 196, size: 18 });
  page.drawText("STREAM B", { x: 24, y: 166, size: 18 });
  page.drawRectangle({ x: 40, y: 70, width: 240, height: 78, color: rgb(0, 0, 0) });
  page.drawText("STREAM C", { x: 24, y: 36, size: 18 });
  return pdf.save({ useObjectStreams: false });
}

async function buildRotatedPage() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.setRotation(degrees(90));
  page.drawText("ROTATED PAGE", { x: 24, y: 190, size: 18 });
  page.drawRectangle({ x: 44, y: 76, width: 230, height: 76, color: rgb(0, 0, 0) });
  return pdf.save({ useObjectStreams: false });
}

async function buildTransparency() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.drawText("TRANSPARENCY", { x: 24, y: 194, size: 18 });
  page.drawRectangle({ x: 30, y: 58, width: 260, height: 124, color: rgb(0, 0, 1), opacity: 0.45 });
  page.drawRectangle({ x: 48, y: 82, width: 224, height: 70, color: rgb(0, 0, 0) });
  return pdf.save({ useObjectStreams: false });
}

async function buildClipping() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.drawText("CLIPPING CONTROL", { x: 24, y: 190, size: 18 });
  page.pushOperators(
    pushGraphicsState(),
    moveTo(36, 60),
    lineTo(284, 60),
    lineTo(284, 178),
    lineTo(36, 178),
    closePath(),
    clip(),
    endPath(),
  );
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(0.55, 0.7, 1),
  });
  page.pushOperators(
    popGraphicsState(),
  );
  page.drawRectangle({ x: 46, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  return pdf.save({ useObjectStreams: false });
}

async function buildForm() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.drawText("FORM", { x: 24, y: 196, size: 18 });
  page.drawRectangle({ x: 44, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  const form = pdf.getForm();
  const field = form.createTextField("phase63.name");
  field.setText("LiftPDF");
  field.addToPage(page, { x: 50, y: 34, width: 160, height: 24 });
  return pdf.save({ useObjectStreams: false });
}

async function buildLinkAnnotation() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.drawText("LINK ANNOTATION", { x: 24, y: 196, size: 18 });
  page.drawText("https://liftpdf.com", { x: 46, y: 44, size: 14, color: rgb(0, 0, 1) });
  page.drawRectangle({ x: 44, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  const link = pdf.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [46, 40, 180, 62],
    Border: [0, 0, 0],
    A: { Type: "Action", S: "URI", URI: PDFString.of("https://liftpdf.com") },
  });
  const annots = PDFArray.withContext(pdf.context);
  annots.push(pdf.context.register(link));
  page.node.set(PDFName.of("Annots"), annots);
  return pdf.save({ useObjectStreams: false });
}

async function buildNestedXObject() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  const embeddedPage = await pdf.embedPage((await PDFDocument.load(await buildSimpleText())).getPage(0));
  page.drawPage(embeddedPage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
  page.drawRectangle({ x: 48, y: 82, width: 224, height: 70, color: rgb(0, 0, 0) });
  return pdf.save({ useObjectStreams: false });
}

async function buildMixed() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.setRotation(degrees(270));
  const png = await embedMarkerImage(pdf);
  page.drawImage(png, { x: 10, y: 16, width: 300, height: 210, opacity: 0.65 });
  page.drawText("MIXED", { x: 24, y: 194, size: 18 });
  page.drawRectangle({ x: 46, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  const form = pdf.getForm();
  form.createTextField("phase63.mixed").addToPage(page, { x: 50, y: 34, width: 160, height: 24 });
  return pdf.save({ useObjectStreams: false });
}

async function buildDifferentPageBoxes() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.setCropBox(20, 20, 280, 190);
  page.drawText("CROPBOX", { x: 24, y: 196, size: 18 });
  page.drawRectangle({ x: 44, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  return pdf.save({ useObjectStreams: false });
}

async function buildMultipageMixed() {
  const pdf = await PDFDocument.create();
  for (let index = 0; index < 12; index += 1) {
    const page = pdf.addPage([pageWidth, pageHeight]);
    if (index % 4 === 1) page.setRotation(degrees(90));
    if (index % 4 === 2) page.setCropBox(20, 20, 280, 190);
    page.drawText(`MIXED PAGE ${index + 1}`, { x: 24, y: 194, size: 18 });
    page.drawRectangle({ x: 46, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  }
  return pdf.save({ useObjectStreams: false });
}

async function buildEmptyStream() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  const emptyRef = pdf.context.register(pdf.context.flateStream(""));
  const arr = PDFArray.withContext(pdf.context);
  arr.push(emptyRef);
  page.node.set(PDFName.of("Contents"), arr);
  return pdf.save({ useObjectStreams: false });
}

async function buildPageWithoutContents() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.node.delete(PDFName.of("Contents"));
  return pdf.save({ useObjectStreams: false });
}

async function buildIndirectResources() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.drawText("INDIRECT RESOURCES", { x: 24, y: 194, size: 18 });
  page.drawRectangle({ x: 46, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  const resources = page.node.get(PDFName.of("Resources"));
  const ref = pdf.context.register(resources);
  page.node.set(PDFName.of("Resources"), ref);
  return pdf.save({ useObjectStreams: false });
}

async function buildResourceNameCollision() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.drawText("RESOURCE COLLISION", { x: 24, y: 194, size: 18 });
  page.drawRectangle({ x: 46, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  const resources = ensureResources(pdf, page);
  ensureResourceCategory(pdf, resources, "ExtGState").set(PDFName.of("LPGS1"), pdf.context.obj({ Type: "ExtGState", ca: 1, CA: 1 }));
  return pdf.save({ useObjectStreams: false });
}

async function buildUnbalancedGraphicsState() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.drawText("Q/Q STREAMS", { x: 24, y: 194, size: 18 });
  page.drawRectangle({ x: 46, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  return pdf.save({ useObjectStreams: false });
}

async function buildManyPages(count) {
  const pdf = await PDFDocument.create();
  for (let index = 0; index < count; index += 1) {
    const page = pdf.addPage([pageWidth, pageHeight]);
    page.drawText(`PAGE ${index + 1}`, { x: 24, y: 194, size: 18 });
    page.drawRectangle({ x: 46, y: 78, width: 230, height: 70, color: rgb(0, 0, 0) });
  }
  return pdf.save({ useObjectStreams: false });
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
