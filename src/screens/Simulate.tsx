import { AnimatePresence, motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { useMemo } from "react";
import type { AnydayAdapter } from "../data/adapter";
import { computeProjection, type SlashMap } from "../lib/finance";
import { formatSEK } from "../lib/money";
import { colorSets } from "../lib/colors";
import { BubbleTile } from "../components/BubbleTile";
import { GroupIsland } from "../components/GroupIsland";
import { RingGauge } from "../components/RingGauge";
import { MonthProgress } from "../components/MonthProgress";
import { InstanceChips } from "../components/InstanceChips";

export function Simulate({
  adapter,
  slashed,
  onToggleSlash,
  onMoveToChest,
  onSelectCategory,
  showFigures,
}: {
  adapter: AnydayAdapter;
  slashed: SlashMap;
  onToggleSlash: (categoryId: string, instanceId: string) => void;
  onMoveToChest: (amount: number) => void;
  onSelectCategory: (categoryId: string) => void;
  showFigures: boolean;
}) {
  const flowyCategories = adapter.categories.filter((c) => c.group === "flowy");
  const fixedCategories = adapter.categories.filter((c) => c.group === "fixed");

  const projection = useMemo(() => computeProjection(adapter, slashed), [adapter, slashed]);

  const income = projection.income;
  const outRatio = projection.projectedTotalOut / income;
  const isPositive = projection.projectedEndBalance >= 0;
  const ringColor = isPositive
    ? projection.projectedEndBalance >= income * 0.06
      ? "#93c17e"
      : "#bcaed4"
    : "#e2a3b7";

  const fixedProjected = fixedCategories.map((category) => {
    const proj = projection.perCategory.find((p) => p.category.id === category.id)!;
    return { category, amount: proj.projectedTotal };
  });

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <div className="px-5 pb-1 pt-14">
        <MonthProgress today={projection.daysElapsed} daysInMonth={projection.daysElapsed + projection.daysRemaining} />
        <p className="mt-2 text-[11px] leading-snug text-slate-soft">
          Prognos för resten av {adapter.monthPlan.monthLabel}, baserat på ditt mönster hittills.
          Fast är låst. Slasha Flowy-köp du bestämmer dig för att hoppa över.
        </p>
      </div>

      <div className="flex flex-col items-center px-5 pb-2 pt-5">
        <RingGauge percent={outRatio} size={140} strokeWidth={12} color={ringColor}>
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold text-ink">
              {formatSEK(Math.abs(projection.projectedEndBalance))}
            </span>
            <span className="text-[11px] font-medium text-slate-soft">
              {isPositive ? "sparbart" : "överdrag"}
            </span>
          </div>
        </RingGauge>

        <AnimatePresence>
          {projection.totalSavedBySlash > 0 && (
            <motion.button
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
              onClick={() => onMoveToChest(Math.round(projection.totalSavedBySlash))}
              className="mt-4 flex items-center gap-2 rounded-full bg-blush px-4 py-2.5 text-forest shadow-soft"
            >
              <PiggyBank className="h-4 w-4" strokeWidth={2} />
              <span className="text-[13px] font-semibold">
                {formatSEK(projection.totalSavedBySlash)}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4">
        {flowyCategories.map((category) => {
          const proj = projection.perCategory.find((p) => p.category.id === category.id)!;
          const colors = colorSets[category.color];
          const slashedIds = slashed[category.id] ?? new Set<string>();

          return (
            <div key={category.id} className="flex items-start gap-3 rounded-2xl bg-paper p-3.5 shadow-soft">
              <BubbleTile
                category={category}
                amount={proj.projectedTotal}
                size={52}
                index={0}
                showFigures={showFigures}
                onSelect={() => onSelectCategory(category.id)}
              />
              <div className="flex-1 pt-1">
                <InstanceChips
                  icon={category.icon}
                  colorHex={colors.hex}
                  onHex={colors.onHex}
                  instances={proj.instances}
                  slashedIds={slashedIds}
                  onToggle={(id) => onToggleSlash(category.id, id)}
                  showFigures={showFigures}
                />
              </div>
            </div>
          );
        })}

        <GroupIsland
          group="fixed"
          items={fixedProjected}
          showFigures={showFigures}
          onSelectCategory={onSelectCategory}
        />
      </div>
      <div className="h-2" />
    </div>
  );
}
