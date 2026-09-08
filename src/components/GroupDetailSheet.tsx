import { AnimatePresence, motion } from "framer-motion";
import { Landmark, Lock, Waves, X } from "lucide-react";
import type { AnydayAdapter } from "../data/adapter";
import type { SpendGroup } from "../data/types";
import { colorSets } from "../lib/colors";
import { scheduledByCategory, spendByCategory } from "../lib/finance";
import { formatSEK } from "../lib/money";
import { CategoryIcon } from "./Icon";

export function GroupDetailSheet({
  adapter,
  group,
  onClose,
  onSelectCategory,
  onOpenMerge,
}: {
  adapter: AnydayAdapter;
  group: SpendGroup | null;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenMerge: () => void;
}) {
  // Fixed categories add their still-to-come scheduled amount so this total
  // matches the committed figure shown on the box (Flowy has none, so this
  // is a no-op there).
  const items = group
    ? spendByCategory(adapter)
        .filter((s) => s.category.group === group)
        .map((s) => ({
          category: s.category,
          amount: s.spentSoFar + scheduledByCategory(adapter, s.category.id),
        }))
    : [];
  const total = items.reduce((s, i) => s + i.amount, 0);
  const Icon = group === "fixed" ? Lock : Waves;
  const label = group === "fixed" ? "Fast" : "Flyt";

  return (
    <AnimatePresence>
      {group && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-30 bg-black/50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="absolute inset-x-0 bottom-0 z-40 flex max-h-[75%] flex-col rounded-t-3xl bg-paper shadow-pop"
          >
            <div className="flex items-center gap-3 border-b border-white/5 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-dim">
                <Icon className="h-5 w-5 text-slate-soft" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">{label}</p>
                <p className="text-[12px] text-slate-soft">{formatSEK(total)}</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-dim"
              >
                <X className="h-4 w-4 text-slate-soft" strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
              <div className="flex flex-col gap-2">
                {items.map(({ category, amount }) => {
                  const colors = colorSets[category.color];
                  return (
                    <button
                      key={category.id}
                      onClick={() => onSelectCategory(category.id)}
                      className="flex items-center justify-between rounded-2xl bg-cream-dim px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-full"
                          style={{ backgroundColor: colors.hex }}
                        >
                          <CategoryIcon name={category.icon} className="h-4 w-4" style={{ color: colors.onHex }} />
                        </span>
                        <p className="text-[12.5px] font-medium text-ink">{category.name}</p>
                      </div>
                      <p className="text-[12.5px] font-semibold text-ink">{formatSEK(amount)}</p>
                    </button>
                  );
                })}
              </div>

              {group === "fixed" && adapter.externalLoans.length > 0 && (
                <motion.button
                  onClick={onOpenMerge}
                  whileTap={{ scale: 0.97 }}
                  className="relative mt-4 flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-gold/15 px-3 py-3 text-left"
                >
                  <motion.span
                    className="absolute inset-0 bg-gold/20"
                    animate={{ opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold">
                    <Landmark className="h-4 w-4 text-forest" strokeWidth={1.75} />
                  </span>
                  <span className="relative text-[12.5px] font-medium text-ink">
                    {adapter.externalLoans.length} lån hos andra — slå ihop till en lägre summa?
                  </span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
