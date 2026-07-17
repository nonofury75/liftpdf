import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { ensureFixtures, fixturesDir } from "./fixtures";

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
    const mergedFilePath = await mergeDownload.path();

    if (!mergedFilePath) {
      throw new Error("Downloaded merged PDF path is not available.");
    }

    const mergedBytes = fs.readFileSync(mergedFilePath);
    await expect(page.getByRole("link", { name: /^Download PDF$/ })).toBeVisible();
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
    const splitFilePath = await splitDownload.path();

    if (!splitFilePath) {
      throw new Error("Downloaded split PDF path is not available.");
    }

    const splitBytes = fs.readFileSync(splitFilePath);
    await expect(page.getByRole("link", { name: /^Download PDF$/ })).toBeVisible();
    expect((await PDFDocument.load(splitBytes)).getPageCount()).toBe(3);
    await page.getByRole("textbox").fill("99");
    await page.getByRole("button", { name: /^Split PDF$/ }).click();
    await expect(page.getByText(/Page 99 does not exist/i)).toBeVisible();

    await page.getByRole("button", { name: /Split every page/i }).click();
    const splitZipDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /^Split PDF$/ }).click();
    const splitZipDownload = await splitZipDownloadPromise;
    expect(splitZipDownload.suggestedFilename()).toBe("split-pages.zip");
    const splitZipPath = await splitZipDownload.path();

    if (!splitZipPath) {
      throw new Error("Downloaded split ZIP path is not available.");
    }

    const splitZip = await JSZip.loadAsync(fs.readFileSync(splitZipPath));
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

  test("compress PDF exposes real QPDF modes with measurable outputs", async ({
    page,
  }) => {
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

  test("PDF to Text handles text, scanned, protected and invalid files", async ({
    page,
  }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.text100);
    const textBytes = await downloadBytes(
      page,
      /^Extract Text$/,
      "extracted-text.txt",
    );
    const text = Buffer.from(textBytes).toString("utf8");
    expect(text).toContain("Page 100");
    expect(text).toContain("selectable text for page 100");

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.imageOnly);
    await page.getByRole("button", { name: /^Extract Text$/ }).click();
    await expect(page.getByText(/No selectable text was found/i)).toBeVisible();

    await page.goto("/pdf-to-text");
    await uploadFirstFile(page, fixtures.invalidPdf);
    await expect(page.getByText(/could not be read/i)).toBeVisible();
  });

  test("image and PDF export tools generate downloads", async ({ page }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/jpg-to-pdf");
    await uploadFirstFile(page, fixtures.jpg);
    await expect(page.getByText(/sample.jpg/i)).toBeVisible();
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

  test("edit tools generate valid PDFs", async ({ page }) => {
    const fixtures = await ensureFixtures();

    await page.goto("/rotate-pdf");
    await uploadFirstFile(page, fixtures.text10);
    await expect(page.getByRole("button", { name: /Rotate all right/i })).toBeVisible();
    await page.getByRole("button", { name: /Rotate all right/i }).click();
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
        await page.getByRole("button", { name: /^Merge PDF$/ }).click();
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

async function downloadBytes(
  page: Page,
  buttonName: RegExp,
  expectedFileName?: string,
) {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: buttonName }).click();
  const download = await downloadPromise;
  const filePath = await download.path();

  if (expectedFileName) {
    expect(download.suggestedFilename()).toBe(expectedFileName);
  }

  if (!filePath) {
    throw new Error("Downloaded file path is not available.");
  }

  return fs.readFileSync(filePath);
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
  const downloadPromise = page.waitForEvent("download");
  await downloadButton.click();
  const download = await downloadPromise;
  const filePath = await download.path();

  if (expectedFileName) {
    expect(download.suggestedFilename()).toBe(expectedFileName);
  }

  if (!filePath) {
    throw new Error("Downloaded file path is not available.");
  }

  return fs.readFileSync(filePath);
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
