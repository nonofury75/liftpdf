import { BrowserProcessing } from "@/components/home/browser-processing";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { LearnAboutPdfs } from "@/components/home/learn-about-pdfs";
import { PopularTools } from "@/components/home/popular-tools";
import { RealToolPreview } from "@/components/home/real-tool-preview";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/icons/icon.svg`,
      },
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
      },
      {
        "@type": "SoftwareApplication",
        name: siteConfig.name,
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Any",
        url: siteConfig.url,
        description: siteConfig.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <PopularTools />
      <BrowserProcessing />
      <RealToolPreview />
      <LearnAboutPdfs />
      <Features />
    </>
  );
}
