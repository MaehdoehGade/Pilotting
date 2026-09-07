import { motion } from "framer-motion";
import type { Category } from "../data/types";
import { colorSets } from "../lib/colors";
import { formatSEK } from "../lib/money";
import { CategoryIcon } from "./Icon";

export function BubbleTile({
  category,
  amount,
  size,
  index,
  onClick,
}: {
  category: Category;
  amount: number;
  size: number;
  index: number;
  onClick?: () => void;
}) {
  const colors = colorSets[category.color];
  const isFixed = category.group === "fixed";

  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 360,
        damping: 18,
        delay: index * 0.05,
      }}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04, y: -2 }}
      style={{
        width: size,
        height: size,
        backgroundColor: colors.hex,
      }}
      className={`flex flex-col items-center justify-center gap-1 text-paper shadow-soft ${
        isFixed ? "rounded-2xl" : "rounded-full"
      }`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
        <CategoryIcon name={category.icon} className="h-4 w-4" />
      </span>
      <span className="text-[10px] font-medium leading-none opacity-90">
        {category.name}
      </span>
      <span className="text-[13px] font-semibold leading-none">
        {formatSEK(amount)}
      </span>
    </motion.button>
  );
}
