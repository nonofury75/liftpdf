import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const linksByHref: Record<string, { label: string; href: string }[]> = {
  "/merge-pdf": [
    { label: "How to merge PDF files", href: "/guides/how-to-merge-pdf" },
    { label: "Merge multiple PDF files", href: "/guides/merge-multiple-pdf-files" },
    { label: "Organize PDF hub", href: "/learn/organize-pdf" },
  ],
  "/extract-pages": [
    { label: "How to extract pages from a PDF", href: "/guides/how-to-extract-pages-from-pdf" },
    { label: "Extract multiple pages", href: "/guides/extract-multiple-pages-from-pdf" },
    { label: "Organize PDF hub", href: "/learn/organize-pdf" },
  ],
  "/jpg-to-pdf": [
    { label: "How to convert JPG to PDF", href: "/guides/how-to-convert-jpg-to-pdf" },
    { label: "Keep original image quality", href: "/guides/how-to-keep-original-image-quality" },
    { label: "PDF and images hub", href: "/learn/pdf-images" },
  ],
  "/png-to-pdf": [
    { label: "PNG vs PDF", href: "/guides/png-vs-pdf" },
    { label: "JPG vs PNG", href: "/guides/jpg-vs-png" },
    { label: "PDF and images hub", href: "/learn/pdf-images" },
  ],
  "/images-to-pdf": [
    { label: "Convert multiple JPGs to PDF", href: "/guides/how-to-convert-multiple-jpg-to-pdf" },
    { label: "JPG vs PNG", href: "/guides/jpg-vs-png" },
    { label: "PDF and images hub", href: "/learn/pdf-images" },
  ],
  "/protect-pdf": [
    { label: "What is a password-protected PDF?", href: "/guides/what-is-a-password-protected-pdf" },
    { label: "Browser-based PDF processing", href: "/guides/what-is-browser-based-pdf-processing" },
    { label: "PDF Security hub", href: "/learn/pdf-security" },
  ],
  "/unlock-pdf": [
    { label: "Password-protected PDFs explained", href: "/guides/what-is-a-password-protected-pdf" },
    { label: "Extract pages from protected PDFs", href: "/guides/extract-pages-from-password-protected-pdf" },
    { label: "PDF Security hub", href: "/learn/pdf-security" },
  ],
  "/pdf-to-text": [
    { label: "Scanned vs searchable PDF", href: "/guides/scanned-pdf-vs-searchable-pdf" },
    { label: "What is browser-based processing?", href: "/guides/what-is-browser-based-pdf-processing" },
    { label: "Troubleshooting hub", href: "/learn/troubleshooting" },
  ],
};

const fallbackLinks = [
  { label: "Learning Center", href: "/learn" },
  { label: "PDF Glossary", href: "/pdf-glossary" },
  { label: "Help Center", href: "/help" },
];

export function ToolLearningLinks({ currentHref }: { currentHref: string }) {
  const links = linksByHref[currentHref] || fallbackLinks;

  return (
    <section
      aria-labelledby="learn-more-about-task"
      className="rounded-3xl border border-border bg-background p-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <BookOpen className="size-5 text-primary" aria-hidden="true" />
        <h2 id="learn-more-about-task" className="text-lg font-bold">
          Learn more about this task
        </h2>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {link.label}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
