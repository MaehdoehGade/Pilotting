import { AnimatePresence, motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { useMemo } from "react";
import type { AnydayAdapter } from "../data/adapter";
import type { SpendGroup } from "../data/types";
import { computeProjection, getIncome, scheduledByCategory, spendByCategory, type SlashMap } from "../lib/finance";
import { formatSEK } from "../lib/money";
import { colorSets } from "../lib/colors";
import { BubbleTile } from "../components/BubbleTile";
import { MonthBox } from "../components/MonthBox";
import { MonthProgress } from "../components/MonthProgress";
import { InstanceChips } from "../components/InstanceChips";

export function Simulate({
  adapter,
  chestTotal,
  slashed,
  onToggleSlash,
  onMoveToChest,
  onSelectGroup,
  onSelectCategory,
  onOpenChest,
  showFigures,
}: {
  adapter: AnydayAdapter;
  chestTotal: number;
  slashed: SlashMap;
  onToggleSlash: (categoryId: string, instanceId: string) => void;
  onMoveToChest: (amount: number) => void;
  onSelectGroup: (group: SpendGroup) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenChest: () => void;
  showFigures: boolean;
}) {
  const flowyCategories = adapter.categories.filter((c) => c.group === "flowy");

  const projection = useMemo(() => computeProjection(adapter, slashed), [adapter, slashed]);

  const income = getIncome(adapter);
  const spend = spendByCategory(adapter);
  // Fixed is fully committed regardless of simulation — same figure as Overview.
  const fixedTotal = spend
    .filter((s) => s.category.group === "fixed")
    .reduce((sum, s) => sum + s.spentSoFar + scheduledByCategory(adapter, s.category.id), 0);
  // Flowy auto-simulates the rest of the month: spent so far + whatever
  // projected purchases haven't been slashed. Slashing shrinks this box
  // live and grows the unused/overflow area of the same box.
  const flowyTotal = projection.perCategory
    .filter((p) => p.category.group === "flowy")
    .reduce((sum, p) => sum + p.projectedTotal, 0);

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <div className="px-5 pb-1 pt-14">
        <MonthProgress today={projection.daysElapsed} daysInMonth={projection.daysElapsed + projection.daysRemaining} />
        <p className="mt-2 text-[11px] leading-snug text-slate-soft">
          Prognos för resten av {adapter.monthPlan.monthLabel}, baserat på ditt mönster hittills.
          Fast är låst. Slasha Flowy-köp du bestämmer dig för att hoppa över.
        </p>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-4 pt-3">
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

        <AnimatePresence>
          {projection.totalSavedBySlash > 0 && (
            <motion.button
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
              onClick={() => onMoveToChest(Math.round(projection.totalSavedBySlash))}
              className="flex items-center justify-center gap-2 rounded-full bg-blush px-4 py-2.5 text-forest shadow-soft"
            >
              <PiggyBank className="h-4 w-4" strokeWidth={2} />
              <span className="text-[13px] font-semibold">
                {formatSEK(projection.totalSavedBySlash)}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

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
      </div>
      <div className="h-2" />
    </div>
  );
}
