import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { PopularTools } from "@/components/home/popular-tools";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularTools />
      <Features />
    </>
  );
}
