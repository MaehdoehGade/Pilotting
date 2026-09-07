import { motion } from "framer-motion";

/**
 * A row of same-colored circles, pre-sized to what each choice actually
 * means — no labels. Bigger circle = more spend kept; the shrinking
 * silhouette left-to-right *is* the explanation.
 */
export function SizePicker({
  colorHex,
  sizes,
  stepIndex,
  onChange,
}: {
  colorHex: string;
  sizes: number[];
  stepIndex: number;
  onChange: (index: number) => void;
}) {
  const rowHeight = Math.max(...sizes) + 10;

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
            className="flex flex-1 items-end justify-center py-1"
          >
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
