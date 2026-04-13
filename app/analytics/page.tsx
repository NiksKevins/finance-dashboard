"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { CategoryDonutChart } from "@/components/charts/CategoryDonutChart";
import { DailyLineChart } from "@/components/charts/DailyLineChart";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useTransactions } from "@/hooks/useTransactions";
import { useSettings } from "@/hooks/useSettings";
import {
  getMonthlySummaries,
  getCategorySummaries,
  getDailySpending,
  getAverageDailySpending,
  getMonthKey,
} from "@/lib/analytics";
import { formatCurrency } from "@/lib/data";

export default function AnalyticsPage() {
  const { transactions } = useTransactions();
  const { settings } = useSettings();
  const currentMonthKey = getMonthKey(new Date());

  const monthOptions = useMemo(() => {
    const opts = [];
    const base = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
      opts.push({
        value: getMonthKey(d),
        label: format(d, "MMMM yyyy"),
      });
    }
    return opts;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);

  const monthlySummaries = useMemo(
    () => getMonthlySummaries(transactions, 6),
    [transactions]
  );
  const catSummaries = useMemo(
    () => getCategorySummaries(transactions, selectedMonth),
    [transactions, selectedMonth]
  );
  const dailySpending = useMemo(
    () => getDailySpending(transactions, selectedMonth),
    [transactions, selectedMonth]
  );
  const avgDaily = useMemo(
    () => getAverageDailySpending(transactions, selectedMonth),
    [transactions, selectedMonth]
  );

  const monthSummary = useMemo(() => {
    return (
      monthlySummaries.find((m) => m.month === selectedMonth) ?? {
        month: selectedMonth,
        income: 0,
        expenses: 0,
        balance: 0,
      }
    );
  }, [monthlySummaries, selectedMonth]);

  return (
    <div className="p-5 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Insights into your spending patterns
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={(v) => v && setSelectedMonth(v)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Monthly summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Income",
            value: formatCurrency(monthSummary.income, settings.currency),
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Total Expenses",
            value: formatCurrency(monthSummary.expenses, settings.currency),
            color: "text-red-600 dark:text-red-400",
          },
          {
            label: "Net Balance",
            value: formatCurrency(monthSummary.balance, settings.currency),
            color:
              monthSummary.balance >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400",
          },
          {
            label: "Avg Daily Spend",
            value: formatCurrency(avgDaily, settings.currency),
            color: "text-indigo-600 dark:text-indigo-400",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                {stat.label}
              </p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold">
              6-Month Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <MonthlyBarChart
              data={monthlySummaries}
              currency={settings.currency}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold">
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CategoryDonutChart
              data={catSummaries}
              currency={settings.currency}
            />
          </CardContent>
        </Card>
      </div>

      {/* Daily spending */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold">
            Daily Spending —{" "}
            {format(parseISO(`${selectedMonth}-01`), "MMMM yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <DailyLineChart data={dailySpending} currency={settings.currency} />
        </CardContent>
      </Card>

      {/* Category details */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold">
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {catSummaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No expense data for this month
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {catSummaries.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <CategoryBadge category={item.category} />
                    <div className="text-right">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(item.total, settings.currency)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
