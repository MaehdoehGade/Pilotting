import { motion } from "framer-motion";

/** An explicit on/off switch for whether amounts show as text — a real
 * toggle (track + knob), not an icon standing in for the idea. */
export function NumbersToggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      aria-label={on ? "Stäng av siffror" : "Slå på siffror"}
      className="flex items-center gap-1.5 rounded-full bg-white/10 py-1.5 pl-2.5 pr-1.5 backdrop-blur"
    >
      <span className={`text-[10px] font-bold tracking-tight ${on ? "text-ink" : "text-slate-soft"}`}>
        #s
      </span>
      <span
        className="relative h-4 w-7 rounded-full transition-colors"
        style={{ backgroundColor: on ? "#e08fb0" : "rgba(255,255,255,0.15)" }}
      >
        <motion.span
          className="absolute top-0.5 h-3 w-3 rounded-full bg-white"
          animate={{ left: on ? 14 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </span>
    </button>
  );
}
