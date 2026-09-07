import { AnimatePresence, motion } from "framer-motion";
import { Lock, X } from "lucide-react";
import type { AnydayAdapter } from "../data/adapter";
import { colorSets } from "../lib/colors";
import { formatSEK } from "../lib/money";
import { CategoryIcon } from "./Icon";

function formatDate(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
}

export function CategoryDetailSheet({
  adapter,
  categoryId,
  onClose,
}: {
  adapter: AnydayAdapter;
  categoryId: string | null;
  onClose: () => void;
}) {
  const category = adapter.categories.find((c) => c.id === categoryId) ?? null;

  const rows = category
    ? [
        ...adapter.transactions
          .filter((t) => t.categoryId === category.id && t.amount < 0)
          .map((t) => ({ ...t, upcoming: false })),
        ...adapter.scheduledOutflows
          .filter((t) => t.categoryId === category.id)
          .map((t) => ({ ...t, upcoming: true })),
      ].sort((a, b) => a.date.localeCompare(b.date))
    : [];

  const total = rows.reduce((s, r) => s - r.amount, 0);
  const colors = category ? colorSets[category.color] : null;
  const isFixed = category?.group === "fixed";

  return (
    <AnimatePresence>
      {category && colors && (
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
            className="absolute inset-x-0 bottom-0 z-40 flex max-h-[80%] flex-col rounded-t-3xl bg-paper shadow-pop"
          >
            <div className="flex items-center gap-3 border-b border-white/5 p-5">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center ${
                  isFixed ? "rounded-xl" : "rounded-full"
                }`}
                style={{ backgroundColor: colors.hex }}
              >
                <CategoryIcon name={category.icon} className="h-5 w-5" style={{ color: colors.onHex }} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">{category.name}</p>
                <p className="text-[12px] text-slate-soft">{formatSEK(total)}</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-dim"
              >
                <X className="h-4 w-4 text-slate-soft" strokeWidth={2} />
              </button>
            </div>

            {isFixed && (
              <div className="mx-5 mt-3 flex items-center gap-2 rounded-xl bg-cream-dim px-3 py-2">
                <Lock className="h-3.5 w-3.5 shrink-0 text-slate-soft" strokeWidth={2} />
                <p className="text-[11px] text-slate-soft">
                  Fast — de här går inte att skippa i simuleringen.
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-3 no-scrollbar">
              <div className="flex flex-col divide-y divide-white/5">
                {rows.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-ink">{r.merchant}</p>
                      <p className="text-[11px] text-slate-soft">
                        {formatDate(r.date)}
                        {r.upcoming ? " · kommande" : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {r.loanId && (
                        <Lock className="h-3 w-3 text-slate-soft" strokeWidth={2} />
                      )}
                      <span className="text-[13px] font-semibold text-ink">
                        {formatSEK(r.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
