import { motion } from "framer-motion";

const STEP_LABELS = ["Som vanligt", "Lite mindre", "Mycket mindre", "Max"];

export function SegmentedCut({
  groupId,
  stepIndex,
  onChange,
}: {
  groupId: string;
  stepIndex: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1 rounded-xl bg-cream-dim p-1">
      {STEP_LABELS.map((label, i) => {
        const isActive = i === stepIndex;
        return (
          <button
            key={label}
            onClick={() => onChange(i)}
            className="relative rounded-lg py-1.5 text-center"
          >
            {isActive && (
              <motion.div
                layoutId={`cut-pill-${groupId}`}
                className="absolute inset-0 rounded-lg bg-forest shadow-soft"
                transition={{ type: "spring", stiffness: 480, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 text-[9.5px] font-medium leading-tight ${
                isActive ? "text-paper" : "text-slate"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
