import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecurityBadges } from "@/components/trust/security-badges";

type TrustPageShellProps = {
  title: string;
  description: string;
  eyebrow: string;
  children: ReactNode;
};

export function TrustPageShell({
  title,
  description,
  eyebrow,
  children,
}: TrustPageShellProps) {
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-muted/35">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {description}
            </p>
            <SecurityBadges className="mt-6" />
          </div>

          <div className="h-fit rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              LiftPDF promise
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The current LiftPDF tools are built around browser-side
              processing. Files are selected, processed and exported locally on
              your device.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href="/pdf-tools">
                Browse tools
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {children}
    </div>
  );
}
