export type ToolFaqItem = {
  question: string;
  answer: string;
};

type ToolFaqProps = {
  items: ToolFaqItem[];
};

export function ToolFaq({ items }: ToolFaqProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-normal text-foreground">
        FAQ
      </h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <article
            key={item.question}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <h3 className="font-semibold text-card-foreground">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
