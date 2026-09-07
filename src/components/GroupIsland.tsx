import { Lock, Waves } from "lucide-react";
import { scaleSizes } from "../lib/scale";
import type { Category, SpendGroup } from "../data/types";
import { BubbleTile } from "./BubbleTile";

export function GroupIsland({
  group,
  items,
  showFigures,
  onSelectCategory,
}: {
  group: SpendGroup;
  items: { category: Category; amount: number }[];
  showFigures: boolean;
  onSelectCategory: (categoryId: string) => void;
}) {
  const sizes = scaleSizes(
    items.map((i) => i.amount),
    68,
    128,
  );
  const Icon = group === "fixed" ? Lock : Waves;

  return (
    <div className="rounded-3xl bg-paper p-4 shadow-soft">
      <div className="mb-3 flex h-6 w-6 items-center justify-center rounded-full bg-cream-dim">
        <Icon className="h-3.5 w-3.5 text-slate-soft" strokeWidth={1.75} />
      </div>
      <div
        className={`flex flex-wrap items-center justify-center gap-x-3 pb-1 pt-8 ${
          showFigures ? "gap-y-[52px]" : "gap-y-3"
        }`}
      >
        {items.map(({ category, amount }, i) => (
          <BubbleTile
            key={category.id}
            category={category}
            amount={amount}
            size={sizes[i]}
            index={i}
            showFigures={showFigures}
            onSelect={() => onSelectCategory(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
