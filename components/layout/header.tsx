import Link from "next/link";
import { ArrowRight, FileText, Menu } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "PDF Tools",
    href: "/pdf-tools",
  },
  {
    label: "Image to PDF",
    href: "/jpg-to-pdf",
  },
  {
    label: "Convert",
    href: "/pdf-converter",
  },
  {
    label: "Edit",
    href: "/pdf-editor",
  },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link href="/jpg-to-pdf">
              Start Now
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <details className="relative md:hidden">
          <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-md border border-border bg-background text-foreground shadow-sm">
            <Menu className="size-5" aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </summary>
          <div className="absolute right-0 top-12 w-64 rounded-lg border border-border bg-background p-3 shadow-lg">
            <nav className="grid gap-1 text-sm font-medium text-muted-foreground">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-2">
                <Link href="/jpg-to-pdf">Start Now</Link>
              </Button>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
