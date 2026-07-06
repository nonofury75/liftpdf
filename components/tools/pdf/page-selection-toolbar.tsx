import { Eraser, FlipHorizontal2, MousePointer2, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageSelectionToolbarProps = {
  selectedCount: number;
  totalPages: number;
  onDeleteSelected: () => void;
  onSelectAll: () => void;
  onClear: () => void;
  onInvertSelection: () => void;
  actionLabel?: string;
  ActionIcon?: LucideIcon;
};

export function PageSelectionToolbar({
  selectedCount,
  totalPages,
  onDeleteSelected,
  onSelectAll,
  onClear,
  onInvertSelection,
  actionLabel = "Delete Selected",
  ActionIcon = Trash2,
}: PageSelectionToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-foreground" aria-live="polite">
        {selectedCount} of {totalPages}{" "}
        {totalPages === 1 ? "page" : "pages"} selected
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSelectAll}
          disabled={selectedCount === totalPages}
        >
          <MousePointer2 className="size-4" aria-hidden="true" />
          Select All
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          disabled={selectedCount === 0}
        >
          <Eraser className="size-4" aria-hidden="true" />
          Clear
        </Button>
        <Button type="button" variant="outline" onClick={onInvertSelection}>
          <FlipHorizontal2 className="size-4" aria-hidden="true" />
          Invert Selection
        </Button>
        <Button
          type="button"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
        >
          <ActionIcon className="size-4" aria-hidden="true" />
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
