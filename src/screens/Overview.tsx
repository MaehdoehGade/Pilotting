import { Gem, Landmark } from "lucide-react";
import type { AnydayAdapter } from "../data/adapter";
import { formatSEK } from "../lib/money";
import { getIncome, getSpentSoFar, spendByCategory } from "../lib/finance";
import { NatureBackdrop } from "../components/NatureBackdrop";
import { GroupIsland } from "../components/GroupIsland";
import { RingGauge } from "../components/RingGauge";
import { MonthProgress } from "../components/MonthProgress";

export function Overview({
  adapter,
  chestTotal,
  onOpenChest,
  showFigures,
}: {
  adapter: AnydayAdapter;
  chestTotal: number;
  onOpenChest: () => void;
  showFigures: boolean;
}) {
  const income = getIncome(adapter);
  const spent = getSpentSoFar(adapter);
  const available = income - spent - chestTotal;
  const spend = spendByCategory(adapter);
  const fixed = spend.filter((s) => s.category.group === "fixed");
  const flowy = spend.filter((s) => s.category.group === "flowy");
  const { today, daysInMonth } = adapter.monthPlan;

  const spentRatio = spent / income;
  const ringColor =
    spentRatio < 0.7 ? "#93c17e" : spentRatio < 0.95 ? "#bcaed4" : "#e2a3b7";

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <div className="relative">
        <NatureBackdrop className="h-40 w-full" />
        <div className="absolute inset-x-0 top-0 px-5 pt-4">
          <MonthProgress fraction={today / daysInMonth} />
        </div>
        <button
          onClick={onOpenChest}
          className="absolute right-5 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-cream/50 backdrop-blur"
        >
          <Gem className="h-5 w-5 text-blush" strokeWidth={1.75} />
        </button>
      </div>

      <div className="-mt-14 flex flex-col items-center px-5">
        <RingGauge percent={spentRatio} color={ringColor}>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-semibold text-ink">
              {formatSEK(available)}
            </span>
            <span className="text-[11px] text-slate-soft">kvar</span>
          </div>
        </RingGauge>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-4 pt-5">
        <GroupIsland
          group="fixed"
          items={fixed.map((s) => ({ category: s.category, amount: s.spentSoFar }))}
          showFigures={showFigures}
        />
        <GroupIsland
          group="flowy"
          items={flowy.map((s) => ({ category: s.category, amount: s.spentSoFar }))}
          showFigures={showFigures}
        />

        <div className="rounded-3xl bg-paper p-4 shadow-soft">
          <div className="mb-3 flex h-6 w-6 items-center justify-center rounded-full bg-cream-dim">
            <Landmark className="h-3.5 w-3.5 text-slate-soft" strokeWidth={1.75} />
          </div>
          <div className={`flex items-center justify-center gap-4 ${showFigures ? "pt-6" : ""}`}>
            {adapter.externalLoans.map((loan) => {
              const size = 44 + Math.min(loan.balance / 62000, 1) * 30;
              return (
                <div key={loan.id} className="relative flex flex-col items-center">
                  {showFigures && (
                    <span className="absolute -top-7 whitespace-nowrap rounded-lg bg-ink px-2 py-0.5 text-[10px] font-semibold text-cream shadow-pop">
                      {formatSEK(loan.balance)}
                    </span>
                  )}
                  <div
                    className="flex items-center justify-center rounded-full bg-navy/70"
                    style={{ width: size, height: size }}
                  >
                    <Landmark className="h-[36%] w-[36%] text-ink" strokeWidth={1.75} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-2" />
    </div>
  );
}
