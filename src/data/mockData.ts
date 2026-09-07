import type {
  Category,
  ExternalLoan,
  MonthPlan,
  SavingsChest,
  Transaction,
} from "./types";

/**
 * All data in this module stands in for a spreadsheet-backed demo API.
 * Swap `mockData.ts` for a real fetch layer against the same shapes
 * (see data/adapter.ts) to point Anyday at a live backend later.
 */

export const monthPlan: MonthPlan = {
  monthLabel: "September",
  income: 32000,
  daysInMonth: 30,
  today: 16,
};

export const categories: Category[] = [
  {
    id: "boende",
    name: "Boende",
    group: "fixed",
    color: "forest",
    icon: "Home",
    flexibility: 0.03,
  },
  {
    id: "rakningar",
    name: "Räkningar & lån",
    group: "fixed",
    color: "navy",
    icon: "Landmark",
    flexibility: 0.08,
  },
  {
    id: "mat",
    name: "Mat & fika",
    group: "flowy",
    color: "plum",
    icon: "Coffee",
    flexibility: 0.45,
  },
  {
    id: "shopping",
    name: "Shopping",
    group: "flowy",
    color: "blush",
    icon: "ShoppingBag",
    flexibility: 0.75,
  },
  {
    id: "noje",
    name: "Nöje & resor",
    group: "flowy",
    color: "slate",
    icon: "Ticket",
    flexibility: 0.65,
  },
];

const day = (d: number) => `2026-09-${String(d).padStart(2, "0")}`;

export const transactions: Transaction[] = [
  { id: "t-salary", date: day(1), merchant: "Lön", amount: 32000, categoryId: "rakningar" },
  { id: "t1", date: day(1), merchant: "Hyra lägenhet", amount: -11500, categoryId: "boende" },
  { id: "t2", date: day(2), merchant: "Elräkning", amount: -890, categoryId: "rakningar" },
  { id: "t3", date: day(2), merchant: "ICA Maxi", amount: -612, categoryId: "mat" },
  { id: "t4", date: day(3), merchant: "Mobilabonnemang", amount: -349, categoryId: "rakningar" },
  { id: "t5", date: day(3), merchant: "Espresso House", amount: -59, categoryId: "mat" },
  { id: "t6", date: day(4), merchant: "SL Access", amount: -930, categoryId: "noje" },
  { id: "t7", date: day(4), merchant: "H&M", amount: -449, categoryId: "shopping" },
  { id: "t8", date: day(5), merchant: "Hemköp", amount: -388, categoryId: "mat" },
  { id: "t9", date: day(5), merchant: "Spotify", amount: -119, categoryId: "rakningar" },
  { id: "t10", date: day(6), merchant: "Foodora", amount: -245, categoryId: "mat" },
  { id: "t11", date: day(6), merchant: "Systembolaget", amount: -320, categoryId: "shopping" },
  { id: "t12", date: day(7), merchant: "Willys", amount: -540, categoryId: "mat" },
  { id: "t13", date: day(7), merchant: "Biocheck", amount: -260, categoryId: "noje" },
  { id: "t14", date: day(8), merchant: "Hemförsäkring", amount: -229, categoryId: "rakningar" },
  { id: "t15", date: day(8), merchant: "Café Pascal", amount: -78, categoryId: "mat" },
  { id: "t16", date: day(9), merchant: "Zalando", amount: -899, categoryId: "shopping" },
  { id: "t17", date: day(9), merchant: "ICA Maxi", amount: -455, categoryId: "mat" },
  { id: "t18", date: day(10), merchant: "Restaurang Nino", amount: -410, categoryId: "mat" },
  { id: "t19", date: day(10), merchant: "Circle K", amount: -650, categoryId: "noje" },
  { id: "t20", date: day(11), merchant: "Hemköp", amount: -302, categoryId: "mat" },
  { id: "t21", date: day(12), merchant: "CDON", amount: -599, categoryId: "shopping" },
  { id: "t22", date: day(12), merchant: "Espresso House", amount: -64, categoryId: "mat" },
  { id: "t23", date: day(13), merchant: "SATS", amount: -449, categoryId: "noje" },
  { id: "t24", date: day(13), merchant: "ICA Maxi", amount: -387, categoryId: "mat" },
  { id: "t25", date: day(14), merchant: "Lindex", amount: -329, categoryId: "shopping" },
  { id: "t26", date: day(14), merchant: "Sushi Yama", amount: -285, categoryId: "mat" },
  { id: "t27", date: day(15), merchant: "Hemköp", amount: -298, categoryId: "mat" },
  { id: "t28", date: day(15), merchant: "Steam", amount: -199, categoryId: "shopping" },
  { id: "t29", date: day(16), merchant: "Café Saturnus", amount: -69, categoryId: "mat" },
];

/** Fixed obligations still due before month end — known in advance, not yet charged. */
export const scheduledOutflows: Transaction[] = [
  { id: "s1", date: day(20), merchant: "Comfort Finans", amount: -1200, categoryId: "rakningar", loanId: "l1" },
  { id: "s2", date: day(24), merchant: "CarFin billån", amount: -2450, categoryId: "rakningar", loanId: "l2" },
  { id: "s3", date: day(27), merchant: "ShopNow delbetalning", amount: -400, categoryId: "rakningar", loanId: "l3" },
  { id: "s4", date: day(28), merchant: "Vattenfall", amount: -540, categoryId: "rakningar" },
];

export const externalLoans: ExternalLoan[] = [
  {
    id: "l1",
    provider: "Comfort Finans",
    label: "Snabblån",
    balance: 18400,
    monthlyPayment: 1200,
    interestRate: 24.9,
  },
  {
    id: "l2",
    provider: "CarFin",
    label: "Billån",
    balance: 62000,
    monthlyPayment: 2450,
    interestRate: 7.9,
  },
  {
    id: "l3",
    provider: "ShopNow",
    label: "Delbetalning",
    balance: 3200,
    monthlyPayment: 400,
    interestRate: 19.5,
  },
];

export const savingsChests: SavingsChest[] = [
  {
    id: "c1",
    purpose: "Resa till Åre",
    balance: 4200,
    target: 12000,
    locks: [true, false],
    createdAt: day(1),
  },
];
