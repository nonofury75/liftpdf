import Link from "next/link";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid min-h-[600px] w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            Professional PDF tools in your browser
          </div>
          <h1 className="text-5xl font-bold tracking-normal text-foreground sm:text-6xl">
            Every PDF Tool You Need
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Convert, merge, split, compress, rotate and edit PDFs online for
            free.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/jpg-to-pdf">
                Start with JPG to PDF
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pdf-tools">Browse all tools</Link>
            </Button>
          </div>
        </div>

        <div className="relative hidden min-h-[430px] overflow-hidden rounded-xl border border-border bg-muted/70 p-6 shadow-sm lg:block">
          <div className="absolute left-8 top-8 flex h-12 items-center gap-3 rounded-lg border border-border bg-background px-4 shadow-sm">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <FileText className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">LiftPDF workspace</span>
          </div>
          <div className="absolute left-8 top-28 h-64 w-48 rounded-lg border border-border bg-background shadow-sm" />
          <div className="absolute left-20 top-40 h-3 w-28 rounded-full bg-foreground/15" />
          <div className="absolute left-20 top-56 h-3 w-20 rounded-full bg-primary" />
          <div className="absolute right-10 top-24 h-72 w-56 rotate-3 rounded-lg border border-primary/25 bg-background shadow-md" />
          <div className="absolute right-20 top-44 h-3 w-28 rounded-full bg-foreground/15" />
          <div className="absolute right-20 top-60 h-3 w-20 rounded-full bg-primary" />
          <div className="absolute bottom-8 left-14 right-14 grid grid-cols-3 gap-3">
            {["Convert", "Merge", "Edit"].map((label) => (
              <div
                key={label}
                className="rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-semibold shadow-sm"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
