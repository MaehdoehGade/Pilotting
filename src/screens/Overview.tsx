import { Gem } from "lucide-react";
import type { AnydayAdapter } from "../data/adapter";
import { getIncome, getSpentSoFar, spendByCategory } from "../lib/finance";
import { NatureBackdrop } from "../components/NatureBackdrop";
import { Treemap, type TreemapLeaf } from "../components/Treemap";
import { LoanRow } from "../components/LoanRow";
import { MonthProgress } from "../components/MonthProgress";

export function Overview({
  adapter,
  chestTotal,
  onOpenChest,
  onSelectCategory,
  onOpenMerge,
  showFigures,
}: {
  adapter: AnydayAdapter;
  chestTotal: number;
  onOpenChest: () => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenMerge: () => void;
  showFigures: boolean;
}) {
  const income = getIncome(adapter);
  const spent = getSpentSoFar(adapter);
  const available = Math.max(income - spent - chestTotal, 0);
  const spend = spendByCategory(adapter);
  const { today, daysInMonth } = adapter.monthPlan;

  const leaves: TreemapLeaf[] = [
    ...spend.map((s) => ({
      kind: "category" as const,
      id: s.category.id,
      value: s.spentSoFar,
      category: s.category,
    })),
    ...(chestTotal > 0 ? [{ kind: "saved" as const, id: "saved", value: chestTotal }] : []),
    { kind: "unused" as const, id: "unused", value: available },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <div className="relative">
        <NatureBackdrop className="h-40 w-full" />
        <div className="absolute inset-x-0 top-0 px-5 pt-4">
          <MonthProgress today={today} daysInMonth={daysInMonth} light />
        </div>
        <button
          onClick={onOpenChest}
          className="absolute right-5 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-cream/50 backdrop-blur"
        >
          <Gem className="h-5 w-5 text-blush" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-4 pt-5">
        <div className="rounded-3xl bg-paper p-3 shadow-soft">
          <Treemap
            leaves={leaves}
            showFigures={showFigures}
            onSelectCategory={onSelectCategory}
            onSelectSaved={onOpenChest}
            onSelectUnused={onOpenChest}
          />
        </div>

        <div className="rounded-3xl bg-paper p-4 shadow-soft">
          <LoanRow loans={adapter.externalLoans} showFigures={showFigures} onOpen={onOpenMerge} />
        </div>
      </div>
      <div className="h-2" />
    </div>
  );
}
