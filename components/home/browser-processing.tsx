import Link from "next/link";
import {
  ArrowRight,
  Download,
  FileCheck2,
  Laptop,
  LockKeyhole,
  ServerOff,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function BrowserProcessing() {
  return (
    <section className="border-y border-border bg-background py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            How LiftPDF Works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
            Upload, process locally, download
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            The current LiftPDF tools are designed around browser processing.
            Your files are handled on your device, so everyday PDF work feels
            fast and private.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/privacy">
                Privacy details
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/why-liftpdf">Why LiftPDF</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/45 p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <InfographicStep
              icon={Upload}
              title="Upload"
              text="Choose files from your device."
            />
            <InfographicStep
              icon={Laptop}
              title="Process locally"
              text="PDF work runs in your browser."
              active
            />
            <InfographicStep
              icon={Download}
              title="Download"
              text="Save the finished file."
            />
          </div>

          <div className="mt-5 grid gap-4 rounded-xl border border-border bg-background p-4 shadow-inner md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <FileCheck2 className="size-5 text-primary" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">
                  Your document
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-2 rounded-full bg-muted" />
                <div className="h-2 w-3/4 rounded-full bg-muted" />
                <div className="h-2 w-1/2 rounded-full bg-muted" />
              </div>
            </div>

            <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
              <ServerOff className="size-6" aria-hidden="true" />
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <LockKeyhole className="size-5 text-emerald-700" aria-hidden="true" />
                <span className="text-sm font-semibold text-emerald-900">
                  No upload required
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-emerald-800">
                Files stay in the browser for supported tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type InfographicStepProps = {
  icon: typeof Upload;
  title: string;
  text: string;
  active?: boolean;
};

function InfographicStep({
  icon: Icon,
  title,
  text,
  active = false,
}: InfographicStepProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span className={active ? "grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground" : "grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-base font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
