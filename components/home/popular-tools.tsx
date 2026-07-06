import { popularTools } from "@/data/tools";
import { HomeToolsBrowser } from "@/components/home/home-tools-browser";

export function PopularTools() {
  return (
    <section id="popular-tools" className="bg-muted/40 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-normal text-foreground">
            PDF Tools
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Choose a tool and keep working without uploads to a backend. More
            tools are coming as LiftPDF grows.
          </p>
        </div>
        <HomeToolsBrowser tools={popularTools} />
      </div>
    </section>
  );
}
