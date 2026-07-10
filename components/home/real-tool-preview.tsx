import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Combine,
  FileText,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function RealToolPreview() {
  return (
    <section className="bg-muted/35 py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Real Tool Preview
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
            Merge PDF feels like a focused workspace
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            LiftPDF tools are built around the same pattern: clear upload,
            preview, options, action and download. The result feels predictable
            from tool to tool.
          </p>
          <Button asChild className="mt-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <Link href="/merge-pdf">
              Try Merge PDF
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 shadow-lg sm:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <PreviewPanel title="Before" files={["invoice.pdf", "contract.pdf"]} />

            <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
              <ArrowRight className="size-5" aria-hidden="true" />
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Combine className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">After</p>
                  <p className="text-xs text-muted-foreground">
                    merged.pdf
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-foreground">
                    Merged PDF created successfully
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-2 w-11/12 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type PreviewPanelProps = {
  title: string;
  files: string[];
};

function PreviewPanel({ title, files }: PreviewPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-sm font-bold text-foreground">{title}</p>
      <div className="mt-4 space-y-3">
        {files.map((file, index) => (
          <div
            key={file}
            className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 shadow-sm"
          >
            <GripVertical className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
              <FileText className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {file}
              </p>
              <p className="text-xs text-muted-foreground">
                Position {index + 1}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
