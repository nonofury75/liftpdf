# LiftPDF

> Fast, private PDF tools that run directly in the browser.

[Open the live product](https://liftpdf-rosy.vercel.app/) · [Browse all tools](https://liftpdf-rosy.vercel.app/pdf-tools) · [Learning Center](https://liftpdf-rosy.vercel.app/learn)

LiftPDF is a production web application for converting, organizing, editing, and protecting PDF files. Supported workflows process documents locally in the browser, avoiding unnecessary file uploads while keeping the experience fast and accessible without an account.

## Product snapshot

- 17 available PDF tools
- Browser-side document processing
- No account or desktop installation required
- Shared upload, preview, options, processing, and download workflow
- Responsive interface
- Consent-aware analytics
- Product documentation and SEO learning center
- End-to-end testing with Playwright

## Available tools

### Convert

- JPG to PDF
- PNG to PDF
- Images to PDF
- PDF to JPG
- PDF to PNG
- PDF to Text

### Organize

- Merge PDF
- Split PDF
- Delete Pages
- Extract Pages
- Reorder Pages
- Rotate PDF

### Edit and secure

- Compress PDF
- Add Page Numbers
- Watermark PDF
- Protect PDF
- Unlock PDF

## Architecture

| Layer | Implementation |
| --- | --- |
| Application | Next.js 15, React 19, TypeScript |
| PDF manipulation | pdf-lib, PDF.js, qpdf-wasm |
| Packaging | JSZip |
| Interface | Tailwind CSS, Radix Slot, Lucide |
| Quality | ESLint, TypeScript, Prettier, Playwright |
| Deployment | Vercel |

## Privacy model

LiftPDF is designed around local processing for supported tools:

1. The user selects a file on their device.
2. The browser performs the PDF operation.
3. The resulting file is downloaded locally.

Analytics are activated only after consent and are not designed to receive file names, document contents, or passwords.

## Engineering quality

- Shared product patterns across all tools
- Functional-depth and production-validation reports
- Type checking and linting
- Automated end-to-end browser tests
- Responsive product and accessibility review
- Security copy aligned with actual browser behaviour
- Structured editorial, technical SEO, and conversion documentation

## Local development

~~~bash
npm install
npm run dev
~~~

Open http://127.0.0.1:3000.

## Quality checks

~~~bash
npm run lint
npm run typecheck
npm run format:check
npm run test:e2e
npm run build
~~~

## Commercial relevance

LiftPDF demonstrates end-to-end product delivery: product strategy, interaction design, browser-side processing, testing, privacy, deployment, analytics consent, technical SEO, and ongoing feature expansion.
