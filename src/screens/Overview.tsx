import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Landmark } from "lucide-react";
import type { AnydayAdapter } from "../data/adapter";
import { formatSEK } from "../lib/money";
import { getIncome, getSpentSoFar, spendByCategory } from "../lib/finance";
import { NatureBackdrop } from "../components/NatureBackdrop";
import { GroupIsland } from "../components/GroupIsland";

export function Overview({
  adapter,
  chestTotal,
  onOpenChest,
}: {
  adapter: AnydayAdapter;
  chestTotal: number;
  onOpenChest: () => void;
}) {
  const income = getIncome(adapter);
  const spent = getSpentSoFar(adapter);
  const available = income - spent - chestTotal;
  const spend = spendByCategory(adapter);
  const fixed = spend.filter((s) => s.category.group === "fixed");
  const flowy = spend.filter((s) => s.category.group === "flowy");
  const fixedTotal = fixed.reduce((s, c) => s + c.spentSoFar, 0);
  const flowyTotal = flowy.reduce((s, c) => s + c.spentSoFar, 0);
  const { today, daysInMonth, monthLabel } = adapter.monthPlan;

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <div className="relative">
        <NatureBackdrop className="h-44 w-full" />
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-forest/70">
                {monthLabel} · dag {today} av {daysInMonth}
              </p>
              <h1 className="text-lg font-semibold text-forest">Hej Alex 👋</h1>
            </div>
            <button
              onClick={onOpenChest}
              className="rounded-full bg-forest/90 px-3 py-1.5 text-[11px] font-medium text-paper shadow-soft"
            >
              Sparkista · {formatSEK(chestTotal)}
            </button>
          </div>
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="rounded-2xl bg-paper/95 p-4 shadow-pop"
          >
            <p className="text-[11px] font-medium text-slate">
              Kvar att röra dig med just nu
            </p>
            <p className="text-2xl font-semibold text-ink">{formatSEK(available)}</p>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pt-4">
        <StatChip
          label="In hittills"
          value={formatSEK(income)}
          Icon={ArrowDownRight}
          tone="forest"
        />
        <StatChip
          label="Ut hittills"
          value={formatSEK(spent)}
          Icon={ArrowUpRight}
          tone="plum"
        />
      </div>

      <div className="flex flex-col gap-3 px-5 py-4">
        <GroupIsland
          title="Fast"
          hint="Samma varje månad — svårt att ändra på"
          items={fixed.map((s) => ({ category: s.category, amount: s.spentSoFar }))}
          total={fixedTotal}
        />
        <GroupIsland
          title="Flyt"
          hint="Varierar — här finns utrymme att styra"
          items={flowy.map((s) => ({ category: s.category, amount: s.spentSoFar }))}
          total={flowyTotal}
        />

        <div className="rounded-3xl bg-paper p-4 shadow-soft">
          <p className="mb-2 text-sm font-semibold text-ink">Lån hos andra</p>
          <div className="flex flex-col gap-2">
            {adapter.externalLoans.map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between rounded-2xl bg-cream-dim px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10">
                    <Landmark className="h-4 w-4 text-navy" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-medium text-ink">{loan.provider}</p>
                    <p className="text-[11px] text-slate">
                      {loan.label} · {loan.interestRate}% ränta
                    </p>
                  </div>
                </div>
                <p className="text-[12.5px] font-semibold text-ink">
                  {formatSEK(loan.balance)}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate">
            Anyfin kan hjälpa dig samla lånen till en lägre ränta — mer om det
            i nästa version.
          </p>
        </div>
      </div>
      <div className="h-2" />
    </div>
  );
}

function StatChip({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: string;
  Icon: typeof ArrowUpRight;
  tone: "forest" | "plum";
}) {
  const toneClasses =
    tone === "forest" ? "bg-forest/10 text-forest" : "bg-plum/10 text-plum";
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-paper p-3 shadow-soft">
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${toneClasses}`}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div>
        <p className="text-[11px] text-slate">{label}</p>
        <p className="text-[13px] font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
