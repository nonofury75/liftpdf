import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, FileQuestion, GitCompare, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const learningLinks = [
  {
    title: "What is a PDF?",
    label: "PDF basics",
    href: "/guides/what-is-a-pdf",
    icon: BookOpen,
  },
  {
    title: "How to merge PDF files",
    label: "Tutorial",
    href: "/guides/how-to-merge-pdf",
    icon: Wrench,
  },
  {
    title: "JPG vs PNG",
    label: "Comparison",
    href: "/guides/jpg-vs-png",
    icon: GitCompare,
  },
  {
    title: "Why is my JPG blurry after PDF conversion?",
    label: "Problem",
    href: "/guides/why-is-my-jpg-blurry-after-pdf",
    icon: FileQuestion,
  },
];

export function LearnAboutPdfs() {
  const [featured, ...secondary] = learningLinks;

  return (
    <section className="bg-muted/35 py-16" aria-labelledby="learn-about-pdfs">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Learn about PDFs
            </p>
            <h2 id="learn-about-pdfs" className="mt-2 text-3xl font-bold">
              Guides when the right workflow is not obvious
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              LiftPDF is not only a toolbox. It also explains formats,
              privacy, troubleshooting and the document choices behind each
              workflow.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/learn">
              Open Learning Center
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Link
            href={featured.href}
            className="group overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
          >
            <Image
              src="/images/editorial/pdf-document-structure-diagram.svg"
              alt="PDF document structure diagram showing pages text images metadata and links"
              width={1200}
              height={720}
              className="aspect-[16/8] w-full object-cover"
              sizes="(min-width: 1024px) 700px, 100vw"
            />
            <div className="p-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <featured.icon className="size-3.5" aria-hidden="true" />
                {featured.label}
              </span>
              <h3 className="mt-4 text-2xl font-bold leading-8 text-foreground">
                {featured.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Start with the format itself: what a PDF contains, why it behaves
                differently from an image, and when a PDF tool is the right
                workflow.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Read resource
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </div>
          </Link>

          <div className="grid gap-4">
            {secondary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-3xl border border-border bg-background p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <item.icon className="size-3.5" aria-hidden="true" />
                {item.label}
              </span>
              <h3 className="mt-4 text-lg font-bold leading-7 text-foreground">
                {item.title}
              </h3>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Read resource
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
