import Link from "next/link";
import { siteConfig } from "@/config/site";

const footerLinks = [
  {
    title: "Tools",
    links: [
      { label: "All PDF Tools", href: "/pdf-tools" },
      { label: "JPG to PDF", href: "/jpg-to-pdf" },
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Compress PDF", href: "/compress-pdf" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Convert PDF", href: "/pdf-converter" },
      { label: "Edit PDF", href: "/pdf-editor" },
      { label: "Organize PDF", href: "/organize-pdf" },
      { label: "Image Tools", href: "/pdf-image-tools" },
      { label: "Security", href: "/pdf-security" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Learning Center", href: "/learn" },
      { label: "Guides", href: "/guides" },
      { label: "PDF Glossary", href: "/pdf-glossary" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Security", href: "/security" },
      { label: "About", href: "/about" },
      { label: "Why LiftPDF", href: "/why-liftpdf" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="text-lg font-bold text-foreground">
            {siteConfig.name}
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Fast, private PDF tools that run directly in your browser.
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {footerLinks.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold text-foreground">
                {group.title}
              </h2>
              <div className="mt-3 grid gap-2 text-sm font-medium text-muted-foreground">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>
      </div>
    </footer>
  );
}
