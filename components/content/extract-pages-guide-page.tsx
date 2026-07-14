import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  LockKeyhole,
  MonitorCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExtractPagesGuide } from "@/data/extract-pages-cluster";

type ExtractPagesGuidePageProps = {
  guide: ExtractPagesGuide;
};

export function ExtractPagesGuidePage({ guide }: ExtractPagesGuidePageProps) {
  return (
    <article className="bg-background">
      <header className="border-b border-border bg-muted/35">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Extract PDF Pages
              </span>
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                Works in your browser
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
              {guide.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {guide.summary}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/extract-pages">
                  {guide.ctaLabel}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/organize-pdf">Browse organize tools</Link>
              </Button>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <TrustPill icon={MonitorCheck} text="No upload required" />
              <TrustPill icon={LockKeyhole} text="Private by design" />
              <TrustPill icon={FileText} text="PDF quality preserved" />
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm">
            <Image
              src={guide.image.src}
              alt={guide.image.alt}
              width={guide.image.width}
              height={guide.image.height}
              priority
              className="h-auto w-full rounded-2xl border border-border/70"
              sizes="(min-width: 1024px) 620px, 100vw"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="space-y-12">
          {guide.quickSteps?.length ? (
            <section
              aria-labelledby="quick-steps"
              className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <p className="text-sm font-semibold uppercase tracking-normal text-primary">
                Quick answer
              </p>
              <h2
                id="quick-steps"
                className="mt-2 text-2xl font-bold text-foreground"
              >
                How to do it
              </h2>
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
            </section>
          ) : null}

          {guide.sections.map((section) => (
            <section key={section.heading} aria-labelledby={section.heading}>
              <h2
                id={section.heading}
                className="text-2xl font-bold text-foreground"
              >
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

          <section
            aria-labelledby="faq"
            className="rounded-3xl border border-border bg-muted/35 p-6 sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              FAQ
            </p>
            <h2 id="faq" className="mt-2 text-2xl font-bold text-foreground">
              Questions about this workflow
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
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Extract pages now
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use the visual page picker to save selected pages into a new PDF.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href="/extract-pages">
                Open Extract Pages
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <nav
            aria-label="Related PDF tools"
            className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <h2 className="text-lg font-bold text-foreground">
              Related tools
            </h2>
            <div className="mt-4 grid gap-3">
              {guide.relatedLinks.map((link) => (
                <Link
                  key={link.href}
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

function TrustPill({
  icon: Icon,
  text,
}: {
  icon: typeof MonitorCheck;
  text: string;
}) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
      <Icon className="size-4 text-primary" aria-hidden="true" />
      {text}
    </span>
  );
}
