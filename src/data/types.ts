export type SpendGroup = "fixed" | "flowy";

export interface Category {
  id: string;
  name: string;
  group: SpendGroup;
  color: "forest" | "navy" | "plum" | "slate" | "blush";
  icon: string; // lucide-react icon name
  /** How easily this category can be cut in simulation mode, 0..1 */
  flexibility: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO date
  merchant: string;
  amount: number; // negative = outflow, positive = inflow
  categoryId: string;
}

export interface ExternalLoan {
  id: string;
  provider: string;
  label: string;
  balance: number;
  monthlyPayment: number;
  interestRate: number; // annual %
}

export interface SavingsChest {
  id: string;
  purpose: string;
  balance: number;
  target: number | null;
  locks: [boolean, boolean];
  createdAt: string;
}

export interface MonthPlan {
  monthLabel: string;
  income: number;
  daysInMonth: number;
  today: number; // day-of-month "now" is anchored to, for the demo
}
