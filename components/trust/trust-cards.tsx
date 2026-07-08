import { BadgeCheck, Clock3, LockKeyhole, MonitorCheck } from "lucide-react";

const trustCards = [
  {
    title: "Private",
    text: "Your files never leave your device for the current browser-side tools.",
    icon: LockKeyhole,
  },
  {
    title: "Secure",
    text: "Local browser processing avoids sending documents to a conversion server.",
    icon: MonitorCheck,
  },
  {
    title: "Fast",
    text: "Processing starts on your device without waiting for upload queues.",
    icon: Clock3,
  },
  {
    title: "Free",
    text: "No registration is required to use the available LiftPDF tools.",
    icon: BadgeCheck,
  },
];

export function TrustCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {trustCards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-semibold text-foreground">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {card.text}
            </p>
          </article>
        );
      })}
    </div>
  );
}
