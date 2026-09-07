import { AnimatePresence, motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { useMemo } from "react";
import type { AnydayAdapter } from "../data/adapter";
import { computeProjection } from "../lib/finance";
import { formatSEK } from "../lib/money";
import { colorSets } from "../lib/colors";
import { scaleSizes } from "../lib/scale";
import { BubbleTile } from "../components/BubbleTile";
import { GroupIsland } from "../components/GroupIsland";
import { RingGauge } from "../components/RingGauge";
import { MonthProgress } from "../components/MonthProgress";
import { SizePicker } from "../components/SizePicker";

const STEPS = 4;

export function Simulate({
  adapter,
  cutSteps,
  onCutStepChange,
  onMoveToChest,
  onSelectCategory,
  showFigures,
}: {
  adapter: AnydayAdapter;
  cutSteps: Record<string, number>;
  onCutStepChange: (categoryId: string, step: number) => void;
  onMoveToChest: (amount: number) => void;
  onSelectCategory: (categoryId: string) => void;
  showFigures: boolean;
}) {
  const flowyCategories = adapter.categories.filter((c) => c.group === "flowy");
  const fixedCategories = adapter.categories.filter((c) => c.group === "fixed");

  const cutMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of flowyCategories) {
      const step = cutSteps[c.id] ?? 0;
      map[c.id] = (step / (STEPS - 1)) * c.flexibility;
    }
    return map;
  }, [cutSteps, flowyCategories]);

  const projection = useMemo(() => computeProjection(adapter, cutMap), [adapter, cutMap]);

  const income = projection.income;
  const outRatio = projection.projectedTotalOut / income;
  const ringColor =
    projection.projectedEndBalance >= income * 0.06
      ? "#93c17e"
      : projection.projectedEndBalance >= 0
        ? "#bcaed4"
        : "#e2a3b7";

  const fixedProjected = fixedCategories.map((category) => {
    const proj = projection.perCategory.find((p) => p.category.id === category.id)!;
    return { category, amount: proj.projectedTotal };
  });

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <div className="px-5 pt-4">
        <MonthProgress fraction={projection.daysElapsed / (projection.daysElapsed + projection.daysRemaining)} />
      </div>

      <div className="flex flex-col items-center px-5 pb-2 pt-6">
        <RingGauge percent={outRatio} size={140} strokeWidth={12} color={ringColor}>
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold text-ink">
              {formatSEK(projection.projectedEndBalance)}
            </span>
            <span className="text-[11px] text-slate-soft">kvar</span>
          </div>
        </RingGauge>

        <AnimatePresence>
          {projection.totalSavedByCuts > 0 && (
            <motion.button
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
              onClick={() => onMoveToChest(Math.round(projection.totalSavedByCuts))}
              className="mt-4 flex items-center gap-2 rounded-full bg-blush px-4 py-2.5 text-forest shadow-soft"
            >
              <PiggyBank className="h-4 w-4" strokeWidth={2} />
              <span className="text-[13px] font-semibold">
                {formatSEK(projection.totalSavedByCuts)}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4">
        {flowyCategories.map((category) => {
          const proj = projection.perCategory.find((p) => p.category.id === category.id)!;
          const colors = colorSets[category.color];
          const step = cutSteps[category.id] ?? 0;

          const stepAmounts = Array.from({ length: STEPS }, (_, i) => {
            const cutFrac = (i / (STEPS - 1)) * category.flexibility;
            return proj.spentSoFar + proj.dailyAverage * projection.daysRemaining * (1 - cutFrac);
          });
          const pickerSizes = scaleSizes(stepAmounts, 26, 60);

          return (
            <div key={category.id} className="flex items-center gap-3 rounded-2xl bg-paper p-3.5 shadow-soft">
              <BubbleTile
                category={category}
                amount={proj.projectedTotal}
                size={56}
                index={0}
                showFigures={showFigures}
                onSelect={() => onSelectCategory(category.id)}
              />
              <div className="flex-1">
                <SizePicker
                  colorHex={colors.hex}
                  sizes={pickerSizes}
                  amounts={stepAmounts}
                  stepIndex={step}
                  onChange={(i) => onCutStepChange(category.id, i)}
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
