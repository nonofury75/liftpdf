import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const linksByHref: Record<string, { label: string; href: string }[]> = {
  "/merge-pdf": [
    { label: "How to merge PDF files", href: "/guides/how-to-merge-pdf" },
    { label: "Why merge fails", href: "/guides/why-does-merge-pdf-fail" },
    { label: "Merge vs combine PDF", href: "/guides/merge-pdf-vs-combine-pdf" },
    { label: "Organize PDF hub", href: "/learn/organize-pdf" },
  ],
  "/extract-pages": [
    { label: "How to extract pages from a PDF", href: "/guides/how-to-extract-pages-from-pdf" },
    { label: "Extract vs Split PDF", href: "/guides/extract-pages-vs-split-pdf" },
    { label: "Scanned PDFs", href: "/guides/extract-pages-from-scanned-pdf" },
    { label: "Page range", href: "/pdf-glossary#page-range" },
  ],
  "/jpg-to-pdf": [
    { label: "How to convert JPG to PDF", href: "/guides/how-to-convert-jpg-to-pdf" },
    { label: "Why JPG gets blurry", href: "/guides/why-is-my-jpg-blurry-after-pdf" },
    { label: "JPG vs PNG", href: "/guides/jpg-vs-png" },
    { label: "Resolution", href: "/pdf-glossary#resolution" },
  ],
  "/png-to-pdf": [
    { label: "PNG vs PDF", href: "/guides/png-vs-pdf" },
    { label: "JPG vs PNG", href: "/guides/jpg-vs-png" },
    { label: "PDF vs PNG", href: "/guides/pdf-vs-png" },
    { label: "PDF and images hub", href: "/learn/pdf-images" },
  ],
  "/images-to-pdf": [
    { label: "Convert multiple JPGs to PDF", href: "/guides/how-to-convert-multiple-jpg-to-pdf" },
    { label: "Phone photos to PDF", href: "/guides/how-to-turn-phone-photos-into-a-pdf" },
    { label: "JPG vs PNG", href: "/guides/jpg-vs-png" },
    { label: "Keep images sharp", href: "/guides/how-to-keep-pdf-images-sharp" },
  ],
  "/protect-pdf": [
    { label: "What is a password-protected PDF?", href: "/guides/what-is-a-password-protected-pdf" },
    { label: "Why PDFs are protected", href: "/guides/why-a-pdf-is-password-protected" },
    { label: "Browser-based PDF processing", href: "/guides/what-is-browser-based-pdf-processing" },
    { label: "Encryption", href: "/pdf-glossary#encryption" },
  ],
  "/unlock-pdf": [
    { label: "Password-protected PDFs explained", href: "/guides/what-is-a-password-protected-pdf" },
    { label: "Extract pages from protected PDFs", href: "/guides/extract-pages-from-password-protected-pdf" },
    { label: "Why PDFs are protected", href: "/guides/why-a-pdf-is-password-protected" },
    { label: "Encryption", href: "/pdf-glossary#encryption" },
  ],
  "/pdf-to-text": [
    { label: "Scanned vs searchable PDF", href: "/guides/scanned-pdf-vs-searchable-pdf" },
    { label: "What is browser-based processing?", href: "/guides/what-is-browser-based-pdf-processing" },
    { label: "PDF opens blank", href: "/guides/why-pdf-opens-blank" },
    { label: "Selectable text", href: "/pdf-glossary#selectable-text" },
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
