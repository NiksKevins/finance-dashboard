"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { MonthlySummary, Currency } from "@/types";
import { formatCurrency } from "@/lib/data";

interface MonthlyBarChartProps {
  data: MonthlySummary[];
  currency?: Currency;
}

function CustomTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  currency: Currency;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs space-y-1.5">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-medium text-foreground ml-auto pl-4">
            {formatCurrency(p.value, currency)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyBarChart({ data, currency = "USD" }: MonthlyBarChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(`${d.month}-01`), "MMM"),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={formatted} barGap={4} barCategoryGap="30%">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
          }
          width={36}
        />
        <Tooltip
          content={<CustomTooltip currency={currency} />}
          cursor={{ fill: "hsl(var(--muted)/0.5)", radius: 6 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}
        />
        <Bar
          dataKey="income"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
        <Bar
          dataKey="expenses"
          fill="#f43f5e"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
