import { Download, FileCog, Laptop, ServerOff } from "lucide-react";
import { cn } from "@/lib/utils";

type HowBrowserProcessingWorksProps = {
  className?: string;
  compact?: boolean;
};

const steps = [
  {
    title: "Your device",
    text: "You choose files in your browser.",
    icon: Laptop,
  },
  {
    title: "Local processing",
    text: "PDF.js, pdf-lib or QPDF WASM runs the task locally.",
    icon: FileCog,
  },
  {
    title: "Download",
    text: "The result is created for you to save.",
    icon: Download,
  },
];

export function HowBrowserProcessingWorks({
  className,
  compact = false,
}: HowBrowserProcessingWorksProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card p-6 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            No server upload
          </p>
          <h2
            className={cn(
              "mt-2 font-bold tracking-normal text-foreground",
              compact ? "text-xl" : "text-2xl",
            )}
          >
            How browser processing works
          </h2>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <ServerOff className="size-5" aria-hidden="true" />
        </span>
      </div>

      <div
        className={cn(
          "mt-6 grid items-stretch gap-4",
          compact ? "md:grid-cols-3" : "lg:grid-cols-3",
        )}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="relative">
              <div className="h-full rounded-2xl border border-border bg-background p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-muted text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.text}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <svg
                  aria-hidden="true"
                  className="absolute -right-4 top-1/2 hidden size-8 -translate-y-1/2 text-primary/60 lg:block"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M6 16h18m0 0-6-6m6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
        LiftPDF tools are designed so the selected files are read by the
        browser and processed on your device. The current tools do not require a
        document upload API.
      </div>
    </div>
  );
}
