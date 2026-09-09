import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, Plus, Sparkles, Unlock, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SavingsChest } from "../data/types";
import { celebrate } from "../lib/celebrate";
import { formatSEK } from "../lib/money";
import { scaleSizes } from "../lib/scale";

/** Quick-add options as "days of your own spending, skipped" — 1 / 3 / 7 —
 * so the three sizes are an honest ratio (1x, 3x, 7x), not arbitrary. */
const DAY_MULTIPLES = [1, 3, 7];

export function Chest({
  chests,
  avgDailySpend,
  showFigures,
  onAddMoney,
  onToggleLock,
  onCreateChest,
}: {
  chests: SavingsChest[];
  avgDailySpend: number;
  showFigures: boolean;
  onAddMoney: (chestId: string, amount: number) => void;
  onToggleLock: (chestId: string, lockIndex: 0 | 1) => void;
  onCreateChest: (purpose: string, target: number | null) => void;
}) {
  const [creating, setCreating] = useState(false);
  const total = chests.reduce((s, c) => s + c.balance, 0);

  const quickAmounts = DAY_MULTIPLES.map(
    (d) => Math.max(50, Math.round((avgDailySpend * d) / 50) * 50),
  );
  const quickSizes = scaleSizes(quickAmounts, 26, 88);

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center px-5 pb-2 pt-8">
        <h1 className="font-mono text-3xl font-semibold text-paper">{formatSEK(total)}</h1>
      </div>

      <div className="flex flex-col gap-4 px-5 py-3">
        {chests.map((chest) => (
          <ChestCard
            key={chest.id}
            chest={chest}
            quickAmounts={quickAmounts}
            quickSizes={quickSizes}
            showFigures={showFigures}
            onAddMoney={(amount) => onAddMoney(chest.id, amount)}
            onToggleLock={(i) => onToggleLock(chest.id, i)}
          />
        ))}

        {creating ? (
          <NewChestForm
            onCancel={() => setCreating(false)}
            onCreate={(purpose, target) => {
              onCreateChest(purpose, target);
              setCreating(false);
            }}
          />
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center justify-center rounded-3xl border-2 border-dashed border-line py-5"
          >
            <Plus className="h-5 w-5 text-aluminum" strokeWidth={2} />
          </button>
        )}
      </div>
      <div className="h-2" />
    </div>
  );
}

function ChestCard({
  chest,
  quickAmounts,
  quickSizes,
  showFigures,
  onAddMoney,
  onToggleLock,
}: {
  chest: SavingsChest;
  quickAmounts: number[];
  quickSizes: number[];
  showFigures: boolean;
  onAddMoney: (amount: number) => void;
  onToggleLock: (index: 0 | 1) => void;
}) {
  const lockCount = chest.locks.filter(Boolean).length;
  const progress = chest.target ? Math.min(chest.balance / chest.target, 1) : null;

  const lidY = lockCount === 2 ? 0 : lockCount === 1 ? -5 : -13;
  const lidRotate = lockCount === 2 ? 0 : lockCount === 1 ? -4 : -10;
  const badgeRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (lockCount === 2) celebrate(badgeRef.current);
  }, [lockCount]);

  return (
    <div className="celebrate-anchor rounded-3xl bg-navy p-4 shadow-soft">
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          <svg viewBox="0 0 80 80" className="h-20 w-20">
            <rect x="10" y="38" width="60" height="30" rx="8" fill="#1b2747" />
            <rect x="10" y="38" width="60" height="8" rx="4" fill="#26355c" />
            <motion.g
              animate={{ y: lidY, rotate: lidRotate }}
              transition={{ type: "spring", stiffness: 320, damping: 14 }}
              style={{ transformOrigin: "14px 38px" }}
            >
              <rect x="10" y="22" width="60" height="18" rx="9" fill="#131c36" />
              <circle cx="40" cy="31" r="5" fill="#8d96ac" />
            </motion.g>
          </svg>
          <AnimatePresence>
            {lockCount === 2 && (
              <motion.div
                ref={badgeRef}
                initial={{ scale: 0, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 12 }}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-signal text-ink"
              >
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-aluminum">{chest.purpose}</p>
          <p className="font-mono text-xl font-semibold text-paper">{formatSEK(chest.balance)}</p>
          {chest.target && (
            <>
              <div className="relative mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-navy-2">
                <motion.div
                  className="h-full rounded-full bg-signal"
                  animate={{ width: `${(progress ?? 0) * 100}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 26 }}
                />
                <div className="absolute right-0 top-1/2 h-2.5 w-0.5 -translate-y-1/2 bg-white/30" />
              </div>
              {showFigures && (
                <p className="mt-1 font-mono text-[10.5px] text-aluminum">mål {formatSEK(chest.target)}</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {[0, 1].map((i) => {
          const locked = chest.locks[i as 0 | 1];
          return (
            <button
              key={i}
              onClick={() => onToggleLock(i as 0 | 1)}
              className={`flex items-center justify-center rounded-xl py-2.5 ${
                locked ? "bg-navy-2 text-paper" : "bg-navy-2/50 text-aluminum"
              }`}
            >
              {locked ? (
                <Lock className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Unlock className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
          );
        })}
      </div>

      <div
        className="mt-3 flex items-end justify-center gap-4"
        style={{ height: Math.max(...quickSizes) + (showFigures ? 24 : 8) }}
      >
        {quickAmounts.map((amount, i) => (
          <button
            key={amount}
            onClick={(e) => {
              celebrate(e.currentTarget);
              onAddMoney(amount);
            }}
            className="flex flex-1 flex-col items-center justify-end gap-1"
          >
            {showFigures && (
              <span className="font-mono text-[10px] font-medium text-aluminum">
                +{formatSEK(amount)}
              </span>
            )}
            <motion.div
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              style={{ width: quickSizes[i], height: quickSizes[i] }}
              className="rounded-full bg-navy-2"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function NewChestForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (purpose: string, target: number | null) => void;
}) {
  const [purpose, setPurpose] = useState("");
  const [target, setTarget] = useState("");

  return (
    <motion.form
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className="celebrate-anchor flex flex-col gap-2.5 rounded-3xl bg-navy p-4 shadow-soft"
      onSubmit={(e) => {
        e.preventDefault();
        if (!purpose.trim()) return;
        celebrate(e.currentTarget);
        onCreate(purpose.trim(), target ? Number(target) : null);
      }}
    >
      <input
        autoFocus
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="Vad sparar du till?"
        className="rounded-xl bg-navy-2 px-3 py-2.5 text-[13px] text-paper outline-none placeholder:text-aluminum"
      />
      <input
        value={target}
        onChange={(e) => setTarget(e.target.value.replace(/\D/g, ""))}
        placeholder="Mål (valfritt)"
        inputMode="numeric"
        className="rounded-xl bg-navy-2 px-3 py-2.5 text-[13px] text-paper outline-none placeholder:text-aluminum"
      />
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex flex-1 items-center justify-center rounded-xl bg-navy-2 py-2.5 text-aluminum"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          type="submit"
          className="flex flex-1 items-center justify-center rounded-xl bg-signal py-2.5 text-ink"
        >
          <Check className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </motion.form>
  );
}
