import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Category } from "../data/types";
import { colorSets } from "../lib/colors";
import { formatSEK } from "../lib/money";
import { CategoryIcon } from "./Icon";

export function BubbleTile({
  category,
  amount,
  size,
  index,
}: {
  category: Category;
  amount: number;
  size: number;
  index: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const colors = colorSets[category.color];
  const isFixed = category.group === "fixed";

  return (
    <motion.button
      onClick={() => setRevealed((r) => !r)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 360,
        damping: 18,
        delay: index * 0.05,
      }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <AnimatePresence>
        {revealed && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="absolute -top-8 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-cream shadow-pop"
          >
            {formatSEK(amount)}
          </motion.span>
        )}
      </AnimatePresence>
      <div
        style={{ width: size, height: size, backgroundColor: colors.hex }}
        className={`flex items-center justify-center shadow-soft ${
          isFixed ? "rounded-2xl" : "rounded-full"
        }`}
      >
        <CategoryIcon
          name={category.icon}
          className="h-[38%] w-[38%]"
          style={{ color: colors.onHex }}
        />
      </div>
    </motion.button>
  );
}
