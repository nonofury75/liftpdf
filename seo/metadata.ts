import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.description}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  verification: {
    google: "fZO1i1fR7-xh1-1IVLwz-vzuf-kLKw0FEmmSCMWBqLU",
  },
  other: {
    google: "notranslate",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description: siteConfig.description,
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "LiftPDF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description: siteConfig.description,
    images: ["/images/og-image.svg"],
  },
  icons: {
    icon: [
      {
        url: "/icons/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/icons/apple-touch-icon.svg",
  },
  manifest: "/manifest.webmanifest",
};
