import { BrowserProcessing } from "@/components/home/browser-processing";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { PopularTools } from "@/components/home/popular-tools";
import { RealToolPreview } from "@/components/home/real-tool-preview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularTools />
      <BrowserProcessing />
      <RealToolPreview />
      <Features />
    </>
  );
}
