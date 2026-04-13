import { Transaction, TransactionFormData, AppSettings, Currency } from "@/types";
import { format, subDays, subMonths } from "date-fns";

// Storage keys
const TRANSACTIONS_KEY = "finance_transactions";
const SETTINGS_KEY = "finance_settings";

// Generate a simple unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Transactions CRUD
export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    return raw ? JSON.parse(raw) : getSeedData();
  } catch {
    return getSeedData();
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function addTransaction(data: TransactionFormData): Transaction {
  const transactions = getTransactions();
  const transaction: Transaction = {
    id: generateId(),
    amount: parseFloat(data.amount),
    category: data.category,
    date: data.date,
    description: data.description,
    type: data.type,
    createdAt: new Date().toISOString(),
  };
  transactions.unshift(transaction);
  saveTransactions(transactions);
  return transaction;
}

export function updateTransaction(
  id: string,
  data: TransactionFormData
): Transaction | null {
  const transactions = getTransactions();
  const idx = transactions.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const updated: Transaction = {
    ...transactions[idx],
    amount: parseFloat(data.amount),
    category: data.category,
    date: data.date,
    description: data.description,
    type: data.type,
  };
  transactions[idx] = updated;
  saveTransactions(transactions);
  return updated;
}

export function deleteTransaction(id: string): boolean {
  const transactions = getTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  if (filtered.length === transactions.length) return false;
  saveTransactions(filtered);
  return true;
}

// Settings
export function getSettings(): AppSettings {
  if (typeof window === "undefined") return { currency: "USD", theme: "system" };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { currency: "USD", theme: "system" };
  } catch {
    return { currency: "USD", theme: "system" };
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Currency formatting
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function formatCurrency(amount: number, currency: Currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency];
}

// Seed data for demo purposes
function getSeedData(): Transaction[] {
  const now = new Date();
  const transactions: Transaction[] = [
    {
      id: generateId(),
      amount: 4500,
      category: "salary",
      date: format(subDays(now, 2), "yyyy-MM-dd"),
      description: "Monthly salary",
      type: "income",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 85.5,
      category: "food",
      date: format(now, "yyyy-MM-dd"),
      description: "Grocery shopping",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 1200,
      category: "rent",
      date: format(subDays(now, 5), "yyyy-MM-dd"),
      description: "Monthly rent",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 45,
      category: "transport",
      date: format(subDays(now, 1), "yyyy-MM-dd"),
      description: "Uber rides",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 15.99,
      category: "entertainment",
      date: format(subDays(now, 3), "yyyy-MM-dd"),
      description: "Netflix subscription",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 120,
      category: "shopping",
      date: format(subDays(now, 4), "yyyy-MM-dd"),
      description: "Online shopping",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 350,
      category: "freelance",
      date: format(subDays(now, 6), "yyyy-MM-dd"),
      description: "Freelance project",
      type: "income",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 60,
      category: "health",
      date: format(subDays(now, 7), "yyyy-MM-dd"),
      description: "Gym membership",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 95,
      category: "utilities",
      date: format(subDays(now, 8), "yyyy-MM-dd"),
      description: "Electric bill",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 200,
      category: "investment",
      date: format(subDays(now, 10), "yyyy-MM-dd"),
      description: "Stock dividend",
      type: "income",
      createdAt: new Date().toISOString(),
    },
    // Previous month data
    {
      id: generateId(),
      amount: 4500,
      category: "salary",
      date: format(subMonths(now, 1), "yyyy-MM-dd"),
      description: "Monthly salary",
      type: "income",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 1200,
      category: "rent",
      date: format(subMonths(now, 1), "yyyy-MM-dd"),
      description: "Monthly rent",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 320,
      category: "food",
      date: format(subMonths(now, 1), "yyyy-MM-dd"),
      description: "Groceries for the month",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 75,
      category: "transport",
      date: format(subDays(subMonths(now, 1), 5), "yyyy-MM-dd"),
      description: "Fuel and parking",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 180,
      category: "shopping",
      date: format(subDays(subMonths(now, 1), 10), "yyyy-MM-dd"),
      description: "Clothing",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      amount: 500,
      category: "freelance",
      date: format(subDays(subMonths(now, 1), 15), "yyyy-MM-dd"),
      description: "Design project",
      type: "income",
      createdAt: new Date().toISOString(),
    },
  ];

  saveTransactions(transactions);
  return transactions;
}
