import type { Metadata, Viewport } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { defaultMetadata } from "@/seo/metadata";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" className="notranslate">
      <body translate="no" className="notranslate">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
