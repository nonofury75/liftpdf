import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowBrowserProcessingWorks } from "@/components/trust/how-browser-processing-works";
import { TrustCards } from "@/components/trust/trust-cards";

export function BrowserProcessing() {
  return (
    <section className="border-y border-border bg-muted/30 py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Trust system
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
            Why browser processing feels safer
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            LiftPDF is designed so the current tools process files locally in
            your browser. That means less waiting, fewer moving parts and no
            document upload step for everyday PDF work.
          </p>
        </div>

        <TrustCards />

        <HowBrowserProcessingWorks />

        <div className="flex flex-col gap-3 sm:flex-row">
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
    </section>
  );
}
