import Link from "next/link";
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {learningLinks.map((item) => (
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
    </section>
  );
}
