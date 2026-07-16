# LiftPDF Content Clusters

Date: 2026-07-08  
Scope: SEO content expansion system for LiftPDF.  
Status: planning only. No pages should be created from this document without editorial production and QA.

## 1. Objective

LiftPDF should not publish hundreds of pages blindly. Each tool needs a structured content cluster that covers separate search intents without duplicating the tool page or cannibalizing nearby guides.

The first clusters are:

- JPG to PDF
- PNG to PDF
- Images to PDF
- PDF to JPG
- Merge PDF

The same system should later apply to every tool: PDF to PNG, Split PDF, Compress PDF, Rotate PDF, Protect PDF, Unlock PDF, PDF to Text, Delete Pages, Extract Pages, Reorder Pages, Watermark PDF and Add Page Numbers.

## 2. Data Confidence Notice

Volume and difficulty are strategic bands, not paid SEO-tool exports.

| Volume band | Estimated global monthly searches |
| --- | ---: |
| Very High | 250K+ |
| High | 75K-250K |
| Medium | 20K-75K |
| Low-Medium | 5K-20K |
| Low | 500-5K |

| Difficulty band | Meaning |
| --- | --- |
| Very High | Head term dominated by Adobe, Smallpdf, iLovePDF, PDF24 and other strong domains. |
| High | Competitive, but long-tail variants are possible. |
| Medium | Realistic with excellent content, internal links and some backlinks. |
| Low-Medium | Good early target for LiftPDF. |
| Low | Niche intent or weak SERP. |

SEO rules are aligned with Google Search Central guidance: create people-first content, use clear site structure, include useful images near relevant text, and add structured data only when it matches visible content.

## 3. Cluster Model

Each tool cluster should contain:

1. Tool page
2. How-to guides
3. Comparison pages
4. FAQ pages or FAQ sections
5. Problem/troubleshooting pages
6. Use-case pages
7. Tutorials by platform/device
8. Glossary/explainer pages

Every page needs:

- one primary search intent;
- one primary keyword;
- clear parent page;
- clear child pages if any;
- internal links to tools and sibling guides;
- CTA to an existing tool;
- honest limitations;
- useful images;
- schema plan.

## 4. Page Type Rules

| Page type | Purpose | Typical length | Schema | Main CTA |
| --- | --- | ---: | --- | --- |
| Tool page | Complete the task now | Existing landing page | WebApplication, FAQ, Breadcrumb | Use tool |
| Guide | Step-by-step task | 1,100-1,600 words | Article, HowTo, FAQ, Breadcrumb | Use tool |
| Problem | Diagnose/fix issue | 1,000-1,500 words | Article, FAQ, HowTo if procedural | Try correct settings |
| Comparison | Help choose format/tool | 1,300-1,900 words | Article, FAQ, Breadcrumb | Choose tool |
| Use case | Show workflow for audience/task | 1,000-1,500 words | Article, FAQ | Use relevant tool |
| Tutorial | Platform-specific steps | 1,000-1,400 words | Article, HowTo, FAQ | Use tool |
| Glossary | Define concept | 800-1,200 words | Article, FAQ | Related tool |

## 5. Anti-Cannibalization Rules

- The tool page targets the direct transactional head term.
- A guide targets a modifier or specific workflow.
- A problem page targets a failure/objection.
- A comparison page targets a decision.
- A use-case page targets a user group or scenario.
- Platform pages target device-specific searches only when the steps genuinely differ or the user intent is strong.
- If two proposed pages answer the same query in the same way, merge them.

## 6. Cluster 1: JPG to PDF

### Cluster Intent

JPG to PDF is a high-volume, high-competition cluster. LiftPDF should avoid only chasing "jpg to pdf" and instead build depth around privacy, quality, multiple images, settings and device workflows.

### Parent Page

| Field | Value |
| --- | --- |
| Page | `/jpg-to-pdf` |
| Role | Main transactional tool page |
| Primary keyword | jpg to pdf |
| Secondary keywords | jpeg to pdf, convert jpg to pdf, image to pdf |
| Main CTA | Convert JPG to PDF |
| Children | Guides, problems, comparisons, use cases, tutorials |

### Future Page Briefs

| Type | Title | Slug | Primary keyword | Secondary keywords | Intent | Volume | Difficulty | ROI | Length | Images | Schema | FAQ seeds | Internal links | Parent | Children | CTA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| Guide | How to Convert JPG to PDF Without Uploading Files | `/guides/jpg-to-pdf-without-upload` | jpg to pdf no upload | private jpg to pdf, browser jpg to pdf | Transactional privacy | Low-Medium | Low-Medium | Very High | 1,200-1,500 | hero, workflow, preview, og, thumbnail | Article, HowTo, FAQ, Breadcrumb | Are JPGs uploaded? Can I convert multiple? Does it work on mobile? | `/jpg-to-pdf`, `/images-to-pdf`, `/privacy` | `/jpg-to-pdf` | settings, quality | Convert JPG to PDF |
| Guide | How to Convert Multiple JPG Files into One PDF | `/guides/multiple-jpg-to-one-pdf` | multiple jpg to pdf | combine jpg into pdf, several jpg to one pdf | Transactional | Medium | Medium | Very High | 1,100-1,400 | hero, reorder, multi-page preview, og | Article, HowTo, FAQ | Can I reorder? Can I add more images? Is each image one page? | `/jpg-to-pdf`, `/images-to-pdf`, `/merge-pdf` | `/jpg-to-pdf` | image order guide | Convert multiple JPGs |
| Guide | JPG to PDF Settings: Page Size, Orientation and Margins | `/guides/jpg-to-pdf-settings` | jpg to pdf settings | A4 jpg to pdf, jpg to pdf margins | Informational support | Low-Medium | Low-Medium | High | 1,400-1,700 | settings comparison, fit-fill visual, og | Article, FAQ, Breadcrumb | A4 or Auto? Fit or Fill? Why white bands? | `/jpg-to-pdf`, `/images-to-pdf` | `/jpg-to-pdf` | no-margin, print settings | Try JPG settings |
| Problem | Why Is My JPG Blurry After PDF Conversion? | `/guides/jpg-blurry-after-pdf-conversion` | jpg blurry after pdf conversion | image quality pdf, blurry jpg to pdf | Troubleshooting | Low-Medium | Low-Medium | High | 1,100-1,500 | before-after blur, quality checklist | Article, FAQ | Does conversion reduce quality? Should I use PNG? What is source resolution? | `/jpg-to-pdf`, `/png-to-pdf`, `/images-to-pdf` | `/jpg-to-pdf` | quality guide | Convert with best settings |
| Problem | Why Is My JPG to PDF File Too Large? | `/guides/jpg-to-pdf-file-too-large` | jpg to pdf file too large | reduce jpg pdf size, large image pdf | Troubleshooting | Low-Medium | Medium | High | 1,100-1,500 | file-size diagram, compression note | Article, FAQ | Why is PDF large? Does JPG quality matter? Should I compress later? | `/jpg-to-pdf`, `/compress-pdf`, `/images-to-pdf` | `/jpg-to-pdf` | email size guide | Convert then compress |
| Tutorial | How to Convert JPG to PDF on Windows | `/guides/jpg-to-pdf-on-windows` | jpg to pdf on windows | convert jpg to pdf windows 11 | Platform tutorial | Medium | High | Medium | 1,000-1,300 | Windows workflow, browser visual | Article, HowTo, FAQ | Does it work in Chrome/Edge? Do I need software? | `/jpg-to-pdf`, `/privacy` | `/jpg-to-pdf` | Mac, iPhone, Android tutorials | Convert on Windows |
| Tutorial | How to Convert JPG to PDF on Mac | `/guides/jpg-to-pdf-on-mac` | jpg to pdf on mac | convert jpeg to pdf mac | Platform tutorial | Medium | High | Medium | 1,000-1,300 | Mac browser workflow | Article, HowTo, FAQ | Does it work in Safari? Do I need Preview? | `/jpg-to-pdf`, `/privacy` | `/jpg-to-pdf` | Windows, iPhone tutorials | Convert on Mac |
| Tutorial | How to Convert JPG to PDF on iPhone | `/guides/jpg-to-pdf-on-iphone` | jpg to pdf on iphone | photos to pdf iphone, jpeg to pdf iphone | Platform tutorial | Medium | High | High | 1,100-1,400 | mobile upload, iOS share/download | Article, HowTo, FAQ | Can I use Photos? Where is the file saved? | `/jpg-to-pdf`, `/images-to-pdf` | `/jpg-to-pdf` | mobile photo PDF | Convert on iPhone |
| Tutorial | How to Convert JPG to PDF on Android | `/guides/jpg-to-pdf-on-android` | jpg to pdf on android | photos to pdf android | Platform tutorial | Medium | High | High | 1,100-1,400 | Android browser workflow | Article, HowTo, FAQ | Does it work in Chrome? Where does download go? | `/jpg-to-pdf`, `/images-to-pdf` | `/jpg-to-pdf` | mobile photo PDF | Convert on Android |
| Use Case | How to Create a PDF from Photos | `/guides/create-pdf-from-photos` | create pdf from photos | photos to pdf, photo to pdf document | Use case | Medium | Medium | High | 1,200-1,500 | photo stack to PDF, use cases | Article, HowTo, FAQ | Can I combine photos? Best settings for photos? | `/jpg-to-pdf`, `/images-to-pdf` | `/jpg-to-pdf` | students, invoices | Create photo PDF |
| Comparison | JPEG vs JPG: Does It Matter for PDF Conversion? | `/guides/jpeg-vs-jpg-pdf` | jpeg vs jpg | jpg vs jpeg pdf, jpeg to pdf | Glossary/comparison | Medium | Medium | Medium | 900-1,200 | extension comparison visual | Article, FAQ | Are JPEG and JPG the same? Can both convert? | `/jpg-to-pdf`, `/images-to-pdf` | `/jpg-to-pdf` | JPG vs PNG | Convert JPEG/JPG |
| Comparison | JPG vs PDF: When Should You Use Each Format? | `/guides/jpg-vs-pdf` | jpg vs pdf | image vs pdf, photo or pdf | Comparison | Medium | Medium | Medium | 1,400-1,800 | format comparison table | Article, FAQ | Which is better for sharing? For printing? For scanning? | `/jpg-to-pdf`, `/pdf-to-jpg` | `/jpg-to-pdf` | JPG vs PNG | Choose format |
| Use Case | JPG to PDF for Students: Notes, Assignments and Scans | `/guides/jpg-to-pdf-for-students` | jpg to pdf for students | notes photos to pdf, assignment pdf | Use case | Low-Medium | Low-Medium | Medium | 1,000-1,300 | student notes to PDF | Article, FAQ | Can I combine notes? Best margin? Mobile? | `/jpg-to-pdf`, `/images-to-pdf` | `/jpg-to-pdf` | device tutorials | Create study PDF |
| FAQ Hub | JPG to PDF FAQ | `/guides/jpg-to-pdf-faq` | jpg to pdf questions | jpg to pdf help, jpeg to pdf faq | FAQ support | Low | Low | Medium | 1,200-1,600 | FAQ illustration | FAQPage, Article | quality, order, margin, privacy, mobile, size | `/jpg-to-pdf`, sibling guides | `/jpg-to-pdf` | all JPG support pages | Open JPG tool |

## 7. Cluster 2: PNG to PDF

### Cluster Intent

PNG to PDF should own transparency, screenshots, logos, graphics and crisp visual quality. It must not duplicate JPG to PDF. The angle is: use PNG when visual sharpness or transparency matters.

### Parent Page

| Field | Value |
| --- | --- |
| Page | `/png-to-pdf` |
| Role | Main transactional tool page |
| Primary keyword | png to pdf |
| Secondary keywords | convert png to pdf, transparent png to pdf |
| Main CTA | Convert PNG to PDF |
| Children | Transparency, screenshots, graphics, comparison, device guides |

### Future Page Briefs

| Type | Title | Slug | Primary keyword | Secondary keywords | Intent | Volume | Difficulty | ROI | Length | Images | Schema | FAQ seeds | Internal links | Parent | Children | CTA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| Guide | How to Convert PNG to PDF Without Uploading Files | `/guides/png-to-pdf-without-upload` | png to pdf no upload | private png to pdf, browser png to pdf | Transactional privacy | Low-Medium | Low-Medium | High | 1,200-1,500 | hero, workflow, privacy visual | Article, HowTo, FAQ | Are PNGs uploaded? Multiple PNGs? Transparency? | `/png-to-pdf`, `/privacy`, `/images-to-pdf` | `/png-to-pdf` | transparency guide | Convert PNG to PDF |
| Guide | How to Convert PNG to PDF with Transparent Images | `/guides/png-transparency-to-pdf` | png to pdf transparent | transparent png pdf, png transparency pdf | Informational/transactional | Low-Medium | Medium | High | 1,200-1,500 | transparent logo on PDF, white background example | Article, HowTo, FAQ | Is transparency preserved? Why white background? | `/png-to-pdf`, `/images-to-pdf` | `/png-to-pdf` | PNG logo guide | Convert transparent PNG |
| Guide | How to Convert Multiple PNG Files into One PDF | `/guides/multiple-png-to-one-pdf` | multiple png to pdf | combine png into pdf, png pages to pdf | Transactional | Low-Medium | Medium | High | 1,100-1,400 | PNG stack to PDF | Article, HowTo, FAQ | Can I reorder? Can I mix with JPG? | `/png-to-pdf`, `/images-to-pdf` | `/png-to-pdf` | mixed images | Convert multiple PNGs |
| Use Case | How to Save Screenshots as One PDF | `/guides/screenshots-to-pdf` | screenshots to pdf | png screenshots to pdf, screenshot pdf | Use case | Medium | Medium | High | 1,100-1,500 | screenshots grouped into PDF | Article, HowTo, FAQ | Best format? Can I reorder screenshots? | `/png-to-pdf`, `/images-to-pdf` | `/png-to-pdf` | mobile screenshots | Create screenshot PDF |
| Use Case | How to Convert Logos and Graphics to PDF | `/guides/logos-graphics-to-pdf` | logo to pdf | png logo to pdf, graphics to pdf | Use case | Low-Medium | Low-Medium | Medium | 1,000-1,300 | logo on PDF sheet | Article, FAQ | Best settings for logos? Transparent background? | `/png-to-pdf`, `/watermark-pdf` | `/png-to-pdf` | transparency | Convert logo to PDF |
| Problem | Why Does My PNG Have a White Background in PDF? | `/guides/png-white-background-pdf` | png white background pdf | transparent png turns white pdf | Troubleshooting | Low-Medium | Low-Medium | High | 1,100-1,500 | transparent vs white page visual | Article, FAQ | Is white background normal? Can PDF be transparent? | `/png-to-pdf`, `/images-to-pdf` | `/png-to-pdf` | transparency guide | Convert PNG carefully |
| Problem | Why Is My PNG PDF So Large? | `/guides/png-pdf-file-too-large` | png pdf too large | reduce png pdf size, png to pdf large file | Troubleshooting | Low | Medium | Medium | 1,100-1,400 | file size comparison PNG/JPG | Article, FAQ | Why is PNG bigger than JPG? Compress after? | `/png-to-pdf`, `/compress-pdf`, `/jpg-to-pdf` | `/png-to-pdf` | JPG vs PNG | Convert or compress |
| Comparison | PNG vs JPG for PDF: Which Should You Choose? | `/guides/png-vs-jpg-pdf` | png vs jpg pdf | jpg vs png for pdf, image quality pdf | Comparison | Medium | Medium | High | 1,500-1,900 | side-by-side format comparison | Article, FAQ | Which is sharper? Which is smaller? | `/png-to-pdf`, `/jpg-to-pdf`, `/images-to-pdf` | `/png-to-pdf` | JPG cluster | Choose image format |
| Comparison | PNG vs PDF: What Is the Difference? | `/guides/png-vs-pdf` | png vs pdf | image file vs pdf, png or pdf | Glossary/comparison | Medium | Medium | Medium | 1,300-1,700 | single image vs document visual | Article, FAQ | Which is better for sharing? Printing? Documents? | `/png-to-pdf`, `/pdf-to-png` | `/png-to-pdf` | PDF to PNG | Choose format |
| Tutorial | How to Convert PNG to PDF on iPhone | `/guides/png-to-pdf-on-iphone` | png to pdf on iphone | screenshot to pdf iphone | Platform tutorial | Low-Medium | Medium | Medium | 1,000-1,300 | iPhone screenshot workflow | Article, HowTo, FAQ | Where are screenshots stored? Can I select multiple? | `/png-to-pdf`, `/images-to-pdf` | `/png-to-pdf` | screenshots | Convert PNG on iPhone |
| Tutorial | How to Convert PNG to PDF on Windows or Mac | `/guides/png-to-pdf-windows-mac` | png to pdf windows mac | convert png to pdf computer | Platform tutorial | Low-Medium | Medium | Medium | 1,000-1,300 | desktop browser workflow | Article, HowTo, FAQ | Chrome, Edge, Safari support? | `/png-to-pdf`, `/privacy` | `/png-to-pdf` | device pages | Convert PNG on desktop |
| FAQ Hub | PNG to PDF FAQ | `/guides/png-to-pdf-faq` | png to pdf questions | png conversion faq | FAQ support | Low | Low | Medium | 1,200-1,600 | PNG FAQ visual | FAQPage, Article | transparency, size, quality, upload, mobile | `/png-to-pdf`, sibling guides | `/png-to-pdf` | all PNG support | Open PNG tool |

## 8. Cluster 3: Images to PDF

### Cluster Intent

Images to PDF is the broad hub for mixed images, photos, receipts, scans and multi-format conversion. It should not cannibalize JPG or PNG pages; it should own mixed-format and "image to PDF" intent.

### Parent Page

| Field | Value |
| --- | --- |
| Page | `/images-to-pdf` |
| Role | Main mixed-format tool page |
| Primary keyword | images to pdf |
| Secondary keywords | image to pdf, photos to pdf, convert images to pdf |
| Main CTA | Convert Images to PDF |
| Children | Mixed formats, photos, receipts, scans, use cases |

### Future Page Briefs

| Type | Title | Slug | Primary keyword | Secondary keywords | Intent | Volume | Difficulty | ROI | Length | Images | Schema | FAQ seeds | Internal links | Parent | Children | CTA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| Guide | How to Convert Images to PDF on Any Device | `/guides/images-to-pdf-any-device` | images to pdf | image to pdf online, convert images to pdf | Transactional broad | High | High | Very High | 1,300-1,600 | mixed formats, device workflow | Article, HowTo, FAQ | Can I mix formats? Mobile? Reorder? | `/images-to-pdf`, `/jpg-to-pdf`, `/png-to-pdf` | `/images-to-pdf` | device pages | Convert Images to PDF |
| Guide | How to Convert Images to PDF Without Uploading | `/guides/images-to-pdf-without-upload` | images to pdf no upload | image to pdf browser, private image to pdf | Transactional privacy | Low-Medium | Low-Medium | Very High | 1,300-1,600 | no-upload workflow | Article, HowTo, FAQ | Are files uploaded? Supported formats? | `/images-to-pdf`, `/privacy` | `/images-to-pdf` | privacy cluster | Convert privately |
| Guide | How to Combine JPG, PNG and WEBP into One PDF | `/guides/combine-jpg-png-webp-to-pdf` | combine jpg png webp to pdf | mixed images to pdf, jpg png to pdf | Transactional mixed format | Low-Medium | Low-Medium | High | 1,100-1,400 | mixed file cards | Article, HowTo, FAQ | Can I mix JPG and PNG? WEBP supported? | `/images-to-pdf`, `/jpg-to-pdf`, `/png-to-pdf` | `/images-to-pdf` | format comparisons | Combine image formats |
| Use Case | How to Convert Receipts to One PDF | `/guides/receipts-to-pdf` | receipts to pdf | scan receipts to pdf, expense receipts pdf | Use case | Low-Medium | Low-Medium | High | 1,100-1,500 | receipts into PDF | Article, HowTo, FAQ | Best margins? Expense reports? Mobile photos? | `/images-to-pdf`, `/jpg-to-pdf` | `/images-to-pdf` | business use case | Create receipt PDF |
| Use Case | How to Convert Notes Photos to PDF | `/guides/notes-photos-to-pdf` | notes photos to pdf | student notes pdf, handwritten notes to pdf | Use case | Low-Medium | Low-Medium | Medium | 1,100-1,500 | notebook photos to PDF | Article, HowTo, FAQ | Best orientation? One page per photo? | `/images-to-pdf`, `/jpg-to-pdf` | `/images-to-pdf` | students | Convert notes |
| Use Case | How to Create a PDF Portfolio from Images | `/guides/image-portfolio-to-pdf` | image portfolio to pdf | photo portfolio pdf, design portfolio pdf | Use case | Low | Low-Medium | Medium | 1,200-1,600 | portfolio layout | Article, FAQ | Best format? Image order? File size? | `/images-to-pdf`, `/compress-pdf` | `/images-to-pdf` | photography | Create portfolio PDF |
| Problem | Why Are My Images Rotated in the PDF? | `/guides/images-rotated-in-pdf` | images rotated in pdf | jpg rotated in pdf, photo orientation pdf | Troubleshooting | Low-Medium | Low-Medium | High | 1,100-1,400 | rotated image before-after | Article, FAQ | Why rotation happens? Fix before/after? | `/images-to-pdf`, `/rotate-pdf` | `/images-to-pdf` | orientation settings | Fix image orientation |
| Problem | Why Is My Image PDF Empty or Blank? | `/guides/image-pdf-empty-blank` | image pdf blank | pdf empty after image conversion | Troubleshooting | Low | Low | Medium | 900-1,200 | blank PDF diagnosis | Article, FAQ | Unsupported file? Corrupt image? Huge image? | `/images-to-pdf`, `/jpg-to-pdf`, `/png-to-pdf` | `/images-to-pdf` | troubleshooting hub | Try again |
| Problem | How to Keep Original Image Quality in a PDF | `/guides/keep-image-quality-in-pdf` | keep image quality in pdf | image to pdf without losing quality | Troubleshooting/quality | Low-Medium | Medium | High | 1,300-1,700 | quality checklist | Article, FAQ | Does PDF reduce quality? Source resolution? Fit vs Fill? | `/images-to-pdf`, `/jpg-to-pdf`, `/png-to-pdf` | `/images-to-pdf` | JPG blur guide | Convert high quality |
| Comparison | Images to PDF vs JPG to PDF: Which Tool Should You Use? | `/guides/images-to-pdf-vs-jpg-to-pdf` | images to pdf vs jpg to pdf | mixed images or jpg only | Comparison | Low | Low | Medium | 1,000-1,300 | decision table | Article, FAQ | Which supports PNG? Which supports WEBP? | `/images-to-pdf`, `/jpg-to-pdf` | `/images-to-pdf` | PNG comparison | Choose tool |
| Tutorial | How to Convert Photos to PDF on Mobile | `/guides/photos-to-pdf-mobile` | photos to pdf mobile | photos to pdf iphone android | Platform/use case | Medium | Medium | High | 1,100-1,500 | mobile photo workflow | Article, HowTo, FAQ | iPhone? Android? Download location? | `/images-to-pdf`, `/jpg-to-pdf` | `/images-to-pdf` | device guides | Convert photos |
| Glossary | What Is an Image PDF? | `/guides/what-is-an-image-pdf` | image pdf | image based pdf, photo pdf | Glossary | Low-Medium | Medium | Medium | 900-1,200 | text PDF vs image PDF | Article, FAQ | Is image PDF searchable? Need OCR? | `/images-to-pdf`, `/pdf-to-text` | `/images-to-pdf` | OCR explainer | Learn then convert |
| FAQ Hub | Images to PDF FAQ | `/guides/images-to-pdf-faq` | images to pdf questions | image to pdf faq | FAQ support | Low | Low | Medium | 1,200-1,700 | FAQ visual | FAQPage, Article | formats, order, quality, size, upload, mobile | `/images-to-pdf`, sibling guides | `/images-to-pdf` | all image PDF support | Open Images to PDF |

## 9. Cluster 4: PDF to JPG

### Cluster Intent

PDF to JPG has major traffic potential but heavy competition. LiftPDF should build around page ranges, quality choice, ZIP output, privacy and format decisions.

### Parent Page

| Field | Value |
| --- | --- |
| Page | `/pdf-to-jpg` |
| Role | Main PDF-to-image transactional page |
| Primary keyword | pdf to jpg |
| Secondary keywords | pdf to jpeg, convert pdf to jpg, pdf page to image |
| Main CTA | Convert PDF to JPG |
| Children | Page range, quality, ZIP, comparison, troubleshooting |

### Future Page Briefs

| Type | Title | Slug | Primary keyword | Secondary keywords | Intent | Volume | Difficulty | ROI | Length | Images | Schema | FAQ seeds | Internal links | Parent | Children | CTA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| Guide | How to Convert PDF to JPG Without Uploading | `/guides/pdf-to-jpg-without-upload` | pdf to jpg no upload | convert pdf to jpg in browser, private pdf to jpg | Transactional privacy | Low-Medium | Medium | Very High | 1,300-1,600 | PDF pages to JPG, privacy visual | Article, HowTo, FAQ | Are PDFs uploaded? Multi-page ZIP? Quality? | `/pdf-to-jpg`, `/privacy`, `/pdf-to-png` | `/pdf-to-jpg` | page range guide | Convert PDF to JPG |
| Guide | How to Convert Only One PDF Page to JPG | `/guides/one-pdf-page-to-jpg` | convert one pdf page to jpg | pdf page to jpg, single page pdf to jpg | Transactional | Low-Medium | Medium | High | 1,000-1,300 | single page selection | Article, HowTo, FAQ | Can I choose one page? Output name? | `/pdf-to-jpg`, `/extract-pages` | `/pdf-to-jpg` | page range | Convert one page |
| Guide | How to Convert a PDF Page Range to JPG | `/guides/pdf-to-jpg-page-range` | pdf to jpg page range | convert selected pdf pages to jpg | Transactional | Low-Medium | Medium | High | 1,100-1,500 | range input, selected pages | Article, HowTo, FAQ | How to write ranges? Invalid pages? ZIP? | `/pdf-to-jpg`, `/pdf-to-png`, `/extract-pages` | `/pdf-to-jpg` | range to images | Convert page range |
| Guide | How to Convert Multi-Page PDF to JPG Images | `/guides/multipage-pdf-to-jpg` | multipage pdf to jpg | pdf pages to jpg, pdf to jpg zip | Transactional | Medium | High | High | 1,200-1,500 | multi-page PDF to ZIP | Article, HowTo, FAQ | Why ZIP? Each page one JPG? | `/pdf-to-jpg`, `/pdf-to-png` | `/pdf-to-jpg` | ZIP guide | Convert all pages |
| Problem | Why Did PDF to JPG Download a ZIP File? | `/guides/pdf-to-jpg-downloads-zip` | pdf to jpg zip | why pdf to jpg downloads zip | Troubleshooting | Low-Medium | Low-Medium | High | 900-1,200 | ZIP output explanation | Article, FAQ | Why ZIP? How to open? One page direct? | `/pdf-to-jpg`, `/pdf-to-png` | `/pdf-to-jpg` | multi-page guide | Convert selected pages |
| Problem | Why Is My PDF to JPG Image Blurry? | `/guides/pdf-to-jpg-blurry` | pdf to jpg blurry | improve pdf to jpg quality | Troubleshooting | Low-Medium | Medium | High | 1,100-1,500 | normal vs high quality | Article, FAQ | Quality setting? Source PDF? Zoom? | `/pdf-to-jpg`, `/pdf-to-png` | `/pdf-to-jpg` | quality comparison | Use high quality |
| Problem | Why Is My PDF Password Protected? | `/guides/pdf-to-jpg-password-protected` | pdf to jpg password protected | protected pdf to jpg, unlock first | Troubleshooting/security | Low | Low-Medium | Medium | 900-1,200 | locked PDF visual | Article, FAQ | Need password? Can LiftPDF bypass? | `/pdf-to-jpg`, `/unlock-pdf`, `/protect-pdf` | `/pdf-to-jpg` | Unlock cluster | Unlock first |
| Comparison | PDF to JPG vs PDF to PNG: Which Output Is Better? | `/guides/pdf-to-jpg-vs-png` | pdf to jpg vs png | jpg or png from pdf, pdf image format | Comparison | Medium | Medium | High | 1,500-1,900 | format comparison | Article, FAQ | Which is smaller? Which is sharper? | `/pdf-to-jpg`, `/pdf-to-png` | `/pdf-to-jpg` | PNG cluster | Choose output format |
| Comparison | JPG vs JPEG: Which Extension Does PDF to JPG Use? | `/guides/jpg-vs-jpeg-output` | jpg vs jpeg | pdf to jpeg, jpg jpeg difference | Glossary/comparison | Medium | Medium | Medium | 900-1,200 | extension visual | Article, FAQ | Are JPG and JPEG same? Which downloads? | `/pdf-to-jpg`, `/jpg-to-pdf` | `/pdf-to-jpg` | JPG glossary | Convert to JPG |
| Use Case | How to Extract PDF Pages as Images for Presentations | `/guides/pdf-pages-images-presentations` | pdf pages as images for presentation | convert pdf slides to jpg | Use case | Low-Medium | Medium | Medium | 1,100-1,500 | PDF slide to image | Article, HowTo, FAQ | Quality for slides? Page range? | `/pdf-to-jpg`, `/pdf-to-png` | `/pdf-to-jpg` | business use cases | Export pages |
| Use Case | How to Turn PDF Pages into Images for Email or Chat | `/guides/pdf-pages-images-email-chat` | pdf pages to images | send pdf page as image | Use case | Low | Low-Medium | Medium | 1,000-1,300 | PDF page shared as image | Article, FAQ | JPG or PNG? File size? | `/pdf-to-jpg`, `/compress-pdf` | `/pdf-to-jpg` | communication use | Convert and share |
| FAQ Hub | PDF to JPG FAQ | `/guides/pdf-to-jpg-faq` | pdf to jpg questions | pdf to jpg help | FAQ support | Low | Low | Medium | 1,200-1,700 | FAQ visual | FAQPage, Article | quality, range, ZIP, password, upload | `/pdf-to-jpg`, sibling guides | `/pdf-to-jpg` | all PDF to JPG support | Open PDF to JPG |

## 10. Cluster 5: Merge PDF

### Cluster Intent

Merge PDF is a very competitive transactional cluster. LiftPDF's best entry is no-upload/private merge, order control, sensitive documents and practical workflows.

### Parent Page

| Field | Value |
| --- | --- |
| Page | `/merge-pdf` |
| Role | Main transactional merge tool page |
| Primary keyword | merge pdf |
| Secondary keywords | combine pdf, join pdf, merge pdf files |
| Main CTA | Merge PDF |
| Children | no-upload, order, business use cases, troubleshooting, comparisons |

### Future Page Briefs

| Type | Title | Slug | Primary keyword | Secondary keywords | Intent | Volume | Difficulty | ROI | Length | Images | Schema | FAQ seeds | Internal links | Parent | Children | CTA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| Guide | How to Merge PDF Files Without Uploading Them | `/guides/merge-pdf-without-upload` | merge pdf without upload | combine pdf locally, private pdf merger | Transactional privacy | Low-Medium | Low-Medium | Very High | 1,300-1,600 | PDFs merge in browser, privacy visual | Article, HowTo, FAQ | Are PDFs uploaded? Can I reorder? | `/merge-pdf`, `/privacy`, `/organize-pdf` | `/merge-pdf` | order guide | Merge PDFs privately |
| Guide | How to Combine PDF Files in the Right Order | `/guides/combine-pdfs-in-order` | combine pdf files in order | merge pdf order, arrange pdf files | Transactional support | Low-Medium | Low-Medium | High | 1,000-1,300 | numbered PDFs order | Article, HowTo, FAQ | Does file order matter? Move files? | `/merge-pdf`, `/reorder-pages` | `/merge-pdf` | merge vs reorder | Combine in order |
| Guide | How to Merge Scanned PDFs into One File | `/guides/merge-scanned-pdfs` | merge scanned pdf | combine scanned documents pdf | Transactional/use case | Low-Medium | Medium | High | 1,100-1,500 | scanned PDFs into packet | Article, HowTo, FAQ | Does OCR matter? Quality? File size? | `/merge-pdf`, `/compress-pdf` | `/merge-pdf` | scans use case | Merge scanned PDFs |
| Use Case | How to Combine Invoices into One PDF | `/guides/combine-invoices-one-pdf` | combine invoices into one pdf | merge invoice PDFs, expense PDF | Use case | Low-Medium | Low-Medium | High | 1,000-1,400 | invoices packet | Article, HowTo, FAQ | Can I reorder by date? Privacy? | `/merge-pdf`, `/images-to-pdf` | `/merge-pdf` | receipts guide | Merge invoices |
| Use Case | How to Merge Application Documents into One PDF | `/guides/merge-application-documents-pdf` | merge application documents pdf | combine documents into one pdf | Use case | Low-Medium | Medium | High | 1,100-1,500 | application packet | Article, FAQ | Best order? Sensitive files? | `/merge-pdf`, `/protect-pdf`, `/compress-pdf` | `/merge-pdf` | business/legal | Merge documents |
| Problem | Why Are My PDFs in the Wrong Order After Merging? | `/guides/pdf-wrong-order-after-merging` | pdf wrong order after merging | merge pdf order issue | Troubleshooting | Low | Low | Medium | 900-1,200 | before-after order fix | Article, FAQ | File order? Page order? Reorder tool? | `/merge-pdf`, `/reorder-pages` | `/merge-pdf` | combine order | Fix order |
| Problem | Why Is My Merged PDF Too Large? | `/guides/merged-pdf-too-large` | merged pdf too large | reduce merged pdf size | Troubleshooting | Low-Medium | Medium | High | 1,100-1,500 | merged size growth | Article, FAQ | Why file grew? Compress after? | `/merge-pdf`, `/compress-pdf` | `/merge-pdf` | file size guide | Merge then compress |
| Problem | Why Won't My PDFs Merge? | `/guides/pdfs-wont-merge` | pdfs won't merge | pdf merge error, invalid pdf | Troubleshooting | Low | Low-Medium | Medium | 1,000-1,300 | error checklist | Article, FAQ | Protected PDF? Corrupt PDF? Large file? | `/merge-pdf`, `/unlock-pdf`, `/compress-pdf` | `/merge-pdf` | protected PDFs | Troubleshoot merge |
| Comparison | Merge PDF vs Reorder Pages: Which Tool Do You Need? | `/guides/merge-vs-reorder-pdf` | merge vs reorder pdf | organize pdf pages | Comparison | Low | Low | Medium | 1,200-1,500 | tool decision tree | Article, FAQ | Multiple files vs one file? Use both? | `/merge-pdf`, `/reorder-pages` | `/merge-pdf` | organize comparisons | Choose tool |
| Comparison | Merge PDF vs Split PDF: When to Use Each | `/guides/merge-pdf-vs-split-pdf` | merge pdf vs split pdf | combine or separate pdf | Comparison | Low-Medium | Medium | Medium | 1,200-1,500 | combine vs separate visual | Article, FAQ | Opposite tasks? Workflow examples? | `/merge-pdf`, `/split-pdf` | `/merge-pdf` | split cluster | Merge or split |
| Use Case | Merge PDFs for Business Teams | `/guides/merge-pdfs-for-business` | merge pdfs for business | combine business documents pdf | Use case | Low | Medium | Medium | 1,200-1,600 | business document packet | Article, FAQ | Contracts? Invoices? Privacy? | `/merge-pdf`, `/protect-pdf`, `/security` | `/merge-pdf` | application docs | Merge business PDFs |
| FAQ Hub | Merge PDF FAQ | `/guides/merge-pdf-faq` | merge pdf questions | combine pdf faq | FAQ support | Low | Low | Medium | 1,200-1,700 | FAQ visual | FAQPage, Article | order, upload, quality, size, protected PDFs | `/merge-pdf`, sibling guides | `/merge-pdf` | all merge support | Open Merge PDF |

## 11. System for All Other Tools

Use the same cluster model for every available tool.

| Tool | Core cluster angles |
| --- | --- |
| PDF to PNG | transparency, sharpness, screenshots, PNG vs JPG, page ranges |
| Split PDF | page ranges, split every page, ZIP output, extract vs split |
| Compress PDF | safe compression, why compression may be limited, email size, browser compression honesty |
| Rotate PDF | rotate one page, rotate all pages, scanned pages, wrong orientation |
| Add Page Numbers | formats, placement, legal/business documents, page number styles |
| Watermark PDF | text watermark, image watermark, opacity, position, repeat/tile |
| Protect PDF | local encryption, password strength, testing protected files, security limitations |
| Unlock PDF | remove password with permission, wrong password, non-protected PDFs, ethics/legal boundaries |
| PDF to Text | selectable text, OCR limitations, scanned PDFs, copy/download TXT |
| Delete Pages | remove unwanted pages, select/invert, keep at least one page |
| Extract Pages | selected pages, one page extraction, extract vs split |
| Reorder Pages | drag-and-drop, mobile reordering, merge/reorder workflows |

## 12. Cluster QA Checklist

Before creating any page from a cluster:

- Confirm the page answers a distinct query.
- Confirm it does not duplicate an existing guide.
- Confirm it links to an existing working tool.
- Confirm the tool can perform the task honestly.
- Confirm schema matches visible content.
- Confirm images are useful and named descriptively.
- Confirm FAQ questions are real and not keyword filler.
- Confirm internal links support the parent cluster.
- Confirm the CTA is specific and not generic.

## 13. Publishing Guardrail

Do not publish more than 5-8 new guide pages per month until Search Console data proves which clusters are gaining traction. Fast uncontrolled publishing increases the risk of thin pages, duplicate answers and crawl waste.
