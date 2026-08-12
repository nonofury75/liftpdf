import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  type PDFImage,
  type PDFPage,
  type PDFFont,
  type PDFRef,
  type RGB,
} from "pdf-lib";

export type WatermarkStreamRef = string;

export type TextWatermarkPlacement = {
  text: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
};

export type ImageWatermarkPlacement = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export function prependTextWatermarkStream({
  pdf,
  page,
  font,
  color,
  opacity,
  placements,
}: {
  pdf: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  color: RGB;
  opacity: number;
  placements: TextWatermarkPlacement[];
}) {
  if (!placements.length) {
    throw new Error("No text watermark placements were provided.");
  }

  const resources = ensureResources(pdf, page);
  const fontName = uniqueResourceName(resources, "Font", "LPFont");
  const extGStateName = uniqueResourceName(resources, "ExtGState", "LPGS");

  ensureResourceCategory(pdf, resources, "Font").set(fontName, font.ref);
  ensureResourceCategory(pdf, resources, "ExtGState").set(
    extGStateName,
    pdf.context.obj({
      Type: "ExtGState",
      ca: clampOpacity(opacity),
      CA: clampOpacity(opacity),
    }),
  );

  const operators = placements
    .flatMap((placement) =>
      textWatermarkOperators({
        placement,
        fontName,
        extGStateName,
        color,
      }),
    )
    .join("\n");

  return prependWatermarkOperators(pdf, page, operators);
}

export function prependImageWatermarkStream({
  pdf,
  page,
  image,
  opacity,
  placements,
}: {
  pdf: PDFDocument;
  page: PDFPage;
  image: PDFImage;
  opacity: number;
  placements: ImageWatermarkPlacement[];
}) {
  if (!placements.length) {
    throw new Error("No image watermark placements were provided.");
  }

  const resources = ensureResources(pdf, page);
  const imageName = uniqueResourceName(resources, "XObject", "LPImg");
  const extGStateName = uniqueResourceName(resources, "ExtGState", "LPGS");

  ensureResourceCategory(pdf, resources, "XObject").set(imageName, image.ref);
  ensureResourceCategory(pdf, resources, "ExtGState").set(
    extGStateName,
    pdf.context.obj({
      Type: "ExtGState",
      ca: clampOpacity(opacity),
      CA: clampOpacity(opacity),
    }),
  );

  const operators = placements
    .flatMap((placement) =>
      imageWatermarkOperators({
        placement,
        imageName,
        extGStateName,
      }),
    )
    .join("\n");

  return prependWatermarkOperators(pdf, page, operators);
}

export function verifyPrependedWatermarkStreams({
  pdf,
  pageIndexes,
  watermarkRefs,
}: {
  pdf: PDFDocument;
  pageIndexes: number[];
  watermarkRefs: WatermarkStreamRef[];
}) {
  if (pageIndexes.length !== watermarkRefs.length) {
    return false;
  }

  return pageIndexes.every((pageIndex, index) => {
    const firstRef = getFirstContentStreamRef(pdf.getPage(pageIndex));
    return firstRef === watermarkRefs[index];
  });
}

export function getFirstContentStreamRef(page: PDFPage) {
  const contents = page.node.get(PDFName.of("Contents"));

  if (!contents) {
    return null;
  }

  if (contents instanceof PDFArray) {
    if (contents.size() === 0) {
      return null;
    }

    return contents.get(0).toString();
  }

  return contents.toString();
}

function prependWatermarkOperators(
  pdf: PDFDocument,
  page: PDFPage,
  operators: string,
) {
  const stream = pdf.context.flateStream(operators);
  const streamRef = pdf.context.register(stream);
  prependContentStream(pdf, page, streamRef);
  return streamRef.toString();
}

function prependContentStream(
  pdf: PDFDocument,
  page: PDFPage,
  streamRef: PDFRef,
) {
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

function ensureResources(pdf: PDFDocument, page: PDFPage) {
  const resourcesKey = PDFName.of("Resources");
  const inheritedResources = page.node.Resources();

  if (inheritedResources instanceof PDFDict) {
    page.node.set(resourcesKey, inheritedResources);
    return inheritedResources;
  }

  const existing = page.node.get(resourcesKey);
  const lookedUp = existing ? pdf.context.lookup(existing) : undefined;

  if (lookedUp instanceof PDFDict) {
    return lookedUp;
  }

  const resources = pdf.context.obj({});
  page.node.set(resourcesKey, resources);
  return resources;
}

function ensureResourceCategory(
  pdf: PDFDocument,
  resources: PDFDict,
  category: string,
) {
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

function uniqueResourceName(
  resources: PDFDict,
  category: string,
  prefix: string,
) {
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

function textWatermarkOperators({
  placement,
  fontName,
  extGStateName,
  color,
}: {
  placement: TextWatermarkPlacement;
  fontName: PDFName;
  extGStateName: PDFName;
  color: RGB;
}) {
  const matrix = rotationMatrix(placement.rotation);

  return [
    "q",
    `/${extGStateName.decodeText()} gs`,
    `${formatNumber(color.red)} ${formatNumber(color.green)} ${formatNumber(color.blue)} rg`,
    "BT",
    `/${fontName.decodeText()} ${formatNumber(placement.size)} Tf`,
    `${matrix} ${formatNumber(placement.x)} ${formatNumber(placement.y)} Tm`,
    `(${escapePdfString(placement.text)}) Tj`,
    "ET",
    "Q",
  ];
}

function imageWatermarkOperators({
  placement,
  imageName,
  extGStateName,
}: {
  placement: ImageWatermarkPlacement;
  imageName: PDFName;
  extGStateName: PDFName;
}) {
  const radians = (placement.rotation * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const a = placement.width * cos;
  const b = placement.width * sin;
  const c = -placement.height * sin;
  const d = placement.height * cos;

  return [
    "q",
    `/${extGStateName.decodeText()} gs`,
    `${formatNumber(a)} ${formatNumber(b)} ${formatNumber(c)} ${formatNumber(d)} ${formatNumber(placement.x)} ${formatNumber(placement.y)} cm`,
    `/${imageName.decodeText()} Do`,
    "Q",
  ];
}

function rotationMatrix(rotation: number) {
  const radians = (rotation * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return [
    formatNumber(cos),
    formatNumber(sin),
    formatNumber(-sin),
    formatNumber(cos),
    "0",
    "0",
  ].join(" ");
}

function escapePdfString(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n");
}

function formatNumber(value: number) {
  const normalized = Object.is(value, -0) ? 0 : value;
  return Number(normalized.toFixed(4)).toString();
}

function clampOpacity(opacity: number) {
  return Math.min(1, Math.max(0.01, opacity));
}
