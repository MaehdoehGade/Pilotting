import { motion } from "framer-motion";
import { Lock, PiggyBank, Waves, Wallet } from "lucide-react";
import type { SpendGroup } from "../data/types";
import { colorSets } from "../lib/colors";
import { formatSEK } from "../lib/money";
import { squarify } from "../lib/treemap";

const CANVAS_W = 390;
const CANVAS_H = 240;
const GAP = 3;

/**
 * The one box, sized by income, that both Overview and Simulate render.
 * Only two spend groups ever show at this level — Fast and Flyt — plus
 * what's saved and what's still unused; tapping Fast/Flyt is how you get
 * to the categories inside. If a screen's total exceeds income, there's
 * no negative area to draw, so an overflow banner takes over instead.
 */
export function MonthBox({
  income,
  fixedTotal,
  flowyTotal,
  savedTotal,
  showFigures,
  onSelectGroup,
  onSelectSaved,
}: {
  income: number;
  fixedTotal: number;
  flowyTotal: number;
  savedTotal: number;
  showFigures: boolean;
  onSelectGroup: (group: SpendGroup) => void;
  onSelectSaved: () => void;
}) {
  const allocated = fixedTotal + flowyTotal + savedTotal;
  const overflow = Math.max(allocated - income, 0);
  const unused = Math.max(income - allocated, 0);

  const leaves = [
    { id: "fixed", value: fixedTotal },
    { id: "flowy", value: flowyTotal },
    ...(savedTotal > 0 ? [{ id: "saved", value: savedTotal }] : []),
    ...(unused > 0 ? [{ id: "unused", value: unused }] : []),
  ];
  const rects = squarify(leaves, 0, 0, CANVAS_W, CANVAS_H);

  const groupMeta: Record<"fixed" | "flowy", { colorHex: string; onHex: string; Icon: typeof Lock; label: string }> = {
    fixed: { colorHex: colorSets.navy.hex, onHex: colorSets.navy.onHex, Icon: Lock, label: "Fast" },
    flowy: { colorHex: colorSets.plum.hex, onHex: colorSets.plum.onHex, Icon: Waves, label: "Flyt" },
  };

  return (
    <div>
      {overflow > 0 && (
        <div className="mb-2 flex items-center justify-center rounded-xl bg-rose/15 py-1.5">
          <span className="text-[11px] font-semibold text-rose">Överdrag {formatSEK(overflow)}</span>
        </div>
      )}
      <div className="relative w-full overflow-hidden rounded-3xl" style={{ height: CANVAS_H }}>
        {rects.map((rect) => {
          const gx = Math.min(GAP, rect.w / 4);
          const gy = Math.min(GAP, rect.h / 4);
          const style = {
            left: `${((rect.x + gx) / CANVAS_W) * 100}%`,
            top: `${((rect.y + gy) / CANVAS_H) * 100}%`,
            width: `${((rect.w - gx * 2) / CANVAS_W) * 100}%`,
            height: `${((rect.h - gy * 2) / CANVAS_H) * 100}%`,
          };
          const canLabel = rect.w > 64 && rect.h > 46;

          if (rect.id === "unused") {
            return (
              <div
                key="unused"
                className="absolute flex items-center justify-center rounded-lg border-2 border-dashed border-white/15"
                style={style}
              >
                {canLabel && (
                  <div className="flex flex-col items-center gap-1 text-slate-soft">
                    <Wallet className="h-4 w-4" strokeWidth={1.75} />
                    {showFigures && (
                      <span className="text-[10px] font-medium leading-none">{formatSEK(unused)}</span>
                    )}
                  </div>
                )}
              </div>
            );
          }

          if (rect.id === "saved") {
            return (
              <motion.button
                key="saved"
                onClick={onSelectSaved}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="absolute flex items-center justify-center rounded-lg"
                style={{ ...style, backgroundColor: "#e08fb0" }}
              >
                <div className="flex flex-col items-center gap-1 text-[#2c1420]">
                  <PiggyBank className="h-4 w-4" strokeWidth={1.75} />
                  {canLabel && showFigures && (
                    <span className="text-[10px] font-semibold leading-none">{formatSEK(savedTotal)}</span>
                  )}
                </div>
              </motion.button>
            );
          }

          const key = rect.id as "fixed" | "flowy";
          const meta = groupMeta[key];
          return (
            <motion.button
              key={key}
              onClick={() => onSelectGroup(key)}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`absolute flex flex-col items-center justify-center gap-1 ${
                key === "fixed" ? "rounded-md" : "rounded-2xl"
              }`}
              style={{ ...style, backgroundColor: meta.colorHex }}
            >
              <meta.Icon className="h-5 w-5" strokeWidth={1.75} style={{ color: meta.onHex }} />
              {canLabel && (
                <span className="text-center text-[11px] font-medium leading-tight" style={{ color: meta.onHex }}>
                  {meta.label}
                  {showFigures && (
                    <>
                      <br />
                      <span className="font-semibold">{formatSEK(rect.value)}</span>
                    </>
                  )}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
