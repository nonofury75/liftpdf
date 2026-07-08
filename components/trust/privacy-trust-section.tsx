import Link from "next/link";
import {
  ArrowRight,
  FileLock2,
  Laptop,
  ServerOff,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowBrowserProcessingWorks } from "@/components/trust/how-browser-processing-works";

const trustPoints = [
  {
    title: "Browser Processing",
    text: "The current tools process files in your browser using client-side PDF and image libraries.",
    icon: Laptop,
  },
  {
    title: "No File Upload",
    text: "Your selected documents do not need to be sent to a LiftPDF conversion server.",
    icon: ServerOff,
  },
  {
    title: "Private by Design",
    text: "Sensitive files stay on your device during conversion, editing and export.",
    icon: FileLock2,
  },
  {
    title: "Secure Conversion",
    text: "Protect and Unlock PDF use QPDF compiled to WebAssembly for local encryption tasks.",
    icon: ShieldCheck,
  },
];

export function PrivacyTrustSection() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Private by design
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-normal text-foreground">
            Your files stay in your browser
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            LiftPDF is built around local browser processing. For the available
            tools, files are read by your browser, processed on your device and
            downloaded back to you.
          </p>
          <div className="mt-6 grid gap-3">
            {trustPoints.map((point) => {
              const Icon = point.icon;

              return (
                <article
                  key={point.title}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {point.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/privacy">
                Read privacy details
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/security">Security overview</Link>
            </Button>
          </div>
        </div>

        <HowBrowserProcessingWorks compact />
      </div>
    </section>
  );
}
