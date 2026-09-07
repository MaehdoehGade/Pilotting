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

/** cuts: categoryId -> fraction (0..1) of the *remaining, projectable* flowy spend to cut. */
export type CutMap = Record<string, number>;

export interface CategoryProjection {
  category: Category;
  spentSoFar: number;
  dailyAverage: number;
  projectedRemaining: number;
  projectedTotal: number;
  savedByCut: number;
}

export interface MonthProjection {
  perCategory: CategoryProjection[];
  daysElapsed: number;
  daysRemaining: number;
  income: number;
  spentSoFar: number;
  projectedTotalOut: number;
  projectedEndBalance: number;
  totalSavedByCuts: number;
}

export function computeProjection(
  adapter: AnydayAdapter,
  cuts: CutMap = {},
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
        dailyAverage: 0,
        projectedRemaining: scheduled,
        projectedTotal: spentSoFar + scheduled,
        savedByCut: 0,
      };
    }
    const dailyAverage = spentSoFar / daysElapsed;
    const uncutRemaining = dailyAverage * daysRemaining;
    const cutPct = Math.min(Math.max(cuts[category.id] ?? 0, 0), 1);
    const projectedRemaining = uncutRemaining * (1 - cutPct);
    return {
      category,
      spentSoFar,
      dailyAverage,
      projectedRemaining,
      projectedTotal: spentSoFar + projectedRemaining,
      savedByCut: uncutRemaining * cutPct,
    };
  });

  const spentSoFar = getSpentSoFar(adapter);
  const projectedTotalOut = perCategory.reduce((sum, c) => sum + c.projectedTotal, 0);
  const totalSavedByCuts = perCategory.reduce((sum, c) => sum + c.savedByCut, 0);

  return {
    perCategory,
    daysElapsed,
    daysRemaining,
    income,
    spentSoFar,
    projectedTotalOut,
    projectedEndBalance: income - projectedTotalOut,
    totalSavedByCuts,
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
