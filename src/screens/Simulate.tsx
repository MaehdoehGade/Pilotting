import { AnimatePresence, motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { useMemo } from "react";
import type { AnydayAdapter } from "../data/adapter";
import { computeProjection, scheduledByCategory } from "../lib/finance";
import { formatSEK, formatSigned } from "../lib/money";
import { colorSets } from "../lib/colors";
import { CategoryIcon } from "../components/Icon";
import { SegmentedCut } from "../components/SegmentedCut";

export function Simulate({
  adapter,
  cutSteps,
  onCutStepChange,
  onMoveToChest,
}: {
  adapter: AnydayAdapter;
  cutSteps: Record<string, number>;
  onCutStepChange: (categoryId: string, step: number) => void;
  onMoveToChest: (amount: number) => void;
}) {
  const flowyCategories = adapter.categories.filter((c) => c.group === "flowy");
  const fixedCategories = adapter.categories.filter((c) => c.group === "fixed");

  const cutMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of flowyCategories) {
      const step = cutSteps[c.id] ?? 0;
      map[c.id] = (step / 3) * c.flexibility;
    }
    return map;
  }, [cutSteps, flowyCategories]);

  const projection = useMemo(
    () => computeProjection(adapter, cutMap),
    [adapter, cutMap],
  );

  const balanceLevel =
    projection.projectedEndBalance >= 2000
      ? "good"
      : projection.projectedEndBalance >= 0
        ? "tight"
        : "over";

  const balanceTone = {
    good: "text-forest",
    tight: "text-plum",
    over: "text-rose",
  }[balanceLevel];

  const balanceMsg = {
    good: "Ser bra ut — du håller god marginal.",
    tight: "Det går ihop, men marginalen är knapp.",
    over: "Du riskerar att gå back i slutet av månaden.",
  }[balanceLevel];

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <div className="px-5 pb-2 pt-5">
        <p className="text-xs font-medium text-slate">
          {projection.daysRemaining} dagar kvar av {adapter.monthPlan.monthLabel}
        </p>
        <h1 className="text-lg font-semibold text-ink">Simulera resten av månaden</h1>
      </div>

      <div className="mx-5 mb-4 rounded-3xl bg-paper p-4 shadow-pop">
        <p className="text-[11px] font-medium text-slate">Prognos vid månadens slut</p>
        <AnimatePresence mode="popLayout">
          <motion.p
            key={Math.round(projection.projectedEndBalance / 10)}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className={`text-3xl font-semibold ${balanceTone}`}
          >
            {formatSEK(projection.projectedEndBalance)}
          </motion.p>
        </AnimatePresence>
        <p className="mt-1 text-[12px] text-slate">{balanceMsg}</p>

        {projection.totalSavedByCuts > 0 && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMoveToChest(Math.round(projection.totalSavedByCuts))}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-4 py-3 text-[13px] font-semibold text-paper shadow-soft"
          >
            <PiggyBank className="h-4 w-4" strokeWidth={1.75} />
            Flytta frigjorda {formatSEK(projection.totalSavedByCuts)} till sparkistan
          </motion.button>
        )}
      </div>

      <div className="flex flex-col gap-3 px-5 pb-4">
        <p className="text-sm font-semibold text-ink">Flyt — här kan du dra ner</p>
        {flowyCategories.map((category) => {
          const proj = projection.perCategory.find((p) => p.category.id === category.id)!;
          const colors = colorSets[category.color];
          const step = cutSteps[category.id] ?? 0;
          return (
            <div key={category.id} className="rounded-2xl bg-paper p-3.5 shadow-soft">
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-paper"
                    style={{ backgroundColor: colors.hex }}
                  >
                    <CategoryIcon name={category.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-ink">{category.name}</p>
                    <p className="text-[11px] text-slate">
                      Hittills: {formatSEK(proj.spentSoFar)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-ink">
                    {formatSEK(proj.projectedTotal)}
                  </p>
                  {proj.savedByCut > 0 && (
                    <p className="text-[11px] font-medium text-forest">
                      {formatSigned(-proj.savedByCut)}
                    </p>
                  )}
                </div>
              </div>
              <SegmentedCut
                groupId={category.id}
                stepIndex={step}
                onChange={(i) => onCutStepChange(category.id, i)}
              />
            </div>
          );
        })}

        <p className="mt-2 text-sm font-semibold text-ink">Fast — låst resten av månaden</p>
        <div className="rounded-2xl bg-paper p-3.5 shadow-soft">
          <div className="flex flex-col gap-2.5">
            {fixedCategories.map((category) => {
              const scheduled = scheduledByCategory(adapter, category.id);
              const colors = colorSets[category.color];
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-paper"
                      style={{ backgroundColor: colors.hex }}
                    >
                      <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-[12.5px] font-medium text-ink">{category.name}</p>
                  </div>
                  <p className="text-[12.5px] text-slate">
                    {scheduled > 0 ? `${formatSEK(scheduled)} kvar` : "Klart för månaden"}
                  </p>
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
