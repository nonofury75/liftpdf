import fs from "node:fs";
import path from "node:path";
import { inflateSync } from "node:zlib";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import JSZip from "jszip";
import { PDFArray, PDFDict, PDFName, PDFDocument, PDFString } from "pdf-lib";
import { ensureFixtures, fixturesDir } from "./fixtures";
import {
  getExpectedQpdfPermissionValue,
  inspectQpdfEncryption,
  type PdfModificationPermission,
  type PdfPrintingPermission,
} from "../../components/tools/pdf/qpdf-client";
import {
  getSafePdfOutputFileNameOrFallback,
  parsePdfOutputFileName,
} from "../../lib/output-filename";
import { parseExifOrientation } from "../../lib/image-orientation";

const toolPages = [
  { href: "/jpg-to-pdf", title: "JPG to PDF Converter" },
  { href: "/png-to-pdf", title: "PNG to PDF Converter" },
  { href: "/images-to-pdf", title: "Images to PDF Converter" },
  { href: "/merge-pdf", title: "Merge PDF Online" },
  { href: "/split-pdf", title: "Split PDF Online" },
  { href: "/compress-pdf", title: "Compress PDF Online" },
  { href: "/pdf-to-jpg", title: "PDF to JPG Converter" },
  { href: "/pdf-to-png", title: "PDF to PNG Converter" },
  { href: "/rotate-pdf", title: "Rotate PDF Online" },
  { href: "/add-page-numbers", title: "Add Page Numbers to PDF" },
  { href: "/watermark-pdf", title: "Watermark PDF Online" },
  { href: "/delete-pages", title: "Delete PDF Pages" },
  { href: "/extract-pages", title: "Extract PDF Pages" },
  { href: "/reorder-pages", title: "Reorder PDF Pages" },
  { href: "/protect-pdf", title: "Protect PDF" },
  { href: "/unlock-pdf", title: "Unlock PDF" },
  { href: "/pdf-to-text", title: "PDF to Text" },
];

const clientRuntimeErrors = new WeakMap<TestInfo, string[]>();

test.beforeAll(async () => {
  await ensureFixtures();
});

test.beforeEach(async ({ page }, testInfo) => {
  const errors: string[] = [];
  clientRuntimeErrors.set(testInfo, errors);

  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.stack ?? error.message}`);
  });

  page.on("requestfailed", (request) => {
    const url = request.url();
    const errorText = request.failure()?.errorText ?? "";
    const isCriticalAsset =
      url.includes("/_next/") ||
      url.includes("/qpdf/") ||
      url.includes("pdf.worker") ||
      url.endsWith(".wasm");

    if (isCriticalAsset && !errorText.includes("ERR_ABORTED")) {
      errors.push(
        `requestfailed: ${url} ${errorText}`.trim(),
      );
    }
  });
});

test.afterEach(async ({ page }, testInfo) => {
  const errors = clientRuntimeErrors.get(testInfo) ?? [];

  if (errors.length === 0) {
    await expect(page.getByText(/Application error|Erreur d'application/i)).toHaveCount(0);
    await expect(
      page.getByText(
        /Something went wrong|The app needs to reload|Quelque chose s'est mal passé|L'outil n'a pas pu se charger/i,
      ),
    ).toHaveCount(0);
  }

  expect(errors).toEqual([]);
});

test.describe("navigation and catalog", () => {
  test("homepage and catalog load with available tools", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Every PDF Tool You Need" }),
    ).toBeVisible();

    await page.goto("/pdf-tools");
    await expect(
      page.getByRole("heading", { name: "All PDF Tools" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Merge PDF/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /PDF to Text/i }).first()).toBeVisible();
  });

  for (const tool of toolPages) {
    test(`${tool.href} loads`, async ({ page }) => {
      await page.goto(tool.href);
      await expect(
        page.getByRole("heading", { name: tool.title, exact: true }),
      ).toBeVisible();
      await expect(page.getByText("Related Tools")).toBeVisible();
    });
  }

  test("Search Console opportunity pages expose enriched guidance", async ({
    page,
  }) => {
    for (const href of ["/extract-pages", "/delete-pages", "/reorder-pages"]) {
      await page.goto(href);
      await expect(page.getByText("Common problems")).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: "Quick answers before editing your PDF",
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "See the tool before you use it" }),
      ).toBeVisible();
      await expect(
        page.getByText(/without Adobe|password-protected|selected pages/i).first(),
      ).toBeVisible();
    }
  });

  test("Merge PDF guide cluster routes render and link back to tools", async ({
    page,
  }) => {
    const guideRoutes = [
      "/guides/how-to-merge-pdf",
      "/guides/merge-pdf-online",
      "/guides/merge-pdf-without-adobe",
      "/guides/merge-two-pdf-files",
      "/guides/merge-multiple-pdf-files",
      "/guides/merge-pdf-on-windows",
      "/guides/merge-pdf-on-mac",
      "/guides/merge-pdf-on-iphone",
      "/guides/merge-pdf-on-android",
      "/guides/merge-pdf-free",
      "/guides/why-cant-i-merge-pdf-files",
      "/guides/why-is-my-merged-pdf-too-large",
      "/guides/why-does-merge-pdf-fail",
      "/guides/why-cant-i-merge-protected-pdfs",
      "/guides/merge-pdf-vs-combine-pdf",
      "/guides/merge-pdf-vs-adobe",
      "/guides/merge-pdf-vs-smallpdf",
      "/guides/merge-pdf-vs-ilovepdf",
      "/guides/merge-pdf-faq",
    ];

    for (const route of guideRoutes) {
      await page.goto(route);
      await expect(page.getByRole("link", { name: /Merge/i }).first()).toBeVisible();
      await expect(page.getByText("Questions about merging PDFs")).toBeVisible();
      await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
    }

    const sitemap = await page.request.get("/sitemap.xml");
    expect(await sitemap.text()).toContain("/guides/how-to-merge-pdf");
    expect(await sitemap.text()).toContain("/guides/merge-pdf-vs-ilovepdf");
  });

  test("JPG to PDF guide cluster routes render and link back to tools", async ({
    page,
  }) => {
    const guideRoutes = [
      "/guides/how-to-convert-jpg-to-pdf",
      "/guides/how-to-convert-multiple-jpg-to-pdf",
      "/guides/how-to-convert-jpg-to-pdf-without-losing-quality",
      "/guides/jpg-to-pdf-online",
      "/guides/jpg-to-pdf-without-adobe",
      "/guides/jpg-to-pdf-on-windows",
      "/guides/jpg-to-pdf-on-mac",
      "/guides/jpg-to-pdf-on-iphone",
      "/guides/jpg-to-pdf-on-android",
      "/guides/jpg-to-pdf-free",
      "/guides/why-is-my-jpg-blurry-after-pdf",
      "/guides/why-is-my-pdf-too-large-after-converting-jpg",
      "/guides/why-cant-i-convert-jpg-to-pdf",
      "/guides/how-to-keep-original-image-quality",
      "/guides/jpg-vs-png",
      "/guides/jpg-to-pdf-vs-word",
      "/guides/jpg-to-pdf-vs-smallpdf",
      "/guides/jpg-to-pdf-vs-adobe",
      "/guides/jpg-to-pdf-faq",
    ];

    for (const route of guideRoutes) {
      await page.goto(route);
      await expect(
        page.getByRole("link", { name: /JPG to PDF|Convert/i }).first(),
      ).toBeVisible();
      await expect(page.getByText("Questions about JPG to PDF")).toBeVisible();
      await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
    }

    const sitemap = await page.request.get("/sitemap.xml");
    const sitemapText = await sitemap.text();
    expect(sitemapText).toContain("/guides/how-to-convert-jpg-to-pdf");
    expect(sitemapText).toContain("/guides/jpg-to-pdf-vs-adobe");
  });

  test("Learning Center routes, foundation guides and resource navigation render", async ({
    page,
  }) => {
    const learningRoutes = [
      "/learn",
      "/guides",
      "/learn/pdf-basics",
      "/learn/convert-pdf",
      "/learn/organize-pdf",
      "/learn/edit-pdf",
      "/learn/pdf-security",
      "/learn/pdf-images",
      "/learn/troubleshooting",
      "/learn/comparisons",
      "/pdf-glossary",
      "/help",
      "/cookies",
      "/guides/what-is-a-pdf",
      "/guides/jpg-vs-jpeg",
      "/guides/png-vs-pdf",
      "/guides/what-is-pdf-compression",
      "/guides/what-is-a-password-protected-pdf",
      "/guides/what-is-browser-based-pdf-processing",
      "/guides/scanned-pdf-vs-searchable-pdf",
      "/guides/how-to-reduce-pdf-file-size-for-email",
      "/guides/how-to-combine-scanned-documents-into-one-pdf",
      "/guides/how-to-prepare-a-pdf-for-online-submission",
      "/guides/how-to-organize-pdf-pages-before-sending",
      "/guides/how-to-turn-phone-photos-into-a-pdf",
      "/guides/how-to-keep-pdf-images-sharp",
      "/guides/why-pdf-opens-blank",
      "/guides/why-a-pdf-is-password-protected",
      "/guides/pdf-vs-jpg",
      "/guides/pdf-vs-png",
      "/guides/how-to-compress-pdf-without-losing-quality",
      "/guides/compress-pdf-for-email",
      "/guides/reduce-scanned-pdf-size",
      "/guides/pdf-compression-vs-optimization",
      "/guides/how-to-convert-pdf-to-jpg",
      "/guides/how-to-convert-pdf-to-png",
      "/guides/pdf-to-jpg-vs-pdf-to-png",
      "/guides/why-are-pdf-to-jpg-images-blurry",
      "/guides/how-to-copy-text-from-pdf",
      "/guides/why-cant-i-copy-text-from-pdf",
      "/guides/how-to-tell-if-pdf-is-scanned",
      "/guides/protect-pdf-before-sending",
      "/guides/unlock-pdf-with-known-password",
      "/guides/password-protected-pdf-not-opening",
      "/guides/make-pdf-smaller-for-upload",
      "/guides/pdf-file-size-limit-explained",
      "/guides/convert-receipts-to-pdf",
      "/guides/combine-screenshots-into-pdf",
      "/guides/turn-school-assignment-photos-into-pdf",
      "/guides/remove-blank-pages-from-pdf",
      "/guides/fix-pdf-pages-out-of-order",
      "/guides/rotate-scanned-pdf-pages",
      "/guides/add-page-numbers-to-pdf-report",
      "/guides/add-confidential-watermark-to-pdf",
      "/guides/extract-text-from-pdf-without-ocr",
      "/guides/why-pdf-text-extraction-fails",
      "/guides/split-pdf-into-separate-pages",
      "/guides/split-pdf-by-page-range",
      "/guides/save-selected-pages-from-pdf",
      "/guides/delete-pages-from-pdf-before-sending",
      "/guides/organize-pdf-before-printing",
      "/guides/prepare-pdf-for-email",
      "/guides/rotate-pdf-before-upload",
      "/guides/watermark-pdf-before-sharing",
      "/guides/add-page-numbers-before-sharing-pdf",
      "/guides/extract-pdf-pages-for-email",
    ];

    for (const route of learningRoutes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached();
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    }

    await page.goto("/");
    const isDesktopNavVisible = await page
      .getByRole("link", { name: "Learn", exact: true })
      .isVisible()
      .catch(() => false);
    if (!isDesktopNavVisible) {
      await expect(
        page.getByRole("link", { name: "Learning Center", exact: true }),
      ).toBeVisible();
    }
    await expect(
      page.getByRole("heading", { name: "Guides when the right workflow is not obvious" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Learning Center" }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "PDF Glossary" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Help Center" })).toBeVisible();

    await page.goto("/guides");
    await page.getByPlaceholder("Search guides").fill("browser");
    await expect(page.getByText(/Browser-based PDF processing/i).first()).toBeVisible();

    const sitemap = await page.request.get("/sitemap.xml");
    const sitemapText = await sitemap.text();
    expect(sitemapText).toContain("/learn");
    expect(sitemapText).toContain("/learn/pdf-basics");
    expect(sitemapText).toContain("/pdf-glossary");
    expect(sitemapText).toContain("/cookies");
    expect(sitemapText).toContain("/guides/what-is-a-pdf");
    expect(sitemapText).toContain("/guides/pdf-vs-jpg");
    expect(sitemapText).toContain("/guides/how-to-compress-pdf-without-losing-quality");
    expect(sitemapText).toContain("/guides/how-to-copy-text-from-pdf");
    expect(sitemapText).toContain("/guides/protect-pdf-before-sending");
    expect(sitemapText).toContain("/guides/make-pdf-smaller-for-upload");
    expect(sitemapText).toContain("/guides/convert-receipts-to-pdf");
    expect(sitemapText).toContain("/guides/remove-blank-pages-from-pdf");
    expect(sitemapText).toContain("/guides/split-pdf-into-separate-pages");
    expect(sitemapText).toContain("/guides/prepare-pdf-for-email");
    expect(sitemapText).toContain("/guides/watermark-pdf-before-sharing");
    expect(sitemapText).not.toContain("/guides/merge-pdf-on-windows");
    expect(sitemapText).not.toContain("/guides/jpg-to-pdf-on-iphone");
  });

  test("SEO expansion guides expose unique search intent and SEO images", async ({
    page,
  }) => {
    const expansionRoutes = [
      {
        route: "/guides/how-to-compress-pdf-without-losing-quality",
        heading: "How to Compress a PDF Without Losing Quality",
        image: /compression workflow/i,
      },
      {
        route: "/guides/how-to-convert-pdf-to-jpg",
        heading: "How to Convert PDF to JPG",
        image: /PDF to image workflow/i,
      },
      {
        route: "/guides/how-to-copy-text-from-pdf",
        heading: "How to Copy Text From a PDF",
        image: /Selectable PDF text/i,
      },
      {
        route: "/guides/protect-pdf-before-sending",
        heading: "How to Protect a PDF Before Sending It",
        image: /PDF password workflow/i,
      },
      {
        route: "/guides/make-pdf-smaller-for-upload",
        heading: "How to Make a PDF Smaller for Upload",
        image: /Online PDF submission workflow/i,
      },
      {
        route: "/guides/convert-receipts-to-pdf",
        heading: "How to Convert Receipts to PDF",
        image: /Phone photos to PDF workflow/i,
      },
      {
        route: "/guides/remove-blank-pages-from-pdf",
        heading: "How to Remove Blank Pages From a PDF",
        image: /PDF page cleanup workflow/i,
      },
      {
        route: "/guides/add-confidential-watermark-to-pdf",
        heading: "How to Add a Confidential Watermark to a PDF",
        image: /PDF report polish workflow/i,
      },
      {
        route: "/guides/split-pdf-into-separate-pages",
        heading: "How to Split a PDF Into Separate Pages",
        image: /Split PDF workflow/i,
      },
      {
        route: "/guides/save-selected-pages-from-pdf",
        heading: "How to Save Selected Pages From a PDF",
        image: /Selected PDF pages workflow/i,
      },
      {
        route: "/guides/organize-pdf-before-printing",
        heading: "How to Organize a PDF Before Printing",
        image: /Final PDF checklist workflow/i,
      },
      {
        route: "/guides/watermark-pdf-before-sharing",
        heading: "Watermark PDF Before Sharing",
        image: /PDF editing controls workflow/i,
      },
    ];

    for (const item of expansionRoutes) {
      const response = await page.goto(item.route);
      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole("heading", { name: item.heading, exact: true }),
      ).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`${item.route}$`),
      );
      await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
      await expect(page.locator("img").first()).toHaveAttribute("alt", item.image);
      await expect(page.getByRole("heading", { name: "What you need to know first" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Related resources" })).toBeVisible();
    }
  });

  test("editorial depth pages expose premium article structure and redirects", async ({
    page,
  }) => {
    const pillarRoutes = [
      "/guides/what-is-a-pdf",
      "/guides/how-to-merge-pdf",
      "/guides/how-to-convert-jpg-to-pdf",
      "/guides/how-to-extract-pages-from-pdf",
      "/guides/what-is-pdf-compression",
      "/guides/scanned-pdf-vs-searchable-pdf",
      "/guides/what-is-browser-based-pdf-processing",
      "/guides/what-is-a-password-protected-pdf",
      "/guides/jpg-vs-png",
      "/guides/extract-pages-vs-split-pdf",
      "/guides/why-is-my-pdf-too-large",
      "/guides/why-is-my-jpg-blurry-after-pdf",
    ];

    for (const route of pillarRoutes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole("heading", { name: "LiftPDF Editorial Team" }),
      ).toBeVisible();
      await expect(
        page.getByText("Updated Jul 16, 2026", { exact: true }),
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: "What you need to know first" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Related resources" })).toBeVisible();
      await expect(page.locator("img").first()).toHaveAttribute("alt", /.+/);
    }

    const mergeRedirect = await page.goto("/guides/merge-pdf-on-windows");
    expect(mergeRedirect?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/guides\/how-to-merge-pdf$/);

    const jpgRedirect = await page.goto("/guides/jpg-to-pdf-on-android");
    expect(jpgRedirect?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/guides\/how-to-convert-jpg-to-pdf$/);
  });

  test("GA4 does not load locally without a measurement ID", async ({ page }) => {
    const analyticsRequests: string[] = [];

    page.on("request", (request) => {
      const url = request.url();
      if (
        url.includes("googletagmanager.com/gtag/js") ||
        url.includes("google-analytics.com/g/collect")
      ) {
        analyticsRequests.push(url);
      }
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Every PDF Tool You Need" })).toBeVisible();
    await expect(page.getByLabel("Analytics consent")).toHaveCount(0);
    expect(analyticsRequests).toEqual([]);
  });
});

test.describe("critical PDF workflows", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "desktop-only heavy flows");
  });

  test("PDF output filename helper normalizes and rejects unsafe names", () => {
    expect(parsePdfOutputFileName("document", "merged.pdf")).toBe(
      "document.pdf",
    );
    expect(parsePdfOutputFileName("document.pdf", "merged.pdf")).toBe(
      "document.pdf",
    );
    expect(parsePdfOutputFileName("document.PDF", "merged.pdf")).toBe(
      "document.PDF",
    );
    expect(parsePdfOutputFileName("  Client Documents  ", "merged.pdf")).toBe(
      "Client Documents.pdf",
    );
    expect(getSafePdfOutputFileNameOrFallback("", "images.pdf")).toBe(
      "images.pdf",
    );
    expect(() => parsePdfOutputFileName("bad/name", "merged.pdf")).toThrow(
      /cannot contain/i,
    );
    expect(() => parsePdfOutputFileName("bad\\name", "merged.pdf")).toThrow(
      /cannot contain/i,
    );
    expect(() => parsePdfOutputFileName("", "merged.pdf")).toThrow(
      /valid file name/i,
    );
    expect(() => parsePdfOutputFileName("   ", "merged.pdf")).toThrow(
      /valid file name/i,
    );
    expect(() => parsePdfOutputFileName(".", "merged.pdf")).toThrow(
      /valid file name/i,
    );
    expect(() => parsePdfOutputFileName("..", "merged.pdf")).toThrow(
      /valid file name/i,
    );
    expect(() =>
      parsePdfOutputFileName("a".repeat(121), "merged.pdf"),
    ).toThrow(/120 characters/i);
  });

  test("merge, split, delete, extract, reorder and compress PDFs", async ({
    page,
  }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [fixtures.text1, fixtures.text10]);
    await expect(page.getByText(/2 PDFs/i)).toBeVisible();
    await expect(page.getByText(/^11$/)).toBeVisible();
    await page
      .getByText("text-10.pdf")
      .dragTo(page.getByText("text-1.pdf"));
    await expect(page.locator("li").filter({ hasText: "text-10.pdf" })).toContainText(
      "Position 1 in the merged PDF",
    );
    const mergeDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /^Merge PDF$/ }).click();
    const mergeDownload = await mergeDownloadPromise;
    expect(mergeDownload.suggestedFilename()).toBe("merged.pdf");
    await expect(page.getByRole("link", { name: /^Download PDF$/ })).toBeVisible();
    const mergedBytes = await readGeneratedFileBytes(page, "merged.pdf");
    const mergedPdf = await PDFDocument.load(mergedBytes);
    expect(mergedPdf.getPageCount()).toBe(11);
    await page.getByRole("button", { name: /^Start over$|^Reset$/i }).click();
    await expect(page.getByText("text-1.pdf")).toHaveCount(0);

    await page.goto("/split-pdf");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Page 10" })).toBeVisible();
    await page.getByRole("button", { name: /Extract page ranges/i }).click();
    await page.getByRole("textbox").fill("1,3,5-8");
    await expect(page.getByText("1, 3, 5-8")).toBeVisible();
    await page.getByRole("textbox").fill("2,5,8");
    const splitDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /^Split PDF$/ }).click();
    const splitDownload = await splitDownloadPromise;
    expect(splitDownload.suggestedFilename()).toBe("split.pdf");
    await expect(page.getByRole("link", { name: /^Download PDF$/ })).toBeVisible();
    const splitBytes = await readGeneratedFileBytes(page, "split.pdf");
    expect((await PDFDocument.load(splitBytes)).getPageCount()).toBe(3);
    await page.getByRole("textbox").fill("99");
    await expect(page.getByText(/Page 99 does not exist/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Split PDF$/ })).toBeDisabled();

    await page.getByRole("button", { name: /Split every page/i }).click();
    const splitZipDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /^Split PDF$/ }).click();
    const splitZipDownload = await splitZipDownloadPromise;
    expect(splitZipDownload.suggestedFilename()).toBe("split-pages.zip");
    const splitZip = await JSZip.loadAsync(
      await readGeneratedFileBytes(page, "split-pages.zip"),
    );
    expect(Object.keys(splitZip.files).filter((name) => name.endsWith(".pdf"))).toHaveLength(10);

    await page.goto("/delete-pages");
    await uploadFirstFile(page, fixtures.text10);
    await expect(
      page.getByRole("button", { name: "Select page 1", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Select page 1", exact: true }).click();
    await page.getByRole("button", { name: /^Remove Selected$/ }).click();
    await expect(
      page.getByRole("button", { name: "Select page 1", exact: true }),
    ).toHaveCount(0);
    const deletedBytes = await generateThenDownloadBytes(
      page,
      /^Delete Pages$/,
      /^Download PDF$/,
      "pages-deleted.pdf",
    );
    expect((await PDFDocument.load(deletedBytes)).getPageCount()).toBe(9);

    await page.goto("/extract-pages");
    await uploadFirstFile(page, fixtures.text10);
    await expect(
      page.getByRole("button", { name: "Select page 2", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Select page 2", exact: true }).click();
    await page.getByRole("button", { name: "Select page 5", exact: true }).click();
    const extractedBytes = await generateThenDownloadBytes(
      page,
      /^Extract Selected$/,
      /^Download PDF$/,
      "pages-extracted.pdf",
    );
    expect((await PDFDocument.load(extractedBytes)).getPageCount()).toBe(2);

    await page.getByRole("button", { name: /Separate PDFs in ZIP/i }).click();
    const extractedZipBytes = await generateThenDownloadBytes(
      page,
      /^Extract Selected$/,
      /^Download ZIP$/,
      "extracted-pages.zip",
    );
    const extractedZip = await JSZip.loadAsync(extractedZipBytes);
    expect(getPdfZipEntryNames(extractedZip)).toEqual([
      "extracted-page-2.pdf",
      "extracted-page-5.pdf",
    ]);

    await page.goto("/reorder-pages");
    await uploadFirstFile(page, fixtures.text10);
    await expect(
      page.getByRole("button", { name: /Move original page 10 left/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: /Move original page 10 left/i }).click();
    const reorderedBytes = await generateThenDownloadBytes(
      page,
      /^Reorder PDF$/,
      /^Download PDF$/,
      "pages-reordered.pdf",
    );
    expect((await PDFDocument.load(reorderedBytes)).getPageCount()).toBe(10);

    await page.goto("/compress-pdf");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    const compressedBytes = await generateThenDownloadBytes(
      page,
      /^Compress PDF$/,
      /^Download compressed PDF$/,
      "compressed.pdf",
    );
    expect((await PDFDocument.load(compressedBytes)).getPageCount()).toBe(10);
  });

  test("merge PDF isolates invalid protected and empty files without losing valid files", async ({
    page,
  }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [
      fixtures.phase51A,
      fixtures.phase51B,
      fixtures.phase51C,
    ]);
    await expect(page.getByText("phase51-a.pdf")).toBeVisible();
    await expect(readyMergeFileCards(page)).toHaveCount(3);
    await expect(page.getByRole("button", { name: /^Merge PDF$/ })).toBeEnabled();
    const threeReadyBytes = await generateThenDownloadBytes(
      page,
      /^Merge PDF$/,
      /^Download PDF$/,
      "merged.pdf",
    );
    expect((await PDFDocument.load(threeReadyBytes)).getPageCount()).toBe(3);
    expect(await extractPdfPageText(threeReadyBytes, 1)).toContain("PHASE51-A");
    expect(await extractPdfPageText(threeReadyBytes, 2)).toContain("PHASE51-B");
    expect(await extractPdfPageText(threeReadyBytes, 3)).toContain("PHASE51-C");

    await page.goto("/protect-pdf");
    await uploadFirstFile(page, fixtures.phase51C);
    await page.getByLabel("Password", { exact: true }).fill("MergePass123");
    await page
      .getByLabel("Confirm password", { exact: true })
      .fill("MergePass123");
    const protectedBytes = await downloadBytes(
      page,
      /^Protect PDF$/,
      "protected.pdf",
    );
    const protectedPath = path.join(fixturesDir, "phase51-protected.pdf");
    fs.writeFileSync(protectedPath, protectedBytes);

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [fixtures.phase51A, protectedPath, fixtures.phase51B]);
    await expect(page.getByText("phase51-a.pdf")).toBeVisible();
    await expect(page.getByText("phase51-b.pdf")).toBeVisible();
    await expect(page.getByText("Password protected").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /^Unlock PDF$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Merge PDF$/ })).toBeDisabled();
    await page.getByRole("button", { name: /Remove phase51-protected.pdf/i }).click();
    await expect(page.getByText("Password protected")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^Merge PDF$/ })).toBeEnabled();
    const afterProtectedRemoval = await generateThenDownloadBytes(
      page,
      /^Merge PDF$/,
      /^Download PDF$/,
      "merged.pdf",
    );
    expect((await PDFDocument.load(afterProtectedRemoval)).getPageCount()).toBe(2);
    const protectedRemovalText = `${await extractPdfPageText(
      afterProtectedRemoval,
      1,
    )} ${await extractPdfPageText(afterProtectedRemoval, 2)}`;
    expect(protectedRemovalText).toContain("PHASE51-A");
    expect(protectedRemovalText).toContain("PHASE51-B");
    expect(protectedRemovalText).not.toContain("PHASE51-C");

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [fixtures.phase51A, fixtures.phase51B]);
    await expect(readyMergeFileCards(page)).toHaveCount(2);
    await page.getByLabel("Add more PDF files").setInputFiles(fixtures.invalidPdf);
    await expect(page.getByText("Invalid PDF").first()).toBeVisible();
    await expect(page.getByText("phase51-a.pdf")).toBeVisible();
    await expect(page.getByText("phase51-b.pdf")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Merge PDF$/ })).toBeDisabled();
    await page.getByRole("button", { name: /Remove invalid.pdf/i }).click();
    await expect(page.getByRole("button", { name: /^Merge PDF$/ })).toBeEnabled();
    const afterInvalidRemoval = await generateThenDownloadBytes(
      page,
      /^Merge PDF$/,
      /^Download PDF$/,
      "merged.pdf",
    );
    expect((await PDFDocument.load(afterInvalidRemoval)).getPageCount()).toBe(2);
    expect(await extractPdfPageText(afterInvalidRemoval, 1)).toContain("PHASE51-A");
    expect(await extractPdfPageText(afterInvalidRemoval, 2)).toContain("PHASE51-B");

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [fixtures.phase51A, fixtures.emptyPdf, fixtures.phase51B]);
    await expect(page.getByText("Empty file").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /^Merge PDF$/ })).toBeDisabled();
    await page.getByRole("button", { name: /Remove empty.pdf/i }).click();
    await expect(page.getByRole("button", { name: /^Merge PDF$/ })).toBeEnabled();

    const batchPaths = Array.from({ length: 10 }, (_, index) => {
      const batchPath = path.join(fixturesDir, `phase51-valid-${index + 1}.pdf`);
      fs.copyFileSync(fixtures.phase51A, batchPath);
      return batchPath;
    });
    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [...batchPaths, fixtures.invalidPdf]);
    await expect(page.getByText("Invalid PDF").first()).toBeVisible();
    await expect(readyMergeFileCards(page)).toHaveCount(10);
    await page.getByRole("button", { name: /Remove invalid.pdf/i }).click();
    const tenValidBytes = await generateThenDownloadBytes(
      page,
      /^Merge PDF$/,
      /^Download PDF$/,
      "merged.pdf",
    );
    expect((await PDFDocument.load(tenValidBytes)).getPageCount()).toBe(10);
  });

  test("Merge PDF supports an editable output filename without weakening validation", async ({
    page,
  }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [fixtures.phase52A, fixtures.phase52B]);
    await expect(readyMergeFileCards(page)).toHaveCount(2);
    const defaultDownload = await mergeAndCaptureAutomaticDownload(
      page,
      "merged.pdf",
    );
    expect((await PDFDocument.load(defaultDownload)).getPageCount()).toBe(2);

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [fixtures.phase52A, fixtures.phase52B]);
    await page.getByLabel("Output file name").fill("client-package");
    const customDownload = await mergeAndCaptureAutomaticDownload(
      page,
      "client-package.pdf",
    );
    expect((await PDFDocument.load(customDownload)).getPageCount()).toBe(2);
    expect(await extractPdfPageText(customDownload, 1)).toContain("PHASE52-A");
    expect(await extractPdfPageText(customDownload, 2)).toContain("PHASE52-B");
    await expect(
      page.locator('a[download="client-package.pdf"]').last(),
    ).toBeVisible();
    expect(await readGeneratedFileBytes(page, "client-package.pdf")).toHaveLength(
      customDownload.length,
    );

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [fixtures.phase52A, fixtures.phase52B]);
    await page.getByLabel("Output file name").fill("phase52-final.pdf");
    await mergeAndCaptureAutomaticDownload(page, "phase52-final.pdf");

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [fixtures.phase52A, fixtures.phase52B]);
    await page.getByLabel("Output file name").fill("phase52-final.PDF");
    await mergeAndCaptureAutomaticDownload(page, "phase52-final.PDF");
    await expect(
      page.locator('a[download="phase52-final.PDF.pdf"]'),
    ).toHaveCount(0);

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [fixtures.phase52A, fixtures.phase52B]);
    await page.getByLabel("Output file name").fill("phase52/test.pdf");
    await expect(
      page.getByText(/File name cannot contain/i),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Merge PDF$/ })).toBeDisabled();

    await page.getByLabel("Output file name").fill("   ");
    await expect(page.getByText(/Enter a valid file name/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Merge PDF$/ })).toBeDisabled();

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [
      fixtures.phase52A,
      fixtures.phase51C,
      fixtures.phase52B,
    ]);
    await page.getByLabel("Output file name").fill("reordered-bundle.pdf");
    await page.getByRole("button", { name: /Move phase51-c.pdf down/i }).click();
    await expect(page.getByLabel("Output file name")).toHaveValue(
      "reordered-bundle.pdf",
    );
    await mergeAndCaptureAutomaticDownload(page, "reordered-bundle.pdf");

    await page.goto("/merge-pdf");
    await uploadFirstFile(page, [
      fixtures.phase52A,
      fixtures.invalidPdf,
      fixtures.phase52B,
    ]);
    await expect(page.getByText("Invalid PDF").first()).toBeVisible();
    await page.getByLabel("Output file name").fill("valid-bundle.pdf");
    await page.getByRole("button", { name: /Remove invalid.pdf/i }).click();
    await expect(page.getByLabel("Output file name")).toHaveValue(
      "valid-bundle.pdf",
    );
    await mergeAndCaptureAutomaticDownload(page, "valid-bundle.pdf");

    await page.getByRole("button", { name: /^Start over$/ }).click();
    await expect(page.getByLabel("Output file name")).toHaveValue("merged");
  });

  test("compress PDF exposes real QPDF modes with measurable outputs", async ({
    page,
  }) => {
    test.setTimeout(180000);
    const fixtures = await ensureFixtures();

    await page.goto("/compress-pdf");
    await uploadFirstFile(page, fixtures.imageHeavy);
    await expect(page.getByText(/6 pages/i).first()).toBeVisible();

    const outputs: Record<string, Buffer> = {};

    for (const mode of ["Preserve quality", "Balanced", "Strong"]) {
      await page.getByRole("button", { name: new RegExp(mode, "i") }).click();
      const bytes = await generateThenDownloadBytes(
        page,
        /^Compress PDF$/,
        /^Download compressed PDF$/,
        "compressed.pdf",
      );
      outputs[mode] = bytes;
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(6);
      await expect(
        page.getByRole("heading", { name: /^Before and after preview$/ }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /^Original$/ }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /^Compressed$/ }),
      ).toBeVisible();
      await expect(
        page.getByAltText(/^Compressed first page preview$/),
      ).toBeVisible();
    }

    expect(outputs["Preserve quality"].byteLength).not.toBe(
      outputs.Balanced.byteLength,
    );
    expect(outputs.Strong.byteLength).not.toBe(outputs.Balanced.byteLength);
    expect(outputs.Balanced.byteLength).toBeLessThanOrEqual(
      outputs["Preserve quality"].byteLength,
    );
    expect(outputs.Strong.byteLength).toBeLessThanOrEqual(
      outputs.Balanced.byteLength,
    );
  });

  test("extract pages exports selected pages as separate marked PDFs", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Deep ZIP/PDF assertions run once.");
    const fixtures = await ensureFixtures();

    await page.goto("/extract-pages");
    await uploadFirstFile(page, fixtures.phase46Markers);
    await expect(
      page.getByRole("button", { name: "Select page 2", exact: true }),
    ).toBeVisible();

    for (const pageNumber of [2, 4, 6]) {
      await page
        .getByRole("button", { name: `Select page ${pageNumber}`, exact: true })
        .click();
    }

    await page.getByRole("button", { name: /Separate PDFs in ZIP/i }).click();
    const zipBytes = await generateThenDownloadBytes(
      page,
      /^Extract Selected$/,
      /^Download ZIP$/,
      "extracted-pages.zip",
    );
    const zip = await JSZip.loadAsync(zipBytes);

    expect(getPdfZipEntryNames(zip)).toEqual([
      "extracted-page-2.pdf",
      "extracted-page-4.pdf",
      "extracted-page-6.pdf",
    ]);

    for (const pageNumber of [2, 4, 6]) {
      const entryBytes = await getZipPdfBytes(
        zip,
        `extracted-page-${pageNumber}.pdf`,
      );
      expect((await PDFDocument.load(entryBytes)).getPageCount()).toBe(1);
      const pageText = await extractPdfPageText(entryBytes, 1);
      expect(pageText).toContain(`PHASE46-PAGE-${pageNumber}`);

      for (const otherPageNumber of [1, 2, 3, 4, 5, 6]) {
        if (otherPageNumber !== pageNumber) {
          expect(pageText).not.toContain(`PHASE46-PAGE-${otherPageNumber}`);
        }
      }
    }

    await page.getByRole("button", { name: /One PDF with selected pages/i }).click();
    const combinedBytes = await generateThenDownloadBytes(
      page,
      /^Extract Selected$/,
      /^Download PDF$/,
      "pages-extracted.pdf",
    );
    expect((await PDFDocument.load(combinedBytes)).getPageCount()).toBe(3);
    await expectExtractedPageMarker(combinedBytes, 1, "PHASE46-PAGE-2");
    await expectExtractedPageMarker(combinedBytes, 2, "PHASE46-PAGE-4");
    await expectExtractedPageMarker(combinedBytes, 3, "PHASE46-PAGE-6");
  });

  test("compress PDF can remove metadata without changing page count", async ({
    page,
  }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/compress-pdf");
    await uploadFirstFile(page, fixtures.metadataRich);
    await expect(page.getByText(/1 page/i).first()).toBeVisible();
    const metadataToggle = page.getByLabel(/Remove document metadata/i);
    await expect(metadataToggle).not.toBeChecked();

    await page.getByRole("button", { name: /Preserve quality/i }).click();
    const keptBytes = await generateThenDownloadBytes(
      page,
      /^Compress PDF$/,
      /^Download compressed PDF$/,
      "compressed.pdf",
    );
    expect((await PDFDocument.load(keptBytes)).getPageCount()).toBe(1);
    expect(await readPdfMetadata(keptBytes)).toMatchObject({
      title: "LiftPDF Metadata Rich Fixture",
      author: "LiftPDF QA",
      subject: "Compression and metadata test",
      creator: "LiftPDF Test Fixture Creator",
    });

    await page.goto("/compress-pdf");
    await uploadFirstFile(page, fixtures.metadataRich);
    await page.getByRole("button", { name: /Preserve quality/i }).click();
    await page.getByLabel(/Remove document metadata/i).check();
    const cleanedBytes = await generateThenDownloadBytes(
      page,
      /^Compress PDF$/,
      /^Download compressed PDF$/,
      "compressed.pdf",
    );
    expect((await PDFDocument.load(cleanedBytes)).getPageCount()).toBe(1);
    const cleanedMetadata = await readPdfMetadata(cleanedBytes);
    expect(cleanedMetadata.title ?? "").toBe("");
    expect(cleanedMetadata.author ?? "").toBe("");
    expect(cleanedMetadata.subject ?? "").toBe("");
    expect(cleanedMetadata.creator ?? "").not.toBe(
      "LiftPDF Test Fixture Creator",
    );
    expect(
      cleanedBytes.includes(Buffer.from("LiftPDF Metadata Rich Fixture")),
    ).toBe(false);

    await page.goto("/compress-pdf");
    await uploadFirstFile(page, fixtures.metadataRich);
    await page.getByRole("button", { name: /Strong/i }).click();
    await expect(page.getByLabel(/Remove document metadata/i)).toBeChecked();
  });

  test("compress PDF preserves forms links and annotations", async ({
    page,
  }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/compress-pdf");
    await uploadFirstFile(page, fixtures.annotatedPdf);
    await page.getByRole("button", { name: /Preserve quality/i }).click();
    const annotatedBytes = await generateThenDownloadBytes(
      page,
      /^Compress PDF$/,
      /^Download compressed PDF$/,
      "compressed.pdf",
    );
    expect((await PDFDocument.load(annotatedBytes)).getPageCount()).toBe(1);
    expect(await pdfHasLinkAnnotation(annotatedBytes, "https://liftpdf.com")).toBe(
      true,
    );

    await page.goto("/compress-pdf");
    await uploadFirstFile(page, fixtures.formPdf);
    await page.getByRole("button", { name: /Preserve quality/i }).click();
    const formBytes = await generateThenDownloadBytes(
      page,
      /^Compress PDF$/,
      /^Download compressed PDF$/,
      "compressed.pdf",
    );
    const formPdf = await PDFDocument.load(formBytes);
    expect(formPdf.getPageCount()).toBe(1);
    expect(pdfHasAcroForm(formPdf)).toBe(true);
    expect(formPdf.getForm().getFields().length).toBeGreaterThanOrEqual(2);
  });

  test("split PDF creates fixed interval ZIP groups with explicit names", async ({
    page,
  }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/split-pdf");
    await uploadFirstFile(page, fixtures.phase44Markers);
    await expect(page.getByText(/12 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /Split every N pages/i }).click();
    await page.getByLabel("Pages per PDF").fill("5");
    await expect(page.getByText("Pages 1-5")).toBeVisible();
    await expect(page.getByText("Pages 6-10")).toBeVisible();
    await expect(page.getByText("Pages 11-12")).toBeVisible();

    const intervalFiveBytes = await generateThenDownloadBytes(
      page,
      /^Split PDF$/,
      /^Download ZIP$/,
      "split-pages.zip",
    );
    const intervalFiveZip = await JSZip.loadAsync(intervalFiveBytes);
    const intervalFiveNames = getPdfZipEntryNames(intervalFiveZip);
    expect(intervalFiveNames).toEqual([
      "split-pages-1-5.pdf",
      "split-pages-6-10.pdf",
      "split-pages-11-12.pdf",
    ]);

    const firstGroup = await getZipPdfBytes(
      intervalFiveZip,
      "split-pages-1-5.pdf",
    );
    const secondGroup = await getZipPdfBytes(
      intervalFiveZip,
      "split-pages-6-10.pdf",
    );
    const thirdGroup = await getZipPdfBytes(
      intervalFiveZip,
      "split-pages-11-12.pdf",
    );
    expect((await PDFDocument.load(firstGroup)).getPageCount()).toBe(5);
    expect((await PDFDocument.load(secondGroup)).getPageCount()).toBe(5);
    expect((await PDFDocument.load(thirdGroup)).getPageCount()).toBe(2);
    await expectPdfTextMarkers(firstGroup, [1, 5], [6, 11]);
    await expectPdfTextMarkers(secondGroup, [6, 10], [5, 11]);
    await expectPdfTextMarkers(thirdGroup, [11, 12], [1, 10]);

    for (const { interval, expectedEntries } of [
      { interval: "1", expectedEntries: 12 },
      { interval: "2", expectedEntries: 6 },
      { interval: "10", expectedEntries: 2 },
      { interval: "12", expectedEntries: 1 },
    ]) {
      await page.goto("/split-pdf");
      await uploadFirstFile(page, fixtures.phase44Markers);
      await page.getByRole("button", { name: /Split every N pages/i }).click();
      await page.getByLabel("Pages per PDF").fill(interval);
      const bytes = await generateThenDownloadBytes(
        page,
        /^Split PDF$/,
        /^Download ZIP$/,
        "split-pages.zip",
      );
      const zip = await JSZip.loadAsync(bytes);
      expect(getPdfZipEntryNames(zip)).toHaveLength(expectedEntries);
    }

    await page.goto("/split-pdf");
    await uploadFirstFile(page, fixtures.phase44Markers);
    await page.getByRole("button", { name: /Split every N pages/i }).click();
    await page.getByLabel("Pages per PDF").fill("13");
    await expect(
      page.getByText(/This PDF has 12 pages. Enter a value between 1 and 12./i),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Split PDF$/ })).toBeDisabled();
    await page.getByLabel("Pages per PDF").fill("2.5");
    await expect(page.getByText(/must be a whole number/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Split PDF$/ })).toBeDisabled();

    await page.goto("/split-pdf");
    await uploadFirstFile(page, fixtures.text1);
    await page.getByRole("button", { name: /Split every N pages/i }).click();
    await page.getByLabel("Pages per PDF").fill("1");
    const singlePageZipBytes = await generateThenDownloadBytes(
      page,
      /^Split PDF$/,
      /^Download ZIP$/,
      "split-pages.zip",
    );
    const singlePageZip = await JSZip.loadAsync(singlePageZipBytes);
    expect(getPdfZipEntryNames(singlePageZip)).toEqual(["split-pages-1.pdf"]);
    expect(
      (await PDFDocument.load(await getZipPdfBytes(singlePageZip, "split-pages-1.pdf"))).getPageCount(),
    ).toBe(1);

    await page.goto("/split-pdf");
    await uploadFirstFile(page, fixtures.text100);
    await page.getByRole("button", { name: /Split every N pages/i }).click();
    await page.getByLabel("Pages per PDF").fill("10");
    const hundredPageZipBytes = await generateThenDownloadBytes(
      page,
      /^Split PDF$/,
      /^Download ZIP$/,
      "split-pages.zip",
    );
    const hundredPageZip = await JSZip.loadAsync(hundredPageZipBytes);
    expect(getPdfZipEntryNames(hundredPageZip)).toHaveLength(10);
  });

  test("rotate PDF targets all selected odd even and page ranges", async ({
    page,
  }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.phase45Markers);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Odd pages$/ }).click();
    await page.getByRole("button", { name: /^Rotate right 90 deg$/ }).click();
    const oddBytes = await generateThenDownloadBytes(
      page,
      /^Rotate PDF$/,
      /^Download rotated PDF$/,
      "rotated.pdf",
    );
    await expectPageRotations(oddBytes, {
      1: 90,
      2: 0,
      3: 90,
      4: 0,
      5: 90,
      6: 0,
      7: 90,
      8: 0,
      9: 90,
      10: 0,
    });

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.phase45Markers);
    await page.getByRole("button", { name: /^Even pages$/ }).click();
    await page.getByRole("button", { name: /^Rotate left 90 deg$/ }).click();
    const evenBytes = await generateThenDownloadBytes(
      page,
      /^Rotate PDF$/,
      /^Download rotated PDF$/,
      "rotated.pdf",
    );
    await expectPageRotations(evenBytes, {
      1: 0,
      2: 270,
      3: 0,
      4: 270,
      5: 0,
      6: 270,
      7: 0,
      8: 270,
      9: 0,
      10: 270,
    });

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.phase45Markers);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("2-4,8");
    await page.getByRole("button", { name: /^Rotate 180 deg$/ }).click();
    const rangeBytes = await generateThenDownloadBytes(
      page,
      /^Rotate PDF$/,
      /^Download rotated PDF$/,
      "rotated.pdf",
    );
    await expectPageRotations(rangeBytes, {
      1: 0,
      2: 180,
      3: 180,
      4: 180,
      5: 0,
      6: 0,
      7: 0,
      8: 180,
      9: 0,
      10: 0,
    });

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.phase45Markers);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("1,1,3");
    await page.getByRole("button", { name: /^Rotate right 90 deg$/ }).click();
    const dedupedRangeBytes = await generateThenDownloadBytes(
      page,
      /^Rotate PDF$/,
      /^Download rotated PDF$/,
      "rotated.pdf",
    );
    await expectPageRotations(dedupedRangeBytes, { 1: 90, 2: 0, 3: 90 });

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.phase45Markers);
    await page.getByRole("button", { name: /^Selected pages$/ }).click();
    await page.getByRole("button", { name: /^Select page 2$/ }).click();
    await page.getByRole("button", { name: /^Rotate right 90 deg$/ }).click();
    await page.getByRole("button", { name: /^Rotate right 90 deg$/ }).click();
    const cumulativeBytes = await generateThenDownloadBytes(
      page,
      /^Rotate PDF$/,
      /^Download rotated PDF$/,
      "rotated.pdf",
    );
    await expectPageRotations(cumulativeBytes, { 1: 0, 2: 180, 3: 0 });

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.phase45Markers);
    await page.getByRole("button", { name: /^All pages$/ }).click();
    await page.getByRole("button", { name: /^Rotate 180 deg$/ }).click();
    const allBytes = await generateThenDownloadBytes(
      page,
      /^Rotate PDF$/,
      /^Download rotated PDF$/,
      "rotated.pdf",
    );
    await expectPageRotations(allBytes, {
      1: 180,
      2: 180,
      3: 180,
      4: 180,
      5: 180,
      6: 180,
      7: 180,
      8: 180,
      9: 180,
      10: 180,
    });

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.phase45Markers);
    await page.getByRole("button", { name: /^Selected pages$/ }).click();
    await expect(page.getByRole("button", { name: /^Rotate right 90 deg$/ })).toBeDisabled();
    await page.getByRole("button", { name: /^Select page 2$/ }).click();
    await page.getByRole("button", { name: /^Rotate right 90 deg$/ }).click();
    await page.getByRole("button", { name: /^Reset rotations$/ }).click();
    const resetBytes = await generateThenDownloadBytes(
      page,
      /^Rotate PDF$/,
      /^Download rotated PDF$/,
      "rotated.pdf",
    );
    await expectPageRotations(resetBytes, { 1: 0, 2: 0, 3: 0 });

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.phase45Markers);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("99");
    await expect(
      page.getByText(/This PDF has 10 pages. Enter pages between 1 and 10./i),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Rotate right 90 deg$/ })).toBeDisabled();

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.text1);
    await page.getByRole("button", { name: /^Odd pages$/ }).click();
    await expect(page.getByText(/Targeted pages: All 1/i)).toBeVisible();
    await page.getByRole("button", { name: /^Even pages$/ }).click();
    await expect(page.getByText(/Targeted pages: 0/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Rotate right 90 deg$/ })).toBeDisabled();

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.text100);
    await page.getByRole("button", { name: /^Odd pages$/ }).click();
    await page.getByRole("button", { name: /^Rotate right 90 deg$/ }).click();
    const hundredPageBytes = await generateThenDownloadBytes(
      page,
      /^Rotate PDF$/,
      /^Download rotated PDF$/,
      "rotated.pdf",
    );
    expect((await PDFDocument.load(hundredPageBytes)).getPageCount()).toBe(100);
    await expectPageRotations(hundredPageBytes, {
      1: 90,
      2: 0,
      99: 90,
      100: 0,
    });
  });

  test("protect and unlock use real PDF encryption", async ({ page }) => {
    const fixtures = await ensureFixtures();
    const password = "StrongPass123";

    await page.goto("/protect-pdf");
    await uploadFirstFile(page, fixtures.text1);
    await expect(page.getByText(/1 page/i).first()).toBeVisible();
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm password", { exact: true }).fill(password);
    const protectedBytes = await downloadBytes(
      page,
      /^Protect PDF$/,
      "protected.pdf",
    );
    expect(Buffer.from(protectedBytes).includes(Buffer.from("/Encrypt"))).toBe(
      true,
    );

    const protectedPath = path.join(fixturesDir, "protected.pdf");
    fs.writeFileSync(protectedPath, protectedBytes);

    await page.goto("/unlock-pdf");
    await uploadFirstFile(page, protectedPath);
    await page.getByRole("button", { name: /^Unlock PDF$/ }).click();
    await expect(page.getByText(/Please enter the PDF password/i)).toBeVisible();

    await page.getByLabel("PDF password", { exact: true }).fill("wrong");
    await page.getByRole("button", { name: /^Unlock PDF$/ }).click();
    await expect(page.getByText(/password is incorrect/i)).toBeVisible();

    await page.getByLabel("PDF password", { exact: true }).fill(password);
    const unlockedBytes = await downloadBytes(
      page,
      /^Unlock PDF$/,
      "unlocked.pdf",
    );
    expect(Buffer.from(unlockedBytes).includes(Buffer.from("/Encrypt"))).toBe(
      false,
    );
    expect((await PDFDocument.load(unlockedBytes)).getPageCount()).toBe(1);
  });

  test("protect PDF writes verified owner password permission flags", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Deep QPDF permission checks run once.");
    const fixtures = await ensureFixtures();
    const cases: Array<{
      name: string;
      printing: PdfPrintingPermission;
      copying: "Allowed" | "Not allowed";
      modification: PdfModificationPermission;
      modificationLabel: string;
    }> = [
      {
        name: "permissive",
        printing: "full",
        copying: "Allowed",
        modification: "all",
        modificationLabel: "Full editing",
      },
      {
        name: "restricted",
        printing: "none",
        copying: "Not allowed",
        modification: "none",
        modificationLabel: "No editing",
      },
      {
        name: "low assembly",
        printing: "low",
        copying: "Allowed",
        modification: "assembly",
        modificationLabel: "Page assembly only",
      },
      {
        name: "form filling",
        printing: "full",
        copying: "Not allowed",
        modification: "form",
        modificationLabel: "Form filling and signing",
      },
      {
        name: "annotate",
        printing: "full",
        copying: "Allowed",
        modification: "annotate",
        modificationLabel: "Comments and form filling",
      },
    ];

    for (const testCase of cases) {
      await page.goto("/protect-pdf");
      await uploadFirstFile(page, fixtures.formPdf);
      await expect(page.getByText(/1 page/i).first()).toBeVisible();
      await page.getByLabel("Password", { exact: true }).fill("UserPass123!");
      await page
        .getByLabel("Confirm password", { exact: true })
        .fill("UserPass123!");
      await page.locator("summary", { hasText: "Advanced permissions" }).click();
      await page
        .getByLabel("Owner password", { exact: true })
        .fill("OwnerPass123!");
      await page
        .getByLabel("Confirm owner password", { exact: true })
        .fill("OwnerPass123!");
      await page
        .getByRole("group", { name: /^Printing$/ })
        .getByRole("button", {
          name: new RegExp(`^${escapeRegExp(formatTestPrinting(testCase.printing))}$`),
        })
        .click();
      await page
        .getByRole("group", { name: /^Copying text and images$/ })
        .getByRole("button", { name: new RegExp(`^${testCase.copying}$`) })
        .click();
      await page
        .getByRole("group", { name: /^Editing$/ })
        .getByRole("button", { name: new RegExp(`^${testCase.modificationLabel}$`) })
        .click();

      const protectedBytes = await downloadBytes(
        page,
        /^Protect PDF$/,
        "protected.pdf",
      );
      const inspection = inspectQpdfEncryption(protectedBytes);

      expect(inspection.encrypted).toBe(true);
      expect(inspection.aes256).toBe(true);
      expect(inspection.permissions.rawP).toBe(
        getExpectedQpdfPermissionValue({
          printing: testCase.printing,
          allowExtraction: testCase.copying === "Allowed",
          modification: testCase.modification,
        }),
      );
      expect(inspection.permissions.printing).toBe(testCase.printing);
      expect(inspection.permissions.allowExtraction).toBe(
        testCase.copying === "Allowed",
      );
      expect(inspection.permissions.modification).toBe(testCase.modification);
      expect(inspection.permissions.accessibility).toBe(true);

      if (testCase.name === "restricted") {
        const protectedPath = path.join(fixturesDir, "owner-restricted.pdf");
        fs.writeFileSync(protectedPath, protectedBytes);
        await page.goto("/unlock-pdf");
        await uploadFirstFile(page, protectedPath);
        await page
          .getByLabel("PDF password", { exact: true })
          .fill("OwnerPass123!");
        const unlockedBytes = await downloadBytes(
          page,
          /^Unlock PDF$/,
          "unlocked.pdf",
        );
        expect(inspectQpdfEncryption(unlockedBytes).encrypted).toBe(false);
        expect((await PDFDocument.load(unlockedBytes)).getPageCount()).toBe(1);
      }
    }

    await page.goto("/protect-pdf");
    await uploadFirstFile(page, fixtures.text1);
    await page.getByLabel("Password", { exact: true }).fill("SamePass123!");
    await page
      .getByLabel("Confirm password", { exact: true })
      .fill("SamePass123!");
    await page.locator("summary", { hasText: "Advanced permissions" }).click();
    await page
      .getByLabel("Owner password", { exact: true })
      .fill("SamePass123!");
    await page
      .getByLabel("Confirm owner password", { exact: true })
      .fill("SamePass123!");
    await page.getByRole("button", { name: /^Protect PDF$/ }).click();
    await expect(
      page.getByText(/Owner password must be different/i),
    ).toBeVisible();
    await expect(
      page.getByText(/PDF permissions are respected by compatible PDF readers/i),
    ).toBeVisible();
  });

  test("unlock PDF removes restriction-only owner-password protection", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Deep QPDF restriction checks run once.");
    const fixtures = await ensureFixtures();
    const ownerPassword = "OwnerPass123!";
    const restrictedPath = path.join(fixturesDir, "phase48-restriction-only.pdf");

    await page.goto("/unlock-pdf");
    const restrictedBytes = await createEncryptedPdfWithBrowserQpdf(
      page,
      fixtures.formPdf,
      {
        userPassword: "",
        ownerPassword,
        printing: "none",
        allowExtraction: false,
        modification: "none",
      },
    );
    fs.writeFileSync(restrictedPath, restrictedBytes);
    const restrictedInspection = inspectQpdfEncryption(restrictedBytes);
    expect(restrictedInspection.encrypted).toBe(true);
    expect(restrictedInspection.permissions.rawP).toBe(
      getExpectedQpdfPermissionValue({
        printing: "none",
        allowExtraction: false,
        modification: "none",
      }),
    );

    await page.goto("/unlock-pdf");
    await uploadFirstFile(page, restrictedPath);
    await expect(
      page.getByText(/opens without a password but contains usage restrictions/i),
    ).toBeVisible();
    await expect(page.getByLabel("Owner password", { exact: true })).toBeVisible();
    await expect(page.getByText(/Usage restrictions detected/i)).toBeVisible();

    await page.getByRole("button", { name: /^Unlock PDF$/ }).click();
    await expect(page.getByText(/Please enter the owner password/i)).toBeVisible();

    await page.getByLabel("Owner password", { exact: true }).fill("WrongPass123!");
    await page.getByRole("button", { name: /^Unlock PDF$/ }).click();
    await expect(page.getByText(/owner password is incorrect/i)).toBeVisible();

    await page.getByLabel("Owner password", { exact: true }).fill(ownerPassword);
    const unlockedBytes = await unlockAndReadGeneratedPdf(page);
    expect(inspectQpdfEncryption(unlockedBytes).encrypted).toBe(false);
    expect(Buffer.from(unlockedBytes).includes(Buffer.from("/Encrypt"))).toBe(
      false,
    );

    const unlockedPdf = await PDFDocument.load(unlockedBytes);
    expect(unlockedPdf.getPageCount()).toBe(1);
    expect(unlockedPdf.getForm().getFields().length).toBeGreaterThan(0);
    expect(await extractPdfPageText(unlockedBytes, 1)).toContain(
      "LiftPDF QA Form Fixture",
    );

    const restrictedLinkPath = path.join(fixturesDir, "phase48-link-restricted.pdf");
    const restrictedLinkBytes = await createEncryptedPdfWithBrowserQpdf(
      page,
      fixtures.annotatedPdf,
      {
        userPassword: "",
        ownerPassword,
        printing: "none",
        allowExtraction: false,
        modification: "none",
      },
    );
    fs.writeFileSync(restrictedLinkPath, restrictedLinkBytes);

    await page.goto("/unlock-pdf");
    await uploadFirstFile(page, restrictedLinkPath);
    await expect(
      page.getByText(/opens without a password but contains usage restrictions/i),
    ).toBeVisible();
    await page.getByLabel("Owner password", { exact: true }).fill(ownerPassword);
    const unlockedLinkBytes = await unlockAndReadGeneratedPdf(page);
    expect(inspectQpdfEncryption(unlockedLinkBytes).encrypted).toBe(false);
    const unlockedLinkSource = extractPdfStreamText(unlockedLinkBytes);
    expect(unlockedLinkSource).toContain("/URI");
    expect(unlockedLinkSource).toContain("https://liftpdf.com");

    await page.getByRole("button", { name: /^Unlock another PDF$/ }).click();
    await expect(page.getByLabel("Owner password", { exact: true })).toHaveCount(0);

    await page.goto("/unlock-pdf");
    await uploadFirstFile(page, fixtures.text1);
    await expect(page.getByText(/This PDF is not password protected/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Unlock PDF$/ })).toBeDisabled();

    await page.goto("/unlock-pdf");
    await uploadFirstFile(page, fixtures.invalidPdf);
    await expect(page.getByText(/could not be read/i)).toBeVisible();
  });

  test("PDF to Text handles text, scanned, protected and invalid files", async ({
    page,
  }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.phase41Markers);
    const textBytes = await downloadBytes(
      page,
      /^Extract Text$/,
      "extracted-text.txt",
    );
    const text = Buffer.from(textBytes).toString("utf8");
    expect(text).toContain("Page 1");
    expect(text).toContain("PHASE41-PAGE-1");
    expect(text).toContain("Page 4");
    expect(text).toContain("PHASE41-PAGE-4");

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.phase41Markers);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("2");
    const singlePageBytes = await downloadBytes(
      page,
      /^Extract Text$/,
      "extracted-text.txt",
    );
    const singlePageText = Buffer.from(singlePageBytes).toString("utf8");
    expect(singlePageText).toContain("Page 2");
    expect(singlePageText).toContain("PHASE41-PAGE-2");
    expect(singlePageText).not.toContain("PHASE41-PAGE-1");
    expect(singlePageText).not.toContain("PHASE41-PAGE-3");

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.phase41Markers);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("2-3");
    const rangeBytes = await downloadBytes(
      page,
      /^Extract Text$/,
      "extracted-text.txt",
    );
    const rangeText = Buffer.from(rangeBytes).toString("utf8");
    expect(rangeText).toContain("Page 2");
    expect(rangeText).toContain("PHASE41-PAGE-2");
    expect(rangeText).toContain("Page 3");
    expect(rangeText).toContain("PHASE41-PAGE-3");
    expect(rangeText).not.toContain("PHASE41-PAGE-1");
    expect(rangeText).not.toContain("PHASE41-PAGE-4");

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.phase41Markers);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("1,3");
    const disjointBytes = await downloadBytes(
      page,
      /^Extract Text$/,
      "extracted-text.txt",
    );
    const disjointText = Buffer.from(disjointBytes).toString("utf8");
    expect(disjointText).toContain("PHASE41-PAGE-1");
    expect(disjointText).toContain("PHASE41-PAGE-3");
    expect(disjointText).not.toContain("PHASE41-PAGE-2");
    expect(disjointText).not.toContain("PHASE41-PAGE-4");

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.phase41Markers);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("1-2,4");
    const multiRangeBytes = await downloadBytes(
      page,
      /^Extract Text$/,
      "extracted-text.txt",
    );
    const multiRangeText = Buffer.from(multiRangeBytes).toString("utf8");
    expect(multiRangeText).toContain("PHASE41-PAGE-1");
    expect(multiRangeText).toContain("PHASE41-PAGE-2");
    expect(multiRangeText).toContain("PHASE41-PAGE-4");
    expect(multiRangeText).not.toContain("PHASE41-PAGE-3");

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.phase41Markers);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("1,1,2-3,3");
    const dedupedBytes = await downloadBytes(
      page,
      /^Extract Text$/,
      "extracted-text.txt",
    );
    const dedupedText = Buffer.from(dedupedBytes).toString("utf8");
    expect(dedupedText.match(/Page 1/g)?.length).toBe(1);
    expect(dedupedText.match(/Page 3/g)?.length).toBe(1);
    expect(dedupedText).not.toContain("PHASE41-PAGE-4");

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.phase41Markers);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("0");
    await expect(
      page.getByText(/This PDF has 4 pages. Enter pages between 1 and 4/i),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Extract Text$/ })).toBeDisabled();

    await page.getByLabel("Page range").fill("2-");
    await expect(
      page.getByRole("alert").getByText(/for example 1-3, 5, 8-10/i),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Extract Text$/ })).toBeDisabled();

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.text100);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("95-100");
    const lateRangeBytes = await downloadBytes(
      page,
      /^Extract Text$/,
      "extracted-text.txt",
    );
    const lateRangeText = Buffer.from(lateRangeBytes).toString("utf8");
    expect(lateRangeText).toContain("Page 95");
    expect(lateRangeText).toContain("LiftPDF QA page 95");
    expect(lateRangeText).toContain("Page 100");
    expect(lateRangeText).not.toContain("LiftPDF QA page 94");

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.imageOnly);
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("1");
    await page.getByRole("button", { name: /^Extract Text$/ }).click();
    await expect(
      page.getByText(/No selectable text was found in the selected pages/i),
    ).toBeVisible();

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.invalidPdf);
    await expect(page.getByText(/could not be read/i)).toBeVisible();

    await page.goto("/protect-pdf");
    await uploadFirstFile(page, fixtures.text1);
    await page.getByLabel("Password", { exact: true }).fill("RangePass123");
    await page
      .getByLabel("Confirm password", { exact: true })
      .fill("RangePass123");
    const protectedBytes = await downloadBytes(
      page,
      /^Protect PDF$/,
      "protected.pdf",
    );
    const protectedPath = path.join(fixturesDir, "pdf-to-text-protected.pdf");
    fs.writeFileSync(protectedPath, protectedBytes);

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, protectedPath);
    await expect(page.getByText(/password protected/i)).toBeVisible();
  });

  test("image and PDF export tools generate downloads", async ({ page }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/jpg-to-pdf");
    await uploadFirstFile(page, fixtures.jpg);
    await expect(page.getByText(/sample.jpg/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Rotate .* right/i })).toHaveCount(0);
    const livePreview = page.getByLabel("Live PDF page preview");
    await expect(livePreview).toBeVisible();
    await expect(page.locator('button[aria-pressed="true"]')).toHaveCount(0);
    await page.getByRole("button", { name: /^None$/ }).click();
    await expect(page.getByRole("button", { name: /^None$/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("button", { name: /^Fit$/ }).click();
    await expect(page.getByRole("button", { name: /^Fit$/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(livePreview).toHaveAttribute("data-preview-margin-px", "0");
    await page.getByRole("button", { name: /^A4/ }).click();
    await page.getByRole("button", { name: /^Portrait$/ }).click();
    await expect(livePreview).toHaveAttribute("data-preview-orientation", "portrait");
    await page.getByRole("button", { name: /^Landscape$/ }).click();
    await expect(livePreview).toHaveAttribute("data-preview-orientation", "landscape");
    await page.getByRole("button", { name: /^Large$/ }).click();
    await expect(livePreview).toHaveAttribute("data-preview-margin", "large");
    await page.getByRole("button", { name: /^A4/ }).click();
    await page.getByRole("button", { name: /^Fit$/ }).click();
    const jpgPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "jpg-to-pdf.pdf",
    );
    expect((await PDFDocument.load(jpgPdf)).getPageCount()).toBe(1);

    await page.goto("/jpg-to-pdf");
    await uploadFirstFile(page, fixtures.png);
    await expect(page.getByText(/Only JPG and JPEG files are supported/i)).toBeVisible();

    await page.goto("/png-to-pdf");
    await expect(page.getByText("Drop your PNG images here.")).toBeVisible();
    await uploadFirstFile(page, fixtures.jpg);
    await expect(page.getByText(/Only PNG files are supported/i)).toBeVisible();
    await uploadFirstFile(page, fixtures.png);
    await expect(page.getByText(/sample.png/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Rotate .* right/i })).toHaveCount(0);
    const pngLivePreview = page.getByLabel("Live PDF page preview");
    await expect(pngLivePreview).toBeVisible();
    await expect(page.locator('button[aria-pressed="true"]')).toHaveCount(0);
    await page.getByRole("button", { name: /^None$/ }).click();
    await expect(page.getByRole("button", { name: /^None$/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("button", { name: /^Fit$/ }).click();
    await expect(pngLivePreview).toHaveAttribute("data-preview-margin-px", "0");
    await page.getByRole("button", { name: /^A4/ }).click();
    await page.getByRole("button", { name: /^Landscape$/ }).click();
    await expect(pngLivePreview).toHaveAttribute(
      "data-preview-orientation",
      "landscape",
    );
    await page.getByRole("button", { name: /^Large$/ }).click();
    await expect(pngLivePreview).toHaveAttribute("data-preview-margin", "large");
    const pngPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "png-to-pdf.pdf",
    );
    expect((await PDFDocument.load(pngPdf)).getPageCount()).toBe(1);

    await page.goto("/png-to-pdf");
    await uploadFirstFile(page, fixtures.transparentPng);
    await expect(page.getByText("transparent.png")).toBeVisible();
    const transparentPngPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "png-to-pdf.pdf",
    );
    expect((await PDFDocument.load(transparentPngPdf)).getPageCount()).toBe(1);

    await page.goto("/images-to-pdf");
    await uploadFirstFile(page, fixtures.widePng);
    await expect(page.getByText(/wide-2x1.png/i)).toBeVisible();
    const autoNonePreview = page.getByLabel("Live PDF page preview");
    await expect(page.locator('button[aria-pressed="true"]')).toHaveCount(0);
    await expect(autoNonePreview).toHaveAttribute("data-preview-margin-px", "0");
    await expect(autoNonePreview).toHaveAttribute("data-preview-image-left", "0.000");
    await expect(autoNonePreview).toHaveAttribute("data-preview-image-top", "0.000");
    await expect(autoNonePreview).toHaveAttribute(
      "data-preview-image-width",
      "100.000",
    );
    await expect(autoNonePreview).toHaveAttribute(
      "data-preview-image-height",
      "100.000",
    );
    const autoNonePdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "images.pdf",
    );
    const autoNonePage = (await PDFDocument.load(autoNonePdf)).getPage(0);
    const autoNonePageSize = autoNonePage.getSize();
    expect(autoNonePageSize.width / autoNonePageSize.height).toBeCloseTo(2, 3);
    await page.getByRole("button", { exact: true, name: "Auto" }).click();
    await expect(
      page.getByRole("button", { exact: true, name: "Auto" }),
    ).toHaveAttribute("aria-pressed", "true");

    await page.goto("/images-to-pdf");
    await uploadFirstFile(page, fixtures.widePng);
    await page.getByRole("button", { name: /^A4/ }).click();
    await page.getByRole("button", { name: /^Portrait$/ }).click();
    await page.getByRole("button", { name: /^None$/ }).click();
    await page.getByRole("button", { name: /^Fit$/ }).click();
    await expect(page.getByLabel("Live PDF page preview")).toHaveAttribute(
      "data-preview-margin-px",
      "0",
    );
    const a4PortraitNonePdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "images.pdf",
    );
    expect((await PDFDocument.load(a4PortraitNonePdf)).getPageCount()).toBe(1);

    await page.goto("/images-to-pdf");
    await uploadFirstFile(page, fixtures.widePng);
    await page.getByRole("button", { name: /^A4/ }).click();
    await page.getByRole("button", { name: /^Landscape$/ }).click();
    await page.getByRole("button", { name: /^None$/ }).click();
    await page.getByRole("button", { name: /^Fill$/ }).click();
    await expect(page.getByLabel("Live PDF page preview")).toHaveAttribute(
      "data-preview-margin-px",
      "0",
    );
    const a4LandscapeFillPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "images.pdf",
    );
    expect((await PDFDocument.load(a4LandscapeFillPdf)).getPageCount()).toBe(1);

    await page.goto("/images-to-pdf");
    await uploadFirstFile(page, [fixtures.jpg, fixtures.png]);
    await expect(page.getByText(/sample.jpg/i)).toBeVisible();
    await expect(page.getByText(/sample.png/i)).toBeVisible();
    await page.getByRole("button", { name: /^Letter/ }).click();
    await page.getByRole("button", { name: /^Landscape$/ }).click();
    await page.getByRole("button", { name: /^Fill$/ }).click();
    const imagesPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "images.pdf",
    );
    expect((await PDFDocument.load(imagesPdf)).getPageCount()).toBe(2);

    await page.goto("/images-to-pdf");
    await uploadFirstFile(page, fixtures.rotationMarkerPng);
    await expect(page.getByText(/rotation-marker.png/i)).toBeVisible();
    const rotationPreview = page.getByLabel("Live PDF page preview");
    await expect(rotationPreview).toHaveAttribute("data-preview-image-rotation", "0");
    const rotation0Pdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "images.pdf",
    );
    expect(await getFirstPageOrientation(rotation0Pdf)).toBe("landscape");

    await page.getByRole("button", { name: /Rotate rotation-marker.png right/i }).click();
    await expect(rotationPreview).toHaveAttribute("data-preview-image-rotation", "90");
    const rotation90Pdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "images.pdf",
    );
    expect(await getFirstPageOrientation(rotation90Pdf)).toBe("portrait");

    await page.getByRole("button", { name: /Rotate rotation-marker.png right/i }).click();
    await expect(rotationPreview).toHaveAttribute("data-preview-image-rotation", "180");
    const rotation180Pdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "images.pdf",
    );
    expect(await getFirstPageOrientation(rotation180Pdf)).toBe("landscape");
    expect(extractPdfStreamText(rotation180Pdf)).not.toBe(
      extractPdfStreamText(rotation0Pdf),
    );

    await page.getByRole("button", { name: /Rotate rotation-marker.png right/i }).click();
    await expect(rotationPreview).toHaveAttribute("data-preview-image-rotation", "270");
    const rotation270Pdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "images.pdf",
    );
    expect(await getFirstPageOrientation(rotation270Pdf)).toBe("portrait");
    expect(extractPdfStreamText(rotation270Pdf)).not.toBe(
      extractPdfStreamText(rotation90Pdf),
    );

    await page.getByRole("button", { name: /Rotate rotation-marker.png right/i }).click();
    await expect(rotationPreview).toHaveAttribute("data-preview-image-rotation", "0");

    await page.goto("/images-to-pdf");
    await uploadFirstFile(page, [
      fixtures.pngNoTransparency,
      fixtures.widePng,
      fixtures.rotationMarkerPng,
    ]);
    await page.getByRole("button", { name: /Rotate wide-2x1.png right/i }).click();
    await page.getByRole("button", { name: /Rotate rotation-marker.png right/i }).click();
    await page.getByRole("button", { name: /Rotate rotation-marker.png right/i }).click();
    await page.getByRole("button", { name: /Move rotation-marker.png up/i }).click();
    await page.getByRole("button", { name: /Move rotation-marker.png up/i }).click();
    await page.getByRole("button", { name: /Remove no-transparency.png/i }).click();
    const reorderedRotatedPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "images.pdf",
    );
    const reorderedRotatedDoc = await PDFDocument.load(reorderedRotatedPdf);
    expect(reorderedRotatedDoc.getPageCount()).toBe(2);
    expect(pageOrientation(reorderedRotatedDoc.getPage(0).getSize())).toBe(
      "landscape",
    );
    expect(pageOrientation(reorderedRotatedDoc.getPage(1).getSize())).toBe(
      "portrait",
    );

    await page.goto("/pdf-to-jpg");
    await uploadFirstFile(page, fixtures.text1);
    await expect(page.getByText(/1 page/i).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /^PDF preview$/ })).toBeVisible();
    await page.getByRole("button", { name: /^High$/ }).click();
    const singleJpgBytes = await generateThenDownloadBytes(
      page,
      /^Convert to JPG$/,
      /^Download JPG$/,
      "page-1.jpg",
    );
    expect(Buffer.from(singleJpgBytes).subarray(0, 2).toString("hex")).toBe(
      "ffd8",
    );

    await page.goto("/pdf-to-jpg");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    const allJpgZipBytes = await generateThenDownloadBytes(
      page,
      /^Convert to JPG$/,
      /^Download ZIP$/,
      "pdf-to-jpg.zip",
    );
    expect(Buffer.from(allJpgZipBytes).subarray(0, 2).toString()).toBe("PK");

    await page.goto("/pdf-to-jpg");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("1");
    const rangeOneJpgBytes = await generateThenDownloadBytes(
      page,
      /^Convert to JPG$/,
      /^Download JPG$/,
      "page-1.jpg",
    );
    expect(Buffer.from(rangeOneJpgBytes).subarray(0, 2).toString("hex")).toBe(
      "ffd8",
    );

    await page.goto("/pdf-to-jpg");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("1-2");
    const jpgBytes = await generateThenDownloadBytes(
      page,
      /^Convert to JPG$/,
      /^Download ZIP$/,
      "pdf-to-jpg.zip",
    );
    expect(Buffer.from(jpgBytes).subarray(0, 2).toString()).toBe("PK");

    await page.goto("/pdf-to-jpg");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("50");
    await page.getByRole("button", { name: /^Convert to JPG$/ }).click();
    await expect(
      page.getByText(/Page range cannot include pages outside this PDF/i),
    ).toBeVisible();

    await page.goto("/protect-pdf");
    await uploadFirstFile(page, fixtures.text1);
    await expect(page.getByText(/1 page/i).first()).toBeVisible();
    await page.getByLabel("Password", { exact: true }).fill("StrongPass123");
    await page
      .getByLabel("Confirm password", { exact: true })
      .fill("StrongPass123");
    const jpgProtectedBytes = await downloadBytes(
      page,
      /^Protect PDF$/,
      "protected.pdf",
    );
    const jpgProtectedPath = path.join(fixturesDir, "jpg-protected.pdf");
    fs.writeFileSync(jpgProtectedPath, jpgProtectedBytes);
    await page.goto("/pdf-to-jpg");
    await uploadFirstFile(page, jpgProtectedPath);
    await expect(
      page.getByText(/This PDF is password protected. Please unlock it first/i),
    ).toBeVisible();

    await page.goto("/pdf-to-png");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Single page$/ }).click();
    await page.getByLabel("Page number").fill("2");
    const pngBytes = await generateThenDownloadBytes(
      page,
      /^Convert to PNG$/,
      /^Download PNG$/,
      "page-2.png",
    );
    expect(Buffer.from(pngBytes).subarray(1, 4).toString()).toBe("PNG");
  });

  test("PDF to image handles large documents with warnings and valid ZIP output", async ({
    page,
  }) => {
    test.setTimeout(180000);
    const fixtures = await ensureFixtures();

    await page.goto("/pdf-to-jpg");
    await uploadFirstFile(page, fixtures.text100);
    await expect(page.getByText(/100 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Convert to JPG$/ }).click();
    await expect(page.getByText(/High memory usage expected/i)).toBeVisible();
    await expect(page.getByText(/This conversion may use significant memory/i)).toBeVisible();
    await page.getByRole("button", { name: /^Continue$/ }).click();
    await expect(page.getByText(/Rendering page \d+ of 100/i)).toBeVisible({
      timeout: 15000,
    });
    const jpgZipBytes = await readGeneratedFileBytes(page, "pdf-to-jpg.zip");
    const jpgZip = await JSZip.loadAsync(jpgZipBytes);
    const jpgNames = getZipImageEntryNames(jpgZip, ".jpg");
    expect(jpgNames).toHaveLength(100);
    expect(jpgNames[0]).toBe("page-1.jpg");
    expect(jpgNames[99]).toBe("page-100.jpg");
    const firstJpg = await getZipImageBytes(jpgZip, "page-1.jpg");
    const lastJpg = await getZipImageBytes(jpgZip, "page-100.jpg");
    expect(firstJpg.subarray(0, 2).toString("hex")).toBe("ffd8");
    expect(lastJpg.subarray(0, 2).toString("hex")).toBe("ffd8");
    expect(getJpegDimensions(firstJpg)).toEqual({ width: 1190, height: 1684 });

    await page.goto("/pdf-to-png");
    await uploadFirstFile(page, fixtures.text100);
    await expect(page.getByText(/100 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Convert to PNG$/ }).click();
    await expect(page.getByText(/High memory usage expected/i)).toBeVisible();
    await page.getByRole("button", { name: /^Continue$/ }).click();
    const pngZipBytes = await readGeneratedFileBytes(page, "pdf-to-png.zip");
    const pngZip = await JSZip.loadAsync(pngZipBytes);
    const pngNames = getZipImageEntryNames(pngZip, ".png");
    expect(pngNames).toHaveLength(100);
    expect(pngNames[0]).toBe("page-1.png");
    expect(pngNames[99]).toBe("page-100.png");
    const firstPng = await getZipImageBytes(pngZip, "page-1.png");
    expect(firstPng.subarray(1, 4).toString()).toBe("PNG");
    expect(getPngDimensions(firstPng)).toEqual({ width: 1190, height: 1684 });

    await page.goto("/pdf-to-jpg");
    await uploadFirstFile(page, fixtures.text100);
    await expect(page.getByText(/100 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Page range$/ }).click();
    await page.getByLabel("Page range").fill("95-100");
    const lateRangeZipBytes = await generateThenDownloadBytes(
      page,
      /^Convert to JPG$/,
      /^Download ZIP$/,
      "pdf-to-jpg.zip",
    );
    const lateRangeZip = await JSZip.loadAsync(lateRangeZipBytes);
    expect(getZipImageEntryNames(lateRangeZip, ".jpg")).toEqual([
      "page-95.jpg",
      "page-96.jpg",
      "page-97.jpg",
      "page-98.jpg",
      "page-99.jpg",
      "page-100.jpg",
    ]);

    await page.goto("/pdf-to-jpg");
    await uploadFirstFile(page, fixtures.text100);
    await expect(page.getByText(/100 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^High$/ }).click();
    await page.getByRole("button", { name: /^Convert to JPG$/ }).click();
    await expect(page.getByText(/High memory usage expected/i)).toBeVisible();
    await page.getByRole("button", { name: /^Continue$/ }).click();
    await expect(page.getByRole("button", { name: /^Cancel conversion$/ })).toBeVisible({
      timeout: 15000,
    });
    await page.getByRole("button", { name: /^Cancel conversion$/ }).click();
    await expect(page.getByRole("button", { name: /^Convert to JPG$/ })).toBeEnabled();
  });

  test("Image to PDF applies EXIF orientation consistently across JPG PNG and Images tools", async ({
    page,
  }) => {
    test.setTimeout(180000);
    const fixtures = await ensureFixtures();

    for (const [orientation, expected] of Object.entries(
      phase53ExpectedCorners,
    )) {
      const sourcePath = fixtures.phase53Exif[orientation];
      expect(
        parseExifOrientation(bufferToExactArrayBuffer(fs.readFileSync(sourcePath))),
      ).toBe(Number(orientation));

      await page.goto("/jpg-to-pdf");
      await uploadFirstFile(page, sourcePath);
      await expect(page.getByLabel("Output file name")).toHaveCount(0);
      await expect(
        page.getByText(
          new RegExp(`phase53-orientation-${orientation}\\.jpg`, "i"),
        ),
      ).toBeVisible();
      const pdfBytes = await generateThenDownloadBytes(
        page,
        /^Convert to PDF$/,
        /^Download PDF$/,
        "jpg-to-pdf.pdf",
      );
      const pdf = await PDFDocument.load(pdfBytes);
      expect(pdf.getPageCount()).toBe(1);
      expect(await roundPdfPageSize(pdfBytes)).toEqual(expected.dimensions);
      await expectPdfRenderedCorners(page, pdfBytes, expected.corners);
    }

    await page.goto("/jpg-to-pdf");
    await uploadFirstFile(page, fixtures.phase53CorruptExif);
    const corruptPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "jpg-to-pdf.pdf",
    );
    expect(await roundPdfPageSize(corruptPdf)).toEqual({
      height: 80,
      width: 120,
    });
    await expectPdfRenderedCorners(
      page,
      corruptPdf,
      phase53ExpectedCorners[1].corners,
    );

    await page.goto("/jpg-to-pdf");
    await uploadFirstFile(page, fixtures.phase53NoExif);
    const noExifPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "jpg-to-pdf.pdf",
    );
    expect(await roundPdfPageSize(noExifPdf)).toEqual({
      height: 80,
      width: 120,
    });
    await expectPdfRenderedCorners(
      page,
      noExifPdf,
      phase53ExpectedCorners[1].corners,
    );

    await page.goto("/images-to-pdf");
    await uploadFirstFile(page, [
      fixtures.phase53Exif["6"],
      fixtures.transparentPng,
      fixtures.phase53Exif["3"],
      fixtures.webp,
      fixtures.phase53Exif["8"],
    ]);
    await expect(page.getByText(/phase53-orientation-6\.jpg/i)).toBeVisible();
    await page
      .getByRole("button", { name: /Move phase53-orientation-8\.jpg up/i })
      .click();
    await page
      .getByRole("button", { name: /Remove phase53-orientation-3\.jpg/i })
      .click();
    await page
      .getByRole("button", { name: /Rotate phase53-orientation-8\.jpg right/i })
      .click();
    await page.getByLabel("Output file name").fill("phase53 mixed batch");
    const mixedPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "phase53 mixed batch.pdf",
    );
    expect((await PDFDocument.load(mixedPdf)).getPageCount()).toBe(4);

    await page.goto("/png-to-pdf");
    await uploadFirstFile(page, fixtures.transparentPng);
    await expect(page.getByLabel("Output file name")).toHaveCount(0);
    const transparentPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "png-to-pdf.pdf",
    );
    expect((await PDFDocument.load(transparentPdf)).getPageCount()).toBe(1);
  });

  test("Images to PDF supports a custom output filename without changing JPG or PNG tools", async ({
    page,
  }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/images-to-pdf");
    await uploadFirstFile(page, [fixtures.widePng, fixtures.squarePng]);
    await expect(page.getByText(/wide-2x1.png/i)).toBeVisible();
    await page.getByLabel("Output file name").fill("client scan packet");
    const customNamedPdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "client scan packet.pdf",
    );
    expect((await PDFDocument.load(customNamedPdf)).getPageCount()).toBe(2);

    await page.getByLabel("Output file name").fill("bad/name");
    await page.getByRole("button", { name: /^Convert to PDF$/ }).click();
    await expect(
      page.getByText(/File name cannot contain/i),
    ).toBeVisible();

    await page.goto("/jpg-to-pdf");
    await uploadFirstFile(page, fixtures.jpg);
    await expect(page.getByLabel("Output file name")).toHaveCount(0);
    const jpgDefaultNamePdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "jpg-to-pdf.pdf",
    );
    expect((await PDFDocument.load(jpgDefaultNamePdf)).getPageCount()).toBe(1);

    await page.goto("/png-to-pdf");
    await uploadFirstFile(page, fixtures.png);
    await expect(page.getByLabel("Output file name")).toHaveCount(0);
    const pngDefaultNamePdf = await generateThenDownloadBytes(
      page,
      /^Convert to PDF$/,
      /^Download PDF$/,
      "png-to-pdf.pdf",
    );
    expect((await PDFDocument.load(pngDefaultNamePdf)).getPageCount()).toBe(1);
  });

  test("edit tools generate valid PDFs", async ({ page }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByRole("button", { name: /^All pages$/ })).toBeVisible();
    await page.getByRole("button", { name: /^Rotate right 90 deg$/ }).click();
    const rotatedBytes = await generateThenDownloadBytes(
      page,
      /^Rotate PDF$/,
      /^Download rotated PDF$/,
      "rotated.pdf",
    );
    expect((await PDFDocument.load(rotatedBytes)).getPageCount()).toBe(10);

    await page.goto("/add-page-numbers");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Page 1 of 10$/ }).click();
    const numberedBytes = await generateThenDownloadBytes(
      page,
      /^Add page numbers$/,
      /^Download numbered PDF$/,
      "numbered.pdf",
    );
    expect((await PDFDocument.load(numberedBytes)).getPageCount()).toBe(10);

    await page.goto("/add-page-numbers");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Page 1$/ }).click();
    await page.getByLabel("Start number").fill("900");
    await page.getByRole("button", { name: /Skip first page/i }).click();
    const skipCoverBytes = await generateThenDownloadBytes(
      page,
      /^Add page numbers$/,
      /^Download numbered PDF$/,
      "numbered.pdf",
    );
    const skipCoverPdf = await PDFDocument.load(skipCoverBytes);
    expect(skipCoverPdf.getPageCount()).toBe(10);
    const firstPageText = await extractPdfPageText(skipCoverBytes, 1);
    const secondPageText = await extractPdfPageText(skipCoverBytes, 2);
    expect(firstPageText).toContain("LiftPDF QA page 1");
    expect(firstPageText).not.toContain("Page 900");
    expect(secondPageText).toContain("Page 900");

    await page.goto("/add-page-numbers");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^Page 1$/ }).click();
    await page.getByLabel("Start number").fill("700");
    await page.getByRole("button", { name: /Page range/i }).click();
    await page.getByLabel("Page range").fill("2-3");
    const rangeBytes = await generateThenDownloadBytes(
      page,
      /^Add page numbers$/,
      /^Download numbered PDF$/,
      "numbered.pdf",
    );
    expect((await PDFDocument.load(rangeBytes)).getPageCount()).toBe(10);
    expect(await extractPdfPageText(rangeBytes, 1)).not.toContain("Page 700");
    expect(await extractPdfPageText(rangeBytes, 2)).toContain("Page 700");
    expect(await extractPdfPageText(rangeBytes, 3)).toContain("Page 701");
    expect(await extractPdfPageText(rangeBytes, 4)).not.toContain("Page 702");

    await page.goto("/watermark-pdf");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await page.getByLabel(/Watermark text/i).fill("LiftPDF QA");
    await page.getByRole("button", { name: /^Bottom Right$/ }).click();
    await page.getByLabel(/Opacity:/i).fill("0.4");
    const watermarkedBytes = await generateThenDownloadBytes(
      page,
      /^Add watermark$/,
      /^Download watermarked PDF$/,
      "watermarked.pdf",
    );
    expect((await PDFDocument.load(watermarkedBytes)).getPageCount()).toBe(10);

    await page.goto("/watermark-pdf");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByText(/10 pages/i).first()).toBeVisible();
    await page.getByLabel(/Watermark text/i).fill("PHASE40-WATERMARK");
    await page.getByRole("button", { name: /Page range/i }).click();
    await page.getByLabel("Page range").fill("2-3");
    const rangeWatermarkedBytes = await generateThenDownloadBytes(
      page,
      /^Add watermark$/,
      /^Download watermarked PDF$/,
      "watermarked.pdf",
    );
    expect((await PDFDocument.load(rangeWatermarkedBytes)).getPageCount()).toBe(
      10,
    );
    expect(await extractPdfPageText(rangeWatermarkedBytes, 1)).not.toContain(
      "PHASE40-WATERMARK",
    );
    expect(await extractPdfPageText(rangeWatermarkedBytes, 2)).toContain(
      "PHASE40-WATERMARK",
    );
    expect(await extractPdfPageText(rangeWatermarkedBytes, 3)).toContain(
      "PHASE40-WATERMARK",
    );
    expect(await extractPdfPageText(rangeWatermarkedBytes, 4)).not.toContain(
      "PHASE40-WATERMARK",
    );
  });
});

test.describe("error states and mobile usability", () => {
  test("invalid file is rejected on representative tools", async ({ page }) => {
    const fixtures = await ensureFixtures();
    const routes = ["/merge-pdf", "/compress-pdf", "/pdf-to-text"];

    for (const route of routes) {
      await page.goto(route);
      await uploadFirstFile(page, fixtures.invalidPdf);

      if (route === "/merge-pdf") {
        await expect(page.getByText("Invalid PDF").first()).toBeVisible();
        await expect(
          page.getByRole("button", { name: /^Merge PDF$/ }),
        ).toBeDisabled();
        continue;
      }

      await expect(
        page.getByText(/could not be read|could not be merged|Only PDF files/i),
      ).toBeVisible();
    }
  });

  test("mobile viewport keeps tool upload accessible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/pdf-tools");
    await expect(
      page.getByRole("heading", { name: "All PDF Tools" }),
    ).toBeVisible();

    await page.goto("/merge-pdf");
    await expect(
      page.getByRole("heading", { name: "Merge PDF Online", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Choose PDF files/i })).toBeVisible();
  });
});

async function uploadFirstFile(page: Page, filePath: string | string[]) {
  await page.locator('input[type="file"]').first().setInputFiles(filePath);
}

function readyMergeFileCards(page: Page) {
  return page.locator("li").filter({ hasText: "Ready" });
}

const phase53ExpectedCorners: Record<
  string,
  {
    dimensions: { height: number; width: number };
    corners: PngCornerColors;
  }
> = {
  1: {
    dimensions: { height: 80, width: 120 },
    corners: { bottomLeft: "blue", bottomRight: "yellow", topLeft: "red", topRight: "green" },
  },
  2: {
    dimensions: { height: 80, width: 120 },
    corners: { bottomLeft: "yellow", bottomRight: "blue", topLeft: "green", topRight: "red" },
  },
  3: {
    dimensions: { height: 80, width: 120 },
    corners: { bottomLeft: "green", bottomRight: "red", topLeft: "yellow", topRight: "blue" },
  },
  4: {
    dimensions: { height: 80, width: 120 },
    corners: { bottomLeft: "red", bottomRight: "green", topLeft: "blue", topRight: "yellow" },
  },
  5: {
    dimensions: { height: 120, width: 80 },
    corners: { bottomLeft: "green", bottomRight: "yellow", topLeft: "red", topRight: "blue" },
  },
  6: {
    dimensions: { height: 120, width: 80 },
    corners: { bottomLeft: "yellow", bottomRight: "green", topLeft: "blue", topRight: "red" },
  },
  7: {
    dimensions: { height: 120, width: 80 },
    corners: { bottomLeft: "blue", bottomRight: "red", topLeft: "yellow", topRight: "green" },
  },
  8: {
    dimensions: { height: 120, width: 80 },
    corners: { bottomLeft: "red", bottomRight: "blue", topLeft: "green", topRight: "yellow" },
  },
};

type PngCornerColors = {
  bottomLeft: Phase53ColorName;
  bottomRight: Phase53ColorName;
  topLeft: Phase53ColorName;
  topRight: Phase53ColorName;
};

type Phase53ColorName = "blue" | "green" | "red" | "yellow";

const phase53Colors: Record<Phase53ColorName, [number, number, number]> = {
  blue: [20, 60, 240],
  green: [20, 200, 40],
  red: [240, 20, 20],
  yellow: [245, 220, 20],
};

async function downloadBytes(
  page: Page,
  buttonName: RegExp,
  expectedFileName?: string,
) {
  await page.getByRole("button", { name: buttonName }).click();

  if (expectedFileName) {
    return readGeneratedFileBytes(page, expectedFileName);
  }

  return readGeneratedFileBytes(page);
}

async function createEncryptedPdfWithBrowserQpdf(
  page: Page,
  sourcePath: string,
  options: {
    userPassword: string;
    ownerPassword: string;
    printing: PdfPrintingPermission;
    allowExtraction: boolean;
    modification: PdfModificationPermission;
  },
) {
  const sourceBytes = Array.from(fs.readFileSync(sourcePath));
  const outputBytes = await page.evaluate(
    async ({ bytes, qpdfOptions }) => {
      // @ts-expect-error QPDF is served as a browser-only static asset.
      const qpdfModule = (await import("/qpdf/qpdf.js")) as {
        default: (options: {
          locateFile: (fileName: string) => string;
          print: () => void;
          printErr: () => void;
        }) => Promise<{
          FS: {
            writeFile: (path: string, data: Uint8Array) => void;
            readFile: (path: string) => Uint8Array;
            unlink?: (path: string) => void;
          };
          callMain: (args: string[]) => number;
        }>;
      };
      const qpdf = await qpdfModule.default({
        locateFile: (fileName) => `/qpdf/${fileName}`,
        print: () => undefined,
        printErr: () => undefined,
      });
      const inputPath = `/phase48-input-${crypto.randomUUID()}.pdf`;
      const outputPath = `/phase48-output-${crypto.randomUUID()}.pdf`;

      try {
        qpdf.FS.writeFile(inputPath, new Uint8Array(bytes));
        const exitCode = qpdf.callMain([
          "--encrypt",
          qpdfOptions.userPassword,
          qpdfOptions.ownerPassword,
          "256",
          `--print=${qpdfOptions.printing}`,
          `--extract=${qpdfOptions.allowExtraction ? "y" : "n"}`,
          `--modify=${qpdfOptions.modification}`,
          "--",
          inputPath,
          outputPath,
        ]);

        if (exitCode !== 0) {
          throw new Error("QPDF fixture encryption failed.");
        }

        return Array.from(qpdf.FS.readFile(outputPath));
      } finally {
        try {
          qpdf.FS.unlink?.(inputPath);
        } catch {}
        try {
          qpdf.FS.unlink?.(outputPath);
        } catch {}
      }
    },
    { bytes: sourceBytes, qpdfOptions: options },
  );

  return Buffer.from(outputBytes);
}

async function unlockAndReadGeneratedPdf(page: Page) {
  await page.getByRole("button", { name: /^Unlock PDF$/ }).click();

  return readGeneratedFileBytes(page, "unlocked.pdf");
}

async function generateThenDownloadBytes(
  page: Page,
  actionButtonName: RegExp,
  downloadButtonName: RegExp,
  expectedFileName?: string,
) {
  await page.getByRole("button", { name: actionButtonName }).first().click();
  const downloadButton = page.getByRole("link", {
    name: downloadButtonName,
  });
  await expect(downloadButton).toBeVisible();

  if (expectedFileName) {
    return readGeneratedFileBytes(page, expectedFileName);
  }

  return readGeneratedFileBytes(page);
}

async function mergeAndCaptureAutomaticDownload(
  page: Page,
  expectedFileName: string,
) {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /^Merge PDF$/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(expectedFileName);
  await download.cancel().catch(() => undefined);

  return readGeneratedFileBytes(page, expectedFileName);
}

async function readGeneratedFileBytes(page: Page, expectedFileName?: string) {
  const downloadLink = expectedFileName
    ? page.locator(`a[download="${expectedFileName}"]`).last()
    : page.locator("a[download]").last();
  await expect(downloadLink).toBeVisible();

  const bytes = await downloadLink.evaluate(async (link) => {
    const href = (link as HTMLAnchorElement).href;
    const response = await fetch(href);
    const buffer = await response.arrayBuffer();

    return Array.from(new Uint8Array(buffer));
  });

  return Buffer.from(bytes);
}

async function getFirstPageOrientation(pdfBytes: Buffer) {
  const pdf = await PDFDocument.load(pdfBytes);
  return pageOrientation(pdf.getPage(0).getSize());
}

async function readPdfMetadata(pdfBytes: Buffer) {
  const pdf = await PDFDocument.load(pdfBytes, { updateMetadata: false });

  return {
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
    subject: pdf.getSubject(),
    keywords: pdf.getKeywords(),
    creator: pdf.getCreator(),
    producer: pdf.getProducer(),
  };
}

async function pdfHasLinkAnnotation(pdfBytes: Buffer, expectedUri: string) {
  const pdf = await PDFDocument.load(pdfBytes);
  const annotations = pdf.getPage(0).node.Annots();

  if (!annotations || !(annotations instanceof PDFArray)) {
    return false;
  }

  for (let index = 0; index < annotations.size(); index += 1) {
    const annotation = pdf.context.lookup(annotations.get(index), PDFDict);
    const subtype = annotation.get(PDFName.of("Subtype"));
    const action = annotation.get(PDFName.of("A"));

    if (subtype !== PDFName.of("Link") || !action) {
      continue;
    }

    const actionDict = pdf.context.lookup(action, PDFDict);
    const uri = actionDict.get(PDFName.of("URI"));

    if (uri instanceof PDFString && uri.decodeText() === expectedUri) {
      return true;
    }
  }

  return false;
}

function pdfHasAcroForm(pdf: PDFDocument) {
  const acroForm = pdf.catalog.get(PDFName.of("AcroForm"));

  return Boolean(acroForm);
}

function getPdfZipEntryNames(zip: JSZip) {
  return Object.keys(zip.files)
    .filter((name) => name.endsWith(".pdf"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function getZipImageEntryNames(zip: JSZip, extension: ".jpg" | ".png") {
  return Object.keys(zip.files)
    .filter((name) => name.endsWith(extension))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function getZipPdfBytes(zip: JSZip, entryName: string) {
  const entry = zip.file(entryName);

  if (!entry) {
    throw new Error(`Missing ZIP entry: ${entryName}`);
  }

  return entry.async("nodebuffer");
}

async function getZipImageBytes(zip: JSZip, entryName: string) {
  const entry = zip.file(entryName);

  if (!entry) {
    throw new Error(`Missing ZIP entry: ${entryName}`);
  }

  return entry.async("nodebuffer");
}

function getPngDimensions(bytes: Buffer) {
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

function bufferToExactArrayBuffer(bytes: Buffer) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);

  return copy.buffer;
}

function roundPdfPageSize(pdfBytes: Buffer) {
  return PDFDocument.load(pdfBytes).then((pdf) => {
    const size = pdf.getPage(0).getSize();
    return {
      height: Math.round(size.height),
      width: Math.round(size.width),
    };
  });
}

async function expectPdfRenderedCorners(
  page: Page,
  pdfBytes: Buffer,
  expectedCorners: PngCornerColors,
) {
  const pdfPath = path.join(fixturesDir, `phase53-render-${crypto.randomUUID()}.pdf`);
  fs.writeFileSync(pdfPath, pdfBytes);
  await page.goto("/pdf-to-png");
  await uploadFirstFile(page, pdfPath);
  const pngBytes = await generateThenDownloadBytes(
    page,
    /^Convert to PNG$/,
    /^Download PNG$/,
    "page-1.png",
  );
  const png = decodePngRgb(pngBytes);
  const samples = {
    bottomLeft: samplePngRgb(png, 0.12, 0.88),
    bottomRight: samplePngRgb(png, 0.88, 0.88),
    topLeft: samplePngRgb(png, 0.12, 0.12),
    topRight: samplePngRgb(png, 0.88, 0.12),
  };

  for (const corner of Object.keys(expectedCorners) as Array<
    keyof PngCornerColors
  >) {
    expectColorClose(
      samples[corner],
      phase53Colors[expectedCorners[corner]],
      `${corner} should be ${expectedCorners[corner]}`,
    );
  }
}

function decodePngRgb(bytes: Buffer) {
  const signature = bytes.subarray(0, 8).toString("hex");

  if (signature !== "89504e470d0a1a0a") {
    throw new Error("Expected PNG bytes.");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idatChunks: Buffer[] = [];

  while (offset + 8 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.subarray(offset + 4, offset + 8).toString("ascii");
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (dataEnd + 4 > bytes.length) {
      throw new Error("Invalid PNG chunk length.");
    }

    if (type === "IHDR") {
      width = bytes.readUInt32BE(dataStart);
      height = bytes.readUInt32BE(dataStart + 4);
      colorType = bytes[dataStart + 9];
    } else if (type === "IDAT") {
      idatChunks.push(bytes.subarray(dataStart, dataEnd));
    } else if (type === "IEND") {
      break;
    }

    offset = dataEnd + 4;
  }

  const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;

  if (!width || !height || !bytesPerPixel) {
    throw new Error(`Unsupported PNG color type ${colorType}.`);
  }

  const inflated = inflateSync(Buffer.concat(idatChunks));
  const stride = width * bytesPerPixel;
  const pixels = Buffer.alloc(width * height * 3);
  let inputOffset = 0;
  let previous = Buffer.alloc(stride);

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const row = Buffer.from(inflated.subarray(inputOffset, inputOffset + stride));
    inputOffset += stride;
    unfilterPngRow(row, previous, bytesPerPixel, filter);

    for (let x = 0; x < width; x += 1) {
      const source = x * bytesPerPixel;
      const target = (y * width + x) * 3;
      pixels[target] = row[source];
      pixels[target + 1] = row[source + 1];
      pixels[target + 2] = row[source + 2];
    }

    previous = row;
  }

  return { height, pixels, width };
}

function unfilterPngRow(
  row: Buffer,
  previous: Buffer,
  bytesPerPixel: number,
  filter: number,
) {
  for (let index = 0; index < row.length; index += 1) {
    const left = index >= bytesPerPixel ? row[index - bytesPerPixel] : 0;
    const up = previous[index] ?? 0;
    const upLeft = index >= bytesPerPixel ? previous[index - bytesPerPixel] : 0;

    if (filter === 1) {
      row[index] = (row[index] + left) & 0xff;
    } else if (filter === 2) {
      row[index] = (row[index] + up) & 0xff;
    } else if (filter === 3) {
      row[index] = (row[index] + Math.floor((left + up) / 2)) & 0xff;
    } else if (filter === 4) {
      row[index] = (row[index] + paethPredictor(left, up, upLeft)) & 0xff;
    } else if (filter !== 0) {
      throw new Error(`Unsupported PNG filter ${filter}.`);
    }
  }
}

function paethPredictor(left: number, up: number, upLeft: number) {
  const estimate = left + up - upLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upLeftDistance = Math.abs(estimate - upLeft);

  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) {
    return left;
  }

  return upDistance <= upLeftDistance ? up : upLeft;
}

function samplePngRgb(
  png: { height: number; pixels: Buffer; width: number },
  xRatio: number,
  yRatio: number,
) {
  const x = Math.max(0, Math.min(png.width - 1, Math.round(png.width * xRatio)));
  const y = Math.max(0, Math.min(png.height - 1, Math.round(png.height * yRatio)));
  const offset = (y * png.width + x) * 3;

  return [
    png.pixels[offset],
    png.pixels[offset + 1],
    png.pixels[offset + 2],
  ] as [number, number, number];
}

function expectColorClose(
  actual: [number, number, number],
  expected: [number, number, number],
  message: string,
) {
  const distance = Math.sqrt(
    (actual[0] - expected[0]) ** 2 +
      (actual[1] - expected[1]) ** 2 +
      (actual[2] - expected[2]) ** 2,
  );
  expect(distance, `${message}; actual rgb ${actual.join(",")}`).toBeLessThan(
    95,
  );
}

function getJpegDimensions(bytes: Buffer) {
  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);

    if (
      marker >= 0xc0 &&
      marker <= 0xc3
    ) {
      return {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + length;
  }

  throw new Error("Could not read JPEG dimensions.");
}

async function expectExtractedPageMarker(
  pdfBytes: Buffer,
  pageNumber: number,
  expectedMarker: string,
) {
  const pageText = await extractPdfPageText(pdfBytes, pageNumber);
  expect(pageText).toContain(expectedMarker);
}

async function expectPdfTextMarkers(
  pdfBytes: Buffer,
  expectedPages: number[],
  absentPages: number[],
) {
  const pdf = await PDFDocument.load(pdfBytes);
  let text = "";

  for (let pageNumber = 1; pageNumber <= pdf.getPageCount(); pageNumber += 1) {
    text += ` ${await extractPdfPageText(pdfBytes, pageNumber)}`;
  }

  for (const pageNumber of expectedPages) {
    expect(text).toMatch(createPhase44MarkerPattern(pageNumber));
  }

  for (const pageNumber of absentPages) {
    expect(text).not.toMatch(createPhase44MarkerPattern(pageNumber));
  }
}

function createPhase44MarkerPattern(pageNumber: number) {
  return new RegExp(`PHASE44-PAGE-${pageNumber}(?!\\d)`);
}

async function expectPageRotations(
  pdfBytes: Buffer,
  expectedRotations: Record<number, number>,
) {
  const pdf = await PDFDocument.load(pdfBytes);

  for (const [pageNumberText, expectedRotation] of Object.entries(
    expectedRotations,
  )) {
    const pageNumber = Number(pageNumberText);
    const page = pdf.getPage(pageNumber - 1);
    expect(normalizeTestRotation(page.getRotation().angle)).toBe(
      expectedRotation,
    );
  }
}

function normalizeTestRotation(rotation: number) {
  return ((rotation % 360) + 360) % 360;
}

function formatTestPrinting(value: PdfPrintingPermission) {
  if (value === "full") {
    return "Full quality";
  }

  if (value === "low") {
    return "Low resolution only";
  }

  return "Not allowed";
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pageOrientation({ height, width }: { height: number; width: number }) {
  return width >= height ? "landscape" : "portrait";
}

function extractPdfStreamText(pdfBytes: Buffer) {
  const source = pdfBytes.toString("latin1");
  const streams: string[] = [];
  const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;

  for (const match of source.matchAll(streamPattern)) {
    const streamBytes = Buffer.from(match[1], "latin1");

    try {
      streams.push(inflateSync(streamBytes).toString("latin1"));
    } catch {
      streams.push(streamBytes.toString("latin1"));
    }
  }

  return streams.join("\n");
}

async function extractPdfPageText(pdfBytes: Buffer, pageNumber: number) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBytes),
  });
  const pdf = await loadingTask.promise;

  try {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    return textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
  } finally {
    await pdf.destroy();
  }
}
