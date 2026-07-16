# LiftPDF Editorial System

Date: 2026-07-08  
Scope: editorial operating system for future LiftPDF guides.  
Objective: publish guides that can compete with Adobe, Smallpdf, iLovePDF, PDF24 and ILoveIMG without creating generic SEO filler.

## 1. Editorial Positioning

LiftPDF guides must not behave like a normal PDF blog. The product advantage is specific:

> Private PDF tools that run directly in the browser.

Every guide should therefore connect practical user intent with one or more of these advantages:

- files stay on the user's device;
- no account required for current tools;
- no upload for supported client-side workflows;
- fast task completion;
- clear limitations where browser-side tools have limits;
- direct path from learning to action.

The editorial goal is not to publish the longest article. The goal is to publish the most useful page for a searcher who wants to solve a PDF task now.

## 2. What Makes a LiftPDF Guide Different

Competitors often win because they have authority, not because their guides are always the most precise. LiftPDF must win by being more useful, more honest and easier to act on.

Every guide must include:

- a direct answer in the first screen;
- a working LiftPDF tool CTA near the top;
- steps that match the actual interface;
- screenshots or illustrations that explain the workflow;
- privacy explanation when relevant;
- clear limitations;
- practical examples;
- related tools;
- FAQ;
- schema markup plan;
- internal links to the exact tool/category/trust pages.

Every guide must avoid:

- promising OCR when the tool only extracts selectable text;
- promising advanced compression when the current compressor safely rebuilds PDFs;
- implying password bypass for Unlock PDF;
- recommending unsupported formats;
- keyword stuffing;
- fake screenshots;
- generic paragraphs that could appear on any PDF site.

## 3. Official Guide Template

### URL

Use short, lowercase, descriptive slugs:

```txt
/guides/jpg-to-pdf-without-upload
/guides/merge-pdf-without-upload
/guides/pdf-to-jpg-page-range
```

Rules:

- one primary intent per URL;
- no dates in evergreen guide slugs;
- no unnecessary words like "best-online-free-easy";
- use the user vocabulary, not internal product vocabulary.

### Metadata

Each guide needs:

- title: 50-60 characters where possible;
- description: 140-160 characters;
- canonical URL;
- OpenGraph title/description/image;
- Twitter card;
- breadcrumb;
- article metadata if implemented later;
- FAQ schema if the FAQ is visible on the page;
- HowTo schema only for true step-by-step instructional guides.

Example:

```txt
Title: How to Convert JPG to PDF Without Uploading Files
Description: Convert JPG images to PDF privately in your browser. Learn page size, margins, order and quality settings without uploading files.
Canonical: /guides/jpg-to-pdf-without-upload
```

### Above-the-Fold Structure

The first screen must answer three questions:

1. What problem does this guide solve?
2. Can I do it now?
3. Why should I trust LiftPDF?

Recommended structure:

```txt
H1
Short answer paragraph, 40-70 words
Primary CTA to tool
Secondary CTA to related category
Trust badges: Free, Secure, Works in your browser
Hero illustration
```

### Required Page Sections

Use this order unless the search intent clearly requires a different flow:

1. Hero and short answer
2. Quick steps
3. Tool CTA block
4. Detailed guide
5. Settings and best practices
6. Examples/use cases
7. Privacy and file safety
8. Comparison table
9. Related tools
10. FAQ
11. Conclusion with CTA

## 4. Heading System

### H1

One H1 only.

Format examples:

- How to Convert JPG to PDF Without Uploading Files
- How to Merge PDF Files Without Uploading Them
- PDF to JPG vs PDF to PNG: Which Should You Use?

### H2

Recommended H2 set:

- Quick Answer
- How to [Task]
- Best Settings for [Task]
- When to Use This Method
- Privacy: Are Your Files Uploaded?
- LiftPDF vs Traditional Online Converters
- Related Tools
- FAQ

### H3

Use H3 for substeps, options and examples:

- Step 1: Upload your files
- Step 2: Choose page settings
- A4 vs Letter
- Fit vs Fill
- What happens with transparent PNGs?

## 5. Ideal Length

Length must follow intent.

| Guide type | Ideal length | Notes |
| --- | ---: | --- |
| Transactional how-to | 1,000-1,400 words | Fast answer, steps, options, FAQ. |
| Comparison | 1,400-1,900 words | Must include decision table and examples. |
| Privacy/security guide | 1,600-2,200 words | Needs trust, technical explanation and limitations. |
| Troubleshooting guide | 1,200-1,800 words | Needs symptoms, causes, fixes and links. |
| Pillar guide | 2,000-3,000 words | Use sparingly; must be genuinely useful. |

Never pad a guide to hit a number. A 1,100-word guide that solves the task clearly is better than a 2,500-word page that wastes time.

## 6. Illustration System

Every guide should have useful visuals. Visuals must explain the workflow, not decorate the page.

### Required Assets Per Guide

| Asset | Purpose | Format | Target size |
| --- | --- | --- | --- |
| Hero illustration | First impression and Google Images | WebP | < 80 KB |
| Workflow image | Explains steps | WebP | < 90 KB |
| Tool preview image | Shows expected output/options | WebP | < 100 KB |
| OG image | Social/search preview | WebP or PNG | 1200x630 |
| Thumbnail | Cards/internal links | WebP | < 30 KB |

### Naming Convention

```txt
public/images/guides/{slug}/hero.webp
public/images/guides/{slug}/workflow.webp
public/images/guides/{slug}/preview.webp
public/images/guides/{slug}/og-image.webp
public/images/guides/{slug}/thumbnail.webp
```

### Alt Text Rules

Alt text must describe what the image teaches.

Good:

```txt
JPG images arranged into a PDF page with margin and orientation settings.
```

Bad:

```txt
Best free JPG to PDF online converter image.
```

Decorative icons should be marked decorative if implemented in code.

## 7. FAQ System

Each guide should include 6-10 questions. FAQ should answer real objections and long-tail searches.

Required FAQ types:

- cost: "Is it free?"
- privacy: "Are my files uploaded?"
- capability: "Can I convert multiple files?"
- limitation: "Does this work with scanned PDFs?"
- output: "Will quality change?"
- device: "Does it work on Mac, Windows or mobile?"
- troubleshooting: "Why did my PDF not compress much?"

FAQ rules:

- answers should be 40-90 words;
- no duplicate boilerplate across guides;
- do not add FAQ schema unless the same FAQ is visible on the page;
- do not use FAQ to stuff keywords.

## 8. HowTo Schema Rules

Use HowTo schema only when the page contains an actual ordered process.

Good candidates:

- How to Convert JPG to PDF Without Uploading Files
- How to Merge PDF Files Without Uploading Them
- How to Extract Pages from a PDF

Bad candidates:

- JPG vs PNG for PDF
- Is It Safe to Use Online PDF Tools?
- PDF to JPG vs PDF to PNG

HowTo schema should include:

- name;
- description;
- totalTime if defensible;
- step names;
- step text;
- image per step if available.

Do not include HowTo schema for actions LiftPDF cannot perform.

## 9. Comparison Table System

Every guide should include one useful comparison table if it helps decision-making.

Recommended patterns:

### LiftPDF vs Traditional Online Converters

| Factor | LiftPDF | Traditional online converters |
| --- | --- | --- |
| File upload | Runs in browser for supported tools | Usually uploads to server |
| Account | No account for current tools | Often optional or required |
| Speed | Fast for common files | Depends on upload speed |
| Privacy | Files stay on device for supported workflows | Files leave device |

### Setting Comparison

| Setting | Best for | Tradeoff |
| --- | --- | --- |
| Fit | Keep full image visible | May create ratio bands |
| Fill | Full page output | Crops edges if ratios differ |

Rules:

- comparison must help users choose;
- do not attack competitors by name unless the article is specifically a comparison page;
- avoid claims LiftPDF cannot prove.

## 10. CTA System

Every guide needs three CTA levels.

### Primary CTA

Near top and near conclusion.

Examples:

- Convert JPG to PDF
- Merge PDF Files
- Extract PDF Text

### Secondary CTA

Inside the guide, after the relevant explanation.

Examples:

- Browse all PDF tools
- See image PDF tools
- Learn how browser processing works

### Recovery CTA

When a limitation appears.

Examples:

- If your PDF is password protected, unlock it first.
- If your file is image-only, OCR is required; PDF to Text extracts selectable text only.

## 11. Internal Linking Rules

Each guide should link to:

- 1 primary tool page;
- 2-4 related tools;
- 1 category page;
- 1 trust page when privacy/security is relevant;
- 1-3 related guides once guide pages exist.

Use descriptive anchors:

Good:

- convert JPG images to PDF
- merge PDF files in your browser
- learn how browser processing works

Bad:

- click here
- this tool
- read more

## 12. Editorial Quality Checklist

Before publishing, every guide must pass this checklist:

- The guide answers the main query in the first 100 words.
- The CTA points to an existing, working LiftPDF tool.
- Claims match actual product behavior.
- Limitations are stated clearly.
- There is no invented feature.
- The page includes practical examples.
- At least one visual explains the workflow.
- Images have useful alt text.
- FAQ covers privacy, quality and device compatibility when relevant.
- Internal links are natural and useful.
- The article can stand alone as a useful resource.
- The article does not cannibalize another planned guide.

## 13. Search Intent Map

| Intent | User wants | Best page type | CTA |
| --- | --- | --- | --- |
| Transactional | Complete task now | How-to guide plus tool | Tool page |
| Privacy | Avoid uploads | Trust-focused how-to | Tool + Privacy |
| Troubleshooting | Understand failure | Diagnostic guide | Correct tool |
| Comparison | Choose output/setting | Decision guide | Best matching tools |
| Educational | Learn concept | Explainer | Category hub |

## 14. Content Governance

### Publish Order

Prioritize content that supports available tools. Do not publish full guides for unavailable tools unless the guide clearly explains alternatives using existing tools.

### Review Cadence

- First review: 30 days after publishing.
- Search Console review: every 30 days after indexing.
- Refresh: every 90 days for high-value guides.
- Immediate refresh when product behavior changes.

### Update Triggers

Update a guide when:

- screenshots no longer match;
- tool options change;
- Search Console shows high impressions and low CTR;
- the page ranks 8-20 and needs improvement;
- competitor SERP structure changes;
- Google starts showing new People Also Ask questions.

## 15. Editorial Scoring

Score each draft before publishing.

| Criterion | Weight | Passing standard |
| --- | ---: | --- |
| Search intent match | 20 | Solves exact query quickly. |
| Product accuracy | 20 | No unsupported claims. |
| Practical value | 20 | Steps/examples/settings are useful. |
| Trust/privacy clarity | 15 | Explains browser-side behavior when relevant. |
| Internal linking | 10 | Links users to useful next actions. |
| Visual usefulness | 10 | Images teach, not decorate. |
| Readability | 5 | Simple, skimmable and direct. |

Minimum publish score: 85/100.

## 16. Writing Rules

Use:

- short paragraphs;
- direct instructions;
- specific examples;
- plain English;
- honest limitations;
- action-first introductions.

Avoid:

- "In today's digital age";
- exaggerated superlatives;
- unverified "unlimited" claims unless true;
- generic "fast and easy" repetition;
- competitor-bashing;
- vague privacy language.

## 17. Recommended Guide Layout

```txt
H1: How to [Task] [Qualifier]

Intro:
Direct answer and promise.

CTA:
[Use tool]

H2: Quick Steps
1. ...
2. ...
3. ...

H2: How to [Task] with LiftPDF
H3: Step 1
H3: Step 2
H3: Step 3

H2: Best Settings for [Task]
Table or cards.

H2: When to Use This Method
Use cases.

H2: Privacy and File Safety
Browser-side explanation.

H2: LiftPDF vs Traditional Online Converters
Comparison.

H2: Related Tools
Tool cards.

H2: FAQ
6-10 questions.

H2: Conclusion
Short recap + CTA.
```

## 18. Image Brief Template

For each guide, create an image brief before writing.

```txt
Guide slug:
Asset:
Purpose:
Scene:
Key visual elements:
Text inside image:
Alt text:
Dimensions:
Format:
Max file size:
```

Rules:

- avoid tiny UI text inside images;
- keep brand colors consistent;
- use realistic documents/images;
- use one clear idea per image;
- make image useful at thumbnail size.

## 19. Schema Package Per Guide Type

| Guide type | Required schema | Optional schema |
| --- | --- | --- |
| Transactional how-to | Breadcrumb, Article, FAQ, HowTo | SoftwareApplication reference |
| Comparison | Breadcrumb, Article, FAQ | ItemList |
| Privacy/security | Breadcrumb, Article, FAQ | WebPage |
| Troubleshooting | Breadcrumb, Article, FAQ, HowTo if procedural | None |

Schema must mirror visible content. Do not add hidden FAQ or hidden HowTo content.

## 20. Editorial Production Workflow

1. Select guide from roadmap.
2. Confirm target tool exists and works.
3. Search Console/SERP check.
4. Draft outline.
5. Prepare image brief.
6. Write guide.
7. Add internal links.
8. Add FAQ and schema.
9. Compress images.
10. QA on desktop/mobile.
11. Publish.
12. Submit URL in Search Console.
13. Review after indexing.

## 21. What Not To Publish Yet

Avoid these until product support exists or the guide is clearly educational:

- "How to Convert PDF to Word" as a tool guide;
- "How to OCR a scanned PDF";
- "How to sign a PDF legally";
- "How to edit PDF text directly";
- "How to compress PDF without quality loss" if the engine cannot guarantee it.

LiftPDF should build trust by saying exactly what it does and what it does not do.

## 22. Editorial North Star

A LiftPDF guide wins when the user thinks:

> I understand the task, I trust the privacy model, and I can solve it now.

That standard matters more than word count, keyword density or publishing volume.
