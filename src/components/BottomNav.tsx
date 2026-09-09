import { motion } from "framer-motion";
import { Gem, LayoutGrid, SlidersHorizontal } from "lucide-react";

export type TabKey = "overview" | "simulate" | "chest";

const tabs: { key: TabKey; label: string; Icon: typeof LayoutGrid }[] = [
  { key: "overview", label: "Översikt", Icon: LayoutGrid },
  { key: "simulate", label: "Simulera", Icon: SlidersHorizontal },
  { key: "chest", label: "Sparkista", Icon: Gem },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <nav className="relative flex items-stretch justify-around border-t border-line/60 bg-navy-2/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      {tabs.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            aria-label={label}
            className="relative flex flex-1 flex-col items-center justify-center py-1.5"
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute h-12 w-16 rounded-2xl bg-signal/15"
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              />
            )}
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={{ scale: isActive ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
              className="relative z-10"
            >
              <Icon
                className="h-6 w-6"
                strokeWidth={1.75}
                color={isActive ? "#ff3e88" : "#8d96ac"}
              />
            </motion.div>
            <span
              className={`relative z-10 mt-0.5 text-[10px] font-medium tracking-tight ${
                isActive ? "text-signal" : "text-aluminum"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
