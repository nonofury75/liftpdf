const invalidPdfFileNamePattern = /[<>:"/\\|?*\u0000-\u001f]/;
const maxPdfOutputFileNameLength = 120;

type ParsePdfOutputFileNameOptions = {
  allowEmptyFallback?: boolean;
};

export function getPdfOutputFileNameBase(fileName: string) {
  return fileName.replace(/\.pdf$/i, "");
}

export function getSafePdfOutputFileNameOrFallback(
  value: string,
  fallbackFileName: string,
) {
  try {
    return parsePdfOutputFileName(value, fallbackFileName, {
      allowEmptyFallback: true,
    });
  } catch {
    return fallbackFileName;
  }
}

export function parsePdfOutputFileName(
  value: string,
  fallbackFileName: string,
  options: ParsePdfOutputFileNameOptions = {},
) {
  const trimmed = value.trim();
  const candidate =
    trimmed ||
    (options.allowEmptyFallback
      ? getPdfOutputFileNameBase(fallbackFileName)
      : "");

  if (!candidate) {
    throw new Error("Enter a valid file name.");
  }

  if (invalidPdfFileNamePattern.test(candidate)) {
    throw new Error(
      'File name cannot contain < > : " / \\ | ? * or control characters.',
    );
  }

  const withoutExtension = candidate.replace(/\.pdf$/i, "").trim();

  if (!withoutExtension || /^\.+$/.test(withoutExtension)) {
    throw new Error("Enter a valid file name.");
  }

  const finalFileName = candidate.toLowerCase().endsWith(".pdf")
    ? candidate
    : `${candidate}.pdf`;

  if (finalFileName.length > maxPdfOutputFileNameLength) {
    throw new Error(
      `File name must be ${maxPdfOutputFileNameLength} characters or fewer, including .pdf.`,
    );
  }

  return finalFileName;
}
