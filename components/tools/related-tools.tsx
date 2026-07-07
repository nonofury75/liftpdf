import { getRelatedTools } from "@/data/tools";
import { ToolCard } from "@/components/tools/tool-card";

type RelatedToolsProps = {
  currentHref: string;
  compact?: boolean;
};

export function RelatedTools({ currentHref, compact = false }: RelatedToolsProps) {
  const relatedTools = getRelatedTools(currentHref, 6);

  if (relatedTools.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={compact ? "mb-4 max-w-2xl" : "mb-6 max-w-2xl"}>
        <h2 className={compact ? "text-xl font-bold tracking-normal text-foreground" : "text-2xl font-bold tracking-normal text-foreground"}>
          Related Tools
        </h2>
        <p className={compact ? "mt-1 text-sm leading-6 text-muted-foreground" : "mt-2 text-sm leading-6 text-muted-foreground"}>
          Keep working with tools that match this PDF workflow.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedTools.map((tool) => (
          <ToolCard key={tool.href} tool={tool} compact={compact} />
        ))}
      </div>
    </div>
  );
}
