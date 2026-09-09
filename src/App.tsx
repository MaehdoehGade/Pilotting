import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useMockAdapter } from "./data/adapter";
import type { SavingsChest, SpendGroup } from "./data/types";
import { getSpentSoFar, type SlashMap } from "./lib/finance";
import { BottomNav, type TabKey } from "./components/BottomNav";
import { CategoryDetailSheet } from "./components/CategoryDetailSheet";
import { GroupDetailSheet } from "./components/GroupDetailSheet";
import { MergeLoansSheet } from "./components/MergeLoansSheet";
import { NumbersToggle } from "./components/NumbersToggle";
import { Overview } from "./screens/Overview";
import { Simulate } from "./screens/Simulate";
import { Chest } from "./screens/Chest";

function loadShowFigures(): boolean {
  try {
    const stored = window.localStorage.getItem("everyday-show-figures");
    return stored === null ? true : stored === "1";
  } catch {
    return true;
  }
}

export default function App() {
  const adapter = useMockAdapter();
  const [tab, setTab] = useState<TabKey>("overview");
  const [chests, setChests] = useState<SavingsChest[]>(adapter.savingsChests);
  const [slashed, setSlashed] = useState<SlashMap>({});
  const [toast, setToast] = useState<string | null>(null);
  const [showFigures, setShowFigures] = useState(loadShowFigures);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<SpendGroup | null>(null);
  const [mergeOpen, setMergeOpen] = useState(false);

  function toggleFigures() {
    setShowFigures((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem("everyday-show-figures", next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }

  const chestTotal = useMemo(
    () => chests.reduce((sum, c) => sum + c.balance, 0),
    [chests],
  );

  const avgDailySpend = getSpentSoFar(adapter) / adapter.monthPlan.today;

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
    setSlashed({});
    showToast(`+${Math.round(amount)} kr`);
  }

  function toggleSlash(categoryId: string, instanceId: string) {
    setSlashed((prev) => {
      const current = new Set(prev[categoryId] ?? []);
      if (current.has(instanceId)) {
        current.delete(instanceId);
      } else {
        current.add(instanceId);
      }
      return { ...prev, [categoryId]: current };
    });
  }

  function addMoney(chestId: string, amount: number) {
    setChests((prev) =>
      prev.map((c) => (c.id === chestId ? { ...c, balance: c.balance + amount } : c)),
    );
    showToast(`+${amount} kr`);
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
    <div className="flex min-h-[100dvh] items-center justify-center bg-navy-2 sm:p-6">
      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-ink sm:h-[880px] sm:rounded-[44px] sm:shadow-pop sm:ring-1 sm:ring-white/10">
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
                  onSelectGroup={setOpenGroup}
                  showFigures={showFigures}
                />
              )}
              {tab === "simulate" && (
                <Simulate
                  adapter={adapter}
                  chestTotal={chestTotal}
                  slashed={slashed}
                  onToggleSlash={toggleSlash}
                  onMoveToChest={moveToChest}
                  onSelectGroup={setOpenGroup}
                  onSelectCategory={setSelectedCategoryId}
                  onOpenChest={() => setTab("chest")}
                  showFigures={showFigures}
                />
              )}
              {tab === "chest" && (
                <Chest
                  chests={chests}
                  avgDailySpend={avgDailySpend}
                  showFigures={showFigures}
                  onAddMoney={addMoney}
                  onToggleLock={toggleLock}
                  onCreateChest={createChest}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute left-5 top-8 z-20">
            <NumbersToggle on={showFigures} onChange={toggleFigures} />
          </div>

          <GroupDetailSheet
            adapter={adapter}
            group={openGroup}
            onClose={() => setOpenGroup(null)}
            onSelectCategory={(id) => {
              setOpenGroup(null);
              setSelectedCategoryId(id);
            }}
            onOpenMerge={() => {
              setOpenGroup(null);
              setMergeOpen(true);
            }}
          />

          <CategoryDetailSheet
            adapter={adapter}
            categoryId={selectedCategoryId}
            onClose={() => setSelectedCategoryId(null)}
          />

          <MergeLoansSheet
            loans={adapter.externalLoans}
            open={mergeOpen}
            onClose={() => setMergeOpen(false)}
            onMoveSavingsToChest={moveToChest}
          />

          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="pointer-events-none absolute bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-full bg-signal px-4 py-2 font-mono text-[12px] font-medium text-ink shadow-pop"
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
