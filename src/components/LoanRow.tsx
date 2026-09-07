import { motion } from "framer-motion";
import { Landmark } from "lucide-react";
import type { ExternalLoan } from "../data/types";
import { formatSEK } from "../lib/money";

export function LoanRow({
  loans,
  showFigures,
  onOpen,
}: {
  loans: ExternalLoan[];
  showFigures: boolean;
  onOpen: () => void;
}) {
  return (
    <div className={`flex items-center justify-center gap-4 ${showFigures ? "pt-6" : ""}`}>
      {loans.map((loan, i) => {
        const size = 44 + Math.min(loan.balance / 62000, 1) * 30;
        return (
          <button key={loan.id} onClick={onOpen} className="relative flex flex-col items-center">
            {showFigures && (
              <span className="absolute -top-7 whitespace-nowrap rounded-lg bg-ink px-2 py-0.5 text-[10px] font-semibold text-cream shadow-pop">
                {formatSEK(loan.balance)}
              </span>
            )}
            <motion.div
              className="absolute rounded-full bg-gold"
              style={{ width: size, height: size }}
              animate={{ opacity: [0.35, 0, 0.35], scale: [1, 1.35, 1] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
            <div
              className="relative flex items-center justify-center rounded-full bg-navy"
              style={{ width: size, height: size }}
            >
              <Landmark className="h-[36%] w-[36%] text-ink" strokeWidth={1.75} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
