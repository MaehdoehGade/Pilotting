import { AnimatePresence, motion } from "framer-motion";
import { Lock, Plus, Sparkles, Unlock } from "lucide-react";
import { useState } from "react";
import type { SavingsChest } from "../data/types";
import { formatSEK } from "../lib/money";

const QUICK_AMOUNTS = [100, 500, 1000];

export function Chest({
  chests,
  onAddMoney,
  onToggleLock,
  onCreateChest,
}: {
  chests: SavingsChest[];
  onAddMoney: (chestId: string, amount: number) => void;
  onToggleLock: (chestId: string, lockIndex: 0 | 1) => void;
  onCreateChest: (purpose: string, target: number | null) => void;
}) {
  const [creating, setCreating] = useState(false);
  const total = chests.reduce((s, c) => s + c.balance, 0);

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <div className="px-5 pb-2 pt-5">
        <p className="text-xs font-medium text-slate">Totalt sparat</p>
        <h1 className="text-2xl font-semibold text-ink">{formatSEK(total)}</h1>
      </div>

      <div className="flex flex-col gap-4 px-5 py-3">
        {chests.map((chest) => (
          <ChestCard
            key={chest.id}
            chest={chest}
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
            className="flex items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-soft/60 py-4 text-[13px] font-medium text-slate"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Ny sparkista med eget syfte
          </button>
        )}

        <div className="rounded-3xl bg-navy/5 p-4">
          <p className="text-[12px] leading-relaxed text-navy">
            <span className="font-semibold">Tips:</span> dubbellås gör det svårare
            att tumma på sparandet mitt i månaden — lås upp båda bara när du
            verkligen ska använda pengarna.
          </p>
        </div>
      </div>
      <div className="h-2" />
    </div>
  );
}

function ChestCard({
  chest,
  onAddMoney,
  onToggleLock,
}: {
  chest: SavingsChest;
  onAddMoney: (amount: number) => void;
  onToggleLock: (index: 0 | 1) => void;
}) {
  const lockCount = chest.locks.filter(Boolean).length;
  const progress = chest.target ? Math.min(chest.balance / chest.target, 1) : null;

  const lidY = lockCount === 2 ? 0 : lockCount === 1 ? -5 : -13;
  const lidRotate = lockCount === 2 ? 0 : lockCount === 1 ? -4 : -10;

  const status =
    lockCount === 2
      ? "Dubbellåst — skyddad hela månaden"
      : lockCount === 1
        ? "Halvlåst — tänk efter innan uttag"
        : "Olåst — fritt att ta ut";

  return (
    <div className="rounded-3xl bg-paper p-4 shadow-soft">
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          <svg viewBox="0 0 80 80" className="h-20 w-20">
            <rect x="10" y="38" width="60" height="30" rx="8" fill="#706688" />
            <rect x="10" y="38" width="60" height="8" rx="4" fill="#8d81a3" />
            <motion.g
              animate={{ y: lidY, rotate: lidRotate }}
              transition={{ type: "spring", stiffness: 320, damping: 14 }}
              style={{ transformOrigin: "14px 38px" }}
            >
              <rect x="10" y="22" width="60" height="18" rx="9" fill="#3a486d" />
              <circle cx="40" cy="31" r="5" fill="#dccbd4" />
            </motion.g>
          </svg>
          <AnimatePresence>
            {lockCount === 2 && (
              <motion.div
                initial={{ scale: 0, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 12 }}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-forest text-paper"
              >
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-ink">{chest.purpose}</p>
          <p className="text-lg font-semibold text-ink">{formatSEK(chest.balance)}</p>
          {chest.target && (
            <>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cream-dim">
                <motion.div
                  className="h-full rounded-full bg-plum"
                  animate={{ width: `${(progress ?? 0) * 100}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 26 }}
                />
              </div>
              <p className="mt-0.5 text-[11px] text-slate">mål {formatSEK(chest.target)}</p>
            </>
          )}
        </div>
      </div>

      <p className="mt-3 text-[11.5px] font-medium text-slate">{status}</p>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {[0, 1].map((i) => {
          const locked = chest.locks[i as 0 | 1];
          return (
            <button
              key={i}
              onClick={() => onToggleLock(i as 0 | 1)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-medium ${
                locked ? "bg-forest text-paper" : "bg-cream-dim text-slate"
              }`}
            >
              {locked ? (
                <Lock className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Unlock className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              Lås {i + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex gap-2">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => onAddMoney(amount)}
            className="flex-1 rounded-xl bg-blush/40 py-2 text-[12px] font-semibold text-forest"
          >
            +{amount}
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
      className="flex flex-col gap-2.5 rounded-3xl bg-paper p-4 shadow-soft"
      onSubmit={(e) => {
        e.preventDefault();
        if (!purpose.trim()) return;
        onCreate(purpose.trim(), target ? Number(target) : null);
      }}
    >
      <p className="text-[13px] font-semibold text-ink">Vad sparar du till?</p>
      <input
        autoFocus
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="T.ex. Resa till Åre"
        className="rounded-xl bg-cream-dim px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-slate-soft"
      />
      <input
        value={target}
        onChange={(e) => setTarget(e.target.value.replace(/\D/g, ""))}
        placeholder="Målbelopp (valfritt)"
        inputMode="numeric"
        className="rounded-xl bg-cream-dim px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-slate-soft"
      />
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl bg-cream-dim py-2.5 text-[13px] font-medium text-slate"
        >
          Avbryt
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-forest py-2.5 text-[13px] font-semibold text-paper"
        >
          Skapa
        </button>
      </div>
    </motion.form>
  );
}
