import type { AnydayAdapter } from "../data/adapter";
import type { Category, ExternalLoan } from "../data/types";

export interface CategorySpend {
  category: Category;
  spentSoFar: number;
}

export function getIncome(adapter: AnydayAdapter): number {
  return adapter.transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getSpentSoFar(adapter: AnydayAdapter): number {
  return -adapter.transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function spendByCategory(adapter: AnydayAdapter): CategorySpend[] {
  return adapter.categories.map((category) => {
    const spentSoFar = -adapter.transactions
      .filter((t) => t.categoryId === category.id && t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);
    return { category, spentSoFar };
  });
}

export function scheduledByCategory(
  adapter: AnydayAdapter,
  categoryId: string,
): number {
  return -adapter.scheduledOutflows
    .filter((t) => t.categoryId === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * One future, not-yet-happened purchase the simulator expects in this
 * category, extrapolated from this month's own pace and typical amounts —
 * e.g. "you've been to the café 5 times, at this rate expect ~4 more."
 * Each one is what the Simulate screen lets you individually slash.
 */
export interface ProjectedInstance {
  id: string;
  merchant: string;
  amount: number;
  dayOffset: number; // days from today this purchase is expected
}

export function getProjectedInstances(
  adapter: AnydayAdapter,
  categoryId: string,
): ProjectedInstance[] {
  const { today, daysInMonth } = adapter.monthPlan;
  const daysElapsed = Math.max(today, 1);
  const daysRemaining = Math.max(daysInMonth - today, 0);
  const past = adapter.transactions.filter(
    (t) => t.categoryId === categoryId && t.amount < 0,
  );
  if (past.length === 0 || daysRemaining === 0) return [];

  const pace = past.length / daysElapsed;
  const count = Math.round(pace * daysRemaining);

  return Array.from({ length: count }, (_, i) => {
    const source = past[i % past.length];
    const dayOffset = Math.max(1, Math.round(((i + 1) / count) * daysRemaining));
    return {
      id: `${categoryId}-proj-${i}`,
      merchant: source.merchant,
      amount: -source.amount,
      dayOffset,
    };
  });
}

/** categoryId -> set of projected instance ids the user has committed to skipping. */
export type SlashMap = Record<string, Set<string>>;

export interface CategoryProjection {
  category: Category;
  spentSoFar: number;
  instances: ProjectedInstance[];
  keptInstances: ProjectedInstance[];
  slashedInstances: ProjectedInstance[];
  projectedRemaining: number;
  projectedTotal: number;
  savedBySlash: number;
}

export interface MonthProjection {
  perCategory: CategoryProjection[];
  daysElapsed: number;
  daysRemaining: number;
  income: number;
  spentSoFar: number;
  projectedTotalOut: number;
  projectedEndBalance: number;
  totalSavedBySlash: number;
}

export function computeProjection(
  adapter: AnydayAdapter,
  slashed: SlashMap = {},
): MonthProjection {
  const { today, daysInMonth } = adapter.monthPlan;
  const daysElapsed = Math.max(today, 1);
  const daysRemaining = Math.max(daysInMonth - today, 0);
  const income = getIncome(adapter);
  const spend = spendByCategory(adapter);

  const perCategory: CategoryProjection[] = spend.map(({ category, spentSoFar }) => {
    if (category.group === "fixed") {
      const scheduled = scheduledByCategory(adapter, category.id);
      return {
        category,
        spentSoFar,
        instances: [],
        keptInstances: [],
        slashedInstances: [],
        projectedRemaining: scheduled,
        projectedTotal: spentSoFar + scheduled,
        savedBySlash: 0,
      };
    }

    const instances = getProjectedInstances(adapter, category.id);
    const slashedIds = slashed[category.id] ?? new Set<string>();
    const keptInstances = instances.filter((i) => !slashedIds.has(i.id));
    const slashedInstances = instances.filter((i) => slashedIds.has(i.id));
    const projectedRemaining = keptInstances.reduce((s, i) => s + i.amount, 0);
    const savedBySlash = slashedInstances.reduce((s, i) => s + i.amount, 0);

    return {
      category,
      spentSoFar,
      instances,
      keptInstances,
      slashedInstances,
      projectedRemaining,
      projectedTotal: spentSoFar + projectedRemaining,
      savedBySlash,
    };
  });

  const spentSoFar = getSpentSoFar(adapter);
  const projectedTotalOut = perCategory.reduce((sum, c) => sum + c.projectedTotal, 0);
  const totalSavedBySlash = perCategory.reduce((sum, c) => sum + c.savedBySlash, 0);

  return {
    perCategory,
    daysElapsed,
    daysRemaining,
    income,
    spentSoFar,
    projectedTotalOut,
    projectedEndBalance: income - projectedTotalOut,
    totalSavedBySlash,
  };
}

export interface MergeOffer {
  totalBalance: number;
  currentMonthlyTotal: number;
  currentBlendedRate: number;
  newRate: number;
  newMonthlyPayment: number;
  monthlySavings: number;
}

/** Illustrative consolidation offer: same total balance, one loan, a lower
 * blended rate over a 5-year term — the standard amortization formula. */
export function computeMergeOffer(loans: ExternalLoan[], newRate = 0.089, termMonths = 60): MergeOffer {
  const totalBalance = loans.reduce((s, l) => s + l.balance, 0);
  const currentMonthlyTotal = loans.reduce((s, l) => s + l.monthlyPayment, 0);
  const currentBlendedRate =
    loans.reduce((s, l) => s + l.balance * l.interestRate, 0) / totalBalance / 100;

  const r = newRate / 12;
  const factor = Math.pow(1 + r, termMonths);
  const newMonthlyPayment = (totalBalance * r * factor) / (factor - 1);

  return {
    totalBalance,
    currentMonthlyTotal,
    currentBlendedRate,
    newRate,
    newMonthlyPayment,
    monthlySavings: currentMonthlyTotal - newMonthlyPayment,
  };
}
