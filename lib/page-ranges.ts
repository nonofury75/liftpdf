export function parsePageRangeInput(input: string, pageCount: number) {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    throw new Error("Enter page numbers or ranges separated by commas.");
  }

  const selectedPages = new Set<number>();

  for (const part of trimmedInput.split(",")) {
    const token = part.trim();

    if (!token) {
      throw new Error(
        "Enter page numbers or ranges separated by commas, for example 1-3, 5, 8-10.",
      );
    }

    const singlePageMatch = /^(\d+)$/.exec(token);

    if (singlePageMatch) {
      addPageNumber(Number(singlePageMatch[1]));
      continue;
    }

    const rangeMatch = /^(\d+)\s*-\s*(\d+)$/.exec(token);

    if (rangeMatch) {
      const startPage = Number(rangeMatch[1]);
      const endPage = Number(rangeMatch[2]);

      if (startPage > endPage) {
        throw new Error("Page ranges must go from low to high, for example 2-5.");
      }

      for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
        addPageNumber(pageNumber);
      }

      continue;
    }

    throw new Error(
      "Enter page numbers or ranges separated by commas, for example 1-3, 5, 8-10.",
    );
  }

  return Array.from(selectedPages).sort((a, b) => a - b);

  function addPageNumber(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > pageCount) {
      throw new Error(
        `This PDF has ${pageCount} pages. Enter pages between 1 and ${pageCount}.`,
      );
    }

    selectedPages.add(pageNumber);
  }
}

export function formatSelectedPagesSummary(pageNumbers: number[]) {
  if (!pageNumbers.length) {
    return "0 pages";
  }

  if (pageNumbers.length === 1) {
    return `Page ${pageNumbers[0]}`;
  }

  return `${pageNumbers.length} pages`;
}
