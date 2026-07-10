import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileImage,
  FileText,
  LockKeyhole,
  MonitorCheck,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-primary)_13%,transparent),transparent_54%)]" />
      <div className="relative mx-auto grid min-h-[680px] w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            Premium PDF tools, processed in your browser
          </div>

          <h1 className="text-5xl font-bold tracking-normal text-foreground sm:text-6xl">
            Every PDF Tool You Need
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Convert, merge, split, compress, protect and edit PDFs online with
            fast private tools that feel simple from the first click.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "Free", icon: CheckCircle2 },
              { label: "Secure", icon: ShieldCheck },
              { label: "Works in your browser", icon: MonitorCheck },
            ].map((badge) => {
              const Icon = badge.icon;

              return (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold text-muted-foreground shadow-sm"
                >
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  {badge.label}
                </span>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <Link href="/jpg-to-pdf">
                Start with JPG to PDF
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
              <Link href="/pdf-tools">Browse all tools</Link>
            </Button>
          </div>
        </div>

        <ProductDemo />
      </div>
    </section>
  );
}

function ProductDemo() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="rounded-2xl border border-border bg-muted/50 p-4 shadow-[0_28px_90px_rgba(15,23,42,0.13)] sm:p-5">
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  LiftPDF workspace
                </p>
                <p className="text-xs text-muted-foreground">
                  Upload, preview, download
                </p>
              </div>
            </div>
            <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary sm:inline-flex">
              Browser only
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-3">
              <FlowStep
                icon={Upload}
                title="Upload"
                text="Drop files here"
              />
              <FlowStep
                icon={Zap}
                title="Process locally"
                text="No server upload"
              />
              <FlowStep
                icon={Download}
                title="Download"
                text="Clean output file"
              />
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-slate-50 to-slate-200/70 p-5 shadow-inner">
              <div className="absolute left-5 top-5 z-10 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                Live preview
              </div>
              <div className="absolute right-5 top-5 z-10 flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <LockKeyhole className="size-3.5" aria-hidden="true" />
                Private
              </div>

              <div className="absolute left-8 top-20 h-56 w-40 -rotate-3 rounded-lg border border-border bg-background p-3 shadow-lg">
                <FileImage className="mb-4 size-5 text-primary" aria-hidden="true" />
                <div className="space-y-2">
                  <div className="h-3 rounded-full bg-muted" />
                  <div className="h-3 w-3/4 rounded-full bg-muted" />
                  <div className="mt-5 h-24 rounded-md bg-primary/10" />
                </div>
              </div>

              <div className="absolute right-8 top-16 h-64 w-44 rotate-2 overflow-hidden rounded-lg border border-primary/20 bg-background p-4 shadow-2xl">
                <div className="liftpdf-scan-line absolute inset-x-4 top-8 h-10 rounded-full bg-primary/10 blur-sm" />
                <div className="relative space-y-3">
                  <div className="h-3 w-24 rounded-full bg-foreground/15" />
                  <div className="h-3 rounded-full bg-muted" />
                  <div className="h-3 w-4/5 rounded-full bg-muted" />
                  <div className="mt-5 h-28 rounded-md bg-slate-100" />
                  <div className="h-2 rounded-full bg-muted">
                    <div className="liftpdf-progress-bar h-2 rounded-full bg-primary" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2">
                {["Merge", "Compress", "Protect"].map((label) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border bg-background/95 px-2 py-3 text-center text-xs font-semibold text-foreground shadow-sm"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FlowStepProps = {
  icon: typeof Upload;
  title: string;
  text: string;
};

function FlowStep({ icon: Icon, title, text }: FlowStepProps) {
  return (
    <div className="liftpdf-flow-card rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}
