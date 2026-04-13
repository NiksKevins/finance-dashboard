import {
  Transaction,
  MonthlySummary,
  CategorySummary,
  DailySpending,
  CategoryId,
} from "@/types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
  subMonths,
} from "date-fns";

export function getMonthKey(date: Date): string {
  return format(date, "yyyy-MM");
}

export function getMonthlySummaries(
  transactions: Transaction[],
  monthsBack = 6
): MonthlySummary[] {
  const summaries: MonthlySummary[] = [];
  const now = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const key = getMonthKey(monthDate);
    const monthTxns = transactions.filter(
      (t) => t.date.startsWith(key)
    );

    const income = monthTxns
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTxns
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    summaries.push({
      month: key,
      income,
      expenses,
      balance: income - expenses,
    });
  }

  return summaries;
}

export function getCurrentMonthSummary(transactions: Transaction[]): {
  income: number;
  expenses: number;
  balance: number;
} {
  const key = getMonthKey(new Date());
  const txns = transactions.filter((t) => t.date.startsWith(key));
  const income = txns
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = txns
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function getPreviousMonthSummary(transactions: Transaction[]): {
  income: number;
  expenses: number;
  balance: number;
} {
  const key = getMonthKey(subMonths(new Date(), 1));
  const txns = transactions.filter((t) => t.date.startsWith(key));
  const income = txns
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = txns
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function getCategorySummaries(
  transactions: Transaction[],
  month?: string
): CategorySummary[] {
  const filtered = month
    ? transactions.filter((t) => t.type === "expense" && t.date.startsWith(month))
    : transactions.filter((t) => t.type === "expense");

  const totals = new Map<CategoryId, number>();
  const counts = new Map<CategoryId, number>();

  for (const t of filtered) {
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
    counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
  }

  const totalAll = Array.from(totals.values()).reduce((a, b) => a + b, 0);

  return Array.from(totals.entries())
    .map(([category, total]) => ({
      category,
      total,
      count: counts.get(category) ?? 0,
      percentage: totalAll > 0 ? (total / totalAll) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function getDailySpending(
  transactions: Transaction[],
  month?: string
): DailySpending[] {
  const now = new Date();
  const targetMonth = month ? parseISO(`${month}-01`) : now;
  const start = startOfMonth(targetMonth);
  const end = endOfMonth(targetMonth);

  const days = eachDayOfInterval({ start, end });

  return days.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const amount = transactions
      .filter((t) => t.type === "expense" && t.date === key)
      .reduce((sum, t) => sum + t.amount, 0);
    return { date: key, amount };
  });
}

export function getTotalBalance(transactions: Transaction[]): number {
  return transactions.reduce(
    (sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount),
    0
  );
}

export function getAverageDailySpending(
  transactions: Transaction[],
  month?: string
): number {
  const key = month ?? getMonthKey(new Date());
  const txns = transactions.filter(
    (t) => t.type === "expense" && t.date.startsWith(key)
  );
  const total = txns.reduce((sum, t) => sum + t.amount, 0);
  const now = new Date();
  const daysInMonth =
    key === getMonthKey(now)
      ? now.getDate()
      : endOfMonth(parseISO(`${key}-01`)).getDate();
  return daysInMonth > 0 ? total / daysInMonth : 0;
}

export function getPercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
