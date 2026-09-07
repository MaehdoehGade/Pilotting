import { motion } from "framer-motion";
import { PiggyBank, Wallet } from "lucide-react";
import type { Category } from "../data/types";
import { colorSets } from "../lib/colors";
import { formatSEK } from "../lib/money";
import { squarify } from "../lib/treemap";
import { CategoryIcon } from "./Icon";

const CANVAS_W = 390;
const CANVAS_H = 272;
const GAP = 3;

export interface TreemapLeaf {
  kind: "category" | "saved" | "unused";
  id: string;
  value: number;
  category?: Category;
}

export function Treemap({
  leaves,
  showFigures,
  onSelectCategory,
  onSelectUnused,
  onSelectSaved,
}: {
  leaves: TreemapLeaf[];
  showFigures: boolean;
  onSelectCategory: (categoryId: string) => void;
  onSelectUnused: () => void;
  onSelectSaved: () => void;
}) {
  const rects = squarify(
    leaves.map((l) => ({ id: l.id, value: l.value })),
    0,
    0,
    CANVAS_W,
    CANVAS_H,
  );

  return (
    <div className="relative w-full overflow-hidden rounded-3xl" style={{ height: CANVAS_H }}>
      {rects.map((rect) => {
        const leaf = leaves.find((l) => l.id === rect.id)!;
        const canLabel = rect.w > 64 && rect.h > 46;
        const gx = Math.min(GAP, rect.w / 4);
        const gy = Math.min(GAP, rect.h / 4);
        const style = {
          left: `${((rect.x + gx) / CANVAS_W) * 100}%`,
          top: `${((rect.y + gy) / CANVAS_H) * 100}%`,
          width: `${((rect.w - gx * 2) / CANVAS_W) * 100}%`,
          height: `${((rect.h - gy * 2) / CANVAS_H) * 100}%`,
        };

        if (leaf.kind === "unused") {
          return (
            <button
              key={rect.id}
              onClick={onSelectUnused}
              className="absolute flex items-center justify-center rounded-lg border-2 border-dashed border-white/15 p-1"
              style={style}
            >
              {canLabel && (
                <div className="flex flex-col items-center gap-1 text-slate-soft">
                  <Wallet className="h-4 w-4" strokeWidth={1.75} />
                  {showFigures && (
                    <span className="text-[10px] font-medium leading-none">
                      {formatSEK(leaf.value)}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        }

        if (leaf.kind === "saved") {
          return (
            <motion.button
              key={rect.id}
              onClick={onSelectSaved}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="absolute flex items-center justify-center gap-1 rounded-lg p-1"
              style={{ ...style, backgroundColor: "#e08fb0" }}
            >
              <div className="flex flex-col items-center gap-1 text-[#2c1420]">
                <PiggyBank className="h-4 w-4" strokeWidth={1.75} />
                {canLabel && showFigures && (
                  <span className="text-[10px] font-semibold leading-none">
                    {formatSEK(leaf.value)}
                  </span>
                )}
              </div>
            </motion.button>
          );
        }

        const category = leaf.category!;
        const colors = colorSets[category.color];
        const isFixed = category.group === "fixed";

        return (
          <motion.button
            key={rect.id}
            onClick={() => onSelectCategory(category.id)}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className={`absolute flex flex-col items-center justify-center gap-1 p-1 ${
              isFixed ? "rounded-md" : "rounded-2xl"
            }`}
            style={{ ...style, backgroundColor: colors.hex }}
          >
            <CategoryIcon
              name={category.icon}
              className="h-4 w-4 shrink-0"
              style={{ color: colors.onHex }}
            />
            {canLabel && showFigures && (
              <span
                className="text-center text-[10px] font-medium leading-tight"
                style={{ color: colors.onHex }}
              >
                {category.name}
                <br />
                <span className="font-semibold">{formatSEK(leaf.value)}</span>
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
