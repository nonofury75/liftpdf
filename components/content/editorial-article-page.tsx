import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  articleFiguresBySlug,
  articleMetaBySlug,
  decisionTablesBySlug,
  editorialAuthor,
  editorialParentLinks,
  extraArticleSectionsBySlug,
  type ArticleFigure,
} from "@/data/editorial-depth";
import type {
  GuideFaqItem,
  GuideLink,
  GuideSection,
} from "@/data/extract-pages-cluster";

export type EditorialGuide = {
  slug: string;
  h1: string;
  summary: string;
  description: string;
  canonical: string;
  ctaLabel: string;
  image: Omit<ArticleFigure, "caption"> & { caption?: string };
  quickAnswer?: string;
  quickSteps?: string[];
  sections: GuideSection[];
  faq: GuideFaqItem[];
  relatedLinks: GuideLink[];
};

type EditorialArticlePageProps = {
  guide: EditorialGuide;
  label: string;
  toolHref: string;
  toolTitle: string;
  toolDescription: string;
  secondaryHref: string;
  secondaryLabel: string;
  trustItems: string[];
  faqHeading: string;
};

export function EditorialArticlePage({
  guide,
  label,
  toolHref,
  toolTitle,
  toolDescription,
  secondaryHref,
  secondaryLabel,
  trustItems,
  faqHeading,
}: EditorialArticlePageProps) {
  const meta = articleMetaBySlug[guide.slug] || {
    category: label,
    readingMinutes: estimateReadingMinutes(guide),
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-16",
  };
  const extraSections = extraArticleSectionsBySlug[guide.slug] || [];
  const sections = [...guide.sections, ...extraSections];
  const figures = articleFiguresBySlug[guide.slug] || [guide.image];
  const decisionTable = decisionTablesBySlug[guide.slug];
  const tocItems = [
    ...(guide.quickSteps?.length ? [{ id: "quick-answer", label: "Quick answer" }] : []),
    ...sections.slice(0, 8).map((section) => ({
      id: slugify(section.heading),
      label: section.heading,
    })),
    ...(decisionTable ? [{ id: "decision-table", label: decisionTable.heading }] : []),
    { id: "faq", label: "FAQ" },
  ];
  const relatedLinks = [...guide.relatedLinks, ...editorialParentLinks].filter(
    (link, index, links) =>
      links.findIndex((item) => item.href === link.href) === index,
  );

  return (
    <article className="bg-background">
      <header className="border-b border-border bg-muted/35">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {meta.category}
              </span>
              {meta.cornerstone ? (
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Cornerstone guide
                </span>
              ) : null}
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                Verified against LiftPDF tools
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
              {guide.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {guide.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-primary" aria-hidden="true" />
                {meta.readingMinutes} min read
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                Updated {formatDate(meta.updatedAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <FileText className="size-4 text-primary" aria-hidden="true" />
                {editorialAuthor.name}
              </span>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={toolHref}>
                  {guide.ctaLabel}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {trustItems.map((item) => (
                <TrustPill key={item} text={item} />
              ))}
            </div>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm">
            <Image
              src={guide.image.src}
              alt={guide.image.alt}
              width={guide.image.width}
              height={guide.image.height}
              priority
              className="h-auto w-full rounded-2xl border border-border/70"
              sizes="(min-width: 1024px) 620px, 100vw"
            />
            <figcaption className="px-2 pt-3 text-sm leading-6 text-muted-foreground">
              {figures[0]?.caption || "A LiftPDF editorial visual for this PDF workflow."}
            </figcaption>
          </figure>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="space-y-12">
          <section
            id="quick-answer"
            aria-labelledby="quick-answer-heading"
            className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Quick answer
            </p>
            <h2
              id="quick-answer-heading"
              className="mt-2 text-2xl font-bold text-foreground"
            >
              What you need to know first
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              {guide.quickAnswer || guide.summary}
            </p>
            {guide.quickSteps?.length ? (
              <ol className="mt-6 grid gap-4">
                {guide.quickSteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-sm leading-6 text-muted-foreground">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
          </section>

          {figures.length > 1 ? (
            <section aria-labelledby="visual-examples">
              <p className="text-sm font-semibold uppercase tracking-normal text-primary">
                Visual examples
              </p>
              <h2 id="visual-examples" className="mt-2 text-2xl font-bold">
                See the workflow before you use it
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {figures.slice(0, 4).map((figure, index) => (
                  <ArticleFigureCard
                    key={`${figure.src}-${index}`}
                    figure={figure}
                    priority={false}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {sections.map((section) => (
            <section key={section.heading} id={slugify(section.heading)}>
              <h2 className="text-2xl font-bold text-foreground">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-muted-foreground">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.list?.length ? (
                <ul className="mt-5 grid gap-3">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <CheckCircle2
                        className="mt-0.5 size-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="leading-6 text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {decisionTable ? (
            <section
              id="decision-table"
              aria-labelledby="decision-table-heading"
              className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <p className="text-sm font-semibold uppercase tracking-normal text-primary">
                Decision table
              </p>
              <h2 id="decision-table-heading" className="mt-2 text-2xl font-bold">
                {decisionTable.heading}
              </h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="border-b border-border text-foreground">
                    <tr>
                      {decisionTable.columns.map((column) => (
                        <th key={column} scope="col" className="py-3 pr-4">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-muted-foreground">
                    {decisionTable.rows.map((row) => (
                      <tr key={row.join("-")}>
                        {row.map((cell) => (
                          <td key={cell} className="py-4 pr-4 leading-6">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <ToolInlineCta
            title={toolTitle}
            description={toolDescription}
            href={toolHref}
            label={guide.ctaLabel}
          />

          <section
            id="faq"
            aria-labelledby="faq-heading"
            className="rounded-3xl border border-border bg-muted/35 p-6 sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              FAQ
            </p>
            <h2 id="faq-heading" className="mt-2 text-2xl font-bold text-foreground">
              {faqHeading}
            </h2>
            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-background">
              {guide.faq.map((item) => (
                <details key={item.question} className="group p-5">
                  <summary className="cursor-pointer list-none font-semibold text-foreground">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Editorial note
            </p>
            <h2 className="mt-2 text-2xl font-bold">{editorialAuthor.name}</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              {editorialAuthor.note}
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Published {formatDate(meta.publishedAt)}. Last updated{" "}
              {formatDate(meta.updatedAt)}.
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <nav className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-bold text-foreground">
                In this guide
              </h2>
            </div>
            <div className="mt-4 grid gap-2">
              {tocItems.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">{toolTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {toolDescription}
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href={toolHref}>
                {guide.ctaLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <nav
            aria-label="Related resources"
            className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <h2 className="text-lg font-bold text-foreground">
              Related resources
            </h2>
            <div className="mt-4 grid gap-3">
              {relatedLinks.slice(0, 7).map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="font-semibold text-foreground">
                    {link.label}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {link.text}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>
      </div>
    </article>
  );
}

function ArticleFigureCard({
  figure,
  priority,
}: {
  figure: ArticleFigure;
  priority: boolean;
}) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm">
      <Image
        src={figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        priority={priority}
        className="aspect-[16/10] w-full rounded-2xl border border-border/70 object-cover"
        sizes="(min-width: 1024px) 430px, 100vw"
      />
      <figcaption className="px-2 pt-3 text-sm leading-6 text-muted-foreground">
        {figure.caption}
      </figcaption>
    </figure>
  );
}

function ToolInlineCta({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            {description}
          </p>
          <Button asChild className="mt-5">
            <Link href={href}>
              {label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TrustPill({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
      <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
      {text}
    </span>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

function estimateReadingMinutes(guide: EditorialGuide) {
  const words = [
    guide.summary,
    guide.quickAnswer || "",
    ...(guide.quickSteps || []),
    ...guide.sections.flatMap((section) => [
      ...section.body,
      ...(section.list || []),
    ]),
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(4, Math.ceil(words / 210));
}
