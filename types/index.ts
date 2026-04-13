export type TransactionType = "income" | "expense";

export type CategoryId =
  | "food"
  | "transport"
  | "rent"
  | "entertainment"
  | "shopping"
  | "health"
  | "utilities"
  | "salary"
  | "freelance"
  | "investment"
  | "other";

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  type: TransactionType | "both";
}

export interface Transaction {
  id: string;
  amount: number;
  category: CategoryId;
  date: string; // ISO string
  description: string;
  type: TransactionType;
  createdAt: string;
}

export interface TransactionFormData {
  amount: string;
  category: CategoryId;
  date: string;
  description: string;
  type: TransactionType;
}

export interface MonthlySummary {
  month: string; // "YYYY-MM"
  income: number;
  expenses: number;
  balance: number;
}

export interface CategorySummary {
  category: CategoryId;
  total: number;
  count: number;
  percentage: number;
}

export interface DailySpending {
  date: string; // "YYYY-MM-DD"
  amount: number;
}

export type Currency = "USD" | "EUR" | "GBP";

export interface AppSettings {
  currency: Currency;
  theme: "light" | "dark" | "system";
}
