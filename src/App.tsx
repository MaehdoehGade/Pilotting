import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useMockAdapter } from "./data/adapter";
import type { SavingsChest } from "./data/types";
import { BottomNav, type TabKey } from "./components/BottomNav";
import { Overview } from "./screens/Overview";
import { Simulate } from "./screens/Simulate";
import { Chest } from "./screens/Chest";

export default function App() {
  const adapter = useMockAdapter();
  const [tab, setTab] = useState<TabKey>("overview");
  const [chests, setChests] = useState<SavingsChest[]>(adapter.savingsChests);
  const [cutSteps, setCutSteps] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);

  const chestTotal = useMemo(
    () => chests.reduce((sum, c) => sum + c.balance, 0),
    [chests],
  );

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function moveToChest(amount: number) {
    if (amount <= 0) return;
    setChests((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: `c-${Date.now()}`,
            purpose: "Frigjort sparande",
            balance: amount,
            target: null,
            locks: [false, false],
            createdAt: new Date().toISOString().slice(0, 10),
          },
        ];
      }
      return prev.map((c, i) => (i === 0 ? { ...c, balance: c.balance + amount } : c));
    });
    setCutSteps({});
    showToast(`${Math.round(amount)} kr flyttat till sparkistan`);
  }

  function addMoney(chestId: string, amount: number) {
    setChests((prev) =>
      prev.map((c) => (c.id === chestId ? { ...c, balance: c.balance + amount } : c)),
    );
    showToast(`${amount} kr tillagt`);
  }

  function toggleLock(chestId: string, lockIndex: 0 | 1) {
    setChests((prev) =>
      prev.map((c) => {
        if (c.id !== chestId) return c;
        const locks: [boolean, boolean] = [...c.locks];
        locks[lockIndex] = !locks[lockIndex];
        return { ...c, locks };
      }),
    );
  }

  function createChest(purpose: string, target: number | null) {
    setChests((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        purpose,
        balance: 0,
        target,
        locks: [false, false],
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-cream-dim sm:p-6">
      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-cream sm:h-[880px] sm:rounded-[44px] sm:shadow-pop sm:ring-1 sm:ring-black/5">
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -6 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="absolute inset-0"
            >
              {tab === "overview" && (
                <Overview
                  adapter={adapter}
                  chestTotal={chestTotal}
                  onOpenChest={() => setTab("chest")}
                />
              )}
              {tab === "simulate" && (
                <Simulate
                  adapter={adapter}
                  cutSteps={cutSteps}
                  onCutStepChange={(id, step) =>
                    setCutSteps((prev) => ({ ...prev, [id]: step }))
                  }
                  onMoveToChest={moveToChest}
                />
              )}
              {tab === "chest" && (
                <Chest
                  chests={chests}
                  onAddMoney={addMoney}
                  onToggleLock={toggleLock}
                  onCreateChest={createChest}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-forest px-4 py-2 text-[12px] font-medium text-paper shadow-pop"
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BottomNav active={tab} onChange={setTab} />
      </div>
    </div>
  );
}
