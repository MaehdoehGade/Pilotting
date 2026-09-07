import { AnimatePresence, motion } from "framer-motion";
import { Landmark, PiggyBank, X } from "lucide-react";
import type { ExternalLoan } from "../data/types";
import { computeMergeOffer } from "../lib/finance";
import { formatSEK } from "../lib/money";

export function MergeLoansSheet({
  loans,
  open,
  onClose,
  onMoveSavingsToChest,
}: {
  loans: ExternalLoan[];
  open: boolean;
  onClose: () => void;
  onMoveSavingsToChest: (amount: number) => void;
}) {
  const offer = computeMergeOffer(loans);
  const maxPayment = Math.max(offer.currentMonthlyTotal, offer.newMonthlyPayment);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-30 bg-black/50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="absolute inset-x-0 bottom-0 z-40 flex max-h-[85%] flex-col rounded-t-3xl bg-paper shadow-pop"
          >
            <div className="flex items-center gap-3 border-b border-white/5 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold">
                <Landmark className="h-5 w-5 text-forest" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">Slå ihop lånen</p>
                <p className="text-[12px] text-slate-soft">
                  {loans.length} lån · {formatSEK(offer.totalBalance)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-dim"
              >
                <X className="h-4 w-4 text-slate-soft" strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
              <div className="flex flex-col gap-2">
                {loans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between rounded-2xl bg-cream-dim px-3 py-2.5"
                  >
                    <div>
                      <p className="text-[12.5px] font-medium text-ink">{loan.provider}</p>
                      <p className="text-[11px] text-slate-soft">
                        {loan.label} · {loan.interestRate}%
                      </p>
                    </div>
                    <p className="text-[12.5px] font-semibold text-ink">
                      {formatSEK(loan.balance)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-end justify-center gap-10 rounded-2xl bg-cream-dim px-4 py-5">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 rounded-t-lg bg-slate"
                    style={{ height: (offer.currentMonthlyTotal / maxPayment) * 96 }}
                  />
                  <span className="text-[10px] text-slate-soft">Idag</span>
                  <span className="text-[12px] font-semibold text-ink">
                    {formatSEK(offer.currentMonthlyTotal)}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 rounded-t-lg bg-gold"
                    style={{ height: (offer.newMonthlyPayment / maxPayment) * 96 }}
                  />
                  <span className="text-[10px] text-slate-soft">Ihopslaget</span>
                  <span className="text-[12px] font-semibold text-ink">
                    {formatSEK(offer.newMonthlyPayment)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-soft">
                {(offer.currentBlendedRate * 100).toFixed(1)}% blandad ränta idag → {(offer.newRate * 100).toFixed(1)}% ·
                5 års löptid
              </p>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  onMoveSavingsToChest(Math.round(offer.monthlySavings));
                  onClose();
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blush px-4 py-3 text-forest shadow-soft"
              >
                <PiggyBank className="h-4 w-4" strokeWidth={2} />
                <span className="text-[13px] font-semibold">
                  Flytta {formatSEK(offer.monthlySavings)}/mån till sparkistan
                </span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
