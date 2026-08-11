export type ExifOrientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ImageRotation = 0 | 90 | 180 | 270;

export type ImageOrientationTransform = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
};

export function parseExifOrientation(bytes: ArrayBuffer): ExifOrientation {
  const view = new DataView(bytes);

  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
    return 1;
  }

  let offset = 2;

  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) {
      return 1;
    }

    const marker = view.getUint8(offset + 1);
    offset += 2;

    if (marker === 0xda || marker === 0xd9) {
      break;
    }

    if (offset + 2 > view.byteLength) {
      return 1;
    }

    const segmentLength = view.getUint16(offset);
    const segmentStart = offset + 2;
    const segmentEnd = offset + segmentLength;

    if (segmentLength < 2 || segmentEnd > view.byteLength) {
      return 1;
    }

    if (marker === 0xe1) {
      const orientation = readExifApp1Orientation(view, segmentStart, segmentEnd);

      if (orientation) {
        return orientation;
      }
    }

    offset = segmentEnd;
  }

  return 1;
}

export function getExifOrientedDimensions({
  height,
  orientation,
  width,
}: {
  height: number;
  orientation: ExifOrientation;
  width: number;
}) {
  return orientation >= 5
    ? { height: width, width: height }
    : { height, width };
}

export function getRotatedImageDimensions({
  height,
  rotation,
  width,
}: {
  height: number;
  rotation: ImageRotation;
  width: number;
}) {
  return rotation === 90 || rotation === 270
    ? { height: width, width: height }
    : { height, width };
}

export function normalizeImageRotation(rotation: number): ImageRotation {
  return (((rotation % 360) + 360) % 360) as ImageRotation;
}

export function getExifCanvasTransform({
  height,
  orientation,
  width,
}: {
  height: number;
  orientation: ExifOrientation;
  width: number;
}): ImageOrientationTransform {
  switch (orientation) {
    case 2:
      return { a: -1, b: 0, c: 0, d: 1, e: width, f: 0 };
    case 3:
      return { a: -1, b: 0, c: 0, d: -1, e: width, f: height };
    case 4:
      return { a: 1, b: 0, c: 0, d: -1, e: 0, f: height };
    case 5:
      return { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0 };
    case 6:
      return { a: 0, b: 1, c: -1, d: 0, e: height, f: 0 };
    case 7:
      return { a: 0, b: -1, c: -1, d: 0, e: height, f: width };
    case 8:
      return { a: 0, b: -1, c: 1, d: 0, e: 0, f: width };
    case 1:
    default:
      return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  }
}

function readExifApp1Orientation(
  view: DataView,
  segmentStart: number,
  segmentEnd: number,
): ExifOrientation | null {
  if (segmentStart + 14 > segmentEnd) {
    return null;
  }

  if (
    view.getUint8(segmentStart) !== 0x45 ||
    view.getUint8(segmentStart + 1) !== 0x78 ||
    view.getUint8(segmentStart + 2) !== 0x69 ||
    view.getUint8(segmentStart + 3) !== 0x66 ||
    view.getUint8(segmentStart + 4) !== 0x00 ||
    view.getUint8(segmentStart + 5) !== 0x00
  ) {
    return null;
  }

  const tiffStart = segmentStart + 6;
  const byteOrder = view.getUint16(tiffStart);
  const littleEndian =
    byteOrder === 0x4949 ? true : byteOrder === 0x4d4d ? false : null;

  if (littleEndian === null) {
    return null;
  }

  if (tiffStart + 8 > segmentEnd || view.getUint16(tiffStart + 2, littleEndian) !== 42) {
    return null;
  }

  const firstIfdOffset = view.getUint32(tiffStart + 4, littleEndian);
  const ifdStart = tiffStart + firstIfdOffset;

  if (ifdStart < tiffStart || ifdStart + 2 > segmentEnd) {
    return null;
  }

  const entryCount = view.getUint16(ifdStart, littleEndian);
  const entriesStart = ifdStart + 2;
  const entriesEnd = entriesStart + entryCount * 12;

  if (entriesEnd > segmentEnd) {
    return null;
  }

  for (let index = 0; index < entryCount; index += 1) {
    const entryOffset = entriesStart + index * 12;
    const tag = view.getUint16(entryOffset, littleEndian);

    if (tag !== 0x0112) {
      continue;
    }

    const type = view.getUint16(entryOffset + 2, littleEndian);
    const count = view.getUint32(entryOffset + 4, littleEndian);

    if (type !== 3 || count < 1) {
      return null;
    }

    const value = view.getUint16(entryOffset + 8, littleEndian);

    return isExifOrientation(value) ? value : null;
  }

  return null;
}

function isExifOrientation(value: number): value is ExifOrientation {
  return value >= 1 && value <= 8;
}
