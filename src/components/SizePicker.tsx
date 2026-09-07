import { motion } from "framer-motion";
import { formatSEK } from "../lib/money";

/**
 * A row of same-colored circles, pre-sized to what each choice actually
 * means. Bigger circle = more spend kept; the shrinking silhouette
 * left-to-right *is* the explanation. Labels are optional (figures toggle).
 */
export function SizePicker({
  colorHex,
  sizes,
  amounts,
  stepIndex,
  onChange,
  showFigures,
}: {
  colorHex: string;
  sizes: number[];
  amounts: number[];
  stepIndex: number;
  onChange: (index: number) => void;
  showFigures: boolean;
}) {
  const rowHeight = Math.max(...sizes) + (showFigures ? 26 : 10);

  return (
    <div
      className="flex items-end justify-between gap-2"
      style={{ height: rowHeight }}
    >
      {sizes.map((size, i) => {
        const selected = i === stepIndex;
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            className="flex flex-1 flex-col items-center justify-end gap-1 py-1"
          >
            {showFigures && (
              <span
                className={`text-[9.5px] font-medium leading-none ${
                  selected ? "text-ink" : "text-slate-soft"
                }`}
              >
                {formatSEK(amounts[i])}
              </span>
            )}
            <motion.div
              animate={{
                width: size,
                height: size,
                opacity: selected ? 1 : 0.38,
              }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              style={{
                backgroundColor: colorHex,
                boxShadow: selected ? "0 0 0 3px var(--color-blush)" : "none",
              }}
              className="rounded-full"
            />
          </button>
        );
      })}
    </div>
  );
}
