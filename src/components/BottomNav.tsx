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
    <nav className="relative flex items-stretch justify-around border-t border-black/5 bg-paper/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      {tabs.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="relative flex flex-1 flex-col items-center gap-1 py-1.5"
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute -top-1 h-9 w-14 rounded-2xl bg-forest/10"
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              />
            )}
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={{ scale: isActive ? 1.08 : 1, y: isActive ? -1 : 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
              className="relative z-10"
            >
              <Icon
                className="h-6 w-6"
                strokeWidth={1.75}
                color={isActive ? "#202e17" : "#939c9a"}
              />
            </motion.div>
            <span
              className={`relative z-10 text-[11px] font-medium tracking-tight ${
                isActive ? "text-forest" : "text-slate-soft"
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
