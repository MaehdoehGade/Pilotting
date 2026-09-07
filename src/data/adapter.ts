import {
  categories,
  externalLoans,
  monthPlan,
  savingsChests,
  scheduledOutflows,
  transactions,
} from "./mockData";
import type {
  Category,
  ExternalLoan,
  MonthPlan,
  SavingsChest,
  Transaction,
} from "./types";

/**
 * Everything the UI needs, in one shape. `useMockAdapter` below serves it
 * from local fixtures; a future `useSheetsAdapter` (reading a Google Sheet
 * of transactions/loans/chests) can implement the same interface without
 * touching a single screen.
 */
export interface AnydayAdapter {
  monthPlan: MonthPlan;
  categories: Category[];
  transactions: Transaction[];
  scheduledOutflows: Transaction[];
  externalLoans: ExternalLoan[];
  savingsChests: SavingsChest[];
}

export function useMockAdapter(): AnydayAdapter {
  return {
    monthPlan,
    categories,
    transactions,
    scheduledOutflows,
    externalLoans,
    savingsChests,
  };
}
