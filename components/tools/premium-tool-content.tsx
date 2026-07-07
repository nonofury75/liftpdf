import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  FileImage,
  FileText,
  GraduationCap,
  ImageIcon,
  LockKeyhole,
  MonitorCheck,
  Printer,
  RefreshCw,
  Smartphone,
  Sparkles,
  UploadCloud,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PremiumVisual = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type PremiumToolStep = {
  title: string;
  text: string;
  icon: PremiumIconName;
};

export type PremiumToolSectionItem = {
  title: string;
  text: string;
  icon: PremiumIconName;
};

export type PremiumInternalLink = {
  label: string;
  href: string;
  text: string;
};

export type PremiumGuideSection = {
  title: string;
  paragraphs: string[];
};

export type PremiumToolContentData = {
  heroImage: PremiumVisual;
  ogImage: PremiumVisual;
  thumbnail: PremiumVisual;
  howItWorks: PremiumToolStep[];
  whyUse: PremiumToolSectionItem[];
  features: PremiumToolSectionItem[];
  useCases: PremiumToolSectionItem[];
  guide: PremiumGuideSection[];
  internalLinks: PremiumInternalLink[];
};

type PremiumToolContentProps = {
  title: string;
  content: PremiumToolContentData;
};

type PremiumIconName =
  | "upload"
  | "settings"
  | "convert"
  | "download"
  | "privacy"
  | "speed"
  | "quality"
  | "mobile"
  | "print"
  | "students"
  | "business"
  | "design"
  | "photo"
  | "admin"
  | "personal"
  | "browser"
  | "image"
  | "pdf";

const iconMap: Record<PremiumIconName, LucideIcon> = {
  upload: UploadCloud,
  settings: Sparkles,
  convert: RefreshCw,
  download: ArrowRight,
  privacy: LockKeyhole,
  speed: Zap,
  quality: BadgeCheck,
  mobile: Smartphone,
  print: Printer,
  students: GraduationCap,
  business: BriefcaseBusiness,
  design: Sparkles,
  photo: ImageIcon,
  admin: FileText,
  personal: Users,
  browser: MonitorCheck,
  image: FileImage,
  pdf: FileText,
};

const comparisonRows = [
  ["Browser processing", "Files stay on your device", "Usually uploaded first"],
  ["Privacy", "No document storage", "Depends on the provider"],
  ["Speed", "Starts immediately after selection", "Can wait for upload queues"],
  ["Account", "No account required", "Often limited by sign-in or trials"],
];

export function PremiumToolContent({
  title,
  content,
}: PremiumToolContentProps) {
  return (
    <div className="space-y-14">
      <section
        aria-labelledby="visual-guide"
        className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:p-8"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Visual guide
          </p>
          <h2
            id="visual-guide"
            className="mt-2 text-2xl font-bold tracking-normal text-foreground"
          >
            What this tool does
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Use the preview as a mental model: choose files, adjust only the
            settings that matter, then download the final document or image
            output. The workflow is designed to stay simple even with many
            pages.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-muted/40 p-3 shadow-inner">
          <Image
            src={content.heroImage.src}
            alt={content.heroImage.alt}
            width={content.heroImage.width}
            height={content.heroImage.height}
            className="h-auto w-full rounded-xl shadow-sm"
            sizes="(min-width: 1024px) 560px, 100vw"
          />
        </div>
      </section>

      <SectionGrid
        id="how-it-works"
        eyebrow="Simple workflow"
        title="How it works"
        items={content.howItWorks}
        columns="lg:grid-cols-4"
      />

      <SectionGrid
        id="why-use-this-tool"
        eyebrow="Practical reasons"
        title={`Why use ${title}?`}
        items={content.whyUse}
      />

      <SectionGrid
        id="features"
        eyebrow="Built for everyday files"
        title="Features"
        items={content.features}
      />

      <SectionGrid
        id="use-cases"
        eyebrow="Perfect for"
        title="Common use cases"
        items={content.useCases}
      />

      <GuideSection content={content} />

      <ComparisonSection />

      <InternalLinks links={content.internalLinks} />
    </div>
  );
}

function SectionGrid({
  id,
  eyebrow,
  title,
  items,
  columns = "lg:grid-cols-3",
}: {
  id: string;
  eyebrow: string;
  title: string;
  items: PremiumToolSectionItem[];
  columns?: string;
}) {
  return (
    <section aria-labelledby={id}>
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-2 text-2xl font-bold tracking-normal text-foreground"
        >
          {title}
        </h2>
      </div>
      <div className={cn("mt-6 grid gap-4 sm:grid-cols-2", columns)}>
        {items.map((item) => {
          const Icon = iconMap[item.icon];

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.text}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GuideSection({ content }: { content: PremiumToolContentData }) {
  return (
    <section
      aria-labelledby="complete-guide"
      className="rounded-3xl border border-border bg-muted/35 p-6 sm:p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-normal text-primary">
        Complete guide
      </p>
      <h2
        id="complete-guide"
        className="mt-2 text-2xl font-bold tracking-normal text-foreground"
      >
        Best practices before you convert
      </h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-7">
          {content.guide.map((section) => (
            <article key={section.title}>
              <h3 className="font-semibold text-foreground">
                {section.title}
              </h3>
              <div className="mt-3 space-y-4 text-sm leading-7 text-muted-foreground">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="h-fit overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm">
          <Image
            src={content.thumbnail.src}
            alt={content.thumbnail.alt}
            width={content.thumbnail.width}
            height={content.thumbnail.height}
            className="h-auto w-full rounded-xl"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 300px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section aria-labelledby="comparison">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Privacy comparison
        </p>
        <h2
          id="comparison"
          className="mt-2 text-2xl font-bold tracking-normal text-foreground"
        >
          LiftPDF vs typical online converters
        </h2>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-[1fr_1.1fr_1.1fr] border-b border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground">
          <span>Topic</span>
          <span>LiftPDF</span>
          <span>Typical converter</span>
        </div>
        {comparisonRows.map(([topic, liftPdf, other]) => (
          <div
            key={topic}
            className="grid grid-cols-[1fr_1.1fr_1.1fr] gap-3 border-b border-border px-4 py-4 text-sm last:border-b-0"
          >
            <span className="font-medium text-foreground">{topic}</span>
            <span className="flex gap-2 text-muted-foreground">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              {liftPdf}
            </span>
            <span className="text-muted-foreground">{other}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function InternalLinks({ links }: { links: PremiumInternalLink[] }) {
  return (
    <section aria-labelledby="keep-working">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Keep working
        </p>
        <h2
          id="keep-working"
          className="mt-2 text-2xl font-bold tracking-normal text-foreground"
        >
          Useful next tools
        </h2>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="font-semibold text-foreground">{link.label}</span>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {link.text}
            </p>
            <span
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "mt-4 px-0 text-primary hover:bg-transparent",
              )}
            >
              Open tool
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
