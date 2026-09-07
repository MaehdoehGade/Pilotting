import { formatSEK } from "../lib/money";
import { scaleSizes } from "../lib/scale";
import type { Category } from "../data/types";
import { BubbleTile } from "./BubbleTile";

export function GroupIsland({
  title,
  hint,
  items,
  total,
  onSelect,
}: {
  title: string;
  hint: string;
  items: { category: Category; amount: number }[];
  total: number;
  onSelect?: (categoryId: string) => void;
}) {
  const sizes = scaleSizes(items.map((i) => i.amount));

  return (
    <div className="rounded-3xl bg-paper p-4 shadow-soft">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="text-[11px] text-slate">{hint}</p>
        </div>
        <p className="text-sm font-semibold text-ink">{formatSEK(total)}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 py-1">
        {items.map(({ category, amount }, i) => (
          <BubbleTile
            key={category.id}
            category={category}
            amount={amount}
            size={sizes[i]}
            index={i}
            onClick={() => onSelect?.(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
