import { features } from "@/data/features";

export function Features() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-normal text-foreground">
            Why LiftPDF?
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            A fast, focused PDF suite designed for everyday work.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex min-h-32 flex-col justify-between rounded-lg border border-border bg-card p-5"
              >
                <Icon className="size-6 text-primary" aria-hidden="true" />
                <h3 className="text-base font-semibold text-card-foreground">
                  {feature.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
