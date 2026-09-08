import { Gem } from "lucide-react";
import type { AnydayAdapter } from "../data/adapter";
import type { SpendGroup } from "../data/types";
import { getIncome, scheduledByCategory, spendByCategory } from "../lib/finance";
import { NatureBackdrop } from "../components/NatureBackdrop";
import { MonthBox } from "../components/MonthBox";
import { MonthProgress } from "../components/MonthProgress";

export function Overview({
  adapter,
  chestTotal,
  onOpenChest,
  onSelectGroup,
  showFigures,
}: {
  adapter: AnydayAdapter;
  chestTotal: number;
  onOpenChest: () => void;
  onSelectGroup: (group: SpendGroup) => void;
  showFigures: boolean;
}) {
  const income = getIncome(adapter);
  const spend = spendByCategory(adapter);
  const { today, daysInMonth } = adapter.monthPlan;

  // Fixed is the whole month's committed obligation, paid or not yet paid —
  // it's locked in either way. Flowy only counts what's actually happened.
  const fixedTotal = spend
    .filter((s) => s.category.group === "fixed")
    .reduce((sum, s) => sum + s.spentSoFar + scheduledByCategory(adapter, s.category.id), 0);
  const flowyTotal = spend
    .filter((s) => s.category.group === "flowy")
    .reduce((sum, s) => sum + s.spentSoFar, 0);

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
          <MonthBox
            income={income}
            fixedTotal={fixedTotal}
            flowyTotal={flowyTotal}
            savedTotal={chestTotal}
            showFigures={showFigures}
            onSelectGroup={onSelectGroup}
            onSelectSaved={onOpenChest}
          />
        </div>
      </div>
      <div className="h-2" />
    </div>
  );
}
