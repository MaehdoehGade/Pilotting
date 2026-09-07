import { motion } from "framer-motion";
import type { ProjectedInstance } from "../lib/finance";
import { formatSEK } from "../lib/money";
import { CategoryIcon } from "./Icon";

const MAX_CHIPS = 14;
const CHIP = 32;

/**
 * One chip per future purchase the simulator expects in this category.
 * Tap to slash it — a commitment not to make that purchase — and its
 * amount flies into the savings figure. Tap again to undo.
 */
export function InstanceChips({
  icon,
  colorHex,
  onHex,
  instances,
  slashedIds,
  onToggle,
  showFigures,
}: {
  icon: string;
  colorHex: string;
  onHex: string;
  instances: ProjectedInstance[];
  slashedIds: Set<string>;
  onToggle: (id: string) => void;
  showFigures: boolean;
}) {
  if (instances.length === 0) {
    return <p className="text-[11px] text-slate-soft">Inga fler köp väntade i år.</p>;
  }

  const shown = instances.slice(0, MAX_CHIPS);
  const overflow = instances.slice(MAX_CHIPS);
  const overflowAmount = overflow.reduce((s, i) => s + i.amount, 0);
  const overflowSlashed = overflow.every((i) => slashedIds.has(i.id));

  return (
    <div className="flex flex-wrap gap-2">
      {shown.map((instance) => {
        const slashed = slashedIds.has(instance.id);
        return (
          <button
            key={instance.id}
            onClick={() => onToggle(instance.id)}
            className="relative flex items-center justify-center"
            style={{ width: CHIP, height: CHIP }}
            aria-label={slashed ? "Ångra" : "Slash"}
          >
            <motion.div
              animate={{ opacity: slashed ? 0.3 : 1, scale: slashed ? 0.88 : 1 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="flex items-center justify-center rounded-full"
              style={{ width: CHIP, height: CHIP, backgroundColor: colorHex }}
            >
              <CategoryIcon name={icon} className="h-[42%] w-[42%]" style={{ color: onHex }} />
            </motion.div>
            {slashed && (
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0"
                viewBox="0 0 32 32"
              >
                <motion.line
                  x1="5"
                  y1="27"
                  x2="27"
                  y2="5"
                  stroke="var(--color-rose)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                />
              </motion.svg>
            )}
            {showFigures && !slashed && (
              <span className="absolute -bottom-4 whitespace-nowrap text-[8.5px] font-medium text-slate-soft">
                {formatSEK(instance.amount)}
              </span>
            )}
          </button>
        );
      })}

      {overflow.length > 0 && (
        <button
          onClick={() => overflow.forEach((i) => onToggle(i.id))}
          className="relative flex items-center justify-center rounded-full border border-dashed border-white/25 text-[10px] font-semibold"
          style={{
            width: CHIP,
            height: CHIP,
            color: "var(--color-slate-soft)",
            opacity: overflowSlashed ? 0.4 : 1,
          }}
        >
          +{overflow.length}
          {overflowSlashed && (
            <svg className="pointer-events-none absolute inset-0" viewBox="0 0 32 32">
              <line x1="5" y1="27" x2="27" y2="5" stroke="var(--color-rose)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {showFigures && (
            <span className="absolute -bottom-4 whitespace-nowrap text-[8.5px] font-medium text-slate-soft">
              {formatSEK(overflowAmount)}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
