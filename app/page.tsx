"use client";

import { useMemo, useState } from "react";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/DashboardCard";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { CategoryDonutChart } from "@/components/charts/CategoryDonutChart";
import { useTransactions } from "@/hooks/useTransactions";
import { useSettings } from "@/hooks/useSettings";
import {
  getCurrentMonthSummary,
  getPreviousMonthSummary,
  getMonthlySummaries,
  getCategorySummaries,
  getTotalBalance,
  getPercentageChange,
  getMonthKey,
} from "@/lib/analytics";
import { formatCurrency } from "@/lib/data";
import { Transaction, TransactionFormData } from "@/types";

export default function OverviewPage() {
  const { transactions, loading, add, update, remove } = useTransactions();
  const { settings } = useSettings();
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);

  const current = useMemo(() => getCurrentMonthSummary(transactions), [transactions]);
  const previous = useMemo(() => getPreviousMonthSummary(transactions), [transactions]);
  const monthlySummaries = useMemo(
    () => getMonthlySummaries(transactions, 6),
    [transactions]
  );
  const catSummaries = useMemo(
    () => getCategorySummaries(transactions, getMonthKey(new Date())),
    [transactions]
  );
  const totalBalance = useMemo(() => getTotalBalance(transactions), [transactions]);

  const expenseChange = getPercentageChange(current.expenses, previous.expenses);
  const incomeChange = getPercentageChange(current.income, previous.income);
  const balanceChange = getPercentageChange(current.balance, previous.balance);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 8),
    [transactions]
  );

  function handleEdit(id: string, data: TransactionFormData) {
    update(id, data);
    setEditTxn(null);
  }

  return (
    <div className="p-5 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your financial summary for this month
          </p>
        </div>
        <AddTransactionDialog
          onAdd={add}
          editTransaction={editTxn}
          onEdit={handleEdit}
          onEditClose={() => setEditTxn(null)}
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Balance"
          value={formatCurrency(totalBalance, settings.currency)}
          change={balanceChange}
          changeLabel="vs last month"
          icon={<Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/50"
          loading={loading}
          accent="blue"
        />
        <DashboardCard
          title="Income"
          value={formatCurrency(current.income, settings.currency)}
          change={incomeChange}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
          loading={loading}
          accent="green"
        />
        <DashboardCard
          title="Expenses"
          value={formatCurrency(current.expenses, settings.currency)}
          change={expenseChange}
          changeLabel="vs last month"
          icon={<TrendingDown className="h-5 w-5 text-red-500 dark:text-red-400" />}
          iconBg="bg-red-50 dark:bg-red-950/50"
          loading={loading}
          accent="red"
        />
        <DashboardCard
          title="Net Savings"
          value={formatCurrency(current.balance, settings.currency)}
          subtitle="This month"
          icon={<DollarSign className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
          iconBg="bg-violet-50 dark:bg-violet-950/50"
          loading={loading}
          accent="purple"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : (
              <MonthlyBarChart
                data={monthlySummaries}
                currency={settings.currency}
              />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold">
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : (
              <CategoryDonutChart
                data={catSummaries}
                currency={settings.currency}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Recent Transactions
            </CardTitle>
            <a
              href="/transactions"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded"
            >
              View all
            </a>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <TransactionList
            transactions={recentTransactions}
            loading={loading}
            currency={settings.currency}
            onEdit={setEditTxn}
            onDelete={remove}
          />
        </CardContent>
      </Card>

      {editTxn && (
        <AddTransactionDialog
          onAdd={add}
          editTransaction={editTxn}
          onEdit={handleEdit}
          onEditClose={() => setEditTxn(null)}
        />
      )}
    </div>
  );
}
